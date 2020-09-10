package njgis.opengms.portal.controller.rest;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.google.gson.JsonObject;
import com.sun.org.apache.regexp.internal.RE;
import lombok.extern.slf4j.Slf4j;
import njgis.opengms.portal.bean.JsonResult;
import njgis.opengms.portal.dao.*;
import njgis.opengms.portal.dto.DataCategorysAddDTO;
import njgis.opengms.portal.dto.categorys.CategoryAddDTO;
import njgis.opengms.portal.dto.dataItem.DataItemAddDTO;
import njgis.opengms.portal.dto.dataItem.DataItemFindDTO;
import njgis.opengms.portal.dto.dataItem.DataItemUpdateDTO;
import njgis.opengms.portal.dto.theme.ThemeUpdateDTO;
import njgis.opengms.portal.entity.*;
import njgis.opengms.portal.entity.support.AuthorInfo;
import njgis.opengms.portal.exception.MyException;
import njgis.opengms.portal.service.DataItemService;
import njgis.opengms.portal.service.ItemService;
import njgis.opengms.portal.service.ModelItemService;
import njgis.opengms.portal.service.UserService;
import njgis.opengms.portal.utils.ResultUtils;
import njgis.opengms.portal.utils.Utils;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringEscapeUtils;
import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.DocumentHelper;
import org.dom4j.Element;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.http.*;
import org.springframework.http.converter.ByteArrayHttpMessageConverter;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.servlet.ModelAndView;
import springfox.documentation.spring.web.json.Json;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.websocket.server.PathParam;
import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.sql.SQLTransactionRollbackException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

/**
 * @ClassName DataItemController
 * @Description todo
 * @Author sun_liber
 * @Date 2019/2/13
 * @Version 1.0.0
 */
@RestController
@RequestMapping (value = "/dataItem")
@Slf4j
public class DataItemRestController {

    @Autowired
    ItemService itemService;

    @Autowired
    DataItemService dataItemService;

    @Autowired
    ModelItemService modelItemService;

    @Autowired
    ModelItemDao modelItemDao;

    @Autowired
    DataItemDao dataItemDao;

    @Autowired
    CategoryDao categoryDao;

    @Autowired
    UserDao userDao;

    @Autowired
    UserService userService;

    @Autowired
    DataApplicationDao dataApplicationDao;

    @Autowired
    DistributedNodeDao distributedNodeDao;

    @Autowired
    DataCategorysDao dataCategorysDao;

    @Autowired
    private MongoTemplate mongoTemplate;

    @Autowired
    DataItemNewDao dataItemNewDao;

    @Value ("${dataContainerIpAndPort}")
    String dataContainerIpAndPort;

    @Value("${htmlLoadPath}")
    private String htmlLoadPath;


//data item start


    /**
     * 通过导航栏，打开dataItems首页，即数据条目页面
     * @author lan
     * @return modelAndView
     */
    @RequestMapping("/hubs")
    public ModelAndView getHubs(){
//        System.out.println("data-items-page");
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("data_items");
        modelAndView.addObject("dataType","hubs");
        return modelAndView;
    }

    @RequestMapping("/repository")
    public ModelAndView getRepository(){
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("data_items_repository");
        modelAndView.addObject("dataType","repository");
        return modelAndView;
    }

    @RequestMapping("/network")
    public ModelAndView getNetwork(){
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("data_items_network");
        modelAndView.addObject("dataType","network");
        return modelAndView;
    }

    @RequestMapping("/application")
    public ModelAndView getApplication(){
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("data_application");
        modelAndView.addObject("dataType","application");
        return modelAndView;
    }



    @RequestMapping (value = "", method = RequestMethod.POST)
    JsonResult add(@RequestBody DataItemAddDTO dataItemAddDTO) {
        return ResultUtils.success(dataItemService.insert(dataItemAddDTO));
    }


    /**
     * dataitems页面中的搜索
     * @param dataItemFindDTO
     * @return
     */
    @RequestMapping(value="/listBySearch",method = RequestMethod.POST)
    JsonResult listByName(@RequestBody DataItemFindDTO dataItemFindDTO){
        return ResultUtils.success(dataItemService.listBySearch(dataItemFindDTO));
    }

    //kai's function
    @RequestMapping(value="/searchByName",method = RequestMethod.POST)
    JsonResult searchByName(@RequestBody DataItemFindDTO dataItemFindDTO){
        return ResultUtils.success(dataItemService.searchByName(dataItemFindDTO,null));
    }

    @RequestMapping(value="/searchByNameAndAuthor",method = RequestMethod.POST)
    JsonResult searchByNameAndAuthor(@RequestBody DataItemFindDTO dataItemFindDTO,HttpServletRequest request){

        HttpSession session = request.getSession();
        if(Utils.checkLoginStatus(session)==null){
            return ResultUtils.error(-1,"no login");
        }else{
            String userOid = session.getAttribute("oid").toString();
            return ResultUtils.success(dataItemService.searchByName(dataItemFindDTO,userOid));
        }

    }

    @RequestMapping(value="/searchResourceByNameAndCate",method = RequestMethod.POST)
    JsonResult searchResourceByNameAndCate(@RequestBody DataItemFindDTO dataItemFindDTO){
        return ResultUtils.success(dataItemService.searchResourceByNameAndCate(dataItemFindDTO));
    }

    @RequestMapping(value="/searchByNameByOid",method= RequestMethod.GET)
    JsonResult searchByTitle(DataItemFindDTO dataItemFindDTO, String oid, HttpServletRequest request){
        HttpSession session = request.getSession();
        String loadUser = null;
        if(session.getAttribute("oid")!=null)
            loadUser =  session.getAttribute("oid").toString() ;
        return ResultUtils.success(dataItemService.searchByTitleByOid(dataItemFindDTO,oid,loadUser));
    }




