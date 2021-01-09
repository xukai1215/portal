package njgis.opengms.portal.entity;

import com.alibaba.fastjson.JSONArray;
import lombok.Data;
import njgis.opengms.portal.entity.support.GeoInfoMeta;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document
@Data
public class ModelContainer {
    @Id
    String id;
    String account;
    String mac;
    String serverName;
    String alias;
    JSONArray serviceList;
//    List<Software> software;
//    Hardware hardware;
    String ip;
    GeoInfoMeta geoInfo;
    Date registerDate;
    Date updateDate;
//    Date updateDate;
//    boolean status;
//    String t_id;
}
