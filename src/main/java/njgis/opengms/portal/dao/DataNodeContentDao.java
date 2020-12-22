package njgis.opengms.portal.dao;

import njgis.opengms.portal.entity.DataItemVersion;
import njgis.opengms.portal.entity.DataNodeContent;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface DataNodeContentDao extends MongoRepository<DataNodeContent,String> {

    DataNodeContent findAllByServerIdAndToken(String id,String token);

    List<DataNodeContent> findAllByTokenAndType(String id, String token);

    DataNodeContent findAllByUserId(String user);
}
