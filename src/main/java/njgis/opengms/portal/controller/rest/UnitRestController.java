package njgis.opengms.portal.controller.rest;

import njgis.opengms.portal.bean.JsonResult;
import njgis.opengms.portal.dto.Unit.UnitFindDTO;
import njgis.opengms.portal.service.UnitService;
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
@RequestMapping(value="/unit")
public class UnitRestController {
    @Autowired
    UnitService unitService;

    @RequestMapping (value = "/listUnitsByOid",method = RequestMethod.GET)
    JsonResult listUnitsByUserOid(UnitFindDTO unitFindDTO,
                                  @RequestParam(value="oid") String oid, HttpServletRequest request){
        HttpSession session = request.getSession();
        String loadUser = null;
        if(session.getAttribute("oid")!=null)
            loadUser =  session.getAttribute("oid").toString() ;
        oid= URLDecoder.decode(oid);
//        String uid=userService.getByOid(oid).getUserName();
        return ResultUtils.success(unitService.getUnitsByUserId(oid,unitFindDTO,loadUser));
    }

    @RequestMapping(value="/searchByNameByOid",method= RequestMethod.GET)
    JsonResult searchByTitle(UnitFindDTO unitFindDTO, String oid, HttpServletRequest request){
        HttpSession session = request.getSession();
        String loadUser = null;
        if(session.getAttribute("oid")!=null)
            loadUser =  session.getAttribute("oid").toString() ;
        oid = URLDecoder.decode(oid);
        return ResultUtils.success(unitService.searchByTitleByOid(unitFindDTO,oid,loadUser));
    }

}
