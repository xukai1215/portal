package njgis.opengms.portal.entity.support;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

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
@NoArgsConstructor
public class ModelItemRelate {

    List<String> modelItems = new ArrayList<>();
    List<String> conceptualModels = new ArrayList<>();
    List<String> logicalModels = new ArrayList<>();
    List<String> computableModels = new ArrayList<>();
    List<String> dataItems = new ArrayList<>();

    List<String> concepts = new ArrayList<>();
    List<String> spatialReferences = new ArrayList<>();
    List<String> templates = new ArrayList<>();
    List<String> units = new ArrayList<>();

    List<Map<String,String>> localFiles = new ArrayList<Map<String,String>>();
    List<Map<String,String>> dataSpaceFiles = new ArrayList<Map<String,String>>();
    List<Map<String,String>> exLinks = new ArrayList<Map<String,String>>();

}
