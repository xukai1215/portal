package njgis.opengms.portal.dao;

import njgis.opengms.portal.entity.GeoIcon;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;


public interface GeoIconDao extends MongoRepository<GeoIcon,String> {

    Page<GeoIcon> findByIconParentId(String parentId, Pageable pageable);

    List<GeoIcon> findAllByIconParentId(String parentId);

    GeoIcon getByIconId(String id);

}
