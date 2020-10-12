package njgis.opengms.portal.entity;

import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
public class ModelAction {
    private String frontId;
    private String modelOid;//对应model的id
    private String md5;//对应model的MD5
    private String name;//对应model的name
    private String order;
    private String description;
    private int iterationNum = 1;

    private List<Map<String,String>> outputEvents;

    private List<Map<String,String>> inputEvents;

    private Integer status = 0; // 0代表未开始，-1代表运行失败，1代表运行成功, 2代表运行超时(不存在运行中状态，省略)

    private String taskIpAndPort;

    private String taskId;

    private String taskIp;
}
