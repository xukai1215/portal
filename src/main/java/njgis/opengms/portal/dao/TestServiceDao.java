package njgis.opengms.portal.dao;

import njgis.opengms.portal.entity.support.TestService;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface TestServiceDao extends MongoRepository<TestService,String> {
}
