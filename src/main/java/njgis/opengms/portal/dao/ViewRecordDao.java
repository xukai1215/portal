package njgis.opengms.portal.dao;

import njgis.opengms.portal.entity.ViewRecord;
import njgis.opengms.portal.enums.ItemTypeEnum;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Date;
import java.util.List;


public interface ViewRecordDao extends MongoRepository<ViewRecord,String> {

    List<ViewRecord> findAllByItemType(ItemTypeEnum itemTypeEnum);

    List<ViewRecord> findAllByItemTypeAndItemOid(String type,String oid);

    List<ViewRecord> findAllByItemTypeAndItemOidAndDateGreaterThanEqual(String type,String oid,Date date);

    List<ViewRecord> findAllByItemOidInAndDateGreaterThanEqual(List<String> oids,Date date);

    List<ViewRecord> findAllByItemOidAndItemTypeAndDateGreaterThanEqual(String oid, ItemTypeEnum type, Date date);

    List<ViewRecord> findAllByItemOidAndFlag(String oid, boolean flag);

    List<ViewRecord> findAllByItemOidAndFlagAndDateAfter(String oid, boolean flag, Date date);

}
