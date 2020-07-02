package njgis.opengms.portal.dto;

import lombok.Data;
import njgis.opengms.portal.entity.support.AuthorInfo;

@Data
public class ClaimAuthorDTO extends AuthorInfo {
    String oid;
}
