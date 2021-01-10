package njgis.opengms.portal.dto.task;

import lombok.Data;

@Data
public class DataTasksFindDTO {
    Integer status;
    String searchText;

    Integer page;
    Integer pageSize;
    Boolean asc;
    String sortField;
}
