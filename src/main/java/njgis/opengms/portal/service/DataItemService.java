package njgis.opengms.portal.service;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import lombok.extern.slf4j.Slf4j;
import njgis.opengms.portal.PortalApplication;
import njgis.opengms.portal.dao.*;
import njgis.opengms.portal.dto.categorys.CategoryAddDTO;
import njgis.opengms.portal.dto.dataItem.DataItemAddDTO;
import njgis.opengms.portal.dto.dataItem.DataItemFindDTO;
import njgis.opengms.portal.dto.dataItem.DataItemResultDTO;
import njgis.opengms.portal.dto.dataItem.DataItemUpdateDTO;
import njgis.opengms.portal.entity.*;
import njgis.opengms.portal.entity.support.DataMeta;
import njgis.opengms.portal.enums.ResultEnum;
import njgis.opengms.portal.exception.MyException;
import njgis.opengms.portal.utils.ResultUtils;
import njgis.opengms.portal.utils.Utils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.*;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import org.thymeleaf.templateresolver.ClassLoaderTemplateResolver;
import sun.misc.BASE64Encoder;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.net.InetAddress;
import java.net.InetSocketAddress;
import java.net.Socket;
import java.net.SocketAddress;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * @ClassName DataItemService
 * @Description todo
 * @Author sun_liber
 * @Date 2019/2/13
 * @Version 1.0.0
 */
@Service
@Slf4j
@Component
public class DataItemService {
    @Autowired
    DataItemDao dataItemDao;

    @Autowired
    DataItem2Dao dataItem2Dao;

    @Autowired
    ModelItemDao modelItemDao;

    @Autowired
    CategoryDao categoryDao;

    @Autowired
    HubsDao hubsDao;

    @Autowired
    UserDao userDao;

    @Autowired
    DataItemVersionDao dataItemVersionDao;

    @Autowired
    DistributedNodeDao distributedNodeDao;

    @Autowired
    DataCategorysDao dataCategorysDao;

    @Autowired
    DataItemNewDao dataItemNewDao;

    @Autowired
    DataHubsDao dataHubsDao;

    @Autowired
    DataHubsVersionDao dataHubsVersionDao;

    @Autowired
    UserService userService;

    @Value("${htmlLoadPath}")
    private String htmlLoadPath;

    @Value("${resourcePath}")
    private String resourcePath;

    @Value(value = "Public,Discoverable")
    private List<String> itemStatusVisible;

    public void update(String id, DataItemUpdateDTO dataItemUpdateDTO) {
        DataItem dataItem = dataItemDao.findById(id).orElseGet(() -> {
            System.out.println("有人乱查数据库！！该ID不存在对象");
            throw new MyException(ResultEnum.NO_OBJECT);
        });
        BeanUtils.copyProperties(dataItemUpdateDTO, dataItem);
        Date now = new Date();
        dataItem.setLastModifyTime(now);
        //更新评论
//        dataItem.getComments().setCommentDate(now);
        dataItemDao.save(dataItem);
    }

    public JSONObject updateDataItem(DataItemUpdateDTO dataItemUpdateDTO, String oid){
        JSONObject result = new JSONObject();
        DataItem dataItem = dataItemDao.findFirstById(dataItemUpdateDTO.getDataItemId());

        String author = dataItem.getAuthor();
        Date now = new Date();
        if (!dataItem.isLock()){
            if (author.equals(oid)){
                //更新数据类下的数据条目
                List<String> classifications = dataItem.getClassifications();
                //删除类与dataItem的绑定
                for (String classification : classifications){
                    DataCategorys dataCategorys = new DataCategorys();
                    dataCategorys = dataCategorysDao.findFirstById(classification);
                    for (String dataItem1 : dataCategorys.getDataRepository()){
                        if (dataItem1.equals(dataItem.getId())){
                            dataCategorys.getDataRepository().remove(dataItem1);
                            dataCategorysDao.save(dataCategorys);
                            break;
                        }
                    }
                }

                //重新绑定类即可
                List<String> classification1 = dataItemUpdateDTO.getClassifications();
                for (String classification : classification1){
                    DataCategorys dataCategorys = new DataCategorys();
                    dataCategorys = dataCategorysDao.findFirstById(classification);
                    dataCategorys.getDataRepository().add(dataItem.getId());
                    dataCategorysDao.save(dataCategorys);
                }

                BeanUtils.copyProperties(dataItemUpdateDTO,dataItem);
                String uploadImage = dataItemUpdateDTO.getUploadImage();
                if (!uploadImage.contains("/dataItem/") && !uploadImage.equals("")){
                    //删除旧图片
                    File file = new File(resourcePath + dataItem.getImage());
                    if (file.exists()&&file.isFile())
                        file.delete();
                    //添加新图片
                    String uuid = UUID.randomUUID().toString();
                    String path = "/static/repository/dataItem/" + uuid + ".jpg";//入库
                    String path1 = "/repository/dataItem/" + uuid + ".jpg";//存储
                    String imgStr = uploadImage.split(",")[1];
                    Utils.base64StrToImage(imgStr, resourcePath + path1);
                    dataItem.setImage(path);
                }
                dataItem.setLastModifyTime(now);
                dataItemDao.save(dataItem);
                result.put("method", "update");
                result.put("oid",dataItem.getId());
                return result;
            }else {
                DataItemVersion dataItemVersion = new DataItemVersion();
                BeanUtils.copyProperties(dataItemUpdateDTO,dataItemVersion,"id");

                String uploadImage = dataItemUpdateDTO.getUploadImage();
                if (uploadImage.equals("")){
                    dataItemVersion.setImage("");
                }else if (!uploadImage.contains("/dataItem/")&&!uploadImage.equals("")){
                    String uuid = UUID.randomUUID().toString();
                    String path = "/static/repository/dataItem/" + uuid + ".jpg";//入库
                    String path1 = "/repository/dataItem/" + uuid + ".jpg";//存储
                    String imgStr = uploadImage.split(",")[1];
                    Utils.base64StrToImage(imgStr, resourcePath + path1);
                    dataItemVersion.setImage(path);
                }else {
                    String[] names = uploadImage.split("dataItem");
                    dataItemVersion.setImage("/dataItem/"+names[1]);
                }

                dataItemVersion.setModifier(oid);
                dataItemVersion.setVerStatus(0);

                //todo  messageNum
                User user = userDao.findFirstByOid(dataItem.getAuthor());
                userService.messageNumPlusPlus(user.getUserName());

                dataItemVersion.setModifyTime(new Date());
                dataItemVersion.setCreator(author);
                dataItemVersion.setOriginId(dataItem.getId());
                dataItemVersion.setOid(UUID.randomUUID().toString());
                dataItemVersionDao.insert(dataItemVersion);

                dataItem.setLock(true);
                dataItemDao.save(dataItem);
                result.put("method", "version");
                result.put("oid", dataItemVersion.getId());
                return result;
            }
        } else {
            return null;
        }
    }
    public JSONObject updateDataHubs(DataItemUpdateDTO dataItemUpdateDTO, String oid){
        JSONObject result = new JSONObject();
        DataHubs dataHubs = dataHubsDao.findFirstById(dataItemUpdateDTO.getDataItemId());

        String author = dataHubs.getAuthor();
        Date now = new Date();
        if (!dataHubs.isLock()){
            if (author.equals(oid)){
                //更新数据类下的数据条目
                List<String> classifications = dataHubs.getClassifications();
                //删除类与dataHubs的绑定
                for (String classification : classifications){
                    DataCategorys dataCategorys = new DataCategorys();
                    dataCategorys = dataCategorysDao.findFirstById(classification);
                    for (String dataHubs1 : dataCategorys.getDataHubs()){
                        if (dataHubs1.equals(dataHubs.getId())){
                            dataCategorys.getDataHubs().remove(dataHubs1);
                            dataCategorysDao.save(dataCategorys);
                            break;
                        }
                    }
                }

                //重新绑定类即可
                List<String> classification1 = dataItemUpdateDTO.getClassifications();
                for (String classification : classification1){
                    DataCategorys dataCategorys = new DataCategorys();
                    dataCategorys = dataCategorysDao.findFirstById(classification);
                    dataCategorys.getDataHubs().add(dataHubs.getId());
                    dataCategorysDao.save(dataCategorys);
                }

                BeanUtils.copyProperties(dataItemUpdateDTO,dataHubs);
                String uploadImage = dataItemUpdateDTO.getUploadImage();
                if (!uploadImage.contains("/dataItem/") && !uploadImage.equals("")){
                    //删除旧图片
                    File file = new File(resourcePath + dataHubs.getImage());
                    if (file.exists()&&file.isFile())
                        file.delete();
                    //添加新图片
                    String uuid = UUID.randomUUID().toString();
                    String path = "/static/repository/dataItem/" + uuid + ".jpg";//入库
                    String path1 = "/repository/dataItem/" + uuid + ".jpg";//存储
                    String imgStr = uploadImage.split(",")[1];
                    Utils.base64StrToImage(imgStr, resourcePath + path1);
                    dataHubs.setImage(path);
                }
                dataHubs.setLastModifyTime(now);
                dataHubsDao.save(dataHubs);
                result.put("method", "update");
                result.put("oid",dataHubs.getId());
                return result;
            }else {
                DataHubsVersion dataHubsVersion = new DataHubsVersion();
                BeanUtils.copyProperties(dataItemUpdateDTO,dataHubsVersion,"id");

                String uploadImage = dataItemUpdateDTO.getUploadImage();
                if (uploadImage.equals("")){
                    dataHubsVersion.setImage("");
                }else if (!uploadImage.contains("/dataItem/")&&!uploadImage.equals("")){
                    String uuid = UUID.randomUUID().toString();
                    String path = "/static/repository/dataItem/" + uuid + ".jpg";//入库
                    String path1 = "/repository/dataItem/" + uuid + ".jpg";//存储
                    String imgStr = uploadImage.split(",")[1];
                    Utils.base64StrToImage(imgStr, resourcePath + path1);
                    dataHubsVersion.setImage(path);
                }else {
                    String[] names = uploadImage.split("dataItem");
                    dataHubsVersion.setImage("/dataItem/"+names[1]);
                }

                dataHubsVersion.setModifier(oid);
                dataHubsVersion.setVerStatus(0);

                //todo  messageNum
                User user = userDao.findFirstByOid(dataHubs.getAuthor());
                userService.messageNumPlusPlus(user.getUserName());

                dataHubsVersion.setModifyTime(new Date());
                dataHubsVersion.setCreator(author);
                dataHubsVersion.setOriginId(dataHubs.getId());
                dataHubsVersion.setOid(UUID.randomUUID().toString());
                dataHubsVersionDao.insert(dataHubsVersion);

                dataHubs.setLock(true);
                dataHubsDao.save(dataHubs);
                result.put("method", "version");
                result.put("oid", dataHubsVersion.getId());
                return result;
            }
        } else {
            return null;
        }
    }

