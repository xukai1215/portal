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
import java.net.URLDecoder;

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
        oid= URLDecoder.decode(oid);
        return ResultUtils.success(spatialService.getSpatialsByUserId(oid,spatialFindDTO,loadUser));
    }

    @RequestMapping(value="/searchByNameByOid",method= RequestMethod.GET)
    JsonResult searchByTitle(SpatialFindDTO spatialFindDTO, String oid , HttpServletRequest request){
        HttpSession session = request.getSession();
        String loadUser = null;
        if(session.getAttribute("oid")!=null)
            loadUser =  session.getAttribute("oid").toString() ;
        oid = URLDecoder.decode(oid);
        return ResultUtils.success(spatialService.searchByTitleByOid(spatialFindDTO,oid,loadUser));
    }

    @RequestMapping(value="/getWKT",method= RequestMethod.GET)
    JsonResult searchByTitle(@RequestParam(value = "oid")String oid){
        return ResultUtils.success(spatialService.getWKT(oid));
    }

    @RequestMapping(value="/getSpatialReference",method= RequestMethod.GET)
    JsonResult getSpatialReference(@RequestParam(value="asc") int asc,
                                   @RequestParam(value = "page") int page,
                                   @RequestParam(value = "size") int size)
    {
        return ResultUtils.success(spatialService.getSpatialReference(asc,page,size));
    }


    @RequestMapping(value="/searchSpatialReference",method= RequestMethod.GET)
    JsonResult searchSpatialReference(@RequestParam(value="asc") int asc,
                                   @RequestParam(value = "page") int page,
                                   @RequestParam(value = "size") int size,
                                   @RequestParam(value = "searchText") String searchText)
    {
        return ResultUtils.success(spatialService.searchSpatialReference(asc,page,size,searchText));
    }
}
