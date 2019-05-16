package njgis.opengms.portal.dao;

import njgis.opengms.portal.entity.Categorys;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface CategoryDao extends MongoRepository<Categorys,String> {

//     Categorys findFirstByCategory(String category);
//     Categorys findByCategory(String dataItem);
     List<Categorys> findAllByCategory(String category);

}
