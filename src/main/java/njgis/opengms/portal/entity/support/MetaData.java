package njgis.opengms.portal.entity.support;

import lombok.Data;

/**
 * @Author mingyuan
 * @Date 2020.12.16 22:56
 */
@Data
public class MetaData {
    String dataPath;
    String dataTime;
    String fileDataType;
    String[] keywords;
    String security;
    String uid;
}
