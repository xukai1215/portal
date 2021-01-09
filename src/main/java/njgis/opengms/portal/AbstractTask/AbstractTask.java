package njgis.opengms.portal.AbstractTask;

import com.alibaba.fastjson.JSONObject;
import njgis.opengms.portal.utils.Utils;

public abstract class AbstractTask {

    public JSONObject getRecord(JSONObject param,String managerServerIpAndPort) throws Exception{
        JSONObject out=new JSONObject();

//        if(param.getBoolean("integrate")){
//            RestTemplate restTemplate=new RestTemplate();
//            String url="http://" + managerServerIpAndPort + "/GeoModeling/task/checkRecord?taskId={taskId}";//远程接口
//            Map<String, String> params = new HashMap<>();
//            params.put("taskId", param.getString("tid"));
//            ResponseEntity<JSONObject> responseEntity=restTemplate.getForEntity(url,JSONObject.class,params);
//            if (responseEntity.getStatusCode()!=HttpStatus.OK){
//                throw new MyException("远程服务出错");
//            }
//            else {
//                JSONObject data = responseEntity.getBody().getJSONObject("data");
//                out.put("tid", param.getString("tid"));
//                out.put("integrate", true);
//                out.put("status", data.getInteger("status"));
//                out.put("models", data.getJSONArray("models"));
//            }
//        }
//        else {
            JSONObject result = Utils.postJSON("http://" + managerServerIpAndPort + "/GeoModeling/computableModel/refreshTaskRecord", param);

            ////update model status to Started, Started: 1, Finished: 2, Inited: 0, Error: -1
            JSONObject data = result.getJSONObject("data");

            out.put("tid", data.getString("tid"));
            out.put("integrate", false);
            out.put("status", data.getInteger("status"));
            out.put("outputs", data.getJSONArray("outputs"));
//        }
        return out;

    }
}
