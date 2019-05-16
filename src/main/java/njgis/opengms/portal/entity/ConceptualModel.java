package njgis.opengms.portal.entity;

import lombok.Data;
import njgis.opengms.portal.entity.support.AuthorInfo;
import njgis.opengms.portal.entity.support.ModelItemRelate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.List;

/**
 * @ClassName ConceptualModel
 * @Description todo
 * @Author Kai
 * @Date 2019/3/1
 * @Version 1.0.0
 * TODO
 */

@Document
@Data
public class ConceptualModel {

    @Id
    String id;
    String oid;
    String name;
//    String image;
    String relateModelItem;
    String description;
    String cXml;
    String svg;
    String author;
    String detail;
//    String status;

    Boolean isAuthor;
    AuthorInfo realAuthor;
    String contentType;

    List<String> classifications;
    List<String> keywords;
//    List<String> contributors;
//    List<String> modelItems;
    List<String> image;
    List<AuthorInfo> authorship;

    Date createTime;
    Date lastModifyTime;

    int shareCount=0;
    int viewCount=0;
    int thumbsUpCount=0;
}
