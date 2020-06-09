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
import njgis.opengms.portal.utils.Utils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.validation.constraints.NotNull;
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

    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

    List<String> userIds = new ArrayList<>();
    List<String> userIps = new ArrayList<>();

    public JSONObject getComputableModelStatisticsInfo(String oid, int days) {
        JSONObject result = new JSONObject();
        ComputableModel computableModel=computableModelDao.findFirstByOid(oid);
        result.put("invokeCount", computableModel.getInvokeCount());
        result.put("viewCount", computableModel.getViewCount());
        result.put("name", computableModel.getName());
        result.put("image", computableModel.getImage());
        result.put("oid", oid);

        Calendar c = Calendar.getInstance();//动态时间
        c.setTime(new Date());
        c.add(Calendar.DATE,-days);
        Date startTime = c.getTime();

        List<ComputableModel> computableModelList = new ArrayList<>();
        computableModelList.add(computableModel);

        JSONObject daily = getDailyViewAndInvokeTimes(computableModel, computableModelList, days);
        result.put("dayViewAndInvoke", daily);

        List<ViewRecord> viewRecordList = viewRecordDao.findAllByItemTypeAndItemOidAndDateGreaterThanEqual("ComputableModel", oid, startTime);
        result.put("locationsView",locationsOfViewers(viewRecordList));
        result.put("hourView",viewTimesByHour(viewRecordList));

        List<Task> taskList = taskDao.findAllByComputableIdAndRunTimeGreaterThanEqual(oid, startTime);
        result.put("locationsInvoke",locationsOfInvokers(taskList));
        result.put("hourInvoke", invokeTimesByHour(taskList));

        return result;
    }


    public JSONObject getDailyViewAndInvokeTimes(Item item, List<ComputableModel> computableModelList, int days){
        List<DailyViewCount> dailyViewCountList=item.getDailyViewCount();
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

                GeoInfoMeta geoInfoMeta = getGeoInfoMeta(userOid, viewRecord.getIp());

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

                GeoInfoMeta geoInfoMeta;
                geoInfoMeta = getGeoInfoMeta(userOid, "127.0.0.1");

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

    private GeoInfoMeta getGeoInfoMeta(String userOid, String ip) {
        GeoInfoMeta geoInfoMeta;
        try {
            geoInfoMeta = Utils.getGeoInfoMeta(ip);
        }catch (Exception e){
            throw new RuntimeException(e.getMessage());
        }

        if(userOid!=null) {
            User user = userDao.findFirstByOid(userOid);
            if(user != null){
                geoInfoMeta = user.getGeoInfo();
            }
        }

        return geoInfoMeta;
    }

}
