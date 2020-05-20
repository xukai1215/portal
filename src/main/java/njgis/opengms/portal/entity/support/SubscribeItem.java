package njgis.opengms.portal.entity.support;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import njgis.opengms.portal.enums.ItemTypeEnum;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SubscribeItem {
    ItemTypeEnum type;
    String oid;
}
