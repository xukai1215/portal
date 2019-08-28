package njgis.opengms.portal.controller.rest;

import com.alibaba.fastjson.JSONObject;
import njgis.opengms.portal.bean.JsonResult;
import njgis.opengms.portal.dto.ComputableModelResultDTO;
import njgis.opengms.portal.dto.modelItem.ModelItemFindDTO;
import njgis.opengms.portal.entity.ComputableModel;
import njgis.opengms.portal.entity.ModelItem;
import njgis.opengms.portal.entity.User;
import njgis.opengms.portal.service.ComputableModelService;
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
@RequestMapping(value = "/computableModel")
public class ComputableModelRestController {

    @Autowired
    ComputableModelService computableModelService;

    @Autowired
    ModelItemService modelItemService;

    @Autowired
    UserService userService;


    @RequestMapping (value="/add",method = RequestMethod.POST)
    JsonResult add(@RequestParam("computableModel") String model, HttpServletRequest request){

        MultipartHttpServletRequest multipartRequest = (MultipartHttpServletRequest) request;
        List<MultipartFile> files=multipartRequest.getFiles("resources");
        JSONObject jsonObject=JSONObject.parseObject(model);

        HttpSession session=request.getSession();
        String uid=session.getAttribute("uid").toString();
        if(uid==null)
        {
            return ResultUtils.error(-2,"未登录");
        }
        JSONObject result=computableModelService.insert(files,jsonObject,uid);
        userService.computableModelPlusPlus(uid);

        return ResultUtils.success(result);
    }

    @RequestMapping (value="/update",method = RequestMethod.POST)
    JsonResult update(@RequestParam("computableModel") String model, HttpServletRequest request){

        MultipartHttpServletRequest multipartRequest = (MultipartHttpServletRequest) request;
        List<MultipartFile> files=multipartRequest.getFiles("resources");
        JSONObject jsonObject=JSONObject.parseObject(model);

        HttpSession session=request.getSession();
        String uid=session.getAttribute("uid").toString();
        if(uid==null)
        {
            return ResultUtils.error(-2,"未登录");
        }
        JSONObject result=computableModelService.update(files,jsonObject,uid);


        return ResultUtils.success(result);
    }

    @RequestMapping(value = "/delete", method = RequestMethod.POST)
    public JsonResult deleteComputableModel(@RequestParam(value="oid") String oid, HttpServletRequest request){
        HttpSession session=request.getSession();

        if(session.getAttribute("uid")==null){
            return ResultUtils.error(-1,"no login");
        }
        String userName=session.getAttribute("uid").toString();
        return ResultUtils.success(computableModelService.delete(oid,userName));
    }

    @RequestMapping(value="/repository",method = RequestMethod.GET)
    public ModelAndView getModelItems() {
        System.out.println("computable model");

        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("computable_models");

        return modelAndView;
    }

    @RequestMapping (value="/{id}",method = RequestMethod.GET)
    ModelAndView get(@PathVariable ("id") String id){

        return computableModelService.getPage(id);

    }

    @RequestMapping (value="/getInfo/{id}",method = RequestMethod.GET)
    JsonResult getInfo(@PathVariable ("id") String id){
        ComputableModel computableModel=computableModelService.getByOid(id);
        ComputableModelResultDTO computableModelResultDTO=new ComputableModelResultDTO();
        ModelItem modelItem=modelItemService.getByOid(computableModel.getRelateModelItem());
        BeanUtils.copyProperties(computableModel,computableModelResultDTO);
        computableModelResultDTO.setRelateModelItemName(modelItem.getName());

        return ResultUtils.success(computableModelResultDTO);
    }

    @RequestMapping(value = "/deploy/{id}",method = RequestMethod.POST)
    JsonResult deploy(@PathVariable("id") String id){
        String result=computableModelService.deploy(id);
        if(result!=null){
            return ResultUtils.success(result);
        }
        else {
            return ResultUtils.error(-1,"deploy failed.");
        }
    }