    /**
     * dataItems页面，分页和分类的唯一标识
     * @param categorysId
     * @param page
     * @return
     */
    @RequestMapping(value = "/items/{categorysId}&{page}&{dataType}",method = RequestMethod.GET)
    JsonResult listByClassification(
            @PathVariable  String categorysId,
            @PathVariable Integer page,
            @PathVariable String dataType,
            HttpServletRequest request){
        HttpSession session = request.getSession();
        String loadUser = null;
        if(session.getAttribute("oid")!=null)
            loadUser =  session.getAttribute("oid").toString();
        return ResultUtils.success(dataItemService.findByCateg(categorysId,page,false,10,loadUser,dataType));

    }


    /**
     * dataitem页面，获取hubs内容
     * @param hubnbm
     * @return
     */
    @RequestMapping(value = "/addmorehubs",method = RequestMethod.GET)
    JsonResult getHubs(@RequestParam(value = "hubnbm")Integer hubnbm){
        return ResultUtils.success(dataItemService.getHubs(hubnbm));
    }

    @RequestMapping(value="/getRelation",method = RequestMethod.GET)
    JsonResult getRelation(@RequestParam(value = "id") String id){

        JSONArray result=dataItemService.getRelation(id);

        return ResultUtils.success(result);

    }

    @RequestMapping(value="/setRelation",method = RequestMethod.POST)
    JsonResult setRelation(@RequestParam(value="id") String id,
                           @RequestParam(value = "relations[]") List<String> relations){

        String result=dataItemService.setRelation(id,relations);

        return ResultUtils.success(result);

    }


    @RequestMapping(value="/getDataItemByDataId",method = RequestMethod.GET)
    JsonResult getDataItemByDataId(@RequestParam(value="dataId") String dataId,
                                   HttpServletRequest request){
        HttpSession session = request.getSession();
        if(session.getAttribute("uid")==null){
            return ResultUtils.error(-1,"no login");
        }
        else
            return ResultUtils.success(dataItemService.getDataItemByDataId(dataId));
    }
//data item end





//data info start


    /**
     * 通过数据条目页面，打开dataInfo页面，即数据详情页面
     * @param id
     * @return
     */
    @RequestMapping (value = "/{id}", method = RequestMethod.GET)
    ModelAndView get(@PathVariable ("id") String id){
        ModelAndView view = new ModelAndView();

        DataItem dataItem;
        try {
            dataItem=dataItemService.getById(id);
        }catch (MyException e){
            view.setViewName("error/404");
            return view;
        }


        dataItem=(DataItem)itemService.recordViewCount(dataItem);
        dataItemDao.save(dataItem);



        //用户信息

        JSONObject userJson = userService.getItemUserInfoByOid(dataItem.getAuthor());

        //authorship
        String authorshipString="";
        List<AuthorInfo> authorshipList=dataItem.getAuthorship();
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
        //related models
        JSONArray modelItemArray=new JSONArray();
        List<String> relatedModels=dataItem.getRelatedModels();
        if(relatedModels!=null) {
            for (String mid : relatedModels) {
                try {
                    ModelItem modelItem = modelItemDao.findFirstByOid(mid);
                    JSONObject modelItemJson = new JSONObject();
                    modelItemJson.put("name", modelItem.getName());
                    modelItemJson.put("oid", modelItem.getOid());
                    modelItemJson.put("description", modelItem.getDescription());
                    modelItemJson.put("image", modelItem.getImage().equals("") ? null : htmlLoadPath + modelItem.getImage());
                    modelItemArray.add(modelItemJson);
                }
                catch (Exception e){
                    e.printStackTrace();
                }
            }
        }
        List<String> classifications=new ArrayList<>();
        List<String> categories = dataItem.getClassifications();
        for (String category : categories) {
            Categorys categorys = dataCategorysDao.findFirstById(category);
            String name = categorys.getCategory();
            classifications.add(name);
        }


        ArrayList<String> fileName = new ArrayList<>();
        if (dataItem.getDataType().equals("DistributedNode")){
            fileName.add(dataItem.getName());
        }
        view.setViewName("data_item_info");
        if (dataItem.getRelatedProcessings()!=null){
            view.addObject("relatedProcessing",dataItem.getRelatedProcessings());
        }
        if (dataItem.getRelatedVisualizations()!=null){
            view.addObject("relatedVisualization",dataItem.getRelatedVisualizations());
        }
        view.addObject("datainfo",ResultUtils.success(dataItem));
        view.addObject("user",userJson);
        view.addObject("classifications",classifications);
        view.addObject("relatedModels",modelItemArray);
        view.addObject("authorship",authorshipString);
//        view.addObject("userDataList", dataItem.getUserDataList());
        view.addObject("fileName",fileName);//后期应该是放该name下的所有数据


        return view;
    }


    /**
     * 查看datainfo详情页面，浏览量加1
     * @param id
     * @return
     */
    @RequestMapping(value="/viewplus",method = RequestMethod.GET)
    Integer viewCountPlus(@RequestParam(value="id") String id){

        return dataItemService.viewCountPlus(id);
    }

    /**
     * 获得datainfo当前数据项的浏览量
     * @param id
     * @return
     */
    @RequestMapping(value="/viewcount",method = RequestMethod.GET)
    Integer getViewCount(@RequestParam(value="id") String id){
        return dataItemService.getViewCount(id);
    }




    /**
     * 模型详情页面中的RelatedData，模型关联数据搜索，搜索范围是全部的选项
     * @param dataItemFindDTO
     * @return
     */
    @RequestMapping(value="/searchFromAll",method = RequestMethod.POST)
    JsonResult relatedModelsFromAll(@RequestBody DataItemFindDTO dataItemFindDTO){
        return ResultUtils.success(dataItemService.searchFromAllData(dataItemFindDTO));
    }





    /**
     * datainfo数据详情页面中的category，依据id去找到对应分类
     * @param id
     * @return
     */
    @RequestMapping(value = "/category",method = RequestMethod.GET)
    JsonResult getCategory(@RequestParam(value = "id") String id){
        return ResultUtils.success(dataItemService.getCategory(id));
    }




