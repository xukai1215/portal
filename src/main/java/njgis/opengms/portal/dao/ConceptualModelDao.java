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

    Page<ConceptualModel> findByStatusNotLike(String statusNotLike, Pageable pageable);

    Page<ConceptualModel> findByNameContainsIgnoreCaseAndStatusNotLike(String name, String statusNotLike, Pageable pageable);

    Page<ConceptualModel> findByClassificationsInAndStatusNotLike(List<String> classes, String statusNotLike, Pageable pageable);

    Page<ConceptualModel> findByClassificationsInAndAuthorAndStatusNotLike(List<String> classes, String author,String statusNotLike, Pageable pageable);

    Page<ConceptualModel> findByNameContainsIgnoreCaseAndClassificationsInAndStatusNotLike(String name, List<String> classes,String statusNotLike, Pageable pageable);

    Page<ConceptualModel> findByNameContainsIgnoreCaseAndClassificationsInAndAuthorAndStatusNotLike(String name, List<String> classes, String author,String statusNotLike, Pageable pageable);

    Page<ConceptualModel> findByAuthorAndStatusNotLike(String author,String statusNotLike, Pageable pageable);

    Page<ConceptualModel> findByAuthorAndStatusIn(String author, List<String> status,Pageable pageable);

    List<Item> findAllByAuthor(String author);

    Page<ConceptualModel> findByNameContainsIgnoreCaseAndAuthorAndStatusNotLike(String name,String author,String statusNotLike,Pageable pageable);

    Page<ConceptualModelResultDTO> findConModelByNameContainsIgnoreCaseAndAuthor(String name, String author, Pageable pageable);

    Page<ConceptualModelResultDTO> findConModelByNameContainsIgnoreCaseAndAuthorAndStatusIn(String name, String author, List<String> status,Pageable pageable);

    List<Item> findAllByAuthorshipIsNotNull();
}
