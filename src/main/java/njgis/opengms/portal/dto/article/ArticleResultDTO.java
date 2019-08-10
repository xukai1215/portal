package njgis.opengms.portal.dto.article;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ArticleResultDTO {
    String oid;
    String title;
    List<String> authors;

    String contributor;
    String journal;
    int startPage;
    int endPage;
    String date;
    int viewCount;


}