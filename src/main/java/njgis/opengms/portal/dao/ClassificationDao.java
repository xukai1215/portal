package njgis.opengms.portal.dao;

import njgis.opengms.portal.entity.Classification;
import org.springframework.data.mongodb.repository.MongoRepository;

/**
 * @ClassName ClassificationDao
 * @Description todo
 * @Author Kai
 * @Date 2019/2/21
 * @Version 1.0.0
 * TODO
 */
public interface ClassificationDao extends MongoRepository<Classification,String> {

    Classification findFirstByOid(String id);

    Classification findFirstByNameEn(String nameEn);
}
