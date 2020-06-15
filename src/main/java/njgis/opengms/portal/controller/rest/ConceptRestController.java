package njgis.opengms.portal.controller.rest;

import njgis.opengms.portal.bean.JsonResult;
import njgis.opengms.portal.dto.Concept.ConceptFindDTO;
import njgis.opengms.portal.service.ConceptService;
import njgis.opengms.portal.utils.ResultUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

@RestController
@RequestMapping(value="/concept")
public class ConceptRestController {
    @Autowired
    ConceptService conceptService;

    @RequestMapping (value = "/listConceptsByUserOid",method = RequestMethod.GET)
    JsonResult listByUserOid(ConceptFindDTO conceptFindDTO,
                             @RequestParam(value="oid") String oid, HttpServletRequest request){
        HttpSession session = request.getSession();
        String loadUser = null;
        if(session.getAttribute("oid")!=null)
            loadUser =  session.getAttribute("oid").toString() ;
        return ResultUtils.success(conceptService.getConceptsByUserId(oid,conceptFindDTO,loadUser));
    }

    @RequestMapping(value="/searchByNameByOid",method= RequestMethod.GET)
    JsonResult searchByTitle(ConceptFindDTO conceptFindDTO, String oid, HttpServletRequest request){
        HttpSession session = request.getSession();
        String loadUser = null;
        if(session.getAttribute("oid")!=null)
            loadUser =  session.getAttribute("oid").toString() ;
        return ResultUtils.success(conceptService.searchByTitleByOid(conceptFindDTO,oid,loadUser));
    }

}
