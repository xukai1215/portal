package njgis.opengms.portal.service;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.google.gson.JsonObject;
import lombok.extern.slf4j.Slf4j;
import njgis.opengms.portal.dao.*;
import njgis.opengms.portal.dto.dataApplication.DataApplicationDTO;
import njgis.opengms.portal.dto.dataApplication.DataApplicationFindDTO;
import njgis.opengms.portal.entity.*;
import njgis.opengms.portal.entity.support.AuthorInfo;
import njgis.opengms.portal.entity.support.InvokeService;
import njgis.opengms.portal.enums.ResultEnum;
import njgis.opengms.portal.exception.MyException;
import njgis.opengms.portal.utils.Utils;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;
import springfox.documentation.spring.web.json.Json;

import java.text.SimpleDateFormat;
import java.util.*;

import static njgis.opengms.portal.utils.Utils.saveFiles;

/**
 * @Author mingyuan
 * @Date 2020.07.30 11:15
 */
@Service
@Slf4j
public class DataApplicationService {

    @Value("${resourcePath}")
    String resourcePath;

    @Autowired
    DataApplicationDao dataApplicationDao;

    @Autowired
    UserService userService;

    @Autowired
    CategoryDao categoryDao;

    @Autowired
    DataApplicationVersionDao dataApplicationVersionDao;

    @Autowired
    DataCategorysDao dataCategorysDao;

    @Autowired
    UserDao userDao;

    @Value("${htmlLoadPath}")
    private String htmlLoadPath;


    public ModelAndView getPage(String id){
        try {
            DataApplication dataApplication = dataApplicationDao.findFirstByOid(id);
            List<String> classifications = dataApplication.getClassifications();

            //时间
            Date date = dataApplication.getCreateTime();
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(date);
            SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");
            String dateResult = simpleDateFormat.format(date);

            //用户信息
            JSONObject userJson = userService.getItemUserInfoByOid(dataApplication.getAuthor());
            //资源信息
            JSONArray resourceArray = new JSONArray();
            List<String> resources = dataApplication.getResources();

            if (resources != null) {
                for (int i = 0; i < resources.size(); i++) {
                    String path = resources.get(i);
                    String[] arr = path.split("\\.");
                    String suffix = arr[arr.length - 1];
                    arr = path.split("/");
                    String name = arr[arr.length - 1].substring(14);
                    JSONObject jsonObject = new JSONObject();
                    jsonObject.put("name", name);
                    jsonObject.put("suffix", suffix);
                    jsonObject.put("path", resources.get(i));
                    resourceArray.add(jsonObject);
                }
            }

            String lastModifyTime = simpleDateFormat.format(dataApplication.getLastModifyTime());

            //authorship
            String authorshipString="";
            List<AuthorInfo> authorshipList=dataApplication.getAuthorship();
            if(authorshipList!=null){
                for (AuthorInfo author:authorshipList) {
                    if(authorshipString.equals("")){
                        authorshipString+=author.getName();
                    }
                    else{
                        authorshipString+=", "+author.getName();
                    }

                }
            }


            ModelAndView modelAndView = new ModelAndView();

            modelAndView.setViewName("data_application_info");

            List<String> categories = classifications;
            List<String> classificationName = new ArrayList<>();

            for (String category: categories){
                DataCategorys categorys = dataCategorysDao.findFirstById(category);
                String name = categorys.getCategory();
                classificationName.add(name);
            }

            modelAndView.addObject("dataApplicationInfo", dataApplication);
            modelAndView.addObject("classifications", classificationName);
            modelAndView.addObject("date", dateResult);
            modelAndView.addObject("year", calendar.get(Calendar.YEAR));
            modelAndView.addObject("user", userJson);
            modelAndView.addObject("authorship", authorshipString);
            modelAndView.addObject("resources", resourceArray);
            modelAndView.addObject("lastModifyTime", lastModifyTime);


            return modelAndView;



        } catch (Exception e) {
            System.out.println(e.getMessage());
            throw new MyException(e.getMessage());
        }

    }

