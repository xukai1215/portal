package njgis.opengms.portal.dto;

import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Document
@Data

public class CommentResultDTO {

    String oid;
    String parentId;
    String content;
    String authorId;
    String replyToUserId;

    int thumbsUpNumber=0;
    Date date;

    List<String> subComments=new ArrayList<>();

}
