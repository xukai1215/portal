package njgis.opengms.portal.entity;

import lombok.Data;
import njgis.opengms.portal.entity.support.Application;
import njgis.opengms.portal.entity.support.ClassInfo;
import njgis.opengms.portal.entity.support.DataClassInfo;
import njgis.opengms.portal.entity.support.Reference;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.List;

/**
 * @Auther mingyuan
 * @Data 2019.10.23 15:49
 */
@Data
@Document
public class Theme {
    @Id
    String id;
    String oid;
    String creator_name;
    String creator_oid;
    String themename;
    String detail;
    String image;
    String author;

    //其余部分
    List<ClassInfo> classinfo;
    List<DataClassInfo> dataClassInfo;
    List<Application> application;
    List<Reference> references;

    Date createTime;
    Date lastModifyTime;
}
