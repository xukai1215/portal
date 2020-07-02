package njgis.opengms.portal.dao;

import njgis.opengms.portal.dto.Concept.ConceptResultDTO;
import njgis.opengms.portal.entity.Concept;
import njgis.opengms.portal.entity.Item;
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
public interface ConceptDao extends MongoRepository<Concept,String> {

    Page<ConceptResultDTO> findAllBy(Pageable pageable);

    Concept findByOid(String oid);

    Concept findFirstByOid(String oid);

    Page<Concept> findByParentId(String parentId, Pageable pageable);

    Page<ConceptResultDTO> findByNameContainsIgnoreCase(String name, Pageable pageable);

    Page<ConceptResultDTO> findByParentIdIn(List<String> parentIds,Pageable pageable);

    Page<ConceptResultDTO> findByClassificationsIn(List<String> parentIds,Pageable pageable);

    Page<ConceptResultDTO> findByAuthor(String author, Pageable pageable);

    Page<ConceptResultDTO> findByAuthorAndStatusIn(String author,List<String> status, Pageable pageable);

    List<Item> findByAuthor(String author);

    Page<ConceptResultDTO> findByNameContainsIgnoreCaseAndAuthor(String name, String author, Pageable pageable);

    Page<ConceptResultDTO> findByNameContainsIgnoreCaseAndAuthorAndStatusIn(String name, String author,List<String> status, Pageable pageable);

    List<Item> findAllByAuthorshipIsNotNull();
}
