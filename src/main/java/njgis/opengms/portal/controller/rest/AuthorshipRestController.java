package njgis.opengms.portal.controller.rest;

import njgis.opengms.portal.dao.AuthorshipDao;
import njgis.opengms.portal.entity.Authorship;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

@RestController
@RequestMapping (value = "/authorship")
public class AuthorshipRestController {

    @Autowired
    AuthorshipDao authorshipDao;

    @RequestMapping(value="/unsubscribe",method = RequestMethod.GET)
    public ModelAndView unsubscribe(@RequestParam("id") String id){
        Authorship authorship = authorshipDao.findFirstById(id);
        authorship.setSubscribe(false);
        authorshipDao.save(authorship);
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("unsubscribe");
        return modelAndView;
    }

}
