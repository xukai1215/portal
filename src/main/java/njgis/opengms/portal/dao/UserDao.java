package njgis.opengms.portal.dao;

import njgis.opengms.portal.entity.User;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserDao extends MongoRepository<User,String> {

    User findFirstByOid(String id);

    User findFirstByEmail(String email);

    User findFirstByUserName(String username);

}
