package njgis.opengms.portal.service;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import njgis.opengms.portal.AbstractTask.AsyncTask;
import njgis.opengms.portal.bean.JsonResult;
import njgis.opengms.portal.dao.ComputableModelDao;
import njgis.opengms.portal.dao.TaskDao;
import njgis.opengms.portal.dao.UserDao;
import njgis.opengms.portal.dto.task.ResultDataDTO;
import njgis.opengms.portal.dto.task.TestDataUploadDTO;
import njgis.opengms.portal.dto.task.UploadDataDTO;
import njgis.opengms.portal.entity.ComputableModel;
import njgis.opengms.portal.entity.Task;
import njgis.opengms.portal.entity.User;
import njgis.opengms.portal.entity.support.TaskData;
import njgis.opengms.portal.entity.support.UserTaskInfo;
import njgis.opengms.portal.utils.MyHttpUtils;
import njgis.opengms.portal.utils.ResultUtils;
import njgis.opengms.portal.utils.Utils;
import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.Element;
import org.dom4j.io.SAXReader;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.AsyncResult;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.ModelAndView;

import java.io.File;
import java.util.*;
import java.util.concurrent.Future;

import static njgis.opengms.portal.utils.Utils.*;

@Service
public class TaskService {

    @Autowired
    ComputableModelService computableModelService;

    @Autowired
    ComputableModelDao computableModelDao;

    @Autowired
    UserDao userDao;

    @Autowired
    TaskDao taskDao;

    @Value("${managerServerIpAndPort}")
    private String managerServer;

    @Value("${resourcePath}")
    private String resourcePath;

    @Value("${managerServerIpAndPort}")
    private String managerServerIpAndPort;

    public ModelAndView getPage(String id, String username) {
        //条目信息
        ComputableModel modelInfo = computableModelService.getByOid(id);
        modelInfo.setViewCount(modelInfo.getViewCount() + 1);
        computableModelDao.save(modelInfo);

        //用户信息
        User user = userDao.findFirstByUserName(modelInfo.getAuthor());
        JSONObject userJson = new JSONObject();
        userJson.put("name", user.getName());
        userJson.put("oid", user.getOid());
        userJson.put("image", user.getImage());

        ModelAndView modelAndView = new ModelAndView();
        //创建task 获取数据服务器地址
        if (username != null) {
            JsonResult jsonResult = generateTask(id, username);

            JSONObject data = JSONObject.parseObject(JSONObject.toJSONString(jsonResult.getData()));
            JSONObject dxServer = data.getJSONObject("dxServer");

//            String re="      {\"ip\": \"172.21.212.155\",\n" +
//                    "      \"port\": 8062,\n" +
//                    "      \"userName\": \"wangming\",\n" +
//                    "      \"type\": 1}";
//            dxServer=JSONObject.parseObject(re);

            modelAndView.setViewName("task");
            modelAndView.addObject("modelInfo", modelInfo);
            modelAndView.addObject("user", userJson);
            modelAndView.addObject("IP", data.getString("ip"));
            modelAndView.addObject("Port", data.getString("port"));
            modelAndView.addObject("pid", data.getString("pid"));
            modelAndView.addObject("dxIP", dxServer.getString("ip"));
            modelAndView.addObject("dxPort", dxServer.getString("port"));
            modelAndView.addObject("dxType", dxServer.getString("type"));
            modelAndView.addObject("mdlJson", convertMdl(modelInfo.getMdl()));


        } else {
            modelAndView.setViewName("login");
        }


        return modelAndView;
    }

    public String renameTag(String taskId, List<TaskData> outputs) {
        Task task = new Task();
        task = taskDao.findFirstByTaskId(taskId);
//        task.setOutputs(outputs);
        taskDao.save(task);
        return "suc";
    }

