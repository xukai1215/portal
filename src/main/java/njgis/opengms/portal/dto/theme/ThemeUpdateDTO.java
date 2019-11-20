package njgis.opengms.portal.dto.theme;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @Auther mingyuan
 * @Data 2019.10.23 21:38
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ThemeUpdateDTO extends ThemeAddDTO{
    String oid;
}
