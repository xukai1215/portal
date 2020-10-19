package njgis.opengms.portal.dto.Spatial;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import njgis.opengms.portal.entity.support.Localization;

import java.util.List;

/**
 * @ClassName SpatialAddDTO
 * @Description todo
 * @Author ZHSH
 * @Date 2019/7/29
 * @Version 1.0.0
 * TODO
 */

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SpatialAddDTO {

    String status;
    String name;
    List<String> alias;
    String description;
    List<String> classifications;

    String uploadImage;
    List<Localization> localizationList;

    String wkname;
    String wkt;
}
