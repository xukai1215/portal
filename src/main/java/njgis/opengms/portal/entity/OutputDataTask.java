package njgis.opengms.portal.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OutputDataTask {
    String url;
    String tag;
    String suffix;
    Boolean multiple;
}
