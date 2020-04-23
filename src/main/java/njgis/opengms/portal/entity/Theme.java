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
//    @Id
//    String id;
//    String oid;
    String creator_name;
    String creator_oid;
    String themename;
    String sub_themename;
//    String detail;
    List<SubDetail> subDetails;
//    String sub_detail;
    String image;
//    String author;
    String tabledata;
    //修改confirm字段
    String Info_edit;
    List<Edit> edits;


    //其余部分
    List<ClassInfo> classinfo;
    List<SubClassInfo> subClassInfos;
//    List<ClassInfo> sub_classinfo;//新数据结构成功后删除该
    List<DataClassInfo> dataClassInfo;
    List<SubDataInfo> subDataInfos;
//    List<DataClassInfo> sub_dataClassInfo;//新数据结构成功后删除该
    List<Application> application;
    List<SubApplication> subApplications;
//    List<Application> sub_application;//新数据结构成功后删除该
    List<Reference> references;
    List<Maintainer> maintainer;//其余的维护者为下标0之后存储

//    Date createTime;
//    Date lastModifyTime;

}
