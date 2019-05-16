package njgis.opengms.portal.controller.rest;

import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoCursor;
import com.mongodb.client.model.Filters;
import njgis.opengms.portal.bean.JsonResult;
import njgis.opengms.portal.dao.ModelDao;
import njgis.opengms.portal.dao.ModelItemDao;
import njgis.opengms.portal.entity.ModelItem;
import njgis.opengms.portal.service.ClassificationService;
import njgis.opengms.portal.utils.ResultUtils;
import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;

/**
 * @ClassName ClassificationRestController
 * @Description todo
 * @Author Kai
 * @Date 2019/2/21
 * @Version 1.0.0
 * TODO
 */

@RestController
@RequestMapping(value = "/classification")
public class ClassificationRestController {

    @Autowired
    ClassificationService classificationService;

    @Autowired
    ModelItemDao modelItemDao;


    @RequestMapping (value="/{id}",method = RequestMethod.GET)
    JsonResult getId(@PathVariable("id") String id){
        return ResultUtils.success(classificationService.getByOid(id));
    }

    @RequestMapping (value="/getTree",method = RequestMethod.GET)
    JsonResult getTree(){
        return ResultUtils.success(classificationService.getTree());
    }

    @RequestMapping (value="/addToAnother",method = RequestMethod.GET)
    JsonResult addToAnother(){
        List<ModelItem> modelItems=modelItemDao.findAllByClassificationsIn("27910587-c1c5-4317-acf9-f3b062c37399");

        for (ModelItem modelItem:modelItems
             ) {
            List<String> cls=new ArrayList<>();
            cls.add("10bef187-00bf-4cea-b192-bf1465a265b1");
            modelItem.setClassifications(cls);
            modelItemDao.save(modelItem);
        }

        return ResultUtils.success();
    }

    @RequestMapping (value="/change",method = RequestMethod.GET)
    JsonResult change(){

        ModelDao modelDao=new ModelDao();
        MongoCollection<Document> ComputerNodeCol = modelDao.GetCollection("Portal0424_2134", "modelItem2304");
        MongoCursor<Document> cursor=ComputerNodeCol.find(Filters.eq("classifications.", "c9dc5ae0-2882-461a-a9b4-282ae0ef984f")).iterator();
        int count=1;
        while(cursor.hasNext()){
            System.out.println(count++);
            Document document=cursor.next();
            String oid=document.getString("oid");
            ModelItem modelItem=modelItemDao.findFirstByOid(oid);
            List<String> clas=modelItem.getClassifications();
            List<String> newClas=new ArrayList<>();
            newClas.add("1a59f012-0659-479d-a183-b74921c67a08");
            newClas.add(clas.get(0));
            modelItem.setClassifications(newClas);
            modelItemDao.save(modelItem);

        }




//        String classification="";//
//        List<String> list=new ArrayList<>();
//        list.add("7cf1aa10-58c0-4329-9a1d-9ace0cc2ba33");
//        list.add("51574401-09d9-4819-aa3e-17994e0396fd");
//        list.add("e9590d02-c1bf-4f92-878c-4f2857fc9c33");
//        list.add("64eb0340-6312-4549-9671-6bd635d5a8b3");
//        list.add("bfa6147d-700e-4e06-978e-c9f0266608a8");
//        list.add("0be6cd3b-a459-45df-b7e7-b2fb23aafd12");
//        list.add("9efcb0d7-9374-4fa4-b1c3-8a9409320813");
//
//
//        List<ModelItem> modelItems=modelItemDao.findAllByClassificationsIn(classification);
//        for (ModelItem modelItem:modelItems
//             ) {
//            List<String> cls=modelItem.getClassifications();
//            List<String> newCls=new ArrayList<>();
//            newCls.add("1a59f012-0659-479d-a183-b74921c67a08");
//            for (String cla:cls
//                 ) {
//
//                newCls.add(cla);
//
////                if(cla.equals(classification)){
////                    newCls.add("00190eef-017f-42b3-8500-baf612083557");
////                }
//
//
////                boolean flag=false;
////                for (String l:list
////                     ) {
////                    if(cla.equals(l)){
////                        newCls.add("60d4f9cf-df22-4313-8b53-c7c314455f2d");
////                        flag=true;
////                        break;
////                    }
////                }
////                if(!flag) {
////                    newCls.add(cla);
////                }
//            }
////
//
//
//            modelItem.setClassifications(newCls);
//            modelItem.setViewCount(modelItem.getViewCount());
//            modelItemDao.save(modelItem);
//        }

        return ResultUtils.success();
    }

    @RequestMapping (value="classificationAdjust",method = RequestMethod.GET)
    JsonResult adjust(){
        ModelDao modelDao=new ModelDao();
        List<ModelItem> modelItems=modelItemDao.findAll();
        MongoCollection<Document> ComputerNodeCol = modelDao.GetCollection("Portal0424", "classification");

        for(int i=0;i<modelItems.size();i++){
            System.out.println(i);
            ModelItem modelItem=modelItems.get(i);
            List<String> modelClasses=modelItem.getClassifications();
            List<String> newModelClasses=new ArrayList<>();
            Document classification=null;
            ArrayList children=new ArrayList();
            for(int j=0;j<modelClasses.size();j++) {
                String modelClass=modelClasses.get(j);
                boolean flag = false;

                String[] Classifications={
                        "652bf1f8-2f3e-4f93-b0dc-f66505090873",
                        "5e324fc8-93d1-40bb-a2e4-24d2dff68c4b",
                        "76cb072d-8f56-4e34-9ea6-1a95ea7f474b",
                        "eccbe4e1-32f6-490e-9bf7-ae774be472ac",
                        "e6984ef1-4f69-4f6e-be2b-c77f917de5a5",
                        "944d3c82-ddeb-4b02-a56c-44eb419ecc13",
                        "5e184a2e-2579-49bf-ebac-7c28b24a38e3",
                        "ab1f3806-1ed8-4fd9-ff06-b6c2ca020ae9",
                        "d7f96d42-b6c5-4984-81f6-6589cff37285",
                        "b74f0952-143b-4af7-8fa6-ad9bf4787cb9"};
                for (String cls:Classifications) {
                    if(!flag) {
                        flag = isInThisClassification(ComputerNodeCol, modelClass, newModelClasses, cls);
                    }
                    else {
                        break;
                    }
                }

                if(!flag){
                    boolean exist=false;
                    for (String newClass:newModelClasses) {
                        if(newClass.equals(modelClass)){
                            exist=true;
                            break;
                        }
                    }
                    if(!exist)
                    {
                        newModelClasses.add(modelClass);
                    }
                }
            }

            modelItem.setClassifications(newModelClasses);
            modelItemDao.save(modelItem);
        }



        return ResultUtils.success();
    }

    private boolean isInThisClassification(MongoCollection<Document> ComputerNodeCol,String modelClass,List<String> newModelClasses,String thisClassification){
        boolean flag=false;
        Document classification = ComputerNodeCol.find(Filters.eq("oid", thisClassification)).first();//Shapes
        ArrayList children = classification.get("childrenId", ArrayList.class);
        for (int k = 0; k < children.size(); k++) {
            if (modelClass.equals(children.get(k).toString())) {
                boolean exist=false;
                for (String newClass:newModelClasses) {
                    if(newClass.equals(modelClass)){
                        exist=true;
                        break;
                    }
                }
                if(!exist)
                {
                    newModelClasses.add(modelClass);
                }
                flag = true;
                break;
            }
        }

        return flag;
    }
}
