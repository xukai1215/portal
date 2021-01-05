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

    Page<DataApplication> findByAuthorAndType(Pageable pageable, String author, String type);

    Page<DataApplication> findByAuthorAndNameContainsAndType(Pageable pageable, String author, String name, String type);
    Page<DataApplication> findByNameLike(Pageable pageable,String name);

    Page<DataApplication> findAllByMethod(Pageable pageable,String method);

    Page<DataApplication> findAllByInvokable(Pageable pageable,boolean invokable);

    Page<DataApplication> findAllByMethodIn(Pageable pageable,List<String> method);

    Page<DataApplication> findAllByMethodAndNameContainsIgnoreCase(Pageable pageable,String method,String name);

    Page<DataApplication> findAllByMethodInAndNameContainsIgnoreCase(Pageable pageable,List<String> method,String name);

    Page<DataApplication> findByClassificationsIn(List<String> classifications,Pageable pageable);

    Page<DataApplication> findByMethodLikeIgnoreCaseAndNameLike(String method,String name,Pageable pageable);

    Page<DataApplication> findByMethodLikeIgnoreCaseAndNameLikeAndInvokable(String method,String name,Pageable pageable,boolean invokable);

    Page<DataApplication> findByMethodLikeIgnoreCaseAndNameLikeAndInvokeServicesNot(String method,String name,Pageable pageable);

    Page<DataApplication> findByMethodLike(String method, Pageable pageable);
    Page<DataApplication> findByMethodLikeIgnoreCase(String method, Pageable pageable);

    Page<DataApplication> findAllByMethodLikeIgnoreCase(String method,Pageable pageable);

    Page<DataApplication> findAllByMethodLikeIgnoreCaseAndInvokable(String method,Pageable pageable,boolean invokable);

    Page<DataApplication> findByNameLikeAndInvokable(String name,Pageable pageable,boolean invokable);

    Page<DataApplication> findByMethod(String method,Pageable pageable);

    Page<DataApplication> findByNameLike(String name,Pageable pageable);
    //
    // List<DataApplication> findAllByAuthorshipIsNotNull();
    //
    // Page<DataApplication> findAllByContentTypeAndNameContainsIgnoreCaseAndClassificationsIn(String contentType,String Name,List<String> cls,Pageable pageable);

//    DataApplication find
}
