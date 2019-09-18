package njgis.opengms.portal.dao;

import njgis.opengms.portal.entity.support.AwardandHonor;
import org.springframework.data.mongodb.repository.MongoRepository;


public interface AwardandHonorDao extends MongoRepository<AwardandHonor,String> {
//    AwardandHonor findFirstByOid(String id);
//    AwardandHonor findByName(String name);
//    Page<AwardandHonorResultDTO> findByContributor(String contributor, Pageable pageable);
}
