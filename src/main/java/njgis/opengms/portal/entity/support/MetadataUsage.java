package njgis.opengms.portal.entity.support;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MetadataUsage {
    String information;
    String initialization;
    String hardware;
    String software;
    List<String> inputs;
    List<String> outputs;
}