    /**
     * 数据详情页面RelatedModels，数据关联的3个模型
     * @param id
     * @return
     */
    @RequestMapping(value = "/briefrelatedmodels",method = RequestMethod.GET)
    JsonResult getBriefRelatedModels(@RequestParam(value = "id") String id){
        return ResultUtils.success(dataItemService.getRelatedModels(id));
    }




    /**
     * 数据详情页面RelatedModels，数据关联的所有模型
     * @param id
     * @param more
     * @return
     */
    @RequestMapping(value = "/allrelatedmodels",method = RequestMethod.GET)
    JsonResult getRelatedModels(@RequestParam(value = "id") String id,@RequestParam(value = "more") Integer more){
        return ResultUtils.success(dataItemService.getAllRelatedModels(id,more));
    }




    /**
     * 数据详情页面RelatedModels，为数据添加关联的模型
     * @param dataItemFindDTO
     * @return
     */
    @RequestMapping(value = "/models",method = RequestMethod.POST)
    JsonResult addRelatedModels(@RequestBody DataItemFindDTO dataItemFindDTO){
        return ResultUtils.success(dataItemService.addRelatedModels(dataItemFindDTO.getDataId(),dataItemFindDTO.getRelatedModels()));
    }


    /**
     * 模型详情页面RelatedData，模型关联的3个数据
     * @param id
     * @return
     */
    @RequestMapping(value = "/briefrelateddata",method = RequestMethod.GET)
    JsonResult getBriefRelatedDatas(@RequestParam(value = "id") String id){
        return ResultUtils.success(dataItemService.getRelatedData(id));
    }

    /**
     * 模型详情页面RelatedData，模型关联的所有数据
     * @param id
     * @param more
     * @return
     */
    @RequestMapping(value = "/allrelateddata",method = RequestMethod.GET)
    JsonResult getRelatedDatas(@RequestParam(value = "id") String id,@RequestParam(value = "more") Integer more){
        return ResultUtils.success(dataItemService.getAllRelatedData(id,more));
    }


    /**
     * 模型详情页面RelatedData，为模型添加关联的数据
     * @param dataItemFindDTO
     * @return
     */
    @RequestMapping(value = "/data",method = RequestMethod.POST)
    JsonResult addRelatedDatas(@RequestBody DataItemFindDTO dataItemFindDTO){
        return ResultUtils.success(dataItemService.addRelatedData(dataItemFindDTO.getDataId(),dataItemFindDTO.getRelatedModels()));
    }

//data info end





//user space start


    /**
     * 个人中心，用户创建条目的搜索
     * @param userOid
     * @param page
     * @param pagesize
     * @param asc
     * @param searchText
     * @return
     */
    @RequestMapping(value="/searchDataByUserId",method = RequestMethod.GET)
    JsonResult searchDataByUserId(
            @RequestParam(value="userOid") String userOid,
            @RequestParam(value="page") int page,
            @RequestParam(value="pageSize") int pagesize,
            @RequestParam(value="asc") int asc,
            @RequestParam(value="searchText") String searchText

    ){
        return ResultUtils.success(dataItemService.searchDataByUserId(userOid,page,pagesize,asc,searchText));
    }


    /**
     * 个人中心创建数据条目
     * @param id
     * @return
     * @throws IOException
     */
    @RequestMapping(value="/adddataitembyuser",method = RequestMethod.GET)
    Integer addUserData(@RequestParam(value="id") String id) throws IOException{

        return dataItemService.addDataItemByUser(id);
    }


    /**
     * 个人中心，创建dataitem同时，将创建的dataItem的id入到分类数据库对应类document下
     * @param categoryAddDTO
     * @return
     */
    @RequestMapping(value="/addcate",method = RequestMethod.POST)
    JsonResult addUserCreateDataItemId(@RequestBody CategoryAddDTO categoryAddDTO){

        return ResultUtils.success(dataItemService.addCateId(categoryAddDTO));

    }


    /**
     * 个人中心删除数据条目操作
     * @param id
     * @return
     */
    @RequestMapping (value = "/del", method = RequestMethod.GET)
    JsonResult delete(@RequestParam(value="id") String id ,HttpServletRequest request) {
        HttpSession session=request.getSession();

        if(session.getAttribute("uid")==null){
            return ResultUtils.error(-1,"no login");
        }
        String userOid=session.getAttribute("oid").toString();
        return ResultUtils.success(dataItemService.delete(id,userOid));
    }

    /**
     * 个人中心动态创建分类树
     * @return
     */
//    @RequestMapping(value = "/createTree",method = RequestMethod.GET)
//    Map<String,List<Map<String,String >>> createTree(){
////        return dataItemService.createTree();
//        return dataItemService.createTree();
//    }
    @RequestMapping(value = "/createTree",method = RequestMethod.GET)
    JSONArray createTree(){
//        return dataItemService.createTree();
        return dataItemService.createTreeNew();
    }

    //user space end




    //dataResource start

    /**
     * 根据用户或者数据条目Id，获取其文件管理器中的数据资源
     * TODO 注意这里返回的列表是详细信息，是没有进行字段过滤的，可以考虑使用VO过滤
     * @param dataItemId
     * @param author
     * @return
     */
    @RequestMapping (value = "/getRemoteDataSource", method = RequestMethod.GET)
    JsonResult getRemoteDataSource(@RequestParam (value = "dataItemId", required = false) String dataItemId,
                                   @RequestParam (value = "author", required = false) String author) {
        RestTemplate restTemplate = new RestTemplate();

        if (dataItemId != null) {
            JSONObject dataResourceList = restTemplate.getForObject("http://" + dataContainerIpAndPort + "/dataResource/listByCondition?value="+dataItemId+"&type=dataItem", JSONObject.class, dataItemId);
            return ResultUtils.success(dataResourceList);
        }

        if (author != null) {
            JSONObject dataResourceList = restTemplate.getForObject("http://" + dataContainerIpAndPort + "/dataResource/listByAuthor/{author}", JSONObject.class, author);
            return ResultUtils.success(dataResourceList);
        }
        return ResultUtils.success(null);
    }




