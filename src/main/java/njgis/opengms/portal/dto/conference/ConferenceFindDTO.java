package njgis.opengms.portal.dto.conference;

import lombok.Data;

@Data
public class ConferenceFindDTO {
    private Integer page=1;
    private Integer pageSize=10;
    private Boolean asc = false;
}
