package njgis.opengms.portal.entity.support;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @Auther mingyuan
 * @Data 2020.05.05 21:56
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Check {
    int uncheckNum;
    int confirmNum;
    int rejectNum;
}
