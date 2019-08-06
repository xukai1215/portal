package njgis.opengms.portal.entity;

import lombok.Data;
import njgis.opengms.portal.entity.support.AuthorInfo;
import njgis.opengms.portal.entity.support.Reference;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.List;

@Document
@Data
public class ModelItemVersion {
    @Id
    String id;
    String originOid;
    String oid;
    String name;//
    String image;//
    String description;//
    String detail;//
    String modifier;
    Long verNumber;
    int status;

    List<String> classifications;//
    List<String> keywords;//
    List<Reference> references;//
    List<AuthorInfo> authorship;//

    Date modifyTime;


}
