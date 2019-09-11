package njgis.opengms.portal.service;

import com.alibaba.fastjson.JSONObject;
import njgis.opengms.portal.dao.AwardandHonorDao;
import njgis.opengms.portal.dao.UserDao;
import njgis.opengms.portal.dto.awardandHonor.AwardandHonorFindDTO;
import njgis.opengms.portal.dto.awardandHonor.AwardandHonorResultDTO;
import njgis.opengms.portal.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service

public class AwardandHonorService {

    @Autowired
    AwardandHonorDao awardandHonorDao;
    @Autowired
    UserDao userDao;
    @Autowired
    UserService userService;

    public JSONObject getByUserOidBySort(AwardandHonorFindDTO awardandHonorFindDTO , String userName ){
        int page=awardandHonorFindDTO.getPage();
        int pageSize = awardandHonorFindDTO.getPageSize();
        String sortElement=awardandHonorFindDTO.getSortElement();
        Boolean asc = awardandHonorFindDTO.getAsc();


//        根据创建时间排序
        Sort sort=new Sort(asc?Sort.Direction.ASC : Sort.Direction.DESC, sortElement);
        Pageable pageable= PageRequest.of(page,pageSize,sort);
        Page<AwardandHonorResultDTO> awardandHonorResultDTOPage=awardandHonorDao.findByContributor(userName,pageable);
        JSONObject result=new JSONObject();
        result.put("list",awardandHonorResultDTOPage.getContent());
        result.put("total", awardandHonorResultDTOPage.getTotalElements());

        System.out.println(result);
        return result;

    }

    public JSONObject listByUserOid(AwardandHonorFindDTO awardandHonorFindDTO, String oid ){
        int page=awardandHonorFindDTO.getPage();
        int pageSize = awardandHonorFindDTO.getPageSize();
        Boolean asc = awardandHonorFindDTO.getAsc();

//        根据访问数量排序
        Sort sort=new Sort(asc?Sort.Direction.ASC : Sort.Direction.DESC, "awardTime");
        Pageable pageable= PageRequest.of(page,pageSize,sort);
        User user=userDao.findFirstByOid(oid);
        Page<AwardandHonorResultDTO> awardandHonorResultDTOPage=awardandHonorDao.findByContributor(user.getUserName(),pageable);

        JSONObject result=new JSONObject();
        result.put("list",awardandHonorResultDTOPage.getContent());
        result.put("total",awardandHonorResultDTOPage.getTotalElements());

        return result;
    }
}