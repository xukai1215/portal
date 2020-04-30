package njgis.opengms.portal.entity;

import lombok.Data;
import njgis.opengms.portal.entity.support.AuthorInfo;
import njgis.opengms.portal.entity.support.ItemInfo;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Document
@Data

public class Authorship extends AuthorInfo {

    @Id
    String id;

    String oid;
    List<String> alias = new ArrayList<>();
    List<ItemInfo> items = new ArrayList<>();

    Boolean subscribe=true;

}
