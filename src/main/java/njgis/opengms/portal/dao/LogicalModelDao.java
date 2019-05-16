package njgis.opengms.portal.dao;

import njgis.opengms.portal.entity.LogicalModel;
import njgis.opengms.portal.entity.ModelItem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

/**
 * @ClassName ModelItemDao
 * @Description todo
 * @Author Kai
 * @Date 2019/2/21
 * @Version 1.0.0
 * TODO
 */
public interface LogicalModelDao extends MongoRepository<LogicalModel,String> {

    LogicalModel findFirstByOid(String id);

    //Page<ModelItem> findByNameLike(String name, Pageable pageable);


    Page<LogicalModel> findByNameContainsIgnoreCase(String name, Pageable pageable);

    Page<LogicalModel> findByClassificationsIn(List<String> classes, Pageable pageable);

    Page<LogicalModel> findByNameContainsIgnoreCaseAndClassificationsIn(String name, List<String> classes, Pageable pageable);

    Page<LogicalModel> findByAuthor(String author,Pageable pageable);

    Page<LogicalModel> findByNameContainsIgnoreCaseAndAuthor(String name, String author,Pageable pageable);

}
