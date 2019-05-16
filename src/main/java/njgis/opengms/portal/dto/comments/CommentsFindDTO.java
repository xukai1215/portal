package njgis.opengms.portal.dto.comments;


import lombok.Data;

/**
 * @ClassName CommentsFindDTO
 * @Description todo
 * @Author lan
 * @Date 2019/3/15
 * @Version 1.0.0
 */
@Data
public class CommentsFindDTO {
    private Integer page = 1;
    private Integer pageSize = 10;
    private Boolean asc = false;

}
