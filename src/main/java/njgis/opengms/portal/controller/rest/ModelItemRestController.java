package njgis.opengms.portal.controller.rest;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import njgis.opengms.portal.bean.JsonResult;
import njgis.opengms.portal.dto.ClaimAuthorDTO;
import njgis.opengms.portal.dto.modelItem.ModelItemAddDTO;
import njgis.opengms.portal.dto.modelItem.ModelItemFindDTO;
import njgis.opengms.portal.dto.modelItem.ModelItemUpdateDTO;
import njgis.opengms.portal.entity.ComputableModel;
import njgis.opengms.portal.entity.ModelItem;
import njgis.opengms.portal.entity.User;
import njgis.opengms.portal.entity.support.AuthorInfo;
import njgis.opengms.portal.entity.support.ModelRelation;
import njgis.opengms.portal.service.ComputableModelService;
import njgis.opengms.portal.service.ModelItemService;
import njgis.opengms.portal.service.StatisticsService;
import njgis.opengms.portal.service.UserService;
import njgis.opengms.portal.utils.ResultUtils;
import njgis.opengms.portal.utils.Utils;
import org.apache.commons.io.IOUtils;
import org.dom4j.DocumentException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.CacheConfig;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.List;

/**
 * @ClassName ModelItemRestController
 * @Description todo
 * @Author Kai
 * @Date 2019/2/21
 * @Version 1.0.0
 * TODO
 */
@RestController
@CacheConfig(cacheNames = "modelItemCache")
@RequestMapping(value = "/modelItem")
public class ModelItemRestController {

    @Autowired
    ModelItemService modelItemService;

    @Autowired
    ComputableModelService computableModelService;

    @Autowired
    UserService userService;

    @Value("${htmlLoadPath}")
    private String htmlLoadPath;

    @RequestMapping(value="/repository",method = RequestMethod.GET)
    public ModelAndView getModelItems() {
        System.out.println("model items");

        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("model_items");


        return modelAndView;

    }

    @RequestMapping(value="/application",method = RequestMethod.GET)
    public ModelAndView getApplication() {

        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("modelApplication");


        return modelAndView;

    }

    @RequestMapping(value="/simulation",method = RequestMethod.GET)
    public ModelAndView getSimulation() {

        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("simulation");


        return modelAndView;

    }

    @RequestMapping(value="/add",method = RequestMethod.POST)
    public JsonResult addModelItem(HttpServletRequest request) throws IOException {

        MultipartHttpServletRequest multipartRequest = (MultipartHttpServletRequest) request;
        MultipartFile file=multipartRequest.getFile("info");
        String model=IOUtils.toString(file.getInputStream(),"utf-8");
        JSONObject jsonObject=JSONObject.parseObject(model);
        ModelItemAddDTO modelItemAddDTO=JSONObject.toJavaObject(jsonObject,ModelItemAddDTO.class);

        HttpSession session=request.getSession();

        if(session.getAttribute("uid")==null){
            return ResultUtils.error(-1,"no login");
        }

        System.out.println("add model item");

        String userName=session.getAttribute("uid").toString();

        ModelItem modelItem= modelItemService.insert(modelItemAddDTO,userName);
        userService.modelItemPlusPlus(userName);
        return ResultUtils.success(modelItem.getOid());
    }

    @RequestMapping(value = "/delete", method = RequestMethod.POST)
    public JsonResult deleteModelItem(@RequestParam(value="oid") String oid, HttpServletRequest request){
        HttpSession session=request.getSession();

        if(session.getAttribute("uid")==null){
            return ResultUtils.error(-1,"no login");
        }
        String userName=session.getAttribute("uid").toString();
        return ResultUtils.success(modelItemService.delete(oid,userName));

    }

    @RequestMapping(value = "/claimAuthorship", method = RequestMethod.POST)
    public JsonResult claimAuthorship(@RequestBody ClaimAuthorDTO authorInfo, HttpServletRequest request){
        HttpSession session=request.getSession();
        if(session.getAttribute("uid")==null){
            return ResultUtils.error(-1,"no login");
        }
        ModelItem modelItem = modelItemService.getByOid(authorInfo.getOid());
        if(modelItem.isLock()){
            return ResultUtils.error(-2,"The item is being edited, please do it later or contact opengms@njnu.edu.cn");
        }
        ModelItemUpdateDTO modelItemUpdateDTO = new ModelItemUpdateDTO();
        modelItemUpdateDTO.setOid(modelItem.getOid());
        modelItemUpdateDTO.setName(modelItem.getName());
        modelItemUpdateDTO.setUploadImage(modelItem.getImage());
        modelItemUpdateDTO.setDescription(modelItem.getDescription());
        modelItemUpdateDTO.setDetail(modelItem.getDetail());
        modelItemUpdateDTO.setStatus(modelItem.getStatus());
        modelItemUpdateDTO.setClassifications(modelItem.getClassifications());
        modelItemUpdateDTO.setKeywords(modelItem.getKeywords());
        modelItemUpdateDTO.setReferences(modelItem.getReferences());
        List<AuthorInfo> authorInfoList = modelItem.getAuthorship()==null?new ArrayList<>():modelItem.getAuthorship();
        AuthorInfo authorInfo1 = authorInfo;
        authorInfoList.add(authorInfo1);
        modelItemUpdateDTO.setAuthorship(authorInfoList);
        return ResultUtils.success(modelItemService.update(modelItemUpdateDTO,session.getAttribute("uid").toString()));

    }

