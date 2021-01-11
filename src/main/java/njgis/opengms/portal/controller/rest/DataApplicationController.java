package njgis.opengms.portal.controller.rest;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import lombok.extern.slf4j.Slf4j;
import com.google.gson.JsonObject;
import njgis.opengms.portal.bean.JsonResult;
import njgis.opengms.portal.bean.LoginRequired;
import njgis.opengms.portal.dao.DataApplicationDao;
import njgis.opengms.portal.dao.DataServerTaskDao;
import njgis.opengms.portal.dao.ThemeDao;
import njgis.opengms.portal.dao.UserDao;
import njgis.opengms.portal.dto.dataApplication.DataApplicationDTO;
import njgis.opengms.portal.dto.dataApplication.DataApplicationFindDTO;
import njgis.opengms.portal.entity.*;
import njgis.opengms.portal.entity.support.InvokeService;
import njgis.opengms.portal.entity.support.Maintainer;
import njgis.opengms.portal.entity.support.TestData;
import njgis.opengms.portal.exception.MyException;
import njgis.opengms.portal.service.DataApplicationService;
import njgis.opengms.portal.service.DataItemService;
import njgis.opengms.portal.service.UserService;
import njgis.opengms.portal.utils.ResultUtils;
import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.io.IOUtils;
import org.apache.http.HttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.util.EntityUtils;
import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.DocumentHelper;
import org.dom4j.Element;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.StringHttpMessageConverter;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.servlet.ModelAndView;
import springfox.documentation.spring.web.json.Json;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.io.*;
import javax.xml.crypto.Data;
import java.net.*;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.util.*;

import static njgis.opengms.portal.utils.Tools.JsonToXml;


/**
 * @Author mingyuan
 * @Date 2020.07.30 11:07
 */
@RestController
@Slf4j
@RequestMapping(value = "/dataApplication")
public class DataApplicationController {
    @Autowired
    DataApplicationService dataApplicationService;

    @Autowired
    UserService userService;

    @Autowired
    DataItemService dataItemService;

    @Autowired
    DataApplicationDao dataApplicationDao;

    @Autowired
    UserDao userDao;

    @Value("${htmlLoadPath}")
    private String htmlLoadPath;

    // 模仿Thematic写的data_application_center,没有写后台
    @Autowired
    ThemeDao themeDao;

    @Autowired
    DataServerTaskDao dataServerTaskDao;

    @Value("${resourcePath}")
    private String resourcePath;

    @Value("${dataServerManager}")
    private String dataServerManager;

    @RequestMapping(value = "/center",method = RequestMethod.GET)
    public ModelAndView getThematic() {

        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("data_application_center");


        List<Theme> themes= themeDao.findAll();
        JSONArray themeRs = new JSONArray();
        for (int i=0;i<themes.size();i++){
            JSONObject themeR = new JSONObject();
            themeR.put("oid",themes.get(i).getOid());
            themeR.put("img",themes.get(i).getImage());
            themeR.put("status",themes.get(i).getStatus());
            themeR.put("creator_name",themes.get(i).getCreator_name());
            themeR.put("creator_oid",themes.get(i).getCreator_oid());
            themeR.put("name",themes.get(i).getThemename());
            themeRs.add(themeR);
        }
        modelAndView.addObject("themeResult",themeRs);

        return modelAndView;
    }

    /**
     * 通过导航栏，打开dataApplication首页
     * @auther wuTian
     * @return modelAndView
     */

    @RequestMapping(value = "/methods")
    public ModelAndView getMethods() {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("data_application_repository");
        return modelAndView;
    }

    /**
     * dataApplications增删改
     * @return 成功/失败
     */

