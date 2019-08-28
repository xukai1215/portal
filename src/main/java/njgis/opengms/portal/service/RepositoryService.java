package njgis.opengms.portal.service;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import njgis.opengms.portal.dao.*;
import njgis.opengms.portal.dto.RepositoryQueryDTO;
import njgis.opengms.portal.dto.community.*;
import njgis.opengms.portal.entity.*;
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

import java.io.File;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
public class RepositoryService {

    @Autowired
    UserService userService;

    @Autowired
    ConceptDao conceptDao;

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

    @Autowired
    SpatialReferenceDao spatialReferenceDao;

    @Autowired
    TemplateDao templateDao;

    @Autowired
    UnitDao unitDao;

    @Value("${resourcePath}")
    private String resourcePath;

    //toUpperCase
    public void toUpperCase(){
        List<Concept> concepts=conceptDao.findAll();
        for (Concept c:concepts
             ) {
            String upperName=c.getName().toUpperCase();
            c.setName(upperName);
            conceptDao.save(c);
        }

        List<SpatialReference> spatialReferences=spatialReferenceDao.findAll();
        for (SpatialReference sr:spatialReferences
                ) {
            String upperName=sr.getName().toUpperCase();
            sr.setName(upperName);
            spatialReferenceDao.save(sr);
        }

        List<Template> templates=templateDao.findAll();
        for (Template t:templates
                ) {
            String upperName=t.getName().toUpperCase();
            t.setName(upperName);
            templateDao.save(t);
        }

        List<Unit> units=unitDao.findAll();
        for (Unit u:units
                ) {
            String upperName=u.getName().toUpperCase();
            u.setName(upperName);
            unitDao.save(u);
        }
    }

    //concept
    public ModelAndView getConceptPage(String id){
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("conceptInfo");

        Concept concept=conceptDao.findByOid(id);
        modelAndView.addObject("info",concept);
        concept.setLoadCount(concept.getLoadCount()+1);
        conceptDao.save(concept);

        //兼容两种格式的数据
        Classification classification = null;

        JSONArray array=new JSONArray();
        JSONArray classResult=new JSONArray();

        if(concept.getParentId()!=null)
        {
            classification = conceptClassificationDao.findFirstByOid(concept.getParentId());

            if(classification!=null&&classification.getParentId()!=null){
                Classification classification2 = conceptClassificationDao.findFirstByOid(classification.getParentId());
                array.add(classification2.getNameEn());
            }
            array.add(classification.getNameEn());
            classResult.add(array);

            org.dom4j.Document d = null;
            JSONArray localizationArray = new JSONArray();
            try {
                d = DocumentHelper.parseText(concept.getXml());
                org.dom4j.Element root=d.getRootElement();
                org.dom4j.Element Localizations = root.element("Localizations");
                List<org.dom4j.Element> LocalizationList = Localizations.elements("Localization");
                for(org.dom4j.Element Localization:LocalizationList){
                    String language = Localization.attributeValue("Local");
                    String name = Localization.attributeValue("Name");
                    String desc = Localization.attributeValue("Description");
                    JSONObject jsonObject = new JSONObject();
                    jsonObject.put("language",language);
                    jsonObject.put("name",name);
                    jsonObject.put("desc",desc);
                    localizationArray.add(jsonObject);
                }
            } catch (DocumentException e) {
                e.printStackTrace();
            }

            localizationArray.sort(new Comparator<Object>() {
                @Override
                public int compare(Object o1, Object o2) {
                    JSONObject a = (JSONObject)o1;
                    JSONObject b = (JSONObject)o2;
                    return a.getString("language").compareToIgnoreCase(b.getString("language"));
                }
            });

            modelAndView.addObject("localizations",localizationArray);

        }else {
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
        }

        SimpleDateFormat sdf =new SimpleDateFormat("yyyy-MM-dd" );

        List<String> related = concept.getRelated();
        JSONArray relateArray = new JSONArray();
        if(related!=null) {
            for (String relatedId : related) {
                Concept relatedConcept = conceptDao.findByOid(relatedId);
                String name = relatedConcept.getName_EN();
                JSONObject jsonObject = new JSONObject();
                jsonObject.put("id", relatedId);
                jsonObject.put("name", name);
                relateArray.add(jsonObject);
            }
        }

        modelAndView.addObject("classifications",classResult);
        modelAndView.addObject("year",Calendar.getInstance().getWeekYear());
        modelAndView.addObject("date",sdf.format(concept.getCreateTime()));
        modelAndView.addObject("related",relateArray);

        return modelAndView;
    }

