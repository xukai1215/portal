

var  data_item_info= new Vue({
    el: '#data_item_info',
    components: {
        'avatar': VueAvatar.Avatar
    },
    data:function () {
        return{
            activeIndex:'2-2',
            activeName: 'Conceptual Model',
            databrowser:[],
            dataid:'',
            searchcontent:'',
            thisciteurl:'',
            comforcom:false,
            comments:false,
            comforcomtextarea:'',
            mycommentforthedata:'',
            showkey:'',
            loading:false,

            allcomments:[],
            thumbs:'',
            thisthumbs:'',
            userName:'',
            useroid:'',
            dataCategory:[],
            viewCount:'',
            related3Models:[],
            currentDataId:'',

            value1:'1',
            relatedModelNotNull:false,
            relatedModelIsNull:false,
            searchRelatedModelsDialogVisible:false,
            addRelatedModelsDialogVisible:false,
            allRelatedModels:[],
            dataNums:5,
            timer:false,
            nomore:"",
            nomoreflag:false,

            relatedModelsSearchText:'',
            addModelsSearchText:'',
            searchAddRelatedModels:[],
            searchAddModelPage:0,

            selectedModels:[],
            selectedModelsOid:[],

            //Relation 弹出框
            dialogTableVisible:false,
            relateSearch:"",
            relateType:"",
            relateTitle:"",
            tableMaxHeight:400,
            tableData: [],

            pageOption: {
                paginationShow:false,
                progressBar: true,
                sortAsc: false,
                currentPage: 1,
                pageSize: 5,

                total: 264,
                searchResult: [],
            },



        }
        
    } ,
    methods: {

        //Relation 相关
        getRelation(){
            //从地址栏拿到oid
            let arr=window.location.href.split("/");
            let id=arr[arr.length-1].split("#")[0];
            let data = {
                id:id,
            };
            $.ajax({
                type: "GET",
                url: "/dataItem/getRelation",
                data: data,
                async: true,
                success: (json) => {
                    if (json.code == 0) {
                        let data = json.data;
                        console.log(data)

                        this.tableData=data;

                    }
                    else {
                        console.log("query error!")
                    }
                }
            })
        },
        handlePageChange(val) {

            this.pageOption.currentPage = val;

            this.search();
        },

        handleDelete(index,row){
            console.log(index,row);
            let table=new Array();
            for(i=0;i<this.tableData.length;i++){
                table.push(this.tableData[i]);
            }
            table.splice(index,1);
            this.tableData=table;

        },

        handleEdit(index,row){
            console.log(row);
            let flag=false;
            for(i=0;i<this.tableData.length;i++){
                let tableRow=this.tableData[i];
                if(tableRow.oid==row.oid){
                    flag=true;
                    break;
                }
            }
            if(!flag){
                this.tableData.push(row);
            }
        },

        confirm(){
            //从地址栏拿到oid
            let arr=window.location.href.split("/");
            let id=arr[arr.length-1].split("#")[0];

            let relateArr=[];
            this.tableData.forEach(function(item,index){
                relateArr.push(item.oid);
            })
            if(relateArr.length==0){
                relateArr.push(null);
            }

            var data = {
                id:id,
                relations:relateArr
            };

            $.ajax({
                type: "POST",
                url: "/dataItem/setRelation",
                data: data,
                async: true,
                success: (json) => {
                    alert("Success!");
                    this.dialogTableVisible=false;
                    window.location.reload();
                },
                error:(json)=>{
                    alert("Error!")
                }
            })
        },

        handleClose(done) {
            this.$confirm('Are you sure to close？')
                .then(_ => {
                    done();
                })
                .catch(_ => {});
        },

        addRelation(order){

            this.tableData=[];
            this.pageOption.searchResult=[];
            this.relateSearch="";
            this.getRelation();
            this.search();
            this.dialogTableVisible=true;
        },
        jump(){
            $.ajax({
                type: "GET",
                url: "/user/load",
                data: {},
                cache: false,
                async: false,
                xhrFields:{
                    withCredentials: true
                },
                crossDomain:true,
                success: (data) => {
                    data=JSON.parse(data);
                    if (data.oid == "") {
                        alert("Please login first");
                        window.location.href = "/user/login";
                    }
                    else{
                        // let arr=window.location.href.split("/");
                        // let bindOid=arr[arr.length-1].split("#")[0];
                        // this.setSession("bindOid",bindOid);

                        window.open("/user/userSpace", "_blank")

                    }
                }
            })
        },
        search(){
            var data = {
                asc: this.pageOption.sortAsc,
                page: this.pageOption.currentPage - 1,
                pageSize: this.pageOption.pageSize,
                searchText: this.relateSearch,
                sortType:"default",
                classifications: ["all"],
            };
            let url,contentType;

                    url="/modelItem/list";
                    contentType="application/x-www-form-urlencoded";

            $.ajax({
                type: "POST",
                url: url,
                data: data,
                async: true,
                contentType:contentType,
                success: (json) => {
                    if (json.code == 0) {
                        let data = json.data;
                        console.log(data)

                        this.pageOption.total = data.total;
                        this.pageOption.pages = data.pages;
                        this.pageOption.searchResult = data.list;
                        this.pageOption.users = data.users;
                        this.pageOption.progressBar = false;
                        this.pageOption.paginationShow=true;

                    }
                    else {
                        console.log("query error!")
                    }
                }
            })
        },
        //end relation


        handleDownload(index,row){
            // console.log(index,row);
        },
        handleShare(index,row){

        },
         getImg(item){
            return "/static/img/filebrowser/"+item.suffix+".svg"
         },

        generateId(key){
            return key;
        },
        getid(eval){
            this.dataid=eval;


        },

        share(){
            // if(this.dataid==''){
            //     this.$message('please select file first!!');
            // }

            let item =this.databrowser[this.dataid]

            if(item!=null){
                let url ="/dataItem/downloadRemote?&sourceStoreId="+item.sourceStoreId;
                 this.$alert("<input style='width: 100%' value="+url+">",{
                     dangerouslyUseHTMLString: true
                 })
                // this.dataid='';

            }else {
                // console.log("从后台获取数据条目数组有误")
                this.$message('please select file first!!');
            }
        },
        dall(){


             let locaurl=window.location.href;
             let url =locaurl.split("/");
             // console.log(url[url.length-1]);

             let downloadallzipurl="http://172.21.213.194:8081/dataResource/getResourcesRelatedDataItem/"+url[url.length-1];

             let link =document.createElement("a");
             link.style.display='none';
             link.href=downloadallzipurl;
             link.setAttribute("download","alldata.zip");

             document.body.appendChild(link);
             link.click();

        },
        showtitle(ev){
            return ev.fileName+"\n"+"Type:"+ev.suffix;
        },
        downloaddata(){

            // if(this.dataid==undefined){
            //     this.$message('please select file first!!');
            // }
            // console.log("downid"+this.dataid)

            let item =this.databrowser[this.dataid];

            if(item!=null){
                let url ="/dataItem/downloadRemote?&sourceStoreId="+item.sourceStoreId;
                let link =document.createElement('a');
                link.style.display='none';
                link.href=url;
                link.setAttribute(item.fileName,'filename.'+item.suffix)

                document.body.appendChild(link)
                link.click();

            }else {
                this.$message('please select file first!!');
            }


        },

        showsearchresult(data){

            //动态创建DOM节点

            for(let i=0;i<this.databrowser.length;i++){
                //匹配查询字段
                if(this.databrowser[i].fileName.toLowerCase().indexOf(data.toLowerCase())>-1){
                    //插入查找到的card

                    //card
                    let searchresultcard=document.createElement("div");
                    searchresultcard.classList.add("el-card");
                    searchresultcard.classList.add("dataitemisol");
                    searchresultcard.classList.add("is-never-shadow");
                    searchresultcard.classList.add("sresult");


                    //cardbody
                    let secardbody=document.createElement("div");
                    secardbody.classList.add("el-card__body");
                    //card里添加cardbody
                    searchresultcard.appendChild(secardbody);

                    //el-row1
                    let cardrow1=document.createElement("div");
                    cardrow1.classList.add("el-row");
                    secardbody.appendChild(cardrow1);

                    //3个div1
                    //div1
                    let div1=document.createElement("div");
                    div1.classList.add("el-col");
                    div1.classList.add("el-col-6");

                    let text1=document.createTextNode(" ");
                    div1.appendChild(text1);

                    cardrow1.appendChild(div1)

                    //div2
                    let div2=document.createElement("div");
                    div2.classList.add("el-col");
                    div2.classList.add("el-col-12");

                    let img=document.createElement("img");
                    img.src="/static/img/filebrowser/"+this.databrowser[i].suffix+".svg";

                    img.style.height='60%';
                    img.style.width='100%';
                    img.style.marginLeft='30%';

                    div2.appendChild(img);

                    cardrow1.appendChild(div2)

                    //div3
                    let div3=document.createElement("div");
                    div3.classList.add("el-col");
                    div3.classList.add("el-col-6");

                    let text2=document.createTextNode(" ");
                    div3.appendChild(text2);

                    cardrow1.appendChild(div3);


                    //el-row2
                    let cardrow2=document.createElement("div");
                    cardrow2.classList.add("el-row");
                    secardbody.appendChild(cardrow2);

                    //3个div2
                    //div4
                    let div4=document.createElement("div");
                    div4.classList.add("el-col");
                    div4.classList.add("el-col-2");

                    let text3=document.createTextNode(" ");
                    div4.appendChild(text3);

                    cardrow2.appendChild(div4)

                    //div5
                    let div5=document.createElement("div");
                    div5.classList.add("el-col");
                    div5.classList.add("el-col-20");

                    let p=document.createElement("p");
                    div5.appendChild(p);

                    let filenameandtype=document.createTextNode(this.databrowser[i].fileName+'.'+this.databrowser[i].suffix);
                    p.appendChild(filenameandtype)

                    cardrow2.appendChild(div5)

                    //div6
                    let div6=document.createElement("div");
                    div6.classList.add("el-col");
                    div6.classList.add("el-col-20");

                    let text4=document.createTextNode(" ");
                    div6.appendChild(text4);

                    cardrow2.appendChild(div6)

                    //往contents里添加card
                    document.getElementById("browsercont").appendChild(searchresultcard);

                    //DOM2级事件绑定

                    // searchresultcard.addEventListener('click',()=>{
                    //    //点击赋值id
                    //     this.dataid=i;
                    // });
                    searchresultcard.click(function () {
                        this.dataid=i;
                    })

                }
            }
        },
        showmycomment(key){
            if(this.comforcom===key){
                this.comforcom=''
                this.comforcomtextarea=''
            }else {
                this.comforcom=key
            }

        },
        showcomment(key){
            if(this.comments===key){
                this.comments=''
            }else {


                this.comments=key;
            }



        },


        //对评论的评论
        reply(id){

            if(this.useroid==''){
                alert("Please login");
                window.location.href = "/user/login";
            }else{
                var curid=window.location.href;
                var theid=curid.split("/");
                var replycomment={
                    author:this.userName,
                    comment:this.comforcomtextarea,
                    date:new Date()

                }

                var commentsAddDTO={
                    "id":theid[theid.length-1],
                    "commentid":id,
                    "commentsForComment":replycomment
                }

                var that=this;
                axios.post("/dataItem/reply",commentsAddDTO)
                    .then(res=>{
                        if(res.status == 200){
                            that.$notify({
                                title: '评论成功',
                                message: '成功对此条评论发表了自己的看法',
                                type: 'success'
                            });
                            // console.log(that.allcomments)
                            var currenturl=window.location.href;
                            var dataitemid=currenturl.split("/");
                            axios.get("/dataItem/getcomment/"+dataitemid[dataitemid.length-1])
                                .then(res=>{
                                    // console.log("red"+res)
                                    that.allcomments=res.data.data.comments;

                                    // console.log("after"+that.allcomments)

                                })
                        }
                    });

            }

        },
        //对数据条目的评论
        putcomment(){
            if(this.useroid==''){
                alert("Please login");
                window.location.href = "/user/login";
            }else{
                var curid=window.location.href;
                var theid=curid.split("/");
                var nowDate=new Date();
                if(this.allcomments)
                    var commentsAddDTO={
                        "id":theid[theid.length-1],
                        "myComment":{
                            "id":this.allcomments.length,
                            "comment":this.mycommentforthedata,
                            "thumbsUpNumber":0,
                            "commentDate":nowDate,
                            "author":this.userName,
                        }
                    };
                var that=this;
                axios.post("/dataItem/putcomment",commentsAddDTO)
                    .then(res=>{
                        if(res.status == 200){
                            that.$notify({
                                title: '评论成功',
                                message: '成功对本数据项进行了评论',
                                type: 'success'
                            });
                            // console.log(that.allcomments)
                            var currenturl=window.location.href;
                            var dataitemid=currenturl.split("/");
                            axios.get("/dataItem/getcomment/"+dataitemid[dataitemid.length-1])
                                .then(res=>{
                                    // console.log("red"+res)
                                    that.allcomments=res.data.data.comments;

                                    // console.log("after"+that.allcomments)

                                })
                        }
                    });
            }



        },
        //点赞
        thumbsup(key){
            this.thisthumbs=key;

            var curid=window.location.href;
            var theid=curid.split("/");
            var commentsUpdateDTO={
                "dataId":theid[theid.length-1],
                "commentId":key
            }

            var that=this;
            axios.post("/dataItem/thumbsup",commentsUpdateDTO)
                .then(res=>{
                    if(res.status == 200){
                        that.$notify({
                            title: '感谢点赞',
                            message: '成功对本数据项进行了评论',
                            type: 'success'
                        });
                        // console.log(res)
                        that.thumbs=res.data;

                    }
                });




        },
        //格式化评论时间
        formatDate(date){
                var dateee=new Date(date).toJSON();
            var da = new Date(+new Date(dateee)+8*3600*1000).toISOString().replace(/T/g,' ').replace(/\.[\d]{3}Z/,'')
            return da
        },
        getcommentlength(arr){
            if(arr==null){
                return 0
            }else {
                return arr.length;
            }
        },
        getCategory(){
            var that=this;
            this.dataCategory=[];
            let curentId=document.location.href.split("/");
            // axios.get("/dataItem/category/",{
            //     params:{
            //         id:curentId[curentId.length-1]
            //     }
            // })
            //     .then(res=>{
            //        that.dataCategory=res.data.data;
            //     })
        },
        clickDataItemInfo(id){
            //todo jump to the dataitems,and choose the id category

            // console.log(dataItems.$data)

            // window.history.back(-1)
            // data_items.$options.methods.chooseCate(id)

        },
        checkRelatedModels(item){
            let curentId=document.location.href.split("/");
            return curentId[0]+"//"+curentId[2]+"/modelItem/"+item.oid;
        },
        handleClose(done) {
            this.$confirm('Are you sure to close this dialog？')
                .then(_ => {
                    done();
                })
                .catch(_ => {});
        },
        //add related models

        addRelatedModel(){

            if(this.useroid==''){
                alert("Please login");
                window.location.href = "/user/login";
            }else{
                this.searchAddModelPage=0
                this.searchAddRelatedModels=[]
                this.addModelsSearchText=""
                this.selectedModels=[]
                this.selectedModelsOid=[]


                this.addRelatedModelsDialogVisible=true






            }



        },




        searchRelatedModels(){



            this.nomoreflag=false
            if(this.value1==='1'){

                this.addSearchFromUser()
            }else if(this.value1==='2'){

                this.addSearchFromAll()
            }
        },
        clearSearchResult(){
            this.searchAddRelatedModels=[]
        },
        loadAddMore(e){

            let that=this
                if ( e.target.scrollHeight - e.target.clientHeight-e.target.scrollTop <10) { //到达底部100px时,加载新内容

                    clearTimeout(this.timer);

                    this.timer=setTimeout(()=>{
                            that.searchAddModelPage+=1// 这里加载数据..



                            if(this.value1==='1'){
                                that.addSearchFromUser()
                            }else if(this.value1==='2'){
                                that.addSearchFromAll()
                            }


                        },
                        500)

                }


        },
        addSearchFromUser() {

            let data={
                searchText:this.addModelsSearchText,
                page:this.searchAddModelPage,
                sortType:"default",
                asc:1
            }
            let that=this
            this.loading=true
            axios.get("/modelItem/searchModelItemsByUserId",{
                params:data
            })
            .then((res)=>{

                if(res.status===200){
                    that.loading=false
                    that.searchAddRelatedModels=that.searchAddRelatedModels.concat(res.data.data.modelItems)
                }



            })

        },
        addSearchFromAll(){
            let data=new FormData()
            data.append('searchText',this.addModelsSearchText)
            data.append('page',this.searchAddModelPage)
            data.append('sortType','default')
            data.append('asc',false)
            data.append('pageSize',10)
            data.append('classifications[]','all')



            let that=this
            this.loading=true
            axios.post("/modelItem/list",data)
                .then((res)=>{

                    if(res.status===200){
                        that.loading=false
                        that.searchAddRelatedModels=that.searchAddRelatedModels.concat(res.data.data.list)
                    }



                })

        },
        selectRelatedModel(item,e){

            if(this.selectedModels.indexOf(item.name)>-1){
                e.currentTarget.className="is-hover-shadow models_margin_style"

                this.getRidOf(item.name,this.selectedModels)
                this.getRidOf(item.oid,this.selectedModelsOid)
            }else{
                e.currentTarget.className="is-hover-shadow models_margin_style selectedModels"

                this.selectedModels.push(item.name)
                this.selectedModelsOid.push(item.oid)
            }



        },
        getRidOf(e,arr){
            arr.splice(arr.indexOf(e),1)
        },
        relatedToCurrentData(){

            if(this.selectedModelsOid.length===0){
                alert("pleasa select model first!")
            }else{

                let curentId=document.location.href.split("/");

                let dataItemFindDTO={
                    dataId:curentId[curentId.length-1],
                    relatedModels:this.selectedModelsOid
                }

                axios.post("/dataItem/models",dataItemFindDTO)


                    .then((res)=>{
                        if(res.status===200){
                            alert("Cgts,related models successfully!")

                        }

                    })



            }

        },













        showRelatedModels(){
            this.dataNums=5
            this.searchAddRelatedModels=[]
            this.searchRelatedModelsDialogVisible=true
            relatedModelsSearchText=""
            this.RelatedModels(this.dataNums)




        },
        searchFromRelatedModels(){
            //todo search from show related models
        },
        //函数节流防抖
        loadMore(e){

            if(!this.nomoreflag){
                if ( e.target.scrollHeight - e.target.clientHeight-e.target.scrollTop <10) { //到达底部100px时,加载新内容

                    clearTimeout(this.timer);

                    this.timer=setTimeout(()=>{
                            this.dataNums+=5// 这里加载数据..
                            this.RelatedModels(this.dataNums)
                        },
                        500)

                }
            }

        },

        RelatedModels(more){
            let curentId=document.location.href.split("/");
            let that=this
            this.loading=true
            this.nomore=false
            axios.get("/dataItem/allrelatedmodels",{
                params:{
                    id:curentId[curentId.length-1],
                    more:more
                }
            })
                .then((res)=>{
                    if(res.status==200){
                        that.loading=false
                        //todo 传回来数组为空时
                        if(res.data.data[0].all==="all"){
                            that.nomore="no more"
                            that.nomore=true
                            that.loading=false

                        }else{
                            that.allRelatedModels=that.allRelatedModels.concat(res.data.data)
                            that.loading=false
                        }

                    }

                })


        }



    },

    mounted(){

        this.getCategory();

        var currenturl=window.location.href;
        var url=currenturl.split("/")
        this.currentDataId=url[url.length-1]

        // var cite=document.getElementById("citeurl");
        // cite.src='http://geomodeling.njnu.edu.cn/'+url[url.length-2]+'/'+url[url.length-1];
        // cite.innerText='<http://geomodeling.njnu.edu.cn/'+url[url.length-2]+'/'+url[url.length-1]+'>';

        var dataitemid=currenturl.split("/");
        var alldata=new Array();

        // axios.get("/dataItem/viewcount",{
        //     params:{
        //             id:dataitemid[dataitemid.length-1]
        //             }
        // }).then(res=>{
        //     that.viewCount=res.data
        // })


        var that=this;
        axios.get("/dataItem/getRemoteDataSource?dataItemId="+dataitemid[dataitemid.length-1])
            .then(function (res) {
                if(res.status==200){
                     for(var i=0;i<res.data.data.data.length;i++){

                         that.databrowser.push(res.data.data.data[i])
                     }

                }else{
                    console.log("error")
                    that.$message("datamanager get data error!")
                }

                //when browser get no data,the element hidden
                if(that.databrowser.length==0){
                    $('#resources').css('display','none');
                }



            } );

        axios.get("/dataItem/getcomment/"+dataitemid[dataitemid.length-1])
            .then(res=>{
                that.allcomments=res.data.data.comments;

                // console.log(res.data.data.comments)

            });

        axios.get("/user/load")
            .then((res)=>{
                that.userName=res.data.name;
                that.useroid=res.data.oid;
            })

        // axios.get("/dataItem/briefrelatedmodels",{
        //     params:{
        //         id:dataitemid[dataitemid.length-1]
        //     }
        // })
        //     .then((res)=>{
        //         that.related3Models=res.data.data
        //
        //         if(that.related3Models.length===0){
        //             that.relatedModelIsNull =true;
        //             that.relatedModelNotNull=false
        //         }else {
        //             that.relatedModelNotNull=true
        //             that.relatedModelIsNull=false;
        //         }
        //     })

        new QRCode(document.getElementById("qrcode"), {
            text: window.location.href,
            width: 200,
            height: 200,
            colorDark : "#000000",
            colorLight : "#ffffff",
            correctLevel : QRCode.CorrectLevel.H
        });




        //full-text
        $(document).on("click", ".detail-toggle", function () {
            if ($(this).text() == "[Collapse]") {
                $(this).text("[Expand]");
            }
            else {
                $(this).text("[Collapse]")
            }

        })

        $('html, body').animate({scrollTop:0}, 'slow');


        let descHeight=$("#description .block_content").height();
        if(descHeight>300){
            $("#description .block_content").css("overflow","hidden")
            $("#description .block_content").css("height","250px")

            $(".fullPaper").removeClass("hide");
        }

        $("#fullPaper").click(function(){
            $("#description .block_content").css("overflow","inherit");
            $("#description .block_content").css("height","auto");
            $(".fullPaper").remove();
        })








    },

});

