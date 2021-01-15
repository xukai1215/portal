package njgis.opengms.portal.service;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import lombok.extern.slf4j.Slf4j;
import njgis.opengms.portal.bean.JsonResult;
import njgis.opengms.portal.dao.*;
import njgis.opengms.portal.dto.dataApplication.DataApplicationDTO;
import njgis.opengms.portal.dto.dataApplication.DataApplicationFindDTO;
import njgis.opengms.portal.entity.*;
import njgis.opengms.portal.entity.support.*;
import njgis.opengms.portal.enums.ResultEnum;
import njgis.opengms.portal.exception.MyException;
import njgis.opengms.portal.utils.Utils;
import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.DocumentHelper;
import org.dom4j.Element;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.*;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.client.RequestCallback;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;
import springfox.documentation.spring.web.json.Json;
import sun.security.krb5.internal.ccache.Tag;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.zip.ZipEntry;
import java.util.zip.ZipFile;

//import static jdk.internal.org.objectweb.asm.Type.getType;
import static njgis.opengms.portal.utils.DataApplicationUtil.deleteFolder;
import static njgis.opengms.portal.utils.DataApplicationUtil.zipUncompress;
import static njgis.opengms.portal.utils.Utils.deleteFile;
import static njgis.opengms.portal.utils.Utils.saveFiles;

/**
 * @Author mingyuan
 * @Date 2020.07.30 11:15
 */
@Service
@Slf4j
public class DataApplicationService {

    @Value("${resourcePath}")
    String resourcePath;

    @Autowired
    DataApplicationDao dataApplicationDao;

    @Autowired
    UserService userService;

    @Autowired
    CategoryDao categoryDao;

    @Autowired
    DataApplicationVersionDao dataApplicationVersionDao;

    @Autowired
    DataCategorysDao dataCategorysDao;

    @Autowired
    UserDao userDao;

//    @Value("${dataContainerDeployPort}")
//    String dataContainerDeployPort;

    @Value("${htmlLoadPath}")
    private String htmlLoadPath;

    @Value("${dataServerManager}")
    private String dataServerManager;


    public ModelAndView getPage(String id){     //根据oid得到页面
        try {
            DataApplication dataApplication = dataApplicationDao.findFirstByOid(id);
            List<String> classifications = dataApplication.getClassifications();

            //时间
            Date date = dataApplication.getCreateTime();
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(date);
            SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");
            String dateResult = simpleDateFormat.format(date);

            //用户信息
            JSONObject userJson = userService.getItemUserInfoByOid(dataApplication.getAuthor());
            //资源信息
            JSONArray resourceArray = new JSONArray();
            List<String> resources = dataApplication.getResources();

            if (resources != null) {
                for (int i = 0; i < resources.size(); i++) {
                    String path = resources.get(i);
                    String[] arr = path.split("\\.");
                    String suffix = arr[arr.length - 1];
                    arr = path.split("/");
                    String name = null;
                    if (dataApplication.getBatch()!=null&&dataApplication.getBatch() == true){
                        name = arr[arr.length - 1];
                    }else {
                        name = arr[arr.length - 1].substring(14);
                    }
                    JSONObject jsonObject = new JSONObject();
                    jsonObject.put("name", name);
                    jsonObject.put("suffix", suffix);
                    jsonObject.put("path", resources.get(i));
                    resourceArray.add(jsonObject);
                }
            }

            String lastModifyTime = simpleDateFormat.format(dataApplication.getLastModifyTime());

            //authorship
            String authorshipString="";
            List<AuthorInfo> authorshipList=dataApplication.getAuthorship();
            if(authorshipList!=null){
                for (AuthorInfo author:authorshipList) {
                    if(authorshipString.equals("")){
                        authorshipString+=author.getName();
                    }
                    else{
                        authorshipString+=", "+author.getName();
                    }

                }
            }


            ModelAndView modelAndView = new ModelAndView();

            modelAndView.setViewName("data_application_info");

            List<String> categories = classifications;
            List<String> classificationName = new ArrayList<>();
            // 重新改分类了
            // for (String category: categories){
            //     DataCategorys categorys = dataCategorysDao.findFirstById(category);
            //     String name = categorys.getCategory();
            //     classificationName.add(name);
            // }

            modelAndView.addObject("dataApplicationInfo", dataApplication);
            modelAndView.addObject("classifications", classificationName);
            modelAndView.addObject("date", dateResult);
            modelAndView.addObject("year", calendar.get(Calendar.YEAR));
            modelAndView.addObject("user", userJson);
            modelAndView.addObject("authorship", authorshipString);
            modelAndView.addObject("resources", resourceArray);
            modelAndView.addObject("lastModifyTime", lastModifyTime);


            return modelAndView;



        } catch (Exception e) {
            System.out.println(e.getMessage());
            throw new MyException(e.getMessage());
        }

    }