    /**
     * 获取指定数据资源的详细信息
     * @param id
     * @return
     */
    @RequestMapping (value = "/getRemoteDataSource/{id}", method = RequestMethod.GET)
    JsonResult getRemoteDataSource(@PathVariable ("id") String id) {
        RestTemplate restTemplate = new RestTemplate();
        JSONObject jsonObject = restTemplate.getForObject("http://" + dataContainerIpAndPort + "/dataResource/{id}", JSONObject.class, id);
        return ResultUtils.success(jsonObject);
    }



    /**
     * 上传数据资源的文件到数据容器
     * @param file
     * @return 返回在数据容器中的存储位置
     */
    @RequestMapping (value = "/uploadRemote", method = RequestMethod.POST)
    JsonResult uploadRemote(@RequestParam ("file") MultipartFile file) {


        RestTemplate restTemplate = new RestTemplate();

        MultiValueMap<String, Object> part = new LinkedMultiValueMap<>();

        part.add("file", file.getResource());


        JSONObject jsonObject = restTemplate.postForObject("http://" + dataContainerIpAndPort + "/file/upload/store_dataResource_files", part, JSONObject.class);

        return ResultUtils.success(jsonObject);



    }



//    /**
//     * 添加数据资源，在上传数据资源文件到数据容器后，我们还需要对其进行字段补充，再添加到数据库
//     * @param dataResource
//     * @return
//     */
//    @RequestMapping (value = "/addDataResource", method = RequestMethod.POST)
//    JsonResult addDataResource(@RequestBody AddDataResource dataResource) {
//        RestTemplate restTemplate = new RestTemplate();
//        JSONObject jsonObject =
//                restTemplate.postForObject("http://" + dataContainerIpAndPort + "/dataResource",
//                        dataResource,
//                        JSONObject.class);
//        return ResultUtils.success(jsonObject);
//    }




    /**
     * 根据ID 删除数据资源
     * @param id
     * @return
     */
    @RequestMapping (value = "/deleteDataResource/{id}", method = RequestMethod.DELETE)
    JsonResult deleteDataResource(@PathVariable ("id") String id) {
        RestTemplate restTemplate = new RestTemplate();
        restTemplate.delete("http://" + dataContainerIpAndPort + "/dataResource/" + id);
        return ResultUtils.success();
    }




    /**
     * 下载数据资源文件
     * @param sourceStoreId
     * @return
     */
    @RequestMapping (value = "/downloadRemote", method = RequestMethod.GET)
    ResponseEntity downloadRemote(@RequestParam ("sourceStoreId") String sourceStoreId) {
        RestTemplate restTemplate = new RestTemplate();
        restTemplate.getMessageConverters().add(
                new ByteArrayHttpMessageConverter());
        HttpHeaders headers = new HttpHeaders();
        headers.setAccept(Arrays.asList(MediaType.APPLICATION_OCTET_STREAM));
        HttpEntity<String> entity = new HttpEntity<>(headers);


        Map<String, String> map = new HashMap<>();
        map.put("sourceStoreId", sourceStoreId);


        ResponseEntity<byte[]> response = restTemplate.exchange(
                "http://" + dataContainerIpAndPort + "/dataResource/getResources?sourceStoreId={sourceStoreId}&",
                HttpMethod.GET, entity, byte[].class, map);

        return response;
    }


    //dataResource end


    //test api

    /**
     * //todo 待用接口
     * 更新
     * @param id
     * @param dataItemUpdateDTO
     * @return
     */
    @RequestMapping (value = "/{id}", method = RequestMethod.PUT)
    JsonResult update(@PathVariable ("id") String id, @RequestBody DataItemUpdateDTO dataItemUpdateDTO) {
        dataItemService.update(id, dataItemUpdateDTO);
        return ResultUtils.success();
    }

    @RequestMapping(value = "/update",method = RequestMethod.POST)
    public JsonResult updateDataItem(@RequestBody DataItemUpdateDTO dataItemUpdateDTO, HttpServletRequest request) {
        HttpSession session=request.getSession();
        String uid=session.getAttribute("uid").toString();
        String oid = session.getAttribute("oid").toString();
        if(uid==null){
            return ResultUtils.error(-2,"未登录");
        }

        JSONObject result=dataItemService.updateDataItem(dataItemUpdateDTO,oid);
        if(result==null){
            return ResultUtils.error(-1,"There is another version have not been checked, please contact opengms@njnu.edu.cn if you want to modify this item.");
        }
        else {
            return ResultUtils.success(result);
        }
    }


    /**
     * //todo 测试接口
     * @param dataItemFindDTO
     * @return
     */
    @RequestMapping(value="/test",method = RequestMethod.POST)
    JsonResult test(@RequestBody DataItemFindDTO dataItemFindDTO){
        return ResultUtils.success(dataItemService.test(dataItemFindDTO));
    }


    /**
     * 分布式节点数据接口
     */


