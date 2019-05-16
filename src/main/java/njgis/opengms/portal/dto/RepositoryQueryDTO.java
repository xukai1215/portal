package njgis.opengms.portal.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RepositoryQueryDTO {
    String oid;
    int page;
    String sortType;
    int asc;
    String searchText;

}
