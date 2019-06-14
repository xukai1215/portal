package njgis.opengms.portal.service;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.mongodb.BasicDBObject;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoCursor;
import com.mongodb.client.model.Filters;
import njgis.opengms.portal.dao.ComputableModelDao;
import njgis.opengms.portal.dao.ModelDao;
import njgis.opengms.portal.dao.ModelItemDao;
import njgis.opengms.portal.dao.UserDao;
import njgis.opengms.portal.dto.modelItem.ModelItemFindDTO;
import njgis.opengms.portal.entity.Classification;
import njgis.opengms.portal.entity.ComputableModel;
import njgis.opengms.portal.entity.ModelItem;
import njgis.opengms.portal.entity.User;
import njgis.opengms.portal.entity.support.AuthorInfo;
import njgis.opengms.portal.entity.support.ModelItemRelate;
import njgis.opengms.portal.enums.ResultEnum;
import njgis.opengms.portal.exception.MyException;
import njgis.opengms.portal.utils.Utils;
import njgis.opengms.portal.utils.ZipUtils;
import njgis.opengms.portal.utils.deCode;
import org.apache.commons.io.FileUtils;
import org.bson.Document;
import org.dom4j.DocumentException;
import org.dom4j.Element;
import org.dom4j.io.SAXReader;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.aggregation.ArrayOperators;
import org.springframework.stereotype.Service;
import org.springframework.util.DigestUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;
import sun.misc.IOUtils;

