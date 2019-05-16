package njgis.opengms.portal.service;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.mongodb.client.MongoCollection;
import njgis.opengms.portal.dao.*;
import njgis.opengms.portal.dto.RepositoryQueryDTO;
import njgis.opengms.portal.entity.*;
import njgis.opengms.portal.enums.ResultEnum;
import njgis.opengms.portal.exception.MyException;
import org.bson.Document;
import org.dom4j.DocumentException;
import org.dom4j.DocumentHelper;
import org.dom4j.Element;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.ModelAndView;

import java.text.SimpleDateFormat;
import java.util.*;

@Service
public class RepositoryService {
    private ModelDao modelDao=new ModelDao();

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
        Classification classification = conceptClassificationDao.findFirstByOid(concept.getParentId());
        modelAndView.addObject("info",concept);
        JSONArray classResult=new JSONArray();
        if(classification!=null&&classification.getParentId()!=null){
            Classification classification2 = conceptClassificationDao.findFirstByOid(classification.getParentId());
            classResult.add(classification2.getNameEn());
        }
        classResult.add(classification.getNameEn());

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

        SimpleDateFormat sdf =new SimpleDateFormat("yyyy-MM-dd" );

        List<String> related = concept.getRelated();
        JSONArray relateArray = new JSONArray();
        for(String relatedId :related){
            Concept relatedConcept = conceptDao.findByOid(relatedId);
            String name = relatedConcept.getName_EN();
            JSONObject jsonObject = new JSONObject();
            jsonObject.put("id",relatedId);
            jsonObject.put("name",name);
            relateArray.add(jsonObject);
        }

        modelAndView.addObject("classifications",classResult);
        modelAndView.addObject("localizations",localizationArray);
        modelAndView.addObject("year",Calendar.getInstance().getWeekYear());
        modelAndView.addObject("date",sdf.format(concept.getCreateTime()));
        modelAndView.addObject("related",relateArray);
        concept.setLoadCount(concept.getLoadCount()+1);
        conceptDao.save(concept);

