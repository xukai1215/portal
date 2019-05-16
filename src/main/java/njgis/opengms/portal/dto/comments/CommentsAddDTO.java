package njgis.opengms.portal.dto.comments;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import njgis.opengms.portal.entity.Comments;


import java.util.Date;
import java.util.List;

/**
 * @ClassName CommentsAddDTO
 * @Description todo
 * @Author lan
 * @Date 2019/3/15
 * @Version 1.0.0
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CommentsAddDTO {







    String id;
    String commentid;
    String comment;

    CommentInfo commentsForComment;


    Comments myComment;


    Integer thumbsUpNumber;

    Date commentDate;

    String author;
}
