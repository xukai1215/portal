package njgis.opengms.portal.controller.rest;

import njgis.opengms.portal.bean.JsonResult;
import njgis.opengms.portal.dto.article.ArticleAddDTO;
import njgis.opengms.portal.dto.article.ArticleFindDTO;
import njgis.opengms.portal.entity.support.Article;
import njgis.opengms.portal.service.ArticleService;
import njgis.opengms.portal.utils.ResultUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

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
        String userName=session.getAttribute("uid").toString();

        if(userName==null){
            return ResultUtils.error(-1,"no login");
        }

        return ResultUtils.success(articleService.searchByTitle(articleFindDTO,userName));
    }

    @RequestMapping(value="/searchByTitleByOid",method=RequestMethod.GET)
    JsonResult searchByTitle(ArticleFindDTO articleFindDTO, String oid){
        return ResultUtils.success(articleService.searchByTitleByOid(articleFindDTO,oid));
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
        String userName=session.getAttribute("uid").toString();
        if(userName==null){
            return ResultUtils.error(-1,"no login");
        }
        return ResultUtils.success(articleService.getByUserOidBySort(articleFindDTO,userName));
    }

    @RequestMapping(value="/add",method=RequestMethod.POST)
    public JsonResult addNewArticle(@RequestBody ArticleAddDTO articleAddDTO, HttpServletRequest httpServletRequest){
        System.out.println(articleAddDTO);
        HttpSession session=httpServletRequest.getSession();
        String userName=session.getAttribute("uid").toString();
        if(userName==null){
            return ResultUtils.error(-1,"no login");
        }
        int index=articleService.addNewArticle(articleAddDTO,userName);
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
        String userName=session.getAttribute("uid").toString();

        System.out.println("/deleteByOid"+oid+userName);
        if(userName==null){
            return ResultUtils.error(-1,"no login");
        }else{
            JsonResult result= ResultUtils.success(articleService.deleteByOid(oid,userName));
            System.out.println(result);
            return result;
        }
    }


    @RequestMapping(value = "/listByUserOid",method = RequestMethod.GET)
    JsonResult listByUserOid(ArticleFindDTO articleFindDTO, @RequestParam(value="oid") String oid){
        return ResultUtils.success(articleService.listByUserOid(articleFindDTO,oid));
    }
}
