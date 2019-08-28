package njgis.opengms.portal.entity.support;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;

import java.util.Date;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Project {
    @Id
    String id;
    String oid;

    String projectName;
    String startTime;
    String endTime;
    String contributor;
    String role;
    String fundAgency;
    int amount;
    int viewCount;
    Date creatDate;
}