    public ModelAndView getPageWith_id(String id){
        try {
            DataApplication dataApplication = dataApplicationDao.findFirstById(id);
            List<String> classifications = dataApplication.getClassifications();

            //时间
            Date date = dataApplication.getCreateTime();
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(date);
            SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");
            String dateResult = simpleDateFormat.format(date);

            //用户信息
            JSONObject userJson = userService.getItemUserInfoByOid(dataApplication.getAuthor());
            //资源信息
            JSONArray resourceArray = new JSONArray();
            List<String> resources = dataApplication.getResources();

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

            String lastModifyTime = simpleDateFormat.format(dataApplication.getLastModifyTime());

            //authorship
            String authorshipString="";
            List<AuthorInfo> authorshipList=dataApplication.getAuthorship();
            if(authorshipList!=null){
                for (AuthorInfo author:authorshipList) {
                    if(authorshipString.equals("")){
                        authorshipString+=author.getName();
                    }
                    else{
                        authorshipString+=", "+author.getName();
                    }

                }
            }


            ModelAndView modelAndView = new ModelAndView();

            modelAndView.setViewName("data_application_info");

            List<String> categories = classifications;
            List<String> classificationName = new ArrayList<>();

            // 因为分类改为三类了，所以注释掉了
            // for (String category: categories){
            //     DataCategorys categorys = dataCategorysDao.findFirstById(category);
            //     String name = categorys.getCategory();
            //     classificationName.add(name);
            // }

            modelAndView.addObject("dataApplicationInfo", dataApplication);
            modelAndView.addObject("classifications", classificationName);
            modelAndView.addObject("date", dateResult);
            modelAndView.addObject("year", calendar.get(Calendar.YEAR));
            modelAndView.addObject("user", userJson);
            modelAndView.addObject("authorship", authorshipString);
            modelAndView.addObject("resources", resourceArray);
            modelAndView.addObject("lastModifyTime", lastModifyTime);


            return modelAndView;



        } catch (Exception e) {
            System.out.println(e.getMessage());
            throw new MyException(e.getMessage());
        }
    }
    public DataApplication recordViewCount(DataApplication item){     // 记录访问次数
        Date now = new Date();
        DailyViewCount newViewCount = new DailyViewCount(now, 1);

        List<DailyViewCount> dailyViewCountList=item.getDailyViewCount();
        if(dailyViewCountList==null){
            List<DailyViewCount> newList=new ArrayList<>();
            newList.add(newViewCount);
            dailyViewCountList=newList;
        }
        else if(dailyViewCountList.size()>0) {
            DailyViewCount dailyViewCount = dailyViewCountList.get(dailyViewCountList.size() - 1);
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

            if (sdf.format(dailyViewCount.getDate()).equals(sdf.format(now))) {
                dailyViewCount.setCount(dailyViewCount.getCount() + 1);
                dailyViewCountList.set(dailyViewCountList.size() - 1, dailyViewCount);
            } else {
                dailyViewCountList.add(newViewCount);
            }
        }
        else{
            dailyViewCountList.add(newViewCount);
        }

        item.setDailyViewCount(dailyViewCountList);
        item.setViewCount(item.getViewCount()+1);

        return item;
    }
    /**
     * 新建一个application条目，并部署部署包
     * @param files 上传的包
     * @param jsonObject 参数1
     * @param oid 参数2
     * @param dataApplicationDTO 参数3
     * @return 插入结果
     */
    public JsonResult insert(List<MultipartFile> files, JSONObject jsonObject, String oid, DataApplicationDTO dataApplicationDTO, String uid){
        JsonResult result = new JsonResult();
        DataApplication dataApplication = new DataApplication();
        BeanUtils.copyProperties(dataApplicationDTO, dataApplication);

        String path = resourcePath + "/DataApplication/" + jsonObject.getString("contentType");

        List<String> resources = new ArrayList<>();
        saveFiles(files, path, oid, "", resources);

        if (resources == null){
            result.setCode(-2);
        }else {
            try {
                dataApplication.setResources(resources);
                dataApplication.setOid(UUID.randomUUID().toString());
                dataApplication.setAuthor(oid);
                dataApplication.setIsAuthor(true);

                Date now = new Date();
                dataApplication.setCreateTime(now);
                dataApplication.setLastModifyTime(now);

                //将服务invokeApplications置入,如果不绑定测试数据，则无需部署，直接创建条目即可
                if(dataApplication.getTestData().size() == 0){
                    dataApplicationDao.insert(dataApplication);
                    result.setCode(1);
                    result.setData(dataApplication.getOid());
                    return result;
                }
                InvokeService invokeService = new InvokeService();
                invokeService.setServiceId(UUID.randomUUID().toString());//
                invokeService.setMethod(dataApplication.getMethod());
                invokeService.setName(dataApplication.getName());

                invokeService.setToken("fdtwTxlnhka8jY66lOT+kKutgZHnvi4NlnDc7QY5jR4=");//75
//                invokeService.setToken("fcky/35Rezr+Kyazr8SRWA==");//33
                invokeService.setContributor(uid);
                invokeService.setIsPortal(true);
                List<InvokeService> invokeServices = new ArrayList<>();
                invokeServices.add(invokeService);
                dataApplication.setInvokeServices(invokeServices);

//                dataApplicationDao.insert(dataApplication);

                //部署服务
                result = deployPackage(dataApplication, dataApplication.getTestDataPath());

//                if (deployRes.getCode() == -1){
//                    result.put("code", -2);
//                }else {
//                    result.put("code", 1);
//                    result.put("id", dataApplication.getOid());
//                }
            }catch (Exception e){
                log.info("dataApplication create failed");
                result.setCode(-1);
                result.setMsg("dataApplication create failed");
            }
        }



        return result;
    }

    //用户拿到上传的所有条目
    public Page<DataApplication> getUsersUploadData(String author, Integer page, Integer pagesize, Integer asc, String type) {
        // TODO: 2020/8/4 show dataApplication items
        boolean as = false;
        if (asc == 1) {
            as = true;
        } else {
            as = false;
        }

        Sort sort = new Sort(as ? Sort.Direction.ASC : Sort.Direction.DESC, "createTime");
        Pageable pageable = PageRequest.of(page, pagesize, sort);
        Page<DataApplication> dataApplications = dataApplicationDao.findByAuthorAndType(pageable, author, type);
        return dataApplicationDao.findByAuthorAndType(pageable, author,type);

    }

    public Page<DataApplication> searchDataByUserId(String userOid, int page, int pageSize, int asc, String searchText, String type) {
        //todo 超出堆内存解决办法
        Sort sort = new Sort(asc==1 ? Sort.Direction.ASC : Sort.Direction.DESC, "createTime");
        Pageable pageable = PageRequest.of(page, pageSize, sort);
        Page<DataApplication> dataApplications= dataApplicationDao.findByAuthorAndNameContainsAndType(pageable, userOid, searchText, type);
        return dataApplications;
    }

    public DataApplication getById(String oid) {
        try {
            DataApplication dataApplication = dataApplicationDao.findFirstByOid(oid);
            List<FileMeta> fileContainer = userDao.findFirstByOid(dataApplication.getAuthor()).getFileContainer();
            for (int i=0;i<dataApplication.getTestData().size();++i){
                for (int j=0;j<fileContainer.size();++j){
                    if(fileContainer.get(j).getUrl() != ""){
                        if(dataApplication.getTestData().get(i).getUrl().equals(fileContainer.get(j).getUrl())){
                            dataApplication.getTestData().get(i).setLabel(fileContainer.get(j).getName());
                            dataApplication.getTestData().get(i).setSuffix(fileContainer.get(j).getSuffix());
                        }
                    }
                }
            }
            return dataApplication;
        } catch (Exception e) {
            System.out.println("有人乱查数据库！！该ID不存在Model Item对象");
            throw new MyException(ResultEnum.NO_OBJECT);
        }
    }

