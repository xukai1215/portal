package njgis.opengms.portal.controller.sunlingzhi;

import com.alibaba.fastjson.JSONObject;
import njgis.opengms.portal.bean.JsonResult;
import njgis.opengms.portal.exception.MyException;
import njgis.opengms.portal.utils.MyHttpUtils;
import njgis.opengms.portal.utils.ResultUtils;
import org.apache.commons.io.FilenameUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

/**
 * @ClassName DispatchingController
 * @Description todo
 * @Author sun_liber
 * @Date 2019/5/15
 * @Version 1.0.0
 */
@RestController
@RequestMapping (value = "/dispatchRequest")
public class DispatchingRequestController {

    //远程数据容器地址
    @Value("${dataContainerIpAndPort}")
    String dataContainerIpAndPort;

    @Value("${managerServerIpAndPort}")
    String managerServerIpAndPort;

    @RequestMapping (value="/uploadMutiFiles",method = RequestMethod.POST)
    JSONObject uploadMutiFiles(@RequestParam("ogmsdata") MultipartFile[] files,
                               @RequestParam("name")String uploadName,
                               @RequestParam("userId")String userName,
                               @RequestParam("serverNode")String serverNode,
                               @RequestParam("origination")String origination

    ) throws IOException {
        MultiValueMap<String, Object> part = new LinkedMultiValueMap<>();

        for(int i=0;i<files.length;i++)
            part.add("datafile", files[i].getResource());
        part.add("name", uploadName);
        part.add("userId", userName);
        part.add("serverNode", serverNode);
        part.add("origination", origination);

        return MyHttpUtils.uploadDataToDataServer(dataContainerIpAndPort,part);

    }

//    @RequestMapping (value="/uploadMutiFilesTest",method = RequestMethod.POST)
//    JsonResult uploadMutiFilesTest(
//            @RequestParam("ogmsdata") MultipartFile[] files,
//            @RequestParam("name")String uploadName,
//            @RequestParam("userId")String userName,
//            @RequestParam("serverNode")String serverNode,
//            @RequestParam("origination")String origination
//
//    ) throws IOException {
//        String url="http://"+ dataContainerIpAndPort +"/data";
//        Map<String,String> a=new HashMap<>();
//        a.put("host",host);
//        a.put("port",port);
//        a.put("type",type);
//        a.put("userName",userName);
//
//        Map<String,MultipartFile[]> b=new HashMap<>();
//        b.put("ogmsdata",files);
//        JSONObject j=JSONObject.parseObject(MyHttpUtils.POSTMultiPartFileToDataServer(url,"utf-8",a,b));
//        if(j.getIntValue("code")==-1){
//            throw new MyException("远程服务出错");
//        }
//        return ResultUtils.success(j.getJSONObject("data"));
//    }

    @RequestMapping (value="/upload",method = RequestMethod.POST)
    JsonResult upload(@RequestParam("file")MultipartFile file,
                      @RequestParam("host")String host,
                      @RequestParam("port")String port,
                      @RequestParam("type")String type,
                      @RequestParam("userName")String userName

                      ) throws IOException {
        String url="http://"+ managerServerIpAndPort +"/GeoModeling/computableModel/uploadData";
        Map<String,String> a=new HashMap<>();
        a.put("host",host);
        a.put("port",port);
        a.put("type",type);
        a.put("userName",userName);

        Map<String,MultipartFile> b=new HashMap<>();
        b.put("file",file);
        JSONObject j=JSONObject.parseObject(MyHttpUtils.POSTMultiPartFileToDataServer(url,"utf-8",a,b));
        if(j.getIntValue("code")==-1){
            throw new MyException("远程服务出错");
        }
        return ResultUtils.success(j.getJSONObject("data"));
    }

    @RequestMapping (value="/uploadFiles",method = RequestMethod.POST)
    ResponseEntity<JSONObject> uploadFile(@RequestParam("file") MultipartFile file) throws  IOException {
        RestTemplate restTemplate=new RestTemplate();
        String url="http://" + dataContainerIpAndPort + "/data";
        String fileName=file.getOriginalFilename();

        File temp=File.createTempFile("temp","&"+fileName);

        file.transferTo(temp);
        FileSystemResource resource = new FileSystemResource(temp);
        MultiValueMap<String, Object> param = new LinkedMultiValueMap<>();
        param.add("file", resource);
        HttpEntity<MultiValueMap<String, Object>> httpEntity = new HttpEntity<>(param);
        ResponseEntity<JSONObject> responseEntity = restTemplate.exchange(url, HttpMethod.POST, httpEntity, JSONObject.class);
//        File tempFile=file.getResource().getFile();
//        FileSystemResource fileSystemResource=new FileSystemResource(tempFile);
        if (responseEntity.getStatusCode()!=HttpStatus.OK){
            throw new MyException("远程服务出错");
        }

        temp.delete();

        return responseEntity;//远程接口已经success格式封装
    }

