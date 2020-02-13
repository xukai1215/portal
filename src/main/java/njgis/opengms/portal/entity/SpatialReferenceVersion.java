package njgis.opengms.portal.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.List;

@Document
@Data
public class SpatialReferenceVersion {
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
    Date modifyTime;
    Date acceptTime;
    Date rejectTime;
    int loadCount;
    String creator;

    String type;
    String parentId;
    String xml;

    //版本相关
    String modifier;
    String originOid;//正式数据库对应条目的oid
    Long verNumber;//版本号
    int verStatus;//版本状态
}
