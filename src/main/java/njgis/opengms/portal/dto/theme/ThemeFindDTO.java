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
    private Integer page = 1;
    private Integer pageSize = 10;
    private Boolean asc = false;

    //用作多条件查询
    private String searchText;
}
