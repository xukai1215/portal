package njgis.opengms.portal.controller.rest;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import njgis.opengms.portal.bean.JsonResult;
import njgis.opengms.portal.dao.*;
import njgis.opengms.portal.dto.theme.ThemeUpdateDTO;
import njgis.opengms.portal.dto.theme.ThemeVersionDTO;
import njgis.opengms.portal.entity.*;
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
    ModelItemVersionDao modelItemVersionDao;

    @Autowired
    DataItemDao dataItemDao;

    @Autowired
    ThemeDao themeDao;

    @Autowired
    UserDao userDao;

    @Autowired
    ConceptualModelDao conceptualModelDao;

    @Autowired
    ConceptualModelVersionDao conceptualModelVersionDao;

    @Autowired
    LogicalModelDao logicalModelDao;

    @Autowired
    LogicalModelVersionDao logicalModelVersionDao;

    @Autowired
    ComputableModelDao computableModelDao;

    @Autowired
    ComputableModelVersionDao computableModelVersionDao;

    @Autowired
    ConceptDao conceptDao;

    @Autowired
    ConceptVersionDao conceptVersionDao;

    @Autowired
    SpatialReferenceDao spatialReferenceDao;

    @Autowired
    SpatialReferenceVersionDao spatialReferenceVersionDao;

    @Autowired
    UnitDao unitDao;

    @Autowired
    UnitVersionDao unitVersionDao;

    @Autowired
    TemplateDao templateDao;

    @Autowired
    TemplateVersionDao templateVersionDao;

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
    public ModelAndView getMessagePage(@PathVariable("id") String id){
        return themeService.getMessagePage(id);
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
            if (themes.get(i).getCreator_oid().equals(oid)){
                int flag = 0;
                //对获取的数组中的编辑时间进行format
                if (themes.get(i).getSubDetails()!=null) {
                    flag = 1;
                    for (int j = 0; j < themes.get(i).getSubDetails().size(); j++) {
                        themes.get(i).getSubDetails().get(j).setFormatTime(sdf.format(themes.get(i).getSubDetails().get(j).getTime()));
                    }
                }
                if (themes.get(i).getSubClassInfos()!=null) {
                    flag = 1;
                    for (int j = 0; j < themes.get(i).getSubClassInfos().size(); j++) {
                        themes.get(i).getSubClassInfos().get(j).setFormatTime(sdf.format(themes.get(i).getSubClassInfos().get(j).getTime()));
                    }
                }
                if (themes.get(i).getSubDataInfos()!=null) {
                    flag = 1;
                    for (int j = 0; j < themes.get(i).getSubDataInfos().size(); j++) {
                        themes.get(i).getSubDataInfos().get(j).setFormatTime(sdf.format(themes.get(i).getSubDataInfos().get(j).getTime()));
                    }
                }
                if (themes.get(i).getSubApplications()!=null) {
                    flag = 1;
                    for (int j = 0; j < themes.get(i).getSubApplications().size(); j++) {
                        themes.get(i).getSubApplications().get(j).setFormatTime(sdf.format(themes.get(i).getSubApplications().get(j).getTime()));
                    }
                }
                if (flag == 1) {
                    jsonArray.add(themes.get(i));
                }
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

    @RequestMapping(value = "/getoid",method = RequestMethod.GET)
    public String  getoid(@PathParam("userName") String userName){
        String oid = "";
        List<User> users = userDao.findAll();
        for (int i=0;i<users.size();i++){
            if (users.get(i).getUserName().equals(userName)){
                oid = users.get(i).getOid();
            }
        }
        return oid;
    }
    @RequestMapping(value = "/getModifierName",method = RequestMethod.GET)
    public String  getModifierName(@PathParam("uid") String uid){
        String userName = "";
        List<User> users = userDao.findAll();
        for (int i=0;i<users.size();i++){
            if (users.get(i).getOid().equals(uid)){
                userName = users.get(i).getUserName();
            }
        }
        return userName;
    }

    @RequestMapping(value = "getAuthorMessageNum", method = RequestMethod.GET)
    public Integer getAuthorMessageNum(String type, @PathParam("oid") String oid){
        Integer message_num = 0;
        String author = "";
        //需要根据type取出作者的uid
        switch (type){
            case "modelItem":{
                List<ModelItem> modelItems = modelItemDao.findAll();
                for (int i = 0 ;i<modelItems.size();i++){
                    if (oid.equals(modelItems.get(i).getOid())){
                        author = modelItems.get(i).getAuthor();
                        break;
                    }
                }
                break;
            }
            case "conceptualModel":{
                List<ConceptualModel> conceptualModels = conceptualModelDao.findAll();
                for (int i = 0 ;i<conceptualModels.size();i++){
                    if (oid.equals(conceptualModels.get(i).getOid())){
                        author = conceptualModels.get(i).getAuthor();
                        break;
                    }
                }
                break;
            }
            case "logicalModel":{
                List<LogicalModel> logicalModels = logicalModelDao.findAll();
                for (int i = 0 ;i<logicalModels.size();i++){
                    if (oid.equals(logicalModels.get(i).getOid())){
                        author = logicalModels.get(i).getAuthor();
                        break;
                    }
                }
                break;
            }
            case "computableModel":{
                List<ComputableModel> computableModels = computableModelDao.findAll();
                for (int i = 0 ;i<computableModels.size();i++){
                    if (oid.equals(computableModels.get(i).getOid())){
                        author = computableModels.get(i).getAuthor();
                        break;
                    }
                }
                break;
            }
            case "concept":{
                List<Concept> concepts = conceptDao.findAll();
                for (int i = 0 ;i<concepts.size();i++){
                    if (oid.equals(concepts.get(i).getOid())){
                        author = concepts.get(i).getAuthor();
                        break;
                    }
                }
                break;
            }
            case "spatialReference":{
                List<SpatialReference> spatialReferences = spatialReferenceDao.findAll();
                for (int i = 0 ;i<spatialReferences.size();i++){
                    if (oid.equals(spatialReferences.get(i).getOid())){
                        author = spatialReferences.get(i).getAuthor();
                        break;
                    }
                }
                break;
            }
            case "unit":{
                List<Unit> units = unitDao.findAll();
                for (int i = 0 ;i<units.size();i++){
                    if (oid.equals(units.get(i).getOid())){
                        author = units.get(i).getAuthor();
                        break;
                    }
                }
                break;
            }
            case "template":{
                List<Template> templates = templateDao.findAll();
                for (int i = 0 ;i<templates.size();i++){
                    if (oid.equals(templates.get(i).getOid())){
                        author = templates.get(i).getAuthor();
                        break;
                    }
                }
                break;
            }
            case "theme":{
                List<Theme> themes = themeDao.findAll();
                for (int i = 0 ;i<themes.size();i++){
                    if (oid.equals(themes.get(i).getOid())){
                        author = themes.get(i).getAuthor();
                        break;
                    }
                }
                break;
            }
        }
        //并根据author取出所有unchecked消息数量
        List<ModelItemVersion> modelItemVersions = modelItemVersionDao.findAll();
        for (int i=0 ; i <modelItemVersions.size(); i++){
            if (author.equals(modelItemVersions.get(i).getCreator())&&modelItemVersions.get(i).getStatus() == 0){
                message_num ++ ;
            }
        }
        List<ConceptualModelVersion> conceptualModelVersions = conceptualModelVersionDao.findAll();
        for (int i=0 ; i <conceptualModelVersions.size(); i++){
            if (author.equals(conceptualModelVersions.get(i).getCreator())&&conceptualModelVersions.get(i).getVerStatus() == 0){
                message_num ++ ;
            }
        }
        List<LogicalModelVersion> logicalModelVersions = logicalModelVersionDao.findAll();
        for (int i =0;i<logicalModelVersions.size();i++){
            if (author.equals(logicalModelVersions.get(i).getCreator())&&logicalModelVersions.get(i).getVerStatus() == 0){
                message_num ++;
            }
        }
        List<ComputableModelVersion> computableModelVersions = computableModelVersionDao.findAll();
        for (int i =0;i<computableModelVersions.size();i++){
            if (author.equals(computableModelVersions.get(i).getCreator())&&computableModelVersions.get(i).getVerStatus() == 0){
                message_num ++;
            }
        }
        List<ConceptVersion> conceptVersions = conceptVersionDao.findAll();
        for (int i =0;i<conceptVersions.size();i++){
            if (author.equals(conceptVersions.get(i).getCreator())&&conceptVersions.get(i).getVerStatus() == 0){
                message_num ++;
            }
        }
        List<SpatialReferenceVersion> spatialReferenceVersions = spatialReferenceVersionDao.findAll();
        for (int i =0;i<spatialReferenceVersions.size();i++){
            if (author.equals(spatialReferenceVersions.get(i).getCreator())&&spatialReferenceVersions.get(i).getVerStatus() == 0){
                message_num ++;
            }
        }
        List<UnitVersion> unitVersions = unitVersionDao.findAll();
        for (int i =0;i<unitVersions.size();i++){
            if (author.equals(unitVersions.get(i).getCreator())&&unitVersions.get(i).getVerStatus() == 0){
                message_num ++;
            }
        }
        List<TemplateVersion> templateVersions = templateVersionDao.findAll();
        for (int i =0;i<templateVersions.size();i++){
            if (author.equals(templateVersions.get(i).getCreator())&&templateVersions.get(i).getVerStatus() == 0){
                message_num ++;
            }
        }
        return message_num;
    }

    @RequestMapping(value = "getThemeMessageNum",method = RequestMethod.GET)
    public JSONArray getThemeMessageNum(String type, @PathParam("oid") String oid){
        JSONArray jsonArray = new JSONArray();
        String author = "";
        String uid = "";
        //需要根据type取出作者的uid
        switch (type){
            case "modelItem":{
                List<ModelItem> modelItems = modelItemDao.findAll();
                for (int i = 0 ;i<modelItems.size();i++){
                    if (oid.equals(modelItems.get(i).getOid())){
                        author = modelItems.get(i).getAuthor();
                        break;
                    }
                }
                break;
            }
            case "conceptualModel":{
                List<ConceptualModel> conceptualModels = conceptualModelDao.findAll();
                for (int i = 0 ;i<conceptualModels.size();i++){
                    if (oid.equals(conceptualModels.get(i).getOid())){
                        author = conceptualModels.get(i).getAuthor();
                        break;
                    }
                }
                break;
            }
            case "logicalModel":{
                List<LogicalModel> logicalModels = logicalModelDao.findAll();
                for (int i = 0 ;i<logicalModels.size();i++){
                    if (oid.equals(logicalModels.get(i).getOid())){
                        author = logicalModels.get(i).getAuthor();
                        break;
                    }
                }
                break;
            }
            case "computableModel":{
                List<ComputableModel> computableModels = computableModelDao.findAll();
                for (int i = 0 ;i<computableModels.size();i++){
                    if (oid.equals(computableModels.get(i).getOid())){
                        author = computableModels.get(i).getAuthor();
                        break;
                    }
                }
                break;
            }
            case "concept":{
                List<Concept> concepts = conceptDao.findAll();
                for (int i = 0 ;i<concepts.size();i++){
                    if (oid.equals(concepts.get(i).getOid())){
                        author = concepts.get(i).getAuthor();
                        break;
                    }
                }
                break;
            }
            case "spatialReference":{
                List<SpatialReference> spatialReferences = spatialReferenceDao.findAll();
                for (int i = 0 ;i<spatialReferences.size();i++){
                    if (oid.equals(spatialReferences.get(i).getOid())){
                        author = spatialReferences.get(i).getAuthor();
                        break;
                    }
                }
                break;
            }
            case "unit":{
                List<Unit> units = unitDao.findAll();
                for (int i = 0 ;i<units.size();i++){
                    if (oid.equals(units.get(i).getOid())){
                        author = units.get(i).getAuthor();
                        break;
                    }
                }
                break;
            }
            case "template":{
                List<Template> templates = templateDao.findAll();
                for (int i = 0 ;i<templates.size();i++){
                    if (oid.equals(templates.get(i).getOid())){
                        author = templates.get(i).getAuthor();
                        break;
                    }
                }
                break;
            }
            case "theme":{
                List<Theme> themes = themeDao.findAll();
                for (int i = 0 ;i<themes.size();i++){
                    if (oid.equals(themes.get(i).getOid())){
                        author = themes.get(i).getAuthor();
                        break;
                    }
                }
                break;
            }
        }
        List<User> users = userDao.findAll();
        for (int i=0; i<users.size();i++){
            if (author.equals(users.get(i).getUserName())){
                uid = users.get(i).getOid();
            }
        }

        List<Theme> themes = themeDao.findAll();
        for (int i=0;i<themes.size();i++){
            if (themes.get(i).getCreator_oid().equals(uid)&&themes.get(i).getSubDetails()!=null){
                jsonArray.add(themes.get(i));
            }
        }
        return jsonArray;


    }

    @RequestMapping(value = "/delete", method = RequestMethod.POST)
    public JsonResult deleteTheme(@RequestParam(value="oid") String oid, HttpServletRequest request){
        HttpSession session=request.getSession();

        if(session.getAttribute("uid")==null){
            return ResultUtils.error(-1,"no login");
        }
        String userName=session.getAttribute("uid").toString();
        return ResultUtils.success(themeService.delete(oid,userName));
    }

    @RequestMapping (value="/searchThemeByUserId",method = RequestMethod.GET)
    public JsonResult searchThemeByUserId(HttpServletRequest request,
                                               @RequestParam(value="searchText") String searchText,
                                               @RequestParam(value="page") int page,
                                               @RequestParam(value="sortType") String sortType,
                                               @RequestParam(value="asc") int sortAsc){

        HttpSession session=request.getSession();
        if(session.getAttribute("uid")==null){
            return ResultUtils.error(-1,"no login");
        }
        String uid=session.getAttribute("uid").toString();

        JSONObject result=themeService.searchThemeByUserId(searchText.trim(),uid,page,sortType,sortAsc);

        return ResultUtils.success(result);
    }
}
