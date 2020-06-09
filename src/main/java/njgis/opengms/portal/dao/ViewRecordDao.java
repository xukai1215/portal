package njgis.opengms.portal.dao;

import njgis.opengms.portal.entity.ViewRecord;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Date;
import java.util.List;


public interface ViewRecordDao extends MongoRepository<ViewRecord,String> {

    List<ViewRecord> findAllByItemTypeAndItemOid(String type,String oid);

    List<ViewRecord> findAllByItemTypeAndItemOidAndDateGreaterThanEqual(String type,String oid,Date date);

}
