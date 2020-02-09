package njgis.opengms.portal.service;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import njgis.opengms.portal.dao.DataItemDao;
import njgis.opengms.portal.dao.FeedbackDao;
import njgis.opengms.portal.dao.TaskDao;
import njgis.opengms.portal.dao.UserDao;
import njgis.opengms.portal.dto.*;
import njgis.opengms.portal.entity.DataItem;
import njgis.opengms.portal.entity.Feedback;
import njgis.opengms.portal.entity.User;
import njgis.opengms.portal.entity.support.*;
import njgis.opengms.portal.enums.ResultEnum;
import njgis.opengms.portal.exception.MyException;
import njgis.opengms.portal.utils.Utils;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.util.DigestUtils;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.io.File;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
public class UserService {

    @Autowired
    UserDao userDao;

    @Autowired
    TaskDao taskDao;

    @Autowired
    DataItemDao dataItemDao;

    @Autowired
    FeedbackDao feedbackDao;

    @Autowired
    CommonService commonService;

    //远程数据容器地址
    @Value("${dataContainerIpAndPort}")
    String dataContainerIpAndPort;

    @Value("${resourcePath}")
    private String resourcePath;

    @Value("${htmlLoadPath}")
    private String htmlLoadPath;


    public String resetPassword(String email){
        try {
            Random random = new Random();
            String password = "";
            for (int i = 0; i < 8; i++) {
                int num = random.nextInt(62);
                if (num >= 0 && num < 10) {
                    password += num;
                } else if (num >= 10 && num < 36) {
                    num -= 10;
                    num += 65;
                    char c = (char) num;
                    password += c;
                } else {
                    num -= 36;
                    num += 97;
                    char c = (char) num;
                    password += c;
                }
            }

            User user=userDao.findFirstByEmail(email);
            if(user!=null){
                user.setPassword(DigestUtils.md5DigestAsHex(password.getBytes()));
                userDao.save(user);
                String subject="OpenGMS Portal Password Reset";
                String content="Hello " + user.getName() + ":<br/>"+
                        "Your password has been reset to <b>"+password+"</b>. You can change the password after logging in.<br/>"+
                        "Welcome to <a href='http://geomodeling.njnu.edu.cn' target='_blank'>OpenGMS</a> !";

                Boolean flag = commonService.sendEmail(email,subject,content);
                if(flag) {

                    return "suc";
                }
                else{
                    return "send fail";
                }
            }
            else {
                return "no user";
            }

        }
        catch (Exception e){
            return "error";
        }
    }
    //++
    public void modelItemPlusPlus(String userName){
        User user = userDao.findFirstByUserName(userName);
        int count=user.getModelItems();
        user.setModelItems(++count);
        userDao.save(user);
    }
    public void dataItemPlusPlus(String userName){
        User user = userDao.findFirstByUserName(userName);
        int count=user.getDataItems();
        user.setDataItems(++count);
        userDao.save(user);
    }
    public void conceptualModelPlusPlus(String userName){
        User user = userDao.findFirstByUserName(userName);
        int count=user.getConceptualModels();
        user.setConceptualModels(++count);
        userDao.save(user);
    }
    public void logicalModelPlusPlus(String userName){
        User user = userDao.findFirstByUserName(userName);
        int count=user.getLogicalModels();
        user.setLogicalModels(++count);
        userDao.save(user);
    }
    public void computableModelPlusPlus(String userName){
        User user = userDao.findFirstByUserName(userName);
        int count=user.getComputableModels();
        user.setComputableModels(++count);
        userDao.save(user);
    }
    public void conceptPlusPlus(String userName){
        User user = userDao.findFirstByUserName(userName);
        int count=user.getConcepts();
        user.setConcepts(++count);
        userDao.save(user);
    }
    public void themePlusPlus(String username){
        User user = userDao.findFirstByUserName(username);
        int count = user.getThemes();
        user.setThemes(++count);
        userDao.save(user);
    }
    public void spatialPlusPlus(String userName){
        User user = userDao.findFirstByUserName(userName);
        int count=user.getSpatials();
        user.setSpatials(++count);
        userDao.save(user);
    }
    public void templatePlusPlus(String userName){
        User user = userDao.findFirstByUserName(userName);
        int count=user.getTemplates();
        user.setTemplates(++count);
        userDao.save(user);
    }
    public void unitPlusPlus(String userName){
        User user = userDao.findFirstByUserName(userName);
        int count=user.getUnits();
        user.setUnits(++count);
        userDao.save(user);
    }

