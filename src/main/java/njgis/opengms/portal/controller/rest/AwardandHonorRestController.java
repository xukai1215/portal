package njgis.opengms.portal.controller.rest;

import njgis.opengms.portal.bean.JsonResult;
import njgis.opengms.portal.dto.awardandHonor.AwardandHonorAddDTO;
import njgis.opengms.portal.dto.awardandHonor.AwardandHonorFindDTO;
import njgis.opengms.portal.entity.support.AwardandHonor;
import njgis.opengms.portal.service.AwardandHonorService;
import njgis.opengms.portal.utils.ResultUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

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

    @RequestMapping(value="/add",method=RequestMethod.POST)
    public JsonResult addNewEduExp(@RequestBody AwardandHonorAddDTO awardandHonorAddDTO, HttpServletRequest httpServletRequest){
        System.out.println("/addedu"+awardandHonorAddDTO);
        HttpSession session=httpServletRequest.getSession();
        String userName=session.getAttribute("uid").toString();
        if(userName==null){
            return ResultUtils.error(-1,"no login");
        }
        AwardandHonor awardandHonor=awardandHonorService.addNewAwd(awardandHonorAddDTO,userName);
        return ResultUtils.success(awardandHonor.getOid());
    }

    @RequestMapping(value="/deleteByOid",method=RequestMethod.POST)
    public JsonResult deleteByOid(@RequestParam(value="oid") String oid, HttpServletRequest request){

        HttpSession session=request.getSession();
        String userName=session.getAttribute("uid").toString();

        System.out.println("/deleteawdByOid"+oid+userName);
        if(userName==null){
            return ResultUtils.error(-1,"no login");
        }else{
            JsonResult result= ResultUtils.success(awardandHonorService.deleteByOid(oid,userName));
            System.out.println(result);
            return result;
        }
    }
}
