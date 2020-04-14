package njgis.opengms.portal.enums;

import lombok.AllArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

@AllArgsConstructor
@Document
public enum ItemTypeEnum {

    DataItem(0),

    ModelItem(1),
    ConceptualModel(2),
    LogicalModel(3),
    ComputableModel(4),

    Concept(5),
    SpatialReference(6),
    Template(7),
    Unit(8),

    Theme(9);

    private int number;

    public static ItemTypeEnum getItemTypeByNum(int number){
        for(ItemTypeEnum itemTypeEnum:ItemTypeEnum.values()){
            if(itemTypeEnum.number==number){
                return itemTypeEnum;
            }
        }
        return null;
    }

    public static ItemTypeEnum getItemTypeByName(String name){
        for(ItemTypeEnum itemTypeEnum:ItemTypeEnum.values()){
            if(itemTypeEnum.name().toUpperCase().equals(name.toUpperCase())){
                return itemTypeEnum;
            }
        }
        return null;
    }
}
