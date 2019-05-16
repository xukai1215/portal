package njgis.opengms.portal.entity.support;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Reference {
    String title;
    List<String> author;
    String date;
    String journal;
    String pages;
    String links;
}
