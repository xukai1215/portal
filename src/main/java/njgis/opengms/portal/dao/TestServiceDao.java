package njgis.opengms.portal.dao;

import njgis.opengms.portal.entity.TestService;
import org.springframework.data.mongodb.repository.MongoRepository;

/**
 * @Author mingyuan
 * @Date 2020.01.24 17:24
 */
public interface TestServiceDao extends MongoRepository<TestService, String> {
}
