package njgis.opengms.portal.dao;

import njgis.opengms.portal.entity.Comment;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface CommentDao extends MongoRepository<Comment,String> {

     Comment findByOid(String oid);

}
