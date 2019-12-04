package njgis.opengms.portal;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import njgis.opengms.portal.dao.*;
import njgis.opengms.portal.entity.*;
import njgis.opengms.portal.entity.support.*;
import njgis.opengms.portal.service.CommonService;
import njgis.opengms.portal.utils.Utils;
import njgis.opengms.portal.utils.XmlTool;
import org.dom4j.DocumentException;
import org.dom4j.DocumentHelper;
import org.dom4j.Element;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.web.client.RestTemplate;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@RunWith(SpringRunner.class)
@SpringBootTest
public class PortalApplicationTests {

    @Autowired
    CommonService commonService;

    @Autowired
    UserDao userDao;

    @Autowired
    ModelItemDao modelItemDao;

    @Autowired
    DataItemDao dataItemDao;

    @Autowired
    ConceptualModelDao conceptualModelDao;

    @Autowired
    LogicalModelDao logicalModelDao;

    @Autowired
    ComputableModelDao computableModelDao;

    @Autowired
    ConceptDao conceptDao;

    @Autowired
    SpatialReferenceDao spatialReferenceDao;

    @Autowired
    TemplateDao templateDao;

    @Autowired
    UnitDao unitDao;

    @Autowired
    TaskDao taskDao;

    @Value("${resourcePath}")
    private String resourcePath;

    @Value("${managerServerIpAndPort}")
    private String managerServerIpAndPort;

    @Test
    public void correctDes(){

        List<ComputableModel> allComputableModel = computableModelDao.findByContentType("Package");

        for(int i = 0; i<allComputableModel.size(); i++){
            String mdl = allComputableModel.get(i).getMdl();
            StringBuilder smdl = new StringBuilder(mdl);

//            String str = "[\\u4e00-\\u9fa5]<[0-9]";
            String str = "<=";
            Pattern pattern = Pattern.compile(str);
            Matcher matcher = pattern.matcher(mdl);
            while(matcher.find()) {
                System.out.println(matcher.group());
                System.out.println(matcher.start());
                System.out.println(matcher.end());
//                smdl.replace(matcher.start()+1,matcher.end()-1,"&lt;");
                smdl.replace(matcher.start(),matcher.end()-1,"&lt;");
                System.out.println(smdl.toString());
//                allComputableModel.get(i).setMdl(smdl.toString());
//                computableModelDao.save(allComputableModel.get(i));
            }
        }
    }

    @Test
    public void testGet(){
        RestTemplate restTemplate=new RestTemplate();
        Map<String,Object> map=new HashMap();
        map.put("page",1);
        map.put("pageSize",10);
        map.put("asc",false);
        JSONObject result=restTemplate.getForObject("http://"+managerServerIpAndPort+"/GeoModeling/taskNode",JSONObject.class,map);
        System.out.println(result);


    }

    @Test
    public void setViewCount(){
//        List<ModelItem> modelItemList=modelItemDao.findAll();
//        for(ModelItem modelItem:modelItemList){
//            modelItemDao.save(modelItem);
//            Utils.count();
//        }

        List<Concept> conceptList=conceptDao.findAll();
        for(Concept concept:conceptList){
            //concept.setViewCount(concept.getLoadCount());
            conceptDao.save(concept);
        }

        List<SpatialReference> spatialReferenceList=spatialReferenceDao.findAll();
        for(SpatialReference spatialReference:spatialReferenceList){

            //spatialReference.setViewCount(spatialReference.getLoadCount());
            spatialReferenceDao.save(spatialReference);
        }

        List<Template> templateList=templateDao.findAll();
        for(Template template:templateList){
            //template.setViewCount(template.getLoadCount());
            templateDao.save(template);
        }

        List<Unit> unitList=unitDao.findAll();
        for(Unit unit:unitList){
            //unit.setViewCount(unit.getLoadCount());
            unitDao.save(unit);
        }

    }

