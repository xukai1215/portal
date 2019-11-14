package njgis.opengms.portal.dao;

import njgis.opengms.portal.entity.ModelContainer;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ModelContainerDao extends MongoRepository<ModelContainer,String> {

}
