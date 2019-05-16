package njgis.opengms.portal.dto.dataItem;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DataitemClassificationsDTO {
    List<String> classifications;
}
