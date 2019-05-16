package njgis.opengms.portal.dto.categorys;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CategoryAddDTO {
    String id;
    List<String> cate;
}
