package njgis.opengms.portal.service;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import njgis.opengms.portal.dao.*;
import njgis.opengms.portal.dto.*;
import njgis.opengms.portal.entity.*;
import njgis.opengms.portal.entity.support.*;
import njgis.opengms.portal.enums.ItemTypeEnum;
import njgis.opengms.portal.enums.ResultEnum;
import njgis.opengms.portal.exception.MyException;
import njgis.opengms.portal.utils.ChartUtils;
import njgis.opengms.portal.utils.MyMailUtils;
import njgis.opengms.portal.utils.Object.ChartOption;
import njgis.opengms.portal.utils.Utils;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Component;
import org.springframework.util.DigestUtils;
import org.springframework.web.servlet.ModelAndView;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.io.File;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
public class UserService {

    @Autowired
    UserDao userDao;

    @Autowired
    AuthorshipDao authorshipDao;

    @Autowired
    TaskDao taskDao;

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
    ViewRecordDao viewRecordDao;

    @Autowired
    FeedbackDao feedbackDao;

    @Autowired
    ArticleService articleService;

    @Autowired
    CommonService commonService;

    @Autowired
    StatisticsService statisticsService;

    @Autowired
    TemplateEngine templateEngine;

    //远程数据容器地址
    @Value("${dataContainerIpAndPort}")
    String dataContainerIpAndPort;

    @Value("${resourcePath}")
    private String resourcePath;

    @Value("${htmlLoadPath}")
    private String htmlLoadPath;

    //可以可视化的数据模板
    @Value("#{'${visualTemplateIds}'.split(',')}")
    private String[] visualTemplateIds;

    public void setSubscribe(String oid, Boolean subscribe) {
        User user = getByOid(oid);
        user.setSubscribe(subscribe);
        userDao.save(user);
    }

    public JSONArray getSubscribedList(String oid) {
        User user = getByOid(oid);
        List<SubscribeItem> subscribeItemList = user.getSubscribeItemList();
        JSONArray array = new JSONArray();
        for (int i = 0; i < subscribeItemList.size(); i++) {
            ComputableModel computableModel = computableModelDao.findFirstByOid(subscribeItemList.get(i).getOid());

            JSONObject subscribe = new JSONObject();
            subscribe.put("name", computableModel.getName());
            subscribe.put("type", computableModel.getContentType());
            subscribe.put("oid", computableModel.getOid());

            array.add(subscribe);
        }

        return array;

    }

    public void setSubscribedList(String oid, List<SubscribeItem> subscribeItemList) {
        User user = getByOid(oid);
        user.setSubscribeItemList(subscribeItemList);
        userDao.save(user);
    }

    public Item findItemByItemTypeEnum(ItemTypeEnum itemTypeEnum, String oid) {
        Item item = null;
        switch (itemTypeEnum) {
            case DataItem:
                item = dataItemDao.findFirstById(oid);
                break;
            case ModelItem:
                item = modelItemDao.findFirstByOid(oid);
                break;
            case ConceptualModel:
                item = conceptualModelDao.findFirstByOid(oid);
                break;
            case LogicalModel:
                item = logicalModelDao.findFirstByOid(oid);
                break;
            case ComputableModel:
                try {
                    item = computableModelDao.findFirstByOid(oid);
                } catch (Exception e) {
                    System.out.println("计算模型oid：" + oid);
                }
                break;
            case Concept:
                item = conceptDao.findByOid(oid);
                break;
            case SpatialReference:
                item = spatialReferenceDao.findByOid(oid);
                break;
            case Template:
                item = templateDao.findByOid(oid);
                break;
            case Unit:
                item = unitDao.findByOid(oid);
                break;
            case Theme:
                item = themeDao.findByOid(oid);
                break;
        }
        return item;
    }

    public void sendSingleModelReport() {

    }

    public void sendEmail() {

//        sendEmailToAuthorship();
        sendEmailToUser("95", "921485453@qq.com");

    }

    public String generateHtmlStr(User user, JSONArray imageList, String type) {
        Context ctx = new Context();
        ctx.setVariable("name", user.getName());
        ctx.setVariable("id", user.getId());
        Date now = new Date();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        ctx.setVariable("time", sdf.format(now));
        ctx.setVariable("type", type.toLowerCase());

        JSONArray result = new JSONArray();
        List<SubscribeItem> subscribeItemList = user.getSubscribeItemList();
        if (subscribeItemList.size() == 0) {
            List<Item> computableModels = computableModelDao.findAllByAuthor(user.getUserName());
            SubscribeItem subscribeItem = new SubscribeItem(computableModels.get(0).getOid());
            subscribeItemList.add(subscribeItem);

        }
        for (int j = 0; j < subscribeItemList.size(); j++) {
            SubscribeItem subscribeItem = subscribeItemList.get(j);

            JSONObject statistics = statisticsService.getStatisticsInfo(subscribeItem, j, imageList, 90);

            String pdfPath = statisticsService.generatePDF(statistics);
            statistics.put("pdfPath", htmlLoadPath + pdfPath);

            result.add(statistics);

        }

        ctx.setVariable("modelList", result);

        String mail = templateEngine.process("modelStatisticsEmail.html", ctx);
        return mail;
    }


