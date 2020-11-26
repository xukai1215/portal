package njgis.opengms.portal.entity.intergrate;

import lombok.Data;

/**
 * @Author: wangming
 * @Date: 2019-11-15 19:44
 */
@Data
public class Model {

    private String name;

    private String md5;

    private String description;

    private OutputData outputData;

    private InputData inputData;

    private int status = 0; // 0代表未开始，-1代表运行失败，1代表运行成功, 2代表运行超时(不存在运行中状态，省略)

    private String taskIpAndPort;

}
