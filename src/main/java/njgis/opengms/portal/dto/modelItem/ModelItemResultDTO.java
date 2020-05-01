package njgis.opengms.portal.dto.modelItem;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

/**
 * @ClassName ModelItemAddDTO
 * @Description todo
 * @Author Kai
 * @Date 2019/2/21
 * @Version 1.0.0
 * TODO
 */

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ModelItemResultDTO{

    String oid;
    String name;
    String image;
    String description;
    String author;
    String author_oid;
    String author_name;
    String status;

    List<String> keywords;

    Date createTime;

    int viewCount=0;
}
