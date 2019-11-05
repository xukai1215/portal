package njgis.opengms.portal.controller.rest;

import njgis.opengms.portal.bean.JsonResult;
import njgis.opengms.portal.service.GeoIconService;
import njgis.opengms.portal.utils.ResultUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@CrossOrigin
@RestController
@RequestMapping(value="/geoIcon")
public class GeoIconController {

    @Autowired
    GeoIconService geoIconService;

    @RequestMapping(value="/parentList",method = RequestMethod.GET)
    JsonResult getParentList(){
        return ResultUtils.success(geoIconService.getGeoIconParentInfo());
    }

    @RequestMapping(value="/list",method = RequestMethod.GET)
    JsonResult getList(@RequestParam(value="uid") String parentId,
                       @RequestParam(value="page") int page,
                       @RequestParam(value="sortType") String sortType){
        return ResultUtils.success(geoIconService.getGeoIconList(parentId,page,sortType));
    }

//    @RequestMapping(value="/showIcon",method = RequestMethod.GET)

}
