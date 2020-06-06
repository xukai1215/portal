package njgis.opengms.portal.service;

import com.alibaba.fastjson.JSONObject;
import njgis.opengms.portal.dao.ArticleDao;
import njgis.opengms.portal.dao.UserDao;
import njgis.opengms.portal.dto.article.ArticleAddDTO;
import njgis.opengms.portal.dto.article.ArticleFindDTO;
import njgis.opengms.portal.dto.article.ArticleResultDTO;
import njgis.opengms.portal.entity.User;
import njgis.opengms.portal.entity.support.Article;
import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.DocumentHelper;
import org.dom4j.Element;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.*;
import java.util.regex.Pattern;

@Service
public class ArticleService {

//    ArticleFindDTO articleFindDTO=new ArticleFindDTO();

    @Autowired
    ArticleDao articleDao;

    @Autowired
    UserDao userDao;

    @Autowired
    UserService userService;

    public Boolean findExisted(String titleName,String journal){
        List<Article> allArticles = articleDao.findAll();
        for (int i=0;i<allArticles.size();i++){
            if (titleName.equals(allArticles.get(i).getTitle())&&journal.equals(allArticles.get(i).getJournal()))
                return true;
        }
        return false;
    }

    public Boolean findDoiExisted(String doi){
        Article article = articleDao.findByDoi(doi);
        if (article == null)
            return false;
        else return true;
    }

    public JSONObject findNewestArticle(ArticleFindDTO articleFindDTO ,String oid ){
//        int page=articleFindDTO.getPage();
//        int pageSize = articleFindDTO.getPageSize();
//        Boolean asc = articleFindDTO.getAsc();
//
////        根据创建时间排序
//        Sort sort=new Sort(asc?Sort.Direction.ASC : Sort.Direction.DESC, "creatDate");
//        Pageable pageable= PageRequest.of(page,pageSize,sort);
//        User user=userDao.findFirstByOid(oid);
//        Page<ArticleResultDTO> articleResultPage=articleDao.findByContributor(user.getUserName(),pageable);

        JSONObject result=new JSONObject();
//        result.put("list",articleResultPage.getContent());
//        result.put("total", articleResultPage.getTotalElements());
//        System.out.println(result);
        return result;

    }

    public JSONObject getByUserOidBySort(ArticleFindDTO articleFindDTO ,String userName ){
//        int page=articleFindDTO.getPage();
//        int pageSize = articleFindDTO.getPageSize();
//        String sortElement=articleFindDTO.getSortElement();
//        Boolean asc = articleFindDTO.getAsc();
//
//        Sort sort=new Sort(asc?Sort.Direction.ASC : Sort.Direction.DESC, sortElement);
//        Pageable pageable= PageRequest.of(page,pageSize,sort);
//        Page<ArticleResultDTO> articleResultPage=articleDao.findByContributor(userName,pageable);
        JSONObject result=new JSONObject();
//        result.put("list",articleResultPage.getContent());
//        result.put("total", articleResultPage.getTotalElements());

//        System.out.println(result);
        return result;

    }

    public JSONObject searchByTitle(ArticleFindDTO articleFindDTO,String userName){
        int page=articleFindDTO.getPage();
        int pageSize = articleFindDTO.getPageSize();
        String sortElement=articleFindDTO.getSortElement();
        Boolean asc = articleFindDTO.getAsc();
        String title= articleFindDTO.getSearchText();

        Sort sort=new Sort(asc?Sort.Direction.ASC:Sort.Direction.DESC,sortElement);
        Pageable pageable=PageRequest.of(page,pageSize,sort);
        Page<ArticleResultDTO> articleResultDTOPage=articleDao.findByTitle(title,pageable);

        JSONObject result=new JSONObject();
        result.put("list",articleResultDTOPage.getContent());
        result.put("total",articleResultDTOPage.getTotalElements());
        System.out.println(result);
        return result;

    }

    public JSONObject searchByTitleByOid(ArticleFindDTO articleFindDTO,String oid){
        String userName=userDao.findFirstByOid(oid).getUserName();
        int page=articleFindDTO.getPage();
        int pageSize = articleFindDTO.getPageSize();
        String sortElement=articleFindDTO.getSortElement();
        Boolean asc = articleFindDTO.getAsc();
        String title= articleFindDTO.getSearchText();

        Sort sort=new Sort(asc?Sort.Direction.ASC:Sort.Direction.DESC,sortElement);
        Pageable pageable=PageRequest.of(page,pageSize,sort);
        Page<ArticleResultDTO> articleResultDTOPage=articleDao.findByTitle(title,pageable);

        JSONObject result=new JSONObject();
        result.put("list",articleResultDTOPage.getContent());
        result.put("total",articleResultDTOPage.getTotalElements());
        System.out.println(result);
        return result;

    }

