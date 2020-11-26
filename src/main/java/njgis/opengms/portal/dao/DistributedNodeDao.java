package njgis.opengms.portal.dao;

import njgis.opengms.portal.entity.DistributedNode;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

/**
 * @Author mingyuan
 * @Date 2020.08.18 17:10
 */
public interface DistributedNodeDao extends MongoRepository<DistributedNode,String> {
    DistributedNode findFirstByOid(String oid);
    DistributedNode findFirstByIp(String ip);
    List<DistributedNode> findFirstByUserId(String userId);
}
