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
 * @Data 2019.10.23 21:37
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ThemeAddDTO {
    String themename;
    String detail;
    String uploadImage;
    String creator_name;
    String creator_oid;

    List<ClassInfo> classinfo;
    List<DataClassInfo>dataClassInfo;
    List<Application>application;
}
