package njgis.opengms.portal.service;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import njgis.opengms.portal.dao.UserDao;
import njgis.opengms.portal.entity.User;
import njgis.opengms.portal.entity.ViewRecord;
import njgis.opengms.portal.entity.support.GeoInfoMeta;
import njgis.opengms.portal.utils.Utils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class StatisticsService {

    @Autowired
    UserDao userDao;

    public Integer[] viewTimesByHour(List<ViewRecord> viewRecordList) {
        Integer[] integers = new Integer[24];

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

        for (int i = 0; i < viewRecordList.size(); i++) {
            ViewRecord viewRecord = viewRecordList.get(i);
            String userOid = viewRecord.getUserOid();
            GeoInfoMeta geoInfoMeta;
            if(userOid!=null) {
                User user = userDao.findFirstByOid(userOid);
                geoInfoMeta = user.getGeoInfo();
            }else{
                try {
                    geoInfoMeta = Utils.getGeoInfoMeta(viewRecord.getIp());
                }catch (Exception e){
                    throw new RuntimeException(e.getMessage());
                }
            }

            String countryName;
            if (geoInfoMeta == null || geoInfoMeta.getCountryName() == null || geoInfoMeta.getCountryName().trim().equals("")) {
                countryName = "China";
            } else {
                countryName = geoInfoMeta.getCountryName();
            }
            Boolean exist = false;
            for (int j = 0; j < mapData.size(); j++) {
                JSONObject data = mapData.getJSONObject(j);
                if (data.getString("name").equals(countryName)) {
                    int value = data.getInteger("value");
                    data.put("value", value++);
                    exist = true;
                    break;
                }
            }
            if (!exist) {
                JSONObject data = new JSONObject();
                data.put("name", countryName);
                data.put("value", 1);
                mapData.add(data);
            }



        }

        return mapData;
    }

}
