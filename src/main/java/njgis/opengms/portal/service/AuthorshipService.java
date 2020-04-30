package njgis.opengms.portal.service;

import njgis.opengms.portal.dao.AuthorshipDao;
import njgis.opengms.portal.entity.Authorship;
import njgis.opengms.portal.entity.support.AuthorInfo;
import njgis.opengms.portal.entity.support.ItemInfo;
import njgis.opengms.portal.enums.ItemTypeEnum;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

/**
 * @ClassName ModelItemService
 * @Description todo
 * @Author Kai Xu
 * @Date 2020/4/30
 * @Version 1.0.0
 * TODO
 */

@Service
public class AuthorshipService {

    @Autowired
    AuthorshipDao authorshipDao;

    public void addAuthorship(List<AuthorInfo> authorInfos, ItemTypeEnum type, String itemOid){
        for(int i=0;i<authorInfos.size();i++){
            Authorship authorship = new Authorship();
            AuthorInfo author = authorInfos.get(i);

            BeanUtils.copyProperties(author,authorship);

            if(authorIsNull(author)){
                continue;
            }else {

                Authorship exist = new Authorship();

                if (authorship.getEmail() != null && !authorship.getEmail().trim().equals("")) {
                    exist = authorshipDao.findByEmail(authorship.getEmail());
                }
                if (authorship.getHomepage() != null && exist == null && !authorship.getHomepage().trim().equals(""))
                    exist = authorshipDao.findByHomepage((authorship.getHomepage().trim()));
                if (authorship.getName() != null && exist == null && !authorship.getName().trim().equals(""))
                    exist = authorshipDao.findByName((authorship.getName().trim()));
                if (authorship.getName() != null && exist == null && !authorship.getName().trim().equals(""))
                    exist = authorshipDao.findByAliasIn((authorship.getName().trim()));

                if (exist != null) {
                    //添加别名
                    if(!exist.getName().equals(authorship.getName().trim())) {
                        Boolean nameExist = false;
                        for (String alias : exist.getAlias()) {
                            if (alias.equals(authorship.getName().trim())) {
                                nameExist = true;
                            }
                        }
                        if (!nameExist) {
                            List<String> aliases = exist.getAlias();
                            aliases.add(authorship.getName().trim());
                            exist.setAlias(aliases);
                        }
                    }
                    //添加条目
                    List<ItemInfo> itemInfoList = exist.getItems();
                    ItemInfo itemInfo = new ItemInfo();
                    itemInfo.setType(type);
                    itemInfo.setOid(itemOid);
                    itemInfoList.add(itemInfo);
                    exist.setItems(itemInfoList);

                    authorshipDao.save(exist);
                } else {
                    authorship.setOid(UUID.randomUUID().toString());

                    //添加条目
                    List<ItemInfo> itemInfoList = authorship.getItems();
                    ItemInfo itemInfo = new ItemInfo();
                    itemInfo.setType(type);
                    itemInfo.setOid(itemOid);
                    itemInfoList.add(itemInfo);
                    authorship.setItems(itemInfoList);

                    authorshipDao.insert(authorship);

                }

            }
        }
    }

    Boolean authorIsNull(AuthorInfo authorInfo){

        if(authorInfo.getName()==null||authorInfo.getName().trim().equals("")){
            return true;
        }else{
            return false;
        }

    }


}