    public ModelAndView getTaskOutputPage(String ids, String userName) {
        String[] twoIds = ids.split("&");

        String modelId = twoIds[0];
        String taskId = twoIds[1];

        User user = userDao.findFirstByUserName(userName);
        //判断taskinfo权限
        List<UserTaskInfo> userTaskInfos = user.getRunTask();
        boolean isUserOwnTask = false;
        for (UserTaskInfo userTaskInfo : userTaskInfos) {
            if (userTaskInfo.getTaskId().equals(taskId))
                isUserOwnTask = true;
        }
        if (isUserOwnTask == false) {
            ModelAndView modelAndView = new ModelAndView();
            modelAndView.setViewName("login");
            modelAndView.addObject("unlogged", "1");
            return modelAndView;
        } else {
            ModelAndView modelAndView = new ModelAndView();
            modelAndView.setViewName("taskOutput");
            modelAndView.addObject("logged", "0");
            return modelAndView;
        }
    }

    public JSONObject initTaskOutput(String ids, String userName) {
        String[] twoIds = ids.split("&");

        String modelId = twoIds[0];
        String taskId = twoIds[1];

        ComputableModel modelInfo = computableModelService.getByOid(modelId);
        modelInfo.setViewCount(modelInfo.getViewCount() + 1);
        computableModelDao.save(modelInfo);

        User user = userDao.findFirstByUserName(modelInfo.getAuthor());

        JSONObject userJson = new JSONObject();
        userJson.put("compute_model_user_name", user.getUserName());
        userJson.put("compute_model_user_oid", user.getOid());
        userJson.put("userName", userName);

        JSONObject result = new JSONObject();

        //获得task信息
        Task task = findByTaskId(taskId);
        //判断权限信息
        boolean hasPermission = false;
        List<String> publicInfos = task.getIsPublic();
        if (publicInfos.get(0).equals("public")) {
            result.put("permission", "yes");
            return result;
        } else {

            for (String publicInfo : publicInfos) {
                if (publicInfo.equals(userName)) {
                    hasPermission = true;
                    result.put("permission", "yes");
                    break;
                }

            }
            if (hasPermission == false) {
                result.put("permission", "no");
                return result;
            }
        }

        JsonResult jsonResult = generateTask(modelId, userName);
        JSONObject data = JSONObject.parseObject(JSONObject.toJSONString(jsonResult.getData()));

        JSONObject model_Info = new JSONObject();
        JSONObject taskInfo = new JSONObject();
        JSONObject dxInfo = new JSONObject();
        JSONObject dxServer = data.getJSONObject("dxServer");

        model_Info.put("name", modelInfo.getName());
        model_Info.put("des", modelInfo.getDescription());
        model_Info.put("date", modelInfo.getCreateTime());
        dxInfo.put("dxIP", dxServer.getString("ip"));
        dxInfo.put("dxPort", dxServer.getString("port"));
        dxInfo.put("dxType", dxServer.getString("type"));
        taskInfo.put("ip", data.getString("ip"));
        taskInfo.put("port", data.getString("port"));
        taskInfo.put("pid", data.getString("pid"));
        taskInfo.put("creater", task.getUserId());
        taskInfo.put("description", task.getDescription());
        taskInfo.put("public", task.getIsPublic());
        taskInfo.put("outputs", task.getOutputs());
        taskInfo.put("inputs", task.getInputs());
        taskInfo.put("createTime", task.getRunTime());

        boolean hasTest;
        if (modelInfo.getTestDataPath() == null || modelInfo.getTestDataPath().equals("")) {
            hasTest = false;
        } else {
            hasTest = true;
        }
        model_Info.put("hasTest", hasTest);
        JSONObject mdlInfo = convertMdl(modelInfo.getMdl());
        JSONObject mdlObj = mdlInfo.getJSONObject("mdl");
        JSONArray states = mdlObj.getJSONArray("states");
        model_Info.put("states", states);
        //拼接

        result.put("userInfo", userJson);
        result.put("modelInfo", model_Info);
        result.put("taskInfo", taskInfo);
        result.put("dxInfo", dxInfo);
        System.out.println(result);
        return result;
    }


