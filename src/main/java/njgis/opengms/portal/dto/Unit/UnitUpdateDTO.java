package njgis.opengms.portal.dto.Unit;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @ClassName UnitUpdateDTO
 * @Description todo
 * @Author ZHSH
 * @Date 2019/8/1
 * @Version 1.0.0
 * TODO
 */

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UnitUpdateDTO extends UnitAddDTO{
    String oid;
}
