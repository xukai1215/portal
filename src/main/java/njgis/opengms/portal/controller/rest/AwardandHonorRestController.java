package njgis.opengms.portal.controller.rest;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/awardandHonor")
public class AwardandHonorRestController {
//    @Autowired
//    AwardandHonorService awardandHonorService;
//
//    @RequestMapping(value = "/getByUserOidBySort",method = RequestMethod.GET)
//    JsonResult getByUserOidBySort(AwardandHonorFindDTO awardandHonorFindDTO, HttpServletRequest request){
//        HttpSession session=request.getSession();
//        String userName=session.getAttribute("uid").toString();
//        if(userName==null){
//            return ResultUtils.error(-1,"no login");
//        }
//        return ResultUtils.success(awardandHonorService.getByUserOidBySort(awardandHonorFindDTO,userName));
//    }
//
//    @RequestMapping(value = "/listByUserOid",method=RequestMethod.GET)
//    JsonResult listByUserOid(AwardandHonorFindDTO awardandHonorFindDTO, @RequestParam(value="oid") String oid){
//        return ResultUtils.success(awardandHonorService.listByUserOid(awardandHonorFindDTO,oid));
//    }

}
