package njgis.opengms.portal.entity.support;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * @Auther mingyuan
 * @Data 2019.12.30 22:14
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Edit {
    List<EditForm> eInfos;
    List<EditForm> eModels;
    List<EditForm> eData;
    List<EditForm> eApplications;
}
