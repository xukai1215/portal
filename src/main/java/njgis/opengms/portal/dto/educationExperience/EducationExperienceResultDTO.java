package njgis.opengms.portal.dto.educationExperience;

import lombok.Data;

import java.util.Date;

@Data
public class EducationExperienceResultDTO {
    String oid;
    String academicDegree;
    String institution;
    String department;
    Date startTime;
    Date endTime;
    String eduLocation;
}
