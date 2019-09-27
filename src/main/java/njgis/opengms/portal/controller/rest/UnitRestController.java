package njgis.opengms.portal.controller.rest;

import njgis.opengms.portal.bean.JsonResult;
import njgis.opengms.portal.dto.Unit.UnitFindDTO;
import njgis.opengms.portal.service.UnitService;
import njgis.opengms.portal.utils.ResultUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value="/unit")
public class UnitRestController {
    @Autowired
    UnitService unitService;

    @RequestMapping(value="/searchByNameByOid",method= RequestMethod.GET)
    JsonResult searchByTitle(UnitFindDTO unitFindDTO, String oid){
        System.out.println("123456");
        return ResultUtils.success(unitService.searchByTitleByOid(unitFindDTO,oid));
    }

}