    public JSONObject searchConcept(RepositoryQueryDTO repositoryQueryDTO){
        Sort sort = new Sort(repositoryQueryDTO.getAsc()==1 ? Sort.Direction.ASC : Sort.Direction.DESC, "name");
        Pageable pageable = PageRequest.of(repositoryQueryDTO.getPage(), repositoryQueryDTO.getPageSize(), sort);

        Page<Concept> concepts=conceptDao.findByNameContainsIgnoreCase(repositoryQueryDTO.getSearchText(),pageable);

        JSONObject result=new JSONObject();
        result.put("list",concepts.getContent());
        result.put("total",concepts.getTotalElements());
        return result;
    }

    public JSONObject getConceptList(RepositoryQueryDTO repositoryQueryDTO){
        Sort sort = new Sort(repositoryQueryDTO.getAsc()==1 ? Sort.Direction.ASC : Sort.Direction.DESC, "name");
        Pageable pageable = PageRequest.of(repositoryQueryDTO.getPage(), repositoryQueryDTO.getPageSize(), sort);

        Page<Concept> concepts;
        String classOid=repositoryQueryDTO.getOid();
        if(classOid==null||classOid.equals("")){
            concepts=conceptDao.findAll(pageable);
        }
        else {
            List<String> clas=new ArrayList<>();
            clas.add(repositoryQueryDTO.getOid());
            Classification cla= conceptClassificationDao.findFirstByOid(clas.get(0));
            for (String c:cla.getChildrenId()
                 ) {
                clas.add(c);
            }
            concepts=conceptDao.findByParentIdIn(clas, pageable);
        }

        JSONObject result=new JSONObject();
        result.put("list",concepts.getContent());
        result.put("total",concepts.getTotalElements());
        return result;
    }

    public JSONObject getConceptsByUserId(String userId, int page, String sortType, int asc){

        Sort sort = new Sort(asc==1 ? Sort.Direction.ASC : Sort.Direction.DESC, "createTime");

        Pageable pageable = PageRequest.of(page, 10, sort);

        Page<ConceptResultDTO> concepts = conceptDao.findByAuthor(userId,pageable);

        JSONObject ConceptObject = new JSONObject();
        ConceptObject.put("count",concepts.getTotalElements());
        ConceptObject.put("concepts",concepts.getContent());

        return ConceptObject;

    }

    public String addConceptLocalization(String id,String language,String name,String desc){
        Concept concept = conceptDao.findByOid(id);
        if(concept!=null){
            String xml = concept.getXml();
            org.dom4j.Document d = null;
            try {
                d = DocumentHelper.parseText(xml);
                org.dom4j.Element root=d.getRootElement();
                org.dom4j.Element Localizations = root.element("Localizations");
                org.dom4j.Element Localization = Localizations.addElement("Localization");
                Localization.addAttribute("Local",language);
                Localization.addAttribute("Name",name);
                Localization.addAttribute("Description",desc);
            } catch (DocumentException e) {
                e.printStackTrace();
            }
            concept.setXml(d.asXML());
            conceptDao.save(concept);
            return "ok";
        }else{
            return "no concept";
        }
    }

    public Concept getConceptByOid(String oid){
        return conceptDao.findByOid(oid);

        //模型的dao层还有详情页面？？

    }

    public JSONObject searchConceptsByUserId(String searchText,String userId, int page, String sortType, int asc){

        Sort sort = new Sort(asc==1 ? Sort.Direction.ASC : Sort.Direction.DESC, "createTime");

        Pageable pageable = PageRequest.of(page, 10, sort);

        Page<ConceptResultDTO> concepts = conceptDao.findByNameContainsIgnoreCaseAndAuthor(searchText,userId,pageable);

        JSONObject conceptObject = new JSONObject();
        conceptObject.put("count",concepts.getTotalElements());
        conceptObject.put("concepts",concepts.getContent());

        return conceptObject;
    }

    public Concept insertConcept(ConceptAddDTO conceptAddDTO,String uid){
        Concept concept = new Concept();
        BeanUtils.copyProperties(conceptAddDTO,concept);

        Date now = new Date();
        concept.setCreateTime(now);
        concept.setOid(UUID.randomUUID().toString());
        concept.setAuthor(uid);

        //设置图片
        String path = "/repository/concept/" + UUID.randomUUID().toString() + ".jpg";
        String[] strs = conceptAddDTO.getUploadImage().split(",");
        if(strs.length>1) {
            String imgStr = conceptAddDTO.getUploadImage().split(",")[1];
            Utils.base64StrToImage(imgStr, resourcePath + path);
            concept.setImage(path);
        }
        else {
            concept.setImage("");
        }

        return conceptDao.insert(concept);
    }

