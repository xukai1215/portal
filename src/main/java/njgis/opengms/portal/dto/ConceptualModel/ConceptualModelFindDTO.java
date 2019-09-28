package njgis.opengms.portal.dto.ConceptualModel;


import lombok.Data;

@Data
public class ConceptualModelFindDTO {
    private Integer page=1;
    private Integer pageSize;
    private Boolean asc = false;
    private String sortElement;
    private String searchText;
}
