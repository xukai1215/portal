package njgis.opengms.portal.dto.Template;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
/**
 * @ClassName TemplateResultDTO
 * @Description todo
 * @Author ZHSH
 * @Date 2019/7/29
 * @Version 1.0.0
 * TODO
 */

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TemplateResultDTO {

    String oid;
    String status;
    String name;
    String image;
    String description;
    String author;
    String detail;
    Date createTime;

    int viewCount=0;
}
