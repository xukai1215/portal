package njgis.opengms.portal.service;

import com.alibaba.fastjson.JSONObject;
import njgis.opengms.portal.dao.ConceptDao;
import njgis.opengms.portal.dao.UserDao;
import njgis.opengms.portal.dto.Concept.ConceptFindDTO;
import njgis.opengms.portal.dto.Concept.ConceptResultDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
public class ConceptService {
    @Autowired
    ConceptDao conceptDao;

    @Autowired
    UserDao userDao;

    public JSONObject searchByTitleByOid(ConceptFindDTO conceptFindDTO, String oid){
        String userName=userDao.findFirstByOid(oid).getUserName();
        int page=conceptFindDTO.getPage();
        int pageSize = conceptFindDTO.getPageSize();
        String sortElement=conceptFindDTO.getSortElement();
        Boolean asc = conceptFindDTO.getAsc();
        String name= conceptFindDTO.getSearchText();

        Sort sort=new Sort(asc?Sort.Direction.ASC:Sort.Direction.DESC,sortElement);
        Pageable pageable= PageRequest.of(page,pageSize,sort);
        Page<ConceptResultDTO> conceptResultDTOPage=conceptDao.findByNameContainsIgnoreCaseAndAuthor(name,userName,pageable);

        JSONObject result=new JSONObject();
        result.put("list",conceptResultDTOPage.getContent());
        result.put("total",conceptResultDTOPage.getTotalElements());

        return result;

    }


}
