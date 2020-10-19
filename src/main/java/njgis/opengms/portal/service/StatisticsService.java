package njgis.opengms.portal.service;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import njgis.opengms.portal.dao.ComputableModelDao;
import njgis.opengms.portal.dao.TaskDao;
import njgis.opengms.portal.dao.UserDao;
import njgis.opengms.portal.dao.ViewRecordDao;
import njgis.opengms.portal.entity.*;
import njgis.opengms.portal.entity.support.DailyViewCount;
import njgis.opengms.portal.entity.support.GeoInfoMeta;
import njgis.opengms.portal.entity.support.SubscribeItem;
import njgis.opengms.portal.utils.ChartUtils;
import njgis.opengms.portal.utils.Object.ChartOption;
import njgis.opengms.portal.utils.Utils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import org.xhtmlrenderer.pdf.ITextRenderer;

import javax.validation.constraints.NotNull;
import java.io.File;
import java.io.FileOutputStream;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
public class StatisticsService {

    @Autowired
    UserDao userDao;

    @Autowired
    ComputableModelDao computableModelDao;

    @Autowired
    ViewRecordDao viewRecordDao;

    @Autowired
    TaskDao taskDao;

    @Autowired
    TemplateEngine templateEngine;

    @Value("${resourcePath}")
    private String resourcePath;

    @Value("${htmlLoadPath}")
    private String htmlLoadPath;

    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
    SimpleDateFormat sdfUTC = new SimpleDateFormat("yyyy-MM-dd HH:mm");

    List<String> userIds = new ArrayList<>();
    List<String> userIps = new ArrayList<>();


    private void addLocations(JSONArray locationsInvoke, List<String> countries, List<Integer> userCounts) {
        for(int i=0;i<locationsInvoke.size();i++){
            JSONObject view = locationsInvoke.getJSONObject(i);
            String country = view.getString("name");
            int count = view.getInteger("value");

            Boolean countryExist = false;
            for(int k=0;k<countries.size();k++){
                if(countries.get(k).equals(country)){
                    userCounts.set(k,userCounts.get(k)+count);
                    countryExist = true;
                }
            }
            if(!countryExist){
                countries.add(country);
                userCounts.add(count);
            }
        }
    }

