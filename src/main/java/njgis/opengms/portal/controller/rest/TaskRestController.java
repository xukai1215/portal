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
import njgis.opengms.portal.entity.support.TaskData;
import njgis.opengms.portal.service.ComputableModelService;
import njgis.opengms.portal.service.TaskService;
import njgis.opengms.portal.utils.ResultUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Future;

@RestController
@RequestMapping(value = "/task")
public class TaskRestController {

    @Autowired
    TaskService taskService;

    @Autowired
    ComputableModelService computableModelService;

    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    ModelAndView getTask(@PathVariable("id") String id, HttpServletRequest request) {
        HttpSession session = request.getSession();
        if (session.getAttribute("uid") == null) {
            ModelAndView modelAndView = new ModelAndView();
            modelAndView.setViewName("login");
            return modelAndView;
        } else {
            ModelAndView modelAndView = new ModelAndView();
            modelAndView.setViewName("haha");
            return modelAndView;
        }

    }

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
        if(session.getAttribute("uid") == null){
            return ResultUtils.error(-1, "no login");
        }else{
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

    }

}
