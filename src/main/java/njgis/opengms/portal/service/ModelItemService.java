package njgis.opengms.portal.service;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.mongodb.BasicDBObject;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoCursor;
import njgis.opengms.portal.dao.*;
import njgis.opengms.portal.dto.modelItem.*;
import njgis.opengms.portal.entity.*;
import njgis.opengms.portal.entity.support.Article;
import njgis.opengms.portal.entity.support.AuthorInfo;
import njgis.opengms.portal.entity.support.ModelItemRelate;
import njgis.opengms.portal.entity.support.Reference;
import njgis.opengms.portal.enums.ResultEnum;
import njgis.opengms.portal.exception.MyException;
import njgis.opengms.portal.utils.Utils;
import org.bson.Document;
import org.dom4j.DocumentException;
import org.dom4j.DocumentHelper;
import org.dom4j.Element;
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
import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.regex.Pattern;

/**
 * @ClassName ModelItemService
 * @Description todo
 * @Author Kai
 * @Date 2019/2/21
 * @Version 1.0.0
 * TODO
 */

@Service

public class ModelItemService {

    @Autowired
    ItemService itemService;

    @Autowired
    ClassificationService classificationService;

    @Autowired
    UserDao userDao;

    @Autowired
    UserService userService;

    @Autowired
    ModelItemDao modelItemDao;

    @Autowired
    ModelItemVersionDao modelItemVersionDao;

    @Autowired
    ConceptualModelDao conceptualModelDao;

    @Autowired
    LogicalModelDao logicalModelDao;

    @Autowired
    ComputableModelDao computableModelDao;

    @Autowired
    ConceptDao conceptDao;

    @Autowired
    SpatialReferenceDao spatialReferenceDao;

    @Autowired
    TemplateDao templateDao;

    @Autowired
    UnitDao unitDao;

    @Autowired
    DataItemDao dataItemDao;

    @Autowired
    CommonService commonService;

    @Value("${resourcePath}")
    private String resourcePath;

    @Value("${htmlLoadPath}")
    private String htmlLoadPath;

    @Value(value = "Public,Discoverable")
    private List<String> itemStatusVisible;

