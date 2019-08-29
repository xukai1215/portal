package njgis.opengms.portal.service;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import njgis.opengms.portal.dao.*;
import njgis.opengms.portal.entity.*;
import njgis.opengms.portal.exception.MyException;
import njgis.opengms.portal.utils.deCode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.ModelAndView;

import java.io.*;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

@Service

public class VersionService {

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
    ConceptualModelVersionDao conceptualModelVersionDao;

    @Autowired
    LogicalModelDao logicalModelDao;

    @Autowired
    LogicalModelVersionDao logicalModelVersionDao;

    @Autowired
    ComputableModelDao computableModelDao;

    @Autowired
    ComputableModelVersionDao computableModelVersionDao;

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
            if(modelItemVersionList.get(i).getStatus()==0){
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

            classResult1.add(array1);

        }


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

        String detailResult1;
        String model_detailDesc1=modelItemVersion.getDetail();
        int num1=model_detailDesc1.indexOf("upload/document/");
        if(num1==-1||num1>20){
            detailResult1=model_detailDesc1;
        }
        else {
            if(model_detailDesc1.indexOf("/")==0){
                model_detailDesc1.substring(1);
            }
            //model_detailDesc1 = model_detailDesc1.length() > 0 ? model_detailDesc1.substring(1) : model_detailDesc1;
            String filePath = resourcePath.substring(0,resourcePath.length()-7) +"/" + model_detailDesc1;
            try {
                filePath = java.net.URLDecoder.decode(filePath, "utf-8");
            } catch (UnsupportedEncodingException e) {
                e.printStackTrace();
            }
            if (model_detailDesc1.length() > 0) {
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
                    detailResult1 = detail.toString();
                } else {
                    detailResult1 = model_detailDesc1;
                }
            } else {
                detailResult1 = model_detailDesc1;
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
        modelAndView.addObject("detail2",detailResult1);
//        modelAndView.addObject("conceptualModels2",conceptualArray1);
//        modelAndView.addObject("logicalModels2",logicalArray1);
//        modelAndView.addObject("computableModels2",computableArray1);
        modelAndView.addObject("references2", JSONArray.parseArray(JSON.toJSONString(modelItemVersion.getReferences())));

        return modelAndView;
    }

    public ModelAndView getModelItemHistoryPage(String id){
        //条目信息
        ModelItemVersion modelItemVersion=modelItemVersionDao.findFirstByOid(id);
        //类
        JSONArray classResult=new JSONArray();

        List<String> classifications = modelItemVersion.getClassifications();
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
        String model_detailDesc=modelItemVersion.getDetail();
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
        modelAndView.setViewName("history/modelItemHistory");
        modelAndView.addObject("modelInfo",modelItemVersion);
        modelAndView.addObject("metaKeywords",meta_keywords);
        modelAndView.addObject("classifications",classResult);
        modelAndView.addObject("detail",detailResult);
        modelAndView.addObject("date",dateResult);
        modelAndView.addObject("year",calendar.get(Calendar.YEAR));
        modelAndView.addObject("user", userJson);
        modelAndView.addObject("references", JSONArray.parseArray(JSON.toJSONString(modelItemVersion.getReferences())));

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
}
