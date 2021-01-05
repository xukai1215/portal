package njgis.opengms.portal.controller.rest;

import njgis.opengms.portal.bean.JsonResult;
import njgis.opengms.portal.dto.educationExperience.EducationExperienceAddDTO;
import njgis.opengms.portal.dto.educationExperience.EducationExperienceFindDTO;
import njgis.opengms.portal.entity.support.EducationExperience;
import njgis.opengms.portal.service.EducationExperienceService;
import njgis.opengms.portal.utils.ResultUtils;
import njgis.opengms.portal.utils.Utils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.net.URLDecoder;

@RestController
@RequestMapping("/educationExperience")
public class EducationExperienceRestController {

    @Autowired
    EducationExperienceService educationExperienceService;

    @RequestMapping(value = "/listByUserOid",method = RequestMethod.GET)
    JsonResult listByUserOid(EducationExperienceFindDTO educationExperienceFindDTO, @RequestParam(value="oid") String oid){
        oid= URLDecoder.decode(oid);
//        System.out.println("edex"+educationExperienceFindDTO);
        return ResultUtils.success(educationExperienceService.listByUserOid(educationExperienceFindDTO,oid));
    }

    @RequestMapping(value="/add",method=RequestMethod.POST)
    public JsonResult addNewEduExp(@RequestBody EducationExperienceAddDTO educationExperienceAddDTO, HttpServletRequest httpServletRequest){
        System.out.println("/addedu"+educationExperienceAddDTO);
        HttpSession session=httpServletRequest.getSession();
        String userName=Utils.checkLoginStatus(session);
        if(userName==null){
            return ResultUtils.error(-1,"no login");
        }
        EducationExperience educationExperience=educationExperienceService.addNewEduExp(educationExperienceAddDTO,userName);
        return ResultUtils.success(educationExperience.getOid());
    }

    @RequestMapping(value="/deleteByOid",method=RequestMethod.POST)
    public JsonResult deleteByOid(@RequestParam(value="oid") String oid, HttpServletRequest request){

        HttpSession session=request.getSession();
        String userName=Utils.checkLoginStatus(session);

        if(userName==null){
            return ResultUtils.error(-1,"no login");
        }else{
            JsonResult result= ResultUtils.success(educationExperienceService.deleteByOid(oid,userName));
            System.out.println(result);
            return result;
        }
    }
}
