package njgis.opengms.portal.service;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.mongodb.BasicDBObject;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoCursor;
import njgis.opengms.portal.dao.*;
import njgis.opengms.portal.dto.ConceptualModel.ConceptualModelFindDTO;
import njgis.opengms.portal.dto.ConceptualModel.ConceptualModelResultDTO;
import njgis.opengms.portal.dto.modelItem.ModelItemFindDTO;
import njgis.opengms.portal.entity.*;
import njgis.opengms.portal.entity.support.AuthorInfo;
import njgis.opengms.portal.entity.support.ModelItemRelate;
import njgis.opengms.portal.enums.ResultEnum;
import njgis.opengms.portal.exception.MyException;
import njgis.opengms.portal.utils.MxGraphUtils;
import njgis.opengms.portal.utils.Utils;
import org.bson.Document;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.regex.Pattern;

import static njgis.opengms.portal.utils.Utils.saveFiles;

/**
 * @ClassName ModelItemService
 * @Description todo
 * @Author Kai
 * @Date 2019/2/21
 * @Version 1.0.0
 * TODO
 */

@Service

public class ConceptualModelService {
    @Autowired
    ItemService itemService;

    @Autowired
    ConceptualModelDao conceptualModelDao;

    @Autowired
    ConceptualModelVersionDao conceptualModelVersionDao;

    @Autowired
    ModelItemDao modelItemDao;

    @Autowired
    UserDao userDao;

    @Autowired
    ClassificationService classificationService;

    @Autowired
    UserService userService;

    @Value("${resourcePath}")
    private String resourcePath;

    @Value("${htmlLoadPath}")
    private String htmlLoadPath;