    //--
    public void modelItemMinusMinus(String userName){
        User user = userDao.findFirstByUserName(userName);
        int count=user.getModelItems();
        user.setModelItems(--count);
        userDao.save(user);
    }
    public void dataItemMinusMinus(String userName){
        User user = userDao.findFirstByUserName(userName);
        int count=user.getDataItems();
        user.setDataItems(--count);
        userDao.save(user);
    }
    public void conceptualModelMinusMinus(String userName){
        User user = userDao.findFirstByUserName(userName);
        int count=user.getConceptualModels();
        user.setConceptualModels(--count);
        userDao.save(user);
    }
    public void logicalModelMinusMinus(String userName){
        User user = userDao.findFirstByUserName(userName);
        int count=user.getLogicalModels();
        user.setLogicalModels(--count);
        userDao.save(user);
    }
    public void computableModelMinusMinus(String userName){
        User user = userDao.findFirstByUserName(userName);
        int count=user.getComputableModels();
        user.setComputableModels(--count);
        userDao.save(user);
    }
    public void conceptMinusMinus(String userName){
        User user = userDao.findFirstByUserName(userName);
        int count=user.getConcepts();
        user.setConcepts(--count);
        userDao.save(user);
    }
    public void spatialMinusMinus(String userName){
        User user = userDao.findFirstByUserName(userName);
        int count=user.getSpatials();
        user.setSpatials(--count);
        userDao.save(user);
    }
    public void templateMinusMinus(String userName){
        User user = userDao.findFirstByUserName(userName);
        int count=user.getTemplates();
        user.setTemplates(--count);
        userDao.save(user);
    }
    public void unitMinusMinus(String userName){
        User user = userDao.findFirstByUserName(userName);
        int count=user.getUnits();
        user.setUnits(--count);
        userDao.save(user);
    }
    public void articleMinusMinus(String userName){
        User user = userDao.findFirstByUserName(userName);
        int count=user.getArticlesCount();
        user.setArticlesCount(--count);
        userDao.save(user);
    }

    public void projectItemMinusMinus(String userName){
        User user = userDao.findFirstByUserName(userName);
        int count=user.getProjectsCount();
        user.setProjectsCount(--count);
        userDao.save(user);
    }

    public void conferenceItemMinusMinus(String userName){
        User user = userDao.findFirstByUserName(userName);
        int count=user.getConferencesCount();
        user.setConferencesCount(--count);
        userDao.save(user);
    }

    public User getByUid(String userName){
        try {
            return userDao.findFirstByUserName(userName);
        } catch (Exception e) {
            System.out.println("有人乱查数据库！！该UID不存在User对象");
            throw new MyException(ResultEnum.NO_OBJECT);
        }
    }

    public User getByOid(String id) {
        try {
            return userDao.findFirstByOid(id);
        } catch (Exception e) {
            System.out.println("有人乱查数据库！！该OID不存在User对象");
            throw new MyException(ResultEnum.NO_OBJECT);
        }
    }

    public int addUser(UserAddDTO user) {

        User u=userDao.findFirstByUserName(user.getUserName());
        if(u!=null){
            return -1;
        }
        u=userDao.findFirstByEmail(user.getEmail());
        if(u!=null){
            return -2;
        }
        else {
            User user1 = new User();
            BeanUtils.copyProperties(user, user1);
            user1.setOid(String.valueOf(userDao.findAll().size() + 1));
            user1.setCreateTime(new Date());
            List<String> orgs=new ArrayList<>();
            orgs.add(user.getOrg());
            user1.setOrganizations(orgs);
            user1.setImage("");
            user1.setDescription("");
            user1.setPhone("");
            user1.setWiki("");
            Affiliation affiliation=new Affiliation();
            user1.setAffiliation(affiliation);
            UserLab lab=new UserLab();
            user1.setLab(lab);
            userDao.insert(user1);
            return 1;
        }
    }