    @Test
    public void addFolder(){
//        User user=userDao.findFirstByUserName("njgis");
//        List<FileMeta> fileContainer=new ArrayList<>();
//
////        fileContainer.add(new FileMeta(true,false,UUID.randomUUID().toString(),"fa","123","","",new ArrayList<>()));
////        fileContainer.add(new FileMeta(false,false,"id2","ff","1234","pdf","http://",new ArrayList<>()));
//
//        user.setFileContainer(fileContainer);
//
//
//        userDao.save(user);
    }

    @Test
    public void addTaskInfo(){
        List<Task> tasks = taskDao.findAll();
        for (Task task:tasks){
            if(task.getPermission()==null)
            {
                task.setPermission("private");
                taskDao.save(task);
                taskDao.count();
            }
            if(task.getDescription()==null)
            {
                task.setDescription("");
                taskDao.save(task);
                taskDao.count();
            }

                task.setLoadTime(0);
                taskDao.save(task);
                taskDao.count();


        }
    }

    @Test
    public void addImage(){
        List<ConceptualModel> conceptualModelList=conceptualModelDao.findAll();
        for(ConceptualModel conceptualModel:conceptualModelList){
            if(conceptualModel.getImage()==null){
                conceptualModel.setImage(new ArrayList<>());
                conceptualModelDao.save(conceptualModel);
            }
        }        
        
        List<LogicalModel> logicalModelList=logicalModelDao.findAll();
        for(LogicalModel logicalModel:logicalModelList){
            if(logicalModel.getImage()==null){
                logicalModel.setImage(new ArrayList<>());
                logicalModelDao.save(logicalModel);
            }
        }
    }

    @Test
    public void visitWebSite(){
        HttpURLConnection conn = null;
        try {
            URL realUrl = new URL("http://geomodeling.njnu.edu.cn/iEMSsRegion");
            conn = (HttpURLConnection) realUrl.openConnection();
            conn.setRequestMethod("GET");
            conn.setUseCaches(false);
            conn.setReadTimeout(8000);
            conn.setConnectTimeout(8000);
            conn.setInstanceFollowRedirects(false);
            conn.setRequestProperty("User-Agent","Mozilla/5.0 (Windows NT 10.0; WOW64; rv:46.0) Gecko/20100101 Firefox/46.0");
            int code = conn.getResponseCode();
            if (code == 200) {
                InputStream is = conn.getInputStream();
                BufferedReader in = new BufferedReader(new InputStreamReader(is, "UTF-8"));
                StringBuffer buffer = new StringBuffer();
                String line = "";
                while ((line = in.readLine()) != null){
                    buffer.append(line);
                }
                String result = buffer.toString();
                System.out.println(result);
            }
            else{
                System.out.println(code);
            }
        }catch (Exception e){
            System.out.println("error");
        }
    }

    @Test
    public void addUserInfo(){
        List<User> userList=userDao.findAll();
        for (User user:userList){
            if(user.getDescription()==null){
                user.setDescription("");
                userDao.save(user);
            }
            if(user.getEmail()==null){
                user.setEmail("");
                userDao.save(user);
            }
            if(user.getFaceBook()==null){
                user.setFaceBook("");
                userDao.save(user);
            }
            if(user.getWeiBo()==null){
                user.setWeiBo("");
                userDao.save(user);
            }
            if(user.getWeChat()==null){
                user.setWeChat("");
                userDao.save(user);
            }
            if(user.getPersonPage()==null){
                user.setPersonPage("");
                userDao.save(user);
            }
            if (user.getAffiliation()==null){
                Affiliation affiliation=new Affiliation();
                user.setAffiliation(affiliation);
                userDao.save(user);
            }
            if (user.getEducationExperiences()==null){
                List<EducationExperience> EdExList=new ArrayList<>();
                user.setEducationExperiences(EdExList);
                userDao.save(user);
            }
            if (user.getAwardsHonors()==null){
                List<AwardandHonor> awardandHonorsList=new ArrayList<>();
                user.setAwardsHonors(awardandHonorsList);
                userDao.save(user);
            }
            if (user.getResearchInterests()==null){
                List<String> researchInteresrsList=new ArrayList<>();
                user.setResearchInterests(researchInteresrsList);
                userDao.save(user);
            }

            if(user.getLab()==null){
                UserLab userLab=new UserLab();
                user.setLab(userLab);
                userDao.save(user);
                Utils.count();
            }

            if(user.getUpdateTime()==null){
                Date updateTime=user.getCreateTime();
                user.setUpdateTime(updateTime);
                userDao.save(user);
                Utils.count();
            }

            if(user.getRunTask()==null){
                List<UserTaskInfo> userTaskInfo=new ArrayList<>();
                user.setRunTask(userTaskInfo);
                userDao.save(user);
                Utils.count();
            }

        }
    }

