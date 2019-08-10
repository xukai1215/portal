package njgis.opengms.portal.dto.article;

import lombok.Data;

import java.util.List;

@Data
public class ArticleAddDTO {

    String title;
    List<String> authors;
    String journal;
    int startPage;
    int endPage;
    String date;
    String link;
}
