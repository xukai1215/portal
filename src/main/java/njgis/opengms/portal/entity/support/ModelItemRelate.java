package njgis.opengms.portal.entity.support;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

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

    List<String> conceptualModels;
    List<String> logicalModels;
    List<String> computableModels;

    public ModelItemRelate(){
        conceptualModels=new ArrayList<>();
        logicalModels=new ArrayList<>();
        computableModels=new ArrayList<>();
    }

}
