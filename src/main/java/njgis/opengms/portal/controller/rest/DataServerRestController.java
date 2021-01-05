package njgis.opengms.portal.controller.rest;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import lombok.extern.slf4j.Slf4j;
import njgis.opengms.portal.bean.JsonResult;
import njgis.opengms.portal.dto.DataNodeContentDTO;
import njgis.opengms.portal.entity.support.InvokeService;
import njgis.opengms.portal.service.DataServerService;
import njgis.opengms.portal.utils.MyHttpUtils;
import njgis.opengms.portal.utils.ResultUtils;
import njgis.opengms.portal.utils.XmlTool;
import org.dom4j.DocumentException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpRequest;
import org.springframework.web.HttpRequestHandler;
import org.springframework.web.bind.annotation.*;
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

    @Autowired
    DataServerService dataServerService;

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
    public JsonResult getUserNodes(HttpServletRequest request) throws DocumentException {

        HttpSession session = request.getSession();

        String userName = session.getAttribute("uid").toString();
        if(userName==null){
            return ResultUtils.error(-1, "no login");
        }else{
            JSONObject jsonObject = dataServerService.getUserNode(userName);
            if(jsonObject.isEmpty()){
                return ResultUtils.success("offline");
            }else {
                return ResultUtils.success(jsonObject);
            }

        }



    }

    @RequestMapping(value = "/getNodeContent", method = RequestMethod.GET)
    public JsonResult getNodeContent(@RequestParam("token") String token,@RequestParam("type") String type,HttpServletRequest request) throws IOException, URISyntaxException, DocumentException {

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

    @RequestMapping(value = "/getNodeContentCheck", method = RequestMethod.GET)
    public JsonResult getNodeContentCheck(@RequestParam("token") String token,@RequestParam("type") String type,HttpServletRequest request) throws Exception {

        HttpSession session = request.getSession();

        String userName = session.getAttribute("uid").toString();
        if(userName==null){
            return ResultUtils.error(-1, "no login");
        }else {
            return ResultUtils.success(dataServerService.getNodeContentCheck(token,type));
        }
    }

    @RequestMapping(value = "/getNodeDataUrl", method = RequestMethod.GET)
    public JsonResult getNodeDataUrl(@RequestParam("token") String token,@RequestParam("id") String id,HttpServletRequest request) throws IOException, URISyntaxException, DocumentException {

        HttpSession session = request.getSession();

        String userName = session.getAttribute("uid").toString();
        if(userName==null){
            return ResultUtils.error(-1, "no login");
        }else {

            return ResultUtils.success(dataServerService.getNodeData(token,id,userName));
        }
    }

    @RequestMapping(value = "/pageDataItemChecked", method = RequestMethod.GET)
    public JsonResult pageAllDataItemChecked(@RequestParam(value = "page") int page,
                              @RequestParam(value = "pageSize") int pageSize,
                              @RequestParam(value="asc") int asc,
                              @RequestParam(value="sortEle") String sortEle,
                              @RequestParam(value="searchText") String searchText,
                              HttpServletRequest request
    ){
        HttpSession session = request.getSession();
        if(session.getAttribute("uid")==null){
            return ResultUtils.error(-1,"no login");
        }
        else{
            String userId = session.getAttribute("uid").toString();
            return ResultUtils.success(dataServerService.pageDataItemChecked(page,pageSize,asc,sortEle,searchText,userId));
        }
    }

    @RequestMapping(value = "/pageDataAppicationChecked", method = RequestMethod.GET)
    public JsonResult pageAllDataAppicationChecked(@RequestParam(value = "page") int page,
                              @RequestParam(value = "pageSize") int pageSize,
                              @RequestParam(value="asc") int asc,
                              @RequestParam(value="sortEle") String sortEle,
                              @RequestParam(value="type") String type, @RequestParam(value="searchText") String searchText,
                              HttpServletRequest request
    ){
        HttpSession session = request.getSession();
        if(session.getAttribute("uid")==null){
            return ResultUtils.error(-1,"no login");
        }
        else{
            String userId = session.getAttribute("uid").toString();
            return ResultUtils.success(dataServerService.pageDataAppicationChecked(page,pageSize,asc,sortEle,type,searchText,userId));
        }
    }

    @RequestMapping(value = "/bindDataItem", method = RequestMethod.POST)
    public JsonResult bindDataItem(@RequestBody DataNodeContentDTO dataNodeContentDTO,HttpServletRequest request){
        HttpSession session = request.getSession();
        if(session.getAttribute("uid")==null){
            return ResultUtils.error(-1,"no login");
        }
        else{
            String userName = session.getAttribute("uid").toString();
            return ResultUtils.success(dataServerService.bindDataItem(dataNodeContentDTO,userName));
        }

    }

    @RequestMapping(value = "/unbindDataItem", method = RequestMethod.POST)
    public JsonResult unbindDataItem(@RequestBody DataNodeContentDTO dataNodeContentDTO,HttpServletRequest request){
        HttpSession session = request.getSession();
        if(session.getAttribute("uid")==null){
            return ResultUtils.error(-1,"no login");
        }
        else{
            String userName = session.getAttribute("uid").toString();
            return ResultUtils.success(dataServerService.unbindDataItem(dataNodeContentDTO,userName));
        }

    }

    @RequestMapping(value = "/bindDataMethod", method = RequestMethod.POST)
    public JsonResult bindDataMethod(@RequestBody DataNodeContentDTO dataNodeContentDTO,HttpServletRequest request){
        HttpSession session = request.getSession();
        if(session.getAttribute("uid")==null){
            return ResultUtils.error(-1,"no login");
        }
        else{
            String userName = session.getAttribute("uid").toString();
            return ResultUtils.success(dataServerService.bindDataMethod(dataNodeContentDTO,userName));
        }

    }

    @RequestMapping(value = "/unbindDataMethod", method = RequestMethod.POST)
    public JsonResult unbindDataMethod(@RequestBody DataNodeContentDTO dataNodeContentDTO,HttpServletRequest request){
        HttpSession session = request.getSession();
        if(session.getAttribute("uid")==null){
            return ResultUtils.error(-1,"no login");
        }
        else{
            String userName = session.getAttribute("uid").toString();
            return ResultUtils.success(dataServerService.unbindDataMethod(dataNodeContentDTO,userName));
        }

    }

    @RequestMapping(value = "/checkNodeContent", method = RequestMethod.GET)
    public JsonResult checkNodeContent(@RequestParam("serverId") String serverId,
                                       @RequestParam("token") String token,
                                       @RequestParam("type") String type
                                       ){

       return ResultUtils.success(dataServerService.checkNodeContent(serverId,token,type));

    }
}
