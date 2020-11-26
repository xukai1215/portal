package njgis.opengms.portal.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;

import java.util.Date;
import java.util.List;
import java.util.Map;


/**
 * wzh
 * 集成模型对象，与普通task不同
 */
@Data
public class IntegratedTask {
    @Id
    String id;

    String oid;
    String taskId;
    String taskName;
    String description;

    List<Map<String,String>> models;
    List<Map<String,String>> processingTools;
    List<ModelAction> modelActions;
    List<DataProcessing> dataProcessings;
    List<Map<String,String>> dataLinks;

    String xml;
    String mxGraph;

    String userId;
    Boolean integrate;

    int status;//Started: 1, Finished: 2, Inited: 0, Error: -1

    Date createTime;
    Date lastModifiedTime;

    Date lastRunTime;
}