    @Test
    public void addLastModifyTime(){
        List<Concept> list = conceptDao.findAll();
        for (Concept concept :list) {
            if (concept.getLastModifyTime()== null){
                concept.setLastModifyTime(concept.getCreateTime());
                conceptDao.save(concept);

                Utils.count();
            }
        }

        List<Unit> unitList= unitDao.findAll();
        for (Unit unit :unitList) {
            if (unit.getLastModifyTime()== null){
                unit.setLastModifyTime(unit.getCreateTime());
                unitDao.save(unit);

                Utils.count();
            }
        }
        
        List<Template> templateList= templateDao.findAll();
        for (Template template :templateList) {
            if (template.getLastModifyTime()== null){
                template.setLastModifyTime(template.getCreateTime());
                templateDao.save(template);

                Utils.count();
            }
        }
        
        List<SpatialReference> spatialReferenceList= spatialReferenceDao.findAll();
        for (SpatialReference spatialReference :spatialReferenceList) {
            if (spatialReference.getLastModifyTime()== null){
                spatialReference.setLastModifyTime(spatialReference.getCreateTime());
                spatialReferenceDao.save(spatialReference);

                Utils.count();
            }
        }
        
    }

    @Test
    public void updateConcept(){

        List<Unit> list = unitDao.findAll();
        List<String> list1 = new ArrayList<>();
        for (Unit concept :list) {
            if (concept.getParentId()!= null){
                list1.add(concept.getParentId());
                concept.setClassifications(list1);
                unitDao.save(concept);
                list1.clear();
                Utils.count();
            }
        }
    }

    @Test
    public void updateDetail(){
        List<Concept> list = conceptDao.findAll();
        String detail = "";
        for (Concept concept :list) {
            if(concept.getDetail() == null){
                if (!concept.getDescription_EN().equals("")){
                    detail += concept.getName_EN()+": " +concept.getDescription_EN() +"\n";
                }
                if (!concept.getDescription_ZH().equals("")){
                    detail += concept.getName_ZH()+": " +concept.getDescription_ZH() +"\n";
                }
                concept.setDetail(detail);
                conceptDao.save(concept);
                detail = "";
                Utils.count();
            }

        }
    }

    @Test
    public void unitName(){
        List<Unit> list = unitDao.findAll();
        for (Unit unit:list) {
            if (unit.getXml()!=null){
                org.dom4j.Document document = null;
                try {
                    document = DocumentHelper.parseText(unit.getXml());
                    Element root = document.getRootElement();
                    Element Localizations = root.element("Localizations");
                    List<Element> LocalizationList = Localizations.elements("Localization");
                    for (Element Localization : LocalizationList) {
                        String language = Localization.attributeValue("Local");
                        String name = Localization.attributeValue("Name");
                        if (language.equals("EN_US")){
                            unit.setName_EN(name);
                        }else if(language.equals("ZH_CN")){
                            unit.setName_ZH(name);
                        }
                    }
                    unitDao.save(unit);
                    Utils.count();
                } catch (DocumentException e) {
                    e.printStackTrace();
                }

            }
        }
    }

    @Test
    public void spatialNameAndDes(){
        List<SpatialReference> list = spatialReferenceDao.findAll();
        for (SpatialReference spatialReference:list) {
            if (spatialReference.getXml()!=null){
                org.dom4j.Document document = null;
                try {
                    document = DocumentHelper.parseText(spatialReference.getXml());
                    Element root = document.getRootElement();
                    Element Localization = root.element("Localization");

                    String name = Localization.attributeValue("name");
                    spatialReference.setName_EN(name);
                    String description = Localization.attributeValue("description");
                    spatialReference.setDescription_EN(description);

                    spatialReferenceDao.save(spatialReference);
                    Utils.count();
                } catch (DocumentException e) {
                    e.printStackTrace();
                }

            }
        }

    }

