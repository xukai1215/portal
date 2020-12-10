package njgis.opengms.portal.entity.support;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document
public class GeoInfoMeta {

    String city;
    String countryCode;
    String latitude;
    String countryName;
    String region;
    String longitude;
}
