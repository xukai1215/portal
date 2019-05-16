package njgis.opengms.portal.dao;

import njgis.opengms.portal.entity.Classification;
import njgis.opengms.portal.entity.Template;
import njgis.opengms.portal.entity.Unit;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

/**
 * @ClassName ClassificationDao
 * @Description todo
 * @Author Kai
 * @Date 2019/2/21
 * @Version 1.0.0
 * TODO
 */
public interface TemplateDao extends MongoRepository<Template,String> {
    Template findByOid(String oid);

    Page<Template> findByParentId(String parentId, Pageable pageable);

    Page<Template> findByNameContainsIgnoreCase(String name, Pageable pageable);

    Page<Template> findByParentIdIn(List<String> parentIds, Pageable pageable);
}
