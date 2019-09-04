package njgis.opengms.portal.dao;

import njgis.opengms.portal.entity.LogicalModelVersion;
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
public interface LogicalModelVersionDao extends MongoRepository<LogicalModelVersion,String> {

    List<LogicalModelVersion> findAllByOriginOid(String oid, Pageable pageable);

    LogicalModelVersion findFirstByOid(String oid);

}
