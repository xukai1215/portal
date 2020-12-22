package njgis.opengms.portal.dao;

import njgis.opengms.portal.dto.dataItem.DataItemResultDTO;
import njgis.opengms.portal.entity.DataItem;
import njgis.opengms.portal.entity.Item;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

/**
 * @InterfaceName DataItemDao
 * @Description todo
 * @Author sun_liber
 * @Date 2019/2/13
 * @Version 1.0.0
 */
public interface DataItemDao extends MongoRepository<DataItem,String> {

    List<Item> findAllByAuthorshipIsNotNull();

    Page<DataItem> findAllByContentTypeAndNameContainsIgnoreCaseAndClassificationsIn(String contentType,String name,List<String> cls,Pageable pageable);

    DataItem findFirstById(String id);

    DataItem findFirstByDistributedNodeDataId(String distributedNodeDataId);

    Page<DataItem> findByAuthorAndNameContains(Pageable pageable, String author, String name);

    Page<DataItem> findByAuthorAndNameContainsAndStatusIn(Pageable pageable, String author, String name, List<String> status);

    Page<DataItemResultDTO> findByClassificationsIn(Pageable pageable,List<String> cate);

    Page<DataItem> findAll(Pageable pageable);

    //test
    Page<DataItem>  findByClassificationsIsIn(Pageable pageable,String classification);

    //page dataitems search
    Page<DataItem>  findByNameContainingOrDescriptionContainingOrKeywordsContaining(Pageable pageable,String name,String description,String keywords);

    //用户中心所有用户上传的数据条目列表
    Page<DataItem> findByAuthor(Pageable pageable,String author);

    List<Item> findAllByAuthor(String author);

    Page<DataItemResultDTO> findByNameLikeIgnoreCaseAndStatusNotLike(Pageable pageable, String name, String statusNotLike);

    Page<DataItemResultDTO> findByNameLikeAndAuthorIgnoreCaseAndStatusNotLike(Pageable pageable, String name, String author, String statusNotLike);

    Page<DataItemResultDTO> findByNameContainsIgnoreCaseAndUserName(String name, String userName, Pageable pageable);


    List<DataItem> findAllByClassificationsContaining(List<String> classifications);


    List<DataItem> findByNameLike(String name);
    List<DataItem> findByDescriptionLike(String description);
    List<DataItem> findByDetailLike(String detail);
    List<DataItem> findByAuthorLike(String author);

    List<DataItem> findByKeywordsLike(String author);
    List<DataItem> findByClassificationsLike(String author);

    List<DataItem> findByDataType(String type);

    Page<DataItemResultDTO> findAllByClassificationsAndTabTypeIn(String classification, String tabType, Pageable pageable);


    List<DataItem> findAllByTabType(String tabType);

}
