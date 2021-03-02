package njgis.opengms.portal.entity;

import lombok.Data;
import njgis.opengms.portal.entity.support.AuthorInfo;
import njgis.opengms.portal.entity.support.ModelItemRelate;
import njgis.opengms.portal.entity.support.ModelRelation;
import njgis.opengms.portal.entity.support.Reference;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Document
@Data
public class ModelItemVersion extends Version {
    @Id
    String id;
    String originOid;//正式数据库对应条目的oid
    String oid;
    String name;//
    String image;//
    String description;//
    String detail;//
    String modifier;
    String creator;
    int readStatus;

    Long verNumber;//版本号
    int verStatus;//版本状态 0:待审核 -1:被拒绝 2:通过 1:原始版本

    List<String> classifications;//
    List<String> classifications2;//
    List<String> keywords;//
    List<Reference> references;//
    List<AuthorInfo> authorship;//

    List<String> relatedData = new ArrayList<>();
    List<ModelRelation> modelRelationList = new ArrayList<>();
    ModelItemRelate relate;

    Date modifyTime;
    Date acceptTime;
    Date rejectTime;


}
