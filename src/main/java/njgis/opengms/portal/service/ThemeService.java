package njgis.opengms.portal.service;

import njgis.opengms.portal.dao.ModelItemDao;
import njgis.opengms.portal.dao.ThemeDao;
import njgis.opengms.portal.dto.theme.ThemeAddDTO;
import njgis.opengms.portal.entity.Theme;
import njgis.opengms.portal.utils.Utils;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.swing.plaf.PanelUI;
import java.util.Date;
import java.util.UUID;

/**
 * @Auther mingyuan
 * @Data 2019.10.24 9:39
 */
@Service
public class ThemeService {
    @Autowired
    ThemeDao themeDao;

    @Autowired
    ModelItemDao modelItemDao;


    @Value("E:/portal/target/classes/static/upload")
    private String resourcePath;

    @Value("E:/static/upload")
    private String htmlLoadPath;
}
