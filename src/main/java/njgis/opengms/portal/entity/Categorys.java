package njgis.opengms.portal.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;
@Document
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Categorys {
    @Id
    String id;
    List<String> dataItem;//原先的数据//待删
    List<String> dataRepository;//个人文件
    List<String> dataNetwork;//就地共享数据
    List<String> processingApplication;
    List<String> visualApplication;
    String category;
    String parentCategory;
}
