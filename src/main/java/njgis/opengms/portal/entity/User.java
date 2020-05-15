package njgis.opengms.portal.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import njgis.opengms.portal.entity.support.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.List;

@Document
@Data
@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
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
    String weChat;
    String faceBook;
    String twitter;
    String weiBo;
    String personPage;
    String institution;

    String lastLoginIp;

    Boolean subscribe=true;

    Introduction introduction;

    List<String> organizations;
    List<String> subjectAreas;
    List<String> researchInterests;

    List<String> articles;
    List<AcademicService> academicServices;
    List<AwardandHonor> awardsHonors;
    List<Conference> conferences;
    List<EducationExperience> educationExperiences;

    UserLab lab = new UserLab();
//    String lab;
    List<Project> projects;

    List<UserTaskInfo> runTask;

    List<FileMeta> fileContainer;

    int modelItems;
    int dataItems;
    int conceptualModels;
    int logicalModels;
    int computableModels;
    int concepts;
    int spatials;
    int templates;
    int units;
    int themes;

    int articlesCount;
    int projectsCount;
    int conferencesCount;

    Affiliation affiliation;
    Date createTime;
    Date updateTime;
    Date lastSendEmailTime;


}