    @RequestMapping(value = "/add", method = RequestMethod.POST)
    public JsonResult add(HttpServletRequest request) throws IOException {
        MultipartHttpServletRequest multipartRequest = (MultipartHttpServletRequest) request;
        List<MultipartFile> files=multipartRequest.getFiles("resources");
        MultipartFile file=multipartRequest.getFile("dataApplication");
        String model= IOUtils.toString(file.getInputStream(),"utf-8");
        JSONObject jsonObject=JSONObject.parseObject(model);
        DataApplicationDTO dataApplicationDTO = JSONObject.toJavaObject(jsonObject,DataApplicationDTO.class);


        HttpSession session=request.getSession();
        String oid=session.getAttribute("oid").toString();
        if(oid==null){
            return ResultUtils.error(-2,"未登录");
        }
        JSONObject result=dataApplicationService.insert(files,jsonObject,oid,dataApplicationDTO);

        return ResultUtils.success(result);
    }

    @RequestMapping(value = "/delete", method = RequestMethod.POST)
    public JsonResult deleteDataApplication(@RequestParam(value="oid") String oid, HttpServletRequest request){
        HttpSession session=request.getSession();

        if(session.getAttribute("uid")==null){
            return ResultUtils.error(-1,"no login");
        }
        String userName=session.getAttribute("uid").toString();
        return ResultUtils.success(dataApplicationService.delete(oid));
    }

    @RequestMapping (value="/update",method = RequestMethod.POST)
    public JsonResult update(HttpServletRequest request) throws IOException {

        MultipartHttpServletRequest multipartRequest = (MultipartHttpServletRequest) request;
        List<MultipartFile> files=multipartRequest.getFiles("resources");
        MultipartFile file=multipartRequest.getFile("dataApplication");
        String model=IOUtils.toString(file.getInputStream(),"utf-8");
        JSONObject jsonObject=JSONObject.parseObject(model);
        DataApplicationDTO dataApplicationDTO = JSONObject.toJavaObject(jsonObject,DataApplicationDTO.class);

        HttpSession session=request.getSession();
        String oid=session.getAttribute("oid").toString();
        if(oid==null){
            return ResultUtils.error(-2,"未登录");
        }
        JSONObject result=dataApplicationService.update(files,jsonObject,oid,dataApplicationDTO);

        if(result==null){
            return ResultUtils.error(-1,"There is another version have not been checked, please contact opengms@njnu.edu.cn if you want to modify this item.");
        }
        else {
            return ResultUtils.success(result);
        }
    }

    @RequestMapping(value = "/getApplication", method = RequestMethod.GET)      // 这是拿到用户上传的所有条目
    public JsonResult getUserUploadData(@RequestParam(value = "userOid", required = false) String userOid,
                                        @RequestParam(value = "page", required = false) Integer page,
                                        @RequestParam(value = "pagesize", required = false) Integer pagesize,
                                        @RequestParam(value = "asc", required = false) Integer asc,
                                        @RequestParam(value = "type", required = false) String type
    ) {
        return ResultUtils.success(dataApplicationService.getUsersUploadData(userOid, page - 1, pagesize, asc,type));
    }

    @RequestMapping(value = "/getApplication/{oid}",method = RequestMethod.GET)     // 根据oid拿到条目的所有信息
    public JsonResult getApplicationByOid(@PathVariable("oid") String oid) throws UnsupportedEncodingException {
        DataApplication dataApplication = dataApplicationDao.findFirstByOid(oid);
        dataApplication = dataApplicationService.recordViewCount(dataApplication);
        dataApplicationDao.save(dataApplication);
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("dataApplication", dataApplication);
        List<InvokeService> invokeServices = dataApplication.getInvokeServices();
        for (InvokeService invokeService:invokeServices){
            String token = invokeService.getToken();
            boolean isOnline = dataApplicationService.isOnline(token);
            if(isOnline){
                invokeService.setOnlineStatus("online");
            }else {
                invokeService.setOnlineStatus("offline");
            }
        }

        return ResultUtils.success(JSONObject.toJSON(dataApplication));
    }

    @RequestMapping (value="/{id}",method = RequestMethod.GET)
    public ModelAndView get(@PathVariable("id") String id){
        return dataApplicationService.getPage(id);
    }


