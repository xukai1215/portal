package njgis.opengms.portal.service;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import njgis.opengms.portal.dao.*;
import njgis.opengms.portal.dto.Concept.ConceptAddDTO;
import njgis.opengms.portal.dto.Concept.ConceptFindDTO;
import njgis.opengms.portal.dto.Concept.ConceptResultDTO;
import njgis.opengms.portal.dto.Concept.ConceptUpdateDTO;
import njgis.opengms.portal.dto.RepositoryQueryDTO;
import njgis.opengms.portal.dto.Spatial.SpatialAddDTO;
import njgis.opengms.portal.dto.Spatial.SpatialFindDTO;
import njgis.opengms.portal.dto.Spatial.SpatialResultDTO;
import njgis.opengms.portal.dto.Spatial.SpatialUpdateDTO;
import njgis.opengms.portal.dto.Template.TemplateAddDTO;
import njgis.opengms.portal.dto.Template.TemplateFindDTO;
import njgis.opengms.portal.dto.Template.TemplateResultDTO;
import njgis.opengms.portal.dto.Template.TemplateUpdateDTO;
import njgis.opengms.portal.dto.Unit.UnitAddDTO;
import njgis.opengms.portal.dto.Unit.UnitFindDTO;
import njgis.opengms.portal.dto.Unit.UnitResultDTO;
import njgis.opengms.portal.dto.Unit.UnitUpdateDTO;
import njgis.opengms.portal.dto.UserResultDTO;
import njgis.opengms.portal.dto.theme.ThemeResultDTO;
import njgis.opengms.portal.entity.*;
import njgis.opengms.portal.entity.support.*;
import njgis.opengms.portal.enums.ResultEnum;
import njgis.opengms.portal.exception.MyException;
import njgis.opengms.portal.utils.Utils;
import org.dom4j.DocumentException;
import org.dom4j.DocumentHelper;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.text.SimpleDateFormat;
import java.util.*;



@Service
public class RepositoryService {
    @Autowired
    ItemService itemService;

    @Autowired
    ModelItemDao modelItemDao;

    @Autowired
    DataItemDao dataItemDao;

    @Autowired
    UserService userService;

    @Autowired
    ConceptDao conceptDao;

    @Autowired
    ThemeDao themeDao;

    @Autowired
    UserDao userDao;

    @Autowired
    ConceptVersionDao conceptVersionDao;

    @Autowired
    SpatialReferenceDao spatialReferenceDao;

    @Autowired
    SpatialReferenceVersionDao spatialReferenceVersionDao;

    @Autowired
    TemplateDao templateDao;

    @Autowired
    TemplateVersionDao templateVersionDao;

    @Autowired
    UnitDao unitDao;

    @Autowired
    UnitVersionDao unitVersionDao;

    @Autowired
    ConceptClassificationDao conceptClassificationDao;
    @Autowired
    SpatialReferenceClassificationDao spatialReferenceClassificationDao;
    @Autowired
    UnitClassificationDao unitClassificationDao;
    @Autowired
    TemplateClassificationDao templateClassificationDao;
    JSONArray modelRepositoryTreeArray = new JSONArray();
    int index = 0;

    @Value("${resourcePath}")
    private String resourcePath;

    @Value("${htmlLoadPath}")
    private String htmlLoadPath;

    //toUpperCase
    public void toUpperCase() {
        List<Concept> concepts = conceptDao.findAll();
        for (Concept c : concepts
        ) {
            String upperName = c.getName().toUpperCase();
            c.setName(upperName);
            conceptDao.save(c);
        }

        List<SpatialReference> spatialReferences = spatialReferenceDao.findAll();
        for (SpatialReference sr : spatialReferences
        ) {
            String upperName = sr.getName().toUpperCase();
            sr.setName(upperName);
            spatialReferenceDao.save(sr);
        }

        List<Template> templates = templateDao.findAll();
        for (Template t : templates
        ) {
            String upperName = t.getName().toUpperCase();
            t.setName(upperName);
            templateDao.save(t);
        }

        List<Unit> units = unitDao.findAll();
        for (Unit u : units
        ) {
            String upperName = u.getName().toUpperCase();
            u.setName(upperName);
            unitDao.save(u);
        }
    }

    //concept
    public ModelAndView getConceptPage(String id, HttpServletRequest req) {

        ModelAndView modelAndView = new ModelAndView();
        Concept concept = conceptDao.findByOid(id);
        if(concept==null){
            modelAndView.setViewName("error/404");
            return modelAndView;
        }


        modelAndView.setViewName("conceptInfo");

        concept=(Concept)itemService.recordViewCount(concept);
//        concept.setLoadCount(concept.getLoadCount() + 1);
        conceptDao.save(concept);

        //兼容两种格式的数据
        Classification classification = null;

        JSONArray array = new JSONArray();
        JSONArray classResult = new JSONArray();

        List<String> classifications = concept.getClassifications();
        for(int i=0;i<classifications.size();i++){
            array.clear();
            String classId=classifications.get(i);
            classification=conceptClassificationDao.findFirstByOid(classId);
            array.add(classification.getNameEn());

            classId=classification.getParentId();
            classification=conceptClassificationDao.findFirstByOid(classId);
            array.add(classification.getNameEn());

            JSONArray array1=new JSONArray();
            for(int j=array.size()-1;j>=0;j--){
                array1.add(array.getString(j));
            }
            classResult.add(array1);
        }
        System.out.println(classResult);

//        if(concept.getXml()!=null)
//        {
//            org.dom4j.Document d = null;
//            JSONArray localizationArray = new JSONArray();
//            try {
//                d = DocumentHelper.parseText(concept.getXml());
//                org.dom4j.Element root = d.getRootElement();
//                org.dom4j.Element Localizations = root.element("Localizations");
//                List<org.dom4j.Element> LocalizationList = Localizations.elements("Localization");
//                for (org.dom4j.Element Localization : LocalizationList) {
//                    String language = Localization.attributeValue("Local");
//                    String name = Localization.attributeValue("Name");
//                    String desc = Localization.attributeValue("Description");
//                    JSONObject jsonObject = new JSONObject();
//                    jsonObject.put("language", language);
//                    jsonObject.put("name", name);
//                    jsonObject.put("desc", desc);
//                    localizationArray.add(jsonObject);
//                }
//            } catch (DocumentException e) {
//                e.printStackTrace();
//            }
//
//            localizationArray.sort(new Comparator<Object>() {
//                @Override
//                public int compare(Object o1, Object o2) {
//                    JSONObject a = (JSONObject) o1;
//                    JSONObject b = (JSONObject) o2;
//                    return a.getString("language").compareToIgnoreCase(b.getString("language"));
//                }
//            });
//            modelAndView.addObject("localizations",localizationArray);
//        }

        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

        List<String> related = concept.getRelated();
        JSONArray relateArray = new JSONArray();
        if (related != null) {
            for (String relatedId : related) {
                Concept relatedConcept = conceptDao.findByOid(relatedId);
                String name = relatedConcept.getName();
                JSONObject jsonObject = new JSONObject();
                jsonObject.put("id", relatedId);
                jsonObject.put("name", name);
                relateArray.add(jsonObject);
            }
        }

        String lastModifyTime = sdf.format(concept.getLastModifyTime());

        //用户信息
        JSONObject userJson = userService.getItemUserInfo(concept.getAuthor());

        //修改者信息
        String lastModifier = concept.getLastModifier();
        JSONObject modifierJson = null;
        if (lastModifier != null) {
            modifierJson = userService.getItemUserInfo(lastModifier);
        }

        //description
        String description = "";
        List<Localization> localizationList = concept.getLocalizationList();
        for(int i=0;i<localizationList.size();i++){
            Localization localization = localizationList.get(i);
            String localDesc = localization.getDescription();
            if(localDesc!=null&&!localDesc.equals("")){
                description=localDesc;
                break;
            }
        }

        modelAndView.addObject("info", concept);
//        modelAndView.addObject("description", description);
        modelAndView.addObject("classifications", classResult);
        modelAndView.addObject("image", htmlLoadPath+concept.getImage());
        modelAndView.addObject("year", Calendar.getInstance().getWeekYear());
        modelAndView.addObject("date", sdf.format(concept.getCreateTime()));
        modelAndView.addObject("related", relateArray);
        modelAndView.addObject("user", userJson);
        modelAndView.addObject("lastModifier", modifierJson);
        modelAndView.addObject("lastModifyTime", lastModifyTime);

        return modelAndView;
    }


