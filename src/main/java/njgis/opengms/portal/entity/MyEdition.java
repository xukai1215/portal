package njgis.opengms.portal.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import njgis.opengms.portal.entity.support.Oids;

import java.util.List;

/**
 * @Auther mingyuan
 * @Data 2020.06.09 14:46
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class MyEdition {
    int my_edition_num;
    List<Oids> oids;
}
