package njgis.opengms.portal.service;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.mongodb.BasicDBObject;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoCursor;
import com.mongodb.client.model.Filters;
import njgis.opengms.portal.bean.JsonResult;
import njgis.opengms.portal.dao.*;
import njgis.opengms.portal.dto.ComputableModel.ComputableModelFindDTO;
import njgis.opengms.portal.dto.ComputableModel.ComputableModelResultDTO;
import njgis.opengms.portal.dto.modelItem.ModelItemFindDTO;
import njgis.opengms.portal.entity.*;
import njgis.opengms.portal.entity.intergrate.Model;
import njgis.opengms.portal.entity.intergrate.ModelParam;
import njgis.opengms.portal.entity.support.AuthorInfo;
import njgis.opengms.portal.entity.support.ModelItemRelate;
import njgis.opengms.portal.entity.support.ModelService;
import njgis.opengms.portal.enums.ResultEnum;
import njgis.opengms.portal.exception.MyException;
import njgis.opengms.portal.utils.*;
import org.apache.commons.io.FileUtils;
import org.apache.http.entity.ContentType;
import org.bson.Document;
import org.dom4j.DocumentException;
import org.dom4j.Element;
import org.dom4j.io.SAXReader;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.stereotype.Service;
import org.springframework.util.DigestUtils;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;
import sun.misc.IOUtils;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.regex.Pattern;

import static njgis.opengms.portal.utils.Utils.convertMdl;
import static njgis.opengms.portal.utils.Utils.saveFiles;

/**
 * @ClassName ModelItemService
 * @Description todo
 * @Author Kai
 * @Date 2019/2/21
 * @Version 1.0.0
 * TODO
 */

@Service
public class ComputableModelService {
    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    @Autowired
    ItemService itemService;

    @Autowired
    ComputableModelDao computableModelDao;

    @Autowired
    ComputableModelVersionDao computableModelVersionDao;

    @Autowired
    ModelItemDao modelItemDao;

    @Autowired
    DataItemDao dataItemDao;

    @Autowired
    UserDao userDao;

    @Autowired
    ClassificationService classificationService;

    @Autowired
    UserService userService;

    ModelDao modelDao = new ModelDao();

    @Value("${resourcePath}")
    private String resourcePath;

    @Value("${htmlLoadPath}")
    private String htmlLoadPath;

    @Value(value = "Public,Discoverable")
    private List<String> itemStatusVisible;

    public List<ComputableModelResultDTO> findAllByMd5(String md5){
        List<ComputableModelResultDTO> computableModelList = computableModelDao.findAllByMd5(md5);
        for(int i=0;i<computableModelList.size();i++){
            User user = userService.findUserByUserName(computableModelList.get(i).getAuthor());
            computableModelList.get(i).setAuthor_name(user.getName());
        }

        return computableModelList;
    }

    /**
     * 张硕
     * 2019.12.04
     * 模型集成相关方法 "integratingList" "integrating" "getComputableModelsBySearchTerms"
     */
    public Page<ComputableModel> integratingList(int page, String sortType, int sortAsc){

        Sort sort = new Sort(sortAsc == 1 ? Sort.Direction.ASC : Sort.Direction.DESC, "createTime");

        Pageable pageable = PageRequest.of(page, 8, sort);

        Page<ComputableModel> comModelList = computableModelDao.findByContentType("Package",pageable);

        for(int i = 0; i<comModelList.getContent().size(); i++){
            String mdl = comModelList.getContent().get(i).getMdl();
            if(mdl == null) continue;
            comModelList.getContent().get(i).setMdlJson(convertMdl(mdl));
        }

        return comModelList;
    }

    public ModelAndView integrate(Page<ComputableModel> computableModelList){
        ModelAndView mv = new ModelAndView();
        mv.setViewName("integratedModeling");

//        List<ComputableModel> allComputableModel = computableModelDao.findByContentType("Package");
//        for(int i = 0; i<allComputableModel.size(); i++){
//            String mdl = allComputableModel.get(i).getMdl();
//            allComputableModel.get(i).setMdlJson(convertMdl(mdl));
//        }

        mv.addObject("computableModelList", computableModelList);
//        mv.addObject("allComputableModel", allComputableModel);
        return mv;
    }

    public ModelAndView getIntegratedTask(Page<ComputableModel> computableModelList, String xml,List<ModelParam> modelParams,List<Model> models){
        ModelAndView mv = new ModelAndView();
        mv.setViewName("integratedModeling");
        mv.addObject("computableModelList", computableModelList);
        mv.addObject("graphXml", xml);
        mv.addObject("modelParams", modelParams);
        mv.addObject("models", models);

        return mv;
    }

    public List<ComputableModel> getComputableModelsBySearchTerms(String searchTerms){
        List<ComputableModel> searchTermsComputableModel = computableModelDao.findByNameContainsIgnoreCaseAndContentType(searchTerms,"Package");
        for(int i = 0; i<searchTermsComputableModel.size(); i++){
            String mdl = searchTermsComputableModel.get(i).getMdl();
            searchTermsComputableModel.get(i).setMdlJson(convertMdl(mdl));
        }
        return searchTermsComputableModel;
    }

    public List<String> oids = new ArrayList<>();
    public List<ComputableModel> computableModelList(String oid) {
        List<ComputableModel> list = new ArrayList<>();
        Classification cla =classificationService.getByOid(oid);
        oids.clear();
        GetOids(cla);
        for (int k = 0; k < oids.size(); k++) {
            oid = oids.get(k);
            List<ModelItem> modelItemList = modelItemDao.findAllByClassificationsContains(oid);
            for (int i = 0; i < modelItemList.size(); i++) {
                ModelItem item = modelItemList.get(i);
                if (item.getRelate().getComputableModels().size()>0){
                    for (int j = 0; j < item.getRelate().getComputableModels().size(); j++) {
                        ComputableModel computableModel = computableModelDao.findFirstByOid(item.getRelate().getComputableModels().get(j));

                        if (computableModel != null){
                            String mdl = computableModel.getMdl();
                            if(mdl == null) continue;
                            computableModel.setMdlJson(convertMdl(mdl));

                            list.add(computableModel);
                        }
                    }
                }
            }
        }
        return list;
    }

    public void GetOids(Classification cla){
        if (cla.getChildrenId().size() > 0){
            for (int i = 0; i < cla.getChildrenId().size(); i++) {
                String ooid = cla.getChildrenId().get(i);
                Classification cla2 = classificationService.getByOid(ooid);
                GetOids(cla2);
            }
        }
        else{
            oids.add(cla.getOid());
        }
    }


    public List<ComputableModel> searchModelsByKey(String key) {
        List<ComputableModel> list = computableModelDao.findAllByNameContainsIgnoreCase(key);
        for (int i = 0; i < list.size(); i++) {
            ComputableModel computableModel = list.get(i);

            String mdl = computableModel.getMdl();
            if(mdl == null) {
                list.remove(i);
                continue;
            }
            computableModel.setMdlJson(convertMdl(mdl));
        }
        return  list;
    }

    public ComputableModel getModelByOid(String oid) {
        ComputableModel computableModel = computableModelDao.findFirstByOid(oid);
        String mdl = computableModel.getMdl();
        computableModel.setMdlJson(convertMdl(mdl));

        return  computableModel;
    }

    public JSONObject listPage(ModelItemFindDTO modelItemFindDTO, List<String> classes) {
        JSONObject obj = new JSONObject();
        //TODO Sort是可以设置排序字段的
        int page = modelItemFindDTO.getPage();
        int pageSize = modelItemFindDTO.getPageSize();
        String searchText = modelItemFindDTO.getSearchText();
        //List<String> classifications=modelItemFindDTO.getClassifications();
        //默认以viewCount排序
        Sort sort = new Sort(modelItemFindDTO.getAsc() ? Sort.Direction.ASC : Sort.Direction.DESC, "viewCount");
        Pageable pageable = PageRequest.of(page, pageSize, sort);

        Page<ComputableModel> computableModelPage;

        String statusNotLike = "Private";
        if (searchText.equals("") && classes.get(0).equals("all")) {
            computableModelPage = computableModelDao.findByStatusNotLike(statusNotLike,pageable);
        } else if (!searchText.equals("") && classes.get(0).equals("all")) {
            computableModelPage = computableModelDao.findByNameContainsIgnoreCaseAndStatusNotLike(searchText,statusNotLike, pageable);
        } else if (searchText.equals("") && !classes.get(0).equals("all")) {
            computableModelPage = computableModelDao.findByClassificationsInAndStatusNotLike(classes,statusNotLike, pageable);
        } else {
            computableModelPage = computableModelDao.findByNameContainsIgnoreCaseAndClassificationsInAndStatusNotLike(searchText, classes, statusNotLike, pageable);
        }


        obj.put("list", computableModelPage.getContent());
        obj.put("total", computableModelPage.getTotalElements());
        obj.put("pages", computableModelPage.getTotalPages());

        return obj;
    }
    /**/



