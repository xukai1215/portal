package njgis.opengms.portal.dao;

import njgis.opengms.portal.entity.Authorship;
import org.springframework.data.mongodb.repository.MongoRepository;

/**
 * @ClassName ClassificationDao
 * @Description todo
 * @Author Kai
 * @Date 2019/4/20
 * @Version 1.0.0
 * TODO
 */
public interface AuthorshipDao extends MongoRepository<Authorship,String> {

   Authorship findByEmail(String email);

   Authorship findByHomepage(String homepage);

   Authorship findByName(String homepage);

   Authorship findByAliasIn(String name);


}
