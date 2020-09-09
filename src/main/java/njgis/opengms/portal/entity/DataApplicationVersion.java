package njgis.opengms.portal.entity;

import com.alibaba.fastjson.JSONArray;
import lombok.Data;
import lombok.NoArgsConstructor;
import njgis.opengms.portal.entity.support.AuthorInfo;
import org.omg.CORBA.PUBLIC_MEMBER;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.List;

/**
 * @Author mingyuan
 * @Date 2020.08.04 16:49
 */
@Document
@Data
public class DataApplicationVersion extends DataApplication{
    String OriginId;
    Date modifyTime;
    Date acceptTime;
    Date rejectTime;
    //版本相关
    String modifier;
    String originOid;//正式数据库对应条目的oid
    Long verNumber;//版本号
    int verStatus;//版本状态
    int readStatus;
}
