package njgis.opengms.portal.dto;

import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Document;

@Document
@Data

public class CommentDTO {

    String parentId;
    String content;
    String authorId;

    String relateItemId;
    int relateItemTypeNum;

}