    public ModelAndView getPage(String id) {
        //条目信息
        try {

            ComputableModel modelInfo = getByOid(id);
            modelInfo=(ComputableModel)itemService.recordViewCount(modelInfo);
            computableModelDao.save(modelInfo);
            //类
            JSONArray classResult = new JSONArray();

//            List<String> classifications = modelInfo.getClassifications();
//            if (classifications != null) {
//                for (int i = 0; i < classifications.size(); i++) {
//
//                    JSONArray array = new JSONArray();
//                    String classId = classifications.get(i);
//
//                    do {
//                        Classification classification = classificationService.getByOid(classId);
//                        array.add(classification.getNameEn());
//                        classId = classification.getParentId();
//                    } while (classId != null);
//
//                    JSONArray array1 = new JSONArray();
//                    for (int j = array.size() - 1; j >= 0; j--) {
//                        array1.add(array.getString(j));
//                    }
//                    classResult.add(array1);
//                }
//            }

            //时间
            Date date = modelInfo.getCreateTime();
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(date);
            SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");
            String dateResult = simpleDateFormat.format(date);

            //用户信息
            JSONObject userJson = userService.getItemUserInfo(modelInfo.getAuthor());
            //资源信息
            JSONArray resourceArray = new JSONArray();
            List<String> resources = modelInfo.getResources();

            if (resources != null) {
                for (int i = 0; i < resources.size(); i++) {

                    String path = resources.get(i);

                    String[] arr = path.split("\\.");
                    String suffix = arr[arr.length - 1];

                    arr = path.split("/");
                    String name = arr[arr.length - 1].substring(14);

                    JSONObject jsonObject = new JSONObject();
                    jsonObject.put("name", name);
                    jsonObject.put("suffix", suffix);
                    jsonObject.put("path", resources.get(i));
                    resourceArray.add(jsonObject);

                }

            }

            String lastModifyTime = simpleDateFormat.format(modelInfo.getLastModifyTime());

            //修改者信息
            String lastModifier = modelInfo.getLastModifier();
            JSONObject modifierJson = null;
            if (lastModifier != null) {
                modifierJson = userService.getItemUserInfo(lastModifier);
            }

            //authorship
            String authorshipString="";
            List<AuthorInfo> authorshipList=modelInfo.getAuthorship();
            if(authorshipList!=null){
                for (AuthorInfo author:authorshipList
                ) {
                    if(authorshipString.equals("")){
                        authorshipString+=author.getName();
                    }
                    else{
                        authorshipString+=", "+author.getName();
                    }

                }
            }

            //modelItem
            ModelItem modelItem = modelItemDao.findFirstByOid(modelInfo.getRelateModelItem());
            JSONObject modelItemInfo = new JSONObject();
            modelItemInfo.put("oid",modelItem.getOid());
            modelItemInfo.put("name",modelItem.getName());
            modelItemInfo.put("description", modelItem.getDescription());
            modelItemInfo.put("img",modelItem.getImage().equals("") ? null : htmlLoadPath + modelItem.getImage());
            modelItemInfo.put("contentType", modelInfo.getContentType());


            ModelAndView modelAndView = new ModelAndView();

            modelAndView.setViewName("computable_model");

            modelAndView.addObject("modelInfo", modelInfo);
//            modelAndView.addObject("classifications", classResult);
            modelAndView.addObject("date", dateResult);
            modelAndView.addObject("year", calendar.get(Calendar.YEAR));
            modelAndView.addObject("user", userJson);
            modelAndView.addObject("authorship", authorshipString);
            modelAndView.addObject("resources", resourceArray);
            if(modelInfo.getMdl()!=null) {
                modelAndView.addObject("mdlJson", Utils.convertMdl(modelInfo.getMdl()).getJSONObject("mdl"));
            }
            JSONObject mdlJson = (JSONObject) JSONObject.toJSON(modelInfo.getMdlJson());
            if (mdlJson != null) {
                JSONObject modelClass = (JSONObject) mdlJson.getJSONArray("ModelClass").get(0);
                JSONObject behavior = (JSONObject) modelClass.getJSONArray("Behavior").get(0);
                modelAndView.addObject("behavior", behavior);
            }
            modelAndView.addObject("loadPath", htmlLoadPath);
            modelAndView.addObject("lastModifier", modifierJson);
            modelAndView.addObject("lastModifyTime", lastModifyTime);
            modelAndView.addObject("relateModelItem", modelItemInfo);


            return modelAndView;



        } catch (Exception e) {
            e.printStackTrace();
            System.out.println(e.getMessage());
            throw new MyException(e.getMessage());
        }

    }

    public ComputableModel getByOid(String id) {
        try {
            return computableModelDao.findFirstByOid(id);
        } catch (Exception e) {
            System.out.println("有人乱查数据库！！该ID不存在Model Item对象");
            throw new MyException(ResultEnum.NO_OBJECT);
        }
    }

    public boolean checkDeployed(String md5){
        String url ="http://" + managerServer + "/GeoModeling/taskNode/getServiceTask/" + md5;

        RestTemplate restTemplate = new RestTemplate();
        JSONObject result = restTemplate.getForObject(url,JSONObject.class);
        if(result.getIntValue("code")==-1){
            return false;
        }
        if(result.getJSONObject("data")!=null){
            return true;
        }else {
            return false;
        }

    }

    public JsonResult addService(ModelService modelService){

        JSONObject userObj = userService.validPassword(modelService.getUserName(),modelService.getPassword(),null);
        if(userObj==null){
            return ResultUtils.error(-1,"userName or password is wrong!");
        }

        ComputableModel computableModel = new ComputableModel();
        BeanUtils.copyProperties(modelService,computableModel);
        computableModel.setOid(UUID.randomUUID().toString());
        computableModel.setContentType("Service");
        computableModel.setDeploy(true);
        Date date = new Date();
        computableModel.setCreateTime(date);
        computableModel.setLastModifyTime(date);
        computableModel.setAuthor(userObj.getString("uid"));
        computableModel.setMdlJson(Utils.convertMdl(modelService.getMdl()));
        computableModelDao.insert(computableModel);

        return ResultUtils.success();

    }

    public JSONObject getRelatedDataByPage(ComputableModelFindDTO computableModelFindDTO,String oid){
        ComputableModel computableModel = computableModelDao.findFirstByOid(oid);
        JSONObject jsonObject = new JSONObject();
        if(computableModel.getRelateModelItem()!=null) {
            ModelItem modelItem=modelItemDao.findFirstByOid(computableModel.getRelateModelItem());
            try{
                List<String> relatedDataItem = modelItem.getRelatedData();
                if(relatedDataItem!=null) {
                    int page = computableModelFindDTO.getPage();
                    int pageSize = computableModelFindDTO.getPageSize();

                    JSONArray jsonArray = new JSONArray();
                    for (int i = page * pageSize; i < relatedDataItem.size(); i++) {
                        DataItem dataItem = dataItemDao.findFirstById(relatedDataItem.get(i));

                        JSONObject obj = new JSONObject();
                        obj.put("name", dataItem.getName());
                        obj.put("id", dataItem.getId());
                        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");
                        obj.put("createTime", simpleDateFormat.format(dataItem.getCreateTime()));
                        obj.put("description", dataItem.getDescription());
                        obj.put("contentType", dataItem.getContentType());
                        obj.put("url", dataItem.getReference());
                        obj.put("dataList", dataItem.getDataList());
                        JSONObject author = new JSONObject();
                        User user = userDao.findFirstByOid(dataItem.getAuthor());
                        author.put("name", user.getName());
                        author.put("oid", user.getOid());
                        obj.put("author", author);

                        jsonArray.add(obj);
                        if (jsonArray.size() == pageSize)
                            break;
                    }
                    jsonObject.put("list", jsonArray);
                    jsonObject.put("total", relatedDataItem.size());
                }
            }catch (Exception e){

            }

        }
        return jsonObject;
    }