    public String updateConcept(ConceptUpdateDTO conceptUpdateDTO){
        Concept concept = conceptDao.findByOid(conceptUpdateDTO.getOid());
        BeanUtils.copyProperties(conceptUpdateDTO,concept);
        //判断是否为新图片
        String uploadImage=conceptUpdateDTO.getUploadImage();
        if(!uploadImage.contains("/concept/") && uploadImage!="") {
            //删除旧图片
            File file=new File(resourcePath+concept.getImage());
            if(file.exists()&&file.isFile())
                file.delete();
            //添加新图片
            String path = "/concept/" + UUID.randomUUID().toString() + ".jpg";
            String imgStr = uploadImage.split(",")[1];
            Utils.base64StrToImage(imgStr, resourcePath + path);
            concept.setImage(path);
        }
        concept.setLastModifyTime(new Date());
        conceptDao.save(concept);

        return concept.getOid();
    }

    public int deleteConcept(String oid,String userName){
        Concept concept = conceptDao.findByOid(oid);
        if(concept!=null){
            String image = concept.getImage();
            if(image.contains("/concept/")){
                File file = new File(resourcePath+concept.getImage());
                if(file.exists() && file.isFile())
                    file.delete();
            }
            conceptDao.delete(concept);
            userService.conceptMinusMinus(userName);
            return 1;
        }else{
            return -1;
        }
    }





    //spatialReference
    public ModelAndView getSpatialReferencePage(String id){
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("spatialReferenceInfo");

        SpatialReference spatialReference=spatialReferenceDao.findByOid(id);
        modelAndView.addObject("info",spatialReference);
        spatialReference.setLoadCount(spatialReference.getLoadCount()+1);
        spatialReferenceDao.save(spatialReference);


        //兼容两种格式的数据
        Classification classification = null;

        JSONArray array=new JSONArray();
        JSONArray classResult=new JSONArray();

        if(spatialReference.getParentId()!=null)
        {
            classification = spatialReferenceClassificationDao.findFirstByOid(spatialReference.getParentId());

            if(classification!=null&&classification.getParentId()!=null){
                Classification classification2 = spatialReferenceClassificationDao.findFirstByOid(classification.getParentId());
                array.add(classification2.getNameEn());
            }
            array.add(classification.getNameEn());
            classResult.add(array);

            org.dom4j.Document d = null;
            JSONArray localizationArray = new JSONArray();
            try {
                d = DocumentHelper.parseText(spatialReference.getXml());
                org.dom4j.Element root=d.getRootElement();
//            org.dom4j.Element Localizations = root.element("Localizations");
                List<org.dom4j.Element> LocalizationList = root.elements("Localization");
                for(org.dom4j.Element Localization:LocalizationList){
                    String language = Localization.attributeValue("local");
                    String name = Localization.attributeValue("name");
                    String desc = Localization.attributeValue("description");
                    JSONObject jsonObject = new JSONObject();
                    jsonObject.put("language",language);
                    jsonObject.put("name",name);
                    jsonObject.put("desc",desc);
                    localizationArray.add(jsonObject);
                }
            } catch (DocumentException e) {
                e.printStackTrace();
            }

            localizationArray.sort(new Comparator<Object>() {
                @Override
                public int compare(Object o1, Object o2) {
                    JSONObject a = (JSONObject)o1;
                    JSONObject b = (JSONObject)o2;
                    return a.getString("language").compareToIgnoreCase(b.getString("language"));
                }
            });
            modelAndView.addObject("localizations",localizationArray);
        }else{
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
        }

        SimpleDateFormat sdf =new SimpleDateFormat("yyyy-MM-dd" );

        modelAndView.addObject("classifications",classResult);
        modelAndView.addObject("year",Calendar.getInstance().getWeekYear());
        modelAndView.addObject("date",sdf.format(spatialReference.getCreateTime()));

        return modelAndView;
    }

    public String addSpatialReferenceLocalization(String id,String language,String name,String desc){
        SpatialReference spatialReference=spatialReferenceDao.findByOid(id);
        if(spatialReference!=null){
            String xml = spatialReference.getXml();
            org.dom4j.Document d = null;
            try {
                d = DocumentHelper.parseText(xml);
                org.dom4j.Element root=d.getRootElement();
                org.dom4j.Element Localization = root.addElement("Localization");
                Localization.addAttribute("local",language);
                Localization.addAttribute("name",name);
                Localization.addAttribute("description",desc);
            } catch (DocumentException e) {
                e.printStackTrace();
            }
            spatialReference.setXml(d.asXML());
            spatialReferenceDao.save(spatialReference);
            return "ok";
        }else{
            return "no concept";
        }
    }

