package njgis.opengms.portal.dto.ConceptualModel;

import com.alibaba.fastjson.JSONArray;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import njgis.opengms.portal.entity.support.AuthorInfo;
import org.springframework.data.annotation.Id;

import java.util.Date;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ConceptualModelResultDTO {
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
    String relateModelItemName;

    Boolean isAuthor;
    AuthorInfo realAuthor;
    String contentType;

    List<String> classifications;
    List<String> keywords;
    //    List<String> contributors;
//    List<String> modelItems;
    List<String> image;
    List<AuthorInfo> authorship;

    JSONArray resourceJson;

    Date createTime;
    Date lastModifyTime;

    boolean lock;

    int shareCount=0;
    int viewCount=0;
    int thumbsUpCount=0;
}
