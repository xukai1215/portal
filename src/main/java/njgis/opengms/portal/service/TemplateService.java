package njgis.opengms.portal.service;

import com.alibaba.fastjson.JSONObject;
import njgis.opengms.portal.dao.TemplateDao;
import njgis.opengms.portal.dao.UserDao;
import njgis.opengms.portal.dto.Template.TemplateFindDTO;
import njgis.opengms.portal.dto.Template.TemplateResultDTO;
import njgis.opengms.portal.entity.Template;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TemplateService {
    @Autowired
    TemplateDao templateDao;

    @Autowired
    UserService userService;

    @Autowired
    UserDao userDao;

    @Value(value = "Public,Discoverable")
    private List<String> itemStatusVisible;

    public JSONObject getTemplatesByUserId(String oid, TemplateFindDTO templateFindDTO, String loadUser) {

        String userId = userService.getByOid(oid).getUserName();
        boolean asc=templateFindDTO.getAsc();
        String sortElement=templateFindDTO.getSortElement();
        int page=templateFindDTO.getPage();
        int pageSize=templateFindDTO.getPageSize();

        Sort sort = new Sort(asc  ? Sort.Direction.ASC : Sort.Direction.DESC, sortElement);

        Pageable pageable = PageRequest.of(page, pageSize, sort);
        Page<TemplateResultDTO> templates = Page.empty();
//        if(loadUser == null||!loadUser.equals(oid)) {
            templates = templateDao.findByAuthorAndStatusIn(userId, itemStatusVisible,pageable);
//        }else{
//            templates = templateDao.findByAuthor(userId, pageable);
//        }
        JSONObject TemplateObject = new JSONObject();
        TemplateObject.put("count", templates.getTotalElements());
        TemplateObject.put("templates", templates.getContent());

        return TemplateObject;

    }

    public JSONObject searchByTitleByOid(TemplateFindDTO templateFindDTO, String oid,String loadUser){
        String userName=userDao.findFirstByOid(oid).getUserName();
        int page=templateFindDTO.getPage();
        int pageSize = templateFindDTO.getPageSize();
        String sortElement=templateFindDTO.getSortElement();
        Boolean asc = templateFindDTO.getAsc();
        String name= templateFindDTO.getSearchText();

        Sort sort=new Sort(asc?Sort.Direction.ASC:Sort.Direction.DESC,sortElement);
        Pageable pageable= PageRequest.of(page,pageSize,sort);

        Page<TemplateResultDTO> templateResultDTOPage = Page.empty();

//        if(loadUser == null||!loadUser.equals(oid)) {
            templateResultDTOPage = templateDao.findByNameContainsIgnoreCaseAndAuthorAndStatusIn(name, userName, itemStatusVisible,pageable);
//        }else{
//            templateResultDTOPage = templateDao.findByNameContainsIgnoreCaseAndAuthor(name, userName, pageable);
//        }

        JSONObject result=new JSONObject();
        result.put("list",templateResultDTOPage.getContent());
        result.put("total",templateResultDTOPage.getTotalElements());

        return result;

    }

    public String searchByOid(String oid){
        oid=oid.toLowerCase();
        Template template=templateDao.findByOid(oid);
        if(template==null){
            return null;
        }
        return template.getXml();

    }
}
