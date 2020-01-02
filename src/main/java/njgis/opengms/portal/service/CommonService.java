package njgis.opengms.portal.service;

import njgis.opengms.portal.PortalApplication;
import njgis.opengms.portal.dao.*;
import njgis.opengms.portal.entity.DataItem;
import njgis.opengms.portal.entity.ModelItem;
import njgis.opengms.portal.enums.ResultEnum;
import njgis.opengms.portal.exception.MyException;
import njgis.opengms.portal.utils.ResultUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import org.thymeleaf.templateresolver.ClassLoaderTemplateResolver;

import javax.mail.internet.MimeMessage;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
public class CommonService {

    @Autowired
    ModelItemDao modelItemDao;

    @Autowired
    ConceptualModelDao conceptualModelDao;

    @Autowired
    LogicalModelDao logicalModelDao;

    @Autowired
    ComputableModelDao computableModelDao;

    @Autowired
    DataItemDao dataItemDao;


    @Value("${local.ip}")
    String ip;

    @Value("${local.port}")
    String port;


    @Autowired
    private JavaMailSender mailSender;
    public Boolean sendEmail(String to,String subject,String content) {
        MimeMessage message = mailSender.createMimeMessage();
        try {
            //true表示需要创建一个multipart message
            MimeMessageHelper helper=new MimeMessageHelper(message,true);
            helper.setFrom("nj_gis@163.com");
            helper.setTo(to);
            helper.setCc("nj_gis@163.com");
            helper.setSubject(subject);
            helper.setText(content,true);
            mailSender.send(message);
            System.out.println("html格式邮件发送成功");
            return true;
        }catch (Exception e){
            System.out.println("html格式邮件发送失败");
            return false;
        }

    }

    public String updateAll(){

        String basePath=CommonService.class.getClassLoader().getResource("").getPath()+"cache/";
        new File(basePath).mkdir();

        List<ModelItem> modelItems=modelItemDao.findAll();
        for(int i=0;i<modelItems.size();i++){
            System.out.println(i);
            String oid=modelItems.get(i).getOid();
            String content=getHTML("modelItem",oid);
            String path=basePath+"modelItem/"+oid+".html";
            File file=new File(path);
            if (!file.getParentFile().exists()) { // 判断文件父目录是否存在
                file.getParentFile().mkdir();
            }
            try{
                if(!file.exists()){
                    file.createNewFile();
                    FileWriter fileWriter =new FileWriter(file);
                    fileWriter.write(content);
                    fileWriter.flush();
                    fileWriter.close();
                }
            }
            catch (Exception e){
                e.printStackTrace();
            }
        }

        return "success";
    }

    String getHTML(String type,String oid){

        RestTemplate restTemplate = new RestTemplate();
        String forObject = restTemplate.getForObject("http://"+ip+":"+port+"/"+type+"/"+oid,String.class);

        return forObject;

    }

    public void staticHtml() throws IOException {

        List<DataItem> alldata=dataItemDao.findAll();

        List<String> id=new ArrayList<>();

        for (int i = 0; i <alldata.size() ; i++) {
            id.add(alldata.get(i).getId());
        }



        //生成静态html
        ClassLoaderTemplateResolver resolver = new ClassLoaderTemplateResolver();
        resolver.setPrefix("templates/");
        //模板所在目录，相对于当前classloader的classpath。
        resolver.setSuffix(".html");
        //模板文件后缀
        TemplateEngine templateEngine = new TemplateEngine();
        templateEngine.setTemplateResolver(resolver);

        List<String> allId=id;

        String path;
        path = PortalApplication.class.getClassLoader().getResource("").getPath();

        File dataitemfile=new File(path+"/templates/dataItems");

        if(!dataitemfile.exists()){
            dataitemfile.mkdir();
        }


        for (int i = 0; i <allId.size() ; i++) {
            Context context=new Context();
            context.setVariable("datainfo",ResultUtils.success(getById(allId.get(i))));


            FileWriter writer=new FileWriter(path+"/templates/dataItems/"+allId.get(i)+".html");
            templateEngine.process("data_item_info",context,writer);

            writer.flush();
            writer.close();


        }
        System.out.println("static data item html ");
    }

    public DataItem getById(String id) {


        return dataItemDao.findById(id).orElseGet(() -> {
            System.out.println("有人乱查数据库！！该ID不存在对象");
            throw new MyException(ResultEnum.NO_OBJECT);
        });


    }





}
