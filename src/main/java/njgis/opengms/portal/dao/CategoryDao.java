package njgis.opengms.portal.dao;

import njgis.opengms.portal.entity.Categorys;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface CategoryDao extends MongoRepository<Categorys,String> {

     List<Categorys> findAllByCategory(String category);

     Categorys findFirstById(String id);

     Categorys findFirstByCategory(String category);

}
