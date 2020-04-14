package njgis.opengms.portal.controller.rest;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import njgis.opengms.portal.bean.JsonResult;
import njgis.opengms.portal.dao.CommentDao;
import njgis.opengms.portal.dao.UserDao;
import njgis.opengms.portal.dto.CommentDTO;
import njgis.opengms.portal.dto.CommentResultDTO;
import njgis.opengms.portal.entity.Comment;
import njgis.opengms.portal.entity.User;
import njgis.opengms.portal.enums.ItemTypeEnum;
import njgis.opengms.portal.utils.ResultUtils;
import njgis.opengms.portal.utils.Utils;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping(value="/comment")
public class CommentController {

    @Autowired
    CommentDao commentDao;

    @Autowired
    UserDao userDao;

    @Value("${htmlLoadPath}")
    private String htmlLoadPath;

    private JSONArray userArray=new JSONArray();


    @RequestMapping(value="/add",method = RequestMethod.POST)
    public JsonResult add(@RequestBody CommentDTO commentDTO, HttpServletRequest request){

        HttpSession session=request.getSession();

        if(Utils.checkLoginStatus(session)==null){
            return ResultUtils.error(-1,"no login");
        }else {


            Comment comment = new Comment();
            BeanUtils.copyProperties(commentDTO, comment);

            comment.setOid(UUID.randomUUID().toString());
            comment.setDate(new Date());
            comment.setAuthorId(session.getAttribute("oid").toString());
            comment.setRelateItemType(ItemTypeEnum.getItemTypeByName(commentDTO.getRelateItemTypeName()));

            commentDao.insert(comment);

            //关联子评论
            if (commentDTO.getParentId() != null) {
                Comment parentComment = commentDao.findByOid(commentDTO.getParentId());
                parentComment.getSubComments().add(comment.getOid());
                commentDao.save(parentComment);
            }

            return ResultUtils.success();
        }

    }

    @RequestMapping(value = "/delete", method = RequestMethod.POST)
    public JsonResult delete(@RequestParam("oid") String oid, HttpServletRequest request){

        if(Utils.checkLoginStatus(request.getSession())==null){
            return ResultUtils.error(-1,"no login");
        }else {
            Comment comment = commentDao.findByOid(oid);

            //删除与父评论关联
            if (comment.getParentId() != null) {
                Comment parentComment = commentDao.findByOid(comment.getParentId());
                parentComment.getSubComments().remove(oid);
                commentDao.save(parentComment);
            }

            //删除子评论
            if (comment.getSubComments().size() != 0) {
                for (String subOid : comment.getSubComments()) {
                    Comment subComment = commentDao.findByOid(subOid);
                    commentDao.delete(subComment);
                }
            }

            commentDao.delete(comment);

            return ResultUtils.success();
        }

    }

    @RequestMapping(value="/getCommentsByTypeAndOid", method = RequestMethod.GET)
    public JsonResult getCommentsByTypeAndOid(@RequestParam("type") String type,
                                              @RequestParam("oid") String oid,
                                              @RequestParam("sort") int asc){
        ItemTypeEnum itemTypeEnum=ItemTypeEnum.getItemTypeByName(type);
        Sort sort=new Sort(asc==1?Sort.Direction.ASC:Sort.Direction.DESC,"date");
        Pageable pageable=PageRequest.of(0,999,sort);
        Page<CommentResultDTO> comments=commentDao.findAllByRelateItemTypeAndRelateItemId(itemTypeEnum,oid,pageable);

        List<CommentResultDTO> commentResultDTOList=comments.getContent();
        JSONArray commentList=new JSONArray();
        int count=0;
        for(CommentResultDTO commentResultDTO:commentResultDTOList){
            if(commentResultDTO.getParentId()!=null){
                continue;
            }
            count++;
            JSONObject commentObj=new JSONObject();
            SimpleDateFormat simpleDateFormat=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            commentObj.put("oid",commentResultDTO.getOid());
            commentObj.put("content",commentResultDTO.getContent());
            commentObj.put("date",simpleDateFormat.format(commentResultDTO.getDate()));
            commentObj.put("likeNum",commentResultDTO.getThumbsUpNumber());
            commentObj.put("author",getUser(commentResultDTO.getAuthorId()));

            JSONArray subComments=new JSONArray();
            for(String subCommentOid:commentResultDTO.getSubComments()){
                count++;
                Comment subComment=commentDao.findByOid(subCommentOid);
                JSONObject subCommentObj=new JSONObject();
                subCommentObj.put("oid",subComment.getOid());
                subCommentObj.put("content",subComment.getContent());
                subCommentObj.put("date",simpleDateFormat.format(subComment.getDate()));
                subCommentObj.put("likeNum",subComment.getThumbsUpNumber());
                subCommentObj.put("author",getUser(subComment.getAuthorId()));
                subCommentObj.put("replyTo",getUser(subComment.getReplyToUserId()));
                subComments.add(subCommentObj);
            }
            commentObj.put("subCommentList",subComments);
            commentList.add(commentObj);

        }

        JSONObject result=new JSONObject();
        result.put("size",count);
        result.put("commentList",commentList);

        return ResultUtils.success(result);
    }

    private JSONObject getUser(String userOid){

        if(userOid.equals("")){
            return null;
        }

        for(int i=0;i<userArray.size();i++){
            JSONObject userObj=userArray.getJSONObject(i);
            if(userObj.getString("oid").equals(userOid)){
                return userObj;
            }
        }

        User user=userDao.findFirstByOid(userOid);
        JSONObject author=new JSONObject();
        author.put("oid",userOid);
        author.put("name",user.getName());
        author.put("img",htmlLoadPath+user.getImage());

        userArray.add(author);

        return author;
    }

}
