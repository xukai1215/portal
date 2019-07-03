package njgis.opengms.portal.service;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.mongodb.BasicDBObject;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoCursor;
import njgis.opengms.portal.dao.*;
import njgis.opengms.portal.dto.modelItem.ModelItemAddDTO;
import njgis.opengms.portal.dto.modelItem.ModelItemFindDTO;
import njgis.opengms.portal.dto.modelItem.ModelItemResultDTO;
import njgis.opengms.portal.dto.modelItem.ModelItemUpdateDTO;
import njgis.opengms.portal.entity.*;
import njgis.opengms.portal.entity.support.ModelItemRelate;
import njgis.opengms.portal.enums.ResultEnum;
import njgis.opengms.portal.exception.MyException;
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
import org.springframework.web.servlet.ModelAndView;

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
    ClassificationService classificationService;

    @Autowired
    UserDao userDao;

    @Autowired
    UserService userService;

    @Autowired
    ModelItemDao modelItemDao;

    @Autowired
    ConceptualModelDao conceptualModelDao;

    @Autowired
    LogicalModelDao logicalModelDao;

    @Autowired
    ComputableModelDao computableModelDao;

    @Value("${resourcePath}")
    private String resourcePath;

    @Value("${htmlLoadPath}")
    private String htmlLoadPath;

    public ModelAndView getPage(String id){
        //条目信息
        ModelItem modelInfo=getByOid(id);
        modelInfo.setViewCount(modelInfo.getViewCount()+1);
        modelItemDao.save(modelInfo);
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
        System.out.println(classResult);

        //详情页面
        String detailResult;
        String model_detailDesc=modelInfo.getDetail();
        int num=model_detailDesc.indexOf("upload/document/");
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

        //时间
        Date date=modelInfo.getCreateTime();
        Calendar calendar=Calendar.getInstance();
        calendar.setTime(date);
        SimpleDateFormat simpleDateFormat=new SimpleDateFormat("yyyy-MM-dd");
        String dateResult=simpleDateFormat.format(date);

        //relate
        ModelItemRelate modelItemRelate=modelInfo.getRelate();
        List<String> conceptual=modelItemRelate.getConceptualModels();
        List<String> computable=modelItemRelate.getComputableModels();
        List<String> logical=modelItemRelate.getLogicalModels();

        JSONArray conceptualArray=new JSONArray();
        for(int i=0;i<conceptual.size();i++){
            String oid=conceptual.get(i);
            ConceptualModel conceptualModel=conceptualModelDao.findFirstByOid(oid);
            JSONObject conceptualJson = new JSONObject();
            conceptualJson.put("name",conceptualModel.getName());
            conceptualJson.put("oid",conceptualModel.getOid());
            conceptualJson.put("description",conceptualModel.getDescription());
            conceptualJson.put("image",conceptualModel.getImage().size()==0?null:conceptualModel.getImage().get(0));
            conceptualArray.add(conceptualJson);
        }

        JSONArray logicalArray=new JSONArray();
        for(int i=0;i<logical.size();i++){
            String oid=logical.get(i);
            LogicalModel logicalModel=logicalModelDao.findFirstByOid(oid);
            JSONObject logicalJson = new JSONObject();
            logicalJson.put("name",logicalModel.getName());
            logicalJson.put("oid",logicalModel.getOid());
            logicalJson.put("description",logicalModel.getDescription());
            logicalJson.put("image",logicalModel.getImage().size()==0?null:logicalModel.getImage().get(0));
            logicalArray.add(logicalJson);
        }

        JSONArray computableArray=new JSONArray();
        for(int i=0;i<computable.size();i++){
            String oid=computable.get(i);
            ComputableModel computableModel=computableModelDao.findFirstByOid(oid);
            JSONObject computableJson = new JSONObject();
            computableJson.put("name",computableModel.getName());
            computableJson.put("oid",computableModel.getOid());
            computableJson.put("description",computableModel.getDescription());
            computableArray.add(computableJson);
        }

        //用户信息
        JSONObject userJson = userService.getItemUserInfo(modelInfo.getAuthor());


        //图片路径
        String image=modelInfo.getImage();
        if(!image.equals("")){
            modelInfo.setImage(htmlLoadPath+image);
        }

        ModelAndView modelAndView=new ModelAndView();
        modelAndView.setViewName("model_item_info");
        modelAndView.addObject("modelInfo",modelInfo);
        modelAndView.addObject("classifications",classResult);
        modelAndView.addObject("detail",detailResult);
        modelAndView.addObject("date",dateResult);
        modelAndView.addObject("year",calendar.get(Calendar.YEAR));
        modelAndView.addObject("conceptualModels",conceptualArray);
        modelAndView.addObject("logicalModels",logicalArray);
        modelAndView.addObject("computableModels",computableArray);
        modelAndView.addObject("user", userJson);
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
        modelItem.setStatus("public");
        modelItem.setAuthor(author);
        modelItem.setOid(UUID.randomUUID().toString());

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
        if(modelItem!=null){
            //删除图片
            String image=modelItem.getImage();
            if(image.contains("/modelItem/")) {
                //删除旧图片
                File file=new File(resourcePath+modelItem.getImage());
                if(file.exists()&&file.isFile())
                    file.delete();
            }

            modelItemDao.delete(modelItem);
            userService.modelItemMinusMinus(userName);
            return 1;
        }
        else{
            return -1;
        }
    }

    public String update(ModelItemUpdateDTO modelItemUpdateDTO){
        ModelItem modelItem=modelItemDao.findFirstByOid(modelItemUpdateDTO.getOid());
        BeanUtils.copyProperties(modelItemUpdateDTO,modelItem);
        //判断是否为新图片
        String uploadImage=modelItemUpdateDTO.getUploadImage();
        if(!uploadImage.contains("/modelItem/")&&uploadImage!="") {
            //删除旧图片
            File file=new File(resourcePath+modelItem.getImage());
            if(file.exists()&&file.isFile())
                file.delete();
            //添加新图片
            String path = "/modelItem/" + UUID.randomUUID().toString() + ".jpg";
            String imgStr = uploadImage.split(",")[1];
            Utils.base64StrToImage(imgStr, resourcePath + path);
            modelItem.setImage(path);
        }
        modelItem.setLastModifyTime(new Date());
        modelItemDao.save(modelItem);

        return modelItem.getOid();
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

    public JSONObject listByUserOid(ModelItemFindDTO modelItemFindDTO,String oid){

        int page = modelItemFindDTO.getPage();
        int pageSize = modelItemFindDTO.getPageSize();
        Sort sort = new Sort(modelItemFindDTO.getAsc() ? Sort.Direction.ASC : Sort.Direction.DESC, "viewCount");
        Pageable pageable = PageRequest.of(page, pageSize, sort);
        User user=userDao.findFirstByOid(oid);
        Page<ModelItemResultDTO> modelItemPage=modelItemDao.findByAuthor(user.getUserName(),pageable);

        JSONObject result=new JSONObject();

        result.put("list",modelItemPage.getContent());
        result.put("total", modelItemPage.getTotalElements());

        return result;
    }

    public JSONObject list(ModelItemFindDTO modelItemFindDTO,List<String> classes) {

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
                }
            }
        }

        Page<ModelItemResultDTO> modelItemPage = null;

        if (searchText.equals("")&&classes.get(0).equals("all")) {
            modelItemPage = modelItemDao.findAllByNameContains("",pageable);
        } else if(!searchText.equals("")&&classes.get(0).equals("all")) {
            modelItemPage = modelItemDao.findByNameContainsIgnoreCase(searchText, pageable);
        } else if(searchText.equals("")&&!classes.get(0).equals("all")){
            modelItemPage = modelItemDao.findByClassificationsIn(classes, pageable);
        }else{
            modelItemPage = modelItemDao.findByNameContainsIgnoreCaseAndClassificationsIn(searchText,classes, pageable);
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

        MongoCollection<Document> Col = modelDao.GetCollection("Portal", "modelItem");
        FindIterable<Document> findIterable = modelDao.RetrieveDocs(Col, query, modelDao.getSort("viewCount", modelItemFindDTO.getAsc()));
        int total=0;
        MongoCursor<Document> findCursor=findIterable.iterator();
        while(findCursor.hasNext()){
            Document document=findCursor.next();
            total++;
        }

        MongoCursor<Document> cursor=findIterable.limit(10).skip((modelItemFindDTO.getPage())*10).iterator();
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
