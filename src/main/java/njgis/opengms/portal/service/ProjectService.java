package njgis.opengms.portal.service;

import com.alibaba.fastjson.JSONObject;
import njgis.opengms.portal.dao.ProjectDao;
import njgis.opengms.portal.dao.UserDao;
import njgis.opengms.portal.dto.project.ProjectAddDTO;
import njgis.opengms.portal.dto.project.ProjectFindDTO;
import njgis.opengms.portal.dto.project.ProjectResultDTO;
import njgis.opengms.portal.entity.User;
import njgis.opengms.portal.entity.support.Project;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.UUID;

@Service
public class ProjectService {
    @Autowired
    UserDao userDao;
    @Autowired
    UserService userService;

    @Autowired
    ProjectDao projectDao;

    public Boolean findExisted(String titleName){
        List<Project> allProjects = projectDao.findAll();
        for (int i=0;i<allProjects.size();i++){
            if (titleName.equals(allProjects.get(i).getProjectName()))
                return true;
        }
        return false;
    }

    public JSONObject listByUserOid(ProjectFindDTO projectFindDTO,String userId){
        int page = projectFindDTO.getPage();
        int pageSize = projectFindDTO.getPageSize();
        Boolean asc = projectFindDTO.getAsc();

        Sort sort=new Sort(asc?Sort.Direction.ASC:Sort.Direction.DESC,"creatDate");
        Pageable pageable= PageRequest.of(page,pageSize,sort);
        User user=userDao.findFirstByUserId(userId);
        Page<ProjectResultDTO> projectResultDTOpage=projectDao.findByContributor(user.getUserName(),pageable);
        JSONObject result=new JSONObject();
        result.put("list",projectResultDTOpage.getContent());
        result.put("total",projectResultDTOpage.getTotalElements());

        return result;


    }

    public JSONObject searchByTitle(ProjectFindDTO projectFindDTO, String userName){
        int page=projectFindDTO.getPage();
        int pageSize = projectFindDTO.getPageSize();
        String sortElement=projectFindDTO.getSortElement();
        Boolean asc = projectFindDTO.getAsc();
        String name= projectFindDTO.getSearchText();

        Sort sort=new Sort(asc?Sort.Direction.ASC:Sort.Direction.DESC,sortElement);
        Pageable pageable=PageRequest.of(page,pageSize,sort);
        Page<ProjectResultDTO> projectResultDTOPage=projectDao.findByProjectNameContainsIgnoreCaseAndContributor(name,userName,pageable);

        JSONObject result=new JSONObject();
        result.put("list",projectResultDTOPage.getContent());
        result.put("total",projectResultDTOPage.getTotalElements());
        return result;

    }

    public JSONObject searchByTitleByOid(ProjectFindDTO projectFindDTO, String oid){
        String userName=userDao.findFirstByOid(oid).getUserName();
        int page=projectFindDTO.getPage();
        int pageSize = projectFindDTO.getPageSize();
        String sortElement=projectFindDTO.getSortElement();
        Boolean asc = projectFindDTO.getAsc();
        String name= projectFindDTO.getSearchText();

        Sort sort=new Sort(asc?Sort.Direction.ASC:Sort.Direction.DESC,sortElement);
        Pageable pageable=PageRequest.of(page,pageSize,sort);
        Page<ProjectResultDTO> projectResultDTOPage=projectDao.findByProjectNameContainsIgnoreCaseAndContributor(name,userName,pageable);

        JSONObject result=new JSONObject();
        result.put("list",projectResultDTOPage.getContent());
        result.put("total",projectResultDTOPage.getTotalElements());
        return result;

    }

    public int addNewProject(ProjectAddDTO projectAddDTO, String contributor){
        if (findExisted(projectAddDTO.getProjectName()))
            return 2;
        else{
            Project project=new Project();
            BeanUtils.copyProperties(projectAddDTO,project);
            Date now=new Date();
            project.setCreatDate(now);
            project.setContributor(contributor);
            project.setOid(UUID.randomUUID().toString());
            projectDao.insert(project);

            return 1;
        }


    }

    public JSONObject getByUserOidBySort(ProjectFindDTO projectFindDTO , String userName ){

        int page=projectFindDTO.getPage();
        int pageSize = projectFindDTO.getPageSize();
        String sortElement=projectFindDTO.getSortElement();
        Boolean asc = projectFindDTO.getAsc();


//        根据创建时间排序
        Sort sort=new Sort(asc?Sort.Direction.ASC : Sort.Direction.DESC, sortElement);
        Pageable pageable= PageRequest.of(page,pageSize,sort);
        Page<ProjectResultDTO> projectResultPage=projectDao.findByContributor(userName,pageable);

        JSONObject result=new JSONObject();
        result.put("list",projectResultPage.getContent());
        result.put("total", projectResultPage.getTotalElements());

        System.out.println(result);
        return result;

    }

    public Project editProject(ProjectAddDTO projectAddDTO, String oid){
        Project project=projectDao.findFirstByOid(oid);
        if(project==null) {}
        else {
            project.setProjectName(projectAddDTO.getProjectName());
            project.setStartTime(projectAddDTO.getStartTime());
            project.setEndTime(projectAddDTO.getEndTime());
            project.setRole(projectAddDTO.getRole());
            project.setFundAgency(projectAddDTO.getFundAgency());
            project.setAmount(projectAddDTO.getAmount());
        }
        projectDao.save(project);
        return project;
    }

    public int deleteByOid (String oid,String userName){
        Project project=projectDao.findFirstByOid(oid);
        if(project!=null){
            projectDao.deleteProjectByOid(oid);
            userService.projectItemMinusMinus(userName);
            return 1;
        }
        else

            return -1;



    }
}
