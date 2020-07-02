package njgis.opengms.portal.entity;

import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Document;

import java.io.Serializable;

@Document
@Data
public class Version implements Serializable {

    private static final long serialVersionUID = 1L;

    //Basic Info

    String status;


}
