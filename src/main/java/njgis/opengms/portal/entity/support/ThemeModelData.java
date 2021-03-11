package njgis.opengms.portal.entity.support;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ThemeModelData {
    int id;
    String label;
    List<ThemeModelData> children;
    List<String> tableData;
}