    public JSONObject initTask(String oid, String userName) {
        //条目信息
        ComputableModel modelInfo = computableModelService.getByOid(oid);
        modelInfo.setViewCount(modelInfo.getViewCount() + 1);
        computableModelDao.save(modelInfo);

        //用户信息
        User user = userDao.findFirstByUserName(modelInfo.getAuthor());
        JSONObject userJson = new JSONObject();
        userJson.put("compute_model_user_name", user.getUserName());
        userJson.put("compute_model_user_oid", user.getOid());
        userJson.put("userName", userName);
        JSONObject taskInfo = new JSONObject();
        JSONObject dxInfo = new JSONObject();
        JSONObject model_Info = new JSONObject();

        //创建task 获取数据服务器地址
        JsonResult jsonResult = generateTask(oid, userName);

        JSONObject data = JSONObject.parseObject(JSONObject.toJSONString(jsonResult.getData()));
        System.out.println("task" + jsonResult);
        JSONObject dxServer = data.getJSONObject("dxServer");
        taskInfo.put("ip", data.getString("ip"));
        taskInfo.put("port", data.getString("port"));
        taskInfo.put("pid", data.getString("pid"));
        dxInfo.put("dxIP", dxServer.getString("ip"));
        dxInfo.put("dxPort", dxServer.getString("port"));
        dxInfo.put("dxType", dxServer.getString("type"));
        model_Info.put("name", modelInfo.getName());
        model_Info.put("des", modelInfo.getDescription());
        model_Info.put("date", modelInfo.getCreateTime());
        boolean hasTest;
        if (modelInfo.getTestDataPath() == null || modelInfo.getTestDataPath().equals("")) {
            hasTest = false;
        } else {
            hasTest = true;
        }
        model_Info.put("hasTest", hasTest);
        JSONObject mdlInfo = convertMdl(modelInfo.getMdl());
        JSONObject mdlObj = mdlInfo.getJSONObject("mdl");
        JSONArray states = mdlObj.getJSONArray("states");

        for (int i = 0; i < states.size(); i++) {
            JSONObject state = states.getJSONObject(i);
            JSONArray events = state.getJSONArray("event");
            JSONArray eventsSort = new JSONArray();
            for (int j = 0; j < events.size(); j++) {
                JSONObject event = events.getJSONObject(j);
                if (event.getString("eventType").equals("response")) {
                    eventsSort.add(event);
                }
            }
            for (int j = 0; j < events.size(); j++) {
                JSONObject event = events.getJSONObject(j);
                if (!event.getString("eventType").equals("response")) {
                    eventsSort.add(event);
                }
            }
            state.put("event", eventsSort);
            states.set(i, state);
        }

        JSONArray dataItems=mdlObj.getJSONArray("DataItems");
        JSONArray dataRefs=new JSONArray();
        for(int i=0;i<dataItems.size();i++){
            JSONObject dataRef=dataItems.getJSONArray(i).getJSONObject(0);
            dataRefs.add(dataRef);
        }

        model_Info.put("states", states);
        model_Info.put("dataRefs",dataRefs);
        //拼接
        JSONObject result = new JSONObject();
        result.put("userInfo", userJson);
        result.put("modelInfo", model_Info);
        result.put("taskInfo", taskInfo);
        result.put("dxInfo", dxInfo);

        return result;
    }

    //根据post请求的信息得到数据存储的路径
    public List<UploadDataDTO> getTestDataUploadArray(TestDataUploadDTO testDataUploadDTO) {
        String oid = testDataUploadDTO.getOid();
        String parentDirectory = resourcePath + "/computableModel/testify/" + oid;
        String configPath = parentDirectory + File.separator + "config.xml";
        JSONArray configInfoArray = getConfigInfo(configPath, parentDirectory);
        if (configInfoArray == null) {
            return null;
        }
        //进行遍历
        List<UploadDataDTO> dataUploadList = new ArrayList<>();
        for (int i = 0; i < configInfoArray.size(); i++) {
            JSONObject temp = configInfoArray.getJSONObject(i);
            UploadDataDTO uploadDataDTO = new UploadDataDTO();
            uploadDataDTO.setEvent(temp.getString("event"));
            uploadDataDTO.setState(temp.getString("state"));
            uploadDataDTO.setFilePath(temp.getString("file"));
            dataUploadList.add(uploadDataDTO);
        }
        return dataUploadList;
    }

