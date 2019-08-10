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

    @RequestMapping(value="/add",method=RequestMethod.POST)
    public JsonResult addNewArticle(@RequestBody ArticleAddDTO articleAddDTO, HttpServletRequest httpServletRequest){
        System.out.println(articleAddDTO);
        HttpSession session=httpServletRequest.getSession();
        String userName=session.getAttribute("uid").toString();
        if(userName==null){
            return ResultUtils.error(-1,"no login");
        }
        Article article=articleService.addNewArticle(articleAddDTO,userName);
        return ResultUtils.success(article.getOid());
    }


    @RequestMapping(value = "/listByUserOid",method = RequestMethod.GET)
    JsonResult listByUserOid(ArticleFindDTO articleFindDTO, @RequestParam(value="oid") String oid){
        return ResultUtils.success(articleService.listByUserOid(articleFindDTO,oid));
    }
}
