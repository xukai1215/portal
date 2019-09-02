package njgis.opengms.portal.dto.project;

import lombok.Data;

@Data
public class ProjectFindDTO {
    private Integer page=1;
    private Integer pageSize;
    private Boolean asc = false;
    private String sortElement;
    private String searchText;
}
