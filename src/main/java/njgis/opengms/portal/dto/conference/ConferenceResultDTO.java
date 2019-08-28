package njgis.opengms.portal.dto.conference;

import lombok.Data;

import java.util.Date;

@Data
public class ConferenceResultDTO {
    String oid;

    String title;
    String theme;
    String conferenceRole;
    String location;
    String startTime;
    String endTime;
    int viewCount;
    Date creatDate;
}
