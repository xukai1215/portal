package njgis.opengms.portal.dto.modelItem;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import njgis.opengms.portal.entity.support.AuthorInfo;
import njgis.opengms.portal.entity.support.Localization;
import njgis.opengms.portal.entity.support.ModelMetadata;
import njgis.opengms.portal.entity.support.Reference;

import java.util.ArrayList;
import java.util.List;

/**
 * @ClassName ModelItemAddDTO
 * @Description todo
 * @Author Kai
 * @Date 2019/2/21
 * @Version 1.0.0
 * TODO
 */

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ModelItemAddDTO {

    String name;
    List<String> alias;
    String uploadImage;
    String description;
    String detail;
    String status;
//    String author;

    List<Localization> localizationList = new ArrayList<>();

    List<AuthorInfo> authorship;
    List<String> classifications;
    List<String> classifications2;
    List<String> keywords;
    List<Reference> references;

    ModelMetadata metaData;

}