    public JSONObject update(List<MultipartFile> files, JSONObject jsonObject, String oid, DataApplicationDTO dataApplicationDTO) {
        JSONObject result = new JSONObject();
        DataApplication dataApplication_ori = dataApplicationDao.findFirstByOid(jsonObject.getString("oid"));
        String author0 = dataApplication_ori.getAuthor();
        DataApplication dataApplication = new DataApplication();
        BeanUtils.copyProperties(dataApplication_ori, dataApplication);

        if (!dataApplication_ori.isLock()) {
            String path = resourcePath + "/DataApplication/" + jsonObject.getString("contentType");
            //如果上传新文件
            if (files.size() > 0) {
                List<String> resources =new ArrayList<>();
                saveFiles(files, path, oid, "",resources);
                if (resources == null) {
                    result.put("code", -1);
                    return result;
                }
                dataApplication.setResources(resources);
            }

            dataApplication.setName(jsonObject.getString("name"));
            dataApplication.setStatus(jsonObject.getString("status"));
            dataApplication.setMethod(jsonObject.getString("method"));
            dataApplication.setDetail(jsonObject.getString("detail"));
            dataApplication.setDescription(jsonObject.getString("description"));
            dataApplication.setContentType(jsonObject.getString("contentType"));
            dataApplication.setUrl(jsonObject.getString("url"));
            System.out.println(jsonObject.get("keywords"));
            dataApplication.setKeywords((List<String>)jsonObject.get("keywords"));
            dataApplication.setTestData((List)jsonObject.get("testData"));

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
            dataApplication.setAuthorship(authorship);

            dataApplication.setAuthor(oid);
            dataApplication.setIsAuthor(true);

            Date now = new Date();
            String authorUserName = dataApplication_ori.getAuthor();

            if (dataApplication_ori.getAuthor().equals(oid)) {
                dataApplication.setLastModifyTime(now);
                dataApplicationDao.save(dataApplication);

                result.put("method", "update");
                result.put("code", 1);
                result.put("id", dataApplication.getOid());
            } else {
                DataApplicationVersion dataApplicationVersion = new DataApplicationVersion();
                BeanUtils.copyProperties(dataApplication, dataApplicationVersion, "id");
                dataApplicationVersion.setOid(UUID.randomUUID().toString());
                dataApplicationVersion.setOriginOid(dataApplication_ori.getOid());
                dataApplicationVersion.setModifier(oid);
                dataApplicationVersion.setVerNumber(now.getTime());
                dataApplicationVersion.setVerStatus(0);

                //todo messageNum
                String author = dataApplication_ori.getAuthor();
                User user = userDao.findFirstByOid(author);
                userService.messageNumPlusPlus(user.getUserName());

                dataApplicationVersion.setModifyTime(now);
                dataApplicationVersion.setAuthor(author0);

                dataApplicationVersionDao.save(dataApplicationVersion);

                dataApplication_ori.setLock(true);
                dataApplicationDao.save(dataApplication_ori);

                result.put("method", "version");
                result.put("code", 0);
                result.put("oid", dataApplicationVersion.getOid());
            }


            return result;
        } else {
            return null;
        }
    }

    public int delete(String oid) {
        DataApplication dataApplication = dataApplicationDao.findFirstByOid(oid);
//        if(!dataApplication.getAuthor().equals(oid))
//            return 2;
        if (dataApplication != null) {
            //删除资源
            String path = resourcePath + "/computableModel/" + dataApplication.getContentType();
            List<String> resources = dataApplication.getResources();
            for (int i = 0; i < resources.size(); i++) {
                Utils.delete(path + resources.get(i));
            }
            //删除
            dataApplicationDao.delete(dataApplication);
//            userService.computableModelMinusMinus(userName);
            return 1;
        } else {
            return -1;
        }
    }

