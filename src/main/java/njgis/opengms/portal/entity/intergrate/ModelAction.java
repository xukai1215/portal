package njgis.opengms.portal.entity.intergrate;

import lombok.Data;
import njgis.opengms.portal.entity.intergrate.Action;

@Data
public class ModelAction extends Action {
    private String modelOid;//对应model的id
    private String md5;//对应model的MD5
    private String step;
    private String description;
    private int iterationNum = 1;




}
