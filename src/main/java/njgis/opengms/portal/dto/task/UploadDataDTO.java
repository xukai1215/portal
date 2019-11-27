package njgis.opengms.portal.dto.task;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import njgis.opengms.portal.entity.support.ParamInfo;

import java.util.List;

/**
 * Created by wang ming on 2019/5/14.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UploadDataDTO {
    String filePath;
    String tag;
    String state;
    String event;
    List<ParamInfo> children;
}