    JSONObject getStatisticsInfo(SubscribeItem subscribeItem, int num, JSONArray imageList, int days){
        JSONObject statistics = getComputableModelStatisticsInfo(subscribeItem.getOid(), days);
        JSONObject dayViewAndInvoke = statistics.getJSONObject("dayViewAndInvoke");
        JSONArray valueList = dayViewAndInvoke.getJSONArray("valueList");

        //折线图
        Boolean lineChartHidden = true;

        JSONArray date_jarray = valueList.getJSONArray(0);
        JSONArray data1 = valueList.getJSONArray(1);
        JSONArray data2 = valueList.getJSONArray(2);

        String[] dates = new String[date_jarray.size()-1];
        int[][] counts = new int[2][dates.length];

        for(int i=1;i<data1.size();i++){
            dates[i-1] = date_jarray.getString(i);
            counts[0][i-1] = data1.getInteger(i);
            counts[1][i-1] = data2.getInteger(i);
            if(data1.getInteger(i)>0||data2.getInteger(i)>0){
                lineChartHidden = false;
            }
        }

        ChartOption lineChart = new ChartOption();
        lineChart.setTypes(new String[]{"View Times","Invoke Times"});
        lineChart.setData(counts);
        lineChart.setValXis(dates);
        lineChart.setTitle("View and Invoke Times in the Latest Quarter (UTC +08:00)");
        lineChart.setSubTitle("");


        if(!lineChartHidden) {
            String lineChartPath = ChartUtils.generateLine(lineChart);
            JSONObject ChartInfo = new JSONObject();
            ChartInfo.put("name", "lineChart" + num);
            ChartInfo.put("path", lineChartPath);
            statistics.put("lineChartPath",lineChartPath.replace(resourcePath,""));
            imageList.add(ChartInfo);
        }

        statistics.remove("dayViewAndInvoke");
        statistics.put("lineChart",lineChartHidden?null:"lineChart" + num);


        //柱状图
        JSONArray hourInvoke = statistics.getJSONArray("hourInvoke");
        JSONArray hourView = statistics.getJSONArray("hourView");

        ChartOption chartOption = new ChartOption();
        chartOption.setTitle("View and Invoke Times at Different Hours in the Latest Quarter (UTC +08:00)");
        chartOption.setSubTitle("");
        chartOption.setTitlePosition("center");

        String[] types = new String[]{"00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"};
        int[][] data = new int[2][24];
        Boolean barChartHidden = true;
        for (int i = 0; i < 24; i++) {
            data[0][i] = hourView.getInteger(i);
            data[1][i] = hourInvoke.getInteger(i);
            if(hourView.getInteger(i)>0||hourInvoke.getInteger(i)>0){
                barChartHidden = false;
            }
        }
        chartOption.setTypes(new String[]{"View Times","Invoke Times"});
        chartOption.setData(data);
        chartOption.setValXis(types);


        if(!barChartHidden) {
            String barChartPath = ChartUtils.generateBar(chartOption, 1);
            JSONObject ChartInfo = new JSONObject();
            ChartInfo.put("name", "barChart" + num);
            ChartInfo.put("path", barChartPath);
            statistics.put("barChartPath",barChartPath.replace(resourcePath,""));
            imageList.add(ChartInfo);
        }

        statistics.remove("hourInvoke");
        statistics.remove("hourView");
        statistics.put("barChart",barChartHidden?null:"barChart" + num);

        //地图
        JSONArray locationsView = statistics.getJSONArray("locationsView");
        JSONArray locationsInvoke = statistics.getJSONArray("locationsInvoke");

        List<String> viewCountries = new ArrayList<>();
        List<Integer> viewUserCounts = new ArrayList<>();

        List<String> invokeCountries = new ArrayList<>();
        List<Integer> invokeUserCounts = new ArrayList<>();

        addLocations(locationsView, viewCountries, viewUserCounts);

        addLocations(locationsInvoke, invokeCountries, invokeUserCounts);

//        Boolean mapChartHidden = countries.size()<=0;

//        if(!mapChartHidden) {
//            String mapChartPath = ChartUtils.generateMap(countries, userCounts);
//            JSONObject ChartInfo = new JSONObject();
//            ChartInfo.put("name", "mapChart" + num);
//            ChartInfo.put("path", mapChartPath);
//            statistics.put("mapChartPath",mapChartPath.replace(resourcePath,""));
//            imageList.add(ChartInfo);
//        }

        //饼图
        Boolean pieChartHidden = false;//viewCountries.size()<=1;

        if(!pieChartHidden){
            String[] pieTypes = new String[viewCountries.size()];
            viewCountries.toArray(pieTypes);

            int[] ints = viewUserCounts.stream().mapToInt(Integer::intValue).toArray();
            int[][] pieData = new int[1][ints.length];
            pieData[0] = ints;

            ChartOption pieOption = new ChartOption();
            pieOption.setTitle("Locations of Viewers");
            pieOption.setSubTitle("");
            pieOption.setData(pieData);
            pieOption.setTypes(pieTypes);
            pieOption.setValXis(pieTypes);
            pieOption.setTitlePosition("center");

            String pieChartPath = ChartUtils.generatePie(pieOption,"35%","50%","50%","5%",500,500,22,11);

            JSONObject pieChartInfo = new JSONObject();
            pieChartInfo.put("name", "pieChart" + num);
            pieChartInfo.put("path", pieChartPath);
            statistics.put("pieChartPath",pieChartPath.replace(resourcePath,""));
            imageList.add(pieChartInfo);
        }

        //饼图
        Boolean pieChartHidden2 = false;//invokeCountries.size()<=1;

        if(!pieChartHidden2){
            String[] pieTypes = new String[invokeCountries.size()];
            invokeCountries.toArray(pieTypes);

            int[] ints = invokeUserCounts.stream().mapToInt(Integer::intValue).toArray();
            int[][] pieData = new int[1][ints.length];
            pieData[0] = ints;

            ChartOption pieOption = new ChartOption();
            pieOption.setTitle("Locations of Invokes");
            pieOption.setSubTitle("");
            pieOption.setData(pieData);
            pieOption.setTypes(pieTypes);
            pieOption.setValXis(pieTypes);
            pieOption.setTitlePosition("center");

            String pieChartPath = ChartUtils.generatePie(pieOption,"35%","50%","50%","5%",500,500,22,11);

            JSONObject pieChartInfo = new JSONObject();
            pieChartInfo.put("name", "pieChart2" + num);
            pieChartInfo.put("path", pieChartPath);
            statistics.put("pieChartPath2",pieChartPath.replace(resourcePath,""));
            imageList.add(pieChartInfo);
        }

        statistics.remove("locationsView");
        statistics.remove("locationsInvoke");
        statistics.put("pieChart",pieChartHidden?null:"pieChart" + num);
        statistics.put("pieChart2",pieChartHidden?null:"pieChart2" + num);
//        statistics.put("mapChart",mapChartHidden?null:"mapChart" + num);

        return statistics;
    }

