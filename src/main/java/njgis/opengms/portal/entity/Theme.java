package njgis.opengms.portal.entity;

import lombok.Data;
import njgis.opengms.portal.entity.support.*;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

/**
 * @Auther mingyuan
 * @Data 2019.10.23 15:49
 */
@Data
@Document
public class Theme extends Item {
    String creator_name;
    String creator_oid;
    String themename;
    String image;
    String tabledata;
    //修改confirm字段
    String Info_edit;
    List<Edit> edits;
//    boolean lock=false;


    //其余部分
    String sub_themename;
    List<SubDetail> subDetails;
    List<ClassInfo> classinfo;
    List<SubClassInfo> subClassInfos;
    List<DataClassInfo> dataClassInfo;
    List<SubDataInfo> subDataInfos;
    List<Application> application;
    List<SubApplication> subApplications;
    List<Reference> references;
    List<Maintainer> maintainer;//其余的维护者为下标0之后存储

}
