package njgis.opengms.portal.interceptor;

import njgis.opengms.portal.entity.User;
import njgis.opengms.portal.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;


@Component
public class ModelAndViewInterceptor implements HandlerInterceptor {
    private static final Logger logger = LoggerFactory.getLogger(ModelAndViewInterceptor.class);

    @Autowired
    UserService userService;

    /**
     * 判断session 是否有值
     *
     * @param request
     * @param response
     * @param handler
     * @return
     * @throws Exception
     */

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler,
                           ModelAndView modelAndView) throws Exception {
        if(modelAndView!=null) {
            HttpSession session = request.getSession();
            if (session.getAttribute("uid") == null)
                modelAndView.addObject("logged", false);
            else {
                User user = userService.getByUid(session.getAttribute("uid").toString());
                modelAndView.addObject("userNavBar", user);
                System.out.println(modelAndView.getModel().get("user"));
                modelAndView.addObject("logged", true);
            }
        }
    }

}