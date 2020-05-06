package njgis.opengms.portal.entity;

import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

/**
 * @ClassName IconRelation
 * @Description todo
 * @Author Kai
 * @Date 2020/5/6
 * @Version 1.0.0
 * TODO
 */

@Document
@Data
public class IconRelation {

    List<String> childrenId;
    int count;
    Boolean isLeaf;
    String name;
    String parentId;
    String nameEn;
    String geoId;

}