    //读取xml信息，返回数据的State,Event和数据路径
    private JSONArray getConfigInfo(String configPath, String parentDirectory) {
        JSONArray resultArray = new JSONArray();
        Document result = null;
        SAXReader reader = new SAXReader();
        try {
            result = reader.read(configPath);
        } catch (DocumentException e) {
            e.printStackTrace();
            return null;
        }
        Element rootElement = result.getRootElement();
        List<Element> items = rootElement.elements();
        for (Element item : items) {
            String fileName = item.attributeValue("File");
            String state = item.attributeValue("State");
            String event = item.attributeValue("Event");
            String filePath = parentDirectory + File.separator + fileName;
            JSONObject tempObject = new JSONObject();
            tempObject.put("state", state);
            tempObject.put("event", event);
            tempObject.put("file", filePath);
            resultArray.add(tempObject);
        }
        return resultArray;
    }

    @Async
    public Future<ResultDataDTO> uploadDataToServer(UploadDataDTO uploadDataDTO, TestDataUploadDTO testDataUploadDTO) {
        ResultDataDTO resultDataDTO = new ResultDataDTO();
        resultDataDTO.setEvent(uploadDataDTO.getEvent());
        resultDataDTO.setStateId(uploadDataDTO.getState());
        String testDataPath = uploadDataDTO.getFilePath();
        String url = "http://" + managerServer + "/GeoModeling/computableModel/uploadData";
        //拼凑form表单
        Map<String, String> params = new HashMap<>();
        params.put("host", testDataUploadDTO.getHost());
        params.put("port", String.valueOf(testDataUploadDTO.getPort()));
        params.put("type", String.valueOf(testDataUploadDTO.getType()));
        params.put("userName", testDataUploadDTO.getUserName());

        //拼凑file表单
        Map<String, String> fileMap = new HashMap<>();
        fileMap.put("file", testDataPath);
        String result;
        try {
            result = MyHttpUtils.POSTFile(url, "UTF-8", params, fileMap);
        } catch (Exception e) {
            result = null;
        }
        if (result == null) {
            resultDataDTO.setUrl("");
            resultDataDTO.setTag("");
        } else {
            JSONObject res = JSON.parseObject(result);
            if (res.getIntValue("code") != 1) {
                resultDataDTO.setUrl("");
                resultDataDTO.setTag("");
                resultDataDTO.setSuffix("");
            } else {
                JSONObject data = res.getJSONObject("data");
                String data_url = data.getString("url");
                String tag = data.getString("tag");
                String suffix = data.getString("suffix");
                resultDataDTO.setTag(tag);
                resultDataDTO.setUrl(data_url);
                resultDataDTO.setSuffix(suffix);
            }
        }
        return new AsyncResult<>(resultDataDTO);


    }

//    public UploadDataDTO getPublishedTask(String taskId){
//
//    }

    public List<ResultDataDTO> getPublishedData(String taskId){
        Task task=taskDao.findFirstByTaskId(taskId);

        List<ResultDataDTO> resultDataDTOList=new ArrayList<>();

        if(!task.getIsPublic().equals("noPublic")){
            for(int i=0; i<task.getInputs().size();i++ ){
                ResultDataDTO resultDataDTO=new ResultDataDTO();
                resultDataDTO.setUrl(task.getInputs().get(i).getUrl());
                resultDataDTO.setState(task.getInputs().get(i).getStatename());
                resultDataDTO.setEvent(task.getInputs().get(i).getEvent());
                resultDataDTO.setTag(task.getInputs().get(i).getTag());
                resultDataDTO.setSuffix(task.getInputs().get(i).getSuffix());
                resultDataDTOList.add(resultDataDTO);
            }
            for(int i=0; i<task.getOutputs().size();i++ ){
                ResultDataDTO resultDataDTO=new ResultDataDTO();
                resultDataDTO.setUrl(task.getOutputs().get(i).getUrl());
                resultDataDTO.setState(task.getOutputs().get(i).getStatename());
                resultDataDTO.setEvent(task.getOutputs().get(i).getEvent());
                resultDataDTO.setTag(task.getOutputs().get(i).getTag());
                resultDataDTO.setSuffix(task.getOutputs().get(i).getSuffix());
                resultDataDTOList.add(resultDataDTO);
            }
        }
        return resultDataDTOList;
    }

