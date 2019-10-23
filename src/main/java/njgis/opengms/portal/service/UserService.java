package njgis.opengms.portal.service;

import com.alibaba.fastjson.JSONObject;
import njgis.opengms.portal.dao.TaskDao;
import njgis.opengms.portal.dao.UserDao;
import njgis.opengms.portal.dto.*;
import njgis.opengms.portal.entity.User;
import njgis.opengms.portal.entity.support.Affiliation;
import njgis.opengms.portal.entity.support.AwardandHonor;
import njgis.opengms.portal.entity.support.EducationExperience;
import njgis.opengms.portal.entity.support.UserLab;
import njgis.opengms.portal.enums.ResultEnum;
import njgis.opengms.portal.exception.MyException;
import njgis.opengms.portal.utils.Utils;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.io.File;
import java.util.*;

@Component
public class UserService {

    @Autowired
    UserDao userDao;

    @Autowired
    TaskDao taskDao;

    @Autowired
    DataItemDao dataItemDao;

    @Autowired
    CommonService commonService;

    @Value("${resourcePath}")
    private String resourcePath;

    @Value("${htmlLoadPath}")
    private String htmlLoadPath;


    public String resetPassword(String email){
        try {
            Random random = new Random();
            String password = "";
            for (int i = 0; i < 10; i++) {
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
                user.setPassword(password);
                userDao.save(user);
                String subject="OpenGMS Portal Password Reset";
                String content="Your password has been reset to <b>"+password+"</b>.";

                commonService.sendEmail(email,subject,content);

                return "suc";
            }
            else {
                return "no user";
            }

        }
        catch (Exception e){
            return "fail";
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

    public JSONObject validPassword(String account, String password) {

        User user = userDao.findFirstByEmail(account);
        if (user == null) {
            user = userDao.findFirstByUserName(account);
        }
        if (user != null) {
            if (user.getPassword().equals(password)) {
                JSONObject result=new JSONObject();
                result.put("name",user.getName());
                result.put("oid",user.getOid());
                result.put("uid",user.getUserName());
                return result;
            }
        }
        return null;
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
        user.setFileContainer(aFolder(paths,user.getFileContainer(),name,id));

        userDao.save(user);

        return id;
    }

    private List<FileMeta> aFolder(List<String> paths,List<FileMeta> fileMetaList,String name,String id){

        if(paths.size()==0){
            fileMetaList.add(new FileMeta(true,id,name,"","",new ArrayList<>()));
        }
        else {
            // pop
            String path = paths.remove(paths.size() - 1);
            for (int i = 0; i < fileMetaList.size(); i++) {
                FileMeta fileMeta = fileMetaList.get(i);
                if (fileMeta.getId().equals(path)) {

                    fileMeta.setContent(aFolder(paths, fileMeta.getContent(),name,id));
                    fileMetaList.set(i,fileMeta);
                    break;
                }
            }
        }
        return fileMetaList;
    }

    public JSONArray getFolder(String userName){
        User user=userDao.findFirstByUserName(userName);
        List<FileMeta> fileMetaList=user.getFileContainer();

        if(fileMetaList==null) {
            FileMeta fileMeta=new FileMeta(true,UUID.randomUUID().toString(),"My Data","","",new ArrayList<>());
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

                    jsonObject.put("children", gFolder(fileMeta.getContent()));

                    parent.add(jsonObject);
                }
            }
        }
        return parent;
    }

    public String forkData(List<String> paths,List<String> dataIds,String itemId,String userName){

        User user=userDao.findFirstByUserName(userName);

        DataItem dataItem=dataItemDao.findFirstById(itemId);

        user.setFileContainer(setData(paths,user.getFileContainer(),dataIds,dataItem));
        userDao.save(user);

        return "suc";
    }

    private List<FileMeta> setData(List<String> paths,List<FileMeta> fileMetaList,List<String> dataIds,DataItem dataItem){

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
                            FileMeta fileMeta = new FileMeta(false, id, dataMeta.getName(), dataMeta.getSuffix(), dataMeta.getUrl(), null);
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
                    fileMeta.setContent(setData(paths,fileMeta.getContent(),dataIds,dataItem));
                }
            }
        }
        return fileMetaList;
    }

}
