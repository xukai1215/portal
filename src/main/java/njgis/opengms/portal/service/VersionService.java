package njgis.opengms.portal.service;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import njgis.opengms.portal.dao.*;
import njgis.opengms.portal.entity.*;
import njgis.opengms.portal.entity.support.AuthorInfo;
import njgis.opengms.portal.entity.support.Localization;
import njgis.opengms.portal.entity.support.ModelItemRelate;
import njgis.opengms.portal.entity.support.ModelRelation;
import njgis.opengms.portal.exception.MyException;
import njgis.opengms.portal.utils.ResultUtils;
import njgis.opengms.portal.utils.deCode;
import org.dom4j.DocumentException;
import org.dom4j.DocumentHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.ModelAndView;

import java.text.SimpleDateFormat;
import java.util.*;

@Service

public class VersionService {

    @Autowired
    ClassificationService classificationService;

    @Autowired
    Classification2Service classification2Service;

    @Autowired
    UserDao userDao;

    @Autowired
    UserService userService;

    @Autowired
    ModelItemDao modelItemDao;

    @Autowired
    DataItemDao dataItemDao;

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
    ConceptDao conceptDao;

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

    @Autowired
    DataItemVersionDao dataItemVersionDao;

    @Autowired
    CategoryDao categoryDao;

    @Autowired
    DataApplicationVersionDao dataApplicationVersionDao;

    @Autowired
    DataHubsVersionDao dataHubsVersionDao;

    @Autowired
    DataCategorysDao dataCategorysDao;

    @Autowired
    CommonService commonService;


    @Value("${resourcePath}")
    private String resourcePath;

    @Value("${htmlLoadPath}")
    private String htmlLoadPath;

