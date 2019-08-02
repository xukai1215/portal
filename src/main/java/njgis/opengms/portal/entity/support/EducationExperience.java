package njgis.opengms.portal.entity.support;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class EducationExperience {
    String academicDegree;
    String institution;
    String department;
    Date startTime;
    Date endTime;
    String eduLocation;

}
