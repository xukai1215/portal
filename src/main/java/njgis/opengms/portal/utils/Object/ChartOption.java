package njgis.opengms.portal.utils.Object;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChartOption {

    String[] types;
    int[][] data;
    String[] valXis;
    String title;
    String subTitle;
    String titlePosition="center";//center left

}
