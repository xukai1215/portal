package njgis.opengms.portal.service;

import com.alibaba.fastjson.JSONObject;
import njgis.opengms.portal.dao.SpatialReferenceDao;
import njgis.opengms.portal.dao.UserDao;
import njgis.opengms.portal.dto.Spatial.SpatialFindDTO;
import njgis.opengms.portal.dto.Spatial.SpatialResultDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
public class SpatialService {

    @Autowired
    SpatialReferenceDao spatialReferenceDao;

    @Autowired
    UserDao userDao;

    public JSONObject searchByTitleByOid(SpatialFindDTO spatialFindDTO, String oid){
        String userName=userDao.findFirstByOid(oid).getUserName();
        int page=spatialFindDTO.getPage();
        int pageSize = spatialFindDTO.getPageSize();
        String sortElement=spatialFindDTO.getSortElement();
        Boolean asc = spatialFindDTO.getAsc();
        String name= spatialFindDTO.getSearchText();

        Sort sort=new Sort(asc?Sort.Direction.ASC:Sort.Direction.ASC,sortElement);
        Pageable pageable= PageRequest.of(page,pageSize,sort);
        Page<SpatialResultDTO> conceptResultDTOPage=spatialReferenceDao.findByNameContainsIgnoreCaseAndAuthor(name,userName,pageable);

        JSONObject result=new JSONObject();
        result.put("list",conceptResultDTOPage.getContent());
        result.put("total",conceptResultDTOPage.getTotalElements());

        return result;

    }
}
