package njgis.opengms.portal.entity;

import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document
@Data
public class Concept extends Item {

    List<String> classifications;
    String image;

    List<String> related;

    String alias;
    String parentId;
    String xml;
    String description_ZH;
    String description_EN;
    String name_ZH;
    String name_EN;

}
