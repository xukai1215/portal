package njgis.opengms.portal.controller.rest;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import njgis.opengms.portal.bean.JsonResult;
import njgis.opengms.portal.dao.ModelContainerDao;
import njgis.opengms.portal.entity.ModelContainer;
import njgis.opengms.portal.service.UserService;
import njgis.opengms.portal.utils.IpUtil;
import njgis.opengms.portal.utils.ResultUtils;
import njgis.opengms.portal.utils.Utils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping(value="/server")
public class ServerRestController {
    @Autowired
    ModelContainerDao modelContainerDao;

    @Autowired
    UserService userService;

    @Value("${dataServerManager}")
    private String managerServerIpAndPort;


    @RequestMapping(value="",method= RequestMethod.GET)
    ModelAndView serverIndex(){
        ModelAndView modelAndView=new ModelAndView();
        modelAndView.setViewName("Server");

        return modelAndView;
    }

    @RequestMapping(value="/serverNodes",method = RequestMethod.GET)
    JsonResult getServerNodes(){
        List<ModelContainer> modelContainerList=modelContainerDao.findAll();
        JSONArray jsonArray=new JSONArray();
        for(int i=0;i<modelContainerList.size();i++){
            ModelContainer modelContainer=modelContainerList.get(i);
            JSONObject object=new JSONObject();
            object.put("geoJson",modelContainer.getGeoInfo());
            jsonArray.add(object);
        }
        return ResultUtils.success(jsonArray);
    }

    //模型容器
    //注册
    @RequestMapping(value = "/modelContainer/add", method = RequestMethod.POST)
    JsonResult add(@RequestParam("account") String userName,
                   @RequestParam("mac") String mac,
                   @RequestParam("servername") String serverName,
                   @RequestParam("servicelist") String serviceList,
                   HttpServletRequest request) {
        //查询此台容器是否已经注册
        ModelContainer modelContainer = modelContainerDao.findByMac(mac);
        if(modelContainer == null){ //未注册

            modelContainer = new ModelContainer();
            modelContainer.setRegisterDate(new Date());

        }else{//已经注册，更新信息
            modelContainer.setUpdateDate(new Date());
        }

        modelContainer.setAccount(userName);
        modelContainer.setMac(mac);
        modelContainer.setServerName(serverName);
        modelContainer.setServiceList(JSONArray.parseArray(serviceList));
        modelContainer.setIp(IpUtil.getIpAddr(request));

        try {
            modelContainer.setGeoInfo(Utils.getGeoInfoMeta(modelContainer.getIp()));
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }
        modelContainerDao.save(modelContainer);

        return ResultUtils.success();

    }
    //删除
    @RequestMapping(value = "/modelContainer/remove", method = RequestMethod.POST)
    JsonResult remove(@RequestParam("account") String userName,
                      @RequestParam("mac") String mac) {

        ModelContainer modelContainer = modelContainerDao.findFirstByAccountAndMac(userName, mac);
        if (modelContainer == null) {
            return ResultUtils.error(-1, "No model container matches this userName and mac!");
        } else {
            modelContainerDao.delete(modelContainer);
            return ResultUtils.success("Delete suc!");
        }

    }
    //设置别名
    @RequestMapping(value = "/modelContainer/setAlias", method = RequestMethod.POST)
    JsonResult setAlias(@RequestParam("alias") String alias,
                      @RequestParam("mac") String mac) {

        ModelContainer modelContainer = modelContainerDao.findByMac(mac);
        modelContainer.setAlias(alias);
        modelContainerDao.save(modelContainer);
        return ResultUtils.success(alias);

    }
    //获取服务列表
    @RequestMapping(value = "/modelContainer/getServiceList", method = RequestMethod.POST)
    JsonResult getServiceList(@RequestParam("mac") String mac) {

        ModelContainer modelContainer = modelContainerDao.findByMac(mac);
        return ResultUtils.success(modelContainer.getServiceList());

    }

    //获取所有模型容器
    @RequestMapping(value="/modelContainer/all",method=RequestMethod.GET)
    JsonResult getModelContainerAll(){
        return ResultUtils.success(modelContainerDao.findAll());
    }

    //获取用户所有模型容器
    @RequestMapping(value="/modelContainer/getModelContainerByUserName",method=RequestMethod.GET)
    JsonResult getModelContainerByUserName(HttpServletRequest request){
        HttpSession session=request.getSession();
        if(session.getAttribute("uid")==null){
            return ResultUtils.error(-1,"no login");
        }
        String userName=session.getAttribute("uid").toString();
        return ResultUtils.success(modelContainerDao.findAllByAccount(userName));
    }

    //获取所有模型\数据容器
    @RequestMapping(value="/all",method=RequestMethod.GET)
    JsonResult getAll(){
        return ResultUtils.success(modelContainerDao.findAll());
    }

}
