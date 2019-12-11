package njgis.opengms.portal.controller.rest;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import io.swagger.annotations.ApiOperation;
import njgis.opengms.portal.bean.JsonResult;
import njgis.opengms.portal.dto.task.ResultDataDTO;
import njgis.opengms.portal.dto.task.TestDataUploadDTO;
import njgis.opengms.portal.dto.task.UploadDataDTO;
import njgis.opengms.portal.entity.ComputableModel;
import njgis.opengms.portal.entity.Task;
import njgis.opengms.portal.entity.intergrate.Model;
import njgis.opengms.portal.entity.intergrate.ModelParam;
import njgis.opengms.portal.entity.support.TaskData;
import njgis.opengms.portal.entity.support.UserTaskInfo;
import njgis.opengms.portal.exception.MyException;
import njgis.opengms.portal.service.ComputableModelService;
import njgis.opengms.portal.service.TaskService;
import njgis.opengms.portal.service.UserService;
import njgis.opengms.portal.utils.ResultUtils;
import org.apache.commons.io.FilenameUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.io.File;
import java.io.IOException;
import java.util.*;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Future;

@RestController
@RequestMapping(value = "/task")
public class TaskRestController {

    @Autowired
    TaskService taskService;

    @Autowired
    UserService userService;

    @Autowired
    ComputableModelService computableModelService;

    @Value("${managerServerIpAndPort}")
    private String managerServerIpAndPort;

    @Value("${dataContainerIpAndPort}")
    private String dataContainerIpAndPort;

    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    ModelAndView getTask(@PathVariable("id") String id, HttpServletRequest request) {
        HttpSession session = request.getSession();
        if (session.getAttribute("uid") == null) {
            ModelAndView modelAndView = new ModelAndView();
            modelAndView.setViewName("login");
            modelAndView.addObject("unlogged", "1");
            return modelAndView;
        } else {
            ModelAndView modelAndView = new ModelAndView();
            modelAndView.setViewName("task");
            modelAndView.addObject("logged", "0");
            return modelAndView;
        }

    }

//    @RequestMapping(value="/renameTag",method = RequestMethod.POST)
//    JsonResult renameTag(@RequestParam(value="taskId", required = false) String taskId,@RequestParam(value="outputs[][statename]", required = false) List<TaskData> outputs
//                         ,HttpServletRequest request){
//        System.out.println(outputs);
//        HttpSession session=request.getSession();
//        if(session.getAttribute("uid")==null){
//            return ResultUtils.error(-1,"no login");
//        }
//        return ResultUtils.success(taskService.renameTag(taskId,outputs));
//    }

    @RequestMapping(value = "/output/{id}", method = RequestMethod.GET)
    ModelAndView getTaskOutput(@PathVariable("id") String ids, HttpServletRequest request) {
        HttpSession session = request.getSession();
        ModelAndView modelAndView = new ModelAndView();
        if (session.getAttribute("uid") == null) {

            modelAndView.setViewName("login");
            modelAndView.addObject("unlogged", "1");
            return modelAndView;
        } else {
            String userName = request.getSession().getAttribute("uid").toString();
            JSONObject info=taskService.initTaskOutput(ids, userName);
            if(info.getString("permission").equals("forbid")){
                modelAndView.setViewName("error/404");
            }
            else {

                modelAndView.setViewName("taskOutput");
                modelAndView.addObject("logged", "0");
                modelAndView.addObject("info", info);
            }
            return modelAndView;
        }



    }

    @RequestMapping(value = "/TaskOutputInit/{id}", method = RequestMethod.GET)
    JsonResult initTaskOutput(@PathVariable("id") String ids, HttpServletRequest request){
        HttpSession session = request.getSession();
        if(session.getAttribute("uid") == null){
            return ResultUtils.error(-1, "no login");
        }else{
            String userName = request.getSession().getAttribute("uid").toString();
            return ResultUtils.success(taskService.initTaskOutput(ids, userName));
        }
    }
//    @RequestMapping(value="/info",method = RequestMethod.GET)
//    JsonResult getInfo(@RequestParam("oid") String oid){
//        taskService.
//
//    }

    @RequestMapping(value = "/TaskInit/{id}", method = RequestMethod.GET)
    @ApiOperation (value = "Task初始化API，获取模型描述信息，State信息，task以及Dx相关信息")
    JsonResult initTask(@PathVariable("id") String id, HttpServletRequest request){
        HttpSession session = request.getSession();
        if(session.getAttribute("uid") == null){
            return ResultUtils.error(-1, "no login");
        }else{
            String userName = request.getSession().getAttribute("uid").toString();
            return ResultUtils.success(taskService.initTask(id, userName));
        }
    }

