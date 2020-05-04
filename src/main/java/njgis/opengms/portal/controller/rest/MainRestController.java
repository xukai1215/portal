package njgis.opengms.portal.controller.rest;

import njgis.opengms.portal.dao.ModelItemDao;
import njgis.opengms.portal.entity.User;
import njgis.opengms.portal.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

@RestController
public class MainRestController {

    @Autowired
    ModelItemDao modelItemDao;

    @Autowired
    UserService userService;

    @RequestMapping(value={"/","/home"},method = RequestMethod.GET)
    public ModelAndView homepage(HttpServletRequest req) {
        System.out.println("home");

        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("index");

        HttpSession session=req.getSession();
        if(session.getAttribute("uid")==null)
            modelAndView.addObject("logged", false);
        else{
            User user =  userService.getByUid(session.getAttribute("uid").toString());
            modelAndView.addObject("userNavBar",user);
            System.out.println(modelAndView.getModel().get("user"));
            modelAndView.addObject("logged", true);
        }

        return modelAndView;
    }

//    @Scheduled(cron = "0 0 0 * * *")  // 表示 在指定时间执行
//    public void viewCountStatistic(){
//
//        List<ModelItem> modelItemList = modelItemDao.findAll();
//        for(int i=0;i<modelItemList.size();i++){
//            ModelItem modelItem=modelItemList.get(i);
//
//            //执行程序之前需要将viewCountUtilYesterday设成viewCount
//            List<DailyViewCount> dailyCount=modelItem.getDailyViewCount();
//
//            int viewCount=modelItem.getViewCount();
//            int yesterdayViewCount=viewCount-modelItem.getViewCountUtilYesterday();
//            Calendar c=Calendar.getInstance();
//            c.add(Calendar.DATE,-1);
//
//            dailyCount.add(new DailyViewCount(c.getTime(),yesterdayViewCount));
//            modelItem.setDailyViewCount(dailyCount);
//
//            modelItem.setViewCountUtilYesterday(viewCount);
//
//            modelItemDao.save(modelItem);
//        }
//
//    }

}
