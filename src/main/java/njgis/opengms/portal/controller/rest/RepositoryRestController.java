package njgis.opengms.portal.controller.rest;

import njgis.opengms.portal.bean.JsonResult;
import njgis.opengms.portal.dao.ConceptDao;
import njgis.opengms.portal.dto.RepositoryQueryDTO;
import njgis.opengms.portal.entity.Concept;
import njgis.opengms.portal.service.RepositoryService;
import njgis.opengms.portal.utils.ResultUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.util.List;

@RestController
@RequestMapping(value = "/repository")
public class RepositoryRestController {

    @Autowired
    RepositoryService repositoryService;

    @RequestMapping(value="/getConceptTree",method = RequestMethod.GET)
    public JsonResult getConceptTree(){
        return ResultUtils.success(repositoryService.getTree());
    }


    //concept
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

    @RequestMapping(value="/getConceptList",method = RequestMethod.POST)
    public JsonResult getConceptList(@RequestBody RepositoryQueryDTO repositoryQueryDTO){
        return ResultUtils.success(repositoryService.getConceptList(repositoryQueryDTO));
    }

    @RequestMapping(value="/searchConcept",method = RequestMethod.POST)
    public JsonResult searchConcept(@RequestBody RepositoryQueryDTO repositoryQueryDTO){
        return ResultUtils.success(repositoryService.searchConcept(repositoryQueryDTO));
    }
    @RequestMapping(value = "/addConceptLocalization",method = RequestMethod.POST)
    public JsonResult addConceptLocalization(@RequestParam("id")String id,@RequestParam("language")String language,@RequestParam("name")String name,@RequestParam("desc")String desc){
        String result = repositoryService.addConceptLocalization(id,language,name,desc);
        if(result.equals("ok")){
            return ResultUtils.success(result);
        }else {
            return ResultUtils.error(500,result);
        }
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

    @RequestMapping(value="/getTemplateList",method = RequestMethod.POST)
    public JsonResult getTemplateList(@RequestBody RepositoryQueryDTO repositoryQueryDTO){
        return ResultUtils.success(repositoryService.getTemplateList(repositoryQueryDTO));
    }

    @RequestMapping(value="/searchTemplate",method = RequestMethod.POST)
    public JsonResult searchTemplate(@RequestBody RepositoryQueryDTO repositoryQueryDTO){
        return ResultUtils.success(repositoryService.searchTemplate(repositoryQueryDTO));
    }

    //Contributers
    @RequestMapping(value="/contributors",method = RequestMethod.GET)
    public ModelAndView getContributers() {

        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("ContributorsParticipants");

        return modelAndView;
    }

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

