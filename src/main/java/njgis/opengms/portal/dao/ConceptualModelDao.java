package njgis.opengms.portal.dao;

import njgis.opengms.portal.dto.ConceptualModel.ConceptualModelResultDTO;
import njgis.opengms.portal.entity.ConceptualModel;
import njgis.opengms.portal.entity.Item;
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

    Page<ConceptualModel> findByClassificationsInAndAuthor(List<String> classes, String author, Pageable pageable);

    Page<ConceptualModel> findByNameContainsIgnoreCaseAndClassificationsIn(String name, List<String> classes, Pageable pageable);

    Page<ConceptualModel> findByNameContainsIgnoreCaseAndClassificationsInAndAuthor(String name, List<String> classes, String author, Pageable pageable);

    Page<ConceptualModel> findByAuthor(String author,Pageable pageable);

    List<Item> findByAuthor(String author);

    Page<ConceptualModel> findByNameContainsIgnoreCaseAndAuthor(String name,String author,Pageable pageable);

    Page<ConceptualModelResultDTO> findConModelByNameContainsIgnoreCaseAndAuthor(String name, String author, Pageable pageable);

    List<Item> findAllByAuthorshipIsNotNull();
}