    public JSONObject getComputableModelStatisticsInfo(String oid, int days) {
        JSONObject result = new JSONObject();
        ComputableModel computableModel=computableModelDao.findFirstByOid(oid);
        List<Task> invokeTimes = taskDao.findAllByComputableId(oid);
        result.put("invokeCount", invokeTimes.size());
        result.put("viewCount", computableModel.getViewCount());
        result.put("name", computableModel.getName());
        result.put("image", computableModel.getImage());
        result.put("oid", oid);
        result.put("contentType", computableModel.getContentType());

        Date now = new Date();
        result.put("time",sdf.format(now));
        result.put("timeLong",now.getTime());

        Calendar c = Calendar.getInstance();//动态时间
        c.setTime(now);
        c.add(Calendar.DATE,-days);
        Date startTime = c.getTime();

        List<ViewRecord> viewRecordList = viewRecordDao.findAllByItemTypeAndItemOidAndDateGreaterThanEqual("ComputableModel", oid, startTime);
        List<Task> taskList = taskDao.findAllByComputableIdAndRunTimeGreaterThanEqual(oid, startTime);

        List<ComputableModel> computableModelList = new ArrayList<>();
        computableModelList.add(computableModel);

        JSONObject daily = getDailyViewAndInvokeTimes(computableModel, computableModelList, days, result);
        result.put("dayViewAndInvoke", daily);


        result.put("locationsView",locationsOfViewers(viewRecordList));
        result.put("hourView",viewTimesByHour(viewRecordList));
        result.put("quarterView",viewRecordList.size());


        result.put("locationsInvoke",locationsOfInvokers(taskList));
        result.put("hourInvoke", invokeTimesByHour(taskList));
        result.put("quarterInvoke", taskList.size());

        result.put("download",computableModel.getDownloadCount());

        return result;
    }


