package njgis.opengms.portal.dao;

import njgis.opengms.portal.entity.DataHubsVersion;
import njgis.opengms.portal.entity.DataItemVersion;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

/**
 * @Author mingyuan
 * @Date 2020.10.12 19:53
 */
public interface DataHubsVersionDao extends MongoRepository<DataHubsVersion, String> {
    DataHubsVersion findFirstByOid(String oid);

    List<DataHubsVersion> findFirstByCreatorAndVerStatus(String creator, Integer verStatus);

}

