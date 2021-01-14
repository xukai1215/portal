package njgis.opengms.portal.controller.rest;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import njgis.opengms.portal.bean.JsonResult;
import njgis.opengms.portal.dao.*;
import njgis.opengms.portal.dto.Concept.ConceptAddDTO;
import njgis.opengms.portal.dto.Concept.ConceptFindDTO;
import njgis.opengms.portal.dto.Concept.ConceptUpdateDTO;
import njgis.opengms.portal.dto.RepositoryQueryDTO;
import njgis.opengms.portal.dto.Spatial.SpatialAddDTO;
import njgis.opengms.portal.dto.Spatial.SpatialFindDTO;
import njgis.opengms.portal.dto.Spatial.SpatialUpdateDTO;
import njgis.opengms.portal.dto.Template.TemplateAddDTO;
import njgis.opengms.portal.dto.Template.TemplateFindDTO;
import njgis.opengms.portal.dto.Template.TemplateUpdateDTO;
import njgis.opengms.portal.dto.Unit.UnitAddDTO;
import njgis.opengms.portal.dto.Unit.UnitFindDTO;
import njgis.opengms.portal.dto.Unit.UnitUpdateDTO;
import njgis.opengms.portal.entity.*;
import njgis.opengms.portal.service.ConceptService;
import njgis.opengms.portal.service.RepositoryService;
import njgis.opengms.portal.service.UserService;
import njgis.opengms.portal.utils.ResultUtils;
import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.util.List;

@RestController
@RequestMapping(value = "/repository")
public class RepositoryRestController {

    @Autowired
    ThemeDao themeDao;

    @Autowired
    RepositoryService repositoryService;

    @Autowired
    ConceptDao conceptDao;

    @Autowired
    ConceptService conceptService;

    @Autowired
    ConceptVersionDao conceptVersionDao;

    @Autowired
    TemplateDao templateDao;

    @Autowired
    TemplateVersionDao templateVersionDao;

    @Autowired
    SpatialReferenceDao spatialReferenceDao;

    @Autowired
    SpatialReferenceVersionDao spatialReferenceVersionDao;

    @Autowired
    UnitDao unitDao;

    @Autowired
    UnitConversionDao unitConversionDao;

    @Autowired
    UserService userService;

    @Value("${htmlLoadPath}")
    private String htmlLoadPath;

    @RequestMapping(value="/modelItem/{id}",method = RequestMethod.GET)
    public ModelAndView redirectModelItem(@PathVariable("id") String id){
        ModelAndView modelAndView=new ModelAndView();
        modelAndView.setViewName("redirect:/modelItem/"+id);

        return modelAndView;
    }

    @RequestMapping(value="/conceptualModel/{id}",method = RequestMethod.GET)
    public ModelAndView redirectConceptualModel(@PathVariable("id") String id,HttpServletRequest req){
        ModelAndView modelAndView=new ModelAndView();
        modelAndView.setViewName("redirect:/conceptualModel/"+id);

        return modelAndView;
    }

    @RequestMapping(value="/logicalModel/{id}",method = RequestMethod.GET)
    public ModelAndView redirectLogicalModel(@PathVariable("id") String id){
        ModelAndView modelAndView=new ModelAndView();
        modelAndView.setViewName("redirect:/logicalModel/"+id);

        return modelAndView;
    }

    @RequestMapping(value="/computableModel/{id}",method = RequestMethod.GET)
    public ModelAndView redirectComputableModel(@PathVariable("id") String id){
        ModelAndView modelAndView=new ModelAndView();
        modelAndView.setViewName("redirect:/computableModel/"+id);

        return modelAndView;
    }

    @RequestMapping(value="/dataItem/{id}",method = RequestMethod.GET)
    public ModelAndView redirectDataItem(@PathVariable("id") String id){
        ModelAndView modelAndView=new ModelAndView();
        modelAndView.setViewName("redirect:/dataItem/"+id);

        return modelAndView;
    }

    //concept
    @RequestMapping(value="/getConceptTree",method = RequestMethod.GET)
    public JsonResult getConceptTree(){
        return ResultUtils.success(repositoryService.getTree());
    }

