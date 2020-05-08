package njgis.opengms.portal.controller.rest;

import njgis.opengms.portal.bean.JsonResult;
import njgis.opengms.portal.service.GeoIconService;
import njgis.opengms.portal.utils.ResultUtils;
import org.bson.types.Binary;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@CrossOrigin
@RestController
@RequestMapping(value="/geoIcon")
public class GeoIconController {

    @Autowired
    GeoIconService geoIconService;

    @ResponseBody
    @RequestMapping(value="/getImage",method = RequestMethod.GET,produces = MediaType.IMAGE_PNG_VALUE)
    byte[] getGeoIconImage(String iconId) throws IOException {
        Binary image = geoIconService.getGeoIconImage(iconId);

        return image.getData();     //将in作为输入流，读取图片存入image中，
    }

    @RequestMapping(value="/parentList",method = RequestMethod.GET)
    JsonResult getParentList(){
        return ResultUtils.success(geoIconService.getGeoIconParentInfo());
    }

    @RequestMapping(value="/list",method = RequestMethod.GET)
    JsonResult getList(@RequestParam(value="uid") String parentId,
                       @RequestParam(value="page") int page,
                       @RequestParam(value="sortType") String sortType){
        return ResultUtils.success(geoIconService.getGeoIconList(parentId,page,sortType));
    }

    @RequestMapping(value="/list2",method = RequestMethod.GET)
    JsonResult getList(@RequestParam(value="uid") String parentId){
        return ResultUtils.success(geoIconService.getGeoIconList(parentId,-1,"name"));
    }

}