    public int changePass(String oid,String oldPass,String newPass){

        User user = userDao.findFirstByOid(oid);
        String old=user.getPassword();
        if(old.equals(oldPass)){
            user.setPassword(newPass);
            userDao.save(user);
            return 1;
        }
        else{
            return -2;
        }

    }

    public int updateUser(UserUpdateDTO userUpdateDTO){

        User user=userDao.findFirstByOid(userUpdateDTO.getOid());

        BeanUtils.copyProperties(userUpdateDTO,user);
        //判断是否为新图片
        String uploadImage=userUpdateDTO.getUploadImage();
        if(!uploadImage.contains("/user/")) {
            //删除旧图片
            File file=new File(resourcePath+user.getImage());
            if(file.exists()&&file.isFile())
                file.delete();
            //添加新图片
            String path = "/user/" + UUID.randomUUID().toString() + ".jpg";
            String imgStr = uploadImage.split(",")[1];
            Utils.base64StrToImage(imgStr, resourcePath + path);
            user.setImage(path);
        }
        userDao.save(user);

        return 1;
    }

    public JSONObject validPassword(String account, String password, String ip) {

        User user = userDao.findFirstByEmail(account);
        if (user == null) {
            user = userDao.findFirstByUserName(account);
        }
        if (user != null) {
            if (user.getPassword().equals(password)) {
                SetLastLoginIp(user,ip);
                JSONObject result=new JSONObject();
                result.put("name",user.getName());
                result.put("oid",user.getOid());
                result.put("uid",user.getUserName());
                return result;
            }
        }
        return null;
    }

    public void SetLastLoginIp(User user,String ip){
        user.setLastLoginIp(ip);
        userDao.save(user);
    }

    public String getImage(String oid){
        String imgStr=userDao.findFirstByOid(oid).getImage();
        return imgStr.equals("")?"":htmlLoadPath+userDao.findFirstByOid(oid).getImage();
    }

    public JSONObject getUserInfo(String userId){
        JSONObject result=new JSONObject();
        int success=taskDao.findAllByUserIdAndStatus(userId,2).size();
        int calculating=taskDao.findAllByUserIdAndStatus(userId,0).size();
        calculating+=taskDao.findAllByUserIdAndStatus(userId,1).size();
        int failed=taskDao.findAllByUserIdAndStatus(userId,-1).size();

        JSONObject taskStatistic=new JSONObject();
        taskStatistic.put("success",success);
        taskStatistic.put("fail",failed);
        taskStatistic.put("calculating",calculating);
        result.put("record",taskStatistic);


        result.put("userInfo",getUser(userId));
        return result;
    }

    public JSONObject getUserInfoByOid(String oid){
        User user = userDao.findFirstByOid(oid);
        String userName=user.getUserName();
        JSONObject result=new JSONObject();
        result.put("userInfo",getUser(userName));
        return result;
    }

    public JSONObject getUser(String userName){
        User user = userDao.findFirstByUserName(userName);
        JSONObject userInfo=new JSONObject();
        userInfo.put("organizations",user.getOrganizations());
        userInfo.put("subjectAreas",user.getSubjectAreas());
        userInfo.put("name",user.getName());
        userInfo.put("oid",user.getOid());
        userInfo.put("userName",user.getUserName());
        userInfo.put("email",user.getEmail());
        userInfo.put("phone",user.getPhone());
        userInfo.put("weChat",user.getWeChat());
        userInfo.put("faceBook",user.getFaceBook());
        userInfo.put("personPage",user.getPersonPage());
        userInfo.put("wiki",user.getWiki());
        userInfo.put("description",user.getDescription());
        userInfo.put("researchInterests",user.getResearchInterests());
        userInfo.put("lab",user.getLab());
        userInfo.put("affiliation",user.getAffiliation());
        userInfo.put("eduExperiences",user.getEducationExperiences());
        userInfo.put("awdHonors",user.getAwardsHonors());
        userInfo.put("runTask",user.getRunTask());
        userInfo.put("image",user.getImage().equals("")?"":htmlLoadPath+user.getImage());

        return userInfo;
    }

