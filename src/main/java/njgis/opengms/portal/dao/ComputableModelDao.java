package njgis.opengms.portal.dao;

import njgis.opengms.portal.dto.ComputableModel.ComputableModelIngtegratedDTO;
import njgis.opengms.portal.dto.ComputableModel.ComputableModelResultDTO;
import njgis.opengms.portal.dto.ComputableModel.ComputableModelSimpleDTO;
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

    Page<ComputableModel> findByStatusNotLike(String statusNotLike, Pageable pageable);

    List<ComputableModelResultDTO> findAllByMd5(String md5);

    List<ComputableModel> findAllByNameContainsIgnoreCase(String key);

    Page<ComputableModel> findByNameContainsIgnoreCaseAndStatusNotLike(String name, String statusNotLike,Pageable pageable);

    Page<ComputableModel> findByClassificationsInAndStatusNotLike(List<String> classes,String statusNotLike, Pageable pageable);

    Page<ComputableModel> findByClassificationsInAndAuthorAndStatusNotLike(List<String> classes, String author,String statusNotLike, Pageable pageable);

    Page<ComputableModel> findByNameContainsIgnoreCaseAndClassificationsInAndStatusNotLike(String name, List<String> classes,String statusNotLike, Pageable pageable);

    Page<ComputableModel> findByNameContainsIgnoreCaseAndClassificationsInAndAuthorAndStatusNotLike(String name, List<String> classes, String author,String statusNotLike, Pageable pageable);

    List<ComputableModel> findByDeployedServiceNotNull(Pageable pageable);

    Page<ComputableModel> findByDeployedServiceNotNullAndAuthor(String author,Pageable pageable);

    Page<ComputableModel> findByNameContains(String name,Pageable pageable);

    Page<ComputableModel> findByNameContainsIgnoreCase(String name,Pageable pageable);

    List<ComputableModel> findByNameContainsIgnoreCaseAndContentType(String name, String contentType);

    Page<ComputableModel> findByAuthorAndStatusNotLike(String author,String statusNotLike, Pageable pageable);

    Page<ComputableModel> findByAuthorAndContentType(String author,String contentType,Pageable pageable);

    Page<ComputableModel> findByAuthorAndStatusIn(String author,List<String> status,Pageable pageable);

    Page<ComputableModelSimpleDTO> findAllByAuthorAndContentType(String username, String contentType, Pageable pageable);

    List<Item> findAllByAuthor(String author);

    List<Item> findAllByAuthorAndContentType(String author,String contentType);

    Page<ComputableModel> findByNameContainsIgnoreCaseAndAuthorAndStatusNotLike(String name,String author,String statusNotLike,Pageable pageable);

    Page<ComputableModelResultDTO> findComModelByNameContainsIgnoreCaseAndAuthor(String name, String author, Pageable pageable);

    Page<ComputableModelResultDTO> findComModelByNameContainsIgnoreCaseAndAuthorAndStatusIn(String name, String author,List<String> status, Pageable pageable);

    Page<ComputableModel> findByContentType(String contentType, Pageable pageable);

    List<ComputableModel> findByContentType(String contentType);

    List<Item> findAllByAuthorshipIsNotNull();

    List<ComputableModelIngtegratedDTO> findAllByRelateModelItemNotNull();

    List<ComputableModel> findAllByDeploy(boolean deploy);

    ComputableModel findFirstByAuthorAndMd5(String author, String md5);

    Page<ComputableModel> findAllByContentType(String contentType, Pageable pageable);

    Page<ComputableModel> findByNameContainsIgnoreCaseAndContentType(String name, String contentType, Pageable pageable);

    Page<ComputableModel> findAllByDeploy(boolean deploy, Pageable pageable);

    Page<ComputableModel> findAllByDeployAndStatusIn(boolean deploy,List<String> status, Pageable pageable);

    Page<ComputableModel> findAllByDeployAndStatusInAndNameLikeIgnoreCase(boolean deploy,List<String> status,String name, Pageable pageable);

    Page<ComputableModel> findAllByClassificationsInAndNameLikeIgnoreCase(List<String> classifications,String name, Pageable pageable);

    Page<ComputableModel> findAllByClassificationsInAndNameLikeIgnoreCaseAndDeploy(List<String> classifications,String name,boolean deploy, Pageable pageable);

    Page<ComputableModel> findByNameContainsIgnoreCaseAndDeploy(String name, boolean deploy, Pageable pageable);
}
