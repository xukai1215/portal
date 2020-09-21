package njgis.opengms.portal.dao;

import njgis.opengms.portal.dto.LogicalModel.LogicalModelResultDTO;
import njgis.opengms.portal.entity.Item;
import njgis.opengms.portal.entity.LogicalModel;
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
public interface LogicalModelDao extends MongoRepository<LogicalModel,String> {

    LogicalModel findFirstByOid(String id);

    //Page<ModelItem> findByNameLike(String name, Pageable pageable);

    Page<LogicalModel> findByStatusNotLike(String statusNotLike, Pageable pageable);

    Page<LogicalModel> findByNameContainsIgnoreCaseAndStatusNotLike(String name,String statusNotLike, Pageable pageable);

    Page<LogicalModel> findByClassificationsInAndStatusNotLike(List<String> classes,String statusNotLike, Pageable pageable);

    Page<LogicalModel> findByClassificationsInAndAuthorAndStatusNotLike(List<String> classes, String author,String statusNotLike, Pageable pageable);

    Page<LogicalModel> findByNameContainsIgnoreCaseAndClassificationsInAndStatusNotLike(String name, List<String> classes,String statusNotLike, Pageable pageable);

    Page<LogicalModel> findByNameContainsIgnoreCaseAndClassificationsInAndAuthorAndStatusNotLike(String name, List<String> classes,String author,String statusNotLike, Pageable pageable);

    Page<LogicalModel> findByAuthorAndStatusNotLike(String author,String statusNotLike,Pageable pageable);

    Page<LogicalModel> findByAuthorAndStatusIn(String author,List<String> status,Pageable pageable);

    List<Item> findByAuthor(String author);

    Page<LogicalModel> findByNameContainsIgnoreCaseAndAuthorAndStatusNotLike(String name, String author,String statusNotLike,Pageable pageable);

    Page<LogicalModelResultDTO> findLoModelByNameContainsIgnoreCaseAndAuthor(String name, String author, Pageable pageable);

    Page<LogicalModelResultDTO> findLoModelByNameContainsIgnoreCaseAndAuthorAndStatusIn(String name, String author,List<String> status, Pageable pageable);

    List<Item> findAllByAuthorshipIsNotNull();

}