    public JSONObject searchSpatialReference(RepositoryQueryDTO repositoryQueryDTO){
        Sort sort = new Sort(repositoryQueryDTO.getAsc()==1 ? Sort.Direction.ASC : Sort.Direction.DESC, "name");
        Pageable pageable = PageRequest.of(repositoryQueryDTO.getPage(), repositoryQueryDTO.getPageSize(), sort);

        Page<SpatialReference> spatialReferences=spatialReferenceDao.findByNameContainsIgnoreCase(repositoryQueryDTO.getSearchText(),pageable);
        JSONObject result=new JSONObject();
        result.put("list",spatialReferences.getContent());
        result.put("total",spatialReferences.getTotalElements());
        return result;
    }

    public JSONObject getSpatialReferenceList(RepositoryQueryDTO repositoryQueryDTO){
        Sort sort = new Sort(repositoryQueryDTO.getAsc()==1 ? Sort.Direction.ASC : Sort.Direction.DESC, "name");
        Pageable pageable = PageRequest.of(repositoryQueryDTO.getPage(), repositoryQueryDTO.getPageSize(), sort);

        Page<SpatialReference> spatialReferences;
        String classOid=repositoryQueryDTO.getOid();
        if(classOid==null||classOid.equals("")){
            spatialReferences=spatialReferenceDao.findAll(pageable);
        }
        else {
            List<String> clas=new ArrayList<>();
            clas.add(repositoryQueryDTO.getOid());
            Classification cla= spatialReferenceClassificationDao.findFirstByOid(clas.get(0));
            for (String c:cla.getChildrenId()
                    ) {
                clas.add(c);
            }
            spatialReferences=spatialReferenceDao.findByParentIdIn(clas, pageable);
        }

        JSONObject result=new JSONObject();
        result.put("list",spatialReferences.getContent());
        result.put("total",spatialReferences.getTotalElements());
        return result;
    }

    public JSONObject getSpatialsByUserId(String userId, int page, String sortType, int asc){

        Sort sort = new Sort(asc==1 ? Sort.Direction.ASC : Sort.Direction.DESC, "createTime");

        Pageable pageable = PageRequest.of(page, 10, sort);

        Page<SpatialResultDTO> spatials = spatialReferenceDao.findByAuthor(userId,pageable);

        JSONObject SpatialObject = new JSONObject();
        SpatialObject.put("count",spatials.getTotalElements());
        SpatialObject.put("spatials",spatials.getContent());

        return SpatialObject;

    }

    public JSONObject searchSpatialsByUserId(String searchText,String userId, int page, String sortType, int asc){

        Sort sort = new Sort(asc==1 ? Sort.Direction.ASC : Sort.Direction.DESC, "createTime");

        Pageable pageable = PageRequest.of(page, 10, sort);

        Page<SpatialResultDTO> spatials = spatialReferenceDao.findByNameContainsIgnoreCaseAndAuthor(searchText,userId,pageable);

        JSONObject spatialObject = new JSONObject();
        spatialObject.put("count",spatials.getTotalElements());
        spatialObject.put("spatials",spatials.getContent());

        return spatialObject;
    }

    public SpatialReference getSpatialByOid(String oid)
    {
        return spatialReferenceDao.findByOid(oid);
    }

    public SpatialReference insertSpatial(SpatialAddDTO spatialAddDTO,String uid){
        SpatialReference spatial = new SpatialReference();
        BeanUtils.copyProperties(spatialAddDTO,spatial);

        Date now = new Date();
        spatial.setCreateTime(now);
        spatial.setOid(UUID.randomUUID().toString());
        spatial.setAuthor(uid);

        //设置图片
        String path = "/repository/spatialReference/" + UUID.randomUUID().toString() + ".jpg";
        String[] strs = spatialAddDTO.getUploadImage().split(",");
        if(strs.length>1) {
            String imgStr = spatialAddDTO.getUploadImage().split(",")[1];
            Utils.base64StrToImage(imgStr, resourcePath + path);
            spatial.setImage(path);
        }
        else {
            spatial.setImage("");
        }

        return spatialReferenceDao.insert(spatial);
    }

    public String updateSpatial(SpatialUpdateDTO spatialUpdateDTO){
        SpatialReference spatial = spatialReferenceDao.findByOid(spatialUpdateDTO.getOid());
        BeanUtils.copyProperties(spatialUpdateDTO,spatial);
        //判断是否为新图片
        String uploadImage=spatialUpdateDTO.getUploadImage();
        if(!uploadImage.contains("/spatial/") && uploadImage!="") {
            //删除旧图片
            File file=new File(resourcePath+spatial.getImage());
            if(file.exists()&&file.isFile())
                file.delete();
            //添加新图片
            String path = "/spatial/" + UUID.randomUUID().toString() + ".jpg";
            String imgStr = uploadImage.split(",")[1];
            Utils.base64StrToImage(imgStr, resourcePath + path);
            spatial.setImage(path);
        }
        spatial.setLastModifyTime(new Date());
        spatialReferenceDao.save(spatial);

        return spatial.getOid();
    }