    public JSONObject getDailyViewAndInvokeTimes(Item item, List<ComputableModel> computableModelList, int days, JSONObject obj){
        List<DailyViewCount> dailyViewCountList=item.getDailyViewCount();
        Collections.sort(dailyViewCountList);

        JSONArray dateList = new JSONArray();
        dateList.add("Timeline");
        JSONArray viewArray=new JSONArray();
        viewArray.add("View Times");
        JSONArray invokeArray = new JSONArray();
        invokeArray.add("Invoke Times");
        JSONArray resultList = new JSONArray();
        Date now = new Date();

        Calendar c = Calendar.getInstance();//动态时间
        c.setTime(now);
        String startTime;//chart起始时间
        int max=0;
        if(dailyViewCountList==null||dailyViewCountList.size()==0){

            c.add(Calendar.DATE,-6);
            startTime=sdf.format(c.getTime());
            for(int i=0;i<6;i++){
                dateList.add(sdf.format(c.getTime()));
                viewArray.add(0);
                invokeArray.add(0);
                c.add(Calendar.DATE,1);
            }

        }else{
            DailyViewCount dailyViewCount=dailyViewCountList.get(0);
            Date firstDate = dailyViewCount.getDate();
            c.add(Calendar.DATE,-days);

            if(dailyViewCountList.get(dailyViewCountList.size()-1).getDate().before(c.getTime())){
                c.setTime(now);
                c.add(Calendar.DATE,-6);
            }

            int index=0;
            if(c.getTime().before(firstDate)){
                c.setTime(firstDate);
            }
            else{
                while(index<dailyViewCountList.size()&&c.getTime().after(dailyViewCountList.get(index).getDate())){
                    index++;
                }
            }

            startTime=sdf.format(c.getTime());

            Calendar nowCalendar = Calendar.getInstance();
            nowCalendar.setTime(now);
            nowCalendar.add(Calendar.DATE, 1);

            while (!Utils.isSameDay(c.getTime(),nowCalendar.getTime())){
                dateList.add(sdf.format(c.getTime()));
                if(index<dailyViewCountList.size()) {
                    DailyViewCount daily = dailyViewCountList.get(index);

                    if (Utils.isSameDay(daily.getDate(), c.getTime())) {
                        int count=daily.getCount();
                        if(count>max){
                            max=count;
                        }
                        viewArray.add(count);
                        index++;
                    } else {
                        viewArray.add(0);
                    }
                }
                else{
                    viewArray.add(0);
                }

                c.add(Calendar.DATE,1);
                invokeArray.add(0);
            }

        }


        for (int i = 0; i < computableModelList.size(); i++) {

            setInvokeCount(computableModelList.get(i), startTime, invokeArray);

        }

//        //add
//        if(obj!=null) {
//            List<ViewRecord> viewRecordList = viewRecordDao.findAllByItemTypeAndItemOid("ComputableModel",item.getOid());
//            List<Task> taskList = taskDao.findAllByComputableId(item.getOid());
//            int viewCount = obj.getInteger("viewCount");
//
//            for (int i = 1; i < dateList.size(); i++) {
//                if (viewArray.getInteger(i) == 0) {
//                    try {
//                        String d = dateList.getString(i);
//                        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
//                        Date date1 = sdf.parse(d);
//                        for (int j = 0; j < viewRecordList.size(); j++) {
//                            if (Utils.isSameDay(date1, viewRecordList.get(j).getDate())) {
//                                viewArray.set(i, (int) viewArray.get(i) + 1);
//                                viewCount++;
//                            }
//                        }
//                        if (invokeArray.getInteger(i) == 0) {
//                            for (int j = 0; j < taskList.size(); j++) {
//                                if (Utils.isSameDay(date1, taskList.get(j).getRunTime())) {
//                                    invokeArray.set(i, (int) invokeArray.get(i) + 1);
//                                }
//                            }
//                        }
//                    } catch (Exception e) {
//
//                    }
//                }
//            }
//            obj.put("viewCount", viewCount);
//        }

        resultList.add(dateList);
        resultList.add(viewArray);
        resultList.add(invokeArray);

        JSONObject result=new JSONObject();

        result.put("valueList",resultList);

        return result;
    }

