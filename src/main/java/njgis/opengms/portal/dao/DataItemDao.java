package njgis.opengms.portal.dao;

import njgis.opengms.portal.entity.DataItem;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

/**
 * @InterfaceName DataItemDao
 * @Description todo
 * @Author sun_liber
 * @Date 2019/2/13
 * @Version 1.0.0
 */
public interface DataItemDao extends MongoRepository<DataItem,String> {

    List<DataItem> findByName(String name);



    List<DataItem> findAllByAuthor(String author);
    List<DataItem> findAllByClassificationsContaining(List<String> classifications);


    List<DataItem> findByNameLike(String name);
    List<DataItem> findByDescriptionLike(String description);
    List<DataItem> findByDetailLike(String detail);
    List<DataItem> findByAuthorLike(String author);

    List<DataItem> findByKeywordsLike(String author);
    List<DataItem> findByClassificationsLike(String author);








}