    public int delete(String id,String userOid) {
        //需要在catagory中删除此data item记录,以及在data item集合中删除本身
        DataItem data = new DataItem();
        data = getById(id);

        if(!data.getAuthor().equals(userOid))
            return 2;

        List<String> cate = new ArrayList<>();

        List<String> ids = new ArrayList<>();
        List<String> newids = new ArrayList<>();

//        String parid;
//
//        List<DataCategorys> p;
//
//        List<String> allDataItem;

        cate = data.getClassifications();//获得该data item所在分类
        for (int i = 0; i < cate.size(); i++) {
            DataCategorys dataCategorys = new DataCategorys();
            if(null == getDataCategoryById(cate.get(i))){
                continue;
            }else {
                ids = dataCategorys.getDataRepository();
                //删除所属小类中的记录
                if (ids.size() > 0 && ids != null)
                    for (int j = 0; j < ids.size(); j++) {
                        if (ids.get(j).equals(id)) {
                            newids = delOneOfArrayList(ids, id);
                            break;
                        }
                    }
                //用户中心删除数控条目时，category库里同时删除
                dataCategorys.setDataRepository(newids);
                dataCategorysDao.save(dataCategorys);
            }
        }

        List<String> relatedModels = data.getRelatedModels();
        if (relatedModels!=null)
            for (int i = 0; i < relatedModels.size(); i++) {
                ModelItem modelItem = modelItemDao.findFirstByOid(relatedModels.get(i));
                modelItem.getRelatedData().remove(id);
                modelItemDao.save(modelItem);
            }

        dataItemDao.deleteById(id);
        return 1;
    }
    public int deleteHubs(String id,String userOid) {
        //需要在DataCategorys中删除此data hubs记录,以及在data hubs集合中删除本身
        DataHubs data = new DataHubs();
        data = getHubsById(id);

        if(!data.getAuthor().equals(userOid))
            return 2;

        List<String> cate = new ArrayList<>();

        List<String> ids = new ArrayList<>();
        List<String> newids = new ArrayList<>();

        String parid;

        List<DataCategorys> p;

        List<String> allDataItem;

        cate = data.getClassifications();//获得该data item所在分类
        for (int i = 0; i < cate.size(); i++) {
            DataCategorys dataCategorys = getDataCategoryById(cate.get(i));//data item所属类

//            parid = dataCategorys.getParentCategory();//data item所属父类（大类）id
//            p = new ArrayList<>();
////            p = dataCategorysDao.findAllByCategory("...All");//找到所有all的类
//
//            for (int k = 0; k < p.size(); k++) {//通过父类匹配到存在该data item的all，删除记录
//                if (p.get(k).getParentCategory().equals(parid)) {
//                    allDataItem = new ArrayList<>();
//                    allDataItem = delOneOfArrayList(p.get(k).getDataItem(), id);//返回删除后的data item集合
//                    p.get(k).setDataItem(allDataItem);//重新赋值
////                    dataCategorysDao.save(p.get(k));
//                    break;
//                }
//            }
            ids = dataCategorys.getDataHubs();
            //删除所属小类中的记录
            if (ids.size() > 0&&ids != null)
                for (int j = 0; j < ids.size(); j++) {
                    if (ids.get(j).equals(id)) {
                        newids = delOneOfArrayList(ids, id);
                        break;
                    }
                }
            //用户中心删除数控条目时，category库里同时删除
            dataCategorys.setDataHubs(newids);
            dataCategorysDao.save(dataCategorys);
        }

        List<String> relatedModels = data.getRelatedModels();
        if (relatedModels!=null)
            for (int i = 0; i < relatedModels.size(); i++) {
                ModelItem modelItem = modelItemDao.findFirstByOid(relatedModels.get(i));
                modelItem.getRelatedData().remove(id);
                modelItemDao.save(modelItem);
            }

        dataHubsDao.deleteById(id);
        return 1;
    }

    public List<String> delOneOfArrayList(List<String> arr, String str) {
        List<String> st = new ArrayList<>();

        for (int i = 0; i < arr.size(); i++) {
            if (!arr.get(i).equals(str)) {
                st.add(arr.get(i));
            }
        }

        return st;
    }

    public DataItem getById(String id) {


        return dataItemDao.findById(id).orElseGet(() -> {

            System.out.println("有人乱查数据库！！该ID不存在对象:" + id);

            throw new MyException(ResultEnum.NO_OBJECT);

        });


    }
    //增加一个对dataHubs的查询
    public DataHubs getHubsById(String id) {


        return dataHubsDao.findById(id).orElseGet(() -> {

            System.out.println("有人乱查数据库！！该ID不存在对象:" + id);

            throw new MyException(ResultEnum.NO_OBJECT);

        });


    }

    public Categorys getCateId(String id) {
        return categoryDao.findById(id).orElseGet(() -> {

            System.out.println("有人乱查数据库！！该ID不存在对象:" + id);

            throw new MyException(ResultEnum.NO_OBJECT);

        });
    }

