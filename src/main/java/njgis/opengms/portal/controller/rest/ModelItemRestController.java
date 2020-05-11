package njgis.opengms.portal.controller.rest;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import njgis.opengms.portal.bean.JsonResult;
import njgis.opengms.portal.dto.modelItem.ModelItemAddDTO;
import njgis.opengms.portal.dto.modelItem.ModelItemFindDTO;
import njgis.opengms.portal.dto.modelItem.ModelItemUpdateDTO;
import njgis.opengms.portal.entity.ComputableModel;
import njgis.opengms.portal.entity.ModelItem;
import njgis.opengms.portal.entity.User;
import njgis.opengms.portal.entity.support.DailyViewCount;
import njgis.opengms.portal.service.ComputableModelService;
import njgis.opengms.portal.service.ModelItemService;
import njgis.opengms.portal.service.UserService;
import njgis.opengms.portal.utils.ResultUtils;
import njgis.opengms.portal.utils.Utils;
import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.CacheConfig;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

/**
 * @ClassName ModelItemRestController
 * @Description todo
 * @Author Kai
 * @Date 2019/2/21
 * @Version 1.0.0
 * TODO
 */
@RestController
@CacheConfig(cacheNames = "modelItemCache")
@RequestMapping(value = "/modelItem")
public class ModelItemRestController {

    @Autowired
    ModelItemService modelItemService;

    @Autowired
    ComputableModelService computableModelService;

    @Autowired
    UserService userService;

    @Value("${htmlLoadPath}")
    private String htmlLoadPath;

    @RequestMapping(value="/repository",method = RequestMethod.GET)
    public ModelAndView getModelItems() {
        System.out.println("model items");

        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("model_items");


        return modelAndView;

    }


    @RequestMapping(value="/add",method = RequestMethod.POST)
    public JsonResult addModelItem(HttpServletRequest request) throws IOException {

        MultipartHttpServletRequest multipartRequest = (MultipartHttpServletRequest) request;
        MultipartFile file=multipartRequest.getFile("info");
        String model=IOUtils.toString(file.getInputStream(),"utf-8");
        JSONObject jsonObject=JSONObject.parseObject(model);
        ModelItemAddDTO modelItemAddDTO=JSONObject.toJavaObject(jsonObject,ModelItemAddDTO.class);

        HttpSession session=request.getSession();

        if(session.getAttribute("uid")==null){
            return ResultUtils.error(-1,"no login");
        }

        System.out.println("add model item");

        String userName=session.getAttribute("uid").toString();

        ModelItem modelItem= modelItemService.insert(modelItemAddDTO,userName);
        userService.modelItemPlusPlus(userName);
        return ResultUtils.success(modelItem.getOid());
    }

    @RequestMapping(value = "/delete", method = RequestMethod.POST)
    public JsonResult deleteModelItem(@RequestParam(value="oid") String oid, HttpServletRequest request){
        HttpSession session=request.getSession();

        if(session.getAttribute("uid")==null){
            return ResultUtils.error(-1,"no login");
        }
        String userName=session.getAttribute("uid").toString();
        return ResultUtils.success(modelItemService.delete(oid,userName));
    }

    @RequestMapping(value = "/update", method = RequestMethod.POST)
    public JsonResult updateModelItem(HttpServletRequest request) throws IOException{

        HttpSession session=request.getSession();
        String uid=session.getAttribute("uid").toString();
        if(uid==null)
        {
            return ResultUtils.error(-2,"未登录");
        }

        MultipartHttpServletRequest multipartRequest = (MultipartHttpServletRequest) request;
        MultipartFile file=multipartRequest.getFile("info");
        String model=IOUtils.toString(file.getInputStream(),"utf-8");
        JSONObject jsonObject=JSONObject.parseObject(model);
        ModelItemUpdateDTO modelItemUpdateDTO=JSONObject.toJavaObject(jsonObject,ModelItemUpdateDTO.class);

        JSONObject result=modelItemService.update(modelItemUpdateDTO,uid);
        if(result==null){
            return ResultUtils.error(-1,"There is another version have not been checked, please contact nj_gis@163.com if you want to modify this item.");
        }
        else {
            return ResultUtils.success(result);
        }
    }

    @RequestMapping (value="/{id}",method = RequestMethod.GET)
    ModelAndView get(@PathVariable ("id") String id,HttpServletRequest request){
        return modelItemService.getPage(id,request);
    }

    @RequestMapping (value="/getInfo/{id}",method = RequestMethod.GET)
    JsonResult getInfo(@PathVariable ("id") String id){
        ModelItem modelItem=modelItemService.getByOid(id);
        modelItem.setImage(modelItem.getImage().equals("")?"":htmlLoadPath+modelItem.getImage());
        return ResultUtils.success(modelItem);
    }

    @Cacheable
    @RequestMapping (value="/list",method = RequestMethod.POST)
    public JsonResult list(ModelItemFindDTO modelItemFindDTO,@RequestParam(value="classifications[]") List<String> classes){
        System.out.println("model item list");
        return ResultUtils.success(modelItemService.list(modelItemFindDTO,null,classes));
    }