    public int doPostIntoDataContainer(String url, String savefileName) throws IOException {
        JSONObject jsonObject = new JSONObject();

        RestTemplate restTemplate = new RestTemplate();
        File file = new File(savefileName);
        FileInputStream fileInputStream=new FileInputStream(file);
        MultipartFile multipartFile = new MockMultipartFile(file.getName(), file.getName(),
                ContentType.APPLICATION_OCTET_STREAM.toString(), fileInputStream);
        MultiValueMap<String, Object> part = new LinkedMultiValueMap<>();
        part.add("ms_limited", 0);//模型服务是否公开，0为public
        part.add("file_model", multipartFile.getResource());//对应的部署包
        JSONObject result = restTemplate.postForObject(url, part, JSONObject.class);

        if(result.getIntValue("code")==-1){

            return -1;
        }else{
            String deployStatus = result.getString("result");
            if(deployStatus.equals("suc")){
                return 1;
            }else {
                return 0;
            }

        }

    }

    public JSONObject doPostWithDeployPackage(String url, String savefileName, String fileName, String param) {

        try {
            // 换行符
            final String newLine = "\r\n";
            final String boundaryPrefix = "--";
            // 定义数据分隔线
            String BOUNDARY = "========7d4a6d158c9";
            // 服务器的域名
            URL realurl = new URL(url);
            // 发送POST请求必须设置如下两行
            HttpURLConnection connection = (HttpURLConnection) realurl.openConnection();
            connection.setDoOutput(true);
            connection.setDoInput(true);
            connection.setUseCaches(false);
            connection.setRequestMethod("POST");
            connection.setRequestProperty("Connection", "Keep-Alive");
            connection.setRequestProperty("Charset", "UTF-8");
            connection.setRequestProperty("Content-Type", "multipart/form-data; boundary=" + BOUNDARY);
            // 头
            String boundary = BOUNDARY;
            // 传输内容
            StringBuffer contentBody = new StringBuffer("--" + BOUNDARY);
            // 尾
            String endBoundary = "\r\n--" + boundary + "--\r\n";

            OutputStream out = new DataOutputStream(connection.getOutputStream());

            // 1. 处理普通表单域(即形如key = value对)的POST请求（这里也可以循环处理多个字段，或直接给json）
            //这里看过其他的资料，都没有尝试成功是因为下面多给了个Content-Type
            //form-data  这个是form上传 可以模拟任何类型
            contentBody.append("\r\n")
                    .append("Content-Disposition: form-data; name=\"")
                    .append("ms_limited" + "\"")
                    .append("\r\n")
                    .append("\r\n")
                    .append(Integer.parseInt(param))
                    .append("\r\n")
                    .append("--")
                    .append(boundary);
            String boundaryMessage1 = contentBody.toString();
            System.out.println(boundaryMessage1);
            out.write(boundaryMessage1.getBytes("utf-8"));

            // 2. 处理file文件的POST请求（多个file可以循环处理）
            contentBody = new StringBuffer();
            contentBody.append("\r\n")
                    .append("Content-Disposition:form-data; name=\"")
                    .append("file_model" + "\"; ")   // form中field的名称
                    .append("filename=\"")
                    .append(fileName + "\"")   //上传文件的文件名，包括目录
                    .append("\r\n")
                    .append("Content-Type:multipart/form-data")
                    .append("\r\n\r\n");
            String boundaryMessage2 = contentBody.toString();
            System.out.println(boundaryMessage2);
            out.write(boundaryMessage2.getBytes("utf-8"));

            // 开始真正向服务器写文件
            File file = new File(savefileName);
            DataInputStream dis = new DataInputStream(new FileInputStream(file));
            int bytes = 0;
            byte[] bufferOut = new byte[(int) file.length()];
            bytes = dis.read(bufferOut);
            out.write(bufferOut, 0, bytes);
            dis.close();
            byte[] endData = ("\r\n--" + BOUNDARY + "--\r\n").getBytes();
            out.write(endData);
            out.flush();
            out.close();

            // 4. 从服务器获得回答的内容
            String strLine = "";
            String strResponse = "";
            InputStream in = connection.getInputStream();
            BufferedReader reader = new BufferedReader(new InputStreamReader(in));
            while ((strLine = reader.readLine()) != null) {
                strResponse += strLine + "\n";
            }
            System.out.print(strResponse);
            return JSONObject.parseObject(strResponse);
        } catch (Exception e) {
            System.out.println("发送POST请求出现异常！" + e);
            e.printStackTrace();
        }
        return null;
    }

    @Value("${managerServerIpAndPort}")
    private String managerServer;

    public String deploy(String id,String modelServer) throws IOException {
        String deployUrl = null;
        ComputableModel computableModel = computableModelDao.findFirstByOid(id);
        //String saveFilePath = ConceptualModelService.class.getClassLoader().getResource("").getPath() + "static/upload/computableModel/Package" + computableModel.getResources().get(0);
        String saveFilePath = resourcePath + "/computableModel/Package" + computableModel.getResources().get(0);
        String[] paths = computableModel.getResources().get(0).split("/");
        String fileName = paths[paths.length - 1];

        if(!modelServer.equals("")){
            String deployUrlDir = "http://" + modelServer + "/modelser";

            int result = doPostIntoDataContainer(deployUrlDir,saveFilePath);
            if(result==1){
                return "suc";
            }
        }else{
            //获取可以将部署包进行部署的任务服务器信息
            JSONObject result = new JSONObject();
            String urlStr = "http://" + managerServer + "/GeoModeling/taskNode/getTaskForMicroService";
            JSONObject serviceTaskResult = Utils.connentURL(Utils.Method.GET, urlStr);
            if (serviceTaskResult != null && serviceTaskResult.getInteger("code") == 1) {
                deployUrl = "http://" + serviceTaskResult.getJSONObject("data").getString("host") + ":" + serviceTaskResult.getJSONObject("data").getString("port") + "/server/modelser/deploy";
            }
        }
        if (deployUrl != null) {
            JSONObject deployResult = doPostWithDeployPackage(deployUrl, saveFilePath, fileName, "0");
            if (deployResult != null && deployResult.getInteger("code") == 1) {
                //更新计算模型信息
                JSONObject data = deployResult.getJSONObject("data");
                String modelserUrl = "http://" + data.getString("host") + ":" + data.getString("port") + "/modelser/" + data.getString("msid");
                computableModel.setModelserUrl(modelserUrl);
                computableModel.setDeploy(true);
                computableModel.setLastModifyTime(new Date());
                computableModelDao.save(computableModel);
                return "suc";
            }
        }

        return null;
    }

