package njgis.opengms.portal.service;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.sun.deploy.net.HttpUtils;
import java.net.URLEncoder;
import njgis.opengms.portal.dao.DataApplicationDao;
import njgis.opengms.portal.dao.DataItemDao;
import njgis.opengms.portal.dao.DataNodeContentDao;
import njgis.opengms.portal.dao.UserDao;
import njgis.opengms.portal.dto.DataNodeContentDTO;
import njgis.opengms.portal.dto.dataItem.DataItemResultDTO;
import njgis.opengms.portal.entity.DataApplication;
import njgis.opengms.portal.entity.DataItem;
import njgis.opengms.portal.entity.DataNodeContent;
import njgis.opengms.portal.entity.User;
import njgis.opengms.portal.entity.support.InvokeService;
import njgis.opengms.portal.utils.MyHttpUtils;
import njgis.opengms.portal.utils.ResultUtils;
import njgis.opengms.portal.utils.XmlTool;
import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.DocumentHelper;
import org.dom4j.Element;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URISyntaxException;
import java.net.URL;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.List;

@Service
public class DataServerService {
    @Autowired
    DataNodeContentDao dataNodeContentDao;

    @Autowired
    DataItemDao dataItemDao;

    @Autowired
    DataApplicationDao dataApplicationDao;

    @Autowired
    UserDao userDao;

    @Value("${dataServerManager}")
    private String dataServerManager;

    @Value(value = "Conversion,Processing")
    private List<String> dataProcessing;

    public String getNodeData(String token, String id,String userId) throws IOException, URISyntaxException, DocumentException {
        DataNodeContent dataNodeContent = new DataNodeContent();
        String dataUrl = null;
        if(dataNodeContentDao.findAllByServerIdAndToken(token,id)!=null){
            dataNodeContent =dataNodeContentDao.findAllByServerIdAndToken(token,id);

            if(dataNodeContent.getUrl()!=null){
                dataUrl = dataNodeContent.getUrl();
                URL pathUrl = new URL(dataUrl);
                HttpURLConnection urlcon = (HttpURLConnection) pathUrl.openConnection();
                if(urlcon.getResponseCode()>=400){
                    return dataUrl;
                }
            }
        }

        String url = "http://"+ dataServerManager +"/fileObtain" + "?token=" + URLEncoder.encode(token) + "&id=" + id;
        String xml = MyHttpUtils.GET(url,"UTF-8",null);

        dataUrl = XmlTool.xml2Json(xml).getString("url");

        dataNodeContent.setId(id);
        dataNodeContent.setToken(token);
        dataNodeContent.setUserId(userId);
        dataNodeContent.setUrl(dataUrl);
        dataNodeContent.setType("data");

        return dataUrl;
    }

    public JSONObject getUserNode(String userName) throws DocumentException {
        JSONObject userNode = new JSONObject();

        User user = userDao.findFirstByUserName(userName);

        String token = user.getDataNodeToken();
        HttpComponentsClientHttpRequestFactory httpRequestFactory = new HttpComponentsClientHttpRequestFactory();
        httpRequestFactory.setConnectionRequestTimeout(6000);
        httpRequestFactory.setConnectTimeout(6000);
        httpRequestFactory.setReadTimeout(6000);
        if(token!=null){//如果已经存过token，则直接去缓存里找，测试是否在线即可
            String checkUrl = "http://" + dataServerManager+"state?token="+URLEncoder.encode(token);
            RestTemplate restTemplate = new RestTemplate(httpRequestFactory);
            JSONObject result = restTemplate.getForObject(checkUrl,JSONObject.class);
            if(result.getString("message").equals("online")){
                userNode.put("token",token);
                return userNode;
            }
        }

        //没有存过token或token不在线，则可能是第一次连或token失效，获取所有id并筛选,更新用户的token
        String url = "http://" + dataServerManager+"/onlineNodes";

        RestTemplate restTemplate = new RestTemplate(httpRequestFactory);
        String xml = restTemplate.getForObject(url,String.class);

        if(xml.equals("err")){
            JSONObject json = new JSONObject();
            return json;
        }



        JSONObject jsonObject = XmlTool.xml2Json(xml);

        try {
            JSONArray nodes = jsonObject.getJSONArray("onlineServiceNodes");

            for (int i = 0; i < nodes.size(); i++) {
                JSONObject node = (JSONObject) nodes.get(i);
                if (node.getString("node").equals(userName)) {
                    userNode = node;
                    user.setDataNodeToken(userNode.getString("token"));
                }
            }
        } catch (Exception e) {
            JSONObject node = jsonObject.getJSONObject("onlineServiceNodes");
            if (node.getString("node").equals(userName)) {
                userNode = node;
                user.setDataNodeToken(userNode.getString("token"));
            }
        }

        return userNode;
    }