    public ModelAndView getPageWith_id(String id){
        try {
            DataApplication dataApplication = dataApplicationDao.findFirstById(id);
            List<String> classifications = dataApplication.getClassifications();

            //时间
            Date date = dataApplication.getCreateTime();
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(date);
            SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");
            String dateResult = simpleDateFormat.format(date);

            //用户信息
            JSONObject userJson = userService.getItemUserInfoByOid(dataApplication.getAuthor());
            //资源信息
            JSONArray resourceArray = new JSONArray();
            List<String> resources = dataApplication.getResources();

            if (resources != null) {
                for (int i = 0; i < resources.size(); i++) {
                    String path = resources.get(i);
                    String[] arr = path.split("\\.");
                    String suffix = arr[arr.length - 1];
                    arr = path.split("/");
                    String name = arr[arr.length - 1].substring(14);
                    JSONObject jsonObject = new JSONObject();
                    jsonObject.put("name", name);
                    jsonObject.put("suffix", suffix);
                    jsonObject.put("path", resources.get(i));
                    resourceArray.add(jsonObject);
                }
            }

            String lastModifyTime = simpleDateFormat.format(dataApplication.getLastModifyTime());

            //authorship
            String authorshipString="";
            List<AuthorInfo> authorshipList=dataApplication.getAuthorship();
            if(authorshipList!=null){
                for (AuthorInfo author:authorshipList) {
                    if(authorshipString.equals("")){
                        authorshipString+=author.getName();
                    }
                    else{
                        authorshipString+=", "+author.getName();
                    }

                }
            }


            ModelAndView modelAndView = new ModelAndView();

            modelAndView.setViewName("data_application_info");

            List<String> categories = classifications;
            List<String> classificationName = new ArrayList<>();

            for (String category: categories){
                DataCategorys categorys = dataCategorysDao.findFirstById(category);
                String name = categorys.getCategory();
                classificationName.add(name);
            }

            modelAndView.addObject("dataApplicationInfo", dataApplication);
            modelAndView.addObject("classifications", classificationName);
            modelAndView.addObject("date", dateResult);
            modelAndView.addObject("year", calendar.get(Calendar.YEAR));
            modelAndView.addObject("user", userJson);
            modelAndView.addObject("authorship", authorshipString);
            modelAndView.addObject("resources", resourceArray);
            modelAndView.addObject("lastModifyTime", lastModifyTime);


            return modelAndView;



        } catch (Exception e) {
            System.out.println(e.getMessage());
            throw new MyException(e.getMessage());
        }
    }

    public JSONObject insert(List<MultipartFile> files, JSONObject jsonObject, String oid, DataApplicationDTO dataApplicationDTO){
        JSONObject result = new JSONObject();
        DataApplication dataApplication = new DataApplication();
        BeanUtils.copyProperties(dataApplicationDTO, dataApplication);

        String path = resourcePath + "/DataApplication/" + jsonObject.getString("contentType");

        List<String> resources = new ArrayList<>();
        saveFiles(files, path, oid, "", resources);

        if (resources == null){
            result.put("code", -1);
        }else {
            try {
                dataApplication.setResources(resources);
                dataApplication.setOid(UUID.randomUUID().toString());
                dataApplication.setAuthor(oid);
                dataApplication.setIsAuthor(true);

                Date now = new Date();
                dataApplication.setCreateTime(now);
                dataApplication.setLastModifyTime(now);

                //将服务invokeApplications置入
                InvokeService invokeService = new InvokeService();
                invokeService.setOid(UUID.randomUUID().toString());
                invokeService.setMethod(dataApplication.getMethod());
                invokeService.setName(dataApplication.getName());
                List<InvokeService> invokeServices = new ArrayList<>();
                invokeServices.add(invokeService);
                dataApplication.setInvokeServices(invokeServices);

                dataApplicationDao.insert(dataApplication);

                result.put("code", 1);
                result.put("id", dataApplication.getOid());
            }catch (Exception e){
                log.info("dataApplication create failed");
                result.put("code", -2);
            }
        }



        return result;
    }

    //用户拿到上传的所有条目
    public Page<DataApplication> getUsersUploadData(String author, Integer page, Integer pagesize, Integer asc, String type) {
        // TODO: 2020/8/4 show dataApplication items
        boolean as = false;
        if (asc == 1) {
            as = true;
        } else {
            as = false;
        }

        Sort sort = new Sort(as ? Sort.Direction.ASC : Sort.Direction.DESC, "createTime");
        Pageable pageable = PageRequest.of(page, pagesize, sort);
        Page<DataApplication> dataApplications = dataApplicationDao.findByAuthorAndTypeAndStatusNotLike(pageable, author, type,"Private");
        return dataApplicationDao.findByAuthorAndTypeAndStatusNotLike(pageable, author,type,"Private");

    }

