package njgis.opengms.portal.dto.Concept;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import njgis.opengms.portal.entity.support.Localization;

import java.util.List;

/**
 * @ClassName ConceptAddDTO
 * @Description todo
 * @Author ZHSH
 * @Date 2019/7/11
 * @Version 1.0.0
 * TODO
 */

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ConceptAddDTO {

    String status;
    String name;
    List<String> alias;
    String description;
    List<String> classifications;

    List<Localization> localizationList;

    String uploadImage;

    List<String> related;
}
