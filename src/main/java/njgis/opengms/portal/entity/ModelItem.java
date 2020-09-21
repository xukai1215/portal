package njgis.opengms.portal.entity;

import lombok.Data;
import njgis.opengms.portal.entity.support.ModelItemRelate;
import njgis.opengms.portal.entity.support.ModelRelation;
import njgis.opengms.portal.entity.support.Reference;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Document
@Data
public class ModelItem extends Item {

    String image;

    String knowledgeGraph;

    List<String> classifications = new ArrayList<>();
    List<String> classifications2;
    List<Reference> references = new ArrayList<>();
    List<String> relatedData = new ArrayList<>();

    ModelItemRelate relate;

    List<ModelRelation> modelRelationList = new ArrayList<>();

}
