package njgis.opengms.portal.dto.awardandHonor;

import lombok.Data;

import java.util.Date;

@Data
public class AwardandHonorResultDTO {
    String oid;
    String name;
    String awardTime;
    //    String type;
    String awardAgency;
    Date creatDate;
}
