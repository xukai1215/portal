package njgis.opengms.portal.controller.rest;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import njgis.opengms.portal.bean.LoginRequired;
import njgis.opengms.portal.bean.JsonResult;
import njgis.opengms.portal.dto.*;
import njgis.opengms.portal.entity.User;
import njgis.opengms.portal.entity.support.FileMeta;
import njgis.opengms.portal.entity.support.UserTaskInfo;
import njgis.opengms.portal.service.DataItemService;
import njgis.opengms.portal.service.LabService;
import njgis.opengms.portal.service.UserService;
import njgis.opengms.portal.socket.WebSocketTest;
import njgis.opengms.portal.utils.IpUtil;
import njgis.opengms.portal.utils.ResultUtils;
import njgis.opengms.portal.utils.Utils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(value = "/user")
public class UserRestController {

    @Autowired
    UserService userService;

    @Autowired
    LabService labService;

    @Autowired
    DataItemService dataItemService;

    @Value("${htmlLoadPath}")
    private String htmlLoadPath;

    //远程数据容器地址
    @Value("${dataContainerIpAndPort}")
    String dataContainerIpAndPort;

    @Scheduled(cron = "0 0 9 ? MON *")  // 表示 在指定时间执行
    private void sendEmail() {

    }

    @RequestMapping(value = "/unsubscribe", method = RequestMethod.GET)
    public ModelAndView unsubscribe(@RequestParam("id") String id) {
        User user = userService.getById(id);
        userService.setSubscribe(user.getOid(), false);
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("notice/unsubscribe");
        return modelAndView;
    }

    @RequestMapping(value = "/setSubscribe", method = RequestMethod.POST)
    public JsonResult setSubscribe(@RequestParam("subscribe") Boolean subs, HttpServletRequest request) {
        HttpSession session = request.getSession();
        if (Utils.checkLoginStatus(session) == null) {
            return ResultUtils.error(-1, "no login");
        } else {
            userService.setSubscribe(session.getAttribute("oid").toString(), subs);
            return ResultUtils.success();

        }
    }

    @RequestMapping(value = "/add", method = RequestMethod.POST)
    public JsonResult addUser(UserAddDTO user) throws Exception {
        int code = userService.addUser(user);
        return ResultUtils.success(code);
    }

    @RequestMapping(value = "/register", method = RequestMethod.GET)
    public ModelAndView getRegister() {
        System.out.println("register");
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("register");
        modelAndView.addObject("name", "OpenGMS");

        return modelAndView;
    }

    @RequestMapping(value = "/login", method = RequestMethod.GET)
    public ModelAndView getLogin(HttpServletRequest request) {
        System.out.println("login");
        HttpSession session = request.getSession();
        ModelAndView modelAndView = new ModelAndView();
        if (session.getAttribute("uid") == null) {
            modelAndView.setViewName("login");
            modelAndView.addObject("notice", "After login, more functions will be unlocked.");

            Object preUrl_obj = session.getAttribute("preUrl");
            String preUrl = null;
            if (preUrl_obj != null) {
                preUrl = preUrl_obj.toString();
            }else {
                preUrl = request.getHeader("REFERER");
            }
            modelAndView.addObject("preUrl", preUrl);
            session.removeAttribute("preUrl");
        } else {
            modelAndView.setViewName("redirect:/user/userSpace");

        }

        return modelAndView;
    }

    @RequestMapping(value = "/in", method = RequestMethod.POST)
    public String login(@RequestParam(value = "account") String account,
                        @RequestParam(value = "password_md5") String password,
                        HttpServletRequest request) {

        System.out.println("in");
        String ip = IpUtil.getIpAddr(request);
        System.out.println(ip);
        JSONObject result = userService.validPassword(account, password, ip);
        if (result != null) {
            // 密码验证成功，将用户数据放入到Session中
            HttpSession session = request.getSession();
            //session.setMaxInactiveInterval(30*60);//设置session过期时间 为30分钟
            session.setAttribute("oid", result.get("oid"));
            session.setAttribute("uid", result.get("uid"));
            session.setAttribute("name", result.get("name"));

            WebSocketTest webSocketTest = new WebSocketTest(); //发送websocket信息
            webSocketTest.sendMessageToAll("user change");

            return "1";
        }

        return "0";
    }