    public JSONObject getItemUserInfo(String userName){
        User user = userDao.findFirstByUserName(userName);
        JSONObject userJson = new JSONObject();
        userJson.put("name", user.getName());
        userJson.put("oid", user.getOid());
        userJson.put("image", user.getImage().equals("")?"":htmlLoadPath+user.getImage());
        return userJson;
    }

    public JSONObject getItemUserInfoByOid(String oid){
        User user = userDao.findFirstByOid(oid);
        JSONObject userJson = new JSONObject();
        userJson.put("name", user.getName());
        userJson.put("oid", user.getOid());
        userJson.put("image", user.getImage().equals("")?"":htmlLoadPath+user.getImage());
        return userJson;
    }

    public String updateDescription(String description,String userName){
        try{
            User user=userDao.findFirstByUserName(userName);
            if(user!=null){
                user.setDescription(description);
                userDao.save(user);
                return "success";
            }
            else
                return "no user";

        }catch (Exception e){
            return "fail";
        }

    }

    public String updateResearchInterest(List<String> researchInterests,String userName){
        try{
            User user=userDao.findFirstByUserName(userName);
            if(user!=null){
                user.setResearchInterests(researchInterests);
//                System.out.println(user.getResearchInterests());
                userDao.save(user);
                return "success";
            }
            else
                return "no user";

        }catch (Exception e){
            return "fail";
        }
    }


    public String updateAffiliation(AffiliationDTO affiliationDTO, String userName) {
        try {
            User user = userDao.findFirstByUserName(userName);
            if (user != null) {
                Affiliation affiliation=new Affiliation();
                BeanUtils.copyProperties(affiliationDTO,affiliation);
                user.setAffiliation(affiliation);
                Date now=new Date();
                user.setUpdateTime(now);
                userDao.save(user);
                return "success";
            } else
                return "no user";

        } catch (Exception e) {
            return "fail";
        }
    }

    public String updateLab(UserLabDTO userLabDTO, String userName) {
        try {
            User user = userDao.findFirstByUserName(userName);
            if (user != null) {
                UserLab userLab=new UserLab();
                BeanUtils.copyProperties(userLabDTO,userLab);
                user.setLab(userLab);
                Date now=new Date();
                user.setUpdateTime(now);
                userDao.save(user);
                return "success";
            } else
                return "no user";

        } catch (Exception e) {
            return "fail";
        }
    }

    public String updateSubjectAreas(List<String> subjectAreas,String userName){
        try{
            User user=userDao.findFirstByUserName(userName);
            if(user!=null){
                user.setSubjectAreas(subjectAreas);
//                System.out.println(user.getResearchInterests());
                userDao.save(user);
                return "success";
            }
            else
                return "no user";

        }catch (Exception e){
            return "fail";
        }
    }

    public String updateEduExperience(EducationExperienceDTO educationExperienceDTO, String userName) {
        try {
            User user = userDao.findFirstByUserName(userName);
            if (user != null) {
                EducationExperience educationExperience=new EducationExperience();
                BeanUtils.copyProperties(educationExperienceDTO,educationExperience);
                List<EducationExperience> educationExperienceList=user.getEducationExperiences();
                educationExperienceList.add(educationExperience);
                user.setEducationExperiences(educationExperienceList);
                Date now=new Date();
                user.setUpdateTime(now);
                userDao.save(user);
                return "success";
            } else
                return "no user";

        } catch (Exception e) {
            return "fail";
        }
    }

