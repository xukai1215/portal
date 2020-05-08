package njgis.opengms.portal.entity;

import lombok.Data;
import org.bson.types.Binary;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.List;

/**
 * @ClassName GeoIcon
 * @Description todo
 * @Author Kai
 * @Date 2020/5/6
 * @Version 1.0.0
 * TODO
 */

@Document
@Data
public class GeoIcon {

    String iconId;
    String iconParentId;
    String iconName;
    String iconTag;
    String iconXml;
    Date iconCreateTime;
    String userId;
    List<String> iconRelated;
    Binary iconImage;

}
