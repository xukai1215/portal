package njgis.opengms.portal.dao;

import njgis.opengms.portal.entity.IconRelation;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface IconRelationDao extends MongoRepository<IconRelation,String> {

    IconRelation getByName(String name);

    IconRelation getByGeoId(String id);

}
