package njgis.opengms.portal.utils;

import com.fasterxml.jackson.databind.util.ClassUtil;
import lombok.extern.slf4j.Slf4j;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

@Slf4j
public class PropertyUtils {

    private static Properties props;

    static {
        loadProps();
    }

    synchronized static private void loadProps() {
        log.info("start to load properties.......");
        props = new Properties();
        InputStream in = null;
        try {

            in = ClassUtil.class.getClassLoader().getResourceAsStream("application.properties");
            props.load(in);
            String name = getProperty("spring.profiles.active");
            if (name.equals("dev")) {
                in = ClassUtil.class.getClassLoader().getResourceAsStream("application-dev.properties");
            } else if (name.equals("prod")) {
                in = ClassUtil.class.getClassLoader().getResourceAsStream("application-prod.properties");
            }
            props.load(in);
            log.info(name);

        } catch (FileNotFoundException e) {
            log.error("properties not found!");
        } catch (IOException e) {
            log.error("IOException");
        } finally {
            try {
                if (null != in) {
                    in.close();
                }
            } catch (IOException e) {
                log.error("properties close Exception!");
            }
        }
        // logger.info(props);
        log.info("load properties over...........");
    }

    public static String getProperty(String key) {
        if (null == props) {
            loadProps();
        }
        return props.getProperty(key);
    }
}