    @RequestMapping (value="/listByAuthor",method = RequestMethod.POST)
    JsonResult listByAuthor(ModelItemFindDTO modelItemFindDTO,
                            @RequestParam(value="classifications[]") List<String> classes,
                            HttpServletRequest request){
        HttpSession session = request.getSession();
        if(Utils.checkLoginStatus(session)==null){
            return ResultUtils.error(-1,"no login");
        }else{
            String userName = session.getAttribute("uid").toString();
            return ResultUtils.success(modelItemService.list(modelItemFindDTO,userName,classes));
        }

    }

    @RequestMapping (value = "/listByUserOid",method = RequestMethod.GET)
    JsonResult listByUserOid(ModelItemFindDTO modelItemFindDTO,@RequestParam(value="oid") String oid){
        return ResultUtils.success(modelItemService.listByUserOid(modelItemFindDTO,oid));
    }

    @RequestMapping(value="/getRelation",method = RequestMethod.GET)
    JsonResult getRelation(@RequestParam(value = "type") String type,@RequestParam(value = "oid") String oid){

        JSONArray result=modelItemService.getRelation(oid,type);

        return ResultUtils.success(result);
    }

    @RequestMapping(value="/setRelation",method = RequestMethod.POST)
    JsonResult setRelation(@RequestParam(value="oid") String oid,
                           @RequestParam(value="type") String type,
                           @RequestParam(value = "relations[]") List<String> relations){

        String result=modelItemService.setRelation(oid,type,relations);

        return ResultUtils.success(result);

    }

    @RequestMapping (value="/findNamesByName",method = RequestMethod.GET)
    JsonResult findNameByName(@RequestParam(value = "name") String name){
        return ResultUtils.success(modelItemService.findNamesByName(name));
    }

    @RequestMapping (value="/findByName",method = RequestMethod.GET)
    JsonResult findByName(@RequestParam(value = "name") String name){
        return ResultUtils.success(modelItemService.findByName(name));
    }

    @RequestMapping (value="/advance",method = RequestMethod.POST)
    JsonResult advanced(ModelItemFindDTO modelItemFindDTO,
                        @RequestParam(value="classifications[]") List<String> classes,
                        @RequestParam(value="connects[]") List<String> connects,
                        @RequestParam(value="props[]") List<String> props,
                        @RequestParam(value="values[]") List<String> values){
        try {
            return ResultUtils.success(modelItemService.query(modelItemFindDTO, connects, props, values, classes));
        }catch (ParseException e){
            return ResultUtils.error(-1,"error");
        }
    }

    @RequestMapping(value = "/bindModel",method = RequestMethod.GET)
    JsonResult bindModel(@RequestParam(value="type") int type,
                         @RequestParam(value="name") String name,
                         @RequestParam(value="oid") String oid)
    {
        JSONObject result=modelItemService.bindModel(type,name,oid);
        if(result.getInteger("code")==-1){
            return ResultUtils.error(-1,"no Model Item");
        }
        else {
            return ResultUtils.success(result.getString("oid"));
        }
    }

    @RequestMapping (value="/getModelItemsByUserId",method = RequestMethod.GET)
    public JsonResult getModelItemsByUserId(HttpServletRequest request,
                                                     @RequestParam(value="page") int page,
                                                     @RequestParam(value="sortType") String sortType,
                                                     @RequestParam(value="asc") int sortAsc){

        HttpSession session=request.getSession();
        if(session.getAttribute("uid")==null){
            return ResultUtils.error(-1,"no login");
        }
        String uid=session.getAttribute("uid").toString();

        JSONObject result=modelItemService.getModelItemsByUserId(uid,page,sortType,sortAsc);

        return ResultUtils.success(result);
    }

    @RequestMapping (value="/searchModelItemsByUserId",method = RequestMethod.GET)
    public JsonResult searchModelItemsByUserId(HttpServletRequest request,
                                               @RequestParam(value="searchText") String searchText,
                                            @RequestParam(value="page") int page,
                                            @RequestParam(value="sortType") String sortType,
                                            @RequestParam(value="asc") int sortAsc){

        HttpSession session=request.getSession();
        if(session.getAttribute("uid")==null){
            return ResultUtils.error(-1,"no login");
        }
        String uid=session.getAttribute("uid").toString();

        JSONObject result=modelItemService.searchModelItemsByUserId(searchText.trim(),uid,page,sortType,sortAsc);

        return ResultUtils.success(result);
    }

    @RequestMapping(value="/searchByNameByOid",method= RequestMethod.GET)
    JsonResult searchByTitle(ModelItemFindDTO modelItemFindDTO, String oid){
        System.out.println("/searchModelByOid"+modelItemFindDTO);
        return ResultUtils.success(modelItemService.searchByTitleByOid(modelItemFindDTO,oid));
    }

