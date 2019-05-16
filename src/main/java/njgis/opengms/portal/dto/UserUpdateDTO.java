package njgis.opengms.portal.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserUpdateDTO {

    String oid;
    String image;
    String name;
    String description;
    String phone;
    String wiki;

    List<String> organizations;
    List<String> subjectAreas;

}