    public Page<DataApplication> searchDataByUserId(String userOid, int page, int pageSize, int asc, String searchText, String type) {
        //todo 超出堆内存解决办法
        Sort sort = new Sort(asc==1 ? Sort.Direction.ASC : Sort.Direction.DESC, "createTime");
        Pageable pageable = PageRequest.of(page, pageSize, sort);
        Page<DataApplication> dataApplications= dataApplicationDao.findByAuthorAndNameContainsAndTypeAndStatusNotLike(pageable, userOid, searchText, type,"Private");
        return dataApplications;
    }

    public DataApplication getById(String oid) {
        try {
            return dataApplicationDao.findFirstByOid(oid);
        } catch (Exception e) {
            System.out.println("有人乱查数据库！！该ID不存在Model Item对象");
            throw new MyException(ResultEnum.NO_OBJECT);
        }
    }

    public JSONObject update(List<MultipartFile> files, JSONObject jsonObject, String oid, DataApplicationDTO dataApplicationDTO) {
        JSONObject result = new JSONObject();
        DataApplication dataApplication_ori = dataApplicationDao.findFirstByOid(jsonObject.getString("oid"));
        String author0 = dataApplication_ori.getAuthor();
        DataApplication dataApplication = new DataApplication();
        BeanUtils.copyProperties(dataApplication_ori, dataApplication);

        if (!dataApplication_ori.isLock()) {
            String path = resourcePath + "/DataApplication/" + jsonObject.getString("contentType");
            //如果上传新文件
            if (files.size() > 0) {
                List<String> resources =new ArrayList<>();
                saveFiles(files, path, oid, "",resources);
                if (resources == null) {
                    result.put("code", -1);
                    return result;
                }
                dataApplication.setResources(resources);
            }

            dataApplication.setName(jsonObject.getString("name"));
            dataApplication.setStatus(jsonObject.getString("status"));
            dataApplication.setDetail(jsonObject.getString("detail"));
            dataApplication.setDescription(jsonObject.getString("description"));
            dataApplication.setContentType(jsonObject.getString("contentType"));
            dataApplication.setUrl(jsonObject.getString("url"));

            JSONArray jsonArray = jsonObject.getJSONArray("authorship");
            List<AuthorInfo> authorship = new ArrayList<>();
            for (int i = 0; i < jsonArray.size(); i++) {
                JSONObject author = jsonArray.getJSONObject(i);
                AuthorInfo authorInfo = new AuthorInfo();
                authorInfo.setName(author.getString("name"));
                authorInfo.setEmail(author.getString("email"));
                authorInfo.setIns(author.getString("ins"));
                authorInfo.setHomepage(author.getString("homepage"));
                authorship.add(authorInfo);
            }
            dataApplication.setAuthorship(authorship);

            dataApplication.setAuthor(oid);
            dataApplication.setIsAuthor(true);

            Date now = new Date();
            String authorUserName = dataApplication_ori.getAuthor();

            if (dataApplication_ori.getAuthor().equals(oid)) {
                dataApplication.setLastModifyTime(now);
                dataApplicationDao.save(dataApplication);

                result.put("method", "update");
                result.put("code", 1);
                result.put("id", dataApplication.getOid());
            } else {
                DataApplicationVersion dataApplicationVersion = new DataApplicationVersion();
                BeanUtils.copyProperties(dataApplication, dataApplicationVersion, "id");
                dataApplicationVersion.setOid(UUID.randomUUID().toString());
                dataApplicationVersion.setOriginOid(dataApplication_ori.getOid());
                dataApplicationVersion.setModifier(oid);
                dataApplicationVersion.setVerNumber(now.getTime());
                dataApplicationVersion.setVerStatus(0);

                //todo messageNum
                String author = dataApplication_ori.getAuthor();
                User user = userDao.findFirstByOid(author);
                userService.messageNumPlusPlus(user.getUserName());

                dataApplicationVersion.setModifyTime(now);
                dataApplicationVersion.setAuthor(author0);

                dataApplicationVersionDao.save(dataApplicationVersion);

                dataApplication_ori.setLock(true);
                dataApplicationDao.save(dataApplication_ori);

                result.put("method", "version");
                result.put("code", 0);
                result.put("oid", dataApplicationVersion.getOid());
            }


            return result;
        } else {
            return null;
        }
    }

    public int delete(String oid) {
        DataApplication dataApplication = dataApplicationDao.findFirstByOid(oid);
//        if(!dataApplication.getAuthor().equals(oid))
//            return 2;
        if (dataApplication != null) {
            //删除资源
            String path = resourcePath + "/computableModel/" + dataApplication.getContentType();
            List<String> resources = dataApplication.getResources();
            for (int i = 0; i < resources.size(); i++) {
                Utils.delete(path + resources.get(i));
            }
            //删除
            dataApplicationDao.delete(dataApplication);
//            userService.computableModelMinusMinus(userName);
            return 1;
        } else {
            return -1;
        }
    }

