package njgis.opengms.portal.entity;

import lombok.Data;

import java.util.HashSet;
import java.util.List;

/**
 * @Author mingyuan
 * @Date 2020.08.19 22:29
 */
@Data
public class DataCategorys extends Categorys{
    List<String> dataItemNew;//原先的数据//待删
    List<String> dataHubs;
//    HashSet<String> repository;
}
