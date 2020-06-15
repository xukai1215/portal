package njgis.opengms.portal.service;

import com.alibaba.fastjson.JSONObject;
import njgis.opengms.portal.dao.UnitDao;
import njgis.opengms.portal.dao.UserDao;
import njgis.opengms.portal.dto.Unit.UnitFindDTO;
import njgis.opengms.portal.dto.Unit.UnitResultDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UnitService {

    @Autowired
    UnitDao unitDao;

    @Autowired
    UserDao userDao;

    @Autowired
    UserService userService;

    @Value(value = "Public,Discoverable")
    private List<String> itemStatusVisible;

    public JSONObject getUnitsByUserId(String oid, UnitFindDTO unitFindDTO,String loadUser) {
        String userId=userService.getByOid(oid).getUserName();
        boolean asc=unitFindDTO.getAsc();
        String sortElement=unitFindDTO.getSortElement();
        int page=unitFindDTO.getPage();
        int pageSize=unitFindDTO.getPageSize();

        Sort sort = new Sort(asc ? Sort.Direction.ASC : Sort.Direction.DESC, sortElement);

        Pageable pageable = PageRequest.of(page, pageSize, sort);

        Page<UnitResultDTO> units = Page.empty();
        if(loadUser == null||!loadUser.equals(oid)) {
            units = unitDao.findByAuthorAndStatusIn(userId,itemStatusVisible, pageable);
        }else{
            units = unitDao.findByAuthor(userId, pageable);
        }

        JSONObject UnitObject = new JSONObject();
        UnitObject.put("count", units.getTotalElements());
        UnitObject.put("units", units.getContent());

        return UnitObject;

    }

    public JSONObject searchByTitleByOid(UnitFindDTO unitFindDTO, String oid,String loadUser){
        String userName=userDao.findFirstByOid(oid).getUserName();
        int page=unitFindDTO.getPage();
        int pageSize = unitFindDTO.getPageSize();
        String sortElement = unitFindDTO.getSortElement();
        Boolean asc = unitFindDTO.getAsc();
        String name = unitFindDTO.getSearchText();

        Sort sort=new Sort(asc?Sort.Direction.ASC:Sort.Direction.DESC,sortElement);
        Pageable pageable= PageRequest.of(page,pageSize,sort);

        Page<UnitResultDTO> unitResultDTOPage = Page.empty();

        if(loadUser == null||!loadUser.equals(oid)) {
            unitResultDTOPage = unitDao.findByNameContainsIgnoreCaseAndAuthorAndStatusIn(name, userName,itemStatusVisible, pageable);
        }else{
            unitResultDTOPage = unitDao.findByNameContainsIgnoreCaseAndAuthor(name, userName, pageable);
        }

        JSONObject result=new JSONObject();
        result.put("list",unitResultDTOPage.getContent());
        result.put("total",unitResultDTOPage.getTotalElements());

        return result;

    }
}
