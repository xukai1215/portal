package njgis.opengms.portal.utils;

import org.apache.commons.io.FileUtils;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;

/**
 * Created by wang ming on 2019/5/14.
 */
public class MyFileUtils {

    public static InputStream getInputStream(File file) {
        try {
            return FileUtils.openInputStream(file);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }
}