    @RequestMapping(value="/concept",method = RequestMethod.GET)
    public ModelAndView getConceptRepository() {
        System.out.println("conceptRepository");

        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("conceptRepository");

        return modelAndView;
    }

    @RequestMapping(value="/concept/{id}",method = RequestMethod.GET)
    public ModelAndView getConceptPage(@PathVariable("id") String id,HttpServletRequest req){
        return repositoryService.getConceptPage(id,req);
    }

    //取数据存入数组
    @RequestMapping(value ="/theme/data/{id}",method = RequestMethod.GET)
    public Theme getThemeData(@PathVariable("id") String id,HttpServletRequest req){
        Theme theme = themeDao.findByOid(id);
        return theme;
    }

    @RequestMapping(value = "/theme/{id}",method = RequestMethod.GET)
    public ModelAndView getThemePage(@PathVariable("id") String id,HttpServletRequest req) throws InvocationTargetException {
        return repositoryService.getThemePage(id,req);
    }
    @RequestMapping(value = "/getThemesByUserId",method = RequestMethod.GET)
    public JsonResult getThemesByUserId(HttpServletRequest request,
                                        @RequestParam(value="page") int page,
                                        @RequestParam(value="sortType") String sortType,
                                        @RequestParam(value="asc") int sortAsc){
        HttpSession session=request.getSession();
        if(session.getAttribute("uid")==null){
            return ResultUtils.error(-1,"no login");
        }
        String uid=session.getAttribute("uid").toString();

        JSONObject result=repositoryService.getThemesByUserId(uid,page,sortType,sortAsc);

        return ResultUtils.success(result);
    }

    @RequestMapping (value="/getConceptInfo/{id}",method = RequestMethod.GET)
    public JsonResult getConceptInfo(@PathVariable ("id") String id){
        Concept concept=repositoryService.getConceptByOid(id);
        String image=concept.getImage();
        if(image==null||image.equals("")){
            image="";
        }
        else{
            image=htmlLoadPath+image;
        }
        concept.setImage(image);
        return ResultUtils.success(concept);
    }

    @RequestMapping(value = {"/createConcept","/newUserSpace/model/createConcept","/newUserSpace/model/manageConcept"}, method = RequestMethod.GET)
    public ModelAndView createConcept() {

        System.out.println("create-concept");

        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("create-concept");

        return modelAndView;
    }

    @RequestMapping(value = "/addConcept",method = RequestMethod.POST)
    public JsonResult addConcept(HttpServletRequest request) throws IOException {

        MultipartHttpServletRequest multipartRequest = (MultipartHttpServletRequest) request;
        MultipartFile file=multipartRequest.getFile("info");
        String model=IOUtils.toString(file.getInputStream(),"utf-8");
        JSONObject jsonObject=JSONObject.parseObject(model);
        ConceptAddDTO conceptAddDTO=JSONObject.toJavaObject(jsonObject,ConceptAddDTO.class);

        HttpSession session=request.getSession();

        if(session.getAttribute("uid")==null){
            return ResultUtils.error(-1,"no login");
        }
        String uid=session.getAttribute("uid").toString();

        System.out.println("add concept & semantic");

        Concept concept = repositoryService.insertConcept(conceptAddDTO,uid);
        userService.conceptPlusPlus(uid);
        return ResultUtils.success(concept.getOid());
    }

    @RequestMapping(value = "/updateConcept",method = RequestMethod.POST)
    public JsonResult updateConcept(HttpServletRequest request) throws IOException {
        MultipartHttpServletRequest multipartRequest = (MultipartHttpServletRequest) request;
        MultipartFile file=multipartRequest.getFile("info");
        String model=IOUtils.toString(file.getInputStream(),"utf-8");
        JSONObject jsonObject=JSONObject.parseObject(model);
        ConceptUpdateDTO conceptUpdateDTO=JSONObject.toJavaObject(jsonObject,ConceptUpdateDTO.class);
        HttpSession session=request.getSession();
        String uid=session.getAttribute("uid").toString();
        if(uid==null)
        {
            return ResultUtils.error(-2,"未登录");
        }
        JSONObject result=repositoryService.updateConcept(conceptUpdateDTO,uid);
        if(result==null){
            return ResultUtils.error(-1,"There is another version have not been checked, please contact opengms@njnu.edu.cn if you want to modify this item.");
        }
        else {
            return ResultUtils.success(result);
        }
    }

