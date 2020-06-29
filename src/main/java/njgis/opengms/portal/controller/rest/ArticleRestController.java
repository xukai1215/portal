package njgis.opengms.portal.controller.rest;

import njgis.opengms.portal.bean.JsonResult;
import njgis.opengms.portal.dto.article.ArticleAddDTO;
import njgis.opengms.portal.dto.article.ArticleFindDTO;
import njgis.opengms.portal.entity.support.Article;
import njgis.opengms.portal.service.ArticleService;
import njgis.opengms.portal.utils.ResultUtils;
import org.dom4j.DocumentException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.io.IOException;

@RestController
@RequestMapping(value="/article")
public class ArticleRestController {
    @Autowired
    ArticleService articleService;

    @RequestMapping(value = "/findNewest",method = RequestMethod.GET)
    JsonResult findNewest(ArticleFindDTO articleFindDTO, @RequestParam(value="oid") String oid){
        return ResultUtils.success(articleService.findNewestArticle(articleFindDTO,oid));
    }

    @RequestMapping(value="/searchByTitle",method=RequestMethod.GET)
    JsonResult searchByTitle(ArticleFindDTO articleFindDTO, HttpServletRequest request){
        System.out.println("/searchArticle"+articleFindDTO);
        HttpSession session=request.getSession();


        if(session.getAttribute("uid")==null){
            return ResultUtils.error(-1,"no login");
        }
        String userName=session.getAttribute("uid").toString();
        return ResultUtils.success(articleService.searchByTitle(articleFindDTO,userName));
    }

    @RequestMapping(value="/searchByTitleByOid",method=RequestMethod.GET)
    JsonResult searchByTitle(ArticleFindDTO articleFindDTO, String oid){
        return ResultUtils.success(articleService.searchByTitleByOid(articleFindDTO,oid));
    }

    @RequestMapping(value="/searchUserArticleByTitle",method=RequestMethod.GET)
    JsonResult searchUserArticleBytitle(@RequestParam(value = "searchText")String title,@RequestParam(value = "page")int page , String oid){
        return ResultUtils.success(articleService.searchUserArticleByTitle(title,page,oid));
    }

//    @RequestParam(value="pageSize") int pageSize,
//    @RequestParam(value="page") int page,
//    @RequestParam(value="sortElement") String sortElement,
//    @RequestParam(value="asc") Boolean sortAsc
    @RequestMapping(value = "/getByUserOidBySort",method = RequestMethod.GET)
    JsonResult getByUserOidBySort( ArticleFindDTO articleFindDTO, HttpServletRequest request){
//        ArticleFindDTO articleFindDTO=new ArticleFindDTO();
//        articleFindDTO.setAsc(sortAsc);
//        articleFindDTO.setPage(page);
//        articleFindDTO.setPageSize(pageSize);
//        articleFindDTO.setSortElement(sortElement);
        HttpSession session=request.getSession();

        if(session.getAttribute("uid")==null){
            return ResultUtils.error(-1,"no login");
        }
        String userName=session.getAttribute("uid").toString();
        return ResultUtils.success(articleService.getByUserOidBySort(articleFindDTO,userName));
    }

    @RequestMapping(value="/searchByDOI",method=RequestMethod.POST)
    public JsonResult searchNewArticleByDOI(@RequestParam(value="doi") String DOI, HttpServletRequest httpServletRequest) throws IOException, DocumentException {
        HttpSession session=httpServletRequest.getSession();

        if(session.getAttribute("oid")==null){
            return ResultUtils.error(-1,"no login");
        }
        String userOid=session.getAttribute("oid").toString();
        return ResultUtils.success(articleService.getArticleByDOI(DOI,userOid));
    }

    @RequestMapping(value="/addManually",method=RequestMethod.POST)
    public JsonResult addNewMannual(@RequestBody ArticleAddDTO articleAddDTO, HttpServletRequest httpServletRequest){
        System.out.println(articleAddDTO);
        HttpSession session=httpServletRequest.getSession();

        if(session.getAttribute("uid")==null){
            return ResultUtils.error(-1,"no login");
        }
        String userOid=session.getAttribute("oid").toString();
        int index=articleService.addNewManual(articleAddDTO,userOid);
        return ResultUtils.success(index);
    }

    @RequestMapping(value="/add",method=RequestMethod.POST)
    public JsonResult addNewArticle(@RequestBody ArticleAddDTO articleAddDTO, HttpServletRequest httpServletRequest){
        System.out.println(articleAddDTO);
        HttpSession session=httpServletRequest.getSession();

        if(session.getAttribute("uid")==null){
            return ResultUtils.error(-1,"no login");
        }
        String userOid=session.getAttribute("oid").toString();
        int index=articleService.addNewArticleByDoi(articleAddDTO,userOid);
        return ResultUtils.success(index);
    }

    @RequestMapping(value="/addContributor",method=RequestMethod.POST)
    public JsonResult addContributor(@RequestParam(value = "title") String title, @RequestParam(value = "journal") String journal,HttpServletRequest httpServletRequest){
        HttpSession session=httpServletRequest.getSession();

        if(session.getAttribute("uid")==null){
            return ResultUtils.error(-1,"no login");
        }
        String userOid=session.getAttribute("oid").toString();
        int index=articleService.addContributor(title,journal,userOid);
        return ResultUtils.success(index);
    }

    @RequestMapping(value="/editByOid",method=RequestMethod.POST)
    public JsonResult editArticle(@RequestBody ArticleAddDTO articleAddDTO){
        String oid=articleAddDTO.getOid();
        Article article=articleService.editArticle(articleAddDTO,oid);
        System.out.println("/edit");
        return ResultUtils.success(article.getOid());
    }

    @RequestMapping(value="/deleteByOid",method=RequestMethod.POST)
    public JsonResult deleteByOid(@RequestParam(value="oid") String oid, HttpServletRequest request){

        HttpSession session=request.getSession();

        if(session.getAttribute("uid")==null){
            return ResultUtils.error(-1,"no login");
        }else{
            String userOid=session.getAttribute("oid").toString();
            JsonResult result= ResultUtils.success(articleService.deleteByOid(oid,userOid));
            System.out.println(result);
            return result;
        }
    }


    @RequestMapping(value = "/listArticle",method = RequestMethod.GET)
    JsonResult listByUserOid(ArticleFindDTO articleFindDTO, @RequestParam(value="oid") String oid){
        return ResultUtils.success(articleService.listByUserOid(articleFindDTO,oid));
    }


}
