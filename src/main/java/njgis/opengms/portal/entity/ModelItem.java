package njgis.opengms.portal.entity;

import lombok.Data;
import njgis.opengms.portal.entity.support.AuthorInfo;
import njgis.opengms.portal.entity.support.ModelItemRelate;
import njgis.opengms.portal.entity.support.Reference;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.List;

@Document
@Data
public class ModelItem {

    @Id
    String id;
    String oid;
    String name;
    String image;
    String description;
    String detail;
    String author;
    String status;
    String knowledgeGraph;

    List<String> classifications;
    List<String> keywords;
    List<Reference> references;
    List<String> contributors;
    List<AuthorInfo> authorship;
    List<String> relatedData;

    ModelItemRelate relate;

    Date createTime;
    Date lastModifyTime;

    int shareCount=0;
    int viewCount=0;
    int thumbsUpCount=0;


}
