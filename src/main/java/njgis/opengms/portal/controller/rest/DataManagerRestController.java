package njgis.opengms.portal.controller.rest;


import com.alibaba.fastjson.JSONObject;
import lombok.extern.slf4j.Slf4j;
import njgis.opengms.portal.bean.JsonResult;
import njgis.opengms.portal.exception.MyException;
import njgis.opengms.portal.utils.ResultUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.http.converter.ByteArrayHttpMessageConverter;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping(value = "/dataManager")
public class DataManagerRestController {

    //远程数据容器地址
    @Value("${dataContainerIpAndPort}")
    String dataContainerIpAndPort;


    @RequestMapping(value="/dataContainerIpAndPort",method = RequestMethod.GET)
    JsonResult getDataContainerIpAndPort(){
        return ResultUtils.success(dataContainerIpAndPort);
    }

    /**
     * 展示所有数据条目
     * @param author
     * @param type
     * @return
     */

    @RequestMapping(value = "/list",method = RequestMethod.GET)
    JsonResult listData(@RequestParam("author") String author,@RequestParam("type") String type) {

        String url="http://"+dataContainerIpAndPort+"/dataResource/listByCondition?value={author}&type={type}";
        RestTemplate restTemplate=new RestTemplate();
        ResponseEntity<JSONObject> responseEntity=restTemplate.exchange(url,HttpMethod.GET,null,JSONObject.class,author,type);
        if (responseEntity.getStatusCode() != HttpStatus.OK) {
            throw new MyException("远程服务调用错误");
        }
        return ResultUtils.success(responseEntity.getBody().getJSONArray("data"));




    }

    /**
     * 单下载数据资源文件
     * @param sourceStoreId
     * @return
     */
    @RequestMapping (value = "/downloadRemote", method = RequestMethod.GET)
    ResponseEntity downloadRemote(@RequestParam ("sourceStoreId") String sourceStoreId) {
        RestTemplate restTemplate = new RestTemplate();
        restTemplate.getMessageConverters().add(
                new ByteArrayHttpMessageConverter());
        HttpHeaders headers = new HttpHeaders();
        headers.setAccept(Arrays.asList(MediaType.APPLICATION_OCTET_STREAM));
        HttpEntity<String> entity = new HttpEntity<>(headers);


        Map<String, String> map = new HashMap<>();
        map.put("sourceStoreId", sourceStoreId);


        ResponseEntity<byte[]> response = restTemplate.exchange(
                "http://" + dataContainerIpAndPort + "/dataResource/getResources?sourceStoreId={sourceStoreId}",
                HttpMethod.GET, entity, byte[].class, map);

        return response;
    };

    /**
     * 批量下载数据资源文件
     * @param sourceStoreId
     * @return
     */
    @RequestMapping (value = "/downloadSomeRemote", method = RequestMethod.GET)
    ResponseEntity downloadSomeRemote(@RequestParam ("sourceStoreId") ArrayList<String> sourceStoreId) {
        RestTemplate restTemplate = new RestTemplate();
        restTemplate.getMessageConverters().add(
                new ByteArrayHttpMessageConverter());
        HttpHeaders headers = new HttpHeaders();
        headers.setAccept(Arrays.asList(MediaType.APPLICATION_OCTET_STREAM));
        HttpEntity<String> entity = new HttpEntity<>(headers);
        String keys="";

        for(int i=0;i<sourceStoreId.size();i++){
            keys+="sourceStoreId="+sourceStoreId.get(i)+"&";
        }



        Map<String, String> map = new HashMap<>();
        map.put("sourceStoreId", keys);


        ResponseEntity<byte[]> response = restTemplate.exchange(
                "http://" + dataContainerIpAndPort + "/dataResource/getResources?"+keys,
                HttpMethod.GET, entity, byte[].class, map);

        return response;
    };






    /***
     * 上传数据
     * @param file
     * @param author
     * @return
     */
    @RequestMapping(value = "/upload")
    JsonResult dataManagerUpload(@RequestParam("file") MultipartFile file,
                                 @RequestParam("author") String author) {


        RestTemplate restTemplate = new RestTemplate();

        MultiValueMap<String, Object> part = new LinkedMultiValueMap<>();

        part.add("file", file.getResource());



        JSONObject jsonObject = restTemplate.postForObject("http://" + dataContainerIpAndPort + "/file/upload/store_dataResource_files",
                        part,
                        JSONObject.class);

        return ResultUtils.success(jsonObject);



    }


