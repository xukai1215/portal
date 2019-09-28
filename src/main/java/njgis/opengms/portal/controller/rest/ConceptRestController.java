package njgis.opengms.portal.controller.rest;

import njgis.opengms.portal.bean.JsonResult;
import njgis.opengms.portal.dto.Concept.ConceptFindDTO;
import njgis.opengms.portal.service.ConceptService;
import njgis.opengms.portal.utils.ResultUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value="/concept")
public class ConceptRestController {
    @Autowired
    ConceptService conceptService;

    @RequestMapping(value="/searchByNameByOid",method= RequestMethod.GET)
    JsonResult searchByTitle(ConceptFindDTO conceptFindDTO, String oid){
        return ResultUtils.success(conceptService.searchByTitleByOid(conceptFindDTO,oid));
    }

}
