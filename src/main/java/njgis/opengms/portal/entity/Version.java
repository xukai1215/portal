package njgis.opengms.portal.entity;

import lombok.Data;
import njgis.opengms.portal.entity.support.Localization;
import org.springframework.data.mongodb.core.mapping.Document;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

@Document
@Data
public class Version implements Serializable {

    private static final long serialVersionUID = 1L;

    //Basic Info

    String status;

    List<Localization> localizationList = new ArrayList<>();
    List<String> alias = new ArrayList<>();
}