    @RequestMapping(value = "/deleteConcept",method = RequestMethod.POST)
    public JsonResult deleteConcept(@RequestParam(value="oid") String oid, HttpServletRequest request){
        HttpSession session=request.getSession();

        if(session.getAttribute("uid")==null){
            return ResultUtils.error(-1,"no login");
        }
        String userName=session.getAttribute("uid").toString();
        return ResultUtils.success(repositoryService.deleteConcept(oid,userName));
    }

    @RequestMapping(value="/getConceptList",method = RequestMethod.POST)
    public JsonResult getConceptList(@RequestBody RepositoryQueryDTO repositoryQueryDTO){
        return ResultUtils.success(repositoryService.getConceptList(repositoryQueryDTO));
    }

    @RequestMapping(value="/searchConcept",method = RequestMethod.POST)
    public JsonResult searchConcept(@RequestBody RepositoryQueryDTO repositoryQueryDTO){
        return ResultUtils.success(repositoryService.searchConcept(repositoryQueryDTO));
    }

    @RequestMapping(value = "/addConceptLocalization",method = RequestMethod.POST)
    public JsonResult addConceptLocalization(@RequestParam("id")String id,
                                             @RequestParam("language")String language,
                                             @RequestParam("name")String name,
                                             @RequestParam("desc")String desc){
        String result = repositoryService.addConceptLocalization(id,language,name,desc);
        if(result.equals("ok")){
            return ResultUtils.success(result);
        }else {
            return ResultUtils.error(500,result);
        }
    }

    @RequestMapping(value = "/getConceptsByUserId",method = RequestMethod.GET)
    public JsonResult getConceptsByUserId(HttpServletRequest request,
                                          @RequestParam(value="page") int page,
                                          @RequestParam(value="sortType") String sortType,
                                          @RequestParam(value="asc") int sortAsc){
        HttpSession session=request.getSession();
        if(session.getAttribute("uid")==null){
            return ResultUtils.error(-1,"no login");
        }
        String uid=session.getAttribute("uid").toString();

        JSONObject result=repositoryService.getConceptsByUserId(uid,page,sortType,sortAsc);

        return ResultUtils.success(result);
    }


    @RequestMapping (value = "/listConceptsByUserOid",method = RequestMethod.GET)
    JsonResult listByUserOid(ConceptFindDTO conceptFindDTO,
                             @RequestParam(value="oid") String oid){
//        System.out.println("concept"+conceptFindDTO);
        String uid=userService.getByOid(oid).getUserName();
        return ResultUtils.success(repositoryService.getConceptsByUserId(uid,conceptFindDTO));
    }

    @RequestMapping(value = "/searchConceptsByUserId",method = RequestMethod.GET)
    public JsonResult searchConceptsByUserId(HttpServletRequest request,
                                             @RequestParam(value="searchText") String searchText,
                                             @RequestParam(value="page") int page,
                                             @RequestParam(value="sortType") String sortType,
                                             @RequestParam(value="asc") int sortAsc){
        HttpSession session=request.getSession();
        if(session.getAttribute("uid")==null){
            return ResultUtils.error(-1,"no login");
        }
        String uid=session.getAttribute("uid").toString();

        JSONObject result=repositoryService.searchConceptsByUserId(searchText.trim(),uid,page,sortType,sortAsc);

        return ResultUtils.success(result);
    }

    @RequestMapping (value = "/getConceptUserOidByOid", method = RequestMethod.GET)
    public JsonResult getConceptUserOidByOid(@RequestParam(value="oid") String oid){
        Concept concept=conceptDao.findByOid(oid);
        String userId=concept.getAuthor();
        User user=userService.getByUid(userId);
        return ResultUtils.success(user.getOid());

    }


    //spatialReference
    @RequestMapping(value="/spatialReference",method = RequestMethod.GET)
    public ModelAndView getSpatialReferenceRepository() {
        System.out.println("spatialReferenceRepository");

        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("spatialReferenceRepository");

        return modelAndView;
    }

    @RequestMapping(value="/spatialReference/{id}",method = RequestMethod.GET)
    public ModelAndView getSpatialReferencePage(@PathVariable("id") String id,HttpServletRequest req){
        return repositoryService.getSpatialReferencePage(id,req);
    }

