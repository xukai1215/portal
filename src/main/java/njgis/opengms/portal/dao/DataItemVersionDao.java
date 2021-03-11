package njgis.opengms.portal.dao;

import njgis.opengms.portal.entity.DataItemVersion;
import njgis.opengms.portal.entity.UnitVersion;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

/**
 * @Author mingyuan
 * @Date 2020.08.05 21:27
 */
public interface DataItemVersionDao extends MongoRepository<DataItemVersion,String> {
    DataItemVersion findFirstByOid(String oid);

    List<DataItemVersion> findFirstByCreatorAndVerStatus(String creator, Integer verStatus);

}
