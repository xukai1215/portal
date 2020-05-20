package njgis.opengms.portal.dto.article;

import lombok.Data;

import java.util.List;

@Data
public class ArticleAddDTO {

    String oid;
    String title;
    List<String> authors;
    String journal;
    String pageRange;
    String date;
    String link;
    String DOI;
//    String status;
}
