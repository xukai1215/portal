package njgis.opengms.portal.service;

import com.alibaba.fastjson.JSONObject;
import njgis.opengms.portal.dao.TemplateDao;
import njgis.opengms.portal.dao.UserDao;
import njgis.opengms.portal.dto.Template.TemplateFindDTO;
import njgis.opengms.portal.dto.Template.TemplateResultDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
public class TemplateService {
    @Autowired
    TemplateDao templateDao;

    @Autowired
    UserDao userDao;

    public JSONObject searchByTitleByOid(TemplateFindDTO templateFindDTO, String oid){
        String userName=userDao.findFirstByOid(oid).getUserName();
        int page=templateFindDTO.getPage();
        int pageSize = templateFindDTO.getPageSize();
        String sortElement=templateFindDTO.getSortElement();
        Boolean asc = templateFindDTO.getAsc();
        String name= templateFindDTO.getSearchText();

        Sort sort=new Sort(asc?Sort.Direction.ASC:Sort.Direction.ASC,sortElement);
        Pageable pageable= PageRequest.of(page,pageSize,sort);
        Page<TemplateResultDTO> templateResultDTOPage=templateDao.findByNameContainsIgnoreCaseAndAuthor(name,userName,pageable);

        JSONObject result=new JSONObject();
        result.put("list",templateResultDTOPage.getContent());
        result.put("total",templateResultDTOPage.getTotalElements());

        return result;

    }
}
