package njgis.opengms.portal.dao;

import njgis.opengms.portal.dto.UserResultDTO;
import njgis.opengms.portal.entity.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface UserDao extends MongoRepository<User,String> {

    User findFirstById(String id);

    User findFirstByOid(String id);

    User findFirstByUserId(String userId);

    User findFirstByName(String name);

    User findFirstByNameLikeIgnoreCase(String name);

    User findFirstByEmail(String email);

    User findFirstByUserName(String username);

    UserResultDTO findByUserName(String userName);

    List<User> findAllByUserIdContains(String userId);

    @Query("{name:{$regex: '?0',$options:'i'}}")
    List<User> findAllByNameContainsIgnoreCase(String name);
}