    @RequestMapping(value = "/getServiceTask/{id}", method = RequestMethod.GET)
    JsonResult getServiceTask(@PathVariable("id") String id) {

        String md5 = taskService.getMd5(id);
        JSONObject result = taskService.getServiceTask(md5);
        if (result.getInteger("code") == 1) {
            return ResultUtils.success(result.getJSONObject("data"));
        } else {
            return ResultUtils.error(-1, "can not get service task!");
        }
    }

    @RequestMapping(value="/getTaskByTaskId",method = RequestMethod.GET)
    public JsonResult getTaskByTaskId(@RequestParam(value="id") String taskId){
        return ResultUtils.success(taskService.findByTaskId(taskId));

    }

    @RequestMapping(value="/getTasksByModelByUser",method = RequestMethod.GET)
    public JsonResult getTasksByModelByUser(@RequestParam(value = "modelId") String modelId, @RequestParam(value = "page")int page, HttpServletRequest request){
        HttpSession session = request.getSession();
        if(session.getAttribute("uid") == null){
            return ResultUtils.error(-1, "no login");
        }else{
            String userName = request.getSession().getAttribute("uid").toString();
            return ResultUtils.success(taskService.getTasksByModelByUser(modelId,page,userName));
        }
    }

    @RequestMapping(value="/getPublishedTasksByModel",method = RequestMethod.GET)
    public JsonResult getTasksByModel(@RequestParam(value = "modelId") String modelId, @RequestParam(value = "page")int page, HttpServletRequest request){
        HttpSession session = request.getSession();
        if(session.getAttribute("uid") == null){
            return ResultUtils.error(-1, "no login");
        }else{
            String userName = request.getSession().getAttribute("uid").toString();
            return ResultUtils.success(taskService.getPublishedTasksByModelId(modelId,page,userName));
        }
    }

    @RequestMapping (value="/searchTasksByUserId",method = RequestMethod.GET)
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

        JSONObject result=taskService.searchTasksByUserId(searchText.trim(),uid,page,sortType,sortAsc);

