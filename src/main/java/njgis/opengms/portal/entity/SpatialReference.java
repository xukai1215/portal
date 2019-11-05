package njgis.opengms.portal.entity;

import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document
@Data
public class SpatialReference extends Item {

    String wkname;
    String wkt;
    List<String> classifications;
    String image;

    String type;
    String parentId;
    String xml;
    String name_EN;
    String description_EN;

}