    public ModelAndView getPage4Compare(String id){
        //条目信息
        ModelItem modelInfo=modelItemDao.findFirstByOid(id);

        Sort sort = new Sort(Sort.Direction.ASC, "verNumber");
        Pageable pageable = PageRequest.of(0,999, sort);
        List<ModelItemVersion> modelItemVersionList = modelItemVersionDao.findAllByOriginOid(id,pageable);

        ModelItemVersion modelItemVersion=new ModelItemVersion();
        for(int i=0;i<modelItemVersionList.size();i++){
            if(modelItemVersionList.get(i).getVerStatus()==0){
                modelItemVersion=modelItemVersionList.get(i);
                break;
            }
        }
        //类
        JSONArray classResult=new JSONArray();

        List<String> classifications = modelInfo.getClassifications();
        for(int i=0;i<classifications.size();i++){

            JSONArray array=new JSONArray();
            String classId=classifications.get(i);

            do{
                Classification classification=classificationService.getByOid(classId);
                array.add(classification.getNameEn());
                classId=classification.getParentId();
            }while(classId!=null);

            JSONArray array1=new JSONArray();
            for(int j=array.size()-1;j>=0;j--){
                array1.add(array.getString(j));
            }

            classResult.add(array1);

        }

        JSONArray classResult1=new JSONArray();

        List<String> classifications1 = modelItemVersion.getClassifications();
        if(classifications1==null){
            classifications1 = new ArrayList<>();
        }
        for(int i=0;i<classifications1.size();i++){

            JSONArray array=new JSONArray();
            String classId=classifications1.get(i);

            do{
                Classification classification=classificationService.getByOid(classId);
                array.add(classification.getNameEn());
                classId=classification.getParentId();
            }while(classId!=null);

            JSONArray array1=new JSONArray();
            for(int j=array.size()-1;j>=0;j--){
                array1.add(array.getString(j));
            }

            classResult1.add(array1);

        }

        JSONArray classResult2 = new JSONArray();

        List<String> classifications2 = modelItemVersion.getClassifications2();
        for(int i=0;classifications2!=null&&i<classifications2.size();i++){

            JSONArray array=new JSONArray();
            String classId=classifications2.get(i);

            do{
                Classification classification=classification2Service.getByOid(classId);
                array.add(classification.getNameEn());
                classId=classification.getParentId();
            }while(classId!=null);

            JSONArray array1=new JSONArray();
            for(int j=array.size()-1;j>=0;j--){
                array1.add(array.getString(j));
            }

            classResult2.add(array1);

        }

        //详情页面
        String detailResult = "";
        List<Localization> localizationList = modelInfo.getLocalizationList();
        //先找中英文描述
        for(Localization localization:localizationList){
            String local = localization.getLocalCode();
            if(local.equals("en")||local.equals("zh")||local.contains("en-")||local.contains("zh-")){
                String localDesc = localization.getDescription();
                if(localDesc!=null&&!localDesc.equals("")) {
//                    detailLanguage = localization.getLocalName();
                    detailResult = localization.getDescription();
                    break;
                }
            }
        }
        //如果没有中英文，则使用其他语言描述
        if(detailResult.equals("")){
            for(Localization localization:localizationList){
                String localDesc = localization.getDescription();
                if(localDesc!=null&&!localDesc.equals("")) {
//                    detailLanguage = localization.getLocalName();
                    detailResult = localization.getDescription();
                    break;
                }
            }
        }

        String detailResult1 = "";
        List<Localization> localizationList1 = modelItemVersion.getLocalizationList();
        //先找中英文描述
        for(Localization localization:localizationList1){
            String local = localization.getLocalCode();
            if(local.equals("en")||local.equals("zh")||local.contains("en-")||local.contains("zh-")){
                String localDesc = localization.getDescription();
                if(localDesc!=null&&!localDesc.equals("")) {
//                    detailLanguage = localization.getLocalName();
                    detailResult1 = localization.getDescription();
                    break;
                }
            }
        }
        //如果没有中英文，则使用其他语言描述
        if(detailResult.equals("")){
            for(Localization localization:localizationList1){
                String localDesc = localization.getDescription();
                if(localDesc!=null&&!localDesc.equals("")) {
//                    detailLanguage = localization.getLocalName();
                    detailResult1 = localization.getDescription();
                    break;
                }
            }
        }

        //图片路径
        String image=modelInfo.getImage();
        if(!image.equals("")){
            modelInfo.setImage(htmlLoadPath+image);
        }

        String image1=modelItemVersion.getImage();
        if(!image1.equals("")){
            modelItemVersion.setImage(htmlLoadPath+image1);
        }

        //relate
        ModelItemRelate modelItemRelate=modelInfo.getRelate();
        List<ModelRelation> modelItems = modelInfo.getModelRelationList();
        List<String> dataItems=modelInfo.getRelatedData();
        List<String> conceptual=modelItemRelate.getConceptualModels();
        List<String> computable=modelItemRelate.getComputableModels();
        List<String> logical=modelItemRelate.getLogicalModels();
        List<String> concepts=modelItemRelate.getConcepts();
        List<String> spatialReferences=modelItemRelate.getSpatialReferences();
        List<String> templates=modelItemRelate.getTemplates();
        List<String> units=modelItemRelate.getUnits();
        List<Map<String,String>> dataSpaceFiles=modelItemRelate.getDataSpaceFiles();
        List<Map<String,String>> exLinks=modelItemRelate.getExLinks();

        ModelItemRelate modelItemRelate2=modelItemVersion.getRelate();
        List<ModelRelation> modelItems2 = modelItemVersion.getModelRelationList();
        List<String> dataItems2=modelItemVersion.getRelatedData();
        List<String> conceptual2=modelItemRelate2.getConceptualModels();
        List<String> computable2=modelItemRelate2.getComputableModels();
        List<String> logical2=modelItemRelate2.getLogicalModels();
        List<String> concepts2=modelItemRelate2.getConcepts();
        List<String> spatialReferences2=modelItemRelate2.getSpatialReferences();
        List<String> templates2=modelItemRelate2.getTemplates();
        List<String> units2=modelItemRelate2.getUnits();
        List<Map<String,String>> dataSpaceFiles2=modelItemRelate2.getDataSpaceFiles();
        List<Map<String,String>> exLinks2=modelItemRelate2.getExLinks();

        JSONObject relatedItems_o = new JSONObject();
        JSONObject relatedItems_n = new JSONObject();

        JSONArray modelItemArray=new JSONArray();
        if(modelItems!=null) {
            for (int i = 0; i < modelItems.size(); i++) {
                String oidNew = modelItems.get(i).getOid();
                ModelItem modelItemNew = modelItemDao.findFirstByOid(oidNew);
                if (modelItemNew.getStatus().equals("Private")) {
                    continue;
                }
                JSONObject modelItemJson = new JSONObject();
                modelItemJson.put("name", modelItemNew.getName());
                modelItemJson.put("oid", modelItemNew.getOid());
                modelItemJson.put("relation",modelItems.get(i).getRelation().getText());
                modelItemJson.put("description", modelItemNew.getDescription());
                modelItemJson.put("image", modelItemNew.getImage().equals("") ? null : htmlLoadPath + modelItemNew.getImage());
                modelItemArray.add(modelItemJson);
            }
        }
        relatedItems_o.put("modelItems",modelItemArray);

        JSONArray conceptualArray=new JSONArray();
        if(conceptual!=null){
            for(int i=0;i<conceptual.size();i++){
                String oid=conceptual.get(i);
                ConceptualModel conceptualModel=conceptualModelDao.findFirstByOid(oid);
                if(conceptualModel.getStatus().equals("Private")){
                    continue;
                }
                JSONObject conceptualJson = new JSONObject();
                conceptualJson.put("name",conceptualModel.getName());
                conceptualJson.put("oid",conceptualModel.getOid());
                conceptualJson.put("description",conceptualModel.getDescription());
                conceptualJson.put("image", conceptualModel.getImage().size() == 0 ? null : htmlLoadPath + conceptualModel.getImage().get(0));
                conceptualArray.add(conceptualJson);
            }
        }

        relatedItems_o.put("conceptualModels",conceptualArray);

        JSONArray logicalArray=new JSONArray();
        for(int i=0;i<logical.size();i++){
            String oid=logical.get(i);
            LogicalModel logicalModel=logicalModelDao.findFirstByOid(oid);
            if(logicalModel.getStatus().equals("Private")){
                continue;
            }
            JSONObject logicalJson = new JSONObject();
            logicalJson.put("name",logicalModel.getName());
            logicalJson.put("oid",logicalModel.getOid());
            logicalJson.put("description",logicalModel.getDescription());
            logicalJson.put("image", logicalModel.getImage().size() == 0 ? null : htmlLoadPath + logicalModel.getImage().get(0));
            logicalArray.add(logicalJson);
        }
        relatedItems_o.put("logicalModels",logicalArray);

        JSONArray computableArray=new JSONArray();
        for(int i=0;i<computable.size();i++){
            String oid=computable.get(i);
            ComputableModel computableModel=computableModelDao.findFirstByOid(oid);
            if(computableModel.getStatus().equals("Private")){
                continue;
            }
            JSONObject computableJson = new JSONObject();
            computableJson.put("name",computableModel.getName());
            computableJson.put("oid",computableModel.getOid());
            computableJson.put("description",computableModel.getDescription());
            computableJson.put("contentType",computableModel.getContentType());
            computableArray.add(computableJson);
        }
        relatedItems_o.put("computableModels",computableArray);

        JSONArray conceptArray=new JSONArray();
        if(concepts!=null) {
            for (int i = 0; i < concepts.size(); i++) {
                String oid = concepts.get(i);
                Concept concept = conceptDao.findFirstByOid(oid);
                if(concept.getStatus().equals("Private")){
                    continue;
                }
                JSONObject jsonObj = new JSONObject();
                jsonObj.put("name", concept.getName());
                jsonObj.put("oid", concept.getOid());
//                jsonObj.put("alias", concept.getAlias());
                String desc = "";
                List<Localization> localizationListConcept = concept.getLocalizationList();
                for(int j=0;j<localizationListConcept.size();j++){
                    String description = localizationListConcept.get(j).getDescription();
                    if(description!=null&&!description.equals("")){
                        desc = description;
                        break;
                    }
                }
                jsonObj.put("description", desc);
//                jsonObj.put("description_ZH", concept.getDescription_ZH());
//                jsonObj.put("description_EN", concept.getDescription_EN());
                conceptArray.add(jsonObj);
            }
        }
        relatedItems_o.put("concepts",conceptArray);

        JSONArray spatialReferenceArray=new JSONArray();
        if(spatialReferences!=null) {
            for (int i = 0; i < spatialReferences.size(); i++) {
                String oid = spatialReferences.get(i);
                SpatialReference spatialReference = spatialReferenceDao.findByOid(oid);
                if(spatialReference.getStatus().equals("Private")){
                    continue;
                }
                JSONObject jsonObj = new JSONObject();
                jsonObj.put("name", spatialReference.getName());
                jsonObj.put("oid", spatialReference.getOid());
                jsonObj.put("wkname", spatialReference.getWkname());
                jsonObj.put("description", spatialReference.getDescription());
                spatialReferenceArray.add(jsonObj);
            }
        }
        relatedItems_o.put("spatialReferences",spatialReferenceArray);

        JSONArray templateArray=new JSONArray();
        if(templates!=null) {
            for (int i = 0; i < templates.size(); i++) {
                String oid = templates.get(i);
                Template template = templateDao.findByOid(oid);
                if(template.getStatus().equals("Private")){
                    continue;
                }
                JSONObject jsonObj = new JSONObject();
                jsonObj.put("name", template.getName());
                jsonObj.put("oid", template.getOid());
                jsonObj.put("description", template.getDescription());
                jsonObj.put("type", template.getType());
                templateArray.add(jsonObj);
            }
        }
        relatedItems_o.put("templates",templateArray);

        JSONArray unitArray=new JSONArray();
        if(units!=null) {
            for (int i = 0; i < units.size(); i++) {
                String oid = units.get(i);
                Unit unit = unitDao.findByOid(oid);
                if(unit.getStatus().equals("Private")){
                    continue;
                }
                JSONObject jsonObj = new JSONObject();
                jsonObj.put("name", unit.getName());
                jsonObj.put("oid", unit.getOid());

                jsonObj.put("description", unit.getDescription());
//                jsonObj.put("description_EN", unit.getDescription_EN());
                unitArray.add(jsonObj);
            }
        }
        relatedItems_o.put("units",unitArray);

        JSONArray dataItemArray=new JSONArray();
        if(dataItems!=null){
            for(String dataId:dataItems){
                DataItem dataItem=dataItemDao.findFirstById(dataId);
                if(dataItem.getStatus().equals("Private")){
                    continue;
                }
                JSONObject dataJson=new JSONObject();
                dataJson.put("name",dataItem.getName());
                dataJson.put("id",dataItem.getId());
                dataJson.put("description",dataItem.getDescription());
                dataItemArray.add(dataJson);
            }
        }
        relatedItems_o.put("dataItems",dataItemArray);
        relatedItems_o.put("dataSpaceFiles",dataSpaceFiles);
        relatedItems_o.put("exLinks",exLinks);

        //new version
        JSONArray modelItemArray2=new JSONArray();
        if(modelItems2!=null) {
            for (int i = 0; i < modelItems2.size(); i++) {
                String oidNew = modelItems2.get(i).getOid();
                ModelItem modelItemNew = modelItemDao.findFirstByOid(oidNew);
                if (modelItemNew.getStatus().equals("Private")) {
                    continue;
                }
                JSONObject modelItemJson = new JSONObject();
                modelItemJson.put("name", modelItemNew.getName());
                modelItemJson.put("oid", modelItemNew.getOid());
                modelItemJson.put("relation",modelItems2.get(i).getRelation().getText());
                modelItemJson.put("description", modelItemNew.getDescription());
                modelItemJson.put("image", modelItemNew.getImage().equals("") ? null : htmlLoadPath + modelItemNew.getImage());
                modelItemArray2.add(modelItemJson);
            }
        }
        relatedItems_n.put("modelItems",modelItemArray2);

        JSONArray conceptualArray2=new JSONArray();
        if(conceptual2!=null) {
            for(int i=0;i<conceptual2.size();i++){
                String oid=conceptual2.get(i);
                ConceptualModel conceptualModel=conceptualModelDao.findFirstByOid(oid);
                if(conceptualModel.getStatus().equals("Private")){
                    continue;
                }
                JSONObject conceptualJson = new JSONObject();
                conceptualJson.put("name",conceptualModel.getName());
                conceptualJson.put("oid",conceptualModel.getOid());
                conceptualJson.put("description",conceptualModel.getDescription());
                conceptualJson.put("image", conceptualModel.getImage().size() == 0 ? null : htmlLoadPath + conceptualModel.getImage().get(0));
                conceptualArray2.add(conceptualJson);
            }
        }

        relatedItems_n.put("conceptualModels",conceptualArray2);

        JSONArray logicalArray2=new JSONArray();
        if(logical2!=null) {
            for(int i=0;i<logical2.size();i++){
                String oid=logical2.get(i);
                LogicalModel logicalModel=logicalModelDao.findFirstByOid(oid);
                if(logicalModel.getStatus().equals("Private")){
                    continue;
                }
                JSONObject logicalJson = new JSONObject();
                logicalJson.put("name",logicalModel.getName());
                logicalJson.put("oid",logicalModel.getOid());
                logicalJson.put("description",logicalModel.getDescription());
                logicalJson.put("image", logicalModel.getImage().size() == 0 ? null : htmlLoadPath + logicalModel.getImage().get(0));
                logicalArray2.add(logicalJson);
            }
        }

        relatedItems_n.put("logicalModels",logicalArray2);

        JSONArray computableArray2=new JSONArray();
        if(computable2!=null) {
            for(int i=0;i<computable2.size();i++){
                String oid=computable2.get(i);
                ComputableModel computableModel=computableModelDao.findFirstByOid(oid);
                if(computableModel.getStatus().equals("Private")){
                    continue;
                }
                JSONObject computableJson = new JSONObject();
                computableJson.put("name",computableModel.getName());
                computableJson.put("oid",computableModel.getOid());
                computableJson.put("description",computableModel.getDescription());
                computableJson.put("contentType",computableModel.getContentType());
                computableArray2.add(computableJson);
            }
        }

        relatedItems_n.put("computableModels",computableArray2);

        JSONArray conceptArray2=new JSONArray();
        if(concepts2!=null) {
            for (int i = 0; i < concepts2.size(); i++) {
                String oid = concepts2.get(i);
                Concept concept = conceptDao.findFirstByOid(oid);
                if(concept.getStatus().equals("Private")){
                    continue;
                }
                JSONObject jsonObj = new JSONObject();
                jsonObj.put("name", concept.getName());
                jsonObj.put("oid", concept.getOid());
//                jsonObj.put("alias", concept.getAlias());
                String desc = "";
                List<Localization> localizationListConcept = concept.getLocalizationList();
                for(int j=0;j<localizationListConcept.size();j++){
                    String description = localizationListConcept.get(j).getDescription();
                    if(description!=null&&!description.equals("")){
                        desc = description;
                        break;
                    }
                }
                jsonObj.put("description", desc);
//                jsonObj.put("description_ZH", concept.getDescription_ZH());
//                jsonObj.put("description_EN", concept.getDescription_EN());
                conceptArray2.add(jsonObj);
            }
        }
        relatedItems_n.put("concepts",conceptArray2);

        JSONArray spatialReferenceArray2=new JSONArray();
        if(spatialReferences2!=null) {
            for (int i = 0; i < spatialReferences2.size(); i++) {
                String oid = spatialReferences2.get(i);
                SpatialReference spatialReference = spatialReferenceDao.findByOid(oid);
                if(spatialReference.getStatus().equals("Private")){
                    continue;
                }
                JSONObject jsonObj = new JSONObject();
                jsonObj.put("name", spatialReference.getName());
                jsonObj.put("oid", spatialReference.getOid());
                jsonObj.put("wkname", spatialReference.getWkname());
                jsonObj.put("description", spatialReference.getDescription());
                spatialReferenceArray2.add(jsonObj);
            }
        }
        relatedItems_n.put("spatialReferences",spatialReferenceArray2);

        JSONArray templateArray2=new JSONArray();
        if(templates2!=null) {
            for (int i = 0; i < templates2.size(); i++) {
                String oid = templates2.get(i);
                Template template = templateDao.findByOid(oid);
                if(template.getStatus().equals("Private")){
                    continue;
                }
                JSONObject jsonObj = new JSONObject();
                jsonObj.put("name", template.getName());
                jsonObj.put("oid", template.getOid());
                jsonObj.put("description", template.getDescription());
                jsonObj.put("type", template.getType());
                templateArray2.add(jsonObj);
            }
        }
        relatedItems_n.put("templates",templateArray2);

        JSONArray unitArray2=new JSONArray();
        if(units2!=null) {
            for (int i = 0; i < units2.size(); i++) {
                String oid = units2.get(i);
                Unit unit = unitDao.findByOid(oid);
                if(unit.getStatus().equals("Private")){
                    continue;
                }
                JSONObject jsonObj = new JSONObject();
                jsonObj.put("name", unit.getName());
                jsonObj.put("oid", unit.getOid());

                jsonObj.put("description", unit.getDescription());
//                jsonObj.put("description_EN", unit.getDescription_EN());
                unitArray2.add(jsonObj);
            }
        }
        relatedItems_n.put("units",unitArray2);

        JSONArray dataItemArray2=new JSONArray();
        if(dataItems2!=null){
            for(String dataId:dataItems2){
                DataItem dataItem=dataItemDao.findFirstById(dataId);
                if(dataItem.getStatus().equals("Private")){
                    continue;
                }
                JSONObject dataJson=new JSONObject();
                dataJson.put("name",dataItem.getName());
                dataJson.put("id",dataItem.getId());
                dataJson.put("description",dataItem.getDescription());
                dataItemArray2.add(dataJson);
            }
        }
        relatedItems_n.put("dataItems",dataItemArray2);
        relatedItems_n.put("dataSpaceFiles",dataSpaceFiles2);
        relatedItems_n.put("exLinks",exLinks2);

        ModelAndView modelAndView=new ModelAndView();
        modelAndView.setViewName("compare/modelItemCompare");
        modelAndView.addObject("modelInfo",modelInfo);
        modelAndView.addObject("classifications",classResult);
        modelAndView.addObject("detail",detailResult);
//        modelAndView.addObject("conceptualModels",conceptualArray);
//        modelAndView.addObject("logicalModels",logicalArray);
//        modelAndView.addObject("computableModels",computableArray);
        modelAndView.addObject("references", JSONArray.parseArray(JSON.toJSONString(modelInfo.getReferences())));

        modelAndView.addObject("modelInfo2",modelItemVersion);
        modelAndView.addObject("classifications2",classResult1);
        modelAndView.addObject("classifications22",classResult2);
        modelAndView.addObject("detail2",detailResult1);
//        modelAndView.addObject("conceptualModels2",conceptualArray1);
//        modelAndView.addObject("logicalModels2",logicalArray1);
//        modelAndView.addObject("computableModels2",computableArray1);
        modelAndView.addObject("references2", JSONArray.parseArray(JSON.toJSONString(modelItemVersion.getReferences())));

        modelAndView.addObject("relatedItems_o",relatedItems_o);
        modelAndView.addObject("relatedItems_n",relatedItems_n);
        return modelAndView;
    }

