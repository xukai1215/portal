package njgis.opengms.portal.controller.rest;

import njgis.opengms.portal.bean.JsonResult;
import njgis.opengms.portal.dto.Template.TemplateFindDTO;
import njgis.opengms.portal.service.TemplateService;
import njgis.opengms.portal.utils.ResultUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

@RestController
@RequestMapping(value="/template")
public class TemplateRestController {
    @Autowired
    TemplateService templateService;



    @RequestMapping (value = "/listTemplatesByOid",method = RequestMethod.GET)
    JsonResult listSpatialByUserOid(TemplateFindDTO templateFindDTO,
                                    @RequestParam(value="oid") String oid, HttpServletRequest request){
        HttpSession session = request.getSession();
        String loadUser = null;
        if(session.getAttribute("oid")!=null)
            loadUser =  session.getAttribute("oid").toString() ;
        return ResultUtils.success(templateService.getTemplatesByUserId(oid,templateFindDTO,loadUser));
    }

    @RequestMapping(value="/searchByNameByOid",method= RequestMethod.GET)
    JsonResult searchByTitle(TemplateFindDTO templateFindDTO, String oid, HttpServletRequest request){
        HttpSession session = request.getSession();
        String loadUser = null;
        if(session.getAttribute("oid")!=null)
            loadUser =  session.getAttribute("oid").toString() ;
        return ResultUtils.success(templateService.searchByTitleByOid(templateFindDTO,oid,loadUser));
    }

    @RequestMapping(value="/{oid}",method= RequestMethod.GET)
    JsonResult getXmlByOid(@PathVariable("oid") String oid){
        String template=templateService.searchByOid(oid);
        if(template==null){
            return ResultUtils.error(-1,"no template");
        }
        else {
            return ResultUtils.success(template);
        }
    }
}
