package njgis.opengms.portal.entity.support;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Conference {
    String conferenceTitle;
    String theme;
    String conferenceRole;
    String holdLocation;
    Date startTime;
    Date endTime;
}
