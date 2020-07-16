package njgis.opengms.portal.controller.rest;

import njgis.opengms.portal.bean.JsonResult;
import njgis.opengms.portal.dto.Spatial.SpatialFindDTO;
import njgis.opengms.portal.service.SpatialService;
import njgis.opengms.portal.utils.ResultUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

@RestController
@RequestMapping(value="/spatial")
public class SpatialRestController {
    @Autowired
    SpatialService spatialService;

    @RequestMapping (value = "/listSpatialsByOid",method = RequestMethod.GET)
    JsonResult listSpatialByUserOid(SpatialFindDTO spatialFindDTO,
                                    @RequestParam(value="oid") String oid, HttpServletRequest request){
        HttpSession session = request.getSession();
        String loadUser = null;
        if(session.getAttribute("oid")!=null)
            loadUser =  session.getAttribute("oid").toString() ;
        return ResultUtils.success(spatialService.getSpatialsByUserId(oid,spatialFindDTO,loadUser));
    }

    @RequestMapping(value="/searchByNameByOid",method= RequestMethod.GET)
    JsonResult searchByTitle(SpatialFindDTO spatialFindDTO, String oid , HttpServletRequest request){
        HttpSession session = request.getSession();
        String loadUser = null;
        if(session.getAttribute("oid")!=null)
            loadUser =  session.getAttribute("oid").toString() ;
        return ResultUtils.success(spatialService.searchByTitleByOid(spatialFindDTO,oid,loadUser));
    }

    @RequestMapping(value="/getWKT",method= RequestMethod.GET)
    JsonResult searchByTitle(@RequestParam(value = "oid")String oid){
        return ResultUtils.success(spatialService.getWKT(oid));
    }
}
