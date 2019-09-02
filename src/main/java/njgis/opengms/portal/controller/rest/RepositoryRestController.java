package njgis.opengms.portal.controller.rest;

import com.alibaba.fastjson.JSONObject;
import njgis.opengms.portal.bean.JsonResult;
import njgis.opengms.portal.dao.*;
import njgis.opengms.portal.dto.RepositoryQueryDTO;
import njgis.opengms.portal.dto.community.*;
import njgis.opengms.portal.entity.*;
import njgis.opengms.portal.service.RepositoryService;
import njgis.opengms.portal.service.UserService;
import njgis.opengms.portal.utils.ResultUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

@RestController
@RequestMapping(value = "/repository")
public class RepositoryRestController {

    @Autowired
    RepositoryService repositoryService;

    @Autowired
    ConceptDao conceptDao;

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
    UnitVersionDao unitVersionDao;

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
    public ModelAndView redirectConceptualModel(@PathVariable("id") String id){
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
    public ModelAndView getConceptPage(@PathVariable("id") String id){
        return repositoryService.getConceptPage(id);
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

    @RequestMapping(value = "/createConcept", method = RequestMethod.GET)
    public ModelAndView createConcept() {

        System.out.println("create-concept");

        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("create-concept");

        return modelAndView;
    }

    @RequestMapping(value = "/addConcept",method = RequestMethod.POST)
    public JsonResult addConcept(@RequestBody ConceptAddDTO conceptAddDTO, HttpServletRequest request){
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
    public JsonResult updateConcept(@RequestBody ConceptUpdateDTO conceptUpdateDTO, HttpServletRequest request){
        HttpSession session=request.getSession();
        String uid=session.getAttribute("uid").toString();
        if(uid==null)
        {
            return ResultUtils.error(-2,"未登录");
        }
        JSONObject result=repositoryService.updateConcept(conceptUpdateDTO,uid);
        if(result==null){
            return ResultUtils.error(-1,"There is another version have not been checked, please contact nj_gis@163.com if you want to modify this item.");
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
    public ModelAndView getSpatialReferencePage(@PathVariable("id") String id){
        return repositoryService.getSpatialReferencePage(id);
    }

    @RequestMapping (value="/getSpatialInfo/{id}",method = RequestMethod.GET)
    public JsonResult getSpatialInfo(@PathVariable ("id") String id){
        SpatialReference spatial=repositoryService.getSpatialByOid(id);
        spatial.setImage(spatial.getImage()==null || spatial.getImage().equals("")?"":htmlLoadPath+spatial.getImage());
        return ResultUtils.success(spatial);
    }

    @RequestMapping(value = "/createSpatialReference", method = RequestMethod.GET)
    public ModelAndView createSpatialReference() {

        System.out.println("create-spatial reference");

        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("create-spatialReference");

        return modelAndView;
    }

    @RequestMapping(value = "/addSpatialReference", method = RequestMethod.POST)
    public JsonResult addSpatialReference(@RequestBody SpatialAddDTO spatialAddDTO, HttpServletRequest request){
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
    public JsonResult updateSpatialReference(@RequestBody SpatialUpdateDTO spatialUpdateDTO, HttpServletRequest request){
        HttpSession session=request.getSession();
        String uid=session.getAttribute("uid").toString();
        if(uid==null)
        {
            return ResultUtils.error(-2,"未登录");
        }
        JSONObject result=repositoryService.updateSpatial(spatialUpdateDTO,uid);
        if(result==null){
            return ResultUtils.error(-1,"There is another version have not been checked, please contact nj_gis@163.com if you want to modify this item.");
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
    public ModelAndView getTemplateRepository() {
        System.out.println("templateRepository");

        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("templateRepository");

        return modelAndView;
    }

    @RequestMapping(value="/template/{id}",method = RequestMethod.GET)
    public ModelAndView getTemplatePage(@PathVariable("id") String id){
        return repositoryService.getTemplatePage(id);
    }

    @RequestMapping (value="/getTemplateInfo/{id}",method = RequestMethod.GET)
    public JsonResult getTemplateInfo(@PathVariable ("id") String id){
        Template template=repositoryService.getTemplateByOid(id);
        template.setImage(template.getImage()== null || template.getImage().equals("")?"":htmlLoadPath+template.getImage());
        return ResultUtils.success(template);
    }

    @RequestMapping(value = "/createTemplate",method = RequestMethod.GET)
    public ModelAndView createTemplate(){
        System.out.println("create Data Template");

        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("create-template");

        return modelAndView;
    }

    @RequestMapping(value = "/addTemplate", method = RequestMethod.POST)
    public JsonResult addTemplate(@RequestBody TemplateAddDTO templateAddDTO, HttpServletRequest request){
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
    public JsonResult updateTemplate(@RequestBody TemplateUpdateDTO templateUpdateDTO,HttpServletRequest request){
        HttpSession session=request.getSession();
        String uid=session.getAttribute("uid").toString();
        if(uid==null)
        {
            return ResultUtils.error(-2,"未登录");
        }
        JSONObject result=repositoryService.updateTemplate(templateUpdateDTO,uid);
        if(result==null){
            return ResultUtils.error(-1,"There is another version have not been checked, please contact nj_gis@163.com if you want to modify this item.");
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
    public ModelAndView getUnitRepository() {
        System.out.println("unitRepository");

        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("unitRepository");

        return modelAndView;
    }

    @RequestMapping(value="/unit/{id}",method = RequestMethod.GET)
    public ModelAndView getUnitPage(@PathVariable("id") String id){
        return repositoryService.getUnitPage(id);
    }

    @RequestMapping (value="/getUnitInfo/{id}",method = RequestMethod.GET)
    public JsonResult getUnitInfo(@PathVariable ("id") String id){
        Unit unit=repositoryService.getUnitByOid(id);
        unit.setImage(unit.getImage()==null || unit.getImage().equals("")?"":htmlLoadPath+unit.getImage());
        return ResultUtils.success(unit);
    }

    @RequestMapping(value = "/createUnit",method = RequestMethod.GET)
    public ModelAndView createUnit(){
        System.out.println("Create Unit & Metric");

        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("create-unit");

        return modelAndView;
    }

    @RequestMapping(value = "/addUnit", method = RequestMethod.POST)
    public JsonResult addUnit(@RequestBody UnitAddDTO unitAddDTO, HttpServletRequest request){
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
    public JsonResult updateUnit(@RequestBody UnitUpdateDTO unitUpdateDTO,HttpServletRequest request){
        HttpSession session=request.getSession();
        String uid=session.getAttribute("uid").toString();
        if(uid==null)
        {
            return ResultUtils.error(-2,"未登录");
        }
        JSONObject result=repositoryService.updateUnit(unitUpdateDTO,uid);
        if(result==null){
            return ResultUtils.error(-1,"There is another version have not been checked, please contact nj_gis@163.com if you want to modify this item.");
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

    //Contributers
    @RequestMapping(value="/contributors",method = RequestMethod.GET)
    public ModelAndView getContributers() {

        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("ContributorsParticipants");

        return modelAndView;
    }



    //Thematic
    @RequestMapping(value = "/thematic",method = RequestMethod.GET)
    public ModelAndView getThematic() {

        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("Thematic");

        return modelAndView;
    }

    //to Upper Case
    @RequestMapping(value = "/toUpperCase",method = RequestMethod.GET)
    public JsonResult toUpperCase(){

        repositoryService.toUpperCase();
        return ResultUtils.success();
    }

}

