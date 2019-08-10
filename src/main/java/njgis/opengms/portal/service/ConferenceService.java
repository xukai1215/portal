package njgis.opengms.portal.service;

import com.alibaba.fastjson.JSONObject;
import njgis.opengms.portal.dao.ConferenceDao;
import njgis.opengms.portal.dao.UserDao;
import njgis.opengms.portal.dto.conference.ConferenceFindDTO;
import njgis.opengms.portal.dto.conference.ConferenceResultDTO;
import njgis.opengms.portal.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
public class ConferenceService {
    @Autowired
    UserDao userDao;
    @Autowired
    ConferenceDao conferenceDao;

    public JSONObject listByUserOid(ConferenceFindDTO conferenceFindDTO, String oid){
        int page=conferenceFindDTO.getPage();
        int pageSize = conferenceFindDTO.getPageSize();
        Boolean asc = conferenceFindDTO.getAsc();

//        根据访问数量排序
        Sort sort=new Sort(asc?Sort.Direction.ASC : Sort.Direction.DESC, "viewCount");
        Pageable pageable= PageRequest.of(page,pageSize,sort);
        User user=userDao.findFirstByOid(oid);
        Page<ConferenceResultDTO> conferenceResultDTOPage=conferenceDao.findByContributor(user.getUserName(),pageable);
        JSONObject result=new JSONObject();
        result.put("list",conferenceResultDTOPage.getContent());
        result.put("total", conferenceResultDTOPage.getTotalElements());

        System.out.println("ConferenceSercice");
        return result;


    }

}