    @RequestMapping (value="/DOISearch",method = RequestMethod.GET)
    public JsonResult DOISearch(@RequestParam(value="doi") String doi){

        String result=modelItemService.analysisDOI(doi);

        return ResultUtils.success(result);
    }

    @RequestMapping (value = "/getUserOidByOid", method = RequestMethod.GET)
    public JsonResult getUserOidByOid(@RequestParam(value="oid") String oid){
        ModelItem modelItem=modelItemService.getByOid(oid);
        String userId=modelItem.getAuthor();
        User user=userService.getByUid(userId);
        return ResultUtils.success(user.getOid());

    }

    @RequestMapping (value="/getDailyViewCount",method = RequestMethod.GET)
    public JsonResult getDailyViewCount(@RequestParam(value="oid") String oid){
        ModelItem modelItem=modelItemService.getByOid(oid);
        List<String> computableModelIds = modelItem.getRelate().getComputableModels();
        List<ComputableModel> computableModelList=new ArrayList<>();
        for(int i=0;i<computableModelIds.size();i++){
            ComputableModel computableModel = computableModelService.getByOid(computableModelIds.get(i));
            computableModelList.add(computableModel);
        }
        List<DailyViewCount> dailyViewCountList=modelItem.getDailyViewCount();
        JSONArray dateList = new JSONArray();
        dateList.add("Timeline");
        JSONArray viewArray=new JSONArray();
        viewArray.add("View Times");
        JSONArray invokeArray = new JSONArray();
        invokeArray.add("Invoke Times");
        JSONArray resultList = new JSONArray();
        Date now = new Date();
        SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd");
        Calendar c = Calendar.getInstance();//动态时间
        c.setTime(now);
        String startTime;//chart起始时间
        int max=0;
        if(dailyViewCountList==null||dailyViewCountList.size()==0){


            c.add(Calendar.DATE,-6);
            startTime=sdf.format(c.getTime());
            for(int i=0;i<6;i++){
                dateList.add(sdf.format(c.getTime()));
                viewArray.add(0);
                invokeArray.add(0);
                c.add(Calendar.DATE,1);
            }

        }else{
            DailyViewCount dailyViewCount=dailyViewCountList.get(0);
            Date firstDate = dailyViewCount.getDate();
            c.add(Calendar.MONTH,-1);

            if(dailyViewCountList.get(dailyViewCountList.size()-1).getDate().before(c.getTime())){
                c.setTime(now);
                c.add(Calendar.DATE,-6);
            }

            int index=0;
            if(c.getTime().before(firstDate)){
                c.setTime(firstDate);
            }
            else{
                while(index<dailyViewCountList.size()&&c.getTime().after(dailyViewCountList.get(index).getDate())){
                    index++;
                }
            }

            startTime=sdf.format(c.getTime());

            Calendar nowCalendar = Calendar.getInstance();
            nowCalendar.setTime(now);
            nowCalendar.add(Calendar.DATE, 1);

            while (!Utils.isSameDay(c.getTime(),nowCalendar.getTime())){
                dateList.add(sdf.format(c.getTime()));
                if(index<dailyViewCountList.size()) {
                    DailyViewCount daily = dailyViewCountList.get(index);

                    if (Utils.isSameDay(daily.getDate(), c.getTime())) {
                        int count=daily.getCount();
                        if(count>max){
                            max=count;
                        }
                        viewArray.add(count);
                        index++;
                    } else {
                        viewArray.add(0);
                    }
                }
                else{
                    viewArray.add(0);
                }

                c.add(Calendar.DATE,1);
                invokeArray.add(0);
            }

        }



        for(int i=0;i<computableModelList.size();i++){
            Calendar calendar=Calendar.getInstance();
            try {
                Date date=sdf.parse(startTime);
                calendar.setTime(date);
            }catch (Exception e){
                e.printStackTrace();
            }
            ComputableModel computableModel = computableModelList.get(i);
            List<DailyViewCount> dailyInvokeCounts = computableModel.getDailyInvokeCount();

            int index=0;
            while (index<dailyInvokeCounts.size()&&calendar.getTime().after(dailyInvokeCounts.get(index).getDate())){
                index++;
            }

            Calendar nowCalendar = Calendar.getInstance();
            nowCalendar.setTime(now);
            nowCalendar.add(Calendar.DATE, 1);

            int count=1;
            while (!Utils.isSameDay(calendar.getTime(),nowCalendar.getTime())){
                if(index<dailyInvokeCounts.size()) {
                    DailyViewCount dailyInvokeCount = dailyInvokeCounts.get(index);
                    if (Utils.isSameDay(calendar.getTime(), dailyInvokeCount.getDate())) {
                        int times=invokeArray.getInteger(count);
                        times+=dailyInvokeCount.getCount();
                        invokeArray.set(count,times);
                        index++;
                    }
                }

                calendar.add(Calendar.DATE,1);
                count++;
            }

        }

        resultList.add(dateList);
        resultList.add(viewArray);
        resultList.add(invokeArray);

        JSONObject result=new JSONObject();

        result.put("valueList",resultList);

        return ResultUtils.success(result);
    }
    

}
