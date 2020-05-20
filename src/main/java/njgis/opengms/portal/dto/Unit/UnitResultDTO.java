package njgis.opengms.portal.dto.Unit;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

/**
 * @ClassName UnitResultDTO
 * @Description todo
 * @Author ZHSH
 * @Date 2019/7/29
 * @Version 1.0.0
 * TODO
 */

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UnitResultDTO {
    String oid;
    String status;
    String name;
    String image;
    String description;
    String description_ZH;
    String author;

    Date createTime;

    int viewCount=0;
}
