package njgis.opengms.portal.entity;

import com.alibaba.fastjson.JSONObject;
import lombok.Data;
import njgis.opengms.portal.entity.support.TaskData;

import java.util.Date;
import java.util.List;

/**
 * @Author mingyuan
 * @Date 2020.01.06 14:12
 */
@Data
public class DataServerTask extends Task{
    String serviceId;
    String serviceName;
    Date finishTime;//与runTime配合，一个开始一个结束

    String dataType;//标识localData与onlineData
    JSONObject input;
    JSONObject output;
    //如果是可视化的服务，生成的可视化结果需要存储起来
    JSONObject visual;//可视化结果路径
}
