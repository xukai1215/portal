package njgis.opengms.portal.dto.theme;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @Auther mingyuan
 * @Data 2019.10.23 21:37
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ThemeFindDTO {
    Integer page = 1;
    Integer pageSize = 10;
    Boolean asc = false;


    String creator_name;
    String oid;

    //用作多条件查询
    private String searchText;
}
