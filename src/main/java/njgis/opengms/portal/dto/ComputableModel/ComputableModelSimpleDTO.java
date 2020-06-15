package njgis.opengms.portal.dto.ComputableModel;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import njgis.opengms.portal.entity.support.DailyViewCount;

import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ComputableModelSimpleDTO {

    String oid;
    String name;
    List<DailyViewCount> dailyViewCount = new ArrayList<>();
}