import javax.rmi.CORBA.Util;
import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.regex.Pattern;

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
    @Autowired
    ComputableModelDao computableModelDao;

    @Autowired
    ModelItemDao modelItemDao;

    @Autowired
    UserDao userDao;

    @Autowired
    ClassificationService classificationService;

    @Autowired
    UserService userService;

    ModelDao modelDao = new ModelDao();

    @Value ("${resourcePath}")
    private String resourcePath;

    @Value("${htmlLoadPath}")
    private String htmlLoadPath;

    public ModelAndView getPage(String id) {
        //条目信息
        ComputableModel modelInfo = getByOid(id);
        modelInfo.setViewCount(modelInfo.getViewCount() + 1);
        computableModelDao.save(modelInfo);
        //类
        JSONArray classResult = new JSONArray();

        List<String> classifications = modelInfo.getClassifications();
        if (classifications != null) {
            for (int i = 0; i < classifications.size(); i++) {

                JSONArray array = new JSONArray();
                String classId = classifications.get(i);

                do {
                    Classification classification = classificationService.getByOid(classId);
                    array.add(classification.getNameEn());
                    classId = classification.getParentId();
                } while (classId != null);

                JSONArray array1 = new JSONArray();
                for (int j = array.size() - 1; j >= 0; j--) {
                    array1.add(array.getString(j));
                }

                classResult.add(array1);

            }
        }
        //时间
        Date date = modelInfo.getCreateTime();
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");
        String dateResult = simpleDateFormat.format(date);

        //用户信息
        JSONObject userJson=userService.getItemUserInfo(modelInfo.getAuthor());
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
                jsonObject.put("id", i);
                jsonObject.put("name", name);
                jsonObject.put("suffix", suffix);
                jsonObject.put("path",resources.get(i));
                resourceArray.add(jsonObject);

            }

        }
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("computable_model");
        modelAndView.addObject("modelInfo", modelInfo);
        modelAndView.addObject("classifications", classResult);
        modelAndView.addObject("date", dateResult);
        modelAndView.addObject("year", calendar.get(Calendar.YEAR));
        modelAndView.addObject("user", userJson);
        modelAndView.addObject("resources", resourceArray);
        modelAndView.addObject("loadPath",htmlLoadPath);

        return modelAndView;
    }

    public ComputableModel getByOid(String id) {
        try {
            return computableModelDao.findFirstByOid(id);
        } catch (Exception e) {
            System.out.println("有人乱查数据库！！该ID不存在Model Item对象");
            throw new MyException(ResultEnum.NO_OBJECT);
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

    public String deploy(String id) {
        //获取可以将部署包进行部署的任务服务器信息
        JSONObject result = new JSONObject();
        String urlStr = "http://"+managerServer+"/GeoModeling/taskNode/getTaskForMicroService";
        JSONObject serviceTaskResult = Utils.connentURL(Utils.Method.GET, urlStr);
        if (serviceTaskResult != null && serviceTaskResult.getInteger("code") == 1) {
            //task服务器API，部署包通过task server进行部署
            String deployUrl = "http://" + serviceTaskResult.getJSONObject("data").getString("host") + ":" + serviceTaskResult.getJSONObject("data").getString("port") + "/server/modelser/deploy";
            ComputableModel computableModel = computableModelDao.findFirstByOid(id);
            String saveFilePath = ConceptualModelService.class.getClassLoader().getResource("").getPath() + "static/upload/computableModel/Package" + computableModel.getResources().get(0);
            String[] paths = computableModel.getResources().get(0).split("/");
            String fileName = paths[paths.length - 1];
            JSONObject deployResult = doPostWithDeployPackage(deployUrl, saveFilePath, fileName, "0");
            if (deployResult != null && deployResult.getInteger("code") == 1) {
                //更新计算模型信息
                JSONObject data = deployResult.getJSONObject("data");
                String modelserUrl = "http://" + data.getString("host") + ":" + data.getString("port") + "/modelser/" + data.getString("msid");
                computableModel.setModelserUrl(modelserUrl);
                computableModel.setDeploy(true);
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
        List<String> resources = saveFiles(files, path, uid, "");
        if (resources == null) {
            result.put("code", -1);
        } else {
            try {
                computableModel.setResources(resources);
                computableModel.setOid(UUID.randomUUID().toString());
                computableModel.setName(jsonObject.getString("name"));
                computableModel.setDetail(jsonObject.getString("detail"));
                computableModel.setRelateModelItem(jsonObject.getString("bindOid"));
                computableModel.setDescription(jsonObject.getString("description"));
                computableModel.setContentType(jsonObject.getString("contentType"));
                computableModel.setUrl(jsonObject.getString("url"));
                String md5 = "";
                if (jsonObject.getString("contentType").equals("Package")) {
                    String filePath = path + resources.get(0);
                    FileInputStream file = new FileInputStream(filePath);
                    md5 = DigestUtils.md5DigestAsHex(IOUtils.readFully(file, -1, true));

                    String mdlPath=null;
                    String testDataDirectoryPath = null;
                    String destDirPath = path + "/unZip/" + computableModel.getOid();
                    ZipUtils.unZip(new File(filePath),destDirPath);
                    File unZipDir = new File(destDirPath);
                    if (unZipDir.exists()) {
                        LinkedList<File> list = new LinkedList<File>();
                        File[] dirFiles = unZipDir.listFiles();
                        for (File file2 : dirFiles) {
                            if (file2.isDirectory()) {
                                //我为了节省时间就直接复用许凯的代码了
                                if(file2.getName().equals("testify")){
                                    testDataDirectoryPath = file2.getAbsolutePath();
                                }else{
                                    list.add(file2);
                                }
                            } else {
                                String name=file2.getName();
                                if(name.substring(name.length()-3,name.length()).equals("mdl")){
                                    mdlPath=file2.getAbsolutePath();
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
                                    //我为了节省时间就直接复用许凯的代码了
                                    if(file2.getName().equals("testify")){
                                        testDataDirectoryPath = file2.getAbsolutePath();
                                    }else{
                                        list.add(file2);
                                    }
                                } else {
                                    String name=file2.getName();
                                    if(name.substring(name.length()-3,name.length()).equals("mdl")){
                                        mdlPath=file2.getAbsolutePath();
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
                    if(testDataDirectoryPath != null){
                        String testData = generateTestData(testDataDirectoryPath,computableModel.getOid());
                        computableModel.setTestDataPath(testData);
                    }else{
                        computableModel.setTestDataPath("");
                    }

                    String content="";
                    if(mdlPath!=null){
                        try {
                            BufferedReader in = new BufferedReader(new FileReader(mdlPath));
                            String str=in.readLine();
                            if(str.indexOf("ModelClass")!=-1){
                                content+=str;
                            }
                            while ((str = in.readLine()) != null) {
                                content+=str;
                            }
                            in.close();
                            System.out.println(content);
                        } catch (IOException e) {
                            System.out.println(e);
                        }

                        computableModel.setMdl(content);
                    }
                    else{
                        System.out.println("mdl文件未找到!");
                    }

                    Utils.deleteDirectory(destDirPath);
                }

                computableModel.setMd5(md5);



                JSONArray jsonArray=jsonObject.getJSONArray("authorship");
                List<AuthorInfo> authorship=new ArrayList<>();
                for(int i=0;i<jsonArray.size();i++){
                    JSONObject author=jsonArray.getJSONObject(i);
                    AuthorInfo authorInfo=new AuthorInfo();
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
                e.printStackTrace();
                result.put("code", -2);
            }
        }
        return result;
    }

    private String generateTestData(String testDataDirectory, String oid) throws IOException {

        File testDataFile = new File(testDataDirectory);
        File[] tempTestDataDir = testDataFile.listFiles(new FileFilter() {
            @Override
            public boolean accept(File pathname) {
                return pathname.isDirectory();
            }
        });
        if(tempTestDataDir.length == 0){
            return "";
        }else{
            File defaultTest = tempTestDataDir[0];
            String configPath = defaultTest.getAbsolutePath() + File.separator + "config.xml";
            File configFile = new File(configPath);
            if(configFile.exists()){
                //读取config.xml文件信息，获取到同级目录下方是否有相对应的数据
                boolean status = judgeConfigInformation(configFile,defaultTest.getAbsolutePath());
                if(!status){
                    return "";
                }
                //拷贝文件
                String destPath = ComputableModelService.class.getClassLoader().getResource("").getPath() + "static/upload/computableModel/testify/" + oid;
                FileUtils.copyDirectory(defaultTest.getAbsoluteFile(),new File(destPath));
                String returnPath = oid + File.separator + "config.xml";
                return returnPath;
            }else{
                return "";
            }
        }

    }

    private boolean judgeConfigInformation(File configFile,String parentDirectory){
        org.dom4j.Document result = null;
        SAXReader reader = new SAXReader();
        try {
            result = reader.read(configFile);
        } catch (DocumentException e) {
            e.printStackTrace();
        }
        Element rootElement = result.getRootElement();
        List<Element> items = rootElement.elements();
        if(items.size() > 0){
            for(Element item : items){
                String fileName = item.attributeValue("File");
                String filePath = parentDirectory + File.separator + fileName;
                File tempFile = new File(filePath);
                if(tempFile.exists()){
                    continue;
                }else{
                    return false;
                }
            }
        }else{
            System.out.println("无测试案例数据");
            return false;
        }
        return true;
    }

    public int delete(String oid,String userName){
        ComputableModel computableModel=computableModelDao.findFirstByOid(oid);

        if(computableModel!=null){
            //删除资源
            String path = resourcePath + "/computableModel/" + computableModel.getContentType();
            List<String> resources=computableModel.getResources();
            for(int i=0;i<resources.size();i++){
                Utils.delete(path+resources.get(i));
            }

            //计算模型删除
            computableModelDao.delete(computableModel);
            userService.computableModelMinusMinus(userName);
            //模型条目关联删除
            String modelItemId=computableModel.getRelateModelItem();
            ModelItem modelItem=modelItemDao.findFirstByOid(modelItemId);
            List<String> computableIds=modelItem.getRelate().getComputableModels();
            for (String id:computableIds
                    ) {
                if(id.equals(computableModel.getOid())){
                    computableIds.remove(id);
                    break;
                }
            }
            modelItem.getRelate().setComputableModels(computableIds);
            modelItemDao.save(modelItem);

            return 1;
        }
        else{
            return -1;
        }
    }

    public JSONObject searchComputableModelsByUserId(String searchText,String userId, int page, String sortType, int asc) {

        Sort sort = new Sort(asc==1 ? Sort.Direction.ASC : Sort.Direction.DESC, "createTime");

        Pageable pageable = PageRequest.of(page, 10, sort);

        Page<ComputableModel> modelItems = computableModelDao.findByNameContainsIgnoreCaseAndAuthor(searchText,userId,pageable);

        JSONObject modelItemObject = new JSONObject();
        modelItemObject.put("count",modelItems.getTotalElements());
        modelItemObject.put("computableModels",modelItems.getContent());

        return modelItemObject;

    }

    public JSONObject getComputableModelsByUserId(String userId, int page, String sortType, int asc){

        Sort sort = new Sort(asc==1 ? Sort.Direction.ASC : Sort.Direction.DESC, "createTime");

        Pageable pageable = PageRequest.of(page, 10, sort);

        Page<ComputableModel> computableModels = computableModelDao.findByAuthor(userId,pageable);

        JSONObject computableModelObject = new JSONObject();
        computableModelObject.put("count",computableModels.getTotalElements());
        computableModelObject.put("computableModels",computableModels.getContent());

        return computableModelObject;

    }

    public JSONObject listByUserOid(ModelItemFindDTO modelItemFindDTO, String oid) {

        int page = modelItemFindDTO.getPage();
        int pageSize = modelItemFindDTO.getPageSize();
        Sort sort = new Sort(modelItemFindDTO.getAsc() ? Sort.Direction.ASC : Sort.Direction.DESC, "viewCount");
        Pageable pageable = PageRequest.of(page, pageSize, sort);
        User user = userDao.findFirstByOid(oid);
        Page<ComputableModel> modelItemPage = computableModelDao.findByAuthor(user.getUserName(), pageable);

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
        Sort sort = new Sort(modelItemFindDTO.getAsc() ? Sort.Direction.ASC : Sort.Direction.DESC, "viewCount");
        Pageable pageable = PageRequest.of(page, pageSize, sort);

        Page<ComputableModel> computableModelPage;

        if (searchText.equals("") && classes.get(0).equals("all")) {
            computableModelPage = computableModelDao.findAll(pageable);
        } else if (!searchText.equals("") && classes.get(0).equals("all")) {
            computableModelPage = computableModelDao.findByNameContainsIgnoreCase(searchText, pageable);
        } else if (searchText.equals("") && !classes.get(0).equals("all")) {
            computableModelPage = computableModelDao.findByClassificationsIn(classes, pageable);
        } else {
            computableModelPage = computableModelDao.findByNameContainsIgnoreCaseAndClassificationsIn(searchText, classes, pageable);
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
}
