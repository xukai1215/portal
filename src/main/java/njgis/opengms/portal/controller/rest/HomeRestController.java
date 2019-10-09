package njgis.opengms.portal.controller.rest;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

@RestController
public class HomeRestController {

    @RequestMapping(value="/home",method = RequestMethod.GET)
    public ModelAndView getModelItems(HttpServletRequest req) {
        System.out.println("home");

        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("index");

        HttpSession session=req.getSession();
        if(session.getAttribute("uid")==null)
            modelAndView.addObject("unlogged", "1");
        else
            modelAndView.addObject("logged", "0");

        return modelAndView;
    }

}