    public JsonResult generateTask(String id, String username) {
        String md5 = getMd5(id);
        JSONObject result = getServiceTask(md5);

        if (result.getInteger("code") == 1) {

            JSONObject data = result.getJSONObject("data");
            String host = data.getString("host");
            int port = Integer.parseInt(data.getString("port"));

            JSONObject createTaskResult = createTask(id, md5, host, port, username);
            if (createTaskResult != null && createTaskResult.getInteger("code") == 1) {
                return ResultUtils.success(createTaskResult.getJSONObject("data"));
            } else {
                return ResultUtils.error(-3, "can not create task!");
            }
        } else {
            return ResultUtils.error(-2, "can not get service task!");
        }
    }

    public String getMd5(String id) {
        ComputableModel computableModel = computableModelDao.findFirstByOid(id);
        return computableModel.getMd5();
    }

    public JSONObject getServiceTask(String md5) {

        String urlStr = "http://" + managerServerIpAndPort + "/GeoModeling/taskNode/getServiceTask/" + md5;
        JSONObject result = connentURL(Utils.Method.GET, urlStr);

        return result;
    }

    public JSONObject createTask(String id, String md5, String ip, int port, String username) {

        String urlStr = "http://" + managerServerIpAndPort + "/GeoModeling/computableModel/createTask";
//        Map<String, Object> paramMap = new HashMap<String, Object>();
//        paramMap.put("ip", ip);
//        paramMap.put("port", port);
//        paramMap.put("pid", md5);
//        paramMap.put("username", username);
        JSONObject paramMap = new JSONObject();
        paramMap.put("ip", ip);
        paramMap.put("port", port);
        paramMap.put("pid", md5);
        paramMap.put("username", username);

        JSONObject result = postJSON(urlStr, paramMap);

        return result;
    }

    public String invoke(JSONObject lists) {

        JSONObject result = postJSON("http://" + managerServerIpAndPort + "/GeoModeling/computableModel/invoke", lists);

        if (result.getInteger("code") == 1) {

            return result.getJSONObject("data").getString("tid");
        }

        return null;
    }

    public String save(Task task) {

        taskDao.save(task);
        return "suc";
    }

    public int delete(String oid, String userName) {
        Task task = taskDao.findFirstByOid(oid);
        if (task != null) {
            taskDao.delete(task);
            return 1;
        } else {
            return -1;
        }
    }

    public JSONObject searchTasksByUserId(String searchText, String userId, int page, String sortType, int asc) {

        Sort sort = new Sort(asc == 1 ? Sort.Direction.ASC : Sort.Direction.DESC, "runTime");

        Pageable pageable = PageRequest.of(page, 10, sort);

        Page<Task> modelItems = taskDao.findByComputableNameContainsIgnoreCaseAndUserId(searchText, userId, pageable);

        JSONObject modelItemObject = new JSONObject();
        modelItemObject.put("count", modelItems.getTotalElements());
        modelItemObject.put("tasks", modelItems.getContent());

        return modelItemObject;

    }