    @RequestMapping(value = "/saveUserIcon", method = RequestMethod.POST)
    public JsonResult saveUserIcon(@RequestParam(value = "img") String img, HttpServletRequest request) {
        HttpSession session = request.getSession();

        if (session.getAttribute("uid") == null) {
            return ResultUtils.error(-1, "no login");
        } else {
            String userName = session.getAttribute("uid").toString();
            return ResultUtils.success(userService.saveUserIcon(img, userName));
        }
    }

    @RequestMapping(value = "/addTaskInfo", method = RequestMethod.POST)
    public JsonResult addTaskInfo(@RequestBody UserTaskInfo userTaskInfo, HttpServletRequest request) {
        HttpSession session = request.getSession();

        if (session.getAttribute("uid") == null) {
            return ResultUtils.error(-1, "no login");
        } else {
            String userName = session.getAttribute("uid").toString();
            return ResultUtils.success(userService.addTaskInfo(userName, userTaskInfo));
        }
    }

    @RequestMapping(value = "/out", method = RequestMethod.GET)
    public ModelAndView logout(HttpServletRequest request) {
        System.out.println("out");
        HttpSession session = request.getSession();
        session.removeAttribute("oid");
        session.removeAttribute("uid");
        session.removeAttribute("name");

        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("redirect:/home");

        return modelAndView;
    }

    @RequestMapping(value = "/load", method = RequestMethod.GET)
    public String loadUser(HttpServletRequest request) {
        System.out.println("loadUser");

        HttpSession session = request.getSession();
        Object oid = session.getAttribute("oid");

        JSONObject user = new JSONObject();

        if (oid == null) {
            user.put("oid", "");
            return user.toString();
        } else {

            user.put("oid", session.getAttribute("oid").toString());
            user.put("uid", session.getAttribute("uid").toString());
            user.put("name", session.getAttribute("name").toString());
            user.put("image", userService.getImage(session.getAttribute("oid").toString()));
            return user.toString();
        }
    }

    @RequestMapping(value = "/resetPassword", method = RequestMethod.POST)
    public JsonResult getUser(@RequestParam String email) {

        String result = userService.resetPassword(email);
        return ResultUtils.success(result);
    }

