package njgis.opengms.portal.bean.datacontainer;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * @ClassName AddDataResource
 * @Description todo
 * @Author sun_liber
 * @Date 2019/2/14
 * @Version 1.0.0
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Document
public class AddDataResource {
    String sourceStoreId;
    String author;
    String type;
    String dataItemId;
    String fileName;
    String suffix;
}
