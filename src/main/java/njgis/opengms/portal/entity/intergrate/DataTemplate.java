package njgis.opengms.portal.entity.intergrate;

import lombok.Data;

/**
 * @Author: wangming
 * @Date: 2019-11-15 19:46
 */
@Data
public class DataTemplate {

    private String state;

    private String event;

    private String value;

    private String dataId;

    private String type;

    //标记这个数据是否已经准备好,设置默认值
    private boolean isPrepared = false;

    private String tag;
    private String suffix;
}