    @Test
    public void contextLoads() {

//        String path=PortalApplicationTests.class.getClassLoader().getResource("").getPath();
//
//        System.out.println(path);
//
//        commonService.updateAll();
        System.out.println("kaishi");

    }

    @Test
    public void addRepositoriesAuthor(){
        List<Concept> concepts=conceptDao.findAll();
        int count=0;
        for (Concept concept:concepts
             ) {
            String author=concept.getAuthor();
            if(author==null){
                concept.setAuthor("njgis");
                conceptDao.save(concept);

            }

            System.out.println(++count);
        }

        List<SpatialReference> list=spatialReferenceDao.findAll();
        count=0;
        for (SpatialReference obj:list
                ) {
            String author=obj.getAuthor();
            if(author==null){
                obj.setAuthor("njgis");
                spatialReferenceDao.save(obj);

            }

            System.out.println(++count);
        }

        List<Template> list1=templateDao.findAll();
        count=0;
        for (Template obj:list1
                ) {
            String author=obj.getAuthor();
            if(author==null){
                obj.setAuthor("njgis");
                templateDao.save(obj);

            }

            System.out.println(++count);
        }

        List<Unit> list2=unitDao.findAll();
        count=0;
        for (Unit obj:list2
                ) {
            String author=obj.getAuthor();
            if(author==null){
                obj.setAuthor("njgis");
                unitDao.save(obj);

            }

            System.out.println(++count);
        }
    }

    @Test
    public void base64ToImage(){
        List<ModelItem> modelItems=modelItemDao.findAll();
        for(int i=0;i<modelItems.size();i++){
            ModelItem modelItem=modelItems.get(i);
            String imgStr=modelItem.getImage();
            if(imgStr.indexOf("modelItem")!=-1) {
                System.out.println(modelItem.getName()+" "+modelItem.getImage());
//                String path="/modelItem/" + modelItem.getName() + ".jpg";
//                imgStr = imgStr.split(",")[1];
//                Utils.base64StrToImage(imgStr, resourcePath + path);
////                try {
////                    Thumbnails.of("原图文件的路径")
////                            .scale(1f)
////                            .outputQuality(0.5f)
////                            .toFile("压缩后文件的路径");
////
////                }
////                catch (IOException e){
////                    System.out.println(e);
////                }
//
////                modelItem.setImage(path);
////                modelItemDao.save(modelItem);
//                System.out.println(modelItem.getOid()+modelItem.getName()+modelItem.getImage());
            }
        }

//        List<User> users=userDao.findAll();
//        for(int i=0;i<users.size();i++){
//            User user=users.get(i);
//            String imgStr=user.getImage();
//            if(imgStr.indexOf("data:image")!=-1) {
//                String path="/user/" + UUID.randomUUID().toString() + ".jpg";
//                imgStr = imgStr.split(",")[1];
//                Utils.base64StrToImage(imgStr, resourcePath + path);
//                user.setImage(path);
//                userDao.save(user);
//                System.out.println(user.getOid()+user.getUserName()+user.getImage());
//            }
//        }


    }

