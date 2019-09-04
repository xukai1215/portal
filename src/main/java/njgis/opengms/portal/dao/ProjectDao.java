package njgis.opengms.portal.dao;

import njgis.opengms.portal.dto.project.ProjectResultDTO;
import njgis.opengms.portal.entity.support.Project;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ProjectDao extends MongoRepository<Project,String> {
    Project findFirstByOid(String id);

    Project findFirstByProjectName(String projectName);

    Page<Project> findByProjectNameLike(String projectName, Pageable pageable);

    List<Project> findByProjectNameLike(String projectName);

    Page<ProjectResultDTO> findAllByProjectNameContains(String projectName, Pageable pageable);
    //
    Page<ProjectResultDTO> findByProjectNameContainsIgnoreCase(String projectName, Pageable pageable);
    //
    Page<Project> findByProjectNameLikeIgnoreCase(String projectName,Pageable pageable);

    Page<Project> findByFundAgency(String fundAgency,Pageable pageable);

//
    Page<ProjectResultDTO> findByProjectNameContainsIgnoreCaseAndContributor(String projectName, String contributor, Pageable pageable);

    Page<ProjectResultDTO> findByContributor(String contributor,Pageable pageable);

    void deleteProjectByOid(String oid);
}
