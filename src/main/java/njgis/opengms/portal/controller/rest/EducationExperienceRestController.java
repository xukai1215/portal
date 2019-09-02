package njgis.opengms.portal.controller.rest;

import njgis.opengms.portal.bean.JsonResult;
import njgis.opengms.portal.dto.educationExperience.EducationExperienceFindDTO;
import njgis.opengms.portal.service.EducationExperienceService;
import njgis.opengms.portal.utils.ResultUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/educationExperience")
public class EducationExperienceRestController {

    @Autowired
    EducationExperienceService educationExperienceService;

    @RequestMapping(value = "/listByUserOid",method = RequestMethod.GET)
    JsonResult listByUserOid(EducationExperienceFindDTO awardandHonorFindDTO, @RequestParam(value="oid") String oid){
        System.out.println("edex");
        return ResultUtils.success(educationExperienceService.listByUserOid(awardandHonorFindDTO,oid));
    }
}
