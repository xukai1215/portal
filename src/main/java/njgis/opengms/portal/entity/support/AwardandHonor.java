package njgis.opengms.portal.entity.support;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AwardandHonor {
    @Id
    String id;
    String oid;
    String name;
    Date awardTime;
    String contributor;
    //    String type;
    String awardAgency;
    Date creatDate;

}