    public ModelAndView getModelItemHistoryPage(String id){
        //条目信息
        ModelItemVersion modelItemVersion=modelItemVersionDao.findFirstByOid(id);

        //类
        JSONArray classResult = new JSONArray();
        if(modelItemVersion.getClassifications()!=null) {
            classResult = commonService.getClassifications(modelItemVersion.getClassifications());
        }
        JSONArray class2Result = new JSONArray();
        if(modelItemVersion.getClassifications2()!=null) {
            class2Result = commonService.getClassifications2(modelItemVersion.getClassifications2());
        }

        //详情页面
//        String detailResult;
//        String model_detailDesc=modelInfo.getDetail();
//        detailResult = commonService.getDetail(model_detailDesc);

        //排序
        List<Localization> locals = modelItemVersion.getLocalizationList();
        Collections.sort(locals);

        String detailResult = "";
        String detailLanguage = "";
        //先找中英文描述
        for(Localization localization:locals){
            String local = localization.getLocalCode();
            if(local.equals("en")||local.equals("zh")||local.contains("en-")||local.contains("zh-")){
                String localDesc = localization.getDescription();
                if(localDesc!=null&&!localDesc.equals("")) {
                    detailLanguage = localization.getLocalName();
                    detailResult = localization.getDescription();
                    break;
                }
            }
        }
        //如果没有中英文，则使用其他语言描述
        if(detailResult.equals("")){
            for(Localization localization:locals){
                String localDesc = localization.getDescription();
                if(localDesc!=null&&!localDesc.equals("")) {
                    detailLanguage = localization.getLocalName();
                    detailResult = localization.getDescription();
                    break;
                }
            }
        }

        //语言列表
        List<String> languageList = new ArrayList<>();
        for(Localization local:locals){
            languageList.add(local.getLocalName());
        }



        //时间
        Date date=modelItemVersion.getModifyTime();
        Calendar calendar=Calendar.getInstance();
        calendar.setTime(date);
        SimpleDateFormat simpleDateFormat=new SimpleDateFormat("yyyy-MM-dd");
        String dateResult=simpleDateFormat.format(date);

        //用户信息
        JSONObject userJson = userService.getItemUserInfo(modelItemVersion.getModifier());

        //图片路径
        String image=modelItemVersion.getImage();
        if(!image.equals("")){
            modelItemVersion.setImage(htmlLoadPath+image);
        }

        //meta keywords
        List<String> keywords=modelItemVersion.getKeywords();
        String meta_keywords="";
        if(keywords.size()!=0) {
            meta_keywords = keywords.toString().replace("[", ", ").replace("]", "");
        }



        ModelAndView modelAndView=new ModelAndView();
        modelAndView.setViewName("model_item_info");
        modelAndView.addObject("modelInfo",modelItemVersion);
        modelAndView.addObject("metaKeywords",meta_keywords);
        modelAndView.addObject("classifications",classResult);
        modelAndView.addObject("classifications2", class2Result);
        modelAndView.addObject("detailLanguage",detailLanguage);
        modelAndView.addObject("languageList", languageList);
        modelAndView.addObject("detail",detailResult);
        modelAndView.addObject("date",dateResult);
        modelAndView.addObject("year",calendar.get(Calendar.YEAR));
        modelAndView.addObject("user", userJson);
        modelAndView.addObject("references", JSONArray.parseArray(JSON.toJSONString(modelItemVersion.getReferences())));
        modelAndView.addObject("history",true);


        return modelAndView;
    }