    @RequestMapping(value="/searchDataByUserId",method = RequestMethod.GET)
    public JsonResult searchDataByUserId(
            @RequestParam(value="userOid") String userOid,
            @RequestParam(value="page") int page,
            @RequestParam(value="pageSize") int pagesize,
            @RequestParam(value="asc") int asc,
            @RequestParam(value="searchText") String searchText,
            @RequestParam(value = "type") String type
    ){
        return ResultUtils.success(dataApplicationService.searchDataByUserId(userOid,page,pagesize,asc,searchText,type));
    }


    @RequestMapping (value="/getInfo/{oid}",method = RequestMethod.GET)
    public JsonResult getInfo(@PathVariable ("oid") String oid){
        DataApplication dataApplication = dataApplicationService.getById(oid);
//        ComputableModelResultDTO computableModelResultDTO=new ComputableModelResultDTO();
//        ModelItem modelItem=modelItemService.getByOid(computableModel.getRelateModelItem());
//        BeanUtils.copyProperties(computableModel,computableModelResultDTO);
//        computableModelResultDTO.setRelateModelItemName(modelItem.getName());

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
                jsonObject.put("id", i);
                jsonObject.put("name", name);
                jsonObject.put("suffix", suffix);
                jsonObject.put("path",htmlLoadPath+resources.get(i));
                resourceArray.add(jsonObject);

            }

        }

        List<String> cates = new ArrayList<>();
        cates = dataApplication.getClassifications();
        List<String> categorys = new ArrayList<>();
        for(String cate : cates){
            DataCategorys dataCategorys = dataItemService.getCategoryById(cate);
            categorys.add(dataCategorys.getCategory());
        }

        dataApplication.setCategorys(categorys);

        dataApplication.setResourceJson(resourceArray);

        return ResultUtils.success(dataApplication);
    }



    /**
     * 通过数据条目页面，打开dataApplication页面,这里面根据的是_id来进行访问的，前面个是根据oid来访问的
     */
