package njgis.opengms.portal.entity.support;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * @ClassName ComputableModelRelate
 * @Description todo
 * @Author Kai
 * @Date 2019/3/1
 * @Version 1.0.0
 * TODO
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ComputableModelRelate {

    List<String> modelItems;
    String logicalModel;
}
