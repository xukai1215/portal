package njgis.opengms.portal.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.List;

@Document
@Data
public class ConceptVersion extends Version {
    @Id
    String id;
    String oid;
    String name;
    List<String> classifications;
    String image;
    String description;
    String detail;
    Date modifyTime;
    Date acceptTime;
    Date rejectTime;
    List<String> related;
    int loadCount;
    String creator;
    int readStatus;

    String alias;
    String parentId;
    String xml;
    String description_ZH;
    String description_EN;
    String name_ZH;
    String name_EN;

    //版本相关
    String modifier;
    String originOid;//正式数据库对应条目的oid
    Long verNumber;//版本号
    int verStatus;//版本状态
}
