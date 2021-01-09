package njgis.opengms.portal.controller.rest;

import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping(value = "/modelContainer")
public class ModelContainerRestController {

//    @Autowired
//    ModelContainerDao modelContainerDao;
//
//    @Value("${managerServerIpAndPort}")
//    private String managerServerIpAndPort;
//
//    @RequestMapping(value = "/add", method = RequestMethod.POST)
//    JsonResult add(@RequestBody ModelContainerDTO modelContainerDTO) {
//
//        ModelContainer modelContainer = modelContainerDao.findFirstByUserAndMac(modelContainerDTO.getUser(), modelContainerDTO.getMac());
//
//        if (modelContainer == null) {
//            ModelContainer modelContainer_add = new ModelContainer();
//            BeanUtils.copyProperties(modelContainerDTO, modelContainer_add);
//            Date now=new Date();
//            modelContainer_add.setDate(now);
//            modelContainer_add.setUpdateDate(now);
//            modelContainer_add.setStatus(true);
//            try {
//                modelContainer_add.setGeoInfo(Utils.getGeoInfoMeta(modelContainerDTO.getIp()));
//            } catch (Exception e) {
//                throw new RuntimeException(e.getMessage());
//            }
//
//            modelContainerDao.insert(modelContainer_add);
//
//            return ResultUtils.success("Insert suc!");
//        } else {
//            modelContainer.setHardware(modelContainerDTO.getHardware());
//            modelContainer.setSoftware(modelContainerDTO.getSoftware());
//            modelContainer.setIp(modelContainerDTO.getIp());
//            Date now=new Date();
//            modelContainer.setUpdateDate(now);
//            modelContainer.setStatus(true);
//            try {
//                modelContainer.setGeoInfo(Utils.getGeoInfoMeta(modelContainerDTO.getIp()));
//            } catch (Exception e) {
//                throw new RuntimeException(e.getMessage());
//            }
//            modelContainerDao.save(modelContainer);
//
//            JsonResult jsonResult = ResultUtils.success("Update suc!");
//            jsonResult.setCode(1);
//            return jsonResult;
//        }
//    }
//
//    @RequestMapping(value = "/remove", method = RequestMethod.POST)
//    JsonResult remove(@RequestParam("user") String userName,
//                      @RequestParam("mac") String mac) {
//
//        ModelContainer modelContainer = modelContainerDao.findFirstByUserAndMac(userName, mac);
//        if (modelContainer == null) {
//            return ResultUtils.error(-1, "No model container matches this userName and mac!");
//        } else {
//            modelContainerDao.delete(modelContainer);
//            return ResultUtils.success("Delete suc!");
//        }
//
//
//    }
//
//    @RequestMapping(value="/all",method=RequestMethod.GET)
//    JsonResult getAll(){
//        return ResultUtils.success(modelContainerDao.findAll());
//    }
//
//    @RequestMapping(value="/getModelContainerByUserName",method=RequestMethod.GET)
//    JsonResult getModelContainerByUserName(HttpServletRequest request){
//        HttpSession session=request.getSession();
//        if(session.getAttribute("uid")==null){
//            return ResultUtils.error(-1,"no login");
//        }
//        String userName=session.getAttribute("uid").toString();
//        return ResultUtils.success(modelContainerDao.findAllByUser(userName));
//    }
//
//
//    @RequestMapping(value = "/updateStatus", method = RequestMethod.POST)
//    JsonResult updateModelContainerStatus(@RequestParam("user") String userName,
//                                          @RequestParam("mac") String mac,
//                                          @RequestParam("status") boolean status){
//        ModelContainer modelContainer = modelContainerDao.findFirstByUserAndMac(userName, mac);
//        if(modelContainer == null) {
//            return ResultUtils.error(-1, "No model container matches this userName and mac!");
//        }else {
//            //更新状态
//            modelContainer.setStatus(status);
//            modelContainerDao.save(modelContainer);
//            JsonResult jsonResult = ResultUtils.success("Update suc!");
//            jsonResult.setCode(1);
//            return jsonResult;
//        }
//    }
}