    public int deleteSpatial(String oid,String userName){
        SpatialReference spatial = spatialReferenceDao.findByOid(oid);
        if(spatial!=null){
            String image = spatial.getImage();
            if(image.contains("/concept/")){
                File file = new File(resourcePath+spatial.getImage());
                if(file.exists() && file.isFile())
                    file.delete();
            }
            spatialReferenceDao.delete(spatial);
            userService.spatialMinusMinus(userName);
            return 1;
        }else{
            return -1;
        }
    }





    //Template
    public ModelAndView getTemplatePage(String id){
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("templateInfo");

        Template template=templateDao.findByOid(id);
        modelAndView.addObject("info",template);
        template.setLoadCount(template.getLoadCount()+1);
        templateDao.save(template);

        //兼容两种格式的数据
        Classification classification = null;

        JSONArray array=new JSONArray();
        JSONArray classResult=new JSONArray();

        if(template.getParentId()!=null)
        {
            classification = templateClassificationDao.findFirstByOid(template.getParentId());

            if(classification!=null&&classification.getParentId()!=null){
                Classification classification2 = templateClassificationDao.findFirstByOid(classification.getParentId());
                array.add(classification2.getNameEn());
            }
            array.add(classification.getNameEn());
            classResult.add(array);

            org.dom4j.Document d = null;
            JSONArray localizationArray = new JSONArray();
            try {
                d = DocumentHelper.parseText(template.getXml());
                org.dom4j.Element root=d.getRootElement();
//            org.dom4j.Element Localizations = root.element("Localizations");
                List<org.dom4j.Element> LocalizationList = root.elements("Localization");
                for(org.dom4j.Element Localization:LocalizationList){
                    String language = Localization.attributeValue("Local");
                    String name = Localization.attributeValue("Name");
                    String desc = Localization.attributeValue("Description");
                    JSONObject jsonObject = new JSONObject();
                    jsonObject.put("language",language);
                    jsonObject.put("name",name);
                    jsonObject.put("desc",desc);
                    localizationArray.add(jsonObject);
                }
            } catch (DocumentException e) {
                e.printStackTrace();
            }

            localizationArray.sort(new Comparator<Object>() {
                @Override
                public int compare(Object o1, Object o2) {
                    JSONObject a = (JSONObject)o1;
                    JSONObject b = (JSONObject)o2;
                    return a.getString("language").compareToIgnoreCase(b.getString("language"));
                }
            });
            modelAndView.addObject("localizations",localizationArray);
        }else{
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
        }

        SimpleDateFormat sdf =new SimpleDateFormat("yyyy-MM-dd" );

        modelAndView.addObject("classifications",classResult);
        modelAndView.addObject("year",Calendar.getInstance().getWeekYear());
        modelAndView.addObject("date",sdf.format(template.getCreateTime()));

        return modelAndView;
    }

    public JSONObject searchTemplate(RepositoryQueryDTO repositoryQueryDTO){
        Sort sort = new Sort(repositoryQueryDTO.getAsc()==1 ? Sort.Direction.ASC : Sort.Direction.DESC, "name");
        Pageable pageable = PageRequest.of(repositoryQueryDTO.getPage(), repositoryQueryDTO.getPageSize(), sort);

        Page<Template> templates=templateDao.findByNameContainsIgnoreCase(repositoryQueryDTO.getSearchText(),pageable);

        JSONObject result=new JSONObject();
        result.put("list",templates.getContent());
        result.put("total",templates.getTotalElements());
        return result;
    }

    public JSONObject getTemplateList(RepositoryQueryDTO repositoryQueryDTO){
        Sort sort = new Sort(repositoryQueryDTO.getAsc()==1 ? Sort.Direction.ASC : Sort.Direction.DESC, "name");
        Pageable pageable = PageRequest.of(repositoryQueryDTO.getPage(), repositoryQueryDTO.getPageSize(), sort);

        Page<Template> templates;
        String classOid=repositoryQueryDTO.getOid();
        if(classOid==null||classOid.equals("")){
            templates=templateDao.findAll(pageable);
        }
        else {
            List<String> clas=new ArrayList<>();
            clas.add(repositoryQueryDTO.getOid());
            Classification cla= templateClassificationDao.findFirstByOid(clas.get(0));
            for (String c:cla.getChildrenId()
            ) {
                clas.add(c);
            }
            templates=templateDao.findByParentIdIn(clas, pageable);
        }

        JSONObject result=new JSONObject();
        result.put("list",templates.getContent());
        result.put("total",templates.getTotalElements());
        return result;
    }

