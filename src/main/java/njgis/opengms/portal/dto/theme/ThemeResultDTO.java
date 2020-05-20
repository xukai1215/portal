package njgis.opengms.portal.dto.theme;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

/**
 * @Auther mingyuan
 * @Data 2019.10.23 21:38
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ThemeResultDTO {

    String creator_name;

    String oid;
    String themename;
    String image;
    String detail;
    String author;
    Date createTime;
    String status;

}
