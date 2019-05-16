package njgis.opengms.portal.entity;

import lombok.Data;
import njgis.opengms.portal.entity.support.TaskData;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.List;

@Document
@Data
public class Concept {
    @Id
    String id;
    String oid;
    String name;
    String alias;
    String parentId;
    String xml;
    String description_ZH;
    String description_EN;
    String name_ZH;
    String name_EN;

    Date createTime;

    int loadCount;

    List<String> related;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getOid() {
        return oid;
    }

    public void setOid(String oid) {
        this.oid = oid;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAlias() {
        return alias;
    }

    public void setAlias(String alias) {
        this.alias = alias;
    }

    public String getParentId() {
        return parentId;
    }

    public void setParentId(String parentId) {
        this.parentId = parentId;
    }

    public String getXml() {
        return xml;
    }

    public void setXml(String xml) {
        this.xml = xml;
    }

    public String getDescription_ZH() {
        return description_ZH;
    }

    public void setDescription_ZH(String description_ZH) {
        this.description_ZH = description_ZH;
    }

    public String getDescription_EN() {
        return description_EN;
    }

    public void setDescription_EN(String description_EN) {
        this.description_EN = description_EN;
    }

    public String getName_ZH() {
        return name_ZH;
    }

    public void setName_ZH(String name_ZH) {
        this.name_ZH = name_ZH;
    }

    public String getName_EN() {
        return name_EN;
    }

    public void setName_EN(String name_EN) {
        this.name_EN = name_EN;
    }

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    public int getLoadCount() {
        return loadCount;
    }

    public void setLoadCount(int loadCount) {
        this.loadCount = loadCount;
    }

    public List<String> getRelated() {
        return related;
    }

    public void setRelated(List<String> related) {
        this.related = related;
    }
}
