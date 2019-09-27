package njgis.opengms.portal.dto.modelItem;

import lombok.Data;

/**
 * @ClassName DataItemFindDTO
 * @Description todo
 * @Author sun_liber
 * @Date 2019/2/13
 * @Version 1.0.0
 */
@Data
public class ModelItemFindDTO {
    private Integer page = 1;
    private Integer pageSize = 10;
    private Boolean asc = false;
    //用做多条件查询
    //private List<String> classifications;
    private String searchText;
    private String sortElement;

}
