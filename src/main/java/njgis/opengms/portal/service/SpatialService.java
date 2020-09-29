package njgis.opengms.portal.service;

import com.alibaba.fastjson.JSONObject;
import njgis.opengms.portal.dao.SpatialReferenceClassificationDao;
import njgis.opengms.portal.dao.SpatialReferenceDao;
import njgis.opengms.portal.dao.UserDao;
import njgis.opengms.portal.dto.Spatial.SpatialFindDTO;
import njgis.opengms.portal.dto.Spatial.SpatialResultDTO;
import njgis.opengms.portal.entity.Classification;
import njgis.opengms.portal.entity.SpatialReference;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class SpatialService {

    @Autowired
    SpatialReferenceDao spatialReferenceDao;

    @Autowired
    SpatialReferenceClassificationDao spatialReferenceClassificationDao;

    @Autowired
    UserDao userDao;

    @Autowired
    UserService userService;

    @Value(value = "Public,Discoverable")
    private List<String> itemStatusVisible;

    public JSONObject getSpatialsByUserId(String oid, SpatialFindDTO spatialFIndDTO,String loadUser) {

        String uid=userService.getByOid(oid).getUserName();
        boolean asc=spatialFIndDTO.getAsc();
        String sortElement=spatialFIndDTO.getSortElement();
        int page=spatialFIndDTO.getPage();
        int pageSize=spatialFIndDTO.getPageSize();

        Sort sort = new Sort(asc ? Sort.Direction.ASC : Sort.Direction.DESC, sortElement);

        Pageable pageable = PageRequest.of(page, pageSize, sort);

        Page<SpatialResultDTO> spatials = Page.empty();
//        if(loadUser == null||!loadUser.equals(oid)) {
            spatials = spatialReferenceDao.findByAuthor(uid, pageable);
//        }else{
//            spatials = spatialReferenceDao.findByAuthor(uid, pageable);
//        }

        JSONObject SpatialObject = new JSONObject();
        SpatialObject.put("count", spatials.getTotalElements());
        SpatialObject.put("spatials", spatials.getContent());

        return SpatialObject;

    }

    public JSONObject searchByTitleByOid(SpatialFindDTO spatialFindDTO, String oid, String loadUser){
        String userName=userDao.findFirstByOid(oid).getUserName();
        int page=spatialFindDTO.getPage();
        int pageSize = spatialFindDTO.getPageSize();
        String sortElement=spatialFindDTO.getSortElement();
        Boolean asc = spatialFindDTO.getAsc();
        String name= spatialFindDTO.getSearchText();

        Sort sort=new Sort(asc?Sort.Direction.ASC:Sort.Direction.DESC,sortElement);
        Pageable pageable= PageRequest.of(page,pageSize,sort);

        Page<SpatialResultDTO> conceptResultDTOPage = Page.empty();

//        if(loadUser==null||!loadUser.equals(oid)) {
            conceptResultDTOPage = spatialReferenceDao.findByNameContainsIgnoreCaseAndAuthorAndStatusIn(name, userName,itemStatusVisible, pageable);
//        }else{
//            conceptResultDTOPage = spatialReferenceDao.findByNameContainsIgnoreCaseAndAuthor(name, userName, pageable);
//        }
        JSONObject result=new JSONObject();
        result.put("list",conceptResultDTOPage.getContent());
        result.put("total",conceptResultDTOPage.getTotalElements());

        return result;

    }

    public JSONObject getWKT(String oid) {
        SpatialReference spatialReference = spatialReferenceDao.findByOid(oid);

        String wkt = spatialReference.getWkt();
        String wktname = spatialReference.getWkname();

        JSONObject jsonObject = new JSONObject();
        jsonObject.put("wktname",wktname);
        jsonObject.put("wkt",wkt);

        return jsonObject;
    }

    public JSONObject getSpatialReference(int asc,int page,int size){
        Sort sort = new Sort(asc == 1 ? Sort.Direction.ASC : Sort.Direction.DESC, "createTime");

        Pageable pageable = PageRequest.of(page, size, sort);

        List<Classification> classifications = spatialReferenceClassificationDao.findAllByParentId("58340c92-d74f-4d81-8a80-e4fcff286008");

        List<String> classificationIds = new ArrayList<String>();

        for (Classification item:classifications){
            classificationIds.add(item.getOid());
        }

        Page<SpatialResultDTO> spatialResultDTOPage = spatialReferenceDao.findAllByAndClassificationsIn(classificationIds,pageable);

        JSONObject jsonObject = new JSONObject();
        jsonObject.put("total",spatialResultDTOPage.getTotalElements());
        jsonObject.put("content",spatialResultDTOPage.getContent());

        return jsonObject;
    }

    public JSONObject searchSpatialReference(int asc,int page,int size,String searchText){
        Sort sort = new Sort(asc == 1 ? Sort.Direction.ASC : Sort.Direction.DESC, "createTime");

        Pageable pageable = PageRequest.of(page, size, sort);

        List<Classification> classifications = spatialReferenceClassificationDao.findAllByParentId("58340c92-d74f-4d81-8a80-e4fcff286008");

        List<String> classificationIds = new ArrayList<String>();

        for (Classification item:classifications){
            classificationIds.add(item.getOid());
        }

        Page<SpatialResultDTO> spatialResultDTOPage = spatialReferenceDao.findAllByNameLikeIgnoreCaseAndClassificationsIn(searchText,classificationIds,pageable);

        JSONObject jsonObject = new JSONObject();
        jsonObject.put("total",spatialResultDTOPage.getTotalElements());
        jsonObject.put("content",spatialResultDTOPage.getContent());

        return jsonObject;
    }

}