    // public JSONObject findAll() {
    //     Page<DataApplication> dataApplicationPage = dataApplicationDao.findByStatusNotLike(PageRequest.of(2, 10, new Sort(Sort.Direction.ASC,"createTime")),"private");
    //
    //     List<DataApplication> dataApplications = dataApplicationPage.getContent();
    //
    //     JSONArray jsonArray = new JSONArray();
    //     for (int i=0;i<dataApplications.size();++i) {
    //
    //         DataApplication dataApplication = dataApplications.get(i);
    //
    //         String oid = dataApplication.getAuthor();
    //         User user = userDao.findFirstByOid(oid);
    //         JSONObject userObject = new JSONObject();
    //         userObject.put("id",user.getOid());
    //         userObject.put("image",user.getImage().equals("")?"":htmlLoadPath + user.getImage());
    //         userObject.put("name",user.getName());
    //
    //         JSONObject jsonObject = new JSONObject();
    //         jsonObject.put("author",userObject);
    //         SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");
    //         jsonObject.put("createTime",simpleDateFormat.format(dataApplication.getCreateTime()));
    //         jsonObject.put("name",dataApplication.getName());
    //         jsonObject.put("description",dataApplication.getDescription());
    //         jsonObject.put("type",dataApplication.getType());
    //         jsonObject.put("status",dataApplication.getStatus());
    //         jsonObject.put("oid",dataApplication.getOid());
    //         jsonArray.add(jsonObject);
    //     }
    //     JSONArray users = new JSONArray();
    //     for(int i=0;i<dataApplications.size();++i) {
    //         DataApplication dataApplication = dataApplications.get(i);
    //         String oid = dataApplication.getAuthor();
    //         User user = userDao.findFirstByOid(oid);
    //         JSONObject userObj = new JSONObject();
    //         userObj.put("userId",user.getUserId());
    //         userObj.put("image", user.getImage().equals("") ? "" : htmlLoadPath + user.getImage());
    //         userObj.put("name", user.getName());
    //         users.add(userObj);
    //
    //         dataApplications.get(i).setAuthor(user.getName());
    //         dataApplications.get(i).setOid(dataApplication.getId());
    //     }
    //     JSONObject res = new JSONObject();
    //     res.put("list",jsonArray);
    //     res.put("total",dataApplicationPage.getTotalElements());
    //     res.put("users",users);
    //     return res;
    // }


    public  Page<DataApplication> selectMethodByNameAndMethod(String name, String method,Pageable pageable) {
        if(name.equals("") && method.equals("")){
            return dataApplicationDao.findByStatusNotLike("private",pageable);
        }else if(name.equals("") && !method.equals("")){
            return dataApplicationDao.findByMethodLikeAndStatusNotLike(method,"private",pageable);
        }else if(!name.equals("") && method.equals("")){
            return dataApplicationDao.findByNameLikeAndStatusNotLike(name,"private",pageable);
        } else{
            return dataApplicationDao.findByMethodLikeAndNameLikeAndStatusNotLike(method,name,"private",pageable);
        }
    }