    public JSONObject insert(List<MultipartFile> files, JSONObject jsonObject, String uid) {

        JSONObject result = new JSONObject();
        ComputableModel computableModel = new ComputableModel();

        String path = resourcePath + "/computableModel/" + jsonObject.getString("contentType");

        List<String> resources = new ArrayList<>();
        saveFiles(files, path, uid, "",resources);
        if (resources == null) {
            result.put("code", -1);
        } else {
            try {
                computableModel.setResources(resources);
                computableModel.setOid(UUID.randomUUID().toString());
                computableModel.setStatus(jsonObject.getString("status"));
                computableModel.setName(jsonObject.getString("name"));
                computableModel.setDetail(jsonObject.getString("detail"));
                computableModel.setRelateModelItem(jsonObject.getString("relateModelItem"));
                computableModel.setDescription(jsonObject.getString("description"));
                computableModel.setContentType(jsonObject.getString("contentType"));
                computableModel.setUrl(jsonObject.getString("url"));

                ModelItem relateModelItem = modelItemDao.findFirstByOid(jsonObject.getString("relateModelItem"));
                computableModel.setClassifications(relateModelItem.getClassifications2());

                String md5 = null;
                if (jsonObject.getString("contentType").equals("Package")) {
                    String filePath = path + resources.get(0);
                    File file = new File(filePath);

                    md5 = Utils.getMd5ByFile(file);

                    String mdlPath = null;
                    String testDataDirectoryPath = null;
                    String destDirPath = path + "/unZip/" + computableModel.getOid();
                    ZipUtils.unZip(new File(filePath), destDirPath);
                    File unZipDir = new File(destDirPath);
                    if (unZipDir.exists()) {
                        LinkedList<File> list = new LinkedList<File>();
                        File[] dirFiles = unZipDir.listFiles();
                        for (File file2 : dirFiles) {
                            if (file2.isDirectory()) {
                                //我为了节省时间就直接复用许凯的代码了
                                if (file2.getName().equals("testify")) {
                                    testDataDirectoryPath = file2.getAbsolutePath();
                                } else if (file2.getName().equals("model")) {
                                    list.add(file2);
                                }
                            } else {
                                String name = file2.getName();
                                if (name.substring(name.length() - 3, name.length()).equals("mdl")) {
                                    mdlPath = file2.getAbsolutePath();
                                    break;
                                }
                                System.out.println("文件:" + file2.getAbsolutePath());
                            }
                        }
                        File temp_file;
                        while (!list.isEmpty()) {
                            temp_file = list.removeFirst();
                            dirFiles = temp_file.listFiles();
                            for (File file2 : dirFiles) {
                                if (file2.isDirectory()) {
                                    continue;
                                } else {
                                    String name = file2.getName();
                                    if (name.substring(name.length() - 3, name.length()).equals("mdl")) {
                                        mdlPath = file2.getAbsolutePath();
                                        break;
                                    }
                                    System.out.println("文件:" + file2.getAbsolutePath());
                                }
                            }
                        }
                    } else {
                        System.out.println("文件不存在!");
                    }

                    //获取测试数据，并进行存储
                    if (testDataDirectoryPath != null) {
                        String testData = generateTestData(testDataDirectoryPath, computableModel.getOid());
                        computableModel.setTestDataPath(testData);
                    } else {
                        computableModel.setTestDataPath("");
                    }

                    String content = "";
                    if (mdlPath != null) {
                        try {
                            BufferedReader in = new BufferedReader(new FileReader(mdlPath));
                            String str = in.readLine();
                            if (str.indexOf("ModelClass") != -1) {
                                content += str;
                            }
                            while ((str = in.readLine()) != null) {
                                content += str;
                            }
                            in.close();
                            System.out.println(content);
                        } catch (IOException e) {
                            System.out.println(e);
                        }

                        computableModel.setMdl(content);
                        JSONObject mdlJson = XmlTool.documentToJSONObject(content);
//
//                        JSONArray HCinsert=modelClass.getJSONArray("Runtime").getJSONObject(0).getJSONArray("HardwareConfigures").getJSONObject(0).getJSONArray("INSERT");
//                        if(HCinsert!=null){
//
//                            JSONArray HCadd= new JSONArray();
//
//                            for(int j=0;j<HCinsert.size();j++){
//                                JSONObject obj=HCinsert.getJSONObject(j);
//                                if (obj.getJSONObject("key")!=null&&obj.getJSONObject("name")!=null){
//                                    HCadd.add(obj);
//                                }
//                            }
//
//                            runtime.getJSONArray("HardwareConfigures").getJSONObject(0).put("Add",HCadd);
//                        }
//
//                        JSONArray SCinsert=modelClass.getJSONArray("Runtime").getJSONObject(0).getJSONArray("SoftwareConfigures").getJSONObject(0).getJSONArray("INSERT");
//                        if(SCinsert!=null){
//
//                            JSONArray SCadd= new JSONArray();
//
//                            for(int j=0;j<HCinsert.size();j++){
//                                JSONObject obj=HCinsert.getJSONObject(j);
//                                if (obj.getJSONObject("key")!=null&&obj.getJSONObject("name")!=null){
//                                    SCadd.add(obj);
//                                }
//                            }
//
//                            runtime.getJSONArray("SoftwareConfigures").getJSONObject(0).put("Add",SCadd);
//                        }
//
//                        modelClass.getJSONArray("Runtime").remove(0);
//                        modelClass.getJSONArray("Runtime").add(runtime);
                        JSONObject modelClass = checkMdlJson(mdlJson);
                        mdlJson.getJSONArray("ModelClass").remove(0);
                        mdlJson.getJSONArray("ModelClass").add(modelClass);
                        //End
                        computableModel.setMdlJson(mdlJson);
                    } else {
                        System.out.println("mdl文件未找到!");
                    }

                    Utils.deleteDirectory(destDirPath);
                }
                else if(jsonObject.getString("contentType").toLowerCase().equals("md5")){
                    String mdl = jsonObject.getString("mdl");
                    computableModel.setMdl(jsonObject.getString("mdl"));
                    md5 = jsonObject.getString("md5");

                    JSONObject mdlJson = XmlTool.documentToJSONObject(mdl);
                    JSONObject modelClass = checkMdlJson(mdlJson);
                    if(mdlJson.containsKey("ModelClass")){
                        mdlJson.getJSONArray("ModelClass").remove(0);
                        mdlJson.getJSONArray("ModelClass").add(modelClass);
                    }
                    //End
                    computableModel.setMdlJson(mdlJson);
                    computableModel.setDeploy(true);
                }

                computableModel.setMd5(md5);

                JSONArray jsonArray = jsonObject.getJSONArray("authorship");
                List<AuthorInfo> authorship = new ArrayList<>();
                for (int i = 0; i < jsonArray.size(); i++) {
                    JSONObject author = jsonArray.getJSONObject(i);
                    AuthorInfo authorInfo = new AuthorInfo();
                    authorInfo.setName(author.getString("name"));
                    authorInfo.setEmail(author.getString("email"));
                    authorInfo.setIns(author.getString("ins"));
                    authorInfo.setHomepage(author.getString("homepage"));
                    authorship.add(authorInfo);
                }
                computableModel.setAuthorship(authorship);

                computableModel.setAuthor(uid);

//                boolean isAuthor = jsonObject.getBoolean("isAuthor");
                computableModel.setIsAuthor(true);
//                if (isAuthor) {
//                    computableModel.setRealAuthor(null);
//                } else {
//                    AuthorInfo authorInfo = new AuthorInfo();
//                    authorInfo.setName(jsonObject.getJSONObject("author").getString("name"));
//                    authorInfo.setIns(jsonObject.getJSONObject("author").getString("ins"));
//                    authorInfo.setEmail(jsonObject.getJSONObject("author").getString("email"));
//                    computableModel.setRealAuthor(authorInfo);
//                }


                Date now = new Date();
                computableModel.setCreateTime(now);
                computableModel.setLastModifyTime(now);
                computableModelDao.insert(computableModel);

                ModelItem modelItem = modelItemDao.findFirstByOid(computableModel.getRelateModelItem());
                ModelItemRelate modelItemRelate = modelItem.getRelate();
                modelItemRelate.getComputableModels().add(computableModel.getOid());
                modelItem.setRelate(modelItemRelate);
                modelItemDao.save(modelItem);

                result.put("code", 1);
                result.put("id", computableModel.getOid());
            } catch (Exception e) {
                logger.error("计算模型创建错误",e);
                result.put("code", -2);
            }
        }
        return result;
    }

