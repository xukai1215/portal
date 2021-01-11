package njgis.opengms.portal.entity;

import com.alibaba.fastjson.JSONArray;
import lombok.Data;
import njgis.opengms.portal.entity.support.AuthorInfo;
import njgis.opengms.portal.entity.support.DailyViewCount;
import njgis.opengms.portal.entity.support.InvokeService;
import njgis.opengms.portal.entity.support.TestData;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * @Author mingyuan
 * @Date 2020.07.30 15:07
 */
@Data
@Document
public class DataApplication {
    @Id
    String id;
    String oid;
    String name;
    List<String> keywords;
    //String image;
    String description;
    String detail;
    String author;

    Date createTime;
    Date lastModifyTime;

    //application classification
    List<String> classifications;

    //Public, Discoverable or Private
    String status;

    String type;//process  visual

    //authorship
    List<AuthorInfo> authorship;

    List<String> resources;
    List<String> versions;

    String contentType;
    String url;//Third-party Web-Service Link
//    String md5;
    Boolean isAuthor;
    String applicationType;//区分process与visual

    JSONArray resourceJson;
    List<String> categorys;

    boolean lock = false;
    String image;
    List<String> contributors;
    String lastModifier;

    List<InvokeService> invokeServices;
    boolean invokable;//是否绑定了invokeService

    String method; // Conversion Processing Visualization

    List<TestData> testData;//存储testData的id
    String testDataPath;
    String packagePathContainer;
    String packagePath;//存储部署包的路径

    //statistic
    int shareCount = 0;
    int viewCount = 0;
    int thumbsUpCount = 0;

    List<DailyViewCount> dailyViewCount = new ArrayList<>();
}
