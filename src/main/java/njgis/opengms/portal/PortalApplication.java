package njgis.opengms.portal;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.scheduling.annotation.EnableAsync;

import java.io.IOException;


@EnableAsync
@SpringBootApplication(exclude = DataSourceAutoConfiguration.class)
public class PortalApplication extends SpringBootServletInitializer {




    public static void main(String[] args) throws IOException {
        SpringApplication.run(PortalApplication.class, args);


    }




    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder builder){
        return builder.sources(PortalApplication.class);
    }
}
