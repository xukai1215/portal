package njgis.opengms.portal.dto.educationExperience;

import lombok.Data;

@Data
public class EducationExperienceFindDTO {
    private Integer page=1;
    private Integer pageSize;
    private Boolean asc = false;
    private String sortElement;
    private String searchText;
}
