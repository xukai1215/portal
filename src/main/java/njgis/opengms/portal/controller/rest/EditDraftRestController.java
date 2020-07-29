package njgis.opengms.portal.controller.rest;

import njgis.opengms.portal.bean.JsonResult;
import njgis.opengms.portal.dto.EditDraftDTO;
import njgis.opengms.portal.service.EditDraftService;
import njgis.opengms.portal.utils.ResultUtils;
import njgis.opengms.portal.utils.Utils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

@RestController
@RequestMapping(value = "/draft")
public class EditDraftRestController {

    @Autowired
    EditDraftService editDraftService;

    @RequestMapping(value = "/create",method = RequestMethod.POST)
    public JsonResult addNew(@RequestBody EditDraftDTO editDraftDTO, HttpServletRequest httpServletRequest){
        HttpSession session = httpServletRequest.getSession();
        if(Utils.checkLoginStatus(session)==null){
            return ResultUtils.error(-1,"no login");
        }else{
            String userOid = session.getAttribute("oid").toString();
            return ResultUtils.success(editDraftService.addNew(editDraftDTO,userOid));
        }
    }

    @RequestMapping(value = "/update",method = RequestMethod.POST)
    public JsonResult updateDraft(@RequestBody EditDraftDTO editDraftDTO, HttpServletRequest httpServletRequest){
        HttpSession session = httpServletRequest.getSession();
        if(Utils.checkLoginStatus(session)==null){
            return ResultUtils.error(-1,"no login");
        }else{
            String userOid = session.getAttribute("oid").toString();
            return ResultUtils.success(editDraftService.update(editDraftDTO,userOid));
        }
    }

    @RequestMapping(value = "/init",method = RequestMethod.POST)
    public JsonResult init(@RequestBody EditDraftDTO editDraftDTO, HttpServletRequest httpServletRequest){
        HttpSession session = httpServletRequest.getSession();
        if(Utils.checkLoginStatus(session)==null){
            return ResultUtils.error(-1,"no login");
        }else{
            String userOid = session.getAttribute("oid").toString();
            return ResultUtils.success(editDraftService.init(editDraftDTO,userOid));
        }
    }

    @RequestMapping(value = "/pageByUser",method = RequestMethod.GET)
    public JsonResult getByUser(@RequestParam(value="asc") int asc,
                                @RequestParam(value = "page") int page,
                                @RequestParam(value = "size") int size,HttpServletRequest httpServletRequest){
        HttpSession session = httpServletRequest.getSession();
        if(Utils.checkLoginStatus(session)==null){
            return ResultUtils.error(-1,"no login");
        }else{
            String userOid = session.getAttribute("oid").toString();
            return ResultUtils.success(editDraftService.pageByUser(asc,page,size,userOid));
        }
    }

    @RequestMapping(value = "/listByUser",method = RequestMethod.GET)
    public JsonResult listByUser(HttpServletRequest httpServletRequest){
        HttpSession session = httpServletRequest.getSession();
        if(Utils.checkLoginStatus(session)==null){
            return ResultUtils.error(-1,"no login");
        }else{
            String userOid = session.getAttribute("oid").toString();
            return ResultUtils.success(editDraftService.listByUser(userOid));
        }
    }

    @RequestMapping(value = "/getByItemAndUser",method = RequestMethod.GET)
    public JsonResult getByItemAndUser(@RequestParam(value="itemOid")String itemOid, HttpServletRequest httpServletRequest){
        HttpSession session = httpServletRequest.getSession();
        if(Utils.checkLoginStatus(session)==null){
            return ResultUtils.error(-1,"no login");
        }else{
            String userOid = session.getAttribute("oid").toString();
            return ResultUtils.success(editDraftService.getByItemAndUser(itemOid,userOid));
        }
    }

    @RequestMapping(value = "/getByOid",method = RequestMethod.GET)
    public JsonResult getByOid(@RequestParam(value="oid")String oid, HttpServletRequest httpServletRequest){
        HttpSession session = httpServletRequest.getSession();
        if(Utils.checkLoginStatus(session)==null){
            return ResultUtils.error(-1,"no login");
        }else{
            String userOid = session.getAttribute("oid").toString();
            return ResultUtils.success(editDraftService.getByOid(oid));
        }
    }

    @RequestMapping(value = "/deleteByOid",method = RequestMethod.DELETE)
    public JsonResult deleteByOid(@RequestParam(value = "oid") String oid, HttpServletRequest httpServletRequest){
        HttpSession session = httpServletRequest.getSession();
        if(Utils.checkLoginStatus(session)==null){
            return ResultUtils.error(-1,"no login");
        }else{
            String userOid = session.getAttribute("oid").toString();
            return ResultUtils.success(editDraftService.delete(oid));
        }
    }

    @RequestMapping(value = "/setTemplate",method = RequestMethod.DELETE)
    public JsonResult setTemplate(@RequestParam String oid, HttpServletRequest httpServletRequest){
        HttpSession session = httpServletRequest.getSession();
        if(Utils.checkLoginStatus(session)==null){
            return ResultUtils.error(-1,"no login");
        }else{
            String userOid = session.getAttribute("oid").toString();
            return ResultUtils.success(editDraftService.setTemplate(oid));
        }
    }
}
