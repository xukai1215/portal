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
import njgis.opengms.portal.entity.intergrate.Model;
import njgis.opengms.portal.entity.support.*;
import njgis.opengms.portal.utils.MyHttpUtils;
import njgis.opengms.portal.utils.ResultUtils;
import njgis.opengms.portal.utils.Utils;
import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.DocumentHelper;
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

import java.io.*;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.concurrent.Future;

import static njgis.opengms.portal.utils.Utils.*;

@Service
public class TaskService {

    @Autowired
    ComputableModelService computableModelService;

    @Autowired
    UserService userService;

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

    @Value("${dataContainerIpAndPort}")
    private String dataContainerIpAndPort;

    //可以可视化的数据模板
    @Value("#{'${visualTemplateIds}'.split(',')}")
    private String[] visualTemplateIds;

    public String[] getVisualTemplateIds(){
        return visualTemplateIds;
    }

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

            return modelAndView;
        } else {
            ModelAndView modelAndView = new ModelAndView();
            modelAndView.setViewName("taskOutput");

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
        userJson.put("compute_model_user_name", user.getName());
        userJson.put("compute_model_user_oid", user.getOid());

        user = userDao.findFirstByUserName(userName);

        userJson.put("userName", user.getUserName());
        userJson.put("userOid", user.getOid());

        JSONObject result = new JSONObject();

        //获得task信息
        Task task = findByTaskId(taskId);

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
        taskInfo.put("permission", task.getPermission());
        taskInfo.put("createTime", task.getRunTime());
        taskInfo.put("status", task.getStatus());
        taskInfo.put("outputs", task.getOutputs());
//
        //判断权限信息
        boolean hasPermission = false;

//        List<String> publicInfos = task.getIsPublic();
//        if (publicInfos.get(0).equals("public")) {
//            result.put("permission", "yes");
//        } else {
//
//            for (String publicInfo : publicInfos) {
//                if (publicInfo.equals(userName)) {
//                    hasPermission = true;jjj
//                    result.put("permission", "yes");
//                    break;
//                }
//
//            }
//            if (hasPermission == false) {
//                result.put("permission", "no");
//                return result;
//            }
//        }
        if (task.getPermission().equals("private")&&!task.getUserId().equals(userName) ) {
            result.put("permission", "forbid");
//            return result;
        } else {
            result.put("permission", "allow");
        }

        List<TaskData> inputs = task.getInputs();
        for(int i=0;i<inputs.size();i++){
            TaskData input=inputs.get(i);
            for(String id:visualTemplateIds){
                String templateId = input.getTemplateId();
                if(templateId!=null) {
                    if (templateId.toLowerCase().equals(id)) {
                        inputs.get(i).setVisual(true);
                        break;
                    }
                }
            }
        }
        taskInfo.put("inputs", inputs);

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
//        result.put("dxInfo", dxInfo);
        System.out.println(result);

        return result;
    }

    public Task templateMatch(Task task){//为taskoutput匹配templateId

        String modelId = task.getComputableId();
        ComputableModel modelInfo = computableModelService.getByOid(modelId);
        JSONObject mdlInfo = convertMdl(modelInfo.getMdl());
        JSONObject mdlObj = mdlInfo.getJSONObject("mdl");
        JSONArray states = mdlObj.getJSONArray("states");

        List<TaskData> outputs = task.getOutputs();

        for (int i=0;i<states.size();i++){
            JSONObject obj = (JSONObject)states.get(i);
            JSONArray event = obj.getJSONArray("event");
            for( int j=0; j<event.size();j++ ){
                JSONObject file = (JSONObject) event.get(j);
                JSONArray dataArray = file.getJSONArray("data");
                JSONObject data = (JSONObject) dataArray.get(0);

                if(file.getString("eventType").equals("noresponse")){
                    for (TaskData output : outputs){
                        if(output.getEvent().equals(file.getString("eventName"))){
                            if(data.getString("dataType").equals("external"))
                                output.setTemplateId(data.getString("externalId"));
                            else
                                output.setTemplateId("schema");
                        }
                    }
                }
            }

        }

        task.setOutputs(outputs);

        return task;

    }

    public JSONObject initTask(String oid, String userName) {
        //条目信息
        ComputableModel modelInfo = computableModelService.getByOid(oid);
        modelInfo.setViewCount(modelInfo.getViewCount() + 1);
        computableModelDao.save(modelInfo);

        //用户信息
        User user = userDao.findFirstByUserName(modelInfo.getAuthor());
        JSONObject userJson = new JSONObject();
        userJson.put("compute_model_user_name", user.getName());
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
        JSONArray dataItems = mdlObj.getJSONArray("DataItems");
        JSONArray dataRefs = new JSONArray();
        for (int i = 0; i < dataItems.size(); i++) {
            JSONObject dataRef = dataItems.getJSONArray(i).getJSONObject(0);
            dataRefs.add(dataRef);
        }


        JSONArray states = mdlObj.getJSONArray("states");

        for (int i = 0; i < states.size(); i++) {
            JSONObject state = states.getJSONObject(i);
            JSONArray events = state.getJSONArray("event");
            JSONArray eventsSort = new JSONArray();
            for (int j = 0; j < events.size(); j++) {
                JSONObject event = events.getJSONObject(j);
                if (event.getString("eventType").equals("response")) {
                    //判断是否能够可视化
//                    JSONObject eventData = (JSONObject)event.getJSONArray("data").get(0);
//                    if(eventData.containsKey("externalId")){
//                        for(String id:visualTemplateIds){
//                            if(eventData.getString("externalId").toLowerCase().equals(id)){
//                                event.put("visual",true);
//                                break;
//                            }
//                        }
//                    }
                    eventsSort.add(event);
                }
            }
            for (int j = 0; j < events.size(); j++) {
                JSONObject event = events.getJSONObject(j);
                if (!event.getString("eventType").equals("response")) {
                    //判断是否能够可视化
//                    JSONObject eventData = (JSONObject)event.getJSONArray("data").get(0);
//                    if(eventData.containsKey("externalId")){
//                        for(String id:visualTemplateIds){
//                            if(eventData.getString("externalId").toLowerCase().equals(id)){
//                                event.put("visual",true);
//                                break;
//                            }
//                        }
//                    }
                    eventsSort.add(event);
                }
            }
            state.put("event", eventsSort);
            states.set(i, state);
        }


        model_Info.put("states", states);
        model_Info.put("dataRefs", dataRefs);
        //拼接
        JSONObject result = new JSONObject();
        result.put("userInfo", userJson);
        result.put("modelInfo", model_Info);
        result.put("taskInfo", taskInfo);
        result.put("dxInfo", dxInfo);
        result.put("visualIds",visualTemplateIds);

        return result;
    }

    //根据post请求的信息得到数据存储的路径
    public List<UploadDataDTO> getTestDataUploadArray(TestDataUploadDTO testDataUploadDTO, JSONObject mdlJson) {
        JSONArray states = mdlJson.getJSONObject("mdl").getJSONArray("states");


        String oid = testDataUploadDTO.getOid();
        String parentDirectory = resourcePath + "/computableModel/testify/" + oid;
        String configPath = parentDirectory + "/" + "config.xml";
        JSONArray configInfoArray = getConfigInfo(configPath, parentDirectory, oid);
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
            uploadDataDTO.setChildren(temp.getJSONArray("children").toJavaList(ParamInfo.class));

            for(int j=0;j<states.size();j++){
                JSONObject state = states.getJSONObject(j);
                if(state.getString("Id").equals(uploadDataDTO.getState())){
                    JSONArray events=state.getJSONArray("event");
                    for(int k=0;k<events.size();k++){
                        JSONObject event=events.getJSONObject(k);
                        if(event.getString("eventName").equals(uploadDataDTO.getEvent())){
                            JSONObject data=event.getJSONArray("data").getJSONObject(0);
                            if(data.getString("dataType").equals("external")){
                                uploadDataDTO.setType("id");
                                uploadDataDTO.setTemplate(data.getString("externalId").toLowerCase());
                                for(String id:visualTemplateIds){
                                    if(uploadDataDTO.getTemplate().equals(id)){
                                        uploadDataDTO.setVisual(true);
                                        break;
                                    }
                                }
                            }else{
                                if(data.getString("schema")!=null) {
                                    uploadDataDTO.setType("schema");
                                    uploadDataDTO.setTemplate(data.getString("schema"));
                                    uploadDataDTO.setVisual(false);
                                }else{
                                    uploadDataDTO.setType("none");
                                    uploadDataDTO.setTemplate("");
                                    uploadDataDTO.setVisual(false);
                                }
                            }

                            break;
                        }
                    }
                    break;
                }
            }
            if(uploadDataDTO.getType()==null){
                uploadDataDTO.setType("none");
                uploadDataDTO.setTemplate("");
                uploadDataDTO.setVisual(false);
            }

            dataUploadList.add(uploadDataDTO);
        }
        return dataUploadList;
    }

    //读取xml信息，返回数据的State,Event和数据路径
    private JSONArray getConfigInfo(String configPath, String parentDirectory, String oid) {
        JSONArray resultArray = new JSONArray();
        Document result = null;
        SAXReader reader = new SAXReader();
        try {
            result = reader.read(configPath);
        } catch (DocumentException e) {
            e.printStackTrace();
            return null;
        }
        ComputableModel computableModel = computableModelDao.findFirstByOid(oid);
        JSONObject mdlInfo = convertMdl(computableModel.getMdl());
        JSONObject mdlObj = mdlInfo.getJSONObject("mdl");
        JSONArray dataItems = mdlObj.getJSONArray("DataItems");
        JSONArray dataRefs = new JSONArray();
        for (int i = 0; i < dataItems.size(); i++) {
            JSONObject dataRef = dataItems.getJSONArray(i).getJSONObject(0);
            dataRefs.add(dataRef);
        }
        JSONArray states = mdlObj.getJSONArray("states");

        Element rootElement = result.getRootElement();
        List<Element> items = rootElement.elements();
        for (Element item : items) {
            String fileName = item.attributeValue("File");
            String state = item.attributeValue("State");
            String event = item.attributeValue("Event");
            String filePath = parentDirectory + "/" + fileName;

            JSONArray children = new JSONArray();
            Boolean find = false;
            for (int i = 0; i < states.size(); i++) {
                JSONArray events = states.getJSONObject(i).getJSONArray("event");
                for (int j = 0; j < events.size(); j++) {
                    JSONObject _event = events.getJSONObject(j);
                    Boolean quit = false;
                    if (_event.getString("eventName").equals(event)) {
                        find = true;
                        String type = _event.getString("eventType");
                        if (type.equals("response")) {
                            JSONObject data = _event.getJSONArray("data").getJSONObject(0);
                            if (data.getString("dataType").equals("internal")) {
                                String dataRefText = data.getString("text");
                                for (int k = 0; k < dataRefs.size(); k++) {
                                    JSONObject dataRef = dataRefs.getJSONObject(k);
                                    if (dataRef.getString("text").equals(dataRefText)) {
                                        quit = true;
                                        JSONArray nodes = dataRef.getJSONArray("nodes");
                                        if (nodes != null) {
                                            if (nodes.size() > 0) {
                                                try {

                                                    BufferedReader br = new BufferedReader(new FileReader(new File(filePath)));
                                                    String content = "";
                                                    String temp;
                                                    while ((temp = br.readLine()) != null) {
                                                        content += temp;
                                                    }

                                                    Document mdlDoc = DocumentHelper.parseText(content);
                                                    Element dataSetElement = mdlDoc.getRootElement();
                                                    List<Element> XDOs = dataSetElement.elements();

                                                    for (int x = 0; x < XDOs.size(); x++) {
                                                        Element element = XDOs.get(x);
                                                        JSONObject child = new JSONObject();
                                                        child.put("eventName", element.attributeValue("name"));
                                                        child.put("value", element.attributeValue("value"));
                                                        children.add(child);
                                                    }

                                                } catch (Exception e) {
                                                    e.fillInStackTrace();
                                                }
                                            }
                                        }
                                        break;
                                    }

                                }
                            }
                        }

                    }
                    if (quit) {
                        break;
                    }
                }
                if (find) {
                    break;
                }
            }


            JSONObject tempObject = new JSONObject();
            tempObject.put("state", state);
            tempObject.put("event", event);
            tempObject.put("file", filePath);
            tempObject.put("children", children);
            resultArray.add(tempObject);
        }
        return resultArray;
    }

    @Async
    public Future<ResultDataDTO> uploadDataToServer(UploadDataDTO uploadDataDTO, TestDataUploadDTO testDataUploadDTO, String userName) {
        ResultDataDTO resultDataDTO = new ResultDataDTO();
        resultDataDTO.setEvent(uploadDataDTO.getEvent());
        resultDataDTO.setStateId(uploadDataDTO.getState());
        resultDataDTO.setChildren(uploadDataDTO.getChildren());
        String testDataPath = uploadDataDTO.getFilePath();
        String url = "http://" + dataContainerIpAndPort + "/data";
        //拼凑form表单
        HashMap<String, String> params = new HashMap<>();
        params.put("name", uploadDataDTO.getEvent());
        params.put("userId", userName);
        params.put("serverNode", "china");
        params.put("origination", "portal");

        //拼凑file表单
        List<String> filePaths=new ArrayList<>();
//
        String configParentPath = resourcePath + "/configFile/" + UUID.randomUUID().toString() + "/";
        File path = new File(configParentPath);
        path.mkdirs();
        String configPath = configParentPath + "config.udxcfg";
        File configFile = new File(configPath);

        ZipStreamEntity zipStreamEntity = null;

        try {

            configFile.createNewFile();
//            File configFile=File.createTempFile("config",".udxcfg");

            Writer out = new FileWriter(configFile);
            String content = "<UDXZip>\n";
            content += "\t<Name>\n";
            String[] paths = testDataPath.split("/");
            content += "\t\t<add value=\"" + paths[paths.length - 1] + "\" />\n";
            content += "\t</Name>\n";
            content += "\t<DataTemplate type=\"" + uploadDataDTO.getType() + "\">\n";
            content += "\t\t"+uploadDataDTO.getTemplate()+"\n";
            content += "\t</DataTemplate>\n";
            content += "</UDXZip>";

            out.write(content);
            out.flush();
            out.close();


            filePaths.add(testDataPath);
            filePaths.add(configPath);

//            File dataFile=new File(testDataPath);
//            InputStream dataStream = new FileInputStream(dataFile);
//            ZipStreamEntity zipStreamEntity1=new ZipStreamEntity(dataFile.getName(),dataStream);
//
//            InputStream configStream = new FileInputStream(configFile);
//            ZipStreamEntity zipStreamEntity2=new ZipStreamEntity(configFile.getName(),configStream);
//
//            List<ZipStreamEntity> zipStreamEntityList=new ArrayList<>();
//            zipStreamEntityList.add(zipStreamEntity1);
//            zipStreamEntityList.add(zipStreamEntity2);
//
//            String dataName=dataFile.getName().substring(0,dataFile.getName().lastIndexOf("."));
//            InputStream zipInputStream = ZipUtils.listStreamToZipStream(zipStreamEntityList,dataName);
//            zipStreamEntity=new ZipStreamEntity(dataName,zipInputStream);



        } catch (Exception e) {
            e.printStackTrace();
        }


        String result;
        try {
            result = MyHttpUtils.upload(url, filePaths, params);
        } catch (Exception e) {
            result = null;
        }
        if (result == null) {
            resultDataDTO.setUrl("");
            resultDataDTO.setTag("");
        } else {
            JSONObject res = JSON.parseObject(result);
            if (res.getIntValue("code") != 0) {
                resultDataDTO.setUrl("");
                resultDataDTO.setTag("");
                resultDataDTO.setSuffix("");
            } else {
                JSONObject data = res.getJSONObject("data");
                String data_url = "http://"+dataContainerIpAndPort+"/data?uid="+data.getString("source_store_id");
                String tag = data.getString("file_name");
                String[] paths=testDataPath.split("\\.");
                String suffix = paths[paths.length-1];
                resultDataDTO.setTag(tag);
                resultDataDTO.setUrl(data_url);
                resultDataDTO.setSuffix(suffix);
                resultDataDTO.setVisual(uploadDataDTO.getVisual());
            }
        }
        return new AsyncResult<>(resultDataDTO);


    }


