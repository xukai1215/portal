package njgis.opengms.portal.dto.theme;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

/**
 * @Auther mingyuan
 * @Data 2020.01.14 16:19
 */
//@JsonFormat( pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
@Data
@AllArgsConstructor
@NoArgsConstructor


public class ThemeVersionDTO {
    String oid;
    String themeOid;

    Date time;
    String themename;
    String type;
}
