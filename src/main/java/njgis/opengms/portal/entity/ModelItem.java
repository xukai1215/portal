package njgis.opengms.portal.entity;

import lombok.Data;
import njgis.opengms.portal.entity.support.ModelItemRelate;
import njgis.opengms.portal.entity.support.Reference;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document
@Data
public class ModelItem extends Item {

    String image;

    String knowledgeGraph;

    List<String> classifications;
    List<Reference> references;
    List<String> relatedData;

    ModelItemRelate relate;

}