    public void sendEmailToUser(String uid, String email) {
        List<User> userList = userDao.findAll();
//        for(int u=0;u<userList.size();u++) {

        User user = userDao.findFirstByOid(uid);
        String userEmail = user.getEmail();
//            if(!user.getSubscribe()){
//                continue;
//            }
        String[] contributeUser={"yue@lreis.ac.cn","xinyue.ye@njit.edu","yuanwpcn@126.com","guofei@njnu.edu.cn"};
        boolean isOwnModel = true;
        for(int i=0;i<contributeUser.length;i++){
            if(userEmail.equals(contributeUser[i])){
                isOwnModel = false;
            }
        }
        int modelCount = user.getModelItems()+user.getComputableModels()+user.getLogicalModels()+user.getConceptualModels();
        int contributionCount = modelCount + user.getDataItems() + user.getConcepts() + user.getSpatials() + user.getTemplates() + user.getUnits() + user.getThemes();

        String subject = "Dear Dr. " + user.getName() + ", Quarterly Statistic Report for Your ";
        String type = "";
        if(!isOwnModel){
            type += "Contribution";
            if(contributionCount>0){
                type += "s";
            }
        }else{
            type += "Model";
            if(modelCount>0){
                type+="s";
            }
        }

        subject += type + " in OpenGMS";

        if (user.getSubscribeItemList().size() > 0 || (user.getModelItems() == 1 && user.getComputableModels() == 1)) {
            JSONArray imageList = new JSONArray();
            commonService.sendEmailWithImg("OpenGMS Team", email, subject, generateHtmlStr(user, imageList, type), imageList);

        } else if (user.getModelItems() > 0 || user.getDataItems() > 0 || user.getConceptualModels() > 0 || user.getLogicalModels() > 0 ||
                user.getComputableModels() > 0 || user.getConcepts() > 0 || user.getSpatials() > 0 || user.getTemplates() > 0 ||
                user.getUnits() > 0 || user.getThemes() > 0) {
            String message = "";
            message += "<div style=\"font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 微软雅黑, Arial, sans-serif;\">" +
                    "        <div style=\"height:60px;background-color:#080a0e;border-radius: 5px;display: flex;align-items: center;justify-content: center;min-width:600px\">\n" +
                    "<a class=\"header\"  href=\"https://geomodeling.njnu.edu.cn\">\n" +
                    "            <img src=\"https://geomodeling.njnu.edu.cn/static/img/logo.png\" style=\"height: 50px;\">\n" +
                    "    </a>" +
                    "            <span style=\"color: white;font-size: 26px;margin:20px 0 0 10px;font-weight: bold;\">Statistic Report</span>\n" +
                    "        </div>\n";

            message += "<div style='width:600px; margin:auto'>";
//                message += "<div style=\"background-color: #ecf5ff;\n" +
//                        "    padding: 15px;\n" +
//                        "    margin: 30px 0 25px 0;\n" +
//                        "    line-height: 25px;\n" +
//                        "    font-size: 16px;\n" +
//                        "    color: #409eff;\n" +
//                        "    border: 1px solid #d9ecff;\n" +
//                        "    border-radius: 4px;\n" +
//                        "    box-sizing: border-box;\n" +
//                        "   \">\n" +
//                        "            <b>Open Geographic Modeling and Simulation Platform (OpenGMS)</b> supports sharing geographic resources and provides a community for collaboration works among researchers in various disciplines.\n" +
//                        "            There are more than 3500 geographic models in our platform.\n" +
//                        "            We are the founder of Open Modeling Alliance, and have been added to the Trusted Digital Repositories for Software of CoMSES Net.\n" +
//                        "\n" +
//                        "        </div>";
            message += "<p style='margin-top:50px'>Dear Dr. ";
            message += user.getName() + ":<br/><br/>";
            Date now = new Date();
            Date registerTime = user.getCreateTime();
            int rangeDay = (int) Math.ceil((now.getTime() - registerTime.getTime()) / (1000 * 3600 * 24));
            int total = 0;
            JSONArray imageList = new JSONArray();
//                message += "It has been " + rangeDay + " days since you registered as a user of OpenGMS. ";

            message += "Thanks for your contribution to OpenGMS! With your help, ";
            List<String> stringList = new ArrayList<>();
            JSONArray items = new JSONArray();

            //图片列表
            imageList = new JSONArray();


            List<DailyViewCount> sevenDayViewCountList = new ArrayList<>();
            Calendar calendar = Calendar.getInstance();
            for (int i = -6; i <= 0; i++) {
                calendar.setTime(now);
                calendar.add(Calendar.DATE, i);
                DailyViewCount dailyViewCount = new DailyViewCount(calendar.getTime(), 0);
                sevenDayViewCountList.add(dailyViewCount);
            }

            List<Integer> countList = new ArrayList<>();
            List<String> nameList = new ArrayList<>();

            addItem(countList, nameList, sevenDayViewCountList, user.getModelItems(), "model item", user.getUserName(), stringList, items);
            addItem(countList, nameList, sevenDayViewCountList, user.getConceptualModels(), "conceptual model", user.getUserName(), stringList, items);
            addItem(countList, nameList, sevenDayViewCountList, user.getLogicalModels(), "logical model", user.getUserName(), stringList, items);
            addItem(countList, nameList, sevenDayViewCountList, user.getComputableModels(), "computable model", user.getUserName(), stringList, items);
            addItem(countList, nameList, sevenDayViewCountList, user.getDataItems(), "data item", user.getOid(), stringList, items);
            addItem(countList, nameList, sevenDayViewCountList, user.getConcepts(), "concept", user.getUserName(), stringList, items);
            addItem(countList, nameList, sevenDayViewCountList, user.getSpatials(), "spatial reference", user.getUserName(), stringList, items);
            addItem(countList, nameList, sevenDayViewCountList, user.getTemplates(), "data template", user.getUserName(), stringList, items);
            addItem(countList, nameList, sevenDayViewCountList, user.getUnits(), "unit & metric", user.getUserName(), stringList, items);
            addItem(countList, nameList, sevenDayViewCountList, user.getThemes(), "theme", user.getUserName(), stringList, items);
            if (user.getModelItems() == 1 && user.getComputableModels() == 0) {
                Item modelItem = modelItemDao.findAllByAuthor(user.getUserName()).get(0);
                message += modelItem.getName() + " has been collected in OpenGMS up to now, here is the report of the latest quarter:<br/>";
            } else {
                for (int i = 0; i < stringList.size(); i++) {
                    message += stringList.get(i);
                    if (i < stringList.size() - 2) {
                        message += ", ";
                    } else if (i == stringList.size() - 2) {
                        message += " and ";
                    } else {
                        message += " ";
                    }
                }
                message += "have been collected in OpenGMS up to now, here is the report of the latest quarter:<br/>";
            }

            for (int i = 0; i < items.size(); i++) {
                for (int j = 0; j < items.size() - 1 - i; j++) {
                    JSONObject item = new JSONObject();
                    JSONObject item1 = new JSONObject();

                    item.put("name", items.getJSONObject(j).getString("name"));
                    item.put("view count", items.getJSONObject(j).getString("view count"));
                    item.put("type", items.getJSONObject(j).getString("type"));
                    item.put("oid", items.getJSONObject(j).getString("oid"));

                    item1.put("name", items.getJSONObject(j + 1).getString("name"));
                    item1.put("view count", items.getJSONObject(j + 1).getString("view count"));
                    item1.put("type", items.getJSONObject(j + 1).getString("type"));
                    item1.put("oid", items.getJSONObject(j + 1).getString("oid"));


                    if (item1.getInteger("view count") > item.getInteger("view count")) {
                        items.set(j, item1);
                        items.set(j + 1, item);
                    }
                }

                total += items.getJSONObject(items.size() - 1 - i).getInteger("view count");
            }

//                    //饼图
//                    ChartOption pieOption = new ChartOption();
//                    String[] pieTypes = new String[countList.size()];
//                    int[][] ints = new int[1][countList.size()];
//                    for (int i = 0; i < countList.size(); i++) {
//                        pieTypes[i] = nameList.get(i);
//                        ints[0][i] = countList.get(i);
//                    }
//                    pieOption.setTitle("Resource Type Statistics");
//                    pieOption.setSubTitle("");
//                    pieOption.setData(ints);
//                    pieOption.setTypes(pieTypes);
//                    pieOption.setValXis(pieTypes);
//                    pieOption.setTitlePosition("center");
//
//                    String piePath = ChartUtils.generatePie(pieOption,"55%","50%","50%","top");


            message += "<h3 style='margin-top:2em'>Total view times in the latest quarter: " + total + "</h3><hr/>";

            //柱状图
            ChartOption chartOption = new ChartOption();
            chartOption.setTitle("Most Viewed Resources in the Latest Quarter");
            chartOption.setSubTitle("");
            chartOption.setTitlePosition("center");
            int size = 0;
            if (items.size() >= 5) {
                size = 5;
            } else {
                size = items.size();
            }
            if (size > 1) {
                String[] types = new String[size];
                int[][] data = new int[1][size];
                for (int i = 0; i < types.length; i++) {
                    String itemName = items.getJSONObject(i).getString("name");
                    types[i] = itemName.length() > 16 ? (itemName.substring(0, 14) + "...") : itemName;
                    data[0][i] = items.getJSONObject(i).getInteger("view count");
                }
                chartOption.setTypes(types);
                chartOption.setData(data);
                chartOption.setValXis(types);
                String chartPath = ChartUtils.generateBar(chartOption, 2);

                JSONObject imageInfo = new JSONObject();
                imageInfo.put("name", "chart1");
                imageInfo.put("path", chartPath);
                imageList.add(imageInfo);
                message += "<center><img style='height:360px' src=\"cid:chart1\" ></center><br/>";
            }

            Calendar c = Calendar.getInstance();//动态时间
            c.setTime(now);
            c.add(Calendar.DATE, -90);
            Date startTime = c.getTime();

            List<String> itemOids = new ArrayList<>();
            for (int i = 0; i < items.size(); i++) {
                itemOids.add(items.getJSONObject(i).getString("oid"));
            }
            List<ViewRecord> viewRecordList = viewRecordDao.findAllByItemOidInAndDateGreaterThanEqual(itemOids, startTime);

            JSONArray viewMap = statisticsService.locationsOfViewers(viewRecordList);
            //饼图
            Boolean pieChartHidden = false;//map.size()<=1;

            if (!pieChartHidden) {
                String[] pieTypes = new String[viewMap.size()];
                int[][] pieData = new int[1][viewMap.size()];

                for (int i = 0; i < viewMap.size(); i++) {
                    JSONObject object = viewMap.getJSONObject(i);
                    pieTypes[i] = object.getString("name");
                    pieData[0][i] = object.getInteger("value");
                }


                ChartOption pieOption = new ChartOption();
                pieOption.setTitle("Viewers' Location in the Latest Quarter");
                pieOption.setSubTitle("");
                pieOption.setData(pieData);
                pieOption.setTypes(pieTypes);
                pieOption.setValXis(pieTypes);
                pieOption.setTitlePosition("center");

                String pieChartPath = ChartUtils.generatePie(pieOption, "55%", "50%", "50%", "5%", 1000, 600, 24, 16);

                JSONObject pieChartInfo = new JSONObject();
                pieChartInfo.put("name", "pieChart1");
                pieChartInfo.put("path", pieChartPath);

                imageList.add(pieChartInfo);
                message += "<center><img style='height:360px' src=\"cid:pieChart1\" ></center><br/>";
            }


            //invoke
            Sort sort = new Sort(Sort.Direction.DESC, "invokeCount");
            Pageable pageable = PageRequest.of(0, 9999, sort);
            Page<ComputableModel> computableModels = computableModelDao.findByAuthor(user.getUserName(), pageable);
            List<ComputableModel> computableModelList = computableModels.getContent();

//                    int invokeTotal = 0;
//                    for(int i=0;i<computableModelList.size();i++){
//                        invokeTotal+=computableModelList.get(i).getInvokeCount();
//                    }
            if (computableModelList.size() > 0) {
                List<String> computableOids = new ArrayList<>();
                for (int i = 0; i < computableModelList.size(); i++) {
                    String computableId = computableModelList.get(i).getOid();
                    computableOids.add(computableId);
                    List<Task> tasks = taskDao.findAllByComputableIdAndRunTimeGreaterThanEqual(computableId, startTime);
                    computableModelList.get(i).setInvokeCount(tasks.size());
                }

                for(int i = 0;i<computableModelList.size();i++){
                    for (int j = 0; j < computableModelList.size() - 1 - i; j++) {
                        ComputableModel computableModel1 = computableModelList.get(j);
                        ComputableModel computableModel2 = computableModelList.get(j+1);
                        String name1 = computableModel1.getName();
                        int invoke1 = computableModel1.getInvokeCount();
                        String name2 = computableModel2.getName();
                        int invoke2 = computableModel2.getInvokeCount();

                        if(invoke1>invoke2){
                            computableModel2.setName(name1);
                            computableModel2.setInvokeCount(invoke1);
                            computableModel1.setName(name2);
                            computableModel1.setInvokeCount(invoke2);
                        }

                    }
                }


                List<Task> taskList = taskDao.findAllByComputableIdInAndRunTimeGreaterThanEqual(computableOids, startTime);

                message += "<h3 style='margin-top:2em'>Total invoke times in the latest quarter: " + taskList.size() + "</h3><hr/>";

                //柱状图
                chartOption = new ChartOption();
                chartOption.setTitle("Most Invoked Computable Models in the Latest Quarter");
                chartOption.setSubTitle("");
                chartOption.setTitlePosition("center");
                size = 0;
                if (computableModelList.size() >= 5) {
                    size = 5;
                } else {
                    size = computableModelList.size();
                }
                if (size > 1) {
                    String[] types = new String[size];
                    int[][] data = new int[1][size];
                    for (int i = 0; i < types.length; i++) {
                        ComputableModel computableModel = computableModelList.get(computableModelList.size()-1-i);
                        String itemName = computableModel.getName();
                        types[i] = itemName.length() > 16 ? (itemName.substring(0, 14) + "...") : itemName;
                        data[0][i] = computableModel.getInvokeCount();
                    }
                    chartOption.setTypes(types);
                    chartOption.setData(data);
                    chartOption.setValXis(types);
                    String invokeChartPath = ChartUtils.generateBar(chartOption, 2);


                    JSONObject invokeImageInfo = new JSONObject();
                    invokeImageInfo.put("name", "chart2");
                    invokeImageInfo.put("path", invokeChartPath);
                    imageList.add(invokeImageInfo);
                    message += "<center><img style='height:360px' src=\"cid:chart2\" ></center><br/>";
                }


                JSONArray map = statisticsService.locationsOfInvokers(taskList);

                //饼图
                Boolean pieChart2Hidden = false;//map.size()<=1;

                if (!pieChart2Hidden) {
                    String[] pieTypes = new String[map.size()];
                    int[][] pieData = new int[1][map.size()];

                    for (int i = 0; i < map.size(); i++) {
                        JSONObject object = map.getJSONObject(i);
                        pieTypes[i] = object.getString("name");
                        pieData[0][i] = object.getInteger("value");
                    }


                    ChartOption pieOption = new ChartOption();
                    pieOption.setTitle("Invokes' Location in the Latest Quarter");
                    pieOption.setSubTitle("");
                    pieOption.setData(pieData);
                    pieOption.setTypes(pieTypes);
                    pieOption.setValXis(pieTypes);
                    pieOption.setTitlePosition("center");

                    String pieChart2Path = ChartUtils.generatePie(pieOption, "55%", "50%", "50%", "5%", 1000, 600, 24, 16);

                    JSONObject pieChart2Info = new JSONObject();
                    pieChart2Info.put("name", "pieChart2");
                    pieChart2Info.put("path", pieChart2Path);

                    imageList.add(pieChart2Info);
                    message += "<center><img style='height:360px' src=\"cid:pieChart2\" ></center><br/>";
                }
            }


//                    //折线图
//                    ChartOption lineChart = new ChartOption();
//                    lineChart.setTitle("Daily view times in the last 7 days (UTC +08:00)");
//                    lineChart.setSubTitle("");
//                    lineChart.setTitlePosition("center");
//                    String[] dates = new String[7];
//                    int[][] viewCounts = new int[1][7];
//
//                    Boolean lineChartHidden = true;
//                    for (int i = 0; i < sevenDayViewCountList.size(); i++) {
//                        DailyViewCount dailyViewCount = sevenDayViewCountList.get(i);
//                        if (dailyViewCount.getCount() > 0) {
//                            lineChartHidden = false;
//                        }
//                        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
//                        dates[i] = sdf.format(dailyViewCount.getDate());
//                        viewCounts[0][i] = dailyViewCount.getCount();
//                    }
//
//                    lineChart.setTypes(new String[]{"Daily view times"});
//                    lineChart.setData(viewCounts);
//                    lineChart.setValXis(dates);
//                    String lineChartPath = ChartUtils.generateLine(lineChart);


//                    if (nameList.size() > 1) {
//                        JSONObject pieChartInfo = new JSONObject();
//                        pieChartInfo.put("name", "pieChart");
//                        pieChartInfo.put("path", piePath);
//                        imageList.add(pieChartInfo);
//                        message += "<center><img style='height:360px' src=\"cid:pieChart\" ></center><br/>";
//                    }
//                    message += "Many people have noticed what you shared in OpenGMS, your contributions have been viewed and invoked " + total + " times. " +
//                            "The most influential item that you contributed is " + items.getJSONObject(0).getString("name") + ", it has been viewed " + items.getJSONObject(0).getInteger("view count") + " times. " +
//                            "The view times of your contributions are shown in the figure below:<br/><br/>";


//                    if (!lineChartHidden) {
//                        JSONObject lineChartInfo = new JSONObject();
//                        lineChartInfo.put("name", "lineChart");
//                        lineChartInfo.put("path", lineChartPath);
//                        imageList.add(lineChartInfo);
//                        message += "<center><img style='height:360px' src=\"cid:lineChart\" ></center><br/>";
//                    }


//                message += "If you want to know more about geographic modeling and simulation, welcome to OpenGMS (Open Geomodling Modeling and Simulation) which supports finding resources in geographic modeling and simulation and provides a community for collaboration works among researchers in various disciplines. Through the sharing and collaboration works, this platform contributes to building resource libraries, leaving them for the next generation, and ultimately advance in knowledge.<br/><br/>";
//
//                Sort sort = new Sort(Sort.Direction.DESC, "viewCount");
//                Pageable pageable = PageRequest.of(0, 999, sort);
//                Page<ComputableModelSimpleDTO> computableModelPage = computableModelDao.findAllByAuthorAndContentType(user.getUserName(), "Package", pageable);
//
//                List<ComputableModelSimpleDTO> computableModelList = new ArrayList<>();
//                for (ComputableModelSimpleDTO computableModel : computableModelPage) {
//                    if (computableModel.getDailyViewCount() != null && computableModel.getDailyViewCount().size() > 0) {
//                        computableModelList.add(computableModel);
//                        if (computableModelList.size() == 5) break;
//                    }
//                }

//                if (computableModelList.size() > 0) {
//                    message += "        <div style=\"background-color: #f4f4f5;\n" +
//                            "    padding: 15px;\n" +
//                            "    margin-bottom: 20px;\n" +
//                            "    line-height: 25px;\n" +
//                            "    font-size: 14px;\n" +
//                            "    color: #909399;\n" +
//                            "    border: 1px solid #e9e9eb;\n" +
//                            "    border-radius: 4px;\n" +
//                            "    box-sizing: border-box;\n" +
//                            "   \">\n" +
//                            "           <h3 style=\"margin-top:10px;margin:auto\">More Computable Model Statistics</h3>\n" +
//                            "            <ul>\n";
//                    for (ComputableModelSimpleDTO computableModel : computableModelList) {
//                        message += "<li><a href=\"https://geomodeling.njnu.edu.cn/statistics/computableModel/" + computableModel.getOid() + "\">" + computableModel.getName() + "</a></li>\n";
//                    }
//                    message += "            </ul>\n" +
//                            "        </div>";
//                }

            message += "<br/>Please visit your <a href=\"https://geomodeling.njnu.edu.cn/user/changeSubscribedModelList?id=" + user.getId() + "\">User Space</a> to view more models' statistics information or custom subscribed model list.<br/><br/>";

            message += "Sincerely,<br/>";
            message += "OpenGMS Team<br/>";
            message += "https://geomodeling.njnu.edu.cn</p>";
            message += "<br/>";
            message += "</div>";
            message += " <div style=\"background-color:#2e3033;color:white;border-radius: 5px;min-width:600px;text-align: center\">\n" +
                    "        <h3 style=\"margin:0 auto;padding: 2em 2.2em 0.3em 2.2em;font-style: italic;font-weight: 400;text-align: left;width:600px\">OpenGMS is a platform that<br/>\n" +
                    "            <span style=\"margin-right:10px;\">•</span>supports open web-distributed integrated modelling and simulation;<br/>\n" +
                    "            <span style=\"margin-right:10px;\">•</span>supports sharing of 3500+ model resources and 20000+ data resources;<br/>\n" +
                    "            <span style=\"margin-right:10px;\">•</span>is recommended by well-known organizations and communities (e.g., CoMSES Net, CSDMS, OMF, OpenMI).</h3>\n" +
                    "        <hr style=\"width:600px;margin:15px auto\"/>\n" +
                    "        <h4 style=\"margin-bottom:10px;font-weight: 400;\">Copyright © 2013-2020 OpenGMS. All Rights Reserved.</h4>" +
                    "        <h4 style=\"margin:0;padding-bottom:3em;font-weight: 400\">You can <a style=\"color:#0097e2;\" href=\"https://geomodeling.njnu.edu.cn/user/changeSubscribedModelList?id=" + user.getId() + "\">custom subscribed model list</a>, or <a style=\"color:#0097e2;\" href=\"https://geomodeling.njnu.edu.cn/user/unsubscribe?id=" + user.getId() + "\" target=\"_blank\">unsubscribe</a> this report. </h4>\n" +
                    "    </div></div>";
            commonService.sendEmailWithImg("OpenGMS Team", email, subject, message, imageList);
        }
//        }
    }


