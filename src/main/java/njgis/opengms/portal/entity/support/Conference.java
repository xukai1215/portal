package njgis.opengms.portal.entity.support;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;

import java.util.Date;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Conference {

    @Id
    String id;
    String oid;

    String title;
    String theme;
    String conferenceRole;
    String holdLocation;
    String contributor;
    Date startTime;
    Date endTime;
    int viewCount;
}
