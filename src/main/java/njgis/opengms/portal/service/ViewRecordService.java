package njgis.opengms.portal.service;

import njgis.opengms.portal.dao.ViewRecordDao;
import njgis.opengms.portal.entity.ViewRecord;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ViewRecordService {

    @Autowired
    ViewRecordDao viewRecordDao;

    public List<ViewRecord> findAllByTypeAndOid(String type,String oid){

        return viewRecordDao.findAllByItemTypeAndItemOid(type,oid);

    }


}