    public void sendEmailToAuthorship() {
        List<Authorship> authorshipList = authorshipDao.findAll();
        for (int a = 0; a < authorshipList.size(); a++) {
            Authorship authorship = authorshipList.get(a);
            if (!authorship.getSubscribe() || authorship.getEmail().trim().equals("")) {
                continue;
            }
            String message = "<p style='font-family: sans-serif;'>Dear ";
            message += authorship.getName() + ":<br/><br/>";
            message += "<p>We have many geographic models of you in our platform, <a href='https://geomodeling.njnu.edu.cn'>OpenGMS</a>, including ";


            int[] typesCounts = new int[10];
            Item[] top5Items = new Item[5];
            List<DailyViewCount> sevenDayViewCountList = new ArrayList<>();
            Calendar calendar = Calendar.getInstance();
            for (int i = -6; i <= 0; i++) {
                calendar.setTime(new Date());
                calendar.add(Calendar.DATE, i);
                DailyViewCount dailyViewCount = new DailyViewCount(calendar.getTime(), 0);
                sevenDayViewCountList.add(dailyViewCount);
            }
            ItemTypeEnum[] typeEnums = ItemTypeEnum.values();///////////

            int totalViewCount = 0;
            for (ItemInfo itemInfo : authorship.getItems()) {
                for (int i = 0; i < typeEnums.length; i++) {
                    if (itemInfo.getType() == typeEnums[i]) {
                        Item item = findItemByItemTypeEnum(itemInfo.getType(), itemInfo.getOid());
                        if (item == null) {
                            System.out.println(authorship.getName());
                            break;
                        }
                        //各类型计数
                        typesCounts[i]++;
                        totalViewCount += item.getViewCount();
                        if (itemInfo.getType() == ItemTypeEnum.ComputableModel) {
                            ComputableModel computableModel = computableModelDao.findFirstByOid(itemInfo.getOid());
                            totalViewCount += computableModel.getInvokeCount();
                        }
                        //选出浏览量前五的条目
                        if (top5Items[0] == null) {
                            top5Items[0] = item;
                        } else {
                            for (int it = 0; it < 5; it++) {
                                Item topItem = top5Items[it];
                                if (topItem != null) {
                                    if (item.getViewCount() > topItem.getViewCount()) {
                                        for (int j = top5Items.length - 2; j >= it; j--) {
                                            top5Items[j + 1] = top5Items[j];
                                        }
                                        top5Items[it] = item;
                                        break;
                                    }
                                } else {
                                    top5Items[it] = item;
                                    break;
                                }
                            }
                        }
                        //统计7天内所有条目每天访问量综合
                        sevenDailyViewCount(item.getDailyViewCount(), sevenDayViewCountList);

                    }
                }
            }

            List<Integer> countList = new ArrayList<>();
            List<String> nameList = new ArrayList<>();

            for (int p = 0; p < typeEnums.length; p++) {
                if (typesCounts[p] > 0) {
                    countList.add(typesCounts[p]);
                    nameList.add(ItemTypeEnum.getItemTypeByNum(p).getText());

                }
            }

            if (countList.size() == 0) {
                continue;
            }

            for (int i = 0; i < countList.size(); i++) {
                message += countList.get(i) + " " + nameList.get(i);
                if (countList.get(i) > 1) {
                    message += "s";
                }
                if (i == countList.size() - 2) {
                    message += " and ";
                } else if (i == countList.size() - 1) {
                    message += ". ";
                } else {
                    message += ", ";
                }
            }


            //饼图
            Boolean pieChartHidden = true;
            if (nameList.size() > 1) {
                pieChartHidden = false;
            }
            ChartOption pieOption = new ChartOption();
            String[] pieTypes = new String[countList.size()];
            int[][] ints = new int[1][countList.size()];
            for (int i = 0; i < countList.size(); i++) {
                pieTypes[i] = nameList.get(i);
                ints[0][i] = countList.get(i);
            }
            pieOption.setTitle("Type Statistics");
            pieOption.setSubTitle("");
            pieOption.setData(ints);
            pieOption.setTypes(pieTypes);
            pieOption.setValXis(pieTypes);
            pieOption.setTitlePosition("center");

            String piePath = ChartUtils.generatePie(pieOption, "55%", "50%", "50%", "top", 1000, 600, 24, 16);

            //柱状图
            ChartOption chartOption = new ChartOption();
            chartOption.setTitle("Page View Statistics");
            chartOption.setSubTitle("Go to OpenGMS to check more daily page view of your contributions");
            chartOption.setTitlePosition("center");

            int top = 0;
            for (int i = 0; i < 5; i++) {
                if (top5Items[i] != null) {
                    top++;
                }
            }

            String[] types = new String[top];
            int[][] barData = new int[1][top];
            for (int i = 0; i < top; i++) {
                String itemName = top5Items[i].getName();
                types[i] = itemName.length() > 16 ? (itemName.substring(0, 14) + "...") : itemName;
                barData[0][i] = top5Items[i].getViewCount();
            }

            chartOption.setTypes(types);
            chartOption.setData(barData);
            chartOption.setValXis(types);
            String chartPath = ChartUtils.generateBar(chartOption, 2);

            //折线图
            ChartOption lineChart = new ChartOption();
            lineChart.setTitle("Daily page views in the last 7 days");
            lineChart.setSubTitle("");
            lineChart.setTitlePosition("left");
            String[] dates = new String[7];
            int[][] viewCounts = new int[1][7];

            Boolean lineChartHidden = true;
            for (int i = 0; i < sevenDayViewCountList.size(); i++) {
                DailyViewCount dailyViewCount = sevenDayViewCountList.get(i);
                if (dailyViewCount.getCount() > 0) {
                    lineChartHidden = false;
                }
                SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
                dates[i] = sdf.format(dailyViewCount.getDate());
                viewCounts[0][i] = dailyViewCount.getCount();

            }

            lineChart.setTypes(new String[]{"Daily page view"});
            lineChart.setData(viewCounts);
            lineChart.setValXis(dates);
            String lineChartPath = ChartUtils.generateLine(lineChart);


            //图片列表
            JSONArray imageList;
            imageList = new JSONArray();

            if (!pieChartHidden) {
                JSONObject pieChartInfo = new JSONObject();
                pieChartInfo.put("name", "pieChart");
                pieChartInfo.put("path", piePath);
                imageList.add(pieChartInfo);
                message += "<center><a href='https://geomodeling.njnu.edu.cn'><img style='height:360px' src=\"cid:pieChart\" ></a></center><br/>";
            }
            message += "Many people have noticed your works in OpenGMS, your works have been viewed and invoked " + totalViewCount + " times. " +
                    "The most influential work of you in our platform is " + top5Items[0].getName() + ", it has been viewed " + top5Items[0].getViewCount() + " times. " +
                    "The page view of your works are shown in the figure below:<br/><br/>";
            JSONObject imageInfo = new JSONObject();
            imageInfo.put("name", "chart1");
            imageInfo.put("path", chartPath);
            imageList.add(imageInfo);
            message += "<center><a href='https://geomodeling.njnu.edu.cn'><img style='height:360px' src=\"cid:chart1\" ></a></center><br/>";

            if (!lineChartHidden) {
                JSONObject lineChartInfo = new JSONObject();
                lineChartInfo.put("name", "lineChart");
                lineChartInfo.put("path", lineChartPath);
                imageList.add(lineChartInfo);
                message += "<center><a href='https://geomodeling.njnu.edu.cn'><img style='height:360px' src=\"cid:lineChart\" ></a></center><br/>";
            }

            message += "If you want to know more about geographic modeling and simulation, welcome to OpenGMS (Open Geomodling Modeling and Simulation) which supports finding resources in geographic modeling and simulation and provides a community for collaboration works among researchers in various disciplines. Through the sharing and collaboration works, this platform contributes to building resource libraries, leaving them for the next generation, and ultimately advance in knowledge.<br/><br/>";
            message += "Sincerely,<br/>";
            message += "OpenGMS Team<br/>";
            message += "https://geomodeling.njnu.edu.cn</p>";
            message += "<hr/>";
            message += "<p>To unsubscribe from this notice, go to <a href=\"https://geomodeling.njnu.edu.cn/authorship/unsubscribe?id=" + authorship.getId() + "\" target=\"_blank\">Unsubscribe</a>. </p>";

            commonService.sendEmailWithImg("OpenGMS Team", "921485453@qq.com", "Open Geographic Modeling and Simulation Review", message, imageList);

        }
    }

