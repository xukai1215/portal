package njgis.opengms.portal.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

/**
 * @ClassName Classification
 * @Description todo
 * @Author Kai
 * @Date 2019/2/21
 * @Version 1.0.0
 * TODO
 */
@Document
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TemplateClassification {

    String oid;
    List<String> childrenId;
    String nameCn;
    String nameEn;
    String parentId;

}