    //  分布式节点接口   先对接收到的数据进行处理，处理接口
    @RequestMapping(value = "/getDistributedData", method = RequestMethod.POST)
    JsonResult getDistributedData(@RequestParam("id") String id,
                                  @RequestParam("oid") String oid,
                                  @RequestParam("name") String name,
                                  @RequestParam("date") String date,
                                  @RequestParam("type") String type,
                                  @RequestParam("authority") Boolean authority,
                                  @RequestParam("token") String token,
                                  @RequestParam("meta") String meta1,
                                  @RequestParam("ip") String ip) throws IOException {
        JsonResult jsonResult = new JsonResult();
        //检查该id是否已经存在于数据库中
        if (dataItemNewDao.findFirstByDistributedNodeDataId(id) != null){
            DataItemNew dataItemNew = dataItemNewDao.findFirstByDistributedNodeDataId(id);
            jsonResult.setCode(-2);
            jsonResult.setMsg("/dataItem/" + dataItemNew.getId());
            return jsonResult;
        }

        JSONObject meta = JSONObject.parseObject(meta1);
        //检查作者信息
        if (userDao.findFirstByOid(oid)==null){
            jsonResult.setCode(-1);
            jsonResult.setMsg("user information error");
            return jsonResult;
        }
        DataItemNew dataItemNew = dataItemService.insertDistributeData(id,oid,name,date,type,authority,token,meta,ip);
        dataItemService.insertDistributeNode(ip,dataItemNew.getId(),oid);
        jsonResult.setData("/dataItem/"+dataItemNew.getId());
        //将data item的id加到对应的类别下，用于data items页面的显示
        JSONArray tags = new JSONArray();
        tags = meta.getJSONArray("tags");
        List<String> list = new ArrayList<>();
        for (int i=0;i<tags.size();i++){
            list.add(tags.getString(i));
        }
        CategoryAddDTO categoryAddDTO = new CategoryAddDTO();
        categoryAddDTO.setId(dataItemNew.getId());
        categoryAddDTO.setCate(list);
        categoryAddDTO.setDataType("DistributedNode");
        dataItemService.addCateId(categoryAddDTO);
        return jsonResult;
    }

    @RequestMapping(value = "/getDistributedObj",method = RequestMethod.GET)
    JsonResult getDistributedObj(@RequestParam(value = "dataOid") String  dataOid,HttpServletRequest request){
        JsonResult jsonResult = new JsonResult();
        HttpSession session = request.getSession();
        JSONObject jsonObject = new JSONObject();

        jsonObject.put("msg","req");
        DataItemNew dataItemNew = dataItemNewDao.findFirstById(dataOid);
        //判断是否登录
        if(session.getAttribute("oid")==null){
            jsonResult.setCode(-1);
            jsonResult.setMsg("User not logged in");
            return jsonResult;
        }else{
            jsonObject.put("reqUsrOid",session.getAttribute("oid").toString());
        }
        if (dataItemNew.getDataUrl()!=null){
            jsonResult.setData(dataItemNew.getDataUrl());
            jsonResult.setCode(1);
            return jsonResult;
        }

        jsonObject.put("name", dataItemNew.getName());
        jsonObject.put("token",dataItemNew.getToken());
        jsonObject.put("id",dataItemNew.getDistributedNodeDataId());
        jsonObject.put("wsId",dataItemNew.getId());

        jsonResult.setCode(0);
        jsonResult.setMsg("Success");
        jsonResult.setData(jsonObject);
        return jsonResult;
    }

    //第一次请求后将该数据下载url存储下来
    @RequestMapping(value = "/saveUrl",method = RequestMethod.POST)
    JsonResult saveUrl(@RequestParam(value = "dataOid") String  dataOid,
                       @RequestParam(value = "rId") String  rId,
                       HttpServletRequest request){
        JsonResult jsonResult = new JsonResult();
        DataItemNew dataItemNew = dataItemNewDao.findFirstById(dataOid);
        String dataUrl = "http://111.229.14.128:8899/data?uid="+ rId;
        dataItemNew.setDataUrl(dataUrl);
        dataItemNewDao.save(dataItemNew);

        return jsonResult;
    }

    //分布式节点processing绑定dataitem组
    @RequestMapping(value = "/bindDataItem", method = RequestMethod.POST)
    public JsonResult bingDataItem(
            @RequestParam(value = "type") String type,
            @RequestParam (value = "dataIds") String dataIds1,
                                   @RequestParam(value = "proId") String proId,
                                   @RequestParam(value = "proName") String proName,
                                   @RequestParam(value = "proDescription") String proDescription,
                                   @RequestParam(value = "token") String token,
                                   @RequestParam(value = "xml") String xml
    ){
        JsonResult jsonResult = new JsonResult();
        ArrayList<String> url = new ArrayList<>();
        String[] dataIds = dataIds1.split(",");
        int existCount1 = 0;
        int existCount2 = 0;
        for (int i=0;i<dataIds.length;i++){
            if (dataItemNewDao.findFirstByDistributedNodeDataId(dataIds[i]) == null){
                jsonResult.setCode(-2);
                jsonResult.setMsg(dataIds[i] + " no public");
                return jsonResult;
            }
            DataItemNew dataItemNew = dataItemNewDao.findFirstByDistributedNodeDataId(dataIds[i]);
            url.add("/dataItem/" + dataItemNew.getId());
            //首先判断该条目是否已有该处理方法，如果已有则不再绑定
            if (type.equals("Processing")) {
                Boolean exist = false;
                if (dataItemNew.getRelatedProcessings() != null) {
                    List<RelatedProcessing> relatedProcessings = dataItemNew.getRelatedProcessings();
                    for (int j = 0; j < relatedProcessings.size(); j++) {
                        if (relatedProcessings.get(j).getProId().equals(proId)) {
                            exist = true;
                            existCount1++;
                            break;
                        }
                    }
                }
                if (exist == true) {
                    continue;
                }
                RelatedProcessing relatedProcessing = new RelatedProcessing();
                relatedProcessing.setProId(proId);
                relatedProcessing.setProName(proName);
                relatedProcessing.setProDescription(proDescription);
                relatedProcessing.setToken(token);
                relatedProcessing.setXml(xml);
                List<RelatedProcessing> relatedProcessings = new LinkedList<>();//记录List的初始化
                relatedProcessings.add(relatedProcessing);
                if (dataItemNew.getRelatedProcessings() == null) {
                    dataItemNew.setRelatedProcessings(relatedProcessings);
                } else {
                    dataItemNew.getRelatedProcessings().add(relatedProcessing);
                }
                dataItemNewDao.save(dataItemNew);
            }else if (type.equals("Visualization")){
                Boolean exist = false;
                if (dataItemNew.getRelatedVisualizations() != null) {
                    List<RelatedVisualization> relatedVisualizations = dataItemNew.getRelatedVisualizations();
                    for (int j = 0; j < relatedVisualizations.size(); j++) {
                        if (relatedVisualizations.get(j).getProId().equals(proId)) {
                            exist = true;
                            existCount1++;
                            break;
                        }
                    }
                }
                if (exist == true) {
                    continue;
                }
                RelatedVisualization relatedVisualization = new RelatedVisualization();
                relatedVisualization.setProId(proId);
                relatedVisualization.setProName(proName);
                relatedVisualization.setProDescription(proDescription);
                relatedVisualization.setToken(token);
                relatedVisualization.setXml(xml);
                List<RelatedVisualization> relatedVisualizations = new LinkedList<>();//记录List的初始化
                relatedVisualizations.add(relatedVisualization);
                if (dataItemNew.getRelatedVisualizations() == null) {
                    dataItemNew.setRelatedVisualizations(relatedVisualizations);
                } else {
                    dataItemNew.getRelatedVisualizations().add(relatedVisualization);
                }
                dataItemNewDao.save(dataItemNew);
            }
        }
        if (existCount1 == dataIds.length||existCount2 == dataIds.length){
            jsonResult.setMsg("All data has been bound to this processing method and cannot be bound repeatedly");
            jsonResult.setCode(-1);
            return jsonResult;
        }else {
            jsonResult.setData(url);
            return jsonResult;
        }
    }

