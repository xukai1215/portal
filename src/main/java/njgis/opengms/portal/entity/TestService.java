package njgis.opengms.portal.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * @Author mingyuan
 * @Date 2020.01.24 17:25
 */
@Document
@Data
public class TestService {
    @Id
    String id;
    Object content;
}
