package njgis.opengms.portal.dto.awardandHonor;

import lombok.Data;

import java.util.Date;

@Data
public class AwardandHonorAddDTO {
    String name;
    Date awardTime;
    //    String type;
    String awardAgency;
}
