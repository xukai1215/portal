package njgis.opengms.portal.entity;

import lombok.Data;
import njgis.opengms.portal.entity.support.GeoInfoMeta;
import njgis.opengms.portal.entity.support.Hardware;
import njgis.opengms.portal.entity.support.Software;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.List;

@Document
@Data
public class ModelContainer {
    @Id
    String id;
    String user;
    String mac;
    List<Software> software;
    Hardware hardware;
    String ip;
    GeoInfoMeta geoInfo;
    Date date;
    Date updateDate;
    boolean status;
    String t_id;
}
