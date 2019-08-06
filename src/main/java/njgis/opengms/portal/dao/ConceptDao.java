package njgis.opengms.portal.dao;

import njgis.opengms.portal.dto.community.ConceptResultDTO;
import njgis.opengms.portal.entity.Concept;
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

    Concept findByOid(String oid);

    Page<Concept> findByParentId(String parentId, Pageable pageable);

    Page<Concept> findByNameContainsIgnoreCase(String name, Pageable pageable);

    Page<Concept> findByParentIdIn(List<String> parentIds,Pageable pageable);

    Page<ConceptResultDTO> findByAuthor(String author, Pageable pageable);

    Page<ConceptResultDTO> findByNameContainsIgnoreCaseAndAuthor(String name, String author, Pageable pageable);
}
