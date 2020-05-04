package njgis.opengms.portal.controller.rest;

import njgis.opengms.portal.bean.JsonResult;
import njgis.opengms.portal.dao.ModelItemDao;
import njgis.opengms.portal.entity.ModelItem;
import njgis.opengms.portal.entity.support.ModelItemRelate;
import njgis.opengms.portal.service.CommonService;
import njgis.opengms.portal.utils.ResultUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.convert.ConversionFailedException;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping (value = "/common")
public class CommonRestController {

    @Autowired
    CommonService commonService;

    @Autowired
    ModelItemDao modelItemDao;


    @RequestMapping(value = "/update", method = RequestMethod.GET)
    public String getRegister() {

        commonService.updateAll();

        return "ok";
    }

    @RequestMapping(value = "/ModelEditor", method = RequestMethod.GET)
    public ModelAndView mxGraph() {

        ModelAndView modelAndView=new ModelAndView();
        modelAndView.setViewName("ModelEditor");


        return modelAndView;
    }

    @RequestMapping(value = "/ModelShow", method = RequestMethod.GET)
    public ModelAndView mxGraph_show(){
        ModelAndView modelAndView = new ModelAndView("ModelShow");
        return  modelAndView;
    }

    @RequestMapping(value = "/integratedModelEditor", method = RequestMethod.GET)
    public ModelAndView mxGraph_integrated() {

        ModelAndView modelAndView=new ModelAndView();
        modelAndView.setViewName("integratedModelEditor");

        return modelAndView;
    }

    @RequestMapping(value = "/logicalModelEditor", method = RequestMethod.GET)
    public ModelAndView mxGraph_logical() {

        ModelAndView modelAndView=new ModelAndView();
        modelAndView.setViewName("logicalModelEditor");

        return modelAndView;
    }

    @RequestMapping(value = "/conceptualModelEditor", method = RequestMethod.GET)
    public ModelAndView mxGraph_conceptual() {

        ModelAndView modelAndView=new ModelAndView();
        modelAndView.setViewName("conceptualModelEditor");

        return modelAndView;
    }

    @RequestMapping(value = "/getUUID", method = RequestMethod.GET)
    public String getUUID() {
        return UUID.randomUUID().toString();
    }

    @RequestMapping(value = "/clearModelItemInvalidImage", method = RequestMethod.GET)
    public JsonResult clearModelItemInvalidImage(){

        List<ModelItem> modelItems = modelItemDao.findAll();
        int deleteCount=0;
        for (ModelItem modelItem:modelItems
             ) {
            try {
                Date time = modelItem.getCreateTime();
                if(modelItem.getImage().contains("geomodeling.njnu.edu.cn")){
                    modelItem.setImage("");
                    modelItemDao.save(modelItem);
                }
            }
            catch (ConversionFailedException e){
                modelItemDao.delete(modelItem);
                deleteCount++;
                System.out.println(deleteCount);
            }


        }

        return ResultUtils.success();
    }

    @RequestMapping(value = "/clearMIsCM", method = RequestMethod.GET)
    public JsonResult clearMIsCM() {

        List<ModelItem> modelItems=modelItemDao.findAll();
        int count=0;
        for (ModelItem modelItem:modelItems
             ) {
            ModelItemRelate modelItemRelate=modelItem.getRelate();
            modelItemRelate.setComputableModels(new ArrayList<String>());
            modelItem.setRelate(modelItemRelate);
            modelItemDao.save(modelItem);
            System.out.println(++count);
        }

        return ResultUtils.success();
    }



}
