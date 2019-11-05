package njgis.opengms.portal.entity;

import lombok.Data;
import njgis.opengms.portal.entity.support.AuthorInfo;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

/**
 * @ClassName ConceptualModel
 * @Description todo
 * @Author Kai
 * @Date 2019/3/1
 * @Version 1.0.0
 * TODO
 */

@Document
@Data
public class ConceptualModel extends Item {

    String relateModelItem;
    String cXml;
    String svg;

    Boolean isAuthor;
    AuthorInfo realAuthor;
    String contentType;

    List<String> classifications;
//    List<String> modelItems
    List<String> image;

}
