package njgis.opengms.portal.service;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.sun.org.apache.bcel.internal.generic.IF_ACMPEQ;
import njgis.opengms.portal.PortalApplication;
import njgis.opengms.portal.dao.*;
import njgis.opengms.portal.dto.categorys.CategoryAddDTO;
import njgis.opengms.portal.dto.dataItem.*;
import njgis.opengms.portal.entity.*;
import njgis.opengms.portal.entity.support.DataMeta;
import njgis.opengms.portal.enums.ResultEnum;
import njgis.opengms.portal.exception.MyException;
import njgis.opengms.portal.utils.ResultUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import org.thymeleaf.templateresolver.ClassLoaderTemplateResolver;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * @ClassName DataItemService
 * @Description todo
 * @Author sun_liber
 * @Date 2019/2/13
 * @Version 1.0.0
 */
@Service
public class DataItemService {
    @Autowired
    DataItemDao dataItemDao;

    @Autowired
    ModelItemDao modelItemDao;

    @Autowired
    CategoryDao categoryDao;

    @Autowired
    HubsDao hubsDao;

    @Autowired
    UserDao userDao;

    @Value("${htmlLoadPath}")
    private String htmlLoadPath;

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

    public int delete(String id,String userOid) {
        //需要在catagory中删除此data item记录,以及在data item集合中删除本身
        DataItem data = new DataItem();
        data = getById(id);

        if(!data.getAuthor().equals(userOid))
            return 2;

        List<String> cate = new ArrayList<>();

        List<String> ids = new ArrayList<>();
        List<String> newids = new ArrayList<>();

        String parid;

        List<Categorys> p;

        List<String> allDataItem;

        cate = data.getClassifications();//获得该data item所在分类
        //catagory中有两处要删，一处是所属的小类，一处是该小类所在大类中的“...all”中的记录
        //先删除...all中记录
        for (int i = 0; i < cate.size(); i++) {
            Categorys categorys = getCategoryById(cate.get(i));//data item所属类

            parid = categorys.getParentCategory();//data item所属父类（大类）id
            p = new ArrayList<>();
            p = categoryDao.findAllByCategory("...All");//找到所有all的类

            for (int k = 0; k < p.size(); k++) {//通过父类匹配到存在该data item的all，删除记录
                if (p.get(k).getParentCategory().equals(parid)) {
                    allDataItem = new ArrayList<>();
                    allDataItem = delOneOfArrayList(p.get(k).getDataItem(), id);//返回删除后的data item集合

                    p.get(k).setDataItem(allDataItem);//重新赋值

                    categoryDao.save(p.get(k));

                    break;
                }
            }

            ids = categorys.getDataItem();

            //删除所属小类中的记录
            if (ids.size() > 0&&ids != null)
                for (int j = 0; j < ids.size(); j++) {
                    if (ids.get(j).equals(id)) {
                        newids = delOneOfArrayList(ids, id);
                        break;
                    }
                }
            //用户中心删除数控条目时，category库里同时删除
            categorys.setDataItem(newids);
            categoryDao.save(categorys);



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
        DataItem dataItem = new DataItem();
        BeanUtils.copyProperties(dataItemAddDTO, dataItem);
        Date now = new Date();
        dataItem.setCreateTime(now);

//        dataItem.getComments().setCommentDate(now);

        dataItem.setLastModifyTime(now);
        return dataItemDao.insert(dataItem);
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


        Sort sort = new Sort(dataItemFindDTO.getAsc() ? Sort.Direction.ASC : Sort.Direction.DESC, "createTime");

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

    public JSONObject searchByName(DataItemFindDTO dataItemFindDTO,String userOid) {

        int page = dataItemFindDTO.getPage() - 1;
        int pageSize = dataItemFindDTO.getPageSize();
        String searchText = dataItemFindDTO.getSearchText();

        Sort sort = new Sort(dataItemFindDTO.getAsc() ? Sort.Direction.ASC : Sort.Direction.DESC, "viewCount");
        Pageable pageable = PageRequest.of(page, pageSize, sort);
        Page<DataItemResultDTO> dataItemPage;
        if(userOid==null){
            dataItemPage = dataItemDao.findByNameLikeIgnoreCase(pageable, searchText);
        }else{
            dataItemPage = dataItemDao.findByNameLikeAndAuthorIgnoreCase(pageable, searchText,userOid);
        }


        List<DataItemResultDTO> dataItems = dataItemPage.getContent();
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
        if(loadUser==null||!loadUser.equals(oid)) {
            dataItemResultDTOPage = dataItemDao.findByAuthorAndNameContainsAndStatusIn(pageable, oid, name, itemStatusVisible);
        }else{
            dataItemResultDTOPage = dataItemDao.findByAuthorAndNameContains(pageable, oid, name);
        }
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


        List<String> category = new ArrayList<>();
        //从category拿到dataItemid
        category = findByCa(categorysId,dataType);


        List<Map<String, Object>> resultList = new ArrayList<>();


        List<Map<String, Object>> flist = new ArrayList<>();

        DataItem it = new DataItem();

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


    public List<String> findByCa(String categorysId,String dataType) {
        if (dataType.equals("hubs")){
            dataType = "Url";
        }else if (dataType.equals("repository")){
            dataType = "File";
        }else if (dataType.equals("network")){
            dataType = "DistributedNode";
        }

        Categorys resultList = new Categorys();
        resultList = getCategoryById(categorysId);
        List<String> resultListType = new LinkedList<>();
        //判断dataType获取不同的type对应得dataItems
        List<String> dataItemIds = resultList.getDataItem();
        for (int i=0;i<dataItemIds.size();i++){
            DataItem dataItem = dataItemDao.findFirstById(dataItemIds.get(i));
            if (dataItem!=null&&dataItem.getDataType()!=null&&dataItem.getDataType().equals(dataType)){
                resultListType.add(dataItem.getId());
            }
        }
        return resultListType;
//        return resultList.getDataItem();
    }


    //用户创建分类数据条目id入到分类库
    public Integer addCateId(CategoryAddDTO categoryAddDTO) {

        String id = categoryAddDTO.getId();
        List<String> cate = categoryAddDTO.getCate();

        Categorys ca;
        List<String> cateData;

        for (int i = 0; i < cate.size(); i++) {
            ca = new Categorys();

            addAll(id, cate.get(i));

            ca = getCategoryById(cate.get(i));

            cateData = new ArrayList<String>();
            cateData = ca.getDataItem();

            cateData.add(id);

            ca.setDataItem(cateData);

            categoryDao.save(ca);

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

        List<Categorys> allTree = new ArrayList<>();
        Categorys parentCate;

        List<Map<String, String>> sonCate;
        List<Map<String, String>> sonCate2;


        String parentCaId, category;
        Categorys itor;

        allTree = categoryDao.findAll();


        Map<String, List<Map<String, String>>> reslut = new HashMap<>();

        Map<String, String> ele;


        for (int i = 0; i < allTree.size(); i++) {

            itor = allTree.get(i);
            String p = itor.getParentCategory();

            //对于子类
            if (!p.equals("null")) {

                parentCate = new Categorys();
                parentCate = getCategoryById(itor.getParentCategory());

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


    public boolean mapHasKey(Map<String, List<Map<String, String>>> map, String key) {
        Iterator<String> it = map.keySet().iterator();

        while (it.hasNext()) {
            if (it.next().equals(key)) {
                return true;
            }
        }
        return false;

    }


    public Categorys getCategoryById(String id) {

        return categoryDao.findById(id).orElseGet(() -> {
            System.out.println("有人乱查数据库！！该ID不存在对象");
            throw new MyException(ResultEnum.NO_OBJECT);
        });


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
                Categorys category = getCategoryById(cate);
                categorys.add(category.getCategory());
            }

            JSONObject obj =(JSONObject) JSON.toJSON(dataItem);
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

}
