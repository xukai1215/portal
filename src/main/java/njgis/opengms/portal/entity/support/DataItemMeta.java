package njgis.opengms.portal.entity.support;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.expression.spel.ast.Projection;

import java.util.List;

/**
 * @ClassName DataItemMeta
 * @Description todo
 * @Author sun_liber
 * @Date 2019/2/13
 * @Version 1.0.0
 * TODO 字段按照UI页面设计，涉及到coverage
 */

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DataItemMeta {
    //coverage
    String name;
    String coordinateSystem;
    String geographicProjection;
    String coordinateUnits;
    Point [] boundingRectangle=new Point[2];
    List<Point> polygon;
}

@Data
@AllArgsConstructor
@NoArgsConstructor
class Point{
    float x;
    float y;
}
