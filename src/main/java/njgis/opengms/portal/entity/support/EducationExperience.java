package njgis.opengms.portal.entity.support;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EducationExperience {
    @Id
    String id;

    String oid;
    String academicDegree;
    String institution;
    String department;
    String startTime;
    String endTime;
    String eduLocation;
    String contributor;
    Date creatDate;

}
