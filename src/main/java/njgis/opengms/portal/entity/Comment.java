package njgis.opengms.portal.entity;

import lombok.Data;
import njgis.opengms.portal.enums.ItemTypeEnum;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Document
@Data

public class Comment {

    String oid;
    String parentId;
    String content;
    String authorId;

    String relateItemId;
    ItemTypeEnum relateItemType;

    int thumbsUpNumber=0;
    Date date;

    List<String> subComments=new ArrayList<>();

}
