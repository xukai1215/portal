package njgis.opengms.portal.dto;

import lombok.Data;

import java.util.Map;

@Data
public class EditDraftDTO {
    String oid;
    Map<String,Object> content;
    String itemOid;
    String itemName;
    String itemType;
    String user;
    String editType;//标识是新建条目还是编辑create edit


}
