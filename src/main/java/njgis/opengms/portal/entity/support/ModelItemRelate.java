package njgis.opengms.portal.entity.support;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

/**
 * @ClassName ModelItemRelate
 * @Description todo
 * @Author Kai
 * @Date 2019/2/21
 * @Version 1.0.0
 * TODO ModelItem 关联信息
 */

@Data
@AllArgsConstructor
public class ModelItemRelate {

    List<String> modelItems;
    List<String> conceptualModels;
    List<String> logicalModels;
    List<String> computableModels;

    List<String> concepts;
    List<String> spatialReferences;
    List<String> templates;
    List<String> units;

    public ModelItemRelate(){
        conceptualModels=new ArrayList<>();
        logicalModels=new ArrayList<>();
        computableModels=new ArrayList<>();
    }

}
