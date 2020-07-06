package njgis.opengms.portal.dto.ComputableModel;

import lombok.Data;

@Data
public class ComputableModelIngtegratedDTO {
  String relateModelItem;
  String name;
  String description;
  String md5;
  Object mdlJson;
}
