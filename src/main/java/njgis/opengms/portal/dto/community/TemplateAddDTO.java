package njgis.opengms.portal.dto.community;

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

    String name;
    String description;
    List<String> classifications;

    String uploadImage;
    String detail;

}
