package njgis.opengms.portal.controller.rest;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import njgis.opengms.portal.bean.JsonResult;
import njgis.opengms.portal.dto.modelItem.ModelItemFindDTO;
import njgis.opengms.portal.entity.Classification;
import njgis.opengms.portal.service.ClassificationService;
import njgis.opengms.portal.service.ConceptualModelService;
import njgis.opengms.portal.service.LogicalModelService;
import njgis.opengms.portal.service.UserService;
import njgis.opengms.portal.utils.ResultUtils;
import njgis.opengms.portal.utils.deCode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
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
        return ResultUtils.success(logicalModelService.getByOid(id));
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

    @RequestMapping(value = "/delete", method = RequestMethod.POST)
    public JsonResult deleteLogicalModel(@RequestParam(value="oid") String oid, HttpServletRequest request){
        HttpSession session=request.getSession();

        if(session.getAttribute("uid")==null){
            return ResultUtils.error(-1,"no login");
        }
        String userName=session.getAttribute("uid").toString();
        return ResultUtils.success(logicalModelService.delete(oid,userName));
    }

}
