package njgis.opengms.portal.entity;

import lombok.Data;
import njgis.opengms.portal.enums.ItemTypeEnum;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document
@Data
public class ViewRecord {

    @Id
    String id;

    ItemTypeEnum itemType;
    String itemOid;
    Date date;
    String userOid;


}