    public JSONObject searchApplication(DataApplicationFindDTO dataApplicationFindDTO){
        Pageable pageable = PageRequest.of(dataApplicationFindDTO.getPage()-1, dataApplicationFindDTO.getPageSize(), new Sort(dataApplicationFindDTO.getAsc()? Sort.Direction.ASC: Sort.Direction.DESC,dataApplicationFindDTO.getSortField()));
        Page<DataApplication> dataApplicationPage =selectMethodByNameAndMethod(dataApplicationFindDTO.getSearchText(),dataApplicationFindDTO.getMethod(),pageable);
        List<DataApplication> dataApplications = dataApplicationPage.getContent();

        JSONArray jsonArray = new JSONArray();
        for (int i=0;i<dataApplications.size();++i) {

            DataApplication dataApplication = dataApplications.get(i);

            String oid = dataApplication.getAuthor();
            User user = userDao.findFirstByOid(oid);
            JSONObject userObject = new JSONObject();
            userObject.put("id",user.getOid());
            userObject.put("image",user.getImage().equals("")?"":htmlLoadPath + user.getImage());
            userObject.put("name",user.getName());

            JSONObject jsonObject = new JSONObject();
            jsonObject.put("author",userObject);
            SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");
            jsonObject.put("createTime",simpleDateFormat.format(dataApplication.getCreateTime()));
            jsonObject.put("name",dataApplication.getName());
            jsonObject.put("description",dataApplication.getDescription());
            jsonObject.put("type",dataApplication.getType());
            jsonObject.put("status",dataApplication.getStatus());
            jsonObject.put("oid",dataApplication.getOid());
            jsonArray.add(jsonObject);
        }
        JSONArray users = new JSONArray();
        for(int i=0;i<dataApplications.size();++i) {
            DataApplication dataApplication = dataApplications.get(i);
            String oid = dataApplication.getAuthor();
            User user = userDao.findFirstByOid(oid);
            JSONObject userObj = new JSONObject();
            userObj.put("userId",user.getUserId());
            userObj.put("image", user.getImage().equals("") ? "" : htmlLoadPath + user.getImage());
            userObj.put("name", user.getName());
            users.add(userObj);

            dataApplications.get(i).setAuthor(user.getName());
            dataApplications.get(i).setOid(dataApplication.getId());
        }
        JSONObject res = new JSONObject();
        res.put("list",jsonArray);
        res.put("total",dataApplicationPage.getTotalElements());
        res.put("users",users);

        return res;
    }


    // public JSONObject searchByName(DataApplicationFindDTO dataApplicationFindDTO,String userOid) {
    //     int page = dataApplicationFindDTO.getPage()-1;
    //     int pageSize = dataApplicationFindDTO.getPageSize();
    //     String searchText = dataApplicationFindDTO.getSearchText();
    //     Sort sort = new Sort(dataApplicationFindDTO.getAsc() ? Sort.Direction.ASC:Sort.Direction.DESC, dataApplicationFindDTO.getSortField());
    //     Pageable pageable = PageRequest.of(page,pageSize,sort);
    //     Page<DataApplication> dataApplicationPage;
    //     if(userOid==null){
    //
    //     }
    //
    // }

    public Categorys getCateId(String id) {
        return categoryDao.findById(id).orElseGet(() -> {

            System.out.println("有人乱查数据库！！该ID不存在对象:" + id);

            throw new MyException(ResultEnum.NO_OBJECT);

        });
    }

