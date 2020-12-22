package njgis.opengms.portal.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Document
@Data
@AllArgsConstructor
@NoArgsConstructor
public class DataNodeContent {
    @Id
    String id;

    String serverId;//来自servernode赋予的id
    String name;
    String token;//servernode的标识

    String userId;//userName字段
    String url;//如果是个data,下载请求之后自动保存下次直接使用
    String type;//什么类型的服务Data/Processing/Visualization
    int checked;//是否在更新节点的时候check过
    List<String> bindItems = new ArrayList<>();
}
