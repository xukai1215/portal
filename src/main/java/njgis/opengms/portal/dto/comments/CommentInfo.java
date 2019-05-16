package njgis.opengms.portal.dto.comments;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CommentInfo{
    String comment;
    String author;
    Date date;
}