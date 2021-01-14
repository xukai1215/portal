package njgis.opengms.portal.service;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import net.bytebuddy.asm.Advice;
import njgis.opengms.portal.dao.DataItemDao;
import njgis.opengms.portal.dao.ModelItemDao;
import njgis.opengms.portal.dao.ThemeDao;
import njgis.opengms.portal.dao.UserDao;
import com.sun.mail.imap.protocol.Item;
import njgis.opengms.portal.bean.JsonResult;
import njgis.opengms.portal.dao.*;
import njgis.opengms.portal.dto.modelItem.ModelItemResultDTO;
import njgis.opengms.portal.dto.theme.ThemeAddDTO;
import njgis.opengms.portal.dto.theme.ThemeResultDTO;
import njgis.opengms.portal.dto.theme.ThemeUpdateDTO;
import njgis.opengms.portal.entity.*;
import njgis.opengms.portal.entity.support.*;
import njgis.opengms.portal.enums.ResultEnum;
import njgis.opengms.portal.exception.MyException;
import njgis.opengms.portal.utils.ResultUtils;
import njgis.opengms.portal.utils.Utils;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.swing.plaf.PanelUI;
import java.io.*;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * @Auther mingyuan
 * @Data 2019.10.24 9:39
 */
@Service
public class ThemeService {
    @Autowired
    ItemService itemService;

    @Autowired
    ThemeDao themeDao;

    @Autowired
    UserDao userDao;

    @Autowired
    ModelItemDao modelItemDao;

    @Autowired
    DataItemDao dataItemDao;

    @Autowired
    UserService userService;

    @Autowired
    ModelItemVersionDao modelItemVersionDao;

    @Autowired
    ConceptualModelVersionDao conceptualModelVersionDao;

    @Autowired
    LogicalModelVersionDao logicalModelVersionDao;

    @Autowired
    ComputableModelVersionDao computableModelVersionDao;

    @Autowired
    SpatialReferenceVersionDao spatialReferenceVersionDao;

    @Autowired
    UnitVersionDao unitVersionDao;

    @Autowired
    TemplateVersionDao templateVersionDao;

    @Autowired
    ConceptVersionDao conceptVersionDao;

    @Autowired
    ThemeVersionDao themeVersionDao;

    @Autowired
    DataItemVersionDao dataItemVersionDao;

    @Autowired
    DataApplicationVersionDao dataApplicationVersionDao;

    @Autowired
    DataApplicationDao dataApplicationDao;

    @Autowired
    DataHubsVersionDao dataHubsVersionDao;


    @Value("${resourcePath}")
    private String resourcePath;

    @Value("${htmlLoadPath}")
    private String htmlLoadPath;

    public Theme insertTheme(ThemeAddDTO themeAddDTO, String uid){
        Theme theme = new Theme();
        BeanUtils.copyProperties(themeAddDTO, theme);

        Date now = new Date();
        theme.setCreateTime(now);
        theme.setLastModifyTime(now);
        theme.setOid(UUID.randomUUID().toString());
        theme.setAuthor(uid);

        //设置图片
        String path = "/repository/theme/" + UUID.randomUUID().toString() + ".jpg";
        String[] strs = themeAddDTO.getUploadImage().split(",");
        if(strs.length > 1){
            String imgStr = themeAddDTO.getUploadImage().split(",")[1];
            Utils.base64StrToImage(imgStr, resourcePath + path);
            theme.setImage(path);
        } else {
            theme.setImage("");
        }

        //从application数组中依次拿出uploadimage，转换为地址后放到image中
        List<Application> applications = themeAddDTO.getApplication();

        for(int i = 0;i<applications.size();i++){
            String path1 = "/repository/theme/" + UUID.randomUUID().toString() + ".jpg";
            Application application = applications.get(i);
            String[] strs1 = application.getUpload_application_image().split(",");
            if(strs1.length>1){
                String imgStr = application.getUpload_application_image().split(",")[1];
                Utils.base64StrToImage(imgStr, resourcePath+path1);
                application.setApplication_image(path1);
                //因为upload_application_image为base64，存入数据库非常占内存，故在此处将此属性转为空存入
                application.setUpload_application_image("");
            } else {
                application.setApplication_image("");
            }
        }
        return themeDao.insert(theme);
    }

    public Theme getByOid(String id) {
        try {
            Theme theme = themeDao.findFirstByOid(id);

            //详情页面
            String detailResult;
            String theme_detailDesc=theme.getDetail();
            int num=theme_detailDesc.indexOf("/upload/document/");
            if(num==-1||num>20){
                detailResult=theme_detailDesc;
            }
            else {
                if(theme_detailDesc.indexOf("/")==0){
                    theme_detailDesc.substring(1);
                }
                //model_detailDesc = model_detailDesc.length() > 0 ? model_detailDesc.substring(1) : model_detailDesc;
                String filePath = resourcePath.substring(0,resourcePath.length()-7) +"/" + theme_detailDesc;
                try {
                    filePath = java.net.URLDecoder.decode(filePath, "utf-8");
                } catch (UnsupportedEncodingException e) {
                    e.printStackTrace();
                }
                if (theme_detailDesc.length() > 0) {
                    File file = new File(filePath);
                    if (file.exists()) {
                        StringBuilder detail = new StringBuilder();
                        try {
                            FileInputStream fileInputStream = new FileInputStream(file);
                            InputStreamReader inputStreamReader = new InputStreamReader(fileInputStream, "UTF-8");
                            BufferedReader br = new BufferedReader(inputStreamReader);
                            String line;
                            while ((line = br.readLine()) != null) {
                                line = line.replaceAll("<h1", "<h1 style='font-size:16px;margin-top:0'");
                                line = line.replaceAll("<h2", "<h2 style='font-size:16px;margin-top:0'");
                                line = line.replaceAll("<h3", "<h3 style='font-size:16px;margin-top:0'");
                                line = line.replaceAll("<p", "<p style='font-size:14px;text-indent:2em'");
                                detail.append(line);
                            }
                            br.close();
                            inputStreamReader.close();
                            fileInputStream.close();
                        } catch (FileNotFoundException e) {
                            e.printStackTrace();
                        } catch (UnsupportedEncodingException e) {
                            e.printStackTrace();
                        } catch (IOException e) {
                            e.printStackTrace();
                        }
                        detailResult = detail.toString();
                    } else {
                        detailResult = theme_detailDesc;
                    }
                } else {
                    detailResult = theme_detailDesc;
                }
            }
            theme.setDetail(detailResult);

            theme.setImage(theme.getImage());
            return theme;
        } catch (Exception e) {
            System.out.println("有人乱查数据库！！该ID不存在Model Item对象");
            throw new MyException(ResultEnum.NO_OBJECT);
        }
    }

    public JSONObject getModelItem(String oid){
        ModelItem modelItem = modelItemDao.findFirstByOid(oid);
        JSONObject item = new JSONObject();
        item.put("oid", modelItem.getOid());
        item.put("name", modelItem.getName());
        item.put("author",userService.getByUid(modelItem.getAuthor()).getName());
        return item;
    }

    public JSONObject getDataItem(String oid){
        DataItem dataItem = dataItemDao.findFirstById(oid);
        JSONObject item = new JSONObject();
        item.put("oid",dataItem.getId());
        item.put("name",dataItem.getName());
        item.put("author",userService.getByOid(dataItem.getAuthor()));
        return item;
    }


    public ModelAndView getMessagePage(String uid){
        ModelAndView modelAndView = new ModelAndView();
        User user = userDao.findFirstByOid(uid);

        modelAndView.setViewName("message_confirm");
        modelAndView.addObject("info",user);

//        User user = userDao.findFirstByOid(theme.getCreator_oid());
        JSONObject userinfo = new JSONObject();
        userinfo.put("name",user.getName());
        userinfo.put("email",user.getEmail());
        userinfo.put("phone",user.getPhone());
        userinfo.put("organizations",user.getOrganizations());
        userinfo.put("description",user.getDescription());

        modelAndView.addObject("user_information",userinfo);
        return modelAndView;
    }

    public int delete(String oid,String userName){
        Theme theme = themeDao.findFirstByOid(oid);
        if (theme!=null) {
            themeDao.delete(theme);
            userService.themeItemMinusMinus(userName);
            return 1;
        }else {
            return -1;
        }
    }
    public JSONObject searchThemeByUserId(String searchText,String userId, int page, String sortType, int asc){

        Sort sort = new Sort(asc==1 ? Sort.Direction.ASC : Sort.Direction.DESC, "createTime");

        Pageable pageable = PageRequest.of(page, 10, sort);

        Page<ThemeResultDTO> themes = themeDao.findByThemenameContainsIgnoreCaseAndAndAuthor(searchText,userId,pageable);
//        Page<ModelItemResultDTO> modelItems = modelItemDao.findByNameContainsIgnoreCaseAndAuthor(searchText,userId,pageable);

        JSONObject themeObject = new JSONObject();
        themeObject.put("count",themes.getTotalElements());
        themeObject.put("theme",themes.getContent());

        return themeObject;

    }

