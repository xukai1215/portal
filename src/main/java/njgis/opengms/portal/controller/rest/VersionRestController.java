package njgis.opengms.portal.controller.rest;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import njgis.opengms.portal.bean.JsonResult;
import njgis.opengms.portal.dao.ConceptualModelDao;
import njgis.opengms.portal.dao.ConceptualModelVersionDao;
import njgis.opengms.portal.dao.ModelItemDao;
import njgis.opengms.portal.dao.ModelItemVersionDao;
import njgis.opengms.portal.dto.version.VersionDTO;
import njgis.opengms.portal.entity.*;
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
    ConceptualModelDao conceptualModelDao;

    @Autowired
    ConceptualModelVersionDao conceptualModelVersionDao;

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

    @RequestMapping(value = "/historyList/{type}/{id}", method = RequestMethod.GET)
    public ModelAndView getHistoryList(@PathVariable("type") String type, @PathVariable("id") String id) {
        System.out.println("historyList");

        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("version/historyList");

        JSONArray resultList = new JSONArray();
        List<String> versions = new ArrayList<>();

        switch (type) {
            case "modelItem":
                ModelItem modelItem = modelItemDao.findFirstByOid(id);

                resultList = new JSONArray();
                versions = modelItem.getVersions();
                for (int i = versions.size() - 1; i >= 0; i--) {
                    String verOid = versions.get(i);
                    ModelItemVersion modelItemVersion = modelItemVersionDao.findFirstByOid(verOid);
                    JSONObject jsonObject = new JSONObject();
                    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                    jsonObject.put("date", sdf.format(modelItemVersion.getModifyTime()));
                    jsonObject.put("oid", modelItemVersion.getOid());
                    User user = userService.getByUid(modelItemVersion.getModifier());
                    jsonObject.put("userName", user.getName());
                    jsonObject.put("userOid", user.getOid());

                    resultList.add(jsonObject);
                }


                modelAndView.addObject("oid", modelItem.getOid());
                modelAndView.addObject("name", modelItem.getName());
                modelAndView.addObject("type", type);
                modelAndView.addObject("list", resultList);
                break;
            case "conceptualModel":
                ConceptualModel conceptualModel = conceptualModelDao.findFirstByOid(id);

                resultList = new JSONArray();
                versions = conceptualModel.getVersions();
                for (int i = versions.size() - 1; i >= 0; i--) {
                    String verOid = versions.get(i);
                    ConceptualModelVersion conceptualModelVersion = conceptualModelVersionDao.findFirstByOid(verOid);
                    JSONObject jsonObject = new JSONObject();
                    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                    jsonObject.put("date", sdf.format(conceptualModelVersion.getModifyTime()));
                    jsonObject.put("oid", conceptualModelVersion.getOid());
                    User user = userService.getByUid(conceptualModelVersion.getModifier());
                    jsonObject.put("userName", user.getName());
                    jsonObject.put("userOid", user.getOid());

                    resultList.add(jsonObject);
                }

                modelAndView.addObject("oid", conceptualModel.getOid());
                modelAndView.addObject("name", conceptualModel.getName());
                modelAndView.addObject("type", type);
                modelAndView.addObject("list", resultList);
                break;
        }

        return modelAndView;
    }

    @RequestMapping(value = "/history/{type}/{id}", method = RequestMethod.GET)
    public ModelAndView getModelItemHistory(@PathVariable("type") String type,@PathVariable("id") String id) {
        switch (type){
            case "modelItem":
                return versionService.getModelItemHistoryPage(id);
            case "conceptualModel":
                return versionService.getConceptualModelHistoryPage(id);
            default:
                return null;
        }

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
                modelItemVersion.setVerNumber((long) 0);
                modelItemVersion.setStatus(2);
                modelItemVersion.setModifier(modelItem.getAuthor());
                modelItemVersion.setModifyTime(modelItem.getCreateTime());
                modelItemVersionDao.insert(modelItemVersion);

                List<String> versions = modelItem.getVersions();
                if (versions == null) versions = new ArrayList<>();
                versions.add(modelItemVersion.getOid());
                modelItem.setVersions(versions);
            }

            ModelItemVersion modelItemVersion = modelItemVersionDao.findFirstByOid(versionDTO.getOid());
            //版本更替
            BeanUtils.copyProperties(modelItemVersion, modelItem, "id");
            modelItem.setOid(modelItemVersion.getOriginOid());
            List<String> versions = modelItem.getVersions();
            versions.add(modelItemVersion.getOid());
            modelItem.setVersions(versions);

            List<String> contributors = modelItem.getContributors();
            contributors = contributors == null ? new ArrayList<>() : contributors;
            String contributor = modelItemVersion.getModifier();
            boolean exist = false;
            for (int i = 0; i < contributors.size(); i++) {
                if (contributors.get(i).equals(contributor)) {
                    exist = true;
                }
            }
            if (!exist && !contributor.equals(modelItem.getAuthor())) {
                contributors.add(contributor);
                modelItem.setContributors(contributors);
            }

            modelItem.setLastModifier(contributor);
            modelItem.setLock(false);
            modelItem.setLastModifyTime(modelItemVersion.getModifyTime());
            modelItemDao.save(modelItem);

            modelItemVersion.setStatus(1);
            modelItemVersionDao.save(modelItemVersion);
        } else if (versionDTO.getType().equals("conceptualModel")) {
            ConceptualModel conceptualModel = conceptualModelDao.findFirstByOid(versionDTO.getOriginOid());
            if (conceptualModel.getVersions() == null || conceptualModel.getVersions().size() == 0) {
                ConceptualModelVersion conceptualModelVersion = new ConceptualModelVersion();
                BeanUtils.copyProperties(conceptualModel, conceptualModelVersion, "id");
                conceptualModelVersion.setOid(UUID.randomUUID().toString());
                conceptualModelVersion.setOriginOid(conceptualModel.getOid());
                conceptualModelVersion.setVerNumber((long) 0);
                conceptualModelVersion.setVerStatus(2);
                conceptualModelVersion.setModifier(conceptualModel.getAuthor());
                conceptualModelVersion.setModifyTime(conceptualModel.getCreateTime());
                conceptualModelVersionDao.insert(conceptualModelVersion);

                List<String> versions = conceptualModel.getVersions();
                if (versions == null) versions = new ArrayList<>();
                versions.add(conceptualModelVersion.getOid());
                conceptualModel.setVersions(versions);
            }

            ConceptualModelVersion conceptualModelVersion = conceptualModelVersionDao.findFirstByOid(versionDTO.getOid());
            //版本更替
            BeanUtils.copyProperties(conceptualModelVersion, conceptualModel, "id");
            conceptualModel.setOid(conceptualModelVersion.getOriginOid());
            List<String> versions = conceptualModel.getVersions();
            versions.add(conceptualModelVersion.getOid());
            conceptualModel.setVersions(versions);

            List<String> contributors = conceptualModel.getContributors();
            contributors = contributors == null ? new ArrayList<>() : contributors;
            String contributor = conceptualModelVersion.getModifier();
            boolean exist = false;
            for (int i = 0; i < contributors.size(); i++) {
                if (contributors.get(i).equals(contributor)) {
                    exist = true;
                }
            }
            if (!exist && !contributor.equals(conceptualModel.getAuthor())) {
                contributors.add(contributor);
                conceptualModel.setContributors(contributors);
            }

            conceptualModel.setLastModifier(contributor);
            conceptualModel.setLock(false);
            conceptualModel.setLastModifyTime(conceptualModelVersion.getModifyTime());
            conceptualModelDao.save(conceptualModel);

            conceptualModelVersion.setVerStatus(1);
            conceptualModelVersionDao.save(conceptualModelVersion);
        }

        return ResultUtils.success();
    }

    @RequestMapping(value = "/reject", method = RequestMethod.POST)
    public JsonResult reject(@RequestBody VersionDTO versionDTO) {
        if (versionDTO.getType().equals("modelItem")) {
            ModelItemVersion modelItemVersion = modelItemVersionDao.findFirstByOid(versionDTO.getOid());
            modelItemVersion.setStatus(-1);
            modelItemVersionDao.save(modelItemVersion);

            ModelItem modelItem = modelItemDao.findFirstByOid(versionDTO.getOriginOid());
            modelItem.setLock(false);
            modelItemDao.save(modelItem);
        } else if (versionDTO.getType().equals("conceptualModel")) {
            ConceptualModelVersion conceptualModelVersion = conceptualModelVersionDao.findFirstByOid(versionDTO.getOid());
            conceptualModelVersion.setVerStatus(-1);
            conceptualModelVersionDao.save(conceptualModelVersion);

            ConceptualModel conceptualModel = conceptualModelDao.findFirstByOid(versionDTO.getOriginOid());
            conceptualModel.setLock(false);
            conceptualModelDao.save(conceptualModel);
        }

        return ResultUtils.success();

    }

    @RequestMapping(value = "/getVersions", method = RequestMethod.GET)
    public JsonResult getUnchecked() {
        JSONObject result = new JSONObject();
        JSONArray uncheck = new JSONArray();
        JSONArray accept = new JSONArray();
        JSONArray reject = new JSONArray();

        List<ModelItemVersion> modelItemVersions = modelItemVersionDao.findAll();
        for (ModelItemVersion modelItemVersion : modelItemVersions) {

            JSONObject jsonObject = new JSONObject();
            jsonObject.put("name", modelItemVersion.getName());
            jsonObject.put("oid", modelItemVersion.getOid());
            jsonObject.put("originOid", modelItemVersion.getOriginOid());
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            jsonObject.put("modifyTime", sdf.format(modelItemVersion.getModifyTime()));
            jsonObject.put("modifier", modelItemVersion.getModifier());
            jsonObject.put("type", "modelItem");

            int status = modelItemVersion.getStatus();
            if (status == 0) {
                uncheck.add(jsonObject);
            } else if (status == 1) {
                accept.add(jsonObject);
            } else if (status == -1) {
                reject.add(jsonObject);
            }
        }

        List<ConceptualModelVersion> conceptualModelVersionList = conceptualModelVersionDao.findAll();
        for (ConceptualModelVersion conceptualModelVersion : conceptualModelVersionList) {

            JSONObject jsonObject = new JSONObject();
            jsonObject.put("name", conceptualModelVersion.getName());
            jsonObject.put("oid", conceptualModelVersion.getOid());
            jsonObject.put("originOid", conceptualModelVersion.getOriginOid());
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            jsonObject.put("modifyTime", sdf.format(conceptualModelVersion.getModifyTime()));
            jsonObject.put("modifier", conceptualModelVersion.getModifier());
            jsonObject.put("type", "conceptualModel");

            int status = conceptualModelVersion.getVerStatus();
            if (status == 0) {
                uncheck.add(jsonObject);
            } else if (status == 1) {
                accept.add(jsonObject);
            } else if (status == -1) {
                reject.add(jsonObject);
            }
        }

        result.put("uncheck", uncheck);
        result.put("accept", accept);
        result.put("reject", reject);

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
