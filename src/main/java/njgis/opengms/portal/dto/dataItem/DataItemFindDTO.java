package njgis.opengms.portal.dto.dataItem;

import lombok.Data;

import java.util.List;

/**
 * @ClassName DataItemFindDTO
 * @Description todo
 * @Author sun_liber
 * @Date 2019/2/13
 * @Version 1.0.0
 */
@Data
public class DataItemFindDTO {
    Integer page = 1;
    Integer pageSize = 10;
    Boolean asc = false;
    List<String> classifications;
    String categoryId;
    List<String> searchContent;
    String searchText;

    String userId;

    String dataId;
    List<String> relatedModels;

    String sortElement;

    //用做多条件查询
    //private List<String> properties;

    String dataType;

}
