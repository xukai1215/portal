package njgis.opengms.portal.dto;

import lombok.Data;

import java.util.Date;

@Data
public class EducationExperienceDTO {
    String academicDegree;
    String institution;
    String department;
    Date startTime;
    Date endTime;
    String eduLocation;
}