//JQuery
$(function () {
    setTimeout(function () {

        //数据项点击样式事件
        $(".filecontent .el-card").on('click',function (e) {

            $(".filecontent .browsermenu").hide();

            $(this).addClass("clickdataitem");


            $(this).siblings().removeClass("clickdataitem");

        });


        //数据项右键菜单事件
        $(".filecontent .el-card").contextmenu(function (e) {

            e.preventDefault();



            $(".browsermenu").css({
                "left":e.pageX,
                "top":e.pageY
            }).show();


        });


        //contents白板右键点击菜单事件，是否添加有待进一步思考
        $(".filecontent").contextmenu(function (e) {
            e.preventDefault();
            // $(".browser").css({
            //     "left":e.pageX,
            //     "top":e.pageY
            // }).show();

        });

        //下载全部按钮为所有数据项添加样式事件
        $(".dall").click(function () {
            $(".dataitemisol").addClass("clickdataitem")


        });


        //搜索结果样式效果和菜单事件
        $("#browsercont").on('click',function (e) {

            $(".el-card.dataitemisol.is-never-shadow.sresult").click(function () {
                $(this).addClass("clickdataitem");

                $(this).siblings().removeClass("clickdataitem");

            });


            $(".el-card.dataitemisol.is-never-shadow.sresult").contextmenu(function () {

                $(".browsermenu").css({
                    "left":e.pageX,
                    "top":e.pageY
                }).show();

            })


        });

        //contents白板点击隐藏数据项菜单事件
        $(".filecontent").click(function () {
            $(".browsermenu").hide();

        });

        //光标移入输入框隐藏数据项右键菜单
        $("#searchinput").on("mouseenter",function () {
            $(".browsermenu").hide();
        });

    },0)


});


//todo 文件管理器已经阉割 CUT
// //文件管理器输入框获取焦点是改变颜色事件，focus,blur事件
// document.getElementById("searchinput").addEventListener("focus",(e)=>{
//     e.srcElement.style.border="solid 2px #19bd5b";
// });
// document.getElementById("searchinput").addEventListener("blur",(e)=>{
//     e.srcElement.style.border="solid  .5px black";
// });