    public JSONObject getVersion(HttpServletRequest request){
            JSONObject result = new JSONObject();
            JSONArray uncheck = new JSONArray();
            JSONArray accept = new JSONArray();
            JSONArray reject = new JSONArray();

            JSONArray uncheck_self = new JSONArray();
            JSONArray accept_self = new JSONArray();
            JSONArray reject_self = new JSONArray();
            JSONArray edit = new JSONArray();//用于存储edit（存储包括accept、reject、unchecked在内的所有的edit）
            //下面是匹配当前的项目的创建者与当前登陆者
            HttpSession session = request.getSession();
            String uid = session.getAttribute("uid").toString();
            String oid = session.getAttribute("oid").toString();

            List<ModelItemVersion> modelItemVersions = modelItemVersionDao.findAll();
            List<ModelItemVersion> modelItemVersions1 = new ArrayList<>();
            for (int i=0;i<modelItemVersions.size();i++){
                if (uid.equals(modelItemVersions.get(i).getCreator())){
                    modelItemVersions1.add(modelItemVersions.get(i));
                }
            }


            for (ModelItemVersion modelItemVersion : modelItemVersions1) {

                JSONObject jsonObject = new JSONObject();
                jsonObject.put("name", modelItemVersion.getName());
                jsonObject.put("oid", modelItemVersion.getOid());
                jsonObject.put("originOid", modelItemVersion.getOriginOid());
                SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                jsonObject.put("modifyTime", sdf.format(modelItemVersion.getModifyTime()));
                SimpleDateFormat sdf1 = new SimpleDateFormat("yyyy-MM-dd");
                jsonObject.put("modifyTimeDay",sdf1.format(modelItemVersion.getModifyTime()));
                if (modelItemVersion.getAcceptTime()!=null){
                    jsonObject.put("acceptTime",sdf.format(modelItemVersion.getAcceptTime()));
                    jsonObject.put("acceptTimeDay",sdf1.format(modelItemVersion.getAcceptTime()));
                }
                if (modelItemVersion.getRejectTime()!=null){
                    jsonObject.put("rejectTime",sdf.format(modelItemVersion.getRejectTime()));
                    jsonObject.put("rejectTimeDay",sdf1.format(modelItemVersion.getRejectTime()));
                }
                JSONObject modifier = new JSONObject();

                modifier.put("modifier", modelItemVersion.getModifier());
                List<User> users = userDao.findAll();
                for (int i=0;i<users.size();i++){
                    if (modelItemVersion.getModifier().equals(users.get(i).getUserName())){
                        modifier.put("modifier_oid",users.get(i).getOid());
                        modifier.put("modifier_name",users.get(i).getName());
                        break;
                    }
                }
//                jsonObject.putAll(modifier);
                jsonObject.put("modifier",modifier);
                String statuss = new String();
                if (modelItemVersion.getVerStatus() == 0){
                    statuss = "unchecked";
                }else if (modelItemVersion.getVerStatus() == -1){
                    statuss = "reject";
                }else {
                    statuss = "confirmed";
                }

                jsonObject.put("status",statuss);
                jsonObject.put("type", "modelItem");
                jsonObject.put("ex_type","Model Item");

                int status = modelItemVersion.getVerStatus();
                if (status == 0) {
                    uncheck.add(jsonObject);
                    edit.add(jsonObject);
                } else if (status == 1) {
                    accept.add(jsonObject);
                    edit.add(jsonObject);
                } else if (status == -1) {
                    reject.add(jsonObject);
                    edit.add(jsonObject);
                }
            }

            //self
            List<ModelItemVersion> modelItemVersions_self = modelItemVersionDao.findAll();
            List<ModelItemVersion> modelItemVersions1_self = new ArrayList<>();
            for (int i=0;i<modelItemVersions_self.size();i++){
                if (uid.equals(modelItemVersions_self.get(i).getModifier())){
                    modelItemVersions1_self.add(modelItemVersions_self.get(i));
                }
            }


            for (ModelItemVersion modelItemVersion : modelItemVersions1_self) {

                JSONObject jsonObject = new JSONObject();
                jsonObject.put("name", modelItemVersion.getName());
                jsonObject.put("oid", modelItemVersion.getOid());
                jsonObject.put("originOid", modelItemVersion.getOriginOid());
                jsonObject.put("readStatus",modelItemVersion.getReadStatus());
                SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                jsonObject.put("modifyTime", sdf.format(modelItemVersion.getModifyTime()));
                SimpleDateFormat sdf1 = new SimpleDateFormat("yyyy-MM-dd");
                jsonObject.put("modifyTimeDay",sdf1.format(modelItemVersion.getModifyTime()));
                if (modelItemVersion.getAcceptTime()!=null){
                    jsonObject.put("acceptTime",sdf.format(modelItemVersion.getAcceptTime()));
                    jsonObject.put("acceptTimeDay",sdf1.format(modelItemVersion.getAcceptTime()));
                }
                if (modelItemVersion.getRejectTime()!=null){
                    jsonObject.put("rejectTime",sdf.format(modelItemVersion.getRejectTime()));
                    jsonObject.put("rejectTimeDay",sdf1.format(modelItemVersion.getRejectTime()));
                }
                JSONObject modifier = new JSONObject();

                modifier.put("modifier", modelItemVersion.getModifier());
                List<User> users = userDao.findAll();
                for (int i=0;i<users.size();i++){
                    if (modelItemVersion.getModifier().equals(users.get(i).getUserName())){
                        modifier.put("modifier_oid",users.get(i).getOid());
                        modifier.put("modifier_name",users.get(i).getName());
                        break;
                    }
                }
//                jsonObject.putAll(modifier);
                jsonObject.put("modifier",modifier);
                String statuss = new String();
                if (modelItemVersion.getVerStatus() == 0){
                    statuss = "unchecked";
                }else if (modelItemVersion.getVerStatus() == -1){
                    statuss = "reject";
                }else {
                    statuss = "confirmed";
                }

                jsonObject.put("status",statuss);
                jsonObject.put("type", "modelItem");
                jsonObject.put("ex_type","Model Item");

                int status = modelItemVersion.getVerStatus();
                if (status == 0) {
                    uncheck_self.add(jsonObject);
                } else if (status == 1) {
                    accept_self.add(jsonObject);
                } else if (status == -1) {
                    reject_self.add(jsonObject);
                }
            }

            List<ConceptualModelVersion> conceptualModelVersionList = conceptualModelVersionDao.findAll();
            List<ConceptualModelVersion> conceptualModelVersions = new ArrayList<>();
            for (int i=0;i<conceptualModelVersionList.size();i++){
                if (uid.equals(conceptualModelVersionList.get(i).getCreator())){
                    conceptualModelVersions.add(conceptualModelVersionList.get(i));
                }
            }
            for (ConceptualModelVersion conceptualModelVersion : conceptualModelVersions) {

                JSONObject jsonObject = new JSONObject();
                jsonObject.put("name", conceptualModelVersion.getName());
                jsonObject.put("oid", conceptualModelVersion.getOid());
                jsonObject.put("originOid", conceptualModelVersion.getOriginOid());
                SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                jsonObject.put("modifyTime", sdf.format(conceptualModelVersion.getModifyTime()));
                SimpleDateFormat sdf1 = new SimpleDateFormat("yyyy-MM-dd");
                jsonObject.put("modifyTimeDay",sdf1.format(conceptualModelVersion.getModifyTime()));
                if (conceptualModelVersion.getAcceptTime()!=null){
                    jsonObject.put("acceptTime",sdf.format(conceptualModelVersion.getAcceptTime()));
                    jsonObject.put("acceptTimeDay",sdf1.format(conceptualModelVersion.getAcceptTime()));
                }
                if (conceptualModelVersion.getRejectTime()!=null){
                    jsonObject.put("rejectTime",sdf.format(conceptualModelVersion.getRejectTime()));
                    jsonObject.put("rejectTimeDay",sdf1.format(conceptualModelVersion.getRejectTime()));
                }

                JSONObject modifier = new JSONObject();

                modifier.put("modifier", conceptualModelVersion.getModifier());
                List<User> users = userDao.findAll();
                for (int i=0;i<users.size();i++){
                    if (conceptualModelVersion.getModifier().equals(users.get(i).getUserName())){
                        modifier.put("modifier_oid",users.get(i).getOid());
                        modifier.put("modifier_name",users.get(i).getName());
                        break;
                    }
                }
//                jsonObject.putAll(modifier);
                jsonObject.put("modifier",modifier);
                String statuss = new String();
                if (conceptualModelVersion.getVerStatus() == 0){
                    statuss = "unchecked";
                }else if (conceptualModelVersion.getVerStatus() == -1){
                    statuss = "reject";
                }else {
                    statuss = "confirmed";
                }

                jsonObject.put("status",statuss);

//            jsonObject.put("type","model");
                //前台展示需要用户的name，所以通过uid获取用户的name
//                String name = new String();
//                List<User> users = userDao.findAll();
//                for (int i=0;i<users.size();i++){
//                    if (conceptualModelVersion.getModifier().equals(users.get(i).getUserName())){
//                        name = users.get(i).getName();
//                        break;
//                    }
//                }
//                jsonObject.put("modifierName", name);
                jsonObject.put("type", "conceptualModel");
                jsonObject.put("ex_type", "Conceptual Model");

                int status = conceptualModelVersion.getVerStatus();
                if (status == 0) {
                    uncheck.add(jsonObject);
                    edit.add(jsonObject);

                } else if (status == 1) {
                    accept.add(jsonObject);
                    edit.add(jsonObject);

                } else if (status == -1) {
                    reject.add(jsonObject);
                    edit.add(jsonObject);

                }
            }
            //self
            List<ConceptualModelVersion> conceptualModelVersionList_self = conceptualModelVersionDao.findAll();
            List<ConceptualModelVersion> conceptualModelVersions_self = new ArrayList<>();
            for (int i=0;i<conceptualModelVersionList_self.size();i++){
                if (uid.equals(conceptualModelVersionList_self.get(i).getModifier())){
                    conceptualModelVersions_self.add(conceptualModelVersionList_self.get(i));
                }
            }
            for (ConceptualModelVersion conceptualModelVersion : conceptualModelVersions_self) {

                JSONObject jsonObject = new JSONObject();
                jsonObject.put("name", conceptualModelVersion.getName());
                jsonObject.put("oid", conceptualModelVersion.getOid());
                jsonObject.put("originOid", conceptualModelVersion.getOriginOid());
                jsonObject.put("readStatus",conceptualModelVersion.getReadStatus());
                SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                jsonObject.put("modifyTime", sdf.format(conceptualModelVersion.getModifyTime()));
                SimpleDateFormat sdf1 = new SimpleDateFormat("yyyy-MM-dd");
                jsonObject.put("modifyTimeDay",sdf1.format(conceptualModelVersion.getModifyTime()));
                if (conceptualModelVersion.getAcceptTime()!=null){
                    jsonObject.put("acceptTime",sdf.format(conceptualModelVersion.getAcceptTime()));
                    jsonObject.put("acceptTimeDay",sdf1.format(conceptualModelVersion.getAcceptTime()));
                }
                if (conceptualModelVersion.getRejectTime()!=null){
                    jsonObject.put("rejectTime",sdf.format(conceptualModelVersion.getRejectTime()));
                    jsonObject.put("rejectTimeDay",sdf1.format(conceptualModelVersion.getRejectTime()));
                }

                JSONObject modifier = new JSONObject();

                modifier.put("modifier", conceptualModelVersion.getModifier());
                List<User> users = userDao.findAll();
                for (int i=0;i<users.size();i++){
                    if (conceptualModelVersion.getModifier().equals(users.get(i).getUserName())){
                        modifier.put("modifier_oid",users.get(i).getOid());
                        modifier.put("modifier_name",users.get(i).getName());
                        break;
                    }
                }
//                jsonObject.putAll(modifier);
                jsonObject.put("modifier",modifier);
                String statuss = new String();
                if (conceptualModelVersion.getVerStatus() == 0){
                    statuss = "unchecked";
                }else if (conceptualModelVersion.getVerStatus() == -1){
                    statuss = "reject";
                }else {
                    statuss = "confirmed";
                }

                jsonObject.put("status",statuss);

//            jsonObject.put("type","model");
                //前台展示需要用户的name，所以通过uid获取用户的name
//                String name = new String();
//                List<User> users = userDao.findAll();
//                for (int i=0;i<users.size();i++){
//                    if (conceptualModelVersion.getModifier().equals(users.get(i).getUserName())){
//                        name = users.get(i).getName();
//                        break;
//                    }
//                }
//                jsonObject.put("modifierName", name);
                jsonObject.put("type", "conceptualModel");
                jsonObject.put("ex_type", "Conceptual Model");

                int status = conceptualModelVersion.getVerStatus();
                if (status == 0) {
                    uncheck_self.add(jsonObject);
                } else if (status == 1) {
                    accept_self.add(jsonObject);
                } else if (status == -1) {
                    reject_self.add(jsonObject);
                }
            }

            List<LogicalModelVersion> logicalModelVersionList = logicalModelVersionDao.findAll();
            List<LogicalModelVersion> logicalModelVersions = new ArrayList<>();
            for (int i=0;i<logicalModelVersionList.size();i++){
                if (uid.equals(logicalModelVersionList.get(i).getCreator())){
                    logicalModelVersions.add(logicalModelVersionList.get(i));
                }
            }
            for (LogicalModelVersion logicalModelVersion : logicalModelVersions) {

                JSONObject jsonObject = new JSONObject();
                jsonObject.put("name", logicalModelVersion.getName());
                jsonObject.put("oid", logicalModelVersion.getOid());
                jsonObject.put("originOid", logicalModelVersion.getOriginOid());
                SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                jsonObject.put("modifyTime", sdf.format(logicalModelVersion.getModifyTime()));
                SimpleDateFormat sdf1 = new SimpleDateFormat("yyyy-MM-dd");
                jsonObject.put("modifyTimeDay",sdf1.format(logicalModelVersion.getModifyTime()));
                if (logicalModelVersion.getAcceptTime()!=null){
                    jsonObject.put("acceptTime",sdf.format(logicalModelVersion.getAcceptTime()));
                    jsonObject.put("acceptTimeDay",sdf1.format(logicalModelVersion.getAcceptTime()));
                }
                if (logicalModelVersion.getRejectTime()!=null){
                    jsonObject.put("rejectTime",sdf.format(logicalModelVersion.getRejectTime()));
                    jsonObject.put("rejectTimeDay",sdf1.format(logicalModelVersion.getRejectTime()));
                }

                JSONObject modifier = new JSONObject();

                modifier.put("modifier", logicalModelVersion.getModifier());
                List<User> users = userDao.findAll();
                for (int i=0;i<users.size();i++){
                    if (logicalModelVersion.getModifier().equals(users.get(i).getUserName())){
                        modifier.put("modifier_oid",users.get(i).getOid());
                        modifier.put("modifier_name",users.get(i).getName());
                        break;
                    }
                }
//                jsonObject.putAll(modifier);
                jsonObject.put("modifier",modifier);
                String statuss = new String();
                if (logicalModelVersion.getVerStatus() == 0){
                    statuss = "unchecked";
                }else if (logicalModelVersion.getVerStatus() == -1){
                    statuss = "reject";
                }else {
                    statuss = "confirmed";
                }

                jsonObject.put("status",statuss);

//            jsonObject.put("type","model");
                //前台展示需要用户的name，所以通过uid获取用户的name
//                String name = new String();
//                List<User> users = userDao.findAll();
//                for (int i=0;i<users.size();i++){
//                    if (logicalModelVersion.getModifier().equals(users.get(i).getUserName())){
//                        name = users.get(i).getName();
//                        break;
//                    }
//                }
//                jsonObject.put("modifierName", name);
                jsonObject.put("type", "logicalModel");
                jsonObject.put("ex_type", "Logical Model");

                int status = logicalModelVersion.getVerStatus();
                if (status == 0) {
                    uncheck.add(jsonObject);
                    edit.add(jsonObject);

                } else if (status == 1) {
                    accept.add(jsonObject);
                    edit.add(jsonObject);

                } else if (status == -1) {
                    reject.add(jsonObject);
                    edit.add(jsonObject);

                }
            }
            //self
            List<LogicalModelVersion> logicalModelVersionList_self = logicalModelVersionDao.findAll();
            List<LogicalModelVersion> logicalModelVersions_self = new ArrayList<>();
            for (int i=0;i<logicalModelVersionList_self.size();i++){
                if (uid.equals(logicalModelVersionList_self.get(i).getModifier())){
                    logicalModelVersions_self.add(logicalModelVersionList_self.get(i));
                }
            }
            for (LogicalModelVersion logicalModelVersion : logicalModelVersions_self) {

                JSONObject jsonObject = new JSONObject();
                jsonObject.put("name", logicalModelVersion.getName());
                jsonObject.put("oid", logicalModelVersion.getOid());
                jsonObject.put("originOid", logicalModelVersion.getOriginOid());
                jsonObject.put("readStatus",logicalModelVersion.getReadStatus());
                SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                jsonObject.put("modifyTime", sdf.format(logicalModelVersion.getModifyTime()));
                SimpleDateFormat sdf1 = new SimpleDateFormat("yyyy-MM-dd");
                jsonObject.put("modifyTimeDay",sdf1.format(logicalModelVersion.getModifyTime()));
                if (logicalModelVersion.getAcceptTime()!=null){
                    jsonObject.put("acceptTime",sdf.format(logicalModelVersion.getAcceptTime()));
                    jsonObject.put("acceptTimeDay",sdf1.format(logicalModelVersion.getAcceptTime()));
                }
                if (logicalModelVersion.getRejectTime()!=null){
                    jsonObject.put("rejectTime",sdf.format(logicalModelVersion.getRejectTime()));
                    jsonObject.put("rejectTimeDay",sdf1.format(logicalModelVersion.getRejectTime()));
                }

                JSONObject modifier = new JSONObject();

                modifier.put("modifier", logicalModelVersion.getModifier());
                List<User> users = userDao.findAll();
                for (int i=0;i<users.size();i++){
                    if (logicalModelVersion.getModifier().equals(users.get(i).getUserName())){
                        modifier.put("modifier_oid",users.get(i).getOid());
                        modifier.put("modifier_name",users.get(i).getName());
                        break;
                    }
                }
//                jsonObject.putAll(modifier);
                jsonObject.put("modifier",modifier);
                String statuss = new String();
                if (logicalModelVersion.getVerStatus() == 0){
                    statuss = "unchecked";
                }else if (logicalModelVersion.getVerStatus() == -1){
                    statuss = "reject";
                }else {
                    statuss = "confirmed";
                }

                jsonObject.put("status",statuss);

//            jsonObject.put("type","model");
                //前台展示需要用户的name，所以通过uid获取用户的name
//                String name = new String();
//                List<User> users = userDao.findAll();
//                for (int i=0;i<users.size();i++){
//                    if (logicalModelVersion.getModifier().equals(users.get(i).getUserName())){
//                        name = users.get(i).getName();
//                        break;
//                    }
//                }
//                jsonObject.put("modifierName", name);
                jsonObject.put("type", "logicalModel");
                jsonObject.put("ex_type", "Logical Model");

                int status = logicalModelVersion.getVerStatus();
                if (status == 0) {
                    uncheck_self.add(jsonObject);
                } else if (status == 1) {
                    accept_self.add(jsonObject);
                } else if (status == -1) {
                    reject_self.add(jsonObject);
                }
            }

            List<ComputableModelVersion> computableModelVersionList = computableModelVersionDao.findAll();
            List<ComputableModelVersion> computableModelVersions = new ArrayList<>();
            for (int i=0;i<computableModelVersionList.size();i++){
                if (uid.equals(computableModelVersionList.get(i).getCreator())){
                    computableModelVersions.add(computableModelVersionList.get(i));
                }
            }

            for (ComputableModelVersion computableModelVersion : computableModelVersions) {

                JSONObject jsonObject = new JSONObject();
                jsonObject.put("name", computableModelVersion.getName());
                jsonObject.put("oid", computableModelVersion.getOid());
                jsonObject.put("originOid", computableModelVersion.getOriginOid());
                SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                jsonObject.put("modifyTime", sdf.format(computableModelVersion.getModifyTime()));
                SimpleDateFormat sdf1 = new SimpleDateFormat("yyyy-MM-dd");
                jsonObject.put("modifyTimeDay",sdf1.format(computableModelVersion.getModifyTime()));
                if (computableModelVersion.getAcceptTime()!=null){
                    jsonObject.put("acceptTime",sdf.format(computableModelVersion.getAcceptTime()));
                    jsonObject.put("acceptTimeDay",sdf1.format(computableModelVersion.getAcceptTime()));
                }
                if (computableModelVersion.getRejectTime()!=null){
                    jsonObject.put("rejectTime",sdf.format(computableModelVersion.getRejectTime()));
                    jsonObject.put("rejectTimeDay",sdf.format(computableModelVersion.getRejectTime()));
                }
                JSONObject modifier = new JSONObject();

                modifier.put("modifier", computableModelVersion.getModifier());
                List<User> users = userDao.findAll();
                for (int i=0;i<users.size();i++){
                    if (computableModelVersion.getModifier().equals(users.get(i).getUserName())){
                        modifier.put("modifier_oid",users.get(i).getOid());
                        modifier.put("modifier_name",users.get(i).getName());
                        break;
                    }
                }
//                jsonObject.putAll(modifier);
                jsonObject.put("modifier",modifier);
                String statuss = new String();
                if (computableModelVersion.getVerStatus() == 0){
                    statuss = "unchecked";
                }else if (computableModelVersion.getVerStatus() == -1){
                    statuss = "reject";
                }else {
                    statuss = "confirmed";
                }

                jsonObject.put("status",statuss);

//            jsonObject.put("type","model");
                //前台展示需要用户的name，所以通过uid获取用户的name
//                String name = new String();
//                List<User> users = userDao.findAll();
//                for (int i=0;i<users.size();i++){
//                    if (computableModelVersion.getModifier().equals(users.get(i).getUserName())){
//                        name = users.get(i).getName();
//                        break;
//                    }
//                }
//                jsonObject.put("modifierName", name);
                jsonObject.put("type", "computableModel");
                jsonObject.put("ex_type", "Computable Model");

                int status = computableModelVersion.getVerStatus();
                if (status == 0) {
                    uncheck.add(jsonObject);
                    edit.add(jsonObject);

                } else if (status == 1) {
                    accept.add(jsonObject);
                    edit.add(jsonObject);

                } else if (status == -1) {
                    reject.add(jsonObject);
                    edit.add(jsonObject);

                }
            }

            //self
            List<ComputableModelVersion> computableModelVersionList_self = computableModelVersionDao.findAll();
            List<ComputableModelVersion> computableModelVersions_self = new ArrayList<>();
            for (int i=0;i<computableModelVersionList_self.size();i++){
                if (uid.equals(computableModelVersionList_self.get(i).getModifier())){
                    computableModelVersions_self.add(computableModelVersionList_self.get(i));
                }
            }

            for (ComputableModelVersion computableModelVersion : computableModelVersions_self) {

                JSONObject jsonObject = new JSONObject();
                jsonObject.put("name", computableModelVersion.getName());
                jsonObject.put("oid", computableModelVersion.getOid());
                jsonObject.put("originOid", computableModelVersion.getOriginOid());
                jsonObject.put("readStatus",computableModelVersion.getReadStatus());
                SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                jsonObject.put("modifyTime", sdf.format(computableModelVersion.getModifyTime()));
                SimpleDateFormat sdf1 = new SimpleDateFormat("yyyy-MM-dd");
                jsonObject.put("modifyTimeDay",sdf1.format(computableModelVersion.getModifyTime()));
                if (computableModelVersion.getAcceptTime()!=null){
                    jsonObject.put("acceptTime",sdf.format(computableModelVersion.getAcceptTime()));
                    jsonObject.put("acceptTimeDay",sdf1.format(computableModelVersion.getAcceptTime()));
                }
                if (computableModelVersion.getRejectTime()!=null){
                    jsonObject.put("rejectTime",sdf.format(computableModelVersion.getRejectTime()));
                    jsonObject.put("rejectTimeDay",sdf.format(computableModelVersion.getRejectTime()));
                }
                JSONObject modifier = new JSONObject();

                modifier.put("modifier", computableModelVersion.getModifier());
                List<User> users = userDao.findAll();
                for (int i=0;i<users.size();i++){
                    if (computableModelVersion.getModifier().equals(users.get(i).getUserName())){
                        modifier.put("modifier_oid",users.get(i).getOid());
                        modifier.put("modifier_name",users.get(i).getName());
                        break;
                    }
                }
//                jsonObject.putAll(modifier);
                jsonObject.put("modifier",modifier);
                String statuss = new String();
                if (computableModelVersion.getVerStatus() == 0){
                    statuss = "unchecked";
                }else if (computableModelVersion.getVerStatus() == -1){
                    statuss = "reject";
                }else {
                    statuss = "confirmed";
                }

                jsonObject.put("status",statuss);

//            jsonObject.put("type","model");
                //前台展示需要用户的name，所以通过uid获取用户的name
//                String name = new String();
//                List<User> users = userDao.findAll();
//                for (int i=0;i<users.size();i++){
//                    if (computableModelVersion.getModifier().equals(users.get(i).getUserName())){
//                        name = users.get(i).getName();
//                        break;
//                    }
//                }
//                jsonObject.put("modifierName", name);
                jsonObject.put("type", "computableModel");
                jsonObject.put("ex_type", "Computable Model");

                int status = computableModelVersion.getVerStatus();
                if (status == 0) {
                    uncheck_self.add(jsonObject);
                } else if (status == 1) {
                    accept_self.add(jsonObject);
                } else if (status == -1) {
                    reject_self.add(jsonObject);
                }
            }
//写到这了
            List<ConceptVersion> conceptVersionList = conceptVersionDao.findAll();
            List<ConceptVersion> conceptVersions = new ArrayList<>();
            for (int i=0;i<conceptVersionList.size();i++){
                if (uid.equals(conceptVersionList.get(i).getCreator())){
                    conceptVersions.add(conceptVersionList.get(i));
                }
            }

            for (ConceptVersion conceptVersion : conceptVersions) {

                JSONObject jsonObject = new JSONObject();
                jsonObject.put("name", conceptVersion.getName());
                jsonObject.put("oid", conceptVersion.getOid());
                jsonObject.put("originOid", conceptVersion.getOriginOid());
                SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                jsonObject.put("modifyTime", sdf.format(conceptVersion.getModifyTime()));
                SimpleDateFormat sdf1 = new SimpleDateFormat("yyyy-MM-dd");
                jsonObject.put("modifyTimeDay",sdf1.format(conceptVersion.getModifyTime()));
                if (conceptVersion.getAcceptTime()!=null){
                    jsonObject.put("acceptTime",sdf.format(conceptVersion.getAcceptTime()));
                    jsonObject.put("acceptTimeDay",sdf1.format(conceptVersion.getAcceptTime()));
                }
                if (conceptVersion.getRejectTime()!=null){
                    jsonObject.put("rejectTime",sdf.format(conceptVersion.getRejectTime()));
                    jsonObject.put("rejectTimeDay",sdf1.format(conceptVersion.getRejectTime()));
                }

                JSONObject modifier = new JSONObject();

                modifier.put("modifier", conceptVersion.getModifier());
                List<User> users = userDao.findAll();
                for (int i=0;i<users.size();i++){
                    if (conceptVersion.getModifier().equals(users.get(i).getUserName())){
                        modifier.put("modifier_oid",users.get(i).getOid());
                        modifier.put("modifier_name",users.get(i).getName());
                        break;
                    }
                }
//                jsonObject.putAll(modifier);
                jsonObject.put("modifier",modifier);
                String statuss = new String();
                if (conceptVersion.getVerStatus() == 0){
                    statuss = "unchecked";
                }else if (conceptVersion.getVerStatus() == -1){
                    statuss = "reject";
                }else {
                    statuss = "confirmed";
                }

                jsonObject.put("status",statuss);

//            jsonObject.put("type","community");
                //前台展示需要用户的name，所以通过uid获取用户的name
//                String name = new String();
//                List<User> users = userDao.findAll();
//                for (int i=0;i<users.size();i++){
//                    if (conceptVersion.getModifier().equals(users.get(i).getUserName())){
//                        name = users.get(i).getName();
//                        break;
//                    }
//                }
//                jsonObject.put("modifierName", name);
                jsonObject.put("type", "concept");
                jsonObject.put("ex_type", "Concept");

                int status = conceptVersion.getVerStatus();
                if (status == 0) {
                    uncheck.add(jsonObject);
                    edit.add(jsonObject);

                } else if (status == 1) {
                    accept.add(jsonObject);
                    edit.add(jsonObject);

                } else if (status == -1) {
                    reject.add(jsonObject);
                    edit.add(jsonObject);

                }
            }

            //self
            List<ConceptVersion> conceptVersionList_self = conceptVersionDao.findAll();
            List<ConceptVersion> conceptVersions_self = new ArrayList<>();
            for (int i=0;i<conceptVersionList_self.size();i++){
                if (uid.equals(conceptVersionList_self.get(i).getModifier())){
                    conceptVersions_self.add(conceptVersionList_self.get(i));
                }
            }

            for (ConceptVersion conceptVersion : conceptVersions_self) {

                JSONObject jsonObject = new JSONObject();
                jsonObject.put("name", conceptVersion.getName());
                jsonObject.put("oid", conceptVersion.getOid());
                jsonObject.put("originOid", conceptVersion.getOriginOid());
                jsonObject.put("readStatus",conceptVersion.getReadStatus());
                SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                jsonObject.put("modifyTime", sdf.format(conceptVersion.getModifyTime()));
                SimpleDateFormat sdf1 = new SimpleDateFormat("yyyy-MM-dd");
                jsonObject.put("modifyTimeDay",sdf1.format(conceptVersion.getModifyTime()));
                if (conceptVersion.getAcceptTime()!=null){
                    jsonObject.put("acceptTime",sdf.format(conceptVersion.getAcceptTime()));
                    jsonObject.put("acceptTimeDay",sdf1.format(conceptVersion.getAcceptTime()));
                }
                if (conceptVersion.getRejectTime()!=null){
                    jsonObject.put("rejectTime",sdf.format(conceptVersion.getRejectTime()));
                    jsonObject.put("rejectTimeDay",sdf1.format(conceptVersion.getRejectTime()));
                }

                JSONObject modifier = new JSONObject();

                modifier.put("modifier", conceptVersion.getModifier());
                List<User> users = userDao.findAll();
                for (int i=0;i<users.size();i++){
                    if (conceptVersion.getModifier().equals(users.get(i).getUserName())){
                        modifier.put("modifier_oid",users.get(i).getOid());
                        modifier.put("modifier_name",users.get(i).getName());
                        break;
                    }
                }
//                jsonObject.putAll(modifier);
                jsonObject.put("modifier",modifier);
                String statuss = new String();
                if (conceptVersion.getVerStatus() == 0){
                    statuss = "unchecked";
                }else if (conceptVersion.getVerStatus() == -1){
                    statuss = "reject";
                }else {
                    statuss = "confirmed";
                }

                jsonObject.put("status",statuss);

//            jsonObject.put("type","community");
                //前台展示需要用户的name，所以通过uid获取用户的name
//                String name = new String();
//                List<User> users = userDao.findAll();
//                for (int i=0;i<users.size();i++){
//                    if (conceptVersion.getModifier().equals(users.get(i).getUserName())){
//                        name = users.get(i).getName();
//                        break;
//                    }
//                }
//                jsonObject.put("modifierName", name);
                jsonObject.put("type", "concept");
                jsonObject.put("ex_type", "Concept");

                int status = conceptVersion.getVerStatus();
                if (status == 0) {
                    uncheck_self.add(jsonObject);
                } else if (status == 1) {
                    accept_self.add(jsonObject);
                } else if (status == -1) {
                    reject_self.add(jsonObject);
                }
            }

            List<TemplateVersion> templateVersionList = templateVersionDao.findAll();
            List<TemplateVersion> templateVersions = new ArrayList<>();
            for (int i=0;i<templateVersionList.size();i++){
                if (uid.equals(templateVersionList.get(i).getCreator())){
                    templateVersions.add(templateVersionList.get(i));
                }
            }

            for (TemplateVersion templateVersion : templateVersions) {

                JSONObject jsonObject = new JSONObject();
                jsonObject.put("name", templateVersion.getName());
                jsonObject.put("oid", templateVersion.getOid());
                jsonObject.put("originOid", templateVersion.getOriginOid());
                SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                jsonObject.put("modifyTime", sdf.format(templateVersion.getModifyTime()));
                SimpleDateFormat sdf1 = new SimpleDateFormat("yyyy-MM-dd");
                jsonObject.put("modifyTimeDay",sdf1.format(templateVersion.getModifyTime()));
                if (templateVersion.getAcceptTime()!=null){
                    jsonObject.put("acceptTime",sdf.format(templateVersion.getAcceptTime()));
                    jsonObject.put("acceptTimeDay",sdf1.format(templateVersion.getAcceptTime()));
                }
                if (templateVersion.getRejectTime()!=null){
                    jsonObject.put("rejectTime",sdf.format(templateVersion.getRejectTime()));
                    jsonObject.put("rejectTimeDay",sdf1.format(templateVersion.getRejectTime()));
                }

                JSONObject modifier = new JSONObject();

                modifier.put("modifier", templateVersion.getModifier());
                List<User> users = userDao.findAll();
                for (int i=0;i<users.size();i++){
                    if (templateVersion.getModifier().equals(users.get(i).getUserName())){
                        modifier.put("modifier_oid",users.get(i).getOid());
                        modifier.put("modifier_name",users.get(i).getName());
                        break;
                    }
                }
//                jsonObject.putAll(modifier);
                jsonObject.put("modifier",modifier);
                String statuss = new String();
                if (templateVersion.getVerStatus() == 0){
                    statuss = "unchecked";
                }else if (templateVersion.getVerStatus() == -1){
                    statuss = "reject";
                }else {
                    statuss = "confirmed";
                }

                jsonObject.put("status",statuss);

//            jsonObject.put("type","community");
                //前台展示需要用户的name，所以通过uid获取用户的name
//                String name = new String();
//                List<User> users = userDao.findAll();
//                for (int i=0;i<users.size();i++){
//                    if (templateVersion.getModifier().equals(users.get(i).getUserName())){
//                        name = users.get(i).getName();
//                        break;
//                    }
//                }
//                jsonObject.put("modifierName", name);
                jsonObject.put("type", "template");
                jsonObject.put("ex_type", "Template");

                int status = templateVersion.getVerStatus();
                if (status == 0) {
                    uncheck.add(jsonObject);
                    edit.add(jsonObject);

                } else if (status == 1) {
                    accept.add(jsonObject);
                    edit.add(jsonObject);

                } else if (status == -1) {
                    reject.add(jsonObject);
                    edit.add(jsonObject);

                }
            }

            //self
            List<TemplateVersion> templateVersionList_self = templateVersionDao.findAll();
            List<TemplateVersion> templateVersions_self = new ArrayList<>();
            for (int i=0;i<templateVersionList_self.size();i++){
                if (uid.equals(templateVersionList_self.get(i).getModifier())){
                    templateVersions_self.add(templateVersionList_self.get(i));
                }
            }

            for (TemplateVersion templateVersion : templateVersions_self) {

                JSONObject jsonObject = new JSONObject();
                jsonObject.put("name", templateVersion.getName());
                jsonObject.put("oid", templateVersion.getOid());
                jsonObject.put("originOid", templateVersion.getOriginOid());
                jsonObject.put("readStatus",templateVersion.getReadStatus());
                SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                jsonObject.put("modifyTime", sdf.format(templateVersion.getModifyTime()));
                SimpleDateFormat sdf1 = new SimpleDateFormat("yyyy-MM-dd");
                jsonObject.put("modifyTimeDay",sdf1.format(templateVersion.getModifyTime()));
                if (templateVersion.getAcceptTime()!=null){
                    jsonObject.put("acceptTime",sdf.format(templateVersion.getAcceptTime()));
                    jsonObject.put("acceptTimeDay",sdf1.format(templateVersion.getAcceptTime()));
                }
                if (templateVersion.getRejectTime()!=null){
                    jsonObject.put("rejectTime",sdf.format(templateVersion.getRejectTime()));
                    jsonObject.put("rejectTimeDay",sdf1.format(templateVersion.getRejectTime()));
                }

                JSONObject modifier = new JSONObject();

                modifier.put("modifier", templateVersion.getModifier());
                List<User> users = userDao.findAll();
                for (int i=0;i<users.size();i++){
                    if (templateVersion.getModifier().equals(users.get(i).getUserName())){
                        modifier.put("modifier_oid",users.get(i).getOid());
                        modifier.put("modifier_name",users.get(i).getName());
                        break;
                    }
                }
//                jsonObject.putAll(modifier);
                jsonObject.put("modifier",modifier);
                String statuss = new String();
                if (templateVersion.getVerStatus() == 0){
                    statuss = "unchecked";
                }else if (templateVersion.getVerStatus() == -1){
                    statuss = "reject";
                }else {
                    statuss = "confirmed";
                }

                jsonObject.put("status",statuss);

//            jsonObject.put("type","community");
                //前台展示需要用户的name，所以通过uid获取用户的name
//                String name = new String();
//                List<User> users = userDao.findAll();
//                for (int i=0;i<users.size();i++){
//                    if (templateVersion.getModifier().equals(users.get(i).getUserName())){
//                        name = users.get(i).getName();
//                        break;
//                    }
//                }
//                jsonObject.put("modifierName", name);
                jsonObject.put("type", "template");
                jsonObject.put("ex_type", "Template");

                int status = templateVersion.getVerStatus();
                if (status == 0) {
                    uncheck_self.add(jsonObject);

                } else if (status == 1) {
                    accept_self.add(jsonObject);

                } else if (status == -1) {
                    reject_self.add(jsonObject);
                }
            }

            List<SpatialReferenceVersion> spatialReferenceVersionList = spatialReferenceVersionDao.findAll();
            List<SpatialReferenceVersion> spatialReferenceVersions = new ArrayList<>();
            for (int i=0;i<spatialReferenceVersionList.size();i++){
                if (uid.equals(spatialReferenceVersionList.get(i).getCreator())){
                    spatialReferenceVersions.add(spatialReferenceVersionList.get(i));
                }
            }

            for (SpatialReferenceVersion spatialReferenceVersion : spatialReferenceVersions) {

                JSONObject jsonObject = new JSONObject();
                jsonObject.put("name", spatialReferenceVersion.getName());
                jsonObject.put("oid", spatialReferenceVersion.getOid());
                jsonObject.put("originOid", spatialReferenceVersion.getOriginOid());
                SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                jsonObject.put("modifyTime", sdf.format(spatialReferenceVersion.getModifyTime()));
                SimpleDateFormat sdf1 = new SimpleDateFormat("yyyy-MM-dd");
                jsonObject.put("modifyTimeDay",sdf1.format(spatialReferenceVersion.getModifyTime()));
                if (spatialReferenceVersion.getAcceptTime()!=null){
                    jsonObject.put("acceptTime",sdf.format(spatialReferenceVersion.getAcceptTime()));
                    jsonObject.put("acceptTimeDay",sdf1.format(spatialReferenceVersion.getAcceptTime()));
                }
                if (spatialReferenceVersion.getRejectTime()!=null){
                    jsonObject.put("rejectTime",sdf.format(spatialReferenceVersion.getRejectTime()));
                    jsonObject.put("rejectTimeDay",sdf1.format(spatialReferenceVersion.getRejectTime()));
                }

                JSONObject modifier = new JSONObject();

                modifier.put("modifier", spatialReferenceVersion.getModifier());
                List<User> users = userDao.findAll();
                for (int i=0;i<users.size();i++){
                    if (spatialReferenceVersion.getModifier().equals(users.get(i).getUserName())){
                        modifier.put("modifier_oid",users.get(i).getOid());
                        modifier.put("modifier_name",users.get(i).getName());
                        break;
                    }
                }
//                jsonObject.putAll(modifier);
                jsonObject.put("modifier",modifier);
                String statuss = new String();
                if (spatialReferenceVersion.getVerStatus() == 0){
                    statuss = "unchecked";
                }else if (spatialReferenceVersion.getVerStatus() == -1){
                    statuss = "reject";
                }else {
                    statuss = "confirmed";
                }

                jsonObject.put("status",statuss);

//            jsonObject.put("type","community");
                //前台展示需要用户的name，所以通过uid获取用户的name
//                String name = new String();
//                List<User> users = userDao.findAll();
//                for (int i=0;i<users.size();i++){
//                    if (spatialReferenceVersion.getModifier().equals(users.get(i).getUserName())){
//                        name = users.get(i).getName();
//                        break;
//                    }
//                }
//                jsonObject.put("modifierName", name);
                jsonObject.put("type", "spatialReference");
                jsonObject.put("ex_type", "Spatial Reference");

                int status = spatialReferenceVersion.getVerStatus();
                if (status == 0) {
                    uncheck.add(jsonObject);
                    edit.add(jsonObject);

                } else if (status == 1) {
                    accept.add(jsonObject);
                    edit.add(jsonObject);

                } else if (status == -1) {
                    reject.add(jsonObject);
                    edit.add(jsonObject);

                }
            }

            //self
            List<SpatialReferenceVersion> spatialReferenceVersionList_self = spatialReferenceVersionDao.findAll();
            List<SpatialReferenceVersion> spatialReferenceVersions_self = new ArrayList<>();
            for (int i=0;i<spatialReferenceVersionList_self.size();i++){
                if (uid.equals(spatialReferenceVersionList_self.get(i).getModifier())){
                    spatialReferenceVersions_self.add(spatialReferenceVersionList_self.get(i));
                }
            }

            for (SpatialReferenceVersion spatialReferenceVersion : spatialReferenceVersions_self) {

                JSONObject jsonObject = new JSONObject();
                jsonObject.put("name", spatialReferenceVersion.getName());
                jsonObject.put("oid", spatialReferenceVersion.getOid());
                jsonObject.put("originOid", spatialReferenceVersion.getOriginOid());
                jsonObject.put("readStatus",spatialReferenceVersion.getReadStatus());
                SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                jsonObject.put("modifyTime", sdf.format(spatialReferenceVersion.getModifyTime()));
                SimpleDateFormat sdf1 = new SimpleDateFormat("yyyy-MM-dd");
                jsonObject.put("modifyTimeDay",sdf1.format(spatialReferenceVersion.getModifyTime()));
                if (spatialReferenceVersion.getAcceptTime()!=null){
                    jsonObject.put("acceptTime",sdf.format(spatialReferenceVersion.getAcceptTime()));
                    jsonObject.put("acceptTimeDay",sdf1.format(spatialReferenceVersion.getAcceptTime()));
                }
                if (spatialReferenceVersion.getRejectTime()!=null){
                    jsonObject.put("rejectTime",sdf.format(spatialReferenceVersion.getRejectTime()));
                    jsonObject.put("rejectTimeDay",sdf1.format(spatialReferenceVersion.getRejectTime()));
                }

                JSONObject modifier = new JSONObject();

                modifier.put("modifier", spatialReferenceVersion.getModifier());
                List<User> users = userDao.findAll();
                for (int i=0;i<users.size();i++){
                    if (spatialReferenceVersion.getModifier().equals(users.get(i).getUserName())){
                        modifier.put("modifier_oid",users.get(i).getOid());
                        modifier.put("modifier_name",users.get(i).getName());
                        break;
                    }
                }
//                jsonObject.putAll(modifier);
                jsonObject.put("modifier",modifier);
                String statuss = new String();
                if (spatialReferenceVersion.getVerStatus() == 0){
                    statuss = "unchecked";
                }else if (spatialReferenceVersion.getVerStatus() == -1){
                    statuss = "reject";
                }else {
                    statuss = "confirmed";
                }

                jsonObject.put("status",statuss);

//            jsonObject.put("type","community");
                //前台展示需要用户的name，所以通过uid获取用户的name
//                String name = new String();
//                List<User> users = userDao.findAll();
//                for (int i=0;i<users.size();i++){
//                    if (spatialReferenceVersion.getModifier().equals(users.get(i).getUserName())){
//                        name = users.get(i).getName();
//                        break;
//                    }
//                }
//                jsonObject.put("modifierName", name);
                jsonObject.put("type", "spatialReference");
                jsonObject.put("ex_type", "Spatial Reference");

                int status = spatialReferenceVersion.getVerStatus();
                if (status == 0) {
                    uncheck.add(jsonObject);
                    edit.add(jsonObject);

                } else if (status == 1) {
                    accept.add(jsonObject);
                    edit.add(jsonObject);

                } else if (status == -1) {
                    reject.add(jsonObject);
                    edit.add(jsonObject);

                }
            }

            List<UnitVersion> unitVersionList = unitVersionDao.findAll();
            List<UnitVersion> unitVersions = new ArrayList<>();
            for (int i=0;i<unitVersionList.size();i++){
                if (uid.equals(unitVersionList.get(i).getCreator())){
                    unitVersions.add(unitVersionList.get(i));
                }
            }

            for (UnitVersion unitVersion : unitVersions) {

                JSONObject jsonObject = new JSONObject();
                jsonObject.put("name", unitVersion.getName());
                jsonObject.put("oid", unitVersion.getOid());
                jsonObject.put("originOid", unitVersion.getOriginOid());
                SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                jsonObject.put("modifyTime", sdf.format(unitVersion.getModifyTime()));
                SimpleDateFormat sdf1 = new SimpleDateFormat("yyyy-MM-dd");
                jsonObject.put("modifyTimeDay",sdf1.format(unitVersion.getModifyTime()));
                if (unitVersion.getAcceptTime()!=null){
                    jsonObject.put("acceptTime",sdf.format(unitVersion.getAcceptTime()));
                    jsonObject.put("acceptTimeDay",sdf1.format(unitVersion.getAcceptTime()));
                }
                if (unitVersion.getRejectTime()!=null){
                    jsonObject.put("rejectTime",sdf.format(unitVersion.getRejectTime()));
                    jsonObject.put("rejectTimeDay",sdf1.format(unitVersion.getRejectTime()));
                }
                JSONObject modifier = new JSONObject();

                modifier.put("modifier", unitVersion.getModifier());
                List<User> users = userDao.findAll();
                for (int i=0;i<users.size();i++){
                    if (unitVersion.getModifier().equals(users.get(i).getUserName())){
                        modifier.put("modifier_oid",users.get(i).getOid());
                        modifier.put("modifier_name",users.get(i).getName());
                        break;
                    }
                }
//                jsonObject.putAll(modifier);
                jsonObject.put("modifier",modifier);
                String statuss = new String();
                if (unitVersion.getVerStatus() == 0){
                    statuss = "unchecked";
                }else if (unitVersion.getVerStatus() == -1){
                    statuss = "reject";
                }else {
                    statuss = "confirmed";
                }

                jsonObject.put("status",statuss);

//            jsonObject.put("type","community");
                //前台展示需要用户的name，所以通过uid获取用户的name
//                String name = new String();
//                List<User> users = userDao.findAll();
//                for (int i=0;i<users.size();i++){
//                    if (unitVersion.getModifier().equals(users.get(i).getUserName())){
//                        name = users.get(i).getName();
//                        break;
//                    }
//                }
//                jsonObject.put("modifierName", name);
                jsonObject.put("type", "unit");
                jsonObject.put("ex_type", "Unit");

                int status = unitVersion.getVerStatus();
                if (status == 0) {
                    uncheck.add(jsonObject);
                    edit.add(jsonObject);

                } else if (status == 1) {
                    accept.add(jsonObject);
                    edit.add(jsonObject);

                } else if (status == -1) {
                    reject.add(jsonObject);
                    edit.add(jsonObject);

                }
            }

            //self
            List<UnitVersion> unitVersionList_self = unitVersionDao.findAll();
            List<UnitVersion> unitVersions_self = new ArrayList<>();
            for (int i=0;i<unitVersionList_self.size();i++){
                if (uid.equals(unitVersionList_self.get(i).getModifier())){
                    unitVersions_self.add(unitVersionList_self.get(i));
                }
            }

            for (UnitVersion unitVersion : unitVersions_self) {

                JSONObject jsonObject = new JSONObject();
                jsonObject.put("name", unitVersion.getName());
                jsonObject.put("oid", unitVersion.getOid());
                jsonObject.put("originOid", unitVersion.getOriginOid());
                jsonObject.put("readStatus",unitVersion.getReadStatus());
                SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                jsonObject.put("modifyTime", sdf.format(unitVersion.getModifyTime()));
                SimpleDateFormat sdf1 = new SimpleDateFormat("yyyy-MM-dd");
                jsonObject.put("modifyTimeDay",sdf1.format(unitVersion.getModifyTime()));
                if (unitVersion.getAcceptTime()!=null){
                    jsonObject.put("acceptTime",sdf.format(unitVersion.getAcceptTime()));
                    jsonObject.put("acceptTimeDay",sdf1.format(unitVersion.getAcceptTime()));
                }
                if (unitVersion.getRejectTime()!=null){
                    jsonObject.put("rejectTime",sdf.format(unitVersion.getRejectTime()));
                    jsonObject.put("rejectTimeDay",sdf1.format(unitVersion.getRejectTime()));
                }
                JSONObject modifier = new JSONObject();

                modifier.put("modifier", unitVersion.getModifier());
                List<User> users = userDao.findAll();
                for (int i=0;i<users.size();i++){
                    if (unitVersion.getModifier().equals(users.get(i).getUserName())){
                        modifier.put("modifier_oid",users.get(i).getOid());
                        modifier.put("modifier_name",users.get(i).getName());
                        break;
                    }
                }
//                jsonObject.putAll(modifier);
                jsonObject.put("modifier",modifier);
                String statuss = new String();
                if (unitVersion.getVerStatus() == 0){
                    statuss = "unchecked";
                }else if (unitVersion.getVerStatus() == -1){
                    statuss = "reject";
                }else {
                    statuss = "confirmed";
                }

                jsonObject.put("status",statuss);

//            jsonObject.put("type","community");
                //前台展示需要用户的name，所以通过uid获取用户的name
//                String name = new String();
//                List<User> users = userDao.findAll();
//                for (int i=0;i<users.size();i++){
//                    if (unitVersion.getModifier().equals(users.get(i).getUserName())){
//                        name = users.get(i).getName();
//                        break;
//                    }
//                }
//                jsonObject.put("modifierName", name);
                jsonObject.put("type", "unit");
                jsonObject.put("ex_type", "Unit");

                int status = unitVersion.getVerStatus();
                if (status == 0) {
                    uncheck_self.add(jsonObject);
                } else if (status == 1) {
                    accept_self.add(jsonObject);
                } else if (status == -1) {
                    reject_self.add(jsonObject);
                }
            }


        List<ThemeVersion> themeVersions = themeVersionDao.findAll();
        List<ThemeVersion> themeVersions1 = new ArrayList<>();
        for (int i=0;i<themeVersions.size();i++){
            if (uid.equals(themeVersions.get(i).getCreator())){
                themeVersions1.add(themeVersions.get(i));
            }
        }


        for (ThemeVersion themeVersion : themeVersions1) {

            JSONObject jsonObject = new JSONObject();
            jsonObject.put("name", themeVersion.getThemename());
            jsonObject.put("oid", themeVersion.getOid());//
            jsonObject.put("themeOid", themeVersion.getThemeOid());
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            jsonObject.put("modifyTime", sdf.format(themeVersion.getModifyTime()));
            SimpleDateFormat sdf1 = new SimpleDateFormat("yyyy-MM-dd");
            jsonObject.put("modifyTimeDay",sdf1.format(themeVersion.getModifyTime()));
            if (themeVersion.getAcceptTime()!=null){
                jsonObject.put("acceptTime",sdf.format(themeVersion.getAcceptTime()));
                jsonObject.put("acceptTimeDay",sdf1.format(themeVersion.getAcceptTime()));
            }
            if (themeVersion.getRejectTime()!=null){
                jsonObject.put("rejectTime",sdf.format(themeVersion.getRejectTime()));
                jsonObject.put("rejectTimeDay",sdf1.format(themeVersion.getRejectTime()));
            }
            JSONObject modifier = new JSONObject();

            modifier.put("modifier", themeVersion.getModifierOid());
            List<User> users = userDao.findAll();
            for (int i=0;i<users.size();i++){
                if (themeVersion.getModifierOid().equals(users.get(i).getOid())){
                    modifier.put("modifier_oid",users.get(i).getOid());
                    modifier.put("modifier_name",users.get(i).getName());
                    break;
                }
            }
//                jsonObject.putAll(modifier);
            jsonObject.put("modifier",modifier);
            String statuss = new String();
            if (themeVersion.getStatus() == 0){
                statuss = "unchecked";
            }else if (themeVersion.getStatus() == -1){
                statuss = "reject";
            }else {
                statuss = "confirmed";
            }

            jsonObject.put("status",statuss);

//            jsonObject.put("type","model");


            //前台展示需要用户的name，所以通过uid获取用户的name
//                String name = new String();
//                List<User> users = userDao.findAll();
//                for (int i=0;i<users.size();i++){
//                    if (modelItemVersion.getModifier().equals(users.get(i).getUserName())){
//                        name = users.get(i).getName();
//                        break;
//                    }
//                }
//                jsonObject.put("modifierName", name);
            jsonObject.put("type", "theme");
            jsonObject.put("ex_type","Theme");

            int status = themeVersion.getStatus();
            if (status == 0) {
                uncheck.add(jsonObject);
                edit.add(jsonObject);
            } else if (status == 1) {
                accept.add(jsonObject);
                edit.add(jsonObject);
            } else if (status == -1) {
                reject.add(jsonObject);
                edit.add(jsonObject);
            }
        }

        //self
        List<ThemeVersion> themeVersions_self = themeVersionDao.findAll();
        List<ThemeVersion> themeVersions1_self = new ArrayList<>();
        for (int i=0;i<themeVersions_self.size();i++){
            if (oid.equals(themeVersions_self.get(i).getModifierOid())){
                themeVersions1_self.add(themeVersions_self.get(i));
            }
        }


        for (ThemeVersion themeVersion : themeVersions1_self) {

            JSONObject jsonObject = new JSONObject();
            jsonObject.put("name", themeVersion.getThemename());
            jsonObject.put("oid", themeVersion.getOid());//
            jsonObject.put("themeOid", themeVersion.getThemeOid());
            jsonObject.put("readStatus",themeVersion.getReadStatus());

            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            jsonObject.put("modifyTime", sdf.format(themeVersion.getModifyTime()));
            SimpleDateFormat sdf1 = new SimpleDateFormat("yyyy-MM-dd");
            jsonObject.put("modifyTimeDay",sdf1.format(themeVersion.getModifyTime()));
            if (themeVersion.getAcceptTime()!=null){
                jsonObject.put("acceptTime",sdf.format(themeVersion.getAcceptTime()));
                jsonObject.put("acceptTimeDay",sdf1.format(themeVersion.getAcceptTime()));
            }
            if (themeVersion.getRejectTime()!=null){
                jsonObject.put("rejectTime",sdf.format(themeVersion.getRejectTime()));
                jsonObject.put("rejectTimeDay",sdf1.format(themeVersion.getRejectTime()));
            }
            JSONObject modifier = new JSONObject();

            modifier.put("modifier", themeVersion.getModifierOid());
            List<User> users = userDao.findAll();
            for (int i=0;i<users.size();i++){
                if (themeVersion.getModifierOid().equals(users.get(i).getOid())){
                    modifier.put("modifier_oid",users.get(i).getOid());
                    modifier.put("modifier_name",users.get(i).getName());
                    break;
                }
            }
//                jsonObject.putAll(modifier);
            jsonObject.put("modifier",modifier);
            String statuss = new String();
            if (themeVersion.getStatus() == 0){
                statuss = "unchecked";
            }else if (themeVersion.getStatus() == -1){
                statuss = "reject";
            }else {
                statuss = "confirmed";
            }

            jsonObject.put("status",statuss);

//            jsonObject.put("type","model");


            //前台展示需要用户的name，所以通过uid获取用户的name
//                String name = new String();
//                List<User> users = userDao.findAll();
//                for (int i=0;i<users.size();i++){
//                    if (modelItemVersion.getModifier().equals(users.get(i).getUserName())){
//                        name = users.get(i).getName();
//                        break;
//                    }
//                }
//                jsonObject.put("modifierName", name);
            jsonObject.put("type", "theme");
            jsonObject.put("ex_type","Theme");

            int status = themeVersion.getStatus();
            if (status == 0) {
                uncheck_self.add(jsonObject);
            } else if (status == 1) {
                accept_self.add(jsonObject);
            } else if (status == -1) {
                reject_self.add(jsonObject);
            }
        }


        //dataItem
        List<DataItemVersion> dataItemVersions = dataItemVersionDao.findAll();
        List<DataItemVersion> dataItemVersions1 = new ArrayList<>();

        for (int i=0;i<dataItemVersions.size();i++){
            if (oid.equals(dataItemVersions.get(i).getCreator())){
                dataItemVersions1.add(dataItemVersions.get(i));
            }
        }


        for (DataItemVersion dataItemVersion : dataItemVersions1) {

            JSONObject jsonObject = new JSONObject();
            jsonObject.put("name", dataItemVersion.getName());
            jsonObject.put("oid", dataItemVersion.getOid());//
            jsonObject.put("originId", dataItemVersion.getOriginId());
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            jsonObject.put("modifyTime", sdf.format(dataItemVersion.getModifyTime()));
            SimpleDateFormat sdf1 = new SimpleDateFormat("yyyy-MM-dd");
            jsonObject.put("modifyTimeDay",sdf1.format(dataItemVersion.getModifyTime()));
            if (dataItemVersion.getAcceptTime()!=null){
                jsonObject.put("acceptTime",sdf.format(dataItemVersion.getAcceptTime()));
                jsonObject.put("acceptTimeDay",sdf1.format(dataItemVersion.getAcceptTime()));
            }
            if (dataItemVersion.getRejectTime()!=null){
                jsonObject.put("rejectTime",sdf.format(dataItemVersion.getRejectTime()));
                jsonObject.put("rejectTimeDay",sdf1.format(dataItemVersion.getRejectTime()));
            }
            JSONObject modifier = new JSONObject();

            modifier.put("modifier", dataItemVersion.getModifier());
            List<User> users = userDao.findAll();
            for (int i=0;i<users.size();i++){
                if (dataItemVersion.getModifier().equals(users.get(i).getOid())){
                    modifier.put("modifier_oid",users.get(i).getOid());
                    modifier.put("modifier_name",users.get(i).getName());
                    break;
                }
            }
//                jsonObject.putAll(modifier);
            jsonObject.put("modifier",modifier);
            String statuss = new String();
            if (dataItemVersion.getVerStatus() == 0){
                statuss = "unchecked";
            }else if (dataItemVersion.getVerStatus() == -1){
                statuss = "reject";
            }else {
                statuss = "confirmed";
            }

            jsonObject.put("status",statuss);

//            jsonObject.put("type","model");


            //前台展示需要用户的name，所以通过uid获取用户的name
//                String name = new String();
//                List<User> users = userDao.findAll();
//                for (int i=0;i<users.size();i++){
//                    if (modelItemVersion.getModifier().equals(users.get(i).getUserName())){
//                        name = users.get(i).getName();
//                        break;
//                    }
//                }
//                jsonObject.put("modifierName", name);
            jsonObject.put("type", "dataItem");
            jsonObject.put("ex_type","Data Item");

            int status = dataItemVersion.getVerStatus();
            if (status == 0) {
                uncheck.add(jsonObject);
                edit.add(jsonObject);
            } else if (status == 1) {
                accept.add(jsonObject);
                edit.add(jsonObject);
            } else if (status == -1) {
                reject.add(jsonObject);
                edit.add(jsonObject);
            }
        }

        //self
        List<DataItemVersion> dataItemVersions_self = dataItemVersionDao.findAll();
        List<DataItemVersion> dataItemVersions1_self = new ArrayList<>();
        for (int i=0;i<dataItemVersions_self.size();i++){
            if (oid.equals(dataItemVersions_self.get(i).getModifier())){
                dataItemVersions1_self.add(dataItemVersions_self.get(i));
            }
        }


        for (DataItemVersion dataItemVersion : dataItemVersions1_self) {

            JSONObject jsonObject = new JSONObject();
            jsonObject.put("name", dataItemVersion.getName());
            jsonObject.put("oid", dataItemVersion.getOid());//
            jsonObject.put("originId", dataItemVersion.getOriginId());
            jsonObject.put("readStatus",dataItemVersion.getReadStatus());

            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            jsonObject.put("modifyTime", sdf.format(dataItemVersion.getModifyTime()));
            SimpleDateFormat sdf1 = new SimpleDateFormat("yyyy-MM-dd");
            jsonObject.put("modifyTimeDay",sdf1.format(dataItemVersion.getModifyTime()));
            if (dataItemVersion.getAcceptTime()!=null){
                jsonObject.put("acceptTime",sdf.format(dataItemVersion.getAcceptTime()));
                jsonObject.put("acceptTimeDay",sdf1.format(dataItemVersion.getAcceptTime()));
            }
            if (dataItemVersion.getRejectTime()!=null){
                jsonObject.put("rejectTime",sdf.format(dataItemVersion.getRejectTime()));
                jsonObject.put("rejectTimeDay",sdf1.format(dataItemVersion.getRejectTime()));
            }
            JSONObject modifier = new JSONObject();

            modifier.put("modifier", dataItemVersion.getModifier());
            List<User> users = userDao.findAll();
            for (int i=0;i<users.size();i++){
                if (dataItemVersion.getModifier().equals(users.get(i).getOid())){
                    modifier.put("modifier_oid",users.get(i).getOid());
                    modifier.put("modifier_name",users.get(i).getName());
                    break;
                }
            }
//                jsonObject.putAll(modifier);
            jsonObject.put("modifier",modifier);
            String statuss = new String();
            if (dataItemVersion.getVerStatus() == 0){
                statuss = "unchecked";
            }else if (dataItemVersion.getVerStatus() == -1){
                statuss = "reject";
            }else {
                statuss = "confirmed";
            }

            jsonObject.put("status",statuss);

//            jsonObject.put("type","model");


            //前台展示需要用户的name，所以通过uid获取用户的name
//                String name = new String();
//                List<User> users = userDao.findAll();
//                for (int i=0;i<users.size();i++){
//                    if (modelItemVersion.getModifier().equals(users.get(i).getUserName())){
//                        name = users.get(i).getName();
//                        break;
//                    }
//                }
//                jsonObject.put("modifierName", name);
            jsonObject.put("type", "dataItem");
            jsonObject.put("ex_type","Data Item");

            int status = dataItemVersion.getVerStatus();
            if (status == 0) {
                uncheck_self.add(jsonObject);
            } else if (status == 1) {
                accept_self.add(jsonObject);
            } else if (status == -1) {
                reject_self.add(jsonObject);
            }
        }


        //todo dataApplication
        //dataApplication
        List<DataApplicationVersion> dataApplicationVersions = dataApplicationVersionDao.findAll();
        List<DataApplicationVersion> dataApplicationVersions1 = new ArrayList<>();

        for (int i=0;i<dataApplicationVersions.size();i++){
            if (oid.equals(dataApplicationVersions.get(i).getAuthor())){
                dataApplicationVersions1.add(dataApplicationVersions.get(i));
            }
        }


        for (DataApplicationVersion dataApplicationVersion : dataApplicationVersions1) {

            JSONObject jsonObject = new JSONObject();
            jsonObject.put("name", dataApplicationVersion.getName());
            jsonObject.put("oid", dataApplicationVersion.getOid());//
            jsonObject.put("originId", dataApplicationVersion.getOriginId());
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            jsonObject.put("modifyTime", sdf.format(dataApplicationVersion.getModifyTime()));
            SimpleDateFormat sdf1 = new SimpleDateFormat("yyyy-MM-dd");
            jsonObject.put("modifyTimeDay",sdf1.format(dataApplicationVersion.getModifyTime()));
            if (dataApplicationVersion.getAcceptTime()!=null){
                jsonObject.put("acceptTime",sdf.format(dataApplicationVersion.getAcceptTime()));
                jsonObject.put("acceptTimeDay",sdf1.format(dataApplicationVersion.getAcceptTime()));
            }
            if (dataApplicationVersion.getRejectTime()!=null){
                jsonObject.put("rejectTime",sdf.format(dataApplicationVersion.getRejectTime()));
                jsonObject.put("rejectTimeDay",sdf1.format(dataApplicationVersion.getRejectTime()));
            }
            JSONObject modifier = new JSONObject();

            modifier.put("modifier", dataApplicationVersion.getModifier());
            List<User> users = userDao.findAll();
            for (int i=0;i<users.size();i++){
                if (dataApplicationVersion.getModifier().equals(users.get(i).getOid())){
                    modifier.put("modifier_oid",users.get(i).getOid());
                    modifier.put("modifier_name",users.get(i).getName());
                    break;
                }
            }
//                jsonObject.putAll(modifier);
            jsonObject.put("modifier",modifier);
            String statuss = new String();
            if (dataApplicationVersion.getVerStatus() == 0){
                statuss = "unchecked";
            }else if (dataApplicationVersion.getVerStatus() == -1){
                statuss = "reject";
            }else {
                statuss = "confirmed";
            }

            jsonObject.put("status",statuss);
            jsonObject.put("type", "dataApplication");
            jsonObject.put("ex_type","Data Application");

            int status = dataApplicationVersion.getVerStatus();
            if (status == 0) {
                uncheck.add(jsonObject);
                edit.add(jsonObject);
            } else if (status == 1) {
                accept.add(jsonObject);
                edit.add(jsonObject);
            } else if (status == -1) {
                reject.add(jsonObject);
                edit.add(jsonObject);
            }
        }

        //self
        List<DataApplicationVersion> dataApplicationVersions_self = dataApplicationVersionDao.findAll();
        List<DataApplicationVersion> dataApplicationVersions1_self = new ArrayList<>();
        for (int i=0;i<dataApplicationVersions_self.size();i++){
            if (oid.equals(dataApplicationVersions_self.get(i).getModifier())){
                dataApplicationVersions1_self.add(dataApplicationVersions_self.get(i));
            }
        }


        for (DataApplicationVersion dataApplicationVersion : dataApplicationVersions1_self) {
            JSONObject jsonObject = new JSONObject();
            jsonObject.put("name", dataApplicationVersion.getName());
            jsonObject.put("oid", dataApplicationVersion.getOid());//
            jsonObject.put("originId", dataApplicationVersion.getOriginId());
            jsonObject.put("readStatus",dataApplicationVersion.getReadStatus());

            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            jsonObject.put("modifyTime", sdf.format(dataApplicationVersion.getModifyTime()));
            SimpleDateFormat sdf1 = new SimpleDateFormat("yyyy-MM-dd");
            jsonObject.put("modifyTimeDay",sdf1.format(dataApplicationVersion.getModifyTime()));
            if (dataApplicationVersion.getAcceptTime()!=null){
                jsonObject.put("acceptTime",sdf.format(dataApplicationVersion.getAcceptTime()));
                jsonObject.put("acceptTimeDay",sdf1.format(dataApplicationVersion.getAcceptTime()));
            }
            if (dataApplicationVersion.getRejectTime()!=null){
                jsonObject.put("rejectTime",sdf.format(dataApplicationVersion.getRejectTime()));
                jsonObject.put("rejectTimeDay",sdf1.format(dataApplicationVersion.getRejectTime()));
            }
            JSONObject modifier = new JSONObject();

            modifier.put("modifier", dataApplicationVersion.getModifier());
            List<User> users = userDao.findAll();
            for (int i=0;i<users.size();i++){
                if (dataApplicationVersion.getModifier().equals(users.get(i).getOid())){
                    modifier.put("modifier_oid",users.get(i).getOid());
                    modifier.put("modifier_name",users.get(i).getName());
                    break;
                }
            }
//                jsonObject.putAll(modifier);
            jsonObject.put("modifier",modifier);
            String statuss = new String();
            if (dataApplicationVersion.getVerStatus() == 0){
                statuss = "unchecked";
            }else if (dataApplicationVersion.getVerStatus() == -1){
                statuss = "reject";
            }else {
                statuss = "confirmed";
            }

            jsonObject.put("status",statuss);
            jsonObject.put("type", "dataApplication");
            jsonObject.put("ex_type","Data Application");

            int status = dataApplicationVersion.getVerStatus();
            if (status == 0) {
                uncheck_self.add(jsonObject);
            } else if (status == 1) {
                accept_self.add(jsonObject);
            } else if (status == -1) {
                reject_self.add(jsonObject);
            }
        }

        //dataHubs
        List<DataHubsVersion> dataHubsVersions = dataHubsVersionDao.findAll();
        List<DataHubsVersion> dataHubsVersions1 = new ArrayList<>();

        for (int i=0;i<dataHubsVersions.size();i++){
            if (oid.equals(dataHubsVersions.get(i).getCreator())){
                dataHubsVersions1.add(dataHubsVersions.get(i));
            }
        }


        for (DataHubsVersion dataHubsVersion : dataHubsVersions1) {

            JSONObject jsonObject = new JSONObject();
            jsonObject.put("name", dataHubsVersion.getName());
            jsonObject.put("oid", dataHubsVersion.getOid());//
            jsonObject.put("originId", dataHubsVersion.getOriginId());
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            jsonObject.put("modifyTime", sdf.format(dataHubsVersion.getModifyTime()));
            SimpleDateFormat sdf1 = new SimpleDateFormat("yyyy-MM-dd");
            jsonObject.put("modifyTimeDay",sdf1.format(dataHubsVersion.getModifyTime()));
            if (dataHubsVersion.getAcceptTime()!=null){
                jsonObject.put("acceptTime",sdf.format(dataHubsVersion.getAcceptTime()));
                jsonObject.put("acceptTimeDay",sdf1.format(dataHubsVersion.getAcceptTime()));
            }
            if (dataHubsVersion.getRejectTime()!=null){
                jsonObject.put("rejectTime",sdf.format(dataHubsVersion.getRejectTime()));
                jsonObject.put("rejectTimeDay",sdf1.format(dataHubsVersion.getRejectTime()));
            }
            JSONObject modifier = new JSONObject();

            modifier.put("modifier", dataHubsVersion.getModifier());
            List<User> users = userDao.findAll();
            for (int i=0;i<users.size();i++){
                if (dataHubsVersion.getModifier().equals(users.get(i).getOid())){
                    modifier.put("modifier_oid",users.get(i).getOid());
                    modifier.put("modifier_name",users.get(i).getName());
                    break;
                }
            }
//                jsonObject.putAll(modifier);
            jsonObject.put("modifier",modifier);
            String statuss = new String();
            if (dataHubsVersion.getVerStatus() == 0){
                statuss = "unchecked";
            }else if (dataHubsVersion.getVerStatus() == -1){
                statuss = "reject";
            }else {
                statuss = "confirmed";
            }

            jsonObject.put("status",statuss);

//            jsonObject.put("type","model");


            //前台展示需要用户的name，所以通过uid获取用户的name
//                String name = new String();
//                List<User> users = userDao.findAll();
//                for (int i=0;i<users.size();i++){
//                    if (modelItemVersion.getModifier().equals(users.get(i).getUserName())){
//                        name = users.get(i).getName();
//                        break;
//                    }
//                }
//                jsonObject.put("modifierName", name);
            jsonObject.put("type", "dataHubs");
            jsonObject.put("ex_type","Data Hubs");

            int status = dataHubsVersion.getVerStatus();
            if (status == 0) {
                uncheck.add(jsonObject);
                edit.add(jsonObject);
            } else if (status == 1) {
                accept.add(jsonObject);
                edit.add(jsonObject);
            } else if (status == -1) {
                reject.add(jsonObject);
                edit.add(jsonObject);
            }
        }

        //self
        List<DataHubsVersion> dataHubsVersions_self = dataHubsVersionDao.findAll();
        List<DataHubsVersion> dataHubsVersions1_self = new ArrayList<>();
        for (int i=0;i<dataHubsVersions_self.size();i++){
            if (oid.equals(dataHubsVersions_self.get(i).getModifier())){
                dataHubsVersions1_self.add(dataHubsVersions_self.get(i));
            }
        }


        for (DataHubsVersion dataHubsVersion : dataHubsVersions1_self) {

            JSONObject jsonObject = new JSONObject();
            jsonObject.put("name", dataHubsVersion.getName());
            jsonObject.put("oid", dataHubsVersion.getOid());//
            jsonObject.put("originId", dataHubsVersion.getOriginId());
            jsonObject.put("readStatus",dataHubsVersion.getReadStatus());

            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            jsonObject.put("modifyTime", sdf.format(dataHubsVersion.getModifyTime()));
            SimpleDateFormat sdf1 = new SimpleDateFormat("yyyy-MM-dd");
            jsonObject.put("modifyTimeDay",sdf1.format(dataHubsVersion.getModifyTime()));
            if (dataHubsVersion.getAcceptTime()!=null){
                jsonObject.put("acceptTime",sdf.format(dataHubsVersion.getAcceptTime()));
                jsonObject.put("acceptTimeDay",sdf1.format(dataHubsVersion.getAcceptTime()));
            }
            if (dataHubsVersion.getRejectTime()!=null){
                jsonObject.put("rejectTime",sdf.format(dataHubsVersion.getRejectTime()));
                jsonObject.put("rejectTimeDay",sdf1.format(dataHubsVersion.getRejectTime()));
            }
            JSONObject modifier = new JSONObject();

            modifier.put("modifier", dataHubsVersion.getModifier());
            List<User> users = userDao.findAll();
            for (int i=0;i<users.size();i++){
                if (dataHubsVersion.getModifier().equals(users.get(i).getOid())){
                    modifier.put("modifier_oid",users.get(i).getOid());
                    modifier.put("modifier_name",users.get(i).getName());
                    break;
                }
            }
//                jsonObject.putAll(modifier);
            jsonObject.put("modifier",modifier);
            String statuss = new String();
            if (dataHubsVersion.getVerStatus() == 0){
                statuss = "unchecked";
            }else if (dataHubsVersion.getVerStatus() == -1){
                statuss = "reject";
            }else {
                statuss = "confirmed";
            }

            jsonObject.put("status",statuss);

//            jsonObject.put("type","model");


            //前台展示需要用户的name，所以通过uid获取用户的name
//                String name = new String();
//                List<User> users = userDao.findAll();
//                for (int i=0;i<users.size();i++){
//                    if (modelItemVersion.getModifier().equals(users.get(i).getUserName())){
//                        name = users.get(i).getName();
//                        break;
//                    }
//                }
//                jsonObject.put("modifierName", name);
            jsonObject.put("type", "dataHubs");
            jsonObject.put("ex_type","Data Hubs");

            int status = dataHubsVersion.getVerStatus();
            if (status == 0) {
                uncheck_self.add(jsonObject);
            } else if (status == 1) {
                accept_self.add(jsonObject);
            } else if (status == -1) {
                reject_self.add(jsonObject);
            }
        }


        //result
            result.put("uncheck", uncheck);
            result.put("accept", accept);
            result.put("reject", reject);
            result.put("edit",edit);
            result.put("uncheck_self",uncheck_self);
            result.put("accept_self",accept_self);
            result.put("reject_self",reject_self);

            return result;

    }

