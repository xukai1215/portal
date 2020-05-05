package njgis.opengms.portal.controller.rest;

import njgis.opengms.portal.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;

@RestController
@RequestMapping (value = "/help")
public class HelpRestController {

    @Autowired
    UserService userService;

    @RequestMapping(value = "/demo", method = RequestMethod.GET)
    public ModelAndView getDemo(HttpServletRequest req) {
        System.out.println("demo");
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("demo");
        modelAndView.addObject("name","OpenGMS");

        return modelAndView;
    }

    @RequestMapping(value = "/manual", method = RequestMethod.GET)
    public ModelAndView getManual(HttpServletRequest req) {
        System.out.println("manual");
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("manual");
        modelAndView.addObject("name","OpenGMS");

        return modelAndView;
    }

    @RequestMapping(value = "/document", method = RequestMethod.GET)
    public ModelAndView getDocument(HttpServletRequest req) {
        System.out.println("document");
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("document");
        modelAndView.addObject("name","OpenGMS");

        return modelAndView;
    }




}
