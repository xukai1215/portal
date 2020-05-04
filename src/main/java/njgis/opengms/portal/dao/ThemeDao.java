package njgis.opengms.portal.dao;

import njgis.opengms.portal.dto.theme.ThemeResultDTO;
import njgis.opengms.portal.entity.Item;
import njgis.opengms.portal.entity.Theme;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

/**
 * @Auther mingyuan
 * @Data 2019.10.23 17:13
 */
public interface ThemeDao extends MongoRepository<Theme,String> {
    Theme findByOid(String oid);

    Theme findFirstByOid(String id);

    Page<ThemeResultDTO> findByAuthor(String author, Pageable pageable);

    List<Theme> findByAuthor(String author);

    List<Theme> findAll();

    Theme findByThemename(String themename);

    List<Item> findAllByAuthorshipIsNotNull();

//    Page<Theme> findByClassarr(String classarr, Pageable pageable);
//
//    Page<Theme> findByApplication(String application, Pageable pageable);
//
//    Page<Theme> findByDataClassInfo(String dataclassinfo, Pageable pageable);

    //Page<ThemeResultDTO> findByClassarr(String )
//    Page<ThemeResultDTO> findByNameContainsIgnoreCaseAndAuthor(String name, String author, Pageable pageable);

    Page<ThemeResultDTO> findByThemenameContainsIgnoreCaseAndAndAuthor(String name, String author, Pageable pageable);
}
