package njgis.opengms.portal.entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;

import java.util.Date;
import java.util.List;


/**
 * @Author mingyuan
 * @Date 2020.08.18 17:06
 */
@Data
public class DistributedNode {
    @Id
    String ip;
    String oid;
    Boolean onlineStatus;
    List<String> dataItems;
    String userId;
    Date lastTime;//包括在线时间以及下线时间
    public DistributedNode(){
        onlineStatus = true;//设置onlineStatus的初始状态
    }
}