    public String updateAwdHonor(AwdHonorDTO awdHonorDTO, String userName) {
        try {
            User user = userDao.findFirstByUserName(userName);
            if (user != null) {
                AwardandHonor awardandHonor=new AwardandHonor();
                BeanUtils.copyProperties(awdHonorDTO,awardandHonor);
                List<AwardandHonor> awardandHonorList=user.getAwardsHonors();
                awardandHonorList.add(awardandHonor);
                user.setAwardsHonors(awardandHonorList);
                Date now=new Date();
                user.setUpdateTime(now);
                userDao.save(user);
                return "success";
            } else
                return "no user";

        } catch (Exception e) {
            return "fail";
        }
    }

    public String updateContact(ContactDTO contactDTO, String userName) {
        try {
            User user = userDao.findFirstByUserName(userName);
            if (user != null) {
                user.setPhone(contactDTO.getPhone());
                user.setEmail(contactDTO.getEmail());
                user.setFaceBook(contactDTO.getFaceBook());
                user.setWeChat(contactDTO.getWeChat());
                user.setPersonPage(contactDTO.getPersonPage());
                userDao.save(user);
                return "success";
            } else
                return "no user";

        } catch (Exception e) {
            return "fail";
        }
    }

    public ModelAndView judgeLogin(HttpServletRequest req) {
        ModelAndView modelAndView = new ModelAndView();
        HttpSession session = req.getSession();
        if(session.getAttribute("uid")==null){
            modelAndView.setViewName("navbar");
            modelAndView.addObject("login","no");
        }else {
            modelAndView.setViewName("navbar");
            modelAndView.addObject("login","yes");
        }

        return modelAndView;
    }

    public String saveUserIcon(String img,String userName){
        try {
            User user =userDao.findFirstByUserName(userName);
            if(user!=null){
                String uploadImage=img;
                String path="/user/";
                if(!uploadImage.contains("/user/")) {
                    //删除旧图片
                    File file=new File(resourcePath+user.getImage());
                    if(file.exists()&&file.isFile())
                        file.delete();
                    //添加新图片
                    path = "/user/" + UUID.randomUUID().toString() + ".jpg";
                    String imgStr = uploadImage.split(",")[1];
                    Utils.base64StrToImage(imgStr, resourcePath + path);
                    user.setImage(path);

                }
                userDao.save(user);
                return path;

            }
            else
                return "no user";

        }catch(Exception e){
            return "fail";
        }
    }

    public String addTaskInfo(String userName, UserTaskInfo userTaskInfo){
        try {
            User user =userDao.findFirstByUserName(userName);
            if(user!=null){
                List<UserTaskInfo>runTask= user.getRunTask();
                runTask.add(userTaskInfo);
                Date now=new Date();

                user.setRunTask(runTask);
                user.setUpdateTime(now);
                System.out.println(userDao.save(user));
                return "add taskInfo suc";
            }
            else
                return "no user";

        }catch(Exception e){
            return "fail";
        }


    }

    public String addFolder(List<String> paths,String name,String userName){
        User user=userDao.findFirstByUserName(userName);

        String id=UUID.randomUUID().toString();
        user.setFileContainer(aFolder(paths,user.getFileContainer(),name,id,"0"));

        userDao.save(user);

        return id;
    }

    private List<FileMeta> aFolder(List<String> paths,List<FileMeta> fileMetaList,String name,String id,String father){

        String[] a={"0"};
        if(paths.size()==0||paths.get(0).equals("0")){
            fileMetaList.add(new FileMeta(true,false,id,father,name,"","",new ArrayList<>()));
        }
        else {
            // pop
            String path = paths.remove(paths.size() - 1);
            for (int i = 0; i < fileMetaList.size(); i++) {
                FileMeta fileMeta = fileMetaList.get(i);
                if (fileMeta.getId().equals(path)) {

                    fileMeta.setContent(aFolder(paths, fileMeta.getContent(),name,id,path));
                    fileMetaList.set(i,fileMeta);
                    break;
                }
            }
        }
        return fileMetaList;
    }