    public ModelAndView getThemePage(String id, HttpServletRequest req) {

        ModelAndView modelAndView = new ModelAndView();

        Theme theme = themeDao.findByOid(id);
        theme=(Theme)itemService.recordViewCount(theme);
        themeDao.save(theme);

        if(theme==null){
            modelAndView.setViewName("error/404");
            return modelAndView;
        }

        modelAndView.setViewName("theme_info");
        modelAndView.addObject("info", theme);


        //详情页面
        //String detailResult;
        String theme_detailDesc=theme.getDetail();

        JSONArray array = new JSONArray();

        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

        String lastModifyTime = sdf.format(theme.getLastModifyTime());

        //用户信息
        JSONObject userJson = userService.getItemUserInfo(theme.getAuthor());

        List<ClassInfo> classInfos = theme.getClassinfo();
        JSONArray classInfos_result = new JSONArray();
        for(int i=0;i<classInfos.size();i++){
            ClassInfo classInfo = classInfos.get(i);
            JSONObject classObj=new JSONObject();
            classObj.put("name",classInfo.getMcname());
            JSONArray models=new JSONArray();
            List<String> modelOids=classInfo.getModelsoid();
            for(int j=0;j<modelOids.size();j++) {
                JSONObject model=new JSONObject();
                ModelItem modelItem=modelItemDao.findFirstByOid(modelOids.get(j));
                model.put("name",modelItem.getName());
                model.put("image",modelItem.getImage());
                model.put("oid",modelItem.getOid());
                models.add(model);
            }
            classObj.put("content",models);
            classInfos_result.add(classObj);
        }
        List<DataClassInfo> dataClassInfos = theme.getDataClassInfo();
        JSONArray dataClassInfos_result = new JSONArray();
        for(int i=0;i<dataClassInfos.size();i++){
            DataClassInfo dataClassInfo = dataClassInfos.get(i);
            JSONObject dataclassObj = new JSONObject();
            dataclassObj.put("name",dataClassInfo.getDcname());
            JSONArray datas = new JSONArray();
            List<String> datasOid = dataClassInfo.getDatasoid();
            //JSONArray urls= new JSONArray();
            for(int j=0;j<datasOid.size();j++){
                JSONObject data = new JSONObject();
                JSONObject url = new JSONObject();
                DataItem dataItem = dataItemDao.findFirstById(datasOid.get(j));
                data.put("name",dataItem.getName());
                data.put("oid",dataItem.getId());
                //url.put("url_select",dataItem.getReference());
                //List<DataMeta> dataList = dataItem.getDataList();
                //JSONArray url_download = new JSONArray();
//                for(DataMeta dataMeta:dataList){
//                    if (dataList == null){
//                        break;
//                    }
//                    url_download.add(dataMeta.getUrl());
//                }
                //url.put("url_download",url_download);
                datas.add(data);
                //urls.add(url);
            }
            dataclassObj.put("content",datas);
            //dataclassObj.put("url",urls);
            dataClassInfos_result.add(dataclassObj);
        }

        List<Application> applications = theme.getApplication();
        JSONArray applications_result = new JSONArray();

        for(int i=0;i<applications.size();i++){
            JSONObject app = new JSONObject();
            Application application = applications.get(i);
            app.put("name",application.getApplicationname());
            app.put("link",application.getApplicationlink());
            app.put("image",application.getApplication_image());
            applications_result.add(app);
        }

        List<Maintainer> maintainers = theme.getMaintainer();
        JSONArray maintainer_result = new JSONArray();
        if (maintainers!=null) {
            for (int i = 0; i < maintainers.size(); i++) {
                JSONObject ma = new JSONObject();
                Maintainer maintainer = maintainers.get(i);
                ma.put("name", maintainer.getName());
                ma.put("id", maintainer.getId());
                maintainer_result.add(ma);
            }
        }

        modelAndView.addObject("image", htmlLoadPath+theme.getImage());
        modelAndView.addObject("detail",theme_detailDesc);
        modelAndView.addObject("year", Calendar.getInstance().getWeekYear());
        modelAndView.addObject("date", sdf.format(theme.getCreateTime()));
        modelAndView.addObject("references",JSONArray.parseArray(JSON.toJSONString(theme.getReferences())));
        modelAndView.addObject("modelClassInfos",classInfos_result);
        modelAndView.addObject("dataClassInfos",dataClassInfos_result);
        modelAndView.addObject("applications",applications_result);
        modelAndView.addObject("maintainer",maintainer_result);

        return modelAndView;
    }
//    public ModelAndView getThematic(String id, HttpServletRequest req) {
//
//        ModelAndView modelAndView = new ModelAndView();
//        modelAndView.setViewName("Thematic");
//
//        Theme theme = themeDao.findByOid(id);
//        modelAndView.addObject("info", theme);
//        themeDao.save(theme);
//
//        return modelAndView;
//    }

    public JSONObject searchConcept(RepositoryQueryDTO repositoryQueryDTO) {
        Sort sort = new Sort(repositoryQueryDTO.getAsc() == 1 ? Sort.Direction.ASC : Sort.Direction.DESC, "viewCount");
        Pageable pageable = PageRequest.of(repositoryQueryDTO.getPage(), repositoryQueryDTO.getPageSize(), sort);

        Page<ConceptResultDTO> concepts = conceptDao.findByNameContainsIgnoreCase(repositoryQueryDTO.getSearchText(), pageable);

        List<ConceptResultDTO> conceptList = concepts.getContent();
        List<UserResultDTO> userList = new ArrayList<>();
        for(int i=0;i<conceptList.size();i++){
            ConceptResultDTO conceptResultDTO = conceptList.get(i);
            UserResultDTO userResultDTO = userDao.findByUserName(conceptResultDTO.getAuthor());
            userList.add(userResultDTO);
        }

        JSONObject result = new JSONObject();
        result.put("list", concepts.getContent());
        result.put("total", concepts.getTotalElements());
        result.put("users", userList);
        return result;
    }