    public JSONObject getDataVersion(HttpServletRequest request){
        JSONObject jsonObject = new JSONObject();
        return jsonObject;
    }

    public JSONObject update(ThemeUpdateDTO themeUpdateDTO, String uid,String oid){
        Theme theme = themeDao.findFirstByOid(themeUpdateDTO.getThemeOid());
        String author = theme.getAuthor();
        String authorUserName = theme.getAuthor();
        if (!theme.isLock()){
            if (author.equals(uid)){
                themeUpdateDTO.setCreator_name(theme.getCreator_name());
                themeUpdateDTO.setCreator_oid(theme.getCreator_oid());
                themeUpdateDTO.setMaintainer(theme.getMaintainer());
                BeanUtils.copyProperties(themeUpdateDTO, theme);
                //判断是否为新图片
                String uploadImage = themeUpdateDTO.getUploadImage();
                if (!uploadImage.contains("/theme/")&&!uploadImage.equals("")){
                    //删除旧图片
                    File file = new File(resourcePath + theme.getImage());
                    if (file.exists()&&file.isFile())
                        file.delete();
                    //添加新图片
                    String path = "/theme/" + UUID.randomUUID().toString() + ".jpg";
                    String imgStr = uploadImage.split(",")[1];
                    Utils.base64StrToImage(imgStr, resourcePath + path);
                    theme.setImage(path);
                }
                theme.setLastModifyTime(new Date());
                theme.setDetail(Utils.saveBase64Image(theme.getDetail(),theme.getOid(),resourcePath,htmlLoadPath));

                List<Application> applications = themeUpdateDTO.getApplication();
                for(int i = 0;i<applications.size();i++){
                    String path1 = "/repository/theme/" + UUID.randomUUID().toString() + ".jpg";
                    Application application = applications.get(i);
                    String[] strs1 = application.getUpload_application_image().split(",");
                    if(strs1.length>1){
                        String imgStr = application.getUpload_application_image().split(",")[1];
                        Utils.base64StrToImage(imgStr, resourcePath+path1);
                        application.setApplication_image(path1);
                        //因为upload_application_image为base64，存入数据库非常占内存，故在此处将此属性转为空存入
                        application.setUpload_application_image("");
                    } else {
                        application.setApplication_image(application.getUpload_application_image());
                        application.setUpload_application_image("");
                    }
                }
                theme.setApplication(applications);
                themeDao.save(theme);

                JSONObject result = new JSONObject();
                result.put("method", "update");
                result.put("oid",theme.getOid());

                return result;
            }else {
                ThemeVersion themeVersion = new ThemeVersion();
                BeanUtils.copyProperties(themeUpdateDTO,themeVersion,"id");

                String uploadImage = themeUpdateDTO.getUploadImage();
                if (uploadImage.equals("")){
                    themeVersion.setImage("");
                }else if (!uploadImage.contains("/theme/")&&!uploadImage.equals("")){
                    String path = "/theme/" + UUID.randomUUID().toString() + ".jpg";
                    String imgStr = uploadImage.split(",")[1];
                    Utils.base64StrToImage(imgStr, resourcePath + path);
                    themeVersion.setImage(path);
                }else {
                    String[] names = uploadImage.split("theme");
                    themeVersion.setImage("/repository/theme/"+names[1]);
                }

                List<Application> applications = themeUpdateDTO.getApplication();
                for(int i = 0;i<applications.size();i++){
                    String path1 = "/repository/theme/" + UUID.randomUUID().toString() + ".jpg";
                    Application application = applications.get(i);
                    String[] strs1 = application.getUpload_application_image().split(",");
                    if(strs1.length>1){
                        String imgStr = application.getUpload_application_image().split(",")[1];
                        Utils.base64StrToImage(imgStr, resourcePath+path1);
                        application.setApplication_image(path1);
                        //因为upload_application_image为base64，存入数据库非常占内存，故在此处将此属性转为空存入
                        application.setUpload_application_image("");
                    } else {
                        application.setApplication_image(application.getUpload_application_image());
                        application.setUpload_application_image("");
                    }
                }
                themeVersion.setApplication(applications);
                themeVersion.setMaintainer(theme.getMaintainer());
                themeVersion.setModifierOid(oid);
                themeVersion.setStatus(0);
                userService.messageNumPlusPlus(authorUserName);
                themeVersion.setModifyTime(new Date());
                themeVersion.setDetail(Utils.saveBase64Image(themeUpdateDTO.getDetail(),theme.getOid(),resourcePath,htmlLoadPath));
                themeVersion.setCreator(author);
                themeVersion.setThemeOid(theme.getOid());
                themeVersion.setOid(UUID.randomUUID().toString());
                themeVersionDao.insert(themeVersion);

                theme.setLock(true);
                themeDao.save(theme);

                JSONObject result = new JSONObject();
                result.put("method", "version");
                result.put("oid", themeVersion.getOid());

                return result;
            }
        }
        else {
            return null;
        }
    }