    public JSONArray addFiles(List<String> paths, List<Map> files, String userName){
        User user=userDao.findFirstByUserName(userName);
        List<String> pathsCopy=new ArrayList<>();
        JSONArray idList=new JSONArray();
        for (int i = 0; i < files.size(); i++) {

            String fileName = files.get(i).get("file_name").toString();
            String url = "http://" + dataContainerIpAndPort + "/data?uid=" + files.get(i).get("source_store_id").toString();
            String[] a = fileName.split("\\.");
            String name = a[0];
            String suffix = a[1];
            String id = UUID.randomUUID().toString();

            pathsCopy.addAll(paths);
            user.setFileContainer(aFile(pathsCopy, user.getFileContainer(), name, suffix, id, "0", url));
            JSONObject obj=new JSONObject();
            obj.put("id",id);
            obj.put("url",url);
            idList.add(obj);
        }

        userDao.save(user);
        return idList;
    }

    private List<FileMeta> aFile(List<String> paths,List<FileMeta> fileMetaList,String name,String suffix,String id,String father,String url){

        if(paths.size()==0||paths.get(0).equals("0")){
            fileMetaList.add(new FileMeta(false,true,id,father,name,suffix,url,new ArrayList<>()));
        }
        else {
            // pop
            String path = paths.remove(paths.size() - 1);
            for (int i = 0; i < fileMetaList.size(); i++) {
                FileMeta fileMeta = fileMetaList.get(i);
                if (fileMeta.getId().equals(path)) {

                    fileMeta.setContent(aFile(paths, fileMeta.getContent(),name,suffix,id,path,url));
                    fileMetaList.set(i,fileMeta);
                    break;
                }
            }
        }
        return fileMetaList;
    }

    public List<String> deleteFiles(List<FileMeta> deletes,String userName){
        List<String> result = new ArrayList<>() ;
        for(FileMeta file : deletes ){
            String id=file.getId();
            result.add(deleteFile(id,userName)) ;
        }
        return result;
    }

    public String deleteFile(String id, String userName){
        User user = userDao.findFirstByUserName(userName);

        user.setFileContainer(find7DeleteFile(user.getFileContainer(), id));

        userDao.save(user);
        return id;
    }

    public List<FileMeta> find7DeleteFile(List<FileMeta> fileMetaList, String id) {
        FileMeta fileMeta=new FileMeta();
        if (fileMetaList != null && fileMetaList.size() != 0)
            for (int i = fileMetaList.size()-1; i >=0; i--) {
                System.out.println(fileMetaList.get(i).getId());
                if (fileMetaList.get(i).getId().equals(id)){
                    fileMetaList.remove(i);
                    return fileMetaList;
                }

                else find7DeleteFile(fileMetaList.get(i).getContent(), id);
            }

        return fileMetaList;
    }

    public String updateFile( String id, String name, String userName) {
        User user = userDao.findFirstByUserName(userName);

        user.setFileContainer(find7UpdateFile(user.getFileContainer(), id,name));

        userDao.save(user);
        return id;
    }

    public List<FileMeta> find7UpdateFile(List<FileMeta> fileMetaList, String id,String name) {
        FileMeta fileMeta=new FileMeta();
        if (fileMetaList != null && fileMetaList.size() != 0)
            for (int i = 0; i < fileMetaList.size(); i++) {
                System.out.println(fileMetaList.get(i).getId());
                if (fileMetaList.get(i).getId().equals(id)){
                    fileMetaList.get(i).setName(name);
                    return fileMetaList;
                }

                else find7UpdateFile(fileMetaList.get(i).getContent(), id,name);
            }

        return fileMetaList;
    }

    public JSONArray getFolder(String userName){
        User user=userDao.findFirstByUserName(userName);
        List<FileMeta> fileMetaList=user.getFileContainer();

        if(fileMetaList==null||fileMetaList.size()==0) {

            FileMeta fileMeta=new FileMeta(true,false,UUID.randomUUID().toString(),"0","My Data","","",new ArrayList<>());
            fileMetaList=new ArrayList<>();
            fileMetaList.add(fileMeta);
            user.setFileContainer(fileMetaList);
            userDao.save(user);
        }


        JSONArray content=new JSONArray();
        JSONObject obj=new JSONObject();
        obj.put("id", "0");
        obj.put("label", "All Folder");
        obj.put("children", gFolder(fileMetaList));

        content.add(obj);

        return content;

    }

