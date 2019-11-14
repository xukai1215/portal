package njgis.opengms.portal.entity;

import lombok.Data;
import njgis.opengms.portal.entity.support.GeoInfoMeta;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document
@Data
public class ModelContainer {
    @Id
    String id;
    String oid;
    String name;
    String ip;
    GeoInfoMeta geoInfo;
    String owner;

}
