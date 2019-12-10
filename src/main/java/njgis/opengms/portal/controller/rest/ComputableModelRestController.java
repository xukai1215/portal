package njgis.opengms.portal.controller.rest;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import njgis.opengms.portal.bean.JsonResult;
import njgis.opengms.portal.dto.ComputableModel.ComputableModelFindDTO;
import njgis.opengms.portal.dto.ComputableModel.ComputableModelResultDTO;
import njgis.opengms.portal.dto.modelItem.ModelItemFindDTO;
import njgis.opengms.portal.entity.ComputableModel;
import njgis.opengms.portal.entity.ModelItem;
import njgis.opengms.portal.entity.Task;
import njgis.opengms.portal.entity.User;
import njgis.opengms.portal.entity.intergrate.Model;
import njgis.opengms.portal.entity.intergrate.ModelParam;
import njgis.opengms.portal.service.ComputableModelService;
import njgis.opengms.portal.service.ModelItemService;
import njgis.opengms.portal.service.TaskService;
import njgis.opengms.portal.service.UserService;
import njgis.opengms.portal.utils.ResultUtils;
import org.apache.commons.io.IOUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.InputStreamResource;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.io.IOException;
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
@Slf4j
@RestController
@RequestMapping(value = "/computableModel")
public class ComputableModelRestController {

    @Autowired
    ComputableModelService computableModelService;

    @Autowired
    ModelItemService modelItemService;

    @Autowired
    UserService userService;

    @Autowired
    TaskService taskService;

    @Value("${htmlLoadPath}")
    private String htmlLoadPath;

    @RequestMapping(value = "/downloadPackage/{id}/{index}", method = RequestMethod.GET, produces ="application/json;charset=UTF-8")
    @ResponseBody
    @ApiOperation(value = "下载模型部署包", httpMethod = "GET", produces = "application/json;charset=UTF-8")
    public Object downloadModel(@PathVariable ("id") String id,
                                @PathVariable ("index") int index){


        ResponseEntity<InputStreamResource> response = null;
        try {
//            response = DownloadFileUtils.download(PATH, FILENAME, "导入模板");
        } catch (Exception e) {
            log.error("下载模板失败");
        }
        return response;
    }

    @RequestMapping (value="/add",method = RequestMethod.POST)
    JsonResult add(HttpServletRequest request) throws IOException {

        MultipartHttpServletRequest multipartRequest = (MultipartHttpServletRequest) request;
        List<MultipartFile> files=multipartRequest.getFiles("resources");
        MultipartFile file=multipartRequest.getFile("computableModel");
        String model=IOUtils.toString(file.getInputStream(),"utf-8");
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
    JsonResult update(HttpServletRequest request) throws IOException {

        MultipartHttpServletRequest multipartRequest = (MultipartHttpServletRequest) request;
        List<MultipartFile> files=multipartRequest.getFiles("resources");
        MultipartFile file=multipartRequest.getFile("computableModel");
        String model=IOUtils.toString(file.getInputStream(),"utf-8");
        JSONObject jsonObject=JSONObject.parseObject(model);

        HttpSession session=request.getSession();
        String uid=session.getAttribute("uid").toString();
        if(uid==null)
        {
            return ResultUtils.error(-2,"未登录");
        }
        JSONObject result=computableModelService.update(files,jsonObject,uid);

        if(result==null){
            return ResultUtils.error(-1,"There is another version have not been checked, please contact nj_gis@163.com if you want to modify this item.");
        }
        else {
            return ResultUtils.success(result);
        }
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
    public ModelAndView getModelItems(HttpServletRequest req) {
        System.out.println("computable model");

        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("computable_models");

        HttpSession session=req.getSession();
        if(session.getAttribute("uid")==null)
            modelAndView.addObject("unlogged", "1");
        else
            modelAndView.addObject("logged", "0");
        return modelAndView;
    }

    @RequestMapping (value="/{id}",method = RequestMethod.GET)
    ModelAndView get(@PathVariable ("id") String id ,HttpServletRequest httpServletRequest){

        return computableModelService.getPage(id,httpServletRequest);

    }

    @RequestMapping (value="/getInfo/{id}",method = RequestMethod.GET)
    JsonResult getInfo(@PathVariable ("id") String id){
        ComputableModel computableModel=computableModelService.getByOid(id);
        ComputableModelResultDTO computableModelResultDTO=new ComputableModelResultDTO();
        ModelItem modelItem=modelItemService.getByOid(computableModel.getRelateModelItem());
        BeanUtils.copyProperties(computableModel,computableModelResultDTO);
        computableModelResultDTO.setRelateModelItemName(modelItem.getName());

        JSONArray resourceArray = new JSONArray();
        List<String> resources = computableModel.getResources();

        if (resources != null) {
            for (int i = 0; i < resources.size(); i++) {

                String path = resources.get(i);

                String[] arr = path.split("\\.");
                String suffix = arr[arr.length - 1];

                arr = path.split("/");
                String name = arr[arr.length - 1].substring(14);

                JSONObject jsonObject = new JSONObject();
                jsonObject.put("id", i);
                jsonObject.put("name", name);
                jsonObject.put("suffix", suffix);
                jsonObject.put("path",htmlLoadPath+resources.get(i));
                resourceArray.add(jsonObject);

            }

        }

        computableModelResultDTO.setResourceJson(resourceArray);

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

    /**
     * 张硕
     * 2019.12.04
     * 模型集成相关接口 "/integratingList" "/integrating" "/getComputableModelsBySearchTerms"
     */
    @RequestMapping (value="/integratingList",method = RequestMethod.GET)
    Page<ComputableModel> integratingList(int page,String sortType, int sortAsc){
        return computableModelService.integratingList(page,sortType,sortAsc);
    }

    @RequestMapping(value = "/integrating",method = RequestMethod.GET)
    ModelAndView integrating(){
        Page<ComputableModel> computableModelList = computableModelService.integratingList(0,"default",1);
        return computableModelService.integrate(computableModelList);
    }

    @RequestMapping(value = "/getIntegratedTask/{taskId}",method = RequestMethod.GET)
    ModelAndView getIntegratedTask(@PathVariable("taskId") String taskId){

        Task task = taskService.findByTaskId(taskId);
        String xml = task.getGraphXml();
        List<ModelParam> modelParams = task.getModelParams();
        List<Model> models = task.getModels();


        Page<ComputableModel> computableModelList = computableModelService.integratingList(0,"default",1);
        return computableModelService.getIntegratedTask(computableModelList,xml,modelParams,models);

    }

    @RequestMapping(value = "/getComputableModelsBySearchTerms",method = RequestMethod.GET)
    List<ComputableModel> getComputableModelsBySearchTerms(String searchTerms){
        return computableModelService.getComputableModelsBySearchTerms(searchTerms);
    }
    /**/

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

    @RequestMapping(value="/searchByNameByOid",method= RequestMethod.GET)
    JsonResult searchByTitle(ComputableModelFindDTO computableModelFindDTO, String oid){
        return ResultUtils.success(computableModelService.searchByTitleByOid(computableModelFindDTO,oid));
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
    @RequestMapping(value = "/getRelatedDataByPage",method = RequestMethod.GET)
    public JsonResult getRelatedDataByPage(ComputableModelFindDTO computableModelFindDTO, @RequestParam(value = "oid") String oid){

        return ResultUtils.success(computableModelService.getRelatedDataByPage(computableModelFindDTO,oid));
    }



}
