package njgis.opengms.portal.service;

import njgis.opengms.portal.PortalApplication;
import njgis.opengms.portal.dao.CategoryDao;
import njgis.opengms.portal.dao.DataItemDao;
import njgis.opengms.portal.dao.UserDao;
import njgis.opengms.portal.entity.Categorys;
import njgis.opengms.portal.entity.DataItem;
import njgis.opengms.portal.entity.User;
import njgis.opengms.portal.enums.ResultEnum;
import njgis.opengms.portal.exception.MyException;
import njgis.opengms.portal.utils.ResultUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import org.thymeleaf.templateresolver.ClassLoaderTemplateResolver;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class CategoryService {

    @Autowired
    CategoryDao categoryDao;

    @Autowired
    DataItemDao dataItemDao;

    @Autowired
    UserDao userDao;

    @Autowired
    DataItemService dataItemService;

    public DataItem getByDataItemId(String id) {



        return dataItemDao.findById(id).orElseGet(() -> {

            System.out.println("有人乱查数据库！！该ID不存在对象:"+id);

            throw new MyException(ResultEnum.NO_OBJECT);

        });

    }

    public Categorys getByCategoryId(String id) {



        return categoryDao.findById(id).orElseGet(() -> {

            System.out.println("有人乱查数据库！！该ID不存在对象:"+id);

            throw new MyException(ResultEnum.NO_OBJECT);

        });

    }
    public void categoryDataItem (String cateId)throws IOException {


        Categorys categorys=getByCategoryId(cateId);

        List<DataItem> categoryDataItem=new ArrayList<>();

        List<String> categoryDataItemId=new ArrayList<>();



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


        User user;
        List<DataItem> tenDataItem=new ArrayList<>();
        DataItem dataItem=new DataItem();

        //当每类下的数据条目id数组不为空时，即滤掉数据库中像EarthSystem这种大类
        if(categorys.getDataItem().size()!=0){

            categoryDataItemId=categorys.getDataItem();


            for (int j = 0,p=0; j <categoryDataItemId.size(); j++) {

                Context context=new Context();

                if(j!=0&&j%10==0||j==categoryDataItemId.size()-1){

                    context.setVariable("dataitems",tenDataItem);
                    context.setVariable("dataCateCount",categoryDataItemId.size());
                    context.setVariable("currentPage",p);

                    tenDataItem=new ArrayList<>();


                    FileWriter writer=new FileWriter(path+"/templates/dataItems/"+categorys.getId()+"&page="+p+".html");
                    templateEngine.process("data_items",context,writer);

                    writer.flush();
                    writer.close();

                    System.out.println(categorys.getId()+"&page="+p+".html");

                    p++;
                }

                user=userDao.findFirstByOid(dataItemService.getById(categoryDataItemId.get(j)).getAuthor());

                dataItem=dataItemService.getById(categoryDataItemId.get(j));

                //把dataitem中的author，依据id查到name，并替换
                dataItem.setAuthor(user.getName());


                tenDataItem.add(dataItem);






            }


        }









    }





}
