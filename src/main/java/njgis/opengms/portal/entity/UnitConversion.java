package njgis.opengms.portal.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;


@Document
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Component
public class UnitConversion {
    @Id
    String id;
    String oid;
    String Name;
    String BaseUnit;
    List<String> classifications;
    String Logarithmic;
    String LogarithmicScalingFactor;
    Object BaseDimensions;
    String XmlDoc;
    List<Object> Units;

}

