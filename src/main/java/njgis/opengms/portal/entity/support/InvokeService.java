package njgis.opengms.portal.entity.support;

import com.sun.org.apache.xpath.internal.operations.Bool;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;

import java.util.List;


/**
 * @Author mingyuan
 * @Date 2020.12.15 20:21
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class InvokeService {
    String serviceId;//pcsId
    String reqUsrOid;

    String token;//寻找节点
    String name;//服务名称

    String dataId;
    String params;//例如南京市,北京市

    List<TestData> dataSet;//分布式节点的数据信息
    String method;//converse process visual

    String cacheUrl;//调用成功后可直接缓存供下次调用，此为用测试数据的结果

    Boolean isPortal;//门户新建的还是绑定的
}
