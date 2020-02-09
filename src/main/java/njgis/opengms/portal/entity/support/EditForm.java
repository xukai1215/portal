package njgis.opengms.portal.entity.support;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

/**
 * @Auther mingyuan
 * @Data 2019.12.30 22:18
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class EditForm {
    String uid;
    Date time;
}
