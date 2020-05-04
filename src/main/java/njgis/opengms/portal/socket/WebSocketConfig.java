package njgis.opengms.portal.socket;

/**
 * @Auther mingyuan
 * @Data 2020.04.25 16:46
 */

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.server.standard.ServerEndpointExporter;

@Configuration
public class WebSocketConfig {

//    部署时注释掉！！！
    @Bean
    public ServerEndpointExporter serverEndpointExporter() {
        return new ServerEndpointExporter();
    }

}
