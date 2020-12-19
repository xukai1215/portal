package njgis.opengms.portal.service;

import com.sun.deploy.net.HttpUtils;
import njgis.opengms.portal.dao.DataNodeContentDao;
import njgis.opengms.portal.entity.DataNodeContent;
import njgis.opengms.portal.utils.MyHttpUtils;
import njgis.opengms.portal.utils.XmlTool;
import org.dom4j.DocumentException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URISyntaxException;
import java.net.URL;
import java.net.URLEncoder;

@Service
public class DataServerService {
    @Autowired
    DataNodeContentDao dataNodeContentDao;
    @Value("${dataServerManager}")
    private String dataServerManager;

    public String getNodeData(String token, String id,String userId) throws IOException, URISyntaxException, DocumentException {
        DataNodeContent dataNodeContent = new DataNodeContent();
        String dataUrl = null;
        if(dataNodeContentDao.findAllByIdAndToken(token,id)!=null){
            dataNodeContent =dataNodeContentDao.findAllByIdAndToken(token,id);

            if(dataNodeContent.getUrl()!=null){
                dataUrl = dataNodeContent.getUrl();
                URL pathUrl = new URL(dataUrl);
                HttpURLConnection urlcon = (HttpURLConnection) pathUrl.openConnection();
                if(urlcon.getResponseCode()>=400){
                    return dataUrl;
                }
            }
        }

        String url = "http://"+ dataServerManager +"/fileObtain" + "?token=" + URLEncoder.encode(token) + "&id=" + id;;
        String xml = MyHttpUtils.GET(url,"UTF-8",null);

        dataUrl = XmlTool.xml2Json(xml).getString("url");

        dataNodeContent.setId(id);
        dataNodeContent.setToken(token);
        dataNodeContent.setUserId(userId);
        dataNodeContent.setUrl(dataUrl);
        dataNodeContent.setType("data");

        return dataUrl;
    }
}
