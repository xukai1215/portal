package njgis.opengms.portal.dao;

import njgis.opengms.portal.entity.ViewRecord;
import org.springframework.data.mongodb.repository.MongoRepository;


public interface ViewRecordDao extends MongoRepository<ViewRecord,String> {



}