    public ModelItem getModelById(String id) {

        return modelItemDao.findById(id).orElseGet(() -> {

            System.out.println("有人乱查数据库！！该ID不存在对象:" + id);

            throw new MyException(ResultEnum.NO_OBJECT);

        });


    }

    long dataCount() {
        return dataItemDao.count();
    }

    public List<DataItem> generatehtmls(int page) {

//        PageRequest pageRequest=new PageRequest(0,10);
        PageRequest pageRequest = new PageRequest(page, 10);

        Page<DataItem> alldata = dataItemDao.findAll(pageRequest);

//        long allcount=dataItemDao.count();
        return alldata.getContent();

    }

    //用户拿到上传的所有条目
    public Page<DataItem> getUsersUploadData(String author, Integer page, Integer pagesize, Integer asc) {

        boolean as = false;
        if (asc == 1) {
            as = true;
        } else {
            as = false;
        }

        Sort sort = new Sort(as ? Sort.Direction.ASC : Sort.Direction.DESC, "createTime");
        Pageable pageable = PageRequest.of(page, pagesize, sort);
        return dataItemDao.findByAuthor(pageable, author);

    }
    public Page<DataHubs> getUsersUploadDataHubs(String author, Integer page, Integer pagesize, Integer asc) {

        boolean as = false;
        if (asc == 1) {
            as = true;
        } else {
            as = false;
        }

        Sort sort = new Sort(as ? Sort.Direction.ASC : Sort.Direction.DESC, "createTime");
        Pageable pageable = PageRequest.of(page, pagesize, sort);
        return dataHubsDao.findByAuthor(pageable, author);

    }

    //获得用户创建条目的总数
    public Integer getAmountOfData(String userOid) {

        List<Item> resultList = dataItemDao.findAllByAuthor(userOid);
        return resultList.size();
    }

    //用户创建dataitem页面
    public Integer addDataItemByUser(String id) throws IOException {
        //生成静态html
        ClassLoaderTemplateResolver resolver = new ClassLoaderTemplateResolver();
        resolver.setPrefix("templates/");//模板所在目录，相对于当前classloader的classpath。
        resolver.setSuffix(".html");//模板文件后缀
        TemplateEngine templateEngine = new TemplateEngine();
        templateEngine.setTemplateResolver(resolver);

        String path;
        path = PortalApplication.class.getClassLoader().getResource("").getPath();

        File dataitemfile = new File(path + "/templates/dataItems");

        if (!dataitemfile.exists()) {
            dataitemfile.mkdir();
        }

        Context context = new Context();
        context.setVariable("datainfo", ResultUtils.success(getById(id)));

        FileWriter writer = new FileWriter(path + "/templates/dataItems/" + id + ".html");
        templateEngine.process("data_item_info", context, writer);

        writer.flush();
        writer.close();

        return 1;


    }

    //viewPlus
    public Integer viewCountPlus(String id) {
        DataItem dataItem = getById(id);

        Integer viewCount = dataItem.getViewCount();
        dataItem.setViewCount(viewCount + 1);

        dataItemDao.save(dataItem);
        return 1;
    }

    //getViewCount
    public Integer getViewCount(String id) {
        DataItem dataItem = getById(id);

        Integer viewCount = dataItem.getViewCount();

        return viewCount;
    }


    public DataItem insert(DataItemAddDTO dataItemAddDTO) {
        //todo insert
        DataItem dataItem = new DataItem();
        BeanUtils.copyProperties(dataItemAddDTO, dataItem);
        Date now = new Date();
        dataItem.setOid(UUID.randomUUID().toString());
        dataItem.setCreateTime(now);

        //设置dataItem的图片path以及存储图片
        String path = "/static/repository/dataItem/" + UUID.randomUUID().toString() + ".jpg";
        String[] strs = dataItemAddDTO.getUploadImage().split(",");
        if(strs.length > 1){
            String imgStr = dataItemAddDTO.getUploadImage().split(",")[1];
            Utils.base64StrToImage(imgStr, resourcePath + path);
            dataItem.setImage(path);
        } else {
            dataItem.setImage("");
        }


//        dataItem.getComments().setCommentDate(now);

        dataItem.setLastModifyTime(now);
        return dataItemDao.insert(dataItem);
    }
    public DataItem insertHubs(DataItemAddDTO dataItemAddDTO) {
        //todo insert
        DataHubs dataHubs = new DataHubs();
        BeanUtils.copyProperties(dataItemAddDTO, dataHubs);
        Date now = new Date();
        dataHubs.setOid(UUID.randomUUID().toString());
        dataHubs.setCreateTime(now);
        dataHubs.setTabType("hub");

        //设置dataItem的图片path以及存储图片
        String uuid = UUID.randomUUID().toString();
        String path = "/static/repository/dataItem/" + uuid + ".jpg";//入库
        String path1 = "/repository/dataItem/" + uuid + ".jpg";//存储
        String[] strs = dataItemAddDTO.getUploadImage().split(",");
        if(strs.length > 1){
            String imgStr = dataItemAddDTO.getUploadImage().split(",")[1];
            Utils.base64StrToImage(imgStr, resourcePath + path1);
            dataHubs.setImage(path);
        } else {
            dataHubs.setImage("");
        }

//        dataItem.getComments().setCommentDate(now);

        dataHubs.setLastModifyTime(now);
        return dataHubsDao.insert(dataHubs);
    }

    public DataItem insertDistributeData(String id,String oid,String name,String date,String type,Boolean authority,String token,JSONObject meta){
        DataItem dataItem = new DataItem();
        Date now = new Date();
        //将dto中的数据转换到dataItem里
        dataItem.setDistributedNodeDataId(id);
        dataItem.setAuthor(oid);
        dataItem.setDate(date);
        dataItem.setName(name);
        dataItem.setType(type);
        dataItem.setAuthority(authority);
        dataItem.setToken(token);
        dataItem.setCreateTime(now);
        dataItem.setWorkSpace(meta.getString("workSpace"));
        dataItem.setDescription(meta.getString("description"));
        dataItem.setDetail(meta.getString("detail"));
        dataItem.setDataPath(meta.getString("dataPath"));
        dataItem.setDataType("DistributedNode");
        JSONArray tags = new JSONArray();
        tags = meta.getJSONArray("tags");
        List<String> list = new ArrayList<>();
        for (int i=0;i<tags.size();i++){
            list.add(tags.getString(i));
        }
        dataItem.setClassifications(list);

        return dataItemDao.insert(dataItem);
    }


    public Page<DataItem> test(DataItemFindDTO dataItemFindDTO) {
        Sort sort = new Sort(dataItemFindDTO.getAsc() ? Sort.Direction.ASC : Sort.Direction.DESC, "createDate");
        Pageable pageable = PageRequest.of(dataItemFindDTO.getPage(), dataItemFindDTO.getPageSize(), sort);

        return dataItemDao.findByClassificationsIsIn(pageable, dataItemFindDTO.getCategoryId());

    }

    public Page<DataItem> searchFromAllData(DataItemFindDTO dataItemFindDTO) {
        Sort sort = new Sort(dataItemFindDTO.getAsc() ? Sort.Direction.ASC : Sort.Direction.DESC, "createDate");
        Pageable pageable = PageRequest.of(dataItemFindDTO.getPage(), dataItemFindDTO.getPageSize(), sort);
        String se = dataItemFindDTO.getSearchContent().get(0);

        return dataItemDao.findByNameContainingOrDescriptionContainingOrKeywordsContaining(pageable, se, se, se);

    }


