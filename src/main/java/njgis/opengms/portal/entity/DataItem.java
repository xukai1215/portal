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

    String contentType;
    String userName;
    String reference;
    String tabType;//标识四个tabs，包括hubs、repository、network与application

    List<String> classifications;
    List<String> displays;
    String image;
    List<String> relatedModels;
    List<DataMeta> dataList;
//    List<FileMetaUser> userDataList;//待删

    DataItemMeta meta;
    String token;
    String dataType;//标识Hub、Url、File、DistributedNode,目前新增了tabType，此字段可删除

    //Share in place
    String distributedNodeDataId;
    String type;
    Boolean authority;
    String workSpace;
    List<String> tags;
    String dataPath;
    String date;
    String dataUrl;
    String ip;

    List<RelatedProcessing> relatedProcessings;
    List<RelatedVisualization> relatedVisualizations;
}