    public ModelAndView getThemeEditPage(String id){
        //条目信息
        ModelAndView modelAndView = new ModelAndView();

        ThemeVersion theme = themeVersionDao.findFirstByOid(id);

        if(theme==null){
            modelAndView.setViewName("error/404");
            return modelAndView;
        }

        modelAndView.setViewName("theme_info");
        modelAndView.addObject("info", theme);


        //详情页面
        //String detailResult;
        String theme_detailDesc=theme.getDetail();

        JSONArray array = new JSONArray();

        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

//        String lastModifyTime = sdf.format(theme.getLastModifyTime());

        //用户信息
//        JSONObject userJson = userService.getItemUserInfo(theme.getAuthor());

        List<ClassInfo> classInfos = theme.getClassinfo();
        JSONArray classInfos_result = new JSONArray();
        for(int i=0;i<classInfos.size();i++){
            ClassInfo classInfo = classInfos.get(i);
            JSONObject classObj=new JSONObject();
            classObj.put("name",classInfo.getMcname());
            JSONArray models=new JSONArray();
            List<String> modelOids=classInfo.getModelsoid();
            for(int j=0;j<modelOids.size();j++) {
                JSONObject model=new JSONObject();
                ModelItem modelItem=modelItemDao.findFirstByOid(modelOids.get(j));
                model.put("name",modelItem.getName());
                model.put("image",modelItem.getImage());
                model.put("oid",modelItem.getOid());
                models.add(model);
            }
            classObj.put("content",models);
            classInfos_result.add(classObj);
        }
        List<DataClassInfo> dataClassInfos = theme.getDataClassInfo();
        JSONArray dataClassInfos_result = new JSONArray();
        for(int i=0;i<dataClassInfos.size();i++){
            DataClassInfo dataClassInfo = dataClassInfos.get(i);
            JSONObject dataclassObj = new JSONObject();
            dataclassObj.put("name",dataClassInfo.getDcname());
            JSONArray datas = new JSONArray();
            List<String> datasOid = dataClassInfo.getDatasoid();
            //JSONArray urls= new JSONArray();
            for(int j=0;j<datasOid.size();j++){
                JSONObject data = new JSONObject();
                JSONObject url = new JSONObject();
                DataItem dataItem = dataItemDao.findFirstById(datasOid.get(j));
                data.put("name",dataItem.getName());
                data.put("oid",dataItem.getId());
                //url.put("url_select",dataItem.getReference());
                //List<DataMeta> dataList = dataItem.getDataList();
                //JSONArray url_download = new JSONArray();
//                for(DataMeta dataMeta:dataList){
//                    if (dataList == null){
//                        break;
//                    }
//                    url_download.add(dataMeta.getUrl());
//                }
                //url.put("url_download",url_download);
                datas.add(data);
                //urls.add(url);
            }
            dataclassObj.put("content",datas);
            //dataclassObj.put("url",urls);
            dataClassInfos_result.add(dataclassObj);
        }

        List<Application> applications = theme.getApplication();
        JSONArray applications_result = new JSONArray();

        for(int i=0;i<applications.size();i++){
            JSONObject app = new JSONObject();
            Application application = applications.get(i);
            app.put("name",application.getApplicationname());
            app.put("link",application.getApplicationlink());
            app.put("image",application.getApplication_image());
            applications_result.add(app);
        }

        List<Maintainer> maintainers = theme.getMaintainer();
        JSONArray maintainer_result = new JSONArray();
        if (maintainers!=null) {
            for (int i = 0; i < maintainers.size(); i++) {
                JSONObject ma = new JSONObject();
                Maintainer maintainer = maintainers.get(i);
                ma.put("name", maintainer.getName());
                ma.put("id", maintainer.getId());
                maintainer_result.add(ma);
            }
        }

        modelAndView.addObject("image", htmlLoadPath+theme.getImage());
        modelAndView.addObject("detail",theme_detailDesc);
        modelAndView.addObject("year", Calendar.getInstance().getWeekYear());
//        modelAndView.addObject("date", sdf.format(theme.getCreateTime()));
//        modelAndView.addObject("references",JSONArray.parseArray(JSON.toJSONString(theme.getReferences())));
        modelAndView.addObject("modelClassInfos",classInfos_result);
        modelAndView.addObject("dataClassInfos",dataClassInfos_result);
        modelAndView.addObject("applications",applications_result);
        modelAndView.addObject("maintainer",maintainer_result);

        return modelAndView;
    }
    public ModelAndView getThemeAccept(String id){
        //条目信息
        ModelAndView modelAndView = new ModelAndView();

        ThemeVersion theme = themeVersionDao.findFirstByOid(id);

        if(theme==null){
            modelAndView.setViewName("error/404");
            return modelAndView;
        }

        modelAndView.setViewName("theme_info");
        modelAndView.addObject("info", theme);


        //详情页面
        //String detailResult;
        String theme_detailDesc=theme.getDetail();

        JSONArray array = new JSONArray();

        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

//        String lastModifyTime = sdf.format(theme.getLastModifyTime());

        //用户信息
//        JSONObject userJson = userService.getItemUserInfo(theme.getAuthor());

        List<ClassInfo> classInfos = theme.getClassinfo();
        JSONArray classInfos_result = new JSONArray();
        for(int i=0;i<classInfos.size();i++){
            ClassInfo classInfo = classInfos.get(i);
            JSONObject classObj=new JSONObject();
            classObj.put("name",classInfo.getMcname());
            JSONArray models=new JSONArray();
            List<String> modelOids=classInfo.getModelsoid();
            for(int j=0;j<modelOids.size();j++) {
                JSONObject model=new JSONObject();
                ModelItem modelItem=modelItemDao.findFirstByOid(modelOids.get(j));
                model.put("name",modelItem.getName());
                model.put("image",modelItem.getImage());
                model.put("oid",modelItem.getOid());
                models.add(model);
            }
            classObj.put("content",models);
            classInfos_result.add(classObj);
        }
        List<DataClassInfo> dataClassInfos = theme.getDataClassInfo();
        JSONArray dataClassInfos_result = new JSONArray();
        for(int i=0;i<dataClassInfos.size();i++){
            DataClassInfo dataClassInfo = dataClassInfos.get(i);
            JSONObject dataclassObj = new JSONObject();
            dataclassObj.put("name",dataClassInfo.getDcname());
            JSONArray datas = new JSONArray();
            List<String> datasOid = dataClassInfo.getDatasoid();
            //JSONArray urls= new JSONArray();
            for(int j=0;j<datasOid.size();j++){
                JSONObject data = new JSONObject();
                JSONObject url = new JSONObject();
                DataItem dataItem = dataItemDao.findFirstById(datasOid.get(j));
                data.put("name",dataItem.getName());
                data.put("oid",dataItem.getId());
                //url.put("url_select",dataItem.getReference());
                //List<DataMeta> dataList = dataItem.getDataList();
                //JSONArray url_download = new JSONArray();
//                for(DataMeta dataMeta:dataList){
//                    if (dataList == null){
//                        break;
//                    }
//                    url_download.add(dataMeta.getUrl());
//                }
                //url.put("url_download",url_download);
                datas.add(data);
                //urls.add(url);
            }
            dataclassObj.put("content",datas);
            //dataclassObj.put("url",urls);
            dataClassInfos_result.add(dataclassObj);
        }

        List<Application> applications = theme.getApplication();
        JSONArray applications_result = new JSONArray();

        for(int i=0;i<applications.size();i++){
            JSONObject app = new JSONObject();
            Application application = applications.get(i);
            app.put("name",application.getApplicationname());
            app.put("link",application.getApplicationlink());
            app.put("image",application.getApplication_image());
            applications_result.add(app);
        }

        List<Maintainer> maintainers = theme.getMaintainer();
        JSONArray maintainer_result = new JSONArray();
        if (maintainers!=null) {
            for (int i = 0; i < maintainers.size(); i++) {
                JSONObject ma = new JSONObject();
                Maintainer maintainer = maintainers.get(i);
                ma.put("name", maintainer.getName());
                ma.put("id", maintainer.getId());
                maintainer_result.add(ma);
            }
        }

        modelAndView.addObject("image", htmlLoadPath+theme.getImage());
        modelAndView.addObject("detail",theme_detailDesc);
        modelAndView.addObject("year", Calendar.getInstance().getWeekYear());
//        modelAndView.addObject("date", sdf.format(theme.getCreateTime()));
//        modelAndView.addObject("references",JSONArray.parseArray(JSON.toJSONString(theme.getReferences())));
        modelAndView.addObject("modelClassInfos",classInfos_result);
        modelAndView.addObject("dataClassInfos",dataClassInfos_result);
        modelAndView.addObject("applications",applications_result);
        modelAndView.addObject("maintainer",maintainer_result);

        return modelAndView;
    }
    public ModelAndView getThemeReject(String id){
        //条目信息
        ModelAndView modelAndView = new ModelAndView();

        ThemeVersion theme = themeVersionDao.findFirstByOid(id);

        if(theme==null){
            modelAndView.setViewName("error/404");
            return modelAndView;
        }

        modelAndView.setViewName("theme_info");
        modelAndView.addObject("info", theme);


        //详情页面
        //String detailResult;
        String theme_detailDesc=theme.getDetail();

        JSONArray array = new JSONArray();

        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

//        String lastModifyTime = sdf.format(theme.getLastModifyTime());

        //用户信息
//        JSONObject userJson = userService.getItemUserInfo(theme.getAuthor());

        List<ClassInfo> classInfos = theme.getClassinfo();
        JSONArray classInfos_result = new JSONArray();
        for(int i=0;i<classInfos.size();i++){
            ClassInfo classInfo = classInfos.get(i);
            JSONObject classObj=new JSONObject();
            classObj.put("name",classInfo.getMcname());
            JSONArray models=new JSONArray();
            List<String> modelOids=classInfo.getModelsoid();
            for(int j=0;j<modelOids.size();j++) {
                JSONObject model=new JSONObject();
                ModelItem modelItem=modelItemDao.findFirstByOid(modelOids.get(j));
                model.put("name",modelItem.getName());
                model.put("image",modelItem.getImage());
                model.put("oid",modelItem.getOid());
                models.add(model);
            }
            classObj.put("content",models);
            classInfos_result.add(classObj);
        }
        List<DataClassInfo> dataClassInfos = theme.getDataClassInfo();
        JSONArray dataClassInfos_result = new JSONArray();
        for(int i=0;i<dataClassInfos.size();i++){
            DataClassInfo dataClassInfo = dataClassInfos.get(i);
            JSONObject dataclassObj = new JSONObject();
            dataclassObj.put("name",dataClassInfo.getDcname());
            JSONArray datas = new JSONArray();
            List<String> datasOid = dataClassInfo.getDatasoid();
            //JSONArray urls= new JSONArray();
            for(int j=0;j<datasOid.size();j++){
                JSONObject data = new JSONObject();
                JSONObject url = new JSONObject();
                DataItem dataItem = dataItemDao.findFirstById(datasOid.get(j));
                data.put("name",dataItem.getName());
                data.put("oid",dataItem.getId());
                //url.put("url_select",dataItem.getReference());
                //List<DataMeta> dataList = dataItem.getDataList();
                //JSONArray url_download = new JSONArray();
//                for(DataMeta dataMeta:dataList){
//                    if (dataList == null){
//                        break;
//                    }
//                    url_download.add(dataMeta.getUrl());
//                }
                //url.put("url_download",url_download);
                datas.add(data);
                //urls.add(url);
            }
            dataclassObj.put("content",datas);
            //dataclassObj.put("url",urls);
            dataClassInfos_result.add(dataclassObj);
        }

        List<Application> applications = theme.getApplication();
        JSONArray applications_result = new JSONArray();

        for(int i=0;i<applications.size();i++){
            JSONObject app = new JSONObject();
            Application application = applications.get(i);
            app.put("name",application.getApplicationname());
            app.put("link",application.getApplicationlink());
            app.put("image",application.getApplication_image());
            applications_result.add(app);
        }

        List<Maintainer> maintainers = theme.getMaintainer();
        JSONArray maintainer_result = new JSONArray();
        if (maintainers!=null) {
            for (int i = 0; i < maintainers.size(); i++) {
                JSONObject ma = new JSONObject();
                Maintainer maintainer = maintainers.get(i);
                ma.put("name", maintainer.getName());
                ma.put("id", maintainer.getId());
                maintainer_result.add(ma);
            }
        }

        modelAndView.addObject("image", htmlLoadPath+theme.getImage());
        modelAndView.addObject("detail",theme_detailDesc);
        modelAndView.addObject("year", Calendar.getInstance().getWeekYear());
//        modelAndView.addObject("date", sdf.format(theme.getCreateTime()));
//        modelAndView.addObject("references",JSONArray.parseArray(JSON.toJSONString(theme.getReferences())));
        modelAndView.addObject("modelClassInfos",classInfos_result);
        modelAndView.addObject("dataClassInfos",dataClassInfos_result);
        modelAndView.addObject("applications",applications_result);
        modelAndView.addObject("maintainer",maintainer_result);

        return modelAndView;
    }
}
