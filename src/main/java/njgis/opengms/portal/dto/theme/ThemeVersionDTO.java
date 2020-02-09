package njgis.opengms.portal.dto.theme;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

/**
 * @Auther mingyuan
 * @Data 2020.01.14 16:19
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ThemeVersionDTO {
    Date time;
    String type;
    String themename;
}