    public JSONObject getConceptList(RepositoryQueryDTO repositoryQueryDTO) {
        Sort sort = new Sort(repositoryQueryDTO.getAsc() == 1 ? Sort.Direction.ASC : Sort.Direction.DESC, "viewCount");
        Pageable pageable = PageRequest.of(repositoryQueryDTO.getPage(), repositoryQueryDTO.getPageSize(), sort);

        Page<ConceptResultDTO> concepts;
        String classOid = repositoryQueryDTO.getOid();
        if (classOid == null || classOid.equals("")) {
            concepts = conceptDao.findAllBy(pageable);
        } else {
            List<String> clas = new ArrayList<>();
            boolean add = clas.add(repositoryQueryDTO.getOid());
            Classification cla = conceptClassificationDao.findFirstByOid(clas.get(0));
            for (String c : cla.getChildrenId()
            ) {
                clas.add(c);
            }
            concepts = conceptDao.findByClassificationsIn(clas, pageable);
        }

        List<ConceptResultDTO> conceptList = concepts.getContent();
        List<UserResultDTO> userList = new ArrayList<>();
        for(int i=0;i<conceptList.size();i++){
            ConceptResultDTO conceptResultDTO = conceptList.get(i);
            UserResultDTO userResultDTO = userDao.findByUserName(conceptResultDTO.getAuthor());
            userList.add(userResultDTO);
        }


        JSONObject result = new JSONObject();
        result.put("list", concepts.getContent());
        result.put("total", concepts.getTotalElements());
        result.put("users", userList);
        return result;
    }

    public JSONObject getConceptsByUserId(String userId, int page, String sortType, int asc) {

        Sort sort = new Sort(asc == 1 ? Sort.Direction.ASC : Sort.Direction.DESC, "createTime");

        Pageable pageable = PageRequest.of(page, 10, sort);

        Page<ConceptResultDTO> concepts = conceptDao.findByAuthor(userId, pageable);

        JSONObject ConceptObject = new JSONObject();
        ConceptObject.put("count", concepts.getTotalElements());
        ConceptObject.put("concepts", concepts.getContent());
        return ConceptObject;

    }

    public JSONObject getThemesByUserId(String userId, int page, String sortType, int asc) {

        Sort sort = new Sort(asc == 1 ? Sort.Direction.ASC : Sort.Direction.DESC, "createTime");

        Pageable pageable = PageRequest.of(page, 10, sort);

        Page<ThemeResultDTO> themes = themeDao.findByAuthor(userId, pageable);

        JSONObject themeObject = new JSONObject();
        themeObject.put("count", themes.getTotalElements());
        themeObject.put("themes", themes.getContent());
        return themeObject;

    }

    public JSONObject getConceptsByUserId(String userId, ConceptFindDTO conceptFindDTO) {
        boolean asc=conceptFindDTO.getAsc();
        String sortElement=conceptFindDTO.getSortElement();
        int page=conceptFindDTO.getPage();
        int pageSize=conceptFindDTO.getPageSize();

        Sort sort = new Sort(asc ? Sort.Direction.ASC : Sort.Direction.DESC, "createTime");

        Pageable pageable = PageRequest.of(page, pageSize, sort);

        Page<ConceptResultDTO> concepts = conceptDao.findByAuthor(userId, pageable);

        JSONObject ConceptObject = new JSONObject();
        ConceptObject.put("count", concepts.getTotalElements());
        ConceptObject.put("concepts", concepts.getContent());

        return ConceptObject;

    }

    public String addConceptLocalization(String id, String language, String name, String desc) {
        Concept concept = conceptDao.findByOid(id);
        if (concept != null) {
            String xml = concept.getXml();
            org.dom4j.Document d = null;
            try {
                d = DocumentHelper.parseText(xml);
                org.dom4j.Element root = d.getRootElement();
                org.dom4j.Element Localizations = root.element("Localizations");
                org.dom4j.Element Localization = Localizations.addElement("Localization");
                Localization.addAttribute("Local", language);
                Localization.addAttribute("Name", name);
                Localization.addAttribute("Description", desc);
            } catch (DocumentException e) {
                e.printStackTrace();
            }
            concept.setXml(d.asXML());
            conceptDao.save(concept);
            return "ok";
        } else {
            return "no concept";
        }
    }

    public Concept getConceptByOid(String oid) {
        return conceptDao.findByOid(oid);

        //模型的dao层还有详情页面？？

    }

    public JSONObject searchConceptsByUserId(String searchText, String userId, int page, String sortType, int asc) {

        Sort sort = new Sort(asc == 1 ? Sort.Direction.ASC : Sort.Direction.DESC, "createTime");

        Pageable pageable = PageRequest.of(page, 10, sort);

        Page<ConceptResultDTO> concepts = conceptDao.findByNameContainsIgnoreCaseAndAuthor(searchText, userId, pageable);

        JSONObject conceptObject = new JSONObject();
        conceptObject.put("count", concepts.getTotalElements());
        conceptObject.put("concepts", concepts.getContent());

        return conceptObject;
    }

    public Concept insertConcept(ConceptAddDTO conceptAddDTO, String uid) {
        Concept concept = new Concept();
        BeanUtils.copyProperties(conceptAddDTO, concept);

        Date now = new Date();
        concept.setCreateTime(now);
        concept.setLastModifyTime(now);
        concept.setOid(UUID.randomUUID().toString());
        concept.setAuthor(uid);

        //设置图片
        String path = "/repository/concept/" + UUID.randomUUID().toString() + ".jpg";
        String[] strs = conceptAddDTO.getUploadImage().split(",");
        if (strs.length > 1) {
            String imgStr = conceptAddDTO.getUploadImage().split(",")[1];
            Utils.base64StrToImage(imgStr, resourcePath + path);
            concept.setImage(path);
        } else {
            concept.setImage("");
        }

        return conceptDao.insert(concept);
    }

    public JSONObject updateConcept(ConceptUpdateDTO conceptUpdateDTO, String uid) {
        JSONObject result = new JSONObject();
        Concept concept_ori = conceptDao.findByOid(conceptUpdateDTO.getOid());
        String author = concept_ori.getAuthor();
        if (!concept_ori.isLock()) {
            Concept concept = concept_ori;
            BeanUtils.copyProperties(conceptUpdateDTO, concept);
            //判断是否为新图片
            String uploadImage = conceptUpdateDTO.getUploadImage();
            if (!uploadImage.contains("/concept/") && !uploadImage.equals("")) {
                //删除旧图片
                File file = new File(resourcePath + concept.getImage());
                if (file.exists() && file.isFile())
                    file.delete();
                //添加新图片
                String path = "/concept/" + UUID.randomUUID().toString() + ".jpg";
                String imgStr = uploadImage.split(",")[1];
                Utils.base64StrToImage(imgStr, resourcePath + path);
                concept.setImage(path);
            }

            String authorUserName = author;

            Date now = new Date();
            if (author.equals(uid)) {

                concept.setLastModifyTime(now);
                conceptDao.save(concept);
                result.put("method", "update");
                result.put("oid", concept.getOid());
            } else {
                ConceptVersion conceptVersion = new ConceptVersion();
                BeanUtils.copyProperties(concept, conceptVersion, "id");
                conceptVersion.setOid(UUID.randomUUID().toString());
                conceptVersion.setOriginOid(concept_ori.getOid());
                conceptVersion.setModifier(uid);
                conceptVersion.setVerNumber(now.getTime());
                conceptVersion.setVerStatus(0);
                userService.messageNumPlusPlus(authorUserName);
                conceptVersion.setModifyTime(now);
                conceptVersion.setCreator(author);

                conceptVersionDao.save(conceptVersion);

                concept_ori.setLock(true);
                conceptDao.save(concept_ori);

                result.put("method", "version");
                result.put("oid", conceptVersion.getOid());

            }
        } else {
            return null;
        }

        return result;
    }

    public int deleteConcept(String oid, String userName) {
        Concept concept = conceptDao.findByOid(oid);
        if (concept != null) {
            String image = concept.getImage();
            if (image.contains("/concept/")) {
                File file = new File(resourcePath + concept.getImage());
                if (file.exists() && file.isFile())
                    file.delete();
            }
            conceptDao.delete(concept);
            userService.conceptMinusMinus(userName);
            return 1;
        } else {
            return -1;
        }
    }


