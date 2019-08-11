package njgis.opengms.portal.service;

import com.alibaba.fastjson.JSONObject;
import njgis.opengms.portal.dao.ArticleDao;
import njgis.opengms.portal.dao.UserDao;
import njgis.opengms.portal.dto.article.ArticleAddDTO;
import njgis.opengms.portal.dto.article.ArticleFindDTO;
import njgis.opengms.portal.dto.article.ArticleResultDTO;
import njgis.opengms.portal.entity.User;
import njgis.opengms.portal.entity.support.Article;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.UUID;

@Service
public class ArticleService {

//    ArticleFindDTO articleFindDTO=new ArticleFindDTO();

    @Autowired
    ArticleDao articleDao;

    @Autowired
    UserDao userDao;

    public JSONObject findNewestArticle(ArticleFindDTO articleFindDTO ,String oid ){
        int page=articleFindDTO.getPage();
        int pageSize = articleFindDTO.getPageSize();
        Boolean asc = articleFindDTO.getAsc();

//        根据创建时间排序
        Sort sort=new Sort(asc?Sort.Direction.ASC : Sort.Direction.DESC, "creatDate");
        Pageable pageable= PageRequest.of(page,pageSize,sort);
        User user=userDao.findFirstByOid(oid);
        Page<ArticleResultDTO> articleResultPage=articleDao.findByContributor(user.getUserName(),pageable);

        JSONObject result=new JSONObject();
        result.put("list",articleResultPage.getContent());
        result.put("total", articleResultPage.getTotalElements());
        System.out.println(result);
        return result;

    }

    public JSONObject getByUserOidBySort(ArticleFindDTO articleFindDTO ,String userName ){
        int page=articleFindDTO.getPage();
        int pageSize = articleFindDTO.getPageSize();
        String sortElement=articleFindDTO.getSortElement();
        Boolean asc = articleFindDTO.getAsc();


//        根据创建时间排序
        Sort sort=new Sort(asc?Sort.Direction.ASC : Sort.Direction.DESC, sortElement);
        Pageable pageable= PageRequest.of(page,pageSize,sort);
        Page<ArticleResultDTO> articleResultPage=articleDao.findByContributor(userName,pageable);

        JSONObject result=new JSONObject();
        result.put("list",articleResultPage.getContent());
        result.put("total", articleResultPage.getTotalElements());
        System.out.println(result);
        return result;

    }

    public Article addNewArticle(ArticleAddDTO articleAddDTO, String contributor){
        Article article=new Article();
        BeanUtils.copyProperties(articleAddDTO,article);
        Date now=new Date();
        article.setCreatDate(now);
        article.setContributor(contributor);
        article.setOid(UUID.randomUUID().toString());

        System.out.println(article);
        return articleDao.insert(article);

    }

    public JSONObject listByUserOid(ArticleFindDTO articleFindDTO,String oid ){
        int page=articleFindDTO.getPage();
        int pageSize = articleFindDTO.getPageSize();
        Boolean asc = articleFindDTO.getAsc();

//        根据访问数量排序
        Sort sort=new Sort(asc?Sort.Direction.ASC : Sort.Direction.DESC, "viewCount");
        Pageable pageable= PageRequest.of(page,pageSize,sort);
        User user=userDao.findFirstByOid(oid);
        Page<ArticleResultDTO> articleResultPage=articleDao.findByContributor(user.getUserName(),pageable);

        JSONObject result=new JSONObject();
        result.put("list",articleResultPage.getContent());
        result.put("total", articleResultPage.getTotalElements());

        System.out.println("ArticleService");

        return result;
    }
}
