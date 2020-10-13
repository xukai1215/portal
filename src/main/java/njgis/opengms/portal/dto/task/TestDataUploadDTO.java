package njgis.opengms.portal.dto.task;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Created by wang ming on 2019/5/14.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TestDataUploadDTO {
    String dataItemId;
    String oid;
    String host;
    int port;
    int type;
    String userName;
}