    public JSONObject getTemplatesByUserId(String userId, int page, String sortType, int asc){

        Sort sort = new Sort(asc==1 ? Sort.Direction.ASC : Sort.Direction.DESC, "createTime");

        Pageable pageable = PageRequest.of(page, 10, sort);

        Page<TemplateResultDTO> templates = templateDao.findByAuthor(userId,pageable);

        JSONObject TemplateObject = new JSONObject();
        TemplateObject.put("count",templates.getTotalElements());
        TemplateObject.put("templates",templates.getContent());

        return TemplateObject;

    }

    public JSONObject searchTemplatesByUserId(String searchText,String userId, int page, String sortType, int asc){

        Sort sort = new Sort(asc==1 ? Sort.Direction.ASC : Sort.Direction.DESC, "createTime");

        Pageable pageable = PageRequest.of(page, 10, sort);

        Page<TemplateResultDTO> templates = templateDao.findByNameContainsIgnoreCaseAndAuthor(searchText,userId,pageable);

        JSONObject templateObject = new JSONObject();
        templateObject.put("count",templates.getTotalElements());
        templateObject.put("templates",templates.getContent());

        return templateObject;
    }

    public Template getTemplateByOid(String oid)
    {
        return templateDao.findByOid(oid);
    }

    public Template insertTemplate(TemplateAddDTO templateAddDTO,String uid){
        Template template = new Template();
        BeanUtils.copyProperties(templateAddDTO,template);

        Date now = new Date();
        template.setCreateTime(now);
        template.setOid(UUID.randomUUID().toString());
        template.setAuthor(uid);

        //设置图片
        String path = "/repository/template/" + UUID.randomUUID().toString() + ".jpg";
        String[] strs = templateAddDTO.getUploadImage().split(",");
        if(strs.length>1) {
            String imgStr = templateAddDTO.getUploadImage().split(",")[1];
            Utils.base64StrToImage(imgStr, resourcePath + path);
            template.setImage(path);
        }
        else {
            template.setImage("");
        }

        return templateDao.insert(template);
    }

    public String updateTemplate(TemplateUpdateDTO templateUpdateDTO){
        Template template = templateDao.findByOid(templateUpdateDTO.getOid());
        BeanUtils.copyProperties(templateUpdateDTO,template);
        //判断是否为新图片
        String uploadImage=templateUpdateDTO.getUploadImage();
        if(!uploadImage.contains("/template/") && uploadImage!="") {
            //删除旧图片
            File file=new File(resourcePath+template.getImage());
            if(file.exists()&&file.isFile())
                file.delete();
            //添加新图片
            String path = "/template/" + UUID.randomUUID().toString() + ".jpg";
            String imgStr = uploadImage.split(",")[1];
            Utils.base64StrToImage(imgStr, resourcePath + path);
            template.setImage(path);
        }
        template.setLastModifyTime(new Date());
        templateDao.save(template);

        return template.getOid();
    }

    public int deleteTemplate(String oid,String userName){
        Template template = templateDao.findByOid(oid);
        if(template!=null){
            String image = template.getImage();
            if(image.contains("/concept/")){
                File file = new File(resourcePath+template.getImage());
                if(file.exists() && file.isFile())
                    file.delete();
            }
            templateDao.delete(template);
            userService.templateMinusMinus(userName);
            return 1;
        }else{
            return -1;
        }
    }