    public void setInvokeCount(ComputableModel computableModel, String startTime, JSONArray invokeArray){
        Calendar calendar=Calendar.getInstance();
        try {
            Date date=sdf.parse(startTime);
            calendar.setTime(date);
        }catch (Exception e){
            e.printStackTrace();
        }
//        ComputableModel computableModel = computableModelList.get(i);
        List<DailyViewCount> dailyInvokeCounts = computableModel.getDailyInvokeCount();
        Collections.sort(dailyInvokeCounts);

        int index=0;
        while (index<dailyInvokeCounts.size()&&calendar.getTime().after(dailyInvokeCounts.get(index).getDate())){
            index++;
        }

        Calendar nowCalendar = Calendar.getInstance();
        nowCalendar.setTime(new Date());
        nowCalendar.add(Calendar.DATE, 1);

        int count=1;
        while (!Utils.isSameDay(calendar.getTime(),nowCalendar.getTime())){
            if(index<dailyInvokeCounts.size()) {
                DailyViewCount dailyInvokeCount = dailyInvokeCounts.get(index);
                if (Utils.isSameDay(calendar.getTime(), dailyInvokeCount.getDate())) {
                    int times=invokeArray.getInteger(count);
                    times+=dailyInvokeCount.getCount();
                    invokeArray.set(count,times);
                    index++;
                }
            }

            calendar.add(Calendar.DATE,1);
            count++;
        }
    }

    public int[] viewTimesByHour(List<ViewRecord> viewRecordList) {
        int[] integers = new int[24];

        for (int i = 0; i < viewRecordList.size(); i++) {
            ViewRecord viewRecord = viewRecordList.get(i);
            Date date = viewRecord.getDate();
            int hour = date.getHours();
            integers[hour]++;
        }

        return integers;

    }

    public JSONArray locationsOfViewers(List<ViewRecord> viewRecordList) {
        JSONArray mapData = new JSONArray();
        userIds = new ArrayList<>();
        userIps = new ArrayList<>();

        for (int i = 0; i < viewRecordList.size(); i++) {
            ViewRecord viewRecord = viewRecordList.get(i);
            String userOid = viewRecord.getUserOid();

            boolean userExist = false;
            if(userOid!=null) {
                for (String userid : userIds) {
                    if (userid.equals(userOid)) {
                        userExist = true;
                        break;
                    }
                }
            }else {
                for (String ip : userIps) {
                    if (ip.equals(viewRecord.getIp())) {
                        userExist = true;
                        break;
                    }
                }
            }

            if(!userExist) {
                if(userOid!=null){
                    userIds.add(userOid);
                }else{
                    userIps.add(viewRecord.getIp());
                }

                GeoInfoMeta geoInfoMeta=viewRecord.getGeoInfoMeta();

                if(geoInfoMeta==null) {
                    User user = userDao.findFirstByOid(userOid);
                    if (user != null && user.getGeoInfo() != null) {
                        geoInfoMeta = user.getGeoInfo();
                    } else {
                        geoInfoMeta = getGeoInfoMeta(viewRecord.getIp());
                        viewRecord.setGeoInfoMeta(geoInfoMeta);
                        viewRecordDao.save(viewRecord);
                    }
                }

                String countryName;
                if (geoInfoMeta == null || geoInfoMeta.getCountryName() == null || geoInfoMeta.getCountryName().trim().equals("")) {
                    countryName = "China";
                } else {
                    countryName = geoInfoMeta.getCountryName();
                }
                Boolean exist = false;
                exist = justifyCountryIfExist(mapData, countryName, exist);
                ifCountyNotExist(mapData, countryName, exist);
            }

        }

        return mapData;
    }

    public int[] invokeTimesByHour(List<Task> taskList){
        int[] integers = new int[24];

        for (int i = 0; i < taskList.size(); i++) {
            Task task = taskList.get(i);
            Date date = task.getRunTime();
            int hour = date.getHours();
            integers[hour]++;
        }

        return integers;

    }

