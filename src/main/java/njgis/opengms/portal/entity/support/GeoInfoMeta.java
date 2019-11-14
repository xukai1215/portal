package njgis.opengms.portal.entity.support;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GeoInfoMeta {

    String city;
    String countryCode;
    String latitude;
    String countryName;
    String region;
    String longitude;
}
