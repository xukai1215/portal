package njgis.opengms.portal.controller.rest;

import com.alibaba.fastjson.JSONObject;
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
        JSONObject result=labService.findBylabName(oid);
        if(result.get("lab")=="null")
            return ResultUtils.error(-1,"lab is null");
        else
        return ResultUtils.success(result);
    }

//    JsonResult addByLabName(UserLabDTO String userName){
//        JSONObject result=labService.addByLabName(labName,userName);
//        return ResultUtils.success(result);
//    }



}
