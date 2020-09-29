package njgis.opengms.portal.dao;

import njgis.opengms.portal.entity.Classification;
import njgis.opengms.portal.entity.Classification2;
import org.springframework.data.mongodb.repository.MongoRepository;

/**
 * @ClassName ClassificationDao
 * @Description todo
 * @Author Kai
 * @Date 2019/2/21
 * @Version 1.0.0
 * TODO
 */
public interface Classification2Dao extends MongoRepository<Classification2,String> {

    Classification findFirstByOid(String id);

    Classification findFirstByNameEn(String nameEn);
}
