package njgis.opengms.portal.entity;

import lombok.Data;
import njgis.opengms.portal.entity.support.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.List;

/**
 * @Auther mingyuan
 * @Data 2020.06.21 12:31
 */
@Document
@Data
public class DataItemVersion extends DataItem{
    String originId;//正式数据库对应条目的oid
    String modifier;
    String creator;
    int readStatus;
    int verStatus;

    Long verNumber;//版本号

    List<Reference> references;//

    Date modifyTime;
    Date acceptTime;
    Date rejectTime;
}
