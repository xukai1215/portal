package njgis.opengms.portal.controller.rest;

import njgis.opengms.portal.service.StatisticsService;
import njgis.opengms.portal.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

@RestController
@RequestMapping(value="/statistics")
public class StatisticsRestController {

    @Autowired
    StatisticsService statisticsService;


    @Autowired
    UserService userService;

    @RequestMapping(value="",method= RequestMethod.GET)
    ModelAndView serverIndex(){
        ModelAndView modelAndView=new ModelAndView();
        modelAndView.setViewName("Statistics");

        return modelAndView;
    }

    @RequestMapping(value="/show",method= RequestMethod.GET)
    ModelAndView show(){
        ModelAndView modelAndView=new ModelAndView();
        modelAndView.setViewName("modelStatistics");

        return modelAndView;
    }

}
