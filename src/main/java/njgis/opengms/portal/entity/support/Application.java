package njgis.opengms.portal.entity.support;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;

/**
 * @Auther mingyuan
 * @Data 2019.10.24 18:01
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Application {
    @Id
    String oid;
    String applicationname;
    String applicationlink;
    String application_image;
    String upload_application_image;
}
