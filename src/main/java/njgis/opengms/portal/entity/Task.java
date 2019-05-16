package njgis.opengms.portal.entity;

import lombok.Data;
import njgis.opengms.portal.entity.support.TaskData;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.List;

@Document
@Data
public class Task {
    @Id
    String id;
    String oid;
    String taskId;
    String computableId;
    String computableName;
    String userId;
    String ip;
    int port;

    Date runTime;

    int status;

    List<TaskData> inputs;
    List<TaskData> outputs;

}
