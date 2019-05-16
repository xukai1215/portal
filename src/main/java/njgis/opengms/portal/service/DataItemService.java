package njgis.opengms.portal.service;

import com.alibaba.fastjson.JSONObject;
import io.swagger.models.auth.In;
import njgis.opengms.portal.PortalApplication;
import njgis.opengms.portal.dao.*;
import njgis.opengms.portal.dto.categorys.CategoryAddDTO;
import njgis.opengms.portal.dto.comments.CommentInfo;
import njgis.opengms.portal.dto.comments.CommentsAddDTO;
import njgis.opengms.portal.dto.comments.CommentsUpdateDTO;
import njgis.opengms.portal.dto.dataItem.DataItemAddDTO;
import njgis.opengms.portal.dto.dataItem.DataItemFindDTO;
import njgis.opengms.portal.dto.dataItem.DataItemUpdateDTO;
import njgis.opengms.portal.dto.dataItem.DataitemClassificationsDTO;
import njgis.opengms.portal.entity.*;
import njgis.opengms.portal.enums.ResultEnum;
import njgis.opengms.portal.exception.MyException;
import njgis.opengms.portal.utils.ResultUtils;
import org.apache.commons.lang3.ObjectUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.data.mongodb.core.aggregation.VariableOperators;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.ModelAndView;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import org.thymeleaf.templateresolver.ClassLoaderTemplateResolver;

import javax.swing.text.html.HTMLDocument;
import javax.xml.crypto.Data;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.*;
import java.util.function.Function;