    @Test
    public void xml2JSON(){

        List<ComputableModel> computableModels=computableModelDao.findAll();
        for(int i=0;i<computableModels.size();i++){
            ComputableModel computableModel=computableModels.get(i);
//            System.out.println(computableModel.getOid());
            if(computableModel.getMdl()!=null) {
                try {
                    JSONObject jsonObject = XmlTool.documentToJSONObject(computableModel.getMdl());
                    String type=jsonObject.getJSONArray("ModelClass").getJSONObject(0).getString("type");
                    JSONObject runtime=jsonObject.getJSONArray("ModelClass").getJSONObject(0).getJSONArray("Runtime").getJSONObject(0);
                    if(type!=null){
                        jsonObject.getJSONArray("ModelClass").getJSONObject(0).put("style",type);
                    }
                    if(jsonObject.getJSONArray("ModelClass").getJSONObject(0).getJSONArray("Runtime").getJSONObject(0).getJSONArray("SupportiveResources")==null){
                        jsonObject.getJSONArray("ModelClass").getJSONObject(0).getJSONArray("Runtime").getJSONObject(0).put("SupportiveResources","");
                    }
                    JSONArray HCinsert=jsonObject.getJSONArray("ModelClass").getJSONObject(0).getJSONArray("Runtime").getJSONObject(0).getJSONArray("HardwareConfigures").getJSONObject(0).getJSONArray("INSERT");
                    if(HCinsert!=null){

                        JSONArray HCadd= new JSONArray();

                        for(int j=0;j<HCinsert.size();j++){
                            JSONObject obj=HCinsert.getJSONObject(j);
                            if (obj.getJSONObject("key")!=null&&obj.getJSONObject("name")!=null){
                                HCadd.add(obj);
                            }
                        }

                        runtime.getJSONArray("HardwareConfigures").getJSONObject(0).put("Add",HCadd);
                    }

                    JSONArray SCinsert=jsonObject.getJSONArray("ModelClass").getJSONObject(0).getJSONArray("Runtime").getJSONObject(0).getJSONArray("SoftwareConfigures").getJSONObject(0).getJSONArray("INSERT");
                    if(SCinsert!=null){

                        JSONArray SCadd= new JSONArray();

                        for(int j=0;j<HCinsert.size();j++){
                            JSONObject obj=HCinsert.getJSONObject(j);
                            if (obj.getJSONObject("key")!=null&&obj.getJSONObject("name")!=null){
                                SCadd.add(obj);
                            }
                        }

                        runtime.getJSONArray("SoftwareConfigures").getJSONObject(0).put("Add",SCadd);
                    }

                    computableModel.setMdlJson(jsonObject);
                    computableModelDao.save(computableModel);
                }
                catch (Exception e){
                    System.out.println(i+" "+computableModel.getOid());
                    System.out.println(e);
                }

//                System.out.println(i);
            }
        }
    }

    @Test
    public void changeCharset(){
        ComputableModel computableModel=computableModelDao.findFirstByOid("f02abeb9-cf97-42af-aa9e-f4ed408b3526");
        String mdl=computableModel.getMdl();
        try {
            if(isMessyCode(mdl)) {
                String newMdl = new String(mdl.getBytes("GBK"), "utf-8");
                System.out.println(newMdl);
            }
            else {
                System.out.println(mdl);
            }
        }
        catch (Exception e){

        }
    }

    private static boolean isChinese(char c) {
        Character.UnicodeBlock ub = Character.UnicodeBlock.of(c);
        if (ub == Character.UnicodeBlock.CJK_UNIFIED_IDEOGRAPHS
                || ub == Character.UnicodeBlock.CJK_COMPATIBILITY_IDEOGRAPHS
                || ub == Character.UnicodeBlock.CJK_UNIFIED_IDEOGRAPHS_EXTENSION_A
                || ub == Character.UnicodeBlock.GENERAL_PUNCTUATION
                || ub == Character.UnicodeBlock.CJK_SYMBOLS_AND_PUNCTUATION
                || ub == Character.UnicodeBlock.HALFWIDTH_AND_FULLWIDTH_FORMS) {
            return true;
        }
        return false;
    }

    public static boolean isMessyCode(String strName) {
        Pattern p = Pattern.compile("\\s*|\t*|\r*|\n*");
        Matcher m = p.matcher(strName);
        String after = m.replaceAll("");
        String temp = after.replaceAll("\\p{P}", "");
        char[] ch = temp.trim().toCharArray();
        float chLength = 0 ;
        float count = 0;
        for (int i = 0; i < ch.length; i++) {
            char c = ch[i];
            if (!Character.isLetterOrDigit(c)) {
                if (!isChinese(c)) {
                    count = count + 1;
                }
                chLength++;
            }
        }
        float result = count / chLength ;
        if (result > 0.4) {
            return true;
        } else {
            return false;
        }
    }

}