    /**
     * 为部署准备文件以及服务
     * @param dataApplication 待部署的DataApplication
     * @return 是否成功部署
     */
    //此接口废弃，已在前台准备好数据
    public JsonResult deployDataPrepare(DataApplication dataApplication) throws Exception {
        JsonResult jsonResult = new JsonResult();
        //post file 部署file
//        String testDataPath = dataApplication.getTestDataPath();//测试数据在门户节点容器的路径，不是在门户服务
        List<TestData> testDatas = dataApplication.getTestData();
        String testDataUUID = UUID.randomUUID().toString();
        String destDirPath = resourcePath + "/DataApplication/TestData/" + testDataUUID;
        File file = new File(destDirPath);
        if(!file.exists()){
            file.mkdirs();
        }
        //查看是否已下载
        File testExist = new File(destDirPath);
        //待处理
//        if (testExist.exists()){
//            jsonResult.setMsg("Data is already exist!");
//            //判断当前文件夹下是文件夹还是文件，如果为文件夹，则设置至文件夹路径，
//            // 如果为文件则设置为上层路径（路径为测试数据路径，测试数据有单个文件与多个文件之分，多个文件则存储在文件夹里）
//            File[] files = testExist.listFiles();
//            for (File item : files){
//                if(item.isDirectory()){
//                    testDatas.get(0).setPath(destDirPath + "/" + item.getName());
//                }else{
//                    testDatas.get(0).setPath(destDirPath);
//                }
//            }
//            dataApplication.setTestData(testDatas);
//            dataApplicationDao.save(dataApplication);
//            jsonResult.setCode(1);
//            deployPackage(dataApplication,destDirPath);
//
//            return jsonResult;
//        }

        //当前为一个zip包，存储所有的测试数据,此处废弃
        //当前为多个测试文件，每个文件代表一个Item
        String dataUrl = null;
        String fileName = null;
        for(TestData testData1:testDatas){
            //循环下载所有的测试数据至uuid文件夹下
            dataUrl = testData1.getUrl();
            InputStream inputStream = null;
            FileOutputStream fileOutputStream = null;
            if (dataUrl!=null){
                URL url = new URL(dataUrl);
                HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                conn.setConnectTimeout(5000);
                conn.setReadTimeout(60000);
                //通过conn取得文件名称
                String raw = conn.getHeaderField("Content-Disposition");
                if(raw!=null&&raw.indexOf("=")>0){
                    fileName = raw.split("=")[1];
                    fileName = new String(fileName.getBytes(StandardCharsets.ISO_8859_1), StandardCharsets.UTF_8);
                }
                inputStream = conn.getInputStream();
            }

            File testData = new File(destDirPath);
            if(!testData.exists()){
                testData.mkdirs();
            }
            String path = destDirPath + "/" + fileName ;
            File localFile = new File(path);
            try {
                //将数据下载至resourcePath下
                if (localFile.exists()) {
                    //如果文件存在删除文件
                    boolean delete = localFile.delete();
                }
                //创建文件
                if (!localFile.exists()) {
                    //如果文件不存在，则创建新的文件
                    localFile.createNewFile();
                }

                fileOutputStream = new FileOutputStream(localFile);
                byte[] bytes = new byte[1024];
                int len = -1;
                while ((len = inputStream.read(bytes)) != -1) {
                    fileOutputStream.write(bytes, 0, len);
                }
                fileOutputStream.close();
                inputStream.close();

            } catch (FileNotFoundException e){
                e.printStackTrace();
            }catch (IOException e) {
                e.printStackTrace();
            } finally {
                try {
                    if (fileOutputStream != null) {
                        fileOutputStream.close();
                    }
                    if (inputStream != null) {
                        inputStream.close();
                    }
                }catch (IOException e) {
                    e.printStackTrace();
                }
            }

            //开始往数据库里存储
//            File[] files = localFile.listFiles();
//            for (File item : files) {
//                if (item.isDirectory()) {
//                    testDatas.get(0).setPath(destDirPath + "/" + item.getName());
//                } else {
//                    testDatas.get(0).setPath(destDirPath);
//                }
//            }
           testData1.setPath(path);
        }
        dataApplication.setTestData(testDatas);
        dataApplicationDao.save(dataApplication);
        jsonResult.setCode(0);
        jsonResult.setMsg("suc");


//        String dataUrl = testDatas.get(0).getUrl();
//        InputStream inputStream = null;
//        FileOutputStream fileOutputStream = null;
//
//        if (dataUrl!=null){
//            URL url = new URL(dataUrl);
//            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
//            conn.setConnectTimeout(5000);
//            conn.setReadTimeout(60000);
//            inputStream = conn.getInputStream();
//        }

        //下载文件到固定路径





        //将写入的zip文件进行解压
        //需要进行判断
//        zipUncompress(path,destDirPath);

        //解压后删除zip包路径
//        boolean del = deleteFolder(testDataPath);
        //post package包 部署package

//        if(del) {
//            File[] files = testExist.listFiles();
//            for (File item : files) {
//                if (item.isDirectory()) {
//                    testDatas.get(0).setPath(destDirPath + "/" + item.getName());
//                } else {
//                    testDatas.get(0).setPath(destDirPath);
//                }
//            }
//            dataApplication.setTestData(testDatas);
//            dataApplicationDao.save(dataApplication);
//            jsonResult.setCode(0);
//            jsonResult.setMsg("suc");
//        }else {
//            jsonResult.setCode(-1);
//            jsonResult.setMsg("zip delete failed!");
//            return jsonResult;
//        }

        //跨域调用容器接口，部署数据以及服务
        deployPackage(dataApplication,destDirPath);

        return jsonResult;
    }

    /**
     * 部署文件以及处理服务
     * @param dataApplication 待部署的DataApplication
     * @return 是否成功部署
     */
    public JsonResult deployPackage(DataApplication dataApplication, String dataPath) throws Exception {
        JsonResult res = new JsonResult();
        //跨域调用容器接口，部署数据
//        String dataUrl="http://172.21.213.111:8899" + "/newFile";
        String dataUrl="http://172.21.213.111:8899" + "/newFile";

        List<InvokeService> invokeServices = dataApplication.getInvokeServices();
        InvokeService invokeService = invokeServices.get(0);

        RestTemplate restTemplate = new RestTemplate();
        Map<String, Object> part = new HashMap<>();
        part.put("uid", "0");//存在根目录中
        part.put("instype", "Data");

//        part.put("userToken", "f30f0e82-f6f1-4264-a302-caff7c40ccc9");//33
//        part.put("userToken", "e3cea591-a8a5-4f50-b640-a569eccd94b7");//75
        part.put("userToken", "4cfc7691-c56b-483f-b1c9-bab859be9e00");//75_2
        String newFileId = UUID.randomUUID().toString();
        part.put("id", newFileId);
        part.put("oid", "0");
        part.put("name", dataApplication.getName());
        Date date = new Date();
        part.put("date", date.toString());
        part.put("type", "file");
        part.put("authority", true);

        List<String> dataIds = new ArrayList<>();
        dataIds.add(newFileId);
        invokeService.setDataIds(dataIds);

        MetaData metaData = new MetaData();
        metaData.setDataPath(dataPath);
        metaData.setDataTime("1970/1/1 上午8:00:00");
        metaData.setFileDataType("File");
        metaData.setSecurity("Public");
        metaData.setUid(UUID.randomUUID().toString());

        part.put("meta", metaData);

        HttpHeaders headers = new HttpHeaders();
//        headers.add("Authorization", "Bearer "+ StaticParams.access_token);
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map> httpEntity = new HttpEntity<>(part, headers);
        try {
            ResponseEntity<JSONObject> response = restTemplate.exchange(dataUrl, HttpMethod.PUT, httpEntity, JSONObject.class);
            //解析response
            JSONObject j_result = response.getBody();
            //捕获sdk异常
            if(j_result.getString("code").equals("-1")){
                res.setMsg(j_result.getString("message"));
                res.setCode(-1);
                return res;
            }
        }catch (ResourceAccessException e){
            res.setMsg("deploy file time out");
            res.setCode(-1);
            return res;
        }


        //部署服务
        String prcUrl="http://172.21.213.111:8899"+ "/newprocess";
        RestTemplate restTemplate2 = new RestTemplate();
        MultiValueMap<String, Object> part2 = new LinkedMultiValueMap<>();
        part2.add("authority", true);
        Date date2 = new Date();
        part2.add("date", date2.toString());

        String serviceId = UUID.randomUUID().toString();
        part2.add("id", serviceId);
        if(dataApplication.getMethod().equals("Processing")||dataApplication.getMethod().equals("Conversion")) {
            part2.add("instype", "Processing");
        }else {
            part2.add("instype", "Visualization");
        }
        part2.add("name", dataApplication.getName());
        //todo

//        part2.add("oid", "I3MXbzRq/NZkbWcKO8tF0w==");//33
        part2.add("oid", "5KglgbsDPmrFnA3J9CALzQ==");//75

        //获取xml
        String packageZipPath = resourcePath + "/DataApplication/Package" + dataApplication.getResources().get(0);
        File packageZip = new File(packageZipPath);
        String destDirPath = resourcePath + "/DataApplication/Package/" + UUID.randomUUID().toString();
        //解压zip
        zipUncompress(packageZipPath,destDirPath);
        dataApplication.setPackagePath(destDirPath);

        packageZip = new File(destDirPath);
        File[] files = packageZip.listFiles();
        String fileList = "";
        int paramsCount = 0;
        int i=0;
        for (File file:files){
//            fileList.add(file.getName());
            if (i==0) {
                fileList += file.getName();
            }else {
                fileList += ("," + file.getName());
            }
            i++;
            if (file.getName().substring(file.getName().lastIndexOf(".")).equals(".xml")){
                //解析xml文件
                if (!file.exists()){
                    return null;
                }
                FileInputStream inputStream = new FileInputStream(file);
                int length = inputStream.available();
                byte bytes[] = new byte[length];
                inputStream.read(bytes);
                inputStream.close();
                String xml = new String(bytes, StandardCharsets.UTF_8);

                //解析xml  利用Iterator获取xml的各种子节点
                Document document = DocumentHelper.parseText(xml);
                Element root = document.getRootElement();
                paramsCount =  root.element("Parameter").elements().size();
            }
        }

        part2.add("fileList", fileList);
        part2.add("paramsCount", paramsCount+"");//解析xml
        part2.add("relatedData", newFileId);//dataId
        part2.add("type", "Processing");
        part2.add("uid", "0");

//        part2.add("userToken", "f30f0e82-f6f1-4264-a302-caff7c40ccc9");//33
//        part2.add("userToken", "e3cea591-a8a5-4f50-b640-a569eccd94b7");//75
        part2.add("userToken", "4cfc7691-c56b-483f-b1c9-bab859be9e00");//75_2
        part2.add("processingPath", dataApplication.getPackagePathContainer());

        invokeService.setServiceId(serviceId);
        List<InvokeService> invokeServices1 = new ArrayList<>();
        invokeServices1.add(invokeService);
        dataApplication.setInvokeServices(invokeServices1);

        try {
            JSONObject jsonObject = restTemplate2.postForObject(prcUrl, part2,JSONObject.class);
            //捕获sdk异常
            if(jsonObject.getString("code").equals("-1")){
                res.setMsg(jsonObject.getString("message"));
                res.setCode(-1);
                return res;
            }
        }catch (ResourceAccessException e){
            res.setMsg("deploy server time out");
            res.setCode(-1);
            return res;
        }
        res.setCode(1);
        res.setData(dataApplication.getOid());
        dataApplicationDao.save(dataApplication);
        return res;
    }



