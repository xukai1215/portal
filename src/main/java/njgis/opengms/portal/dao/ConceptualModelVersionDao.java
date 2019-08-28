package njgis.opengms.portal.dao;

import njgis.opengms.portal.entity.ConceptualModelVersion;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

/**
 * @ClassName ConceptualModelVersionDao
 * @Description todo
 * @Author Kai
 * @Date 2019/2/21
 * @Version 1.0.0
 * TODO
 */
public interface ConceptualModelVersionDao extends MongoRepository<ConceptualModelVersion,String> {

    List<ConceptualModelVersion> findAllByOriginOid(String oid, Pageable pageable);

    ConceptualModelVersion findFirstByOid(String oid);

}
