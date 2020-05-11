package njgis.opengms.portal.interceptor;

import njgis.opengms.portal.bean.LoginRequired;
import njgis.opengms.portal.dao.ViewRecordDao;
import njgis.opengms.portal.entity.ViewRecord;
import njgis.opengms.portal.enums.ItemTypeEnum;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.lang.reflect.Method;
import java.util.Date;


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
        // ①:START 方法注解级拦截器
        HandlerMethod handlerMethod = (HandlerMethod) handler;
        Method method = handlerMethod.getMethod();
        // 判断接口是否需要登录
        LoginRequired methodAnnotation = method.getAnnotation(LoginRequired.class);
        // 有 @LoginRequired 注解，需要认证
        if (methodAnnotation != null) {
            // 这写你拦截需要干的事儿，比如取缓存，SESSION，权限判断等
            HttpSession session = request.getSession();
            Object userName_obj = session.getAttribute("oid");//userOid

            if (userName_obj==null){
                session.setAttribute("preUrl",request.getRequestURI());
                response.sendRedirect("/user/login");
                return false;
            }
            return true;
        }
        return true;
    }

    private void addViewRecord(HttpServletRequest request, String userOid){
        String servletPath = request.getServletPath();
        String[] paths = servletPath.split("/");

        ViewRecord viewRecord = new ViewRecord();
        viewRecord.setUserOid(userOid);

        ItemTypeEnum itemType;

        if(paths[1].equals("repository")){
            String itemOid = paths[3];
            itemType = ItemTypeEnum.getItemTypeByName(paths[2]);
            viewRecord.setItemOid(itemOid);
            viewRecord.setItemType(itemType);
        }else {
            String itemOid = paths[2];
            if(itemOid.length()>10){
                itemType = ItemTypeEnum.getItemTypeByName(paths[1]);
                viewRecord.setItemOid(itemOid);
                viewRecord.setItemType(itemType);
            }
        }

        viewRecord.setDate(new Date());
        viewRecordDao.insert(viewRecord);
    }
}