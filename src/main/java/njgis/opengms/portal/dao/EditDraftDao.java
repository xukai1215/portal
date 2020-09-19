package njgis.opengms.portal.dao;

import njgis.opengms.portal.entity.EditDraft;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface EditDraftDao extends MongoRepository<EditDraft,String> {
    EditDraft findFirstByOid(String oid);

    EditDraft findFirstByItemOidAndUser(String item, String user);

    EditDraft findFirstByItemTypeAndUser(String type, String user);

    EditDraft findFirstByEditTypeAndUser(String type, String user);

    List<EditDraft> findByUserOrderByLastModifyTime(String user, Sort sort);

    List<EditDraft> findByUserAndItemTypeAndEditTypeOrderByLastModifyTime(String user, String itemType, String editType ,Sort sort);

    Page<EditDraft> findByUser(String user, Pageable pageable);

}