    // public JSONObject findAll() {
    //     Page<DataApplication> dataApplicationPage = dataApplicationDao.findByStatusNotLike(PageRequest.of(2, 10, new Sort(Sort.Direction.ASC,"createTime")),"private");
    //
    //     List<DataApplication> dataApplications = dataApplicationPage.getContent();
    //
    //     JSONArray jsonArray = new JSONArray();
    //     for (int i=0;i<dataApplications.size();++i) {
    //
    //         DataApplication dataApplication = dataApplications.get(i);
    //
    //         String oid = dataApplication.getAuthor();
    //         User user = userDao.findFirstByOid(oid);
    //         JSONObject userObject = new JSONObject();
    //         userObject.put("id",user.getOid());
    //         userObject.put("image",user.getImage().equals("")?"":htmlLoadPath + user.getImage());
    //         userObject.put("name",user.getName());
    //
    //         JSONObject jsonObject = new JSONObject();
    //         jsonObject.put("author",userObject);
    //         SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");
    //         jsonObject.put("createTime",simpleDateFormat.format(dataApplication.getCreateTime()));
    //         jsonObject.put("name",dataApplication.getName());
    //         jsonObject.put("description",dataApplication.getDescription());
    //         jsonObject.put("type",dataApplication.getType());
    //         jsonObject.put("status",dataApplication.getStatus());
    //         jsonObject.put("oid",dataApplication.getOid());
    //         jsonArray.add(jsonObject);
    //     }
    //     JSONArray users = new JSONArray();
    //     for(int i=0;i<dataApplications.size();++i) {
    //         DataApplication dataApplication = dataApplications.get(i);
    //         String oid = dataApplication.getAuthor();
    //         User user = userDao.findFirstByOid(oid);
    //         JSONObject userObj = new JSONObject();
    //         userObj.put("userId",user.getUserId());
    //         userObj.put("image", user.getImage().equals("") ? "" : htmlLoadPath + user.getImage());
    //         userObj.put("name", user.getName());
    //         users.add(userObj);
    //
    //         dataApplications.get(i).setAuthor(user.getName());
    //         dataApplications.get(i).setOid(dataApplication.getId());
    //     }
    //     JSONObject res = new JSONObject();
    //     res.put("list",jsonArray);
    //     res.put("total",dataApplicationPage.getTotalElements());
    //     res.put("users",users);
    //     return res;
    // }


    public  Page<DataApplication> selectMethodByNameAndMethod(String name, String method,Pageable pageable) {
        if(name.equals("") && method.equals("")){
            return dataApplicationDao.findAll(pageable);
        }else if(name.equals("") && !method.equals("")){
            return dataApplicationDao.findAllByMethodLikeIgnoreCase(method,pageable);
        }else if(!name.equals("") && method.equals("")){
            return dataApplicationDao.findByNameLike(name,pageable);
        } else{
            return dataApplicationDao.findByMethodLikeIgnoreCaseAndNameLike(method,name,pageable);
        }
    }

