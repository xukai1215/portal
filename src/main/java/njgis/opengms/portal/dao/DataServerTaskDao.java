package njgis.opengms.portal.dao;

import njgis.opengms.portal.entity.DataServerTask;
import org.springframework.data.mongodb.repository.MongoRepository;

/**
 * @Author mingyuan
 * @Date 2020.01.06 14:18
 */
public interface DataServerTaskDao extends MongoRepository<DataServerTask, String> {
    DataServerTask findFirstByOid(String oid);
}
