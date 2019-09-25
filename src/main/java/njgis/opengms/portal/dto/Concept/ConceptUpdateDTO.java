package njgis.opengms.portal.dto.Concept;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @ClassName ConceptUpdateDTO
 * @Description todo
 * @Author ZHSH
 * @Date 2019/8/1
 * @Version 1.0.0
 * TODO
 */

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ConceptUpdateDTO extends ConceptAddDTO {
    String oid;
}