    @RequestMapping(value = "/getParemeter", method = RequestMethod.POST)
    public JSONObject getParemeter(@RequestParam(value = "type")String type,
                                   @RequestParam(value = "dataItemId")String dataItemId,
                                   @RequestParam(value = "processingId") String processingId,HttpServletRequest request) throws DocumentException {
        JSONObject jsonObject = new JSONObject();
        HttpSession session = request.getSession();
        if (session.getAttribute("oid") == null){
            jsonObject.put("code", -1);
            return jsonObject;
        }
        String xml = "";
        DataItemNew dataItemNew = dataItemNewDao.findFirstById(dataItemId);
        if (type.equals("process")) {
            List<RelatedProcessing> relatedProcessings = dataItemNew.getRelatedProcessings();
            for (int i=0;i<relatedProcessings.size();i++){
                if (relatedProcessings.get(i).getProId().equals(processingId)){
                    jsonObject.put("xml",relatedProcessings.get(i).getXml());
                    xml = relatedProcessings.get(i).getXml().toString();
                    break;
                }
            }
        }else {
            List<RelatedVisualization> relatedVisualizations = dataItemNew.getRelatedVisualizations();
            for (int i=0;i<relatedVisualizations.size();i++){
                if (relatedVisualizations.get(i).getProId().equals(processingId)){
                    jsonObject.put("xml",relatedVisualizations.get(i).getXml());
                    xml = relatedVisualizations.get(i).getXml().toString();
                    break;
                }
            }
        }


        //解析xml  利用Iterator获取xml的各种子节点
        Document document = DocumentHelper.parseText(xml);
        Element employees = document.getRootElement();
        int count = 0;
        ArrayList<String> parameters = new ArrayList<>();
        for (Iterator i = employees.elementIterator(); i.hasNext(); ) {
            Element employee = (Element) i.next();
            count++;
            if (count != 3){
                continue;
            }
            for (Iterator j = employee.elementIterator(); j.hasNext(); ) {
                Element node = (Element) j.next();
                parameters.add(node.attribute(0).getValue());
            }
        }
        jsonObject.put("parameters", parameters);
        jsonObject.put("code", 0);
        return jsonObject;
    }

    @RequestMapping(value = "/getProcessingObj", method = RequestMethod.POST)
    public  JSONObject getProcessingObj(@RequestParam(value = "type") String type,
                                        @RequestParam(value = "dataItemId") String dataItemId,
                                        @RequestParam(value = "processingId") String processingId,
                                        HttpServletRequest request){
        HttpSession session = request.getSession();
        String userId = session.getAttribute("oid").toString();
        JSONObject jsonObject = new JSONObject();
        DataItemNew dataItemNew = dataItemNewDao.findFirstById(dataItemId);
        String dataItemName = dataItemNew.getName();
        String token = "";
        if (type.equals("process")) {
            List<RelatedProcessing> relatedProcessings = dataItemNew.getRelatedProcessings();
            for (int i = 0; i < relatedProcessings.size(); i++) {
                if (relatedProcessings.get(i).getProId().equals(processingId)) {
                    token = relatedProcessings.get(i).getToken();
                    break;
                }
            }
        }else {
            List<RelatedVisualization> relatedVisualizations = dataItemNew.getRelatedVisualizations();
            for (int i=0;i<relatedVisualizations.size();i++){
                if (relatedVisualizations.get(i).getProId().equals(processingId)){
                    token = relatedVisualizations.get(i).getToken();
                    break;
                }
            }
        }
        jsonObject.put("dataItemName", dataItemName);
        jsonObject.put("token", token);
        jsonObject.put("userId", userId);
        jsonObject.put("dataId", dataItemNew.getDistributedNodeDataId());
        return jsonObject;
    }

