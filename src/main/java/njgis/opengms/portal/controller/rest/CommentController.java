package njgis.opengms.portal.controller.rest;

import njgis.opengms.portal.bean.JsonResult;
import njgis.opengms.portal.dao.CommentDao;
import njgis.opengms.portal.dto.CommentDTO;
import njgis.opengms.portal.entity.Comment;
import njgis.opengms.portal.enums.ItemTypeEnum;
import njgis.opengms.portal.utils.ResultUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.UUID;

@RestController
@RequestMapping(value="/comment")
public class CommentController {

    @Autowired
    CommentDao commentDao;

    @RequestMapping(value="/add",method = RequestMethod.POST)
    public JsonResult add(@RequestBody CommentDTO commentDTO){

        Comment comment=new Comment();
        BeanUtils.copyProperties(commentDTO,comment);

        comment.setOid(UUID.randomUUID().toString());
        comment.setDate(new Date());
        comment.setRelateItemType(ItemTypeEnum.getItemType(commentDTO.getRelateItemTypeNum()));

        commentDao.insert(comment);

        //关联子评论
        if(commentDTO.getParentId()!=null){
            Comment parentComment=commentDao.findByOid(commentDTO.getParentId());
            parentComment.getSubComments().add(comment.getOid());
            commentDao.save(parentComment);
        }

        return ResultUtils.success();

    }

    @RequestMapping(value = "/delete", method = RequestMethod.POST)
    public JsonResult delete(@RequestParam("oid") String oid){

        Comment comment=commentDao.findByOid(oid);

        //删除与父评论关联
        if(comment.getParentId()!=null){
            Comment parentComment = commentDao.findByOid(comment.getParentId());
            parentComment.getSubComments().remove(oid);
            commentDao.save(parentComment);
        }

        commentDao.delete(comment);

        return ResultUtils.success();

    }

}
