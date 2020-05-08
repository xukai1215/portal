package njgis.opengms.portal.dto.dataItem;

import njgis.opengms.portal.entity.support.DataItemMeta;

import java.util.List;

/**
 * @ClassName DataItemUpdateDTO
 * @Description todo
 * @Author sun_liber
 * @Date 2019/2/13
 * @Version 1.0.0
 */
public class DataItemUpdateDTO {
    String name;
    String image;
    String description;
    String detail;
    String author;

    List<String> keywords;
    List<String> classifications;
    List<String> displays;
    List<String> contributers;

    int shareCount=0;
    int viewCount=0;
    int thumbsUpCount=0;

    DataItemMeta meta;

}
