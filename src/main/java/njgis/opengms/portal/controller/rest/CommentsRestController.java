package njgis.opengms.portal.controller.rest;


import njgis.opengms.portal.bean.JsonResult;
import njgis.opengms.portal.dto.comments.CommentsAddDTO;
import njgis.opengms.portal.dto.comments.CommentsFindDTO;
import njgis.opengms.portal.service.CommentsService;
import njgis.opengms.portal.utils.ResultUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "/comments")
public class CommentsRestController {
    @Autowired
    CommentsService commentsService;

    @RequestMapping(value="",method = RequestMethod.GET)
    JsonResult list( CommentsFindDTO commentsFindDTO)
    {
        return ResultUtils.success(commentsService.list(commentsFindDTO));
    }


    @RequestMapping(value="/addcomment",method = RequestMethod.POST)
    JsonResult add(@RequestBody CommentsAddDTO commentsAddDTO)
    {
        return ResultUtils.success(commentsService.insert(commentsAddDTO));
    }




}