    @RequestMapping(value = "/changePassword", method = RequestMethod.POST)
    public JsonResult changePassword(@RequestParam String oldPass,
                                     @RequestParam String newPass,
                                     HttpServletRequest request) {
        HttpSession session = request.getSession();
        JSONObject jsonObject = new JSONObject();
        if (session.getAttribute("uid") == null) {
            return ResultUtils.error(-1, "no login");

        } else {

            String oid = session.getAttribute("oid").toString();
            int result = userService.changePass(oid, oldPass, newPass);
            session.removeAttribute("uid");
            session.removeAttribute("oid");
            session.removeAttribute("name");

            return ResultUtils.success(result);
        }
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    public ModelAndView getUserPage(@PathVariable("id") String id, HttpServletRequest req) {
        ModelAndView modelAndView = new ModelAndView();
        HttpSession session = req.getSession();

        User user = userService.getByOid(id);
//            Object object = ResultUtils.success(userService.getByOid(id)).getData();
        JSONObject userInfo = (JSONObject) JSONObject.toJSON(user);
        Object oid_obj = session.getAttribute("oid");
        if(oid_obj!=null) {
            String loginId = oid_obj.toString();
            userInfo.put("loginId", loginId);
        }else{
            userInfo.put("loginId", oid_obj);
        }
        modelAndView.setViewName("user_page_overview");
        modelAndView.addObject("userInfo", userInfo);

        modelAndView.addObject("loadPath", htmlLoadPath);
        JSONArray array = userInfo.getJSONArray("subjectAreas");
        String areas = "";
        if (array != null) {
            for (int i = 0; i < array.size(); i++) {
                areas += array.get(i);
                if (i != array.size() - 1) {
                    areas += ", ";
                }
            }
        }
        modelAndView.addObject("areas", areas);



        return modelAndView;
    }

    @RequestMapping(value = "/userSpace_old", method = RequestMethod.GET)
    public ModelAndView getUserSpace() {

        System.out.println("user_space");

        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("user_space");

        return modelAndView;
    }

    @LoginRequired
    @RequestMapping(value = "/userSpace", method = RequestMethod.GET)
    public ModelAndView getUserSpace1(HttpServletRequest request) {
        ModelAndView modelAndView = new ModelAndView();

        System.out.println("userSpace1");

        modelAndView.setViewName("userSpace1");

        return modelAndView;
    }

    @RequestMapping(value = "/getUserInfo", method = RequestMethod.GET)
    public JsonResult statistics(HttpServletRequest req) {
        HttpSession session = req.getSession();
        JSONObject jsonObject = new JSONObject();
        if (session.getAttribute("uid") == null) {
            jsonObject.put("result", "error");
            jsonObject.put("message", "please login");

            return ResultUtils.success(jsonObject);

        } else {

            String userId = session.getAttribute("uid").toString();
            JSONObject result = userService.getUserInfo(userId);
            System.out.println("/getUserInfo" + result);
            return ResultUtils.success(result);
        }
    }

    @RequestMapping(value = "/getUserInfoInUserPage", method = RequestMethod.GET)
    public JsonResult getUserInfoInUserPage(@RequestParam(value = "oid") String oid) {
        JSONObject result = userService.getUserInfoByOid(oid);
        System.out.println("/getUserInfoInUserPage" + result);
        return ResultUtils.success(result);

    }

    @RequestMapping(value = "/getUserTaskInfoa", method = RequestMethod.GET)
    public JsonResult getUserTaskInfoa(HttpServletRequest req) {
        HttpSession session = req.getSession();
        JSONObject jsonObject = new JSONObject();
        if (session.getAttribute("uid") == null) {
            jsonObject.put("result", "error");
            jsonObject.put("message", "please login");

            return ResultUtils.success(jsonObject);

        } else {

            String userId = session.getAttribute("uid").toString();
            JSONObject result = userService.getUserInfo(userId);
            return ResultUtils.success(result);
        }
    }

    @RequestMapping(value = "/getUser", method = RequestMethod.GET)
    public JsonResult getUser(HttpServletRequest req, @RequestParam String oid) {
        HttpSession session = req.getSession();
        JSONObject jsonObject = new JSONObject();
        String sessionOid = session.getAttribute("oid").toString();
        if (session.getAttribute("uid") == null || !sessionOid.equals(oid)) {
            jsonObject.put("result", "error");
            jsonObject.put("message", "please login");

            return ResultUtils.error(-1, "no login");

        } else {

            String userId = session.getAttribute("uid").toString();
            return ResultUtils.success(userService.getUser(userId));
        }
    }

    @RequestMapping(value = "/getLoginUser", method = RequestMethod.GET)
    public JsonResult getUser(HttpServletRequest req) {
        HttpSession session = req.getSession();
        JSONObject jsonObject = new JSONObject();
        String sessionOid = session.getAttribute("oid").toString();
        if (session.getAttribute("uid") == null) {
            jsonObject.put("result", "error");
            jsonObject.put("message", "please login");

            return ResultUtils.error(-1, "no login");

        } else {

            String userId = session.getAttribute("uid").toString();
            return ResultUtils.success(userService.getUser(userId));
        }
    }

    @RequestMapping(value = "/getUserByName", method = RequestMethod.GET)
    public JsonResult getUserByName(@RequestParam String userId) {
        return ResultUtils.success(userService.getUser(userId));
    }

    @RequestMapping(value = "/update", method = RequestMethod.POST)
    public JsonResult updateUser(HttpServletRequest req, @RequestBody UserUpdateDTO userUpdateDTO) {
        HttpSession session = req.getSession();
        JSONObject jsonObject = new JSONObject();
        String sessionOid = session.getAttribute("oid").toString();
        if (session.getAttribute("uid") == null || !sessionOid.equals(userUpdateDTO.getOid())) {
            jsonObject.put("result", "error");
            jsonObject.put("message", "please login");

            return ResultUtils.success(jsonObject);

        } else {

            String userId = session.getAttribute("uid").toString();
            int result = userService.updateUser(userUpdateDTO);
            req.setAttribute("name", userUpdateDTO.getName());
            return ResultUtils.success();
        }


    }

    @RequestMapping(value = "/createModelItemSingle", method = RequestMethod.GET)
    public ModelAndView createModelItemSingle() {

        System.out.println("create-modelitem-single");

        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("create-modelitem-single");

        return modelAndView;
    }

    //get data items table
    @RequestMapping(value = "/getDataItems", method = RequestMethod.GET)
    JsonResult getUserUploadData(@RequestParam(value = "userOid", required = false) String userOid,
                                 @RequestParam(value = "page", required = false) Integer page,
                                 @RequestParam(value = "pagesize", required = false) Integer pagesize,
                                 @RequestParam(value = "asc", required = false) Integer asc
    ) {
        return ResultUtils.success(dataItemService.getUsersUploadData(userOid, page - 1, pagesize, asc));
    }
    //get oid

    @RequestMapping(value = "/updateUserIntro", method = RequestMethod.POST)
    JsonResult updateUserDescription(@RequestBody UserIntroDTO userIntroDTO, HttpServletRequest httpServletRequest) {
        String description = userIntroDTO.getDescription();
        List<String> researchInterests = userIntroDTO.getResearchInterests();
        List<String> subjectAreas = userIntroDTO.getSubjectAreas();
        HttpSession httpSession = httpServletRequest.getSession();


        if (httpSession.getAttribute("uid") == null) {
            return ResultUtils.error(-1, "no login");
        }
        String userName = httpSession.getAttribute("uid").toString();
        String result1 = userService.updateDescription(description, userName);
        String result2 = userService.updateResearchInterest(researchInterests, userName);
        String result3 = userService.updateSubjectAreas(subjectAreas, userName);

        JSONObject result = new JSONObject();
        result.put("des", result1);
        result.put("res", result2);
        result.put("sub", result3);
        return ResultUtils.success(result);
    }

    @RequestMapping(value = "/updateDescription", method = RequestMethod.POST)
    JsonResult updateUserDescription(@RequestBody DescriptionDTO descriptionDTO, HttpServletRequest httpServletRequest) {
        System.out.println("/updateDescription" + descriptionDTO);
        String description = descriptionDTO.getDescription();
        HttpSession httpSession = httpServletRequest.getSession();

        if (httpSession.getAttribute("uid") == null) {
            return ResultUtils.error(-1, "no login");
        }
        String userName = httpSession.getAttribute("uid").toString();
        String result = userService.updateDescription(description, userName);

        return ResultUtils.success(result);
    }

    @RequestMapping(value = "/updateResearchInterest", method = RequestMethod.POST)
    JsonResult updateUserResearchInterest(@RequestBody ResearchInterestDTO researchInterestDTO, HttpServletRequest httpServletRequest) {
        System.out.println(researchInterestDTO);
        System.out.println("/updateResearchInterest");
        List<String> researchInterests = researchInterestDTO.getResearchInterests();
        HttpSession httpSession = httpServletRequest.getSession();

        if (httpSession.getAttribute("uid") == null) {
            return ResultUtils.error(-1, "no login");
        }
        String userName = httpSession.getAttribute("uid").toString();
        String result = userService.updateResearchInterest(researchInterests, userName);

        return ResultUtils.success(result);
    }

    @RequestMapping(value = "/updateAffiliation", method = RequestMethod.POST)
    JsonResult updateUserAffiliation(@RequestBody AffiliationDTO affiliationDTO, HttpServletRequest httpServletRequest) {
        System.out.println("/updateAffiliation" + affiliationDTO);
        HttpSession httpSession = httpServletRequest.getSession();

        if (httpSession.getAttribute("uid") == null) {
            return ResultUtils.error(-1, "no login");
        }
        String userName = httpSession.getAttribute("uid").toString();
        String result = userService.updateAffiliation(affiliationDTO, userName);

        return ResultUtils.success(result);
    }

    @RequestMapping(value = "/updateLab", method = RequestMethod.POST)
    JsonResult updateUserLab(@RequestBody UserLabDTO labDTO, HttpServletRequest httpServletRequest) {
        System.out.println("/updateLab" + labDTO);
        HttpSession httpSession = httpServletRequest.getSession();

        if (httpSession.getAttribute("uid") == null) {
            return ResultUtils.error(-1, "no login");
        }
        String userName = httpSession.getAttribute("uid").toString();
        JSONObject labResult = labService.updateByLabName(labDTO, userName);
        String result = userService.updateLab(labDTO, userName);
        System.out.println("labResult" + labResult);

        return ResultUtils.success(result);
    }

    @RequestMapping(value = "/updateSubjectAreas", method = RequestMethod.POST)
    JsonResult updateUserSubjectAreas(@RequestBody SubjectAreasDTO subjectAreasDTO, HttpServletRequest httpServletRequest) {
        System.out.println(subjectAreasDTO);
        System.out.println("/updateSubjectAreas");
        List<String> subjectAreas = subjectAreasDTO.getSubjectAreas();
        HttpSession httpSession = httpServletRequest.getSession();

        if (httpSession.getAttribute("uid") == null) {
            return ResultUtils.error(-1, "no login");
        }
        String userName = httpSession.getAttribute("uid").toString();
        String result = userService.updateSubjectAreas(subjectAreas, userName);

        return ResultUtils.success(result);
    }

    @RequestMapping(value = "/updateEduExperience", method = RequestMethod.POST)
    JsonResult updateUserEduExperience(@RequestBody EducationExperienceDTO educationExperienceDTO, HttpServletRequest httpServletRequest) {
        System.out.println("/updateEduEx" + educationExperienceDTO);
        HttpSession httpSession = httpServletRequest.getSession();

        if (httpSession.getAttribute("uid") == null) {
            return ResultUtils.error(-1, "no login");
        }
        String userName = httpSession.getAttribute("uid").toString();
        String result = userService.updateEduExperience(educationExperienceDTO, userName);

        return ResultUtils.success(result);
    }

    @RequestMapping(value = "/updateAwdHonor", method = RequestMethod.POST)
    JsonResult updateUserAwdHonor(@RequestBody AwdHonorDTO awdHonorDTO, HttpServletRequest httpServletRequest) {
        System.out.println("/updateEduEx" + awdHonorDTO);
        HttpSession httpSession = httpServletRequest.getSession();
        if (httpSession.getAttribute("uid") == null) {
            return ResultUtils.error(-1, "no login");
        }
        String userName = httpSession.getAttribute("uid").toString();
        String result = userService.updateAwdHonor(awdHonorDTO, userName);

        return ResultUtils.success(result);
    }

    @RequestMapping(value = "/updateContact", method = RequestMethod.POST)
    JsonResult updateContact(@RequestBody ContactDTO contactDTO, HttpServletRequest httpServletRequest) {
        System.out.println("/updatecontact" + contactDTO);
        HttpSession httpSession = httpServletRequest.getSession();

        if (httpSession.getAttribute("uid") == null) {
            return ResultUtils.error(-1, "no login");
        }
        String userName = httpSession.getAttribute("uid").toString();
        String result = userService.updateContact(contactDTO, userName);

        return ResultUtils.success(result);
    }

    @RequestMapping(value = "/getFolder", method = RequestMethod.GET)
    JsonResult getFolder(HttpServletRequest httpServletRequest) {

        HttpSession httpSession = httpServletRequest.getSession();
        Object object = httpSession.getAttribute("uid");
        if (object == null) {
            return ResultUtils.error(-1, "no login");
        }
        String userName = object.toString();
        JSONArray result = userService.getFolder(userName);

        return ResultUtils.success(result);
    }

    @RequestMapping(value = "/getFolderAndFile", method = RequestMethod.GET)
    JsonResult getFolder7File(HttpServletRequest httpServletRequest) {

        HttpSession httpSession = httpServletRequest.getSession();
        Object object = httpSession.getAttribute("uid");
        if (object == null) {
            return ResultUtils.error(-1, "no login");
        }
        String userName = object.toString();
        JSONArray result = userService.getFolder7File(userName);
        System.out.println(result);

        return ResultUtils.success(result);
    }

    @RequestMapping(value = "/getFileByPath", method = RequestMethod.GET)
    JsonResult getFileByPath(@RequestParam(value = "paths[]") List<String> paths, HttpServletRequest httpServletRequest) {

        HttpSession httpSession = httpServletRequest.getSession();
        Object object = httpSession.getAttribute("uid");
        if (object == null) {
            return ResultUtils.error(-1, "no login");
        }
        String userName = object.toString();
        JSONObject result = userService.getFileByPath(paths, userName);

        return ResultUtils.success(result);
    }

    @RequestMapping(value = "/addFolder", method = RequestMethod.POST)
    JsonResult addFolder(@RequestParam("paths[]") List<String> paths,
                         @RequestParam("name") String name,
                         HttpServletRequest httpServletRequest) {

        System.out.println(paths);
        HttpSession httpSession = httpServletRequest.getSession();
        String userName = Utils.checkLoginStatus(httpSession);
        if (userName == null) {
            return ResultUtils.error(-1, "no login");
        }
        String result = userService.addFolder(paths, name, userName);

        return ResultUtils.success(result);
    }

    @RequestMapping(value = "/addFile", method = RequestMethod.POST)
    JsonResult addFile(
            @RequestBody UploadUserFileDTO uploadUserFileDTO
            , HttpServletRequest httpServletRequest) {

        System.out.print(uploadUserFileDTO.getFiles());
        System.out.print(uploadUserFileDTO.getPaths());
        List<Map> fileArray = uploadUserFileDTO.getFiles();
        List<String> paths = uploadUserFileDTO.getPaths();

        HttpSession httpSession = httpServletRequest.getSession();
        String userName = Utils.checkLoginStatus(httpSession);
        if (userName == null) {
            return ResultUtils.error(-1, "no login");
        }


//        String[] a=files.split("\\.");
//        String name=a[0];
//        String suffix=a[1];

        JSONArray result = userService.addFiles(paths, fileArray, userName);
//        System.out.println(result);
        return ResultUtils.success(result);
    }

    @RequestMapping(value = "/updateFile", method = RequestMethod.POST)
    JsonResult updateFile(@RequestParam("dataName") String name,
                          @RequestParam("dataId") String dataId,

                          HttpServletRequest httpServletRequest) {

        HttpSession httpSession = httpServletRequest.getSession();
        String userName = Utils.checkLoginStatus(httpSession);
        if (userName == null) {
            return ResultUtils.error(-1, "no login");
        }
        String result = userService.updateFile(dataId, name, userName);

        return ResultUtils.success(result);
    }

    @RequestMapping(value = "/deleteFile", method = RequestMethod.POST)
    JsonResult deleteFile(@RequestParam("dataId") String dataId,
                          HttpServletRequest httpServletRequest) {

        HttpSession httpSession = httpServletRequest.getSession();
        String userName = Utils.checkLoginStatus(httpSession);
        if (userName == null) {
            return ResultUtils.error(-1, "no login");
        }
        String result = userService.deleteFile(dataId, userName);

        return ResultUtils.success(result);
    }

    @RequestMapping(value = "/deleteSomeFiles", method = RequestMethod.POST)
    JsonResult deleteFiles(@RequestBody JSONObject deleteFiles,
                           HttpServletRequest httpServletRequest) {

        JSONArray jsonArray = deleteFiles.getJSONArray("deleteTarget");
        List<FileMeta> deleteFileList = jsonArray.toJavaList(FileMeta.class);
        HttpSession httpSession = httpServletRequest.getSession();
        String userName = Utils.checkLoginStatus(httpSession);
        if (userName == null) {
            return ResultUtils.error(-1, "no login");
        }
        List<String> result = userService.deleteFiles(deleteFileList, userName);

        return ResultUtils.success(result);
    }

    @RequestMapping(value = "/keywordsSearch", method = RequestMethod.GET)
    JsonResult searchFile(@RequestParam(value = "keyword") String keyword, HttpServletRequest request) {
        HttpSession session = request.getSession();
        String userName = session.getAttribute("uid").toString();
        if (userName == null)
            return ResultUtils.error(-1, "no login");
        else
            return ResultUtils.success(userService.searchFile(keyword, userName));
    }

    @RequestMapping(value = "/forkData", method = RequestMethod.POST)
    JsonResult forkData(@RequestParam("paths[]") List<String> paths,
                        @RequestParam("dataIds[]") List<String> dataIds,
                        @RequestParam("itemId") String dataItemId,
                        HttpServletRequest httpServletRequest) {

        System.out.println(paths);
        System.out.println(dataIds);
        System.out.println(dataItemId);
        HttpSession httpSession = httpServletRequest.getSession();

        if (httpSession.getAttribute("uid") == null) {
            return ResultUtils.error(-1, "no login");
        }

        if (paths.get(0).equals("root")) {
            paths.remove(0);
        }
        String userName = httpSession.getAttribute("uid").toString();
        String result = userService.forkData(paths, dataIds, dataItemId, userName);

        return ResultUtils.success();

    }


}