    public JSONObject update(List<MultipartFile> files, JSONObject jsonObject, String uid) {
        JSONObject result = new JSONObject();
        ComputableModel computableModel_ori = computableModelDao.findFirstByOid(jsonObject.getString("oid"));
        String author0 = computableModel_ori.getAuthor();
        ComputableModel computableModel = new ComputableModel();
        BeanUtils.copyProperties(computableModel_ori, computableModel);
        String contentType = jsonObject.getString("contentType");

        if (!computableModel_ori.isLock()) {
            String path = resourcePath + "/computableModel/" + jsonObject.getString("contentType");
            //如果上传新文件
            if (files.size() > 0) {
                List<String> resources =new ArrayList<>();
                saveFiles(files, path, uid, "",resources);
                if (resources == null) {
                    result.put("code", -1);
                    return result;
                }
                computableModel.setResources(resources);
                computableModel.setMdlJson(null);
                try {
                    String md5 = null;
                    if (jsonObject.getString("contentType").equals("Package")) {
                        String filePath = path + resources.get(0);
                        FileInputStream file = new FileInputStream(filePath);
                        md5 = DigestUtils.md5DigestAsHex(IOUtils.readFully(file, -1, true));

                        String mdlPath = null;
                        String testDataDirectoryPath = null;
                        String destDirPath = path + "/unZip/" + computableModel.getOid();
                        ZipUtils.unZip(new File(filePath), destDirPath);
                        File unZipDir = new File(destDirPath);
                        if (unZipDir.exists()) {
                            LinkedList<File> list = new LinkedList<File>();
                            File[] dirFiles = unZipDir.listFiles();
                            for (File file2 : dirFiles) {
                                if (file2.isDirectory()) {
                                    //我为了节省时间就直接复用许凯的代码了
                                    if (file2.getName().equals("testify")) {
                                        testDataDirectoryPath = file2.getAbsolutePath();
                                    } else if (file2.getName().equals("model")) {
                                        list.add(file2);
                                    }
                                } else {
                                    String name = file2.getName();
                                    if (name.substring(name.length() - 3, name.length()).equals("mdl")) {
                                        mdlPath = file2.getAbsolutePath();
                                        break;
                                    }
                                    System.out.println("文件:" + file2.getAbsolutePath());
                                }
                            }
                            File temp_file;
                            while (!list.isEmpty()) {
                                temp_file = list.removeFirst();
                                dirFiles = temp_file.listFiles();
                                for (File file2 : dirFiles) {
                                    if (file2.isDirectory()) {
                                        continue;
                                    } else {
                                        String name = file2.getName();
                                        if (name.substring(name.length() - 3, name.length()).equals("mdl")) {
                                            mdlPath = file2.getAbsolutePath();
                                            break;
                                        }
                                        System.out.println("文件:" + file2.getAbsolutePath());
                                    }
                                }
                            }
                        } else {
                            System.out.println("文件不存在!");
                        }

                        //获取测试数据，并进行存储
                        if (testDataDirectoryPath != null) {
                            String testData = generateTestData(testDataDirectoryPath, computableModel.getOid());
                            computableModel.setTestDataPath(testData);
                        } else {
                            computableModel.setTestDataPath("");
                        }

                        String content = "";
                        if (mdlPath != null) {
                            try {
                                BufferedReader in = new BufferedReader(new FileReader(mdlPath));
                                String str = in.readLine();
                                if (str.indexOf("ModelClass") != -1) {
                                    content += str;
                                }
                                while ((str = in.readLine()) != null) {
                                    content += str;
                                }
                                in.close();
                                System.out.println(content);
                            } catch (IOException e) {
                                System.out.println(e);
                            }

                            computableModel.setMdl(content);
                            JSONObject mdlJson = XmlTool.documentToJSONObject(content);
                            computableModel.setMdlJson(mdlJson);
                        } else {
                            System.out.println("mdl文件未找到!");
                        }

                        Utils.deleteDirectory(destDirPath);
                    }
                    computableModel.setMd5(md5);

                    computableModel.setDeploy(false);

                } catch (Exception e) {
                    e.printStackTrace();
                    result.put("code", -2);
                }
            }else if(contentType.toLowerCase().equals("md5")){
                String mdl = jsonObject.getString("mdl");
                computableModel.setMdl(mdl);
                String md5 = jsonObject.getString("md5");
                computableModel.setMd5(md5);
                JSONObject mdlJson = XmlTool.documentToJSONObject(mdl);
                JSONObject modelClass = checkMdlJson(mdlJson);
                if(mdlJson.containsKey("ModelClass")){
                    mdlJson.getJSONArray("ModelClass").remove(0);
                    mdlJson.getJSONArray("ModelClass").add(modelClass);
                }
                //End
                computableModel.setMdlJson(mdlJson);

                computableModel.setDeploy(true);
            }

            computableModel.setName(jsonObject.getString("name"));
            computableModel.setStatus(jsonObject.getString("status"));
            computableModel.setDetail(jsonObject.getString("detail"));
            computableModel.setRelateModelItem(jsonObject.getString("relateModelItem"));
            computableModel.setDescription(jsonObject.getString("description"));
            computableModel.setContentType(jsonObject.getString("contentType"));
            computableModel.setUrl(jsonObject.getString("url"));

            ModelItem relateModelItem = modelItemDao.findFirstByOid(jsonObject.getString("relateModelItem"));
            computableModel.setClassifications(relateModelItem.getClassifications2());

            JSONArray jsonArray = jsonObject.getJSONArray("authorship");
            List<AuthorInfo> authorship = new ArrayList<>();
            for (int i = 0; i < jsonArray.size(); i++) {
                JSONObject author = jsonArray.getJSONObject(i);
                AuthorInfo authorInfo = new AuthorInfo();
                authorInfo.setName(author.getString("name"));
                authorInfo.setEmail(author.getString("email"));
                authorInfo.setIns(author.getString("ins"));
                authorInfo.setHomepage(author.getString("homepage"));
                authorship.add(authorInfo);
            }
            computableModel.setAuthorship(authorship);

            computableModel.setAuthor(uid);

//                boolean isAuthor = jsonObject.getBoolean("isAuthor");
            computableModel.setIsAuthor(true);
//                if (isAuthor) {
//                    computableModel.setRealAuthor(null);
//                } else {
//                    AuthorInfo authorInfo = new AuthorInfo();
//                    authorInfo.setName(jsonObject.getJSONObject("author").getString("name"));
//                    authorInfo.setIns(jsonObject.getJSONObject("author").getString("ins"));
//                    authorInfo.setEmail(jsonObject.getJSONObject("author").getString("email"));
//                    computableModel.setRealAuthor(authorInfo);
//                }


            Date now = new Date();
            String authorUserName = computableModel_ori.getAuthor();

            if (computableModel_ori.getAuthor().equals(uid)) {
                computableModel.setLastModifyTime(now);
                computableModelDao.save(computableModel);

                result.put("method", "update");
                result.put("code", 1);
                result.put("id", computableModel.getOid());
            } else {
                ComputableModelVersion computableModelVersion = new ComputableModelVersion();
                BeanUtils.copyProperties(computableModel, computableModelVersion, "id");
                computableModelVersion.setOid(UUID.randomUUID().toString());
                computableModelVersion.setOriginOid(computableModel_ori.getOid());
                computableModelVersion.setModifier(uid);
                computableModelVersion.setVerNumber(now.getTime());
                computableModelVersion.setVerStatus(0);
                userService.messageNumPlusPlus(authorUserName);

                computableModelVersion.setModifyTime(now);
                computableModelVersion.setCreator(author0);

                computableModelVersionDao.save(computableModelVersion);

                computableModel_ori.setLock(true);
                computableModelDao.save(computableModel_ori);

                result.put("method", "version");
                result.put("code", 0);
                result.put("oid", computableModelVersion.getOid());
            }


            return result;
        } else {
            return null;
        }
    }

    public  JSONObject checkMdlJson(JSONObject mdlJson){
        try{
            //处理mdl格式错误
            JSONObject modelClass=mdlJson.getJSONArray("ModelClass").getJSONObject(0);
            //JSONObject runtime=modelClass.getJSONArray("Runtime").getJSONObject(0);

            String type=modelClass.getString("type");
            if(type!=null){
                modelClass.put("style",type);
            }
            if(modelClass.getJSONArray("Runtime").getJSONObject(0).getJSONArray("SupportiveResources")==null){
                modelClass.getJSONArray("Runtime").getJSONObject(0).put("SupportiveResources","");
            }

            return modelClass;
        }catch (Exception e){
            return new JSONObject();
        }

    }

