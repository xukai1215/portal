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
import java.net.URLDecoder;

@RestController
@RequestMapping("/awardandHonor")
public class AwardandHonorRestController {
    @Autowired
    AwardandHonorService awardandHonorService;

    @RequestMapping(value = "/getByUserOidBySort",method = RequestMethod.GET)
    JsonResult getByUserOidBySort(AwardandHonorFindDTO awardandHonorFindDTO, HttpServletRequest request){
        HttpSession session=request.getSession();

        if(session.getAttribute("uid")==null){
            return ResultUtils.error(-1,"no login");
        }

        String userName=session.getAttribute("uid").toString();
        return ResultUtils.success(awardandHonorService.getByUserOidBySort(awardandHonorFindDTO,userName));
    }

    @RequestMapping(value = "/listByUserOid",method=RequestMethod.GET)
    JsonResult listByUserOid(AwardandHonorFindDTO awardandHonorFindDTO, @RequestParam(value="oid") String oid){
        oid= URLDecoder.decode(oid);
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

        if(session.getAttribute("uid")==null){
            return ResultUtils.error(-1,"no login");
        }else{
            String userName=session.getAttribute("uid").toString();
            JsonResult result= ResultUtils.success(awardandHonorService.deleteByOid(oid,userName));
            System.out.println(result);
            return result;
        }
    }
}
