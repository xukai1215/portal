package njgis.opengms.portal.dao;

import njgis.opengms.portal.dto.dataItem.DataItemResultDTO;
import njgis.opengms.portal.entity.DataHubs;
import njgis.opengms.portal.entity.DataItem;
import njgis.opengms.portal.entity.DataItemNew;
import njgis.opengms.portal.entity.support.AuthorInfo;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Date;
import java.util.List;

/**
 * @Author mingyuan
 * @Date 2020.09.30 14:58
 */
public interface DataHubsDao extends MongoRepository<DataHubs, String> {
    DataHubs findFirstById(String id);
    DataHubs findFirstByAuthor(String author);
    DataHubs findAllByCreateTime(Date time);
    DataHubs findFirstByName(String name);
    DataHubs findFirstByDescription(String description);
    DataHubs findFirstByDetail(String detail);
    DataHubs findFirstByClassifications(List<String> classifications);
    DataHubs findFirstByAuthorship(List<AuthorInfo> authorship);
    DataHubs findFirstByReference(String reference);
    DataHubs findFirstByDistributedNodeDataId(String distributedId);
    //    Page<DataItemResultDTO> findAllByClassificationsIn(String classification, Pageable pageable);
    Page<DataItemResultDTO> findAllByClassificationsIn(String classification, Pageable pageable);
    //用户中心所有用户上传的数据条目列表
    Page<DataHubs> findByAuthor(Pageable pageable, String author);
    Page<DataItemResultDTO> findByNameLikeIgnoreCase(Pageable pageable, String name);
    Page<DataItemResultDTO> findByDescriptionIsContaining(Pageable pageable, String description);
    Page<DataItemResultDTO> findByAuthorLikeIgnoreCase(Pageable pageable, String author);
    Page<DataItemResultDTO> findByKeywordsContains(Pageable pageable, String name);

    Page<DataItemResultDTO> findByNameLikeAndAuthorIgnoreCase(Pageable pageable, String name, String author);
    List<DataHubs> findAllByClassificationsIn(String oid);

    int countAllByAuthor(String oid);

}
