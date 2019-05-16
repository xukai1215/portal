package njgis.opengms.portal.thread;

import com.alibaba.fastjson.JSONObject;
import njgis.opengms.portal.dao.TaskDao;
import njgis.opengms.portal.entity.Task;
import njgis.opengms.portal.service.TaskService;
import njgis.opengms.portal.utils.Utils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class TaskStatusThread implements Runnable {

    @Autowired
    TaskService taskService;

    JSONObject data=new JSONObject();

    public void set(JSONObject object,String taskId){
        data.put("ip",object.getString("ip"));
        data.put("port",object.getInteger("port"));
        data.put("tid",taskId);
    }
//    public void setTaskId(String taskId){
//        this.taskId=taskId;
//    }
//    public void setIp(String ip){
//        this.ip=ip;
//    }
//    public void setPort(int port){
//        this.port=port;
//    }


    public void run(){


    }
}
