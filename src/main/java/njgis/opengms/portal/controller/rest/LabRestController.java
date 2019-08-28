package njgis.opengms.portal.controller.rest;

import njgis.opengms.portal.bean.JsonResult;
import njgis.opengms.portal.service.LabService;
import njgis.opengms.portal.utils.ResultUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value="/lab")
public class LabRestController {
    @Autowired
    LabService labService;

    @RequestMapping(value="/findByName",method = RequestMethod.GET)
    JsonResult findByLabName(String oid){
        return ResultUtils.success(labService.findBylabName(oid));
    }



}