    //spatialReference
    public ModelAndView getSpatialReferencePage(String id,HttpServletRequest req) {
        ModelAndView modelAndView = new ModelAndView();

        SpatialReference spatialReference = spatialReferenceDao.findByOid(id);
        if(spatialReference==null){
            modelAndView.setViewName("error/404");
            return modelAndView;
        }

        modelAndView.setViewName("spatialReferenceInfo");
        spatialReference=(SpatialReference)itemService.recordViewCount(spatialReference);
        spatialReferenceDao.save(spatialReference);


        //兼容两种格式的数据
        Classification classification = null;

        JSONArray array = new JSONArray();
        JSONArray classResult = new JSONArray();

        List<String> classifications = spatialReference.getClassifications();
        for(int i=0;i<classifications.size();i++){
            array.clear();
            String classId=classifications.get(i);
            classification=spatialReferenceClassificationDao.findFirstByOid(classId);
            array.add(classification.getNameEn());
            classId=classification.getParentId();

            classification=spatialReferenceClassificationDao.findFirstByOid(classId);
            array.add(classification.getNameEn());

            JSONArray array1=new JSONArray();
            for(int j=array.size()-1;j>=0;j--){
                array1.add(array.getString(j));
            }
            classResult.add(array1);
        }
        System.out.println(classResult);

        if(spatialReference.getXml()!=null)
        {
            org.dom4j.Document d = null;
            JSONArray localizationArray = new JSONArray();
            try {
                d = DocumentHelper.parseText(spatialReference.getXml());
                org.dom4j.Element root = d.getRootElement();
//            org.dom4j.Element Localizations = root.element("Localizations");
                List<org.dom4j.Element> LocalizationList = root.elements("Localization");
                for (org.dom4j.Element Localization : LocalizationList) {
                    String language = Localization.attributeValue("local");
                    String name = Localization.attributeValue("name");
                    String desc = Localization.attributeValue("description");
                    JSONObject jsonObject = new JSONObject();
                    jsonObject.put("language", language);
                    jsonObject.put("name", name);
                    jsonObject.put("desc", desc);
                    localizationArray.add(jsonObject);
                }
            } catch (DocumentException e) {
                e.printStackTrace();
            }

            localizationArray.sort(new Comparator<Object>() {
                @Override
                public int compare(Object o1, Object o2) {
                    JSONObject a = (JSONObject) o1;
                    JSONObject b = (JSONObject) o2;
                    return a.getString("language").compareToIgnoreCase(b.getString("language"));
                }
            });
            modelAndView.addObject("localizations",localizationArray);
        }

        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

        String lastModifyTime=sdf.format(spatialReference.getLastModifyTime());


        //用户信息
        JSONObject userJson = userService.getItemUserInfo(spatialReference.getAuthor());

        //修改者信息
        String lastModifier=spatialReference.getLastModifier();
        JSONObject modifierJson=null;
        if(lastModifier!=null){
            modifierJson = userService.getItemUserInfo(lastModifier);
        }

        modelAndView.addObject("info", spatialReference);
        modelAndView.addObject("classifications", classResult);
        modelAndView.addObject("image", htmlLoadPath+spatialReference.getImage());
        modelAndView.addObject("year", Calendar.getInstance().getWeekYear());
        modelAndView.addObject("date", sdf.format(spatialReference.getCreateTime()));
        modelAndView.addObject("user", userJson);
        modelAndView.addObject("lastModifier", modifierJson);
        modelAndView.addObject("lastModifyTime", lastModifyTime);

        return modelAndView;
    }

    public String addSpatialReferenceLocalization(String id, String language, String name, String desc) {
        SpatialReference spatialReference = spatialReferenceDao.findByOid(id);
        if (spatialReference != null) {
            String xml = spatialReference.getXml();
            org.dom4j.Document d = null;
            try {
                d = DocumentHelper.parseText(xml);
                org.dom4j.Element root = d.getRootElement();
                org.dom4j.Element Localization = root.addElement("Localization");
                Localization.addAttribute("local", language);
                Localization.addAttribute("name", name);
                Localization.addAttribute("description", desc);
            } catch (DocumentException e) {
                e.printStackTrace();
            }
            spatialReference.setXml(d.asXML());
            spatialReferenceDao.save(spatialReference);
            return "ok";
        } else {
            return "no concept";
        }
    }

    public JSONObject searchSpatialReference(RepositoryQueryDTO repositoryQueryDTO) {
        Sort sort = new Sort(repositoryQueryDTO.getAsc() == 1 ? Sort.Direction.ASC : Sort.Direction.DESC, "name");
        Pageable pageable = PageRequest.of(repositoryQueryDTO.getPage(), repositoryQueryDTO.getPageSize(), sort);

        Page<SpatialResultDTO> spatialReferences = spatialReferenceDao.findByNameContainsIgnoreCase(repositoryQueryDTO.getSearchText(), pageable);

        List<SpatialResultDTO> SpatialList = spatialReferences.getContent();
        List<UserResultDTO> userList = new ArrayList<>();
        for(int i=0;i<SpatialList.size();i++){
            SpatialResultDTO SpatialResultDTO = SpatialList.get(i);
            UserResultDTO userResultDTO = userDao.findByUserName(SpatialResultDTO.getAuthor());
            userList.add(userResultDTO);
        }

        JSONObject result = new JSONObject();
        result.put("list", spatialReferences.getContent());
        result.put("total", spatialReferences.getTotalElements());
        result.put("users",userList);
        return result;
    }

    public JSONObject getSpatialReferenceList(RepositoryQueryDTO repositoryQueryDTO) {
        Sort sort = new Sort(repositoryQueryDTO.getAsc() == 1 ? Sort.Direction.ASC : Sort.Direction.DESC, "name");
        Pageable pageable = PageRequest.of(repositoryQueryDTO.getPage(), repositoryQueryDTO.getPageSize(), sort);

        Page<SpatialResultDTO> spatialReferences;
        String classOid = repositoryQueryDTO.getOid();
        if (classOid == null || classOid.equals("")) {
            spatialReferences = spatialReferenceDao.findAllBy(pageable);
        } else {
            List<String> clas = new ArrayList<>();
            clas.add(repositoryQueryDTO.getOid());
            Classification cla = spatialReferenceClassificationDao.findFirstByOid(clas.get(0));
            for (String c : cla.getChildrenId()
            ) {
                clas.add(c);
            }
            spatialReferences = spatialReferenceDao.findByClassificationsIn(clas, pageable);
        }

        List<SpatialResultDTO> SpatialList = spatialReferences.getContent();
        List<UserResultDTO> userList = new ArrayList<>();
        for(int i=0;i<SpatialList.size();i++){
            SpatialResultDTO SpatialResultDTO = SpatialList.get(i);
            UserResultDTO userResultDTO = userDao.findByUserName(SpatialResultDTO.getAuthor());
            userList.add(userResultDTO);
        }

        JSONObject result = new JSONObject();
        result.put("list", spatialReferences.getContent());
        result.put("total", spatialReferences.getTotalElements());
        result.put("users",userList);
        return result;
    }

    public JSONObject getSpatialsByUserId(String userId, int page, String sortType, int asc) {

        Sort sort = new Sort(asc == 1 ? Sort.Direction.ASC : Sort.Direction.DESC, "createTime");

        Pageable pageable = PageRequest.of(page, 10, sort);

        Page<SpatialResultDTO> spatials = spatialReferenceDao.findByAuthor(userId, pageable);

        JSONObject SpatialObject = new JSONObject();
        SpatialObject.put("count", spatials.getTotalElements());
        SpatialObject.put("spatials", spatials.getContent());

        return SpatialObject;

    }

