package njgis.opengms.portal.dto.dataItem;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import njgis.opengms.portal.entity.Meta;


/**
 * @Auther mingyuan
 * @Data 2020.06.23 10:48
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class DistributedDataItemDTO {
    String id;
    String oid;
    String name;
    String  date;
    String size;
    String type;
    Boolean authority;
    Meta meta;
}
