package njgis.opengms.portal.dto.Template;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * @ClassName TemplateAddDTO
 * @Description todo
 * @Author ZHSH
 * @Date 2019/7/29
 * @Version 1.0.0
 * TODO
 */

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TemplateAddDTO {

    String status;
    String name;
    String description;
    List<String> classifications;
    String xml;

    String uploadImage;
    String detail;

}
