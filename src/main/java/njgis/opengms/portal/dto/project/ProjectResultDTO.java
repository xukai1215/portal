package njgis.opengms.portal.dto.project;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProjectResultDTO {
    String oid;

    String projectName;
    String startTime;
    String endTime;
    String role;
    String fundAgency;
    int amount;
    int viewCount;
    Date creatDate;
}