    //分类加关键字
    public Page<DataItem> listBySearch(DataItemFindDTO dataItemFindDTO) {


        List<String> dataItemsId = new ArrayList<>();
        dataItemsId = getCateId(dataItemFindDTO.getCategoryId()).getDataItem();

        DataItem dataItem = new DataItem();

        List<DataItem> result = new ArrayList<>();


        for (int i = 0; i < dataItemsId.size(); i++) {
            dataItem = getById(dataItemsId.get(i));


            for (int j = 0; j < dataItemFindDTO.getSearchContent().size(); j++) {
                if (dataItem.getName().contains(dataItemFindDTO.getSearchContent().get(j)) || dataItem.getDescription().contains(dataItemFindDTO.getSearchContent().get(j))) {
                    result.add(dataItem);

                }
            }

        }
        List<DataItem> flist = new ArrayList<>();

        Integer ind = (dataItemFindDTO.getPage()) * dataItemFindDTO.getPageSize() - dataItemFindDTO.getPageSize();


        if (result.size() <= dataItemFindDTO.getPageSize()) {
            flist = result;
        } else {

            if (ind + dataItemFindDTO.getPageSize() > result.size()) {
                int exp = result.size() % dataItemFindDTO.getPageSize();


                if ((ind % dataItemFindDTO.getPageSize()) == exp) {
                    flist.add(result.get(ind));

                } else {
                    flist = result.subList(ind, ind + exp);
                }

            } else {
                flist = result.subList(ind, ind + dataItemFindDTO.getPageSize());
            }

        }


        Sort sort = new Sort(dataItemFindDTO.getAsc() ? Sort.Direction.ASC : Sort.Direction.DESC, dataItemFindDTO.getSortField());

        Page pageResult = new PageImpl(flist, new PageRequest(dataItemFindDTO.getPage(), dataItemFindDTO.getPageSize(), sort), result.size());


        return pageResult;


    }

    public JSONObject searchResourceByNameAndCate(DataItemFindDTO dataItemFindDTO) {

        int page = dataItemFindDTO.getPage();
        int pageSize = dataItemFindDTO.getPageSize();
        String searchText = dataItemFindDTO.getSearchText();

        Sort sort = new Sort(dataItemFindDTO.getAsc() ? Sort.Direction.ASC : Sort.Direction.DESC, "viewCount");
        Pageable pageable = PageRequest.of(page, pageSize, sort);

        Page<DataItem> dataItemPage = dataItemDao.findAllByContentTypeAndNameContainsIgnoreCaseAndClassificationsIn("resource", searchText, dataItemFindDTO.getClassifications(), pageable);
        List<DataItem> dataItems = dataItemPage.getContent();

        JSONArray list = new JSONArray();
        for (int i = 0; i < dataItems.size(); i++) {
            JSONObject object = new JSONObject();
            DataItem dataItem = dataItems.get(i);

            String oid = dataItem.getAuthor();
            User user = userDao.findFirstByOid(oid);
            JSONObject userObj = new JSONObject();
            userObj.put("oid", user.getOid());
            userObj.put("image", user.getImage().equals("") ? "" : htmlLoadPath + user.getImage());
            userObj.put("name", user.getName());

            String dataStr = "";
            List<DataMeta> dataMetaList = dataItem.getDataList();
            for (int j = 0; j < dataMetaList.size(); j++) {
                DataMeta dataMeta = dataMetaList.get(j);
                dataStr += j == 0 ? "" : ", ";
                dataStr += dataMeta.getName() + (dataMeta.getSuffix().equals("unknow") ? "" : dataMeta.getSuffix());
            }

            object.put("id", dataItem.getId());
            object.put("name", dataItem.getName());
            object.put("author", userObj);
            object.put("dataList", dataItem.getDataList());
            object.put("dataStr", dataStr);
            SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");
            object.put("createTime", simpleDateFormat.format(dataItem.getCreateTime()));


            list.add(object);


//            dataItems.get(i).setAuthor(user.getName());
//            dataItems.get(i).setOid(dataItem.getId());

        }

        JSONObject result = new JSONObject();
        result.put("list", list);
        result.put("total", dataItemPage.getTotalElements());

        return result;

    }

    // public Page<DataItemResultDTO> selectBySearchField(Pageable pageable, String value, String field, String type) {
    //     Page<DataItem> result;
    //     switch (field) {
    //         case "Name": {
    //             result = dataItemDao.findAllByNameLikeIgnoreCase(pageable, value);
    //             break;
    //         }
    //         case "Keyword":{
    //             result = dataItemDao.findByKey
    //         }
    //
    //     }
    //
    //     return result;
    // }


    public JSONObject searchByCurQueryField(DataItemFindDTO dataItemFindDTO,String userOid, String curQueryField) {
        int page = dataItemFindDTO.getPage() - 1;
        int pageSize = dataItemFindDTO.getPageSize();
        String searchText = dataItemFindDTO.getSearchText();

        String tabType= dataItemFindDTO.getTabType();
        String dataType = dataItemFindDTO.getDataType();
        if (dataType!=null && dataType.equals("all")){
            tabType = "all";
        }
        String pattern1 = "hub";
        Pattern p1 = Pattern.compile(pattern1);
        Matcher m1 = p1.matcher(tabType);

        String pattern2 = "repository";
        Pattern p2 = Pattern.compile(pattern2);
        Matcher m2 = p2.matcher(tabType);
        //正则匹配tabType
        boolean isMatch1 = m1.find();
        boolean isMatch2 = m2.find();
        if (isMatch1){
            tabType = "hub";
        }
        if (isMatch2){
            tabType = "repository";
        }

        Sort sort = new Sort(dataItemFindDTO.getAsc() ? Sort.Direction.ASC : Sort.Direction.DESC, dataItemFindDTO.getSortField());
        Pageable pageable = PageRequest.of(page, pageSize, sort);
        Page<DataItemResultDTO> dataItemPages;
        // if(userOid!=null){
        //     if (tabType.equals("hub")){
        //         dataItemPages = dataHubsDao.findByNameLikeIgnoreCase(pageable, searchText);
        //     }else {
        //         dataItemPages = dataItemDao.findByNameLikeIgnoreCase(pageable, searchText);
        //     }
        // }else{
        //     // tabType = "all";
        //     if (tabType.equals("hub")){
        //         dataItemPages = dataHubsDao.findByNameLikeAndAuthorIgnoreCase(pageable, searchText,userOid);
        //     }else {
        //         dataItemPages = dataItemDao.findByNameLikeAndAuthorIgnoreCaseAndStatusNotLike(pageable, searchText,userOid,"Private");
        //     }
        // }
        if(tabType.equals("hub")){
            switch (curQueryField){
                case "Name":{
                    dataItemPages = dataHubsDao.findByNameLikeIgnoreCase(pageable, searchText);
                    break;
                }
                case "Keyword":{
                    dataItemPages = dataHubsDao.findByKeywordsContains(pageable, searchText);
                    break;
                }
                case "Content":{
                    dataItemPages = dataHubsDao.findByDescriptionIsContaining(pageable, searchText);
                    break;
                }
                case "Contributor":{        // 这里需要先从user表里面查出来oid，因为dataItem表的author字段里面存的是oid
                    User user = userDao.findFirstByName(searchText);
                    if(user != null && user.getOid() != ""){
                        dataItemPages = dataHubsDao.findByAuthorLikeIgnoreCase(pageable, user.getOid());
                    }else{
                        return null;
                    }
                    break;
                }
                default:{
                    System.out.println("curQueryField " + curQueryField + "is not right" );
                    return null;
                }
            }
        }else {
            switch (curQueryField){
                case "Name":{
                    dataItemPages = dataItemDao.findByNameLikeIgnoreCase(pageable, searchText);
                    break;
                }
                case "Keyword":{
                    dataItemPages = dataItemDao.findByKeywordsContains(pageable, searchText);
                    break;
                }
                case "Content":{
                    dataItemPages = dataItemDao.findByDescriptionIsContaining(pageable, searchText);
                    break;
                }
                case "Contributor":{
                    User user = userDao.findFirstByName(searchText);
                    if(user!=null && user.getOid() != ""){
                        dataItemPages = dataItemDao.findByAuthorLikeIgnoreCase(pageable, user.getOid());
                    }else{
                        return null;
                    }
                    break;
                }
                default:{
                    System.out.println("curQueryField " + curQueryField + "is not right" );
                    return null;
                }
            }
        }

        Page<DataItemResultDTO> dataItemPage;
        //匹配hubs的类别
        dataItemPage = dataItemPages;
        // long count = 0;
        List<DataItemResultDTO> dataItems = dataItemPage.getContent();
        // count = dataItemPage.getTotalElements();
        // }else {
        //     for (DataItemResultDTO dataItemResultDTO : dataItemss) {
        //         if (dataItemResultDTO.getTabType()!=null&&dataItemResultDTO.getTabType().equals(tabType)) {
        //             dataItems.add(dataItemResultDTO);
        //             count++;
        //         }
        //     }
        // }


        JSONArray users = new JSONArray();

        for (int i = 0; i < dataItems.size(); i++) {
            DataItemResultDTO dataItem = dataItems.get(i);
            String oid = dataItem.getAuthor();
            User user = userDao.findFirstByOid(oid);
            JSONObject userObj = new JSONObject();
            userObj.put("oid", user.getOid());
            userObj.put("image", user.getImage().equals("") ? "" : htmlLoadPath + user.getImage());
            userObj.put("name", user.getName());
            users.add(userObj);

            dataItems.get(i).setAuthor(user.getName());
            dataItems.get(i).setOid(dataItem.getId());
        }

        JSONObject result = new JSONObject();
        result.put("list", dataItems);
        result.put("total", dataItemPage.getTotalElements());
        result.put("pages", dataItemPage.getTotalPages());
        result.put("users", users);

        return result;
    }


