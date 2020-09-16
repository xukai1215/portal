package njgis.opengms.portal.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document
public class EditDraft {
    @Id
    String id;

    String oid;
    Map<String,Object> content;

    String user;
    String itemOid;//如果是edit,填入条目信息
    String itemName;//
    String itemType;//是哪一类条目
    String editType;//标识是新建条目还是编辑
    Boolean self;//标识是自己的还是他人的
    Boolean template = false;//用户是否设置为填写模板
    String alia;//用户设置的别名

    Date createTime;
    Date lastModifyTime;
}
