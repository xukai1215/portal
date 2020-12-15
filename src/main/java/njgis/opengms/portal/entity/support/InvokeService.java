package njgis.opengms.portal.entity.support;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @Author mingyuan
 * @Date 2020.12.15 20:21
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class InvokeService {
    String name;
    String oid;
    String method;//converse process visual
}