    //search
    public JSONObject searchByTitleByOid(DataItemFindDTO dataItemFindDTO, String oid,String loadUser) {
//        String userName = userDao.findFirstByOid(oid).getUserName();
        int page = dataItemFindDTO.getPage();
        int pageSize = dataItemFindDTO.getPageSize();
        String sortElement = dataItemFindDTO.getSortElement();
        Boolean asc = dataItemFindDTO.getAsc();
        String name = dataItemFindDTO.getSearchText();

        Sort sort = new Sort(asc ? Sort.Direction.ASC : Sort.Direction.DESC, sortElement);
        Pageable pageable = PageRequest.of(page, pageSize, sort);
        Page<DataItem> dataItemResultDTOPage = Page.empty();
//        if(loadUser==null||!loadUser.equals(oid)) {
        dataItemResultDTOPage = dataItemDao.findByAuthorAndNameContainsAndStatusIn(pageable, oid, name, itemStatusVisible);
//        }else{
//            dataItemResultDTOPage = dataItemDao.findByAuthorAndNameContains(pageable, oid, name);
//        }
        JSONObject result = new JSONObject();
        result.put("list", dataItemResultDTOPage.getContent());
        result.put("total", dataItemResultDTOPage.getTotalElements());
        System.out.println(result);
        return result;

    }

    //分类

    public JSONObject findByCategory(String categorysId, Integer page, boolean asc, Integer pageSize) {
        Sort sort = new Sort(asc ? Sort.Direction.ASC : Sort.Direction.DESC, "viewCount");
        Pageable pageable = PageRequest.of(page, pageSize, sort);
        List<String> cates = new ArrayList<>();
        cates.add(categorysId);
        Page<DataItemResultDTO> dataItemResultDTOPage = dataItemDao.findByClassificationsIn(pageable, cates);
        List<DataItemResultDTO> dataItemResultDTOList = dataItemResultDTOPage.getContent();

        JSONArray users = new JSONArray();
        for (DataItemResultDTO data : dataItemResultDTOList) {
            String author = data.getAuthor();
            User user = userDao.findFirstByOid(author);
            JSONObject userJson = new JSONObject();
            userJson.put("name", user.getName());
            userJson.put("oid", user.getOid());
            String img = user.getImage();
            userJson.put("image", img.equals("") ? "" : htmlLoadPath + user.getImage());
            users.add(userJson);
        }

        JSONObject result = new JSONObject();
        result.put("content", dataItemResultDTOPage.getContent());
        result.put("totalElements", dataItemResultDTOPage.getTotalElements());
        result.put("users", users);

        return result;

    }


    public JSONObject findByCateg(String categorysId, Integer page, boolean asc, Integer pageSize,String loadUser,String dataType) {


        List<String> category;
        //从category拿到dataItemid
        category = findByDaCa(categorysId,dataType);


        List<Map<String, Object>> resultList = new ArrayList<>();


        List<Map<String, Object>> flist = new ArrayList<>();

//        DataItem it;
        DataItem it;

        Map<String, Object> everyData;

        int start = (page - 1) * 10;
        int end = -1;
        int p;
        if (category.size() < 10) {
            end = category.size();
        } else {

            if (category.size() % 10 == 0) {
                p = category.size() / 10;
                end = start + 10;

            } else if (category.size() % 10 != 0) {
                p = category.size() / 10 + 1;
                if (page.equals(p)) {
                    end = start + category.size() % 10;
                } else {
                    end = start + 10;
                }


            }

        }


        //从dataItem中取得项
        JSONArray users = new JSONArray();
        for (int i = start; i < end; i++) {

            everyData = new HashMap<>();
            it = getById(category.get(i));
            if(it.getStatus()!=null&&it.getStatus().equals("Private"))
                continue;
            everyData.put("name", it.getName());
            everyData.put("id", it.getId());
            everyData.put("description", it.getDescription());
            everyData.put("keywords", it.getKeywords());
            everyData.put("createTime", it.getCreateTime());
            everyData.put("viewCount", it.getViewCount());
            everyData.put("status",it.getStatus());

            User user = userDao.findFirstByOid(getById(category.get(i)).getAuthor());
            JSONObject userJson = new JSONObject();
            userJson.put("name", user.getName());
            userJson.put("oid", user.getOid());
            String img = user.getImage();
            userJson.put("image", img.equals("") ? "" : htmlLoadPath + user.getImage());
            users.add(userJson);

            everyData.put("author", user.getName());
//            everyData.put("image", user.getImage());
            resultList.add(everyData);


        }


        //后端分页
        Integer ind = (page) * pageSize - pageSize;


        if (resultList.size() <= pageSize) {
            flist = resultList;
        } else {

            if (ind + pageSize > resultList.size()) {
                int exp = resultList.size() % pageSize;


                if ((ind % pageSize) == exp) {
                    flist.add(resultList.get(ind));

                } else {
                    flist = resultList.subList(ind, ind + exp);
                }

            } else {
                flist = resultList.subList(ind, ind + pageSize);
            }

        }


        Sort sort = new Sort(asc ? Sort.Direction.ASC : Sort.Direction.DESC, "viewCount");

        Page pageResult = new PageImpl(flist, new PageRequest(page - 1, pageSize, sort), category.size());

        JSONObject result = new JSONObject();
        result.put("content", pageResult.getContent());
        result.put("totalElements", pageResult.getTotalElements());
        result.put("users", users);

        return result;

    }


    //todo 准备注释
    public List<String> findByCa(String categorysId,String dataType) {
        Categorys resultList = new Categorys();
        resultList = getCategoryById(categorysId);

        List<String> resultListType = new LinkedList<>();
        if (dataType.equals("hubs")&&resultList.getDataItem()!=null){
            resultListType = resultList.getDataItem();
        }else if (dataType.equals("repository")&&resultList.getDataRepository()!=null){
            resultListType = resultList.getDataRepository();
        }else if (dataType.equals("network")&&resultList.getDataNetwork()!=null){
            resultListType = resultList.getDataNetwork();
        }
        return resultListType;
    }
    public List<String> findByDaCa(String categorysId,String dataType) {
        DataCategorys resultList;
        resultList = getDataCategoryById(categorysId);

        List<String> resultListType = new LinkedList<>();
        if (dataType.equals("hubs")&&resultList.getDataItemNew()!=null){
            resultListType = resultList.getDataItemNew();
        }else if (dataType.equals("repository")&&resultList.getDataRepository()!=null){
            resultListType = resultList.getDataRepository();
        }else if (dataType.equals("network")&&resultList.getDataNetwork()!=null){
            resultListType = resultList.getDataNetwork();
        }
        return resultListType;
    }


