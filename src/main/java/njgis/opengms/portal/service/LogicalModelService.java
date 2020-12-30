package njgis.opengms.portal.service;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.mongodb.BasicDBObject;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoCursor;
import njgis.opengms.portal.dao.*;
import njgis.opengms.portal.dto.LogicalModel.LogicalModelFindDTO;
import njgis.opengms.portal.dto.LogicalModel.LogicalModelResultDTO;
import njgis.opengms.portal.dto.modelItem.ModelItemFindDTO;
import njgis.opengms.portal.entity.*;
import njgis.opengms.portal.entity.support.AuthorInfo;
import njgis.opengms.portal.entity.support.ModelItemRelate;
import njgis.opengms.portal.enums.ResultEnum;
import njgis.opengms.portal.exception.MyException;
import njgis.opengms.portal.utils.MxGraphUtils;
import njgis.opengms.portal.utils.Utils;
import njgis.opengms.portal.utils.deCode;
import org.bson.Document;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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

public class LogicalModelService {
    @Autowired
    ItemService itemService;

    @Autowired
    LogicalModelDao logicalModelDao;

    @Autowired
    LogicalModelVersionDao logicalModelVersionDao;

    @Autowired
    ModelItemDao modelItemDao;

    @Autowired
    UserDao userDao;

    @Autowired
    ClassificationService classificationService;

    @Autowired
    UserService userService;

    @Value(value = "Public,Discoverable")
    private List<String> itemStatusVisible;

    private final Logger logger = LoggerFactory.getLogger(this.getClass());


    @Value("${resourcePath}")
    private String resourcePath;

    @Value("${htmlLoadPath}")
    private String htmlLoadPath;


    public ModelAndView getPage(String id, HttpServletRequest request) {
        //条目信息
        LogicalModel modelInfo = getByOid(id);
        modelInfo=(LogicalModel)itemService.recordViewCount(modelInfo);
        logicalModelDao.save(modelInfo);
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

        //modelItem
        ModelItem modelItem = modelItemDao.findFirstByOid(modelInfo.getRelateModelItem());
        JSONObject modelItemInfo = new JSONObject();
        modelItemInfo.put("oid",modelItem.getOid());
        modelItemInfo.put("name",modelItem.getName());
        modelItemInfo.put("description", modelItem.getDescription());
        modelItemInfo.put("img",modelItem.getImage().equals("") ? null : htmlLoadPath + modelItem.getImage());


        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("logical_model");
        modelAndView.addObject("modelInfo", modelInfo);
        String computableModelId = modelInfo.getComputableModelId();
        modelAndView.addObject("uid", deCode.encode((modelInfo.getOid() + "-" + computableModelId).getBytes()));
        modelAndView.addObject("classifications", classResult);
        modelAndView.addObject("date", dateResult);
        modelAndView.addObject("year", calendar.get(Calendar.YEAR));
        modelAndView.addObject("user", userJson);
        modelAndView.addObject("authorship", authorshipString);
        modelAndView.addObject("loadPath", htmlLoadPath);
        modelAndView.addObject("lastModifier", modifierJson);
        modelAndView.addObject("lastModifyTime", lastModifyTime);
        modelAndView.addObject("relateModelItem", modelItemInfo);

        return modelAndView;
    }

    public LogicalModel getByOid(String id) {
        try {
            return logicalModelDao.findFirstByOid(id);
        } catch (Exception e) {
            System.out.println("有人乱查数据库！！该ID不存在Logical Model对象");
            throw new MyException(ResultEnum.NO_OBJECT);
        }
    }