    @RequestMapping (value="/getSpatialInfo/{id}",method = RequestMethod.GET)
    public JsonResult getSpatialInfo(@PathVariable ("id") String id){
        SpatialReference spatial=repositoryService.getSpatialByOid(id);
        spatial.setImage(spatial.getImage()==null || spatial.getImage().equals("")?"":htmlLoadPath+spatial.getImage());
        return ResultUtils.success(spatial);
    }

    @RequestMapping(value = {"/createSpatialReference","/newUserSpace/model/createSpatialReference","/newUserSpace/model/manageSpatialReference"}, method = RequestMethod.GET)
    public ModelAndView createSpatialReference() {

        System.out.println("create-spatial reference");

        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("create-spatialReference");

        return modelAndView;
    }

    @RequestMapping(value = "/addSpatialReference", method = RequestMethod.POST)
    public JsonResult addSpatialReference(HttpServletRequest request) throws IOException {

        MultipartHttpServletRequest multipartRequest = (MultipartHttpServletRequest) request;
        MultipartFile file=multipartRequest.getFile("info");
        String model=IOUtils.toString(file.getInputStream(),"utf-8");
        JSONObject jsonObject=JSONObject.parseObject(model);
        SpatialAddDTO spatialAddDTO=JSONObject.toJavaObject(jsonObject,SpatialAddDTO.class);

        HttpSession session=request.getSession();

        if(session.getAttribute("uid")==null){
            return ResultUtils.error(-1,"no login");
        }
        String uid=session.getAttribute("uid").toString();

        System.out.println("add spatial reference");

        SpatialReference spatial = repositoryService.insertSpatial(spatialAddDTO,uid);

        return ResultUtils.success(spatial.getOid());
    }

    @RequestMapping(value = "/updateSpatialReference",method = RequestMethod.POST)
    public JsonResult updateSpatialReference(HttpServletRequest request) throws IOException{
        MultipartHttpServletRequest multipartRequest = (MultipartHttpServletRequest) request;
        MultipartFile file=multipartRequest.getFile("info");
        String model=IOUtils.toString(file.getInputStream(),"utf-8");
        JSONObject jsonObject=JSONObject.parseObject(model);
        SpatialUpdateDTO spatialUpdateDTO=JSONObject.toJavaObject(jsonObject,SpatialUpdateDTO.class);
        HttpSession session=request.getSession();
        String uid=session.getAttribute("uid").toString();
        if(uid==null)
        {
            return ResultUtils.error(-2,"未登录");
        }
        JSONObject result=repositoryService.updateSpatial(spatialUpdateDTO,uid);
        if(result==null){
            return ResultUtils.error(-1,"There is another version have not been checked, please contact opengms@njnu.edu.cn if you want to modify this item.");
        }
        else {
            return ResultUtils.success(result);
        }
    }

    @RequestMapping(value = "/deleteSpatialReference",method = RequestMethod.POST)
    public JsonResult deleteSpatialReference(@RequestParam(value="oid") String oid, HttpServletRequest request){
        HttpSession session=request.getSession();

        if(session.getAttribute("uid")==null){
            return ResultUtils.error(-1,"no login");
        }
        String userName=session.getAttribute("uid").toString();
        return ResultUtils.success(repositoryService.deleteSpatial(oid,userName));
    }

    @RequestMapping(value = "/addSpatialReferenceLocalization",method = RequestMethod.POST)
    public JsonResult addSpatialReferenceLocalization(@RequestParam("id")String id,@RequestParam("language")String language,@RequestParam("name")String name,@RequestParam("desc")String desc){
        String result = repositoryService.addSpatialReferenceLocalization(id,language,name,desc);
        if(result.equals("ok")){
            return ResultUtils.success(result);
        }else {
            return ResultUtils.error(500,result);
        }
    }

    @RequestMapping(value="/getSpatialReferenceList",method = RequestMethod.POST)
    public JsonResult getSpatialReferenceList(@RequestBody RepositoryQueryDTO repositoryQueryDTO){
        return ResultUtils.success(repositoryService.getSpatialReferenceList(repositoryQueryDTO));
    }

