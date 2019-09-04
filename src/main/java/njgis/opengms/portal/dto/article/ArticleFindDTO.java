package njgis.opengms.portal.dto.article;

import lombok.Data;

//在分页查询时可以传递参数

@Data

public class ArticleFindDTO {
    private Integer page=1;
    private Integer pageSize;
    private Boolean asc = false;
    private String sortElement;
    private String searchText;

//    private String searchText;
//    public Integer getPage() {
////        return page;
////    }
////
////    public Integer getPageSize(){
////        return pageSize;
////    }


}
