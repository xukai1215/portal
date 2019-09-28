package njgis.opengms.portal.dto.Unit;

import lombok.Data;

@Data
public class UnitFindDTO {
    private Integer page=1;
    private Integer pageSize;
    private Boolean asc = false;
    private String sortElement;
    private String searchText;
}
