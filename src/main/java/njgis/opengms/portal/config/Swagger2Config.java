package njgis.opengms.portal.config;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;


@Configuration
@EnableSwagger2
public class Swagger2Config {

    @Value("${swagger.enable}")
    private boolean enableSwagger;

    @Bean
    public Docket customImplementation(){
        return new Docket(DocumentationType.SWAGGER_2)
//                .apiInfo(new ApiInfoBuilder().build())
                .enable(enableSwagger); //<--- Flag to enable or disable possibly loaded using a property file
//                .includePatterns(".*pet.*");
    }

    private ApiInfo apiInfo() {
        return new ApiInfoBuilder()
                .title("《SwaggerDemo的演示案例--》")//标题
                .description("description:项目摘要")//描述
                .termsOfServiceUrl("http://www.google.com.hk")//（不可见）条款地址，公司内部使用的话不需要配
//                .contact(new Contact("Devil", "https://blog.csdn.net/qq_36911145", "969430169@qq.com"))//作者信息
                .version("6.6.6")//版本号
                .build();
    }

}