    public JSONArray getNodeContentCheck(String token, String type) throws Exception{
        //因为dataservice不提供直接查询接口，因此只能先找token再遍历
        String baseUrl = "http://" + dataServerManager + "/onlineNodesAllPcs";
        JSONArray j_nodes = new JSONArray();

        String url = baseUrl + "?token=" + URLEncoder.encode(token) + "&type=" + type;
        String xml = null;
        try{
            xml = MyHttpUtils.GET(url, "utf-8", null);
        }catch (Exception e){
            return null;
        }

        JSONObject jsonObject = XmlTool.xml2Json(xml);
        JSONArray j_processings = new JSONArray();
        JSONArray result = new JSONArray();
        try {
            j_processings = jsonObject.getJSONArray("AvailablePcs");
            result = updateUserNodeContent(j_processings,token,type);
        } catch (Exception e) {
            JSONObject j_processing = jsonObject.getJSONObject("AvailablePcs");
            j_processing.put("token", token);
            DataNodeContent dataNodeContent = dataNodeContentDao.findAllByServerIdAndToken(j_processing.getString("id"),token);

            if(dataNodeContent!=null){
                dataNodeContent.setChecked(1);
                j_processing.put("bindItems",dataNodeContent.getBindItems());
            }
            List<DataNodeContent> dataNodeContentList = dataNodeContentDao.findAllByTokenAndType(token,type);
            for(int i=0;i<dataNodeContentList.size();i++){
                DataNodeContent content = dataNodeContentList.get(i);
                if(dataNodeContent.getChecked()==0){
                    dataNodeContentDao.delete(content);
                }else {
                    content.setChecked(0);
                }

            }
            result.add(j_processing);
        }
        return result;
    }

    public JSONArray updateUserNodeContent(JSONArray nodeContents,String token,String type){
        JSONArray result = new JSONArray();
        for (int i = 0; nodeContents != null && i < nodeContents.size(); i++) {
            JSONObject j_process = nodeContents.getJSONObject(i);
            j_process.put("token", token);
            DataNodeContent dataNodeContent = dataNodeContentDao.findAllByServerIdAndToken(j_process.getString("id"),token);

            if(dataNodeContent!=null){
                dataNodeContent.setChecked(1);
                dataNodeContentDao.save(dataNodeContent);
                j_process.put("bindItems",dataNodeContent.getBindItems());
            }
            result.add(j_process);
        }

        List<DataNodeContent> dataNodeContentList = dataNodeContentDao.findAllByTokenAndType(token,type);
        for(int i=0;i<dataNodeContentList.size();i++){
            DataNodeContent dataNodeContent = dataNodeContentList.get(i);
            if(dataNodeContent.getChecked()==0){
                dataNodeContentDao.delete(dataNodeContent);
            }else {
                dataNodeContent.setChecked(0);
            }

        }

        return result;
    }

