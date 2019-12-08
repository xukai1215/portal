package njgis.opengms.portal.controller.rest;

import com.alibaba.fastjson.JSONObject;
import njgis.opengms.portal.bean.JsonResult;
import njgis.opengms.portal.dao.ModelContainerDao;
import njgis.opengms.portal.dto.ModelContainerDTO;
import njgis.opengms.portal.entity.ModelContainer;
import njgis.opengms.portal.entity.support.GeoInfoMeta;
import njgis.opengms.portal.utils.MyHttpUtils;
import njgis.opengms.portal.utils.ResultUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "/modelContainer")
public class ModelContainerRestController {

    @Autowired
    ModelContainerDao modelContainerDao;

    @Value("${managerServerIpAndPort}")
    private String managerServerIpAndPort;

    @RequestMapping(value = "/push", method = RequestMethod.POST)
    JsonResult add(@RequestBody ModelContainerDTO modelContainerDTO) {

        ModelContainer modelContainer = modelContainerDao.findFirstByUserAndMac(modelContainerDTO.getUser(), modelContainerDTO.getMac());

        if (modelContainer == null) {
            ModelContainer modelContainer_add = new ModelContainer();
            BeanUtils.copyProperties(modelContainerDTO, modelContainer_add);
            try {
                modelContainer_add.setGeoInfo(getGeoInfoMeta(modelContainerDTO.getIp()));
            } catch (Exception e) {
                throw new RuntimeException(e.getMessage());
            }
            modelContainerDao.insert(modelContainer_add);

            return ResultUtils.success("Insert suc!");
        } else {
            modelContainer.setHardware(modelContainerDTO.getHardware());
            modelContainer.setSoftware(modelContainerDTO.getSoftware());
            modelContainer.setIp(modelContainerDTO.getIp());
            try {
                modelContainer.setGeoInfo(getGeoInfoMeta(modelContainerDTO.getIp()));
            } catch (Exception e) {
                throw new RuntimeException(e.getMessage());
            }
            modelContainerDao.save(modelContainer);

            JsonResult jsonResult = ResultUtils.success("Update suc!");
            jsonResult.setCode(1);
            return jsonResult;
        }
    }

    @RequestMapping(value = "/remove", method = RequestMethod.POST)
    JsonResult remove(@RequestParam("user") String userName,
                      @RequestParam("mac") String mac) {

        ModelContainer modelContainer = modelContainerDao.findFirstByUserAndMac(userName, mac);
        if (modelContainer == null) {
            return ResultUtils.error(-1, "No model container matches this userName and mac!");
        } else {
            modelContainerDao.delete(modelContainer);
            return ResultUtils.success("Delete suc!");
        }


    }

    @RequestMapping(value="/all",method=RequestMethod.GET)
    JsonResult getAll(){
        return ResultUtils.success(modelContainerDao.findAll());
    }

//    @RequestMapping(value = "/register/{ip}", method = RequestMethod.POST)
//    JsonResult register(@PathVariable("ip") String ip, HttpServletRequest request) {
//        HttpSession session = request.getSession();
//        if(session.getAttribute("uid") == null){
//            return ResultUtils.error(-1, "no login");
//        }else {
//            String userName = request.getSession().getAttribute("uid").toString();
//
//            RestTemplate restTemplate = new RestTemplate();
//            String result = restTemplate.getForObject("http://" + ip + ":8060/settings", String.class);
//            JSONObject obj=JSONObject.parseObject(result);
//            if (obj.getString("result").equals("suc")) {
//                JSONObject registerResult = JSONObject.parseObject(restTemplate.getForObject("http://" + ip + ":8060/task/register?type=2", String.class));
//                if (registerResult.getInteger("code") == 1) {
//                    JSONObject statusResult = JSONObject.parseObject(restTemplate.getForObject("http://" + ip + ":8060/json/status", String.class));
//                    ModelContainer modelContainer = new ModelContainer();
//                    modelContainer.setOid(UUID.randomUUID().toString());
//                    modelContainer.setIp(ip);
//                    modelContainer.setName(statusResult.getString("hostname"));
//                    modelContainer.setOwner(userName);
//                    try {
//                        modelContainer.setGeoInfo(getGeoInfoMeta(ip));
//                    }catch (Exception e){
//                        throw new RuntimeException(e.getMessage());
//                    }
//
//                    modelContainerDao.save(modelContainer);
//
//                    return ResultUtils.success();
//
//                } else {
//                    return ResultUtils.error(-3, registerResult.getString("message"));
//                }
//            } else {
//                return ResultUtils.error(-2, "Model Container is not running!");
//            }
//        }
//
//    }

//    @RequestMapping(value = "/unregister/{ip}", method = RequestMethod.POST)
//    JsonResult unregister(@PathVariable("ip") String ip, HttpServletRequest request) {
//        HttpSession session = request.getSession();
//        if(session.getAttribute("uid") == null){
//            return ResultUtils.error(-1, "no login");
//        }else {
//            String userName = request.getSession().getAttribute("uid").toString();
//
//            RestTemplate restTemplate = new RestTemplate();
//            JSONObject result = JSONObject.parseObject(restTemplate.getForObject("http://" + ip + ":8060/task/unregister", String.class));
//
//            if(result.getInteger("code")==1){
//                return ResultUtils.success(result.getString("message"));
//            }
//            else{
//                return ResultUtils.error(-1,result.getString("message"));
//            }
//
//        }
//
//    }

    private GeoInfoMeta getGeoInfoMeta(String host) throws Exception {
        String url = "http://ip-api.com/json/" + host;
        String result = MyHttpUtils.GET(url, "UTF-8", null);
        GeoInfoMeta geoInfoMeat = new GeoInfoMeta();
        JSONObject res = JSONObject.parseObject(result);
        //judge
        if (res.getString("status").equals("fail")) {
            //后面移除该部分，说明该要注册的任务服务器不是公网服务器，直接抛出错误
            geoInfoMeat.setCity("Nanjing");
            geoInfoMeat.setRegion("Jiangsu");
            geoInfoMeat.setCountryCode("CN");
            geoInfoMeat.setCountryName("China");
            geoInfoMeat.setLatitude("32.0617");
            geoInfoMeat.setLongitude("118.7778");
        } else {
            geoInfoMeat.setCity(res.getString("city").replace(" ", "_"));
            geoInfoMeat.setRegion(res.getString("region"));
            geoInfoMeat.setCountryCode(res.getString("countryCode"));
            geoInfoMeat.setCountryName(res.getString("country"));
            geoInfoMeat.setLatitude(res.getString("lat"));
            geoInfoMeat.setLongitude(res.getString("lon"));
        }
        return geoInfoMeat;
    }


}
