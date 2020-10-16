package njgis.opengms.portal.dto.task;

import lombok.Data;
import njgis.opengms.portal.entity.ModelAction;

import java.util.List;
import java.util.Map;

@Data
public class IntegratedTaskAddDto {

    String taskOid;
    String taskId;
    String taskName;
    String description;

    List<Map<String,String>> models;

    List<ModelAction> modelActions;

    String xml;
    String mxgraph;

}

