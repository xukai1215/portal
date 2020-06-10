package njgis.opengms.portal.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.List;

@Document
@Data
public class TemplateVersion {
    @Id
    String id;
    String oid;
    String name;
    List<String> classifications;
    String description;
    String detail;
    String image;
    Date modifyTime;
    Date acceptTime;
    Date rejectTime;
    String creator;
    int readStatus;

    int loadCount;

    String xml;
    String type;
    String parentId;

    //版本相关
    String modifier;
    String originOid;//正式数据库对应条目的oid
    Long verNumber;//版本号
    int verStatus;//版本状态
}
