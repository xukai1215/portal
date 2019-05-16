package njgis.opengms.portal.bean;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @ClassName JsonResult
 * @Description todo
 * @Author sun_liber
 * @Date 2019/2/13
 * @Version 1.0.0
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class JsonResult<T> {
    private Integer code=0;
    private String msg="success";
    private T data;
}
