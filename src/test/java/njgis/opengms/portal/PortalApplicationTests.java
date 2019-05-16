package njgis.opengms.portal;

import njgis.opengms.portal.service.CommonService;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.sql.SQLOutput;

@RunWith(SpringRunner.class)
@SpringBootTest
public class PortalApplicationTests {

    @Autowired
    CommonService commonService;


    @Test
    public void contextLoads() {

//        String path=PortalApplicationTests.class.getClassLoader().getResource("").getPath();
//
//        System.out.println(path);
//
//        commonService.updateAll();
        System.out.println("kaishi");

    }

}