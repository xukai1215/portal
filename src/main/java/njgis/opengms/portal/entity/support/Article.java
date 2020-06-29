package njgis.opengms.portal.entity.support;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document
public class Article {
    @Id
    String id;
    String oid;
    String title;
    List<String> authors;

    int viewCount;
//    String contributor;
    List<String> contributors = new ArrayList<>();
//    List<String> userAuthors = new ArrayList<>();
    String journal;
    String volume="";
    String pageRange="";
    String link;
    String date;
    String doi="";
    Date creatDate;

}
