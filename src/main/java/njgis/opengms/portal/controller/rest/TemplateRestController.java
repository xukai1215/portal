package njgis.opengms.portal.controller.rest;

import njgis.opengms.portal.bean.JsonResult;
import njgis.opengms.portal.dto.Template.TemplateFindDTO;
import njgis.opengms.portal.service.TemplateService;
import njgis.opengms.portal.utils.ResultUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value="/template")
public class TemplateRestController {
    @Autowired
    TemplateService templateService;

    @RequestMapping(value="/searchByNameByOid",method= RequestMethod.GET)
    JsonResult searchByTitle(TemplateFindDTO templateFindDTO, String oid){
        return ResultUtils.success(templateService.searchByTitleByOid(templateFindDTO,oid));
    }

}
