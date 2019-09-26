package njgis.opengms.portal.dao;


import njgis.opengms.portal.dto.educationExperience.EducationExperienceResultDTO;
import njgis.opengms.portal.entity.support.EducationExperience;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface EducationExperienceDao extends MongoRepository<EducationExperience,String> {

    EducationExperience findFirstByOid(String oid);

    Page<EducationExperienceResultDTO> findByContributor(String contributor, Pageable pageable);

    List<EducationExperienceResultDTO> findByContributor(String contributor, Sort sort);


    void deleteEducationExperienceByOid(String oid);

}