    private void addItem(List<Integer> countList, List<String> nameList, List<DailyViewCount> sevenDayViewCountList, int count, String type, String author, List<String> StringList, JSONArray items) {
        Calendar c = Calendar.getInstance();//动态时间
        c.setTime(new Date());
        c.add(Calendar.DATE,-90);
        Date startTime = c.getTime();

        if (count > 0) {

            countList.add(count);
            nameList.add(type);

            String str = count + " " + type;
            if (count > 1) {
                str += "s";
            }
            StringList.add(str);

            List<Item> itemList = new ArrayList<>();
            ItemTypeEnum itemType = null;
            switch (type) {
                case "model item":
                    itemList = modelItemDao.findAllByAuthor(author);
                    itemType = ItemTypeEnum.ModelItem;
                    break;
                case "conceptual model":
                    itemList = conceptualModelDao.findAllByAuthor(author);
                    itemType = ItemTypeEnum.ConceptualModel;
                    break;
                case "logical model":
                    itemList = logicalModelDao.findByAuthor(author);
                    itemType = ItemTypeEnum.LogicalModel;
                    break;
                case "computable model":
                    itemList = computableModelDao.findAllByAuthor(author);
                    itemType = ItemTypeEnum.ComputableModel;
                    break;
                case "data item":
                    itemList = dataItemDao.findAllByAuthor(author);
                    itemType = ItemTypeEnum.DataItem;
                    break;
                case "concept":
                    itemList = conceptDao.findByAuthor(author);
                    itemType = ItemTypeEnum.Concept;
                    break;
                case "spatial reference":
                    itemList = spatialReferenceDao.findByAuthor(author);
                    itemType = ItemTypeEnum.SpatialReference;
                    break;
                case "data template":
                    itemList = templateDao.findByAuthor(author);
                    itemType = ItemTypeEnum.Template;
                    break;
                case "unit & metric":
                    itemList = unitDao.findByAuthor(author);
                    itemType = ItemTypeEnum.Unit;
                    break;


            }
            for (Item item : itemList) {
                JSONObject jsonObject = new JSONObject();
                jsonObject.put("name", item.getName());
                List<ViewRecord> viewRecordList = viewRecordDao.findAllByItemOidAndItemTypeAndDateGreaterThanEqual(item.getOid(),itemType,startTime);
                jsonObject.put("view count", viewRecordList.size());
                jsonObject.put("type", type);
                jsonObject.put("oid", item.getOid());
                items.add(jsonObject);

                List<DailyViewCount> dailyViewCountList = item.getDailyViewCount();

                sevenDailyViewCount(dailyViewCountList, sevenDayViewCountList);

            }
        }
    }