    public JSONObject getTasksByUserId(String userName, int page, String sortType, int sortAsc) {
        AsyncTask asyncTask = new AsyncTask();
        List<Future> futures = new ArrayList<>();

        Sort sort = new Sort(sortAsc == 1 ? Sort.Direction.ASC : Sort.Direction.DESC, "runTime");
        Pageable pageable = PageRequest.of(page, 10, sort);
        Page<Task> tasks = taskDao.findByUserId(userName, pageable);
        List<Task> ts = tasks.getContent();
        try {
            for (int i = 0; i < ts.size(); i++) {
                Task task = ts.get(i);
                if (task.getStatus() != 2 && task.getStatus() != -1) {
                    JSONObject param = new JSONObject();
                    param.put("ip", task.getIp());
                    param.put("port", task.getPort());
                    param.put("tid", task.getTaskId());

                    futures.add(asyncTask.getRecordCallback(param, managerServerIpAndPort));
                }
            }

            for (Future<?> future : futures) {
                while (true) {//CPU高速轮询：每个future都并发轮循，判断完成状态然后获取结果，这一行，是本实现方案的精髓所在。即有10个future在高速轮询，完成一个future的获取结果，就关闭一个轮询
                    if (future.isDone() && !future.isCancelled()) {//获取future成功完成状态，如果想要限制每个任务的超时时间，取消本行的状态判断+future.get(1000*1, TimeUnit.MILLISECONDS)+catch超时异常使用即可。
                        String result = (String) future.get();//获取结果
                        JSONObject jsonResult = JSON.parseObject(result);
                        String tid = jsonResult.getString("tid");
                        int remoteStatus = jsonResult.getInteger("status");
                        List<TaskData> outputs = jsonResult.getJSONArray("outputs").toJavaList(TaskData.class);
                        Task task = taskDao.findFirstByTaskId(tid);

                        if (task.getStatus() != remoteStatus) {
                            task.setStatus(remoteStatus);
                            task.setOutputs(outputs);
                            taskDao.save(task);
                            for (int i = 0; i < ts.size(); i++) {
                                Task task1 = ts.get(i);
                                if (task1.getTaskId().equals(tid)) {
                                    task1.setStatus(remoteStatus);
                                    task1.setOutputs(outputs);
                                    break;
                                }
                            }
                        }
                        break;//当前future获取结果完毕，跳出while
                    } else {
                        Thread.sleep(1);//每次轮询休息1毫秒（CPU纳秒级），避免CPU高速轮循耗空CPU---》新手别忘记这个
                    }
                }
            }

        } catch (Exception e) {
            System.out.println(e);
        }

        JSONObject taskObject = new JSONObject();
        taskObject.put("count", tasks.getTotalElements());
        taskObject.put("tasks", tasks.getContent());

        return taskObject;

    }

    public JSONObject getTasksByUserId(String userName, String sortType, int sortAsc) {
        AsyncTask asyncTask = new AsyncTask();
        List<Future> futures = new ArrayList<>();

        Sort sort = new Sort(sortAsc == 1 ? Sort.Direction.ASC : Sort.Direction.DESC, sortType);
        List<Task> ts = taskDao.findByUserId(userName, sort);
        try {
            for (int i = 0; i < ts.size(); i++) {
                Task task = ts.get(i);
                if (task.getStatus() != 2 && task.getStatus() != -1) {
                    JSONObject param = new JSONObject();
                    param.put("ip", task.getIp());
                    param.put("port", task.getPort());
                    param.put("tid", task.getTaskId());

                    futures.add(asyncTask.getRecordCallback(param, managerServerIpAndPort));
                }
            }

            for (Future<?> future : futures) {
                while (true) {//CPU高速轮询：每个future都并发轮循，判断完成状态然后获取结果，这一行，是本实现方案的精髓所在。即有10个future在高速轮询，完成一个future的获取结果，就关闭一个轮询
                    if (future.isDone() && !future.isCancelled()) {//获取future成功完成状态，如果想要限制每个任务的超时时间，取消本行的状态判断+future.get(1000*1, TimeUnit.MILLISECONDS)+catch超时异常使用即可。
                        String result = (String) future.get();//获取结果
                        JSONObject jsonResult = JSON.parseObject(result);
                        String tid = jsonResult.getString("tid");
                        int remoteStatus = jsonResult.getInteger("status");
                        List<TaskData> outputs = jsonResult.getJSONArray("outputs").toJavaList(TaskData.class);
                        Task task = taskDao.findFirstByTaskId(tid);

                        if (task.getStatus() != remoteStatus) {
                            task.setStatus(remoteStatus);
                            task.setOutputs(outputs);
                            taskDao.save(task);
                            for (int i = 0; i < ts.size(); i++) {
                                Task task1 = ts.get(i);
                                if (task1.getTaskId().equals(tid)) {
                                    task1.setStatus(remoteStatus);
                                    task1.setOutputs(outputs);
                                    break;
                                }
                            }
                        }
                        break;//当前future获取结果完毕，跳出while
                    } else {
                        Thread.sleep(1);//每次轮询休息1毫秒（CPU纳秒级），避免CPU高速轮循耗空CPU---》新手别忘记这个
                    }
                }
            }

        } catch (Exception e) {
            System.out.println(e);
        }

        JSONObject taskObject = new JSONObject();
        taskObject.put("count", ts.size());
        taskObject.put("tasks", ts);

        return taskObject;

    }

