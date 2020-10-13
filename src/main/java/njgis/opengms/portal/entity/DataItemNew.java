package njgis.opengms.portal.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import njgis.opengms.portal.entity.support.AuthorInfo;
import njgis.opengms.portal.entity.support.DataItemMeta;
import njgis.opengms.portal.entity.support.DataMeta;
import njgis.opengms.portal.entity.support.FileMetaUser;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.List;

/**
 * @Author mingyuan
 * @Date 2020.09.02 23:39
 */
public class DataItemNew extends DataItem{
    int frequency;
    public int getFrequency(){
        return frequency;
    }
    public void setFrequency(int fre){
        frequency = fre;
    }
}