    @RequestMapping(value = "/delProcessing",method = RequestMethod.DELETE)
    public JsonResult delProcessing(@RequestParam(value = "pcsId") String pcsId,
                                    @RequestParam(value = "type") String type){
        JsonResult jsonResult = new JsonResult();
        Boolean exist = true;
        if (type.equals("process")) {
            org.springframework.data.mongodb.core.query.Criteria criteria = org.springframework.data.mongodb.core.query.Criteria.where("RelatedProcessing").elemMatch(Criteria.where("proId").is(pcsId));
            Query query = new Query(criteria);
            List<DataItemNew> dataItemNews = mongoTemplate.find(query, DataItemNew.class);
            if (dataItemNews.size() == 0){
                exist = false;
            }
            for (int i = 0; i < dataItemNews.size(); i++) {
                DataItemNew dataItemNew = dataItemNews.get(i);
                List<RelatedProcessing> relatedProcessings = dataItemNew.getRelatedProcessings();
                for (int j = 0; j < relatedProcessings.size(); j++) {
                    if (relatedProcessings.get(j).getProId().equals(pcsId)) {
                        relatedProcessings.remove(j);
                        break;
                    }
                }
                dataItemNewDao.save(dataItemNew);
            }
        }else if (type.equals("visual")){
            Criteria criteria = Criteria.where("relatedVisualizations").elemMatch(Criteria.where("proId").is(pcsId));
            Query query = new Query(criteria);
            List<DataItemNew> dataItemNews = mongoTemplate.find(query, DataItemNew.class);
            if (dataItemNews.size() == 0){
                exist = false;
            }
            for (int i=0;i<dataItemNews.size();i++){
                DataItemNew dataItemNew = dataItemNews.get(i);
                List<RelatedVisualization>relatedVisualizations = dataItemNew.getRelatedVisualizations();
                for (int j=0;j<relatedVisualizations.size();j++){
                    if (relatedVisualizations.get(j).getProId().equals(pcsId)){
                        relatedVisualizations.remove(j);
                        break;
                    }
                }
                dataItemNewDao.save(dataItemNew);
            }
        }
        if (exist == false){
            jsonResult.setMsg("This processing method does not exist");
            jsonResult.setCode(-1);
        }else {
            jsonResult.setMsg("delete success");
            jsonResult.setCode(0);
        }
        return jsonResult;
    }

    //获取注册到门户的分布式节点
    //todo mangeNodes
    @RequestMapping(value = "/mangeNodes",method = RequestMethod.GET)
    public JSONArray mangeNodes(HttpServletRequest request){
        JSONArray jsonArray = new JSONArray();
        HttpSession session = request.getSession();
        String oid = session.getAttribute("oid").toString();
        List<DistributedNode> distributedNodes = distributedNodeDao.findAll();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        for (DistributedNode distributedNode:distributedNodes){
            JSONObject jsonObject = new JSONObject();
            if (distributedNode.getIp()!=null&&distributedNode.getUserId().equals(oid)){
                jsonObject.put("ip",distributedNode.getIp());
                if (distributedNode.getOnlineStatus()){
                    jsonObject.put("onlineStatus","Online");
                }else {
                    jsonObject.put("onlineStatus","Offline");
                }
                jsonObject.put("date",sdf.format(distributedNode.getLastTime()));
                User user = userDao.findFirstByOid(distributedNode.getUserId());
                String userName = user.getUserName();
                jsonObject.put("userName",userName);
                jsonArray.add(jsonObject);
            }
        }
        return jsonArray;
    }

    @RequestMapping(value = "/getDataItemList", method = RequestMethod.POST)
    public JSONArray getDataItemList(@RequestBody String ip){
        JSONArray result = new JSONArray();
        DistributedNode distributedNode = distributedNodeDao.findFirstByIp(ip);
        List<String> dataItems = distributedNode.getDataItems();
        for (int i=0;i<dataItems.size();i++){
            DataItem dataItem = dataItemDao.findFirstById(dataItems.get(i));
            result.add(dataItem);
        }
        return result;
    }

//    @RequestMapping(value = "/addDataCategories", method = RequestMethod.POST)
//    public JsonResult addDataCategories(@RequestParam(value = "category") String category,
//                                       @RequestParam(value = "parentCategory") String parentCategory){
//        JsonResult result = new JsonResult();
//        //一级类别
////        DataCategorys dataCategorys = new DataCategorys();
////        dataCategorys.setCategory(category);
////        dataCategorys.setParentCategory("null");
////        dataCategorysDao.insert(dataCategorys);
//
//
//        //二级类别
//        DataCategorys dataCategorys = new DataCategorys();
//        dataCategorys.setParentCategory(parentCategory);
//        dataCategorys.setCategory(category);
//        dataCategorysDao.insert(dataCategorys);
//
//        result.setMsg("success");
//        result.setCode(0);
//        result.setData(dataCategorys.getId());
//
//
//
//        return result;
//    }

    /**
     * 数据条目 tabs接口
     */
    @RequestMapping(value = "/getDataApplication",method = RequestMethod.POST)
    public JsonResult getDataApplication(@RequestParam(value = "categoryId") String categoryId,
                                         @RequestParam(value = "type") String type){
        JsonResult result = new JsonResult();


        Criteria criteria = Criteria.where("classifications").is(categoryId);
        Query query = new Query(criteria);
        List<DataApplication> dataApplications = mongoTemplate.find(query,DataApplication.class);

        List<DataApplication> dataApplications1 = new ArrayList<>();
        for (int i=0;i<dataApplications.size();i++){
            if (dataApplications.get(i).getType().equals(type)){
                dataApplications1.add(dataApplications.get(i));
            }
        }
        List<Map>maps = new LinkedList<>();
        for (DataApplication dataApplication:dataApplications1){
            Map<String,String>map = new HashMap<String, String>();
            map.put("oid", dataApplication.getOid());
            map.put("name",dataApplication.getName());
            maps.add(map);
        }
        result.setMsg("success");
        result.setCode(0);
        result.setData(maps);
        return result;
    }

