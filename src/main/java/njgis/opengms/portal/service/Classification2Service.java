package njgis.opengms.portal.service;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.mongodb.client.MongoCollection;
import njgis.opengms.portal.dao.Classification2Dao;
import njgis.opengms.portal.dao.ModelDao;
import njgis.opengms.portal.entity.Classification;
import njgis.opengms.portal.enums.ResultEnum;
import njgis.opengms.portal.exception.MyException;
import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @ClassName ClassificationService
 * @Description todo
 * @Author Kai
 * @Date 2019/2/21
 * @Version 1.0.0
 * TODO 分类查询
 */
@Service
public class Classification2Service {

    private ModelDao modelDao=new ModelDao();
    JSONArray modelRepositoryTreeArray = new JSONArray();
    int index = 0;

    @Autowired
    Classification2Dao classification2Dao;

    public Classification getByOid(String id){
        try {
            return classification2Dao.findFirstByOid(id);
        }
        catch (Exception e)  {
            System.out.println("有人乱查数据库！！该ID不存在Classification对象");
            throw new MyException(ResultEnum.NO_OBJECT);
        }
    }

    public JSONArray getTree(){
        try {
            modelRepositoryTreeArray=new JSONArray();
            MongoCollection<Document> col=modelDao.GetCollection("Portal", "classification");
            Classification classification;

            traverseJson(col,"fc236e9d-3ae9-4594-b9b8-de0ac336a1d7",null);//Earth System

            index=0;
            traverseJson(col,"44068d3f-533a-4567-9bfd-07eea9d9e8af",null);//Physical Geography

            index=0;
            traverseJson(col,"3a76212e-c4f2-4a99-ab98-51ae5e7cf7e0",null);//Human Geography

//            index=0;
//            traverseJson(col,"fb5cd575-bdcc-4c5b-855b-e71fe0ea5a09",null);//Ecology

            index=0;
            traverseJson(col,"3afc51dc-930d-4ab5-8a59-3e057b7eb086",null);//Geographic Information Analysis

            return modelRepositoryTreeArray;
        }
        catch (Exception e)  {
            System.out.println("分类树生成失败");
            throw new MyException(ResultEnum.ERROR);
        }
    }

    private void traverseJson(MongoCollection<Document> col, String rootId, JSONObject jsonObject) {
        Classification classification= classification2Dao.findFirstByOid(rootId);
//        Document document = modelDao.RetrieveDocById(col,rootId);
        JSONObject modelRepositoryTreeObj = new JSONObject();
        String nameEn=classification.getNameEn();
        String nameCn=classification.getNameCn();
        modelRepositoryTreeObj.put("id",rootId);
        modelRepositoryTreeObj.put("nameCn",nameCn);
        modelRepositoryTreeObj.put("text",nameEn);
//        if(index==0){
//            modelRepositoryTreeObj.put("open",true);
//        }else{
            modelRepositoryTreeObj.put("open",false);
//        }
        List<String> children = classification.getChildrenId();
//        if(children.size()!=0){
//            modelRepositoryTreeObj.put("selectable",false);
//        }else{
            modelRepositoryTreeObj.put("selectable",true);
//        }
        if(children.size()>0){
            JSONArray childrenArray = new JSONArray();
            modelRepositoryTreeObj.put("nodes",childrenArray);
            for(int i=0;i<children.size();i++){
                index = i;
                String childId=children.get(i).toString();
                traverseJson(col,childId,modelRepositoryTreeObj);
            }
        }
        if(jsonObject!=null){
            JSONArray parentChildren = jsonObject.getJSONArray("nodes");
            parentChildren.add(modelRepositoryTreeObj);
        }else{
            modelRepositoryTreeArray.add(modelRepositoryTreeObj);
        }
    }

}
