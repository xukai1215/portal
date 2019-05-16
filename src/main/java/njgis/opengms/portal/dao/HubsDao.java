package njgis.opengms.portal.dao;

import njgis.opengms.portal.entity.DataItem;
import njgis.opengms.portal.entity.Hubs;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface HubsDao extends MongoRepository<Hubs,String> {

}
