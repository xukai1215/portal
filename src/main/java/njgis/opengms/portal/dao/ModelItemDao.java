package njgis.opengms.portal.dao;

import njgis.opengms.portal.dto.modelItem.ModelItemResultDTO;
import njgis.opengms.portal.entity.ModelItem;
import njgis.opengms.portal.service.ModelItemService;
import org.springframework.cglib.core.Predicate;
import org.springframework.data.domain.*;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.ArithmeticOperators;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.MongoRepository;

import org.springframework.data.repository.query.Param;


import java.util.ArrayList;
import java.util.List;

/**
 * @ClassName ModelItemDao
 * @Description todo
 * @Author Kai
 * @Date 2019/2/21
 * @Version 1.0.0
 * TODO
 */
public interface ModelItemDao extends MongoRepository<ModelItem,String> {

    ModelItem findFirstByOid(String id);

    ModelItem findFirstByName(String name);

    //Page<ModelItem> findByNameLike(String name, Pageable pageable);

    List<ModelItem> findByNameLike(String name);

    Page<ModelItemResultDTO> findAllByNameContains(String name,Pageable pageable);

    Page<ModelItemResultDTO> findByNameContainsIgnoreCase(String name,Pageable pageable);
    Page<ModelItem> findByNameLikeIgnoreCase(String name,Pageable pageable);

    Page<ModelItemResultDTO> findByClassificationsIn(List<String> classes,Pageable pageable);

    Page<ModelItemResultDTO> findByNameContainsIgnoreCaseAndClassificationsIn(String name,List<String> classes,Pageable pageable);

    Page<ModelItemResultDTO> findByAuthor(String author,Pageable pageable);

    Page<ModelItemResultDTO> findByNameContainsIgnoreCaseAndAuthor(String name, String author, Pageable pageable);


    List<ModelItem> findAllByClassificationsIn(String cla);

    List<ModelItem> findAllByClassificationsIn(List<String> clas);


}
