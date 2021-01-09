package njgis.opengms.portal.dao;

import njgis.opengms.portal.entity.ModelContainer;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ModelContainerDao extends MongoRepository<ModelContainer,String> {

    ModelContainer findFirstByAccountAndMac(String user,String mac);

    List<ModelContainer> findAllByAccount(String userName);

    ModelContainer findByMac(String mac);

}
