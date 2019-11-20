package njgis.opengms.portal.dto.theme;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import njgis.opengms.portal.entity.support.Application;
import njgis.opengms.portal.entity.support.ClassInfo;
import njgis.opengms.portal.entity.support.DataClassInfo;

import java.util.List;

/**
 * @Auther mingyuan
 * @Data 2019.10.23 21:38
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ThemeResultDTO {
    String oid;
    String name;
    String image;
    String description;
    String author;

    List<ClassInfo> classarr;
    List<DataClassInfo>dataClassInfo;
    List<Application>application;
}
