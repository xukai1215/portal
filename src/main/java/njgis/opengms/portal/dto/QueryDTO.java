package njgis.opengms.portal.dto;

import lombok.Data;

/**
 * @ClassName DataItemFindDTO
 * @Description todo
 * @Author sun_liber
 * @Date 2019/2/13
 * @Version 1.0.0
 */
@Data
public class QueryDTO {
    private Integer page = 1;
    private Integer pageSize = 10;
    private int asc = 1;
    //用做多条件查询
    //private List<String> classifications;
    private String searchText;
}