    public ModelAndView getConceptualModelHistoryPage(String id){

        //条目信息
        ConceptualModelVersion modelInfo = conceptualModelVersionDao.findFirstByOid(id);

        //时间
        Date date = modelInfo.getModifyTime();
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");
        String dateResult = simpleDateFormat.format(date);

        //用户信息
        JSONObject userJson = userService.getItemUserInfo(modelInfo.getModifier());

        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("conceptual_model");
        modelAndView.addObject("modelInfo", modelInfo);
        modelAndView.addObject("date", dateResult);
        modelAndView.addObject("year", calendar.get(Calendar.YEAR));
        modelAndView.addObject("user", userJson);
        modelAndView.addObject("loadPath", htmlLoadPath);
        modelAndView.addObject("history",true);


        return modelAndView;
    }

    public ModelAndView getLogicalModelHistoryPage(String id){
        //条目信息
        LogicalModelVersion modelInfo=logicalModelVersionDao.findFirstByOid(id);

        //时间
        Date date=modelInfo.getModifyTime();
        Calendar calendar=Calendar.getInstance();
        calendar.setTime(date);
        SimpleDateFormat simpleDateFormat=new SimpleDateFormat("yyyy-MM-dd");
        String dateResult=simpleDateFormat.format(date);

        //用户信息

        JSONObject userJson=userService.getItemUserInfo(modelInfo.getModifier());

        ModelAndView modelAndView=new ModelAndView();
        modelAndView.setViewName("logical_model");
        modelAndView.addObject("modelInfo",modelInfo);
        String computableModelId=modelInfo.getComputableModelId();
        modelAndView.addObject("uid",deCode.encode((modelInfo.getOid()+"-"+computableModelId).getBytes()));
        modelAndView.addObject("date",dateResult);
        modelAndView.addObject("year",calendar.get(Calendar.YEAR));
        modelAndView.addObject("user",userJson);
        modelAndView.addObject("loadPath",htmlLoadPath);
        modelAndView.addObject("history",true);

        return modelAndView;
    }

