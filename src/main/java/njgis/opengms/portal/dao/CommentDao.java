package njgis.opengms.portal.dao;

import njgis.opengms.portal.dto.CommentResultDTO;
import njgis.opengms.portal.entity.Comment;
import njgis.opengms.portal.enums.ItemTypeEnum;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface CommentDao extends MongoRepository<Comment,String> {

     Comment findByOid(String oid);

     Page<CommentResultDTO> findAllByRelateItemTypeAndRelateItemId(ItemTypeEnum type, String oid, Pageable pageable);

}
