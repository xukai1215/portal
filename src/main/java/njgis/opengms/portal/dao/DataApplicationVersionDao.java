package njgis.opengms.portal.dao;

import njgis.opengms.portal.entity.DataApplication;
import njgis.opengms.portal.entity.DataApplicationVersion;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.awt.print.Pageable;
import java.util.List;

/**
 * @Author mingyuan
 * @Date 2020.08.04 16:53
 */
public interface DataApplicationVersionDao extends MongoRepository<DataApplicationVersion,String> {
    List<DataApplicationVersion> findAllByOriginOid(String oid, Pageable pageable);

    DataApplicationVersion findFirstByOid(String oid);
}
