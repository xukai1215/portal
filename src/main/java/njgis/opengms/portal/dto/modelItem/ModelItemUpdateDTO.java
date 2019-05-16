package njgis.opengms.portal.dto.modelItem;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import njgis.opengms.portal.entity.support.Reference;

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
public class ModelItemUpdateDTO extends ModelItemAddDTO {

    String oid;

}
