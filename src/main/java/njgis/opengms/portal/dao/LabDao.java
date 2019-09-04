package njgis.opengms.portal.dao;

import njgis.opengms.portal.entity.support.Lab;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface LabDao extends MongoRepository<Lab,String> {
    Lab findFirstByLabName(String labName);
    Lab findByLeaderName(String leaderName);
//    Lab findByMemberNameLike(String memberName);

}
