package njgis.opengms.portal.dao;

import njgis.opengms.portal.entity.DataServerTask;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

/**
 * @Author mingyuan
 * @Date 2020.01.06 14:18
 */
public interface DataServerTaskDao extends MongoRepository<DataServerTask, String> {
    DataServerTask findFirstByOid(String oid);

    Page<DataServerTask> findAllByUserIdLike(String userId, Pageable pageable);
    Page<DataServerTask> findAllByUserIdLikeAndStatus(String userId, int status, Pageable pageable);
    Page<DataServerTask> findAllByUserIdLikeAndServiceNameLike(String userId, String serviceName, Pageable pageable);
    Page<DataServerTask> findAllByUserIdLikeAndStatusAndServiceNameLike(String userId, int status, String serviceName, Pageable pageable);
}
