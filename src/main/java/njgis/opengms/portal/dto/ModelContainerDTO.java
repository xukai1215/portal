package njgis.opengms.portal.dto;

import com.alibaba.fastjson.JSONArray;
import lombok.Data;
import njgis.opengms.portal.entity.support.GeoInfoMeta;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Data
@Document
public class ModelContainerDTO {
    String account;
    String mac;
    String servername;
    JSONArray servicelist;
    String ip;
    GeoInfoMeta geoInfo;
    Date registerDate;
}