        return ResultUtils.success(result);
    }

    @RequestMapping(value = "/getTasksByUserId", method = RequestMethod.GET)
    JsonResult getTasksByUserId(HttpServletRequest request,@RequestParam(value="page") int page,
                                @RequestParam(value="sortType") String sortType,
                                @RequestParam(value="asc") int sortAsc){

        HttpSession session = request.getSession();
        if(session.getAttribute("uid")==null) {
            return ResultUtils.error(-1, "no login");
        }
        else {
            String username = session.getAttribute("uid").toString();
            return ResultUtils.success(taskService.getTasksByUserId(username,page,sortType,sortAsc));
        }
    }

    /**
     * xukai & zhangshuo
     * 2019.12.09
     * 继承运行模型接口
     */

    @RequestMapping(value = "/getTasksByUserIdNoPage", method = RequestMethod.GET)
    JsonResult getTasksByUserIdNoPage(HttpServletRequest request,
                                @RequestParam(value="sortType") String sortType,
                                @RequestParam(value="asc") int sortAsc){

        HttpSession session = request.getSession();
        if(session.getAttribute("uid")==null) {
            return ResultUtils.error(-1, "no login");
        }
        else {
            String username = session.getAttribute("uid").toString();
            return ResultUtils.success(taskService.getTasksByUserId(username,sortType,sortAsc));
        }
    }

    @RequestMapping(value="/runIntegratedTask",method = RequestMethod.POST)
    JsonResult runIntegratedModel(@RequestParam("file") MultipartFile file,
                                  @RequestParam("name") String name,
                                  HttpServletRequest request) throws IOException {


        HttpSession session = request.getSession();
        if(session.getAttribute("uid")==null) {
//            ModelAndView modelAndView = new ModelAndView();
//            modelAndView.setViewName("login");
//            modelAndView.addObject("unlogged", "1");
//            return modelAndView;
//
            return ResultUtils.error(-1, "no login");
        }
        else {
            String username = session.getAttribute("uid").toString();
            RestTemplate restTemplate=new RestTemplate();
            String url="http://" + managerServerIpAndPort + "/GeoModeling/task";//远程接口
            String suffix="."+FilenameUtils.getExtension(file.getOriginalFilename());
            File temp=File.createTempFile("temp",suffix);
            file.transferTo(temp);
            FileSystemResource resource = new FileSystemResource(temp);
            MultiValueMap<String, Object> param = new LinkedMultiValueMap<>();
            param.add("file", resource);
            param.add("userName",username);
            HttpEntity<MultiValueMap<String, Object>> httpEntity = new HttpEntity<>(param);
            ResponseEntity<JSONObject> responseEntity = restTemplate.exchange(url, HttpMethod.POST, httpEntity, JSONObject.class);
            if (responseEntity.getStatusCode()!=HttpStatus.OK){
                throw new MyException("远程服务出错");
            }
            else{

                JSONObject body=responseEntity.getBody();
                if(body.getInteger("code")==-1){
                    return ResultUtils.error(-2,body.getString("msg"));
                }
                else {
                    String taskId = responseEntity.getBody().getString("data");
                    Task task = new Task();
                    task.setOid(UUID.randomUUID().toString());
                    task.setTaskId(taskId);
                    task.setComputableName(name);
                    task.setIntegrate(true);
                    task.setStatus(1);
                    task.setUserId(username);
                    task.setRunTime(new Date());
                    task.setPermission("private");
                    taskService.save(task);
                    return ResultUtils.success(taskId);
                }
            }

        }
    }

    @RequestMapping(value="/checkIntegratedTask/{taskId}", method = RequestMethod.GET)
    JsonResult checkIntegratedTask(@PathVariable("taskId") String taskId){

        RestTemplate restTemplate=new RestTemplate();
        String url="http://" + managerServerIpAndPort + "/GeoModeling/task/checkRecord?taskId={taskId}";//远程接口
        Map<String, String> params = new HashMap<>();
        params.put("taskId", taskId);
        ResponseEntity<JSONObject> responseEntity=restTemplate.getForEntity(url,JSONObject.class,params);
        if (responseEntity.getStatusCode()!=HttpStatus.OK){
            throw new MyException("远程服务出错");
        }
        else {
            Task task=taskService.findByTaskId(taskId);
            JSONObject data = responseEntity.getBody().getJSONObject("data");
            int status = data.getInteger("status");
            switch (status){
                case 0:
                    break;
                case -1:
                    task.setStatus(-1);
                    taskService.save(task);
                    break;
                case 1:
                    task.setStatus(2);
                    task.setModels(data.getJSONArray("models").toJavaList(Model.class));
                    taskService.save(task);
                    break;
            }
            return ResultUtils.success(data);
        }
    }

    @RequestMapping(value = "/saveIntegratedTask", method = RequestMethod.POST)
    JsonResult saveIntegratedTask(@RequestParam("taskId") String taskId, @RequestParam("graphXml") String graphXml, @RequestParam("modelParams") List<ModelParam> modelParams){
        Task task = taskService.findByTaskId(taskId);
        task.setGraphXml(graphXml);
        task.setModelParams(modelParams);
        taskService.save(task);
        return ResultUtils.success(task);
    }

    /**/


    @RequestMapping(value = "/createTask/{id}", method = RequestMethod.POST)
    JsonResult createTask(@PathVariable("id") String id, HttpServletRequest request) {

        HttpSession session = request.getSession();
        if(session.getAttribute("uid")==null) {
            return ResultUtils.error(-1, "no login");
        }
        else {
            String username = session.getAttribute("uid").toString();
            return taskService.generateTask(id, username);
        }
    }

    @RequestMapping(value = "/invoke", method = RequestMethod.POST)
    JsonResult invoke(@RequestBody JSONObject lists, HttpServletRequest request) {
        HttpSession session = request.getSession();

        if (session.getAttribute("uid") != null) {
            String username = session.getAttribute("uid").toString();
//            JSONObject jsonObject = JSONObject.parseObject(lists);
            lists.put("username", username);
            String result = taskService.invoke(lists);
            if (result == null) {
                return ResultUtils.error(-2, "invoke failed!");
            } else {
                Task task = new Task();
                task.setOid(UUID.randomUUID().toString());
                task.setComputableId(lists.getString("oid"));
                ComputableModel computableModel=computableModelService.getByOid(lists.getString("oid"));
                task.setComputableName(computableModel.getName());
                task.setTaskId(result);
                task.setUserId(username);
                task.setIntegrate(false);
                task.setPermission("private");
                task.setIp(lists.getString("ip"));
                task.setPort(lists.getInteger("port"));
                task.setRunTime(new Date());
                task.setStatus(0);
                JSONArray inputs = lists.getJSONArray("inputs");
                task.setInputs(JSONObject.parseArray(inputs.toJSONString(), TaskData.class));
                task.setOutputs(null);
//                for(int i=0;i<inputs.size();i++)
//                {
//                    JSONObject input=inputs.getJSONObject(i);
//                    BeanUtils.copyProperties(input,);
//                }

                taskService.save(task);
                UserTaskInfo userTaskInfo=new UserTaskInfo();
                userTaskInfo.setCreateTime(task.getRunTime());
                userTaskInfo.setModelName(task.getComputableName());
                userTaskInfo.setTaskId(task.getTaskId());

                //存入用户信息记录
                String msg= userService.addTaskInfo(username,userTaskInfo);
//                result=result.concat("&").concat(msg);

                return ResultUtils.success(result);
            }
        } else {
            return ResultUtils.error(-1, "no login");
        }


    }

    @RequestMapping(value = "/getResult", method = RequestMethod.POST)
    JsonResult getResult(@RequestBody JSONObject data) {

        JSONObject out=taskService.getTaskResult(data);
        return ResultUtils.success(out);

    }

    @RequestMapping(value = "/delete", method = RequestMethod.POST)
    JsonResult delete(@RequestParam(value="oid") String oid, HttpServletRequest request) {
        HttpSession session=request.getSession();

        if(session.getAttribute("uid")==null){
            return ResultUtils.error(-1,"no login");
        }
        String userName=session.getAttribute("uid").toString();
        return ResultUtils.success(taskService.delete(oid,userName));

    }

    @RequestMapping(value = "/loadTestData", method = RequestMethod.POST)
    @ApiOperation(value = "加载默认测试数据，返回数据成功上传之后的url")
    public JsonResult loadTestData(@RequestBody TestDataUploadDTO testDataUploadDTO, HttpServletRequest request){

        HttpSession session = request.getSession();
        String[] dataIpAndPort=dataContainerIpAndPort.split(":");
            testDataUploadDTO.setHost(dataIpAndPort[0]);
            testDataUploadDTO.setPort(Integer.parseInt(dataIpAndPort[1]));

            //处理得到进行数据上传的List数组
            List<UploadDataDTO> uploadDataDTOs = taskService.getTestDataUploadArray(testDataUploadDTO);
            if(uploadDataDTOs == null){
                return ResultUtils.error(-1,"No Test Data");
            }
            List<Future<ResultDataDTO>> futures = new ArrayList<>();
            //开启异步任务
            uploadDataDTOs.forEach((UploadDataDTO obj) ->{
                Future<ResultDataDTO> future =taskService.uploadDataToServer(obj, testDataUploadDTO);
                futures.add(future);
            });
            List<ResultDataDTO> resultDataDTOs = new ArrayList<>();

            futures.forEach((future) ->{
                try{
                    ResultDataDTO resultDatadto = (ResultDataDTO)future.get();
                    resultDataDTOs.add(resultDatadto);
                }catch (InterruptedException e) {
                    e.printStackTrace();
                } catch (ExecutionException e) {
                    e.printStackTrace();
                }

            });
            return ResultUtils.success(resultDataDTOs);


    }

    @RequestMapping(value ="/loadPublishedData", method = RequestMethod.POST)
    @ApiOperation(value = "加载其他用户发布数据，返回数据成功上传之后的url")
    public JsonResult loadPublishedData(@RequestBody String taskId, HttpServletRequest request){
        HttpSession session=request.getSession();

        if(session.getAttribute("uid")==null){
            return ResultUtils.error(-1,"no login");
        }

        List<ResultDataDTO> resultDataDTOS = taskService.getPublishedData(taskId);
        if(resultDataDTOS == null||resultDataDTOS.size()==0){
            return ResultUtils.error(-1,"No Test Data");
        }

        return ResultUtils.success(resultDataDTOS);
    }

    @RequestMapping(value = "/addDescription",method = RequestMethod.POST)
    public JsonResult addDescription(@RequestBody JSONObject obj,HttpServletRequest httpServletRequest)
    {
        String taskId=obj.get("taskId").toString();
        String description=obj.get("description").toString();
        HttpSession session=httpServletRequest.getSession();
        if(session.getAttribute("uid")==null) {
            return ResultUtils.error(-1, "no login");
        }
        else {
            String username = session.getAttribute("uid").toString();
            return ResultUtils.success(taskService.addDescription(taskId,description));
        }

    }

    @RequestMapping(value = "/setPublic",method = RequestMethod.POST)
    public JsonResult setPublic(@RequestParam String taskId,HttpServletRequest httpServletRequest)
    {
        HttpSession session=httpServletRequest.getSession();
        if(session.getAttribute("uid")==null) {
            return ResultUtils.error(-1, "no login");
        }
        else {
            String username = session.getAttribute("uid").toString();
            return ResultUtils.success(taskService.setPublic(taskId));
        }

    }

    @RequestMapping(value = "/setPrivate",method = RequestMethod.POST)
    public JsonResult setPrivate(@RequestParam String taskId,HttpServletRequest httpServletRequest)
    {
        HttpSession session=httpServletRequest.getSession();
        if(session.getAttribute("uid")==null) {
            return ResultUtils.error(-1, "no login");
        }
        else {
            String username = session.getAttribute("uid").toString();
            return ResultUtils.success(taskService.setPrivate(taskId));
        }

    }

}
