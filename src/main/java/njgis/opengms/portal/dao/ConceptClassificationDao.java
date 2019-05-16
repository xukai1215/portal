package njgis.opengms.portal.dao;

import njgis.opengms.portal.entity.Classification;
import njgis.opengms.portal.entity.ConceptClassification;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

/**
 * @ClassName ClassificationDao
 * @Description todo
 * @Author Kai
 * @Date 2019/2/21
 * @Version 1.0.0
 * TODO
 */
public interface ConceptClassificationDao extends MongoRepository<ConceptClassification,String> {

    Classification findFirstByOid(String id);

    Classification findFirstByNameEn(String nameEn);
}
