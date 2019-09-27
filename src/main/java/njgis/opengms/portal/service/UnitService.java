package njgis.opengms.portal.service;

import com.alibaba.fastjson.JSONObject;
import njgis.opengms.portal.dao.UnitDao;
import njgis.opengms.portal.dao.UserDao;
import njgis.opengms.portal.dto.Unit.UnitFindDTO;
import njgis.opengms.portal.dto.Unit.UnitResultDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
public class UnitService {

    @Autowired
    UnitDao unitDao;

    @Autowired
    UserDao userDao;

    public JSONObject searchByTitleByOid(UnitFindDTO unitFindDTO, String oid){
        String userName=userDao.findFirstByOid(oid).getUserName();
        int page=unitFindDTO.getPage();
        int pageSize = unitFindDTO.getPageSize();
        String sortElement = unitFindDTO.getSortElement();
        Boolean asc = unitFindDTO.getAsc();
        String name = unitFindDTO.getSearchText();

        Sort sort=new Sort(asc?Sort.Direction.ASC:Sort.Direction.DESC,sortElement);
        Pageable pageable= PageRequest.of(page,pageSize,sort);
        Page<UnitResultDTO> unitResultDTOPage=unitDao.findByNameContainsIgnoreCaseAndAuthor(name,userName,pageable);

        JSONObject result=new JSONObject();
        result.put("list",unitResultDTOPage.getContent());
        result.put("total",unitResultDTOPage.getTotalElements());

        return result;

    }
}
