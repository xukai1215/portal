package njgis.opengms.portal.entity;

import lombok.Data;
import njgis.opengms.portal.entity.support.Localization;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document
@Data
public class Concept extends Item {

    List<String> classifications;
    String image;

    List<Localization> localizationList;

    List<String> related;

//    String alias;
    String urn;
    String xml;
//    String description_ZH;
//    String description_EN;
//    String name_ZH;
//    String name_EN;
//      没有detail
    //更新时维护一下description
}