    void sevenDailyViewCount(List<DailyViewCount> dailyViewCountList, List<DailyViewCount> sevenDayViewCountList) {
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


    public String resetPassword(String email) {
        try {
            Random random = new Random();
            String password = "";
            for (int i = 0; i < 8; i++) {
                int num = random.nextInt(62);
                if (num >= 0 && num < 10) {
                    password += num;
                } else if (num >= 10 && num < 36) {
                    num -= 10;
                    num += 65;
                    char c = (char) num;
                    password += c;
                } else {
                    num -= 36;
                    num += 97;
                    char c = (char) num;
                    password += c;
                }
            }

            User user = userDao.findFirstByEmail(email);
            if (user != null) {
                user.setPassword(DigestUtils.md5DigestAsHex(password.getBytes()));
                userDao.save(user);
                String subject = "OpenGMS Portal Password Reset";
                String content = "Hello " + user.getName() + ":<br/>" +
                        "Your password has been reset to <b>" + password + "</b>. You can change the password after logging in.<br/>" +
                        "Welcome to <a href='https://geomodeling.njnu.edu.cn' target='_blank'>OpenGMS</a> !";

                Boolean flag = commonService.sendEmail(email, subject, content);
                if (flag) {

                    return "suc";
                } else {
                    return "send fail";
                }
            } else {
                return "no user";
            }

        } catch (Exception e) {
            return "error";
        }
    }

    //++
    public void modelItemPlusPlus(String userName) {
        User user = userDao.findFirstByUserName(userName);
        int count = user.getModelItems();
        user.setModelItems(++count);
        userDao.save(user);
    }

    public void dataItemPlusPlus(String userName) {
        User user = userDao.findFirstByUserName(userName);
        int count = user.getDataItems();
        user.setDataItems(++count);
        userDao.save(user);
    }

    public void conceptualModelPlusPlus(String userName) {
        User user = userDao.findFirstByUserName(userName);
        int count = user.getConceptualModels();
        user.setConceptualModels(++count);
        userDao.save(user);
    }

    public void logicalModelPlusPlus(String userName) {
        User user = userDao.findFirstByUserName(userName);
        int count = user.getLogicalModels();
        user.setLogicalModels(++count);
        userDao.save(user);
    }

    public void computableModelPlusPlus(String userName) {
        User user = userDao.findFirstByUserName(userName);
        int count = user.getComputableModels();
        user.setComputableModels(++count);
        userDao.save(user);
    }

    public void conceptPlusPlus(String userName) {
        User user = userDao.findFirstByUserName(userName);
        int count = user.getConcepts();
        user.setConcepts(++count);
        userDao.save(user);
    }

    public void themePlusPlus(String username) {
        User user = userDao.findFirstByUserName(username);
        int count = user.getThemes();
        user.setThemes(++count);
        userDao.save(user);
    }

    public void spatialPlusPlus(String userName) {
        User user = userDao.findFirstByUserName(userName);
        int count = user.getSpatials();
        user.setSpatials(++count);
        userDao.save(user);
    }

    public void templatePlusPlus(String userName) {
        User user = userDao.findFirstByUserName(userName);
        int count = user.getTemplates();
        user.setTemplates(++count);
        userDao.save(user);
    }

    public void unitPlusPlus(String userName) {
        User user = userDao.findFirstByUserName(userName);
        int count = user.getUnits();
        user.setUnits(++count);
        userDao.save(user);
    }

    public void messageNumPlusPlus(String username) {
        User user = userDao.findFirstByUserName(username);
        int count = user.getMessageNum();
        user.setMessageNum(++count);
        userDao.save(user);
    }

    public void commentNumMinus(String username, int comment_num) {
        User user = userDao.findFirstByUserName(username);
        int count = user.getMessageNum();
        count = count - comment_num;
        user.setMessageNum(count);
        userDao.save(user);
    }

    public void myEditionNumMinus(String username, int my_edition_num) {
        User user = userDao.findFirstByUserName(username);
        int count = user.getMessageNum();
        count = count - my_edition_num;
        user.setMessageNum(count);
        userDao.save(user);
    }


    //--
    public void modelItemMinusMinus(String userName) {
        User user = userDao.findFirstByUserName(userName);
        int count = user.getModelItems();
        user.setModelItems(--count);
        userDao.save(user);
    }

    public void dataItemMinusMinus(String userName) {
        User user = userDao.findFirstByUserName(userName);
        int count = user.getDataItems();
        user.setDataItems(--count);
        userDao.save(user);
    }

    public void conceptualModelMinusMinus(String userName) {
        User user = userDao.findFirstByUserName(userName);
        int count = user.getConceptualModels();
        user.setConceptualModels(--count);
        userDao.save(user);
    }

    public void logicalModelMinusMinus(String userName) {
        User user = userDao.findFirstByUserName(userName);
        int count = user.getLogicalModels();
        user.setLogicalModels(--count);
        userDao.save(user);
    }

    public void computableModelMinusMinus(String userName) {
        User user = userDao.findFirstByUserName(userName);
        int count = user.getComputableModels();
        user.setComputableModels(--count);
        userDao.save(user);
    }

    public void conceptMinusMinus(String userName) {
        User user = userDao.findFirstByUserName(userName);
        int count = user.getConcepts();
        user.setConcepts(--count);
        userDao.save(user);
    }

    public void spatialMinusMinus(String userName) {
        User user = userDao.findFirstByUserName(userName);
        int count = user.getSpatials();
        user.setSpatials(--count);
        userDao.save(user);
    }

    public void templateMinusMinus(String userName) {
        User user = userDao.findFirstByUserName(userName);
        int count = user.getTemplates();
        user.setTemplates(--count);
        userDao.save(user);
    }

    public void unitMinusMinus(String userName) {
        User user = userDao.findFirstByUserName(userName);
        int count = user.getUnits();
        user.setUnits(--count);
        userDao.save(user);
    }

    public void articleMinusMinus(String userOid, String articleOid) {
        User user = userDao.findFirstByOid(userOid);
        int count = user.getArticlesCount();
        user.setArticlesCount(--count);
        List<String> articles = user.getArticles();
        Iterator ite = articles.iterator();
        while (ite.hasNext()) {
            if (ite.next().equals(articleOid))
                ite.remove();
        }
        user.setArticles(articles);
        userDao.save(user);
    }

    public void projectItemMinusMinus(String userName) {
        User user = userDao.findFirstByUserName(userName);
        int count = user.getProjectsCount();
        user.setProjectsCount(--count);
        userDao.save(user);
    }

    public void conferenceItemMinusMinus(String userName) {
        User user = userDao.findFirstByUserName(userName);
        int count = user.getConferencesCount();
        user.setConferencesCount(--count);
        userDao.save(user);
    }

    public void themeItemMinusMinus(String userName) {
        User user = userDao.findFirstByUserName(userName);
        int count = user.getThemes();
        user.setThemes(--count);
        userDao.save(user);
    }

    public void messageNumMinusMinus(String username) {
        User user = userDao.findFirstByUserName(username);
        int count = user.getMessageNum();
        user.setMessageNum(--count);
        userDao.save(user);
    }

    //    public String getAuthorUserName(String authorName){
//        String authorUserName = "";
//        List<User> users = userDao.findAll();
//        for (int i=0;i<users.size();i++){
//            if (authorName.equals(users.get(i).getName())){
//                authorUserName = users.get(i).getUserName();
//                break;
//            }
//        }
//        return authorUserName;
//    }
    public User getByUid(String userName) {
        try {
            return userDao.findFirstByUserName(userName);
        } catch (Exception e) {
            System.out.println("有人乱查数据库！！该UID不存在User对象");
            throw new MyException(ResultEnum.NO_OBJECT);
        }
    }

    public User getById(String id) {
        try {
            return userDao.findFirstById(id);
        } catch (Exception e) {
            System.out.println("有人乱查数据库！！该OID不存在User对象");
            throw new MyException(ResultEnum.NO_OBJECT);
        }
    }

    public User getByOid(String id) {
        try {
            return userDao.findFirstByOid(id);
        } catch (Exception e) {
            System.out.println("有人乱查数据库！！该OID不存在User对象");
            throw new MyException(ResultEnum.NO_OBJECT);
        }
    }

    public int addUser(UserAddDTO user) {

        User u = userDao.findFirstByUserName(user.getUserName());
        if (u != null) {
            return -1;
        }
        u = userDao.findFirstByEmail(user.getEmail());
        if (u != null) {
            return -2;
        } else {
            User user1 = new User();
            BeanUtils.copyProperties(user, user1);
            user1.setOid(String.valueOf(userDao.findAll().size() + 1));
            user1.setCreateTime(new Date());
            List<String> orgs = new ArrayList<>();
            orgs.add(user.getOrg());
            user1.setOrganizations(orgs);
            user1.setImage("");
            user1.setDescription("");
            user1.setPhone("");
            user1.setWiki("");
            Affiliation affiliation = new Affiliation();
            user1.setAffiliation(affiliation);
            userDao.insert(user1);
            return 1;
        }
    }

    public int changePass(String oid, String oldPass, String newPass) {

        User user = userDao.findFirstByOid(oid);
        String old = user.getPassword();
        if (old.equals(oldPass)) {
            user.setPassword(newPass);
            userDao.save(user);
            return 1;
        } else {
            return -2;
        }

    }

    public int updateUser(UserUpdateDTO userUpdateDTO) {

        User user = userDao.findFirstByOid(userUpdateDTO.getOid());

        BeanUtils.copyProperties(userUpdateDTO, user);
        //判断是否为新图片
        String uploadImage = userUpdateDTO.getUploadImage();
        if (uploadImage.contains("base64")) {
            //删除旧图片
            File file = new File(resourcePath + user.getImage());
            if (file.exists() && file.isFile())
                file.delete();
            //添加新图片
            String path = "/user/" + UUID.randomUUID().toString() + ".jpg";
            String imgStr = uploadImage.split(",")[1];
            Utils.base64StrToImage(imgStr, resourcePath + path);
            user.setImage(path);
        }
        userDao.save(user);

        return 1;
    }

    public JSONObject validPassword(String account, String password, String ip) {

        User user = userDao.findFirstByEmail(account);
        if (user == null) {
            user = userDao.findFirstByUserName(account);
        }
        if (user != null) {
            if (ip != null && !ip.trim().equals("")) {
                SetLastLoginIp(user, ip);
            }
            if (user.getPassword().equals(password)) {

                JSONObject result = new JSONObject();
                result.put("name", user.getName());
                result.put("oid", user.getOid());
                result.put("uid", user.getUserName());
                return result;
            }
        }
        return null;
    }

    public void SetLastLoginIp(User user, String ip) {
        user.setLastLoginIp(ip);
        try {
            user.setGeoInfo(Utils.getGeoInfoMeta(ip));
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }
        userDao.save(user);
    }

    public String getImage(String oid) {
        String imgStr = userDao.findFirstByOid(oid).getImage();
        return imgStr.equals("") ? "" : htmlLoadPath + userDao.findFirstByOid(oid).getImage();
    }

    public JSONObject getUserSimpleInfo(String userName) {
        JSONObject result = new JSONObject();
        User user = userDao.findFirstByUserName(userName);
        result.put("oid", user.getOid());
        result.put("name", user.getName());
        result.put("org", user.getOrganizations().get(0));
        result.put("email", user.getEmail());
        result.put("homepage", user.getWiki());

        return result;

    }

    public JSONObject getUserInfo(String userId) {
        JSONObject result = new JSONObject();
        int success = taskDao.findAllByUserIdAndStatus(userId, 2).size();
        int calculating = taskDao.findAllByUserIdAndStatus(userId, 0).size();
        calculating += taskDao.findAllByUserIdAndStatus(userId, 1).size();
        int failed = taskDao.findAllByUserIdAndStatus(userId, -1).size();

        JSONObject taskStatistic = new JSONObject();
        taskStatistic.put("success", success);
        taskStatistic.put("fail", failed);
        taskStatistic.put("calculating", calculating);
        result.put("record", taskStatistic);


        result.put("userInfo", getUser(userId));
        return result;
    }

    public JSONObject getUserInfoByOid(String oid) {
        User user = userDao.findFirstByOid(oid);
        String userName = user.getUserName();
        JSONObject result = new JSONObject();
        result.put("userInfo", getUser(userName));
        return result;
    }

    public JSONObject loadUser(String oid){

        JSONObject userInfo = new JSONObject();
        JSONObject countInfo = new JSONObject();

        if (oid == null) {
            userInfo.put("oid", "");
            return userInfo;
        }

        User user = userDao.findFirstByOid(oid);

        userInfo.put("oid", user.getOid());
        userInfo.put("uid", user.getUserName());
        userInfo.put("name", user.getName());
        userInfo.put("image", getImage(user.getOid()));

        countInfo.put("modelItems",user.getModelItems());
        countInfo.put("dataItems",user.getDataItems());
        countInfo.put("conceptualModels",user.getConceptualModels());
        countInfo.put("logicalModels",user.getLogicalModels());
        countInfo.put("computableModels",user.getComputableModels());
        countInfo.put("concepts",user.getConcepts());
        countInfo.put("spatials",user.getSpatials());
        countInfo.put("templates",user.getTemplates());
        countInfo.put("units",user.getUnits());
        countInfo.put("themes",user.getThemes());

        userInfo.put("countInfo",countInfo);

        return userInfo;
    }

    public JSONObject getUser(String userName) {
        User user = userDao.findFirstByUserName(userName);
        JSONObject userInfo = new JSONObject();
        JSONObject countInfo = new JSONObject();

        userInfo.put("organizations", user.getOrganizations());
        userInfo.put("subjectAreas", user.getSubjectAreas());
        userInfo.put("name", user.getName());
        userInfo.put("oid", user.getOid());
        userInfo.put("userName", user.getUserName());
        userInfo.put("email", user.getEmail());
        userInfo.put("phone", user.getPhone());
        userInfo.put("weChat", user.getWeChat());
        userInfo.put("faceBook", user.getFaceBook());
        userInfo.put("personPage", user.getPersonPage());
        userInfo.put("wiki", user.getWiki());
        userInfo.put("description", user.getDescription());
        userInfo.put("researchInterests", user.getResearchInterests());
        userInfo.put("lab", user.getLab());
        userInfo.put("affiliation", user.getAffiliation());
        userInfo.put("externalLinks", user.getExternalLinks());
        userInfo.put("eduExperiences", user.getEducationExperiences());
        userInfo.put("awdHonors", user.getAwardsHonors());
        userInfo.put("runTask", user.getRunTask());
        userInfo.put("image", user.getImage().equals("") ? "" : htmlLoadPath + user.getImage());
        userInfo.put("subscribe", user.getSubscribe());

        return userInfo;
    }

    public JSONObject getItemUserInfo(String userName) {
        User user = userDao.findFirstByUserName(userName);
        JSONObject userJson = new JSONObject();
        userJson.put("name", user.getName());
        userJson.put("oid", user.getOid());
        userJson.put("image", user.getImage().equals("") ? "" : htmlLoadPath + user.getImage());
        return userJson;
    }

    public JSONObject getItemUserInfoByOid(String oid) {
        User user = userDao.findFirstByOid(oid);
        JSONObject userJson = new JSONObject();
        userJson.put("name", user.getName());
        userJson.put("oid", user.getOid());
        userJson.put("image", user.getImage().equals("") ? "" : htmlLoadPath + user.getImage());
        return userJson;
    }

    public String updateDescription(String description, String userName) {
        try {
            User user = userDao.findFirstByUserName(userName);
            if (user != null) {
                user.setDescription(description);
                userDao.save(user);
                return "success";
            } else
                return "no user";

        } catch (Exception e) {
            return "fail";
        }

    }

    public String updateResearchInterest(List<String> researchInterests, String userName) {
        try {
            User user = userDao.findFirstByUserName(userName);
            if (user != null) {
                user.setResearchInterests(researchInterests);
//                System.out.println(user.getResearchInterests());
                userDao.save(user);
                return "success";
            } else
                return "no user";

        } catch (Exception e) {
            return "fail";
        }
    }

    public String updateExlinks(List<String> exLinks, String userName) {
        try {
            User user = userDao.findFirstByUserName(userName);
            if (user != null) {
                user.setExternalLinks(exLinks);
//                System.out.println(user.getResearchInterests());
                userDao.save(user);
                return "success";
            } else
                return "no user";

        } catch (Exception e) {
            return "fail";
        }
    }


    public String updateAffiliation(AffiliationDTO affiliationDTO, String userName) {
        try {
            User user = userDao.findFirstByUserName(userName);
            if (user != null) {
                Affiliation affiliation = new Affiliation();
                BeanUtils.copyProperties(affiliationDTO, affiliation);
                user.setAffiliation(affiliation);
                Date now = new Date();
                user.setUpdateTime(now);
                userDao.save(user);
                return "success";
            } else
                return "no user";

        } catch (Exception e) {
            return "fail";
        }
    }

    public String updateLab(UserLabDTO userLabDTO, String userName) {
        try {
            User user = userDao.findFirstByUserName(userName);
            if (user != null) {
                UserLab userLab = new UserLab();
                BeanUtils.copyProperties(userLabDTO, userLab);
                user.setLab(userLab);
                Date now = new Date();
                user.setUpdateTime(now);
                userDao.save(user);
                return "success";
            } else
                return "no user";

        } catch (Exception e) {
            return "fail";
        }
    }

    public String updateSubjectAreas(List<String> subjectAreas, String userName) {
        try {
            User user = userDao.findFirstByUserName(userName);
            if (user != null) {
                user.setSubjectAreas(subjectAreas);
//                System.out.println(user.getResearchInterests());
                userDao.save(user);
                return "success";
            } else
                return "no user";

        } catch (Exception e) {
            return "fail";
        }
    }

    public String updateEduExperience(EducationExperienceDTO educationExperienceDTO, String userName) {
        try {
            User user = userDao.findFirstByUserName(userName);
            if (user != null) {
                EducationExperience educationExperience = new EducationExperience();
                BeanUtils.copyProperties(educationExperienceDTO, educationExperience);
                List<EducationExperience> educationExperienceList = user.getEducationExperiences();
                educationExperienceList.add(educationExperience);
                user.setEducationExperiences(educationExperienceList);
                Date now = new Date();
                user.setUpdateTime(now);
                userDao.save(user);
                return "success";
            } else
                return "no user";

        } catch (Exception e) {
            return "fail";
        }
    }

    public String updateAwdHonor(AwdHonorDTO awdHonorDTO, String userName) {
        try {
            User user = userDao.findFirstByUserName(userName);
            if (user != null) {
                AwardandHonor awardandHonor = new AwardandHonor();
                BeanUtils.copyProperties(awdHonorDTO, awardandHonor);
                List<AwardandHonor> awardandHonorList = user.getAwardsHonors();
                awardandHonorList.add(awardandHonor);
                user.setAwardsHonors(awardandHonorList);
                Date now = new Date();
                user.setUpdateTime(now);
                userDao.save(user);
                return "success";
            } else
                return "no user";

        } catch (Exception e) {
            return "fail";
        }
    }

    public String updateContact(ContactDTO contactDTO, String userName) {
        try {
            User user = userDao.findFirstByUserName(userName);
            if (user != null) {
                user.setPhone(contactDTO.getPhone());
                user.setEmail(contactDTO.getEmail());
                user.setFaceBook(contactDTO.getFaceBook());
                user.setWeChat(contactDTO.getWeChat());
                user.setPersonPage(contactDTO.getPersonPage());
                userDao.save(user);
                return "success";
            } else
                return "no user";

        } catch (Exception e) {
            return "fail";
        }
    }

    public ModelAndView judgeLogin(HttpServletRequest req) {
        ModelAndView modelAndView = new ModelAndView();
        HttpSession session = req.getSession();
        if (session.getAttribute("uid") == null) {
            modelAndView.setViewName("navbar");
            modelAndView.addObject("login", "no");
        } else {
            modelAndView.setViewName("navbar");
            modelAndView.addObject("login", "yes");
        }

        return modelAndView;
    }

    public String saveUserIcon(String img, String userName) {
        try {
            User user = userDao.findFirstByUserName(userName);
            if (user != null) {
                String uploadImage = img;
                String path = "/user/";
                if (!uploadImage.contains("/user/")) {
                    //删除旧图片
                    File file = new File(resourcePath + user.getImage());
                    if (file.exists() && file.isFile())
                        file.delete();
                    //添加新图片
                    path = "/user/" + UUID.randomUUID().toString() + ".jpg";
                    String imgStr = uploadImage.split(",")[1];
                    Utils.base64StrToImage(imgStr, resourcePath + path);
                    user.setImage(path);

                }
                userDao.save(user);
                return path;

            } else
                return "no user";

        } catch (Exception e) {
            return "fail";
        }
    }

    public String addTaskInfo(String userName, UserTaskInfo userTaskInfo) {
        try {
            User user = userDao.findFirstByUserName(userName);
            if (user != null) {
                List<UserTaskInfo> runTask = user.getRunTask();
                runTask.add(userTaskInfo);
                Date now = new Date();

                user.setRunTask(runTask);
                user.setUpdateTime(now);
                System.out.println(userDao.save(user));
                return "add taskInfo suc";
            } else
                return "no user";

        } catch (Exception e) {
            return "fail";
        }


    }

    public String addFolder(List<String> paths, String name, String userName) {
        User user = userDao.findFirstByUserName(userName);

        String id = UUID.randomUUID().toString();
        user.setFileContainer(aFolder(paths, user.getFileContainer(), name, id, "0"));

        userDao.save(user);

        return id;
    }

    private List<FileMeta> aFolder(List<String> paths, List<FileMeta> fileMetaList, String name, String id, String father) {

        String[] a = {"0"};
        if (paths.size() == 0 || paths.get(0).equals("0")) {
            Date date = new Date();
            fileMetaList.add(new FileMeta(true, false, id, father, name, "", "", null, new ArrayList<>(),date));
        } else {
            // pop
            String path = paths.remove(paths.size() - 1);
            for (int i = 0; i < fileMetaList.size(); i++) {
                FileMeta fileMeta = fileMetaList.get(i);
                if (fileMeta.getId().equals(path)) {

                    fileMeta.setContent(aFolder(paths, fileMeta.getContent(), name, id, path));
                    fileMetaList.set(i, fileMeta);
                    break;
                }
            }
        }
        return fileMetaList;
    }


    public JSONArray addFiles(List<String> paths, List<Map> files, String userName) {
        User user = userDao.findFirstByUserName(userName);
        List<String> pathsCopy = new ArrayList<>();
        JSONArray idList = new JSONArray();
        for (int i = 0; i < files.size(); i++) {

            String fileName = files.get(i).get("file_name").toString();
            String url = "http://" + dataContainerIpAndPort + "/data?uid=" + files.get(i).get("source_store_id").toString();
            String[] a = fileName.split("\\.");
            String name = files.get(i).get("label").toString();
            String suffix = files.get(i).get("suffix").toString();
            String id = UUID.randomUUID().toString();
            String templateId = "";
            if(files.get(i).get("templateId")!=null){
                templateId = files.get(i).get("templateId").toString();
            }

            pathsCopy.addAll(paths);
            user.setFileContainer(aFile(pathsCopy, user.getFileContainer(), name, suffix, id, "0", url, templateId));
            JSONObject obj = new JSONObject();
            for (String tempId : visualTemplateIds) {
                if (tempId.equals(templateId)) {
                    obj.put("visual", true);
                    break;
                }
            }
            if (!obj.containsKey("visual")) {
                obj.put("visual", false);
            }
            obj.put("id", id);
            obj.put("url", url);
            idList.add(obj);
        }

        userDao.save(user);
        return idList;
    }

    private List<FileMeta> aFile(List<String> paths, List<FileMeta> fileMetaList, String name, String suffix, String id, String father, String url, String templateId) {

        if (paths.size() == 0 || paths.get(0).equals("0")) {
            Date date = new Date();
            fileMetaList.add(new FileMeta(false, true, id, father, name, suffix, url, templateId, new ArrayList<>(),date));
        } else {
            // pop
            String path = paths.remove(paths.size() - 1);
            for (int i = 0; i < fileMetaList.size(); i++) {
                FileMeta fileMeta = fileMetaList.get(i);
                if (fileMeta.getId().equals(path)) {

                    fileMeta.setContent(aFile(paths, fileMeta.getContent(), name, suffix, id, path, url, templateId));
                    fileMetaList.set(i, fileMeta);
                    break;
                }
            }
        }
        return fileMetaList;
    }

    public List<String> deleteFiles(List<FileMeta> deletes, String userName) {
        List<String> result = new ArrayList<>();
        for (FileMeta file : deletes) {
            String id = file.getId();
            result.add(deleteFile(id, userName));
        }
        return result;
    }

    public String deleteFile(String id, String userName) {
        User user = userDao.findFirstByUserName(userName);

        user.setFileContainer(find7DeleteFile(user.getFileContainer(), id));

        userDao.save(user);
        return id;
    }

    public List<FileMeta> find7DeleteFile(List<FileMeta> fileMetaList, String id) {
        FileMeta fileMeta = new FileMeta();
        if (fileMetaList != null && fileMetaList.size() != 0)
            for (int i = fileMetaList.size() - 1; i >= 0; i--) {
                System.out.println(fileMetaList.get(i).getId());
                if (fileMetaList.get(i).getId().equals(id)) {
                    fileMetaList.remove(i);
                    return fileMetaList;
                } else find7DeleteFile(fileMetaList.get(i).getContent(), id);
            }

        return fileMetaList;
    }

    public String updateFile(String id, String name, String userName) {
        User user = userDao.findFirstByUserName(userName);

        user.setFileContainer(find7UpdateFile(user.getFileContainer(), id, name));

        userDao.save(user);
        return id;
    }

    public List<FileMeta> find7UpdateFile(List<FileMeta> fileMetaList, String id, String name) {
        FileMeta fileMeta = new FileMeta();
        if (fileMetaList != null && fileMetaList.size() != 0)
            for (int i = 0; i < fileMetaList.size(); i++) {
                System.out.println(fileMetaList.get(i).getId());
                if (fileMetaList.get(i).getId().equals(id)) {
                    fileMetaList.get(i).setName(name);
                    return fileMetaList;
                } else find7UpdateFile(fileMetaList.get(i).getContent(), id, name);
            }

        return fileMetaList;
    }

    public JSONArray getFolder(String userName) {
        User user = userDao.findFirstByUserName(userName);
        List<FileMeta> fileMetaList = user.getFileContainer();

        if (fileMetaList == null || fileMetaList.size() == 0) {
            Date date = new Date();
            FileMeta fileMeta = new FileMeta(true, false, UUID.randomUUID().toString(), "0", "My Data", "", "", null, new ArrayList<>(),date);
            fileMetaList = new ArrayList<>();
            fileMetaList.add(fileMeta);
            user.setFileContainer(fileMetaList);
            userDao.save(user);
        }


        JSONArray content = new JSONArray();
        JSONObject obj = new JSONObject();
        obj.put("id", "0");
        obj.put("label", "All Folder");
        obj.put("children", gFolder(fileMetaList));

        content.add(obj);

        return content;

    }

    private JSONArray gFolder(List<FileMeta> fileMetaList) {


        JSONArray parent = new JSONArray();

        if (fileMetaList.size() != 0) {
            for (int i = 0; i < fileMetaList.size(); i++) {
                FileMeta fileMeta = fileMetaList.get(i);
                if (fileMeta.getIsFolder()) {
                    JSONObject jsonObject = new JSONObject();
                    jsonObject.put("id", fileMeta.getId());
                    jsonObject.put("label", fileMeta.getName());
                    jsonObject.put("package", fileMeta.getIsFolder());
                    jsonObject.put("father", fileMeta.getFather());
                    for (String id : visualTemplateIds) {
                        if (fileMeta.getTemplateId()!=null&&id.equals(fileMeta.getTemplateId())) {
                            jsonObject.put("visual", true);
                            break;
                        }
                    }
                    if (!jsonObject.containsKey("visual")) {
                        jsonObject.put("visual", false);
                    }
                    jsonObject.put("children", gFolder(fileMeta.getContent()));
                    System.out.println(fileMeta.getContent());
                    parent.add(jsonObject);
                }
            }
        }
        return parent;
    }

    public JSONArray getFolder7File(String userName) {
        User user = userDao.findFirstByUserName(userName);
        List<FileMeta> fileMetaList = user.getFileContainer();

        if (fileMetaList == null || fileMetaList.size() == 0) {
            Date date = new Date();
            FileMeta fileMeta = new FileMeta(true, false, UUID.randomUUID().toString(), "0", "My Data", "", "", null, new ArrayList<>(),date);
            fileMetaList = new ArrayList<>();
            fileMetaList.add(fileMeta);
            user.setFileContainer(fileMetaList);
            userDao.save(user);
        }


        JSONArray content = new JSONArray();
        JSONObject obj = new JSONObject();
        obj.put("id", "0");
        obj.put("label", "All Folder");
        obj.put("children", gAllFile(fileMetaList));

        content.add(obj);

        return content;

    }

    private JSONArray gAllFile(List<FileMeta> fileMetaList) {


        JSONArray parent = new JSONArray();

        if (fileMetaList != null && fileMetaList.size() != 0) {
            for (int i = 0; i < fileMetaList.size(); i++) {
                FileMeta fileMeta = fileMetaList.get(i);
                if (fileMeta.getId() != null) {
                    JSONObject jsonObject = new JSONObject();
                    jsonObject.put("id", fileMeta.getId());
                    jsonObject.put("label", fileMeta.getName());
                    jsonObject.put("package", fileMeta.getIsFolder());
                    jsonObject.put("upload", fileMeta.getIsUserUpload());
                    jsonObject.put("father", fileMeta.getFather());
                    jsonObject.put("suffix", fileMeta.getSuffix());
                    jsonObject.put("url", fileMeta.getUrl());
                    for (String id : visualTemplateIds) {
                        if (fileMeta.getTemplateId()!=null&&id.equals(fileMeta.getTemplateId())) {
                            jsonObject.put("visual", true);
                            break;
                        }
                    }
                    if (!jsonObject.containsKey("visual")) {
                        jsonObject.put("visual", false);
                    }
                    jsonObject.put("children", gAllFile(fileMeta.getContent()));

                    parent.add(jsonObject);
                }
            }
        }
        return parent;
    }

    public JSONObject getFileByPath(List<String> paths, String userName) {
        User user = userDao.findFirstByUserName(userName);
        List<FileMeta> fileMetaList = user.getFileContainer();

        JSONObject obj = new JSONObject();
        obj.put("data", gFileBypath(paths, fileMetaList));


        return obj;
    }


    private JSONArray gFileBypath(List<String> paths, List<FileMeta> fileMetaList) {

        JSONArray list = new JSONArray();
        if (paths.size() == 0 || paths.get(0).equals("0")) {
            for (int i = 0; i < fileMetaList.size(); i++) {
                FileMeta fileMeta = fileMetaList.get(i);
                if (fileMeta.getId() != null) {
                    JSONObject jsonObject = new JSONObject();
                    jsonObject.put("id", fileMeta.getId());
                    jsonObject.put("label", fileMeta.getName());
                    jsonObject.put("package", fileMeta.getIsFolder());
                    jsonObject.put("upload", fileMeta.getIsUserUpload());
                    jsonObject.put("father", fileMeta.getFather());
                    jsonObject.put("suffix", fileMeta.getSuffix());
                    jsonObject.put("url", fileMeta.getUrl());
                    jsonObject.put("children", gAllFile(fileMeta.getContent()));

                    list.add(jsonObject);
                }
            }
            return list;
        } else {
            // pop
            String path = paths.remove(paths.size() - 1);
            for (int i = 0; i < fileMetaList.size(); i++) {
                FileMeta fileMeta = fileMetaList.get(i);
                if (fileMeta.getId().equals(path)) {
                    list = gFileBypath(paths, fileMeta.getContent());
                    break;
                }
            }
        }
        return list;
    }

    public JSONObject searchFile(String keyword, String userName) {
        User user = userDao.findFirstByUserName(userName);
        List<FileMeta> fileMetaList = user.getFileContainer();

        JSONObject obj = new JSONObject();
        obj.put("data", sFileByKeyword(keyword, fileMetaList));

        return obj;
    }

    public JSONArray sFileByKeyword(String keyword, List<FileMeta> fileMetaList) {
        JSONArray resultList = new JSONArray();

        if (fileMetaList != null && fileMetaList.size() != 0) {
            for (int i = 0; i < fileMetaList.size(); i++) {
                FileMeta fileMeta = fileMetaList.get(i);
                //正则表达式不区分大小写匹配
                Pattern pattern = Pattern.compile(keyword, Pattern.CASE_INSENSITIVE);
                Matcher matcher = pattern.matcher(fileMeta.getName());
                Matcher matcher1 = pattern.matcher(fileMeta.getSuffix());
                if (matcher.find() || matcher1.find()) {
                    JSONObject jsonObject = new JSONObject();
                    jsonObject.put("id", fileMeta.getId());
                    jsonObject.put("label", fileMeta.getName());
                    jsonObject.put("package", fileMeta.getIsFolder());
                    jsonObject.put("upload", fileMeta.getIsUserUpload());
                    jsonObject.put("father", fileMeta.getFather());
                    jsonObject.put("suffix", fileMeta.getSuffix());
                    jsonObject.put("url", fileMeta.getUrl());
                    jsonObject.put("children", gAllFile(fileMeta.getContent()));
                    for (String id : visualTemplateIds) {
                        if (fileMeta.getTemplateId()!=null&&id.equals(fileMeta.getTemplateId())) {
                            jsonObject.put("visual", true);
                            break;
                        }
                    }
                    if (!jsonObject.containsKey("visual")) {
                        jsonObject.put("visual", false);
                    }

                    resultList.add(jsonObject);
                } else {
                    resultList.addAll(sFileByKeyword(keyword, fileMeta.getContent()));
                }
            }
        }
        return resultList;
    }

    public String forkData(List<String> paths, List<String> dataIds, String itemId, String userName) {

        User user = userDao.findFirstByUserName(userName);

        DataItem dataItem = dataItemDao.findFirstById(itemId);

        user.setFileContainer(setData(paths, user.getFileContainer(), dataIds, dataItem, "0"));
        userDao.save(user);

        return "suc";
    }

    private List<FileMeta> setData(List<String> paths, List<FileMeta> fileMetaList, List<String> dataIds, DataItem dataItem, String father) {

        if (paths.size() == 0) {
            List<DataMeta> dataList = dataItem.getDataList();
            for (String dataId : dataIds) {
                for (DataMeta dataMeta : dataList) {
                    String url = dataMeta.getUrl();
                    String param = url.split("[?]")[1];
                    String id = param.split("=")[1];
                    if (dataId.equals(url)) {
                        boolean exist = false;
                        for (FileMeta fm : fileMetaList) {
                            if (fm.getId().equals(id)) {
                                exist = true;
                                break;
                            }
                        }
                        if (!exist) {
                            Date date = new Date();
                            FileMeta fileMeta = new FileMeta(false, false, id, father, dataMeta.getName(), dataMeta.getSuffix(), dataMeta.getUrl(), "", null,date);
                            fileMetaList.add(fileMeta);
                        }
                        break;
                    }

                }
            }
        } else {
            String id = paths.remove(paths.size() - 1);
            for (FileMeta fileMeta : fileMetaList) {
                if (fileMeta.getId().equals(id)) {
                    fileMeta.setContent(setData(paths, fileMeta.getContent(), dataIds, dataItem, id));
                }
            }
        }
        return fileMetaList;
    }

    public String sendFeedback(String content, String userName) {
        Feedback feedback = new Feedback();
        feedback.setContent(content);
        feedback.setUserName(userName);
        Date now = new Date();
        feedback.setTime(now);

        feedbackDao.save(feedback);

        return "success";
    }

    public JSONObject listUserArticle(int page, String oid) {
        JSONObject result = new JSONObject();

        User user = userDao.findFirstByOid(oid);
        if (user == null) {
            result.put("user", "no user");
            return result;
        }

        List<String> articleIds = user.getArticles();
        int total = articleIds.size();
        List<Article> articles = new ArrayList<>();

        int i = total - page * 6 - 1;
        while (i >= 0 && i >= total - (page + 1) * 6) {
            Article article = articleService.listByOid(articleIds.get(i));
            articles.add(article);
            i--;
        }
        result.put("total", total);
        result.put("list", articles);
        return result;

    }

    public void sendMyEmail(Map<String,String> email){
        String sender=email.get("sender");
        String password=email.get("password");
        String content=email.get("content");

        MyMailUtils.sendMail(sender,password,content);
    }

}
