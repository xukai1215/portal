package njgis.opengms.portal.entity.support;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;

/**
 * @Auther mingyuan
 * @Data 2020.05.05 15:53
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Modifier {
    @Id
    String oid;
    String userName;
    String name;
}