    public JSONObject pageDataItemChecked(int page,int pageSize,int asc,String sortEle,String searchText,String userName){
        Sort sort = new Sort(asc==1 ? Sort.Direction.ASC : Sort.Direction.DESC, sortEle);
        Pageable pageable = PageRequest.of(page, pageSize, sort);

        Page<DataItem> dataItemResultDTOPage = dataItemDao.findAllByNameContainsIgnoreCase(pageable,searchText);

        List<DataItem> dataItemList = dataItemResultDTOPage.getContent();
        JSONArray array = new JSONArray();

        for(int i=0;i<dataItemList.size();i++){
            JSONObject jsonObject = new JSONObject();
            jsonObject.put("oid",dataItemList.get(i).getId());
            jsonObject.put("name",dataItemList.get(i).getName());
            jsonObject.put("createDate",dataItemList.get(i).getCreateTime());

            User user = userDao.findFirstByOid(dataItemList.get(i).getAuthor());

            jsonObject.put("contributor",user.getName());
            jsonObject.put("contributorId",user.getUserId());

            array.add(jsonObject);
        }

        JSONObject result = new JSONObject();
        result.put("content",array);
        result.put("total",dataItemResultDTOPage.getTotalElements());

        return result;
    }

    public JSONObject pageDataAppicationChecked(int page,int pageSize,int asc,String sortEle,String method,String searchText,String userName){
        Sort sort = new Sort(asc==1 ? Sort.Direction.ASC : Sort.Direction.DESC, sortEle);
        Pageable pageable = PageRequest.of(page, pageSize, sort);

        Page<DataApplication> dataApplicationPage = Page.empty();
        if(method.equals("Processing")){
            dataApplicationPage = dataApplicationDao.findAllByMethodInAndNameContainsIgnoreCase(pageable,dataProcessing,searchText);
        }else{
            dataApplicationPage = dataApplicationDao.findAllByMethodAndNameContainsIgnoreCase(pageable,method,searchText);
        }

        List<DataApplication> dataApplicationList = dataApplicationPage.getContent();
        JSONArray array = new JSONArray();

        for(int i=0;i<dataApplicationList.size();i++){
            JSONObject jsonObject = new JSONObject();
            jsonObject.put("oid",dataApplicationList.get(i).getOid());
            jsonObject.put("name",dataApplicationList.get(i).getName());
            jsonObject.put("method",dataApplicationList.get(i).getMethod());
            jsonObject.put("createDate",dataApplicationList.get(i).getCreateTime());

            User user = userDao.findFirstByOid(dataApplicationList.get(i).getAuthor());

            jsonObject.put("contributor",user.getName());
            jsonObject.put("contributorId",user.getUserId());

            array.add(jsonObject);
        }

        JSONObject result = new JSONObject();
        result.put("content",array);
        result.put("total",dataApplicationPage.getTotalElements());

        return result;
    }

    public DataNodeContent updataDataNodeContent(DataNodeContentDTO dataNodeContentDTO,String userName,boolean add){
        String dataNodeContentId = dataNodeContentDTO.getServerId();
        String dataNodeToken = dataNodeContentDTO.getToken();

        DataNodeContent dataNodeContent = dataNodeContentDao.findAllByServerIdAndToken(dataNodeContentId,dataNodeToken);
        String itemId = dataNodeContentDTO.getItem();
        if(dataNodeContent!=null){
            List<String> bindedItems = dataNodeContent.getBindItems();
            if(!bindedItems.contains(itemId)&&add){
                bindedItems.add(itemId);
            }else if (bindedItems.contains(itemId)&&!add){
                bindedItems.remove(itemId);
            }
            dataNodeContent.setBindItems(bindedItems);
            return dataNodeContentDao.save(dataNodeContent);


        }else if(add){
            dataNodeContent = new DataNodeContent();
            dataNodeContent.setServerId(dataNodeContentDTO.getServerId());
            dataNodeContent.setName(dataNodeContentDTO.getName());
            dataNodeContent.setToken(dataNodeContentDTO.getToken());
            dataNodeContent.setUserId(userName);
            dataNodeContent.setType(dataNodeContentDTO.getType());

            List<String> bindedItems = new ArrayList<>();
            bindedItems.add(itemId);
            dataNodeContent.setBindItems(bindedItems);

            return dataNodeContentDao.insert(dataNodeContent);
        }

        return null;
    }

