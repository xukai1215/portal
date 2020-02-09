package njgis.opengms.portal.dao;

import njgis.opengms.portal.entity.Feedback;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface FeedbackDao extends MongoRepository<Feedback,String> {

}
