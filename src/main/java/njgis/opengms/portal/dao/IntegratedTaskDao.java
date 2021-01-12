package njgis.opengms.portal.dao;

import njgis.opengms.portal.entity.IntegratedTask;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface IntegratedTaskDao extends MongoRepository<IntegratedTask,String> {

    IntegratedTask findByTaskId(String taskId);

    IntegratedTask findByOid(String taskOid);

    List<IntegratedTask> findByUserIdAndIntegrate(String userName, boolean integrate);

    Page<IntegratedTask> findByUserIdAndIntegrate(String userName, boolean integrate, Pageable pageable);

    Page<IntegratedTask> findByUserIdAndIntegrateAndTaskNameContainsIgnoreCase(String userName, boolean integrate,String name,Pageable pageable);

    Page<IntegratedTask> findByUserIdAndIntegrateAndStatus(String userName, boolean integrate, int status,Pageable pageable);

    Page<IntegratedTask> findByUserIdAndIntegrateAndStatusAndTaskNameContainsIgnoreCase(String userName, boolean integrate, int status,String name,Pageable pageable);
}