        //getpage函数通过id获取需要的页面
    public ModelAndView getPage(String id, HttpServletRequest request){
        //条目信息
        ModelItem modelInfo=new ModelItem();
        ModelAndView modelAndView=new ModelAndView();
        try {
            modelInfo = getByOid(id);
        }catch (MyException e){
            modelAndView.setViewName("error/404");
            return modelAndView;
        }

        modelInfo=(ModelItem)itemService.recordViewCount(modelInfo);

        modelItemDao.save(modelInfo);
        //类
        JSONArray classResult=commonService.getClassifications(modelInfo.getClassifications());

        //详情页面
        String detailResult;
        String model_detailDesc=modelInfo.getDetail();
        detailResult = commonService.getDetail(model_detailDesc);


        //时间
        Date date=modelInfo.getCreateTime();
        Calendar calendar=Calendar.getInstance();
        calendar.setTime(date);
        SimpleDateFormat simpleDateFormat=new SimpleDateFormat("yyyy-MM-dd");
        String dateResult=simpleDateFormat.format(date);


        //relate
        ModelItemRelate modelItemRelate=modelInfo.getRelate();
        List<String> modelItems=modelItemRelate.getModelItems();
        List<String> conceptual=modelItemRelate.getConceptualModels();
        List<String> computable=modelItemRelate.getComputableModels();
        List<String> logical=modelItemRelate.getLogicalModels();
        List<String> concepts=modelItemRelate.getConcepts();
        List<String> spatialReferences=modelItemRelate.getSpatialReferences();
        List<String> templates=modelItemRelate.getTemplates();
        List<String> units=modelItemRelate.getUnits();

        JSONArray modelItemArray=new JSONArray();
        if(modelItems!=null) {
            for (int i = 0; i < modelItems.size(); i++) {
                String oid = modelItems.get(i);
                ModelItem modelItem=modelItemDao.findFirstByOid(oid);
                JSONObject modelItemJson = new JSONObject();
                modelItemJson.put("name", modelItem.getName());
                modelItemJson.put("oid", modelItem.getOid());
                modelItemJson.put("description", modelItem.getDescription());
                modelItemJson.put("image", modelItem.getImage().equals("") ? null : htmlLoadPath + modelItem.getImage());
                modelItemArray.add(modelItemJson);
            }
        }
        JSONArray conceptualArray=new JSONArray();
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
            conceptualJson.put("image",conceptualModel.getImage().size()==0?null:htmlLoadPath+conceptualModel.getImage().get(0));
            conceptualArray.add(conceptualJson);
        }

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
            logicalJson.put("image",logicalModel.getImage().size()==0?null:htmlLoadPath+logicalModel.getImage().get(0));
            logicalArray.add(logicalJson);
        }

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
                jsonObj.put("alias", concept.getAlias());
                jsonObj.put("description", concept.getDescription());
                jsonObj.put("description_ZH", concept.getDescription_ZH());
                jsonObj.put("description_EN", concept.getDescription_EN());
                conceptArray.add(jsonObj);
            }
        }

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

                jsonObj.put("description_ZH", unit.getDescription_ZH());
                jsonObj.put("description_EN", unit.getDescription_EN());
                unitArray.add(jsonObj);
            }
        }

        JSONArray dataItemArray=new JSONArray();
        List<String> dataItems=modelInfo.getRelatedData();
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


        //用户信息
        JSONObject userJson = userService.getItemUserInfo(modelInfo.getAuthor());

        //修改者信息
        String lastModifier=modelInfo.getLastModifier();
        JSONObject modifierJson=null;
        if(lastModifier!=null){
             modifierJson = userService.getItemUserInfo(lastModifier);
        }

        String lastModifyTime=simpleDateFormat.format(modelInfo.getLastModifyTime());


        //图片路径
        String image=modelInfo.getImage();
        if(!image.equals("")){
            modelInfo.setImage(htmlLoadPath+image);
        }

        //meta keywords
        List<String> keywords=modelInfo.getKeywords();
        String meta_keywords="";
        if(keywords.size()!=0) {
            meta_keywords = keywords.toString().replace("[", ", ").replace("]", "");
        }

        //authorship
        String authorshipString="";
        List<AuthorInfo> authorshipList=modelInfo.getAuthorship();
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




        modelAndView.setViewName("model_item_info");
        modelAndView.addObject("modelInfo",modelInfo);
        modelAndView.addObject("metaKeywords",meta_keywords);
        modelAndView.addObject("classifications",classResult);
        modelAndView.addObject("detail",detailResult);
        modelAndView.addObject("date",dateResult);
        modelAndView.addObject("year",calendar.get(Calendar.YEAR));
        modelAndView.addObject("modelItems",modelItemArray);
        modelAndView.addObject("conceptualModels",conceptualArray);
        modelAndView.addObject("logicalModels",logicalArray);
        modelAndView.addObject("computableModels",computableArray);
        modelAndView.addObject("concepts",conceptArray);
        modelAndView.addObject("spatialReferences",spatialReferenceArray);
        modelAndView.addObject("templates",templateArray);
        modelAndView.addObject("units",unitArray);
        modelAndView.addObject("dataItems",dataItemArray);
        modelAndView.addObject("user", userJson);
        modelAndView.addObject("authorship", authorshipString);
        modelAndView.addObject("lastModifier", modifierJson);
        modelAndView.addObject("lastModifyTime", lastModifyTime);
        modelAndView.addObject("references", JSONArray.parseArray(JSON.toJSONString(modelInfo.getReferences())));

        return modelAndView;
    }


    public ModelItem getByOid(String id) {
        try {
            ModelItem modelItem=modelItemDao.findFirstByOid(id);

            //详情页面
            String detailResult;
            String model_detailDesc=modelItem.getDetail();
            int num=model_detailDesc.indexOf("/upload/document/");
            if(num==-1||num>20){
                detailResult=model_detailDesc;
            }
            else {
                if(model_detailDesc.indexOf("/")==0){
                    model_detailDesc.substring(1);
                }
                //model_detailDesc = model_detailDesc.length() > 0 ? model_detailDesc.substring(1) : model_detailDesc;
                String filePath = resourcePath.substring(0,resourcePath.length()-7) +"/" + model_detailDesc;
                try {
                    filePath = java.net.URLDecoder.decode(filePath, "utf-8");
                } catch (UnsupportedEncodingException e) {
                    e.printStackTrace();
                }
                if (model_detailDesc.length() > 0) {
                    File file = new File(filePath);
                    if (file.exists()) {
                        StringBuilder detail = new StringBuilder();
                        try {
                            FileInputStream fileInputStream = new FileInputStream(file);
                            InputStreamReader inputStreamReader = new InputStreamReader(fileInputStream, "UTF-8");
                            BufferedReader br = new BufferedReader(inputStreamReader);
                            String line;
                            while ((line = br.readLine()) != null) {
                                line = line.replaceAll("<h1", "<h1 style='font-size:16px;margin-top:0'");
                                line = line.replaceAll("<h2", "<h2 style='font-size:16px;margin-top:0'");
                                line = line.replaceAll("<h3", "<h3 style='font-size:16px;margin-top:0'");
                                line = line.replaceAll("<p", "<p style='font-size:14px;text-indent:2em'");
                                detail.append(line);
                            }
                            br.close();
                            inputStreamReader.close();
                            fileInputStream.close();
                        } catch (FileNotFoundException e) {
                            e.printStackTrace();
                        } catch (UnsupportedEncodingException e) {
                            e.printStackTrace();
                        } catch (IOException e) {
                            e.printStackTrace();
                        }
                        detailResult = detail.toString();
                    } else {
                        detailResult = model_detailDesc;
                    }
                } else {
                    detailResult = model_detailDesc;
                }
            }
            modelItem.setDetail(detailResult);

            modelItem.setImage(modelItem.getImage());
            return modelItem;
        } catch (Exception e) {
            System.out.println("有人乱查数据库！！该ID不存在Model Item对象");
            throw new MyException(ResultEnum.NO_OBJECT);
        }
    }

    public ModelItem insert(ModelItemAddDTO modelItemAddDTO,String author) {

        ModelItem modelItem = new ModelItem();
        BeanUtils.copyProperties(modelItemAddDTO, modelItem);
        Date now = new Date();
        modelItem.setCreateTime(now);
        modelItem.setLastModifyTime(now);
        modelItem.setStatus(modelItemAddDTO.getStatus());
        modelItem.setAuthor(author);
        modelItem.setOid(UUID.randomUUID().toString());
        modelItem.setDetail(Utils.saveBase64Image(modelItemAddDTO.getDetail(),modelItem.getOid(),resourcePath,htmlLoadPath));

        String path="/modelItem/" + UUID.randomUUID().toString() + ".jpg";
        String[] strs=modelItemAddDTO.getUploadImage().split(",");
        if(strs.length>1) {
            String imgStr = modelItemAddDTO.getUploadImage().split(",")[1];
            Utils.base64StrToImage(imgStr, resourcePath + path);
            modelItem.setImage(path);
        }
        else {
            modelItem.setImage("");
        }

        ModelItemRelate modelItemRelate=new ModelItemRelate();

        modelItem.setRelate(new ModelItemRelate());
        return modelItemDao.insert(modelItem);
    }

    public int delete(String oid,String userName){
        ModelItem modelItem=modelItemDao.findFirstByOid(oid);
        if(!modelItem.getAuthor().equals(userName))
            return 2;
        else if(modelItem!=null){
            //删除图片
            String image=modelItem.getImage();
            if(image.contains("/modelItem/")) {
                //删除旧图片
                File file=new File(resourcePath+modelItem.getImage());
                if(file.exists()&&file.isFile())
                    file.delete();
            }

            List<String> relatedData=new ArrayList<>();
            for(int i=0;i<relatedData.size();i++){
                DataItem dataItem=dataItemDao.findFirstById(relatedData.get(i));
                dataItem.getRelatedModels().remove(oid);
                dataItemDao.save(dataItem);
            }

            modelItemDao.delete(modelItem);
            userService.modelItemMinusMinus(userName);
            return 1;
        }
        else{
            return -1;
        }
    }


    public JSONObject update(ModelItemUpdateDTO modelItemUpdateDTO, String uid){
        ModelItem modelItem=modelItemDao.findFirstByOid(modelItemUpdateDTO.getOid());
        String author=modelItem.getAuthor();
        String authorUserName = author;
        if(!modelItem.isLock()) {
            if (author.equals(uid)) {
                BeanUtils.copyProperties(modelItemUpdateDTO, modelItem);
                //判断是否为新图片
                String uploadImage = modelItemUpdateDTO.getUploadImage();
                if (!uploadImage.contains("/modelItem/") && !uploadImage.equals("")) {
                    //删除旧图片
                    File file = new File(resourcePath + modelItem.getImage());
                    if (file.exists() && file.isFile())
                        file.delete();
                    //添加新图片
                    String path = "/modelItem/" + UUID.randomUUID().toString() + ".jpg";
                    String imgStr = uploadImage.split(",")[1];
                    Utils.base64StrToImage(imgStr, resourcePath + path);
                    modelItem.setImage(path);
                }
                modelItem.setLastModifyTime(new Date());
                modelItem.setDetail(Utils.saveBase64Image(modelItemUpdateDTO.getDetail(),modelItem.getOid(),resourcePath,htmlLoadPath));
                modelItemDao.save(modelItem);

                JSONObject result = new JSONObject();
                result.put("method", "update");
                result.put("oid", modelItem.getOid());

                return result;
            } else {

                ModelItemVersion modelItemVersion = new ModelItemVersion();
                BeanUtils.copyProperties(modelItemUpdateDTO, modelItemVersion, "id");

                String uploadImage = modelItemUpdateDTO.getUploadImage();
                if(uploadImage.equals("")){
                    modelItemVersion.setImage("");
                }
                else if (!uploadImage.contains("/modelItem/") && !uploadImage.equals("")) {
                    String path = "/modelItem/" + UUID.randomUUID().toString() + ".jpg";
                    String imgStr = uploadImage.split(",")[1];
                    Utils.base64StrToImage(imgStr, resourcePath + path);
                    modelItemVersion.setImage(path);
                }
                else{
                    String[] names=uploadImage.split("modelItem");
                    modelItemVersion.setImage("/modelItem/"+names[1]);
                }

                modelItemVersion.setOriginOid(modelItem.getOid());
                modelItemVersion.setOid(UUID.randomUUID().toString());
                modelItemVersion.setModifier(uid);
                Date curDate = new Date();
                modelItemVersion.setModifyTime(curDate);
                modelItemVersion.setVerNumber(curDate.getTime());
                modelItemVersion.setVerStatus(0);
                userService.messageNumPlusPlus(authorUserName);
                modelItemVersion.setDetail(Utils.saveBase64Image(modelItemUpdateDTO.getDetail(),modelItem.getOid(),resourcePath,htmlLoadPath));
                modelItemVersion.setCreator(author);
                modelItemVersionDao.insert(modelItemVersion);

                modelItem.setLock(true);
                modelItemDao.save(modelItem);

                JSONObject result = new JSONObject();
                result.put("method", "version");
                result.put("oid", modelItemVersion.getOid());

                return result;
            }
        }
        else{

            return null;
        }
    }

    public JSONArray getRelation(String oid,String type){

        JSONArray result=new JSONArray();
        ModelItem modelItem=modelItemDao.findFirstByOid(oid);
        ModelItemRelate relation=modelItem.getRelate();
        List<String> list=new ArrayList<>();

        switch (type){
            case "dataItem":
                list=modelItem.getRelatedData();
                if(list!=null){
                    for(String id:list){
                        DataItem dataItem=dataItemDao.findFirstById(id);
                        if(dataItem.getStatus().equals("Private")){
                            continue;
                        }
                        JSONObject item=new JSONObject();
                        item.put("oid",dataItem.getId());
                        item.put("name",dataItem.getName());
                        User user=userService.getByOid(dataItem.getAuthor());
                        item.put("author",user.getName());
                        item.put("author_uid", user.getUserName());
                        result.add(item);
                    }
                }
                break;
            case "modelItem":
                list=relation.getModelItems();
                if(list!=null) {
                    for (String id : list) {
                        ModelItem modelItem1 = modelItemDao.findFirstByOid(id);
                        if(modelItem1.getStatus().equals("Private")){
                            continue;
                        }
                        JSONObject item = new JSONObject();
                        item.put("oid", modelItem1.getOid());
                        item.put("name", modelItem1.getName());
                        item.put("author", userService.getByUid(modelItem1.getAuthor()).getName());
                        item.put("author_uid", modelItem1.getAuthor());
                        result.add(item);
                    }
                }
                break;
            case "conceptualModel":
                list=relation.getConceptualModels();
                if(list!=null) {
                    for (String id : list) {
                        ConceptualModel conceptualModel = conceptualModelDao.findFirstByOid(id);
                        if(conceptualModel.getStatus().equals("Private")){
                            continue;
                        }
                        JSONObject item = new JSONObject();
                        item.put("oid", conceptualModel.getOid());
                        item.put("name", conceptualModel.getName());
                        item.put("author", userService.getByUid(conceptualModel.getAuthor()).getName());
                        item.put("author_uid", conceptualModel.getAuthor());
                        result.add(item);
                    }
                }
                break;
            case "logicalModel":
                list=relation.getLogicalModels();
                if(list!=null) {
                    for (String id : list) {
                        LogicalModel logicalModel = logicalModelDao.findFirstByOid(id);
                        if(logicalModel.getStatus().equals("Private")){
                            continue;
                        }
                        JSONObject item = new JSONObject();
                        item.put("oid", logicalModel.getOid());
                        item.put("name", logicalModel.getName());
                        item.put("author", userService.getByUid(logicalModel.getAuthor()).getName());
                        item.put("author_uid", logicalModel.getAuthor());
                        result.add(item);
                    }
                }
                break;
            case "computableModel":
                list=relation.getComputableModels();
                if(list!=null) {
                    for (String id : list) {
                        ComputableModel computableModel = computableModelDao.findFirstByOid(id);
                        if(computableModel.getStatus().equals("Private")){
                            continue;
                        }
                        JSONObject item = new JSONObject();
                        item.put("oid", computableModel.getOid());
                        item.put("name", computableModel.getName());
                        item.put("author", userService.getByUid(computableModel.getAuthor()).getName());
                        item.put("author_uid", computableModel.getAuthor());
                        result.add(item);
                    }
                }
                break;
            case "concept":
                list=relation.getConcepts();
                if(list!=null) {
                    for (String id : list) {
                        Concept concept = conceptDao.findByOid(id);
                        if(concept.getStatus().equals("Private")){
                            continue;
                        }
                        JSONObject item = new JSONObject();
                        item.put("oid", concept.getOid());
                        item.put("name", concept.getName());
                        item.put("author", userService.getByUid(concept.getAuthor()).getName());
                        item.put("author_uid", concept.getAuthor());
                        result.add(item);
                    }
                }
                break;
            case "spatialReference":
                list=relation.getSpatialReferences();
                if(list!=null) {
                    for (String id : list) {
                        SpatialReference spatialReference = spatialReferenceDao.findByOid(id);
                        if(spatialReference.getStatus().equals("Private")){
                            continue;
                        }
                        JSONObject item = new JSONObject();
                        item.put("oid", spatialReference.getOid());
                        item.put("name", spatialReference.getName());
                        item.put("author", userService.getByUid(spatialReference.getAuthor()).getName());
                        item.put("author_uid", spatialReference.getAuthor());
                        result.add(item);
                    }
                }
                break;
            case "template":
                list=relation.getTemplates();
                if(list!=null) {
                    for (String id : list) {
                        Template template = templateDao.findByOid(id);
                        if(template.getStatus().equals("Private")){
                            continue;
                        }
                        JSONObject item = new JSONObject();
                        item.put("oid", template.getOid());
                        item.put("name", template.getName());
                        item.put("author", userService.getByUid(template.getAuthor()).getName());
                        item.put("author_uid", template.getAuthor());
                        result.add(item);
                    }
                }
                break;
            case "unit":
                list=relation.getUnits();
                if(list!=null) {
                    for (String id : list) {
                        Unit unit = unitDao.findByOid(id);
                        if(unit.getStatus().equals("Private")){
                            continue;
                        }
                        JSONObject item = new JSONObject();
                        item.put("oid", unit.getOid());
                        item.put("name", unit.getName());
                        item.put("author", userService.getByUid(unit.getAuthor()).getName());
                        item.put("author_uid", unit.getAuthor());
                        result.add(item);
                    }
                }
                break;

        }

        return result;
    }

    public String setRelation(String oid,String type,List<String> relations){

        ModelItem modelItem=modelItemDao.findFirstByOid(oid);
        ModelItemRelate relate=modelItem.getRelate();

        switch (type){
            case "dataItem":

                List<String> relationDelete=new ArrayList<>();
                for(int i=0;i<modelItem.getRelatedData().size();i++){
                    relationDelete.add(modelItem.getRelatedData().get(i));
                }
                List<String> relationAdd=new ArrayList<>();
                for(int i=0;i<relations.size();i++){
                    relationAdd.add(relations.get(i));
                }

                for(int i=0;i<relationDelete.size();i++){
                    for(int j=0;j<relationAdd.size();j++){
                        if(relationDelete.get(i).equals(relationAdd.get(j))){
                            relationDelete.set(i,"");
                            relationAdd.set(j,"");
                            break;
                        }
                    }
                }

                for(int i=0;i<relationDelete.size();i++){
                    String id=relationDelete.get(i);
                    if(!id.equals("")) {
                        DataItem dataItem = dataItemDao.findFirstById(id);
                        if(dataItem.getRelatedModels()!=null) {
                            dataItem.getRelatedModels().remove(oid);
                            dataItemDao.save(dataItem);
                        }
                    }
                }

                for(int i=0;i<relationAdd.size();i++){
                    String id=relationAdd.get(i);
                    if(!id.equals("")) {
                        DataItem dataItem = dataItemDao.findFirstById(id);
                        if(dataItem.getRelatedModels()!=null) {
                            dataItem.getRelatedModels().add(oid);
                        }
                        else{
                            List<String> relatedModels=new ArrayList<>();
                            relatedModels.add(oid);
                            dataItem.setRelatedModels(relatedModels);
                        }
                        dataItemDao.save(dataItem);
                    }
                }

                modelItem.setRelatedData(relations);
                break;
            case "modelItem":
                relate.setModelItems(relations);
                break;
            case "conceptualModel":
                relate.setConceptualModels(relations);
                break;
            case "logicalModel":
                relate.setLogicalModels(relations);
                break;
            case "computableModel":
                relate.setComputableModels(relations);
                break;
            case "concept":
                relate.setConcepts(relations);
                break;
            case "spatialReference":
                relate.setSpatialReferences(relations);
                break;
            case "template":
                relate.setTemplates(relations);
                break;
            case "unit":
                relate.setUnits(relations);
                break;
        }

        modelItem.setRelate(relate);
        modelItemDao.save(modelItem);

        return "suc";
    }

    public JSONObject bindModel(int type, String name, String oid){

        JSONObject result=new JSONObject();
        ModelItem modelItem=modelItemDao.findFirstByName(name);
        if(modelItem==null){
            result.put("code",-1);
        }
        else{
            ModelItemRelate modelItemRelate=modelItem.getRelate();
            switch (type){
                case 1:
                    ConceptualModel conceptualModel=conceptualModelDao.findFirstByOid(oid);
                    ConceptualModel newConceptualModel=new ConceptualModel();
                    BeanUtils.copyProperties(conceptualModel,newConceptualModel);
                    newConceptualModel.setId(null);
                    newConceptualModel.setOid(UUID.randomUUID().toString());
                    newConceptualModel.setRelateModelItem(modelItem.getOid());
                    conceptualModelDao.insert(newConceptualModel);
                    List<String> conceptualList=modelItemRelate.getConceptualModels();
                    conceptualList.add(newConceptualModel.getOid());
                    modelItemRelate.setConceptualModels(conceptualList);
                    result.put("oid",newConceptualModel.getOid());
                    break;
                case 2:
                    LogicalModel logicalModel=logicalModelDao.findFirstByOid(oid);
                    LogicalModel newLogicalModel=new LogicalModel();
                    BeanUtils.copyProperties(logicalModel,newLogicalModel);
                    newLogicalModel.setId(null);
                    newLogicalModel.setOid(UUID.randomUUID().toString());
                    newLogicalModel.setRelateModelItem(modelItem.getOid());
                    logicalModelDao.insert(newLogicalModel);
                    List<String> LogicalList=modelItemRelate.getLogicalModels();
                    LogicalList.add(newLogicalModel.getOid());
                    modelItemRelate.setLogicalModels(LogicalList);
                    result.put("oid",newLogicalModel.getOid());
                    break;
                case 3:
                    ComputableModel computableModel=computableModelDao.findFirstByOid(oid);
                    ComputableModel newComputableModel=new ComputableModel();
                    BeanUtils.copyProperties(computableModel,newComputableModel);
                    newComputableModel.setId(null);
                    newComputableModel.setOid(UUID.randomUUID().toString());
                    newComputableModel.setRelateModelItem(modelItem.getOid());
                    computableModelDao.insert(newComputableModel);
                    List<String> ComputableList=modelItemRelate.getComputableModels();
                    ComputableList.add(newComputableModel.getOid());
                    modelItemRelate.setComputableModels(ComputableList);
                    result.put("oid",newComputableModel.getOid());
                    break;
            }
            modelItem.setRelate(modelItemRelate);
            modelItemDao.save(modelItem);
            result.put("code",1);
        }
        return result;
    }

    public JSONObject listByUserOid(ModelItemFindDTO modelItemFindDTO,String oid,String loadUser){

        int page = modelItemFindDTO.getPage();
        int pageSize = modelItemFindDTO.getPageSize();
        String sortElement=modelItemFindDTO.getSortElement();
        Sort sort = new Sort(modelItemFindDTO.getAsc() ? Sort.Direction.ASC : Sort.Direction.DESC, sortElement);
        Pageable pageable = PageRequest.of(page, pageSize, sort);
        User user=userDao.findFirstByOid(oid);
        Page<ModelItemResultDTO> modelItemPage = Page.empty();

        if(loadUser == null||!loadUser.equals(oid)){
            modelItemPage=modelItemDao.findByAuthorAndStatusIn(user.getUserName(),itemStatusVisible,pageable);
        }

        else {
            modelItemPage=modelItemDao.findByAuthor(user.getUserName(),pageable);
        }


        JSONObject result=new JSONObject();

        result.put("list",modelItemPage.getContent());
        result.put("total", modelItemPage.getTotalElements());

//        System.out.println(result);
        return result;
    }

    public JSONObject list(ModelItemFindDTO modelItemFindDTO, String userName,List<String> classes) {

        JSONObject obj = new JSONObject();
        //TODO Sort是可以设置排序字段的
        int page = modelItemFindDTO.getPage();
        int pageSize = modelItemFindDTO.getPageSize();
        String searchText = modelItemFindDTO.getSearchText();
        //List<String> classifications=modelItemFindDTO.getClassifications();
        //默认以viewCount排序
        Sort sort = new Sort(modelItemFindDTO.getAsc() ? Sort.Direction.ASC : Sort.Direction.DESC, "viewCount");
        Pageable pageable = PageRequest.of(page, pageSize, sort);

        Classification classification=classificationService.getByOid(classes.get(0));
        if(classification!=null) {
            List<String> children = classification.getChildrenId();
            if (children.size() > 0) {
                for (String child : children
                        ) {
                    classes.add(child);
                    Classification classification1=classificationService.getByOid(child);
                    List<String> children1=classification1.getChildrenId();
                    if(children1.size()>0){
                        for(String child1:children1){
                            classes.add(child1);
                        }
                    }
                }
            }
        }

        Page<ModelItemResultDTO> modelItemPage = null;
        if(userName==null){
            if (searchText.equals("")&&classes.get(0).equals("all")) {
                modelItemPage = modelItemDao.findAllByNameContainsAndStatusIn("",itemStatusVisible,pageable);
            } else if(!searchText.equals("")&&classes.get(0).equals("all")) {
                modelItemPage = modelItemDao.findByNameContainsIgnoreCaseAndStatusIn(searchText, itemStatusVisible, pageable);
            } else if(searchText.equals("")&&!classes.get(0).equals("all")){
                modelItemPage = modelItemDao.findByClassificationsInAndStatusIn(classes, itemStatusVisible, pageable);
            }else{
                modelItemPage = modelItemDao.findByNameContainsIgnoreCaseAndClassificationsIn(searchText,classes, pageable);
            }
        }else{
            if (searchText.equals("")&&classes.get(0).equals("all")) {
                modelItemPage = modelItemDao.findAllByNameContainsAndAuthor("",userName,pageable);
            } else if(!searchText.equals("")&&classes.get(0).equals("all")) {
                modelItemPage = modelItemDao.findByNameContainsIgnoreCaseAndAuthor(searchText,userName, pageable);
            } else if(searchText.equals("")&&!classes.get(0).equals("all")){
                modelItemPage = modelItemDao.findByClassificationsInAndAuthor(classes,userName, pageable);
            }else{
                modelItemPage = modelItemDao.findByNameContainsIgnoreCaseAndClassificationsInAndAuthor(searchText,classes,userName, pageable);
            }
        }


        List<ModelItemResultDTO> modelItems=modelItemPage.getContent();
        JSONArray users=new JSONArray();
        for(int i=0;i<modelItems.size();i++){
            ModelItemResultDTO modelItem=modelItems.get(i);
            String image=modelItem.getImage();
            if(!image.equals("")) {
                modelItem.setImage(htmlLoadPath + image);
            }

            JSONObject userObj=new JSONObject();
            User user=userDao.findFirstByUserName(modelItems.get(i).getAuthor());
            userObj.put("oid",user.getOid());
            userObj.put("image",user.getImage().equals("")?"":htmlLoadPath+user.getImage());
            userObj.put("name",user.getName());

            users.add(userObj);

            modelItems.get(i).setAuthor_name(user.getName());
            modelItems.get(i).setAuthor_oid(user.getOid());
//            modelItems.get(i).setAuthor(user.getName());

        }

        obj.put("list", modelItems);
        obj.put("total", modelItemPage.getTotalElements());
        obj.put("pages", modelItemPage.getTotalPages());
        obj.put("users",users);

        return obj;
    }

    public ModelItem findByName(String name){

        return modelItemDao.findFirstByName(name);
    }

    public List<String> findNamesByName(String name){
        Pageable pageable = PageRequest.of(0, 15, new Sort(Sort.Direction.ASC,"viewCount"));
        Page<ModelItemResultDTO> modelItems=modelItemDao.findByNameContainsIgnoreCase(name,pageable);
        List<String> resultList=new ArrayList<>();
        for(int i=0;i<modelItems.getContent().size();i++){
            resultList.add(modelItems.getContent().get(i).getName());
        }
        return resultList;
    }

    public String analysisDOI(String DOI) {
        ArrayList<String> DOIdata = getDOIdata(DOI);
        if (DOIdata == null)
            return "ERROR";
        else if (DOIdata.get(0) == "Connection timed out: connect") {
            return "Connection timed out";
        } else {
            JSONObject result = new JSONObject();
            for (int i = 0; i < DOIdata.size(); i++) {
                String str = DOIdata.get(i);
                if (str.contains("author =")) {
                    int j = 1;
                    do {
                        str += DOIdata.get(i + j);
                        j++;
                    } while (!DOIdata.get(i + j).contains("="));
                    String author = str.split("=")[1];
                    author = author.replaceAll("\\{", "");
                    author = author.replaceAll("\\}", "");
                    author = author.replaceAll("\\,", "");
                    author = author.replaceAll("\"", "");
                    author = author.replaceAll("\\\\", "");
                    System.out.println(author);

                    String[] names = author.split(" and ");
                    for (int k = 0; k < names.length; k++) {
                        names[k] = names[k].trim();
                        System.out.println(names[k]);
                    }
                    result.put("author", names);
                } else if (str.contains("=")) {
                    String[] prop = str.split("=");
                    String key = prop[0].trim();
                    String value = prop[1].replaceAll("\"", "");
                    value = value.replaceAll("\\{", "");
                    value = value.replaceAll("\\}", "");
                    value = value.replaceAll("\\$", "");
                    value = value.replaceAll("\\_", "");
                    value = value.replaceAll("\\,", "");
                    value = value.replaceAll("\\\\", "");
                    value = value.trim();
                    result.put(key, value);
                } else {
                }
            }
            return result.toString();
        }
    }

    private ArrayList<String> getDOIdata(String DOI) {
        ArrayList<String> DOIdata = new ArrayList<>();
        try {
            String str = "http://adsabs.harvard.edu/cgi-bin/nph-bib_query?bibcode=" + DOI + "&data_type=BIBTEX";
            URL url = new URL(str);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("GET");
            connection.connect();
            int responseCode = connection.getResponseCode();
            if (responseCode == HttpURLConnection.HTTP_OK) {
                InputStream inputStream = connection.getInputStream();
                BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream));
                String line;

                while ((line = reader.readLine()) != null) {
                    if (!line.equals("")) {
                        DOIdata.add(line);
                        System.out.println(line);
                    }
                }
                reader.close();
                connection.disconnect();
                return DOIdata;
            } else {
                //DOIdata.add(String.valueOf(responseCode));
                return null;
            }

        } catch (Exception e) {
            e.printStackTrace();

            //DOIdata.add(e.getMessage());
            return null;
        }


    }

    public JSONObject query(ModelItemFindDTO modelItemFindDTO,List<String> connects, List<String> props, List<String> values, List<String> nodeID) throws ParseException {

        ModelDao modelDao=new ModelDao();

        BasicDBObject query = new BasicDBObject();

        //prop
        for (int i = 0; i < values.size(); i += 2) {
            if(values.get(i).trim().equals("")&&values.get(i+1).trim().equals("")){

                continue;
            }
            BasicDBObject condition = new BasicDBObject();
            String field = propMapping(props.get(i / 2));
            String conn = getConn(connects.get(i));
            switch (connects.get(i)) {
                case "AND"://NOT (A AND C)===(NOT A) OR (NOT C)
                    Pattern pattern = Pattern.compile("^.*" + values.get(i).trim() + ".*$", Pattern.CASE_INSENSITIVE);
                    //BasicDBObject condition1=new BasicDBObject("$regex",values.get(i));
                    BasicDBObject obj1 = new BasicDBObject(field, pattern);
                    Pattern pattern1 = Pattern.compile("^.*" + values.get(i + 1).trim() + ".*$", Pattern.CASE_INSENSITIVE);
                    //BasicDBObject condition2=new BasicDBObject("$regex",values.get(i+1));
                    BasicDBObject obj2 = new BasicDBObject(field, pattern1);
                    condition = new BasicDBObject(conn, Arrays.asList(obj1, obj2));
                    if(i!=0&&connects.get(i-1).equals("NOT")){
                        obj1=new BasicDBObject("$not",obj1);
                        obj2=new BasicDBObject("$not",obj2);
                        condition = new BasicDBObject("$or", Arrays.asList(obj1, obj2));
                    }


                    break;
                case "OR":
                    pattern = Pattern.compile("^.*(" + values.get(i).trim() + "|" + values.get(i + 1).trim() + ").*$", Pattern.CASE_INSENSITIVE);
                    condition = new BasicDBObject(field, pattern);


                    if(i!=0&&connects.get(i-1).equals("NOT")){
                        pattern = Pattern.compile("^.*" + values.get(i).trim() + ".*$", Pattern.CASE_INSENSITIVE);
                        BasicDBObject condition1=new BasicDBObject("$not",pattern);
                        obj1 = new BasicDBObject(field, pattern);
                        pattern1 = Pattern.compile("^.*" + values.get(i + 1).trim() + ".*$", Pattern.CASE_INSENSITIVE);
                        BasicDBObject condition2=new BasicDBObject("$not",pattern1);
                        obj2 = new BasicDBObject(field, pattern1);
//                        obj1=new BasicDBObject("$not",obj1);
//                        obj2=new BasicDBObject("$not",obj2);
                        condition = new BasicDBObject("$and", Arrays.asList(obj1, obj2));
                    }

                    break;
                case "NOT":
                    pattern = Pattern.compile("^.*" + values.get(i).trim() + ".*$", Pattern.CASE_INSENSITIVE);
                    //BasicDBObject condition1=new BasicDBObject("$regex",values.get(i));
                    obj1 = new BasicDBObject(field, pattern);
                    //pattern1 = Pattern.compile("^((?!" + values.get(i + 1).trim() + ").)+$", Pattern.CASE_INSENSITIVE);
                    pattern1 = Pattern.compile("^.*" + values.get(i + 1).trim() + ".*$", Pattern.CASE_INSENSITIVE);
                    BasicDBObject condition2=new BasicDBObject("$not",pattern1);
                    obj2 = new BasicDBObject(field, condition2);
                    //obj2=new BasicDBObject("$not",obj2);

                    if(i!=0&&connects.get(i-1).equals("NOT")){
                        pattern = Pattern.compile("^.*" + values.get(i+1).trim() + ".*$", Pattern.CASE_INSENSITIVE);
                        //BasicDBObject condition1=new BasicDBObject("$regex",values.get(i));
                        obj1 = new BasicDBObject(field, pattern);
                        pattern1 = Pattern.compile("^.*" + values.get(i).trim() + ".*$", Pattern.CASE_INSENSITIVE);
                        condition2=new BasicDBObject("$not",pattern1);
                        obj2 = new BasicDBObject(field, condition2);
                    }

                    condition = new BasicDBObject(conn, Arrays.asList(obj1, obj2));
                    break;
            }

            if (i == 0) {
                query = condition;
            } else {
                conn = getConn(connects.get(i - 1));
                query = new BasicDBObject(conn, Arrays.asList(condition, query));
            }
        }

        //parents
        BasicDBObject query_parents=new BasicDBObject();
        if(!nodeID.get(0).equals("all")) {
            for (int i = 0; i < nodeID.size(); i++) {
                BasicDBObject query1 = new BasicDBObject("classifications.", nodeID.get(i));
                if (i == 0) {
                    query_parents = query1;
                } else {
                    query_parents = new BasicDBObject("$or", Arrays.asList(query_parents, query1));
                }
            }
            query = new BasicDBObject("$and", Arrays.asList(query, query_parents));
        }

        long start = System.currentTimeMillis();

        MongoCollection<Document> Col = modelDao.GetCollection("Portal", "modelItem");

        long total=0;
        if(query.size()==0){
            total=modelItemDao.count();
        }
//        String jsonStr=JSONObject.toJSONString(query);
//        Document countDoc=Document.parse(jsonStr);
//        MongoClient mongoClient=new MongoClient("172.21.213.33",27017);
//        MongoTemplate mongoTemplate=new MongoTemplate(new SimpleMongoDbFactory(mongoClient,"Portal"));
//        long total=mongoTemplate.getCollection("modelItem").count(countDoc);
        FindIterable<Document> findIterable = modelDao.RetrieveDocs(Col, query, modelDao.getSort("viewCount", modelItemFindDTO.getAsc()));

        MongoCursor<Document> findCursor=findIterable.iterator();

        long time1=System.currentTimeMillis();
        System.out.println("findCursor Define:"+(time1-start));
        if(total==0) {
            //查询结果为全部对象时，不遍历
            while (findCursor.hasNext()) {
                Document document = findCursor.next();
                total++;
            }
        }

        findCursor.close();
        long time2=System.currentTimeMillis();
        System.out.println("count Time:"+(time2-time1));

        MongoCursor<Document> cursor=findIterable.limit(10).skip(modelItemFindDTO.getPage()*10).iterator();
        JSONObject output=new JSONObject();
        JSONArray list = new JSONArray();
        while (cursor.hasNext()) {

            JSONObject jsonObj = new JSONObject();
            Document doc = cursor.next();
            Date CreateTime = doc.getDate("createTime");
            String sDate = (new SimpleDateFormat("yyyy-MM-dd HH:mm:ss")).format(CreateTime);
            doc.put("createTime",sDate);

            list.add(JSONObject.parse(doc.toJson()));

        }
        cursor.close();

        long time3=System.currentTimeMillis();
        System.out.println("read for result Time:"+(time3-time2));

        //users
        JSONArray users=new JSONArray();
        for(int i=0;i<list.size();i++){
            JSONObject userObj=new JSONObject();
            User user=userDao.findFirstByUserName(list.getJSONObject(i).getString("author"));
            userObj.put("oid",user.getOid());
            userObj.put("image",user.getImage());
            userObj.put("name",user.getName());
            users.add(userObj);
        }

        long time4=System.currentTimeMillis();
        System.out.println("user Time:"+(time4-time3));

        output.put("total",total);
        output.put("pages",Math.ceil(total));
        output.put("list",list);
        output.put("users",users);



        return output;
    }

    public JSONObject getModelItemsByUserId(String userId, int page, String sortType, int asc){

        Sort sort = new Sort(asc==1 ? Sort.Direction.ASC : Sort.Direction.DESC, "createTime");

        Pageable pageable = PageRequest.of(page, 10, sort);

        Page<ModelItemResultDTO> modelItems = modelItemDao.findByAuthor(userId,pageable);

        JSONObject modelItemObject = new JSONObject();
        modelItemObject.put("count",modelItems.getTotalElements());
        modelItemObject.put("modelItems",modelItems.getContent());

        return modelItemObject;

    }

    public JSONObject searchModelItemsByUserId(String searchText,String userId, int page, String sortType, int asc){

        Sort sort = new Sort(asc==1 ? Sort.Direction.ASC : Sort.Direction.DESC, "createTime");

        Pageable pageable = PageRequest.of(page, 10, sort);

        Page<ModelItemResultDTO> modelItems = modelItemDao.findByNameContainsIgnoreCaseAndAuthor(searchText,userId,pageable);

        JSONObject modelItemObject = new JSONObject();
        modelItemObject.put("count",modelItems.getTotalElements());
        modelItemObject.put("modelItems",modelItems.getContent());

        return modelItemObject;

    }

    public JSONObject searchByTitleByOid(ModelItemFindDTO modelItemFindDTO, String oid ,String loadUser){
        String userName=userDao.findFirstByOid(oid).getUserName();
        int page=modelItemFindDTO.getPage();
        int pageSize = modelItemFindDTO.getPageSize();
        String sortElement=modelItemFindDTO.getSortElement();
        Boolean asc = modelItemFindDTO.getAsc();
        String name= modelItemFindDTO.getSearchText();

        Sort sort=new Sort(asc?Sort.Direction.ASC:Sort.Direction.DESC,sortElement);
        Pageable pageable=PageRequest.of(page,pageSize,sort);
        Page<ModelItemResultDTO> modelItemResultDTOPage = Page.empty();

        if(loadUser == null||!loadUser.equals(oid)){
            modelItemResultDTOPage=modelItemDao.findByNameContainsIgnoreCaseAndAuthorAndStatusIn(name,userName,itemStatusVisible,pageable);
        }else{
            modelItemResultDTOPage=modelItemDao.findByNameContainsIgnoreCaseAndAuthor(name,userName,pageable);
        }



        JSONObject result=new JSONObject();
        result.put("list",modelItemResultDTOPage.getContent());
        result.put("total",modelItemResultDTOPage.getTotalElements());
//        System.out.println(result);
        return result;

    }

    public String searchByElsevierDOI(String doi) throws IOException {
        String str = "https://api.elsevier.com/content/article/doi/"+doi+"?apiKey=e59f63ca86ba019181c8d3a53f495532";
        URL url = new URL(str);
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
        connection.setRequestMethod("GET");
        connection.setConnectTimeout(9000);
        connection.connect();
        int responseCode = connection.getResponseCode();
        String articleXml = new String();
        if (responseCode == HttpURLConnection.HTTP_OK) {
            InputStream inputStream = connection.getInputStream();
            BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream));
            String line;
            int length = connection.getContentLength();
            while ((line = reader.readLine()) != null) {
                if (!line.equals("")) {
                    articleXml+=line+"\n";
                }
            }
            reader.close();
            connection.disconnect();
            return articleXml;
        } else {
            //DOIdata.add(String.valueOf(responseCode));
            return null;
        }
    }

    public boolean findReferExisted(String modelOid,String doi){

        ModelItem modelItem = modelItemDao.findFirstByOid(modelOid);
        List<Reference> references = modelItem.getReferences();
        for(Reference reference:references){
            if(reference.getDoi().equals(doi))
                return true;
        }

        return false;
    }

    public JSONObject getArticleByDOI(String Doi,String modelOid,String contributor) throws IOException, DocumentException {
        String[] eles= Doi.split("/");

        String doi = eles[eles.length-2]+"/"+eles[eles.length-1];

        String xml =  searchByElsevierDOI(doi);

        JSONObject result = new JSONObject();

        if(xml == null){
            result.put("find",0);
            return result;
        }
        else  if (xml.equals("Connection timed out: connect") ) {
            result.put("find",-1);
            return result;
        }  else{
            //dom4j解析xml
            org.dom4j.Document doc = null;
            doc = DocumentHelper.parseText(xml);
            Element root = doc.getRootElement();
            System.out.println("根节点：" + root.getName());
            Element coredata = root.element("coredata");
            String title = coredata.elementTextTrim("title");
            String journal = coredata.elementTextTrim("publicationName");

            String pageRange = coredata.elementTextTrim("pageRange");
            String coverDate = coredata.elementTextTrim("coverDate");
            String volume = coredata.elementTextTrim("volume");
            List links = coredata.elements("link");
            String link = ((Element)links.get(1)).attribute("href").getValue();

            Iterator authorIte = coredata.elementIterator("creator");
            List<String> authors = new ArrayList<>();
            while (authorIte.hasNext()) {
                Element record = (Element) authorIte.next();
                String author = record.getText();
                authors.add(author);
            }

            Article article = new Article();
            article.setTitle(title);
            article.setJournal(journal);
            article.setVolume(volume);
            article.setPageRange(pageRange);
            article.setDate(coverDate);
            article.setAuthors(authors);
            article.setLink(link);
            article.setDoi(doi);
            if(findReferExisted(modelOid,doi)) {//同一模型条目下有重复上传
                result.put("find",2);
                result.put("article",article);
            }else{
                result.put("find",1);
                result.put("article",article);
            }
            doc = null;
            System.gc();
//            user中加入这个字段
//            User user = userDao.findFirstByUserName(contributor);
//            List<String>articles = user.getArticles();
//            articles.add(article.getOid());
//            user.setArticles(articles);

//            userDao.save(user);
            return result;
        }
    }

    String getConn(String str) {
        String conn = "";
        switch (str) {
            case "AND":
            case "NOT":
                conn = "$and";
                break;
            case "OR":
                conn = "$or";
                break;
        }
        return conn;
    }

    String propMapping(String str) {
        String name = "";
        switch (str) {
            case "Model Name":
                name = "name";
                break;
            case "Keyword":
                name = "keywords.";
                break;
            case "Overview":
                name = "description";
                break;
            case "Description":
                name = "description";
                break;
            case "Provider":
                name = "author";
                break;
            case "Reference":
                name = "references.title";
                break;
        }
        return name;
    }

}
