
package njgis.opengms.portal.dto.awardandHonor;

import lombok.Data;

@Data
public class AwardandHonorFindDTO {
    private Integer page=1;
    private Integer pageSize;
    private Boolean asc = false;
    private String sortElement;
    private String searchText;
}