    public DataNodeContent bindDataItem(DataNodeContentDTO dataNodeContentDTO, String userName){
        String dataNodeContentId = dataNodeContentDTO.getServerId();
        String dataNodeToken = dataNodeContentDTO.getToken();

        DataNodeContent dataNodeContent = updataDataNodeContent(dataNodeContentDTO,userName,true);

        DataItem item = dataItemDao.findFirstById(dataNodeContentDTO.getItem());

        if(item==null){
            return null;
        }
        InvokeService invokeService = new InvokeService(false);
        invokeService.setServiceId(dataNodeContentDTO.getServerId());
        invokeService.setName(dataNodeContentDTO.getName());
        invokeService.setToken(dataNodeContentDTO.getToken());
        invokeService.setContributor(userName);
        List<InvokeService> invokeServices = item.getInvokeServices();
        if(invokeServices==null){
            invokeServices = new ArrayList<>();
        }
        if( !invokeServices.contains(invokeService)){
            invokeServices.add(invokeService);
        }
        item.setInvokeServices(invokeServices);
        dataItemDao.save(item);

        return dataNodeContent;
    }

    public DataNodeContent unbindDataItem(DataNodeContentDTO dataNodeContentDTO, String userName){
        String dataNodeContentId = dataNodeContentDTO.getServerId();
        String dataNodeToken = dataNodeContentDTO.getToken();

        DataNodeContent dataNodeContent = updataDataNodeContent(dataNodeContentDTO,userName,false);

        DataItem item = dataItemDao.findFirstById(dataNodeContentDTO.getItem());

        List<InvokeService> invokeServices = item.getInvokeServices();

        if(invokeServices!=null){
            for(int i=invokeServices.size()-1;i>=0;i--){
                if(invokeServices.get(i).getServiceId().equals(dataNodeContentDTO.getServerId())){
                    invokeServices.remove(invokeServices.get(i));
                    break;
                }
            }
        }

        item.setInvokeServices(invokeServices);
        dataItemDao.save(item);

        return dataNodeContent;
    }

    public DataNodeContent bindDataMethod(DataNodeContentDTO dataNodeContentDTO, String userName){
        String dataNodeContentId = dataNodeContentDTO.getServerId();
        String dataNodeToken = dataNodeContentDTO.getToken();

        DataNodeContent dataNodeContent = updataDataNodeContent(dataNodeContentDTO,userName,true);

        DataApplication dataApplication = dataApplicationDao.findFirstByOid(dataNodeContentDTO.getItem());

        InvokeService invokeService = new InvokeService(false);
        invokeService.setServiceId(dataNodeContentDTO.getServerId());
        invokeService.setName(dataNodeContentDTO.getName());
        invokeService.setToken(dataNodeContentDTO.getToken());
        invokeService.setDataIds(dataNodeContentDTO.getDataSet());
        invokeService.setMethod(dataNodeContentDTO.getType());
        invokeService.setContributor(userName);
        List<InvokeService> invokeServices = dataApplication.getInvokeServices();
        if(invokeServices==null){
            invokeServices = new ArrayList<>();
        }
        if(!invokeServices.contains(invokeService)){
            invokeServices.add(invokeService);
        }
        dataApplication.setInvokeServices(invokeServices);

        dataApplicationDao.save(dataApplication);

        return dataNodeContent;
    }

    public DataNodeContent unbindDataMethod(DataNodeContentDTO dataNodeContentDTO, String userName){
        String dataNodeContentId = dataNodeContentDTO.getServerId();
        String dataNodeToken = dataNodeContentDTO.getToken();

        DataNodeContent dataNodeContent = updataDataNodeContent(dataNodeContentDTO,userName,false);

        DataApplication dataApplication = dataApplicationDao.findFirstByOid(dataNodeContentDTO.getItem());

        if(dataApplication==null){
            return null;
        }

        List<InvokeService> invokeServices = dataApplication.getInvokeServices();

        if(invokeServices!=null){
            for(int i=invokeServices.size()-1;i>=0;i--){
                if(invokeServices.get(i).getServiceId().equals(dataNodeContentDTO.getServerId())){
                    invokeServices.remove(invokeServices.get(i));
                    break;
                }
            }
        }

        dataApplication.setInvokeServices(invokeServices);
        dataApplicationDao.save(dataApplication);

        return dataNodeContent;
    }
}
