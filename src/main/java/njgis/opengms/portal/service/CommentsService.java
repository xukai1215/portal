package njgis.opengms.portal.service;


import njgis.opengms.portal.dao.CommentsDao;
import njgis.opengms.portal.dto.comments.CommentsAddDTO;
import njgis.opengms.portal.dto.comments.CommentsFindDTO;
import njgis.opengms.portal.entity.Comments;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.data.web.SpringDataWebProperties;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;


import java.util.Date;

/**
 * @ClassName CommentsService
 * @Description todo
 * @Author lan
 * @Date 2019/3/15
 * @Version 1.0.0
 */
@Service
public class CommentsService {
    @Autowired
    CommentsDao commentsDao;

    public Comments insert(CommentsAddDTO commentsAddDTO){
        Comments comments=new Comments();
        BeanUtils.copyProperties(commentsAddDTO,comments);
        Date now=new Date();

        comments.setCommentDate(now);

        return commentsDao.insert(comments);

    }


    public Page<Comments> list(CommentsFindDTO commentsFindDTO){
        int page =commentsFindDTO.getPage();
        int pageSize=commentsFindDTO.getPageSize();
        //默认创建时间排序
        Sort sort=new Sort(commentsFindDTO.getAsc()?Sort.Direction.ASC:Sort.Direction.DESC,"commentDate");
        return commentsDao.findAll(PageRequest.of(page, pageSize,sort));
    }



}
