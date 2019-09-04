package njgis.opengms.portal.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.List;

@Document
@Data
public class SpatialReference {
    @Id
    String id;
    String oid;
    String name;
    String wkname;
    String wkt;
    List<String> classifications;
    String image;
    String description;
    String detail;
    Date createTime;
    Date lastModifyTime;
    String author;
    int loadCount;

    String type;
    String parentId;
    String xml;
    String name_EN;
    String description_EN;

    //版本
    String lastModifier;
    List<String> contributors;
    List<String> versions;

    boolean lock;
}