    private JSONArray gFolder(List<FileMeta> fileMetaList){


        JSONArray parent=new JSONArray();

        if(fileMetaList.size()!=0) {
            for (int i = 0; i < fileMetaList.size(); i++) {
                FileMeta fileMeta = fileMetaList.get(i);
                if (fileMeta.getIsFolder()) {
                    JSONObject jsonObject = new JSONObject();
                    jsonObject.put("id", fileMeta.getId());
                    jsonObject.put("label", fileMeta.getName());
                    jsonObject.put("package",fileMeta.getIsFolder());
                    jsonObject.put("father",fileMeta.getFather());
                    jsonObject.put("children", gFolder(fileMeta.getContent()));
                    System.out.println(fileMeta.getContent());
                    parent.add(jsonObject);
                }
            }
        }
        return parent;
    }

    public JSONArray getFolder7File(String userName){
        User user=userDao.findFirstByUserName(userName);
        List<FileMeta> fileMetaList=user.getFileContainer();

        if(fileMetaList==null||fileMetaList.size()==0) {

            FileMeta fileMeta=new FileMeta(true,false,UUID.randomUUID().toString(),"0","My Data","","",new ArrayList<>());
            fileMetaList=new ArrayList<>();
            fileMetaList.add(fileMeta);
            user.setFileContainer(fileMetaList);
            userDao.save(user);
        }


        JSONArray content=new JSONArray();
        JSONObject obj=new JSONObject();
        obj.put("id", "0");
        obj.put("label", "All Folder");
        obj.put("children", gAllFile(fileMetaList));

        content.add(obj);

        return content;

    }

    private JSONArray gAllFile(List<FileMeta> fileMetaList){


        JSONArray parent=new JSONArray();

        if(fileMetaList!=null&&fileMetaList.size()!=0) {
            for (int i = 0; i < fileMetaList.size(); i++) {
                FileMeta fileMeta = fileMetaList.get(i);
                if (fileMeta.getId()!=null) {
                    JSONObject jsonObject = new JSONObject();
                    jsonObject.put("id", fileMeta.getId());
                    jsonObject.put("label", fileMeta.getName());
                    jsonObject.put("package",fileMeta.getIsFolder());
                    jsonObject.put("upload",fileMeta.getIsUserUpload());
                    jsonObject.put("father",fileMeta.getFather());
                    jsonObject.put("suffix",fileMeta.getSuffix());
                    jsonObject.put("url",fileMeta.getUrl());
                    jsonObject.put("children", gAllFile(fileMeta.getContent()));

                    parent.add(jsonObject);
                }
            }
        }
        return parent;
    }

    public JSONObject getFileByPath(List<String> paths,String userName){
        User user=userDao.findFirstByUserName(userName);
        List<FileMeta> fileMetaList=user.getFileContainer();

        JSONObject obj=new JSONObject();
        obj.put("data",gFileBypath(paths,fileMetaList));


        return obj;
    }


    private JSONArray gFileBypath(List<String> paths,List<FileMeta> fileMetaList){

        JSONArray list = new JSONArray();
        if(paths.size()==0||paths.get(0).equals("0")){
            for(int i=0;i<fileMetaList.size();i++)
            {
                FileMeta fileMeta = fileMetaList.get(i);
                if (fileMeta.getId()!=null) {
                    JSONObject jsonObject = new JSONObject();
                    jsonObject.put("id", fileMeta.getId());
                    jsonObject.put("label", fileMeta.getName());
                    jsonObject.put("package",fileMeta.getIsFolder());
                    jsonObject.put("upload",fileMeta.getIsUserUpload());
                    jsonObject.put("father",fileMeta.getFather());
                    jsonObject.put("suffix",fileMeta.getSuffix());
                    jsonObject.put("url",fileMeta.getUrl());
                    jsonObject.put("children", gAllFile(fileMeta.getContent()));

                    list.add(jsonObject);
                }
            }
            return list;
        }
        else {
            // pop
            String path = paths.remove(paths.size() - 1);
            for (int i = 0; i < fileMetaList.size(); i++) {
                FileMeta fileMeta = fileMetaList.get(i);
                if (fileMeta.getId().equals(path)) {
                    list=gFileBypath(paths, fileMeta.getContent());
                    break;
                }
            }
        }
        return list;
    }

