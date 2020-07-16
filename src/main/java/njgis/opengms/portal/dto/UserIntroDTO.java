package njgis.opengms.portal.dto;

import lombok.Data;

import java.util.List;

@Data
public class UserIntroDTO {
    String description;
    List<String> researchInterests;
    List<String> subjectAreas;
    List<String> externalLinks;
}