    @RequestMapping(value="/searchSpatialReference",method = RequestMethod.POST)
    public JsonResult searchSpatialReference(@RequestBody RepositoryQueryDTO repositoryQueryDTO){
        return ResultUtils.success(repositoryService.searchSpatialReference(repositoryQueryDTO));
    }

    @RequestMapping(value = "/getSpatialsByUserId",method = RequestMethod.GET)
    public JsonResult getSpatialsByUserId(HttpServletRequest request,
                                          @RequestParam(value="page") int page,
                                          @RequestParam(value="sortType") String sortType,
                                          @RequestParam(value="asc") int sortAsc){
        HttpSession session=request.getSession();
        if(session.getAttribute("uid")==null){
            return ResultUtils.error(-1,"no login");
        }
        String uid=session.getAttribute("uid").toString();

        JSONObject result=repositoryService.getSpatialsByUserId(uid,page,sortType,sortAsc);

        return ResultUtils.success(result);
    }

    @RequestMapping (value = "/listSpatialsByOid",method = RequestMethod.GET)
    JsonResult listSpatialByUserOid(SpatialFindDTO spatialFindDTO,
                                    @RequestParam(value="oid") String oid){
//        System.out.println("spatial"+spatialFindDTO);
        String uid=userService.getByOid(oid).getUserName();
        return ResultUtils.success(repositoryService.getSpatialsByUserId(uid,spatialFindDTO));
    }

    @RequestMapping(value = "/searchSpatialsByUserId",method = RequestMethod.GET)
    public JsonResult searchSpatialsByUserId(HttpServletRequest request,
                                             @RequestParam(value="searchText") String searchText,
                                             @RequestParam(value="page") int page,
                                             @RequestParam(value="sortType") String sortType,
                                             @RequestParam(value="asc") int sortAsc){
        HttpSession session=request.getSession();
        if(session.getAttribute("uid")==null){
            return ResultUtils.error(-1,"no login");
        }
        String uid=session.getAttribute("uid").toString();

        JSONObject result=repositoryService.searchSpatialsByUserId(searchText.trim(),uid,page,sortType,sortAsc);

        return ResultUtils.success(result);
    }

    @RequestMapping (value = "/getSpatialReferenceUserOidByOid", method = RequestMethod.GET)
    public JsonResult getSpatialReferenceUserOidByOid(@RequestParam(value="oid") String oid){
        SpatialReference spatialReference=spatialReferenceDao.findByOid(oid);
        String userId=spatialReference.getAuthor();
        User user=userService.getByUid(userId);
        return ResultUtils.success(user.getOid());

    }

    //Template
    @RequestMapping(value="/template",method = RequestMethod.GET)
    public ModelAndView getTemplateRepository(HttpServletRequest req) {
        System.out.println("templateRepository");

        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("templateRepository");
        HttpSession session=req.getSession();

        return modelAndView;
    }

    @RequestMapping(value="/template/{id}",method = RequestMethod.GET)
    public ModelAndView getTemplatePage(@PathVariable("id") String id,HttpServletRequest req){
        return repositoryService.getTemplatePage(id.toLowerCase(),req);
    }

    @RequestMapping (value="/getTemplateInfo/{id}",method = RequestMethod.GET)
    public JsonResult getTemplateInfo(@PathVariable ("id") String id){
        Template template=repositoryService.getTemplateByOid(id);
        template.setImage(template.getImage()== null || template.getImage().equals("")?"":htmlLoadPath+template.getImage());
        return ResultUtils.success(template);
    }

    @RequestMapping(value = {"/createTemplate","/newUserSpace/model/createTemplate","/newUserSpace/model/manageTemplate"},method = RequestMethod.GET)
    public ModelAndView createTemplate(){
        System.out.println("create Data Template");

        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("create-template");

        return modelAndView;
    }

