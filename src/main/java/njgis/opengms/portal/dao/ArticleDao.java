package njgis.opengms.portal.dao;

import njgis.opengms.portal.dto.article.ArticleResultDTO;
import njgis.opengms.portal.entity.support.Article;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ArticleDao extends MongoRepository<Article,String> {

     Article findFirstByOid(String id);

     Article findFirstByTitle(String title);

     //Page<ModelItem> findByTitleLike(String title, Pageable pageable);

     List<Article> findByTitleLike(String title);

     Page<ArticleResultDTO> findAllByTitleContains(String title, Pageable pageable);
//
     Page<ArticleResultDTO> findByTitleContainsIgnoreCase(String title, Pageable pageable);
//
     Page<Article> findByTitleLikeIgnoreCase(String title,Pageable pageable);

     Page<Article> findByJournal(String journal,Pageable pageable);

     Page<Article> findByCreatDate(String creatDate,Pageable pageable);
//
//
     Page<ArticleResultDTO> findByContributor(String contributor,Pageable pageable);

     Page<ArticleResultDTO> findByTitleContainsIgnoreCaseAndContributor(String title,String contributor,Pageable pageable);

     void deleteArticleByOid(String oid);
}
