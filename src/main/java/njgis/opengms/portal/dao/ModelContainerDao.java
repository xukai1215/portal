package njgis.opengms.portal.dao;

import njgis.opengms.portal.entity.ModelContainer;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ModelContainerDao extends MongoRepository<ModelContainer,String> {

    ModelContainer findFirstByUserAndMac(String user,String mac);

    List<ModelContainer> findAllByUser(String userName);

}
