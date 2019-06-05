package njgis.opengms.portal;

import net.coobird.thumbnailator.Thumbnails;
import njgis.opengms.portal.dao.ModelItemDao;
import njgis.opengms.portal.dao.UserDao;
import njgis.opengms.portal.entity.ModelItem;
import njgis.opengms.portal.entity.User;
import njgis.opengms.portal.service.CommonService;
import njgis.opengms.portal.utils.Utils;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.io.IOException;
import java.sql.SQLOutput;
import java.util.List;
import java.util.UUID;

@RunWith(SpringRunner.class)
@SpringBootTest
public class PortalApplicationTests {

    @Autowired
    CommonService commonService;

    @Autowired
    UserDao userDao;

    @Autowired
    ModelItemDao modelItemDao;

    @Value("${resourcePath}")
    private String resourcePath;


    @Test
    public void contextLoads() {

//        String path=PortalApplicationTests.class.getClassLoader().getResource("").getPath();
//
//        System.out.println(path);
//
//        commonService.updateAll();
        System.out.println("kaishi");

    }

    @Test
    public void base64ToImage(){
        List<ModelItem> modelItems=modelItemDao.findAll();
        for(int i=0;i<modelItems.size();i++){
            ModelItem modelItem=modelItems.get(i);
            String imgStr=modelItem.getImage();
            if(imgStr.indexOf("data:image")!=-1) {
                String path="/modelItem/" + UUID.randomUUID().toString() + ".jpg";
                imgStr = imgStr.split(",")[1];
                Utils.base64StrToImage(imgStr, resourcePath + path);
                try {
                    Thumbnails.of("原图文件的路径")
                            .scale(1f)
                            .outputQuality(0.5f)
                            .toFile("压缩后文件的路径");

                }
                catch (IOException e){
                    System.out.println(e);
                }

                modelItem.setImage(path);
                modelItemDao.save(modelItem);
                System.out.println(modelItem.getOid()+modelItem.getName()+modelItem.getImage());
            }
        }

//        List<User> users=userDao.findAll();
//        for(int i=0;i<users.size();i++){
//            User user=users.get(i);
//            String imgStr=user.getImage();
//            if(imgStr.indexOf("data:image")!=-1) {
//                String path="/user/" + UUID.randomUUID().toString() + ".jpg";
//                imgStr = imgStr.split(",")[1];
//                Utils.base64StrToImage(imgStr, resourcePath + path);
//                user.setImage(path);
//                userDao.save(user);
//                System.out.println(user.getOid()+user.getUserName()+user.getImage());
//            }
//        }


    }

}