import static javafx.scene.input.KeyCode.T;

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
    CategoryDao categoryDao;

    @Autowired
    HubsDao hubsDao;

    @Autowired
    UserDao userDao;

    public void update(String id, DataItemUpdateDTO dataItemUpdateDTO) {
        DataItem dataItem=dataItemDao.findById(id).orElseGet(()->{
            System.out.println("有人乱查数据库！！该ID不存在对象");
            throw new MyException(ResultEnum.NO_OBJECT);
        });
        BeanUtils.copyProperties(dataItemUpdateDTO,dataItem);
        Date now =new Date();
        dataItem.setLastModifyTime(now);
        //更新评论
//        dataItem.getComments().setCommentDate(now);
        dataItemDao.save(dataItem);
    }

    public void delete(String id) {

        DataItem data=new DataItem();
        data=getById(id);

        List<String> cate=new ArrayList<>();

        List<String> ids=new ArrayList<>();
        List<String> newids=new ArrayList<>();

        String parid;

        List<Categorys> p;

        List<String> allDataItem ;

        cate=data.getClassifications();

        for (int i = 0; i <cate.size() ; i++) {
            Categorys categorys=getCategoryById(cate.get(i));

            parid=categorys.getParentCategory();
            p=new ArrayList<>();
            p=categoryDao.findAllByCategory("...All");

            for (int k = 0; k <p.size() ; k++) {
                if(p.get(k).getParentCategory().equals(parid)){
                    allDataItem=new ArrayList<>();
                    allDataItem=delOneOfArrayList(p.get(k).getDataItem(),id);

                    p.get(k).setDataItem(allDataItem);

                    categoryDao.save(p.get(k));

                    break;
                }
            }



            ids=categorys.getDataItem();

            for (int j = 0; j <ids.size() ; j++) {
                if(ids.get(j).equals(id)){
                    newids=delOneOfArrayList(ids,id);
                    break;
                }
            }
            //用户中心删除数控条目时，category库里同时删除
            categorys.setDataItem(newids);
            categoryDao.save(categorys);


        }


        dataItemDao.deleteById(id);
    }

    public List<String> delOneOfArrayList(List<String> arr,String str){
        List<String> st=new ArrayList<>();

        for (int i = 0; i < arr.size(); i++) {
            if(!arr.get(i).equals(str)){
                st.add(arr.get(i));
            }
        }

        return  st;
    }




    public DataItem getById(String id) {



        return dataItemDao.findById(id).orElseGet(() -> {

            System.out.println("有人乱查数据库！！该ID不存在对象:"+id);

            throw new MyException(ResultEnum.NO_OBJECT);

        });





    }


    public List<String> generatehtmls(){
        List<DataItem> alldata=dataItemDao.findAll();

        List<String> id=new ArrayList<>();

        for (int i = 0; i <alldata.size() ; i++) {
            id.add(alldata.get(i).getId());
        }
        return id;

    }

    //对评论的评论
    public void reply(CommentsAddDTO commentsAddDTO){

        String id=commentsAddDTO.getId();
        String commentId=commentsAddDTO.getCommentid();

        DataItem dataItem=getById(id);
        List<CommentInfo> co=new ArrayList<>();

        List<Comments> comments=dataItem.getComments();
        //todo 用id找到对应评论

        for (int i = 0; i < comments.size(); i++) {
            if(comments.get(i).getId().equals(commentId)){

                co=comments.get(i).getCommentsForComment();

                //如果没有对评论的评论时
                if(co==null){
                    co=new ArrayList<>();
                }

                co.add(commentsAddDTO.getCommentsForComment());

                comments.get(i).setCommentsForComment(co);

                break;
            }
        }
        dataItemDao.save(dataItem);


    }
    //提交评论
    public void putComment(CommentsAddDTO commentsAddDTO){
        String id=commentsAddDTO.getId();

        DataItem dataItem=getById(id);

        List<Comments> comment=new ArrayList<>();

        comment=dataItem.getComments();

        comment.add(commentsAddDTO.getMyComment());

        dataItem.setComments(comment);


        dataItemDao.save(dataItem);

    }
    //点赞
    public Integer thumbsUp(CommentsUpdateDTO commentsUpdateDTO){
        String commentid =commentsUpdateDTO.getCommentId();
        DataItem dataItem=getById(commentsUpdateDTO.getDataId());

        List<Comments> comments=dataItem.getComments();
        Integer zan=new Integer(-1);

        for (int i = 0; i < comments.size(); i++) {
            if(comments.get(i).getId().equals(commentid)){
                    zan=comments.get(i).getThumbsUpNumber();
                comments.get(i).setThumbsUpNumber(zan+1);
                break;
            }
        }

        dataItemDao.save(dataItem);

        return zan+1;
    }

    //用户拿到上传的所有条目
    public Page<DataItem> getUsersUploadData(String author,Integer page,Integer pagesize,Integer asc){

        List<DataItem> resultList= new ArrayList<DataItem>();
        resultList=dataItemDao.findAllByAuthor(author);
        //分页
        List<DataItem> flist=new ArrayList<>();

        Integer ind=(page+1)*pagesize-pagesize;

        if(resultList.size()<=pagesize){
            flist=resultList;
        }else {
            if(ind+pagesize>resultList.size()){
                int exp=resultList.size()%pagesize-1;


                if((ind%pagesize)==exp){
                    flist.add(resultList.get(ind)) ;

                }else{
                    flist=resultList.subList(ind,ind+resultList.size()%pagesize);
                }

            }else {
                flist=resultList.subList(ind,ind+pagesize);
            }

        }

//        List<DataItem> userdata=dataItemDao.findByAuthor(useroid);

        //默认以创建时间排序
        Sort sort = new Sort(asc==1 ? Sort.Direction.ASC : Sort.Direction.DESC,"createTime");
        Page pageResult =new PageImpl(flist,new PageRequest(page, pagesize,sort),resultList.size());



        return pageResult;
    }

    //获得用户创建条目的总数
    public Integer getAmountOfData(String author){
        List<DataItem> resultList= new ArrayList<DataItem>();
        resultList=dataItemDao.findAllByAuthor(author);
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

        File dataitemfile=new File(path+"/templates/dataItems");

        if(!dataitemfile.exists()){
            dataitemfile.mkdir();
        }

        Context context=new Context();
        context.setVariable("datainfo",ResultUtils.success(getById(id)));

        FileWriter writer=new FileWriter(path+"/templates/dataItems/"+id+".html");
        templateEngine.process("data_item_info",context,writer);

        writer.flush();
        writer.close();

        return 1;


    }
    //viewPlus
    public  Integer viewCountPlus(String id){
        DataItem dataItem=getById(id);

        Integer viewCount=dataItem.getViewCount();
        dataItem.setViewCount(viewCount+1);

        dataItemDao.save(dataItem);
        return 1;
    }
    //getViewCount
    public  Integer getViewCount(String id){
        DataItem dataItem=getById(id);

        Integer viewCount=dataItem.getViewCount();

        return viewCount;
    }




    public DataItem insert(DataItemAddDTO dataItemAddDTO) {
        DataItem dataItem=new DataItem();
        BeanUtils.copyProperties(dataItemAddDTO,dataItem);
        Date now=new Date();
        dataItem.setCreateTime(now);

//        dataItem.getComments().setCommentDate(now);

        dataItem.setLastModifyTime(now);
        return dataItemDao.insert(dataItem);
    }

    public Page<DataItem> list(DataItemFindDTO dataItemFindDTO) {
        //TODO Sort是可以设置排序字段的
        int page;
        if(dataItemFindDTO.getPage()==0){
            page=dataItemFindDTO.getPage();
        }else{
            page=dataItemFindDTO.getPage()-1;
        }
//        int page = dataItemFindDTO.getPage();
        int pageSize = dataItemFindDTO.getPageSize();
        //默认以创建时间排序
        Sort sort = new Sort(dataItemFindDTO.getAsc() ? Sort.Direction.ASC : Sort.Direction.DESC,"createTime");
        return dataItemDao.findAll(PageRequest.of(page, pageSize,sort));
    }

    //list条目总数
    public long count() {
        return dataItemDao.count();
    }

    //高级搜索查询
    public Page<DataItem> listBySearch(DataItemFindDTO dataItemFindDTO){

        //todo 首先找到分类下的条目，然后进行全局查询

//        List<DataItem> alldata=new ArrayList<>();
//        alldata=dataItemDao.findAll();

        List<String> content =new ArrayList<>();
        content=dataItemFindDTO.getSearchContent();


        List<DataItem> name=new ArrayList<>();
        List<DataItem> description=new ArrayList<>();
        List<DataItem> detail=new ArrayList<>();
        List<DataItem> author=new ArrayList<>();

        List<DataItem> keywords=new ArrayList<>();
        List<DataItem> categories=new ArrayList<>();



        List<DataItem> result=new ArrayList<>();
        List<DataItem> flist=new ArrayList<>();


        for (int k = 0; k <content.size() ; k++) {
            name=dataItemDao.findByNameLike(content.get(k));
            description=dataItemDao.findByDescriptionLike(content.get(k));
//            detail=dataItemDao.findByDetailLike(content.get(k));
//            detail=dataItemDao.findByDetailLike(content.get(k));
            author=dataItemDao.findByAuthorLike(content.get(k));

            keywords=dataItemDao.findByKeywordsLike(content.get(k));
            categories=dataItemDao.findByClassificationsLike(content.get(k));

            if(name!=null){
                result.addAll(name);
            }

            if(description!=null){
                result.addAll(description);
            }

            if(detail!=null){
                result.addAll(detail);
            }

            if(author!=null){
                result.addAll(author);
            }

            if(keywords!=null){
                result.addAll(keywords);
            }

            if(categories!=null){
                result.addAll(categories);
            }
        }



        Integer ind=(dataItemFindDTO.getPage())*dataItemFindDTO.getPageSize()-dataItemFindDTO.getPageSize();


        if(result.size()<=dataItemFindDTO.getPageSize()){
            flist=result;
        }else {

            if(ind+dataItemFindDTO.getPageSize()>result.size()){
                int exp=result.size()%dataItemFindDTO.getPageSize();


                if((ind%dataItemFindDTO.getPageSize())==exp){
                    flist.add(result.get(ind)) ;

                }else{
                    flist=result.subList(ind,ind+exp);
                }

            }else {
                flist=result.subList(ind,ind+dataItemFindDTO.getPageSize());
            }

        }


        Sort sort = new Sort(dataItemFindDTO.getAsc() ? Sort.Direction.ASC : Sort.Direction.DESC,"createTime");

        Page pageResult =new PageImpl(flist,new PageRequest(dataItemFindDTO.getPage(),dataItemFindDTO.getPageSize(),sort),result.size());



        return pageResult;
    }

    //按分类查询
    public Page<Map<String,Object>>findByCateg(DataItemFindDTO dataItemFindDTO){


        List<String> category= new ArrayList<>();
        //从category拿到dataItemid
        category=findByCa(dataItemFindDTO);


        List<Map<String,Object>> resultList=new ArrayList<>();


        List<Map<String,Object>> flist=new ArrayList<>();

        DataItem it=new DataItem();

        Map<String,Object> everyData;

        Integer start=(dataItemFindDTO.getPage()-1)*10;
        Integer end=-1;
        Integer p;
        if(category.size()<10){
            end=category.size();
        }else{

            if(category.size()%10==0){
                p=category.size()/10;
                end=start+10;

            }else if(category.size()%10!=0){
                p=category.size()/10+1;
                if(dataItemFindDTO.getPage().equals(p)){
                    end=start+category.size()%10;
                }else{
                    end=start+10;
                }


            }

        }


        //从dataItem中取得项
        for(int i=start;i<end;i++){

            everyData=new HashMap<>();
            it=getById(category.get(i));
            everyData.put("name",it.getName());
            everyData.put("id",it.getId());
            everyData.put("description",it.getDescription());
            everyData.put("keywords",it.getKeywords());
            everyData.put("createTime",it.getCreateTime());
            everyData.put("viewCount",it.getViewCount());

            User user=userDao.findFirstByUserName(getById(category.get(i)).getAuthor());
            everyData.put("author",user.getName());
            everyData.put("image",user.getImage());
                resultList.add( everyData);


        }


        //后端分页
        Integer ind=(dataItemFindDTO.getPage())*dataItemFindDTO.getPageSize()-dataItemFindDTO.getPageSize();


        if(resultList.size()<=dataItemFindDTO.getPageSize()){
            flist=resultList;
        }else {

            if(ind+dataItemFindDTO.getPageSize()>resultList.size()){
                int exp=resultList.size()%dataItemFindDTO.getPageSize();


                if((ind%dataItemFindDTO.getPageSize())==exp){
                    flist.add(resultList.get(ind)) ;

                }else{
                    flist=resultList.subList(ind,ind+exp);
                }

            }else {
                flist=resultList.subList(ind,ind+dataItemFindDTO.getPageSize());
            }

    }


        Sort sort = new Sort(dataItemFindDTO.getAsc() ? Sort.Direction.ASC : Sort.Direction.DESC,"createTime");

        Page pageResult =new PageImpl(flist,new PageRequest(dataItemFindDTO.getPage()-1,dataItemFindDTO.getPageSize(),sort),category.size());


        return pageResult ;
    };


    public  List<String> findByCa(DataItemFindDTO dataItemFindDTO){

        Categorys resultList= new Categorys();
        String  dtoList;
//        dtoList=dataItemFindDTO.getCategory();
        dtoList=dataItemFindDTO.getCategoryId();


        resultList=getCategoryById(dtoList);



        return resultList.getDataItem();
    }


    //用户创建分类数据条目id入到分类库
    public Integer addCateId(CategoryAddDTO categoryAddDTO){

        String id=categoryAddDTO.getId();
        List<String> cate=categoryAddDTO.getCate();

        Categorys ca;
        List<String> cateData;

        for (int i = 0; i <cate.size() ; i++) {
          ca=new Categorys();

          addAll(id,cate.get(i));

          ca= getCategoryById(cate.get(i));

          cateData=new ArrayList<String>();
          cateData=ca.getDataItem();

          cateData.add(id);

          ca.setDataItem(cateData);

          categoryDao.save(ca);

        }

        return 1;
    }
    public void addAll(String dataitemId,String cateId){
        List<Categorys> par=new ArrayList<>();
        par=categoryDao.findAllByCategory("...All");

        Categorys p=new Categorys();
        p=getCategoryById(cateId);

        String pid=p.getParentCategory();

        List<String> dataitem;

        for (int i = 0; i <par.size() ; i++) {
            if(par.get(i).getParentCategory().equals(pid)){
                dataitem=new ArrayList<>();
                dataitem=par.get(i).getDataItem();
                dataitem.add(dataitemId);
                par.get(i).setDataItem(dataitem);

                categoryDao.save(par.get(i));

                break;
            }
        }

    }

    //拿到Hubs
    public List<Hubs> getHubs(Integer num){
        List<Hubs> hubs=new ArrayList<>();
        List<Hubs> result=new ArrayList<>();

        hubs=hubsDao.findAll();

        for (int i = 0; i <num ; i++) {
            if(hubs.size()==i){
                break;
            }
            result.add(hubs.get(i));
        }

        return result;
    }
    //动态构建树
    public Map<String,List<Map<String,String >>> createTree(){

        List<Categorys> allTree=new ArrayList<>();
        Categorys parentCate;

        List<Map<String,String >> sonCate;
        List<Map<String,String >> sonCate2;




        String parentCaId,category;
        Categorys itor;

        allTree=categoryDao.findAll();


        Map<String,List<Map<String,String >>> reslut=new HashMap<>();

        Map<String,String> ele;


        for (int i = 0; i <allTree.size() ; i++) {

            itor=allTree.get(i);
            String p=itor.getParentCategory();

            //对于子类
            if(!p.equals("null")){

                parentCate=new Categorys();
                parentCate=getCategoryById(itor.getParentCategory());

                //如果Map中有父类key
                if(mapHasKey(reslut,parentCate.getCategory())){

                    ele=new HashMap<>();
                    sonCate=new ArrayList<>();
                    //拿到父类，取得父类包含的子类数组
                    sonCate=reslut.get(parentCate.getCategory());
                    ele.put("category",itor.getCategory());
                    ele.put("id",itor.getId());
                    sonCate.add(ele);
                    //修改父类包含的子类，其实质是添加此次遍历的子类
                    reslut.put(parentCate.getCategory(),sonCate);


                //如果Map中没有父类的key
                }else {

                    ele=new HashMap<>();
                    sonCate2=new ArrayList<>();

                    ele.put("category",itor.getCategory());
                    ele.put("id",itor.getId());
                    sonCate2.add(ele);
                    String s=parentCate.getCategory();
                    reslut.put(parentCate.getCategory(),sonCate2);
                }

            }else {
                sonCate2=new ArrayList<>();
                reslut.put(itor.getParentCategory(),sonCate2);
            }

        }

        reslut.remove("null");

        return reslut;
    }


    public boolean mapHasKey(Map<String,List<Map<String,String >>> map,String key){
        Iterator<String> it=map.keySet().iterator();

        while(it.hasNext()){
            if(it.next().equals(key)){
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
    public List<Map<String,String>> getCategory(String id){
        DataItem data=new DataItem();
        Categorys ca;
        List<String> li=new ArrayList<>();

        Map<String,String> infoCategory;

        List<Map<String,String>> re=new ArrayList<>();


        data=getById(id);

        li=data.getClassifications();

        for (int i = 0; i < li.size(); i++) {
            ca=new Categorys();
            ca=getCategoryById(li.get(i));
            infoCategory=new HashMap<>();
            infoCategory.put("id",li.get(i));
            infoCategory.put("cateContent",ca.getCategory());

            re.add(infoCategory);
//            re.add(ca.getCategory());
        }

        return re;

    }
















}
