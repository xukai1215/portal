package njgis.opengms.portal.dto.dataApplication;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import njgis.opengms.portal.entity.support.AuthorInfo;

import java.util.List;

/**
 * @Author mingyuan
 * @Date 2020.07.30 19:09
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class DataApplicationDTO {
    String name;
    String description;
    String detail;
    List<String> classifications;

    //Public, Discoverable or Private
    String status;
    String operation;
    String type;

    //authorship
    List<AuthorInfo> authorship;

    String contentType;
    String url;//Third-party Web-Service Link
    String method;  // processing visualization
}
