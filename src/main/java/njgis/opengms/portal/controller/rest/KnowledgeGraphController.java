package njgis.opengms.portal.controller.rest;

import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoCursor;
import com.mongodb.client.model.Filters;
import njgis.opengms.portal.bean.JsonResult;
import njgis.opengms.portal.dao.ModelDao;
import njgis.opengms.portal.dao.ModelItemDao;
import njgis.opengms.portal.entity.ModelItem;
import njgis.opengms.portal.service.ClassificationService;
import njgis.opengms.portal.utils.ResultUtils;
import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import java.util.ArrayList;
import java.util.List;

/**
 * @ClassName knowledgeGraphRestController
 * @Description todo
 * @Author Kai
 * @Date 2019/2/21
 * @Version 1.0.0
 * TODO
 */

@RestController
@RequestMapping(value = "/knowledgeGraph")
public class KnowledgeGraphController {

    @RequestMapping(value="/{name}",method = RequestMethod.GET)
    public ModelAndView getPage(@PathVariable("name") String name){

        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("/KnowledgeGraph/"+name);
        modelAndView.addObject("name","OpenGMS");

        return modelAndView;

    }

}