    public Page<DataApplication> selectMethodByCurQueryFieldAndMethod(String searchText, String curQueryField, String method,Pageable pageable) {       // 根据类别和搜索方式来查找所有数据
        Page<DataApplication> result;

        if(method.equals("")) {          // 不分类的情况
            if(searchText.equals("")){
                result = dataApplicationDao.findAll(pageable);
            }else{
                switch (curQueryField) {
                    case "name":{
                        result = dataApplicationDao.findAllByNameContainsIgnoreCase(searchText, pageable);
                        break;
                    }
                    case "keyword":{
                        result = dataApplicationDao.findAllByKeywordsContainsIgnoreCase(searchText, pageable);
                        break;
                    }
                    case "content":{
                        result = dataApplicationDao.findAllByDescriptionContainsIgnoreCase(searchText, pageable);
                        break;
                    }
                    case "contributor":{
                        User user = userDao.findFirstByName(searchText);
                        if(user != null){
                            result = dataApplicationDao.findAllByAuthorLikeIgnoreCase(user.getOid(), pageable);
                        } else {        // 娶一个不存在的名字，返回nodata，不能返回null
                            result = dataApplicationDao.findAllByAuthorLikeIgnoreCase("hhhhhhhhhhhhhhhhhh", pageable);
                        }
                        break;
                    }
                    default:{
                        System.out.println("curQueryField" + curQueryField + " is wrong.");
                        return null;
                    }
                }
            }
        } else {
            if(searchText.equals("")){
                result = dataApplicationDao.findAllByMethodLikeIgnoreCase(method, pageable);
            } else {
                switch (curQueryField) {
                    case "name":{
                        result = dataApplicationDao.findAllByNameContainsIgnoreCaseAndMethodLikeIgnoreCase(searchText, method, pageable);
                        break;
                    }
                    case "keyword":{
                        result = dataApplicationDao.findAllByKeywordsContainsIgnoreCaseAndMethodLikeIgnoreCase(searchText, method, pageable);
                        break;
                    }
                    case "content":{
                        result = dataApplicationDao.findAllByDescriptionContainsIgnoreCaseAndMethodLikeIgnoreCase(searchText, method, pageable);
                        break;
                    }
                    case "contributor":{
                        User user = userDao.findFirstByName(searchText);
                        if(user != null){
                            result = dataApplicationDao.findAllByAuthorLikeIgnoreCaseAndMethodLikeIgnoreCase(user.getOid(), method, pageable);
                        } else {    // 娶一个不存在的名字，返回nodata，不能返回null
                            result = dataApplicationDao.findAllByAuthorLikeIgnoreCaseAndMethodLikeIgnoreCase("hhhhhhhhhhhhhhhh", method, pageable);
                        }
                        break;
                    }
                    default:{
                        System.out.println("curQueryField" + curQueryField + " is wrong.");
                        return null;
                    }
                }
            }

        }

        return result;

        // if(searchText.equals("") && method.equals("")){
        //     return dataApplicationDao.findAllByInvokable(pageable,true);
        // }else if(searchText.equals("") && !method.equals("")){
        //     return dataApplicationDao.findAllByMethodLikeIgnoreCaseAndInvokable(method,pageable,true);
        // }else if(!searchText.equals("") && method.equals("")){
        //     return dataApplicationDao.findByNameLikeAndInvokable(searchText,pageable,true);
        // } else{
        //     return dataApplicationDao.findByMethodLikeIgnoreCaseAndNameLikeAndInvokable(method,searchText,pageable,true);
        // }
    }

    public JSONObject searchApplication(DataApplicationFindDTO dataApplicationFindDTO){
        Pageable pageable = PageRequest.of(dataApplicationFindDTO.getPage()-1, dataApplicationFindDTO.getPageSize(), new Sort(dataApplicationFindDTO.getAsc()? Sort.Direction.ASC: Sort.Direction.DESC,dataApplicationFindDTO.getSortField()));
        Page<DataApplication> dataApplicationPage;
        try {
            dataApplicationPage = selectMethodByCurQueryFieldAndMethod(dataApplicationFindDTO.getSearchText(), dataApplicationFindDTO.getCurQueryField(), dataApplicationFindDTO.getMethod(),pageable);
        } catch (MyException err) {
            System.out.println(err);
            return null;
        }

        List<DataApplication> dataApplications = dataApplicationPage.getContent();

        JSONArray jsonArray = new JSONArray();
        for (int i=0;i<dataApplications.size();++i) {

            DataApplication dataApplication = dataApplications.get(i);

            String oid = dataApplication.getAuthor();
            User user = userDao.findFirstByOid(oid);
            JSONObject userObject = new JSONObject();
            userObject.put("id",user.getOid());
            userObject.put("image",user.getImage().equals("")?"":htmlLoadPath + user.getImage());
            userObject.put("name",user.getName());

            JSONObject jsonObject = new JSONObject();
            jsonObject.put("author",userObject);
            SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");
            jsonObject.put("createTime",simpleDateFormat.format(dataApplication.getCreateTime()));
            jsonObject.put("name",dataApplication.getName());
            jsonObject.put("keywords", dataApplication.getKeywords());
            jsonObject.put("description",dataApplication.getDescription());
            jsonObject.put("type",dataApplication.getType());
            jsonObject.put("status",dataApplication.getStatus());
            jsonObject.put("oid",dataApplication.getOid());
            jsonObject.put("viewCount",dataApplication.getViewCount());
            jsonObject.put("dailyViewCount",dataApplication.getDailyViewCount());
            jsonObject.put("invokeServices",dataApplication.getInvokeServices());
            jsonObject.put("authorName",user.getName());
            jsonObject.put("authorId",user.getUserId());
            jsonArray.add(jsonObject);
        }
        JSONArray users = new JSONArray();
        for(int i=0;i<dataApplications.size();++i) {
            DataApplication dataApplication = dataApplications.get(i);
            String oid = dataApplication.getAuthor();
            User user = userDao.findFirstByOid(oid);
            JSONObject userObj = new JSONObject();
            userObj.put("userId",user.getUserId());
            userObj.put("image", user.getImage().equals("") ? "" : htmlLoadPath + user.getImage());
            userObj.put("name", user.getName());
            users.add(userObj);

            dataApplications.get(i).setAuthor(user.getName());
            dataApplications.get(i).setOid(dataApplication.getId());
        }
        JSONObject res = new JSONObject();
        res.put("list",jsonArray);
        res.put("total",dataApplicationPage.getTotalElements());
        res.put("users",users);

        return res;
    }


