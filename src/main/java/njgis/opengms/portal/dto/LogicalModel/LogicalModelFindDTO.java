package njgis.opengms.portal.dto.LogicalModel;

import lombok.Data;

@Data
public class LogicalModelFindDTO {
    private Integer page=1;
    private Integer pageSize;
    private Boolean asc = false;
    private String sortElement;
    private String searchText;
}