    private String generateTestData(String testDataDirectory, String oid) throws IOException {

        File testDataFile = new File(testDataDirectory);
        File[] tempTestDataDir = testDataFile.listFiles(new FileFilter() {
            @Override
            public boolean accept(File pathname) {
                return pathname.isDirectory();
            }
        });
        if (tempTestDataDir.length == 0) {
            return "";
        } else {
            File defaultTest = tempTestDataDir[0];
            String configPath = defaultTest.getAbsolutePath() + File.separator + "config.xml";
            File configFile = new File(configPath);
            if (configFile.exists()) {
                //读取config.xml文件信息，获取到同级目录下方是否有相对应的数据
                boolean status = judgeConfigInformation(configFile, defaultTest.getAbsolutePath());
                if (!status) {
                    return "";
                }
                //拷贝文件
                //String destPath = ComputableModelService.class.getClassLoader().getResource("").getPath() + "static/upload/computableModel/testify/" + oid;
                String destPath = resourcePath + "/computableModel/testify/" + oid;
                FileUtils.copyDirectory(defaultTest.getAbsoluteFile(), new File(destPath));
                String returnPath = oid + File.separator + "config.xml";
                return returnPath;
            } else {
                return "";
            }
        }

    }

    private boolean judgeConfigInformation(File configFile, String parentDirectory) {
        org.dom4j.Document result = null;
        SAXReader reader = new SAXReader();
        try {
            result = reader.read(configFile);
        } catch (DocumentException e) {
            e.printStackTrace();
        }
        Element rootElement = result.getRootElement();
        List<Element> items = rootElement.elements();
        if (items.size() > 0) {
            for (Element item : items) {
                String fileName = item.attributeValue("File");
                String filePath = parentDirectory + File.separator + fileName;
                File tempFile = new File(filePath);
                if (tempFile.exists()) {
                    continue;
                } else {
                    return false;
                }
            }
        } else {
            System.out.println("无测试案例数据");
            return false;
        }
        return true;
    }

    public int delete(String oid, String userName) {
        ComputableModel computableModel = computableModelDao.findFirstByOid(oid);
        if(!computableModel.getAuthor().equals(userName))
            return 2;
        if (computableModel != null) {
            //删除资源
            String path = resourcePath + "/computableModel/" + computableModel.getContentType();
            List<String> resources = computableModel.getResources();
            for (int i = 0; i < resources.size(); i++) {
                Utils.delete(path + resources.get(i));
            }

            //计算模型删除
            computableModelDao.delete(computableModel);
            userService.computableModelMinusMinus(userName);
            //模型条目关联删除
            String modelItemId = computableModel.getRelateModelItem();
            ModelItem modelItem = modelItemDao.findFirstByOid(modelItemId);
            List<String> computableIds = modelItem.getRelate().getComputableModels();
            for (String id : computableIds
            ) {
                if (id.equals(computableModel.getOid())) {
                    computableIds.remove(id);
                    break;
                }
            }
            modelItem.getRelate().setComputableModels(computableIds);
            modelItemDao.save(modelItem);

            return 1;
        } else {
            return -1;
        }
    }

    public JSONObject searchComputableModelsByUserId(String searchText, String userId, int page, String sortType, int asc) {

        Sort sort = new Sort(asc == 1 ? Sort.Direction.ASC : Sort.Direction.DESC, "createTime");

        Pageable pageable = PageRequest.of(page, 10, sort);

        Page<ComputableModel> modelItems = computableModelDao.findByNameContainsIgnoreCaseAndAuthorAndStatusNotLike(searchText, userId,"all", pageable);

        JSONObject modelItemObject = new JSONObject();
        modelItemObject.put("count", modelItems.getTotalElements());
        modelItemObject.put("computableModels", modelItems.getContent());

        return modelItemObject;

    }

    public JSONObject getComputableModelsByUserId(String userId, int page, String sortType, int asc) {

        Sort sort = new Sort(asc == 1 ? Sort.Direction.ASC : Sort.Direction.DESC, "createTime");

        Pageable pageable = PageRequest.of(page, 10, sort);

        Page<ComputableModel> computableModels = computableModelDao.findByAuthorAndStatusNotLike(userId,"Private", pageable);

        JSONObject computableModelObject = new JSONObject();
        computableModelObject.put("count", computableModels.getTotalElements());
        computableModelObject.put("computableModels", computableModels.getContent());

        return computableModelObject;

    }

    public JSONObject listByUserOid(ModelItemFindDTO modelItemFindDTO, String userId,String loadUser) {

        int page = modelItemFindDTO.getPage();
        int pageSize = modelItemFindDTO.getPageSize();
        Sort sort = new Sort(modelItemFindDTO.getAsc() ? Sort.Direction.ASC : Sort.Direction.DESC, modelItemFindDTO.getSortField());
        Pageable pageable = PageRequest.of(page, pageSize, sort);
        User user = userDao.findFirstByUserId(userId);
        Page<ComputableModel> modelItemPage = Page.empty();

//        if(loadUser == null||!loadUser.equals(oid)) {
            modelItemPage = computableModelDao.findByAuthorAndStatusIn(user.getUserName(),itemStatusVisible, pageable);
//        }else{
//            modelItemPage = computableModelDao.findByAuthor(user.getUserName(), pageable);
//        }

        JSONObject result = new JSONObject();

        result.put("list", modelItemPage.getContent());
        result.put("total", modelItemPage.getTotalElements());

        return result;
    }

    public JSONObject list(ModelItemFindDTO modelItemFindDTO, List<String> classes) {

        JSONObject obj = new JSONObject();
        //TODO Sort是可以设置排序字段的
        int page = modelItemFindDTO.getPage();
        int pageSize = modelItemFindDTO.getPageSize();
        String searchText = modelItemFindDTO.getSearchText();
        //List<String> classifications=modelItemFindDTO.getClassifications();
        //默认以viewCount排序
        Sort sort = new Sort(modelItemFindDTO.getAsc() ? Sort.Direction.ASC : Sort.Direction.DESC, modelItemFindDTO.getSortField());
        Pageable pageable = PageRequest.of(page, pageSize, sort);

        Page<ComputableModel> computableModelPage;

        String statusNotLike = "Private";
        if (searchText.equals("") && classes.get(0).equals("all")) {
            computableModelPage = computableModelDao.findByStatusNotLike(statusNotLike,pageable);
        } else if (!searchText.equals("") && classes.get(0).equals("all")) {
            computableModelPage = computableModelDao.findByNameContainsIgnoreCaseAndStatusNotLike(searchText, statusNotLike,pageable);
        } else if (searchText.equals("") && !classes.get(0).equals("all")) {
            computableModelPage = computableModelDao.findByClassificationsInAndStatusNotLike(classes,statusNotLike, pageable);
        } else {
            computableModelPage = computableModelDao.findByNameContainsIgnoreCaseAndClassificationsInAndStatusNotLike(searchText, classes,statusNotLike, pageable);

        }


        obj.put("list", computableModelPage.getContent());
        obj.put("total", computableModelPage.getTotalElements());
        obj.put("pages", computableModelPage.getTotalPages());

        return obj;
    }

    public JSONObject listByAuthor(ModelItemFindDTO modelItemFindDTO, String userName, List<String> classes) {

        JSONObject obj = new JSONObject();
        //TODO Sort是可以设置排序字段的
        int page = modelItemFindDTO.getPage();
        int pageSize = modelItemFindDTO.getPageSize();
        String searchText = modelItemFindDTO.getSearchText();
        //List<String> classifications=modelItemFindDTO.getClassifications();
        //默认以viewCount排序
        Sort sort = new Sort(modelItemFindDTO.getAsc() ? Sort.Direction.ASC : Sort.Direction.DESC, modelItemFindDTO.getSortField());
        Pageable pageable = PageRequest.of(page, pageSize, sort);

        Page<ComputableModel> computableModelPage;

        String statusNotLike = "Private";
        if (searchText.equals("") && classes.get(0).equals("all")) {
            computableModelPage = computableModelDao.findByAuthorAndStatusNotLike(userName,statusNotLike,pageable);
        } else if (!searchText.equals("") && classes.get(0).equals("all")) {
            computableModelPage = computableModelDao.findByNameContainsIgnoreCaseAndAuthorAndStatusNotLike(searchText, userName,statusNotLike, pageable);
        } else if (searchText.equals("") && !classes.get(0).equals("all")) {
            computableModelPage = computableModelDao.findByClassificationsInAndAuthorAndStatusNotLike(classes, userName,statusNotLike, pageable);
        } else {
            computableModelPage = computableModelDao.findByNameContainsIgnoreCaseAndClassificationsInAndAuthorAndStatusNotLike(searchText, classes, userName,statusNotLike, pageable);
        }


        obj.put("list", computableModelPage.getContent());
        obj.put("total", computableModelPage.getTotalElements());
        obj.put("pages", computableModelPage.getTotalPages());

        return obj;
    }