    //导入json数据入库
    @RequestMapping(value = "/addJosnInformation",method = RequestMethod.POST)
    public JsonResult addJosnInformation(@RequestParam(value = "jsonFile") MultipartFile file) throws IOException {
        JsonResult jsonResult = new JsonResult();
        String result = new BufferedReader(new InputStreamReader(file.getInputStream()))
                .lines().collect(Collectors.joining(System.lineSeparator()));

        JSONArray jsonArray = JSONObject.parseArray(result);
        Date now = new Date();
        for (int i=0;i<jsonArray.size();i++){
            DataItemNew dataItemNew = new DataItemNew();
            dataItemNew.setCreateTime(now);
            JSONObject jsonObject = (JSONObject) jsonArray.get(i);
            dataItemNew.setReference(jsonObject.getString("reference"));
            dataItemNew.setDescription(jsonObject.getString("description"));
            dataItemNew.setName(jsonObject.getString("name"));
            dataItemNew.setAuthor(jsonObject.getString("author"));
            dataItemNew.setDetail(jsonObject.getString("detail"));

            JSONObject jsonObject1 = jsonObject.getJSONObject("authorship");
            if (jsonObject1 !=null) {
                List<AuthorInfo> authorship = new ArrayList<>();
                JSONObject author = jsonObject1;
                AuthorInfo authorInfo = new AuthorInfo();
                authorInfo.setName(author.getString("name"));
                authorInfo.setEmail(author.getString("email"));
                authorInfo.setIns(author.getString("ins"));
                authorInfo.setHomepage(author.getString("homepage"));
                authorship.add(authorInfo);
                dataItemNew.setAuthorship(authorship);
            }
            JSONArray jsonArray1 = jsonObject.getJSONArray("classifications");
            if (jsonArray1!=null) {
                List<String> classifications = new ArrayList<>();
                for (int i1 = 0; i1 < jsonArray1.size(); i1++) {
                    classifications.add(jsonArray1.get(i1).toString());
                }
                dataItemNew.setClassifications(classifications);
            }

            dataItemNewDao.insert(dataItemNew);
        }

        return jsonResult;
    }

    @RequestMapping(value = "/addOtherInfo", method = RequestMethod.POST)
    public JsonResult addOtherInfo(@RequestParam(value = "authors") ArrayList<String> authors){
        JsonResult jsonResult = new JsonResult();
        List<DataItemNew> dataItemNews = dataItemNewDao.findAll();
        for (int i=0;i<dataItemNews.size();i++){
            String author ="";
            if (i<=100){
                author = authors.get(0);
            }else if (i <= 313){
                author = authors.get(1);
            } else if (i <= 456){
                author = authors.get(2);
            } else if (i <= 604){
                author = authors.get(3);
            } else if (i <= 800){
                author = authors.get(4);
            }

            DataItemNew dataItemNew = dataItemNews.get(i);
            dataItemNew.setAuthor(author);
            dataItemNew.setOid(UUID.randomUUID().toString());
            dataItemNew.setDataType("Url");
            dataItemNew.setLastModifyTime(dataItemNew.getCreateTime());
            dataItemNew.setStatus("Public");
            dataItemNew.setLock(false);
            dataItemNew.setShareCount(0);
            dataItemNew.setViewCount(0);
            dataItemNew.setThumbsUpCount(0);

            dataItemNewDao.save(dataItemNew);

        }

        return jsonResult;
    }

    @RequestMapping(value = "/addKeyWords", method = RequestMethod.POST)
    public JsonResult addKeyWords(){
        JsonResult jsonResult = new JsonResult();
        List<DataItemNew> dataItemNews = dataItemNewDao.findAll();
        for (DataItemNew dataItemNew:dataItemNews){
            ArrayList<String> keywords = new ArrayList<>();
            keywords.add(dataItemNew.getName());
            dataItemNew.setKeywords(keywords);
            dataItemNewDao.save(dataItemNew);
        }

        return jsonResult;
    }

    @RequestMapping(value = "/updateClassification", method = RequestMethod.GET)
    public JsonResult updateClassification(){
        JsonResult jsonResult = new JsonResult();
        List<DataItemNew> dataItemNews = dataItemNewDao.findAll();
        int logNum=0;
        for (DataItemNew dataItemNew:dataItemNews){
            logNum++;
            List<String> classification = dataItemNew.getClassifications();
            log.info(classification.get(0));
            String str = classification.get(0);
            if (str.equals("sectors")||str.equals("markets")){
                str = "Economic Regions";
            }
            if (str.equals("regional")){
                str = "integrated perspective";
            }
            if (str.equals("Water")||str.equals("Soil")||str.equals("landform")||str.equals("ecosystem")){
                str = "Land regions";
            }
            if (str.equals("seaWater")||str.equals("sea-ice")){
                str = "ocean regions";
            }
            if (str.equals("permafrost")){
                str = "frozen regions";
            }if (str.equals("climate")||str.equals("weather")){
                str = "atmosphere regions";
            }if (str.equals("lithosphere")||str.equals("mantle")){
                str = "solid earth";
            }if (str.equals("global")){
                str = "integrated perspective";
            }if (str.equals("outdoor")){
                str = "social regions";
            }
            //将首字母大写
            String[] split = str.split(" ");
            String s1 = "";
            for (int i=0;i< split.length;i++){
                String s2 = split[i].substring(0,1).toUpperCase()+split[i].substring(1);
                s1 += s2;
                s1+=" ";
            }
            s1=s1.substring(0,s1.length()-1);
            log.info(s1);
            DataCategorys dataCategorys = dataCategorysDao.findFirstByCategory(s1);
            log.info("log is "+logNum);
            String id = dataCategorys.getId();
            List<String> classifications = new ArrayList<>();
            classifications.add(id);
            dataItemNew.setClassifications(classifications);
            dataItemNewDao.save(dataItemNew);
        }

        return jsonResult;
    }

    //将新的dataItem添加到对应的类别中
    @RequestMapping(value = "/matchCategory", method = RequestMethod.GET)
    public JsonResult matchCategory(){
        JsonResult jsonResult = new JsonResult();
        List<DataItemNew> dataItemNews = dataItemNewDao.findAll();
        for (DataItemNew dataItemNew:dataItemNews){
            String cateId = dataItemNew.getClassifications().get(0);
            //匹配类别，将该条目加入类别中
            DataCategorys dataCategorys = dataCategorysDao.findFirstById(cateId);
            List<String> dataItemNewCa;
            if (dataCategorys.getDataItemNew()==null){
                dataItemNewCa = new ArrayList<>();
            }else {
                dataItemNewCa = dataCategorys.getDataItemNew();
            }
            dataItemNewCa.add(dataItemNew.getId());
            dataCategorys.setDataItemNew(dataItemNewCa);
            dataCategorysDao.save(dataCategorys);
        }
        return jsonResult;
    }





}
