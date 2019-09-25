package njgis.opengms.portal.dto.Concept;

import lombok.Data;

@Data
public class ConceptFindDTO {
    private Integer page=1;
    private Integer pageSize;
    private Boolean asc = false;
    private String sortElement;
    private String searchText;
}