    public ModelAndView getComputableModelHistoryPage(String id){
        //条目信息
        try{

            ComputableModelVersion modelInfo = computableModelVersionDao.findFirstByOid(id);

            //时间
            Date date = modelInfo.getModifyTime();
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(date);
            SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");
            String dateResult = simpleDateFormat.format(date);

            //用户信息
            JSONObject userJson = userService.getItemUserInfo(modelInfo.getModifier());
            //资源信息
            JSONArray resourceArray = new JSONArray();
            List<String> resources = modelInfo.getResources();

            if (resources != null) {
                for (int i = 0; i < resources.size(); i++) {

                    String path = resources.get(i);

                    String[] arr = path.split("\\.");
                    String suffix = arr[arr.length - 1];

                    arr = path.split("/");
                    String name = arr[arr.length - 1].substring(14);

                    JSONObject jsonObject = new JSONObject();
                    jsonObject.put("id", i);
                    jsonObject.put("name", name);
                    jsonObject.put("suffix", suffix);
                    jsonObject.put("path",resources.get(i));
                    resourceArray.add(jsonObject);

                }

            }

            ModelAndView modelAndView = new ModelAndView();
            modelAndView.setViewName("computable_model");
            modelAndView.addObject("modelInfo", modelInfo);
            modelAndView.addObject("date", dateResult);
            modelAndView.addObject("year", calendar.get(Calendar.YEAR));
            modelAndView.addObject("user", userJson);
            modelAndView.addObject("resources", resourceArray);
            JSONObject mdlJson=(JSONObject)JSONObject.toJSON(modelInfo.getMdlJson());
            if(mdlJson!=null) {
                JSONObject modelClass = (JSONObject) mdlJson.getJSONArray("ModelClass").get(0);
                JSONObject behavior = (JSONObject) modelClass.getJSONArray("Behavior").get(0);
                modelAndView.addObject("behavior", behavior);
            }
            modelAndView.addObject("loadPath",htmlLoadPath);

            modelAndView.addObject("history",true);

            return modelAndView;

        }catch (Exception e){
            System.out.println(e.getMessage());
            throw new MyException(e.getMessage());
        }
    }

