package njgis.opengms.portal.utils;

import njgis.opengms.portal.entity.support.ZipStreamEntity;
import org.apache.http.HttpEntity;
import org.apache.http.auth.AuthScope;
import org.apache.http.auth.UsernamePasswordCredentials;
import org.apache.http.client.CredentialsProvider;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.mime.HttpMultipartMode;
import org.apache.http.entity.mime.MultipartEntityBuilder;
import org.apache.http.impl.client.BasicCredentialsProvider;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;
import java.nio.charset.Charset;
import java.util.Map;

/**
 * Created by wang ming on 2019/5/14.
 */
public class MyHttpUtils {


    //设置连接超时时间，单位毫秒
    private static final int CONNECT_TIMEOUT = 6000;

    //设置获取数据的超时时间(即响应时间),单位毫秒

    private static final int SOCKET_TIMEOUT = 6000;

    public static String GET(String urlString, String encode, Map<String, String> headers, String... m)throws IOException, URISyntaxException{
        String body = "";
        //考虑Http身份验证的情况
        CloseableHttpClient client = checkAuth(m);
        if(client == null){
            return "Input Auth parameter error";
        }
        URL url = new URL(urlString);
        URI uri = new URI(url.getProtocol(), url.getHost() + ":" + url.getPort(),url.getPath(),url.getQuery(), null);

        HttpGet httpGet = new HttpGet(uri);

        //设置连接超时时间
        RequestConfig requestConfig = RequestConfig.custom().setConnectTimeout(CONNECT_TIMEOUT).setSocketTimeout(SOCKET_TIMEOUT).build();
        httpGet.setConfig(requestConfig);

        //设置header
        if(headers != null && headers.size() > 0){
            for(Map.Entry<String,String> entry: headers.entrySet()){
                httpGet.setHeader(entry.getKey(), entry.getValue());
            }
        }
        CloseableHttpResponse response = client.execute(httpGet);
        HttpEntity entity = response.getEntity();

        if(entity != null){
            body = EntityUtils.toString(entity,encode);
        }
        EntityUtils.consume(entity);

        response.close();
        client.close();
        return body;
    }
    /**
     * @Description:  Http身份验证
     * @Param: [m]
     * @return: org.apache.http.impl.client.CloseableHttpClient
     * @Author: WangMing
     * @Date: 2019/2/18
     */
    public static CloseableHttpClient checkAuth(String... m){
        if(m.length == 2){
            //需要验证
            CredentialsProvider credentialsProvider = new BasicCredentialsProvider();
            credentialsProvider.setCredentials(AuthScope.ANY, new UsernamePasswordCredentials(m[0],m[1]));
            return HttpClients.custom().setDefaultCredentialsProvider(credentialsProvider).build();
        }else if (m.length == 0){
            return HttpClients.createDefault();
        }else{
            return null;
        }
    }


    public static String POSTMultiPartFileToDataServer(String url,String encode, Map<String,String>params,Map<String,MultipartFile> fileMap)throws IOException{
        String body = "";
        CloseableHttpClient client = HttpClients.createDefault();
        HttpPost httpPost = new HttpPost(url);

        //设置header
        httpPost.setHeader("Connection", "Keep-Alive");
        httpPost.setHeader("User-Agent", "Mozilla/5.0 (Windows; U; Windows NT 6.1; zh-CN; rv:1.9.2.6)");

        //构建body
        MultipartEntityBuilder builder = MultipartEntityBuilder.create()
                .setMode(HttpMultipartMode.BROWSER_COMPATIBLE)
                .setCharset(Charset.forName(encode));

        if(fileMap != null && fileMap.size() > 0){
            for(Map.Entry<String,MultipartFile> entry: fileMap.entrySet()){
                MultipartFile file = entry.getValue();
                builder.addBinaryBody(entry.getKey(),file.getInputStream(),ContentType.MULTIPART_FORM_DATA, file.getOriginalFilename());
            }
        }


        //构建参数部分，解决中文乱码
        ContentType contentType = ContentType.create("text/plain", Charset.forName(encode));
        if(params != null && params.size() > 0){
            for(Map.Entry<String, String> key: params.entrySet()){
                builder.addTextBody(key.getKey(), key.getValue(), contentType);
            }
        }
        HttpEntity entityIn = builder.build();
        //设置参数到请求参数中
        httpPost.setEntity(entityIn);

        CloseableHttpResponse response = client.execute(httpPost);
        HttpEntity entityOut = response.getEntity();
        if (entityOut != null) {
            //按指定编码转换结果实体为String类型
            body = EntityUtils.toString(entityOut, encode);
        }
        EntityUtils.consume(entityOut);
        //释放链接
        response.close();
        client.close();
        return body;
    }

