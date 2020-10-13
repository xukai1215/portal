package njgis.opengms.portal.dao;

import njgis.opengms.portal.entity.DataApplication;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

/**
 * @Author mingyuan
 * @Date 2020.07.30 18:38
 */

public interface DataApplicationDao extends MongoRepository<DataApplication, String> {
    DataApplication findFirstByOid(String oid);

    DataApplication findFirstById(String id);

    Page<DataApplication> findByAuthorAndType(Pageable pageable, String author, String type);

    Page<DataApplication> findByAuthorAndNameContainsAndType(Pageable pageable, String author, String name, String type);

//    DataApplication findBy
}