    /***
     * 删除
     * @param id
     * @return
     */
    @RequestMapping(value = "/delete",method = RequestMethod.DELETE)
    JsonResult deleteData(@RequestParam("id") String id) {
        System.out.println(id);
        String url="http://"+dataContainerIpAndPort+"/dataResource/del/"+id;
        RestTemplate restTemplate=new RestTemplate();
        ResponseEntity<JSONObject> responseEntity=restTemplate.exchange(url,HttpMethod.DELETE,null,JSONObject.class);
        if (responseEntity.getStatusCode() != HttpStatus.OK) {
            throw new MyException("远程服务调用错误");
        }
        return ResultUtils.success(responseEntity.getBody());




    }

    /***
     * 按关键字查询
     * @param id
     * @param words
     * @return
     */
    @RequestMapping(value = "/keywordsSearch",method = RequestMethod.GET)
    JsonResult searchKeyords(@RequestParam("id") String id,
                             @RequestParam("words") String words) {

        String url="http://localhost:8081/dataResource/MangerS?searchContent={words}&id={id}";
        RestTemplate restTemplate=new RestTemplate();

        ResponseEntity<JSONObject> responseEntity=restTemplate.exchange(url,HttpMethod.GET,null,JSONObject.class,words,id);
        if (responseEntity.getStatusCode() != HttpStatus.OK) {
            throw new MyException("远程服务调用错误");
        }
        return ResultUtils.success(responseEntity.getBody());




    }


    /***
     * 分类：图片
     * @param id

     * @return
     */
    @RequestMapping(value = "/managerPics",method = RequestMethod.GET)
    JsonResult managerpics(@RequestParam("id") String id
                            ) {

        String url="http://"+dataContainerIpAndPort+"/dataResource/managerPics?id={id}";
        RestTemplate restTemplate=new RestTemplate();

        ResponseEntity<JSONObject> responseEntity=restTemplate.exchange(url,HttpMethod.GET,null,JSONObject.class,id);
        if (responseEntity.getStatusCode() != HttpStatus.OK) {
            throw new MyException("远程服务调用错误");
        }
        return ResultUtils.success(responseEntity.getBody());

    }


    /***
     * 分类：文档
     * @param id

     * @return
     */
    @RequestMapping(value = "/managerDoc",method = RequestMethod.GET)
    JsonResult managerdoc(@RequestParam("id") String id
    ) {

        String url="http://"+dataContainerIpAndPort+"/dataResource/managerDoc?id={id}";
        RestTemplate restTemplate=new RestTemplate();

        ResponseEntity<JSONObject> responseEntity=restTemplate.exchange(url,HttpMethod.GET,null,JSONObject.class,id);
        if (responseEntity.getStatusCode() != HttpStatus.OK) {
            throw new MyException("远程服务调用错误");
        }
        return ResultUtils.success(responseEntity.getBody());

    }

    /***
     * 分类：其他
     * @param id

     * @return
     */
    @RequestMapping(value = "/managerOhr",method = RequestMethod.GET)
    JsonResult managerOther(@RequestParam("id") String id
    ) {

        String url="http://"+dataContainerIpAndPort+"/dataResource/managerOhr?id={id}";
        RestTemplate restTemplate=new RestTemplate();

        ResponseEntity<JSONObject> responseEntity=restTemplate.exchange(url,HttpMethod.GET,null,JSONObject.class,id);
        if (responseEntity.getStatusCode() != HttpStatus.OK) {
            throw new MyException("远程服务调用错误");
        }
        return ResultUtils.success(responseEntity.getBody());

    }

    /**
     * 在数据库中加入文件夹package
     *
     */
    @RequestMapping(value="/addPackage",method = RequestMethod.GET)
    JsonResult addPackage(@RequestParam(value="name") String name){

        String url="http://"+dataContainerIpAndPort+"/packageResource/add";

        RestTemplate restTemplate=new RestTemplate();

        ResponseEntity<JSONObject> responseEntity=restTemplate.exchange(url,HttpMethod.GET,null,JSONObject.class,name);
        if (responseEntity.getStatusCode() != HttpStatus.OK) {
            throw new MyException("远程服务调用错误");
        }
        return ResultUtils.success(responseEntity.getBody());

    }




}