//    public UploadDataDTO getPublishedTask(String taskId){
//
//    }

    public List<ResultDataDTO> getPublishedData(String taskId) {
        Task task = taskDao.findFirstByTaskId(taskId);

        List<ResultDataDTO> resultDataDTOList = new ArrayList<>();

//        if(task.getStatus()==1){
        for (int i = 0; i < task.getInputs().size(); i++) {
            ResultDataDTO resultDataDTO = new ResultDataDTO();
            resultDataDTO.setUrl(task.getInputs().get(i).getUrl());
            resultDataDTO.setUrl(task.getInputs().get(i).getUrl());
            resultDataDTO.setState(task.getInputs().get(i).getStatename());
            resultDataDTO.setEvent(task.getInputs().get(i).getEvent());
            resultDataDTO.setTag(task.getInputs().get(i).getTag());
            resultDataDTO.setSuffix(task.getInputs().get(i).getSuffix());
            resultDataDTO.setChildren(task.getInputs().get(i).getChildren());
            resultDataDTOList.add(resultDataDTO);
        }
        for (int i = 0; i < task.getOutputs().size(); i++) {
            ResultDataDTO resultDataDTO = new ResultDataDTO();
            resultDataDTO.setUrl(task.getOutputs().get(i).getUrl());
            if(task.getOutputs().get(i).getUrl().contains("["))
                resultDataDTO.setUrls(task.getOutputs().get(i).getUrls());
            resultDataDTO.setState(task.getOutputs().get(i).getStatename());
            resultDataDTO.setEvent(task.getOutputs().get(i).getEvent());
            resultDataDTO.setTag(task.getOutputs().get(i).getTag());
            resultDataDTO.setSuffix(task.getOutputs().get(i).getSuffix());
            resultDataDTO.setMultiple(task.getOutputs().get(i).getMultiple());
            resultDataDTO.setChildren(task.getOutputs().get(i).getChildren());
            resultDataDTOList.add(resultDataDTO);
        }
//        }
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

    public String[] mutiInvoke(List<JSONObject> lists,String userName) {
        String[] result = new String[lists.size()];
        int sucCount = 0; //成功次数计数
        for (int i = 0; i < lists.size(); i++) {
            ComputableModel computableModel = computableModelService.getByOid(lists.get(i).getString("oid"));

            String mdlStr = computableModel.getMdl();
            JSONObject mdlJson = Utils.convertMdl(mdlStr);
            System.out.println(mdlJson);
            JSONObject mdl = mdlJson.getJSONObject("mdl");
            JSONArray states = mdl.getJSONArray("states");
            //截取RelatedDatasets字符串

            JSONArray outputs = new JSONArray();
            for (int k = 0; k < states.size(); k++) {
                JSONObject state = states.getJSONObject(k);
                JSONArray events = state.getJSONArray("event");
                for (int j = 0; j < events.size(); j++) {
                    JSONObject event = events.getJSONObject(j);
                    String eventType = event.getString("eventType");
                    if (eventType.equals("noresponse")) {
                        JSONObject output = new JSONObject();
                        output.put("statename", state.getString("name"));
                        output.put("event", event.getString("eventName"));
                        JSONObject template = new JSONObject();

                        JSONArray dataArr = event.getJSONArray("data");
                        if (dataArr != null) {
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
                                    if (data.getString("schema") != null) {
                                        template.put("type", "schema");
                                        template.put("value", data.getString("schema"));
                                        output.put("template", template);
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
                        outputs.add(output);
                    }
                }
            }
            lists.get(i).put("outputs", outputs);
//            JSONObject jsonObject = JSONObject.parseObject(lists);
            lists.get(i).put("username", userName);

            result[i] = invoke(lists.get(i));
            if (result != null) {
                sucCount++;
                Task task = new Task();
                task.setOid(UUID.randomUUID().toString());
                task.setComputableId(lists.get(i).getString("oid"));

                task.setComputableName(computableModel.getName());
                task.setTaskId(result[i]);
                task.setUserId(userName);
                task.setIntegrate(false);
                task.setPermission("private");
                task.setIp(lists.get(i).getString("ip"));
                task.setPort(lists.get(i).getInteger("port"));
                task.setRunTime(new Date());
                task.setStatus(0);
                JSONArray inputs = lists.get(i).getJSONArray("inputs");
                task.setInputs(JSONObject.parseArray(inputs.toJSONString(), TaskData.class));
                task.setOutputs(null);
//                for(int i=0;i<inputs.size();i++)
//                {
//                    JSONObject input=inputs.getJSONObject(i);
//                    BeanUtils.copyProperties(input,);
//                }

                save(task);
                UserTaskInfo userTaskInfo = new UserTaskInfo();
                userTaskInfo.setCreateTime(task.getRunTime());
                userTaskInfo.setModelName(task.getComputableName());
                userTaskInfo.setTaskId(task.getTaskId());

                Date now = new Date();
                DailyViewCount newInvokeCount = new DailyViewCount(now, 1);
                List<DailyViewCount> dailyInvokeCount = computableModel.getDailyInvokeCount();
//                if(computableModel.getDailyInvokeCount()!=null){
//                    dailyInvokeCount = computableModel.getDailyInvokeCount();
//                }
                if (dailyInvokeCount.size() > 0) {
                    DailyViewCount dailyViewCount = dailyInvokeCount.get(dailyInvokeCount.size() - 1);
                    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

                    if (sdf.format(dailyViewCount.getDate()).equals(sdf.format(now))) {
                        dailyViewCount.setCount(dailyViewCount.getCount() + 1);
                        dailyInvokeCount.set(dailyInvokeCount.size() - 1, dailyViewCount);
                    } else {
                        dailyInvokeCount.add(newInvokeCount);
                    }
                } else {
                    dailyInvokeCount.add(newInvokeCount);
                }
                computableModel.setInvokeCount(computableModel.getInvokeCount() + 1);
                computableModelDao.save(computableModel);

                //存入用户信息记录
                String msg = userService.addTaskInfo(userName, userTaskInfo);
            }

//                result=result.concat("&").concat(msg);

        }

        if(sucCount==0){
            String[] res=new String[]{"run failed"};
            return res;
        }

        return result;
    }

    public String invoke(JSONObject lists) {

        JSONObject result = postJSON("http://" + managerServerIpAndPort + "/GeoModeling/computableModel/invoke", lists);

        if (result != null) {
            if (result.getInteger("code") == 1) {

                return result.getJSONObject("data").getString("tid");
            }
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
                    param.put("integrate", task.getIntegrate());

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

                        Task task = taskDao.findFirstByTaskId(tid);
                        if (jsonResult.getBoolean("integrate")) {
                            List<Model> models = jsonResult.getJSONArray("models").toJavaList(Model.class);

                            if (task.getStatus() != remoteStatus) {
                                task.setStatus(remoteStatus);
                                task.setModels(models);
                                taskDao.save(task);
                                for (int i = 0; i < ts.size(); i++) {
                                    Task task1 = ts.get(i);
                                    if (task1.getTaskId().equals(tid)) {
                                        task1.setStatus(remoteStatus);
                                        task1.setModels(models);
                                        break;
                                    }
                                }
                            }
                        } else {
                            List<TaskData> outputs = jsonResult.getJSONArray("outputs").toJavaList(TaskData.class);

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
                    param.put("integrate", task.getIntegrate());

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

    public JSONObject getIntegratedTasksByUserId(String userName, int page, String sortType, int sortAsc) {
        AsyncTask asyncTask = new AsyncTask();
        List<Future> futures = new ArrayList<>();

        Sort sort = new Sort(sortAsc == 1 ? Sort.Direction.ASC : Sort.Direction.DESC, "runTime");
        Pageable pageable = PageRequest.of(page, 10, sort);
        Page<Task> tasks = taskDao.findByUserIdAndIntegrate(userName, true, pageable);
        List<Task> ts = tasks.getContent();
        try {
            for (int i = 0; i < ts.size(); i++) {
                Task task = ts.get(i);
                if (task.getStatus() != 2 && task.getStatus() != -1) {
                    JSONObject param = new JSONObject();
                    param.put("ip", task.getIp());
                    param.put("port", task.getPort());
                    param.put("tid", task.getTaskId());
                    param.put("integrate", task.getIntegrate());

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

                        Task task = taskDao.findFirstByTaskId(tid);
                        if (jsonResult.getBoolean("integrate")) {
                            List<Model> models = jsonResult.getJSONArray("models").toJavaList(Model.class);

                            if (task.getStatus() != remoteStatus) {
                                task.setStatus(remoteStatus);
                                task.setModels(models);
                                taskDao.save(task);
                                for (int i = 0; i < ts.size(); i++) {
                                    Task task1 = ts.get(i);
                                    if (task1.getTaskId().equals(tid)) {
                                        task1.setStatus(remoteStatus);
                                        task1.setModels(models);
                                        break;
                                    }
                                }
                            }
                        } else {
                            List<TaskData> outputs = jsonResult.getJSONArray("outputs").toJavaList(TaskData.class);

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

    public JSONObject getIntegratedTasksByUserId(String userName, String sortType, int sortAsc) {
        AsyncTask asyncTask = new AsyncTask();
        List<Future> futures = new ArrayList<>();

        Sort sort = new Sort(sortAsc == 1 ? Sort.Direction.ASC : Sort.Direction.DESC, sortType);
        List<Task> ts = taskDao.findByUserIdAndIntegrate(userName, true, sort);
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

    public void updateUserTasks(String userName) {//多线程通过managerserver更新数据库
        AsyncTask asyncTask = new AsyncTask();
        List<Future> futures = new ArrayList<>();

        List<Task> ts = taskDao.findByUserId(userName);
        try {
            for (int i = 0; i < ts.size(); i++) {
                Task task = ts.get(i);
                if (task.getStatus() != 2 && task.getStatus() != -1) {
                    JSONObject param = new JSONObject();
                    param.put("ip", task.getIp());
                    param.put("port", task.getPort());
                    param.put("tid", task.getTaskId());
                    param.put("integrate", task.getIntegrate());

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

    }

    public JSONObject getTasksByUserIdByStatus(String userName, String status, int page, String sortType, int sortAsc) {

        AsyncTask asyncTask = new AsyncTask();
        List<Future> futures = new ArrayList<>();

        Sort sort = new Sort(sortAsc == 1 ? Sort.Direction.ASC : Sort.Direction.DESC, "runTime");
        Pageable pageable = PageRequest.of(page, 10, sort);
        Page<Task> tasks = Page.empty();

        updateUserTasks(userName);//先利用这个函数更新一下数据库

        if (status.equals("calculating")) {
            tasks = taskDao.findByUserIdAndStatusBetween(userName, -1, 2, pageable);
        } else if (status.equals("successful")) {
            tasks = taskDao.findByUserIdAndStatusBetween(userName, 1, 3, pageable);
        } else if (status.equals("failed"))
            tasks = taskDao.findByUserIdAndStatusBetween(userName, -2, 0, pageable);
        else
            tasks = taskDao.findByUserId(userName, pageable);
        List<Task> ts = tasks.getContent();

        JSONObject taskObject = new JSONObject();
        taskObject.put("count", tasks.getTotalElements());
        taskObject.put("tasks", ts);

        return taskObject;
    }

    public JSONObject getTasksByModelByUser(String modelId, int page, String userName) {
        Sort sort = new Sort(Sort.Direction.DESC, "runTime");
        Pageable pageable = PageRequest.of(page, 4, sort);
        //获取该用户所有关于task
        Page<Task> tasksOfUser = taskDao.findByComputableIdAndUserIdAndStatus(modelId, userName, 2, pageable);
        JSONArray taskArray = new JSONArray();
        List<Task> ts = tasksOfUser.getContent();
        long total = tasksOfUser.getTotalElements();
        for (Task task : ts) {

            String caculateUser = task.getUserId();
            String taskId = task.getTaskId();
            Date runTime = task.getRunTime();
            String permission = task.getPermission();
            String description = task.getDescription();

            JSONObject obj = new JSONObject();
            obj.put("userName", caculateUser);
            obj.put("taskId", taskId);
            obj.put("runTime", runTime);
            obj.put("description", description);
            obj.put("permission", permission);
            taskArray.add(obj);

        }

        JSONObject result = new JSONObject();
        result.put("content", taskArray);
        result.put("total", total);

        return result;
    }

    public JSONObject getPublishedTasksByModelId(String modelId, int page, String userName) {
        Sort sort = new Sort(Sort.Direction.DESC, "runTime");
        Pageable pageable = PageRequest.of(page, 4, sort);

        //获取published task
        Page<Task> tasks = taskDao.findByComputableIdAndPermissionAndStatusAndUserIdNot(modelId, "public", 2, userName, pageable);
        List<Task> ts = tasks.getContent();
        long total = tasks.getTotalElements();
        JSONArray taskArray = new JSONArray();
        for (Task task : ts) {

            String caculateUser = task.getUserId();
            String taskId = task.getTaskId();
            Date runTime = task.getRunTime();
            String permission = task.getPermission();
            String description = task.getDescription();

            JSONObject obj = new JSONObject();
            obj.put("userName", caculateUser);
            obj.put("taskId", taskId);
            obj.put("runTime", runTime);
            obj.put("description", description);
            obj.put("permission", permission);
            taskArray.add(obj);

        }

        JSONObject result = new JSONObject();

        result.put("content", taskArray);
        result.put("total", total);

        return result;
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
            boolean hasValue = false;
            JSONArray outputs = result.getJSONObject("data").getJSONArray("outputs");
            for (int i = 0; i < outputs.size(); i++) {
                if (!outputs.getJSONObject(i).getString("url").equals("")) {
                    hasValue = true;
                    break;
                }
            }
            if (!hasValue) {
                task.setStatus(-1);
            }
            for (int i = 0; i < outputs.size(); i++) {
                if (outputs.getJSONObject(i).getString("url").contains("[")) {//说明是单event多输出的情况
                    outputs.getJSONObject(i).put("multiple",true);
                }
            }

            task.setOutputs(result.getJSONObject("data").getJSONArray("outputs").toJavaList(TaskData.class));

            task = templateMatch(task);
        }
        save(task);


        if (task.getStatus() == 0) {
            out.put("status", 0);
        } else if (task.getStatus() == 1) {
            out.put("status", 1);
        } else if (task.getStatus() == 2) {
            out.put("status", 2);
            out.put("outputdata", task.getOutputs());
        } else {
            out.put("status", -1);
        }

        return out;
    }

    public List<JSONObject> getMutiTaskResult(JSONObject data) {
        List<JSONObject> taskResults = new ArrayList<>();
        AsyncTask asyncTask = new AsyncTask();
        List<Future> futures = new ArrayList<>();

        String[] tids = data.getObject("tid",String[].class);
        try {
            for (int i = 0; i < tids.length; i++) {
                if(tids!=null){
                    Task task = taskDao.findFirstByTaskId(tids[i]);
                    if (task.getStatus() != 2 && task.getStatus() != -1) {
                        JSONObject param = new JSONObject();
                        param.put("ip", task.getIp());
                        param.put("port", task.getPort());
                        param.put("tid", task.getTaskId());
                        param.put("integrate", task.getIntegrate());

                        futures.add(asyncTask.getRecordCallback(param, managerServerIpAndPort));
                    }
                }

            }

            for (Future<?> future : futures) {
                while (true) {//CPU高速轮询：每个future都并发轮循，判断完成状态然后获取结果，这一行，是本实现方案的精髓所在。即有10个future在高速轮询，完成一个future的获取结果，就关闭一个轮询
                    if (future.isDone() && !future.isCancelled()) {//获取future成功完成状态，如果想要限制每个任务的超时时间，取消本行的状态判断+future.get(1000*1, TimeUnit.MILLISECONDS)+catch超时异常使用即可。
                        String result = (String) future.get();//获取结果
                        JSONObject jsonResult = JSON.parseObject(result);
                        String tid = jsonResult.getString("tid");
                        int remoteStatus = jsonResult.getInteger("status");
                        ////update model status to Started, Started: 1, Finished: 2, Inited: 0, Error: -1
                        Task task = findByTaskId(tid);
                        int state = task.getStatus();
                        int remoteState = jsonResult.getInteger("status");

                        if (remoteState != state) {
                            task.setStatus(remoteState);
                        }
                        if (remoteState == 2) {
                            boolean hasValue = false;
                            JSONArray outputs = jsonResult.getJSONArray("outputs");
                            for (int i = 0; i < outputs.size(); i++) {
                                if (!outputs.getJSONObject(i).getString("url").equals("")) {
                                    hasValue = true;
                                    break;
                                }
                            }
                            if (!hasValue) {
                                task.setStatus(-1);
                            }
                            for (int i = 0; i < outputs.size(); i++) {
                                if (outputs.getJSONObject(i).getString("url").contains("[")) {//说明是单event多输出的情况
                                    outputs.getJSONObject(i).put("multiple", true);
                                }
                            }

                            task.setOutputs(outputs.toJavaList(TaskData.class));

                            task = templateMatch(task);
                        }
                        save(task);
                        JSONObject out = new JSONObject();

                        out.put("tid",tid );
                        if (task.getStatus() == 0) {
                            out.put("status", 0);
                        } else if (task.getStatus() == 1) {
                            out.put("status", 1);
                        } else if (task.getStatus() == 2) {
                            out.put("status", 2);
                            out.put("outputdata", task.getOutputs());
                        } else {
                            out.put("status", -1);
                        }
                        taskResults.add(out);
                        break;
                    } else {
                        Thread.sleep(1);//每次轮询休息1毫秒（CPU纳秒级），避免CPU高速轮循耗空CPU---》新手别忘记这个
                    }
                }
            }

        } catch (Exception e) {
            System.out.println(e);
        }

        return taskResults;
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
        String result = new String();
        if (task == null) {
            result = "0";
            return result;
        }

        task.setPermission("public");
        taskDao.save(task);
        result = task.getPermission();
        return result;
    }

    public String setPrivate(String taskId) {
        Task task = taskDao.findFirstByTaskId(taskId);
        String result = new String();
        if (task == null) {
            result = "0";
            return result;
        }

        task.setPermission("private");
        taskDao.save(task);
        result = task.getPermission();
        return result;
    }

}
