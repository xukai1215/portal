package njgis.opengms.portal.entity.support;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ModelMetadata {

    MetadataOverview overview ;
    MetadataUsage usage;
    MetadataDesign design ;
}
