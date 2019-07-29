package njgis.opengms.portal.dao;

import org.springframework.data.domain.Pageable;
import njgis.opengms.portal.entity.ModelItemVersion;
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
public interface ModelItemVersionDao extends MongoRepository<ModelItemVersion,String> {

    List<ModelItemVersion> findAllByOid(String oid,Pageable pageable);

}
