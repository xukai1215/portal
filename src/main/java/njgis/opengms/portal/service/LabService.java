package njgis.opengms.portal.service;

import com.alibaba.fastjson.JSONObject;
import njgis.opengms.portal.dao.LabDao;
import njgis.opengms.portal.dao.UserDao;
import njgis.opengms.portal.dto.UserLabDTO;
import njgis.opengms.portal.entity.User;
import njgis.opengms.portal.entity.support.Lab;
import njgis.opengms.portal.entity.support.UserLab;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class LabService {
    @Autowired
    UserDao userDao;

    @Autowired
    LabDao labDao;

    @Autowired
    UserService userService;

    public JSONObject findBylabName(String userId){
        User user=userDao.findFirstByUserId(userId);
        JSONObject result=new JSONObject();
        UserLab userLab=user.getLab();
        if(userLab.getName()=="") {
            result.put("lab","null");
        } else {
            String labName=userLab.getName();
            Lab lab = labDao.findFirstByLabName(labName);
            User leader = userDao.findFirstByUserName(lab.getLeaderName());


            List<String> memberName = lab.getMembers();
            List<User> members = new ArrayList<>();
            for (int i = 0; i < memberName.size(); i++) {
                members.add(userDao.findFirstByUserName(memberName.get(i)));
            }

            result.put("lab", labName);
            result.put("labMembers", members);
        }
//        System.out.println("lab"+leader);
        return result;

    }

//    public JSONObject addByLabName(){
//
//    }

    public JSONObject updateByLabName(UserLabDTO userLabDTO, String userName){
//        根据新加的lab找到lab库中对应的lab
        String labName=userLabDTO.getName();
        String position=userLabDTO.getPosition();
        Lab lab=labDao.findFirstByLabName(labName);
//        得到user已经加入的lab
        User user=userDao.findFirstByUserName(userName);
        UserLab userLab=user.getLab();
        String userLabName=userLab.getName();
        Lab oldLab=labDao.findFirstByLabName(userLabName);

        JSONObject result=new JSONObject();
        if(lab==null){ //新加的lab在库中不存在
            lab=new Lab();
            lab.setLabName(labName);
            lab.setOid(UUID.randomUUID().toString());
            List <String> members=new ArrayList<>();
            members.add(userName);
            lab.setMembers(members);
            labDao.insert(lab);
            System.out.println("lab"+lab);
            result.put("Lab","NewSet");
        }else{
            List<String> members=lab.getMembers();
            for (int i=0;i<members.size();i++)
            {
                if (members.get(i).equals(userName))
                {
                    result.put("Lab","memberExist");
                    return result;
                }
            }

            if (oldLab!=null){
                //            先在已经加入的lab中删除该用户名
                List<String> oldMembers=oldLab.getMembers();
                oldMembers.remove(userName);
                System.out.println(oldMembers);
                oldLab.setMembers(oldMembers);
                labDao.save(oldLab);
            }


            members.add(userName);
            lab.setMembers(members);
            labDao.save(lab);
            result.put("Lab","memberAdd");
        }
        return result;
    }

}
