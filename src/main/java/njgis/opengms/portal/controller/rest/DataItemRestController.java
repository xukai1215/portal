package njgis.opengms.portal.controller.rest;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import njgis.opengms.portal.bean.JsonResult;
import njgis.opengms.portal.bean.datacontainer.AddDataResource;
import njgis.opengms.portal.dao.CategoryDao;
import njgis.opengms.portal.dao.ModelItemDao;
import njgis.opengms.portal.dto.categorys.CategoryAddDTO;
import njgis.opengms.portal.dto.comments.CommentsAddDTO;
import njgis.opengms.portal.dto.comments.CommentsUpdateDTO;
import njgis.opengms.portal.dto.dataItem.DataItemAddDTO;
import njgis.opengms.portal.dto.dataItem.DataItemFindDTO;
import njgis.opengms.portal.dto.dataItem.DataItemUpdateDTO;
import njgis.opengms.portal.entity.Categorys;
import njgis.opengms.portal.entity.DataItem;
import njgis.opengms.portal.entity.ModelItem;
import njgis.opengms.portal.entity.support.AuthorInfo;
import njgis.opengms.portal.service.DataItemService;
import njgis.opengms.portal.service.ModelItemService;
import njgis.opengms.portal.service.UserService;
import njgis.opengms.portal.utils.ResultUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.http.converter.ByteArrayHttpMessageConverter;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;

import java.io.IOException;
import java.util.*;

/**
 * @ClassName DataItemController
 * @Description todo
 * @Author sun_liber
 * @Date 2019/2/13
 * @Version 1.0.0
 */
@RestController
@RequestMapping (value = "/dataItem")
public class DataItemRestController {

    @Autowired
    DataItemService dataItemService;

    @Autowired
    ModelItemService modelItemService;

    @Autowired
    ModelItemDao modelItemDao;

    @Autowired
    CategoryDao categoryDao;

    @Autowired
    UserService userService;

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
    @RequestMapping("/repository")
    public ModelAndView getModelItems( ){

        System.out.println("data-items-page");

        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("data_items");

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
        return ResultUtils.success(dataItemService.searchByName(dataItemFindDTO));
    }

    /**
     * dataItems页面，分页和分类的唯一标识
     * @param categorysId
     * @param page
     * @return
     */
    @RequestMapping(value = "/items/{categorysId}&{page}",method = RequestMethod.GET)
    JsonResult listByClassification(
            @PathVariable  String categorysId,
            @PathVariable Integer page


    ){
        return ResultUtils.success(dataItemService.findByCateg(categorysId,page,false,10));

    }


    /**
     * dataitem页面，获取hubs内容
     * @param hubnbm
     * @return
     */
    @RequestMapping(value = "/hubs",method = RequestMethod.GET)
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

//        view.setViewName("/dataItems/"+id);

        DataItem dataItem=dataItemService.getById(id);

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
                    ModelItem modelItem = modelItemDao.findFirstById(mid);
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

        //category
        List<String> classifications=new ArrayList<>();
        List<String> categories=dataItem.getClassifications();
        for(String category:categories){
            Categorys categorys=categoryDao.findFirstById(category);
            String name=categorys.getCategory();
            if(name.equals("...All")){
                Categorys categorysParent=categoryDao.findFirstById(categorys.getParentCategory());
                classifications.add(categorysParent.getCategory());
            }
            else{
                classifications.add(name);
            }
        }

        view.setViewName("data_item_info");
        view.addObject("datainfo",ResultUtils.success(dataItem));
        view.addObject("user",userJson);
        view.addObject("classifications",classifications);
        view.addObject("relatedModels",modelItemArray);
        view.addObject("authorship",authorshipString);

        return view;
    }

    /**
     * 依据id，获取datainfo详情页面对应数据的评论
     * @param id
     * @return
     */
    @RequestMapping(value="/getcomment/{id}",method = RequestMethod.GET)
    JsonResult getComment(@PathVariable ("id") String id){
        return ResultUtils.success(dataItemService.getById(id));
    }

    /**
     *对datainfo评论回复
     * @author lan
     * @param commentsAddDTO 数据条目id,评论id,对评论的评论内容及作者
     *
     */
    @RequestMapping(value="/reply",method = RequestMethod.POST)
    JsonResult reply(@RequestBody CommentsAddDTO commentsAddDTO){
        dataItemService.reply(commentsAddDTO);
        return ResultUtils.success();
    }

    /***
     * 为datainfo特定数据添加评论
     * @author lan
     * @param commentsAddDTO 数据内容
     * @return
     */
    @RequestMapping(value="/putcomment",method = RequestMethod.POST)
    JsonResult putcomment(@RequestBody CommentsAddDTO commentsAddDTO){
        dataItemService.putComment(commentsAddDTO);
        return ResultUtils.success();
    }


    /**
     * 为datainfo特定数据进行点赞
     * @param commentsUpdateDTO
     * @return
     */
    @RequestMapping(value="/thumbsup",method = RequestMethod.POST)
    Integer putcomment(@RequestBody CommentsUpdateDTO commentsUpdateDTO){

        return dataItemService.thumbsUp(commentsUpdateDTO);
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
            @RequestParam(value="page") Integer page,
            @RequestParam(value="pageSize") Integer pagesize,
            @RequestParam(value="asc") boolean asc,
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
    JsonResult delete(@RequestParam(value="id") String id) {
        dataItemService.delete(id);
        return ResultUtils.success();
    }





    /**
     * 个人中心动态创建分类树
     * @return
     */
    @RequestMapping(value = "/createTree",method = RequestMethod.GET)
    Map<String,List<Map<String,String >>> createTree(){
        return dataItemService.createTree();
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



    /**
     * 添加数据资源，在上传数据资源文件到数据容器后，我们还需要对其进行字段补充，再添加到数据库
     * @param dataResource
     * @return
     */
    @RequestMapping (value = "/addDataResource", method = RequestMethod.POST)
    JsonResult addDataResource(@RequestBody AddDataResource dataResource) {
        RestTemplate restTemplate = new RestTemplate();
        JSONObject jsonObject =
                restTemplate.postForObject("http://" + dataContainerIpAndPort + "/dataResource",
                        dataResource,
                        JSONObject.class);
        return ResultUtils.success(jsonObject);
    }




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
    };


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


    /**
     * //todo 测试接口
     * @param dataItemFindDTO
     * @return
     */
    @RequestMapping(value="/test",method = RequestMethod.POST)
    JsonResult test(@RequestBody DataItemFindDTO dataItemFindDTO){
        return ResultUtils.success(dataItemService.test(dataItemFindDTO));
    }


}
