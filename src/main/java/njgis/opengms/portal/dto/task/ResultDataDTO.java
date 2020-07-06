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
public class ResultDataDTO {
    String stateId;
    String state;
    String event;
    String url;
    String[] urls;
    String tag;
    String suffix;
    Boolean multiple = false;
    Boolean visual;
    List<ParamInfo> children;
}