    @RequestMapping(value = "/update", method = RequestMethod.POST)
    public JsonResult updateModelItem(HttpServletRequest request) throws IOException{

        HttpSession session=request.getSession();
        String uid=session.getAttribute("uid").toString();
        if(uid==null)
        {
            return ResultUtils.error(-2,"未登录");
        }

        MultipartHttpServletRequest multipartRequest = (MultipartHttpServletRequest) request;
        MultipartFile file=multipartRequest.getFile("info");
        String model=IOUtils.toString(file.getInputStream(),"utf-8");
        JSONObject jsonObject=JSONObject.parseObject(model);
        ModelItemUpdateDTO modelItemUpdateDTO=JSONObject.toJavaObject(jsonObject,ModelItemUpdateDTO.class);

        JSONObject result=modelItemService.update(modelItemUpdateDTO,uid);
        if(result==null){
            return ResultUtils.error(-1,"There is another version have not been checked, please contact opengms@njnu.edu.cn if you want to modify this item.");
        }
        else {
            return ResultUtils.success(result);
        }
    }

    @RequestMapping (value="/{id}",method = RequestMethod.GET)
    ModelAndView get(@PathVariable ("id") String id,HttpServletRequest request){
        return modelItemService.getPage(id,request);
    }

    @RequestMapping (value="/getInfo/{id}",method = RequestMethod.GET)
    JsonResult getInfo(@PathVariable ("id") String id){
        ModelItem modelItem=modelItemService.getByOid(id);
        modelItem.setImage(modelItem.getImage().equals("")?"":htmlLoadPath+modelItem.getImage());
        return ResultUtils.success(modelItem);
    }

    @RequestMapping (value="/list",method = RequestMethod.POST)
    public JsonResult list(ModelItemFindDTO modelItemFindDTO,@RequestParam(value="classifications[]") List<String> classes){
        System.out.println("model item list");
        return ResultUtils.success(modelItemService.list(modelItemFindDTO,null,classes));
    }

    @RequestMapping (value="/listByAuthor",method = RequestMethod.POST)
    JsonResult listByAuthor(ModelItemFindDTO modelItemFindDTO,
                            @RequestParam(value="classifications[]") List<String> classes,
                            HttpServletRequest request){
        HttpSession session = request.getSession();
        if(Utils.checkLoginStatus(session)==null){
            return ResultUtils.error(-1,"no login");
        }else{
            String userName = session.getAttribute("uid").toString();
            return ResultUtils.success(modelItemService.list(modelItemFindDTO,userName,classes));
        }

    }

    @RequestMapping (value = "/listByUserOid",method = RequestMethod.GET)
    JsonResult listByUserOid(ModelItemFindDTO modelItemFindDTO,@RequestParam(value="oid") String oid,HttpServletRequest request){
        HttpSession session = request.getSession();
        String loadUser = null;
        if(session.getAttribute("oid")!=null)
            loadUser =  session.getAttribute("oid").toString() ;

        return ResultUtils.success(modelItemService.listByUserOid(modelItemFindDTO,oid,loadUser));
    }

    @RequestMapping(value="/getRelation",method = RequestMethod.GET)
    JsonResult getRelation(@RequestParam(value = "type") String type,@RequestParam(value = "oid") String oid){

        JSONArray result=modelItemService.getRelation(oid,type);

        return ResultUtils.success(result);
    }

    @RequestMapping(value="/setRelation",method = RequestMethod.POST)
    JsonResult setRelation(@RequestParam(value="oid") String oid,
                           @RequestParam(value="type") String type,
                           @RequestParam(value = "relations[]") List<String> relations){

        String result=modelItemService.setRelation(oid,type,relations);

        return ResultUtils.success(result);

    }

    @RequestMapping(value="/setModelRelation",method = RequestMethod.POST)
    JsonResult setModelRelation(@RequestParam(value="oid") String oid,
                           @RequestParam(value = "relations[]") List<ModelRelation> relations){

        String result=modelItemService.setModelRelation(oid,relations);

        return ResultUtils.success(result);

    }

    @RequestMapping (value="/findNamesByName",method = RequestMethod.GET)
    JsonResult findNameByName(@RequestParam(value = "name") String name){
        return ResultUtils.success(modelItemService.findNamesByName(name));
    }

    @RequestMapping (value="/findByName",method = RequestMethod.GET)
    JsonResult findByName(@RequestParam(value = "name") String name){
        return ResultUtils.success(modelItemService.findByName(name));
    }

