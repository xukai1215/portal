package njgis.opengms.portal.entity.support;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document
public class Conference {

    @Id
    String id;
    String oid;

    String title;
    String theme;
    String conferenceRole;
    String location;
    String contributor;
    String startTime;
    String endTime;
    Date creatDate;
    int viewCount;
}
