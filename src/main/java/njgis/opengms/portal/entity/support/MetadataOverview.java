package njgis.opengms.portal.entity.support;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MetadataOverview {
    String name;
    String version;
    String modelType;
    List<String> modelDomain;
    String scale;
}
