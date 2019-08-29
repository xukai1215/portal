package njgis.opengms.portal.controller.rest;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import njgis.opengms.portal.bean.JsonResult;
import njgis.opengms.portal.dao.*;
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
    LogicalModelDao logicalModelDao;

    @Autowired
    LogicalModelVersionDao logicalModelVersionDao;

    @Autowired
    ComputableModelDao computableModelDao;

    @Autowired
    ComputableModelVersionDao computableModelVersionDao;

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
            case "logicalModel":
                LogicalModel logicalModel = logicalModelDao.findFirstByOid(id);

                resultList = new JSONArray();
                versions = logicalModel.getVersions();
                for (int i = versions.size() - 1; i >= 0; i--) {
                    String verOid = versions.get(i);
                    LogicalModelVersion logicalModelVersion = logicalModelVersionDao.findFirstByOid(verOid);
                    JSONObject jsonObject = new JSONObject();
                    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                    jsonObject.put("date", sdf.format(logicalModelVersion.getModifyTime()));
                    jsonObject.put("oid", logicalModelVersion.getOid());
                    User user = userService.getByUid(logicalModelVersion.getModifier());
                    jsonObject.put("userName", user.getName());
                    jsonObject.put("userOid", user.getOid());

                    resultList.add(jsonObject);
                }

                modelAndView.addObject("oid", logicalModel.getOid());
                modelAndView.addObject("name", logicalModel.getName());
                modelAndView.addObject("type", type);
                modelAndView.addObject("list", resultList);
                break;
            case "computableModel":
                ComputableModel computableModel = computableModelDao.findFirstByOid(id);

                resultList = new JSONArray();
                versions = computableModel.getVersions();
                for (int i = versions.size() - 1; i >= 0; i--) {
                    String verOid = versions.get(i);
                    ComputableModelVersion computableModelVersion = computableModelVersionDao.findFirstByOid(verOid);
                    JSONObject jsonObject = new JSONObject();
                    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                    jsonObject.put("date", sdf.format(computableModelVersion.getModifyTime()));
                    jsonObject.put("oid", computableModelVersion.getOid());
                    User user = userService.getByUid(computableModelVersion.getModifier());
                    jsonObject.put("userName", user.getName());
                    jsonObject.put("userOid", user.getOid());

                    resultList.add(jsonObject);
                }

                modelAndView.addObject("oid", computableModel.getOid());
                modelAndView.addObject("name", computableModel.getName());
                modelAndView.addObject("type", type);
                modelAndView.addObject("list", resultList);
                break;
        }

        return modelAndView;
    }

    @RequestMapping(value = "/history/{type}/{id}", method = RequestMethod.GET)
    public ModelAndView getModelItemHistory(@PathVariable("type") String type, @PathVariable("id") String id) {
        switch (type) {
            case "modelItem":
                return versionService.getModelItemHistoryPage(id);
            case "conceptualModel":
                return versionService.getConceptualModelHistoryPage(id);
            case "logicalModel":
                return versionService.getLogicalModelHistoryPage(id);
            case "computableModel":
                return versionService.getComputableModelHistoryPage(id);
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
        } else if (versionDTO.getType().equals("logicalModel")) {
            LogicalModel logicalModel = logicalModelDao.findFirstByOid(versionDTO.getOriginOid());
            if (logicalModel.getVersions() == null || logicalModel.getVersions().size() == 0) {
                LogicalModelVersion logicalModelVersion = new LogicalModelVersion();
                BeanUtils.copyProperties(logicalModel, logicalModelVersion, "id");
                logicalModelVersion.setOid(UUID.randomUUID().toString());
                logicalModelVersion.setOriginOid(logicalModel.getOid());
                logicalModelVersion.setVerNumber((long) 0);
                logicalModelVersion.setVerStatus(2);
                logicalModelVersion.setModifier(logicalModel.getAuthor());
                logicalModelVersion.setModifyTime(logicalModel.getCreateTime());
                logicalModelVersionDao.insert(logicalModelVersion);

                List<String> versions = logicalModel.getVersions();
                if (versions == null) versions = new ArrayList<>();
                versions.add(logicalModelVersion.getOid());
                logicalModel.setVersions(versions);
            }

            LogicalModelVersion logicalModelVersion = logicalModelVersionDao.findFirstByOid(versionDTO.getOid());
            //版本更替
            BeanUtils.copyProperties(logicalModelVersion, logicalModel, "id");
            logicalModel.setOid(logicalModelVersion.getOriginOid());
            List<String> versions = logicalModel.getVersions();
            versions.add(logicalModelVersion.getOid());
            logicalModel.setVersions(versions);

            List<String> contributors = logicalModel.getContributors();
            contributors = contributors == null ? new ArrayList<>() : contributors;
            String contributor = logicalModelVersion.getModifier();
            boolean exist = false;
            for (int i = 0; i < contributors.size(); i++) {
                if (contributors.get(i).equals(contributor)) {
                    exist = true;
                }
            }
            if (!exist && !contributor.equals(logicalModel.getAuthor())) {
                contributors.add(contributor);
                logicalModel.setContributors(contributors);
            }

            logicalModel.setLastModifier(contributor);
            logicalModel.setLock(false);
            logicalModel.setLastModifyTime(logicalModelVersion.getModifyTime());
            logicalModelDao.save(logicalModel);

            logicalModelVersion.setVerStatus(1);
            logicalModelVersionDao.save(logicalModelVersion);
        } else if (versionDTO.getType().equals("computableModel")) {
            ComputableModel computableModel = computableModelDao.findFirstByOid(versionDTO.getOriginOid());
            if (computableModel.getVersions() == null || computableModel.getVersions().size() == 0) {
                ComputableModelVersion computableModelVersion = new ComputableModelVersion();
                BeanUtils.copyProperties(computableModel, computableModelVersion, "id");
                computableModelVersion.setOid(UUID.randomUUID().toString());
                computableModelVersion.setOriginOid(computableModel.getOid());
                computableModelVersion.setVerNumber((long) 0);
                computableModelVersion.setVerStatus(2);
                computableModelVersion.setModifier(computableModel.getAuthor());
                computableModelVersion.setModifyTime(computableModel.getCreateTime());
                computableModelVersionDao.insert(computableModelVersion);

                List<String> versions = computableModel.getVersions();
                if (versions == null) versions = new ArrayList<>();
                versions.add(computableModelVersion.getOid());
                computableModel.setVersions(versions);
            }

            ComputableModelVersion computableModelVersion = computableModelVersionDao.findFirstByOid(versionDTO.getOid());
            //版本更替
            BeanUtils.copyProperties(computableModelVersion, computableModel, "id");
            computableModel.setOid(computableModelVersion.getOriginOid());
            List<String> versions = computableModel.getVersions();
            versions.add(computableModelVersion.getOid());
            computableModel.setVersions(versions);

            List<String> contributors = computableModel.getContributors();
            contributors = contributors == null ? new ArrayList<>() : contributors;
            String contributor = computableModelVersion.getModifier();
            boolean exist = false;
            for (int i = 0; i < contributors.size(); i++) {
                if (contributors.get(i).equals(contributor)) {
                    exist = true;
                }
            }
            if (!exist && !contributor.equals(computableModel.getAuthor())) {
                contributors.add(contributor);
                computableModel.setContributors(contributors);
            }

            computableModel.setLastModifier(contributor);
            computableModel.setLock(false);
            computableModel.setLastModifyTime(computableModelVersion.getModifyTime());
            computableModelDao.save(computableModel);

            computableModelVersion.setVerStatus(1);
            computableModelVersionDao.save(computableModelVersion);
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
        } else if (versionDTO.getType().equals("logicalModel")) {
            LogicalModelVersion logicalModelVersion = logicalModelVersionDao.findFirstByOid(versionDTO.getOid());
            logicalModelVersion.setVerStatus(-1);
            logicalModelVersionDao.save(logicalModelVersion);

            LogicalModel logicalModel = logicalModelDao.findFirstByOid(versionDTO.getOriginOid());
            logicalModel.setLock(false);
            logicalModelDao.save(logicalModel);
        } else if (versionDTO.getType().equals("computableModel")) {
            ComputableModelVersion computableModelVersion = computableModelVersionDao.findFirstByOid(versionDTO.getOid());
            computableModelVersion.setVerStatus(-1);
            computableModelVersionDao.save(computableModelVersion);

            ComputableModel computableModel = computableModelDao.findFirstByOid(versionDTO.getOriginOid());
            computableModel.setLock(false);
            computableModelDao.save(computableModel);
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

        List<LogicalModelVersion> logicalModelVersionList = logicalModelVersionDao.findAll();
        for (LogicalModelVersion logicalModelVersion : logicalModelVersionList) {

            JSONObject jsonObject = new JSONObject();
            jsonObject.put("name", logicalModelVersion.getName());
            jsonObject.put("oid", logicalModelVersion.getOid());
            jsonObject.put("originOid", logicalModelVersion.getOriginOid());
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            jsonObject.put("modifyTime", sdf.format(logicalModelVersion.getModifyTime()));
            jsonObject.put("modifier", logicalModelVersion.getModifier());
            jsonObject.put("type", "logicalModel");

            int status = logicalModelVersion.getVerStatus();
            if (status == 0) {
                uncheck.add(jsonObject);
            } else if (status == 1) {
                accept.add(jsonObject);
            } else if (status == -1) {
                reject.add(jsonObject);
            }
        }
        
        List<ComputableModelVersion> computableModelVersionList = computableModelVersionDao.findAll();
        for (ComputableModelVersion computableModelVersion : computableModelVersionList) {

            JSONObject jsonObject = new JSONObject();
            jsonObject.put("name", computableModelVersion.getName());
            jsonObject.put("oid", computableModelVersion.getOid());
            jsonObject.put("originOid", computableModelVersion.getOriginOid());
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            jsonObject.put("modifyTime", sdf.format(computableModelVersion.getModifyTime()));
            jsonObject.put("modifier", computableModelVersion.getModifier());
            jsonObject.put("type", "computableModel");

            int status = computableModelVersion.getVerStatus();
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
