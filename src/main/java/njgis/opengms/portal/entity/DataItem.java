package njgis.opengms.portal.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import njgis.opengms.portal.entity.support.DataItemMeta;
import njgis.opengms.portal.entity.support.DataMeta;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

/**
 * @ClassName DataItem
 * @Description todo
 * @Author sun_liber
 * @Date 2019/2/13
 * @Version 1.0.0
 */
@Document
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DataItem extends Item{
//   @Id
//    String id;
//    String name;
    String type;
    String contentType;
    String userName;
    String reference;

    List<String> classifications;
    List<String> displays;
    List<String> relatedModels;
    List<DataMeta> dataList;
    List<String> contributers;

    DataItemMeta meta;

}
