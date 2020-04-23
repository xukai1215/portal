package njgis.opengms.portal.entity.support;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FileMeta {
    Boolean isFolder;//是否为文件夹
    Boolean isUserUpload;//是否用户上传

    String id;
    String father;//父文件
    String name;//文件、文件夹名称

    String suffix;
    String url;

    String templateId;//数据模板id

    List<FileMeta> content;//文件夹需要设置该参数
}