    public ModelAndView getPage(String id , HttpServletRequest request) {
        //条目信息
        ConceptualModel modelInfo = getByOid(id);

        modelInfo=(ConceptualModel)itemService.recordViewCount(modelInfo);

        conceptualModelDao.save(modelInfo);
        //类
        JSONArray classResult = new JSONArray();

        List<String> classifications = modelInfo.getClassifications();
        if (classifications != null) {
            for (int i = 0; i < classifications.size(); i++) {

                JSONArray array = new JSONArray();
                String classId = classifications.get(i);

                do {
                    Classification classification = classificationService.getByOid(classId);
                    array.add(classification.getNameEn());
                    classId = classification.getParentId();
                } while (classId != null);

                JSONArray array1 = new JSONArray();
                for (int j = array.size() - 1; j >= 0; j--) {
                    array1.add(array.getString(j));
                }

                classResult.add(array1);

            }
        }

        //时间
        Date date = modelInfo.getCreateTime();
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");
        String dateResult = simpleDateFormat.format(date);

        String lastModifyTime = simpleDateFormat.format(modelInfo.getLastModifyTime());

        //用户信息
        JSONObject userJson = userService.getItemUserInfo(modelInfo.getAuthor());

        //修改者信息
        String lastModifier = modelInfo.getLastModifier();
        JSONObject modifierJson = null;
        if (lastModifier != null) {
            modifierJson = userService.getItemUserInfo(lastModifier);
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

        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("conceptual_model");
        modelAndView.addObject("modelInfo", modelInfo);
        modelAndView.addObject("classifications", classResult);
        modelAndView.addObject("date", dateResult);
        modelAndView.addObject("year", calendar.get(Calendar.YEAR));
        modelAndView.addObject("user", userJson);
        modelAndView.addObject("authorship", authorshipString);
        modelAndView.addObject("loadPath", htmlLoadPath);
        modelAndView.addObject("lastModifier", modifierJson);
        modelAndView.addObject("lastModifyTime", lastModifyTime);

        return modelAndView;
    }

    public ConceptualModel getByOid(String id) {
        try {
            return conceptualModelDao.findFirstByOid(id);
        } catch (Exception e) {
            System.out.println("有人乱查数据库！！该ID不存在Model Item对象");
            throw new MyException(ResultEnum.NO_OBJECT);
        }
    }

    public JSONObject insert(List<MultipartFile> files, JSONObject jsonObject, String uid) {
        JSONObject result = new JSONObject();
        ConceptualModel conceptualModel = new ConceptualModel();

        String path = resourcePath + "/conceptualModel";
        List<String> images = new ArrayList<>();
        saveFiles(files, path, uid, "/conceptualModel",images);
        if (images == null) {
            result.put("code", -1);
        } else {
            try {
                if(jsonObject.getString("contentType").equals("MxGraph")) {
                    String name = new Date().getTime() + "_MxGraph.png";
                    MxGraphUtils mxGraphUtils = new MxGraphUtils();
                    mxGraphUtils.exportImage(jsonObject.getInteger("w"), jsonObject.getInteger("h"), jsonObject.getString("xml"), path + "/" + uid + "/", name);
                    images=new ArrayList<>();
                    images.add("/conceptualModel" + "/" + uid + "/"+ name);
                }
                conceptualModel.setImage(images);
                conceptualModel.setOid(UUID.randomUUID().toString());
                conceptualModel.setName(jsonObject.getString("name"));
                conceptualModel.setDetail(jsonObject.getString("detail"));
                JSONArray jsonArray = jsonObject.getJSONArray("authorship");
                List<AuthorInfo> authorship = new ArrayList<>();
                for (int i = 0; i < jsonArray.size(); i++) {
                    JSONObject author = jsonArray.getJSONObject(i);
                    AuthorInfo authorInfo = new AuthorInfo();
                    authorInfo.setName(author.getString("name"));
                    authorInfo.setEmail(author.getString("email"));
                    authorInfo.setIns(author.getString("ins"));
                    authorInfo.setHomepage(author.getString("homepage"));
                    authorship.add(authorInfo);
                }
                conceptualModel.setAuthorship(authorship);
                conceptualModel.setRelateModelItem(jsonObject.getString("bindOid"));
                conceptualModel.setDescription(jsonObject.getString("description"));
                conceptualModel.setContentType(jsonObject.getString("contentType"));
                conceptualModel.setCXml(jsonObject.getString("cXml"));
                conceptualModel.setSvg(jsonObject.getString("svg"));
                conceptualModel.setAuthor(uid);
//                boolean isAuthor = jsonObject.getBoolean("isAuthor");
                conceptualModel.setIsAuthor(true);
//                if (isAuthor) {
//                    conceptualModel.setRealAuthor(null);
//                } else {
//                    AuthorInfo authorInfo = new AuthorInfo();
//                    authorInfo.setName(jsonObject.getJSONObject("author").getString("name"));
//                    authorInfo.setIns(jsonObject.getJSONObject("author").getString("ins"));
//                    authorInfo.setEmail(jsonObject.getJSONObject("author").getString("email"));
//                    conceptualModel.setRealAuthor(authorInfo);
//                }


                Date now = new Date();
                conceptualModel.setCreateTime(now);
                conceptualModel.setLastModifyTime(now);
                conceptualModelDao.insert(conceptualModel);

                ModelItem modelItem = modelItemDao.findFirstByOid(conceptualModel.getRelateModelItem());
                ModelItemRelate modelItemRelate = modelItem.getRelate();
                modelItemRelate.getConceptualModels().add(conceptualModel.getOid());
                modelItem.setRelate(modelItemRelate);
                modelItemDao.save(modelItem);

                result.put("code", 1);
                result.put("id", conceptualModel.getOid());
            } catch (Exception e) {
                e.printStackTrace();
                result.put("code", -2);
            }
        }
        return result;
    }

    public JSONObject update(List<MultipartFile> files, JSONObject jsonObject, String uid) {
        ConceptualModel conceptualModel_ori = conceptualModelDao.findFirstByOid(jsonObject.getString("oid"));
        String author0 = conceptualModel_ori.getAuthor();
        ConceptualModel conceptualModel = new ConceptualModel();
        BeanUtils.copyProperties(conceptualModel_ori, conceptualModel);

        JSONObject result = new JSONObject();
        if (!conceptualModel_ori.isLock()) {

            String path = resourcePath + "/conceptualModel";
            List<String> images = new ArrayList<>();

            try {
                JSONArray resources = jsonObject.getJSONArray("resources");
                List<String> oldImages = conceptualModel.getImage();
                for (Object object : resources) {
                    JSONObject json = (JSONObject) JSONObject.toJSON(object);
                    String pa = json.getString("path");
                    for (String imagePath : oldImages) {
                        if (pa.equals(imagePath)) {
                            images.add(imagePath);
                            break;
                        }
                    }
                }
                if (files.size() > 0) {
                    saveFiles(files, path, uid, "/conceptualModel",images);
                    if (images == null) {
                        result.put("code", -1);
                    }
                }

                if(jsonObject.getString("contentType").equals("MxGraph")) {
                    String name = new Date().getTime() + "_MxGraph.png";
                    MxGraphUtils mxGraphUtils = new MxGraphUtils();
                    mxGraphUtils.exportImage(jsonObject.getInteger("w"), jsonObject.getInteger("h"), jsonObject.getString("xml"), path + "/" + uid + "/", name);
                    images=new ArrayList<>();
                    images.add("/conceptualModel" + "/" + uid + "/"+ name);
                }

                conceptualModel.setImage(images);
                conceptualModel.setName(jsonObject.getString("name"));
                conceptualModel.setDetail(jsonObject.getString("detail"));
                JSONArray jsonArray = jsonObject.getJSONArray("authorship");
                List<AuthorInfo> authorship = new ArrayList<>();
                for (int i = 0; i < jsonArray.size(); i++) {
                    JSONObject author = jsonArray.getJSONObject(i);
                    AuthorInfo authorInfo = new AuthorInfo();
                    authorInfo.setName(author.getString("name"));
                    authorInfo.setEmail(author.getString("email"));
                    authorInfo.setIns(author.getString("ins"));
                    authorInfo.setHomepage(author.getString("homepage"));
                    authorship.add(authorInfo);
                }
                conceptualModel.setAuthorship(authorship);
                conceptualModel.setRelateModelItem(jsonObject.getString("bindOid"));
                conceptualModel.setDescription(jsonObject.getString("description"));
                conceptualModel.setContentType(jsonObject.getString("contentType"));
                conceptualModel.setCXml(jsonObject.getString("cXml"));
                conceptualModel.setSvg(jsonObject.getString("svg"));
                conceptualModel.setAuthor(uid);
//                boolean isAuthor = jsonObject.getBoolean("isAuthor");
                conceptualModel.setIsAuthor(true);
//                if (isAuthor) {
//                    conceptualModel.setRealAuthor(null);
//                } else {
//                    AuthorInfo authorInfo = new AuthorInfo();
//                    authorInfo.setName(jsonObject.getJSONObject("author").getString("name"));
//                    authorInfo.setIns(jsonObject.getJSONObject("author").getString("ins"));
//                    authorInfo.setEmail(jsonObject.getJSONObject("author").getString("email"));
//                    conceptualModel.setRealAuthor(authorInfo);
//                }


                Date now = new Date();

                if (author0.equals(uid)) {
                    conceptualModel.setLastModifyTime(now);
                    conceptualModelDao.save(conceptualModel);

                    result.put("method", "update");
                    result.put("code", 1);
                    result.put("id", conceptualModel.getOid());

                } else {
                    ConceptualModelVersion conceptualModelVersion = new ConceptualModelVersion();
                    BeanUtils.copyProperties(conceptualModel, conceptualModelVersion, "id");
                    conceptualModelVersion.setOid(UUID.randomUUID().toString());
                    conceptualModelVersion.setOriginOid(conceptualModel_ori.getOid());
                    conceptualModelVersion.setModifier(uid);
                    conceptualModelVersion.setVerNumber(now.getTime());
                    conceptualModelVersion.setVerStatus(0);
                    conceptualModelVersion.setModifyTime(now);
                    conceptualModelVersion.setCreator(author0);

                    conceptualModelVersionDao.save(conceptualModelVersion);

                    conceptualModel_ori.setLock(true);
                    conceptualModelDao.save(conceptualModel_ori);

                    result.put("method", "version");
                    result.put("code", 0);
                    result.put("oid", conceptualModelVersion.getOid());


                    return result;

                }

            } catch (Exception e) {
                e.printStackTrace();
                result.put("code", -2);
            }

            return result;
        } else {
            return null;
        }
    }

    public int delete(String oid, String userName) {
        ConceptualModel conceptualModel = conceptualModelDao.findFirstByOid(oid);
        if (conceptualModel != null) {
            //图片删除
            List<String> images = conceptualModel.getImage();
            for (int i = 0; i < images.size(); i++) {
                String path = resourcePath + images.get(i);
                Utils.deleteFile(path);
            }
            //条目删除
            conceptualModelDao.delete(conceptualModel);
            userService.conceptualModelMinusMinus(userName);

            //模型条目关联删除
            String modelItemId = conceptualModel.getRelateModelItem();
            ModelItem modelItem = modelItemDao.findFirstByOid(modelItemId);
            List<String> conceptualModelIds = modelItem.getRelate().getConceptualModels();
            for (String id : conceptualModelIds
                    ) {
                if (id.equals(conceptualModel.getOid())) {
                    conceptualModelIds.remove(id);
                    break;
                }
            }
            modelItem.getRelate().setConceptualModels(conceptualModelIds);
            modelItemDao.save(modelItem);

            return 1;
        } else {
            return -1;
        }
    }

    public JSONObject listByUserOid(ModelItemFindDTO modelItemFindDTO, String oid) {

        int page = modelItemFindDTO.getPage();
        int pageSize = modelItemFindDTO.getPageSize();
        Sort sort = new Sort(modelItemFindDTO.getAsc() ? Sort.Direction.ASC : Sort.Direction.DESC, "viewCount");
        Pageable pageable = PageRequest.of(page, pageSize, sort);
        User user = userDao.findFirstByOid(oid);
        Page<ConceptualModel> modelItemPage = conceptualModelDao.findByAuthor(user.getUserName(), pageable);

        JSONObject result = new JSONObject();

        result.put("list", modelItemPage.getContent());
        result.put("total", modelItemPage.getTotalElements());

        return result;
    }

    public JSONObject list(ModelItemFindDTO modelItemFindDTO, List<String> classes) {

        JSONObject obj = new JSONObject();
        //TODO Sort是可以设置排序字段的
        int page = modelItemFindDTO.getPage();
        int pageSize = modelItemFindDTO.getPageSize();
        String searchText = modelItemFindDTO.getSearchText();
        //List<String> classifications=modelItemFindDTO.getClassifications();
        //默认以viewCount排序
        Sort sort = new Sort(modelItemFindDTO.getAsc() ? Sort.Direction.ASC : Sort.Direction.DESC, "viewCount");
        Pageable pageable = PageRequest.of(page, pageSize, sort);

        Page<ConceptualModel> conceptualPage = null;

        if (searchText.equals("") && classes.get(0).equals("all")) {
            conceptualPage = conceptualModelDao.findAll(pageable);
        } else if (!searchText.equals("") && classes.get(0).equals("all")) {
            conceptualPage = conceptualModelDao.findByNameContainsIgnoreCase(searchText, pageable);
        } else if (searchText.equals("") && !classes.get(0).equals("all")) {
            conceptualPage = conceptualModelDao.findByClassificationsIn(classes, pageable);
        } else {
            conceptualPage = conceptualModelDao.findByNameContainsIgnoreCaseAndClassificationsIn(searchText, classes, pageable);
        }


        obj.put("list", conceptualPage.getContent());
        obj.put("total", conceptualPage.getTotalElements());
        obj.put("pages", conceptualPage.getTotalPages());

        return obj;
    }

    public JSONObject listByAuthor(ModelItemFindDTO modelItemFindDTO, String userName, List<String> classes) {

        JSONObject obj = new JSONObject();
        //TODO Sort是可以设置排序字段的
        int page = modelItemFindDTO.getPage();
        int pageSize = modelItemFindDTO.getPageSize();
        String searchText = modelItemFindDTO.getSearchText();
        //List<String> classifications=modelItemFindDTO.getClassifications();
        //默认以viewCount排序
        Sort sort = new Sort(modelItemFindDTO.getAsc() ? Sort.Direction.ASC : Sort.Direction.DESC, "viewCount");
        Pageable pageable = PageRequest.of(page, pageSize, sort);

        Page<ConceptualModel> conceptualPage = null;

        if (searchText.equals("") && classes.get(0).equals("all")) {
            conceptualPage = conceptualModelDao.findByAuthor(userName, pageable);
        } else if (!searchText.equals("") && classes.get(0).equals("all")) {
            conceptualPage = conceptualModelDao.findByNameContainsIgnoreCaseAndAuthor(searchText, userName, pageable);
        } else if (searchText.equals("") && !classes.get(0).equals("all")) {
            conceptualPage = conceptualModelDao.findByClassificationsInAndAuthor(classes, userName, pageable);
        } else {
            conceptualPage = conceptualModelDao.findByNameContainsIgnoreCaseAndClassificationsInAndAuthor(searchText, classes, userName, pageable);
        }


        obj.put("list", conceptualPage.getContent());
        obj.put("total", conceptualPage.getTotalElements());
        obj.put("pages", conceptualPage.getTotalPages());

        return obj;
    }

    public String query(ModelItemFindDTO modelItemFindDTO, List<String> connects, List<String> props, List<String> values, List<String> nodeID) throws ParseException {

        ModelDao modelDao = new ModelDao();

        BasicDBObject query = new BasicDBObject();

        //prop
        for (int i = 0; i < values.size(); i += 2) {
            if (values.get(i).trim().equals("") && values.get(i + 1).trim().equals("")) {

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
                    if (i != 0 && connects.get(i - 1).equals("NOT")) {
                        obj1 = new BasicDBObject("$not", obj1);
                        obj2 = new BasicDBObject("$not", obj2);
                        condition = new BasicDBObject("$or", Arrays.asList(obj1, obj2));
                    }


                    break;
                case "OR":
                    pattern = Pattern.compile("^.*(" + values.get(i).trim() + "|" + values.get(i + 1).trim() + ").*$", Pattern.CASE_INSENSITIVE);
                    condition = new BasicDBObject(field, pattern);


                    if (i != 0 && connects.get(i - 1).equals("NOT")) {
                        pattern = Pattern.compile("^.*" + values.get(i).trim() + ".*$", Pattern.CASE_INSENSITIVE);
                        BasicDBObject condition1 = new BasicDBObject("$not", pattern);
                        obj1 = new BasicDBObject(field, pattern);
                        pattern1 = Pattern.compile("^.*" + values.get(i + 1).trim() + ".*$", Pattern.CASE_INSENSITIVE);
                        BasicDBObject condition2 = new BasicDBObject("$not", pattern1);
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
                    BasicDBObject condition2 = new BasicDBObject("$not", pattern1);
                    obj2 = new BasicDBObject(field, condition2);
                    //obj2=new BasicDBObject("$not",obj2);

                    if (i != 0 && connects.get(i - 1).equals("NOT")) {
                        pattern = Pattern.compile("^.*" + values.get(i + 1).trim() + ".*$", Pattern.CASE_INSENSITIVE);
                        //BasicDBObject condition1=new BasicDBObject("$regex",values.get(i));
                        obj1 = new BasicDBObject(field, pattern);
                        pattern1 = Pattern.compile("^.*" + values.get(i).trim() + ".*$", Pattern.CASE_INSENSITIVE);
                        condition2 = new BasicDBObject("$not", pattern1);
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
        BasicDBObject query_parents = new BasicDBObject();
        if (!nodeID.get(0).equals("all")) {
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

        MongoCollection<Document> Col = modelDao.GetCollection("Portal", "conceptualModel");
        MongoCursor<Document> cursor = modelDao.RetrieveDocsLimit(Col, query, modelDao.getSort("count", modelItemFindDTO.getAsc()), modelItemFindDTO.getPage());

        JSONObject output = new JSONObject();

        JSONArray list = new JSONArray();
        int total = 0;
        while (cursor.hasNext()) {

            JSONObject jsonObj = new JSONObject();
            Document doc = cursor.next();
            Date CreateTime = doc.getDate("createTime");
            String sDate = (new SimpleDateFormat("yyyy-MM-dd HH:mm:ss")).format(CreateTime);
            doc.put("createTime", sDate);

            list.add(JSONObject.parse(doc.toJson()));
            total++;
        }
        output.put("total", total);
        output.put("pages", Math.ceil(total));
        output.put("list", list);

        return output.toString();
    }

    public JSONObject getConceptualModelsByUserId(String userId, int page, String sortType, int asc) {

        Sort sort = new Sort(asc == 1 ? Sort.Direction.ASC : Sort.Direction.DESC, "createTime");

        Pageable pageable = PageRequest.of(page, 10, sort);

        Page<ConceptualModel> conceptualModels = conceptualModelDao.findByAuthor(userId, pageable);

        JSONObject conceptualModelObject = new JSONObject();
        conceptualModelObject.put("count", conceptualModels.getTotalElements());
        conceptualModelObject.put("conceptualModels", conceptualModels.getContent());

        return conceptualModelObject;

    }

    public JSONObject searchConceptualModelsByUserId(String searchText, String userId, int page, String sortType, int asc) {

        Sort sort = new Sort(asc == 1 ? Sort.Direction.ASC : Sort.Direction.DESC, "createTime");

        Pageable pageable = PageRequest.of(page, 10, sort);

        Page<ConceptualModel> modelItems = conceptualModelDao.findByNameContainsIgnoreCaseAndAuthor(searchText, userId, pageable);

        JSONObject modelItemObject = new JSONObject();
        modelItemObject.put("count", modelItems.getTotalElements());
        modelItemObject.put("conceptualModels", modelItems.getContent());

        return modelItemObject;

    }

    public JSONObject searchByTitleByOid(ConceptualModelFindDTO conceptualModelFindDTO, String oid){
        String userName=userDao.findFirstByOid(oid).getUserName();
        int page=conceptualModelFindDTO.getPage();
        int pageSize = conceptualModelFindDTO.getPageSize();
        String sortElement=conceptualModelFindDTO.getSortElement();
        Boolean asc = conceptualModelFindDTO.getAsc();
        String title= conceptualModelFindDTO.getSearchText();

        Sort sort=new Sort(asc?Sort.Direction.ASC:Sort.Direction.DESC,sortElement);
        Pageable pageable=PageRequest.of(page,pageSize,sort);
        Page<ConceptualModelResultDTO> articleResultDTOPage=conceptualModelDao.findConModelByNameContainsIgnoreCaseAndAuthor(title,userName,pageable);

        JSONObject result=new JSONObject();
        result.put("list",articleResultDTOPage.getContent());
        result.put("total",articleResultDTOPage.getTotalElements());
        System.out.println(result);
        return result;

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

            case "Provider":
                name = "author";
                break;

        }
        return name;
    }
}
