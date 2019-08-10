package njgis.opengms.portal.controller.rest;

import njgis.opengms.portal.bean.JsonResult;
import njgis.opengms.portal.dto.project.ProjectFindDTO;
import njgis.opengms.portal.service.ProjectService;
import njgis.opengms.portal.utils.ResultUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value="/project")
public class projectRestController {
    @Autowired
    ProjectService projectService;

    @RequestMapping(value="/listByUserOid",method = RequestMethod.GET)
    JsonResult listByUserOid(ProjectFindDTO projectFindDTO, @RequestParam(value="oid")String oid){
        return ResultUtils.success(projectService.listByUserOid(projectFindDTO,oid));
    }

}
