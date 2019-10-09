package njgis.opengms.portal.service;

import com.alibaba.fastjson.JSONObject;
import njgis.opengms.portal.dao.AwardandHonorDao;
import njgis.opengms.portal.dao.UserDao;
import njgis.opengms.portal.dto.awardandHonor.AwardandHonorAddDTO;
import njgis.opengms.portal.dto.awardandHonor.AwardandHonorFindDTO;
import njgis.opengms.portal.dto.awardandHonor.AwardandHonorResultDTO;
import njgis.opengms.portal.entity.User;
import njgis.opengms.portal.entity.support.AwardandHonor;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.UUID;

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

//        System.out.println(result);
        return result;

    }

    public JSONObject listByUserOid(AwardandHonorFindDTO awardandHonorFindDTO, String oid ){
        int page=awardandHonorFindDTO.getPage();
        int pageSize = awardandHonorFindDTO.getPageSize();
        Boolean asc = awardandHonorFindDTO.getAsc();
        String sortElement = awardandHonorFindDTO.getSortElement();

        Sort sort=new Sort(asc?Sort.Direction.ASC : Sort.Direction.DESC, sortElement);
        Pageable pageable= PageRequest.of(page,5,sort);
        User user=userDao.findFirstByOid(oid);
        List<AwardandHonorResultDTO> awardandHonorResultDTO=awardandHonorDao.findByContributor(user.getUserName(),sort);

        JSONObject result=new JSONObject();
        result.put("list",awardandHonorResultDTO);
        result.put("total",awardandHonorResultDTO.size());

//        System.out.println("awd"+result);
        return result;
    }

    public AwardandHonor addNewAwd(AwardandHonorAddDTO awardandHonorAddDTO, String contributor){
        AwardandHonor awardandHonor=new AwardandHonor();
        BeanUtils.copyProperties(awardandHonorAddDTO,awardandHonor);
        System.out.println(awardandHonor);
        Date now=new Date();
        awardandHonor.setCreatDate(now);
        awardandHonor.setContributor(contributor);
        awardandHonor.setOid(UUID.randomUUID().toString());

        return awardandHonorDao.insert(awardandHonor);


    }

    public int deleteByOid (String oid,String userName){
        AwardandHonor awardandHonor=awardandHonorDao.findFirstByOid(oid);
        if(awardandHonor!=null){
            awardandHonorDao.deleteAwardandHonorByOid(oid);
//            System.out.println("'delete success");
            return 1;
        }
        else

            return -1;



    }
}