    public JSONObject insert(List<MultipartFile> files, JSONObject jsonObject, String uid) {
        JSONObject result = new JSONObject();
        LogicalModel logicalModel = new LogicalModel();


        String path = resourcePath + "/logicalModel";
        List<String> images =new ArrayList<>();
        saveFiles(files, path, uid, "/logicalModel",images);
        logger.info("savefiles");
        if (images == null) {
            result.put("code", -1);
        } else {
            try {
                logger.info(jsonObject.getString("contentType"));
                if(jsonObject.getString("contentType").equals("MxGraph")) {
                    String name = new Date().getTime() + "_MxGraph.png";
                    MxGraphUtils mxGraphUtils = new MxGraphUtils();
                    logger.info("before export");
                    mxGraphUtils.exportImage(jsonObject.getInteger("w"), jsonObject.getInteger("h"), jsonObject.getString("xml"), path + "/" + uid + "/", name);
//                    SvgUtils.convertSvg2Png(jsonObject.getString("svg"),path+ "/" + uid + "/" ,name);
//                    //TODO update时删除所有图片，version时不删除，accept之后再删除
                    images=new ArrayList<>();
                    images.add("/logicalModel" + "/" + uid + "/"+ name);
                }
                logger.info("exportImage");

                logicalModel.setImage(images);
                logicalModel.setOid(UUID.randomUUID().toString());
                logicalModel.setStatus(jsonObject.getString("status"));
                logicalModel.setName(jsonObject.getString("name"));
                logicalModel.setRelateModelItem(jsonObject.getString("relatedModelItem"));
                logicalModel.setDescription(jsonObject.getString("description"));
                logicalModel.setContentType(jsonObject.getString("contentType"));
                logicalModel.setDetail(jsonObject.getString("detail"));
                logicalModel.setCXml(jsonObject.getString("cXml"));
                logicalModel.setSvg(jsonObject.getString("svg"));
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
                logicalModel.setAuthorship(authorship);
                logicalModel.setAuthor(uid);
//                boolean isAuthor = jsonObject.getBoolean("isAuthor");
                logicalModel.setIsAuthor(true);
//                if (isAuthor) {
//                    logicalModel.setRealAuthor(null);
//                } else {
//                    AuthorInfo authorInfo = new AuthorInfo();
//                    authorInfo.setName(jsonObject.getJSONObject("author").getString("name"));
//                    authorInfo.setIns(jsonObject.getJSONObject("author").getString("ins"));
//                    authorInfo.setEmail(jsonObject.getJSONObject("author").getString("email"));
//                    logicalModel.setRealAuthor(authorInfo);
//                }


                Date now = new Date();
                logicalModel.setCreateTime(now);
                logicalModel.setLastModifyTime(now);

                logicalModelDao.insert(logicalModel);

                ModelItem modelItem = modelItemDao.findFirstByOid(logicalModel.getRelateModelItem());
                ModelItemRelate modelItemRelate = modelItem.getRelate();
                modelItemRelate.getLogicalModels().add(logicalModel.getOid());
                modelItem.setRelate(modelItemRelate);
                modelItemDao.save(modelItem);


                result.put("code", 1);
                result.put("id", logicalModel.getOid());
            } catch (Exception e) {
                logger.info(e.getMessage());
                logger.info(e.toString());
                e.printStackTrace();
                result.put("code", -2);
            }
        }
        return result;
    }

