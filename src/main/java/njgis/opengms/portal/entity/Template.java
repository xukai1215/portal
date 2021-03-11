package njgis.opengms.portal.entity;

import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document
@Data
public class Template extends Item {
    List<String> classifications;

    String image;

    String xml;
    String type;
    String parentId;

    List<String> relatedMethods;//所链接的方法
}
