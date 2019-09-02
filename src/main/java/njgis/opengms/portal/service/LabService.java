package njgis.opengms.portal.service;

import com.alibaba.fastjson.JSONObject;
import njgis.opengms.portal.dao.LabDao;
import njgis.opengms.portal.dao.UserDao;
import njgis.opengms.portal.entity.User;
import njgis.opengms.portal.entity.support.Lab;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class LabService {
    @Autowired
    UserDao userDao;

    @Autowired
    LabDao labDao;

    @Autowired
    UserService userService;

    public JSONObject findBylabName(String oid){
        User user=userDao.findFirstByOid(oid);
        Lab lab=labDao.findFirstByLabName(user.getLab());
        User leader=userDao.findFirstByUserName(lab.getLeaderName());


        List<String> memberName=lab.getMembers();
        List<User> members=new ArrayList<>();
        for(int i=0;i<memberName.size();i++){
            members.add(userDao.findFirstByUserName(memberName.get(i)));
        }

        JSONObject result=new JSONObject();
        result.put("lab",lab);
        result.put("labLeader",leader);
        result.put("labMembers",members);
//        System.out.println("lab"+leader);
        return result;
    }

}
