package njgis.opengms.portal;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.scheduling.annotation.EnableAsync;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

import java.io.IOException;


@EnableAsync
@EnableSwagger2
@EnableCaching
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
