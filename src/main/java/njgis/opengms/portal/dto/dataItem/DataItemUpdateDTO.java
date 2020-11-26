package njgis.opengms.portal.dto.dataItem;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import njgis.opengms.portal.entity.support.DataItemMeta;

import java.util.List;

/**
 * @ClassName DataItemUpdateDTO
 * @Description todo
 * @Author sun_liber
 * @Date 2019/2/13
 * @Version 1.0.0
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class DataItemUpdateDTO extends DataItemAddDTO{
    String dataItemId;
    List<String> contributers;
}
