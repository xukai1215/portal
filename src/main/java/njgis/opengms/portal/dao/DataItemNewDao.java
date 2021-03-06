package njgis.opengms.portal.dao;

import njgis.opengms.portal.dto.dataItem.DataItemResultDTO;
import njgis.opengms.portal.dto.modelItem.ModelItemResultDTO;
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
 * @Date 2020.09.02 23:41
 */
public interface DataItemNewDao extends MongoRepository<DataItemNew,String> {
    DataItemNew findFirstById(String id);
    DataItemNew findFirstByAuthor(String author);
    DataItemNew findAllByCreateTime(Date time);
    DataItemNew findFirstByName(String name);
    DataItemNew findFirstByDescription(String description);
    DataItemNew findFirstByDetail(String detail);
    DataItemNew findFirstByClassifications(List<String> classifications);
    DataItemNew findFirstByAuthorship(List<AuthorInfo> authorship);
    DataItemNew findFirstByReference(String reference);
    DataItemNew findFirstByDistributedNodeDataId(String distributedId);
    Page<DataItemResultDTO> findAllByClassificationsIn(String classification, Pageable pageable);
}
