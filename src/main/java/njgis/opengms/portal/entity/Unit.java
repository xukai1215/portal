package njgis.opengms.portal.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.List;

@Document
@Data
public class Unit {
    @Id
    String id;
    String oid;
    String name;
    List<String> classifications;
    String description;
    String detail;
    String author;
    String image;
    Date createTime;
    Date lastModifyTime;
    int loadCount;

    String alias;
    String type;
    String parentId;
    String xml;
    String description_ZH;
    String description_EN;
}