    public JSONObject getSpatialsByUserId(String userId, SpatialFindDTO spatialFIndDTO) {
        boolean asc=spatialFIndDTO.getAsc();
        String sortElement=spatialFIndDTO.getSortElement();
        int page=spatialFIndDTO.getPage();
        int pageSize=spatialFIndDTO.getPageSize();

        Sort sort = new Sort(asc ? Sort.Direction.ASC : Sort.Direction.DESC, sortElement);

        Pageable pageable = PageRequest.of(page, pageSize, sort);

        Page<SpatialResultDTO> spatials = spatialReferenceDao.findByAuthor(userId, pageable);

        JSONObject SpatialObject = new JSONObject();
        SpatialObject.put("count", spatials.getTotalElements());
        SpatialObject.put("spatials", spatials.getContent());

        return SpatialObject;

    }

    public JSONObject searchSpatialsByUserId(String searchText, String userId, int page, String sortType, int asc) {

        Sort sort = new Sort(asc == 1 ? Sort.Direction.ASC : Sort.Direction.DESC, "createTime");

        Pageable pageable = PageRequest.of(page, 10, sort);

        Page<SpatialResultDTO> spatials = spatialReferenceDao.findByNameContainsIgnoreCaseAndAuthor(searchText, userId, pageable);

        JSONObject spatialObject = new JSONObject();
        spatialObject.put("count", spatials.getTotalElements());
        spatialObject.put("spatials", spatials.getContent());

        return spatialObject;
    }

    public SpatialReference getSpatialByOid(String oid) {
        return spatialReferenceDao.findByOid(oid);
    }

    public SpatialReference insertSpatial(SpatialAddDTO spatialAddDTO, String uid) {
        SpatialReference spatial = new SpatialReference();
        BeanUtils.copyProperties(spatialAddDTO, spatial);

        Date now = new Date();
        spatial.setCreateTime(now);
        spatial.setLastModifyTime(now);
        spatial.setOid(UUID.randomUUID().toString());
        spatial.setAuthor(uid);

        //设置图片
        String path = "/repository/spatialReference/" + UUID.randomUUID().toString() + ".jpg";
        String[] strs = spatialAddDTO.getUploadImage().split(",");
        if (strs.length > 1) {
            String imgStr = spatialAddDTO.getUploadImage().split(",")[1];
            Utils.base64StrToImage(imgStr, resourcePath + path);
            spatial.setImage(path);
        } else {
            spatial.setImage("");
        }

        return spatialReferenceDao.insert(spatial);
    }

    public JSONObject updateSpatial(SpatialUpdateDTO spatialUpdateDTO, String uid) {
        JSONObject result = new JSONObject();
        SpatialReference spatialReference_ori = spatialReferenceDao.findByOid(spatialUpdateDTO.getOid());
        String author = spatialReference_ori.getAuthor();
        if (!spatialReference_ori.isLock()) {
            SpatialReference spatialReference = spatialReference_ori;
            BeanUtils.copyProperties(spatialUpdateDTO, spatialReference);
            //判断是否为新图片
            String uploadImage = spatialUpdateDTO.getUploadImage();
            if (!uploadImage.contains("/spatialReference/") && !uploadImage.equals("")) {
                //删除旧图片
                File file = new File(resourcePath + spatialReference.getImage());
                if (file.exists() && file.isFile())
                    file.delete();
                //添加新图片
                String path = "/spatial/" + UUID.randomUUID().toString() + ".jpg";
                String imgStr = uploadImage.split(",")[1];
                Utils.base64StrToImage(imgStr, resourcePath + path);
                spatialReference.setImage(path);
            }
            String authorUserName = author;

            Date now = new Date();
            if (author.equals(uid)) {

                spatialReference.setLastModifyTime(now);
                spatialReferenceDao.save(spatialReference);
                result.put("method", "update");
                result.put("oid", spatialReference.getOid());
            } else {
                SpatialReferenceVersion spatialReferenceVersion = new SpatialReferenceVersion();
                BeanUtils.copyProperties(spatialReference, spatialReferenceVersion, "id");
                spatialReferenceVersion.setOid(UUID.randomUUID().toString());
                spatialReferenceVersion.setOriginOid(spatialReference_ori.getOid());
                spatialReferenceVersion.setModifier(uid);
                spatialReferenceVersion.setVerNumber(now.getTime());
                spatialReferenceVersion.setVerStatus(0);
                userService.messageNumPlusPlus(authorUserName);
                spatialReferenceVersion.setModifyTime(now);
                spatialReferenceVersion.setCreator(author);

                spatialReferenceVersionDao.save(spatialReferenceVersion);

                spatialReference_ori.setLock(true);
                spatialReferenceDao.save(spatialReference_ori);

                result.put("method", "version");
                result.put("oid", spatialReferenceVersion.getOid());
            }

            return result;
        } else {
            return null;
        }
    }

    public int deleteSpatial(String oid, String userName) {
        SpatialReference spatial = spatialReferenceDao.findByOid(oid);
        if (spatial != null) {
            String image = spatial.getImage();
            if (image.contains("/concept/")) {
                File file = new File(resourcePath + spatial.getImage());
                if (file.exists() && file.isFile())
                    file.delete();
            }
            spatialReferenceDao.delete(spatial);
            userService.spatialMinusMinus(userName);
            return 1;
        } else {
            return -1;
        }
    }


    //Template
    public ModelAndView getTemplatePage(String id,HttpServletRequest req) {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("templateInfo");

        Template template = templateDao.findByOid(id);
        if(template==null){
            modelAndView.setViewName("error/404");
            return modelAndView;
        }

        template=(Template)itemService.recordViewCount(template);
        templateDao.save(template);

        //兼容两种格式的数据
        Classification classification = null;

        JSONArray array = new JSONArray();
        JSONArray classResult = new JSONArray();

        List<String> classifications = template.getClassifications();
        for(int i=0;i<classifications.size();i++){
            array.clear();
            String classId=classifications.get(i);
            classification=templateClassificationDao.findFirstByOid(classId);
            array.add(classification.getNameEn());
            classId=classification.getParentId();

            classification=templateClassificationDao.findFirstByOid(classId);
            array.add(classification.getNameEn());

            JSONArray array1=new JSONArray();
            for(int j=array.size()-1;j>=0;j--){
                array1.add(array.getString(j));
            }
            classResult.add(array1);
        }
        System.out.println(classResult);

//        if(template.getXml()!=null)
//        {
//            org.dom4j.Document d = null;
//            JSONArray localizationArray = new JSONArray();
//            try {
//                d = DocumentHelper.parseText(template.getXml());
//                org.dom4j.Element root = d.getRootElement();
////            org.dom4j.Element Localizations = root.element("Localizations");
//                List<org.dom4j.Element> LocalizationList = root.elements("Localization");
//                for (org.dom4j.Element Localization : LocalizationList) {
//                    String language = Localization.attributeValue("Local");
//                    String name = Localization.attributeValue("Name");
//                    String desc = Localization.attributeValue("Description");
//                    JSONObject jsonObject = new JSONObject();
//                    jsonObject.put("language", language);
//                    jsonObject.put("name", name);
//                    jsonObject.put("desc", desc);
//                    localizationArray.add(jsonObject);
//                }
//            } catch (DocumentException e) {
//                e.printStackTrace();
//            }
//
//            localizationArray.sort(new Comparator<Object>() {
//                @Override
//                public int compare(Object o1, Object o2) {
//                    JSONObject a = (JSONObject) o1;
//                    JSONObject b = (JSONObject) o2;
//                    return a.getString("language").compareToIgnoreCase(b.getString("language"));
//                }
//            });
//            modelAndView.addObject("localizations",localizationArray);
//        }

        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        String lastModifyTime=sdf.format(template.getLastModifyTime());

        //用户信息
        JSONObject userJson = userService.getItemUserInfo(template.getAuthor());

        //修改者信息
        String lastModifier=template.getLastModifier();
        JSONObject modifierJson=null;
        if(lastModifier!=null){
            modifierJson = userService.getItemUserInfo(lastModifier);
        }

        modelAndView.addObject("info", template);
        modelAndView.addObject("classifications", classResult);
        modelAndView.addObject("image", htmlLoadPath+template.getImage());
        modelAndView.addObject("year", Calendar.getInstance().getWeekYear());
        modelAndView.addObject("date", sdf.format(template.getCreateTime()));
        modelAndView.addObject("user", userJson);
        modelAndView.addObject("lastModifier", modifierJson);
        modelAndView.addObject("lastModifyTime", lastModifyTime);

        return modelAndView;
    }

