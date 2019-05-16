package njgis.opengms.portal.dao;

import njgis.opengms.portal.entity.Comments;
import njgis.opengms.portal.entity.DataItem;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface CommentsDao extends MongoRepository<Comments,String> {

}
