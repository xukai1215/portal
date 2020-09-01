package njgis.opengms.portal.controller.rest;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import io.swagger.annotations.ApiOperation;
import njgis.opengms.portal.bean.LoginRequired;
import njgis.opengms.portal.bean.JsonResult;
import njgis.opengms.portal.dao.ComputableModelDao;
import njgis.opengms.portal.dto.task.ResultDataDTO;
import njgis.opengms.portal.dto.task.TestDataUploadDTO;
import njgis.opengms.portal.dto.task.UploadDataDTO;
import njgis.opengms.portal.entity.ComputableModel;
import njgis.opengms.portal.entity.Task;
import njgis.opengms.portal.entity.intergrate.Model;
import njgis.opengms.portal.entity.intergrate.ModelParam;
import njgis.opengms.portal.entity.support.DailyViewCount;
import njgis.opengms.portal.entity.support.TaskData;
import njgis.opengms.portal.entity.support.UserTaskInfo;
import njgis.opengms.portal.exception.MyException;
import njgis.opengms.portal.service.ComputableModelService;
import njgis.opengms.portal.service.TaskService;
import njgis.opengms.portal.service.UserService;
import njgis.opengms.portal.utils.ResultUtils;
import njgis.opengms.portal.utils.Utils;
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
import java.text.SimpleDateFormat;
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

    @Autowired
    ComputableModelDao computableModelDao;

    @Value("${managerServerIpAndPort}")
    private String managerServerIpAndPort;

    @Value("${dataContainerIpAndPort}")
    private String dataContainerIpAndPort;

    @LoginRequired
    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    ModelAndView getTask(@PathVariable("id") String id) {

        ModelAndView modelAndView = new ModelAndView();

        modelAndView.setViewName("task");

        return modelAndView;
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

    @LoginRequired
    @RequestMapping(value = "/output/{id}", method = RequestMethod.GET)
    ModelAndView getTaskOutput(@PathVariable("id") String ids, HttpServletRequest request) {
        HttpSession session = request.getSession();
        ModelAndView modelAndView = new ModelAndView();
        if (session.getAttribute("uid") == null) {

            modelAndView.setViewName("login");

            return modelAndView;
        } else {
            String userName = request.getSession().getAttribute("uid").toString();
            JSONObject info=taskService.initTaskOutput(ids, userName);
//            if(info.getString("permission").equals("forbid")){
//                modelAndView.setViewName("error/404");
//            }
//            else {

            modelAndView.setViewName("taskOutput");

            modelAndView.addObject("info", info);
//            }
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

    @RequestMapping(value="/getTasksByUserIdByStatus",method = RequestMethod.GET )
    JsonResult getTasksByUserByStatus(HttpServletRequest request, @RequestParam(value="status") String status,@RequestParam(value="page") int page,
                                      @RequestParam(value="sortType") String sortType,
                                      @RequestParam(value="asc") int sortAsc) {
        HttpSession session = request.getSession();
        String userId = session.getAttribute("uid").toString();
        if (userId == null){
            return ResultUtils.error(-1, "no login");
        }else{
            String username = session.getAttribute("uid").toString();
            return ResultUtils.success(taskService.getTasksByUserIdByStatus(username,status,page,sortType,sortAsc));
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
            return ResultUtils.error(-1, "no login");
        }
        else {
            String username = session.getAttribute("uid").toString();
            RestTemplate restTemplate=new RestTemplate();
            String url="http://" + managerServerIpAndPort + "/GeoModeling/task/runTask";//远程接口
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
    JsonResult checkIntegratedTask(@PathVariable("taskId") String taskId,HttpServletRequest request){

        RestTemplate restTemplate=new RestTemplate();
        String url="http://" + managerServerIpAndPort + "/GeoModeling/task/checkTaskStatus?taskId={taskId}";//远程接口
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
        ComputableModel computableModel=computableModelService.getByOid(lists.getString("oid"));
        HttpSession session = request.getSession();
        String mdlStr=computableModel.getMdl();
        JSONObject mdlJson=Utils.convertMdl(mdlStr);
        System.out.println(mdlJson);
        JSONObject mdl=mdlJson.getJSONObject("mdl");
        JSONArray states=mdl.getJSONArray("states");
        //截取RelatedDatasets字符串

        JSONArray outputs=new JSONArray();
        for(int i=0;i<states.size();i++){
            JSONObject state=states.getJSONObject(i);
            JSONArray events=state.getJSONArray("event");
            for(int j=0;j<events.size();j++){
                JSONObject event=events.getJSONObject(j);
                String eventType=event.getString("eventType");
                if(eventType.equals("noresponse")){
                    JSONObject output=new JSONObject();
                    output.put("statename",state.getString("name"));
                    output.put("event",event.getString("eventName"));
                    JSONObject template=new JSONObject();

                    JSONArray dataArr=event.getJSONArray("data");
                    if(dataArr!=null) {
                        JSONObject data = dataArr.getJSONObject(0);
                        String dataType = data.getString("dataType");
                        if (dataType.equals("external")) {
                            String externalId = data.getString("externalId");

                            template.put("type", "id");
                            template.put("value", externalId.toLowerCase());
                            output.put("template", template);

                        } else if (dataType.equals("internal")) {
                            JSONArray nodes = data.getJSONArray("nodes");
                            if (nodes != null) {
                                if(data.getString("schema")!=null) {
                                    template.put("type", "schema");
                                    template.put("value", data.getString("schema"));
                                    output.put("template", template);
                                }else{
                                    template.put("type", "none");
                                    template.put("value", "");
                                    output.put("template", template);
                                }
                            } else {
                                template.put("type", "none");
                                template.put("value", "");
                                output.put("template", template);
                            }
                        } else {
                            template.put("type", "none");
                            template.put("value", "");
                            output.put("template", template);
                        }
                    }else {
                        template.put("type", "none");
                        template.put("value", "");
                        output.put("template", template);
                    }
                    outputs.add(output);
                }
            }
        }
        lists.put("outputs",outputs);

        if (session.getAttribute("uid") != null) {
            String username = session.getAttribute("uid").toString();
//            JSONObject jsonObject = JSONObject.parseObject(lists);
            lists.put("username", username);
            System.out.println(lists);

            String result = taskService.invoke(lists);
            if (result == null) {
                return ResultUtils.error(-2, "invoke failed!");
            } else {
                Task task = new Task();
                task.setOid(UUID.randomUUID().toString());
                task.setComputableId(lists.getString("oid"));

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

                Date now = new Date();
                DailyViewCount newInvokeCount = new DailyViewCount(now, 1);
                List<DailyViewCount> dailyInvokeCount = computableModel.getDailyInvokeCount();
//                if(computableModel.getDailyInvokeCount()!=null){
//                    dailyInvokeCount = computableModel.getDailyInvokeCount();
//                }
                if(dailyInvokeCount.size()>0) {
                    DailyViewCount dailyViewCount = dailyInvokeCount.get(dailyInvokeCount.size() - 1);
                    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

                    if (sdf.format(dailyViewCount.getDate()).equals(sdf.format(now))) {
                        dailyViewCount.setCount(dailyViewCount.getCount() + 1);
                        dailyInvokeCount.set(dailyInvokeCount.size() - 1, dailyViewCount);
                    } else {
                        dailyInvokeCount.add(newInvokeCount);
                    }
                }
                else{
                    dailyInvokeCount.add(newInvokeCount);
                }
                computableModel.setInvokeCount(computableModel.getInvokeCount()+1);
                computableModelDao.save(computableModel);

                //存入用户信息记录
                String msg= userService.addTaskInfo(username,userTaskInfo);
//                result=result.concat("&").concat(msg);

                return ResultUtils.success(result);
            }
        } else {
            return ResultUtils.error(-1, "no login");
        }


    }

    @RequestMapping(value = "/mutiInvoke", method = RequestMethod.POST)
    JsonResult mutiInvoke(@RequestBody List<JSONObject> taskLists, HttpServletRequest request) {
        HttpSession session = request.getSession();
        if (session.getAttribute("uid") != null) {
            String userName = session.getAttribute("uid").toString();
            String[] results = taskService.mutiInvoke(taskLists,userName);
            if(results[0].equals("run failed")){
                return ResultUtils.error(-2, "invoke failed!");
            }
            else{
                return ResultUtils.success(results);
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

    @RequestMapping(value = "/getMutiResult", method = RequestMethod.POST)
    JsonResult getMutiResult(@RequestBody JSONObject data) {

        List<JSONObject> out=taskService.getMutiTaskResult(data);
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

    @RequestMapping(value="/visualTemplateIds", method = RequestMethod.GET)
    public JsonResult getVisualTemplateIds(){
        return ResultUtils.success(taskService.getVisualTemplateIds());
    }

    @RequestMapping(value = "/loadTestData", method = RequestMethod.POST)
    @ApiOperation(value = "加载默认测试数据，返回数据成功上传之后的url")
    public JsonResult loadTestData(@RequestBody TestDataUploadDTO testDataUploadDTO, HttpServletRequest request){

        String oid = testDataUploadDTO.getOid();
        ComputableModel computableModel=computableModelDao.findFirstByOid(oid);
        JSONObject mdlJSON=Utils.convertMdl(computableModel.getMdl());

        HttpSession session = request.getSession();
        if(session.getAttribute("uid")==null){
            return ResultUtils.error(-2,"no login");
        }
        else {
            String userName = session.getAttribute("uid").toString();
            String[] dataIpAndPort = dataContainerIpAndPort.split(":");
            testDataUploadDTO.setHost(dataIpAndPort[0]);
            testDataUploadDTO.setPort(Integer.parseInt(dataIpAndPort[1]));

            //处理得到进行数据上传的List数组
            List<UploadDataDTO> uploadDataDTOs = taskService.getTestDataUploadArray(testDataUploadDTO, mdlJSON);
            if (uploadDataDTOs == null) {
                return ResultUtils.error(-1, "No Test Data");
            }
            List<Future<ResultDataDTO>> futures = new ArrayList<>();
            //开启异步任务
            uploadDataDTOs.forEach((UploadDataDTO obj) -> {
                Future<ResultDataDTO> future = taskService.uploadDataToServer(obj, testDataUploadDTO, userName);
                futures.add(future);
            });
            List<ResultDataDTO> resultDataDTOs = new ArrayList<>();

            futures.forEach((future) -> {
                try {
                    ResultDataDTO resultDatadto = (ResultDataDTO) future.get();
                    resultDataDTOs.add(resultDatadto);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                } catch (ExecutionException e) {
                    e.printStackTrace();
                }

            });
            return ResultUtils.success(resultDataDTOs);
        }


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