        return modelAndView;
    }

    public JSONObject searchConcept(RepositoryQueryDTO repositoryQueryDTO){
        Sort sort = new Sort(repositoryQueryDTO.getAsc()==1 ? Sort.Direction.ASC : Sort.Direction.DESC, "name");
        Pageable pageable = PageRequest.of(repositoryQueryDTO.getPage(), 10, sort);

        Page<Concept> concepts=conceptDao.findByNameContainsIgnoreCase(repositoryQueryDTO.getSearchText(),pageable);

        JSONObject result=new JSONObject();
        result.put("list",concepts.getContent());
        result.put("total",concepts.getTotalElements());
        return result;
    }

    public JSONObject getConceptList(RepositoryQueryDTO repositoryQueryDTO){
        Sort sort = new Sort(repositoryQueryDTO.getAsc()==1 ? Sort.Direction.ASC : Sort.Direction.DESC, "name");
        Pageable pageable = PageRequest.of(repositoryQueryDTO.getPage(), 10, sort);

        Page<Concept> concepts;
        String classOid=repositoryQueryDTO.getOid();
        if(classOid==""){
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

    //spatialReference
    public ModelAndView getSpatialReferencePage(String id){
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("spatialReferenceInfo");

        SpatialReference spatialReference=spatialReferenceDao.findByOid(id);
        modelAndView.addObject("info",spatialReference);
        spatialReference.setLoadCount(spatialReference.getLoadCount()+1);
        spatialReferenceDao.save(spatialReference);

        Classification classification = spatialReferenceClassificationDao.findFirstByOid(spatialReference.getParentId());

        JSONArray classResult=new JSONArray();
        if(classification!=null&&classification.getParentId()!=null){
            Classification classification2 = spatialReferenceClassificationDao.findFirstByOid(classification.getParentId());
            classResult.add(classification2.getNameEn());
        }
        classResult.add(classification.getNameEn());

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

        SimpleDateFormat sdf =new SimpleDateFormat("yyyy-MM-dd" );

        modelAndView.addObject("classifications",classResult);
        modelAndView.addObject("localizations",localizationArray);
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
        Pageable pageable = PageRequest.of(repositoryQueryDTO.getPage(), 10, sort);

        Page<SpatialReference> spatialReferences=spatialReferenceDao.findByNameContainsIgnoreCase(repositoryQueryDTO.getSearchText(),pageable);
        JSONObject result=new JSONObject();
        result.put("list",spatialReferences.getContent());
        result.put("total",spatialReferences.getTotalElements());
        return result;
    }

    public JSONObject getSpatialReferenceList(RepositoryQueryDTO repositoryQueryDTO){
        Sort sort = new Sort(repositoryQueryDTO.getAsc()==1 ? Sort.Direction.ASC : Sort.Direction.DESC, "name");
        Pageable pageable = PageRequest.of(repositoryQueryDTO.getPage(), 10, sort);

        Page<SpatialReference> spatialReferences;
        String classOid=repositoryQueryDTO.getOid();
        if(classOid==""){
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

    //Unit
    public ModelAndView getUnitPage(String id){
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("unitInfo");

        Unit unit=unitDao.findByOid(id);
        modelAndView.addObject("info",unit);
        unit.setLoadCount(unit.getLoadCount()+1);
        unitDao.save(unit);

        Classification classification = unitClassificationDao.findFirstByOid(unit.getParentId());

        JSONArray classResult=new JSONArray();
        if(classification!=null&&classification.getParentId()!=null){
            Classification classification2 = unitClassificationDao.findFirstByOid(classification.getParentId());
            classResult.add(classification2.getNameEn());
        }
        classResult.add(classification.getNameEn());

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

        SimpleDateFormat sdf =new SimpleDateFormat("yyyy-MM-dd" );

        modelAndView.addObject("classifications",classResult);
        modelAndView.addObject("localizations",localizationArray);
        modelAndView.addObject("year",Calendar.getInstance().getWeekYear());
        modelAndView.addObject("date",sdf.format(unit.getCreateTime()));

        return modelAndView;
    }

    public JSONObject searchUnit(RepositoryQueryDTO repositoryQueryDTO){
        Sort sort = new Sort(repositoryQueryDTO.getAsc()==1 ? Sort.Direction.ASC : Sort.Direction.DESC, "name");
        Pageable pageable = PageRequest.of(repositoryQueryDTO.getPage(), 10, sort);

        Page<Unit> units=unitDao.findByNameContainsIgnoreCase(repositoryQueryDTO.getSearchText(),pageable);

        JSONObject result=new JSONObject();
        result.put("list",units.getContent());
        result.put("total",units.getTotalElements());
        return result;
    }

    public JSONObject getUnitList(RepositoryQueryDTO repositoryQueryDTO){
        Sort sort = new Sort(repositoryQueryDTO.getAsc()==1 ? Sort.Direction.ASC : Sort.Direction.DESC, "name");
        Pageable pageable = PageRequest.of(repositoryQueryDTO.getPage(), 10, sort);

        Page<Unit> units;
        String classOid=repositoryQueryDTO.getOid();
        if(classOid==""){
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

    //Template
    public ModelAndView getTemplatePage(String id){
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("templateInfo");

        Template template=templateDao.findByOid(id);
        modelAndView.addObject("info",template);
        template.setLoadCount(template.getLoadCount()+1);
        templateDao.save(template);

        Classification classification = templateClassificationDao.findFirstByOid(template.getParentId());

        JSONArray classResult=new JSONArray();
        if(classification!=null&&classification.getParentId()!=null){
            Classification classification2 = templateClassificationDao.findFirstByOid(classification.getParentId());
            classResult.add(classification2.getNameEn());
        }
        classResult.add(classification.getNameEn());

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

        SimpleDateFormat sdf =new SimpleDateFormat("yyyy-MM-dd" );

        modelAndView.addObject("classifications",classResult);
        modelAndView.addObject("localizations",localizationArray);
        modelAndView.addObject("year",Calendar.getInstance().getWeekYear());
        modelAndView.addObject("date",sdf.format(template.getCreateTime()));

        return modelAndView;
    }

    public JSONObject searchTemplate(RepositoryQueryDTO repositoryQueryDTO){
        Sort sort = new Sort(repositoryQueryDTO.getAsc()==1 ? Sort.Direction.ASC : Sort.Direction.DESC, "name");
        Pageable pageable = PageRequest.of(repositoryQueryDTO.getPage(), 10, sort);

        Page<Template> templates=templateDao.findByNameContainsIgnoreCase(repositoryQueryDTO.getSearchText(),pageable);

        JSONObject result=new JSONObject();
        result.put("list",templates.getContent());
        result.put("total",templates.getTotalElements());
        return result;
    }

    public JSONObject getTemplateList(RepositoryQueryDTO repositoryQueryDTO){
        Sort sort = new Sort(repositoryQueryDTO.getAsc()==1 ? Sort.Direction.ASC : Sort.Direction.DESC, "name");
        Pageable pageable = PageRequest.of(repositoryQueryDTO.getPage(), 10, sort);

        Page<Template> templates;
        String classOid=repositoryQueryDTO.getOid();
        if(classOid==""){
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
