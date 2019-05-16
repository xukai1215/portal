package njgis.opengms.portal.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.List;

@Document
@Data
public class User {
    @Id
    String id;
    String oid;
    String email;
    String userName;
    String password;
    String image;
    String name;
    String title;
    String gender;
    String country;
    String city;
    String description;
    String phone;
    String wiki;

    List<String> organizations;
    List<String> subjectAreas;
    int modelItems;
    int dataItems;
    int conceptualModels;
    int logicalModels;
    int computableModels;

    Date createTime;
}
