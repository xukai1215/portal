package njgis.opengms.portal.dto.Spatial;

import lombok.Data;

@Data
public class SpatialFindDTO {
    private Integer page=1;
    private Integer pageSize;
    private Boolean asc = false;
    private String sortElement;
    private String searchText;
}
