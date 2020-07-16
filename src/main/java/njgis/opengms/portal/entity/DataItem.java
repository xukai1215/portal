package njgis.opengms.portal.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import njgis.opengms.portal.entity.support.DataItemMeta;
import njgis.opengms.portal.entity.support.DataMeta;
import njgis.opengms.portal.entity.support.FileMeta;
import njgis.opengms.portal.entity.support.FileMetaUser;
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

    String contentType;
    String userName;
    String reference;

    List<String> classifications;
    List<String> displays;
    List<String> relatedModels;
    List<DataMeta> dataList;
    List<FileMetaUser> userDataList;
//    List<String> contributers;

    DataItemMeta meta;
    String token;
    String dataType;//标识Url、File、DistributedNode

    //Share in place
    String distributedNodeDataId;
//    String size;
    String type;
    Boolean authority;
    String workSpace;
    List<String> tags;
    String dataPath;
    String date;
    String dataUrl;

    List<RelatedProcessing> relatedProcessings;
    List<RelatedVisualization> relatedVisualizations;
}
