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

public class ComputableModel {
    @Id
    String id;
    String oid;
    String name;
    String image;
    String relateModelItem;
    String description;
    String author;
    String status;
    String detail;

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

    Date createTime;
    Date lastModifyTime;

    int shareCount=0;
    int viewCount=0;
    int thumbsUpCount=0;

    String mdl;
    String testDataPath;

    Object mdlJson;
}
