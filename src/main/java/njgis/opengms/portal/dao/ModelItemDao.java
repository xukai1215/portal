package njgis.opengms.portal.dao;

import njgis.opengms.portal.dto.modelItem.ModelItemResultDTO;
import njgis.opengms.portal.entity.Item;
import njgis.opengms.portal.entity.ModelItem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;

/**
 * @ClassName ModelItemDao
 * @Description todo
 * @Author Kai
 * @Date 2019/2/21
 * @Version 1.0.0
 * TODO
 */
public interface ModelItemDao extends MongoRepository<ModelItem,String> {

    List<Item> findAllByAuthorshipIsNotNull();

    ModelItem findFirstById(String id);

    ModelItem findFirstByOid(String id);

    ModelItem findFirstByName(String name);

    List<ModelItem> findModelItemsByAuthor(String author);

    //Page<ModelItem> findByNameLike(String name, Pageable pageable);

    List<ModelItem> findByNameLike(@Param("name") String name);

    Page<ModelItemResultDTO> findAllByNameContains(@Param("name") String name,Pageable pageable);

    Page<ModelItemResultDTO> findAllByNameContainsAndStatusIn(String name, List<String> status,Pageable pageable);

    Page<ModelItemResultDTO> findAllByNameContainsAndAuthor(String name, String author, Pageable pageable);

    Page<ModelItemResultDTO> findByNameContainsIgnoreCase(String name,Pageable pageable);

    Page<ModelItemResultDTO> findByNameContainsIgnoreCaseAndStatusIn(String name, List<String> status,Pageable pageable);

    Page<ModelItem> findByNameLikeIgnoreCase(String name,Pageable pageable);

    Page<ModelItemResultDTO> findByClassificationsIn(List<String> classes,Pageable pageable);

    Page<ModelItemResultDTO> findByClassificationsInAndStatusIn(List<String> classes,List<String> status,Pageable pageable);

    Page<ModelItemResultDTO> findByClassificationsInAndAuthor(List<String> classes, String author, Pageable pageable);

    Page<ModelItemResultDTO> findByNameContainsIgnoreCaseAndClassificationsIn(String name,List<String> classes,Pageable pageable);

    Page<ModelItemResultDTO> findByNameContainsIgnoreCaseAndClassificationsInAndAuthor(String name,List<String> classes,String author, Pageable pageable);

    Page<ModelItemResultDTO> findByAuthor(String author, Pageable pageable);

    Page<ModelItemResultDTO> findByAuthorAndStatusIn(String author,List<String> classes, Pageable pageable);

    List<Item> findAllByAuthor(String author);

    Page<ModelItemResultDTO> findByNameContainsIgnoreCaseAndAuthor(String name, String author, Pageable pageable);

    Page<ModelItemResultDTO> findByNameContainsIgnoreCaseAndAuthorAndStatusIn(String name, String author,List<String> classes, Pageable pageable);

    List<ModelItem> findAllByClassificationsIn(String cla);

    List<ModelItem> findAllByClassificationsContains(String oid);

}
