package njgis.opengms.portal.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


import njgis.opengms.portal.dto.comments.CommentInfo;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.List;


@Document
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Comments {

    @Id
    String id;

    String dataItemId;



    String comment;

    Integer thumbsUpNumber;




    List<CommentInfo> commentsForComment;


    Date commentDate;

    String author;

}