    public String query(ModelItemFindDTO modelItemFindDTO, List<String> connects, List<String> props, List<String> values, List<String> nodeID) throws ParseException {

        ModelDao modelDao = new ModelDao();

        BasicDBObject query = new BasicDBObject();

        //prop
        for (int i = 0; i < values.size(); i += 2) {
            if (values.get(i).trim().equals("") && values.get(i + 1).trim().equals("")) {

                continue;
            }
            BasicDBObject condition = new BasicDBObject();
            String field = propMapping(props.get(i / 2));
            String conn = getConn(connects.get(i));
            switch (connects.get(i)) {
                case "AND"://NOT (A AND C)===(NOT A) OR (NOT C)
                    Pattern pattern = Pattern.compile("^.*" + values.get(i).trim() + ".*$", Pattern.CASE_INSENSITIVE);
                    //BasicDBObject condition1=new BasicDBObject("$regex",values.get(i));
                    BasicDBObject obj1 = new BasicDBObject(field, pattern);
                    Pattern pattern1 = Pattern.compile("^.*" + values.get(i + 1).trim() + ".*$", Pattern.CASE_INSENSITIVE);
                    //BasicDBObject condition2=new BasicDBObject("$regex",values.get(i+1));
                    BasicDBObject obj2 = new BasicDBObject(field, pattern1);
                    condition = new BasicDBObject(conn, Arrays.asList(obj1, obj2));
                    if (i != 0 && connects.get(i - 1).equals("NOT")) {
                        obj1 = new BasicDBObject("$not", obj1);
                        obj2 = new BasicDBObject("$not", obj2);
                        condition = new BasicDBObject("$or", Arrays.asList(obj1, obj2));
                    }


                    break;
                case "OR":
                    pattern = Pattern.compile("^.*(" + values.get(i).trim() + "|" + values.get(i + 1).trim() + ").*$", Pattern.CASE_INSENSITIVE);
                    condition = new BasicDBObject(field, pattern);


                    if (i != 0 && connects.get(i - 1).equals("NOT")) {
                        pattern = Pattern.compile("^.*" + values.get(i).trim() + ".*$", Pattern.CASE_INSENSITIVE);
                        BasicDBObject condition1 = new BasicDBObject("$not", pattern);
                        obj1 = new BasicDBObject(field, pattern);
                        pattern1 = Pattern.compile("^.*" + values.get(i + 1).trim() + ".*$", Pattern.CASE_INSENSITIVE);
                        BasicDBObject condition2 = new BasicDBObject("$not", pattern1);
                        obj2 = new BasicDBObject(field, pattern1);
//                        obj1=new BasicDBObject("$not",obj1);
//                        obj2=new BasicDBObject("$not",obj2);
                        condition = new BasicDBObject("$and", Arrays.asList(obj1, obj2));
                    }

                    break;
                case "NOT":
                    pattern = Pattern.compile("^.*" + values.get(i).trim() + ".*$", Pattern.CASE_INSENSITIVE);
                    //BasicDBObject condition1=new BasicDBObject("$regex",values.get(i));
                    obj1 = new BasicDBObject(field, pattern);
                    //pattern1 = Pattern.compile("^((?!" + values.get(i + 1).trim() + ").)+$", Pattern.CASE_INSENSITIVE);
                    pattern1 = Pattern.compile("^.*" + values.get(i + 1).trim() + ".*$", Pattern.CASE_INSENSITIVE);
                    BasicDBObject condition2 = new BasicDBObject("$not", pattern1);
                    obj2 = new BasicDBObject(field, condition2);
                    //obj2=new BasicDBObject("$not",obj2);

                    if (i != 0 && connects.get(i - 1).equals("NOT")) {
                        pattern = Pattern.compile("^.*" + values.get(i + 1).trim() + ".*$", Pattern.CASE_INSENSITIVE);
                        //BasicDBObject condition1=new BasicDBObject("$regex",values.get(i));
                        obj1 = new BasicDBObject(field, pattern);
                        pattern1 = Pattern.compile("^.*" + values.get(i).trim() + ".*$", Pattern.CASE_INSENSITIVE);
                        condition2 = new BasicDBObject("$not", pattern1);
                        obj2 = new BasicDBObject(field, condition2);
                    }

                    condition = new BasicDBObject(conn, Arrays.asList(obj1, obj2));
                    break;
            }

            if (i == 0) {
                query = condition;
            } else {
                conn = getConn(connects.get(i - 1));
                query = new BasicDBObject(conn, Arrays.asList(condition, query));
            }
        }

        //parents
        BasicDBObject query_parents = new BasicDBObject();
        if (!nodeID.get(0).equals("all")) {
            for (int i = 0; i < nodeID.size(); i++) {
                BasicDBObject query1 = new BasicDBObject("classifications.", nodeID.get(i));
                if (i == 0) {
                    query_parents = query1;
                } else {
                    query_parents = new BasicDBObject("$or", Arrays.asList(query_parents, query1));
                }
            }
            query = new BasicDBObject("$and", Arrays.asList(query, query_parents));
        }

        MongoCollection<Document> Col = modelDao.GetCollection("Portal", "computableModel");
        MongoCursor<Document> cursor = modelDao.RetrieveDocsLimit(Col, query, modelDao.getSort("count", modelItemFindDTO.getAsc()), modelItemFindDTO.getPage());

        JSONObject output = new JSONObject();

        JSONArray list = new JSONArray();
        int total = 0;
        while (cursor.hasNext()) {

            JSONObject jsonObj = new JSONObject();
            Document doc = cursor.next();
            Date CreateTime = doc.getDate("createTime");
            String sDate = (new SimpleDateFormat("yyyy-MM-dd HH:mm:ss")).format(CreateTime);
            doc.put("createTime", sDate);

            list.add(JSONObject.parse(doc.toJson()));
            total++;
        }
        output.put("total", total);
        output.put("pages", Math.ceil(total));
        output.put("list", list);

        return output.toString();
    }

    public String getTaskHostAndPort(String TaskId) {
        String trueId = new String(deCode.decode(TaskId));
        String ComputerNodeId = trueId.substring(0, 36);
        JSONObject result = new JSONObject();

        MongoCollection<Document> ComputerNodeCol = modelDao.GetCollection("Portal", "computerNode");
        Document ComputerNodeDoc = ComputerNodeCol.find(Filters.eq("UID", ComputerNodeId)).first();
        if (ComputerNodeDoc != null) {
            String Host = ComputerNodeDoc.getString("Host");
            String Port = ComputerNodeDoc.getString("Port");
            result.put("host", Host);
            result.put("port", Port);
        }
        return result.toString();
    }

    //TODO
    public String searchComputerModelsForDeploy(String searchName, int page, String sortType, int asc) {

        Sort sort = new Sort(asc == 1 ? Sort.Direction.ASC : Sort.Direction.DESC, "createTime");

        Pageable pageable = PageRequest.of(page, 10, sort);

        Page<ComputableModel> computableModels = computableModelDao.findByNameContains(searchName, pageable);

        JSONObject computableModelObject = new JSONObject();
        computableModelObject.put("count", computableModels.getTotalElements());
        computableModelObject.put("computableModels", computableModels.getContent());

        return computableModelObject.toString();

    }


