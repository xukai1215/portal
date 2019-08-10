package njgis.opengms.portal.dto.conference;

import lombok.Data;

import java.util.Date;

@Data
public class ConferenceResultDTO {
    String oid;

    String title;
    String theme;
    String conferenceRole;
    String holdLocation;
    Date startTime;
    Date endTime;
    int viewCount;
}
