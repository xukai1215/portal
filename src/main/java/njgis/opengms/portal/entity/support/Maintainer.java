package njgis.opengms.portal.entity.support;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;

/**
 * @Auther mingyuan
 * @Data 2019.12.10 11:37
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Maintainer {
    @Id
    String oid;
    String name;
    String id;
    String image;
}
