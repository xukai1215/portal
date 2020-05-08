package njgis.opengms.portal.service;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import njgis.opengms.portal.dao.GeoIconDao;
import njgis.opengms.portal.dao.IconRelationDao;
import njgis.opengms.portal.dao.ModelDao;
import njgis.opengms.portal.entity.GeoIcon;
import njgis.opengms.portal.entity.IconRelation;
import org.bson.types.Binary;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GeoIconService {

    ModelDao modelDao = new ModelDao();

    @Autowired
    GeoIconDao geoIconDao;

    @Autowired
    IconRelationDao iconRelationDao;

    public Binary getGeoIconImage(String iconId){
        return geoIconDao.getByIconId(iconId).getIconImage();
    }

    public JSONArray getGeoIconParentInfo() {

        IconRelation iconRelation = iconRelationDao.getByName("地理图标资源库");
        List<String> childrenIds = iconRelation.getChildrenId();

        JSONArray childrenArray =  new JSONArray();
        for(String id:childrenIds){
            IconRelation relation = iconRelationDao.getByGeoId(id);
            JSONObject child = new JSONObject();
            child.put("name",relation.getNameEn());
            child.put("id",relation.getGeoId());
            childrenArray.add(child);
        }

        return childrenArray;
    }

    public JSONObject getGeoIconList(String parentId, int page, String sortType) {

        String sortElement;
        if(sortType.equals("name")){
            sortElement = "iconName";
        }else {
            sortElement = "iconCreateTime";
        }

        int pageSize = 12;
        if(page==-1){
            page = 0;
            pageSize = 99999;
        }

        Sort sort=new Sort(Sort.Direction.ASC,sortElement);
        Pageable pageable= PageRequest.of(page,pageSize,sort);
        Page<GeoIcon> geoIconList = geoIconDao.findByIconParentId(parentId,pageable);

        JSONObject geoIconsObject = new JSONObject();
        geoIconsObject.put("count",geoIconList.getContent().size());

        JSONArray geoIcons = new JSONArray();

        for(GeoIcon geoIcon: geoIconList){
            JSONObject iconModel = new JSONObject();
            iconModel.put("icon_id",geoIcon.getIconId());
            iconModel.put("icon_name",geoIcon.getIconName());
            geoIcons.add(iconModel);
        }
        geoIconsObject.put("geoIcons",geoIcons);
        return geoIconsObject;
    }

}