    @RequestMapping(value = "/addTemplate", method = RequestMethod.POST)
    public JsonResult addTemplate(HttpServletRequest request) throws IOException {
        MultipartHttpServletRequest multipartRequest = (MultipartHttpServletRequest) request;
        MultipartFile file=multipartRequest.getFile("info");
        String model=IOUtils.toString(file.getInputStream(),"utf-8");
        JSONObject jsonObject=JSONObject.parseObject(model);
        TemplateAddDTO templateAddDTO=JSONObject.toJavaObject(jsonObject,TemplateAddDTO.class);
        HttpSession session=request.getSession();

        if(session.getAttribute("uid")==null){
            return ResultUtils.error(-1,"no login");
        }
        String uid=session.getAttribute("uid").toString();

        System.out.println("add data template");

        Template template = repositoryService.insertTemplate(templateAddDTO,uid);

        return ResultUtils.success(template.getOid());
    }

    @RequestMapping(value = "/updateTemplate",method = RequestMethod.POST)
    public JsonResult updateTemplate(HttpServletRequest request) throws IOException{
        MultipartHttpServletRequest multipartRequest = (MultipartHttpServletRequest) request;
        MultipartFile file=multipartRequest.getFile("info");
        String model=IOUtils.toString(file.getInputStream(),"utf-8");
        JSONObject jsonObject=JSONObject.parseObject(model);
        TemplateUpdateDTO templateUpdateDTO=JSONObject.toJavaObject(jsonObject,TemplateUpdateDTO.class);
        HttpSession session=request.getSession();
        String uid=session.getAttribute("uid").toString();
        if(uid==null)
        {
            return ResultUtils.error(-2,"未登录");
        }
        JSONObject result=repositoryService.updateTemplate(templateUpdateDTO,uid);
        if(result==null){
            return ResultUtils.error(-1,"There is another version have not been checked, please contact opengms@njnu.edu.cn if you want to modify this item.");
        }
        else {
            return ResultUtils.success(result);
        }
    }

    @RequestMapping(value = "/deleteTemplate",method = RequestMethod.POST)
    public JsonResult deleteTemplate(@RequestParam(value="oid") String oid, HttpServletRequest request){
        HttpSession session=request.getSession();

        if(session.getAttribute("uid")==null){
            return ResultUtils.error(-1,"no login");
        }
        String userName=session.getAttribute("uid").toString();
        return ResultUtils.success(repositoryService.deleteTemplate(oid,userName));
    }

    @RequestMapping(value="/getTemplateList",method = RequestMethod.POST)
    public JsonResult getTemplateList(@RequestBody RepositoryQueryDTO repositoryQueryDTO){
        return ResultUtils.success(repositoryService.getTemplateList(repositoryQueryDTO));
    }

    @RequestMapping(value="/searchTemplate",method = RequestMethod.POST)
    public JsonResult searchTemplate(@RequestBody RepositoryQueryDTO repositoryQueryDTO){
        return ResultUtils.success(repositoryService.searchTemplate(repositoryQueryDTO));
    }

    @RequestMapping(value = "/getTemplatesByUserId",method = RequestMethod.GET)
    public JsonResult getTemplatesByUserId(HttpServletRequest request,
                                           @RequestParam(value="page") int page,
                                           @RequestParam(value="sortType") String sortType,
                                           @RequestParam(value="asc") int sortAsc){
        HttpSession session=request.getSession();
        if(session.getAttribute("uid")==null){
            return ResultUtils.error(-1,"no login");
        }
        String uid=session.getAttribute("uid").toString();

        JSONObject result=repositoryService.getTemplatesByUserId(uid,page,sortType,sortAsc);

        return ResultUtils.success(result);
    }

    @RequestMapping (value = "/listTemplatesByOid",method = RequestMethod.GET)
    JsonResult listSpatialByUserOid(TemplateFindDTO templateFindDTO,
                                    @RequestParam(value="oid") String oid){
        String uid=userService.getByOid(oid).getUserName();
        return ResultUtils.success(repositoryService.getTemplatesByUserId(uid,templateFindDTO));
    }

    @RequestMapping(value = "/searchTemplatesByUserId",method = RequestMethod.GET)
    public JsonResult searchTemplatesByUserId(HttpServletRequest request,
                                              @RequestParam(value="searchText") String searchText,
                                              @RequestParam(value="page") int page,
                                              @RequestParam(value="sortType") String sortType,
                                              @RequestParam(value="asc") int sortAsc){
        HttpSession session=request.getSession();
        if(session.getAttribute("uid")==null){
            return ResultUtils.error(-1,"no login");
        }
        String uid=session.getAttribute("uid").toString();

        JSONObject result=repositoryService.searchTemplatesByUserId(searchText.trim(),uid,page,sortType,sortAsc);

        return ResultUtils.success(result);
    }