    public JSONObject searchFile(String keyword, String userName){
        User user=userDao.findFirstByUserName(userName);
        List<FileMeta> fileMetaList=user.getFileContainer();

        JSONObject obj=new JSONObject();
        obj.put("data",sFileByKeyword(keyword,fileMetaList));

        return obj;
    }

    public JSONArray sFileByKeyword(String keyword, List<FileMeta> fileMetaList){
        JSONArray resultList=new JSONArray();

        if(fileMetaList!=null&&fileMetaList.size()!=0) {
            for (int i = 0; i < fileMetaList.size(); i++) {
                FileMeta fileMeta = fileMetaList.get(i);
                //正则表达式不区分大小写匹配
                Pattern pattern = Pattern.compile(keyword, Pattern.CASE_INSENSITIVE);
                Matcher matcher = pattern.matcher(fileMeta.getName());
                Matcher matcher1 = pattern.matcher(fileMeta.getSuffix());
                if (matcher.find()||matcher1.find()) {
                    JSONObject jsonObject = new JSONObject();
                    jsonObject.put("id", fileMeta.getId());
                    jsonObject.put("label", fileMeta.getName());
                    jsonObject.put("package",fileMeta.getIsFolder());
                    jsonObject.put("upload",fileMeta.getIsUserUpload());
                    jsonObject.put("father",fileMeta.getFather());
                    jsonObject.put("suffix",fileMeta.getSuffix());
                    jsonObject.put("url",fileMeta.getUrl());
                    jsonObject.put("children", gAllFile(fileMeta.getContent()));

                    resultList.add(jsonObject);
                }
                else{
                    resultList.addAll(sFileByKeyword(keyword,fileMeta.getContent()));
                }
            }
        }
        return resultList;
    }

    public String forkData(List<String> paths,List<String> dataIds,String itemId,String userName){

        User user=userDao.findFirstByUserName(userName);

        DataItem dataItem=dataItemDao.findFirstById(itemId);

        user.setFileContainer(setData(paths,user.getFileContainer(),dataIds,dataItem,"0"));
        userDao.save(user);

        return "suc";
    }

    private List<FileMeta> setData(List<String> paths,List<FileMeta> fileMetaList,List<String> dataIds,DataItem dataItem,String father){

        if(paths.size()==0){
            List<DataMeta> dataList=dataItem.getDataList();
            for(String dataId:dataIds){
                for(DataMeta dataMeta:dataList){
                    String url=dataMeta.getUrl();
                    String param=url.split("[?]")[1];
                    String id=param.split("=")[1];
                    if(dataId.equals(url)){
                        boolean exist=false;
                        for(FileMeta fm:fileMetaList){
                            if(fm.getId().equals(id)){
                                exist=true;
                                break;
                            }
                        }
                        if(!exist) {
                            FileMeta fileMeta = new FileMeta(false,false, id,father, dataMeta.getName(), dataMeta.getSuffix(), dataMeta.getUrl(), null);
                            fileMetaList.add(fileMeta);
                        }
                        break;
                    }

                }
            }
        }
        else{
            String id=paths.remove(paths.size()-1);
            for(FileMeta fileMeta:fileMetaList){
                if(fileMeta.getId().equals(id)){
                    fileMeta.setContent(setData(paths,fileMeta.getContent(),dataIds,dataItem,id));
                }
            }
        }
        return fileMetaList;
    }

    public String sendFeedback (String content, String userName){
        Feedback feedback = new Feedback();
        feedback.setContent(content);
        feedback.setUserName(userName);
        Date now=new Date();
        feedback.setTime(now);

        feedbackDao.save(feedback);

        return "success";
    }

}