    public JSONArray locationsOfInvokers(List<Task> taskList) {
        JSONArray mapData = new JSONArray();
        userIds = new ArrayList<>();

        for (int i = 0; i < taskList.size(); i++) {

            Task task = taskList.get(i);
            String userOid = task.getUserId();

            boolean userExist = false;
            for (String userid : userIds) {
                if (userid.equals(userOid)) {
                    userExist = true;
                    break;
                }
            }

            if(!userExist) {
                userIds.add(userOid);
                GeoInfoMeta geoInfoMeta = task.getGeoInfoMeta();
                if(geoInfoMeta==null) {
                    User user = userDao.findFirstByOid(userOid);
                    if (user != null && user.getGeoInfo() != null) {
                        geoInfoMeta = user.getGeoInfo();
                    } else {
                        geoInfoMeta = getGeoInfoMeta("127.0.0.1");
                    }
                }
                String countryName;
                if (geoInfoMeta == null || geoInfoMeta.getCountryName() == null || geoInfoMeta.getCountryName().trim().equals("")) {
                    countryName = "China";
                } else {
                    countryName = geoInfoMeta.getCountryName();
                }
                Boolean exist = false;
                exist = justifyCountryIfExist(mapData, countryName, exist);
                ifCountyNotExist(mapData, countryName, exist);
            }

        }

        return mapData;
    }

    private void ifCountyNotExist(JSONArray mapData, String countryName, Boolean exist) {
        if (!exist) {
            JSONObject data = new JSONObject();
            data.put("name", countryName);
            data.put("value", 1);
            mapData.add(data);
        }
    }

    private Boolean justifyCountryIfExist(@NotNull JSONArray mapData, String countryName, Boolean exist) {
        for (int j = 0; j < mapData.size(); j++) {
            JSONObject data = mapData.getJSONObject(j);
            if (data.getString("name").equals(countryName)) {
                int value = data.getInteger("value");
                data.put("value", ++value);
                exist = true;
                break;
            }
        }
        return exist;
    }

    private GeoInfoMeta getGeoInfoMeta(String ip) {
        GeoInfoMeta geoInfoMeta;
        try {
            geoInfoMeta = Utils.getGeoInfoMeta(ip);
        }catch (Exception e){
            throw new RuntimeException(e.getMessage());
        }

        return geoInfoMeta;
    }

    public String generatePDF(JSONObject info){
        try {

            String filePath = "/pdf/"+info.getString("name")+"_"+info.getString("timeLong")+".pdf";
            final File outputFile = new File(resourcePath+filePath);
            File parent = outputFile.getParentFile();
            parent.mkdirs();
            FileOutputStream out = new FileOutputStream(outputFile);
            ITextRenderer renderer = new ITextRenderer();


            Context ctx = new Context();
            ctx.setVariable("name",info.getString("name"));
            ctx.setVariable("time",info.getString("time"));
            ctx.setVariable("oid",info.getString("oid"));
            ctx.setVariable("viewCount",info.getString("viewCount"));
            ctx.setVariable("quarterView",info.getString("quarterView"));
            ctx.setVariable("invokeCount",info.getString("invokeCount"));
            ctx.setVariable("quarterInvoke",info.getString("quarterInvoke"));
            ctx.setVariable("download",info.getInteger("download"));
            ctx.setVariable("lineChart",info.getString("lineChart"));
            ctx.setVariable("barChart",info.getString("barChart"));
            ctx.setVariable("pieChart",info.getString("pieChart"));
            ctx.setVariable("pieChart2",info.getString("pieChart2"));
//            ctx.setVariable("mapChart",info.getString("mapChart"));
            ctx.setVariable("lineChartPath",info.getString("lineChartPath"));
            ctx.setVariable("barChartPath",info.getString("barChartPath"));
            ctx.setVariable("pieChartPath",info.getString("pieChartPath"));
            ctx.setVariable("pieChartPath2",info.getString("pieChartPath2"));
//            ctx.setVariable("mapChartPath",info.getString("mapChartPath"));
            String pdf = templateEngine.process("modelStatisticsPDF.html",ctx);
            renderer.setDocumentFromString(pdf);

            renderer.layout();
            renderer.createPDF(out, false);
            renderer.finishPDF();
            System.out.println("==pdf created successfully==");
            System.out.println(outputFile.getAbsolutePath());

            return filePath;
        }catch (Exception e){
            return null;
        }

    }
}