    @RequestMapping (value = "/getTemplateUserOidByOid", method = RequestMethod.GET)
    public JsonResult getTemplateUserOidByOid(@RequestParam(value="oid") String oid){
        Template template=templateDao.findByOid(oid);
        String userId=template.getAuthor();
        User user=userService.getByUid(userId);
        return ResultUtils.success(user.getOid());

    }


    //unit
    @RequestMapping(value="/unit",method = RequestMethod.GET)
    public ModelAndView getUnitRepository(HttpServletRequest req) {
        System.out.println("unitRepository");

        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("unitRepository");

        HttpSession session=req.getSession();

        return modelAndView;
    }

    @RequestMapping(value="/unit/{id}",method = RequestMethod.GET)
    public ModelAndView getUnitPage(@PathVariable("id") String id,HttpServletRequest req){
        return repositoryService.getUnitPage(id,req);
    }

    @RequestMapping (value="/getUnitInfo/{id}",method = RequestMethod.GET)
    public JsonResult getUnitInfo(@PathVariable ("id") String id){
        Unit unit=repositoryService.getUnitByOid(id);
        unit.setImage(unit.getImage()==null || unit.getImage().equals("")?"":htmlLoadPath+unit.getImage());
        return ResultUtils.success(unit);
    }

    @RequestMapping(value = "/getUnitConvertInfo/{oid}",method = RequestMethod.GET)
    public Object getUnitConvertInfo(@PathVariable("oid") String oid){
        Object result=repositoryService.getUnitConversionBy0id(oid);

        return  result;
    }

    @RequestMapping(value = {"/createUnit","/newUserSpace/model/createUnit","/newUserSpace/model/manageUnit"},method = RequestMethod.GET)
    public ModelAndView createUnit(){
        System.out.println("Create Unit & Metric");

        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("create-unit");

        return modelAndView;
    }

    @RequestMapping(value = "/addUnit", method = RequestMethod.POST)
    public JsonResult addUnit(HttpServletRequest request) throws IOException{
        MultipartHttpServletRequest multipartRequest = (MultipartHttpServletRequest) request;
        MultipartFile file=multipartRequest.getFile("info");
        String model=IOUtils.toString(file.getInputStream(),"utf-8");
        JSONObject jsonObject=JSONObject.parseObject(model);
        UnitAddDTO unitAddDTO=JSONObject.toJavaObject(jsonObject,UnitAddDTO.class);
        HttpSession session=request.getSession();

        if(session.getAttribute("uid")==null){
            return ResultUtils.error(-1,"no login");
        }
        String uid=session.getAttribute("uid").toString();

        System.out.println("add unit & metric");

        Unit unit = repositoryService.insertUnit(unitAddDTO,uid);

        return ResultUtils.success(unit.getOid());
    }

    @RequestMapping(value = "/updateUnit",method = RequestMethod.POST)
    public JsonResult updateUnit(HttpServletRequest request) throws IOException{
        MultipartHttpServletRequest multipartRequest = (MultipartHttpServletRequest) request;
        MultipartFile file=multipartRequest.getFile("info");
        String model=IOUtils.toString(file.getInputStream(),"utf-8");
        JSONObject jsonObject=JSONObject.parseObject(model);
        UnitUpdateDTO unitUpdateDTO=JSONObject.toJavaObject(jsonObject,UnitUpdateDTO.class);
        HttpSession session=request.getSession();
        String uid=session.getAttribute("uid").toString();
        if(uid==null)
        {
            return ResultUtils.error(-2,"未登录");
        }
        JSONObject result=repositoryService.updateUnit(unitUpdateDTO,uid);
        if(result==null){
            return ResultUtils.error(-1,"There is another version have not been checked, please contact opengms@njnu.edu.cn if you want to modify this item.");
        }
        else {
            return ResultUtils.success(result);
        }
    }

