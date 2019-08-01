package njgis.opengms.portal.controller.rest;

import com.alibaba.fastjson.JSONObject;
import njgis.opengms.portal.bean.JsonResult;
import njgis.opengms.portal.dto.modelItem.ModelItemAddDTO;
import njgis.opengms.portal.dto.modelItem.ModelItemFindDTO;
import njgis.opengms.portal.dto.modelItem.ModelItemUpdateDTO;
import njgis.opengms.portal.entity.ModelItem;
import njgis.opengms.portal.entity.User;
import njgis.opengms.portal.service.ModelItemService;
import njgis.opengms.portal.service.UserService;
import njgis.opengms.portal.utils.ResultUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
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
@RequestMapping(value = "/modelItem")
public class ModelItemRestController {

    @Autowired
    ModelItemService modelItemService;

    @Autowired
    UserService userService;

    @Value("${htmlLoadPath}")
    private String htmlLoadPath;


    @RequestMapping(value="/repository",method = RequestMethod.GET)
    public ModelAndView getModelItems() {
        System.out.println("model items");

        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("model_items");

        return modelAndView;
    }

    @RequestMapping(value="/compare/{id}",method = RequestMethod.GET)
    public ModelAndView getCompare(@PathVariable ("id") String id) {
        System.out.println("model item compare");

        return modelItemService.getPage4Compare(id);
    }


    @RequestMapping(value="/add",method = RequestMethod.POST)
    public JsonResult addModelItem(@RequestBody ModelItemAddDTO modelItemAddDTO,HttpServletRequest request) {
        HttpSession session=request.getSession();

        if(session.getAttribute("uid")==null){
            return ResultUtils.error(-1,"no login");
        }
        String uid=session.getAttribute("uid").toString();

        System.out.println("add model item");

        String userName=session.getAttribute("uid").toString();

        ModelItem modelItem= modelItemService.insert(modelItemAddDTO,userName);
        userService.modelItemPlusPlus(userName);
        return ResultUtils.success(modelItem.getOid());
    }

    @RequestMapping(value = "/delete", method = RequestMethod.POST)
    public JsonResult deleteModelItem(@RequestParam(value="oid") String oid, HttpServletRequest request){
        HttpSession session=request.getSession();

        if(session.getAttribute("uid")==null){
            return ResultUtils.error(-1,"no login");
        }
        String userName=session.getAttribute("uid").toString();
        return ResultUtils.success(modelItemService.delete(oid,userName));
    }

    @RequestMapping(value = "/update", method = RequestMethod.POST)
    public JsonResult updateModelItem(@RequestBody ModelItemUpdateDTO modelItemUpdateDTO){
        return ResultUtils.success(modelItemService.update(modelItemUpdateDTO));
    }

    @RequestMapping (value="/{id}",method = RequestMethod.GET)
    ModelAndView get(@PathVariable ("id") String id){
        return modelItemService.getPage(id);
    }

    @RequestMapping (value="/getInfo/{id}",method = RequestMethod.GET)
    JsonResult getInfo(@PathVariable ("id") String id){
        ModelItem modelItem=modelItemService.getByOid(id);
        modelItem.setImage(modelItem.getImage().equals("")?"":htmlLoadPath+modelItem.getImage());
        return ResultUtils.success(modelItem);
    }

    @RequestMapping (value="/list",method = RequestMethod.POST)
    JsonResult list(ModelItemFindDTO modelItemFindDTO,@RequestParam(value="classifications[]") List<String> classes){
        return ResultUtils.success(modelItemService.list(modelItemFindDTO,classes));
    }

    @RequestMapping (value = "/listByUserOid",method = RequestMethod.GET)
    JsonResult listByUserOid(ModelItemFindDTO modelItemFindDTO,@RequestParam(value="oid") String oid){
        return ResultUtils.success(modelItemService.listByUserOid(modelItemFindDTO,oid));
    }



    @RequestMapping (value="/findNamesByName",method = RequestMethod.GET)
    JsonResult findNameByName(@RequestParam(value = "name") String name){
        return ResultUtils.success(modelItemService.findNamesByName(name));
    }

    @RequestMapping (value="/findByName",method = RequestMethod.GET)
    JsonResult findByName(@RequestParam(value = "name") String name){
        return ResultUtils.success(modelItemService.findByName(name));
    }

    @RequestMapping (value="/advance",method = RequestMethod.POST)
    JsonResult advanced(ModelItemFindDTO modelItemFindDTO,
                        @RequestParam(value="classifications[]") List<String> classes,
                        @RequestParam(value="connects[]") List<String> connects,
                        @RequestParam(value="props[]") List<String> props,
                        @RequestParam(value="values[]") List<String> values){
        try {
            return ResultUtils.success(modelItemService.query(modelItemFindDTO, connects, props, values, classes));
        }catch (ParseException e){
            return ResultUtils.error(-1,"error");
        }
    }

    @RequestMapping(value = "/bindModel",method = RequestMethod.GET)
    JsonResult bindModel(@RequestParam(value="type") int type,
                         @RequestParam(value="name") String name,
                         @RequestParam(value="oid") String oid)
    {
        JSONObject result=modelItemService.bindModel(type,name,oid);
        if(result.getInteger("code")==-1){
            return ResultUtils.error(-1,"no Model Item");
        }
        else {
            return ResultUtils.success(result.getString("oid"));
        }
    }

    @RequestMapping (value="/getModelItemsByUserId",method = RequestMethod.GET)
    public JsonResult getModelItemsByUserId(HttpServletRequest request,
                                                     @RequestParam(value="page") int page,
                                                     @RequestParam(value="sortType") String sortType,
                                                     @RequestParam(value="asc") int sortAsc){

        HttpSession session=request.getSession();
        if(session.getAttribute("uid")==null){
            return ResultUtils.error(-1,"no login");
        }
        String uid=session.getAttribute("uid").toString();

        JSONObject result=modelItemService.getModelItemsByUserId(uid,page,sortType,sortAsc);

        return ResultUtils.success(result);
    }

    @RequestMapping (value="/searchModelItemsByUserId",method = RequestMethod.GET)
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

        JSONObject result=modelItemService.searchModelItemsByUserId(searchText.trim(),uid,page,sortType,sortAsc);

        return ResultUtils.success(result);
    }

    @RequestMapping (value="/DOISearch",method = RequestMethod.GET)
    public JsonResult DOISearch(@RequestParam(value="doi") String doi){

        String result=modelItemService.analysisDOI(doi);

        return ResultUtils.success(result);
    }

    @RequestMapping (value = "/getUserOidByOid", method = RequestMethod.GET)
    public JsonResult getUserOidByOid(@RequestParam(value="oid") String oid){
        ModelItem modelItem=modelItemService.getByOid(oid);
        String userId=modelItem.getAuthor();
        User user=userService.getByUid(userId);
        return ResultUtils.success(user.getOid());

    }


}
