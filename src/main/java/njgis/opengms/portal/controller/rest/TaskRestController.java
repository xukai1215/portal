package njgis.opengms.portal.controller.rest;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import io.swagger.annotations.ApiOperation;
import njgis.opengms.portal.bean.JsonResult;
import njgis.opengms.portal.bean.LoginRequired;
import njgis.opengms.portal.dao.ComputableModelDao;
import njgis.opengms.portal.dao.IntegratedTaskDao;
import njgis.opengms.portal.dto.task.*;
import njgis.opengms.portal.entity.ComputableModel;
import njgis.opengms.portal.entity.IntegratedTask;
import njgis.opengms.portal.entity.intergrate.DataProcessing;
import njgis.opengms.portal.entity.intergrate.ModelAction;
import njgis.opengms.portal.entity.Task;
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
import org.dom4j.DocumentException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
import java.net.URISyntaxException;
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

    @Autowired
    IntegratedTaskDao integratedTaskDao;

    @Value("${managerServerIpAndPort}")
    private String managerServerIpAndPort;

    @Value("${dataContainerIpAndPort}")
    private String dataContainerIpAndPort;

    private final Logger logger = LoggerFactory.getLogger(this.getClass());

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
    @LoginRequired
    @RequestMapping(value = "/dataTaskOutput/{id}", method = RequestMethod.GET)
    ModelAndView getDataTaskOutput(@PathVariable("id") String id, HttpServletRequest request) {
        HttpSession session = request.getSession();
        ModelAndView modelAndView = new ModelAndView();
        if (session.getAttribute("uid") == null) {
            modelAndView.setViewName("login");

            return modelAndView;
        } else {
            String userName = request.getSession().getAttribute("uid").toString();
            JSONObject info=taskService.initDataTaskOutput(id, userName);
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
    public JsonResult searchTasksByUserId(HttpServletRequest request,
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

    @RequestMapping(value="/pageIntegrateTaskByUserByStatus",method = RequestMethod.GET )
    JsonResult pageIntegrateTaskByUserByStatus(HttpServletRequest request,
                                      @RequestParam(value="status") String status,
                                      @RequestParam(value="page") int page,
                                      @RequestParam(value="sortType") String sortType,
                                      @RequestParam(value="asc") int sortAsc,
                                      @RequestParam(value="searchText") String searchText
                                      ) {
        HttpSession session = request.getSession();
        String userId = session.getAttribute("uid").toString();
        if (userId == null){
            return ResultUtils.error(-1, "no login");
        }else{
            String username = session.getAttribute("uid").toString();
            return ResultUtils.success(taskService.pageIntegrateTaskByUserByStatus(username,status,page,sortType,sortAsc,searchText));
        }

    }

    @RequestMapping(value = "/getDataTasks", method = RequestMethod.POST)
    JsonResult getDataTasks(@RequestBody DataTasksFindDTO dataTasksFindDTO, HttpServletRequest request){
        HttpSession session = request.getSession();
        String userId = session.getAttribute("uid").toString();
        if (userId == null){
            return ResultUtils.error(-1, "no login");
        }else{
            String username = session.getAttribute("uid").toString();
            return ResultUtils.success(taskService.getDataTasks(userId, dataTasksFindDTO));
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
                                  @RequestParam("taskOid") String taskOid,
                                  HttpServletRequest request) throws IOException {
        HttpSession session = request.getSession();
        if(session.getAttribute("uid")==null) {
            logger.info("nologin");
            return ResultUtils.error(-1, "no login");
        }
        else {
            try{
                String username = session.getAttribute("uid").toString();
                RestTemplate restTemplate=new RestTemplate();
                String url="http://" + managerServerIpAndPort + "/GeoModeling/task/runTask";//远程接口
                logger.info(url);
                String suffix="."+FilenameUtils.getExtension(file.getOriginalFilename());
                File temp=File.createTempFile("temp",suffix);
                file.transferTo(temp);
                FileSystemResource resource = new FileSystemResource(temp);
                MultiValueMap<String, Object> param = new LinkedMultiValueMap<>();
                param.add("file", resource);
                param.add("userName",username);
                logger.info("param");
                HttpEntity<MultiValueMap<String, Object>> httpEntity = new HttpEntity<>(param);
                ResponseEntity<JSONObject> responseEntity = restTemplate.exchange(url, HttpMethod.POST, httpEntity, JSONObject.class);
                if (responseEntity.getStatusCode()!=HttpStatus.OK){
                    logger.error("remoteerr");
                    throw new MyException("远程服务出错");
                }
                else{
                    JSONObject body=responseEntity.getBody();
                    if(body.getInteger("code")==-1){
                        logger.info("code-1");
                        return ResultUtils.error(-2,body.getString("msg"));
                    }
                    else {
                        String taskId = responseEntity.getBody().getString("data");
                        logger.info(responseEntity.getBody().getString("data"));
                        logger.info(taskId);
                        IntegratedTask task = integratedTaskDao.findByOid(taskOid);
                        task.setTaskId(taskId);
                        task.setStatus(1);
                        logger.info("111");
                        integratedTaskDao.save(task);
                        logger.info("save");
                        return ResultUtils.success(taskId);
                    }
                }
            }catch (Exception e){
                e.printStackTrace();
                return ResultUtils.error(-1,"err");
            }


        }
    }

    @RequestMapping(value="/checkIntegratedTask/{taskId}", method = RequestMethod.GET)
    JsonResult checkIntegratedTask(@PathVariable("taskId") String taskId,HttpServletRequest request){

        return ResultUtils.success(taskService.checkIntegratedTask(taskId));
    }

    @RequestMapping(value = "/updateIntegrateTaskId", method = RequestMethod.POST)//把managerserver返回的taskid更新到门户数据库
    JsonResult updateIntegrateTaskId(@RequestParam("taskOid") String taskOid,
                                     @RequestParam("taskId") String taskId){
        return ResultUtils.success(taskService.updateIntegrateTaskId(taskOid,taskId));
    }

    @RequestMapping(value = "/getIntegrateTaskByOid", method = RequestMethod.GET)
    JsonResult getIntegrateTaskByOid(@RequestParam("taskOid") String taskOid){
        return ResultUtils.success(taskService.getIntegratedTaskByOid(taskOid));
    }

    @RequestMapping(value = "/saveIntegratedTask", method = RequestMethod.POST)
    JsonResult saveIntegratedTask(@RequestBody IntegratedTaskAddDto integratedTaskAddDto,
                                  HttpServletRequest request
                                  ){
        HttpSession session = request.getSession();
        if(session.getAttribute("uid") == null){
            return ResultUtils.error(-1, "no login");
        }else {
            String userName = session.getAttribute("uid").toString();
            String xml = integratedTaskAddDto.getXml();
            String mxgraph = integratedTaskAddDto.getMxgraph();
            List<Map<String,String>> models = integratedTaskAddDto.getModels();
            List<Map<String,String>> processingTools = integratedTaskAddDto.getProcessingTools();
            List<ModelAction> modelActions = integratedTaskAddDto.getModelActions();
            List<DataProcessing> dataProcessings = integratedTaskAddDto.getDataProcessings();
            List<Map<String,Object>> dataItems = integratedTaskAddDto.getDataItems();
            List<Map<String,String>> dataLinks = integratedTaskAddDto.getDataLinks();
            String description = integratedTaskAddDto.getDescription();
            String taskName = integratedTaskAddDto.getTaskName();

            return ResultUtils.success(taskService.saveIntegratedTask(xml, mxgraph, models,processingTools, modelActions,dataProcessings,dataItems,dataLinks,userName,taskName,description));
        }
    }


    @RequestMapping(value = "/updateIntegratedTaskInfo", method = RequestMethod.POST)
    JsonResult updateIntegratedTaskInfo(@RequestBody IntegratedTaskAddDto integratedTaskAddDto,
                                    HttpServletRequest request
    ){
        HttpSession session = request.getSession();
        if(session.getAttribute("uid") == null){
            return ResultUtils.error(-1, "no login");
        }else {
            String userName = session.getAttribute("uid").toString();
            String taskOid = integratedTaskAddDto.getTaskOid();
            String xml = integratedTaskAddDto.getXml();
            String mxgraph = integratedTaskAddDto.getMxgraph();
            List<Map<String,String>> models = integratedTaskAddDto.getModels();
            List<ModelAction> modelActions = integratedTaskAddDto.getModelActions();
            List<DataProcessing> dataProcessings = integratedTaskAddDto.getDataProcessings();
            List<Map<String,Object>> dataItems = integratedTaskAddDto.getDataItems();
            List<Map<String,String>> dataLinks = integratedTaskAddDto.getDataLinks();
            String description = integratedTaskAddDto.getDescription();
            String taskName = integratedTaskAddDto.getTaskName();

            return ResultUtils.success(taskService.updateIntegratedTask(taskOid, xml, mxgraph, models, modelActions,dataProcessings,dataItems,dataLinks,userName,taskName,description));
        }
    }


    @RequestMapping(value = "/deleteIntegratedTask", method = RequestMethod.DELETE)
    JsonResult saveIntegratedTask(@RequestParam(value = "taskOid") String oid,
                                  HttpServletRequest request
    ){
        HttpSession session = request.getSession();
        if(session.getAttribute("uid") == null){
            return ResultUtils.error(-1, "no login");
        }else {

            return ResultUtils.success(taskService.deleteIntegratedTask(oid));
        }
    }

    @RequestMapping(value = "/getIntegrateTaskByUser",method = RequestMethod.GET)
    JsonResult getIntegrateTaskByUser(HttpServletRequest request){
        HttpSession session = request.getSession();
        if(session.getAttribute("uid") == null){
            return ResultUtils.error(-1, "no login");
        }else {
            String userName = session.getAttribute("uid").toString();
            return ResultUtils.success(taskService.getIntegrateTaskByUser(userName));
        }

    }

    @RequestMapping(value = "/updateIntegrateTaskName",method = RequestMethod.POST)
    JsonResult updateIntegrateTaskName(@RequestParam(value = "taskOid")String taskOid,
                                       @RequestParam(value = "taskName")String taskName,
                                       HttpServletRequest request){
        HttpSession session = request.getSession();
        if(session.getAttribute("uid") == null){
            return ResultUtils.error(-1, "no login");
        }else {
            String userName = session.getAttribute("uid").toString();
            return ResultUtils.success(taskService.updateIntegrateTaskName(taskOid,taskName));
        }

    }

    @RequestMapping(value = "/updateIntegrateTaskDescription",method = RequestMethod.POST)
    JsonResult updateIntegrateTaskDescription(@RequestParam(value = "taskOid")String taskOid,
                                       @RequestParam(value = "taskDescription")String taskDescription,
                                       HttpServletRequest request){
        HttpSession session = request.getSession();
        if(session.getAttribute("uid") == null){
            return ResultUtils.error(-1, "no login");
        }else {
            String userName = session.getAttribute("uid").toString();
            return ResultUtils.success(taskService.updateIntegrateTaskDescription(taskOid,taskDescription));
        }

    }

    @RequestMapping(value = "/pageIntegrateTaskByUser",method = RequestMethod.GET)
    JsonResult pageIntegrateTaskByUser(@RequestParam(value = "pageNum") int pageNum,
                                       @RequestParam(value = "pageSize") int pageSize,
                                       @RequestParam(value = "asc") int asc,
                                       @RequestParam(value = "sortElement") String sortElement,
                                       HttpServletRequest request){
        HttpSession session = request.getSession();
        if(session.getAttribute("uid") == null){
            return ResultUtils.error(-1, "no login");
        }else {
            String userName = session.getAttribute("uid").toString();
            return ResultUtils.success(taskService.PageIntegrateTaskByUser(userName,pageNum,pageSize,asc,sortElement));
        }

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

    @RequestMapping(value = "/loadDataItemData", method = RequestMethod.POST)
    public JsonResult loadDataItemData(@RequestBody TestDataUploadDTO testDataUploadDTO,HttpServletRequest request) throws Exception {
        JsonResult jsonResult = new JsonResult();
        String oid = testDataUploadDTO.getOid();
        ComputableModel computableModel= computableModelDao.findFirstByOid(oid);
        JSONObject mdlJSON = Utils.convertMdl(computableModel.getMdl());

        HttpSession session = request.getSession();
        if(session.getAttribute("uid")==null){
            return ResultUtils.error(-2,"no login");
        }else {
            String userName = session.getAttribute("uid").toString();
            String[] dataIpAndPort = dataContainerIpAndPort.split(":");
            testDataUploadDTO.setHost(dataIpAndPort[0]);
            testDataUploadDTO.setPort(Integer.parseInt(dataIpAndPort[1]));

            List<UploadDataDTO> uploadDataDTOs = taskService.getTestDataUploadArrayDataItem(testDataUploadDTO, mdlJSON);
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
    @RequestMapping(value = "/setDataTaskPublic",method = RequestMethod.POST)
    public JsonResult setDataTaskPublic(@RequestParam String oid,HttpServletRequest httpServletRequest)
    {
        HttpSession session=httpServletRequest.getSession();
        if(session.getAttribute("uid")==null) {
            return ResultUtils.error(-1, "no login");
        }
        else {
            String username = session.getAttribute("uid").toString();
            return ResultUtils.success(taskService.setDataTaskPublic(oid));
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
    @RequestMapping(value = "/setDataTaskPrivate",method = RequestMethod.POST)
    public JsonResult setDataTaskPrivate(@RequestParam String oid,HttpServletRequest httpServletRequest)
    {
        HttpSession session=httpServletRequest.getSession();
        if(session.getAttribute("uid")==null) {
            return ResultUtils.error(-1, "no login");
        }
        else {
            String username = session.getAttribute("uid").toString();
            return ResultUtils.success(taskService.setDataTaskPrivate(oid));
        }

    }

    @RequestMapping(value = "/getDataProcessingNode",method = RequestMethod.GET)
    public JsonResult getDataProcessingNode() throws DocumentException, IOException, URISyntaxException {
       return ResultUtils.success(taskService.getDataProcessingNode());

    }


    @RequestMapping(value = "/getDataProcessings",method = RequestMethod.GET)
    public JsonResult getDataProcessings() throws IOException, URISyntaxException, DocumentException {
        return ResultUtils.success(taskService.getDataProcessings());

    }
}
