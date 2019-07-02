package njgis.opengms.portal.controller.rest;

import com.alibaba.fastjson.JSONObject;
import njgis.opengms.portal.PortalApplication;
import njgis.opengms.portal.bean.JsonResult;
import njgis.opengms.portal.bean.datacontainer.AddDataResource;
import njgis.opengms.portal.dto.categorys.CategoryAddDTO;
import njgis.opengms.portal.dto.comments.CommentsAddDTO;
import njgis.opengms.portal.dto.comments.CommentsUpdateDTO;
import njgis.opengms.portal.dto.dataItem.DataItemAddDTO;
import njgis.opengms.portal.dto.dataItem.DataItemFindDTO;
import njgis.opengms.portal.dto.dataItem.DataItemUpdateDTO;
import njgis.opengms.portal.dto.dataItem.DataitemClassificationsDTO;
import njgis.opengms.portal.service.DataItemService;
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
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import org.thymeleaf.templateresolver.ClassLoaderTemplateResolver;

import java.io.FileWriter;
import java.io.IOException;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
    UserService userService;

    @Value ("${dataContainerIpAndPort}")
    String dataContainerIpAndPort;

    @RequestMapping (value = "", method = RequestMethod.GET)
    JsonResult list(DataItemFindDTO dataItemFindDTO) {

        return ResultUtils.success(dataItemService.list(dataItemFindDTO));

    }


