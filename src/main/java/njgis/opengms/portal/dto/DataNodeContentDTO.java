package njgis.opengms.portal.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import njgis.opengms.portal.entity.support.TestData;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DataNodeContentDTO {

    String serverId;
    String name;
    String token;
    List<String> dataSet;//分布式节点的数据信息
    //portal
    String userId;
    String type;
    String item;//需要绑定/解除绑定的门户条目
}