    public JSONObject searchByTitleByOid(ComputableModelFindDTO computableModelFindDTO, String oid,String loadUser){
        String userName=userDao.findFirstByUserId(oid).getUserName();
        int page=computableModelFindDTO.getPage();
        int pageSize = computableModelFindDTO.getPageSize();
        String sortElement=computableModelFindDTO.getSortElement();
        Boolean asc = computableModelFindDTO.getAsc();
        String name= computableModelFindDTO.getSearchText();

        Sort sort=new Sort(asc?Sort.Direction.ASC:Sort.Direction.DESC,sortElement);
        Pageable pageable=PageRequest.of(page,pageSize,sort);
        Page<ComputableModelResultDTO> computableModelResultDTOPage = Page.empty();

//        if(loadUser == null||!loadUser.equals(oid)) {
            computableModelResultDTOPage=computableModelDao.findComModelByNameContainsIgnoreCaseAndAuthorAndStatusIn(name,userName,itemStatusVisible,pageable);
//        }else{
//            computableModelResultDTOPage=computableModelDao.findComModelByNameContainsIgnoreCaseAndAuthor(name,userName,pageable);
//        }



        JSONObject result=new JSONObject();
        result.put("list",computableModelResultDTOPage.getContent());
        result.put("total",computableModelResultDTOPage.getTotalElements());
        return result;

    }

    public JSONObject getComputerModelsForDeployByUserId(String userId, int page, String sortType, int asc) {

        Sort sort = new Sort(asc == 1 ? Sort.Direction.ASC : Sort.Direction.DESC, "createTime");

        Pageable pageable = PageRequest.of(page, 10, sort);

        Page<ComputableModel> computableModels = computableModelDao.findByDeployedServiceNotNullAndAuthor(userId, pageable);

        JSONObject computableModelObject = new JSONObject();
        computableModelObject.put("count", computableModels.getTotalElements());
        computableModelObject.put("computableModels", computableModels.getContent());

        return computableModelObject;

    }

    private String getConn(String str) {
        String conn = "";
        switch (str) {
            case "AND":
            case "NOT":
                conn = "$and";
                break;
            case "OR":
                conn = "$or";
                break;
        }
        return conn;
    }

    private String propMapping(String str) {
        String name = "";
        switch (str) {
            case "Model Name":
                name = "name";
                break;
            case "Keyword":
                name = "keywords.";
                break;
            case "Overview":
                name = "description";
                break;
            case "Description":
                name = "description";
                break;
            case "Provider":
                name = "author";
                break;
            case "Reference":
                name = "references.title";
                break;
        }
        return name;
    }


    public JSONObject loadDeployedModel(int asc,int page,int size){
        Sort sort = new Sort(asc == 1 ? Sort.Direction.ASC : Sort.Direction.DESC, "createTime");

        Pageable pageable = PageRequest.of(page, size, sort);

        Page<ComputableModel> computableModelPage = computableModelDao.findAllByDeployAndStatusIn(true,itemStatusVisible,pageable);
        List<ComputableModel> ComputableModelList = computableModelPage.getContent();

        JSONArray j_computableModelArray = new JSONArray();

        for(ComputableModel computableModel:ComputableModelList){
            String author = computableModel.getAuthor();
            User user = userService.findUserByUserName(computableModel.getAuthor());
            JSONObject j_computableModel = new JSONObject();
            j_computableModel.put("oid",computableModel.getOid());
            j_computableModel.put("name",computableModel.getName());
            j_computableModel.put("description",computableModel.getDescription());
            j_computableModel.put("author",user.getName());
            j_computableModel.put("authorId",user.getUserId());
            j_computableModel.put("md5",computableModel.getMd5());
            j_computableModel.put("mdl",computableModel.getMdl());
            j_computableModel.put("mdlJson",computableModel.getMdlJson());
            j_computableModel.put("createTime",computableModel.getCreateTime());
            j_computableModel.put("lastModifyTime",computableModel.getLastModifyTime());
            j_computableModelArray.add(j_computableModel);
        }

        JSONObject jsonObject = new JSONObject();
        jsonObject.put("total",computableModelPage.getTotalElements());
        jsonObject.put("content",j_computableModelArray);

        return jsonObject;
    }

    public List<ComputableModel> listDeployedModel(){
        return computableModelDao.findAllByDeploy(true);
    }

    public JSONObject searchDeployedModel(int asc,int page,int size,String searchText){
        Sort sort = new Sort(asc == 1 ? Sort.Direction.ASC : Sort.Direction.DESC, "createTime");

        Pageable pageable = PageRequest.of(page, size, sort);

        Page<ComputableModel> computableModelPage = computableModelDao.findAllByDeployAndStatusInAndNameLikeIgnoreCase(true,itemStatusVisible,searchText,pageable);
        List<ComputableModel> ComputableModelList = computableModelPage.getContent();
        JSONArray j_computableModelArray = new JSONArray();

        for(ComputableModel computableModel:ComputableModelList){
            String author = computableModel.getAuthor();
            User user = userService.findUserByUserName(computableModel.getAuthor());
            JSONObject j_computableModel = new JSONObject();
            j_computableModel.put("oid",computableModel.getOid());
            j_computableModel.put("name",computableModel.getName());
            j_computableModel.put("description",computableModel.getDescription());
            j_computableModel.put("author",user.getName());
            j_computableModel.put("authorId",user.getUserId());
            j_computableModel.put("md5",computableModel.getMd5());
            j_computableModel.put("mdl",computableModel.getMdl());
            j_computableModel.put("mdlJson",computableModel.getMdlJson());
            j_computableModel.put("createTime",computableModel.getCreateTime());
            j_computableModel.put("lastModifyTime",computableModel.getLastModifyTime());
            j_computableModelArray.add(j_computableModel);
        }

        JSONObject jsonObject = new JSONObject();
        jsonObject.put("total",computableModelPage.getTotalElements());
        jsonObject.put("content",j_computableModelArray);

        return jsonObject;
    }

    public JSONObject pageByClassi(int asc, int page, int pageSize, String sortEle, String searchText, String classification){
        Sort sort = new Sort(asc==1?Sort.Direction.ASC:Sort.Direction.DESC,sortEle);

        Pageable pageable = PageRequest.of(page,pageSize,sort);

        Page<ComputableModel> computableModelPage = Page.empty();
        if(classification.equals("all")){
            computableModelPage = computableModelDao.findByNameContainsIgnoreCaseAndDeploy(searchText,true,pageable);
        }else{
            List<String> classifications = new ArrayList<>();
            classifications.add(classification);
            computableModelPage = computableModelDao.findAllByClassificationsInAndNameLikeIgnoreCaseAndDeploy(classifications,searchText,true,pageable);
        }

        List<ComputableModel> computableModelResult = computableModelPage.getContent();
        JSONArray j_comptblModelArray = new JSONArray();
        if(computableModelPage.getTotalElements()>0){
            for(ComputableModel computableModel:computableModelResult){
                if(computableModel.getMdl()!=null){
                    try {
                        computableModel.setMdlJson(convertMdl(computableModel.getMdl()));
                    }catch (Exception e){

                    }
                }
                String userName = computableModel.getAuthor();
                User user = userDao.findFirstByUserName(userName);
                JSONObject j_comptblModel = (JSONObject) JSONObject.toJSON(computableModel);
                j_comptblModel.put("authorName",user.getName());
                j_comptblModel.put("authorId",user.getUserId());
                j_comptblModelArray.add(j_comptblModel);
            }
        }


        JSONObject result = new JSONObject();
        result.put("content",j_comptblModelArray);
        result.put("total",computableModelPage.getTotalElements());

        return result;

    }

    public JSONObject getDeployedModelByOid(String oid){
        ComputableModel computableModel = computableModelDao.findFirstByOidAndDeploy(oid,true);

        if(computableModel.getMdl()!=null){
            try {
                computableModel.setMdlJson(convertMdl(computableModel.getMdl()));
            }catch (Exception e){

            }
        }
        String userName = computableModel.getAuthor();
        User user = userDao.findFirstByUserName(userName);
        JSONObject j_comptblModel = (JSONObject) JSONObject.toJSON(computableModel);
        j_comptblModel.put("authorName",user.getName());
        j_comptblModel.put("authorId",user.getUserId());

        return j_comptblModel;
    }

}
