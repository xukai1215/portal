package njgis.opengms.portal.controller.rest;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import njgis.opengms.portal.bean.JsonResult;
import njgis.opengms.portal.dao.ModelItemDao;
import njgis.opengms.portal.dao.ModelItemVersionDao;
import njgis.opengms.portal.dto.version.VersionDTO;
import njgis.opengms.portal.entity.ModelItem;
import njgis.opengms.portal.entity.ModelItemVersion;
import njgis.opengms.portal.entity.User;
import njgis.opengms.portal.service.UserService;
import njgis.opengms.portal.service.VersionService;
import njgis.opengms.portal.utils.ResultUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping(value = "/version")
public class VersionRestController {

    @Autowired
    VersionService versionService;

    @Autowired
    ModelItemDao modelItemDao;

    @Autowired
    ModelItemVersionDao modelItemVersionDao;

    @Autowired
    UserService userService;

    @RequestMapping(value = "/review", method = RequestMethod.GET)
    public ModelAndView getRegister() {
        System.out.println("versionCheck");
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("version/versionCheck");
        modelAndView.addObject("name", "OpenGMS");

        return modelAndView;
    }

    @RequestMapping(value = "/historyList/{id}", method = RequestMethod.GET)
    public ModelAndView getHistoryList(@PathVariable ("id") String id) {
        System.out.println("historyList");

        ModelItem modelItem=modelItemDao.findFirstByOid(id);

        JSONArray resultList=new JSONArray();
        List<String> versions=modelItem.getVersions();
        for (int i=versions.size()-1;i>=0;i--)
        {
            String verOid=versions.get(i);
            ModelItemVersion modelItemVersion=modelItemVersionDao.findFirstByOid(verOid);
            JSONObject jsonObject=new JSONObject();
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            jsonObject.put("date",sdf.format(modelItemVersion.getModifyTime()));
            jsonObject.put("oid",modelItemVersion.getOid());
            User user=userService.getByUid(modelItemVersion.getModifier());
            jsonObject.put("userName",user.getName());
            jsonObject.put("userOid",user.getOid());

            resultList.add(jsonObject);
        }

        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("version/historyList");
        modelAndView.addObject("oid", modelItem.getOid());
        modelAndView.addObject("name", modelItem.getName());
        modelAndView.addObject("type", "modelItem");
        modelAndView.addObject("list", resultList);

        return modelAndView;
    }

    @RequestMapping(value = "/history/modelItem/{id}", method = RequestMethod.GET)
    public ModelAndView getModelItemHistory(@PathVariable ("id") String id) {
        return versionService.getModelItemHistoryPage(id);
    }

    @RequestMapping(value = "/accept", method = RequestMethod.POST)
    public JsonResult accept(@RequestBody VersionDTO versionDTO) {

        if (versionDTO.getType().equals("modelItem")) {
            ModelItem modelItem = modelItemDao.findFirstByOid(versionDTO.getOriginOid());
            if (modelItem.getVersions() == null || modelItem.getVersions().size() == 0) {
                ModelItemVersion modelItemVersion = new ModelItemVersion();
                BeanUtils.copyProperties(modelItem, modelItemVersion);
                modelItemVersion.setOid(UUID.randomUUID().toString());
                modelItemVersion.setOriginOid(modelItem.getOid());
                modelItemVersion.setVerNumber((long)0);
                modelItemVersion.setStatus(2);
                modelItemVersion.setModifier(modelItem.getAuthor());
                modelItemVersion.setModifyTime(modelItem.getCreateTime());
                modelItemVersionDao.insert(modelItemVersion);

                List<String> versions=modelItem.getVersions();
                if(versions==null) versions=new ArrayList<>();
                versions.add(modelItemVersion.getOid());
                modelItem.setVersions(versions);
            }

            ModelItemVersion modelItemVersion=modelItemVersionDao.findFirstByOid(versionDTO.getOid());

            BeanUtils.copyProperties(modelItemVersion,modelItem,"id");
            modelItem.setOid(modelItemVersion.getOriginOid());
            List<String> versions=modelItem.getVersions();
            versions.add(modelItemVersion.getOid());
            modelItem.setVersions(versions);

            List<String> contributors=modelItem.getContributors();
            contributors=contributors==null?new ArrayList<>():contributors;
            String contributor=modelItemVersion.getModifier();
            boolean exist=false;
            for(int i=0;i<contributors.size();i++){
                if(contributors.get(i).equals(contributor)){
                    exist=true;
                }
            }
            if(!exist&&!contributor.equals(modelItem.getAuthor())){
                contributors.add(contributor);
                modelItem.setContributors(contributors);
            }

            modelItem.setLastModifier(contributor);

            modelItem.setLock(false);
            modelItem.setLastModifyTime(modelItemVersion.getModifyTime());
            modelItemDao.save(modelItem);

            modelItemVersion.setStatus(1);
            modelItemVersionDao.save(modelItemVersion);
        }

        return ResultUtils.success();
    }