    //用户创建分类数据条目id入到分类库
    //todo *******
    public Integer addCateId(CategoryAddDTO categoryAddDTO) {

        String id = categoryAddDTO.getId();
        List<String> cate = categoryAddDTO.getCate();
        String dataType = categoryAddDTO.getDataType();
        String tabType = categoryAddDTO.getTabType();

        DataCategorys ca;
        List<String> cateData;

        for (int i = 0; i < cate.size(); i++) {
            ca = new DataCategorys();

//            addAll(id, cate.get(i));

            ca = getDataCategoryById(cate.get(i));

            cateData = new ArrayList<String>();
            if(null!=tabType&&tabType.equals("hubs")){
                if (ca.getDataHubs()!=null){
                    cateData = ca.getDataHubs();
                    cateData.add(id);
                    ca.setDataHubs(cateData);
                }else {
                    cateData.add(id);
                    ca.setDataHubs(cateData);
                }
            }else if (dataType.equals("File")||dataType.equals("Url")){
                if (ca.getDataRepository()!=null) {
                    cateData = ca.getDataRepository();
                    cateData.add(id);
                    ca.setDataRepository(cateData);
                }else {
                    cateData.add(id);
                    ca.setDataRepository(cateData);
                }
            }else if (dataType.equals("DistributedNode")){
                if (ca.getDataNetwork()!=null) {
                    cateData = ca.getDataNetwork();
                    cateData.add(id);
                    ca.setDataNetwork(cateData);
                }else {
                    cateData.add(id);
                    ca.setDataNetwork(cateData);
                }
            }
            dataCategorysDao.save(ca);
        }

        return 1;
    }

    public void addAll(String dataitemId, String cateId) {
        List<Categorys> par = new ArrayList<>();
        par = categoryDao.findAllByCategory("...All");

        Categorys p = new Categorys();
        p = getCategoryById(cateId);

        String pid = p.getParentCategory();

        List<String> dataitem;

        for (int i = 0; i < par.size(); i++) {
            if (par.get(i).getParentCategory().equals(pid)) {
                dataitem = new ArrayList<>();
                dataitem = par.get(i).getDataItem();
                dataitem.add(dataitemId);
                par.get(i).setDataItem(dataitem);

                categoryDao.save(par.get(i));

                break;
            }
        }

    }

    //拿到Hubs
    public List<Hubs> getHubs(Integer num) {
        List<Hubs> hubs = new ArrayList<>();
        List<Hubs> result = new ArrayList<>();

        hubs = hubsDao.findAll();

        for (int i = 0; i < num; i++) {
            if (hubs.size() == i) {
                break;
            }
            result.add(hubs.get(i));
        }

        return result;
    }

    //动态构建树
    public Map<String, List<Map<String, String>>> createTree() {

        List<DataCategorys> allTree = new ArrayList<>();
        Categorys parentCate;

        List<Map<String, String>> sonCate;
        List<Map<String, String>> sonCate2;


        String parentCaId, category;
        Categorys itor;

        allTree = dataCategorysDao.findAll();


        Map<String, List<Map<String, String>>> reslut = new HashMap<>();

        Map<String, String> ele;


        for (int i = 0; i < allTree.size(); i++) {

            itor = allTree.get(i);
            String p = itor.getParentCategory();

            //对于子类
            if (!p.equals("null")) {

                parentCate = new Categorys();
                parentCate = getDataCategoryById(itor.getParentCategory());

                //如果Map中有父类key
                if (mapHasKey(reslut, parentCate.getCategory())) {

                    ele = new HashMap<>();
                    sonCate = new ArrayList<>();
                    //拿到父类，取得父类包含的子类数组
                    sonCate = reslut.get(parentCate.getCategory());
                    ele.put("category", itor.getCategory());
                    ele.put("id", itor.getId());
                    sonCate.add(ele);
                    //修改父类包含的子类，其实质是添加此次遍历的子类
                    reslut.put(parentCate.getCategory(), sonCate);


                    //如果Map中没有父类的key
                } else {

                    ele = new HashMap<>();
                    sonCate2 = new ArrayList<>();

                    ele.put("category", itor.getCategory());
                    ele.put("id", itor.getId());
                    sonCate2.add(ele);
                    String s = parentCate.getCategory();
                    reslut.put(parentCate.getCategory(), sonCate2);
                }

            } else {
                sonCate2 = new ArrayList<>();
                reslut.put(itor.getParentCategory(), sonCate2);
            }

        }

        reslut.remove("null");

        return reslut;
    }

    //todo createTreeNew
    public JSONArray createTreeNew(){
        JSONArray result = new JSONArray();
        List<DataCategorys> grandpas = dataCategorysDao.findAllByParentCategory("null");
        for (DataCategorys grandpa:grandpas){
            JSONObject oneLevel = new JSONObject();
            //找出当前grandpa的所有子集
            List<DataCategorys> fathers = dataCategorysDao.findAllByParentCategory(grandpa.getId());
            JSONArray fathersArray = new JSONArray();//用于存储父类的所有的键值对
            for (DataCategorys father:fathers){
                JSONObject twoLevel = new JSONObject();
                List<DataCategorys> sons = dataCategorysDao.findAllByParentCategory(father.getId());
                JSONArray sonsArray = new JSONArray();
                for (DataCategorys son:sons){
                    JSONObject threeLevel = new JSONObject();
                    threeLevel.put(son.getCategory(), son.getId());
                    sonsArray.add(threeLevel);
                }
                twoLevel.put(father.getCategory(), sonsArray);
                fathersArray.add(twoLevel);
            }
            oneLevel.put(grandpa.getCategory(),fathersArray);
            result.add(oneLevel);
        }

        return result;
    }


    public boolean mapHasKey(Map<String, List<Map<String, String>>> map, String key) {
        Iterator<String> it = map.keySet().iterator();

        while (it.hasNext()) {
            if (it.next().equals(key)) {
                return true;
            }
        }
        return false;

    }


    public DataCategorys getCategoryById(String id) {//准备注释掉

        return dataCategorysDao.findById(id).orElseGet(() -> {
            System.out.println("有人乱查数据库！！该ID不存在对象");
            throw new MyException(ResultEnum.NO_OBJECT);
        });


    }
    //仿写，上面方面可注释
    public DataCategorys getDataCategoryById(String id) {

        DataCategorys dataCategorys = new DataCategorys();
        dataCategorys =  dataCategorysDao.findById(id).orElseGet(() -> {
            System.out.println("有人乱查数据库！！该ID不存在对象");
            return null;
        });

        return dataCategorys;
    }


    //data_item_info页面中的category
    public List<Map<String, String>> getCategory(String id) {
        DataItem data = new DataItem();
        Categorys ca;
        List<String> li = new ArrayList<>();

        Map<String, String> infoCategory;

        List<Map<String, String>> re = new ArrayList<>();


        data = getById(id);

        li = data.getClassifications();

        for (int i = 0; i < li.size(); i++) {
            ca = new Categorys();
            ca = getCategoryById(li.get(i));
            infoCategory = new HashMap<>();
            infoCategory.put("id", li.get(i));
            infoCategory.put("cateContent", ca.getCategory());

            re.add(infoCategory);

        }

        return re;

    }


    public Page<DataItem> searchDataByUserId(String userOid, int page, int pageSize, int asc, String searchText) {


        //todo 超出堆内存解决办法

        Sort sort = new Sort(asc==1 ? Sort.Direction.ASC : Sort.Direction.DESC, "createTime");
        Pageable pageable = PageRequest.of(page, pageSize, sort);

//        searchText= '%' + searchText + '%';

        Page<DataItem> dataItems= dataItemDao.findByAuthorAndNameContains(pageable, userOid, searchText);
        return dataItems;

//        for (int k = 0; k <allDList.size() ; k++) {
//            if(allDList.get(k).getName().indexOf(searchText)>-1||allDList.get(k).getDescription().indexOf(searchText)>-1){
//                resultList.add(allDList.get(k));
//            }
//        }
//
//
//
//
//        //分页
//        List<DataItem> flist=new ArrayList<>();
//
//        Integer ind=(page+1)*pagesize-pagesize;
//
//        if(resultList.size()<=pagesize){
//            flist=resultList;
//        }else {
//            if(ind+pagesize>resultList.size()){
//                int exp=resultList.size()%pagesize-1;
//
//
//                if((ind%pagesize)==exp){
//                    flist.add(resultList.get(ind)) ;
//
//                }else{
//                    flist=resultList.subList(ind,ind+resultList.size()%pagesize);
//                }
//
//            }else {
//                flist=resultList.subList(ind,ind+pagesize);
//            }
//
//        }


    }


