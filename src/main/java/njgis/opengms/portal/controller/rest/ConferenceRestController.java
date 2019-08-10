package njgis.opengms.portal.controller.rest;

import njgis.opengms.portal.bean.JsonResult;
import njgis.opengms.portal.dto.conference.ConferenceFindDTO;
import njgis.opengms.portal.service.ConferenceService;
import njgis.opengms.portal.utils.ResultUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value="/conference")
public class ConferenceRestController {

    @Autowired
    ConferenceService conferenceService;

    @RequestMapping(value="/listByUserOid",method = RequestMethod.GET)
    JsonResult listByUserOid(ConferenceFindDTO conferenceFindDTO, @RequestParam(value="oid")String oid){

        return ResultUtils.success(conferenceService.listByUserOid(conferenceFindDTO,oid));
    }

}
