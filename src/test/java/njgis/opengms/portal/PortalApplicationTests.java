package njgis.opengms.portal;

import com.alibaba.fastjson.JSONObject;
import njgis.opengms.portal.dao.*;
import njgis.opengms.portal.entity.*;
import njgis.opengms.portal.service.CommonService;
import njgis.opengms.portal.utils.XmlTool;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.List;
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
    ComputableModelDao computableModelDao;

    @Autowired
    ConceptDao conceptDao;

    @Autowired
    SpatialReferenceDao spatialReferenceDao;

    @Autowired
    TemplateDao templateDao;

    @Autowired
    UnitDao unitDao;

    @Value("${resourcePath}")
    private String resourcePath;


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
//                    System.out.println(jsonObject);
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