    public JSONObject getDataItemByDataId(String dataId){

        DataItem dataItem =  dataItemDao.findFirstById(dataId);

        JSONObject jsonObject = new JSONObject();
        if(dataItem == null)
            jsonObject.put("noResult",1);
        else{
            List<String> cates = new ArrayList<>();
            cates = dataItem.getClassifications();
            List<String> categorys = new ArrayList<>();
            for(String cate : cates){
                DataCategorys dataCategorys = getDataCategoryById(cate);
                categorys.add(dataCategorys.getCategory());
            }

            JSONObject obj =(JSONObject) JSON.toJSON(dataItem);
            obj.put("categories",categorys);
            jsonObject.put("result",obj);
        }

        return jsonObject;


    }

    public JSONObject getDataHubsByDataId(String dataId){

        DataHubs dataHubs =  dataHubsDao.findFirstById(dataId);

        JSONObject jsonObject = new JSONObject();
        if(dataHubs == null)
            jsonObject.put("noResult",1);
        else{
            List<String> cates = new ArrayList<>();
            cates = dataHubs.getClassifications();
            List<String> categorys = new ArrayList<>();
            for(String cate : cates){
                DataCategorys dataCategorys = getDataCategoryById(cate);
                categorys.add(dataCategorys.getCategory());
            }

            JSONObject obj =(JSONObject) JSON.toJSON(dataHubs);
            obj.put("categories",categorys);
            jsonObject.put("result",obj);
        }

        return jsonObject;


    }

    //get related models
    public List<Map<String, String>> getRelatedModels(String id) {


//            DataItem dataItem=getById(id);
        DataItem dataItem = getById(id);

        List<String> relatedModels = dataItem.getRelatedModels();


        if (relatedModels == null) {
            List<Map<String, String>> list = new ArrayList<>();
            return list;

        }
        List<Map<String, String>> data = new ArrayList<>();

        ModelItem modelItem;

        Map<String, String> modelsInfo;

        for (int i = 0; i < relatedModels.size(); i++) {
            //只取三个
            if (i == 3) {
                break;
            }

            modelItem = new ModelItem();

            modelItem = getModelById(relatedModels.get(i));

            modelsInfo = new HashMap<>();
            modelsInfo.put("name", modelItem.getName());
            modelsInfo.put("oid", modelItem.getOid());
            modelsInfo.put("description", modelItem.getDescription());

            data.add(modelsInfo);

        }


        return data;

    }

    //getAllRelatedModels
    public List<Map<String, String>> getAllRelatedModels(String id, Integer more) {


//            DataItem dataItem=getById(id);
        DataItem dataItem = getById(id);
        List<Map<String, String>> data = new ArrayList<>();
        List<String> relatedModels = dataItem.getRelatedModels();
        ModelItem modelItem;
        Map<String, String> modelsInfo;
        if (relatedModels == null) {
            modelsInfo = new HashMap<>();
            modelsInfo.put("all", "all");
            data.add(modelsInfo);
            return data;
        }

        if (more - 5 > relatedModels.size() || more - 5 == relatedModels.size()) {
            modelsInfo = new HashMap<>();
            modelsInfo.put("all", "all");
            data.add(modelsInfo);
            return data;
        }

        for (int i = more - 5; i < more && i < relatedModels.size(); i++) {
            //只取三个

            modelItem = new ModelItem();

            modelItem = getModelById(relatedModels.get(i));

            modelsInfo = new HashMap<>();
            modelsInfo.put("name", modelItem.getName());
            modelsInfo.put("oid", modelItem.getOid());
            modelsInfo.put("description", modelItem.getDescription());

            data.add(modelsInfo);

        }
        return data;

    }

    public boolean addRelatedModels(String id, List<String> relatedModels) {


        DataItem dataItem = getById(id);
        ModelItem modelItem;

        List<String> models = new ArrayList<>();

        for (int i = 0; i < relatedModels.size(); i++) {
            modelItem = new ModelItem();
            modelItem = modelItemDao.findFirstByOid(relatedModels.get(i));
            models.add(modelItem.getId());
        }

        List<String> re = new ArrayList<>();
        re = dataItem.getRelatedModels();

        if (re == null) {
            List<String> li = new ArrayList<>();
            for (int m = 0; m < models.size(); m++) {
                li.add(models.get(m));
            }

            dataItem.setRelatedModels(li);

        } else {
            for (int j = 0; j < models.size(); j++) {
                re.add(models.get(j));
            }
        }


        dataItemDao.save(dataItem);

        return true;
    }

    //todo related data to models 3 apis getRelatedData

    public List<Map<String, String>> getRelatedData(String id) {

        ModelItem modelItem = modelItemDao.findFirstByOid(id);

        List<String> relatedData = modelItem.getRelatedData();

        if (relatedData == null) {
            List<Map<String, String>> list = new ArrayList<>();
            return list;

        }

        List<Map<String, String>> data = new ArrayList<>();
        Map<String, String> dataInfo;
        DataItem dataItem;


        for (int i = 0; i < relatedData.size(); i++) {
            //只取三个
            if (i == 3) {
                break;
            }

            modelItem = new ModelItem();

            dataItem = getById(relatedData.get(i));

            dataInfo = new HashMap<>();
            dataInfo.put("name", dataItem.getName());
            dataInfo.put("oid", dataItem.getId());
            dataInfo.put("description", dataItem.getDescription());

            data.add(dataInfo);

        }


        return data;


    }

    //getAllRelatedData
    public List<Map<String, String>> getAllRelatedData(String id, Integer more) {


        ModelItem modelItem = modelItemDao.findFirstByOid(id);

        List<String> relatedData = modelItem.getRelatedData();


        List<Map<String, String>> data = new ArrayList<>();

        DataItem dataItem;

        Map<String, String> dataInfo;
        if (relatedData == null) {
            dataInfo = new HashMap<>();
            dataInfo.put("all", "all");
            data.add(dataInfo);
            return data;
        }


        if (more - 5 > relatedData.size() || more - 5 == relatedData.size()) {

            dataInfo = new HashMap<>();
            dataInfo.put("all", "all");
            data.add(dataInfo);

            return data;
        }

        for (int i = more - 5; i < more && i < relatedData.size(); i++) {
            //只取三个

            dataItem = new DataItem();

            dataItem = getById(relatedData.get(i));

            dataInfo = new HashMap<>();
            dataInfo.put("name", dataItem.getName());
            dataInfo.put("oid", dataItem.getId());
            dataInfo.put("description", dataItem.getDescription());

            data.add(dataInfo);

        }
        return data;

    }

    public boolean addRelatedData(String id, List<String> relatedData) {


        ModelItem modelItem = modelItemDao.findFirstByOid(id);
        DataItem dataItem;

        List<String> data = new ArrayList<>();

        for (int i = 0; i < relatedData.size(); i++) {
            dataItem = new DataItem();
            dataItem = getById(relatedData.get(i));
            data.add(dataItem.getId());
        }

        List<String> re = new ArrayList<>();
        re = modelItem.getRelatedData();


        if (re == null) {
            List<String> li = new ArrayList<>();
            for (int m = 0; m < data.size(); m++) {
                li.add(data.get(m));
            }

            modelItem.setRelatedData(li);

        } else {
            for (int j = 0; j < data.size(); j++) {
                re.add(data.get(j));
            }
        }


        modelItemDao.save(modelItem);

        return true;
    }


