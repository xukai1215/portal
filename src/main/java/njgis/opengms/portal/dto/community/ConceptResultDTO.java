package njgis.opengms.portal.dto.community;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

/**
 * @ClassName ConceptResultDTO
 * @Description todo
 * @Author ZHSH
 * @Date 2019/7/17
 * @Version 1.0.0
 * TODO
 */

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ConceptResultDTO {
    String oid;
    String name;
    String image;
    String description;
    String author;

    Date createTime;

    int viewCount=0;
}
