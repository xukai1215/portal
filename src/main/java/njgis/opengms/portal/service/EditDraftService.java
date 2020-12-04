package njgis.opengms.portal.service;

import com.alibaba.fastjson.JSONObject;
import njgis.opengms.portal.dao.EditDraftDao;
import njgis.opengms.portal.dto.EditDraftDTO;
import njgis.opengms.portal.entity.EditDraft;
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
public class EditDraftService {

    @Autowired
    EditDraftDao editDraftDao;

    public EditDraft addNew(EditDraftDTO editDraftDTO,String user){
        EditDraft editDraft = new EditDraft();
        String oid = UUID.randomUUID().toString();
        editDraft.setOid(UUID.randomUUID().toString());
        editDraft.setContent(editDraftDTO.getContent());
        if(editDraftDTO.getItemOid()!=null){
            editDraft.setItemOid(editDraftDTO.getItemOid());
        }
        if(editDraftDTO.getItemName()!=null){
            editDraft.setItemName(editDraftDTO.getItemName());
        }
        if(editDraftDTO.getUser()!=null){
            editDraft.setUser(editDraftDTO.getUser());
        }else{
            editDraft.setUser(user);
        }
        editDraft.setItemType(editDraftDTO.getItemType());
        editDraft.setEditType(editDraftDTO.getEditType());
//        if(user.equals(editDraftDTO.getUser()))
//            editDraft.setSelf(true);
//        else
//            editDraft.setSelf(false);

        Date date=new Date();
        editDraft.setCreateTime(date);
        editDraft.setLastModifyTime(date);
        return editDraftDao.insert(editDraft);



    }

    public EditDraft update(EditDraftDTO editDraftDTO,String user){
        EditDraft editDraft = editDraftDao.findFirstByOid(editDraftDTO.getOid());
        editDraft.setContent(editDraftDTO.getContent());

        Date date=new Date();
        editDraft.setLastModifyTime(date);
        return editDraftDao.save(editDraft);



    }

    public EditDraft init(EditDraftDTO editDraftDTO,String user){
        String oid = editDraftDTO.getOid();
        if(editDraftDTO.getOid()==null||editDraftDTO.getOid().equals("")){
            return addNew(editDraftDTO,user);
        }else{
            return update(editDraftDTO,user);
        }



    }

    public JSONObject pageByUser(int asc,int page,int size,String itemType,String user){
        Sort sort = new Sort(asc == 1 ? Sort.Direction.ASC : Sort.Direction.DESC, "lastModifyTime");

        Pageable pageable = PageRequest.of(page, size, sort);
        Page<EditDraft> editDraftPage = editDraftDao.findByUserAndItemType(user,itemType,pageable);

        JSONObject result = new JSONObject();
        result.put("content",editDraftPage.getContent());
        result.put("total",editDraftPage.getTotalElements());
        return result;
    }

    public List<EditDraft> listByUser(String itemOid,Boolean asc){
        Sort sort=new Sort(asc == true ? Sort.Direction.ASC : Sort.Direction.DESC, "lastModifyTime");
        List<EditDraft> editDrafts = editDraftDao.findByUserOrderByLastModifyTime(itemOid,sort);
        return editDrafts;
    }

    public EditDraft getByItemAndUser(String itemOid , String user){
        EditDraft editDraft = editDraftDao.findFirstByItemOidAndUser(itemOid,user);
        return editDraft;
    }

    public EditDraft getByOid(String oid ){
        EditDraft editDraft = editDraftDao.findFirstByOid(oid);
        return editDraft;
    }

    public List<EditDraft> getCreateDraftByUserByType(String user,String itemType,String editType){
        Sort sort = new Sort(Sort.Direction.DESC,"lastModifyTime");

        List<EditDraft> editDrafts = editDraftDao.findByUserAndItemTypeAndEditTypeOrderByLastModifyTime(user,itemType,editType,sort);

        return editDrafts;
    }

    public String delete(String oid){
        EditDraft editDraft = editDraftDao.findFirstByOid(oid);
        editDraftDao.delete(editDraft);
        return "del suc";
    }

    public EditDraft setTemplate(String oid){//设置为模板，不会自动删除;或者排除模板
        EditDraft editDraft = editDraftDao.findFirstByOid(oid);
//        if(!editDraft.getTemplate())
//            editDraft.setTemplate(true);
//        else{
//            editDraft.setTemplate(false);
//        }

        Date date=new Date();
        editDraft.setLastModifyTime(date);
        return editDraftDao.save(editDraft);

    }
}