    public JSONObject update(List<MultipartFile> files, JSONObject jsonObject, String uid) {
        JSONObject result = new JSONObject();

        LogicalModel logicalModel_ori = logicalModelDao.findFirstByOid(jsonObject.getString("oid"));
        String author0 = logicalModel_ori.getAuthor();
        LogicalModel logicalModel = new LogicalModel();
        BeanUtils.copyProperties(logicalModel_ori, logicalModel);

        if (!logicalModel_ori.isLock()) {
            String path = resourcePath + "/logicalModel";
            List<String> images = new ArrayList<>();


            try {
                JSONArray resources = jsonObject.getJSONArray("resources");
                List<String> oldImages = logicalModel.getImage();
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
                    saveFiles(files, path, uid, "/logicalModel",images);
                    if (images == null) {
                        result.put("code", -1);
                        return result;
                    }
                }


                if(jsonObject.getString("contentType").equals("MxGraph")) {

                    String name = new Date().getTime() + "_MxGraph.png";
                    MxGraphUtils mxGraphUtils = new MxGraphUtils();
                    int w=jsonObject.getInteger("w");
                    int h=jsonObject.getInteger("h");
                    String xml=jsonObject.getString("xml");
                    mxGraphUtils.exportImage(w, h, xml, path + "/" + uid + "/",name);
                    images=new ArrayList<>();
                    images.add("/logicalModel"+ "/" + uid + "/" + name);
                }

                logicalModel.setImage(images);
                logicalModel.setStatus(jsonObject.getString("status"));
                logicalModel.setName(jsonObject.getString("name"));
                logicalModel.setRelateModelItem(jsonObject.getString("bindOid"));
                logicalModel.setDescription(jsonObject.getString("description"));
                logicalModel.setContentType(jsonObject.getString("contentType"));
                logicalModel.setDetail(jsonObject.getString("detail"));
                logicalModel.setCXml(jsonObject.getString("cXml"));
                logicalModel.setSvg(jsonObject.getString("svg"));
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
                logicalModel.setAuthorship(authorship);
                logicalModel.setAuthor(uid);
//                boolean isAuthor = jsonObject.getBoolean("isAuthor");
                logicalModel.setIsAuthor(true);
//                if (isAuthor) {
//                    logicalModel.setRealAuthor(null);
//                } else {
//                    AuthorInfo authorInfo = new AuthorInfo();
//                    authorInfo.setName(jsonObject.getJSONObject("author").getString("name"));
//                    authorInfo.setIns(jsonObject.getJSONObject("author").getString("ins"));
//                    authorInfo.setEmail(jsonObject.getJSONObject("author").getString("email"));
//                    logicalModel.setRealAuthor(authorInfo);
//                }


                Date now = new Date();
                String authorUserName = logicalModel_ori.getAuthor();
                if (logicalModel_ori.getAuthor().equals(uid)) {
                    logicalModel.setLastModifyTime(now);
                    logicalModelDao.save(logicalModel);

                    result.put("methord", "update");
                    result.put("code", 1);
                    result.put("id", logicalModel.getOid());
                } else {
                    LogicalModelVersion logicalModelVersion = new LogicalModelVersion();
                    BeanUtils.copyProperties(logicalModel, logicalModelVersion, "id");
                    logicalModelVersion.setOid(UUID.randomUUID().toString());
                    logicalModelVersion.setOriginOid(logicalModel_ori.getOid());
                    logicalModelVersion.setModifier(uid);
                    logicalModelVersion.setVerNumber(now.getTime());
                    logicalModelVersion.setVerStatus(0);
                    userService.messageNumPlusPlus(authorUserName);
                    logicalModelVersion.setModifyTime(now);
                    logicalModelVersion.setCreator(author0);

                    logicalModelVersionDao.save(logicalModelVersion);

                    logicalModel_ori.setLock(true);
                    logicalModelDao.save(logicalModel_ori);

                    result.put("method", "version");
                    result.put("code", 0);
                    result.put("oid", logicalModelVersion.getOid());
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
        LogicalModel logicalModel = logicalModelDao.findFirstByOid(oid);
        if(!logicalModel.getAuthor().equals(userName))
            return 2;
        if (logicalModel != null) {
            //图片删除
            List<String> images = logicalModel.getImage();
            for (int i = 0; i < images.size(); i++) {
                String path = resourcePath + images.get(i);
                Utils.deleteFile(path);
            }
            //条目删除
            logicalModelDao.delete(logicalModel);
            userService.logicalModelMinusMinus(userName);

            //模型条目关联删除
            String modelItemId = logicalModel.getRelateModelItem();
            ModelItem modelItem = modelItemDao.findFirstByOid(modelItemId);
            List<String> logicalModelIds = modelItem.getRelate().getLogicalModels();
            for (String id : logicalModelIds
                    ) {
                if (id.equals(logicalModel.getOid())) {
                    logicalModelIds.remove(id);
                    break;
                }
            }
            modelItem.getRelate().setLogicalModels(logicalModelIds);
            modelItemDao.save(modelItem);

            return 1;
        } else {
            return -1;
        }
    }

    public JSONObject listByUserOid(ModelItemFindDTO modelItemFindDTO, String userId,String loadUser) {

        int page = modelItemFindDTO.getPage();
        int pageSize = modelItemFindDTO.getPageSize();
        Sort sort = new Sort(modelItemFindDTO.getAsc() ? Sort.Direction.ASC : Sort.Direction.DESC, modelItemFindDTO.getSortField());
        Pageable pageable = PageRequest.of(page, pageSize, sort);
        User user = userDao.findFirstByUserId(userId);

        Page<LogicalModel> modelItemPage =Page.empty();
//        if(loadUser == null||!loadUser.equals(oid)) {
            modelItemPage = logicalModelDao.findByAuthorAndStatusIn(user.getUserName(),itemStatusVisible, pageable);
//        }else{
//            modelItemPage = logicalModelDao.findByAuthor(user.getUserName(), pageable);
//        }
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
        Sort sort = new Sort(modelItemFindDTO.getAsc() ? Sort.Direction.ASC : Sort.Direction.DESC, modelItemFindDTO.getSortField());
        Pageable pageable = PageRequest.of(page, pageSize, sort);

        Page<LogicalModel> logicalModelPage = null;

        String statusNotLike = "Private";
        if (searchText.equals("") && classes.get(0).equals("all")) {
            logicalModelPage = logicalModelDao.findByStatusNotLike(statusNotLike, pageable);
        } else if (!searchText.equals("") && classes.get(0).equals("all")) {
            logicalModelPage = logicalModelDao.findByNameContainsIgnoreCaseAndStatusNotLike(searchText,statusNotLike, pageable);
        } else if (searchText.equals("") && !classes.get(0).equals("all")) {
            logicalModelPage = logicalModelDao.findByClassificationsInAndStatusNotLike(classes,statusNotLike, pageable);
        } else {
            logicalModelPage = logicalModelDao.findByNameContainsIgnoreCaseAndClassificationsInAndStatusNotLike(searchText, classes,statusNotLike, pageable);
        }


        obj.put("list", logicalModelPage.getContent());
        obj.put("total", logicalModelPage.getTotalElements());
        obj.put("pages", logicalModelPage.getTotalPages());

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
        Sort sort = new Sort(modelItemFindDTO.getAsc() ? Sort.Direction.ASC : Sort.Direction.DESC, modelItemFindDTO.getSortField());
        Pageable pageable = PageRequest.of(page, pageSize, sort);

        Page<LogicalModel> logicalModelPage = null;

        String statusNotLike = "Private";
        if (searchText.equals("") && classes.get(0).equals("all")) {
            logicalModelPage = logicalModelDao.findByAuthorAndStatusNotLike(userName, statusNotLike, pageable);
        } else if (!searchText.equals("") && classes.get(0).equals("all")) {
            logicalModelPage = logicalModelDao.findByNameContainsIgnoreCaseAndAuthorAndStatusNotLike(searchText, userName,statusNotLike, pageable);
        } else if (searchText.equals("") && !classes.get(0).equals("all")) {
            logicalModelPage = logicalModelDao.findByClassificationsInAndAuthorAndStatusNotLike(classes, userName,statusNotLike, pageable);
        } else {
            logicalModelPage = logicalModelDao.findByNameContainsIgnoreCaseAndClassificationsInAndAuthorAndStatusNotLike(searchText, classes, userName,statusNotLike, pageable);        }


        obj.put("list", logicalModelPage.getContent());
        obj.put("total", logicalModelPage.getTotalElements());
        obj.put("pages", logicalModelPage.getTotalPages());

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

        MongoCollection<Document> Col = modelDao.GetCollection("Portal", "logicalModel");
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

    public JSONObject getLogicalModelsByUserId(String userId, int page, String sortType, int asc) {

        Sort sort = new Sort(asc == 1 ? Sort.Direction.ASC : Sort.Direction.DESC, "createTime");

        Pageable pageable = PageRequest.of(page, 10, sort);

        Page<LogicalModel> logicalModels = logicalModelDao.findByAuthorAndStatusNotLike(userId,"Private", pageable);

        JSONObject logicalModelObject = new JSONObject();
        logicalModelObject.put("count", logicalModels.getTotalElements());
        logicalModelObject.put("logicalModels", logicalModels.getContent());

        return logicalModelObject;

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

    public JSONObject searchLogicalModelsByUserId(String searchText, String userId, int page, String sortType, int asc) {

        Sort sort = new Sort(asc == 1 ? Sort.Direction.ASC : Sort.Direction.DESC, "createTime");

        Pageable pageable = PageRequest.of(page, 10, sort);

        Page<LogicalModel> modelItems = logicalModelDao.findByNameContainsIgnoreCaseAndAuthorAndStatusNotLike(searchText, userId, "all", pageable);

        JSONObject modelItemObject = new JSONObject();
        modelItemObject.put("count", modelItems.getTotalElements());
        modelItemObject.put("logicalModels", modelItems.getContent());

        return modelItemObject;

    }

    public JSONObject searchByTitleByOid(LogicalModelFindDTO logicalModelFindDTO, String oid,String loadUser){
        String userName=userDao.findFirstByOid(oid).getUserName();
        int page=logicalModelFindDTO.getPage();
        int pageSize = logicalModelFindDTO.getPageSize();
        String sortElement=logicalModelFindDTO.getSortElement();
        Boolean asc = logicalModelFindDTO.getAsc();
        String name= logicalModelFindDTO.getSearchText();

        Sort sort=new Sort(asc?Sort.Direction.ASC:Sort.Direction.DESC,sortElement);
        Pageable pageable=PageRequest.of(page,pageSize,sort);
        Page<LogicalModelResultDTO> logicalModelResultDTOPage =Page.empty();
//        if(loadUser == null||!loadUser.equals(oid)) {
            logicalModelResultDTOPage = logicalModelDao.findLoModelByNameContainsIgnoreCaseAndAuthorAndStatusIn(name, userName,itemStatusVisible, pageable);
//        }else {
//            logicalModelResultDTOPage = logicalModelDao.findLoModelByNameContainsIgnoreCaseAndAuthor(name, userName, pageable);
//        }
        JSONObject result=new JSONObject();
        result.put("list",logicalModelResultDTOPage.getContent());
        result.put("total",logicalModelResultDTOPage.getTotalElements());
        return result;

    }
}