    public JSONObject searchTemplate(RepositoryQueryDTO repositoryQueryDTO) {
        Sort sort = new Sort(repositoryQueryDTO.getAsc() == 1 ? Sort.Direction.ASC : Sort.Direction.DESC, "viewCount");
        Pageable pageable = PageRequest.of(repositoryQueryDTO.getPage(), repositoryQueryDTO.getPageSize(), sort);

        Page<TemplateResultDTO> templates = templateDao.findByNameContainsIgnoreCase(repositoryQueryDTO.getSearchText(), pageable);

        List<TemplateResultDTO> TemplateList = templates.getContent();
        List<UserResultDTO> userList = new ArrayList<>();
        for(int i=0;i<TemplateList.size();i++){
            TemplateResultDTO TemplateResultDTO = TemplateList.get(i);
            UserResultDTO userResultDTO = userDao.findByUserName(TemplateResultDTO.getAuthor());
            userList.add(userResultDTO);
        }

        JSONObject result = new JSONObject();
        result.put("list", templates.getContent());
        result.put("total", templates.getTotalElements());
        result.put("users", userList);
        return result;
    }

    public JSONObject getTemplateList(RepositoryQueryDTO repositoryQueryDTO) {
        Sort sort = new Sort(repositoryQueryDTO.getAsc() == 1 ? Sort.Direction.ASC : Sort.Direction.DESC, "viewCount");
        Pageable pageable = PageRequest.of(repositoryQueryDTO.getPage(), repositoryQueryDTO.getPageSize(), sort);

        Page<TemplateResultDTO> templates;
        String classOid = repositoryQueryDTO.getOid();
        if (classOid == null || classOid.equals("")) {
            templates = templateDao.findAllBy(pageable);
        } else {
            List<String> clas = new ArrayList<>();
            clas.add(repositoryQueryDTO.getOid());
            Classification cla = templateClassificationDao.findFirstByOid(clas.get(0));
            for (String c : cla.getChildrenId()
            ) {
                clas.add(c);
            }
            templates = templateDao.findByClassificationsIn(clas, pageable);
        }

        List<TemplateResultDTO> TemplateList = templates.getContent();
        List<UserResultDTO> userList = new ArrayList<>();
        for(int i=0;i<TemplateList.size();i++){
            TemplateResultDTO TemplateResultDTO = TemplateList.get(i);
            UserResultDTO userResultDTO = userDao.findByUserName(TemplateResultDTO.getAuthor());
            userList.add(userResultDTO);
        }

        JSONObject result = new JSONObject();
        result.put("list", templates.getContent());
        result.put("total", templates.getTotalElements());
        result.put("users", userList);
        return result;
    }

    public JSONObject getTemplatesByUserId(String userId, int page, String sortType, int asc) {

        Sort sort = new Sort(asc == 1 ? Sort.Direction.ASC : Sort.Direction.DESC, "createTime");

        Pageable pageable = PageRequest.of(page, 10, sort);

        Page<TemplateResultDTO> templates = templateDao.findByAuthor(userId, pageable);

        JSONObject TemplateObject = new JSONObject();
        TemplateObject.put("count", templates.getTotalElements());
        TemplateObject.put("templates", templates.getContent());

        return TemplateObject;

    }

    public JSONObject getTemplatesByUserId(String userId, TemplateFindDTO templateFindDTO) {
        boolean asc=templateFindDTO.getAsc();
        String sortElement=templateFindDTO.getSortElement();
        int page=templateFindDTO.getPage();
        int pageSize=templateFindDTO.getPageSize();

        Sort sort = new Sort(asc  ? Sort.Direction.ASC : Sort.Direction.DESC, sortElement);

        Pageable pageable = PageRequest.of(page, pageSize, sort);

        Page<TemplateResultDTO> templates = templateDao.findByAuthor(userId, pageable);

        JSONObject TemplateObject = new JSONObject();
        TemplateObject.put("count", templates.getTotalElements());
        TemplateObject.put("templates", templates.getContent());

        return TemplateObject;

    }

    public JSONObject searchTemplatesByUserId(String searchText, String userId, int page, String sortType, int asc) {

        Sort sort = new Sort(asc == 1 ? Sort.Direction.ASC : Sort.Direction.DESC, "createTime");

        Pageable pageable = PageRequest.of(page, 10, sort);

        Page<TemplateResultDTO> templates = templateDao.findByNameContainsIgnoreCaseAndAuthor(searchText, userId, pageable);

        JSONObject templateObject = new JSONObject();
        templateObject.put("count", templates.getTotalElements());
        templateObject.put("templates", templates.getContent());

        return templateObject;
    }

    public Template getTemplateByOid(String oid) {
        return templateDao.findByOid(oid);
    }

    public Template insertTemplate(TemplateAddDTO templateAddDTO, String uid) {
        Template template = new Template();
        BeanUtils.copyProperties(templateAddDTO, template);

        Date now = new Date();
        template.setCreateTime(now);
        template.setLastModifyTime(now);
        template.setOid(UUID.randomUUID().toString());
        template.setAuthor(uid);

        //设置图片
        String path = "/repository/template/" + UUID.randomUUID().toString() + ".jpg";
        String[] strs = templateAddDTO.getUploadImage().split(",");
        if (strs.length > 1) {
            String imgStr = templateAddDTO.getUploadImage().split(",")[1];
            Utils.base64StrToImage(imgStr, resourcePath + path);
            template.setImage(path);
        } else {
            template.setImage("");
        }

        return templateDao.insert(template);
    }

