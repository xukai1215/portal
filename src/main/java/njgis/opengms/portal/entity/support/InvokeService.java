package njgis.opengms.portal.entity.support;

import com.sun.org.apache.xpath.internal.operations.Bool;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

/**
 * @Author mingyuan
 * @Date 2020.12.15 20:21
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class InvokeService {
    String serviceId;//门户部署id以及分布式节点绑定id
    String token;//寻找节点
    List<TestData> dataSet;//分布式节点的数据信息
    String name;//服务名称
    String method;//converse process visual
    Boolean isPortal;//门户新建的还是绑定的
}
