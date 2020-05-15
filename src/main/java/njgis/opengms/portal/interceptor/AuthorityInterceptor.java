package njgis.opengms.portal.interceptor;

import njgis.opengms.portal.bean.LoginRequired;
import njgis.opengms.portal.dao.ViewRecordDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.lang.reflect.Method;


@Component
public class AuthorityInterceptor implements HandlerInterceptor {

    @Autowired
    ViewRecordDao viewRecordDao;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // 如果不是映射到方法直接通过
        if (!(handler instanceof HandlerMethod)) {
            return true;
        }

        HttpSession session = request.getSession();
        Object userOid_obj = session.getAttribute("oid");//userOid
        // ①:START 方法注解级拦截器
        HandlerMethod handlerMethod = (HandlerMethod) handler;
        Method method = handlerMethod.getMethod();
        // 判断接口是否需要登录
        LoginRequired methodAnnotation = method.getAnnotation(LoginRequired.class);
        // 有 @LoginRequired 注解，需要认证
        if (methodAnnotation != null) {
            // 这写你拦截需要干的事儿，比如取缓存，SESSION，权限判断等


            if (userOid_obj==null){
                session.setAttribute("preUrl",request.getRequestURI());
                response.sendRedirect("/user/login");
                return false;
            }

            return true;
        }

        return true;
    }

}