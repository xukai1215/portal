package njgis.opengms.portal.service;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.sun.mail.imap.protocol.Item;
import njgis.opengms.portal.dao.DataItemDao;
import njgis.opengms.portal.dao.ModelItemDao;
import njgis.opengms.portal.dao.ThemeDao;
import njgis.opengms.portal.dao.UserDao;
import njgis.opengms.portal.dto.theme.ThemeAddDTO;
import njgis.opengms.portal.dto.theme.ThemeUpdateDTO;
import njgis.opengms.portal.entity.DataItem;
import njgis.opengms.portal.entity.ModelItem;
import njgis.opengms.portal.entity.Theme;
import njgis.opengms.portal.entity.User;
import njgis.opengms.portal.entity.intergrate.Model;
import njgis.opengms.portal.entity.support.*;
import njgis.opengms.portal.enums.ResultEnum;
import njgis.opengms.portal.exception.MyException;
import njgis.opengms.portal.utils.Utils;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.swing.plaf.PanelUI;
import java.io.*;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
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
    UserDao userDao;
//    @Autowired
//    ThemeAddDTO themeAddDTO;

    @Autowired
    ModelItemDao modelItemDao;

    @Autowired
    DataItemDao dataItemDao;

    @Autowired
    UserService userService;


    @Value("E:/portal/target/classes/static/upload")
    private String resourcePath;

    @Value("E:/static/upload")
    private String htmlLoadPath;

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

    public JSONObject addSub(ThemeUpdateDTO themeUpdateDTO,String oid,String type){
        Theme theme = themeDao.findFirstByOid(themeUpdateDTO.getOid());
        theme.setSub_themename(themeUpdateDTO.getSub_themename());
        Date now = new Date();
        //加上这个判断语句，即可编辑哪个改变哪个
        switch (type){
            case "info":{

                List<SubDetail> subDetails = new ArrayList<>();
                int iflag = -1;
                //如果info为空，则直接增加入数据库，否则
                if (theme.getSubDetails() == null){
                    SubDetail subDetail = new SubDetail();
                    subDetail.setUid(oid);
                    subDetail.setTime(now);
                    subDetail.setStatus("0");
                    subDetail.setDetail(themeUpdateDTO.getSub_detail());
                    subDetails.add(subDetail);
                }else {
                    for (int i=0;i<theme.getSubDetails().size();i++){
                        subDetails.add(theme.getSubDetails().get(i));
                        if (theme.getSubDetails().get(i).getUid().equals(oid)){
                            iflag = i;
                        }
                    }
                    if (iflag == -1){
                        SubDetail subDetail = new SubDetail();
                        subDetail.setUid(oid);
                        subDetail.setTime(now);
                        subDetail.setStatus("0");
                        subDetail.setDetail(themeUpdateDTO.getSub_detail());
                        subDetails.add(subDetail);
                    }else {
                        if (theme.getSubDetails().get(iflag).getStatus().equals("0")) {
                            theme.getSubDetails().get(iflag).setDetail(themeUpdateDTO.getSub_detail());
                            theme.getSubDetails().get(iflag).setTime(now);
                        } else {
                            SubDetail subDetail = new SubDetail();
                            subDetail.setUid(oid);
                            subDetail.setTime(now);
                            subDetail.setStatus("0");
                            subDetail.setDetail(themeUpdateDTO.getSub_detail());
                            subDetails.add(subDetail);
                        }
                    }
                }
                themeUpdateDTO.setSubDetails(subDetails);
                theme.setSubDetails(subDetails);

//                //编辑成功开始给edits赋值
//                List<Edit> edits = new ArrayList<>();
//                List<EditForm> eInfos = new ArrayList<>();
//                Edit edit = new Edit();
//
//                EditForm editForm = new EditForm();
//                editForm.setUid(uid);
//                Date now = new Date();
//                editForm.setTime(now);
//
//                eInfos.add(editForm);
//
//                edit.setEInfos(eInfos);
//
//                edits.add(edit);
//                theme.setEdits(edits);
                break;
            }
            case "model":{
                //设置SubClassInfo
                List<SubClassInfo> subClassInfos = new ArrayList<>();
                int mflag=-1;
                if (theme.getSubClassInfos() == null){
                    SubClassInfo subClassInfo = new SubClassInfo();
                    subClassInfo.setUid(oid);
                    subClassInfo.setTime(now);
                    subClassInfo.setStatus("0");
                    subClassInfo.setSub_classInfo(themeUpdateDTO.getClassinfo());

                    subClassInfos.add(subClassInfo);
                }else {
                    for (int i = 0; i < theme.getSubClassInfos().size(); i++) {
                        subClassInfos.add(theme.getSubClassInfos().get(i));
                        //判断uid是否相同
                        if (theme.getSubClassInfos().get(i).getUid().equals(oid)) {
                            mflag = i;
                        }
                    }
                    //需要判断uid，如果uid相同，则只需要替换classinfo即可
                    if (mflag == -1) {
                        SubClassInfo subClassInfo = new SubClassInfo();

                        subClassInfo.setUid(oid);
                        subClassInfo.setTime(now);
                        subClassInfo.setStatus("0");
                        subClassInfo.setSub_classInfo(themeUpdateDTO.getClassinfo());

                        subClassInfos.add(subClassInfo);
                    } else {
                        if (theme.getSubClassInfos().get(mflag).getStatus().equals("0")) {
                            theme.getSubClassInfos().get(mflag).setSub_classInfo(themeUpdateDTO.getClassinfo());
                            theme.getSubClassInfos().get(mflag).setTime(now);
                        }else {
                            SubClassInfo subClassInfo = new SubClassInfo();

                            subClassInfo.setUid(oid);
                            subClassInfo.setTime(now);
                            subClassInfo.setStatus("0");
                            subClassInfo.setSub_classInfo(themeUpdateDTO.getClassinfo());

                            subClassInfos.add(subClassInfo);
                        }
                    }
                }
                //SubClassInfo设置好放入theme中即可
                themeUpdateDTO.setSubClassInfos(subClassInfos);
                theme.setSubClassInfos(subClassInfos);
                break;
            }
            case "data":{
                //设置subdatainfos
                List<SubDataInfo> subDataInfos = new ArrayList<>();
                int dflag=-1;
                if (theme.getSubDataInfos() == null){
                    SubDataInfo subDataInfo = new SubDataInfo();

                    subDataInfo.setUid(oid);
                    subDataInfo.setTime(now);
                    subDataInfo.setStatus("0");
                    subDataInfo.setSub_dataClassInfos(themeUpdateDTO.getDataClassInfo());

                    subDataInfos.add(subDataInfo);
                }else {
                    for (int i = 0; i < theme.getSubDataInfos().size(); i++) {
                        subDataInfos.add(theme.getSubDataInfos().get(i));
                        //判断uid是否相同
                        if (theme.getSubDataInfos().get(i).getUid().equals(oid)) {
                            dflag = i;
                        }
                    }
                    //需要判断uid，如果uid相同，则只需要替换classinfo即可
                    if (dflag == -1) {
                        SubDataInfo subDataInfo = new SubDataInfo();

                        subDataInfo.setUid(oid);
                        subDataInfo.setTime(now);
                        subDataInfo.setStatus("0");

                        subDataInfo.setSub_dataClassInfos(themeUpdateDTO.getDataClassInfo());

                        subDataInfos.add(subDataInfo);
                    } else {
                        if (theme.getSubDataInfos().get(dflag).getStatus().equals("0")) {
                            theme.getSubDataInfos().get(dflag).setSub_dataClassInfos(themeUpdateDTO.getDataClassInfo());
                            theme.getSubDataInfos().get(dflag).setTime(now);
                        }else {
                            SubDataInfo subDataInfo = new SubDataInfo();

                            subDataInfo.setUid(oid);
                            subDataInfo.setTime(now);
                            subDataInfo.setStatus("0");

                            subDataInfo.setSub_dataClassInfos(themeUpdateDTO.getDataClassInfo());

                            subDataInfos.add(subDataInfo);
                        }
                    }
                }
                //SubClassInfo设置好放入theme中即可
                themeUpdateDTO.setSubDataInfos(subDataInfos);
                theme.setSubDataInfos(subDataInfos);
                break;
            }
            case "application":{
                //从application数组中依次拿出uploadimage，转换为地址后放到image中
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



                List<SubApplication> subApplications = new ArrayList<>();
                int aflag = -1;
                if (theme.getSubApplications() == null){
                    SubApplication subApplication = new SubApplication();
                    subApplication.setUid(oid);
                    subApplication.setTime(now);
                    subApplication.setStatus("0");
                    subApplication.setSub_applications(themeUpdateDTO.getApplication());
                    subApplications.add(subApplication);
                }else {
                    for (int i=0;i<theme.getSubApplications().size();i++){
                        subApplications.add(theme.getSubApplications().get(i));
                        if (theme.getSubApplications().get(i).getUid().equals(oid)){
                            aflag = i;
                        }
                    }
                    if (aflag == -1){
                        SubApplication subApplication = new SubApplication();
                        subApplication.setUid(oid);
                        subApplication.setTime(now);
                        subApplication.setStatus("0");
                        subApplication.setSub_applications(themeUpdateDTO.getApplication());
                        subApplications.add(subApplication);
                    }else {
                        if (theme.getSubApplications().get(aflag).getStatus().equals("0")) {
                            theme.getSubApplications().get(aflag).setSub_applications(themeUpdateDTO.getApplication());
                            theme.getSubApplications().get(aflag).setTime(now);
                        }else {
                            SubApplication subApplication = new SubApplication();
                            subApplication.setUid(oid);
                            subApplication.setTime(now);
                            subApplication.setStatus("0");
                            subApplication.setSub_applications(themeUpdateDTO.getApplication());
                            subApplications.add(subApplication);
                        }
                    }
                }
                themeUpdateDTO.setSubApplications(subApplications);
                theme.setSubApplications(subApplications);
                break;
            }
            default:{
                break;
            }
        }
        theme.setInfo_edit("Edited");
        themeDao.save(theme);
        JSONObject result = new JSONObject();
        result.put("method", "update");
        result.put("oid",theme.getOid());
        return result;
    }

    public ModelAndView getMessagePage(String uid,HttpServletRequest req){
        ModelAndView modelAndView = new ModelAndView();
        User user = userDao.findFirstByOid(uid);
        if(user==null){
            modelAndView.setViewName("error/404");
            return modelAndView;
        }

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
}