    @RequestMapping (value="/addRecordToDataContainer",method = RequestMethod.POST)
    JsonResult addRecordtoDataContainer (@RequestBody Map<String,Object> fileInfo){
        RestTemplate restTemplate=new RestTemplate();
        HttpHeaders headers = new HttpHeaders();

        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity entity = new HttpEntity<>(fileInfo,headers);
        String url="http://" + dataContainerIpAndPort + "/dataResource";
        ResponseEntity<JSONObject> responseEntity1=restTemplate.exchange(url, HttpMethod.POST, entity, JSONObject.class);
        if (responseEntity1.getStatusCode()!=HttpStatus.OK){
            throw new MyException("远程服务出错");
        }
        return ResultUtils.success("上传数据成功");
    }

    @RequestMapping (value="/uploadToDataContainer",method = RequestMethod.POST)
    JsonResult uploadToDataContainer(@RequestParam("file")MultipartFile file,
                                     @RequestParam("author")String author) throws IOException {
        RestTemplate restTemplate=new RestTemplate();
        String url="http://" + dataContainerIpAndPort + "/file/upload/store_dataResource_files";//远程接口
        File temp=File.createTempFile("temp",FilenameUtils.getExtension(file.getOriginalFilename()));
        file.transferTo(temp);
        FileSystemResource resource = new FileSystemResource(temp);
        MultiValueMap<String, Object> param = new LinkedMultiValueMap<>();
        param.add("file", resource);
        HttpEntity<MultiValueMap<String, Object>> httpEntity = new HttpEntity<>(param);
        ResponseEntity<JSONObject> responseEntity = restTemplate.exchange(url, HttpMethod.POST, httpEntity, JSONObject.class);
        if (responseEntity.getStatusCode()!=HttpStatus.OK){
            throw new MyException("远程服务出错");
        }
        String sourceStoreId=responseEntity.getBody().getString("data");
        String [] z=file.getOriginalFilename().split("\\.");
        String fileName=z[0];
        String suffix=z[1];
        String type="OTHER";
        String fromWhere="PORTAL";

        HttpHeaders headers = new HttpHeaders();

        headers.setContentType(MediaType.APPLICATION_JSON);


        Map<String, Object> requestParam = new HashMap<>();
        requestParam.put("sourceStoreId",sourceStoreId);
        requestParam.put("fileName",fileName);
        requestParam.put("suffix",suffix);
        requestParam.put("type",type);
        requestParam.put("fromWhere",fromWhere);
        requestParam.put("author",author);


        HttpEntity entity = new HttpEntity<>(requestParam,headers);
        url="http://" + dataContainerIpAndPort + "/dataResource";
        ResponseEntity<JSONObject> responseEntity1=restTemplate.exchange(url, HttpMethod.POST, entity, JSONObject.class);
        if (responseEntity1.getStatusCode()!=HttpStatus.OK){
            throw new MyException("远程服务出错");
        }
        return ResultUtils.success("上传数据成功");
    }


    @RequestMapping (value="/getUserRelatedDataFromDataContainer",method = RequestMethod.GET)
    JsonResult getUserRelatedDataFromDataContainer(
                   @RequestParam("page")String page,
                   @RequestParam("pageSize") String pageSize,
                   @RequestParam("authorName") String authorName
    ) throws IOException {

        String url="http://" + dataContainerIpAndPort + "/dataResource?page={page}&pageSize={pageSize}&type=author&value={authorName}";
        RestTemplate restTemplate=new RestTemplate();
        ResponseEntity<JSONObject> responseEntity=restTemplate.exchange(url,HttpMethod.GET,null,JSONObject.class,page,pageSize,authorName);
        if (responseEntity.getStatusCode() != HttpStatus.OK) {
            throw new MyException("远程服务调用错误");
        }
        return ResultUtils.success(responseEntity.getBody().getJSONObject("data"));
    }

    @RequestMapping (value="/delete",method = RequestMethod.DELETE)
    JsonResult deleteFile(@RequestParam("uid") String uid){
        String url="http://"+ dataContainerIpAndPort +"/del"+"?uid="+uid;
        RestTemplate restTemplate = new RestTemplate();
        Map<String,String> a=new HashMap<>();

        MyHttpUtils myHttpUtils = new MyHttpUtils();
        String delete = null;
        try{
            delete = myHttpUtils.DELETE(url, "UTF-8", a);
        }catch (IOException e){
            e.printStackTrace();
            return ResultUtils.error(-1,"delete failed");
        }

        return ResultUtils.error(-1,delete);


    }


    @RequestMapping (value="/download",method = RequestMethod.GET)
    ResponseEntity<byte[]> download(@RequestParam("url") String url){
        RestTemplate restTemplate=new RestTemplate();
        ResponseEntity<byte []> response = restTemplate.exchange(url, HttpMethod.GET,
                null, byte[].class);
        return response;
    }

    @RequestMapping (value="/downloadBySourceStoreId",method = RequestMethod.GET)
    ResponseEntity<byte[]> downloadById(@RequestParam("sourceStoreId") String sourceStoreId){
        String url="http://"+dataContainerIpAndPort+"/data?uid="+sourceStoreId;
        RestTemplate restTemplate=new RestTemplate();
        ResponseEntity<byte []> response = restTemplate.exchange(url, HttpMethod.GET,
                null, byte[].class);
        return  response;
    }


}
