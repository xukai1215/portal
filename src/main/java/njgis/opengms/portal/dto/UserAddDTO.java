package njgis.opengms.portal.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserAddDTO {
    String email;
    String userName;
    String password;
    String image;
    String name;
    String gender;
    String Country;
    String City;
    String description;
    String phone;
    String wiki;
    String title;
    String org;

    List<String> organizations;
}
