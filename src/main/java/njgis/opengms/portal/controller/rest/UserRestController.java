package njgis.opengms.portal.controller.rest;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import njgis.opengms.portal.bean.JsonResult;
import njgis.opengms.portal.dto.UserAddDTO;
import njgis.opengms.portal.dto.UserUpdateDTO;
import njgis.opengms.portal.service.DataItemService;
import njgis.opengms.portal.service.UserService;
import njgis.opengms.portal.utils.ResultUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;
import springfox.documentation.spring.web.json.Json;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Random;

@RestController
@RequestMapping (value = "/user")
public class UserRestController {

    @Autowired
    UserService userService;

    @Autowired
    DataItemService dataItemService;

    @ResponseBody
    @RequestMapping(value = "/add",method = RequestMethod.POST)
    public JsonResult addUser(UserAddDTO user) throws Exception {
        int code=userService.addUser(user);
        return ResultUtils.success(code);
    }

    @RequestMapping(value = "/register", method = RequestMethod.GET)
    public ModelAndView getRegister() {
        System.out.println("register");
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("register");
        modelAndView.addObject("name","OpenGMS");

        return modelAndView;
    }

    @RequestMapping(value = "/login", method = RequestMethod.GET)
    public ModelAndView getLogin() {
        System.out.println("login");
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("login");
        modelAndView.addObject("name","OpenGMS");

        return modelAndView;
    }

    @RequestMapping(value = "/in", method = RequestMethod.POST)
    public String login(@RequestParam(value="account") String account,
                        @RequestParam(value="password") String password,
                        HttpServletRequest request) {

        System.out.println("in");
        JSONObject result=userService.validPassword(account,password);
        if(result!=null){
            // 密码验证成功，将用户数据放入到Session中
            HttpSession session=request.getSession();
            //session.setMaxInactiveInterval(30*60);//设置session过期时间 为30分钟
            session.setAttribute("oid", result.get("oid"));
            session.setAttribute("uid", result.get("uid"));
            session.setAttribute("name",result.get("name"));
            return "1";
        }

        return "0";
    }




    @RequestMapping(value = "/out", method = RequestMethod.GET)
    public ModelAndView logout(HttpServletRequest request) {
        System.out.println("out");
        HttpSession session=request.getSession();
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

        HttpSession session=request.getSession();
        Object oid=session.getAttribute("oid");

        JSONObject user = new JSONObject();

        if(oid==null){
            user.put("oid","");
            return user.toString();
        }
        else{

            user.put("oid",session.getAttribute("oid").toString());
            user.put("name",session.getAttribute("name").toString());
            user.put("image",userService.getImage(session.getAttribute("oid").toString()));
            return user.toString();
        }
    }

    @RequestMapping(value = "/resetPassword", method = RequestMethod.POST)
    public JsonResult getUser(@RequestParam String email) {

        String result=userService.resetPassword(email);
        return ResultUtils.success(result);
    }

