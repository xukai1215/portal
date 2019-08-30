package njgis.opengms.portal.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.List;

@Document
@Data
public class Concept {
    @Id
    String id;
    String oid;
    String name;
    List<String> classifications;
    String image;
    String description;
    String detail;
    Date createTime;
    Date lastModifyTime;
    List<String> related;
    String author;
    int loadCount;

    String alias;
    String parentId;
    String xml;
    String description_ZH;
    String description_EN;
    String name_ZH;
    String name_EN;

    //版本
    String lastModifier;
    List<String> contributors;
    List<String> versions;

    boolean lock;
}
