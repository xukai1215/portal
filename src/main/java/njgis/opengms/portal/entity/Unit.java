package njgis.opengms.portal.entity;

import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document
@Data
public class Unit extends Item {

    List<String> classifications;

    String image;

//    String alias;
    String type;
    String parentId;
    String xml;
//    String name_EN;
//    String name_ZH;
//    String description_EN;
//    String description_ZH;

}
