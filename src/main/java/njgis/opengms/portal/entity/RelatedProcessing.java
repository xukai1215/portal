package njgis.opengms.portal.entity;

import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * @Author mingyuan
 * @Date 2020.07.13 22:42
 */
@Data
@Document
public class RelatedProcessing {
    String proId;
    String proName;
    String proDescription;
    String token;
    String xml;
}
