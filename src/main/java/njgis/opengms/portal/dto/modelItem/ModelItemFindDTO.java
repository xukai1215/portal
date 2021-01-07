package njgis.opengms.portal.dto.modelItem;

import lombok.Data;

import java.io.Serializable;

/**
 * @ClassName DataItemFindDTO
 * @Description todo
 * @Author sun_liber
 * @Date 2019/2/13
 * @Version 1.0.0
 */
@Data
public class ModelItemFindDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    private Integer page = 1;
    private Integer pageSize = 10;
    private Boolean asc = false;
    private String sortField = "viewCount";
    private String queryField = "Name";
    //用做多条件查询
    //private List<String> classifications;
    private String searchText;
    private String sortElement;

}
