package njgis.opengms.portal.dao;

import njgis.opengms.portal.dto.conference.ConferenceResultDTO;
import njgis.opengms.portal.entity.support.Conference;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ConferenceDao extends MongoRepository<Conference,String> {
    Conference findFirstByOid(String id);

    Conference findFirstByTitle(String title);

    //Page<ModelItem> findByTitleLike(String title, Pageable pageable);

    List<Conference> findByTitleLike(String title);

    Page<ConferenceResultDTO> findAllByTitleContains(String title, Pageable pageable);
    //
    Page<ConferenceResultDTO> findByTitleContainsIgnoreCase(String title, Pageable pageable);
    //
    Page<Conference> findByTitleLikeIgnoreCase(String title,Pageable pageable);

    Page<Conference> findByHoldLocation(String holdLocation,Pageable pageable);
    Page<Conference> findByTheme(String theme,Pageable pageable);
    //
//
    Page<ConferenceResultDTO> findByContributor(String contributor,Pageable pageable);

}
