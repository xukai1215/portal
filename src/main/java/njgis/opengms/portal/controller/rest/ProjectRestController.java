package njgis.opengms.portal.controller.rest;

import njgis.opengms.portal.bean.JsonResult;
import njgis.opengms.portal.dto.project.ProjectAddDTO;
import njgis.opengms.portal.dto.project.ProjectFindDTO;
import njgis.opengms.portal.entity.support.Project;
import njgis.opengms.portal.service.ProjectService;
import njgis.opengms.portal.utils.ResultUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

@RestController
@RequestMapping(value="/project")
public class ProjectRestController {
    @Autowired
    ProjectService projectService;



    @RequestMapping(value = "/getByUserOidBySort",method = RequestMethod.GET)
    JsonResult getByUserOidBySort(ProjectFindDTO projectFindDTO, HttpServletRequest request){
        HttpSession session=request.getSession();
        String userName=session.getAttribute("uid").toString();
        if(userName==null){
            return ResultUtils.error(-1,"no login");
        }

        System.out.println("/project");
        return ResultUtils.success(projectService.getByUserOidBySort(projectFindDTO,userName));
    }


    @RequestMapping(value="/searchByName",method= RequestMethod.GET)
    JsonResult searchByTitle(ProjectFindDTO projectFindDTO, HttpServletRequest request){
        HttpSession session=request.getSession();
        String userName=session.getAttribute("uid").toString();

        if(userName==null){
            return ResultUtils.error(-1,"no login");
        }

        return ResultUtils.success(projectService.searchByTitle(projectFindDTO,userName));
    }


    @RequestMapping(value="/searchByNameByOid",method= RequestMethod.GET)
    JsonResult searchByTitle(ProjectFindDTO projectFindDTO, String oid){
        return ResultUtils.success(projectService.searchByTitleByOid(projectFindDTO,oid));
    }

    @RequestMapping(value="/listByUserOid",method = RequestMethod.GET)
    JsonResult listByUserOid(ProjectFindDTO projectFindDTO, @RequestParam(value="oid")String oid){
        return ResultUtils.success(projectService.listByUserOid(projectFindDTO,oid));
    }

    @RequestMapping(value="/add",method=RequestMethod.POST)
    public JsonResult addNewProject(@RequestBody ProjectAddDTO projectAddDTO, HttpServletRequest httpServletRequest){
        System.out.println(projectAddDTO);
        HttpSession session=httpServletRequest.getSession();
        String userName=session.getAttribute("uid").toString();
        if(userName==null){
            return ResultUtils.error(-1,"no login");
        }
        Project project=projectService.addNewProject(projectAddDTO,userName);
        return ResultUtils.success(project.getOid());
    }

    @RequestMapping(value="/editByOid",method=RequestMethod.POST)
    public JsonResult editArticle(@RequestBody ProjectAddDTO projectAddDTO){
        String oid=projectAddDTO.getOid();
        Project project=projectService.editProject(projectAddDTO,oid);
        System.out.println("/editProject");
        return ResultUtils.success(project.getOid());
    }



    @RequestMapping(value="/deleteByOid",method=RequestMethod.POST)
    public JsonResult deleteByOid(String oid,HttpServletRequest request){
        HttpSession session=request.getSession();
        String userName=session.getAttribute("uid").toString();
        if(userName==null){
            return ResultUtils.error(-1,"no login");
        }else{
            return ResultUtils.success(projectService.deleteByOid(oid,userName));
        }
    }
}
