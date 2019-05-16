package njgis.opengms.portal.AbstractTask;

import com.alibaba.fastjson.JSONObject;
import njgis.opengms.portal.entity.Task;
import njgis.opengms.portal.utils.Utils;

public abstract class AbstractTask {

    public JSONObject getRecord(JSONObject param) throws Exception{
        JSONObject result = Utils.postJSON("http://222.192.7.75:8084/GeoModeling/computableModel/refreshTaskRecord", param);

        ////update model status to Started, Started: 1, Finished: 2, Inited: 0, Error: -1
        JSONObject data = result.getJSONObject("data");
        JSONObject out=new JSONObject();
        out.put("tid",data.getString("tid"));
        out.put("status",data.getInteger("status"));
        out.put("outputs",data.getJSONArray("outputs"));
        return out;

    }
}
