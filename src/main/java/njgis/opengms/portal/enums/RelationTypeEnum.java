package njgis.opengms.portal.enums;

import lombok.AllArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

@AllArgsConstructor
@Document
public enum RelationTypeEnum {

    ConnectedWith(0,"Connected with"),

    EvolvedFrom(1,"Evolved from"),
    BelongsTo(2,"Belongs to"),
    IntegratedInto(3,"Integrated into"),

    Inspires(4,"Inspires"),
    Contains(5,"Contains"),
    Employs(6,"Employs/Depends on"),

    SimilarTo(7,"Similar to"),
    CoexistIn(8,"Coexist in");

    private int number;
    private String text;

    public String getText() {
        return text;
    }

    public int getNumber() {
        return number;
    }

    public static RelationTypeEnum getOpposite(int number){
        RelationTypeEnum relationType = getRelationTypeByNum(number);
        switch (relationType.number){
            case 0:
                return relationType;
            case 1:
                return RelationTypeEnum.Inspires;
            case 2:
                return RelationTypeEnum.Contains;
            case 3:
                return RelationTypeEnum.Employs;
            case 4:
                return RelationTypeEnum.EvolvedFrom;
            case 5:
                return RelationTypeEnum.BelongsTo;
            case 6:
                return RelationTypeEnum.IntegratedInto;
            case 7:
                return RelationTypeEnum.getRelationTypeByNum(7);
            case 8:
                return RelationTypeEnum.getRelationTypeByNum(8);

                default:
                    return RelationTypeEnum.getRelationTypeByNum(0);
        }
    }

    public static RelationTypeEnum getRelationTypeByNum(int number){
        for(RelationTypeEnum itemTypeEnum:RelationTypeEnum.values()){
            if(itemTypeEnum.number==number){
                return itemTypeEnum;
            }
        }
        return null;
    }

    public static RelationTypeEnum getRelationTypeByName(String name){
        for(RelationTypeEnum itemTypeEnum:RelationTypeEnum.values()){
            if(itemTypeEnum.name().toUpperCase().equals(name.toUpperCase())){
                return itemTypeEnum;
            }
        }
        return null;
    }
}
