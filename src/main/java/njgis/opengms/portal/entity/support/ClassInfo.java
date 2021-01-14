package njgis.opengms.portal.entity.support;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;

import java.util.List;

/**
 * @Auther mingyuan
 * @Data 2019.10.23 17:05
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ClassInfo {
    @Id
    String oid;
    String mcname;
    //多级菜单子节点
    List<ClassInfo> children;
    List<String> modelsoid;
}
