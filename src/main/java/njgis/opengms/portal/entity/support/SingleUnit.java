package njgis.opengms.portal.entity.support;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SingleUnit {
    String SingularName;
    String PluralName;
    Object BaseUnits;
    String FromUnitToBaseFunc;
    String FromBaseToUnitFunc;
    List<String> Prefixes;
    List<Object> Localization;

    String XmlDocSummary;
    String XmlDocRemarks;



}
