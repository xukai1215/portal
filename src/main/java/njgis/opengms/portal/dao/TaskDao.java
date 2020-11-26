package njgis.opengms.portal.dao;

import njgis.opengms.portal.entity.Task;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Date;
import java.util.List;


public interface TaskDao extends MongoRepository<Task,String> {

    List<Task> findAllByComputableId(String oid);

    List<Task> findAllByComputableIdAndRunTimeGreaterThanEqual(String oid, Date date);

    List<Task> findAllByComputableIdInAndRunTimeGreaterThanEqual(List<String> oids, Date date);

    Task findFirstByTaskId(String taskId);

//    Task findFirstByTaskId(String taskId);

    List<Task> findByUserId(String userId);

    List<Task> findByUserId(String userId, Sort sort);

    Page<Task> findByUserId(String userId,Pageable pageable);

    Page<Task> findByUserIdAndStatusBetween(String userId,int statusFrom,int statusTo,Pageable pageable);

    Page<Task> findByUserIdAndIntegrate(String userId,Boolean integrate,Pageable pageable);

    List<Task> findByUserIdAndIntegrate(String userId,Boolean integrate,Sort sort);

    List<Task> findAllByUserIdAndStatus(String userId, int status);

    Page<Task> findByComputableNameContainsIgnoreCaseAndUserId(String name,String author,Pageable pageable);

    Page<Task> findByComputableNameAndUserId(String name,String author,Pageable pageable);

    Page<Task> findByComputableId(String modelId,Pageable pageable);

    Page<Task> findByComputableIdAndPermission(String modelId,String permission,Pageable pageable);

    Page<Task> findByComputableIdAndPermissionAndStatus(String modelId,String permission,int status,Pageable pageable);

    Page<Task> findByComputableIdAndStatus(String modelId,int status,Pageable pageable);

    Page<Task> findByComputableIdAndUserId(String modelId,String userId,Pageable pageable);

    Page<Task> findByComputableIdAndUserIdAndStatus(String modelId,String userId,int status,Pageable pageable);
//
    Page<Task> findByComputableIdAndPermissionAndUserIdNot(String modelId,String permission,String userId,Pageable pageable);

    Page<Task> findByComputableIdAndPermissionAndStatusAndUserIdNot(String modelId,String permission,int status,String userId,Pageable pageable);

    Task findFirstByOid(String oid);

    List<Task> findAllByComputableIdAndFlag(String oid, boolean flag);

    List<Task> findAllByComputableIdAndFlagAndRunTimeAfter(String oid, boolean flag, Date date);


}
