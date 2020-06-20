package njgis.opengms.portal.entity.support;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @Auther mingyuan
 * @Data 2020.06.20 15:00
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class FileMetaUser {
    String id;
    String label;
    String suffix;
    String url;
}
