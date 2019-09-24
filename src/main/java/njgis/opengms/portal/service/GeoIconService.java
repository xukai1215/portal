package njgis.opengms.portal.service;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.mongodb.BasicDBObject;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoCursor;
import com.mongodb.client.model.Filters;
import njgis.opengms.portal.dao.ModelDao;
import org.bson.Document;
import org.bson.conversions.Bson;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public class GeoIconService {

    ModelDao modelDao = new ModelDao();

    public JSONArray getGeoIconParentInfo() {

        MongoCollection<Document> col=modelDao.GetCollection("ModelRepository", "iconrelation");
        Document root=modelDao.RetrieveDocsByName(col, "地理图标资源库");
        ArrayList<String> children =root.get("childrenId",ArrayList.class);

        JSONArray childrenArray =  new JSONArray();
        for(int i=0;i<children.size();i++){
            Document doc = col.find(Filters.eq("id",children.get(i))).first();
            String name=doc.getString("nameEn");
            JSONObject child = new JSONObject();
            child.put("name",name);
            child.put("id",children.get(i));
            childrenArray.add(child);
        }
        return childrenArray;
    }

    public JSONObject getGeoIconList(String parentId, int page, String sortType) {
        MongoCollection<Document> geoIconCol=modelDao.GetCollection("ModelRepository", "geoicons");
        Bson MIFilter= Filters.eq("Icon_ParentId", parentId);
        long count = geoIconCol.count(MIFilter);
        MongoCursor<Document> geoIconDocs = null;
        if(sortType.equals("name")){
            geoIconDocs= geoIconCol.find(MIFilter).sort(new BasicDBObject("Icon_Name",1)).limit(12).skip((page-1)*12).iterator();
        }else {
            geoIconDocs= geoIconCol.find(MIFilter).sort(new BasicDBObject("Icon_CreateTime",1)).limit(12).skip((page-1)*12).iterator();
        }
        JSONObject geoIconsObject = new JSONObject();
        geoIconsObject.put("count",count);
        JSONArray geoIcons = new JSONArray();

        while(geoIconDocs.hasNext()){
            Document doc=geoIconDocs.next();
            String icon_id=doc.getString("Icon_Id");
            JSONObject iconModel = new JSONObject();
            iconModel.put("icon_id",icon_id);
            geoIcons.add(iconModel);
        }
        geoIconsObject.put("geoIcons",geoIcons);
        return geoIconsObject;
    }
}
