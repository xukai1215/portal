package njgis.opengms.portal.controller.rest;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import njgis.opengms.portal.bean.JsonResult;
import njgis.opengms.portal.dao.ModelContainerDao;
import njgis.opengms.portal.entity.ModelContainer;
import njgis.opengms.portal.utils.ResultUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.List;

@RestController
@RequestMapping(value="/statistics")
public class StatisticRestController {
    @Autowired
    ModelContainerDao modelContainerDao;

    @RequestMapping(value="",method= RequestMethod.GET)
    ModelAndView serverIndex(HttpServletRequest request){
        ModelAndView modelAndView=new ModelAndView();
        modelAndView.setViewName("Statistics");
        HttpSession session = request.getSession();
        if(session.getAttribute("uid")==null)
            modelAndView.addObject("unlogged", "1");
        else
            modelAndView.addObject("logged", "0");
        return modelAndView;
    }

    @RequestMapping(value="/serverNodes",method = RequestMethod.GET)
    JsonResult getServerNodes(){
        List<ModelContainer> modelContainerList=modelContainerDao.findAll();
        JSONArray jsonArray=new JSONArray();
        for(int i=0;i<modelContainerList.size();i++){
            ModelContainer modelContainer=modelContainerList.get(i);
            JSONObject object=new JSONObject();
            object.put("geoJson",modelContainer.getGeoInfo());
            jsonArray.add(object);
        }
        return ResultUtils.success(jsonArray);
    }

}