    public JSONObject updateTemplate(TemplateUpdateDTO templateUpdateDTO, String uid) {
        JSONObject result = new JSONObject();
        Template template_ori = templateDao.findByOid(templateUpdateDTO.getOid());
        String author = template_ori.getAuthor();
        if (!template_ori.isLock()) {
            Template template = template_ori;
            BeanUtils.copyProperties(templateUpdateDTO, template);
            //判断是否为新图片
            String uploadImage = templateUpdateDTO.getUploadImage();
            if (!uploadImage.contains("/template/") && !uploadImage.equals("")) {
                //删除旧图片
                File file = new File(resourcePath + template.getImage());
                if (file.exists() && file.isFile())
                    file.delete();
                //添加新图片
                String path = "/template/" + UUID.randomUUID().toString() + ".jpg";
                String imgStr = uploadImage.split(",")[1];
                Utils.base64StrToImage(imgStr, resourcePath + path);
                template.setImage(path);
            }
            String authorUserName = author;

            Date now = new Date();
            if (author.equals(uid)) {
                template.setLastModifyTime(now);
                templateDao.save(template);
                result.put("method", "update");
                result.put("oid", template.getOid());
            } else {
                TemplateVersion templateVersion = new TemplateVersion();
                BeanUtils.copyProperties(template, templateVersion, "id");
                templateVersion.setOid(UUID.randomUUID().toString());
                templateVersion.setOriginOid(template_ori.getOid());
                templateVersion.setModifier(uid);
                templateVersion.setVerNumber(now.getTime());
                templateVersion.setVerStatus(0);
                userService.messageNumPlusPlus(authorUserName);
                templateVersion.setModifyTime(now);
                templateVersion.setCreator(author);

                templateVersionDao.save(templateVersion);

                template_ori.setLock(true);
                templateDao.save(template_ori);

                result.put("method", "version");
                result.put("oid", templateVersion.getOid());

            }
            return result;
        } else {
            return null;
        }

    }

    public int deleteTemplate(String oid, String userName) {
        Template template = templateDao.findByOid(oid);
        if (template != null) {
            String image = template.getImage();
            if (image.contains("/concept/")) {
                File file = new File(resourcePath + template.getImage());
                if (file.exists() && file.isFile())
                    file.delete();
            }
            templateDao.delete(template);
            userService.templateMinusMinus(userName);
            return 1;
        } else {
            return -1;
        }
    }


    //Unit
    public ModelAndView getUnitPage(String id,HttpServletRequest req) {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("unitInfo");

        Unit unit = unitDao.findByOid(id);
        if(unit==null){
            modelAndView.setViewName("error/404");
            return modelAndView;
        }

        unit=(Unit)itemService.recordViewCount(unit);
        unitDao.save(unit);

        //兼容两种格式的数据
        Classification classification = null;

        JSONArray array = new JSONArray();
        JSONArray classResult = new JSONArray();

        List<String> classifications = unit.getClassifications();
        for(int i=0;i<classifications.size();i++){
            array.clear();
            String classId=classifications.get(i);
            classification=unitClassificationDao.findFirstByOid(classId);
            array.add(classification.getNameEn());
            classId=classification.getParentId();

            classification=unitClassificationDao.findFirstByOid(classId);
            array.add(classification.getNameEn());

            JSONArray array1=new JSONArray();
            for(int j=array.size()-1;j>=0;j--){
                array1.add(array.getString(j));
            }
            classResult.add(array1);
        }
        System.out.println(classResult);

        if(unit.getXml()!=null)
        {
            org.dom4j.Document d = null;
            JSONArray localizationArray = new JSONArray();
            try {
                d = DocumentHelper.parseText(unit.getXml());
                org.dom4j.Element root = d.getRootElement();
                org.dom4j.Element Localizations = root.element("Localizations");
                List<org.dom4j.Element> LocalizationList = Localizations.elements("Localization");
                for (org.dom4j.Element Localization : LocalizationList) {
                    String language = Localization.attributeValue("Local");
                    String name = Localization.attributeValue("Name");
                    String desc = Localization.attributeValue("Description");
                    JSONObject jsonObject = new JSONObject();
                    jsonObject.put("language", language);
                    jsonObject.put("name", name);
                    jsonObject.put("desc", desc);
                    localizationArray.add(jsonObject);
                }
            } catch (DocumentException e) {
                e.printStackTrace();
            }

            localizationArray.sort(new Comparator<Object>() {
                @Override
                public int compare(Object o1, Object o2) {
                    JSONObject a = (JSONObject) o1;
                    JSONObject b = (JSONObject) o2;
                    return a.getString("language").compareToIgnoreCase(b.getString("language"));
                }
            });
            modelAndView.addObject("localizations",localizationArray);
        }

        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

        //用户信息
        JSONObject userJson = userService.getItemUserInfo(unit.getAuthor());

        //修改者信息
        String lastModifier=unit.getLastModifier();
        JSONObject modifierJson=null;
        if(lastModifier!=null){
            modifierJson = userService.getItemUserInfo(lastModifier);
        }

        String lastModifyTime=sdf.format(unit.getLastModifyTime());


        modelAndView.addObject("info", unit);
        modelAndView.addObject("classifications", classResult);
        modelAndView.addObject("image", htmlLoadPath+unit.getImage());
        modelAndView.addObject("year", Calendar.getInstance().getWeekYear());
        modelAndView.addObject("date", sdf.format(unit.getCreateTime()));
        modelAndView.addObject("user", userJson);
        modelAndView.addObject("lastModifier", modifierJson);
        modelAndView.addObject("lastModifyTime", lastModifyTime);

        return modelAndView;
    }

    public JSONObject searchUnit(RepositoryQueryDTO repositoryQueryDTO) {
        Sort sort = new Sort(repositoryQueryDTO.getAsc() == 1 ? Sort.Direction.ASC : Sort.Direction.DESC, "name");
        Pageable pageable = PageRequest.of(repositoryQueryDTO.getPage(), repositoryQueryDTO.getPageSize(), sort);

        Page<UnitResultDTO> units = unitDao.findByNameContainsIgnoreCase(repositoryQueryDTO.getSearchText(), pageable);

        List<UnitResultDTO> unitList = units.getContent();
        List<UserResultDTO> userList = new ArrayList<>();
        for(int i=0;i<unitList.size();i++){
            UnitResultDTO unitResultDTO = unitList.get(i);
            UserResultDTO userResultDTO = userDao.findByUserName(unitResultDTO.getAuthor());
            userList.add(userResultDTO);
        }

        JSONObject result = new JSONObject();
        result.put("list", units.getContent());
        result.put("total", units.getTotalElements());
        result.put("users", userList);
        return result;
    }

    public JSONObject getUnitList(RepositoryQueryDTO repositoryQueryDTO) {
        Sort sort = new Sort(repositoryQueryDTO.getAsc() == 1 ? Sort.Direction.ASC : Sort.Direction.DESC, "name");
        Pageable pageable = PageRequest.of(repositoryQueryDTO.getPage(), repositoryQueryDTO.getPageSize(), sort);

        Page<UnitResultDTO> units;
        String classOid = repositoryQueryDTO.getOid();
        if (classOid == null || classOid.equals("")) {
            units = unitDao.findAllBy(pageable);
        } else {
            List<String> clas = new ArrayList<>();
            clas.add(repositoryQueryDTO.getOid());
            Classification cla = unitClassificationDao.findFirstByOid(clas.get(0));
            for (String c : cla.getChildrenId()
            ) {
                clas.add(c);
            }
            units = unitDao.findByClassificationsIn(clas, pageable);
        }

        List<UnitResultDTO> unitList = units.getContent();
        List<UserResultDTO> userList = new ArrayList<>();
        for(int i=0;i<unitList.size();i++){
            UnitResultDTO unitResultDTO = unitList.get(i);
            UserResultDTO userResultDTO = userDao.findByUserName(unitResultDTO.getAuthor());
            userList.add(userResultDTO);
        }

        JSONObject result = new JSONObject();
        result.put("list", units.getContent());
        result.put("total", units.getTotalElements());
        result.put("users", userList);
        return result;
    }

    public String addUnitLocalization(String id, String language, String name, String desc) {
        Unit unit = unitDao.findByOid(id);
        if (unit != null) {
            String xml = unit.getXml();
            org.dom4j.Document d = null;
            try {
                d = DocumentHelper.parseText(xml);
                org.dom4j.Element root = d.getRootElement();
                org.dom4j.Element Localizations = root.element("Localizations");
                org.dom4j.Element Localization = Localizations.addElement("Localization");
                Localization.addAttribute("Local", language);
                Localization.addAttribute("Name", name);
                Localization.addAttribute("Description", desc);
            } catch (DocumentException e) {
                e.printStackTrace();
            }
            unit.setXml(d.asXML());
            unitDao.save(unit);
            return "ok";
        } else {
            return "no concept";
        }
    }

