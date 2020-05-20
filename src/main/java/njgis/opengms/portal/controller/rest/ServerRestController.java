package njgis.opengms.portal.controller.rest;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.google.gson.JsonArray;
import njgis.opengms.portal.bean.JsonResult;
import njgis.opengms.portal.dao.ModelContainerDao;
import njgis.opengms.portal.entity.ModelContainer;
import njgis.opengms.portal.entity.support.GeoInfoMeta;
import njgis.opengms.portal.service.ComputerResourceService;
import njgis.opengms.portal.service.UserService;
import njgis.opengms.portal.utils.ResultUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import java.util.List;

@RestController
@RequestMapping(value="/server")
public class ServerRestController {
//    @Autowired
//    ModelContainerDao modelContainerDao;

    @Autowired
    UserService userService;

    @Autowired
    ComputerResourceService computerResourceService;

    @RequestMapping(value="",method= RequestMethod.GET)
    ModelAndView serverIndex(){
        ModelAndView modelAndView=new ModelAndView();
        modelAndView.setViewName("Server");

        return modelAndView;
    }

    //add by wangming at 2020.05.18 替换获取已经注册的计算资源接口
    @RequestMapping(value = "serverNodes", method = RequestMethod.GET)
    JsonResult getServerNodes(){
        JSONArray serverNodesLists = computerResourceService.getAllComputerResource();
        JSONArray jsonArray = new JSONArray();
        for(int i = 0; i < serverNodesLists.size(); i++){
            JSONObject computerResource = serverNodesLists.getJSONObject(i);
            GeoInfoMeta geoInfo = JSONObject.toJavaObject(computerResource.getJSONObject("geoInfo"), GeoInfoMeta.class);
            JSONObject object = new JSONObject();
            object.put("geoJson",geoInfo);
            jsonArray.add(object);
        }
        return ResultUtils.success(jsonArray);
    }
}
