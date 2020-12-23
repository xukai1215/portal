package njgis.opengms.portal.controller.rest;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import lombok.extern.slf4j.Slf4j;
import com.google.gson.JsonObject;
import njgis.opengms.portal.bean.JsonResult;
import njgis.opengms.portal.bean.LoginRequired;
import njgis.opengms.portal.dao.DataApplicationDao;
import njgis.opengms.portal.dao.ThemeDao;
import njgis.opengms.portal.dao.UserDao;
import njgis.opengms.portal.dto.dataApplication.DataApplicationDTO;
import njgis.opengms.portal.dto.dataApplication.DataApplicationFindDTO;
import njgis.opengms.portal.entity.*;
import njgis.opengms.portal.entity.support.InvokeService;
import njgis.opengms.portal.entity.support.Maintainer;
import njgis.opengms.portal.service.DataApplicationService;
import njgis.opengms.portal.service.DataItemService;
import njgis.opengms.portal.service.UserService;
import njgis.opengms.portal.utils.ResultUtils;
import org.apache.commons.io.IOUtils;
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
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.servlet.ModelAndView;
import springfox.documentation.spring.web.json.Json;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.io.*;
import javax.xml.crypto.Data;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;


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
    public JsonResult getApplicationByOid(@PathVariable("oid") String oid) {
        DataApplication dataApplication = dataApplicationDao.findFirstByOid(oid);
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


    @RequestMapping(value = "/methods/getApplication",method = RequestMethod.POST)
    JsonResult getApplication(@RequestBody DataApplicationFindDTO dataApplicationFindDTO){
        return  ResultUtils.success(dataApplicationService.searchApplication(dataApplicationFindDTO));
    }

    @RequestMapping(value = "/invokeMethod", method = RequestMethod.POST)
    JsonResult invokeMethod(@RequestParam(value = "dataApplicationId") String dataApplicationId,
                            @RequestParam(value = "serviceId") String serviceId,
                            @RequestParam(value = "params") String params,
                            HttpServletRequest request) throws UnsupportedEncodingException, MalformedURLException, DocumentException {
        JsonResult jsonResult = new JsonResult();
        DataApplication dataApplication = dataApplicationDao.findFirstByOid(dataApplicationId);
        List<InvokeService> invokeServices = dataApplication.getInvokeServices();
        String url = "http://111.229.14.128:8898/extPcs?dataId=";//invoke接口

        //门户测试解绑
//        HttpSession session=request.getSession();
//        if(session.getAttribute("uid")==null){
//            return ResultUtils.error(-1,"no login");
//        }
//        String reqUsrId = session.getAttribute("uid").toString();
        String reqUsrId = "33";//门户测试时注释掉
        String token = "fcky/35Rezr+Kyazr8SRWA==";//需要存起来，拿token
        token = URLEncoder.encode(token, "UTF-8");

        for (InvokeService invokeService : invokeServices){
            if(invokeService.getServiceId().equals(serviceId)){
                List<String> dataIds = invokeService.getDataIds();
                url += dataIds.get(0);
                url += ("&params=" + params);
                url += ("&name=" + invokeService.getName());
                url += ("&token=" + token);//token注意要加密  注意此处使用门户节点的token，目前先用我的token代替
                url += ("&reqUsrOid=" + reqUsrId);
                url += ("&pcsId=" + serviceId);
                log.info(url);

                //调用url
                RestTemplate restTemplate = new RestTemplate();

                String response = restTemplate.getForObject(url,String.class);
                log.info(response + "");

                //解析xml，获取下载链接
                //将string串读取为xml
                Document configXML = DocumentHelper.parseText(response);
                //获取根元素
                Element root = configXML.getRootElement();
                String urlRes = root.element("uid").getText();

                invokeService.setCacheUrl(urlRes);
                jsonResult.setData(invokeService);
                break;
            }
        }
        dataApplication.setInvokeServices(invokeServices);
        dataApplicationDao.save(dataApplication);
        jsonResult.setMsg("suc");
        jsonResult.setCode(0);
//        jsonResult.setData(in);
        return jsonResult;
    }

    @LoginRequired
    @RequestMapping(value = "/task/{aid}/{sid}", method = RequestMethod.GET)
    ModelAndView getTask(@PathVariable String aid,@PathVariable String sid){
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("data_application_task");



        return modelAndView;
    }

    /**
     * 获取xml以及paremeter
     * @return
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
        if (!invokeService.getIsPortal()){
            String xml = invokeService.getParams();
            dataApplicationService.parseXML(jsonObject,xml);
        }else {
            String packagePath = dataApplication.getPackagePath();
            File file = new File(packagePath);
            File[] files = file.listFiles();
            String fileName = null;
            for (File file1 : files) {
                fileName = file1.getName();
                if (file1.getName().substring(file1.getName().lastIndexOf(".")).equals(".xml")) {
                    //解析xml文件
                    if (!file1.exists()) {
                        return null;
                    }
                    FileInputStream inputStream = new FileInputStream(file1);
                    int length = inputStream.available();
                    byte bytes[] = new byte[length];
                    inputStream.read(bytes);
                    inputStream.close();
                    String xml = new String(bytes, StandardCharsets.UTF_8);
                    dataApplicationService.parseXML(jsonObject,xml);
//
//                    //解析xml  利用Iterator获取xml的各种子节点
//                    Document document = DocumentHelper.parseText(xml);
//                    Element root = document.getRootElement();
//                    ArrayList<String> parameters = new ArrayList<>();
//                    List<Element> pas = root.element("Parameter").elements();
//                    for (Element e : pas) {
//                        log.info(e.attributeValue("name"));
//                        parameters.add(e.attributeValue("name"));
//                    }
//                    jsonObject.put("parameters", parameters);
//                    jsonObject.put("xml", xml);
                    break;
                }
            }
        }
        jsonResult.setData(jsonObject);
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
    public JsonResult getServiceInfo(@PathVariable String aid,@PathVariable String sid){
        JsonResult jsonResult = new JsonResult();
        DataApplication dataApplication = dataApplicationDao.findFirstByOid(aid);
        if(dataApplication == null){
            jsonResult.setMsg("err");
            jsonResult.setCode(-1);
            return jsonResult;
        }
        JSONObject jsonObject = new JSONObject();

        List<InvokeService> invokeServices = dataApplication.getInvokeServices();
        for (InvokeService invokeService1:invokeServices){
            if(invokeService1.getServiceId().equals(sid)){
                jsonObject.put("service", invokeService1);
                break;
            }
        }
        jsonObject.put("application", dataApplication);

        jsonResult.setData(jsonObject);
        return jsonResult;
    }
}
