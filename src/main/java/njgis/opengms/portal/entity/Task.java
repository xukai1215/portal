package njgis.opengms.portal.entity;

import lombok.Data;
import njgis.opengms.portal.entity.intergrate.Model;
import njgis.opengms.portal.entity.intergrate.ModelParam;
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
    String description;
    int port;
    int loadTime;

    Date runTime;

    int status;//Started: 1, Finished: 2, Inited: 0, Error: -1

//    List<String> isPublic;//public ;noPublic ;userNames; public和noPublic都放数组头
    String permission;
    List<TaskData> inputs;
    List<TaskData> outputs;

    //集成模型
    Boolean integrate;
    List<Model> models;
    String graphXml;
    List<ModelParam> modelParams;

}
