package njgis.opengms.portal.entity.support;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;

import java.util.List;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Lab {
    @Id
    String id;
    String oid;

    String labName;
    String leaderName;
    List<String> members;
}
