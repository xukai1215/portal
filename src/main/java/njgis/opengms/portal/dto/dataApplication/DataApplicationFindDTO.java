package njgis.opengms.portal.dto.dataApplication;

import lombok.Data;

import java.util.List;

@Data
public class DataApplicationFindDTO {
    Integer page;
    Integer pageSize;
    Boolean asc;
    String sortField = "viewCount";
    List<String> classifications;
    String categoryId;
    List<String> searchContent;
    String searchText;
    String tabType;

    String userId;

    String dataId;
    List<String> relatedModels;

    String sortElement;

    String method;

    String curQueryField;

    //用做多条件查询
    //private List<String> properties;

    // String dataType;
}
