package njgis.opengms.portal.dao;


import njgis.opengms.portal.entity.UnitConversion;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface UnitConversionDao extends MongoRepository<UnitConversion,String> {

//    Page<UnitConversion> findAllBy(Pageable pageable);
    List<UnitConversion> findAll();
    UnitConversion findFirstByOid(String id);
}
