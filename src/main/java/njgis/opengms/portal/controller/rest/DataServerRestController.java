package njgis.opengms.portal.controller.rest;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import lombok.extern.slf4j.Slf4j;
import njgis.opengms.portal.bean.JsonResult;
import njgis.opengms.portal.utils.MyHttpUtils;
import njgis.opengms.portal.utils.ResultUtils;
import njgis.opengms.portal.utils.XmlTool;
import org.dom4j.DocumentException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpRequest;
import org.springframework.web.HttpRequestHandler;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.net.URISyntaxException;
import java.net.URLEncoder;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping(value = "/dataServer")
public class DataServerRestController {
    @Value("${dataServerManager}")
    private String dataServerManager;


    @RequestMapping(value = "/getAllNodes", method = RequestMethod.GET)
    public JsonResult getAllNodes() throws DocumentException {

        String url = dataServerManager+"/onlineNodes";

        RestTemplate restTemplate = new RestTemplate();
        String xml = restTemplate.getForObject(url,String.class);

        if(xml.equals("err")){
            return ResultUtils.error(-1,"err");
        }

        JSONObject jsonObject = XmlTool.xml2Json(xml);

        return ResultUtils.success(jsonObject);
    }

    @RequestMapping(value = "/getUserNodes", method = RequestMethod.GET)
    public JsonResult getAllNodes(HttpServletRequest request) throws DocumentException {

        HttpSession session = request.getSession();

        String userName = session.getAttribute("uid").toString();
        if(userName==null){
            return ResultUtils.error(-1, "no login");
        }else{
            String url = "http://" + dataServerManager+"/onlineNodes";

            RestTemplate restTemplate = new RestTemplate();
            String xml = restTemplate.getForObject(url,String.class);

            if(xml.equals("err")){
                return ResultUtils.error(-1,"err");
            }

            JSONObject jsonObject = XmlTool.xml2Json(xml);

            JSONArray nodes = jsonObject.getJSONArray("onlineServiceNodes");
            JSONObject userNode = new JSONObject();
            for(int i=0;i<nodes.size();i++){
                JSONObject node = (JSONObject) nodes.get(i);
                if(node.getString("node").equals(userName)){
                    userNode = node;
                }
            }

            return ResultUtils.success(userNode);
        }



    }

    @RequestMapping(value = "/getNodeContent", method = RequestMethod.GET)
    public JsonResult getNodesProcessings(@RequestParam("token") String token,@RequestParam("type") String type,HttpServletRequest request) throws IOException, URISyntaxException, DocumentException {

        HttpSession session = request.getSession();

        String userName = session.getAttribute("uid").toString();
        if(userName==null){
            return ResultUtils.error(-1, "no login");
        }else {
            //因为dataservice不提供直接查询接口，因此只能先找token再遍历
            String baseUrl = "http://" + dataServerManager + "/onlineNodesAllPcs";
            JSONArray j_nodes = new JSONArray();

            String url = baseUrl + "?token=" + URLEncoder.encode(token) + "&type=" + type;
            String xml = MyHttpUtils.GET(url, "utf-8", null);
            JSONObject jsonObject = XmlTool.xml2Json(xml);
            JSONArray j_processings = new JSONArray();
            JSONArray result = new JSONArray();
            try {
                j_processings = jsonObject.getJSONArray("AvailablePcs");
                for (int i = 0; j_processings != null && i < j_processings.size(); i++) {
                    JSONObject j_process = j_processings.getJSONObject(i);
                    j_process.put("token", token);
                    result.add(j_process);
                }
            } catch (Exception e) {
                JSONObject j_processing = jsonObject.getJSONObject("AvailablePcs");
                j_processing.put("token", token);
                result.add(j_processing);
            }

            return ResultUtils.success(result);
        }
    }
}
