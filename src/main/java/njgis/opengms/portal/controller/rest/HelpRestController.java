package njgis.opengms.portal.controller.rest;

import com.alibaba.fastjson.JSONObject;
import njgis.opengms.portal.dto.UserAddDTO;
import njgis.opengms.portal.service.UserService;
import njgis.opengms.portal.utils.ResultUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.List;

@RestController
@RequestMapping (value = "/help")
public class HelpRestController {

    @RequestMapping(value = "/demo", method = RequestMethod.GET)
    public ModelAndView getDemo() {
        System.out.println("demo");
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("demo");
        modelAndView.addObject("name","OpenGMS");

        return modelAndView;
    }

    @RequestMapping(value = "/manual", method = RequestMethod.GET)
    public ModelAndView getManual() {
        System.out.println("manual");
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("manual");
        modelAndView.addObject("name","OpenGMS");

        return modelAndView;
    }

    @RequestMapping(value = "/document", method = RequestMethod.GET)
    public ModelAndView getDocument() {
        System.out.println("document");
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("document");
        modelAndView.addObject("name","OpenGMS");

        return modelAndView;
    }




}
