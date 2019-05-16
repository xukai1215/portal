package njgis.opengms.portal.controller.rest;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

@RestController
public class HomeRestController {

    @RequestMapping(value="/home",method = RequestMethod.GET)
    public ModelAndView getModelItems() {
        System.out.println("home");

        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("index");

        return modelAndView;
    }

}
