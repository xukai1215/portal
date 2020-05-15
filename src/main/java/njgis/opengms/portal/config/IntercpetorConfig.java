package njgis.opengms.portal.config;


import njgis.opengms.portal.interceptor.AuthorityInterceptor;
import njgis.opengms.portal.interceptor.ItemViewRecordInterceptor;
import njgis.opengms.portal.interceptor.ModelAndViewInterceptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;


@Configuration
public class IntercpetorConfig implements WebMvcConfigurer {

    @Autowired
    private ModelAndViewInterceptor modelAndViewInterceptor;

    @Autowired
    private AuthorityInterceptor authorityInterceptor;

    @Autowired
    private ItemViewRecordInterceptor itemViewRecordInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(modelAndViewInterceptor).addPathPatterns("/**").excludePathPatterns("/static");
        registry.addInterceptor(authorityInterceptor).addPathPatterns("/**").excludePathPatterns("/static");
        registry.addInterceptor(itemViewRecordInterceptor).addPathPatterns("/modelItem/**","/conceptualModel/**","/logicalModel/**","/computableModel/**","/dataItem/**","/repository/**").excludePathPatterns("/static");
    }
}

