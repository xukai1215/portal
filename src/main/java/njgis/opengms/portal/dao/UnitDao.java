package njgis.opengms.portal.dao;

import njgis.opengms.portal.dto.Unit.UnitResultDTO;
import njgis.opengms.portal.entity.Item;
import njgis.opengms.portal.entity.Unit;
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
public interface UnitDao extends MongoRepository<Unit,String> {
    Unit findByOid(String oid);

    Page<Unit> findByParentId(String parentId, Pageable pageable);

    Page<UnitResultDTO> findByNameContainsIgnoreCase(String name, Pageable pageable);

    Page<UnitResultDTO> findByNameContainsIgnoreCaseAndStatusIn(String name,List<String> status, Pageable pageable);

    Page<UnitResultDTO> findAllByAndStatusIn(List<String> status,Pageable pageable);

    Page<UnitResultDTO> findByParentIdIn(List<String> parentIds, Pageable pageable);

    Page<UnitResultDTO> findByClassificationsIn(List<String> parentIds, Pageable pageable);

    Page<UnitResultDTO> findByClassificationsInAndStatusIn(List<String> parentIds,List<String> status, Pageable pageable);

    Page<UnitResultDTO> findByAuthor(String author, Pageable pageable);

    Page<UnitResultDTO> findByAuthorAndStatusIn(String author,List<String> status,Pageable pageable);

    List<Item> findByAuthor(String author);

    Page<UnitResultDTO> findByNameContainsIgnoreCaseAndAuthor(String name, String author, Pageable pageable);

    Page<UnitResultDTO> findByNameContainsIgnoreCaseAndAuthorAndStatusIn(String name, String author,List<String> status, Pageable pageable);

    List<Item> findAllByAuthorshipIsNotNull();
}