    @RequestMapping (value="/advance",method = RequestMethod.POST)
    JsonResult advanced(ModelItemFindDTO modelItemFindDTO,
                        @RequestParam(value="classifications[]") List<String> classes,
                        @RequestParam(value="connects[]") List<String> connects,
                        @RequestParam(value="props[]") List<String> props,
                        @RequestParam(value="values[]") List<String> values){
        try {
            return ResultUtils.success(modelItemService.query(modelItemFindDTO, connects, props, values, classes));
        }catch (ParseException e){
            return ResultUtils.error(-1,"error");
        }
    }

    @RequestMapping(value = "/bindModel",method = RequestMethod.GET)
    JsonResult bindModel(@RequestParam(value="type") int type,
                         @RequestParam(value="name") String name,
                         @RequestParam(value="oid") String oid)
    {
        JSONObject result=modelItemService.bindModel(type,name,oid);
        if(result.getInteger("code")==-1){
            return ResultUtils.error(-1,"no Model Item");
        }
        else {
            return ResultUtils.success(result.getString("oid"));
        }
    }

    @RequestMapping (value="/getModelItemsByUserId",method = RequestMethod.GET)
    public JsonResult getModelItemsByUserId(HttpServletRequest request,
                                                     @RequestParam(value="page") int page,
                                                     @RequestParam(value="sortType") String sortType,
                                                     @RequestParam(value="asc") int sortAsc){

        HttpSession session=request.getSession();
        if(session.getAttribute("uid")==null){
            return ResultUtils.error(-1,"no login");
        }
        String uid=session.getAttribute("uid").toString();

        JSONObject result=modelItemService.getModelItemsByUserId(uid,page,sortType,sortAsc);

        return ResultUtils.success(result);
    }

    @RequestMapping (value="/searchModelItemsByUserId",method = RequestMethod.GET)
    public JsonResult searchModelItemsByUserId(HttpServletRequest request,
                                               @RequestParam(value="searchText") String searchText,
                                            @RequestParam(value="page") int page,
                                            @RequestParam(value="sortType") String sortType,
                                            @RequestParam(value="asc") int sortAsc){

        HttpSession session=request.getSession();
        if(session.getAttribute("uid")==null){
            return ResultUtils.error(-1,"no login");
        }
        String uid=session.getAttribute("uid").toString();

        JSONObject result=modelItemService.searchModelItemsByUserId(searchText.trim(),uid,page,sortType,sortAsc);

        return ResultUtils.success(result);
    }

    @RequestMapping(value="/searchByNameByOid",method= RequestMethod.GET)
    JsonResult searchByTitle(ModelItemFindDTO modelItemFindDTO, String oid,HttpServletRequest request){
        HttpSession session = request.getSession();
        String loadUser = null;
        if(session.getAttribute("oid")!=null)
            loadUser =  session.getAttribute("oid").toString() ;

        return ResultUtils.success(modelItemService.searchByTitleByOid(modelItemFindDTO,oid,loadUser));
    }

    @RequestMapping (value="/DOISearch",method = RequestMethod.GET)
    public JsonResult DOISearch(@RequestParam(value="doi") String doi){

        String result=modelItemService.analysisDOI(doi);

        return ResultUtils.success(result);
    }

    @RequestMapping (value = "/getUserOidByOid", method = RequestMethod.GET)
    public JsonResult getUserOidByOid(@RequestParam(value="oid") String oid){
        ModelItem modelItem=modelItemService.getByOid(oid);
        String userId=modelItem.getAuthor();
        User user=userService.getByUid(userId);
        return ResultUtils.success(user.getOid());

    }

    @RequestMapping (value="/getDailyViewCount",method = RequestMethod.GET)
    public JsonResult getDailyViewCount(@RequestParam(value="oid") String oid) {
        ModelItem modelItem=modelItemService.getByOid(oid);
        List<String> computableModelIds = modelItem.getRelate().getComputableModels();
        List<ComputableModel> computableModelList=new ArrayList<>();
        for(int i=0;i<computableModelIds.size();i++){
            ComputableModel computableModel = computableModelService.getByOid(computableModelIds.get(i));
            computableModelList.add(computableModel);
        }

        StatisticsService statisticsService = new StatisticsService();
        JSONObject result = statisticsService.getDailyViewAndInvokeTimes(modelItem,computableModelList,30,null);

        return ResultUtils.success(result);
    }

    @RequestMapping(value="/searchByDOI",method=RequestMethod.POST)
    public JsonResult searchReferenceByDOI(@RequestParam(value="doi") String DOI,@RequestParam(value="modelOid") String modelOid, HttpServletRequest httpServletRequest) throws IOException, DocumentException {
        HttpSession session=httpServletRequest.getSession();

        if(session.getAttribute("oid")==null){
            return ResultUtils.error(-1,"no login");
        }
        String userOid=session.getAttribute("oid").toString();
        return ResultUtils.success(modelItemService.getArticleByDOI(DOI,modelOid,userOid));
    }


}
