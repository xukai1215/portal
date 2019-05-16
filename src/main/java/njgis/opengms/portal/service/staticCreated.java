package njgis.opengms.portal.service;

import njgis.opengms.portal.PortalApplication;
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
import java.util.List;

@Component
public class staticCreated implements ApplicationRunner {

    @Autowired
    DataItemService dataItemService;

    /***
     * 启动项目生成静态html,data items
     * @param args
     * @throws Exception
     */
    @Override
    public void run(ApplicationArguments args) throws Exception {
//        //生成静态html
//        ClassLoaderTemplateResolver resolver = new ClassLoaderTemplateResolver();
//        resolver.setPrefix("templates/");
//        //模板所在目录，相对于当前classloader的classpath。
//        resolver.setSuffix(".html");
//        //模板文件后缀
//        TemplateEngine templateEngine = new TemplateEngine();
//        templateEngine.setTemplateResolver(resolver);
//
//        List<String> allId=dataItemService.generatehtmls();
//
//        String path;
//        path = PortalApplication.class.getClassLoader().getResource("").getPath();
//
//        File dataitemfile=new File(path+"/templates/dataItems");
//
//        if(!dataitemfile.exists()){
//            dataitemfile.mkdir();
//        }
//
//
//        for (int i = 0; i <allId.size() ; i++) {
//            Context context=new Context();
//            context.setVariable("datainfo",ResultUtils.success(dataItemService.getById(allId.get(i))));
//
//
//            FileWriter writer=new FileWriter(path+"/templates/dataItems/"+allId.get(i)+".html");
//            templateEngine.process("data_item_info",context,writer);
//
//            writer.flush();
//            writer.close();
//
//
//        }
//        System.out.println("static data item html ");
//
    }
}
