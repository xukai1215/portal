package njgis.opengms.portal.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;
@Document
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Categorys {
    @Id
    String id;
    List<String> dataItem;
    String category;
    String parentCategory;

}
