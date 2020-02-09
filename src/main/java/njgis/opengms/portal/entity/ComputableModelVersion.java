package njgis.opengms.portal.entity;

import lombok.Data;
import njgis.opengms.portal.entity.support.AuthorInfo;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.List;

/**
 * @ClassName ComputableModel
 * @Description todo
 * @Author Kai
 * @Date 2019/3/1
 * @Version 1.0.0
 * TODO
 */

@Document
@Data

public class ComputableModelVersion {
    @Id
    String id;
    String oid;
    String name;
    String image;
    String relateModelItem;
    String description;
    String status;
    String detail;
    String creator;

    Boolean isAuthor;
    AuthorInfo realAuthor;
    String contentType;
    String url;
    String modelserUrl;

    String md5;
    Boolean deploy;

    List<String> classifications;
    List<String> keywords;
//    List<String> contributors;
    List<String> resources;
    List<String> deployedService;
    List<String> containerId;
    List<AuthorInfo> authorship;

//    ComputableModelRelate relate;

    Date modifyTime;

    String mdl;
    String testDataPath;

    Object mdlJson;

    //版本相关
    String modifier;
    String originOid;//正式数据库对应条目的oid
    Long verNumber;//版本号
    int verStatus;//版本状态
}