// 新加一个dataitem
    @RequestMapping (value = "", method = RequestMethod.POST)
    JsonResult add(@RequestBody DataItemAddDTO dataItemAddDTO) {
        return ResultUtils.success(dataItemService.insert(dataItemAddDTO));
    }


    @RequestMapping (value = "/{id}", method = RequestMethod.GET)
    ModelAndView get(@PathVariable ("id") String id){

        ModelAndView view = new ModelAndView();
//        view.addObject("datainfo",ResultUtils.success(dataItemService.getById(id)));
        view.setViewName("/dataItems/"+id);
        return view;
    }

    //取得数据项单元内容
    @RequestMapping(value="/getcomment/{id}",method = RequestMethod.GET)
    JsonResult getComment(@PathVariable ("id") String id){
        return ResultUtils.success(dataItemService.getById(id));
    }

    /**
     *
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
     * @author lan
     * @param commentsAddDTO 数据内容
     * @return
     */
    @RequestMapping(value="/putcomment",method = RequestMethod.POST)
    JsonResult putcomment(@RequestBody CommentsAddDTO commentsAddDTO){
        dataItemService.putComment(commentsAddDTO);
        return ResultUtils.success();
    }


    //点赞
    @RequestMapping(value="/thumbsup",method = RequestMethod.POST)
    Integer putcomment(@RequestBody CommentsUpdateDTO commentsUpdateDTO){

        return dataItemService.thumbsUp(commentsUpdateDTO);
    }

    //用户中心创建dataitem
    @RequestMapping(value="/adddataitembyuser",method = RequestMethod.GET)
    Integer addUserData(@RequestParam(value="id") String id) throws IOException{

        return dataItemService.addDataItemByUser(id);
    }
    //用户中心数据条目总数

    @RequestMapping(value="/amountofuserdata",method = RequestMethod.GET)
    Integer userDataAmount(@RequestParam(value="author") String author){

        return dataItemService.getAmountOfData(author);
    }
    //viewCount
    @RequestMapping(value="/viewplus",method = RequestMethod.GET)
    Integer viewCountPlus(@RequestParam(value="id") String id){

        return dataItemService.viewCountPlus(id);
    }
    //getViewCount
    @RequestMapping(value="/viewcount",method = RequestMethod.GET)
    Integer getViewCount(@RequestParam(value="id") String id){

        return dataItemService.getViewCount(id);
    }


    @RequestMapping (value = "/del", method = RequestMethod.GET)
    JsonResult delete(@RequestParam(value="id") String id) {
        dataItemService.delete(id);
        return ResultUtils.success();
    }



    @RequestMapping (value = "/{id}", method = RequestMethod.PUT)
    JsonResult update(@PathVariable ("id") String id, @RequestBody DataItemUpdateDTO dataItemUpdateDTO) {
        dataItemService.update(id, dataItemUpdateDTO);
        return ResultUtils.success();
    }




    /*******/
    // 数据条目中包含的数据资源（涉及到数据资源描述信息和数据资源实体）存储在数据容器中，因此需要调用数据容器的部分接口
    /*******/

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



        JSONObject jsonObject =
                restTemplate.postForObject("http://" + dataContainerIpAndPort + "/file/upload/store_dataResource_files",
                        part,
                        JSONObject.class);

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


    //获得数据量count
    @RequestMapping (value = "/count", method = RequestMethod.GET)
    JsonResult count() {
        return ResultUtils.success(dataItemService.count());
    }

    //按名查询
    @RequestMapping(value="/listBySearch",method = RequestMethod.POST)
    JsonResult listByName(@RequestBody DataItemFindDTO dataItemFindDTO){
        return ResultUtils.success(dataItemService.listBySearch(dataItemFindDTO));
    }
    //按分级查询
    @RequestMapping(value = "/categorys",method = RequestMethod.POST)
    JsonResult listByClassification(@RequestBody DataItemFindDTO dataItemFindDTO){
        return ResultUtils.success(dataItemService.findByCateg(dataItemFindDTO));
    }

    //用户创建分类数据条目id入库
    @RequestMapping(value="/addcate",method = RequestMethod.POST)
    JsonResult addUserCreateDataItemId(@RequestBody CategoryAddDTO categoryAddDTO){

        return ResultUtils.success(dataItemService.addCateId(categoryAddDTO));

    }


    //取得hubs
    @RequestMapping(value = "/hubs",method = RequestMethod.GET)
    JsonResult getHubs(@RequestParam(value = "hubnbm")Integer hubnbm){
        return ResultUtils.success(dataItemService.getHubs(hubnbm));
    }



    //动态生成树
    @RequestMapping(value = "/createTree",method = RequestMethod.GET)
    Map<String,List<Map<String,String >>> createTree(){
        return dataItemService.createTree();
    }
    //动态拿到data_item_info页面中的category

    //data_item_info中的category
    @RequestMapping(value = "/category",method = RequestMethod.GET)
    JsonResult getCategory(@RequestParam(value = "id") String id){
        return ResultUtils.success(dataItemService.getCategory(id));
    }



    //getRelated modelsList
    @RequestMapping(value = "/briefrelatedmodels",method = RequestMethod.GET)
    JsonResult getBriefRelatedModels(@RequestParam(value = "id") String id){
        return ResultUtils.success(dataItemService.getRelatedModels(id));
    }
    @RequestMapping(value = "/allrelatedmodels",method = RequestMethod.GET)
    JsonResult getRelatedModels(@RequestParam(value = "id") String id,@RequestParam(value = "more") Integer more){
        return ResultUtils.success(dataItemService.getAllRelatedModels(id,more));
    }
    //addRelated Models
    @RequestMapping(value = "/models",method = RequestMethod.POST)
    JsonResult addRelatedModels(@RequestBody DataItemFindDTO dataItemFindDTO){
        return ResultUtils.success(dataItemService.addRelatedModels(dataItemFindDTO.getDataId(),dataItemFindDTO.getRelatedModels()));
    }

    //getRelated data sList
    @RequestMapping(value = "/briefrelateddata",method = RequestMethod.GET)
    JsonResult getBriefRelatedDatas(@RequestParam(value = "id") String id){
        return ResultUtils.success(dataItemService.getRelatedModels(id));
    }
    @RequestMapping(value = "/allrelateddata",method = RequestMethod.GET)
    JsonResult getRelatedDatas(@RequestParam(value = "id") String id,@RequestParam(value = "more") Integer more){
        return ResultUtils.success(dataItemService.getAllRelatedModels(id,more));
    }
    //addRelated Data
    @RequestMapping(value = "/data",method = RequestMethod.POST)
    JsonResult addRelatedDatas(@RequestBody DataItemFindDTO dataItemFindDTO){
        return ResultUtils.success(dataItemService.addRelatedModels(dataItemFindDTO.getDataId(),dataItemFindDTO.getRelatedModels()));
    }








}
