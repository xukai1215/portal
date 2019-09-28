package njgis.opengms.portal.dto.educationExperience;

import lombok.Data;

import java.util.Date;

@Data
public class EducationExperienceAddDTO {
    String academicDegree;
    String institution;
    String department;
    Date startTime;
    Date endTime;
    String eduLocation;
}
