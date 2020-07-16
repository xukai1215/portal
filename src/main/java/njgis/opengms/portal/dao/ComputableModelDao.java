package njgis.opengms.portal.dao;

import njgis.opengms.portal.dto.ComputableModel.ComputableModelIngtegratedDTO;
import njgis.opengms.portal.dto.ComputableModel.ComputableModelResultDTO;
import njgis.opengms.portal.entity.ComputableModel;
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
public interface ComputableModelDao extends MongoRepository<ComputableModel,String> {

    ComputableModel findFirstByOid(String id);

    //Page<ModelItem> findByNameLike(String name, Pageable pageable);

    List<ComputableModel> findAllByMd5(String md5);

    List<ComputableModel> findAllByNameContainsIgnoreCase(String key);

    Page<ComputableModel> findByNameContainsIgnoreCase(String name, Pageable pageable);

    Page<ComputableModel> findByClassificationsIn(List<String> classes, Pageable pageable);

    Page<ComputableModel> findByClassificationsInAndAuthor(List<String> classes, String author, Pageable pageable);

    Page<ComputableModel> findByNameContainsIgnoreCaseAndClassificationsIn(String name, List<String> classes, Pageable pageable);

    Page<ComputableModel> findByNameContainsIgnoreCaseAndClassificationsInAndAuthor(String name, List<String> classes, String author, Pageable pageable);

    List<ComputableModel> findByDeployedServiceNotNull(Pageable pageable);

    Page<ComputableModel> findByDeployedServiceNotNullAndAuthor(String author,Pageable pageable);

    Page<ComputableModel> findByNameContains(String name,Pageable pageable);

    List<ComputableModel> findByNameContainsIgnoreCaseAndContentType(String name, String contentType);

    Page<ComputableModel> findByAuthor(String author,Pageable pageable);

    Page<ComputableModel> findByAuthorAndContentType(String author,String contentType,Pageable pageable);

    Page<ComputableModel> findByAuthorAndStatusIn(String author,List<String> status,Pageable pageable);

    List<Item> findAllByAuthor(String author);

    List<Item> findAllByAuthorAndContentType(String author,String contentType);

    Page<ComputableModel> findByNameContainsIgnoreCaseAndAuthor(String name,String author,Pageable pageable);

    Page<ComputableModelResultDTO> findComModelByNameContainsIgnoreCaseAndAuthor(String name, String author, Pageable pageable);

    Page<ComputableModelResultDTO> findComModelByNameContainsIgnoreCaseAndAuthorAndStatusIn(String name, String author,List<String> status, Pageable pageable);

    Page<ComputableModel> findByContentType(String contentType, Pageable pageable);

    List<ComputableModel> findByContentType(String contentType);

    List<Item> findAllByAuthorshipIsNotNull();

    List<ComputableModelIngtegratedDTO> findAllByRelateModelItemNotNull();

    ComputableModel findFirstByAuthorAndMd5(String author, String md5);

    Page<ComputableModel> findAllByContentType(String contentType, Pageable pageable);

    Page<ComputableModel> findByNameContainsIgnoreCaseAndContentType(String name, String contentType, Pageable pageable);

    Page<ComputableModel> findAllByDeploy(boolean deploy, Pageable pageable);

    Page<ComputableModel> findAllByDeployAndStatusIn(boolean deploy,List<String> status, Pageable pageable);

    Page<ComputableModel> findAllByDeployAndStatusInAndNameLikeIgnoreCase(boolean deploy,List<String> status,String name, Pageable pageable);

    Page<ComputableModel> findByNameContainsIgnoreCaseAndDeploy(String name, boolean deploy, Pageable pageable);
}
