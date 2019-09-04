package njgis.opengms.portal.dto.project;

import lombok.Data;

@Data
public class ProjectAddDTO {
    String oid;
    String projectName;
    String startTime;
    String endTime;
    String role;
    String fundAgency;
    int amount;
}
