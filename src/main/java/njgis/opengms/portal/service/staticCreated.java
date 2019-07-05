package njgis.opengms.portal.service;

import njgis.opengms.portal.PortalApplication;
import njgis.opengms.portal.dao.CategoryDao;
import njgis.opengms.portal.entity.Categorys;
import njgis.opengms.portal.entity.DataItem;
import njgis.opengms.portal.utils.ResultUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import org.thymeleaf.templateresolver.ClassLoaderTemplateResolver;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Component
public class staticCreated implements ApplicationRunner {

    @Autowired
    DataItemService dataItemService;
    @Autowired
    CategoryService categoryService;


    @Autowired
    CategoryDao categoryDao;

    /***
     * 启动项目生成静态html,data items
     * author:lan
     * @param args
     * @throws Exception
     */
    @Override
    public void run(ApplicationArguments args) throws Exception {


        //生成静态dataitem页面
//         generateStaticDataItemsInfoHtml();

        //生成条目dataitem静态页面
//        generateStaticDataItemsHtml();





    }


    public void generateStaticDataItemsInfoHtml()  throws Exception{
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

        File dataitemfile=new File(path+"/templates/dataItemsInfo");

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

            List<DataItem> allId=dataItemService.generateDataItemInfoHtmls(j);

            for (int i = 0; i <allId.size() ; i++) {
                Context context=new Context();
                context.setVariable("datainfo",ResultUtils.success(dataItemService.getById(allId.get(i).getId())));


                FileWriter writer=new FileWriter(path+"/templates/dataItemsInfo/"+allId.get(i).getId()+".html");
                templateEngine.process("data_item_info",context,writer);

                writer.flush();
                writer.close();


            }
            System.out.println("generate static html:"+j);

        }



        System.out.println("static dataiteminfo html completed");

    }




    public void generateStaticDataItemsHtml() throws IOException {






        List<Categorys> allCategory=new ArrayList<>();
        allCategory=categoryDao.findAll();

        for (int k = 0; k <allCategory.size() ; k++) {


          categoryService.categoryDataItem(allCategory.get(k).getId());

        }


        System.out.println("static dataitems html completed");















    };




}
