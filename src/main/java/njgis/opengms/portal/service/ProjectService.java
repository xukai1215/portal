package njgis.opengms.portal.service;

import com.alibaba.fastjson.JSONObject;
import njgis.opengms.portal.dao.ProjectDao;
import njgis.opengms.portal.dao.UserDao;
import njgis.opengms.portal.dto.project.ProjectFindDTO;
import njgis.opengms.portal.dto.project.ProjectResultDTO;
import njgis.opengms.portal.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
public class ProjectService {
    @Autowired
    UserDao userDao;

    @Autowired
    ProjectDao projectDao;

    public JSONObject listByUserOid(ProjectFindDTO projectFindDTO,String oid){
        int page = projectFindDTO.getPage();
        int pageSize = projectFindDTO.getPageSize();
        Boolean asc = projectFindDTO.getAsc();

        Sort sort=new Sort(asc?Sort.Direction.ASC:Sort.Direction.DESC,"viewCount");
        Pageable pageable= PageRequest.of(page,pageSize,sort);
        User user=userDao.findFirstByOid(oid);
        Page<ProjectResultDTO> projectResultDTOpage=projectDao.findByContributor(user.getUserName(),pageable);
        JSONObject result=new JSONObject();
        result.put("list",projectResultDTOpage.getContent());
        result.put("total",projectResultDTOpage.getTotalElements());

        System.out.println("ProjectService");
        return result;


    }


}