    // //分类加关键字
    // public Page<DataApplication> listBySearch(DataApplicationFindDTO dataApplicationFindDTO) {
    //     List<String> dataApplicationId = new ArrayList<>();
    //     dataApplicationId = getCateId(dataApplicationFindDTO.getCategoryId()).getDataItem();
    //     DataApplication dataApplication = new DataApplication();
    //     List<DataApplication> res = new ArrayList<>();
    //     for(int i=0;i<dataApplicationId.size();++i){
    //         dataApplication = getById(dataApplicationId.get(i));
    //         for(int j=0;j<dataApplicationFindDTO.getSearchContent().size();++j){
    //             if(dataApplication.getName().contains(dataApplicationFindDTO.getSearchContent().get(j))||dataApplication.getDescription().contains(dataApplicationFindDTO.getSearchContent().get(i))){
    //                 res.add(dataApplication);
    //             }
    //         }
    //     }
    //     List<DataApplication> findList = new ArrayList<>();
    //     Integer ind = (dataApplicationFindDTO.getPage()*dataApplicationFindDTO.getPageSize() - dataApplicationFindDTO.getPageSize());
    //     if(res.size()<=dataApplicationFindDTO.getPageSize()) {
    //         findList = res;
    //     } else {
    //         if(ind + dataApplicationFindDTO.getPageSize() > res.size()) {
    //             int exp = res.size()%dataApplicationFindDTO.getPageSize();
    //             if((ind%dataApplicationFindDTO.getPageSize())==exp) {
    //                 findList.add(res.get(ind));
    //             } else {
    //                 findList = res.subList(ind,ind+exp);
    //             }
    //         }else{
    //             findList = res.subList(ind,ind+dataApplicationFindDTO.getPageSize());
    //         }
    //     }
    //     Sort sort = new Sort(dataApplicationFindDTO.getAsc()? Sort.Direction.ASC: Sort.Direction.DESC,"createTime");
    //     Page pageResult = new PageImpl(findList,new PageRequest(dataApplicationFindDTO.getPage(),dataApplicationFindDTO.getPageSize(),sort),res.size());
    //     return pageResult;
    // }
    //
    // public JSONObject searchResourceByCate(DataApplicationFindDTO dataApplicationFindDTO) {
    //     int page = dataApplicationFindDTO.getPage();
    //     int pageSize = dataApplicationFindDTO.getPageSize();
    //     Sort sort = new Sort(dataApplicationFindDTO.getAsc()? Sort.Direction.ASC: Sort.Direction.DESC,"viewCount");
    //     Pageable pageable = PageRequest.of(page,pageSize,sort);
    //
    //     Page<DataApplication> dataApplicationPage = dataApplicationDao.findByClassificationsInAndStatusNotLike(dataApplicationFindDTO.getClassifications(),pageable,"Private");
    //     List<DataApplication> dataApplications = dataApplicationPage.getContent();
    //
    //     JSONArray users = new JSONArray();
    //     for(int i=0;i<dataApplications.size();++i) {
    //         DataApplication dataApplication = dataApplications.get(i);
    //         String oid = dataApplication.getAuthor();
    //         User user = userDao.findFirstByOid(oid);
    //         JSONObject userObj = new JSONObject();
    //         userObj.put("oid", user.getOid());
    //         userObj.put("image", user.getImage().equals("") ? "" : htmlLoadPath + user.getImage());
    //         userObj.put("name", user.getName());
    //         users.add(userObj);
    //
    //         dataApplications.get(i).setAuthor(user.getName());
    //         dataApplications.get(i).setOid(dataApplication.getId());
    //     }
    //
    //     JSONArray jsonArray = new JSONArray();
    //     for (int i=0;i<dataApplications.size();++i) {
    //         JSONObject jsonObject = new JSONObject();
    //         DataApplication dataApplication = dataApplications.get(i);
    //
    //         String oid = dataApplication.getAuthor();
    //         User user = userDao.findFirstByOid(oid);
    //         JSONObject userObject = new JSONObject();
    //         userObject.put("oid",user.getOid());
    //         userObject.put("image",user.getImage().equals("")?"":htmlLoadPath + user.getImage());
    //         userObject.put("name",user.getName());
    //
    //         jsonObject.put("author",userObject);
    //         SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");
    //         jsonObject.put("createTime",simpleDateFormat.format(dataApplication.getCreateTime()));
    //         jsonObject.put("name",dataApplication.getName());
    //         jsonObject.put("description",dataApplication.getDescription());
    //         jsonObject.put("type",dataApplication.getType());
    //         jsonObject.put("status",dataApplication.getStatus());
    //         jsonArray.add(jsonObject);
    //     }
    //     JSONObject res = new JSONObject();
    //     res.put("list",jsonArray);
    //     res.put("total",dataApplicationPage.getTotalElements());
    //     res.put("users",users);
    //     return res;
    // }
    //
    // public JSONObject searchByName(DataApplicationFindDTO dataApplicationFindDTO,String userOid) {
    //     int page = dataApplicationFindDTO.getPage() - 1;
    //     int pageSize = dataApplicationFindDTO.getPageSize();
    //     String searchText = dataApplicationFindDTO.getSearchText();
    //
    //     Sort sort = new Sort(dataApplicationFindDTO.getAsc() ? Sort.Direction.ASC : Sort.Direction.DESC, dataApplicationFindDTO.getSortField());
    //     Pageable pageable = PageRequest.of(page, pageSize, sort);
    //
    //     Page<DataApplication> dataApplicationPage = dataApplicationDao.findByNameLikeAndStatusNotLike(pageable,dataApplicationFindDTO.getSearchText(),"Private");
    //     List<DataApplication> dataApplications = dataApplicationPage.getContent();
    //
    //     JSONArray users = new JSONArray();
    //     for(int i=0;i<dataApplications.size();++i) {
    //         DataApplication dataApplication = dataApplications.get(i);
    //         String oid = dataApplication.getAuthor();
    //         User user = userDao.findFirstByOid(oid);
    //         JSONObject userObj = new JSONObject();
    //         userObj.put("oid", user.getOid());
    //         userObj.put("image", user.getImage().equals("") ? "" : htmlLoadPath + user.getImage());
    //         userObj.put("name", user.getName());
    //         users.add(userObj);
    //
    //         dataApplications.get(i).setAuthor(user.getName());
    //         dataApplications.get(i).setOid(dataApplication.getId());
    //     }
    //
    //     JSONObject res = new JSONObject();
    //     res.put("list",dataApplications);
    //     res.put("total",dataApplicationPage.getTotalElements());
    //     res.put("pages",dataApplicationPage.getTotalPages());
    //     res.put("users",users);
    //
    //     return  res;
    // }
}
