package njgis.opengms.portal.dao;

import njgis.opengms.portal.entity.DataApplicationVersion;
import njgis.opengms.portal.entity.ModelItemVersion;
import njgis.opengms.portal.entity.ThemeVersion;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;


/**
 * @Auther mingyuan
 * @Data 2020.05.09 20:35
 */
public interface ThemeVersionDao extends MongoRepository<ThemeVersion,String> {
    List<ThemeVersion> findAllByOid(String oid, Pageable pageable);

    ThemeVersion findFirstByOid(String oid);

    ThemeVersion findByThemeOid(String themeOid);

    List<ThemeVersion> findFirstByCreatorAndStatus(String creator, Integer verStatus);

}
