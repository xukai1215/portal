package njgis.opengms.portal.controller.rest;

import njgis.opengms.portal.bean.JsonResult;
import njgis.opengms.portal.dto.conference.ConferenceAddDTO;
import njgis.opengms.portal.dto.conference.ConferenceFindDTO;
import njgis.opengms.portal.entity.support.Conference;
import njgis.opengms.portal.service.ConferenceService;
import njgis.opengms.portal.utils.ResultUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

@RestController
@RequestMapping(value="/conference")
public class ConferenceRestController {

    @Autowired
    ConferenceService conferenceService;

    @RequestMapping(value="/listByUserOid",method = RequestMethod.GET)
    JsonResult listByUserOid(ConferenceFindDTO conferenceFindDTO, @RequestParam(value="oid")String oid){

        return ResultUtils.success(conferenceService.listByUserOid(conferenceFindDTO,oid));
    }

    @RequestMapping(value="/searchByTitle",method=RequestMethod.GET)
    JsonResult searchByTitle(ConferenceFindDTO conferenceFindDTO, HttpServletRequest request){
        HttpSession session=request.getSession();
        String userName=session.getAttribute("uid").toString();

        if(userName==null){
            return ResultUtils.error(-1,"no login");
        }

        return ResultUtils.success(conferenceService.searchByTitle(conferenceFindDTO,userName));
    }

    @RequestMapping(value="/searchByTitleByOid",method=RequestMethod.GET)
    JsonResult searchByTitle(ConferenceFindDTO conferenceFindDTO, String oid){
         return ResultUtils.success(conferenceService.searchByTitleByOid(conferenceFindDTO,oid));
    }

    @RequestMapping(value = "/getByUserOidBySort",method = RequestMethod.GET)
    JsonResult getByUserOidBySort(ConferenceFindDTO conferenceFindDTO, HttpServletRequest request){
//        ArticleFindDTO articleFindDTO=new ArticleFindDTO();
//        articleFindDTO.setAsc(sortAsc);
//        articleFindDTO.setPage(page);
//        articleFindDTO.setPageSize(pageSize);
//        articleFindDTO.setSortElement(sortElement);
        HttpSession session=request.getSession();
        String userName=session.getAttribute("uid").toString();
        if(userName==null){
            return ResultUtils.error(-1,"no login");
        }
        return ResultUtils.success(conferenceService.getByUserOidBySort(conferenceFindDTO,userName));
    }

    @RequestMapping(value="/add",method=RequestMethod.POST)
    public JsonResult addNewArticle(@RequestBody ConferenceAddDTO conferenceAddDTO, HttpServletRequest httpServletRequest){
//        System.out.println(conferenceAddDTO);
        HttpSession session=httpServletRequest.getSession();
        String userName=session.getAttribute("uid").toString();
        if(userName==null){
            return ResultUtils.error(-1,"no login");
        }
        int index=conferenceService.addNewconference(conferenceAddDTO,userName);
//        System.out.println("/addConference");
        return ResultUtils.success(index);
    }

    @RequestMapping(value="/editByOid",method=RequestMethod.POST)
    public JsonResult editArticle(@RequestBody ConferenceAddDTO conferenceAddDTO){
        String oid=conferenceAddDTO.getOid();
        Conference conference=conferenceService.editConference(conferenceAddDTO,oid);
//        System.out.println("editConfer");
        return ResultUtils.success(conference.getOid());

    }

    @RequestMapping(value="/deleteByOid",method=RequestMethod.POST)
    public JsonResult deleteByOid(String oid,HttpServletRequest request){
        HttpSession session=request.getSession();
        String userName=session.getAttribute("uid").toString();
        if(userName==null){
            return ResultUtils.error(-1,"no login");
        }else{
            return ResultUtils.success(conferenceService.deleteByOid(oid,userName));
        }
    }

}
