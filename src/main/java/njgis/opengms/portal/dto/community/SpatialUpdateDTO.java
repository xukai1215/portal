package njgis.opengms.portal.dto.community;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @ClassName SpatialUpdateDTO
 * @Description todo
 * @Author ZHSH
 * @Date 2019/8/1
 * @Version 1.0.0
 * TODO
 */

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SpatialUpdateDTO extends SpatialAddDTO{
    String oid;
}