    //Unit
    public ModelAndView getUnitPage(String id){
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("unitInfo");

        Unit unit=unitDao.findByOid(id);
        modelAndView.addObject("info",unit);
        unit.setLoadCount(unit.getLoadCount()+1);
        unitDao.save(unit);

        //兼容两种格式的数据
        Classification classification = null;

        JSONArray array=new JSONArray();
        JSONArray classResult=new JSONArray();

        if(unit.getParentId()!=null)
        {
            classification = unitClassificationDao.findFirstByOid(unit.getParentId());

            if(classification!=null&&classification.getParentId()!=null){
                Classification classification2 = unitClassificationDao.findFirstByOid(classification.getParentId());
                array.add(classification2.getNameEn());
            }
            array.add(classification.getNameEn());
            classResult.add(array);

            org.dom4j.Document d = null;
            JSONArray localizationArray = new JSONArray();
            try {
                d = DocumentHelper.parseText(unit.getXml());
                org.dom4j.Element root=d.getRootElement();
                org.dom4j.Element Localizations = root.element("Localizations");
                List<org.dom4j.Element> LocalizationList = Localizations.elements("Localization");
                for(org.dom4j.Element Localization:LocalizationList){
                    String language = Localization.attributeValue("Local");
                    String name = Localization.attributeValue("Name");
                    String desc = Localization.attributeValue("Description");
                    JSONObject jsonObject = new JSONObject();
                    jsonObject.put("language",language);
                    jsonObject.put("name",name);
                    jsonObject.put("desc",desc);
                    localizationArray.add(jsonObject);
                }
            } catch (DocumentException e) {
                e.printStackTrace();
            }

            localizationArray.sort(new Comparator<Object>() {
                @Override
                public int compare(Object o1, Object o2) {
                    JSONObject a = (JSONObject)o1;
                    JSONObject b = (JSONObject)o2;
                    return a.getString("language").compareToIgnoreCase(b.getString("language"));
                }
            });
            modelAndView.addObject("localizations",localizationArray);
        }else{
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
        }

        SimpleDateFormat sdf =new SimpleDateFormat("yyyy-MM-dd" );

        modelAndView.addObject("classifications",classResult);
        modelAndView.addObject("year",Calendar.getInstance().getWeekYear());
        modelAndView.addObject("date",sdf.format(unit.getCreateTime()));

        return modelAndView;
    }

    public JSONObject searchUnit(RepositoryQueryDTO repositoryQueryDTO){
        Sort sort = new Sort(repositoryQueryDTO.getAsc()==1 ? Sort.Direction.ASC : Sort.Direction.DESC, "name");
        Pageable pageable = PageRequest.of(repositoryQueryDTO.getPage(), repositoryQueryDTO.getPageSize(), sort);

        Page<Unit> units=unitDao.findByNameContainsIgnoreCase(repositoryQueryDTO.getSearchText(),pageable);

        JSONObject result=new JSONObject();
        result.put("list",units.getContent());
        result.put("total",units.getTotalElements());
        return result;
    }

    public JSONObject getUnitList(RepositoryQueryDTO repositoryQueryDTO){
        Sort sort = new Sort(repositoryQueryDTO.getAsc()==1 ? Sort.Direction.ASC : Sort.Direction.DESC, "name");
        Pageable pageable = PageRequest.of(repositoryQueryDTO.getPage(), repositoryQueryDTO.getPageSize(), sort);

        Page<Unit> units;
        String classOid=repositoryQueryDTO.getOid();
        if(classOid==null||classOid.equals("")){
            units=unitDao.findAll(pageable);
        }
        else {
            List<String> clas=new ArrayList<>();
            clas.add(repositoryQueryDTO.getOid());
            Classification cla= unitClassificationDao.findFirstByOid(clas.get(0));
            for (String c:cla.getChildrenId()
                    ) {
                clas.add(c);
            }
            units=unitDao.findByParentIdIn(clas, pageable);
        }

        JSONObject result=new JSONObject();
        result.put("list",units.getContent());
        result.put("total",units.getTotalElements());
        return result;
    }

    public String addUnitLocalization(String id,String language,String name,String desc){
        Unit unit = unitDao.findByOid(id);
        if(unit!=null){
            String xml = unit.getXml();
            org.dom4j.Document d = null;
            try {
                d = DocumentHelper.parseText(xml);
                org.dom4j.Element root=d.getRootElement();
                org.dom4j.Element Localizations = root.element("Localizations");
                org.dom4j.Element Localization = Localizations.addElement("Localization");
                Localization.addAttribute("Local",language);
                Localization.addAttribute("Name",name);
                Localization.addAttribute("Description",desc);
            } catch (DocumentException e) {
                e.printStackTrace();
            }
            unit.setXml(d.asXML());
            unitDao.save(unit);
            return "ok";
        }else{
            return "no concept";
        }
    }

    public JSONObject getUnitsByUserId(String userId, int page, String sortType, int asc){

        String sortElement="createTime";
        Sort sort = new Sort(asc==1 ? Sort.Direction.ASC : Sort.Direction.DESC, sortElement);

        Pageable pageable = PageRequest.of(page, 10, sort);

        Page<UnitResultDTO> units = unitDao.findByAuthor(userId,pageable);

        JSONObject UnitObject = new JSONObject();
        UnitObject.put("count",units.getTotalElements());
        UnitObject.put("units",units.getContent());

        return UnitObject;

    }

