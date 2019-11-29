package njgis.opengms.portal.dao;

import njgis.opengms.portal.dto.theme.ThemeResultDTO;
import njgis.opengms.portal.entity.Theme;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

/**
 * @Auther mingyuan
 * @Data 2019.10.23 17:13
 */
public interface ThemeDao extends MongoRepository<Theme,String> {
    Theme findByOid(String oid);

    Theme findFirstByOid(String id);

    Page<ThemeResultDTO> findByAuthor(String author, Pageable pageable);

//    Page<Theme> findByClassarr(String classarr, Pageable pageable);
//
//    Page<Theme> findByApplication(String application, Pageable pageable);
//
//    Page<Theme> findByDataClassInfo(String dataclassinfo, Pageable pageable);

    //Page<ThemeResultDTO> findByClassarr(String )
}
