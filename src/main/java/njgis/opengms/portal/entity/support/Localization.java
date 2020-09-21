package njgis.opengms.portal.entity.support;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Localization implements Comparable<Localization> {

    String localCode;
    String localName;
    String name;
    String description;

    @Override
    public int compareTo(Localization localization){
        return this.localName.compareTo(localization.localName);
    }
}
