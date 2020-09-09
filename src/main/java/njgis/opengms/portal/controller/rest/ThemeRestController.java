package njgis.opengms.portal.controller.rest;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import njgis.opengms.portal.bean.JsonResult;
import njgis.opengms.portal.dao.*;
import njgis.opengms.portal.dto.theme.ThemeAddDTO;
import njgis.opengms.portal.dto.theme.ThemeUpdateDTO;
import njgis.opengms.portal.dto.theme.ThemeVersionDTO;
import njgis.opengms.portal.entity.*;
import njgis.opengms.portal.entity.support.Maintainer;
import njgis.opengms.portal.service.ModelItemService;
import njgis.opengms.portal.service.ThemeService;
import njgis.opengms.portal.service.UserService;
import njgis.opengms.portal.utils.ResultUtils;
import org.apache.commons.io.IOUtils;
import org.springframework.beans.BeanUtils;
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
import java.util.*;

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

    @Autowired
    ThemeVersionDao themeVersionDao;

    @Autowired
    CommentDao commentDao;

    @Value("${htmlLoadPath}")
    private String htmlLoadPath;
    @RequestMapping(value = "/addTheme", method = RequestMethod.POST)
    public JsonResult addTheme(HttpServletRequest request) throws IOException {
        HttpSession session = request.getSession();

        if(session.getAttribute("uid") == null){
            return ResultUtils.error(-1, "no login");
        }
        MultipartHttpServletRequest multipartRequest = (MultipartHttpServletRequest) request;
        MultipartFile file = multipartRequest.getFile("info");
        String model = IOUtils.toString(file.getInputStream(), "utf-8");
        JSONObject jsonObject = JSONObject.parseObject(model);
        //将拿到的数据通过themeAddDTO这个结构来传输
        ThemeAddDTO themeAddDTO = JSONObject.toJavaObject(jsonObject, ThemeAddDTO.class);
        themeAddDTO.setCreator_name(session.getAttribute("name").toString());
        themeAddDTO.setCreator_oid(session.getAttribute("oid").toString());

        List<Maintainer> maintainers = new ArrayList<>();
        Maintainer maintainer = new Maintainer();
        maintainer.setName(session.getAttribute("name").toString());
        maintainer.setId(session.getAttribute("oid").toString());
        maintainers.add(maintainer);
        themeAddDTO.setMaintainer(maintainers);

        String uid = session.getAttribute("uid").toString();
        //新增数据类别
//        Categorys categorys = new Categorys();
//        categorys.setId("5f080d29caaf7552b4a7b366");
//        categorys.setCategory("Solid Earth Geophysics");
//        categorys.setParentCategory("5cc051437a419164e821231c");
//        categoryDao.insert(categorys);
//        ArrayList<Integer>themes = new ArrayList<Integer>();



        System.out.println("add theme");

        Theme theme = themeService.insertTheme(themeAddDTO, uid);

        userService.themePlusPlus(uid);
        return ResultUtils.success(theme.getOid());
    }

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
            Date curDate = new Date();
            Theme theme = themeDao.findFirstByOid(themeVersionDTO.getThemeOid());
            String authorUserName = theme.getAuthor();
            if (theme.getVersions() == null || theme.getVersions().size() == 0) {
                ThemeVersion themeVersion = new ThemeVersion();
                BeanUtils.copyProperties(theme, themeVersion, "id");
                themeVersion.setOid(UUID.randomUUID().toString());
                themeVersion.setThemeOid(theme.getOid());
                themeVersion.setVerNumber((long) 0);
                themeVersion.setStatus(2);
                themeVersion.setModifierOid(theme.getAuthor());
                themeVersion.setModifyTime(theme.getCreateTime());
                themeVersionDao.insert(themeVersion);

                List<String> versions = theme.getVersions();
                if (versions == null) versions = new ArrayList<>();
                versions.add(themeVersion.getOid());
                theme.setVersions(versions);
            }

            ThemeVersion themeVersion = themeVersionDao.findFirstByOid(themeVersionDTO.getOid());

            //版本更替
            BeanUtils.copyProperties(themeVersion, theme, "id");
            theme.setOid(themeVersion.getThemeOid());
            List<String> versions = theme.getVersions();
            versions.add(themeVersion.getOid());
            theme.setVersions(versions);

            List<String> contributors = theme.getContributors();
            contributors = contributors == null ? new ArrayList<>() : contributors;
            String contributor = themeVersion.getModifierOid();
            boolean exist = false;
            for (int i = 0; i < contributors.size(); i++) {
                if (contributors.get(i).equals(contributor)) {
                    exist = true;
                }
            }
            if (!exist && !contributor.equals(theme.getAuthor())) {
                contributors.add(contributor);
                theme.setContributors(contributors);
            }

            theme.setLastModifier(contributor);
            theme.setLock(false);
            theme.setLastModifyTime(themeVersion.getModifyTime());
            themeDao.save(theme);

            themeVersion.setStatus(1);//

            userService.messageNumPlusPlus(themeVersionDTO.getModifier());
            userService.messageNumMinusMinus(authorUserName);
            themeVersion.setAcceptTime(curDate);
            themeVersionDao.save(themeVersion);
            return ResultUtils.success();
    }
    @RequestMapping(value = "/reject",method = RequestMethod.POST)
    public JsonResult  reject(@RequestBody ThemeVersionDTO themeVersionDTO){

            Date curDate = new Date();
            Theme theme = themeDao.findFirstByOid(themeVersionDTO.getThemeOid());
            String authorUserName = theme.getAuthor();
            ThemeVersion themeVersion = themeVersionDao.findFirstByOid(themeVersionDTO.getOid());
            themeVersion.setStatus(-1);
            userService.messageNumPlusPlus(themeVersionDTO.getModifier());
            userService.messageNumMinusMinus(authorUserName);
            themeVersion.setRejectTime(curDate);
            themeVersionDao.save(themeVersion);
            theme.setLock(false);
            themeDao.save(theme);
            return ResultUtils.success();
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
            if (author.equals(modelItemVersions.get(i).getCreator())&&modelItemVersions.get(i).getVerStatus() == 0){
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

    @RequestMapping(value = "/getMessageData", method = RequestMethod.GET)
    public JsonResult getMessageData(HttpServletRequest request) {
        JSONObject version = new JSONObject();
        JSONObject themeVersion = new JSONObject();
        version = themeService.getVersion(request);
        return ResultUtils.success(version);
    }

    @RequestMapping(value = "/update", method = RequestMethod.POST)
    public JsonResult updateTheme(HttpServletRequest request) throws IOException{
        HttpSession session=request.getSession();
        String uid=session.getAttribute("uid").toString();
        String oid = session.getAttribute("oid").toString();
        if(uid==null){
            return ResultUtils.error(-2,"未登录");
        }
        MultipartHttpServletRequest multipartRequest = (MultipartHttpServletRequest) request;
        MultipartFile file=multipartRequest.getFile("info");
        String model=IOUtils.toString(file.getInputStream(),"utf-8");
        JSONObject jsonObject=JSONObject.parseObject(model);
        ThemeUpdateDTO themeUpdateDTO=JSONObject.toJavaObject(jsonObject,ThemeUpdateDTO.class);

        JSONObject result=themeService.update(themeUpdateDTO,uid,oid);
        if(result==null){
            return ResultUtils.error(-1,"There is another version have not been checked, please contact opengms@njnu.edu.cn if you want to modify this item.");
        }
        else {
            return ResultUtils.success(result);
        }
    }

    @RequestMapping(value = "/uncheck/{id}", method = RequestMethod.GET)
    public ModelAndView getThemeEditPage(@PathVariable("id") String id) {
        System.out.println("theme compare");
        return themeService.getThemeEditPage(id);
    }
    @RequestMapping(value = "/accept/{id}", method = RequestMethod.GET)
    public ModelAndView getThemeAccept(@PathVariable("id") String id) {
        System.out.println("theme compare");
        return themeService.getThemeAccept(id);
    }
    @RequestMapping(value = "/reject/{id}", method = RequestMethod.GET)
    public ModelAndView getThemeReject(@PathVariable("id") String id) {
        System.out.println("theme compare");
        return themeService.getThemeReject(id);
    }
    @RequestMapping(value = "/getMessageNum", method = RequestMethod.GET)
    public Integer getMessageNum(HttpServletRequest request){
        HttpSession session = request.getSession();
        String userOid = session.getAttribute("oid").toString();
        User user = userDao.findFirstByOid(userOid);
        Integer messageNum = user.getMessageNum();
        return messageNum;
    }
}