    @RequestMapping (value = "/listByUserOid",method = RequestMethod.GET)
    JsonResult listByUserOid(ModelItemFindDTO modelItemFindDTO,@RequestParam(value="oid") String oid){
        return ResultUtils.success(computableModelService.listByUserOid(modelItemFindDTO,oid));
    }

    @RequestMapping (value="/list",method = RequestMethod.POST)
    JsonResult list(ModelItemFindDTO modelItemFindDTO,@RequestParam(value="classifications[]") List<String> classes){
        return ResultUtils.success(computableModelService.list(modelItemFindDTO,classes));
    }

    @RequestMapping (value="/advance",method = RequestMethod.POST)
    JsonResult advanced(ModelItemFindDTO modelItemFindDTO,
                        @RequestParam(value="classifications[]") List<String> classes,
                        @RequestParam(value="connects[]") List<String> connects,
                        @RequestParam(value="props[]") List<String> props,
                        @RequestParam(value="values[]") List<String> values){
        try {
            return ResultUtils.success(computableModelService.query(modelItemFindDTO, connects, props, values, classes));
        }catch (ParseException e){
            return new JsonResult();
        }
    }

    @RequestMapping (value="/searchComputerModelsForDeploy",method = RequestMethod.GET)
    public String searchComputerModelsForDeploy(@RequestParam(value="searchText") String searchText,
                                                @RequestParam(value="page") int page,
                                                @RequestParam(value="sortType") String sortType,
                                                @RequestParam(value="asc") int sortAsc){

        String result=computableModelService.searchComputerModelsForDeploy(searchText,page,sortType,sortAsc);

        return result;
    }

    @RequestMapping (value="/searchComputableModelsByUserId",method = RequestMethod.GET)
    public JsonResult searchModelItemsByUserId(HttpServletRequest request,
                                               @RequestParam(value="searchText") String searchText,
                                               @RequestParam(value="page") int page,
                                               @RequestParam(value="sortType") String sortType,
                                               @RequestParam(value="asc") int sortAsc){

        HttpSession session=request.getSession();
        if(session.getAttribute("uid")==null){
            return ResultUtils.error(-1,"no login");
        }
        String uid=session.getAttribute("uid").toString();

        JSONObject result=computableModelService.searchComputableModelsByUserId(searchText.trim(),uid,page,sortType,sortAsc);

        return ResultUtils.success(result);
    }

    @RequestMapping (value="/getComputerModelsForDeployByUserId",method = RequestMethod.GET)
    public String getComputerModelsForDeployByUserId(HttpServletRequest request,
                                                @RequestParam(value="page") int page,
                                                @RequestParam(value="sortType") String sortType,
                                                @RequestParam(value="asc") int sortAsc){

        HttpSession session=request.getSession();
        String uid=session.getAttribute("uid").toString();

        JSONObject result=computableModelService.getComputerModelsForDeployByUserId(uid,page,sortType,sortAsc);

        return result.toString();
    }

    @RequestMapping (value="/getComputableModelsByUserId",method = RequestMethod.GET)
    public JsonResult getModelItemsByUserId(HttpServletRequest request,
                                        @RequestParam(value="page") int page,
                                        @RequestParam(value="sortType") String sortType,
                                        @RequestParam(value="asc") int sortAsc){

        HttpSession session=request.getSession();
        if(session.getAttribute("uid")==null){
            return ResultUtils.error(-1,"no login");
        }
        String uid=session.getAttribute("uid").toString();

        JSONObject result=computableModelService.getComputableModelsByUserId(uid,page,sortType,sortAsc);

        return ResultUtils.success(result);
    }

    @RequestMapping (value = "/getUserOidByOid", method = RequestMethod.GET)
    public JsonResult getUserOidByOid(@RequestParam(value="oid") String oid){
        ComputableModel computableModel=computableModelService.getByOid(oid);
        String userId=computableModel.getAuthor();
        User user=userService.getByUid(userId);
        return ResultUtils.success(user.getOid());

    }



}
