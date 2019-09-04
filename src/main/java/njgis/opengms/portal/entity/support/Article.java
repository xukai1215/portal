package njgis.opengms.portal.entity.support;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;

import java.util.Date;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Article {
    @Id
    String id;
    String oid;
    String title;
    List<String> authors;

    int viewCount;
    String contributor;
    String journal;
    int startPage;
    int endPage;
    String link;
    String date;
    Date creatDate;

}