    public JSONObject searchUserArticleByTitle(String title, int page, String oid){
        User user = userDao.findFirstByOid(oid);

        List<String> ids = user.getArticles();
        List<Article> articles = new ArrayList<>();
        for(String id : ids){
            Article article =  articleDao.findFirstByOid(id);
            Pattern pattern = Pattern.compile(title,Pattern.CASE_INSENSITIVE);//正则表达忽略大小写
            if(pattern.matcher(article.getTitle()).find()){
                articles.add(article);
            }
        }

        int total = articles.size();
        List<Article> articleResults =new ArrayList<>();
        int i=total-page*6-1;
        while (i>=0&&i>=total-(page+1)*6){
            Article a =articles.get(i) ;
            articleResults.add(a);
            i--;
        }

        JSONObject result=new JSONObject();
        result.put("list", articleResults);
//        result.put("total",articleResultDTOPage.getTotalElements());
        System.out.println(result);
        return result;

    }

    public String searchByElsecierDOI(String doi) throws IOException {
        String str = "https://api.elsevier.com/content/article/doi/"+doi+"?apiKey=e59f63ca86ba019181c8d3a53f495532";
        URL url = new URL(str);
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
        connection.setRequestMethod("GET");
        connection.setConnectTimeout(9000);
        connection.connect();
        int responseCode = connection.getResponseCode();
        String articleXml = new String();
        if (responseCode == HttpURLConnection.HTTP_OK) {
            InputStream inputStream = connection.getInputStream();
            BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream));
            String line;
            int length = connection.getContentLength();
            while ((line = reader.readLine()) != null) {
                if (!line.equals("")) {
                    articleXml+=line+"\n";
                }
            }
            reader.close();
            connection.disconnect();
            return articleXml;
        } else {
            //DOIdata.add(String.valueOf(responseCode));
            return null;
        }
    }

    public JSONObject getArticleByDOI(String Doi,String contributor) throws IOException, DocumentException {
        String[] eles= Doi.split("/");

        String doi = eles[eles.length-2]+"/"+eles[eles.length-1];

        String xml =  searchByElsecierDOI(doi);

        JSONObject result = new JSONObject();

        if(xml == null){
            result.put("find",0);
            return result;
        }
        else  if (xml.equals("Connection timed out: connect") ) {
            result.put("find",-1);
            return result;
        }  else{
            //dom4j解析xml
            Document doc = null;
            doc = DocumentHelper.parseText(xml);
            Element root = doc.getRootElement();
            System.out.println("根节点：" + root.getName());
            Element coredata = root.element("coredata");
            String title = coredata.elementTextTrim("title");
            String journal = coredata.elementTextTrim("publicationName");

            String pageRange = coredata.elementTextTrim("pageRange");
            String coverDate = coredata.elementTextTrim("coverDate");
            List links = coredata.elements("link");
            String link = ((Element)links.get(1)).attribute("href").getValue();

            Iterator authorIte = coredata.elementIterator("creator");
            List<String> authors = new ArrayList<>();
            while (authorIte.hasNext()) {
                Element record = (Element) authorIte.next();
                String author = record.getText();
                authors.add(author);
            }

            Article article = new Article();
            article.setTitle(title);
            article.setJournal(journal);
            article.setPageRange(pageRange);
            article.setDate(coverDate);
            article.setAuthors(authors);
            article.setLink(link);
            article.setDoi(doi);


            if(findDoiExisted(doi)) {//有重复上传
                result.put("find",2);
                result.put("article",article);
            }else{
                result.put("find",1);
                result.put("article",article);
            }
            doc = null;
            System.gc();
//            //user中加入这个字段
//            User user = userDao.findFirstByUserName(contributor);
//            List<String>articles = user.getArticles();
//            articles.add(article.getOid());
//            user.setArticles(articles);

//            userDao.save(user);
            return result;
        }
    }

    public int addNewArticleByDoi(ArticleAddDTO articleAddDTO, String contributor){
        if (findDoiExisted(articleAddDTO.getDOI())) {
            Article article = articleDao.findFirstByTitleAndJournal(articleAddDTO.getTitle(),articleAddDTO.getJournal());
            List<String> list = article.getContributors();
            list.add(contributor);
            article.setContributors(list);
            articleDao.save(article);
            return 2;
        }
        else{
            Article article=new Article();
            article.setTitle(articleAddDTO.getTitle());
            article.setAuthors(articleAddDTO.getAuthors());
            article.setJournal(articleAddDTO.getJournal());
            article.setDate(articleAddDTO.getDate());
            article.setPageRange(articleAddDTO.getPageRange());
            article.setLink(articleAddDTO.getLink());
            article.setDoi(articleAddDTO.getDOI());
            Date now=new Date();
            article.setCreatDate(now);
//            if(articleAddDTO.getStatus().equals("Author")){
//                article.getAuthors().add(contributor);
//            }else
//                article.getContributors().add(contributor);
            List<String> list = article.getContributors();
            list.add(contributor);
            article.setContributors(list);

            article.setOid(UUID.randomUUID().toString());
            articleDao.insert(article);

            //user中加入这个字段
            User user = userDao.findFirstByOid(contributor);
            List<String>articles = user.getArticles();
            articles.add(article.getOid());
            user.setArticles(articles);

            userDao.save(user);

            return 1;
        }


    }

    public int addNewManual(ArticleAddDTO articleAddDTO, String contributor){
        if (findExisted(articleAddDTO.getTitle(),articleAddDTO.getJournal())) {
            List<Article> articles = articleDao.findFirstByTitleAndJournalAndDoi(articleAddDTO.getTitle(),articleAddDTO.getJournal(),"");

            for(Article article : articles){
                Iterator ite = article.getContributors().iterator();
                while(ite.hasNext()){
                    if(ite.next().equals(contributor))
                        return 2;
                }
            }

        }
        else{
            Article article=new Article();
            article.setTitle(articleAddDTO.getTitle());
            article.setAuthors(articleAddDTO.getAuthors());
            article.setJournal(articleAddDTO.getJournal());
            article.setDate(articleAddDTO.getDate());
            article.setPageRange(articleAddDTO.getPageRange());
            article.setLink(articleAddDTO.getLink());
            article.setDoi(articleAddDTO.getDOI());
            Date now=new Date();
            article.setCreatDate(now);
//            if(articleAddDTO.getStatus().equals("Author")){
//                article.getAuthors().add(contributor);
//            }else
//                article.getContributors().add(contributor);
            List<String> list = article.getContributors();
            list.add(contributor);
            article.setContributors(list);

            article.setOid(UUID.randomUUID().toString());
            articleDao.insert(article);

            //user中加入这个字段
            User user = userDao.findFirstByOid(contributor);
            List<String>articles = user.getArticles();
            articles.add(article.getOid());
            user.setArticles(articles);

            userDao.save(user);


        }
        return 1;

    }

    public int  addContributor(String title,String journal , String contributor){
        Article article = articleDao.findFirstByTitleAndJournal(title,journal);
        List<String> list = article.getContributors();
        if(list.lastIndexOf(contributor)==-1){
            list.add(contributor);
            article.setContributors(list);
            articleDao.save(article);

            User user = userDao.findFirstByOid(contributor);
            List<String>articles = user.getArticles();
            articles.add(article.getOid());
            user.setArticles(articles);
            userDao.save(user);
        }



        return 1;
    }

    public Article editArticle(ArticleAddDTO articleAddDTO,String oid){
        Article article=articleDao.findFirstByOid(oid);
        if(article==null) {}
        else {
            article.setTitle(articleAddDTO.getTitle());
            article.setAuthors(articleAddDTO.getAuthors());
            article.setJournal(articleAddDTO.getJournal());
            article.setDate(articleAddDTO.getDate());
            article.setPageRange(articleAddDTO.getPageRange());
            article.setLink(articleAddDTO.getLink());
        }
        articleDao.save(article);
        return article;
    }

    public int deleteByOid (String oid,String userOid){
        Article article=articleDao.findFirstByOid(oid);

        if (article != null) {//同一篇文章可能有不同人上传，先删上传人数组

            List<String> list = article.getContributors();
            Iterator ite = list.iterator();
            while (ite.hasNext()) {
                if (ite.next().equals(userOid))
                    ite.remove();
            }

            article.setContributors(list);
            articleDao.save(article);

            userService.articleMinusMinus(userOid, oid);//在user记录中将article删除
//            System.out.println("'delete success");
            return 1;
        }
        else
            return -1;

    }

    public JSONObject listByUserOid(ArticleFindDTO articleFindDTO,String oid ){
//        int page=articleFindDTO.getPage();
//        int pageSize = articleFindDTO.getPageSize();
//        Boolean asc = articleFindDTO.getAsc();
//
////        根据访问数量排序
//        Sort sort=new Sort(asc?Sort.Direction.ASC : Sort.Direction.DESC, articleFindDTO.getSortElement());
//        Pageable pageable= PageRequest.of(page,pageSize,sort);
//        User user=userDao.findFirstByOid(oid);
//        Page<ArticleResultDTO> articleResultPage=articleDao.findByContributor(user.getUserName(),pageable);
//
        JSONObject result=new JSONObject();
//        result.put("list",articleResultPage.getContent());
//        result.put("total", articleResultPage.getTotalElements());
//
////        System.out.println("articleService");
        return result;
    }

    public Article listByOid(String articleId){
        return articleDao.findFirstByOid(articleId);
    }
}
