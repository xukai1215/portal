package njgis.opengms.portal.dao;

import njgis.opengms.portal.dto.Spatial.SpatialResultDTO;
import njgis.opengms.portal.entity.Item;
import njgis.opengms.portal.entity.SpatialReference;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
public interface SpatialReferenceDao extends MongoRepository<SpatialReference,String> {

    Page<SpatialResultDTO> findAllBy(Pageable pageable);

    SpatialReference findByOid(String oid);

    Page<SpatialReference> findByParentId(String parentId, Pageable pageable);

    Page<SpatialResultDTO> findByNameContainsIgnoreCase(String name, Pageable pageable);

    Page<SpatialResultDTO> findByParentIdIn(List<String> parentIds, Pageable pageable);

    Page<SpatialResultDTO> findByClassificationsIn(List<String> parentIds, Pageable pageable);

    Page<SpatialResultDTO> findByAuthor(String author, Pageable pageable);

    Page<SpatialResultDTO> findByAuthorAndStatusIn(String author,List<String> status, Pageable pageable);

    List<Item> findByAuthor(String author);

    Page<SpatialResultDTO> findByNameContainsIgnoreCaseAndAuthor(String name, String author, Pageable pageable);

    Page<SpatialResultDTO> findByNameContainsIgnoreCaseAndAuthorAndStatusIn(String name, String author,List<String> status, Pageable pageable);

    List<Item> findAllByAuthorshipIsNotNull();
}
