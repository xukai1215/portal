package njgis.opengms.portal.entity;

import lombok.Data;
import njgis.opengms.portal.entity.support.*;
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
    String researchInterests;
    String weChat;
    String faceBook;
    String twitter;
    String weiBo;
    String personPage;


    List<String> organizations;
    List<String> subjectAreas;

    List<Article> articles;
    List<AcademicService> academicServices;
    List<AwardandHonor> awardsHonors;
    List<Conference> conferences;
    List<EducationExperience> educationExperiences;
    List<Introduction> introductions;
    List<Lab> labs;
    List<ResearchProjects> researchProjects;

    int modelItems;
    int dataItems;
    int conceptualModels;
    int logicalModels;
    int computableModels;
    int concepts;
    int spatials;
    int templates;
    int units;

    Date createTime;
}
