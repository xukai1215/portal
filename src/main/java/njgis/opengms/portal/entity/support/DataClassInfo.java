package njgis.opengms.portal.entity.support;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;

import java.util.List;

/**
 * @Auther mingyuan
 * @Data 2019.10.24 18:00
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class DataClassInfo {
    @Id
    String oid;
    String dcname;
    //多级菜单子节点
    List<DataClassInfo > children;
    List<String> datasoid;
}