    public ModelAndView getConceptHistoryPage(String id){
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("conceptInfo");

        ConceptVersion concept=conceptVersionDao.findFirstByOid(id);
        modelAndView.addObject("info",concept);

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
                String name = relatedConcept.getName();
                JSONObject jsonObject = new JSONObject();
                jsonObject.put("id", relatedId);
                jsonObject.put("name", name);
                relateArray.add(jsonObject);
            }
        }

        //用户信息
        JSONObject userJson = userService.getItemUserInfo(concept.getModifier());

        modelAndView.addObject("classifications",classResult);
        modelAndView.addObject("year",Calendar.getInstance().getWeekYear());
        modelAndView.addObject("date",sdf.format(concept.getModifyTime()));
        modelAndView.addObject("related",relateArray);
        modelAndView.addObject("user", userJson);
        modelAndView.addObject("history",true);

        return modelAndView;
    }

    public ModelAndView getSpatialReferenceHistoryPage(String id){
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("spatialReferenceInfo");

        SpatialReferenceVersion spatialReference = spatialReferenceVersionDao.findFirstByOid(id);
        modelAndView.addObject("info", spatialReference);

        //兼容两种格式的数据
        Classification classification = null;

        JSONArray array = new JSONArray();
        JSONArray classResult = new JSONArray();

        if (spatialReference.getParentId() != null) {
            classification = spatialReferenceClassificationDao.findFirstByOid(spatialReference.getParentId());

            if (classification != null && classification.getParentId() != null) {
                Classification classification2 = spatialReferenceClassificationDao.findFirstByOid(classification.getParentId());
                array.add(classification2.getNameEn());
            }
            array.add(classification.getNameEn());
            classResult.add(array);

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
            modelAndView.addObject("localizations", localizationArray);
        } else {
            List<String> classifications = spatialReference.getClassifications();
            for (int i = 0; i < classifications.size(); i++) {
                array.clear();
                String classId = classifications.get(i);
                classification = spatialReferenceClassificationDao.findFirstByOid(classId);
                array.add(classification.getNameEn());
                classId = classification.getParentId();

                classification = spatialReferenceClassificationDao.findFirstByOid(classId);
                array.add(classification.getNameEn());

                JSONArray array1 = new JSONArray();
                for (int j = array.size() - 1; j >= 0; j--) {
                    array1.add(array.getString(j));
                }

                classResult.add(array1);

            }
            System.out.println(classResult);
        }

        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

        //用户信息
        JSONObject userJson = userService.getItemUserInfo(spatialReference.getModifier());

        modelAndView.addObject("classifications", classResult);
        modelAndView.addObject("year", Calendar.getInstance().getWeekYear());
        modelAndView.addObject("date", sdf.format(spatialReference.getModifyTime()));
        modelAndView.addObject("user", userJson);
        modelAndView.addObject("history", true);


        return modelAndView;
    }

    public ModelAndView getTemplateHistoryPage(String id){
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("templateInfo");

        TemplateVersion template = templateVersionDao.findFirstByOid(id);
        modelAndView.addObject("info", template);

        //兼容两种格式的数据
        Classification classification = null;

        JSONArray array = new JSONArray();
        JSONArray classResult = new JSONArray();

        if (template.getParentId() != null) {
            classification = templateClassificationDao.findFirstByOid(template.getParentId());

            if (classification != null && classification.getParentId() != null) {
                Classification classification2 = templateClassificationDao.findFirstByOid(classification.getParentId());
                array.add(classification2.getNameEn());
            }
            array.add(classification.getNameEn());
            classResult.add(array);

            org.dom4j.Document d = null;
            JSONArray localizationArray = new JSONArray();
            try {
                d = DocumentHelper.parseText(template.getXml());
                org.dom4j.Element root = d.getRootElement();
//            org.dom4j.Element Localizations = root.element("Localizations");
                List<org.dom4j.Element> LocalizationList = root.elements("Localization");
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
            modelAndView.addObject("localizations", localizationArray);
        } else {
            List<String> classifications = template.getClassifications();
            for (int i = 0; i < classifications.size(); i++) {
                array.clear();
                String classId = classifications.get(i);
                classification = templateClassificationDao.findFirstByOid(classId);
                array.add(classification.getNameEn());
                classId = classification.getParentId();

                classification = templateClassificationDao.findFirstByOid(classId);
                array.add(classification.getNameEn());

                JSONArray array1 = new JSONArray();
                for (int j = array.size() - 1; j >= 0; j--) {
                    array1.add(array.getString(j));
                }

                classResult.add(array1);

            }
            System.out.println(classResult);
        }

        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

        //用户信息
        JSONObject userJson = userService.getItemUserInfo(template.getModifier());

        modelAndView.addObject("classifications", classResult);
        modelAndView.addObject("year", Calendar.getInstance().getWeekYear());
        modelAndView.addObject("date", sdf.format(template.getModifyTime()));
        modelAndView.addObject("user", userJson);
        modelAndView.addObject("history", true);

        return modelAndView;
    }

    public ModelAndView getUnitHistoryPage(String id){

        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("unitInfo");

        UnitVersion unit = unitVersionDao.findFirstByOid(id);
        modelAndView.addObject("info", unit);


        //兼容两种格式的数据
        Classification classification = null;

        JSONArray array = new JSONArray();
        JSONArray classResult = new JSONArray();

        if (unit.getParentId() != null) {
            classification = unitClassificationDao.findFirstByOid(unit.getParentId());

            if (classification != null && classification.getParentId() != null) {
                Classification classification2 = unitClassificationDao.findFirstByOid(classification.getParentId());
                array.add(classification2.getNameEn());
            }
            array.add(classification.getNameEn());
            classResult.add(array);

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
            modelAndView.addObject("localizations", localizationArray);
        } else {
            List<String> classifications = unit.getClassifications();
            for (int i = 0; i < classifications.size(); i++) {
                array.clear();
                String classId = classifications.get(i);
                classification = unitClassificationDao.findFirstByOid(classId);
                array.add(classification.getNameEn());
                classId = classification.getParentId();

                classification = unitClassificationDao.findFirstByOid(classId);
                array.add(classification.getNameEn());

                JSONArray array1 = new JSONArray();
                for (int j = array.size() - 1; j >= 0; j--) {
                    array1.add(array.getString(j));
                }

                classResult.add(array1);

            }
            System.out.println(classResult);
        }

        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

        //用户信息
        JSONObject userJson = userService.getItemUserInfo(unit.getModifier());

        modelAndView.addObject("classifications", classResult);
        modelAndView.addObject("year", Calendar.getInstance().getWeekYear());
        modelAndView.addObject("date", sdf.format(unit.getModifyTime()));
        modelAndView.addObject("user", userJson);
        modelAndView.addObject("history", true);

        return modelAndView;

    }

    public ModelAndView getDataItemHistoryPage(String id){
        ModelAndView modelAndView = new ModelAndView();
        DataItemVersion dataItemVersion = new DataItemVersion();
        try {
            dataItemVersion = dataItemVersionDao.findFirstByOid(id);
        }catch (MyException e){
            modelAndView.setViewName("error/404");
            return modelAndView;
        }

        //authorship
        String authorshipString="";
        List<AuthorInfo> authorshipList=dataItemVersion.getAuthorship();
        if(authorshipList!=null){
            for (AuthorInfo author:authorshipList
            ) {
                if(authorshipString.equals("")){
                    authorshipString+=author.getName();
                }
                else{
                    authorshipString+=", "+author.getName();
                }
            }
        }

        //related models
        JSONArray modelItemArray=new JSONArray();
        List<String> relatedModels=dataItemVersion.getRelatedModels();
        if(relatedModels!=null) {
            for (String mid : relatedModels) {
                try {
                    ModelItem modelItem = modelItemDao.findFirstByOid(mid);
                    JSONObject modelItemJson = new JSONObject();
                    modelItemJson.put("name", modelItem.getName());
                    modelItemJson.put("oid", modelItem.getOid());
                    modelItemJson.put("description", modelItem.getDescription());
                    modelItemJson.put("image", modelItem.getImage().equals("") ? null : htmlLoadPath + modelItem.getImage());
                    modelItemArray.add(modelItemJson);
                }
                catch (Exception e){
                    e.printStackTrace();
                }
            }
        }

        //classification
        List<String> classifications=new ArrayList<>();
        List<String> categories = dataItemVersion.getClassifications();
        for (String category : categories) {
            DataCategorys dataCategorys = dataCategorysDao.findFirstById(category);
            String name = dataCategorys.getCategory();
            classifications.add(name);
        }

        //fileName
        ArrayList<String> fileName = new ArrayList<>();
        if (dataItemVersion.getDataType().equals("DistributedNode")){
            fileName.add(dataItemVersion.getName());
        }

        if (dataItemVersion.getRelatedProcessings()!=null){
            modelAndView.addObject("relatedProcessing",dataItemVersion.getRelatedProcessings());
        }
        if (dataItemVersion.getRelatedVisualizations()!=null){
            modelAndView.addObject("relatedVisualization",dataItemVersion.getRelatedVisualizations());
        }

        //时间
        Date date = dataItemVersion.getModifyTime();
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");
        String dateResult = simpleDateFormat.format(date);

        //用户信息
        User user = userDao.findFirstByOid(dataItemVersion.getModifier());
        String userName = user.getUserName();
        JSONObject userJson = userService.getItemUserInfo(userName);


        modelAndView.setViewName("data_item_info");
        modelAndView.addObject("datainfo", ResultUtils.success(dataItemVersion));
        modelAndView.addObject("user",userJson);
        modelAndView.addObject("classifications",classifications);
        modelAndView.addObject("relatedModels",modelItemArray);
        modelAndView.addObject("authorship",authorshipString);
        modelAndView.addObject("fileName",fileName);//后期应该是放该name下的所有数据

        modelAndView.addObject("history",true);
        return modelAndView;
    }

    public ModelAndView getDataApplicationHistoryPage(String id){
        //条目信息
        try{
            DataApplicationVersion dataApplicationVersion = dataApplicationVersionDao.findFirstByOid(id);

            //时间
            Date date = dataApplicationVersion.getModifyTime();
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(date);
            SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");
            String dateResult = simpleDateFormat.format(date);

            //用户信息
            User user = userDao.findFirstByOid(dataApplicationVersion.getModifier());
            String userName = user.getUserName();
            JSONObject userJson = userService.getItemUserInfo(userName);
            //资源信息
            JSONArray resourceArray = new JSONArray();
            List<String> resources = dataApplicationVersion.getResources();

            if (resources != null) {
                for (int i = 0; i < resources.size(); i++) {

                    String path = resources.get(i);

                    String[] arr = path.split("\\.");
                    String suffix = arr[arr.length - 1];

                    arr = path.split("/");
                    String name = arr[arr.length - 1].substring(14);

                    JSONObject jsonObject = new JSONObject();
                    jsonObject.put("id", i);
                    jsonObject.put("name", name);
                    jsonObject.put("suffix", suffix);
                    jsonObject.put("path",resources.get(i));
                    resourceArray.add(jsonObject);

                }

            }

            List<String> classifications = dataApplicationVersion.getClassifications();
            List<String> categories = classifications;
            List<String> classificationName = new ArrayList<>();

            for (String category: categories){
                Categorys categorys = categoryDao.findFirstById(category);
                String name = categorys.getCategory();
                if (name.equals("...All")) {
                    Categorys categorysParent = categoryDao.findFirstById(categorys.getParentCategory());
                    classificationName.add(categorysParent.getCategory());
                } else {
                    classificationName.add(name);
                }
            }

            String authorshipString="";
            List<AuthorInfo> authorshipList=dataApplicationVersion.getAuthorship();
            if(authorshipList!=null){
                for (AuthorInfo author:authorshipList) {
                    if(authorshipString.equals("")){
                        authorshipString+=author.getName();
                    }
                    else{
                        authorshipString+=", "+author.getName();
                    }

                }
            }
            String lastModifyTime = simpleDateFormat.format(dataApplicationVersion.getLastModifyTime());


            ModelAndView modelAndView = new ModelAndView();
            modelAndView.setViewName("data_application_info");
            modelAndView.addObject("dataApplicationInfo", dataApplicationVersion);
            modelAndView.addObject("classifications", classificationName);
            modelAndView.addObject("date", dateResult);
            modelAndView.addObject("year", calendar.get(Calendar.YEAR));
            modelAndView.addObject("user", userJson);
            modelAndView.addObject("authorship", authorshipString);
            modelAndView.addObject("resources", resourceArray);
            modelAndView.addObject("lastModifyTime", lastModifyTime);

            modelAndView.addObject("loadPath",htmlLoadPath);

            modelAndView.addObject("history",true);

            return modelAndView;

        }catch (Exception e){
            System.out.println(e.getMessage());
            throw new MyException(e.getMessage());
        }
    }

    public ModelAndView getDataHubsHistoryPage(String id){
        ModelAndView modelAndView = new ModelAndView();
        DataHubsVersion dataHubsVersion = new DataHubsVersion();
        try {
            dataHubsVersion = dataHubsVersionDao.findFirstByOid(id);
        }catch (MyException e){
            modelAndView.setViewName("error/404");
            return modelAndView;
        }

        //authorship
        String authorshipString="";
        List<AuthorInfo> authorshipList=dataHubsVersion.getAuthorship();
        if(authorshipList!=null){
            for (AuthorInfo author:authorshipList) {
                if(authorshipString.equals("")){
                    authorshipString+=author.getName();
                }
                else{
                    authorshipString+=", "+author.getName();
                }
            }
        }

        //related models
        JSONArray modelItemArray=new JSONArray();
        List<String> relatedModels=dataHubsVersion.getRelatedModels();
        if(relatedModels!=null) {
            for (String mid : relatedModels) {
                try {
                    ModelItem modelItem = modelItemDao.findFirstByOid(mid);
                    JSONObject modelItemJson = new JSONObject();
                    modelItemJson.put("name", modelItem.getName());
                    modelItemJson.put("oid", modelItem.getOid());
                    modelItemJson.put("description", modelItem.getDescription());
                    modelItemJson.put("image", modelItem.getImage().equals("") ? null : htmlLoadPath + modelItem.getImage());
                    modelItemArray.add(modelItemJson);
                }
                catch (Exception e){
                    e.printStackTrace();
                }
            }
        }

        //classification
        List<String> classifications=new ArrayList<>();
        List<String> categories = dataHubsVersion.getClassifications();
        for (String category : categories) {
            DataCategorys dataCategorys = dataCategorysDao.findFirstById(category);
            String name = dataCategorys.getCategory();
            classifications.add(name);
        }

        //fileName
        ArrayList<String> fileName = new ArrayList<>();
        if (dataHubsVersion.getDataType()!=null&&dataHubsVersion.getDataType().equals("DistributedNode")){
            fileName.add(dataHubsVersion.getName());
        }

        if (dataHubsVersion.getRelatedProcessings()!=null){
            modelAndView.addObject("relatedProcessing",dataHubsVersion.getRelatedProcessings());
        }
        if (dataHubsVersion.getRelatedVisualizations()!=null){
            modelAndView.addObject("relatedVisualization",dataHubsVersion.getRelatedVisualizations());
        }

        //时间
        Date date = dataHubsVersion.getModifyTime();
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");
        String dateResult = simpleDateFormat.format(date);

        //用户信息
        User user = userDao.findFirstByOid(dataHubsVersion.getModifier());
        String userName = user.getUserName();
        JSONObject userJson = userService.getItemUserInfo(userName);


        modelAndView.setViewName("data_item_info");
        modelAndView.addObject("datainfo", ResultUtils.success(dataHubsVersion));
        modelAndView.addObject("user",userJson);
        modelAndView.addObject("classifications",classifications);
        modelAndView.addObject("relatedModels",modelItemArray);
        modelAndView.addObject("authorship",authorshipString);
        modelAndView.addObject("fileName",fileName);//后期应该是放该name下的所有数据

        modelAndView.addObject("history",true);
        return modelAndView;

    }

}
