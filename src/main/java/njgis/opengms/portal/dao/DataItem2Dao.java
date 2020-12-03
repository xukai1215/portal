package njgis.opengms.portal.dao;

import njgis.opengms.portal.dto.dataItem.DataItemResultDTO;
import njgis.opengms.portal.entity.DataHubs;
import njgis.opengms.portal.entity.DataItem2;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

/**
 * @Author mingyuan
 * @Date 2020.11.30 19:02
 */
public interface DataItem2Dao extends MongoRepository<DataItem2, String> {
    DataItem2 findFirstById(String id);
    Page<DataItemResultDTO> findAllByClassificationsAndTabTypeIn(String classification, String tabType, Pageable pageable);
    Page<DataItemResultDTO> findByNameLikeIgnoreCaseAndStatusNotLike(Pageable pageable, String name, String statusNotLike);
    void insert(DataHubs dataHubs1);
}