//    @RequestMapping(value = "/methods/{id}",method = RequestMethod.GET)
//    ModelAndView getPage(@PathVariable("id") String id) {
//        return dataApplicationService.getPageWith_id(id);
//    }


    /**
     * 获取application信息
     * @param dataApplicationFindDTO DTO
     * @return application 信息
     */
    @RequestMapping(value = "/methods/getApplication",method = RequestMethod.POST)
    JsonResult getApplication(@RequestBody DataApplicationFindDTO dataApplicationFindDTO){
        return  ResultUtils.success(dataApplicationService.searchApplication(dataApplicationFindDTO));
    }

    @RequestMapping(value = "/methods/getApplicationInvokable",method = RequestMethod.POST)
    JsonResult getApplicationInvokable(@RequestBody DataApplicationFindDTO dataApplicationFindDTO){
        return  ResultUtils.success(dataApplicationService.searchApplication(dataApplicationFindDTO));
    }

    /**
     * 调用服务
     * @param dataApplicationId dataApplicationId
     * @param serviceId serviceId
     * @param serviceName serviceName
     * @param params 调用所需的参数
     * @param request request
     * @param selectData onlineData所选的数据，可选传
     * @param integrate 是否集成的调用，集成的调用则标识"integrate", 可选
     * @return invokeService
     * @throws UnsupportedEncodingException UnsupportedEncodingException
     * @throws MalformedURLException MalformedURLException
     * @throws DocumentException DocumentException
     */
    @RequestMapping(value = "/invokeMethod", method = RequestMethod.POST)
    JsonResult invokeMethod(@RequestParam(value = "dataApplicationId") String dataApplicationId,
                            @RequestParam(value = "serviceId") String serviceId,
                            @RequestParam(value = "serviceName") String serviceName,
                            @RequestParam(value = "params") String[] params,
//                            @RequestParam(value = "dataType") String dataType,
                            @RequestParam(value = "selectData",  required = false) String selectData,
                            @RequestParam(value = "integrate",  required = false) String integrate,
                            HttpServletRequest request) throws IOException, DocumentException {
        JsonResult jsonResult = new JsonResult();
        DataServerTask dataServerTask = new DataServerTask();
        Date date = new Date();
        dataServerTask.setRunTime(date);
        dataServerTask.setOid(UUID.randomUUID().toString());
        dataServerTask.setServiceId(serviceId);
        dataServerTask.setServiceName(serviceName);
//        dataServerTask.setDataType(dataType);
        if (integrate!=null){
            dataServerTask.setIntegrate(true);
        }else {
            dataServerTask.setIntegrate(false);
        }


        DataApplication dataApplication = dataApplicationDao.findFirstByOid(dataApplicationId);
        List<InvokeService> invokeServices = dataApplication.getInvokeServices();
        //门户测试解绑
        HttpSession session=request.getSession();
        if(session.getAttribute("uid")==null){
            return ResultUtils.error(-1,"no login");
        }
        String reqUsrId = session.getAttribute("uid").toString();
        dataServerTask.setUserId(reqUsrId);
        //String reqUsrId = "33";//门户测试时注释掉

        InvokeService invokeService = null;
        for (InvokeService invokeService1 : invokeServices){
            if(invokeService1.getServiceId().equals(serviceId)){
                invokeService = invokeService1;
                break;
            }
        }
        //三种接口都需要的参数
        String token = invokeService.getToken();//需要存起来，拿token
        token = URLEncoder.encode(token, "UTF-8");

//        String response = null;
        //具体invoke,获取结果数据
        String url = null;
        String urlRes = null;
//        String parameters = "";
//        for(int i=0;i< params.length;i++){
//            parameters += params[i];
//            if(i != params.length-1){
//                parameters += ",";
//            }
//        }
        JSONObject input = new JSONObject();
//        if(dataType.equals("localData")){
//            //数据为测试数据
//            url = "http://111.229.14.128:8898/extPcs?dataId=";//invoke接口
//            List<String> dataIds = invokeService.getDataIds();
//            url += dataIds.get(0);
//            //将输入数据化为jsonobject的数据
//            input.put("input", dataApplication.getTestData());
//            dataServerTask.setInput(input);
//
//            url += ("&params=" + parameters);
//            url += ("&name=" + invokeService.getName());
//            url += ("&token=" + token);//token注意要加密  注意此处使用门户节点的token，目前先用我的token代替
//            url += ("&reqUsrOid=" + reqUsrId);
//            url += ("&pcsId=" + serviceId);
//        } else {
            //数据为可下载数据的url  此调用为post
//            String downloadLink = "";
            //设置input数据
            input.put("input", selectData);
            dataServerTask.setInput(input);
            //将所有参数放到一个JSON中
        JSONObject postParams = new JSONObject();
        postParams.put("token", token);
        postParams.put("pcsId", serviceId);
//        String[] tmp1 = new String[params.length];
//        for (int i=0;i< params.length;i++){
//            tmp1[i] = URLEncoder.encode(params[i], "gb2312");
//        }

        postParams.put("params", params);


            JSONArray postUrls = new JSONArray();
//        MultiValueMap<String, Object> part = new LinkedMultiValueMap<>();

            if(selectData!=null) {
                JSONArray jsonArray = JSONArray.parseArray(selectData);
                JSONObject tmp = new JSONObject();
//                String[] resUrl = new String[jsonArray.size()];
                for (int i=0;i<jsonArray.size();i++){
                    tmp.put(jsonArray.getJSONObject(i).getString("name"), jsonArray.getJSONObject(i).getString("url"));
                }
                postParams.put("urls", tmp);
//                part.add("urls", tmp);


//                log.info(jsonArray.get(0).toString());
                //拼接url
//                JSONObject jsonObject = null;
//                for(int i=0;i<jsonArray.size();i++){
//                    jsonObject = (JSONObject) jsonArray.get(i);
//                    downloadLink += jsonObject.getString("url");
//                    if(i != jsonArray.size()-1){
//                        downloadLink += ",";
//                    }
//                }
//                log.info(downloadLink);
            }
            url="http://111.229.14.128:8898/invokeUrlsDataPcsWithKey";

//            MultiValueMap<String, Object> part = new LinkedMultiValueMap<>();


//            part.add("token", token);
//            part.add("pcsId", serviceId);
//            String[] postUrlsString = new String[postUrls.size()];
//            for(int i=0;i<postUrls.size();i++){
//                postUrlsString[i] = postUrls.get(i).toString();
//            }

//            part.add("params", params);
//            HttpHeaders headers = new HttpHeaders();
//            headers.add("Content-Type","application/json");
//            HttpEntity<MultiValueMap> requestEntity = new HttpEntity<MultiValueMap>(part, headers);

//            RestTemplate restTemplate = new RestTemplate();
//            try {
//                response = restTemplate.postForObject(url, requestEntity, String.class);
//            }catch (ResourceAccessException e){
//                jsonResult.setCode(1);
//                jsonResult.setMsg("request time out!");
//                dataServerTask.setStatus(-1);
//                dataServerTaskDao.insert(dataServerTask);
//                return jsonResult;
//            }


        String json = postParams.toJSONString();
        CloseableHttpClient httpClient = HttpClientBuilder.create().build();
        HttpPost post = new HttpPost(url);
        StringEntity postingString = new StringEntity(json,"UTF-8");// json传递
        post.setEntity(postingString);
        post.setHeader("Content-type", "application/json");
        HttpResponse response = null;
        try {
            response = httpClient.execute(post);
        }catch (ResourceAccessException e){
            jsonResult.setCode(1);
            dataServerTask.setStatus(-1);
            dataServerTaskDao.insert(dataServerTask);
            jsonResult.setMsg("request time out!");
            return jsonResult;
        }
        String content = EntityUtils.toString(response.getEntity());
// Log.i("test",content);
        System.out.println(content);
        JSONObject resp = JSON.parseObject(content);

//        }
//        if(!dataType.equals("onlineData")){
//            log.info(url);
//            //调用url
//            RestTemplate restTemplate = new RestTemplate();
//            try {
//                response = restTemplate.getForObject(url,String.class);
//            }catch (ResourceAccessException e){
//                jsonResult.setCode(1);
//                dataServerTask.setStatus(-1);
//                dataServerTaskDao.insert(dataServerTask);
//                jsonResult.setMsg("request time out!");
//                return jsonResult;
//            }
//        }
        log.info(response + "");
//        if(!dataType.equals("localData")) {
//            JSONObject resp = JSON.parseObject(response);
//            //捕获sdk错误
            if (resp.getString("code").equals("-1")){
                jsonResult.setMsg("code:-1,message:err");
                jsonResult.setCode(-2);
                jsonResult.setData(resp);

                dataServerTask.setPermission("private");
                dataServerTask.setStatus(-1);//运行失败

                dataServerTaskDao.insert(dataServerTask);
                return jsonResult;
            }
//
            urlRes = resp.getString("url");
//        }
//        else {
//            //解析xml，获取下载链接
//            //将string串读取为xml
//            Document configXML = DocumentHelper.parseText(response);
//            //获取根元素
//            Element root = configXML.getRootElement();
//            urlRes = root.element("uid").getText();
//        }
        //运行成功后，将信息存储到dataTask中
        //ip 与 port暂时不设
        Date date1 = new Date();
        dataServerTask.setFinishTime(date1);
        dataServerTask.setPermission("private");
        JSONObject output = new JSONObject();
        output.put("output", urlRes);
        dataServerTask.setOutput(output);
        dataServerTask.setStatus(2);//成功运行

        dataServerTaskDao.insert(dataServerTask);
        invokeService.setCacheUrl(urlRes);
        dataApplication.setInvokeServices(invokeServices);
        dataApplicationDao.save(dataApplication);
        JSONObject res = new JSONObject();
        res.put("invokeService", invokeService);
        res.put("task", dataServerTask);

        jsonResult.setData(res);

//        if(invokeService.getMethod().equals("Visualization")){
//            if(!dataApplicationService.initVisual(urlRes, dataServerTask)){
//                jsonResult.setMsg("visual error");
//            }else {
//                jsonResult.setMsg("suc");
//            }
//        }

        jsonResult.setCode(0);
        return jsonResult;
    }

    /**
     * 展示task页面
     * @param aid applicationId
     * @param sid serviceId
     * @return
     */
    @LoginRequired
    @RequestMapping(value = "/task/{aid}/{sid}/{token}", method = RequestMethod.GET)
    ModelAndView getTask(@PathVariable String aid,@PathVariable String sid,@PathVariable String token){
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("data_application_task");
        return modelAndView;
    }

    /**
     * 获取xml以及paremeter
     * @return 所需的xml以及运行参数
     */
    @RequestMapping(value = "/getParemeter/{aid}/{sid}", method = RequestMethod.GET)
    public JsonResult getParemeter(@PathVariable String aid, @PathVariable String sid) throws IOException, DocumentException {
        JsonResult jsonResult = new JsonResult();
        DataApplication dataApplication = dataApplicationDao.findFirstByOid(aid);
        //先取到service信息
        InvokeService invokeService = new InvokeService();
        List<InvokeService> invokeServices = dataApplication.getInvokeServices();
        for (InvokeService invokeService1 : invokeServices){
            if (invokeService1.getServiceId().equals(sid)){
                invokeService = invokeService1;
                break;
            }
        }
        JSONObject jsonObject = new JSONObject();
        String metaDetail = null;
//        if (!invokeService.getIsPortal()){
        String token = invokeService.getToken();//需要存起来，拿token
        token = URLEncoder.encode(token, "UTF-8");
        String url = "http://" + dataServerManager + "/capability?id=" + invokeService.getServiceId();
        String type = invokeService.getMethod();
        if(type.equals("Conversion")||type.equals("Processing")){
            type = "Processing";
        }
        url += ("&type=" + type);
        url += ("&token=" + token);
        log.info(url);
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Type","application/json");

        //调用url
        RestTemplate restTemplate = new RestTemplate();
        List<HttpMessageConverter<?>> httpMessageConverters = restTemplate.getMessageConverters();
        httpMessageConverters.stream().forEach(httpMessageConverter -> {
            if(httpMessageConverter instanceof StringHttpMessageConverter){
                StringHttpMessageConverter messageConverter = (StringHttpMessageConverter) httpMessageConverter;
                messageConverter.setDefaultCharset(Charset.forName("UTF-8"));
            }
        });
//            String response = restTemplate.getForObject(url,String.class);
        HttpEntity<MultiValueMap> requestEntity = new HttpEntity<MultiValueMap>(null, headers);
        ResponseEntity<JSONObject> response = restTemplate.exchange(url.trim(),HttpMethod.GET, requestEntity, JSONObject.class);
        JSONObject j_result = response.getBody();
//        LinkedHashMap linkedHashMap = j_result.get("Capability");
//        metaDetail = j_result.getString("metaDetail");
//            Document document = DocumentHelper.parseText(response);
//            Element root = document.getRootElement();
//            String xml = root.element("metaDetail").element("Method").asXML();
//            log.info(xml);
//            dataApplicationService.parseXML(jsonObject,xml);
//        }
//        else {
//            String packagePath = dataApplication.getPackagePath();
//            File file = new File(packagePath);
//            File[] files = file.listFiles();
//            String fileName = null;
//            for (File file1 : files) {
//                fileName = file1.getName();
//                if (file1.getName().substring(file1.getName().lastIndexOf(".")).equals(".xml")) {
//                    //解析xml文件
//                    if (!file1.exists()) {
//                        return null;
//                    }
//                    FileInputStream inputStream = new FileInputStream(file1);
//                    int length = inputStream.available();
//                    byte bytes[] = new byte[length];
//                    inputStream.read(bytes);
//                    inputStream.close();
//                    String xml = new String(bytes, StandardCharsets.UTF_8);
//                     dataApplicationService.parseXML(jsonObject,xml);
//                    break;
//                }
//            }
//        }
        jsonResult.setData(j_result);
        jsonResult.setCode(0);
        jsonResult.setMsg("suc");

        return jsonResult;
    }

    /**
     * 获取服务的相关信息
     * @param aid 数据应用id
     * @param sid 服务id
     * @return
     */
    @RequestMapping(value = "/getServiceInfo/{aid}/{sid}", method = RequestMethod.GET)
    public JsonResult getServiceInfo(@PathVariable String aid,@PathVariable String sid) throws UnsupportedEncodingException {
        JsonResult jsonResult = new JsonResult();
        DataApplication dataApplication = dataApplicationDao.findFirstByOid(aid);
        if(dataApplication == null){
            jsonResult.setMsg("err");
            jsonResult.setCode(-1);
            return jsonResult;
        }
        JSONObject jsonObject = new JSONObject();

        //invokeService
        List<InvokeService> invokeServices = dataApplication.getInvokeServices();
        boolean isPortal = false;
        List<String> dataIds = null;
        for (InvokeService invokeService1:invokeServices){
            if(invokeService1.getServiceId().equals(sid)){
                jsonObject.put("service", invokeService1);
                isPortal = invokeService1.getIsPortal();
                dataIds = invokeService1.getDataIds();
                String token = invokeService1.getToken();
                jsonObject.put("onlineStatus", dataApplicationService.isOnline(token));
                break;
            }
        }
        //testData
        if (isPortal) {
            jsonObject.put("testData", dataApplication.getTestData());
        }else {
            jsonObject.put("testData", dataIds);//这个需要获取数据信息的接口才能使用
        }
        jsonObject.put("application", dataApplication);


        jsonResult.setData(jsonObject);
        return jsonResult;
    }

    /**
     * data_application_info页面获取节点在线状态
     * @param token 服务token
     * @return 在线状态
     */
    @RequestMapping(value = "/getOnlineStatus",method = RequestMethod.POST)
    public JsonResult getOnlineStatus(@RequestParam(value = "token") List<String> token) throws UnsupportedEncodingException {
        JsonResult jsonResult = new JsonResult();
        String[] status = new String[token.size()];//java 数组有序
        int i=0;
        for (String token1:token) {
            boolean isOnline = dataApplicationService.isOnline(token1);
            if(isOnline){
                status[i++] = "online";
            }else {
                status[i++] = "offline";
            }
        }
        jsonResult.setData(status);
        return jsonResult;
    }

    /**
     * 上传测试数据
     * @param files 上传的文件
     * @param uploadName 上传的文件名称
     * @param userName userName
     * @param serverNode serveNode
     * @param origination origination
     * @return 数据可下载的oid
     */
    @RequestMapping(value = "/uploadData", method = RequestMethod.POST)
    public JsonResult uploadData(@RequestParam("ogmsdata") MultipartFile[] files,
                                 @RequestParam("name")String uploadName,
                                 @RequestParam("userId")String userName,
                                 @RequestParam("serverNode")String serverNode,
                                 @RequestParam("origination")String origination){
        JsonResult jsonResult = new JsonResult();
        MultiValueMap<String, Object> part = new LinkedMultiValueMap<>();

        for(int i=0;i<files.length;i++)
            part.add("ogmsdata", files[i].getResource());
        part.add("name", uploadName);
        part.add("userId", userName);
        part.add("serverNode", serverNode);
        part.add("origination", origination);
        String url="http://"+ "111.229.14.128:8899/data";

        RestTemplate restTemplate = new RestTemplate();

        JSONObject jsonObject = restTemplate.postForObject(url, part, JSONObject.class);

        if(jsonObject.getIntValue("code") == -1){
            throw new MyException("远程服务出错");
        }

        jsonResult.setData(jsonObject);
        log.info(jsonObject+"");
        return jsonResult;
    }

    /**
     * 通过服务id与token获取服务所绑定的数据的信息，包括文件名与url
     * @param sid 服务id
     * @param token 节点token
     * @return 服务绑定的数据信息
     */
    @RequestMapping(value = "/getRemoteDataInfo/{sid}/{token}", method = RequestMethod.GET)
    public JsonResult getRemoteDataInfo(@PathVariable(value = "sid") String sid,@PathVariable(value = "token") String token){
        JsonResult jsonResult = new JsonResult();
        try {
//            token = URLEncoder.encode(token, "UTF-8");
            String url = "http://111.229.14.128:8898/files?id=" + sid + "&token=" + token;
            HttpHeaders headers = new HttpHeaders();
            headers.add("Content-Type","application/json");
            RestTemplate restTemplate = new RestTemplate();
            HttpEntity<MultiValueMap> requestEntity = new HttpEntity<MultiValueMap>(null, headers);
            ResponseEntity<JSONObject> response = restTemplate.exchange(url.trim(),HttpMethod.GET, requestEntity, JSONObject.class);
            JSONObject j_result = response.getBody();
            if(j_result.getString("code")!=null &&j_result.getString("code").equals("-1")){
                jsonResult.setMsg("node offline");
                jsonResult.setCode(-1);
                jsonResult.setData(j_result);
            }else{
                jsonResult.setData(j_result);
                jsonResult.setCode(0);
                jsonResult.setMsg("success");
            }

        }catch (ResourceAccessException e){
            jsonResult.setCode(1);
            jsonResult.setMsg("request time out or UnsupportedEncodingException");
            return jsonResult;
        }
        return jsonResult;
    }

    /**
     * 可视化数据下载，并存储信息至相应的task中
     * @param dataUrl 输出数据url
     * @return 可视化图片路径与名称
     */
    @RequestMapping(value = "/initPicture", method = RequestMethod.POST)
    public JsonResult visualOut(@RequestParam(value = "dataUrl") String dataUrl,@RequestParam(value = "taskId") String taskId) throws IOException {
        JsonResult jsonResult = new JsonResult();
        DataServerTask dataServerTask = dataServerTaskDao.findFirstByOid(taskId);
        JSONObject visual = new JSONObject();

        if (dataServerTask.getVisual() != null){
            visual = dataServerTask.getVisual();
        }else {
            //通过url下载数据到服务器，并将相关信息存储至task里
            String uuid = UUID.randomUUID().toString();
            String visualPath = resourcePath + "/dataItem/visual/" + uuid;
            InputStream inputStream = null;
            FileOutputStream fileOutputStream = null;
            String fileName = null;
            if (dataUrl != null) {
                URL url = new URL(dataUrl);
                HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                conn.setConnectTimeout(5000);
                conn.setReadTimeout(60000);
                //通过conn取得文件名称
                String raw = conn.getHeaderField("Content-Disposition");
                if (raw != null && raw.indexOf("=") > 0) {
                    fileName = raw.split("=")[1];
                    fileName = new String(fileName.getBytes(StandardCharsets.ISO_8859_1), StandardCharsets.UTF_8);
                }
                inputStream = conn.getInputStream();
            }
            fileName = fileName.replaceAll("\"", "");

            File testData = new File(visualPath);
            if (!testData.exists()) {
                testData.mkdirs();
            }
            String path = visualPath + "/" + fileName;
            String dbPath = "/static/dataItem/visual/" + uuid + "/" + fileName;
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

            } catch (FileNotFoundException e) {
                e.printStackTrace();
            } catch (IOException e) {
                e.printStackTrace();
            } finally {
                try {
                    if (fileOutputStream != null) {
                        fileOutputStream.close();
                    }
                    if (inputStream != null) {
                        inputStream.close();
                    }
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }

            visual.put("fileName", fileName);
            visual.put("visualPath", dbPath);//具体到文件
            dataServerTask.setVisual(visual);
            dataServerTaskDao.save(dataServerTask);
        }
        jsonResult.setData(visual);
        jsonResult.setMsg("success");
        jsonResult.setCode(0);

        return jsonResult;
    }


}
