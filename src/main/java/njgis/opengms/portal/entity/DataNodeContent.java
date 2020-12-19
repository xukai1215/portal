package njgis.opengms.portal.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document
@Data
@AllArgsConstructor
@NoArgsConstructor
public class DataNodeContent {
    String id;
    String token;
    String userId;
    String url;//如果是个data,下载请求之后自动保存下次直接使用
    String type;
    List<String> bindItem;
}
