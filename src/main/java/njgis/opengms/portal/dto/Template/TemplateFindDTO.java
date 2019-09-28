package njgis.opengms.portal.dto.Template;

import lombok.Data;

@Data
public class TemplateFindDTO {
    private Integer page=1;
    private Integer pageSize;
    private Boolean asc = false;
    private String sortElement;
    private String searchText;
}