    public JSONObject searchApplicationInvokable(DataApplicationFindDTO dataApplicationFindDTO){
        Pageable pageable = PageRequest.of(dataApplicationFindDTO.getPage()-1, dataApplicationFindDTO.getPageSize(), new Sort(dataApplicationFindDTO.getAsc()? Sort.Direction.ASC: Sort.Direction.DESC,dataApplicationFindDTO.getSortField()));
        Page<DataApplication> dataApplicationPage;
        try {
            dataApplicationPage = selectMethodByCurQueryFieldAndMethod(dataApplicationFindDTO.getSearchText(),dataApplicationFindDTO.getCurQueryField(), dataApplicationFindDTO.getMethod(), pageable);
        } catch (MyException err) {
            System.out.println(err);
            return null;
        }
        List<DataApplication> dataApplications = dataApplicationPage.getContent();

        JSONArray jsonArray = new JSONArray();
        for (int i=0;i<dataApplications.size();++i) {

            DataApplication dataApplication = dataApplications.get(i);

            String oid = dataApplication.getAuthor();
            User user = userDao.findFirstByOid(oid);
            JSONObject userObject = new JSONObject();
            userObject.put("id",user.getOid());
            userObject.put("image",user.getImage().equals("")?"":htmlLoadPath + user.getImage());
            userObject.put("name",user.getName());

            JSONObject jsonObject = new JSONObject();
            jsonObject.put("author",userObject);
            SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");
            jsonObject.put("createTime",simpleDateFormat.format(dataApplication.getCreateTime()));
            jsonObject.put("name",dataApplication.getName());
            jsonObject.put("description",dataApplication.getDescription());
            jsonObject.put("type",dataApplication.getType());
            jsonObject.put("status",dataApplication.getStatus());
            jsonObject.put("oid",dataApplication.getOid());
            jsonObject.put("viewCount",dataApplication.getViewCount());
            jsonObject.put("dailyViewCount",dataApplication.getDailyViewCount());
            jsonObject.put("invokeServices",dataApplication.getInvokeServices());
            jsonObject.put("authorName",user.getName());
            jsonObject.put("authorId",user.getUserId());
            jsonArray.add(jsonObject);
        }
        JSONArray users = new JSONArray();
        for(int i=0;i<dataApplications.size();++i) {
            DataApplication dataApplication = dataApplications.get(i);
            String oid = dataApplication.getAuthor();
            User user = userDao.findFirstByOid(oid);
            JSONObject userObj = new JSONObject();
            userObj.put("userId",user.getUserId());
            userObj.put("image", user.getImage().equals("") ? "" : htmlLoadPath + user.getImage());
            userObj.put("name", user.getName());
            users.add(userObj);

            dataApplications.get(i).setAuthor(user.getName());
            dataApplications.get(i).setOid(dataApplication.getId());
        }
        JSONObject res = new JSONObject();
        res.put("list",jsonArray);
        res.put("total",dataApplicationPage.getTotalElements());
        res.put("users",users);

        return res;
    }

    // public JSONObject searchByName(DataApplicationFindDTO dataApplicationFindDTO,String userOid) {
    //     int page = dataApplicationFindDTO.getPage()-1;
    //     int pageSize = dataApplicationFindDTO.getPageSize();
    //     String searchText = dataApplicationFindDTO.getSearchText();
    //     Sort sort = new Sort(dataApplicationFindDTO.getAsc() ? Sort.Direction.ASC:Sort.Direction.DESC, dataApplicationFindDTO.getSortField());
    //     Pageable pageable = PageRequest.of(page,pageSize,sort);
    //     Page<DataApplication> dataApplicationPage;
    //     if(userOid==null){
    //
    //     }
    //
    // }

    public Categorys getCateId(String id) {
        return categoryDao.findById(id).orElseGet(() -> {

            System.out.println("有人乱查数据库！！该ID不存在对象:" + id);

            throw new MyException(ResultEnum.NO_OBJECT);

        });
    }

