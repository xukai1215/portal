package njgis.opengms.portal.entity;

import lombok.Data;
import njgis.opengms.portal.entity.support.AuthorInfo;
import njgis.opengms.portal.entity.support.DailyViewCount;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Document
@Data
public class Item implements Serializable {

    private static final long serialVersionUID = 1L;

    //Basic Info

    @Id
    String id;
    String oid;
    String name;
    //String image;
    String description;
    String detail;
    String author;
    List<String> keywords;

//    @JsonFormat(pattern = "yyyy-MM-dd")//是否有用待测试
    Date createTime;
//    @JsonFormat(pattern = "yyyy-MM-dd")
    Date lastModifyTime;

    //public, discoverable or private
    String status;

    //authorship
    List<AuthorInfo> authorship;

    //version
    String lastModifier;
    List<String> contributors;
    List<String> versions;

    boolean lock = false;

    //statistic
    int shareCount = 0;
    int viewCount = 0;
    int thumbsUpCount = 0;

    List<DailyViewCount> dailyViewCount = new ArrayList<>();


}
