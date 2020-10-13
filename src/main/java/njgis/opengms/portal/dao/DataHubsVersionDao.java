package njgis.opengms.portal.dao;

import njgis.opengms.portal.entity.DataHubsVersion;
import org.springframework.data.mongodb.repository.MongoRepository;

/**
 * @Author mingyuan
 * @Date 2020.10.12 19:53
 */
public interface DataHubsVersionDao extends MongoRepository<DataHubsVersion, String> {
    DataHubsVersion findFirstByOid(String oid);
}

