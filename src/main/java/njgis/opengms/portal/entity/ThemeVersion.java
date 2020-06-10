package njgis.opengms.portal.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import njgis.opengms.portal.entity.support.*;
import org.springframework.data.annotation.Id;

import java.util.Date;
import java.util.List;

/**
 * @Auther mingyuan
 * @Data 2020.05.05 15:43
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
//以编辑者为存储基准
public class ThemeVersion{
    @Id
    String oid;
    String themename;
//    String originOid;
    String themeOid;//
    Date modifyTime;
    Date acceptTime;
    Date rejectTime;
    int status;//版本状态
    String image;
    String modifierOid;
    String creator;
    int readStatus;

    String detail;
    List<ClassInfo> classinfo;
    List<DataClassInfo> dataClassInfo;
    List<Application> application;
    List<Maintainer> maintainer;//其余的维护者为下标0之后存储

    Long verNumber;//版本号
}