    // //分类加关键字
    // public Page<DataApplication> listBySearch(DataApplicationFindDTO dataApplicationFindDTO) {
    //     List<String> dataApplicationId = new ArrayList<>();
    //     dataApplicationId = getCateId(dataApplicationFindDTO.getCategoryId()).getDataItem();
    //     DataApplication dataApplication = new DataApplication();
    //     List<DataApplication> res = new ArrayList<>();
    //     for(int i=0;i<dataApplicationId.size();++i){
    //         dataApplication = getById(dataApplicationId.get(i));
    //         for(int j=0;j<dataApplicationFindDTO.getSearchContent().size();++j){
    //             if(dataApplication.getName().contains(dataApplicationFindDTO.getSearchContent().get(j))||dataApplication.getDescription().contains(dataApplicationFindDTO.getSearchContent().get(i))){
    //                 res.add(dataApplication);
    //             }
    //         }
    //     }
    //     List<DataApplication> findList = new ArrayList<>();
    //     Integer ind = (dataApplicationFindDTO.getPage()*dataApplicationFindDTO.getPageSize() - dataApplicationFindDTO.getPageSize());
    //     if(res.size()<=dataApplicationFindDTO.getPageSize()) {
    //         findList = res;
    //     } else {
    //         if(ind + dataApplicationFindDTO.getPageSize() > res.size()) {
    //             int exp = res.size()%dataApplicationFindDTO.getPageSize();
    //             if((ind%dataApplicationFindDTO.getPageSize())==exp) {
    //                 findList.add(res.get(ind));
    //             } else {
    //                 findList = res.subList(ind,ind+exp);
    //             }
    //         }else{
    //             findList = res.subList(ind,ind+dataApplicationFindDTO.getPageSize());
    //         }
    //     }
    //     Sort sort = new Sort(dataApplicationFindDTO.getAsc()? Sort.Direction.ASC: Sort.Direction.DESC,"createTime");
    //     Page pageResult = new PageImpl(findList,new PageRequest(dataApplicationFindDTO.getPage(),dataApplicationFindDTO.getPageSize(),sort),res.size());
    //     return pageResult;
    // }
    //
    // public JSONObject searchResourceByCate(DataApplicationFindDTO dataApplicationFindDTO) {
    //     int page = dataApplicationFindDTO.getPage();
    //     int pageSize = dataApplicationFindDTO.getPageSize();
    //     Sort sort = new Sort(dataApplicationFindDTO.getAsc()? Sort.Direction.ASC: Sort.Direction.DESC,"viewCount");
    //     Pageable pageable = PageRequest.of(page,pageSize,sort);
    //
    //     Page<DataApplication> dataApplicationPage = dataApplicationDao.findByClassificationsInAndStatusNotLike(dataApplicationFindDTO.getClassifications(),pageable,"Private");
    //     List<DataApplication> dataApplications = dataApplicationPage.getContent();
    //
    //     JSONArray users = new JSONArray();
    //     for(int i=0;i<dataApplications.size();++i) {
    //         DataApplication dataApplication = dataApplications.get(i);
    //         String oid = dataApplication.getAuthor();
    //         User user = userDao.findFirstByOid(oid);
    //         JSONObject userObj = new JSONObject();
    //         userObj.put("oid", user.getOid());
    //         userObj.put("image", user.getImage().equals("") ? "" : htmlLoadPath + user.getImage());
    //         userObj.put("name", user.getName());
    //         users.add(userObj);
    //
    //         dataApplications.get(i).setAuthor(user.getName());
    //         dataApplications.get(i).setOid(dataApplication.getId());
    //     }
    //
    //     JSONArray jsonArray = new JSONArray();
    //     for (int i=0;i<dataApplications.size();++i) {
    //         JSONObject jsonObject = new JSONObject();
    //         DataApplication dataApplication = dataApplications.get(i);
    //
    //         String oid = dataApplication.getAuthor();
    //         User user = userDao.findFirstByOid(oid);
    //         JSONObject userObject = new JSONObject();
    //         userObject.put("oid",user.getOid());
    //         userObject.put("image",user.getImage().equals("")?"":htmlLoadPath + user.getImage());
    //         userObject.put("name",user.getName());
    //
    //         jsonObject.put("author",userObject);
    //         SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");
    //         jsonObject.put("createTime",simpleDateFormat.format(dataApplication.getCreateTime()));
    //         jsonObject.put("name",dataApplication.getName());
    //         jsonObject.put("description",dataApplication.getDescription());
    //         jsonObject.put("type",dataApplication.getType());
    //         jsonObject.put("status",dataApplication.getStatus());
    //         jsonArray.add(jsonObject);
    //     }
    //     JSONObject res = new JSONObject();
    //     res.put("list",jsonArray);
    //     res.put("total",dataApplicationPage.getTotalElements());
    //     res.put("users",users);
    //     return res;
    // }
    //
    // public JSONObject searchByName(DataApplicationFindDTO dataApplicationFindDTO,String userOid) {
    //     int page = dataApplicationFindDTO.getPage() - 1;
    //     int pageSize = dataApplicationFindDTO.getPageSize();
    //     String searchText = dataApplicationFindDTO.getSearchText();
    //
    //     Sort sort = new Sort(dataApplicationFindDTO.getAsc() ? Sort.Direction.ASC : Sort.Direction.DESC, dataApplicationFindDTO.getSortField());
    //     Pageable pageable = PageRequest.of(page, pageSize, sort);
    //
    //     Page<DataApplication> dataApplicationPage = dataApplicationDao.findByNameLikeAndStatusNotLike(pageable,dataApplicationFindDTO.getSearchText(),"Private");
    //     List<DataApplication> dataApplications = dataApplicationPage.getContent();
    //
    //     JSONArray users = new JSONArray();
    //     for(int i=0;i<dataApplications.size();++i) {
    //         DataApplication dataApplication = dataApplications.get(i);
    //         String oid = dataApplication.getAuthor();
    //         User user = userDao.findFirstByOid(oid);
    //         JSONObject userObj = new JSONObject();
    //         userObj.put("oid", user.getOid());
    //         userObj.put("image", user.getImage().equals("") ? "" : htmlLoadPath + user.getImage());
    //         userObj.put("name", user.getName());
    //         users.add(userObj);
    //
    //         dataApplications.get(i).setAuthor(user.getName());
    //         dataApplications.get(i).setOid(dataApplication.getId());
    //     }
    //
    //     JSONObject res = new JSONObject();
    //     res.put("list",dataApplications);
    //     res.put("total",dataApplicationPage.getTotalElements());
    //     res.put("pages",dataApplicationPage.getTotalPages());
    //     res.put("users",users);
    //
    //     return  res;
    // }

    public void parseXML(JSONObject jsonObject, String xml) throws DocumentException {
        //解析xml  利用Iterator获取xml的各种子节点
        Document document = DocumentHelper.parseText(xml);
        Element root = document.getRootElement();
        ArrayList<String> parameters = new ArrayList<>();
        List<Element> pas = root.element("Parameter").elements();
        for (Element e : pas) {
            log.info(e.attributeValue("name"));
            parameters.add(e.attributeValue("name"));
        }
        jsonObject.put("parameters", parameters);
        jsonObject.put("xml", xml);
    }

    /**
     * 判断token是否在线
     * @param token token值
     * @return 是否在线，在线为true，离线为false
     * @throws UnsupportedEncodingException 抛出异常
     */
    public Boolean isOnline(String token) throws UnsupportedEncodingException {
        token = URLEncoder.encode(token, "UTF-8");
        String url = "http://" + dataServerManager + "/state?token=" + token;
        log.info(url);

        //调用url
        RestTemplate restTemplate = new RestTemplate();

        String response = restTemplate.getForObject(url,String.class);
        JSONObject jsonObject = JSON.parseObject(response);

        if(jsonObject.getString("code").equals("0")){
            return true;
        }else {
            return false;
        }
    }


    public Date randomDate(String beginDate,String endDate ){

        try {

            SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");

            Date start = format.parse(beginDate);//构造开始日期

            Date end = format.parse(endDate);//构造结束日期

//getTime()表示返回自 1970 年 1 月 1 日 00:00:00 GMT 以来此 Date 对象表示的毫秒数。

            if(start.getTime() >= end.getTime()){

                return null;

            }

            long date = random(start.getTime(),end.getTime());

            return new Date(date);

        } catch (Exception e) {

            e.printStackTrace();

        }

        return null;

    }

    private static long random(long begin,long end){

        long rtn = begin + (long)(Math.random() * (end - begin));

//如果返回的是开始时间和结束时间，则递归调用本函数查找随机值

        if(rtn == begin || rtn == end){

            return random(begin,end);

        }

        return rtn;

    }

}
