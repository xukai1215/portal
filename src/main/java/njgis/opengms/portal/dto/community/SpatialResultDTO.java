package njgis.opengms.portal.dto.community;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

/**
 * @ClassName SpatialResultDTO
 * @Description todo
 * @Author ZHSH
 * @Date 2019/7/29
 * @Version 1.0.0
 * TODO
 */

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SpatialResultDTO {
    String oid;
    String name;
    String image;
    String description;
    String author;

    Date createTime;

    String wkname;
    String wkt;
    int viewCount=0;
}
