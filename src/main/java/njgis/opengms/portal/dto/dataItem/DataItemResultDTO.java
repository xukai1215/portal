package njgis.opengms.portal.dto.dataItem;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DataItemResultDTO {

    String id;
    String oid;
    String name;
    String status;

    String description;

    String author;
    String userName;

    List<String> keywords;

    Date createTime;

    int viewCount=0;

    String dataType;
    String tabType;

}
