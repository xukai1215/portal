package njgis.opengms.portal.dao;

import njgis.opengms.portal.entity.SpatialReferenceVersion;
import njgis.opengms.portal.entity.TemplateVersion;
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
public interface SpatialReferenceVersionDao extends MongoRepository<SpatialReferenceVersion,String> {

    List<SpatialReferenceVersion> findAllByOriginOid(String oid, Pageable pageable);

    SpatialReferenceVersion findFirstByOid(String oid);

    List<SpatialReferenceVersion> findFirstByCreatorAndVerStatus(String creator, Integer verStatus);

}
