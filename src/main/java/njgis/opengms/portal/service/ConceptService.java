package njgis.opengms.portal.service;

import com.alibaba.fastjson.JSONObject;
import njgis.opengms.portal.dao.ConceptDao;
import njgis.opengms.portal.dao.UserDao;
import njgis.opengms.portal.dto.Concept.ConceptFindDTO;
import njgis.opengms.portal.dto.Concept.ConceptResultDTO;
import njgis.opengms.portal.entity.Concept;
import njgis.opengms.portal.entity.support.Localization;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class ConceptService {

    @Autowired
    ConceptDao conceptDao;

    @Autowired
    UserDao userDao;

    @Autowired
    UserService userService;

    @Value(value = "Public,Discoverable")
    private List<String> itemStatusVisible;

    public void updateDescription(Concept concept){
        //排序
        Collections.sort(concept.getLocalizationList());

        String description = "";
        //先找中英文描述
        for(Localization localization:concept.getLocalizationList()){
            String local = localization.getLocalCode();
            if(local.equals("en")||local.equals("zh")||local.contains("en-")||local.contains("zh-")){
                String localDesc = localization.getDescription();
                if(localDesc!=null&&!localDesc.equals("")) {
                    description = localization.getDescription();
                    break;
                }
            }
        }
        //如果没有中英文，则使用其他语言描述
        if(description.equals("")){
            for(Localization localization:concept.getLocalizationList()){
                String localDesc = localization.getDescription();
                if(localDesc!=null&&!localDesc.equals("")) {
                    description = localization.getDescription();
                    break;
                }
            }
        }
        concept.setDescription(description);

    }

    public JSONObject getConceptsByUserId(String oid, ConceptFindDTO conceptFindDTO, String loadUser) {

        String userId=userService.getByOid(oid).getUserName();

        boolean asc=conceptFindDTO.getAsc();
        String sortElement=conceptFindDTO.getSortElement();
        int page=conceptFindDTO.getPage();
        int pageSize=conceptFindDTO.getPageSize();

        Sort sort = new Sort(asc ? Sort.Direction.ASC : Sort.Direction.DESC, "createTime");

        Pageable pageable = PageRequest.of(page, pageSize, sort);

        Page<ConceptResultDTO> concepts = Page.empty();

//        if(loadUser == null||!loadUser.equals(oid)) {
            concepts = conceptDao.findByAuthorAndStatusIn(userId, itemStatusVisible, pageable);
//        }else{
//            concepts = conceptDao.findByAuthor(userId, pageable);
//        }

        JSONObject ConceptObject = new JSONObject();
        ConceptObject.put("count", concepts.getTotalElements());
        ConceptObject.put("concepts", concepts.getContent());

        return ConceptObject;

    }

    public JSONObject searchByTitleByOid(ConceptFindDTO conceptFindDTO, String oid,String loadUser){
        String userName=userDao.findFirstByOid(oid).getUserName();
        int page=conceptFindDTO.getPage();
        int pageSize = conceptFindDTO.getPageSize();
        String sortElement=conceptFindDTO.getSortElement();
        Boolean asc = conceptFindDTO.getAsc();
        String name= conceptFindDTO.getSearchText();

        Sort sort=new Sort(asc?Sort.Direction.ASC:Sort.Direction.DESC,sortElement);
        Pageable pageable= PageRequest.of(page,pageSize,sort);
        Page<ConceptResultDTO> conceptResultDTOPage = Page.empty();
//        if(loadUser==null||!loadUser.equals(oid)){
            conceptResultDTOPage = conceptDao.findByNameContainsIgnoreCaseAndAuthorAndStatusIn(name, userName,itemStatusVisible, pageable);
//        }else {
//            conceptResultDTOPage = conceptDao.findByNameContainsIgnoreCaseAndAuthor(name, userName, pageable);
//        }
        JSONObject result=new JSONObject();
        result.put("list",conceptResultDTOPage.getContent());
        result.put("total",conceptResultDTOPage.getTotalElements());

        return result;

    }


}
