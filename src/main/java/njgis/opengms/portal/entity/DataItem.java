package njgis.opengms.portal.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import njgis.opengms.portal.entity.support.AuthorInfo;
import njgis.opengms.portal.entity.support.DataItemMeta;
import njgis.opengms.portal.entity.support.DataMeta;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.List;

/**
 * @ClassName DataItem
 * @Description todo
 * @Author sun_liber
 * @Date 2019/2/13
 * @Version 1.0.0
 */
@Document
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DataItem   {
   @Id
    String id;
    String name;
    String type;
    String contentType;
    String description;
    String detail;
    String author;
    String userName;

    String reference;

    List<String> keywords;
    List<String> classifications;
    List<String> displays;
    List<AuthorInfo> authorship;

    List<String> relatedModels;

    List<DataMeta> dataList;

    Date createTime;
    Date lastModifyTime;

    int shareCount=0;
    int viewCount=0;
    int thumbsUpCount=0;

    List<String> contributers;

    DataItemMeta meta;

    List<Comments> comments;




}
