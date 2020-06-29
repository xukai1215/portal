package njgis.opengms.portal.controller.rest;

import njgis.opengms.portal.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

@RestController
@RequestMapping(value="/server")
public class ServerRestController {
//    @Autowired
//    ModelContainerDao modelContainerDao;

    @Autowired
    UserService userService;


    @RequestMapping(value="",method= RequestMethod.GET)
    ModelAndView serverIndex(){
        ModelAndView modelAndView=new ModelAndView();
        modelAndView.setViewName("Server");

        return modelAndView;
    }

}
