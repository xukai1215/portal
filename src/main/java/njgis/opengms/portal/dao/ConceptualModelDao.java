package njgis.opengms.portal.dao;

import njgis.opengms.portal.entity.ConceptualModel;
import njgis.opengms.portal.entity.ModelItem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

/**
 * @ClassName ModelItemDao
 * @Description todo
 * @Author Kai
 * @Date 2019/2/21
 * @Version 1.0.0
 * TODO
 */
public interface ConceptualModelDao extends MongoRepository<ConceptualModel,String> {

    ConceptualModel findFirstByOid(String id);

    //Page<ModelItem> findByNameLike(String name, Pageable pageable);


    Page<ConceptualModel> findByNameContainsIgnoreCase(String name, Pageable pageable);

    Page<ConceptualModel> findByClassificationsIn(List<String> classes, Pageable pageable);

    Page<ConceptualModel> findByNameContainsIgnoreCaseAndClassificationsIn(String name, List<String> classes, Pageable pageable);

    Page<ConceptualModel> findByAuthor(String author,Pageable pageable);

    Page<ConceptualModel> findByNameContainsIgnoreCaseAndAuthor(String name,String author,Pageable pageable);

}