    public JSONObject getUnitsByUserId(String userId, int page, String sortType, int asc) {

        String sortElement = "createTime";
        Sort sort = new Sort(asc == 1 ? Sort.Direction.ASC : Sort.Direction.DESC, sortElement);

        Pageable pageable = PageRequest.of(page, 10, sort);

        Page<UnitResultDTO> units = unitDao.findByAuthor(userId, pageable);

        JSONObject UnitObject = new JSONObject();
        UnitObject.put("count", units.getTotalElements());
        UnitObject.put("units", units.getContent());

        return UnitObject;

    }

    public JSONObject getUnitsByUserId(String userId, UnitFindDTO unitFindDTO) {
        boolean asc=unitFindDTO.getAsc();
        String sortElement=unitFindDTO.getSortElement();
        int page=unitFindDTO.getPage();
        int pageSize=unitFindDTO.getPageSize();

        Sort sort = new Sort(asc ? Sort.Direction.ASC : Sort.Direction.DESC, sortElement);

        Pageable pageable = PageRequest.of(page, pageSize, sort);

        Page<UnitResultDTO> units = unitDao.findByAuthor(userId, pageable);

        JSONObject UnitObject = new JSONObject();
        UnitObject.put("count", units.getTotalElements());
        UnitObject.put("units", units.getContent());

        return UnitObject;

    }

    public JSONObject searchUnitsByUserId(String searchText, String userId, int page, String sortType, int asc) {

        Sort sort = new Sort(asc == 1 ? Sort.Direction.ASC : Sort.Direction.DESC, "createTime");

        Pageable pageable = PageRequest.of(page, 10, sort);

        Page<UnitResultDTO> units = unitDao.findByNameContainsIgnoreCaseAndAuthor(searchText, userId, pageable);

        JSONObject unitObject = new JSONObject();
        unitObject.put("count", units.getTotalElements());
        unitObject.put("units", units.getContent());

        return unitObject;
    }

    public Unit getUnitByOid(String oid) {
        return unitDao.findByOid(oid);
    }

    public Unit insertUnit(UnitAddDTO unitAddDTO, String uid) {
        Unit unit = new Unit();
        BeanUtils.copyProperties(unitAddDTO, unit);

        Date now = new Date();
        unit.setCreateTime(now);
        unit.setLastModifyTime(now);
        unit.setOid(UUID.randomUUID().toString());
        unit.setAuthor(uid);

        //设置图片
        String path = "/repository/unit/" + UUID.randomUUID().toString() + ".jpg";
        String[] strs = unitAddDTO.getUploadImage().split(",");
        if (strs.length > 1) {
            String imgStr = unitAddDTO.getUploadImage().split(",")[1];
            Utils.base64StrToImage(imgStr, resourcePath + path);
            unit.setImage(path);
        } else {
            unit.setImage("");
        }

        return unitDao.insert(unit);
    }

    public JSONObject updateUnit(UnitUpdateDTO unitUpdateDTO, String uid) {
        JSONObject result = new JSONObject();
        Unit unit_ori = unitDao.findByOid(unitUpdateDTO.getOid());
        String author = unit_ori.getAuthor();
        if (!unit_ori.isLock()) {
            Unit unit = unit_ori;
            BeanUtils.copyProperties(unitUpdateDTO, unit);
            //判断是否为新图片
            String uploadImage = unitUpdateDTO.getUploadImage();
            if (!uploadImage.contains("/unit/") && !uploadImage.equals("")) {
                //删除旧图片
                File file = new File(resourcePath + unit.getImage());
                if (file.exists() && file.isFile())
                    file.delete();
                //添加新图片
                String path = "/unit/" + UUID.randomUUID().toString() + ".jpg";
                String imgStr = uploadImage.split(",")[1];
                Utils.base64StrToImage(imgStr, resourcePath + path);
                unit.setImage(path);
            }
            String authorUserName = author;

            Date now = new Date();
            if (author.equals(uid)) {
                unit.setLastModifyTime(new Date());
                unitDao.save(unit);
                result.put("method", "update");
                result.put("oid", unit.getOid());
            } else {
                UnitVersion unitVersion = new UnitVersion();
                BeanUtils.copyProperties(unit, unitVersion, "id");
                unitVersion.setOid(UUID.randomUUID().toString());
                unitVersion.setOriginOid(unit_ori.getOid());
                unitVersion.setModifier(uid);
                unitVersion.setVerNumber(now.getTime());
                unitVersion.setVerStatus(0);
                userService.messageNumPlusPlus(authorUserName);
                unitVersion.setModifyTime(now);
                unitVersion.setCreator(author);

                unitVersionDao.save(unitVersion);

                unit_ori.setLock(true);
                unitDao.save(unit_ori);

                result.put("method", "version");
                result.put("oid", unitVersion.getOid());


            }
            return result;
        } else {
            return null;
        }

    }

    public int deleteUnit(String oid, String userName) {
        Unit unit = unitDao.findByOid(oid);
        if (unit != null) {
            String image = unit.getImage();
            if (image.contains("/concept/")) {
                File file = new File(resourcePath + unit.getImage());
                if (file.exists() && file.isFile())
                    file.delete();
            }
            unitDao.delete(unit);
            userService.unitMinusMinus(userName);
            return 1;
        } else {
            return -1;
        }
    }


    //tree
    public JSONArray getTree() {
        try {
            modelRepositoryTreeArray = new JSONArray();
            Classification classification;

            traverseJson("TRJJMYDAUJTDDU5J9GPRUWAG7QJ6PHUU", null);

            return modelRepositoryTreeArray;
        } catch (Exception e) {
            System.out.println("分类树生成失败");
            throw new MyException(ResultEnum.ERROR);
        }
    }



    private void traverseJson(String rootId, JSONObject jsonObject) {
        Classification classification = templateClassificationDao.findFirstByOid(rootId);
//        Document document = modelDao.RetrieveDocById(col,rootId);
        JSONObject modelRepositoryTreeObj = new JSONObject();
        String nameEn = classification.getNameEn();
        String nameCn = classification.getNameCn();
        modelRepositoryTreeObj.put("id", rootId);
        modelRepositoryTreeObj.put("nameCn", nameCn);
        modelRepositoryTreeObj.put("nameEn", nameEn);
        if (index == 0) {
            modelRepositoryTreeObj.put("open", true);
        } else {
            modelRepositoryTreeObj.put("open", false);
        }
        List<String> children = classification.getChildrenId();
//        if(children.size()!=0){
//            modelRepositoryTreeObj.put("selectable",false);
//        }else{
//            modelRepositoryTreeObj.put("selectable",true);
//        }
        if (children.size() > 0) {
            JSONArray childrenArray = new JSONArray();
            modelRepositoryTreeObj.put("children", childrenArray);
            for (int i = 0; i < children.size(); i++) {
                index = i;
                String childId = children.get(i).toString();
                traverseJson(childId, modelRepositoryTreeObj);
            }
        }
        if (jsonObject != null) {
            JSONArray parentChildren = jsonObject.getJSONArray("children");
            parentChildren.add(modelRepositoryTreeObj);
        } else {
            modelRepositoryTreeArray.add(modelRepositoryTreeObj);
        }
    }
}
