package njgis.opengms.portal.controller.rest;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.google.gson.JsonObject;
import njgis.opengms.portal.bean.JsonResult;
import njgis.opengms.portal.dao.DataItemDao;
import njgis.opengms.portal.dao.ModelItemDao;
import njgis.opengms.portal.dao.ThemeDao;
import njgis.opengms.portal.dao.UserDao;
import njgis.opengms.portal.dto.theme.ThemeUpdateDTO;
import njgis.opengms.portal.dto.theme.ThemeVersionDTO;
import njgis.opengms.portal.entity.DataItem;
import njgis.opengms.portal.entity.ModelItem;
import njgis.opengms.portal.entity.Theme;
import njgis.opengms.portal.entity.User;
import njgis.opengms.portal.service.ModelItemService;
import njgis.opengms.portal.service.ThemeService;
import njgis.opengms.portal.service.UserService;
import njgis.opengms.portal.utils.ResultUtils;
import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.websocket.server.PathParam;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * @Auther mingyuan
 * @Data 2019.12.12 14:43
 */
@RestController
@RequestMapping(value = "/theme")
public class ThemeRestController {
    @Autowired
    ThemeService themeService;

    @Autowired
    UserService userService;

    @Autowired
    ModelItemService modelItemService;

    @Autowired
    ModelItemDao modelItemDao;

    @Autowired
    DataItemDao dataItemDao;

    @Autowired
    ThemeDao themeDao;

    @Autowired
    UserDao userDao;

    @Value("${htmlLoadPath}")
    private String htmlLoadPath;

    @RequestMapping(value = "/getInfo/{id}",method = RequestMethod.GET)
    JsonResult getInfo(@PathVariable ("id") String id){
        Theme theme = themeService.getByOid(id);
        theme.setImage(theme.getImage().equals("")?"":htmlLoadPath+theme.getImage());
        return ResultUtils.success(theme);
    }
    @RequestMapping(value = "/getModelItem",method = RequestMethod.GET)
    JsonResult getModelItem(@RequestParam(value = "oid") String oid){
        JSONObject result = themeService.getModelItem(oid);
        return ResultUtils.success(result);
    }
    @RequestMapping(value = "/getDataItem",method = RequestMethod.GET)
    JsonResult getDataItem(@RequestParam(value = "oid") String oid){
        JSONObject result = themeService.getDataItem(oid);
        return ResultUtils.success(result);
    }
    //往数据库中加新的sub（副本）
    @RequestMapping(value = "/addsub", method = RequestMethod.POST)
    public JsonResult addsub(HttpServletRequest request) throws IOException{
        MultipartHttpServletRequest multipartRequest = (MultipartHttpServletRequest) request;
        MultipartFile file=multipartRequest.getFile("info");
        //取出是什么type
        String type = multipartRequest.getParameter("type");

        String model= IOUtils.toString(file.getInputStream(),"utf-8");
        JSONObject jsonObject=JSONObject.parseObject(model);
        ThemeUpdateDTO themeUpdateDTO = JSONObject.toJavaObject(jsonObject,ThemeUpdateDTO.class);


        HttpSession session=request.getSession();
        String uid=session.getAttribute("uid").toString();
        if(uid==null){
            return ResultUtils.error(-2,"未登录");
        }
        String oid = session.getAttribute("oid").toString();
        JSONObject result = themeService.addSub(themeUpdateDTO,oid,type);
        if(result==null){
            return ResultUtils.error(-1,"There is another version have not been checked, please contact nj_gis@163.com if you want to modify this item.");
        }
        else {
            return ResultUtils.success(result);
        }
    }

    @RequestMapping(value = "/getname",method = RequestMethod.GET)
    public String  getname(String type,@PathParam("oid") String oid){

        String result ="";
        String t = "modelItem";
        String t2 = "dataItem";
        if(type.equals(t)) {
            ModelItem modelItem = modelItemDao.findFirstByOid(oid);
            result = modelItem.getName();
        }else if(type.equals(t2)){
            DataItem dataItem = dataItemDao.findFirstById(oid);
            result = dataItem.getName();
        }
        return result;
    }

    @RequestMapping(value = "/getmessagepage/{id}", method = RequestMethod.GET)
    public ModelAndView getMessagePage(@PathVariable("id") String id,HttpServletRequest req){
        return themeService.getMessagePage(id,req);
    }

    @RequestMapping(value = "/getuser",method = RequestMethod.GET)
    public JSONObject getuid(HttpServletRequest request) throws IOException{
        HttpSession session=request.getSession();
        JSONObject user = new JSONObject();
        //取出用户的oid以及名称
        String oid=session.getAttribute("oid").toString();
        String name = session.getAttribute("name").toString();
//        List<User> users = userDao.findAll();
//        for (int i=0;i<users.size();i++){
//            if (oid.equals(users.get(i).getOid())){
//                String name = users.get(i).getName();
//                break;
//            }
//        }
        user.put("oid",oid);
        user.put("name",name);
        return user;
    }