    public JSONObject searchUnitsByUserId(String searchText,String userId, int page, String sortType, int asc){

        Sort sort = new Sort(asc==1 ? Sort.Direction.ASC : Sort.Direction.DESC, "createTime");

        Pageable pageable = PageRequest.of(page, 10, sort);

        Page<UnitResultDTO> units = unitDao.findByNameContainsIgnoreCaseAndAuthor(searchText,userId,pageable);

        JSONObject unitObject = new JSONObject();
        unitObject.put("count",units.getTotalElements());
        unitObject.put("units",units.getContent());

        return unitObject;
    }

    public Unit getUnitByOid(String oid)
    {
        return unitDao.findByOid(oid);
    }

    public Unit insertUnit(UnitAddDTO unitAddDTO,String uid){
        Unit unit = new Unit();
        BeanUtils.copyProperties(unitAddDTO,unit);

        Date now = new Date();
        unit.setCreateTime(now);
        unit.setOid(UUID.randomUUID().toString());
        unit.setAuthor(uid);

        //设置图片
        String path = "/repository/unit/" + UUID.randomUUID().toString() + ".jpg";
        String[] strs = unitAddDTO.getUploadImage().split(",");
        if(strs.length>1) {
            String imgStr = unitAddDTO.getUploadImage().split(",")[1];
            Utils.base64StrToImage(imgStr, resourcePath + path);
            unit.setImage(path);
        }
        else {
            unit.setImage("");
        }

        return unitDao.insert(unit);
    }

    public String updateUnit(UnitUpdateDTO unitUpdateDTO){
        Unit unit = unitDao.findByOid(unitUpdateDTO.getOid());
        BeanUtils.copyProperties(unitUpdateDTO,unit);
        //判断是否为新图片
        String uploadImage=unitUpdateDTO.getUploadImage();
        if(!uploadImage.contains("/unit/") && uploadImage!="") {
            //删除旧图片
            File file=new File(resourcePath+unit.getImage());
            if(file.exists()&&file.isFile())
                file.delete();
            //添加新图片
            String path = "/unit/" + UUID.randomUUID().toString() + ".jpg";
            String imgStr = uploadImage.split(",")[1];
            Utils.base64StrToImage(imgStr, resourcePath + path);
            unit.setImage(path);
        }
        unit.setLastModifyTime(new Date());
        unitDao.save(unit);

        return unit.getOid();
    }

    public int deleteUnit(String oid,String userName){
        Unit unit = unitDao.findByOid(oid);
        if(unit!=null){
            String image = unit.getImage();
            if(image.contains("/concept/")){
                File file = new File(resourcePath+unit.getImage());
                if(file.exists() && file.isFile())
                    file.delete();
            }
            unitDao.delete(unit);
            userService.unitMinusMinus(userName);
            return 1;
        }else{
            return -1;
        }
    }


    //tree
    public JSONArray getTree(){
        try {
            modelRepositoryTreeArray=new JSONArray();
            Classification classification;

            traverseJson("TRJJMYDAUJTDDU5J9GPRUWAG7QJ6PHUU",null);

            return modelRepositoryTreeArray;
        }
        catch (Exception e)  {
            System.out.println("分类树生成失败");
            throw new MyException(ResultEnum.ERROR);
        }
    }

    private void traverseJson(String rootId, JSONObject jsonObject) {
        Classification classification=templateClassificationDao.findFirstByOid(rootId);
//        Document document = modelDao.RetrieveDocById(col,rootId);
        JSONObject modelRepositoryTreeObj = new JSONObject();
        String nameEn=classification.getNameEn();
        String nameCn=classification.getNameCn();
        modelRepositoryTreeObj.put("id",rootId);
        modelRepositoryTreeObj.put("nameCn",nameCn);
        modelRepositoryTreeObj.put("nameEn",nameEn);
        if(index==0){
            modelRepositoryTreeObj.put("open",true);
        }else{
        modelRepositoryTreeObj.put("open",false);
        }
        List<String> children = classification.getChildrenId();
//        if(children.size()!=0){
//            modelRepositoryTreeObj.put("selectable",false);
//        }else{
//            modelRepositoryTreeObj.put("selectable",true);
//        }
        if(children.size()>0){
            JSONArray childrenArray = new JSONArray();
            modelRepositoryTreeObj.put("children",childrenArray);
            for(int i=0;i<children.size();i++){
                index = i;
                String childId=children.get(i).toString();
                traverseJson(childId,modelRepositoryTreeObj);
            }
        }
        if(jsonObject!=null){
            JSONArray parentChildren = jsonObject.getJSONArray("children");
            parentChildren.add(modelRepositoryTreeObj);
        }else{
            modelRepositoryTreeArray.add(modelRepositoryTreeObj);
        }
    }
}
