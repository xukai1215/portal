package njgis.opengms.portal.dao;

import njgis.opengms.portal.entity.DataApplication;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

/**
 * @Author mingyuan
 * @Date 2020.07.30 18:38
 */

public interface DataApplicationDao extends MongoRepository<DataApplication, String> {
    DataApplication findFirstByOid(String oid);

    DataApplication findFirstById(String id);

    Page<DataApplication> findByAuthorAndTypeAndStatusNotLike(Pageable pageable, String author, String type,String status);

    Page<DataApplication> findByAuthorAndNameContainsAndTypeAndStatusNotLike(Pageable pageable, String author, String name, String type,String status);
    Page<DataApplication> findByNameLikeAndStatusNotLike(Pageable pageable,String name,String status);

    Page<DataApplication> findByStatusNotLike(String status,Pageable pageable);

    Page<DataApplication> findByClassificationsInAndStatusNotLike(List<String> classifications,Pageable pageable,String status);

    Page<DataApplication> findByMethodLikeAndNameLikeAndStatusNotLike(String method,String name,String status,Pageable pageable);

    Page<DataApplication> findByMethodLikeAndStatusNotLike(String method,String status,Pageable pageable);

    Page<DataApplication> findByNameLikeAndStatusNotLike(String name,String status,Pageable pageable);
    //
    // List<DataApplication> findAllByAuthorshipIsNotNull();
    //
    // Page<DataApplication> findAllByContentTypeAndNameContainsIgnoreCaseAndClassificationsIn(String contentType,String Name,List<String> cls,Pageable pageable);

}
