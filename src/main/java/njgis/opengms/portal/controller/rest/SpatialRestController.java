package njgis.opengms.portal.controller.rest;

import njgis.opengms.portal.bean.JsonResult;
import njgis.opengms.portal.dto.Spatial.SpatialFindDTO;
import njgis.opengms.portal.service.SpatialService;
import njgis.opengms.portal.utils.ResultUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value="/spatial")
public class SpatialRestController {
    @Autowired
    SpatialService spatialService;

    @RequestMapping(value="/searchByNameByOid",method= RequestMethod.GET)
    JsonResult searchByTitle(SpatialFindDTO spatialFindDTO, String oid){
        return ResultUtils.success(spatialService.searchByTitleByOid(spatialFindDTO,oid));
    }

}
