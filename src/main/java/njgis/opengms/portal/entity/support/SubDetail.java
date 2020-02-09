package njgis.opengms.portal.entity.support;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

/**
 * @Auther mingyuan
 * @Data 2020.01.02 15:41
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class SubDetail {
    String uid;
    String detail;
    Date time;
    String status;
}
