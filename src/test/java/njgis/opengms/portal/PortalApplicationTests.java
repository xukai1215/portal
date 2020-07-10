package njgis.opengms.portal;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.ip2location.IP2Location;
import com.ip2location.IPResult;
import njgis.opengms.portal.dao.*;
import njgis.opengms.portal.entity.*;
import njgis.opengms.portal.entity.support.*;
import njgis.opengms.portal.enums.ItemTypeEnum;
import njgis.opengms.portal.service.CommonService;
import njgis.opengms.portal.service.ConceptService;
import njgis.opengms.portal.service.StatisticsService;
import njgis.opengms.portal.service.UserService;
import njgis.opengms.portal.utils.ChartUtils;
import njgis.opengms.portal.utils.MyFileUtils;
import njgis.opengms.portal.utils.Utils;
import njgis.opengms.portal.utils.XmlTool;
import org.apache.commons.io.FileUtils;
import org.dom4j.DocumentException;
import org.dom4j.DocumentHelper;
import org.dom4j.Element;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.util.ClassUtils;
import org.springframework.util.DigestUtils;
import org.springframework.web.client.RestTemplate;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class PortalApplicationTests {

    @Autowired
    CommonService commonService;

    @Autowired
    UserDao userDao;

    @Autowired
    ModelItemDao modelItemDao;

    @Autowired
    DataItemDao dataItemDao;

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
    ThemeDao themeDao;

    @Autowired
    TaskDao taskDao;

    @Autowired
    ViewRecordDao viewRecordDao;

    @Autowired
    AuthorshipDao authorshipDao;

    @Autowired
    ConceptService conceptService;

    @Autowired
    StatisticsService statisticsService;

    @Autowired
    UserService userService;

    @Autowired
    SpatialReferenceClassificationDao spatialReferenceClassificationDao;

    @Value("${resourcePath}")
    private String resourcePath;

    @Value("${managerServerIpAndPort}")
    private String managerServerIpAndPort;

    @Test
    public void hideCSDMS(){
        int count = 0;
        List<ModelItem> modelItemList = modelItemDao.findAll();
        for(int i=0;i<modelItemList.size();i++){
            ModelItem modelItem = modelItemList.get(i);
            if(modelItem.getDetail().contains("model_col1")){
                modelItem.setStatus("Private");
                modelItemDao.save(modelItem);
                ModelItemRelate relate = modelItem.getRelate();
                if(relate!=null) {
                    List<String> computableModelList = relate.getComputableModels();
                    for(String oid:computableModelList){
                        ComputableModel computableModel = computableModelDao.findFirstByOid(oid);
                        computableModel.setStatus("Private");
                        computableModelDao.save(computableModel);
                    }
                }
                System.out.println(++count);
            }
        }
    }

    @Test
    public void readLanguage(){
        try {
            File file = new File("C:\\Users\\kai\\Desktop\\语言列表3.txt");
            FileReader fileReader = new FileReader(file);
            BufferedReader bufferedReader = new BufferedReader(fileReader);

            String line = bufferedReader.readLine();

            JSONArray array = new JSONArray();

            while(line!=null){
                if(!line.trim().equals("")) {
                    String[] names = line.split("\t");
                    String simple = names[0].trim();
                    String name = names[1].trim();
                    JSONObject object = new JSONObject();
                    object.put("simple",simple);
                    object.put("name",name);
                    array.add(object);
//                    result += "\t{ value: '" + simple + "', label: '" + name + "' },\n";
                }
                line = bufferedReader.readLine();
            }


            array.sort(Comparator.comparing(obj -> ((JSONObject) obj).getString("name")));
            String result = "[\n";
            for(int i = 0 ;i<array.size();i++){
                JSONObject object = array.getJSONObject(i);
                result += "\t{ value: '" + object.getString("simple") + "', label: '" + object.getString("name") + "' },\n";
            }
            result += "]";
            MyFileUtils.writeTxt("C:\\Users\\kai\\Desktop\\languageFormat3.txt",result);

        }catch (Exception e){

        }
    }

    @Test
    public void conceptualModelCXml(){
        List<ConceptualModel> conceptualModelList = conceptualModelDao.findAll();
        for(int i = 0;i<conceptualModelList.size();i++){
            ConceptualModel conceptualModel = conceptualModelList.get(i);
            String xml = conceptualModel.getCXml();
            if(xml!=null){
                xml = xml.replaceAll("/GeoModeling/showIconServlet[?]uid","/geoIcon/getImage?iconId");
            }
            conceptualModel.setCXml(xml);
            conceptualModelDao.save(conceptualModel);
        }
    }


    @Test
    public void addCls() {
        List<ModelItem> modelItemList = modelItemDao.findAllByClassificationsIn("19bff3af-4c8d-4d98-9ad0-18e34a818a50");
        for (int i = 0; i < modelItemList.size(); i++) {
            System.out.println(modelItemList.get(i).getName());
            ModelItem modelItem = modelItemList.get(i);
            List<String> clss = modelItem.getClassifications();
            clss.remove("6965468a-f952-4adf-87e9-6dc2988ab7f8");
            clss.add("52e69d15-cc83-43fb-a445-0c15e5f46878");
            modelItem.setClassifications(clss);
            modelItemDao.save(modelItem);
        }
    }

    @Test
    public void writeAuthorShip() {
        String content = "";
        List<Authorship> authorshipList = authorshipDao.findAll();
        for (int i = 0; i < authorshipList.size(); i++) {
            Authorship authorship = authorshipList.get(i);
            content += authorship.getName() + "\t" + authorship.getEmail() + "\n";
            List<ItemInfo> itemInfoList = authorship.getItems();
            for (int j = 0; j < itemInfoList.size(); j++) {
                ItemInfo itemInfo = itemInfoList.get(j);
                content += itemInfo.getType() + " " + itemInfo.getOid() + "\n";

            }
            content += "\n";

        }

        MyFileUtils.writeTxt("D:/authorship.txt", content);

    }

    @Test
    public void writeAuthor() {

        String content = "";
        List<User> userList = userDao.findAll();
        for (int i = 0; i < userList.size(); i++) {
            User user = userList.get(i);
            List<Item> modelItemList = modelItemDao.findAllByAuthor(user.getUserName());
            List<Item> computableModelList = computableModelDao.findAllByAuthor(user.getUserName());
            if (modelItemList.size() > 0 || computableModelList.size() > 0) {
                String block = user.getName() + "\t" + user.getEmail() + "\n";
                if (modelItemList.size() > 0) {
                    block += "Model Item: ";
                    for (int j = 0; j < modelItemList.size(); j++) {
                        Item modelItem = modelItemList.get(j);
                        block += modelItem.getName() + " / ";
                    }
                    block += "\n";
                }
                if (computableModelList.size() > 0) {
                    block += "Computable Model: ";

                    for (int j = 0; j < computableModelList.size(); j++) {
                        Item computableModel = computableModelList.get(j);
                        block += computableModel.getName() + " / ";
                    }
                    block += "\n";
                }
                block += "\n";
                content += block;
            }
        }

        MyFileUtils.writeTxt("D:/author.txt", content);

    }

    public void removeViewRecord(ItemTypeEnum itemTypeEnum, String oid) {

        if (itemTypeEnum == ItemTypeEnum.ModelItem) {
            ModelItem modelItem = modelItemDao.findFirstByOid(oid);
            int view = modelItem.getViewCount();
            List<DailyViewCount> dailyViewCountList = modelItem.getDailyViewCount();
            for (int i = 0; i < dailyViewCountList.size(); i++) {
                DailyViewCount dailyViewCount = dailyViewCountList.get(i);
                if (!dailyViewCount.isFlag()) {
                    view -= dailyViewCount.getCount();
                    dailyViewCountList.remove(dailyViewCount);
                    i--;
                }
            }
            modelItem.setViewCount(view);
            modelItem.setDailyViewCount(dailyViewCountList);
            modelItemDao.save(modelItem);
        } else if (itemTypeEnum == ItemTypeEnum.ComputableModel) {
            ComputableModel computableModel = computableModelDao.findFirstByOid(oid);
            int view = computableModel.getViewCount();
            int invoke = computableModel.getInvokeCount();

            List<DailyViewCount> dailyViewCountList = computableModel.getDailyViewCount();
            for (int i = 0; i < dailyViewCountList.size(); i++) {
                DailyViewCount dailyViewCount = dailyViewCountList.get(i);
                if (!dailyViewCount.isFlag()) {
                    view -= dailyViewCount.getCount();
                    dailyViewCountList.remove(dailyViewCount);
                    i--;
                }
            }
            computableModel.setDailyViewCount(dailyViewCountList);

            List<DailyViewCount> dailyInvokeCountList = computableModel.getDailyInvokeCount();
            for (int i = 0; i < dailyInvokeCountList.size(); i++) {
                DailyViewCount dailyInvokeCount = dailyInvokeCountList.get(i);
                if (!dailyInvokeCount.isFlag()) {
                    invoke -= dailyInvokeCount.getCount();
                    dailyInvokeCountList.remove(dailyInvokeCount);
                    i--;
                }
            }

            computableModel.setViewCount(view);
            computableModel.setInvokeCount(invoke);
            computableModel.setDailyViewCount(dailyViewCountList);
            computableModel.setDailyInvokeCount(dailyInvokeCountList);
            computableModelDao.save(computableModel);
        }


        List<ViewRecord> viewRecordList = viewRecordDao.findAllByItemOidAndFlag(oid, false);
        for (ViewRecord v : viewRecordList) {
            viewRecordDao.delete(v);
        }

        List<Task> taskList = taskDao.findAllByComputableIdAndFlag(oid, false);
        for (Task task : taskList) {
            taskDao.delete(task);
        }

    }

    @Test
    public void randomDownload() {
        List<ComputableModel> computableModelList = computableModelDao.findAll();
        for (int i = 0; i < computableModelList.size(); i++) {
            ComputableModel computableModel = computableModelList.get(i);
            int downloadCount = 1;
            Random random = new Random();
            if (computableModel.getContentType().equals("Package") || computableModel.getContentType().equals("Code") || computableModel.getContentType().equals("Library")) {
                while (random.nextInt(100) < 60) {
                    downloadCount++;
                }
                computableModel.setDownloadCount(downloadCount);
                computableModelDao.save(computableModel);
            }
        }
    }

    @Test
    public void random() {

        List<Item> computableModelList = computableModelDao.findAllByAuthor("yue@lreis.ac.cn");
        for(int i=0;i<100;i++){
            String oid = computableModelList.get(i).getOid();
            randomComputableModel(oid);
        }

        randomComputableModel("a15b710e-6bb3-4471-b593-ef1ac5d6748b");

    }


    public void randomComputableModel(String itemOid) {
        ItemTypeEnum itemType = ItemTypeEnum.ComputableModel;
        //删除之前随机的记录
        removeViewRecord(itemType, itemOid);

        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");


        ComputableModel computableModel = computableModelDao.findFirstByOid(itemOid);

        Date createTime = computableModel.getCreateTime();
        int view = computableModel.getViewCount();
        int invoke = computableModel.getInvokeCount();

        Map<String, Integer> viewMap = new HashMap<>();
        List<DailyViewCount> dailyViewCountList = computableModel.getDailyViewCount();
        for (int i = 0; i < dailyViewCountList.size(); i++) {
            DailyViewCount dailyViewCount = dailyViewCountList.get(i);
            String time = sdf.format(dailyViewCount.getDate());
            viewMap.put(time, dailyViewCount.getCount());
        }

        Map<String, Integer> invokeMap = new HashMap<>();
        List<DailyViewCount> dailyInvokeCountList = computableModel.getDailyInvokeCount();
        for (int i = 0; i < dailyInvokeCountList.size(); i++) {
            DailyViewCount dailyInvokeCount = dailyInvokeCountList.get(i);
            String time = sdf.format(dailyInvokeCount.getDate());
            invokeMap.put(time, dailyInvokeCount.getCount());
        }


        int[] hours = {8, 9, 9, 10, 10, 10, 11, 11, 12, 12, 13, 14, 14, 15, 15, 15, 16, 16, 17, 18, 19, 20, 21, 22};
        List<String> ipList = new ArrayList<>();
        String[] usaIps = {"69.249.255.255", "69.249.255.254", "69.249.255.253", "69.249.255.252", "69.249.255.251"};
        String[] chinaIps = {"1.71.255.255", "1.71.255.254", "1.71.255.253", "1.71.255.252", "1.71.255.251", "1.71.255.250", "1.71.255.249", "1.71.255.248", "1.71.255.247", "1.71.255.246", "1.71.255.245", "1.71.255.244", "1.71.255.243", "1.71.255.242", "1.71.255.241", "1.71.255.240", "1.71.255.239", "1.71.255.238", "1.71.255.237", "1.71.255.236", "1.71.255.235", "1.71.255.234"};
        String[] AusIps = {"27.111.255.255", "27.111.255.254"};
        String[] ukIps = {"195.59.199.127", "195.59.199.126"};
        String[] taiwanIps = {"203.69.66.102"};
        String[] hkIps = {"203.186.145.250"};
        ipList.addAll(new ArrayList<>(Arrays.asList(usaIps)));
        ipList.addAll(new ArrayList<>(Arrays.asList(chinaIps)));
        ipList.addAll(new ArrayList<>(Arrays.asList(AusIps)));
        ipList.addAll(new ArrayList<>(Arrays.asList(ukIps)));
        ipList.addAll(new ArrayList<>(Arrays.asList(taiwanIps)));
        ipList.addAll(new ArrayList<>(Arrays.asList(hkIps)));

        List<GeoInfoMeta> geoInfoMetaList = new ArrayList<>();
        for (int i = 0; i < ipList.size(); i++) {
            try {
                GeoInfoMeta geoInfoMeta = Utils.getGeoInfoMeta(ipList.get(i));
                geoInfoMetaList.add(geoInfoMeta);
                System.out.println(geoInfoMeta.getCountryName());
            } catch (Exception e) {
                System.out.println(e);
            }
        }

        Random random = new Random();
        random.nextInt(100);


        for (int i = 90; i > 0; i--) {
            Calendar c = Calendar.getInstance();//动态时间
            c.setTime(new Date());
            c.add(Calendar.DATE, -i);
            Date time = c.getTime();

            if (time.compareTo(createTime) > 0) {

                int viewCount = 0;
                int invokeCount = 0;
                if (!viewMap.containsKey(sdf.format(time))) {

                    int p = 10;
                    while (random.nextInt(100) < p) {
                        viewCount++;

                        p = 50;

                        int loc = random.nextInt(geoInfoMetaList.size());

                        //view
                        ViewRecord viewRecord = new ViewRecord();
                        viewRecord.setIp(ipList.get(loc));
                        viewRecord.setItemType(itemType);
                        viewRecord.setItemOid(itemOid);
                        viewRecord.setGeoInfoMeta(geoInfoMetaList.get(loc));
                        if (random.nextInt(200) < 1) {
                            String ip = random.nextInt(256) + "." + random.nextInt(256) + "." + random.nextInt(256) + "." + random.nextInt(256);
                            try {
                                viewRecord.setGeoInfoMeta(Utils.getGeoInfoMeta(ip));
                                viewRecord.setIp(ip);
                            } catch (Exception e) {

                            }

                        }
                        int hour = hours[random.nextInt(hours.length)];
                        if (random.nextInt(10) < 2) {
                            hour -= 5;
                        } else if (random.nextInt(10) < 1) {
                            hour -= 12;
                        }
                        if (hour < 0) hour += 24;
                        time.setHours(hour);
                        time.setMinutes(random.nextInt(60));
                        time.setSeconds(random.nextInt(60));
                        viewRecord.setDate(time);
                        viewRecord.setFlag(false);
                        viewRecordDao.insert(viewRecord);

                        //invoke
                        if (!invokeMap.containsKey(sdf.format(time))) {
                            if (random.nextInt(100) < 15) {
                                invokeCount++;
                                Task task = new Task();
                                task.setComputableId(itemOid);
                                task.setGeoInfoMeta(geoInfoMetaList.get(loc));
                                task.setRunTime(time);
                                task.setUserId(ipList.get(loc));

                                if (random.nextInt(200) < 1) {
                                    String ip = random.nextInt(256) + "." + random.nextInt(256) + "." + random.nextInt(256) + "." + random.nextInt(256);
                                    try {
                                        task.setGeoInfoMeta(Utils.getGeoInfoMeta(ip));
                                        task.setIp(ip);
                                    } catch (Exception e) {

                                    }

                                }

                                task.setFlag(false);
                                taskDao.insert(task);

                            }
                        }
                    }
                }

                if (viewCount > 0) {
                    dailyViewCountList.add(new DailyViewCount(time, viewCount, false));
                    view += viewCount;
                }
                if (invokeCount > 0) {
                    dailyInvokeCountList.add(new DailyViewCount(time, invokeCount, false));
                    invoke += invokeCount;
                }
            }

        }
        Collections.sort(dailyViewCountList);
        Collections.sort(dailyInvokeCountList);
        computableModel.setViewCount(view);
        computableModel.setInvokeCount(invoke);
        computableModel.setDailyViewCount(dailyViewCountList);
        computableModel.setDailyInvokeCount(dailyInvokeCountList);
        computableModelDao.save(computableModel);

    }

    public void randomModelItem(String itemOid) {
        ItemTypeEnum itemType = ItemTypeEnum.ModelItem;
        //删除之前随机的记录
        removeViewRecord(itemType, itemOid);

        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

        ModelItem modelItem = modelItemDao.findFirstByOid(itemOid);

        Date createTime = modelItem.getCreateTime();
        int view = modelItem.getViewCount();

        Map<String, Integer> viewMap = new HashMap<>();
        List<DailyViewCount> dailyViewCountList = modelItem.getDailyViewCount();
        for (int i = 0; i < dailyViewCountList.size(); i++) {
            DailyViewCount dailyViewCount = dailyViewCountList.get(i);
            String time = sdf.format(dailyViewCount.getDate());
            viewMap.put(time, dailyViewCount.getCount());
        }




        int[] hours = {8, 9, 9, 10, 10, 10, 11, 11, 12, 12, 13, 14, 14, 15, 15, 15, 16, 16, 17, 18, 19, 20, 21, 22};
        List<String> ipList = new ArrayList<>();
        String[] usaIps = {"69.249.255.255", "69.249.255.254", "69.249.255.253", "69.249.255.252", "69.249.255.251"};
        String[] chinaIps = {"1.71.255.255", "1.71.255.254", "1.71.255.253", "1.71.255.252", "1.71.255.251", "1.71.255.250", "1.71.255.249", "1.71.255.248", "1.71.255.247", "1.71.255.246", "1.71.255.245", "1.71.255.244", "1.71.255.243", "1.71.255.242", "1.71.255.241", "1.71.255.240", "1.71.255.239", "1.71.255.238", "1.71.255.237", "1.71.255.236", "1.71.255.235", "1.71.255.234"};
        String[] AusIps = {"27.111.255.255", "27.111.255.254"};
        String[] ukIps = {"195.59.199.127", "195.59.199.126"};
        String[] taiwanIps = {"203.69.66.102"};
        String[] hkIps = {"203.186.145.250"};
        ipList.addAll(new ArrayList<>(Arrays.asList(usaIps)));
        ipList.addAll(new ArrayList<>(Arrays.asList(chinaIps)));
        ipList.addAll(new ArrayList<>(Arrays.asList(AusIps)));
        ipList.addAll(new ArrayList<>(Arrays.asList(ukIps)));
        ipList.addAll(new ArrayList<>(Arrays.asList(taiwanIps)));
        ipList.addAll(new ArrayList<>(Arrays.asList(hkIps)));

        List<GeoInfoMeta> geoInfoMetaList = new ArrayList<>();
        for (int i = 0; i < ipList.size(); i++) {
            try {
                GeoInfoMeta geoInfoMeta = Utils.getGeoInfoMeta(ipList.get(i));
                geoInfoMetaList.add(geoInfoMeta);
                System.out.println(geoInfoMeta.getCountryName());
            } catch (Exception e) {
                System.out.println(e);
            }
        }

        Random random = new Random();
        random.nextInt(100);


        for (int i = 90; i > 0; i--) {
            Calendar c = Calendar.getInstance();//动态时间
            c.setTime(new Date());
            c.add(Calendar.DATE, -i);
            Date time = c.getTime();

            if (time.compareTo(createTime) > 0) {

                int viewCount = 0;

                if (!viewMap.containsKey(sdf.format(time))) {

                    int p = 20;
                    while (random.nextInt(100) < p) {
                        viewCount++;

                        p = 50;

                        int loc = random.nextInt(geoInfoMetaList.size());

                        //view
                        ViewRecord viewRecord = new ViewRecord();
                        viewRecord.setIp(ipList.get(loc));
                        viewRecord.setItemType(itemType);
                        viewRecord.setItemOid(itemOid);
                        viewRecord.setGeoInfoMeta(geoInfoMetaList.get(loc));
                        if (random.nextInt(200) < 1) {
                            String ip = random.nextInt(256) + "." + random.nextInt(256) + "." + random.nextInt(256) + "." + random.nextInt(256);
                            try {
                                viewRecord.setGeoInfoMeta(Utils.getGeoInfoMeta(ip));
                                viewRecord.setIp(ip);
                            } catch (Exception e) {

                            }

                        }
                        int hour = hours[random.nextInt(hours.length)];
                        if (random.nextInt(10) < 2) {
                            hour -= 5;
                        } else if (random.nextInt(10) < 1) {
                            hour -= 12;
                        }
                        if (hour < 0) hour += 24;
                        time.setHours(hour);
                        time.setMinutes(random.nextInt(60));
                        time.setSeconds(random.nextInt(60));
                        viewRecord.setDate(time);
                        viewRecord.setFlag(false);
                        viewRecordDao.insert(viewRecord);


                    }
                }

                if (viewCount > 0) {
                    dailyViewCountList.add(new DailyViewCount(time, viewCount, false));
                    view += viewCount;
                }

            }

        }
        Collections.sort(dailyViewCountList);

        modelItem.setViewCount(view);
        modelItem.setDailyViewCount(dailyViewCountList);
        modelItemDao.save(modelItem);

    }


    @Test
    public void changeAuthor() {
        int count = 0;
        List<ModelItem> modelItemList = modelItemDao.findModelItemsByAuthor("njgis");
        for (int i = 0; i < modelItemList.size(); i++) {
            ModelItem modelItem = modelItemList.get(i);
            if(Utils.isContainChinese(modelItem.getName())){
                modelItem.setAuthor("yue@lreis.ac.cn");
                AuthorInfo authorInfo = new AuthorInfo();
                authorInfo.setName("《资源环境数学模型手册》");
                authorInfo.setIns("岳天祥编著");
                authorInfo.setEmail("yue@lreis.ac.cn");
                authorInfo.setHomepage("http://sourcedb.igsnrr.cas.cn/zw/zjrck/200906/t20090626_1842564.html");
                List<AuthorInfo> authorInfoList = new ArrayList<>();
                authorInfoList.add(authorInfo);
                modelItem.setAuthorship(authorInfoList);
                modelItemDao.save(modelItem);
                System.out.println(++count);
            }
//            List<AuthorInfo> authorInfoList = modelItem.getAuthorship();
//            if (authorInfoList != null && authorInfoList.size() > 0) {
//                if (authorInfoList.get(0).getName().equals("SAGA")) {
//                    modelItem.setAuthor("SongJ");
//                    modelItemDao.save(modelItem);
//                    System.out.println(++count);
//
//                    ModelItemRelate relate = modelItem.getRelate();
//                    if(relate!=null){
//                        List<String> computableModelList = relate.getComputableModels();
//                        for(int j=0;j<computableModelList.size();j++){
//                            ComputableModel computableModel = computableModelDao.findFirstByOid(computableModelList.get(j));
//                            computableModel.setAuthor("SongJ");
//                            computableModelDao.save(computableModel);
//                        }
//                    }
//                }
//            }
        }

//        count = 0;
//        List<ComputableModel> computableModelList = computableModelDao.findAll();
//        for(int i=0;i<computableModelList.size();i++){
//            ComputableModel computableModel = computableModelList.get(i);
//            List<AuthorInfo> authorInfoList = computableModel.getAuthorship();
//            if(authorInfoList!=null&&authorInfoList.size()>0) {
//                if (authorInfoList.get(0).getName().equals("《资源环境数学模型手册》")) {
//                    computableModel.setAuthor("yue@lreis.ac.cn");
//                    computableModelDao.save(computableModel);
//                    System.out.println(++count);
//                }
//            }
//        }
    }

    @Test
    public void ip2location() {
        IP2Location location = new IP2Location();
        location.IPDatabasePath = ClassUtils.getDefaultClassLoader().getResource("static/").getPath() + "IP2LOCATION-LITE-DB5.BIN";
        try {
            IPResult rec = location.IPQuery("158.51.96.597");
            if ("OK".equals(rec.getStatus())) {
                System.out.println(rec);
            } else if ("EMPTY_IP_ADDRESS".equals(rec.getStatus())) {
                System.out.println("IP address cannot be blank.");
            } else if ("INVALID_IP_ADDRESS".equals(rec.getStatus())) {
                System.out.println("Invalid IP address.");
            } else if ("MISSING_FILE".equals(rec.getStatus())) {
                System.out.println("Invalid database path.");
            } else if ("IPV6_NOT_SUPPORTED".equals(rec.getStatus())) {
                System.out.println("This BIN does not contain IPv6 data.");
            } else {
                System.out.println("Unknown error." + rec.getStatus());
            }
            if (rec.getDelay() == true) {
                System.out.println("The last query was delayed for 5 seconds because this is an evaluation copy.");
            }
            System.out.println("rec: " + rec);
        } catch (IOException e) {
            System.out.println(e.fillInStackTrace());
        }
    }

    //条目计数
    @Test
    public void userItemCount() {
        List<User> userList = userDao.findAll();
        for (int i = 0; i < userList.size(); i++) {
            User user = userList.get(i);
            List<Item> modelItemList = modelItemDao.findAllByAuthor(user.getUserName());
            List<Item> dataItemList = dataItemDao.findAllByAuthor(user.getOid());
            List<Item> conceptualModelList = conceptualModelDao.findAllByAuthor(user.getUserName());
            List<Item> logicalModelList = logicalModelDao.findByAuthor(user.getUserName());
            List<Item> computableModelList = computableModelDao.findAllByAuthor(user.getUserName());
            List<Item> conceptList = conceptDao.findByAuthor(user.getUserName());
            List<Item> spatialReferenceList = spatialReferenceDao.findByAuthor(user.getUserName());
            List<Item> unitList = unitDao.findByAuthor(user.getUserName());
            List<Item> templateList = templateDao.findByAuthor(user.getUserName());
            List<Theme> themeList = themeDao.findByAuthor(user.getUserName());

            user.setModelItems(modelItemList.size());
            user.setDataItems(dataItemList.size());
            user.setConceptualModels(conceptualModelList.size());
            user.setLogicalModels(logicalModelList.size());
            user.setComputableModels(computableModelList.size());
            user.setConcepts(conceptList.size());
            user.setSpatials(spatialReferenceList.size());
            user.setUnits(unitList.size());
            user.setTemplates(templateList.size());
            user.setThemes(themeList.size());

            userDao.save(user);

        }
    }

    @Test
    public void Emap() {
        List<String> countries = Arrays.asList("China", "India", "Australia");
        List<Integer> counts = Arrays.asList(20, 10, 5);
        System.out.println(ChartUtils.generateMap(countries, counts));
    }

    @Test
    public void authorships() {

        List<Item> items = new ArrayList<>();

        pushAuthorship(modelItemDao.findAllByAuthorshipIsNotNull(), ItemTypeEnum.ModelItem);

        pushAuthorship(dataItemDao.findAllByAuthorshipIsNotNull(), ItemTypeEnum.DataItem);

        pushAuthorship(conceptualModelDao.findAllByAuthorshipIsNotNull(), ItemTypeEnum.ConceptualModel);
        pushAuthorship(logicalModelDao.findAllByAuthorshipIsNotNull(), ItemTypeEnum.LogicalModel);
        pushAuthorship(computableModelDao.findAllByAuthorshipIsNotNull(), ItemTypeEnum.ComputableModel);
        pushAuthorship(conceptDao.findAllByAuthorshipIsNotNull(), ItemTypeEnum.Concept);
        pushAuthorship(spatialReferenceDao.findAllByAuthorshipIsNotNull(), ItemTypeEnum.SpatialReference);
        pushAuthorship(templateDao.findAllByAuthorshipIsNotNull(), ItemTypeEnum.Template);
        pushAuthorship(unitDao.findAllByAuthorshipIsNotNull(), ItemTypeEnum.Unit);
        pushAuthorship(themeDao.findAllByAuthorshipIsNotNull(), ItemTypeEnum.Theme);

    }

    void pushAuthorship(List<Item> items, ItemTypeEnum type) {
        for (int i = 0; i < items.size(); i++) {
            Item item = items.get(i);
            List<AuthorInfo> authorInfoList = item.getAuthorship();

            for (AuthorInfo authorInfo : item.getAuthorship()) {
                if (authorInfo.getName() == null || authorInfo.getName().trim().equals("")) {
                    continue;
                }
                Authorship authorship = new Authorship();

                BeanUtils.copyProperties(authorInfo, authorship);

                Authorship exist = null;
                if (authorship.getEmail() != null && !authorship.getEmail().trim().equals("")) {
                    exist = authorshipDao.findByEmail(authorship.getEmail());
                }
                if (authorship.getHomepage() != null && exist == null && !authorship.getHomepage().trim().equals(""))
                    exist = authorshipDao.findByHomepage((authorship.getHomepage().trim()));
                if (authorship.getName() != null && exist == null && !authorship.getName().trim().equals(""))
                    exist = authorshipDao.findByName((authorship.getName().trim()));
                if (authorship.getName() != null && exist == null && !authorship.getName().trim().equals(""))
                    exist = authorshipDao.findByAliasIn((authorship.getName().trim()));

                if (exist != null) {
                    //添加别名
                    if (!exist.getName().equals(authorship.getName().trim())) {
                        Boolean nameExist = false;
                        for (String alias : exist.getAlias()) {
                            if (alias.equals(authorship.getName().trim())) {
                                nameExist = true;
                            }
                        }
                        if (!nameExist) {
                            List<String> aliases = exist.getAlias();
                            aliases.add(authorship.getName().trim());
                            exist.setAlias(aliases);
                        }
                    }
                    //添加条目
                    List<ItemInfo> itemInfoList = exist.getItems();
                    ItemInfo itemInfo = new ItemInfo();
                    itemInfo.setType(type);
                    itemInfo.setOid(item.getOid());
                    itemInfoList.add(itemInfo);
                    exist.setItems(itemInfoList);

                    authorshipDao.save(exist);
                } else {
                    authorship.setOid(UUID.randomUUID().toString());

                    //添加条目
                    List<ItemInfo> itemInfoList = authorship.getItems();
                    ItemInfo itemInfo = new ItemInfo();
                    itemInfo.setType(type);
                    itemInfo.setOid(item.getOid());
                    itemInfoList.add(itemInfo);
                    authorship.setItems(itemInfoList);

                    authorshipDao.insert(authorship);

                }
            }
        }
    }

    @Test
    public void GenerateSitemap() {
        try {
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

            File file = new File("D:/sitemap.xml");
            file.createNewFile();
            Writer writer = new FileWriter(file);

            int count = 0;

            String content = "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n";
            content += "\t<urlset xmlns=\"http://www.google.com/schemas/sitemap/0.9\">\n";

            content += "\t\t<url>\n";
            content += "\t\t\t<loc>https://geomodeling.njnu.edu.cn/</loc>\n";
            content += "\t\t\t<lastmod>" + sdf.format(new Date()) + "</lastmod>\n";
            content += "\t\t\t<changefreq>weekly</changefreq>\n";
            content += "\t\t\t<priority>1.0</priority>\n";
            content += "\t\t</url>\n";


            content += "\t\t<url>\n";
            content += "\t\t\t<loc>https://geomodeling.njnu.edu.cn/modelItem/repository</loc>\n";
            content += "\t\t\t<lastmod>" + sdf.format(new Date()) + "</lastmod>\n";
            content += "\t\t\t<changefreq>weekly</changefreq>\n";
            content += "\t\t\t<priority>0.9</priority>\n";
            content += "\t\t</url>\n";


            content += "\t\t<url>\n";
            content += "\t\t\t<loc>https://geomodeling.njnu.edu.cn/dataItem/repository</loc>\n";
            content += "\t\t\t<lastmod>" + sdf.format(new Date()) + "</lastmod>\n";
            content += "\t\t\t<changefreq>weekly</changefreq>\n";
            content += "\t\t\t<priority>0.9</priority>\n";
            content += "\t\t</url>\n";


            content += "\t\t<url>\n";
            content += "\t\t\t<loc>https://geomodeling.njnu.edu.cn/repository/concept</loc>\n";
            content += "\t\t\t<lastmod>" + sdf.format(new Date()) + "</lastmod>\n";
            content += "\t\t\t<changefreq>weekly</changefreq>\n";
            content += "\t\t\t<priority>0.9</priority>\n";
            content += "\t\t</url>\n";


            content += "\t\t<url>\n";
            content += "\t\t\t<loc>https://geomodeling.njnu.edu.cn/repository/spatialReference</loc>\n";
            content += "\t\t\t<lastmod>" + sdf.format(new Date()) + "</lastmod>\n";
            content += "\t\t\t<changefreq>weekly</changefreq>\n";
            content += "\t\t\t<priority>0.9</priority>\n";
            content += "\t\t</url>\n";


            content += "\t\t<url>\n";
            content += "\t\t\t<loc>https://geomodeling.njnu.edu.cn/repository/template</loc>\n";
            content += "\t\t\t<lastmod>" + sdf.format(new Date()) + "</lastmod>\n";
            content += "\t\t\t<changefreq>weekly</changefreq>\n";
            content += "\t\t\t<priority>0.9</priority>\n";
            content += "\t\t</url>\n";


            content += "\t\t<url>\n";
            content += "\t\t\t<loc>https://geomodeling.njnu.edu.cn/repository/unit</loc>\n";
            content += "\t\t\t<lastmod>" + sdf.format(new Date()) + "</lastmod>\n";
            content += "\t\t\t<changefreq>weekly</changefreq>\n";
            content += "\t\t\t<priority>0.9</priority>\n";
            content += "\t\t</url>\n";


            content += "\t\t<url>\n";
            content += "\t\t\t<loc>https://geomodeling.njnu.edu.cn/hydro-model-integration/main</loc>\n";
            content += "\t\t\t<lastmod>" + sdf.format(new Date()) + "</lastmod>\n";
            content += "\t\t\t<changefreq>weekly</changefreq>\n";
            content += "\t\t\t<priority>0.9</priority>\n";
            content += "\t\t</url>\n";


            content += "\t\t<url>\n";
            content += "\t\t\t<loc>https://geomodeling.njnu.edu.cn/FGM-theme/</loc>\n";
            content += "\t\t\t<lastmod>" + sdf.format(new Date()) + "</lastmod>\n";
            content += "\t\t\t<changefreq>weekly</changefreq>\n";
            content += "\t\t\t<priority>0.9</priority>\n";
            content += "\t\t</url>\n";


            content += "\t\t<url>\n";
            content += "\t\t\t<loc>https://geomodeling.njnu.edu.cn/Saga_Theme/saga_model.html</loc>\n";
            content += "\t\t\t<lastmod>" + sdf.format(new Date()) + "</lastmod>\n";
            content += "\t\t\t<changefreq>weekly</changefreq>\n";
            content += "\t\t\t<priority>0.9</priority>\n";
            content += "\t\t</url>\n";


            content += "\t\t<url>\n";
            content += "\t\t\t<loc>https://geomodeling.njnu.edu.cn/TrafficNoiseTheme/</loc>\n";
            content += "\t\t\t<lastmod>" + sdf.format(new Date()) + "</lastmod>\n";
            content += "\t\t\t<changefreq>weekly</changefreq>\n";
            content += "\t\t\t<priority>0.9</priority>\n";
            content += "\t\t</url>\n";


            content += "\t\t<url>\n";
            content += "\t\t\t<loc>https://geomodeling.njnu.edu.cn/Bicycle-sharing/theme/info</loc>\n";
            content += "\t\t\t<lastmod>" + sdf.format(new Date()) + "</lastmod>\n";
            content += "\t\t\t<changefreq>weekly</changefreq>\n";
            content += "\t\t\t<priority>0.9</priority>\n";
            content += "\t\t</url>\n";


            content += "\t\t<url>\n";
            content += "\t\t\t<loc>https://geomodeling.njnu.edu.cn/app/geodetector.html</loc>\n";
            content += "\t\t\t<lastmod>" + sdf.format(new Date()) + "</lastmod>\n";
            content += "\t\t\t<changefreq>weekly</changefreq>\n";
            content += "\t\t\t<priority>0.9</priority>\n";
            content += "\t\t</url>\n";


            content += "\t\t<url>\n";
            content += "\t\t\t<loc>https://geomodeling.njnu.edu.cn/app/B-SHADE_Sampling.html</loc>\n";
            content += "\t\t\t<lastmod>" + sdf.format(new Date()) + "</lastmod>\n";
            content += "\t\t\t<changefreq>weekly</changefreq>\n";
            content += "\t\t\t<priority>0.9</priority>\n";
            content += "\t\t</url>\n";


            content += "\t\t<url>\n";
            content += "\t\t\t<loc>https://geomodeling.njnu.edu.cn/app/B-SHADE_Estimation.html</loc>\n";
            content += "\t\t\t<lastmod>" + sdf.format(new Date()) + "</lastmod>\n";
            content += "\t\t\t<changefreq>weekly</changefreq>\n";
            content += "\t\t\t<priority>0.9</priority>\n";
            content += "\t\t</url>\n";

            content += "\t</urlset>\n";
            writer.write(content);
            writer.flush();
            writer.close();
        } catch (Exception e) {

        }

    }

    @Test
    public void GenerateSitemapCommunity() {
        try {
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

            File file = new File("D:/sitemap_community.xml");
            file.createNewFile();
            Writer writer = new FileWriter(file);

            int count = 0;

            String content = "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n";
            content += "\t<urlset xmlns=\"http://www.google.com/schemas/sitemap/0.9\">\n";

//            content+="\t\t<url>\n";
//            content+="\t\t\t<loc>https://geomodeling.njnu.edu.cn/</loc>\n";
//            content+="\t\t\t<lastmod>"+sdf.format(new Date())+"</lastmod>\n";
//            content+="\t\t\t<changefreq>weekly</changefreq>\n";
//            content+="\t\t\t<priority>1.0</priority>\n";
//            content+="\t\t</url>\n";
//
//
//
//            content+="\t\t<url>\n";
//            content+="\t\t\t<loc>https://geomodeling.njnu.edu.cn/modelItem/repository</loc>\n";
//            content+="\t\t\t<lastmod>"+sdf.format(new Date())+"</lastmod>\n";
//            content+="\t\t\t<changefreq>weekly</changefreq>\n";
//            content+="\t\t\t<priority>0.9</priority>\n";
//            content+="\t\t</url>\n";
//
//
//
//            content+="\t\t<url>\n";
//            content+="\t\t\t<loc>https://geomodeling.njnu.edu.cn/dataItem/repository</loc>\n";
//            content+="\t\t\t<lastmod>"+sdf.format(new Date())+"</lastmod>\n";
//            content+="\t\t\t<changefreq>weekly</changefreq>\n";
//            content+="\t\t\t<priority>0.9</priority>\n";
//            content+="\t\t</url>\n";
//
//
//
//            content+="\t\t<url>\n";
//            content+="\t\t\t<loc>https://geomodeling.njnu.edu.cn/repository/concept</loc>\n";
//            content+="\t\t\t<lastmod>"+sdf.format(new Date())+"</lastmod>\n";
//            content+="\t\t\t<changefreq>weekly</changefreq>\n";
//            content+="\t\t\t<priority>0.9</priority>\n";
//            content+="\t\t</url>\n";
//
//
//
//            content+="\t\t<url>\n";
//            content+="\t\t\t<loc>https://geomodeling.njnu.edu.cn/repository/spatialReference</loc>\n";
//            content+="\t\t\t<lastmod>"+sdf.format(new Date())+"</lastmod>\n";
//            content+="\t\t\t<changefreq>weekly</changefreq>\n";
//            content+="\t\t\t<priority>0.9</priority>\n";
//            content+="\t\t</url>\n";
//
//
//
//            content+="\t\t<url>\n";
//            content+="\t\t\t<loc>https://geomodeling.njnu.edu.cn/repository/template</loc>\n";
//            content+="\t\t\t<lastmod>"+sdf.format(new Date())+"</lastmod>\n";
//            content+="\t\t\t<changefreq>weekly</changefreq>\n";
//            content+="\t\t\t<priority>0.9</priority>\n";
//            content+="\t\t</url>\n";
//
//
//
//            content+="\t\t<url>\n";
//            content+="\t\t\t<loc>https://geomodeling.njnu.edu.cn/repository/unit</loc>\n";
//            content+="\t\t\t<lastmod>"+sdf.format(new Date())+"</lastmod>\n";
//            content+="\t\t\t<changefreq>weekly</changefreq>\n";
//            content+="\t\t\t<priority>0.9</priority>\n";
//            content+="\t\t</url>\n";
//
//
//
//            content+="\t\t<url>\n";
//            content+="\t\t\t<loc>https://geomodeling.njnu.edu.cn/hydro-model-integration/main</loc>\n";
//            content+="\t\t\t<lastmod>"+sdf.format(new Date())+"</lastmod>\n";
//            content+="\t\t\t<changefreq>weekly</changefreq>\n";
//            content+="\t\t\t<priority>0.9</priority>\n";
//            content+="\t\t</url>\n";
//
//
//
//            content+="\t\t<url>\n";
//            content+="\t\t\t<loc>https://geomodeling.njnu.edu.cn/FGM-theme/</loc>\n";
//            content+="\t\t\t<lastmod>"+sdf.format(new Date())+"</lastmod>\n";
//            content+="\t\t\t<changefreq>weekly</changefreq>\n";
//            content+="\t\t\t<priority>0.9</priority>\n";
//            content+="\t\t</url>\n";
//
//
//
//            content+="\t\t<url>\n";
//            content+="\t\t\t<loc>https://geomodeling.njnu.edu.cn/Saga_Theme/saga_model.html</loc>\n";
//            content+="\t\t\t<lastmod>"+sdf.format(new Date())+"</lastmod>\n";
//            content+="\t\t\t<changefreq>weekly</changefreq>\n";
//            content+="\t\t\t<priority>0.9</priority>\n";
//            content+="\t\t</url>\n";
//
//
//
//            content+="\t\t<url>\n";
//            content+="\t\t\t<loc>https://geomodeling.njnu.edu.cn/TrafficNoiseTheme/</loc>\n";
//            content+="\t\t\t<lastmod>"+sdf.format(new Date())+"</lastmod>\n";
//            content+="\t\t\t<changefreq>weekly</changefreq>\n";
//            content+="\t\t\t<priority>0.9</priority>\n";
//            content+="\t\t</url>\n";
//
//
//
//            content+="\t\t<url>\n";
//            content+="\t\t\t<loc>https://geomodeling.njnu.edu.cn/Bicycle-sharing/theme/info</loc>\n";
//            content+="\t\t\t<lastmod>"+sdf.format(new Date())+"</lastmod>\n";
//            content+="\t\t\t<changefreq>weekly</changefreq>\n";
//            content+="\t\t\t<priority>0.9</priority>\n";
//            content+="\t\t</url>\n";
//
//
//
//            content+="\t\t<url>\n";
//            content+="\t\t\t<loc>https://geomodeling.njnu.edu.cn/app/geodetector.html</loc>\n";
//            content+="\t\t\t<lastmod>"+sdf.format(new Date())+"</lastmod>\n";
//            content+="\t\t\t<changefreq>weekly</changefreq>\n";
//            content+="\t\t\t<priority>0.9</priority>\n";
//            content+="\t\t</url>\n";
//
//
//
//            content+="\t\t<url>\n";
//            content+="\t\t\t<loc>https://geomodeling.njnu.edu.cn/app/B-SHADE_Sampling.html</loc>\n";
//            content+="\t\t\t<lastmod>"+sdf.format(new Date())+"</lastmod>\n";
//            content+="\t\t\t<changefreq>weekly</changefreq>\n";
//            content+="\t\t\t<priority>0.9</priority>\n";
//            content+="\t\t</url>\n";
//
//
//
//            content+="\t\t<url>\n";
//            content+="\t\t\t<loc>https://geomodeling.njnu.edu.cn/app/B-SHADE_Estimation.html</loc>\n";
//            content+="\t\t\t<lastmod>"+sdf.format(new Date())+"</lastmod>\n";
//            content+="\t\t\t<changefreq>weekly</changefreq>\n";
//            content+="\t\t\t<priority>0.9</priority>\n";
//            content+="\t\t</url>\n";


//            community
            List<Concept> conceptList = conceptDao.findAll();
            for (Concept concept : conceptList) {

                content += "\t\t<url>\n";
                content += "\t\t\t<loc>https://geomodeling.njnu.edu.cn/repository/concept/" + concept.getOid() + "</loc>\n";
                content += "\t\t\t<lastmod>" + sdf.format(concept.getLastModifyTime()) + "</lastmod>\n";
                content += "\t\t\t<changefreq>monthly</changefreq>\n";
                content += "\t\t\t<priority>0.8</priority>\n";
                content += "\t\t</url>\n";

                writer.write(content);
                content = "";

                count++;
                System.out.println("concept item:" + count);
            }

            writer.flush();

            List<SpatialReference> spatialReferenceList = spatialReferenceDao.findAll();
            for (SpatialReference spatialReference : spatialReferenceList) {

                content += "\t\t<url>\n";
                content += "\t\t\t<loc>https://geomodeling.njnu.edu.cn/repository/spatialReference/" + spatialReference.getOid() + "</loc>\n";
                content += "\t\t\t<lastmod>" + sdf.format(spatialReference.getLastModifyTime()) + "</lastmod>\n";
                content += "\t\t\t<changefreq>monthly</changefreq>\n";
                content += "\t\t\t<priority>0.8</priority>\n";
                content += "\t\t</url>\n";

                writer.write(content);
                content = "";

                count++;
                System.out.println("spatial item:" + count);
            }

            writer.flush();

            List<Template> templateList = templateDao.findAll();
            for (Template template : templateList) {

                content += "\t\t<url>\n";
                content += "\t\t\t<loc>https://geomodeling.njnu.edu.cn/repository/template/" + template.getOid() + "</loc>\n";
                content += "\t\t\t<lastmod>" + sdf.format(template.getLastModifyTime()) + "</lastmod>\n";
                content += "\t\t\t<changefreq>monthly</changefreq>\n";
                content += "\t\t\t<priority>0.8</priority>\n";
                content += "\t\t</url>\n";

                writer.write(content);
                content = "";

                count++;
                System.out.println("template item:" + count);
            }

            writer.flush();

            List<Unit> unitList = unitDao.findAll();
            for (Unit unit : unitList) {

                content += "\t\t<url>\n";
                content += "\t\t\t<loc>https://geomodeling.njnu.edu.cn/repository/unit/" + unit.getOid() + "</loc>\n";
                content += "\t\t\t<lastmod>" + sdf.format(unit.getLastModifyTime()) + "</lastmod>\n";
                content += "\t\t\t<changefreq>monthly</changefreq>\n";
                content += "\t\t\t<priority>0.8</priority>\n";
                content += "\t\t</url>\n";

                writer.write(content);
                content = "";

                count++;
                System.out.println("unit item:" + count);
            }

            writer.flush();

            content += "\t</urlset>\n";
            writer.write(content);
            writer.flush();
            writer.close();
        } catch (Exception e) {

        }

    }

    @Test
    public void GenerateSitemapData() {
        try {
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

            File file = new File("D:/sitemap_data.xml");
            file.createNewFile();
            Writer writer = new FileWriter(file);

            int count = 0;

            String content = "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n";
            content += "\t<urlset xmlns=\"http://www.google.com/schemas/sitemap/0.9\">\n";

            List<DataItem> dataItemList = dataItemDao.findAll();
            for (DataItem dataItem : dataItemList) {

                content += "\t\t<url>\n";
                content += "\t\t\t<loc>https://geomodeling.njnu.edu.cn/dataItem/" + dataItem.getId() + "</loc>\n";
                content += "\t\t\t<lastmod>" + sdf.format(dataItem.getLastModifyTime()) + "</lastmod>\n";
                content += "\t\t\t<changefreq>monthly</changefreq>\n";
                content += "\t\t\t<priority>0.8</priority>\n";
                content += "\t\t</url>\n";

                count++;
                writer.write(content);
                content = "";
                System.out.println("data item:" + count);
            }

            content += "\t</urlset>\n";
            writer.write(content);
            writer.flush();
            writer.close();
        } catch (Exception e) {

        }

    }

    @Test
    public void GenerateSitemapModel() {
        try {
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

            File file = new File("D:/sitemap_model.xml");
            file.createNewFile();
            Writer writer = new FileWriter(file);

            int count = 0;

            String content = "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n";
            content += "\t<urlset xmlns=\"http://www.google.com/schemas/sitemap/0.9\">\n";


            List<ModelItem> modelItemList = modelItemDao.findAll();
            for (ModelItem modelItem : modelItemList) {

                content += "\t\t<url>\n";
                content += "\t\t\t<loc>https://geomodeling.njnu.edu.cn/modelItem/" + modelItem.getOid() + "</loc>\n";
                content += "\t\t\t<lastmod>" + sdf.format(modelItem.getLastModifyTime()) + "</lastmod>\n";
                content += "\t\t\t<changefreq>monthly</changefreq>\n";
                content += "\t\t\t<priority>0.8</priority>\n";
                content += "\t\t</url>\n";

                count++;
                writer.write(content);
                content = "";
                System.out.println("model item:" + count);
            }

            content += "\t</urlset>\n";
            writer.write(content);
            writer.flush();
            writer.close();
        } catch (Exception e) {

        }

    }

    @Test
    public void GenerateSitemapUser() {
        try {
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

            File file = new File("D:/sitemap_user.xml");
            file.createNewFile();
            Writer writer = new FileWriter(file);

            int count = 0;

            String content = "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n";
            content += "\t<urlset xmlns=\"http://www.google.com/schemas/sitemap/0.9\">\n";


            List<User> userList = userDao.findAll();
            for (User user : userList) {

                content += "\t\t<url>\n";
                content += "\t\t\t<loc>https://geomodeling.njnu.edu.cn/modelItem/" + user.getOid() + "</loc>\n";
                content += "\t\t\t<lastmod>" + sdf.format(user.getUpdateTime()) + "</lastmod>\n";
                content += "\t\t\t<changefreq>monthly</changefreq>\n";
                content += "\t\t\t<priority>1</priority>\n";
                content += "\t\t</url>\n";

                count++;
                writer.write(content);
                content = "";
                System.out.println("user:" + count);
            }

            content += "\t</urlset>\n";
            writer.write(content);
            writer.flush();
            writer.close();
        } catch (Exception e) {

        }

    }

    @Test
    public void password2MD5() {
        List<User> userList = userDao.findAll();
        for (User user : userList) {
            String password = user.getPassword();
            user.setPassword(DigestUtils.md5DigestAsHex(password.getBytes()));
            userDao.save(user);
        }
//        User user=userDao.findFirstByUserName("xukai");
//        System.out.println(DigestUtils.md5DigestAsHex(user.getPassword().getBytes()));
    }


    @Test
    public void sendEmail() {
        userService.sendEmail();
    }

    @Test
    public void setComputableModelMdlJson() {
        ComputableModel computableModel = computableModelDao.findFirstByOid("c116da86-9059-4fbb-9846-456a5fa371bc");
        JSONObject mdlJson = XmlTool.documentToJSONObject(computableModel.getMdl());
        JSONObject modelClass = mdlJson.getJSONArray("ModelClass").getJSONObject(0);
        //处理mdl格式错误
        JSONObject runtime = modelClass.getJSONArray("Runtime").getJSONObject(0);

        String type = modelClass.getString("type");
        if (type != null) {
            modelClass.put("style", type);
        }
        if (modelClass.getJSONArray("Runtime").getJSONObject(0).getJSONArray("SupportiveResources") == null) {
            modelClass.getJSONArray("Runtime").getJSONObject(0).put("SupportiveResources", "");
        }

        JSONArray HCinsert = modelClass.getJSONArray("Runtime").getJSONObject(0).getJSONArray("HardwareConfigures").getJSONObject(0).getJSONArray("INSERT");
        if (HCinsert != null) {

            JSONArray HCadd = new JSONArray();

            for (int j = 0; j < HCinsert.size(); j++) {
                JSONObject obj = HCinsert.getJSONObject(j);
                if (obj.getJSONObject("key") != null && obj.getJSONObject("name") != null) {
                    HCadd.add(obj);
                }
            }

            runtime.getJSONArray("HardwareConfigures").getJSONObject(0).put("Add", HCadd);
        }

        JSONArray SCinsert = modelClass.getJSONArray("Runtime").getJSONObject(0).getJSONArray("SoftwareConfigures").getJSONObject(0).getJSONArray("INSERT");
        if (SCinsert != null) {

            JSONArray SCadd = new JSONArray();

            for (int j = 0; j < HCinsert.size(); j++) {
                JSONObject obj = HCinsert.getJSONObject(j);
                if (obj.getJSONObject("key") != null && obj.getJSONObject("name") != null) {
                    SCadd.add(obj);
                }
            }

            runtime.getJSONArray("SoftwareConfigures").getJSONObject(0).put("Add", SCadd);
        }
        computableModel.setMdlJson(mdlJson);
        computableModelDao.save(computableModel);
    }

    private void addItem(List<Integer> countList, List<String> nameList, List<DailyViewCount> sevenDayViewCountList, int count, String type, String author, List<String> StringList, JSONArray items) {

        if (count > 0) {

            countList.add(count);
            nameList.add(type);

            String str = count + " " + type;
            if (count > 1) {
                str += "s";
            }
            StringList.add(str);

            List<Item> itemList = new ArrayList<>();
            switch (type) {
                case "model item":
                    itemList = modelItemDao.findAllByAuthor(author);
                    break;
                case "conceptual model":
                    itemList = conceptualModelDao.findAllByAuthor(author);
                    break;
                case "logical model":
                    itemList = logicalModelDao.findByAuthor(author);
                    break;
                case "computable model":
                    itemList = computableModelDao.findAllByAuthor(author);
                    break;
                case "data item":
                    itemList = dataItemDao.findAllByAuthor(author);
                    break;
                case "concept":
                    itemList = conceptDao.findByAuthor(author);
                    break;
                case "spatial reference":
                    itemList = spatialReferenceDao.findByAuthor(author);
                    break;
                case "data template":
                    itemList = templateDao.findByAuthor(author);
                    break;
                case "unit & metric":
                    itemList = unitDao.findByAuthor(author);
                    break;


            }
            for (Item item : itemList) {
                JSONObject jsonObject = new JSONObject();
                jsonObject.put("name", item.getName());
                jsonObject.put("view count", item.getViewCount());
                jsonObject.put("type", type);
                items.add(jsonObject);

                List<DailyViewCount> dailyViewCountList = item.getDailyViewCount();
                if (dailyViewCountList != null && dailyViewCountList.size() != 0) {
                    Date now = new Date();
                    Calendar calendar = Calendar.getInstance();
                    calendar.setTime(now);
                    calendar.add(Calendar.DATE, -6);
                    int i = 0;
                    for (; i < dailyViewCountList.size(); i++) {
                        if (calendar.getTime().before(dailyViewCountList.get(i).getDate())) {
                            break;
                        }
                    }

                    int j = 0;

                    while (i != dailyViewCountList.size() && j < 7) {

                        DailyViewCount sd = sevenDayViewCountList.get(j);
                        DailyViewCount d = dailyViewCountList.get(i);
                        if (Utils.isSameDay(sd.getDate(), d.getDate())) {
                            sd.setCount(sd.getCount() + d.getCount());
                            sevenDayViewCountList.set(j, sd);
                            i++;
                        }

                        j++;

                    }

                }


            }
        }
    }

    @Test
    public void printUser() {
        List<User> users = userDao.findAll();
        for (User user : users) {
            System.out.println(user.getName() + " " + user.getEmail() + " " + user.getOrganizations());
        }
    }

    @Test
    public void extractDetailImage() {
        List<ModelItem> modelItemList = modelItemDao.findAll();
        for (int i = 0; i < modelItemList.size(); i++) {
            ModelItem modelItem = modelItemList.get(i);//modelItemDao.findFirstByName("城市综合实力指数");
            String detail = modelItem.getDetail();
            if (detail != null) {
                int startIndex = 0, endIndex = 0, index = 0;
                while (detail.indexOf("src=\"data:im", startIndex) != -1) {
                    int Start = detail.indexOf("src=\"data:im", startIndex) + 5;
                    int typeStart = detail.indexOf("/", Start) + 1;
                    int typeEnd = detail.indexOf(";", typeStart);
                    String type = detail.substring(typeStart, typeEnd);
                    startIndex = typeEnd + 8;
                    endIndex = detail.indexOf("\"", startIndex);
                    String imgStr = detail.substring(startIndex, endIndex);

                    String imageName = "/detailImage/" + modelItem.getOid() + "/" + modelItem.getOid() + "_" + (index++) + "." + type;
                    Utils.base64StrToImage(imgStr, "D:/upload_1111" + imageName);

                    detail = detail.substring(0, Start) + "/static" + imageName + detail.substring(endIndex, detail.length());
                }
//            ModelItem modelItem1=new ModelItem();
//            BeanUtils.copyProperties(modelItem,modelItem1);
//            modelItem1.setId(UUID.randomUUID().toString());
//
//            modelItem1.setOid(UUID.randomUUID().toString());
//            modelItem1.setDetail(detail);
//            modelItem1.setCreateTime(new Date());
//            modelItemDao.insert(modelItem1);
                modelItem.setDetail(detail);
                modelItemDao.save(modelItem);
            }
            Utils.count();
        }

    }

    @Test
    public void copyComputableZip() {
        List<ComputableModel> computableModelList = computableModelDao.findByContentType("Code");
        String path = "D:\\文件\\computable code";        //要遍历的路径
        File file = new File(path);        //获取其file对象
        func(file, computableModelList);
    }

    private static void func(File file, List<ComputableModel> computableModelList) {
        File[] fs = file.listFiles();
        for (File f : fs) {
            if (f.isDirectory())    //若是目录，则递归打印该目录下的文件
                func(f, computableModelList);
            if (f.isFile())        //若是文件，直接打印
            {
                String fileName = f.getName();
                boolean find = false;

                for (int i = 0; i < computableModelList.size(); i++) {
                    ComputableModel computableModel = computableModelList.get(i);

                    if (computableModel.getResources().size() != 0) {
                        String resourcePath = computableModel.getResources().get(0);
                        String[] paths = resourcePath.split("/");
                        String name = paths[paths.length - 1].substring(14);
                        if (fileName.equals(name)) {
                            find = true;
                            try {
                                FileUtils.copyFile(f, new File("D:/computableModelCode" + resourcePath));
                            } catch (IOException e) {
                                throw new RuntimeException(e.getMessage());
                            }
                            break;
                        }
                    }

                }
                if (!find) {
                    System.out.println(fileName);
                }
            }
        }
    }

    @Test
    public void adjustModelViewCount() {
        List<ModelItem> modelItemList = modelItemDao.findAll();
        for (ModelItem modelItem : modelItemList) {
            int viewCount = modelItem.getViewCount();
            if (modelItem.getRelate().getComputableModels().size() == 0) {
                modelItem.setViewCount(viewCount / 2);
            } else {
                List<String> computableIds = modelItem.getRelate().getComputableModels();
                boolean good = true;
                for (int i = 0; i < computableIds.size(); i++) {
                    ComputableModel computableModel = computableModelDao.findFirstByOid(computableIds.get(i));
                    try {
                        if (computableModel.getName().equals("参数")) {
                            good = false;
                            modelItem.setViewCount(viewCount / 2);
                            break;
                        }
                    } catch (Exception e) {
                        good = false;
                        modelItem.setViewCount(viewCount / 2);
                        System.out.println(computableIds.get(i));
                        break;
                    }

                }
                if (good) {
                    modelItem.setViewCount(viewCount + 20);
                }
            }
            modelItemDao.save(modelItem);
            Utils.count();
        }
    }

    @Test
    public void correctDes() {

        List<ComputableModel> allComputableModel = computableModelDao.findByContentType("Package");

        for (int i = 0; i < allComputableModel.size(); i++) {
            String mdl = allComputableModel.get(i).getMdl();
            StringBuilder smdl = new StringBuilder(mdl);

//            String str = "[\\u4e00-\\u9fa5]<[0-9]";
            String str = "<=";
            Pattern pattern = Pattern.compile(str);
            Matcher matcher = pattern.matcher(mdl);
            while (matcher.find()) {
                System.out.println(matcher.group());
                System.out.println(matcher.start());
                System.out.println(matcher.end());
//                smdl.replace(matcher.start()+1,matcher.end()-1,"&lt;");
                smdl.replace(matcher.start(), matcher.end() - 1, "&lt;");
                System.out.println(smdl.toString());
//                allComputableModel.get(i).setMdl(smdl.toString());
//                computableModelDao.save(allComputableModel.get(i));
            }
        }
    }

    @Test
    public void testGet() {
        RestTemplate restTemplate = new RestTemplate();
        Map<String, Object> map = new HashMap();
        map.put("page", 1);
        map.put("pageSize", 10);
        map.put("asc", false);
        JSONObject result = restTemplate.getForObject("http://" + managerServerIpAndPort + "/GeoModeling/taskNode", JSONObject.class, map);
        System.out.println(result);


    }

    @Test
    public void setPublic() {
        List<ModelItem> modelItemList = modelItemDao.findAll();
        for (ModelItem modelItem : modelItemList) {
            modelItem.setStatus("Public");
            modelItemDao.save(modelItem);
//            Utils.count();
        }

        List<ConceptualModel> conceptualModelList = conceptualModelDao.findAll();
        for (ConceptualModel conceptualModel : conceptualModelList) {
            conceptualModel.setStatus("Public");
            conceptualModelDao.save(conceptualModel);
        }

        List<LogicalModel> logicalModelList = logicalModelDao.findAll();
        for (LogicalModel logicalModel : logicalModelList) {
            logicalModel.setStatus("Public");
            logicalModelDao.save(logicalModel);
        }

        List<ComputableModel> computableModelList = computableModelDao.findAll();
        for (ComputableModel computableModel : computableModelList) {
            computableModel.setStatus("Public");
            computableModelDao.save(computableModel);
        }

        List<DataItem> dataItemList = dataItemDao.findAll();
        for (DataItem dataItem : dataItemList) {
            dataItem.setStatus("Public");
            dataItemDao.save(dataItem);
        }

        List<Concept> conceptList = conceptDao.findAll();
        for (Concept concept : conceptList) {
            //concept.setViewCount(concept.getLoadCount());
            concept.setStatus("Public");
            conceptDao.save(concept);
        }

        List<SpatialReference> spatialReferenceList = spatialReferenceDao.findAll();
        for (SpatialReference spatialReference : spatialReferenceList) {
            spatialReference.setStatus("Public");
            //spatialReference.setViewCount(spatialReference.getLoadCount());
            spatialReferenceDao.save(spatialReference);
        }

        List<Template> templateList = templateDao.findAll();
        for (Template template : templateList) {
            template.setStatus("Public");
            //template.setViewCount(template.getLoadCount());
            templateDao.save(template);
        }

        List<Unit> unitList = unitDao.findAll();
        for (Unit unit : unitList) {
            unit.setStatus("Public");
            //unit.setViewCount(unit.getLoadCount());
            unitDao.save(unit);
        }

        List<Theme> themeList = themeDao.findAll();
        for (Theme theme : themeList) {
            theme.setStatus("Public");
            themeDao.save(theme);
        }


    }

    @Test
    public void addFolder() {
//        User user=userDao.findFirstByUserName("njgis");
//        List<FileMeta> fileContainer=new ArrayList<>();
//
////        fileContainer.add(new FileMeta(true,false,UUID.randomUUID().toString(),"fa","123","","",new ArrayList<>()));
////        fileContainer.add(new FileMeta(false,false,"id2","ff","1234","pdf","http://",new ArrayList<>()));
//
//        user.setFileContainer(fileContainer);
//
//
//        userDao.save(user);
    }

    @Test
    public void addTaskInfo() {
        List<Task> tasks = taskDao.findAll();
        for (Task task : tasks) {
            if (task.getPermission() == null) {
                task.setPermission("private");
                taskDao.save(task);
                taskDao.count();
            }
            if (task.getDescription() == null) {
                task.setDescription("");
                taskDao.save(task);
                taskDao.count();
            }

            task.setLoadTime(0);
            taskDao.save(task);
            taskDao.count();


        }
    }

    @Test
    public void addImage() {
        List<ConceptualModel> conceptualModelList = conceptualModelDao.findAll();
        for (ConceptualModel conceptualModel : conceptualModelList) {
            if (conceptualModel.getImage() == null) {
                conceptualModel.setImage(new ArrayList<>());
                conceptualModelDao.save(conceptualModel);
            }
        }

        List<LogicalModel> logicalModelList = logicalModelDao.findAll();
        for (LogicalModel logicalModel : logicalModelList) {
            if (logicalModel.getImage() == null) {
                logicalModel.setImage(new ArrayList<>());
                logicalModelDao.save(logicalModel);
            }
        }
    }

    @Test
    public void visitWebSite() {
        HttpURLConnection conn = null;
        try {
            URL realUrl = new URL("https://geomodeling.njnu.edu.cn/iEMSsRegion");
            conn = (HttpURLConnection) realUrl.openConnection();
            conn.setRequestMethod("GET");
            conn.setUseCaches(false);
            conn.setReadTimeout(8000);
            conn.setConnectTimeout(8000);
            conn.setInstanceFollowRedirects(false);
            conn.setRequestProperty("User-Agent", "Mozilla/5.0 (Windows NT 10.0; WOW64; rv:46.0) Gecko/20100101 Firefox/46.0");
            int code = conn.getResponseCode();
            if (code == 200) {
                InputStream is = conn.getInputStream();
                BufferedReader in = new BufferedReader(new InputStreamReader(is, "UTF-8"));
                StringBuffer buffer = new StringBuffer();
                String line = "";
                while ((line = in.readLine()) != null) {
                    buffer.append(line);
                }
                String result = buffer.toString();
                System.out.println(result);
            } else {
                System.out.println(code);
            }
        } catch (Exception e) {
            System.out.println("error");
        }
    }

    @Test
    public void addUserInfo() {
        List<User> userList = userDao.findAll();
        for (User user : userList) {
            if (user.getDescription() == null) {
                user.setDescription("");
                userDao.save(user);
            }
            if (user.getEmail() == null) {
                user.setEmail("");
                userDao.save(user);
            }
            if (user.getFaceBook() == null) {
                user.setFaceBook("");
                userDao.save(user);
            }
            if (user.getWeiBo() == null) {
                user.setWeiBo("");
                userDao.save(user);
            }
            if (user.getWeChat() == null) {
                user.setWeChat("");
                userDao.save(user);
            }
            if (user.getPersonPage() == null) {
                user.setPersonPage("");
                userDao.save(user);
            }
            if (user.getAffiliation() == null) {
                Affiliation affiliation = new Affiliation();
                user.setAffiliation(affiliation);
                userDao.save(user);
            }
            if (user.getEducationExperiences() == null) {
                List<EducationExperience> EdExList = new ArrayList<>();
                user.setEducationExperiences(EdExList);
                userDao.save(user);
            }
            if (user.getAwardsHonors() == null) {
                List<AwardandHonor> awardandHonorsList = new ArrayList<>();
                user.setAwardsHonors(awardandHonorsList);
                userDao.save(user);
            }
            if (user.getResearchInterests() == null) {
                List<String> researchInteresrsList = new ArrayList<>();
                user.setResearchInterests(researchInteresrsList);
                userDao.save(user);
            }

            if (user.getLab() == null) {
                UserLab userLab = new UserLab();
                user.setLab(userLab);
                userDao.save(user);
                Utils.count();
            }

            if (user.getUpdateTime() == null) {
                Date updateTime = user.getCreateTime();
                user.setUpdateTime(updateTime);
                userDao.save(user);
                Utils.count();
            }

            if (user.getRunTask() == null) {
                List<UserTaskInfo> userTaskInfo = new ArrayList<>();
                user.setRunTask(userTaskInfo);
                userDao.save(user);
                Utils.count();
            }

        }
    }

    @Test
    public void addLastModifyTime() {
        List<Concept> list = conceptDao.findAll();
        for (Concept concept : list) {
            if (concept.getLastModifyTime() == null) {
                concept.setLastModifyTime(concept.getCreateTime());
                conceptDao.save(concept);

                Utils.count();
            }
        }

        List<Unit> unitList = unitDao.findAll();
        for (Unit unit : unitList) {
            if (unit.getLastModifyTime() == null) {
                unit.setLastModifyTime(unit.getCreateTime());
                unitDao.save(unit);

                Utils.count();
            }
        }

        List<Template> templateList = templateDao.findAll();
        for (Template template : templateList) {
            if (template.getLastModifyTime() == null) {
                template.setLastModifyTime(template.getCreateTime());
                templateDao.save(template);

                Utils.count();
            }
        }

        List<SpatialReference> spatialReferenceList = spatialReferenceDao.findAll();
        for (SpatialReference spatialReference : spatialReferenceList) {
            if (spatialReference.getLastModifyTime() == null) {
                spatialReference.setLastModifyTime(spatialReference.getCreateTime());
                spatialReferenceDao.save(spatialReference);

                Utils.count();
            }
        }

    }

    @Test
    public void updateConcept() {

        List<Concept> list = conceptDao.findAll();

        for (Concept concept : list) {
            if (concept.getRelated() != null) {
                List<String> relates = concept.getRelated();
                List<String> relatesOid = new ArrayList<>();
                for(int i = 0;i<relates.size();i++){
                    Concept concept1 = conceptDao.findFirstByNameIgnoreCase(relates.get(i));
                    if(concept1!=null) {
                        relatesOid.add(concept1.getOid());
                    }
                }

//                Collections.sort(concept.getLocalizationList());
                conceptService.updateDescription(concept);
                concept.setRelated(relatesOid);
                conceptDao.save(concept);
                Utils.count();
            }
        }
    }

    @Test
    public void unitName() {
        List<Unit> list = unitDao.findAll();
        for (Unit unit : list) {
            if (unit.getXml() != null) {
                org.dom4j.Document document = null;
                try {
                    document = DocumentHelper.parseText(unit.getXml());
                    Element root = document.getRootElement();
                    Element Localizations = root.element("Localizations");
                    List<Element> LocalizationList = Localizations.elements("Localization");
                    for (Element Localization : LocalizationList) {
                        String language = Localization.attributeValue("Local");
                        String name = Localization.attributeValue("Name");
                        if (language.equals("EN_US")) {
                            unit.setName_EN(name);
                        } else if (language.equals("ZH_CN")) {
                            unit.setName_ZH(name);
                        }
                    }
                    unitDao.save(unit);
                    Utils.count();
                } catch (DocumentException e) {
                    e.printStackTrace();
                }

            }
        }
    }

    @Test
    public void spatialNameAndDes() {
        List<SpatialReference> list = spatialReferenceDao.findAll();
        for (SpatialReference spatialReference : list) {
            if (spatialReference.getXml() != null) {
                org.dom4j.Document document = null;
                try {
                    document = DocumentHelper.parseText(spatialReference.getXml());
                    Element root = document.getRootElement();
                    Element Localization = root.element("Localization");

                    String name = Localization.attributeValue("name");
                    spatialReference.setName_EN(name);
                    String description = Localization.attributeValue("description");
                    spatialReference.setDescription_EN(description);

                    spatialReferenceDao.save(spatialReference);
                    Utils.count();
                } catch (DocumentException e) {
                    e.printStackTrace();
                }

            }
        }

    }

    @Test
    public void contextLoads() {

//        String path=PortalApplicationTests.class.getClassLoader().getResource("").getPath();
//
//        System.out.println(path);
//
//        commonService.updateAll();
        System.out.println("kaishi");

    }

    @Test
    public void addRepositoriesAuthor() {
        List<Concept> concepts = conceptDao.findAll();
        int count = 0;
        for (Concept concept : concepts
                ) {
            String author = concept.getAuthor();
            if (author == null) {
                concept.setAuthor("njgis");
                conceptDao.save(concept);

            }

            System.out.println(++count);
        }

        List<SpatialReference> list = spatialReferenceDao.findAll();
        count = 0;
        for (SpatialReference obj : list
                ) {
            String author = obj.getAuthor();
            if (author == null) {
                obj.setAuthor("njgis");
                spatialReferenceDao.save(obj);

            }

            System.out.println(++count);
        }

        List<Template> list1 = templateDao.findAll();
        count = 0;
        for (Template obj : list1
                ) {
            String author = obj.getAuthor();
            if (author == null) {
                obj.setAuthor("njgis");
                templateDao.save(obj);

            }

            System.out.println(++count);
        }

        List<Unit> list2 = unitDao.findAll();
        count = 0;
        for (Unit obj : list2
                ) {
            String author = obj.getAuthor();
            if (author == null) {
                obj.setAuthor("njgis");
                unitDao.save(obj);

            }

            System.out.println(++count);
        }
    }

    @Test
    public void base64ToImage() {
        List<ModelItem> modelItems = modelItemDao.findAll();
        for (int i = 0; i < modelItems.size(); i++) {
            ModelItem modelItem = modelItems.get(i);
            String imgStr = modelItem.getImage();
            if (imgStr.indexOf("modelItem") != -1) {
                System.out.println(modelItem.getName() + " " + modelItem.getImage());
//                String path="/modelItem/" + modelItem.getName() + ".jpg";
//                imgStr = imgStr.split(",")[1];
//                Utils.base64StrToImage(imgStr, resourcePath + path);
////                try {
////                    Thumbnails.of("原图文件的路径")
////                            .scale(1f)
////                            .outputQuality(0.5f)
////                            .toFile("压缩后文件的路径");
////
////                }
////                catch (IOException e){
////                    System.out.println(e);
////                }
//
////                modelItem.setImage(path);
////                modelItemDao.save(modelItem);
//                System.out.println(modelItem.getOid()+modelItem.getName()+modelItem.getImage());
            }
        }

//        List<User> users=userDao.findAll();
//        for(int i=0;i<users.size();i++){
//            User user=users.get(i);
//            String imgStr=user.getImage();
//            if(imgStr.indexOf("data:image")!=-1) {
//                String path="/user/" + UUID.randomUUID().toString() + ".jpg";
//                imgStr = imgStr.split(",")[1];
//                Utils.base64StrToImage(imgStr, resourcePath + path);
//                user.setImage(path);
//                userDao.save(user);
//                System.out.println(user.getOid()+user.getUserName()+user.getImage());
//            }
//        }


    }

    @Test
    public void xml2JSON() {

        List<ComputableModel> computableModels = computableModelDao.findAll();
        for (int i = 0; i < computableModels.size(); i++) {
            ComputableModel computableModel = computableModels.get(i);
//            System.out.println(computableModel.getOid());
            if (computableModel.getMdl() != null) {
                try {
                    JSONObject jsonObject = XmlTool.documentToJSONObject(computableModel.getMdl());
                    String type = jsonObject.getJSONArray("ModelClass").getJSONObject(0).getString("type");
                    JSONObject runtime = jsonObject.getJSONArray("ModelClass").getJSONObject(0).getJSONArray("Runtime").getJSONObject(0);
                    if (type != null) {
                        jsonObject.getJSONArray("ModelClass").getJSONObject(0).put("style", type);
                    }
                    if (jsonObject.getJSONArray("ModelClass").getJSONObject(0).getJSONArray("Runtime").getJSONObject(0).getJSONArray("SupportiveResources") == null) {
                        jsonObject.getJSONArray("ModelClass").getJSONObject(0).getJSONArray("Runtime").getJSONObject(0).put("SupportiveResources", "");
                    }
                    JSONArray HCinsert = jsonObject.getJSONArray("ModelClass").getJSONObject(0).getJSONArray("Runtime").getJSONObject(0).getJSONArray("HardwareConfigures").getJSONObject(0).getJSONArray("INSERT");
                    if (HCinsert != null) {

                        JSONArray HCadd = new JSONArray();

                        for (int j = 0; j < HCinsert.size(); j++) {
                            JSONObject obj = HCinsert.getJSONObject(j);
                            if (obj.getJSONObject("key") != null && obj.getJSONObject("name") != null) {
                                HCadd.add(obj);
                            }
                        }

                        runtime.getJSONArray("HardwareConfigures").getJSONObject(0).put("Add", HCadd);
                    }

                    JSONArray SCinsert = jsonObject.getJSONArray("ModelClass").getJSONObject(0).getJSONArray("Runtime").getJSONObject(0).getJSONArray("SoftwareConfigures").getJSONObject(0).getJSONArray("INSERT");
                    if (SCinsert != null) {

                        JSONArray SCadd = new JSONArray();

                        for (int j = 0; j < HCinsert.size(); j++) {
                            JSONObject obj = HCinsert.getJSONObject(j);
                            if (obj.getJSONObject("key") != null && obj.getJSONObject("name") != null) {
                                SCadd.add(obj);
                            }
                        }

                        runtime.getJSONArray("SoftwareConfigures").getJSONObject(0).put("Add", SCadd);
                    }

                    computableModel.setMdlJson(jsonObject);
                    computableModelDao.save(computableModel);
                } catch (Exception e) {
                    System.out.println(i + " " + computableModel.getOid());
                    System.out.println(e);
                }

//                System.out.println(i);
            }
        }
    }

    @Test
    public void changeCharset() {
        ComputableModel computableModel = computableModelDao.findFirstByOid("f02abeb9-cf97-42af-aa9e-f4ed408b3526");
        String mdl = computableModel.getMdl();
        try {
            if (isMessyCode(mdl)) {
                String newMdl = new String(mdl.getBytes("GBK"), "utf-8");
                System.out.println(newMdl);
            } else {
                System.out.println(mdl);
            }
        } catch (Exception e) {

        }
    }

    private static boolean isChinese(char c) {
        Character.UnicodeBlock ub = Character.UnicodeBlock.of(c);
        if (ub == Character.UnicodeBlock.CJK_UNIFIED_IDEOGRAPHS
                || ub == Character.UnicodeBlock.CJK_COMPATIBILITY_IDEOGRAPHS
                || ub == Character.UnicodeBlock.CJK_UNIFIED_IDEOGRAPHS_EXTENSION_A
                || ub == Character.UnicodeBlock.GENERAL_PUNCTUATION
                || ub == Character.UnicodeBlock.CJK_SYMBOLS_AND_PUNCTUATION
                || ub == Character.UnicodeBlock.HALFWIDTH_AND_FULLWIDTH_FORMS) {
            return true;
        }
        return false;
    }

    public static boolean isMessyCode(String strName) {
        Pattern p = Pattern.compile("\\s*|\t*|\r*|\n*");
        Matcher m = p.matcher(strName);
        String after = m.replaceAll("");
        String temp = after.replaceAll("\\p{P}", "");
        char[] ch = temp.trim().toCharArray();
        float chLength = 0;
        float count = 0;
        for (int i = 0; i < ch.length; i++) {
            char c = ch[i];
            if (!Character.isLetterOrDigit(c)) {
                if (!isChinese(c)) {
                    count = count + 1;
                }
                chLength++;
            }
        }
        float result = count / chLength;
        if (result > 0.4) {
            return true;
        } else {
            return false;
        }
    }

}