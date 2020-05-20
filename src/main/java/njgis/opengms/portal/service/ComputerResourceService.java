package njgis.opengms.portal.service;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import njgis.opengms.portal.utils.MyHttpUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URISyntaxException;

/**
 * @Author: wangming
 * @Date: 2020-05-18 22:38
 */
@Service
public class ComputerResourceService {

    @Value("${resourceCenterIpAndPort}")
    private  String resourceCenterIpAndPort;

    public JSONArray getAllComputerResource(){
        String url = "http://" + resourceCenterIpAndPort + "/api/computer/all";
        String result = "";
        try {
             result = MyHttpUtils.GET(url, "UTF-8",null);
        } catch (IOException e) {
            e.printStackTrace();
            result = null;
        } catch (URISyntaxException e) {
            e.printStackTrace();
            result = null;
        }
        if(result == null){
            return null;
        }else {
            JSONObject jResponse = JSON.parseObject(result);
            if(jResponse.getIntValue("code") == 0){
                JSONArray data = jResponse.getJSONArray("data");
                return data;
            }else {
                return null;
            }
        }
    }

    public JSONArray getComputerResourceByUser(String userName){
        String url = "http://" + resourceCenterIpAndPort + "/api/computer/getByUserName?userName=" + userName;
        try {
            String result = MyHttpUtils.GET(url, "UTF-8",null);
            JSONObject jResponse = JSON.parseObject(result);
            if(jResponse.getIntValue("code") == 0){
                JSONArray computerResouceList = jResponse.getJSONArray("data");
                return computerResouceList;
            }
        } catch (Exception e){
            throw new RuntimeException(e.getMessage());
        }
        return null;
    }
}