    @RequestMapping(value = "/changePassword", method = RequestMethod.POST)
    public JsonResult changePassword(@RequestParam String oldPass,
                                     @RequestParam String newPass,
                                     HttpServletRequest request) {
        HttpSession session=request.getSession();
        JSONObject jsonObject=new JSONObject();
        if(session.getAttribute("uid")==null){
            return ResultUtils.error(-1,"no login");

        }else{

            String oid = session.getAttribute("oid").toString();
            int result = userService.changePass(oid,oldPass,newPass);
            session.removeAttribute("uid");
            session.removeAttribute("oid");
            session.removeAttribute("name");

            return ResultUtils.success(result);
        }
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    public ModelAndView getUserPage(@PathVariable("id") String id,HttpServletRequest req) {
        ModelAndView modelAndView = new ModelAndView();
        HttpSession session = req.getSession();
        if(session.getAttribute("uid")==null){
            modelAndView.setViewName("login");
            modelAndView.addObject("notice","You need to log in first to view another user's page.");
        }else {

            Object object = ResultUtils.success(userService.getByOid(id)).getData();
            JSONObject userInfo = (JSONObject) JSONObject.toJSON(object);

            System.out.println("user_page");

            modelAndView.setViewName("user_page");
            modelAndView.addObject("userInfo", userInfo);
            JSONArray array=userInfo.getJSONArray("subjectAreas");
            String areas="";
            if(array!=null) {
                for (int i = 0; i < array.size(); i++) {
                    areas += array.get(i);
                    if (i != array.size() - 1) {
                        areas += ", ";
                    }
                }
            }
            modelAndView.addObject("areas",areas);
        }

        return modelAndView;
    }

    @RequestMapping(value = "/userSpace", method = RequestMethod.GET)
    public ModelAndView getUserSpace() {

        System.out.println("user_space");

        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("user_space");

        return modelAndView;
    }

    @RequestMapping(value = "/getUserInfo", method = RequestMethod.GET)
    public JsonResult statistics(HttpServletRequest req) {
        HttpSession session = req.getSession();
        JSONObject jsonObject = new JSONObject();
        if(session.getAttribute("uid")==null){
            jsonObject.put("result","error");
            jsonObject.put("message","please login");

            return ResultUtils.success(jsonObject);

        }else{

            String userId = session.getAttribute("uid").toString();
            JSONObject result = userService.getUserInfo(userId);
            return ResultUtils.success(result);
        }
    }

    @RequestMapping(value = "/getUser", method = RequestMethod.GET)
    public JsonResult getUser(HttpServletRequest req,@RequestParam String oid) {
        HttpSession session = req.getSession();
        JSONObject jsonObject = new JSONObject();
        String sessionOid=session.getAttribute("oid").toString();
        if(session.getAttribute("uid")==null||!sessionOid.equals(oid)){
            jsonObject.put("result","error");
            jsonObject.put("message","please login");

            return ResultUtils.error(-1,"no login");

        }else{

            String userId = session.getAttribute("uid").toString();
            return ResultUtils.success(userService.getUser(userId));
        }
    }

    @RequestMapping(value = "/update", method = RequestMethod.POST)
    public JsonResult updateUser(HttpServletRequest req,@RequestBody UserUpdateDTO userUpdateDTO){
        HttpSession session = req.getSession();
        JSONObject jsonObject = new JSONObject();
        String sessionOid=session.getAttribute("oid").toString();
        if(session.getAttribute("uid")==null||!sessionOid.equals(userUpdateDTO.getOid())){
            jsonObject.put("result","error");
            jsonObject.put("message","please login");

            return ResultUtils.success(jsonObject);

        }else{

            String userId = session.getAttribute("uid").toString();
            int result=userService.updateUser(userUpdateDTO);
            req.setAttribute("name",userUpdateDTO.getName());
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

    @RequestMapping(value = "/createModelItem", method = RequestMethod.GET)
    public ModelAndView createModelItem() {

        System.out.println("create-modelitem");

        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("create-modelitem");

        return modelAndView;
    }

    @RequestMapping(value = "/createConceptualModel", method = RequestMethod.GET)
    public ModelAndView createConceptualModel() {

        System.out.println("create-conceptual-model");

        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("create-conceptual-model");

        return modelAndView;
    }

    @RequestMapping(value = "/createLogicalModel", method = RequestMethod.GET)
    public ModelAndView createLogicalModel() {

        System.out.println("create-logical-model");

        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("create-logical-model");

        return modelAndView;
    }

    @RequestMapping(value = "/createComputableModel", method = RequestMethod.GET)
    public ModelAndView createComputableModel() {

        System.out.println("create-computable-model");

        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("create-computable-model");

        return modelAndView;
    }


    //get data items table
    @RequestMapping(value = "/getDataItems",method = RequestMethod.GET)
    JsonResult getUserUploadData(@RequestParam (value = "username", required = false) String name,
                       @RequestParam (value = "page", required = false) Integer page,
                       @RequestParam (value = "pagesize", required = false) Integer pagesize,
                       @RequestParam (value = "asc", required = false) Integer asc
                       ){
        return ResultUtils.success(dataItemService.getUsersUploadData(name,page-1,pagesize,asc));
    }
    //转  发





}
