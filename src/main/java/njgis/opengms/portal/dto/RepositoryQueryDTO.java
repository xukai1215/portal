package njgis.opengms.portal.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RepositoryQueryDTO {
    String oid;
    int page;
    int pageSize=10;
    String sortType;
    int asc;
    String searchText;
    String sortField = "viewCount";

}
