package njgis.opengms.portal.dao;

import njgis.opengms.portal.entity.DataItemVersion;
import org.springframework.data.mongodb.repository.MongoRepository;

/**
 * @Author mingyuan
 * @Date 2020.08.05 21:27
 */
public interface DataItemVersionDao extends MongoRepository<DataItemVersion,String> {
    DataItemVersion findFirstByOid(String oid);
}
