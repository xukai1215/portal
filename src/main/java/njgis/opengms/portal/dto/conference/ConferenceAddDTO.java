package njgis.opengms.portal.dto.conference;

import lombok.Data;

@Data
public class ConferenceAddDTO {
    String oid;
    String title;
    String theme;
    String conferenceRole;
    String location;
    String startTime;
    String endTime;
}
