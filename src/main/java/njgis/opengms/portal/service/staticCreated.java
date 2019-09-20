package njgis.opengms.portal.service;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import njgis.opengms.portal.PortalApplication;
import njgis.opengms.portal.entity.DataItem;
import njgis.opengms.portal.entity.ModelItem;
import njgis.opengms.portal.entity.support.AuthorInfo;
import njgis.opengms.portal.utils.ResultUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.stereotype.Component;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import org.thymeleaf.templateresolver.ClassLoaderTemplateResolver;

import java.io.File;
import java.io.FileWriter;
import java.util.List;

@Component
public class staticCreated {//implements ApplicationRunner {

    @Autowired
    DataItemService dataItemService;

    @Autowired
    ModelItemService modelItemService;

    @Autowired
    UserService userService;

    @Value("${htmlLoadPath}")
    private String htmlLoadPath;

    /***
     * 启动项目生成静态html,data items
     * author:lan
     * @param args
     * @throws Exception
     */
    //@Override
    public void run(ApplicationArguments args) throws Exception {

        //生成静态html
        ClassLoaderTemplateResolver resolver = new ClassLoaderTemplateResolver();
        resolver.setPrefix("templates/");
        //模板所在目录，相对于当前classloader的classpath。
        resolver.setSuffix(".html");
        //模板文件后缀
        TemplateEngine templateEngine = new TemplateEngine();
        templateEngine.setTemplateResolver(resolver);



        String path;
        path = PortalApplication.class.getClassLoader().getResource("").getPath();

        File dataitemfile=new File(path+"/templates/dataItems");

        if(!dataitemfile.exists()){
            dataitemfile.mkdir();
        }

        long dataCount=dataItemService.dataCount();

        int all=(int)dataCount;
        int allData=-1;

        if((all/10)==0){
            allData=all/10;
        }else{
            allData=all/10+1;
        }




        for (int j = 0; j <allData ; j++) {

            List<DataItem> allId=dataItemService.generatehtmls(j);

            for (int i = 0; i <allId.size() ; i++) {

                DataItem dataItem=dataItemService.getById(allId.get(i).getId());

                //用户信息

                JSONObject userJson = userService.getItemUserInfoByOid(dataItem.getAuthor());

                //authorship
                String authorshipString="";
                List<AuthorInfo> authorshipList=dataItem.getAuthorship();
                if(authorshipList!=null){
                    for (AuthorInfo author:authorshipList
                            ) {
                        if(authorshipString.equals("")){
                            authorshipString+=author.getName();
                        }
                        else{
                            authorshipString+=", "+author.getName();
                        }

                    }
                }
                //related models
                JSONArray modelItemArray=new JSONArray();
                List<String> relatedModels=dataItem.getRelatedModels();
                if(relatedModels!=null) {
                    for (String oid : relatedModels) {
                        try {
                            ModelItem modelItem = modelItemService.getByOid(oid);
                            JSONObject modelItemJson = new JSONObject();
                            modelItemJson.put("name", modelItem.getName());
                            modelItemJson.put("oid", modelItem.getOid());
                            modelItemJson.put("description", modelItem.getDescription());
                            modelItemJson.put("image", modelItem.getImage().equals("") ? null : htmlLoadPath + modelItem.getImage());
                            modelItemArray.add(modelItemJson);
                        }
                        catch (Exception e){
                            e.printStackTrace();
                        }

                    }
                }

                Context context=new Context();
                context.setVariable("datainfo",ResultUtils.success(dataItem));
                context.setVariable("user",userJson);
                context.setVariable("relatedModels",modelItemArray);
                context.setVariable("authorship",authorshipString);


                FileWriter writer=new FileWriter(path+"/templates/dataItems/"+allId.get(i).getId()+".html");
                templateEngine.process("data_item_info",context,writer);

                writer.flush();
                writer.close();


            }
            System.out.println("generate static html:"+j);

        }



        System.out.println("static data item html completed");




    }
}
