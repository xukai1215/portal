package njgis.opengms.portal.controller.rest;

import njgis.opengms.portal.bean.JsonResult;
import njgis.opengms.portal.dto.theme.ThemeAddDTO;
import njgis.opengms.portal.entity.Theme;
import njgis.opengms.portal.service.ThemeService;
import njgis.opengms.portal.service.UserService;
import njgis.opengms.portal.utils.ResultUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

/**
 * @Auther mingyuan
 * @Data 2019.10.24 22:37
 */
@Controller
@RequestMapping(value = "/theme")
public class ThemeController {

    @Autowired
    ThemeService themeService;

    @Autowired
    UserService userService;
    @GetMapping(value = "/thematicmodel")
    public  String thematic(){
        return "/thematicmodel";
    }
}
