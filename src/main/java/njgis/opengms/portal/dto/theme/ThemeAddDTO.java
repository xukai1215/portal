package njgis.opengms.portal.dto.theme;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import njgis.opengms.portal.entity.support.*;

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
    String sub_themename;
    String detail;
    List<SubDetail> subDetails;
    String sub_detail;//
    String uploadImage;
    String creator_name;
    String creator_oid;
    String tabledata;
    String info_edit;
//    String maintainer;
    List<Maintainer> maintainer;//其余的维护者为下标0之后存储
    List<ClassInfo> classinfo;
    List<SubClassInfo> subClassInfos;
    List<ClassInfo> subclassinfo;  //
    List<DataClassInfo>dataClassInfo;
    List<SubDataInfo> subDataInfos;
    List<DataClassInfo> sub_dataClassInfo;//
    List<Application>application;
    List<SubApplication> subApplications;
    List<Application> sub_application;//
}