    @RequestMapping(value = "/getedit",method = RequestMethod.GET)
    public JSONArray getedit(HttpServletRequest request) throws IOException{
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        JSONArray jsonArray = new JSONArray();
        HttpSession session = request.getSession();
        String oid = session.getAttribute("oid").toString();
        List<Theme> themes = themeDao.findAll();
        for (int i=0;i<themes.size();i++){
            if (themes.get(i).getCreator_oid().equals(oid)&&themes.get(i).getSubDetails()!=null){
                //对获取的数组中的编辑时间进行format
                for (int j=0;j<themes.get(i).getSubDetails().size();j++){
                    themes.get(i).getSubDetails().get(j).setFormatTime(sdf.format(themes.get(i).getSubDetails().get(j).getTime()));
                }
                for (int j=0;j<themes.get(i).getSubClassInfos().size();j++){
                    themes.get(i).getSubClassInfos().get(j).setFormatTime(sdf.format(themes.get(i).getSubClassInfos().get(j).getTime()));
                }
                for (int j=0;j<themes.get(i).getSubDataInfos().size();j++){
                    themes.get(i).getSubDataInfos().get(j).setFormatTime(sdf.format(themes.get(i).getSubDataInfos().get(j).getTime()));
                }
                for (int j=0;j<themes.get(i).getSubApplications().size();j++){
                    themes.get(i).getSubApplications().get(j).setFormatTime(sdf.format(themes.get(i).getSubApplications().get(j).getTime()));
                }
                jsonArray.add(themes.get(i));
            }
        }
        return jsonArray;
    }

    @RequestMapping(value = "/accept",method = RequestMethod.POST)
    public JsonResult  replace(@RequestBody ThemeVersionDTO themeVersionDTO){
        String themename = themeVersionDTO.getThemename();
        String type = themeVersionDTO.getType();
        Date time = themeVersionDTO.getTime();
        Theme theme = themeDao.findByThemename(themename);
        switch (type){
            case "Info":
                for (int i=0;i<theme.getSubDetails().size();i++){
                    if (theme.getSubDetails().get(i).getTime().equals(time)){
                        theme.setDetail(theme.getSubDetails().get(i).getDetail());
                        theme.getSubDetails().get(i).setStatus("1");
                        break;
                    }
                }
                break;
            case "Model":
                for (int i=0;i<theme.getSubClassInfos().size();i++){
                    if (theme.getSubClassInfos().get(i).getTime().equals(time)){
                        theme.setClassinfo(theme.getSubClassInfos().get(i).getSub_classInfo());
                        theme.getSubClassInfos().get(i).setStatus("1");
                        break;
                    }
                }
                break;
            case "Data":
                for (int i=0;i<theme.getSubDataInfos().size();i++){
                    if(theme.getSubDataInfos().get(i).getTime().equals(time)){
                        theme.setDataClassInfo(theme.getSubDataInfos().get(i).getSub_dataClassInfos());
                        theme.getSubDataInfos().get(i).setStatus("1");
                        break;
                    }
                }
                break;
            case "Application":
                for (int i=0;i<theme.getSubApplications().size();i++){
                    if (theme.getSubApplications().get(i).getTime().equals(time)){
                        theme.setApplication(theme.getSubApplications().get(i).getSub_applications());
                        theme.getSubApplications().get(i).setStatus("1");
                        break;
                    }
                }
                break;
        }
        themeDao.save(theme);
        JsonResult result = new JsonResult();
        return result;
    }
    @RequestMapping(value = "/reject",method = RequestMethod.POST)
    public JsonResult  reject(@RequestBody ThemeVersionDTO themeVersionDTO){
        String themename = themeVersionDTO.getThemename();
        String type = themeVersionDTO.getType();
        Date time = themeVersionDTO.getTime();
        Theme theme = themeDao.findByThemename(themename);
        switch (type){
            case "Info":
                for (int i=0;i<theme.getSubDetails().size();i++){
                    if (theme.getSubDetails().get(i).getTime().equals(time)){
//                        theme.setDetail(theme.getSubDetails().get(i).getDetail());
                        theme.getSubDetails().get(i).setStatus("-1");
                        break;
                    }
                }
                break;
            case "Model":
                for (int i=0;i<theme.getSubClassInfos().size();i++){
                    if (theme.getSubClassInfos().get(i).getTime().equals(time)){
//                        theme.setClassinfo(theme.getSubClassInfos().get(i).getSub_classInfo());
                        theme.getSubClassInfos().get(i).setStatus("-1");
                        break;
                    }
                }
                break;
            case "Data":
                for (int i=0;i<theme.getSubDataInfos().size();i++){
                    if(theme.getSubDataInfos().get(i).getTime().equals(time)){
//                        theme.setDataClassInfo(theme.getSubDataInfos().get(i).getSub_dataClassInfos());
                        theme.getSubDataInfos().get(i).setStatus("-1");
                        break;
                    }
                }
                break;
            case "Application":
                for (int i=0;i<theme.getSubApplications().size();i++){
                    if (theme.getSubApplications().get(i).getTime().equals(time)){
//                        theme.setApplication(theme.getSubApplications().get(i).getSub_applications());
                        theme.getSubApplications().get(i).setStatus("-1");
                        break;
                    }
                }
                break;
        }
        themeDao.save(theme);
        JsonResult result = new JsonResult();
        return result;
    }
}
