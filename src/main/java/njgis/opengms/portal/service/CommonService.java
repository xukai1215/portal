package njgis.opengms.portal.service;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import lombok.extern.slf4j.Slf4j;
import njgis.opengms.portal.PortalApplication;
import njgis.opengms.portal.dao.*;
import njgis.opengms.portal.entity.Classification;
import njgis.opengms.portal.entity.DataItem;
import njgis.opengms.portal.entity.ModelItem;
import njgis.opengms.portal.enums.ResultEnum;
import njgis.opengms.portal.exception.MyException;
import njgis.opengms.portal.utils.ResultUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import org.thymeleaf.templateresolver.ClassLoaderTemplateResolver;

import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.io.*;
import java.util.ArrayList;
import java.util.List;

@Slf4j
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

    @Autowired
    ClassificationService classificationService;

    @Value("${resourcePath}")
    private String resourcePath;


    @Value("${local.ip}")
    String ip;

    @Value("${local.port}")
    String port;


    @Autowired
    private JavaMailSender mailSender;


    public String getDetail(String model_detailDesc){
        String detailResult = "";

        int num=model_detailDesc.indexOf("upload/document/");
        if(num==-1||num>20){
            detailResult=model_detailDesc;
        }
        else {
            if(model_detailDesc.indexOf("/")==0){
                model_detailDesc.substring(1);
            }
            //model_detailDesc = model_detailDesc.length() > 0 ? model_detailDesc.substring(1) : model_detailDesc;
            String filePath = resourcePath.substring(0,resourcePath.length()-7) +"/" + model_detailDesc;
            try {
                filePath = java.net.URLDecoder.decode(filePath, "utf-8");
            } catch (UnsupportedEncodingException e) {
                e.printStackTrace();
            }
            if (model_detailDesc.length() > 0) {
                File file = new File(filePath);
                if (file.exists()) {
                    StringBuilder detail = new StringBuilder();
                    try {
                        FileInputStream fileInputStream = new FileInputStream(file);
                        InputStreamReader inputStreamReader = new InputStreamReader(fileInputStream, "UTF-8");
                        BufferedReader br = new BufferedReader(inputStreamReader);
                        String line;
                        while ((line = br.readLine()) != null) {
                            line = line.replaceAll("<h1", "<h1 style='font-size:16px;margin-top:0'");
                            line = line.replaceAll("<h2", "<h2 style='font-size:16px;margin-top:0'");
                            line = line.replaceAll("<h3", "<h3 style='font-size:16px;margin-top:0'");
                            line = line.replaceAll("<p", "<p style='font-size:14px;text-indent:2em'");
                            detail.append(line);
                        }
                        br.close();
                        inputStreamReader.close();
                        fileInputStream.close();
                    } catch (FileNotFoundException e) {
                        e.printStackTrace();
                    } catch (UnsupportedEncodingException e) {
                        e.printStackTrace();
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                    detailResult = detail.toString();
                } else {
                    detailResult = model_detailDesc;
                }
            } else {
                detailResult = model_detailDesc;
            }
        }

        return detailResult;
    }

    public JSONArray getClassifications(List<String> classifications){
        JSONArray classResult=new JSONArray();

        for(int i=0;i<classifications.size();i++){

            JSONArray array=new JSONArray();
            String classId=classifications.get(i);

            do{
                Classification classification=classificationService.getByOid(classId);

                JSONObject jsonObject = new JSONObject();
                jsonObject.put("name",classification.getNameEn());
                jsonObject.put("oid",classification.getOid());

                array.add(jsonObject);
                classId=classification.getParentId();
            }while(classId!=null);

            JSONArray array1=new JSONArray();
            for(int j=array.size()-1;j>=0;j--){
                array1.add(array.get(j));
            }

            classResult.add(array1);

        }
        System.out.println(classResult);
        return classResult;
    }

    public Boolean sendEmail(String to,String subject,String content) {
        MimeMessage message = mailSender.createMimeMessage();
        try {
            //true表示需要创建一个multipart message
            MimeMessageHelper helper=new MimeMessageHelper(message,true);
            InternetAddress internetAddress=new InternetAddress("nj_gis@163.com","OpenGMS Team","UTF-8");
            helper.setFrom(internetAddress);
            helper.setTo(to);
            helper.setCc("nj_gis@163.com");
            helper.setSubject(subject);
            helper.setText(content,true);
            mailSender.send(message);
            log.info("html格式邮件发送成功");
            return true;
        }catch (Exception e){
            log.error("html格式邮件发送失败");
            return false;
        }

    }

    public void sendEmailWithImg(String name,String to, String subject, String content, JSONArray imageList){

        MimeMessage mimeMessage = mailSender.createMimeMessage();
        try {
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);
            InternetAddress internetAddress=new InternetAddress("nj_gis@163.com",name,"UTF-8");
            helper.setFrom(internetAddress);
            helper.setTo(to);
            helper.setCc("nj_gis@163.com");
            helper.setSubject(subject);
            helper.setText(content, true);

            // 注意addInline()中资源名称 hello 必须与 text正文中cid:hello对应起来
            for(int i=0;i<imageList.size();i++) {
                JSONObject imgObj=imageList.getJSONObject(i);
                FileSystemResource file = new FileSystemResource(new File(imgObj.getString("path")));
                helper.addInline(imgObj.getString("name"), file);
            }

            mailSender.send(mimeMessage);
            log.info("嵌入静态资源的邮件已发送。");

        } catch (Exception e) {

            log.error("发送嵌入静态资源的邮件时发生异常了！", e);

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
