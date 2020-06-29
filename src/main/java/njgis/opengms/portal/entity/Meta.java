package njgis.opengms.portal.entity;

import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

/**
 * @Auther mingyuan
 * @Data 2020.06.23 10:50
 */
@Document
@Data
public class Meta {
    String workSpace;
    String description;
    String detail;
    List<String> tags;
    String dataPath;
}