    @RequestMapping(value = "/deleteUnit",method = RequestMethod.POST)
    public JsonResult deleteUnit(@RequestParam(value="oid") String oid, HttpServletRequest request){
        HttpSession session=request.getSession();

        if(session.getAttribute("uid")==null){
            return ResultUtils.error(-1,"no login");
        }
        String userName=session.getAttribute("uid").toString();
        return ResultUtils.success(repositoryService.deleteUnit(oid,userName));
    }

    @RequestMapping(value = "/addUnitLocalization",method = RequestMethod.POST)
    public JsonResult addUnitLocalization(@RequestParam("id")String id,@RequestParam("language")String language,@RequestParam("name")String name,@RequestParam("desc")String desc){
        String result = repositoryService.addUnitLocalization(id,language,name,desc);
        if(result.equals("ok")){
            return ResultUtils.success(result);
        }else {
            return ResultUtils.error(500,result);
        }
    }

    @RequestMapping(value="/getUnitList",method = RequestMethod.POST)
    public JsonResult getUnitList(@RequestBody RepositoryQueryDTO repositoryQueryDTO){
        return ResultUtils.success(repositoryService.getUnitList(repositoryQueryDTO));
    }

    @RequestMapping(value="/searchUnit",method = RequestMethod.POST)
    public JsonResult searchUnit(@RequestBody RepositoryQueryDTO repositoryQueryDTO){
        return ResultUtils.success(repositoryService.searchUnit(repositoryQueryDTO));
    }

    @RequestMapping(value = "/getUnitsByUserId",method = RequestMethod.GET)
    public JsonResult getUnitsByUserId(HttpServletRequest request,
                                       @RequestParam(value="page") int page,
                                       @RequestParam(value="sortType") String sortType,
                                       @RequestParam(value="asc") int sortAsc){
        HttpSession session=request.getSession();
        if(session.getAttribute("uid")==null){
            return ResultUtils.error(-1,"no login");
        }
        String uid=session.getAttribute("uid").toString();

        JSONObject result=repositoryService.getUnitsByUserId(uid,page,sortType,sortAsc);

        return ResultUtils.success(result);
    }

    @RequestMapping(value = "/searchUnitsByUserId",method = RequestMethod.GET)
    public JsonResult searchUnitsByUserId(HttpServletRequest request,
                                          @RequestParam(value="searchText") String searchText,
                                          @RequestParam(value="page") int page,
                                          @RequestParam(value="sortType") String sortType,
                                          @RequestParam(value="asc") int sortAsc){
        HttpSession session=request.getSession();
        if(session.getAttribute("uid")==null){
            return ResultUtils.error(-1,"no login");
        }
        String uid=session.getAttribute("uid").toString();

        JSONObject result=repositoryService.searchUnitsByUserId(searchText.trim(),uid,page,sortType,sortAsc);

        return ResultUtils.success(result);
    }

    @RequestMapping (value = "/getUnitUserOidByOid", method = RequestMethod.GET)
    public JsonResult getUnitUserOidByOid(@RequestParam(value="oid") String oid){
        Unit unit=unitDao.findByOid(oid);
        String userId=unit.getAuthor();
        User user=userService.getByUid(userId);
        return ResultUtils.success(user.getOid());

    }

    @RequestMapping (value = "/listUnitsByOid",method = RequestMethod.GET)
    JsonResult listUnitsByUserOid(UnitFindDTO unitFindDTO,
                                  @RequestParam(value="oid") String oid){
        String uid=userService.getByOid(oid).getUserName();
        return ResultUtils.success(repositoryService.getUnitsByUserId(uid,unitFindDTO));
    }

    //Contributors
    @RequestMapping(value="/contributors",method = RequestMethod.GET)
    public ModelAndView getContributors() {

        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("ContributorsParticipants");

        return modelAndView;
    }



    //Thematic
    @RequestMapping(value = "/thematic",method = RequestMethod.GET)
    public ModelAndView getThematic() {

        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("Thematic");


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

    //to Upper Case
    @RequestMapping(value = "/toUpperCase",method = RequestMethod.GET)
    public JsonResult toUpperCase(){
        repositoryService.toUpperCase();
        return ResultUtils.success();
    }

    @RequestMapping(value="/theme",method = RequestMethod.GET)
    public ModelAndView getThemeRepository() {
        System.out.println("themeRepository");

        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("themeRepository");

        return modelAndView;
    }

}

