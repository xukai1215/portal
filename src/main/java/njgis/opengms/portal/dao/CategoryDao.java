package njgis.opengms.portal.dao;

import njgis.opengms.portal.entity.Categorys;
import njgis.opengms.portal.entity.DataItem;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface CategoryDao extends MongoRepository<Categorys,String> {

     List<Categorys> findAllByCategory(String category);



}
