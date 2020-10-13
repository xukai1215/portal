package njgis.opengms.portal.dao;

import njgis.opengms.portal.entity.DataCategorys;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface DataCategorysDao extends MongoRepository<DataCategorys, String> {
    DataCategorys findFirstById(String id);

    List<DataCategorys> findAllByParentCategory(String parentCategory);

    DataCategorys findFirstByCategory(String category);
}