    public JSONArray getRelation(String id) {

        JSONArray result = new JSONArray();
        DataItem dataItem = dataItemDao.findFirstById(id);
        List<String> relatedModels = dataItem.getRelatedModels();

        for (String oid : relatedModels) {
            ModelItem modelItem = modelItemDao.findFirstByOid(oid);
            JSONObject object = new JSONObject();
            object.put("oid", modelItem.getOid());
            object.put("name", modelItem.getName());
            User user = userDao.findFirstByUserName(modelItem.getAuthor());
            object.put("author", user.getName());
            object.put("author_uid", user.getUserName());
            result.add(object);
        }

        return result;
    }

    public String setRelation(String id, List<String> relations) {

        DataItem dataItem = dataItemDao.findFirstById(id);

        List<String> relationDelete = new ArrayList<>();
        for (int i = 0; i < dataItem.getRelatedModels().size(); i++) {
            relationDelete.add(dataItem.getRelatedModels().get(i));
        }
        List<String> relationAdd = new ArrayList<>();
        for (int i = 0; i < relations.size(); i++) {
            relationAdd.add(relations.get(i));
        }

        for (int i = 0; i < relationDelete.size(); i++) {
            for (int j = 0; j < relationAdd.size(); j++) {
                if (relationDelete.get(i).equals(relationAdd.get(j))) {
                    relationDelete.set(i, "");
                    relationAdd.set(j, "");
                    break;
                }
            }
        }

        for (int i = 0; i < relationDelete.size(); i++) {
            String oid = relationDelete.get(i);
            if (!oid.equals("")) {
                ModelItem modelItem = modelItemDao.findFirstByOid(oid);
                if(modelItem.getStatus().equals("Private")){
                    relations.add(modelItem.getOid());
                    continue;
                }
                if (modelItem.getRelatedData() != null) {
                    modelItem.getRelatedData().remove(id);
                    modelItemDao.save(modelItem);
                }
            }
        }

        for (int i = 0; i < relationAdd.size(); i++) {
            String oid = relationAdd.get(i);
            if (!oid.equals("")) {
                ModelItem modelItem = modelItemDao.findFirstByOid(oid);
                if (modelItem.getRelatedData() != null) {
                    modelItem.getRelatedData().add(id);
                } else {
                    List<String> relatedData = new ArrayList<>();
                    relatedData.add(id);
                    modelItem.setRelatedData(relatedData);
                }
                modelItemDao.save(modelItem);
            }
        }

        dataItem.setRelatedModels(relations);
        dataItemDao.save(dataItem);

        return "suc";

    }

    /**
     * 分布式节点数据方法
     */
    public DataItemNew insertDistributeData(String id,String oid,String name,String date,String type,Boolean authority,String token,JSONObject meta, String ip){
        DataItemNew dataItemNew = new DataItemNew();
        Date now = new Date();
        //将dto中的数据转换到dataItem里
        dataItemNew.setDistributedNodeDataId(id);
        dataItemNew.setAuthor(oid);
        dataItemNew.setDate(date);
        dataItemNew.setName(name);
        dataItemNew.setType(type);
        dataItemNew.setAuthority(authority);
        dataItemNew.setToken(token);
        dataItemNew.setCreateTime(now);
        dataItemNew.setWorkSpace(meta.getString("workSpace"));
        dataItemNew.setDescription(meta.getString("description"));
        dataItemNew.setDetail(meta.getString("detail"));
        dataItemNew.setDataPath(meta.getString("dataPath"));
        dataItemNew.setDataType("DistributedNode");
        dataItemNew.setIp(ip);
//        dataItem.setOnlineStatus(onlineStatus);
        JSONArray tags = new JSONArray();
        tags = meta.getJSONArray("tags");
        List<String> list = new ArrayList<>();
        for (int i=0;i<tags.size();i++){
            list.add(tags.getString(i));
        }
        dataItemNew.setClassifications(list);

        return dataItemNewDao.insert(dataItemNew);
    }

    //分布式节点注册至门户
    public void insertDistributeNode(String ip,String dataItemId, String oid){
        DistributedNode distributedNode = distributedNodeDao.findFirstByIp(ip);
        boolean isExist = false;
        List<String> dataItems = new ArrayList<>();

        if (distributedNode==null){
            distributedNode = new DistributedNode();
        }else {
            isExist = true;
            dataItems = distributedNode.getDataItems();
        }
        Date now = new Date();
        distributedNode.setIp(ip);
        distributedNode.setLastTime(now);
        distributedNode.setOid(UUID.randomUUID().toString());
        distributedNode.setUserId(oid);
        dataItems.add(dataItemId);
        distributedNode.setDataItems(dataItems);

        if (isExist) {
            distributedNodeDao.save(distributedNode);
        }else {
            distributedNodeDao.insert(distributedNode);
        }
    }

    //轮询本用户分布式节点ip，查看是否在线，根据在线情况更新onlineStatus字段
    @Scheduled(cron="30 * * * * ?")
    private void pollingIp() throws Exception {
        String uid = "42";
        boolean pingLog = false;

        List<DistributedNode> distributedNodes = distributedNodeDao.findFirstByUserId(uid);
        for (DistributedNode distributedNode:distributedNodes){
            String ip = distributedNode.getIp();
            int place = ip.indexOf(":");
            if (place == -1){
                pingLog = ping(ip);
            }else {
                String str1 = ip.substring(0,ip.indexOf(":"));
                String str2 = ip.substring(str1.length()+1,ip.length());
                int port = Integer.parseInt(str2);
//                String port = ip.split(":");
                pingLog = validePort(str1, port);
            }
//            log.info("Status: " + pingLog);
            if (pingLog){
                distributedNode.setOnlineStatus(true);
                distributedNodeDao.save(distributedNode);
            }else {
                distributedNode.setOnlineStatus(false);
                distributedNodeDao.save(distributedNode);
            }
        }
    }

    //222.22.22.2:8080格式
    private static boolean validePort(String location, int port) {
        Socket s = new Socket();
        try {
            SocketAddress add = new InetSocketAddress(location, port);
            s.connect(add, 2000);
            return true;
        } catch (IOException e) {
            return false;
        }finally{
            try {
                s.close();
            } catch (IOException e1) {
            }
        }
    }

    //222.22.22.2格式
    private static boolean ping(String ipAddress) throws Exception {
        int timeOut = 3000; // 超时应该在3钞以上
        boolean status = InetAddress.getByName(ipAddress).isReachable(timeOut);
        return status;
    }

    public String tran(String str){
        log.info(str);
        //将首字母大写
        String[] split = str.split(" ");
        String s1 = "";
        for (int i=0;i< split.length;i++){
            String s2 = split[i].substring(0,1).toUpperCase()+split[i].substring(1);
            s1 += s2;
            s1+=" ";
        }
        s1=s1.substring(0,s1.length()-1);
        log.info(s1);
        DataCategorys dataCategorys = dataCategorysDao.findFirstByCategory(s1);
        if (dataCategorys!=null) {
            String id = dataCategorys.getId();
            return id;
        }else {
            return "";
        }
    }



//    public File inputstreamtofile(InputStream ins) throws IOException {
//        File file = new File("");
//        OutputStream os = new FileOutputStream(file);
//        int bytesRead = 0;
//        byte[] buffer = new byte[8192];
//        while ((bytesRead = ins.read(buffer, 0, 8192)) != -1) {
//            os.write(buffer, 0, bytesRead);
//        }
//        os.close();
//        ins.close();
//        return file;
//    }

    /**
     * 将图片转换成base64格式进行存储
     * @param imagePath
     * @return
     */
    public String encodeToString(String imagePath) throws IOException {
        String type = StringUtils.substring(imagePath, imagePath.lastIndexOf(".") + 1);
        BufferedImage image = ImageIO.read(new File(imagePath));
        String imageString = null;
        ByteArrayOutputStream bos = new ByteArrayOutputStream();
        try {
            ImageIO.write(image, type, bos);
            byte[] imageBytes = bos.toByteArray();
            BASE64Encoder encoder = new BASE64Encoder();
            imageString = encoder.encode(imageBytes);
            bos.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return imageString;
    }
}
