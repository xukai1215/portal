package njgis.opengms.portal.controller.rest;

import lombok.extern.slf4j.Slf4j;
import njgis.opengms.portal.bean.JsonResult;
import njgis.opengms.portal.dao.*;
import njgis.opengms.portal.entity.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.List;

/**
 * @Author mingyuan
 * @Date 2021.03.08 20:17
 */
@RestController
@RequestMapping("/message")
@Slf4j
public class MessageController {
    @Autowired
    ModelItemVersionDao modelItemVersionDao;

    @Autowired
    ConceptualModelVersionDao conceptualModelVersionDao;

    @Autowired
    LogicalModelVersionDao logicalModelVersionDao;

    @Autowired
    ComputableModelVersionDao computableModelVersionDao;

    @Autowired
    ConceptVersionDao conceptVersionDao;

    @Autowired
    TemplateVersionDao templateVersionDao;

    @Autowired
    SpatialReferenceVersionDao spatialReferenceVersionDao;

    @Autowired
    UnitVersionDao unitVersionDao;

    @Autowired
    DataItemVersionDao dataItemVersionDao;

    @Autowired
    DataHubsVersionDao dataHubsVersionDao;

    @Autowired
    DataApplicationVersionDao dataApplicationVersionDao;

    @Autowired
    ThemeVersionDao themeVersionDao;

    @Autowired
    UserDao userDao;

    /**
     * 审核机制，统计对应作者的未审核的版本数量，加一层保险
     * @param request 获取session中的用户信息
     * @return 是否修正成功
     */
    @RequestMapping(value = "/correctMsgNum", method = RequestMethod.GET)
    public JsonResult correctMsgNum(HttpServletRequest request){
        JsonResult jsonResult = new JsonResult();

        HttpSession session = request.getSession();
        String uid = session.getAttribute("uid").toString();
        String oid = session.getAttribute("oid").toString();

        int num = 0;
        List<ModelItemVersion> modelItemVersions = modelItemVersionDao.findFirstByCreatorAndVerStatus(uid, 0);
        List<ConceptualModelVersion> conceptualModelVersions = conceptualModelVersionDao.
                findFirstByCreatorAndVerStatus(uid, 0);
        List<LogicalModelVersion> logicalModelVersions = logicalModelVersionDao.findFirstByCreatorAndVerStatus(uid, 0);
        List<ComputableModelVersion> computableModelVersions = computableModelVersionDao.
                findFirstByCreatorAndVerStatus(uid, 0);
        List<ConceptVersion> conceptVersions = conceptVersionDao.findFirstByCreatorAndVerStatus(uid, 0);
        List<TemplateVersion> templateVersions = templateVersionDao.findFirstByCreatorAndVerStatus(uid, 0);
        List<SpatialReferenceVersion> spatialReferenceVersions = spatialReferenceVersionDao.
                findFirstByCreatorAndVerStatus(uid, 0);
        List<UnitVersion> unitVersions = unitVersionDao.findFirstByCreatorAndVerStatus(uid, 0);
        List<DataItemVersion> dataItemVersions = dataItemVersionDao.findFirstByCreatorAndVerStatus(uid, 0);
        List<DataApplicationVersion> dataApplicationVersions = dataApplicationVersionDao.
                findFirstByAuthorAndVerStatus(oid, 0);
        List<DataHubsVersion> dataHubsVersions = dataHubsVersionDao.findFirstByCreatorAndVerStatus(uid, 0);
        List<ThemeVersion> themeVersions = themeVersionDao.findFirstByCreatorAndStatus(uid, 0);

        num += (modelItemVersions.size() + conceptualModelVersions.size() + logicalModelVersions.size() + computableModelVersions.size()
        + conceptVersions.size() + templateVersions.size() + spatialReferenceVersions.size() + unitVersions.size() + dataItemVersions.size()
        + dataApplicationVersions.size() + dataHubsVersions.size() + themeVersions.size());

        User user = userDao.findFirstByUserName(uid);
        log.info(user.getMessageNum() + "");

        if(user.getMessageNum() != num){
            user.setMessageNum(num);
        }

//        userDao.save(user);

        jsonResult.setCode(0);
        jsonResult.setData(num);
        jsonResult.setMsg("correct end");
        return jsonResult;
    }
}