    public JSONArray getTasksByModelId(String modelId,int page){

        Sort sort = new Sort(Sort.Direction.DESC, "runTime");
        Pageable pageable = PageRequest.of(page, 5, sort);
        Page<Task> tasks = taskDao.findByComputableId(modelId,pageable);
        List<Task> ts = tasks.getContent();
        JSONArray taskArray=new JSONArray();
        for (Task task:ts) {
            if(task.getIsPublic().get(0).equals("noPublic"))
                continue;
            String userName=task.getUserId();
            String taskId=task.getTaskId();
            Date runTime=task.getRunTime();
            String description = task.getDescription();
            List<String> isPublic = task.getIsPublic();

            JSONObject obj=new JSONObject();
            obj.put("userName",userName);
            obj.put("taskId",taskId);
            obj.put("runTime",runTime);
            obj.put("description",description);
            obj.put("isPublic",isPublic);
            taskArray.add(obj);

        }
        return taskArray;
    }

    public Task findByTaskId(String taskId) {
        return taskDao.findFirstByTaskId(taskId);
    }

    public JSONObject getTaskResult(JSONObject data) {
        JSONObject out = new JSONObject();

        JSONObject result = Utils.postJSON("http://" + managerServerIpAndPort + "/GeoModeling/computableModel/refreshTaskRecord", data);

        ////update model status to Started, Started: 1, Finished: 2, Inited: 0, Error: -1
        Task task = findByTaskId(data.getString("tid"));
        int state = task.getStatus();
        int remoteState = result.getJSONObject("data").getInteger("status");
        if (remoteState != state) {
            task.setStatus(remoteState);
        }
        if (remoteState == 2) {
            task.setOutputs(result.getJSONObject("data").getJSONArray("outputs").toJavaList(TaskData.class));
        }
        save(task);


        if (remoteState == 0) {
            out.put("status", 0);
        } else if (remoteState == 1) {
            out.put("status", 1);
        } else if (remoteState == 2) {
            out.put("status", 2);
            out.put("outputdata", task.getOutputs());
        } else {
            out.put("status", -1);
        }

        return out;
    }

    public String addDescription(String taskId, String description) {
        Task task = taskDao.findFirstByTaskId(taskId);
        if (task == null)
            return "0";
        task.setDescription(description);
        taskDao.save(task);
        return "1";

    }

    public String setPublic(String taskId) {
        Task task = taskDao.findFirstByTaskId(taskId);
        if (task == null)
            return "0";
        List<String> isPublic = task.getIsPublic();
        if (isPublic.get(0).equals("noPublic"))
            isPublic.set(0, "public");
        else if(!isPublic.get(0).equals("public"))
            isPublic.add(0,"public");
        taskDao.save(task);
        return "1";
    }
}
