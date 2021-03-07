package njgis.opengms.portal.controller.rest;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import njgis.opengms.portal.bean.JsonResult;
import njgis.opengms.portal.dao.ModelItemDao;
import njgis.opengms.portal.dao.UserDao;
import njgis.opengms.portal.dto.ClaimAuthorDTO;
import njgis.opengms.portal.dto.modelItem.ModelItemAddDTO;
import njgis.opengms.portal.dto.modelItem.ModelItemFindDTO;
import njgis.opengms.portal.dto.modelItem.ModelItemResultDTO;
import njgis.opengms.portal.dto.modelItem.ModelItemUpdateDTO;
import njgis.opengms.portal.entity.Classification;
import njgis.opengms.portal.entity.ComputableModel;
import njgis.opengms.portal.entity.ModelItem;
import njgis.opengms.portal.entity.User;
import njgis.opengms.portal.entity.support.*;
import njgis.opengms.portal.enums.RelationTypeEnum;
import njgis.opengms.portal.service.*;
import njgis.opengms.portal.utils.ResultUtils;
import njgis.opengms.portal.utils.Utils;
import org.apache.commons.io.IOUtils;
import org.dom4j.DocumentException;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.CacheConfig;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.io.*;
import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

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
    UserDao userDao;

    @Autowired
    ModelItemDao modelItemDao;

    @Autowired
    ModelItemService modelItemService;

    @Autowired
    ComputableModelService computableModelService;

    @Autowired
    UserService userService;

    @Autowired
    ClassificationService classificationService;

    @Autowired
    Classification2Service classification2Service;

    @Autowired
    CommonService commonService;

    @Value("${htmlLoadPath}")
    private String htmlLoadPath;

    @Value("${resourcePath}")
    private String resourcePath;

    @RequestMapping(value="/repository",method = RequestMethod.GET)
    public ModelAndView getModelItems() {
        System.out.println("model items");

        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("model_items");


        return modelAndView;

    }

    @RequestMapping(value = "/repository1", method = RequestMethod.GET)
    public ModelAndView getModelItems1() {
        System.out.println("model items");

        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("model_items1");


        return modelAndView;

    }

    @RequestMapping(value = "/repository2", method = RequestMethod.GET)
    public ModelAndView getModelItems2() {
        System.out.println("model items");

        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("model_items2");


        return modelAndView;

    }

    @RequestMapping(value="/application",method = RequestMethod.GET)
    public ModelAndView getApplication() {

        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("modelApplication");


        return modelAndView;

    }

    @RequestMapping(value = "/updateClass", method = RequestMethod.POST)
    public JsonResult updateClass(@RequestParam(value = "oid") String oid,
                                  @RequestParam(value = "class1[]") List<String> class1,
                                  @RequestParam(value = "class2[]",required = false) List<String> class2,
                                  HttpServletRequest request){
        HttpSession session=request.getSession();
        String uid=session.getAttribute("uid").toString();
        if(uid==null)
        {
            return ResultUtils.error(-2,"未登录");
        }


        ModelItem modelItem = modelItemDao.findFirstByOid(oid);

        String author = modelItem.getAuthor();

        if(author.equals(uid)) {
            modelItem.setClassifications(class1);
            modelItem.setClassifications2(class2);
            modelItemDao.save(modelItem);

            return ResultUtils.success("suc");
        }else{
            ModelItemUpdateDTO modelItemUpdateDTO = new ModelItemUpdateDTO();
            modelItemUpdateDTO.setOid(modelItem.getOid());
            modelItemUpdateDTO.setName(modelItem.getName());
            modelItemUpdateDTO.setAlias(modelItem.getAlias());
            modelItemUpdateDTO.setUploadImage(modelItem.getImage());
            modelItemUpdateDTO.setDescription(modelItem.getDescription());
            modelItemUpdateDTO.setDetail(modelItem.getDetail());
            modelItemUpdateDTO.setStatus(modelItem.getStatus());
            modelItemUpdateDTO.setLocalizationList(modelItem.getLocalizationList());
            modelItemUpdateDTO.setAuthorship(modelItem.getAuthorship());
            modelItemUpdateDTO.setClassifications(class1);
            modelItemUpdateDTO.setClassifications2(class2);
            modelItemUpdateDTO.setKeywords(modelItem.getKeywords());
            modelItemUpdateDTO.setReferences(modelItem.getReferences());
            modelItemUpdateDTO.setModelRelationList(modelItem.getModelRelationList());
            modelItemUpdateDTO.setRelate(modelItem.getRelate());
            modelItemUpdateDTO.setRelatedData(modelItem.getRelatedData());
            modelItemUpdateDTO.setMetadata(modelItem.getMetadata());


            modelItemService.update(modelItemUpdateDTO,uid);

            return ResultUtils.success("version");
        }

    }


    @RequestMapping(value = "/updateDesctription", method = RequestMethod.POST)
    public JsonResult updateDesctription(HttpServletRequest request){
        HttpSession session=request.getSession();
        String uid=session.getAttribute("uid").toString();
        if(uid==null)
        {
            return ResultUtils.error(-2,"未登录");
        }

        String oid = request.getParameter("oid");
        String localizationListStr = request.getParameter("localization");

        JSONArray j_localizationList = JSONArray.parseArray(localizationListStr);
        List<Localization> localizationList =JSONObject.parseArray(j_localizationList.toJSONString(), Localization.class);;

        ModelItem modelItem = modelItemDao.findFirstByOid(oid);

        String author = modelItem.getAuthor();

        if(author.equals(uid)){
            modelItem.setLocalizationList(localizationList);
            modelItemDao.save(modelItem);
            return ResultUtils.success("suc");
        }else{
            ModelItemUpdateDTO modelItemUpdateDTO = new ModelItemUpdateDTO();
            modelItemUpdateDTO.setOid(modelItem.getOid());
            modelItemUpdateDTO.setName(modelItem.getName());
            modelItemUpdateDTO.setAlias(modelItem.getAlias());
            modelItemUpdateDTO.setUploadImage(modelItem.getImage());
            modelItemUpdateDTO.setDescription(modelItem.getDescription());
            modelItemUpdateDTO.setDetail(modelItem.getDetail());
            modelItemUpdateDTO.setStatus(modelItem.getStatus());
            modelItemUpdateDTO.setLocalizationList(localizationList);
            modelItemUpdateDTO.setAuthorship(modelItem.getAuthorship());
            modelItemUpdateDTO.setClassifications(modelItem.getClassifications());
            modelItemUpdateDTO.setClassifications2(modelItem.getClassifications2());
            modelItemUpdateDTO.setKeywords(modelItem.getKeywords());
            modelItemUpdateDTO.setReferences(modelItem.getReferences());
            modelItemUpdateDTO.setRelate(modelItem.getRelate());
            modelItemUpdateDTO.setModelRelationList(modelItem.getModelRelationList());
            modelItemUpdateDTO.setRelatedData(modelItem.getRelatedData());
            modelItemUpdateDTO.setMetadata(modelItem.getMetadata());

            modelItemService.update(modelItemUpdateDTO,uid);

            return ResultUtils.success("version");
        }

//        modelItem.setLocalizationList(localizationList);
//        modelItemDao.save(modelItem);

    }

    @RequestMapping(value = "/updateMetadata", method = RequestMethod.POST)
    public JsonResult updateMetadata(HttpServletRequest request){
        HttpSession session=request.getSession();
        String uid=session.getAttribute("uid").toString();
        if(uid==null)
        {
            return ResultUtils.error(-2,"未登录");
        }

        String oid = request.getParameter("oid");
        String metadataStr = request.getParameter("metadata");

        JSONObject j_metadata = JSONObject.parseObject(metadataStr);
        ModelMetadata metadata = JSONObject.toJavaObject(j_metadata, ModelMetadata.class);;

        ModelItem modelItem = modelItemDao.findFirstByOid(oid);

        String author = modelItem.getAuthor();

        if(author.equals(uid)){
            modelItem.setMetadata(metadata);
            modelItemDao.save(modelItem);
            return ResultUtils.success("suc");
        }else{
            ModelItemUpdateDTO modelItemUpdateDTO = new ModelItemUpdateDTO();
            modelItemUpdateDTO.setOid(modelItem.getOid());
            modelItemUpdateDTO.setName(modelItem.getName());
            modelItemUpdateDTO.setAlias(modelItem.getAlias());
            modelItemUpdateDTO.setUploadImage(modelItem.getImage());
            modelItemUpdateDTO.setDescription(modelItem.getDescription());
            modelItemUpdateDTO.setDetail(modelItem.getDetail());
            modelItemUpdateDTO.setStatus(modelItem.getStatus());
            modelItemUpdateDTO.setLocalizationList(modelItem.getLocalizationList());
            modelItemUpdateDTO.setAuthorship(modelItem.getAuthorship());
            modelItemUpdateDTO.setClassifications(modelItem.getClassifications());
            modelItemUpdateDTO.setClassifications2(modelItem.getClassifications2());
            modelItemUpdateDTO.setKeywords(modelItem.getKeywords());
            modelItemUpdateDTO.setReferences(modelItem.getReferences());
            modelItemUpdateDTO.setRelate(modelItem.getRelate());
            modelItemUpdateDTO.setModelRelationList(modelItem.getModelRelationList());
            modelItemUpdateDTO.setRelatedData(modelItem.getRelatedData());
            modelItemUpdateDTO.setMetadata(metadata);


            modelItemService.update(modelItemUpdateDTO,uid);

            return ResultUtils.success("version");
        }

//        modelItem.setLocalizationList(localizationList);
//        modelItemDao.save(modelItem);

    }

    @RequestMapping(value = "/updateReference", method = RequestMethod.POST)
    public JsonResult updateReference(HttpServletRequest request){
        HttpSession session=request.getSession();
        String uid=session.getAttribute("uid").toString();
        if(uid==null)
        {
            return ResultUtils.error(-2,"未登录");
        }

        String oid = request.getParameter("oid");
        String referenceListStr = request.getParameter("reference");

        JSONArray j_referenceList = JSONArray.parseArray(referenceListStr);
        List<Reference> referenceList =JSONObject.parseArray(j_referenceList.toJSONString(), Reference.class);;

        ModelItem modelItem = modelItemDao.findFirstByOid(oid);

        String author = modelItem.getAuthor();

        if(author.equals(uid)){
            modelItem.setReferences(referenceList);
            modelItemDao.save(modelItem);
            return ResultUtils.success("suc");
        }else{
            ModelItemUpdateDTO modelItemUpdateDTO = new ModelItemUpdateDTO();
            modelItemUpdateDTO.setOid(modelItem.getOid());
            modelItemUpdateDTO.setName(modelItem.getName());
            modelItemUpdateDTO.setAlias(modelItem.getAlias());
            modelItemUpdateDTO.setUploadImage(modelItem.getImage());
            modelItemUpdateDTO.setDescription(modelItem.getDescription());
            modelItemUpdateDTO.setDetail(modelItem.getDetail());
            modelItemUpdateDTO.setStatus(modelItem.getStatus());
            modelItemUpdateDTO.setLocalizationList(modelItem.getLocalizationList());
            modelItemUpdateDTO.setAuthorship(modelItem.getAuthorship());
            modelItemUpdateDTO.setClassifications(modelItem.getClassifications());
            modelItemUpdateDTO.setClassifications2(modelItem.getClassifications2());
            modelItemUpdateDTO.setKeywords(modelItem.getKeywords());
            modelItemUpdateDTO.setReferences(referenceList);
            modelItemUpdateDTO.setRelate(modelItem.getRelate());
            modelItemUpdateDTO.setModelRelationList(modelItem.getModelRelationList());
            modelItemUpdateDTO.setRelatedData(modelItem.getRelatedData());
            modelItemUpdateDTO.setMetadata(modelItem.getMetadata());

            modelItemService.update(modelItemUpdateDTO,uid);

            return ResultUtils.success("version");
        }

//        modelItem.setLocalizationList(localizationList);
//        modelItemDao.save(modelItem);

    }

    @RequestMapping(value="/simulation",method = RequestMethod.GET)
    public ModelAndView getSimulation() {

        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("simulation");


        return modelAndView;

    }

    @RequestMapping(value="/relationGraph",method = RequestMethod.GET)
    public ModelAndView relationGraph() {

        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("modelRelationGraph");


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
        BeanUtils.copyProperties(modelItem, modelItemUpdateDTO);
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

    @RequestMapping (value = "/getDetailByLanguage", method = RequestMethod.GET)
    JsonResult getDetailByLanguage(@RequestParam(value="oid") String oid, @RequestParam(value="language") String language){

        ModelItem modelItem = modelItemService.getByOid(oid);
        List<Localization> localizationList = modelItem.getLocalizationList();
        for(Localization localization : localizationList){
            if(localization.getLocalName().equals(language)){
                return ResultUtils.success(localization.getDescription());
            }
        }
        return ResultUtils.error(-1,"language does not exist in this model item.");
    }

    @RequestMapping(value = "/getClassification/{id}", method = RequestMethod.GET)
    JsonResult getClass(@PathVariable("id") String id){
        ModelItem modelItem = modelItemService.getByOid(id);
        JSONObject obj = new JSONObject();
        obj.put("class1",modelItem.getClassifications());
        obj.put("class2",modelItem.getClassifications2());
        return ResultUtils.success(obj);
    }

    @RequestMapping(value = "/getDescription/{id}", method = RequestMethod.GET)
    JsonResult getDescription(@PathVariable("id") String id){
        ModelItem modelItem = modelItemService.getByOid(id);

        return ResultUtils.success(modelItem.getLocalizationList());
    }

    @RequestMapping(value = "/getMetadata/{id}", method = RequestMethod.GET)
    JsonResult getMetadata(@PathVariable("id") String id){
        ModelItem modelItem = modelItemService.getByOid(id);

        return ResultUtils.success(modelItem.getMetadata());
    }

    @RequestMapping(value = "/getReference/{id}", method = RequestMethod.GET)
    JsonResult getReference(@PathVariable("id") String id) {
        ModelItem modelItem = modelItemService.getByOid(id);

        return ResultUtils.success(modelItem.getReferences());
    }

    @RequestMapping(value = "/searchClass")
    public JsonResult searchClass(ModelItemFindDTO modelItemFindDTO, @RequestParam(value = "classNum") int num, @RequestParam(value = "classifications[]") List<String> classes) {
        int page = modelItemFindDTO.getPage();
        int pageSize = modelItemFindDTO.getPageSize();
        String searchText = modelItemFindDTO.getSearchText();
        //List<String> classifications=modelItemFindDTO.getClassifications();
        //默认以viewCount排序
        Sort sort = new Sort(modelItemFindDTO.getAsc() ? Sort.Direction.ASC : Sort.Direction.DESC, "createTime");
        Pageable pageable = PageRequest.of(page, pageSize, sort);

        Classification classification;
        if (num == 1) {
            classification = classificationService.getByOid(classes.get(0));
        } else {
            classification = classification2Service.getByOid(classes.get(0));
        }
        if (classification != null) {
            List<String> children = classification.getChildrenId();
            if (children.size() > 0) {
                for (String child : children
                ) {
                    classes.add(child);
                    Classification classification1 = num == 1 ? classificationService.getByOid(child) : classification2Service.getByOid(child);
                    List<String> children1 = classification1.getChildrenId();
                    if (children1.size() > 0) {
                        for (String child1 : children1) {
                            classes.add(child1);
                        }
                    }
                }
            }
        }


        Page<ModelItemResultDTO> modelItemPage;
        if (num == 1) {
            if (classes.get(0).equals("all")) {
                modelItemPage = modelItemDao.findByNameContainsIgnoreCaseAndClassifications2IsNull(searchText, pageable);
            } else {
                modelItemPage = modelItemDao.findByNameContainsIgnoreCaseAndClassificationsInAndClassifications2IsNull(searchText, classes, pageable);
            }
        } else {
            if (classes.get(0).equals("all")) {
                modelItemPage = modelItemDao.findByNameContainsIgnoreCaseAndClassifications2IsNotNull(searchText, pageable);
            } else {
                modelItemPage = modelItemDao.findByNameContainsIgnoreCaseAndClassifications2In(searchText, classes, pageable);
            }
        }
        List<ModelItemResultDTO> modelItems = modelItemPage.getContent();
        JSONArray users = new JSONArray();
        for (int i = 0; i < modelItems.size(); i++) {
            ModelItemResultDTO modelItem = modelItems.get(i);
            String image = modelItem.getImage();
            if (!image.equals("")) {
                modelItem.setImage(htmlLoadPath + image);
            }

            JSONObject userObj = new JSONObject();
            User user = userDao.findFirstByUserName(modelItems.get(i).getAuthor());
            userObj.put("oid", user.getOid());
            userObj.put("image", user.getImage().equals("") ? "" : htmlLoadPath + user.getImage());
            userObj.put("name", user.getName());

            users.add(userObj);

            modelItems.get(i).setAuthor_name(user.getName());
            modelItems.get(i).setAuthor_oid(user.getOid());
//            modelItems.get(i).setAuthor(user.getName());

        }

        JSONObject obj = new JSONObject();
        obj.put("list", modelItems);
        obj.put("total", modelItemPage.getTotalElements());
        obj.put("pages", modelItemPage.getTotalPages());
        obj.put("users", users);

        return ResultUtils.success(obj);
    }

    @RequestMapping(value = "/list", method = RequestMethod.POST)
    public JsonResult list(ModelItemFindDTO modelItemFindDTO, @RequestParam(value = "classifications[]") List<String> classes, @RequestParam(value = "classType", required = false) Integer classType) {
        System.out.println("model item list");
        if (classType == null || classType != 2) {
            return ResultUtils.success(modelItemService.list(modelItemFindDTO, null, classes));
        } else {
            return ResultUtils.success(modelItemService.list2(modelItemFindDTO, null, classes));
        }
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
        oid= URLDecoder.decode(oid);
        return ResultUtils.success(modelItemService.listByUserOid(modelItemFindDTO,oid,loadUser));
    }

    @RequestMapping(value="/getRelatedResources",method = RequestMethod.GET)
    JsonResult getRelatedResources(@RequestParam(value = "oid") String oid){

        JSONArray result=modelItemService.getRelatedResources(oid);

        return ResultUtils.success(result);
    }

    @RequestMapping(value="/getRelation",method = RequestMethod.GET)
    JsonResult getRelation(@RequestParam(value = "type") String type,@RequestParam(value = "oid") String oid){

        JSONArray result=modelItemService.getRelation(oid,type);

        return ResultUtils.success(result);
    }

    @RequestMapping(value="/setRelation",method = RequestMethod.POST)
    JsonResult setRelation(@RequestParam(value="oid") String oid,
                           @RequestParam(value="type") String type,
                           @RequestParam(value = "relations[]") List<String> relations,
                           HttpServletRequest request
                           ){

        HttpSession session=request.getSession();
        String uid=session.getAttribute("uid").toString();
        if(uid==null)
        {
            return ResultUtils.error(-2,"未登录");
        }

        String result=modelItemService.setRelation(oid,type,relations,uid);

        return ResultUtils.success(result);

    }

    @RequestMapping(value = "/addRelateResources/{oid}", method = RequestMethod.POST)
    JsonResult addRelateResources(@PathVariable(value="oid") String oid,
                                 HttpServletRequest request) throws IOException {

        MultipartHttpServletRequest multipartRequest = (MultipartHttpServletRequest) request;
        List<MultipartFile> files=multipartRequest.getFiles("resources");

        String info=multipartRequest.getParameter("stringInfo");

        List<Map<String,String>> infoArray = (List<Map<String,String>>) JSONArray.parse(info);

        HttpSession session=request.getSession();
        String uid=session.getAttribute("uid").toString();
        if(uid==null)
        {
            return ResultUtils.error(-2,"未登录");
        }

        String result=modelItemService.addRelateResources(oid,infoArray,files,uid);

        return ResultUtils.success(result);

    }

    @RequestMapping(value = "/setModelRelation/{oid}", method = RequestMethod.POST)
    JsonResult setModelRelation(@PathVariable("oid") String oid,
                                @RequestBody JSONObject jsonObject,
                                HttpServletRequest request) {
        HttpSession session = request.getSession();
        String uid = session.getAttribute("uid").toString();
        if (uid == null) {
            return ResultUtils.error(-2, "未登录");
        }
        JSONArray relations = jsonObject.getJSONArray("relations");
        List<ModelRelation> modelRelationList = new ArrayList<>();

        for (int i = 0; i < relations.size(); i++) {
            JSONObject object = relations.getJSONObject(i);
            ModelRelation modelRelation = new ModelRelation();
            modelRelation.setOid(object.getString("oid"));
            modelRelation.setRelation(RelationTypeEnum.getRelationTypeByText(object.getString("relation")));
            modelRelationList.add(modelRelation);
        }

        String result = modelItemService.setModelRelation(oid, modelRelationList,uid);

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
                        @RequestParam(value="conditions") String conditions){
        try {
            JSONArray queryConditions = JSONArray.parseArray(conditions);
            return ResultUtils.success(modelItemService.advancedQuery(modelItemFindDTO,queryConditions,classes));

        }catch (Exception e){
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
        oid = URLDecoder.decode(oid);
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

    @RequestMapping(value="/searchByOid",method=RequestMethod.GET)
    public JsonResult searchByOid(@RequestParam(value="oid") String oid, HttpServletRequest httpServletRequest) throws IOException, DocumentException {
//        HttpSession session=httpServletRequest.getSession();

//        if(session.getAttribute("oid")==null){
//            return ResultUtils.error(-1,"no login");
//        }
//        String userOid=session.getAttribute("oid").toString();
        return ResultUtils.success(modelItemService.getByOid(oid));
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

    @RequestMapping(value="/getRelationGraph",method = RequestMethod.POST)
    public JsonResult getRelationGraph(@RequestParam(value="oid") String oid){
        return ResultUtils.success(modelItemService.getRelationGraph(oid));
    }

    @RequestMapping(value="/getFullRelationGraph",method = RequestMethod.POST)
    public JsonResult getFullRelationGraph(){
        return ResultUtils.success(modelItemService.getFullRelationGraph());
    }

    @RequestMapping(value="/getContributors",method = RequestMethod.GET)
    public JsonResult getContributors(@RequestParam(value="id")String oid){
        return ResultUtils.success(modelItemService.getContributors(oid));
    }

    @RequestMapping(value="/refreshFullRelationGraph",method = RequestMethod.POST)
    public JsonResult refreshFullRelationGraph(){
        JsonResult jsonResult = ResultUtils.success(modelItemService.getFullRelationGraph());
        try {
            String fileName = resourcePath + "/cacheFile/modelRelationGraph.json";
            File file = new File(fileName);
            if(!file.exists()){
                file.createNewFile();
            }
            BufferedWriter out = new BufferedWriter(new FileWriter(fileName));
            out.write(jsonResult.getData().toString());
            out.close();
        }catch (Exception e){
            e.printStackTrace();
        }
        return jsonResult;
    }
}
