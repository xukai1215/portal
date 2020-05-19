package njgis.opengms.portal.entity.support;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;

/**
 * @Auther mingyuan
 * @Data 2020.05.05 10:45
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Models {
    @Id
    String model_oid;
    String model_name;
}
