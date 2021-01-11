package njgis.opengms.portal.AbstractTask;

import com.alibaba.fastjson.JSONObject;
import njgis.opengms.portal.exception.MyException;
import njgis.opengms.portal.utils.Utils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

public abstract class AbstractTask {

    public JSONObject getRecord(JSONObject param,String managerServerIpAndPort) throws Exception{
        JSONObject out=new JSONObject();

        if(param.getBoolean("integrate")!= null&&param.getBoolean("integrate")){//查找集成模型
            RestTemplate restTemplate=new RestTemplate();
            String url="http://" + managerServerIpAndPort + "/GeoModeling/task/checkTaskStatus?taskId={taskId}";//远程接口
            Map<String, String> params = new HashMap<>();
            params.put("taskId", param.getString("tid"));
            ResponseEntity<JSONObject> responseEntity=restTemplate.getForEntity(url,JSONObject.class,params);
            if (responseEntity.getStatusCode()!=HttpStatus.OK){
                throw new MyException("远程服务出错");
            }
            else {
                try{
                    JSONObject data = responseEntity.getBody().getJSONObject("data");
                    out = data.getJSONObject("taskInfo");
                }catch (Exception e){

                }
            }
        }
        else {
        try{
            JSONObject result = Utils.postJSON("http://" + managerServerIpAndPort + "/GeoModeling/computableModel/refreshTaskRecord", param);

            if(result!=null){
                ////update model status to Started, Started: 1, Finished: 2, Inited: 0, Error: -1
                JSONObject data = result.getJSONObject("data");

                out.put("tid", data.getString("tid"));
                out.put("integrate", false);
                out.put("status", data.getInteger("status"));
                out.put("outputs", data.getJSONArray("outputs"));
            }

        }catch (Exception e){
            System.out.println(e);
            return out;
        }

        }
        return out;

    }
}
