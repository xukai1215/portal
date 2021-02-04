package njgis.opengms.portal.interceptor;

import njgis.opengms.portal.dao.ViewRecordDao;
import njgis.opengms.portal.entity.ViewRecord;
import njgis.opengms.portal.enums.ItemTypeEnum;
import njgis.opengms.portal.utils.IpUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.util.Date;


@Component
public class ItemViewRecordInterceptor implements HandlerInterceptor {

    @Autowired
    ViewRecordDao viewRecordDao;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String servletPath = request.getServletPath();
        HttpSession session = request.getSession();
        Object userOid_obj = session.getAttribute("oid");//userOid
        String[] paths = servletPath.split("/");
        String ip = IpUtil.getIpAddr(request);
        ViewRecord viewRecord = new ViewRecord();

        String userOid;
        if(userOid_obj!=null){
            userOid = userOid_obj.toString();
        }else {
            userOid = null;
        }

        viewRecord.setUserOid(userOid);
        viewRecord.setIp(ip);
        viewRecord.setUrl(servletPath);
        viewRecord.setMethod(request.getMethod());
        viewRecord.setUserAgent(request.getHeader("user-agent"));

        ItemTypeEnum itemType;

        if(paths[1].equals("repository")){
            if(paths.length>3) {
                String itemOid = paths[3];
                if (itemOid.length() >= 36) {
                    itemType = ItemTypeEnum.getItemTypeByName(paths[2]);
                    viewRecord.setItemOid(itemOid);
                    viewRecord.setItemType(itemType);
                    viewRecord.setDate(new Date());
                }
            }
        }else {
            if(paths.length>2) {
                String itemOid = paths[2];
                if (itemOid.length() >= 24) {
                    itemType = ItemTypeEnum.getItemTypeByName(paths[1]);
                    viewRecord.setItemOid(itemOid);
                    viewRecord.setItemType(itemType);
                    viewRecord.setDate(new Date());
                }
            }
        }
        viewRecordDao.insert(viewRecord);

        return true;
    }

}