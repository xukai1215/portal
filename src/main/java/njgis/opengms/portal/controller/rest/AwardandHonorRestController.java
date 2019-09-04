package njgis.opengms.portal.controller.rest;

import njgis.opengms.portal.bean.JsonResult;
import njgis.opengms.portal.dto.awardandHonor.AwardandHonorFindDTO;
import njgis.opengms.portal.service.AwardandHonorService;
import njgis.opengms.portal.utils.ResultUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

@RestController
@RequestMapping("/awardandHonor")
public class AwardandHonorRestController {
    @Autowired
    AwardandHonorService awardandHonorService;

    @RequestMapping(value = "/getByUserOidBySort",method = RequestMethod.GET)
    JsonResult getByUserOidBySort(AwardandHonorFindDTO awardandHonorFindDTO, HttpServletRequest request){
        HttpSession session=request.getSession();
        String userName=session.getAttribute("uid").toString();
        if(userName==null){
            return ResultUtils.error(-1,"no login");
        }
        return ResultUtils.success(awardandHonorService.getByUserOidBySort(awardandHonorFindDTO,userName));
    }

    @RequestMapping(value = "/listByUserOid",method=RequestMethod.GET)
    JsonResult listByUserOid(AwardandHonorFindDTO awardandHonorFindDTO, @RequestParam(value="oid") String oid){
        return ResultUtils.success(awardandHonorService.listByUserOid(awardandHonorFindDTO,oid));
    }

}
