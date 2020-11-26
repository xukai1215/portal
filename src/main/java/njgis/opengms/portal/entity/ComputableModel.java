package njgis.opengms.portal.entity;

import lombok.Data;
import njgis.opengms.portal.entity.support.AuthorInfo;
import njgis.opengms.portal.entity.support.DailyViewCount;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
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
public class ComputableModel extends Item {

    String image;
    String relateModelItem;


    Boolean isAuthor;
    AuthorInfo realAuthor;
    String contentType;
    String url;
    String modelserUrl;

    String md5;
    Boolean deploy;
    /**
     * user oid
     */
    String author_oid;
    String author_name;

    List<String> classifications;
    List<String> resources;
    List<String> deployedService;
    List<String> containerId;

//    List<String> modelItems;

//    ComputableModelRelate relate;

    String mdl;
    String testDataPath;

    Object mdlJson;

    String runtime;

    int invokeCount = 0;
    int downloadCount;
    List<DailyViewCount> dailyInvokeCount = new ArrayList<>();


}