    public static String POSTFile(String url, String encode, Map<String,String> params, Map<String,String> fileMap) throws IOException {
        String body = "";
        CloseableHttpClient client = HttpClients.createDefault();
        HttpPost httpPost = new HttpPost(url);

        //设置header
        httpPost.setHeader("Connection", "Keep-Alive");
        httpPost.setHeader("User-Agent", "Mozilla/5.0 (Windows; U; Windows NT 6.1; zh-CN; rv:1.9.2.6)");

        //构建body
        MultipartEntityBuilder builder = MultipartEntityBuilder.create()
                .setMode(HttpMultipartMode.BROWSER_COMPATIBLE)
                .setCharset(Charset.forName(encode));

        if(fileMap != null && fileMap.size() > 0){
            for(Map.Entry<String, String> entry: fileMap.entrySet()){
                File file = new File(entry.getValue());
                builder.addBinaryBody(entry.getKey(), MyFileUtils.getInputStream(file), ContentType.MULTIPART_FORM_DATA, file.getName());
            }
        }

        //构建参数部分，解决中文乱码
        ContentType contentType = ContentType.create("text/plain", Charset.forName(encode));
        if(params != null && params.size() > 0){
            for(Map.Entry<String, String> key: params.entrySet()){
                builder.addTextBody(key.getKey(), key.getValue(), contentType);
            }
        }

        HttpEntity entityIn = builder.build();
        //设置参数到请求参数中
        httpPost.setEntity(entityIn);

        CloseableHttpResponse response = client.execute(httpPost);
        HttpEntity entityOut = response.getEntity();
        if (entityOut != null) {
            //按指定编码转换结果实体为String类型
            body = EntityUtils.toString(entityOut, encode);
        }
        EntityUtils.consume(entityOut);
        //释放链接
        response.close();
        client.close();
        return body;
    }

    public static String POSTZipStream(String url, String encode, Map<String,String> params, ZipStreamEntity zipStream) throws IOException {
        String body = "";
        CloseableHttpClient client = HttpClients.createDefault();
        HttpPost httpPost = new HttpPost(url);

        //设置header
        httpPost.setHeader("Connection", "Keep-Alive");
        httpPost.setHeader("User-Agent", "Mozilla/5.0 (Windows; U; Windows NT 6.1; zh-CN; rv:1.9.2.6)");

        //构建body
        MultipartEntityBuilder builder = MultipartEntityBuilder.create()
                .setMode(HttpMultipartMode.BROWSER_COMPATIBLE)
                .setCharset(Charset.forName(encode));


        builder.addBinaryBody("ogmsdata",zipStream.getInputstream(),ContentType.MULTIPART_FORM_DATA, zipStream.getName());

        //构建参数部分，解决中文乱码
        ContentType contentType = ContentType.create("text/plain", Charset.forName(encode));
        if(params != null && params.size() > 0){
            for(Map.Entry<String, String> key: params.entrySet()){
                builder.addTextBody(key.getKey(), key.getValue(), contentType);
            }
        }

        HttpEntity entityIn = builder.build();
        //设置参数到请求参数中
        httpPost.setEntity(entityIn);

        CloseableHttpResponse response = client.execute(httpPost);
        HttpEntity entityOut = response.getEntity();
        if (entityOut != null) {
            //按指定编码转换结果实体为String类型
            body = EntityUtils.toString(entityOut, encode);
        }
        EntityUtils.consume(entityOut);
        //释放链接
        response.close();
        client.close();
        return body;
    }
}
