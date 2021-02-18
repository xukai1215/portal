package njgis.opengms.portal.entity.support;

import com.alibaba.fastjson.JSONObject;
import com.sun.org.apache.xpath.internal.operations.Bool;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;

import java.util.Date;
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
    String reqUsrOid;//调用时需要的用户

    String contributor;//贡献者

    String token;//寻找节点
    String name;//服务名称

    List<String> dataIds;
    JSONObject metaDetail;

    //List<TestData> dataSet;//分布式节点的数据信息
    String method;//Conversion Processing Visualization

    String cacheUrl;//调用成功后可直接缓存供下次调用，此为用测试数据的结果 记录上次cache

//    Boolean isPortal = false;//门户新建的还是绑定的
    Date time;
    Boolean isPortal;//门户新建的还是绑定的
    String onlineStatus;// online offline

    public InvokeService(Boolean isPortal){
        this.isPortal = isPortal;
    }
}
