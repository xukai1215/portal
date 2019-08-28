package njgis.opengms.portal.controller.rest;

import com.alibaba.fastjson.JSONObject;
import njgis.opengms.portal.bean.JsonResult;
import njgis.opengms.portal.dto.LogicalModelResultDTO;
import njgis.opengms.portal.dto.modelItem.ModelItemFindDTO;
import njgis.opengms.portal.entity.LogicalModel;
import njgis.opengms.portal.entity.ModelItem;
import njgis.opengms.portal.entity.User;
import njgis.opengms.portal.service.LogicalModelService;
import njgis.opengms.portal.service.ModelItemService;
import njgis.opengms.portal.service.UserService;
import njgis.opengms.portal.utils.ResultUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.text.ParseException;
import java.util.List;

/**
 * @ClassName ModelItemRestController
 * @Description todo
 * @Author Kai
 * @Date 2019/2/21
 * @Version 1.0.0
 * TODO
 */
@RestController
@RequestMapping(value = "/logicalModel")
public class LogicalModelRestController {

    @Autowired
    LogicalModelService logicalModelService;

    @Autowired
    ModelItemService modelItemService;

    @Autowired
    UserService userService;

    @RequestMapping(value="/repository",method = RequestMethod.GET)
    public ModelAndView getModelItems() {
        System.out.println("logical model");

        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("logical_models");

        return modelAndView;
    }

    @RequestMapping (value="/{id}",method = RequestMethod.GET)
    ModelAndView get(@PathVariable ("id") String id){
        return logicalModelService.getPage(id);
    }

    @RequestMapping (value="/getInfo/{id}",method = RequestMethod.GET)
    JsonResult getInfo(@PathVariable ("id") String id){

        LogicalModel logicalModel=logicalModelService.getByOid(id);
        ModelItem modelItem=modelItemService.getByOid(logicalModel.getRelateModelItem());
        LogicalModelResultDTO logicalModelResultDTO=new LogicalModelResultDTO();
        BeanUtils.copyProperties(logicalModel,logicalModelResultDTO);
        logicalModelResultDTO.setRelateModelItemName(modelItem.getName());

        return ResultUtils.success(logicalModelResultDTO);
    }

    @RequestMapping (value = "/listByUserOid",method = RequestMethod.GET)
    JsonResult listByUserOid(ModelItemFindDTO modelItemFindDTO,@RequestParam(value="oid") String oid){
        return ResultUtils.success(logicalModelService.listByUserOid(modelItemFindDTO,oid));
    }

    @RequestMapping (value="/list",method = RequestMethod.POST)
    JsonResult list(ModelItemFindDTO modelItemFindDTO,@RequestParam(value="classifications[]") List<String> classes){
        return ResultUtils.success(logicalModelService.list(modelItemFindDTO,classes));
    }

    @RequestMapping (value="/advance",method = RequestMethod.POST)
    JsonResult advanced(ModelItemFindDTO modelItemFindDTO,
                        @RequestParam(value="classifications[]") List<String> classes,
                        @RequestParam(value="connects[]") List<String> connects,
                        @RequestParam(value="props[]") List<String> props,
                        @RequestParam(value="values[]") List<String> values){
        try {
            return ResultUtils.success(logicalModelService.query(modelItemFindDTO, connects, props, values, classes));
        }catch (ParseException e){
            return new JsonResult();
        }
    }

    @RequestMapping (value="/getLogicalModelsByUserId",method = RequestMethod.GET)
    public JsonResult getLogicalModelsByUserId(HttpServletRequest request,
                                        @RequestParam(value="page") int page,
                                        @RequestParam(value="sortType") String sortType,
                                        @RequestParam(value="asc") int sortAsc){

        HttpSession session=request.getSession();
        if(session.getAttribute("uid")==null){
            return ResultUtils.error(-1,"no login");
        }
        String uid=session.getAttribute("uid").toString();

        JSONObject result=logicalModelService.getLogicalModelsByUserId(uid,page,sortType,sortAsc);

        return ResultUtils.success(result);
    }

    @RequestMapping (value="/searchLogicalModelsByUserId",method = RequestMethod.GET)
    public JsonResult searchLogicalModelsByUserId(HttpServletRequest request,
                                               @RequestParam(value="searchText") String searchText,
                                               @RequestParam(value="page") int page,
                                               @RequestParam(value="sortType") String sortType,
                                               @RequestParam(value="asc") int sortAsc){

        HttpSession session=request.getSession();
        if(session.getAttribute("uid")==null){
            return ResultUtils.error(-1,"no login");
        }
        String uid=session.getAttribute("uid").toString();

        JSONObject result=logicalModelService.searchLogicalModelsByUserId(searchText.trim(),uid,page,sortType,sortAsc);

        return ResultUtils.success(result);
    }

    @RequestMapping (value="/add",method = RequestMethod.POST)
    JsonResult add(@RequestParam("logicalModel") String model, HttpServletRequest request){

        MultipartHttpServletRequest multipartRequest = (MultipartHttpServletRequest) request;
        List<MultipartFile> files=multipartRequest.getFiles("imgFiles");
        JSONObject jsonObject=JSONObject.parseObject(model);

        HttpSession session=request.getSession();
        String uid=session.getAttribute("uid").toString();
        if(uid==null)
        {
            return ResultUtils.error(-2,"未登录");
        }
        JSONObject result=logicalModelService.insert(files,jsonObject,uid);
        userService.logicalModelPlusPlus(uid);

        return ResultUtils.success(result);
    }

    @RequestMapping (value="/update",method = RequestMethod.POST)
    JsonResult update(@RequestParam("logicalModel") String model, HttpServletRequest request){

        MultipartHttpServletRequest multipartRequest = (MultipartHttpServletRequest) request;
        List<MultipartFile> files=multipartRequest.getFiles("imgFiles");
        JSONObject jsonObject=JSONObject.parseObject(model);

        HttpSession session=request.getSession();
        String uid=session.getAttribute("uid").toString();
        if(uid==null)
        {
            return ResultUtils.error(-2,"未登录");
        }
        JSONObject result=logicalModelService.update(files,jsonObject,uid);

        return ResultUtils.success(result);
    }

    @RequestMapping(value = "/delete", method = RequestMethod.POST)
    public JsonResult deleteLogicalModel(@RequestParam(value="oid") String oid, HttpServletRequest request){
        HttpSession session=request.getSession();

        if(session.getAttribute("uid")==null){
            return ResultUtils.error(-1,"no login");
        }
        String userName=session.getAttribute("uid").toString();
        return ResultUtils.success(logicalModelService.delete(oid,userName));
    }

    @RequestMapping (value = "/getUserOidByOid", method = RequestMethod.GET)
    public JsonResult getUserOidByOid(@RequestParam(value="oid") String oid){
        LogicalModel logicalModel=logicalModelService.getByOid(oid);
        String userId=logicalModel.getAuthor();
        User user=userService.getByUid(userId);
        return ResultUtils.success(user.getOid());

    }

}