    @RequestMapping(value = "/reject", method = RequestMethod.POST)
    public JsonResult reject(@RequestBody VersionDTO versionDTO) {
        ModelItemVersion modelItemVersion=modelItemVersionDao.findFirstByOid(versionDTO.getOid());
        modelItemVersion.setStatus(-1);
        modelItemVersionDao.save(modelItemVersion);

        ModelItem modelItem = modelItemDao.findFirstByOid(versionDTO.getOriginOid());
        modelItem.setLock(false);
        modelItemDao.save(modelItem);

        return ResultUtils.success();

    }

    @RequestMapping(value = "/getUnchecked", method = RequestMethod.GET)
    public JsonResult getUnchecked() {
        JSONArray result = new JSONArray();

        List<ModelItemVersion> modelItemVersions = modelItemVersionDao.findAll();
        for (ModelItemVersion modelItemVersion : modelItemVersions
                ) {

            if (modelItemVersion.getStatus() == 0) {
                JSONObject jsonObject = new JSONObject();
                jsonObject.put("name", modelItemVersion.getName());
                jsonObject.put("oid", modelItemVersion.getOid());
                jsonObject.put("originOid", modelItemVersion.getOriginOid());
                SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                jsonObject.put("modifyTime", sdf.format(modelItemVersion.getModifyTime()));
                jsonObject.put("modifier", modelItemVersion.getModifier());
                jsonObject.put("type", "modelItem");
                result.add(jsonObject);
            }
        }

        return ResultUtils.success(result);
    }

    @RequestMapping(value = "/getAccepted", method = RequestMethod.GET)
    public JsonResult getAccepted() {
        JSONArray result = new JSONArray();

        List<ModelItemVersion> modelItemVersions = modelItemVersionDao.findAll();
        for (ModelItemVersion modelItemVersion : modelItemVersions
                ) {

            if (modelItemVersion.getStatus() == 1) {
                JSONObject jsonObject = new JSONObject();
                jsonObject.put("name", modelItemVersion.getName());
                jsonObject.put("oid", modelItemVersion.getOid());
                jsonObject.put("originOid", modelItemVersion.getOriginOid());
                SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                jsonObject.put("modifyTime", sdf.format(modelItemVersion.getModifyTime()));
                jsonObject.put("modifier", modelItemVersion.getModifier());
                jsonObject.put("type", "modelItem");
                result.add(jsonObject);
            }
        }

        return ResultUtils.success(result);
    }

    @RequestMapping(value = "/getRejected", method = RequestMethod.GET)
    public JsonResult getRejected() {
        JSONArray result = new JSONArray();

        List<ModelItemVersion> modelItemVersions = modelItemVersionDao.findAll();
        for (ModelItemVersion modelItemVersion : modelItemVersions
                ) {

            if (modelItemVersion.getStatus() == -1) {
                JSONObject jsonObject = new JSONObject();
                jsonObject.put("name", modelItemVersion.getName());
                jsonObject.put("oid", modelItemVersion.getOid());
                jsonObject.put("originOid", modelItemVersion.getOriginOid());
                SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                jsonObject.put("modifyTime", sdf.format(modelItemVersion.getModifyTime()));
                jsonObject.put("modifier", modelItemVersion.getModifier());
                jsonObject.put("type", "modelItem");
                result.add(jsonObject);
            }
        }

        return ResultUtils.success(result);
    }

    @RequestMapping(value = "/modelItem/{id}", method = RequestMethod.GET)
    public ModelAndView getCompare(@PathVariable("id") String id) {
        System.out.println("model item compare");

        return versionService.getPage4Compare(id);
    }

}
