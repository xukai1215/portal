

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

            allcomments:[],
            thumbs:'',
            thisthumbs:'',
            userName:'',
            useroid:'',
            dataCategory:[],
            viewCount:''

        }
        
    } ,
    methods: {
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
            var curentId=document.location.href.split("/");
            axios.get("/dataItem/category/",{
                params:{
                    id:curentId[curentId.length-1]
                }
            })
                .then(res=>{
                   that.dataCategory=res.data.data;
                })
        },
        clickDataItemInfo(id){
            //todo jump to the dataitems,and choose the id category

            // console.log(dataItems.$data)

            // window.history.back(-1)
            // data_items.$options.methods.chooseCate(id)

        }



    },
    watch:{
        //通过与input节点的双向绑定，进行input输入值的监听
        searchcontent: {
            handler: function (val) {
                if (val.length>0) {


                    let itemnode = document.getElementsByClassName("dataitemisol");
                    for (let i = 0; i < itemnode.length; i++) {
                        itemnode[i].style.display = 'none';
                    }

                this.showsearchresult(val);

                } else if(val.length==0) {

                    //删除搜索时添加的card
                    let itemnodechild = document.getElementsByClassName("el-card dataitemisol is-never-shadow sresult");
                    //符合查询条件的查询结果长度

                    // console.log();
                    for (let j = 0; j < itemnodechild.length; ) {
                        // itemnodeparent.removeChild(itemnodechild[j]);
                        if(itemnodechild.length>0){
                            itemnodechild[j].parentNode.removeChild(itemnodechild[0])
                        }else {
                            break;
                        }
                    }

                    //输入为空时显示默认数据条目
                    let itemnode2 = document.getElementsByClassName("dataitemisol");
                    for (let k = 0; k < itemnode2.length; k++) {
                        itemnode2[k].style.display = 'block';

                    }

                }
            }
        }
    },
    mounted(){

        this.getCategory();




        // var raster = new ol.layer.Tile({
        //     source: new ol.source.OSM()
        // });
        //
        // var source = new ol.source.Vector({wrapX: false});
        //
        // var vector = new ol.layer.Vector({
        //     source: source
        // });
        //
        // var map = new ol.Map({
        //     layers: [raster, vector],
        //     target: 'map',
        //     view: new ol.View({
        //         center: ol.proj.fromLonLat([106, 35]),
        //         zoom: 4
        //     })
        // });



        var currenturl=window.location.href;
        var url=currenturl.split("/")

        var cite=document.getElementById("citeurl");
        cite.src='http://opengms.cityfun.com.cn/'+url[url.length-2]+'/'+url[url.length-1];
        cite.innerText='<http://opengms.cityfun.com.cn/'+url[url.length-2]+'/'+url[url.length-1]+'>';



        var dataitemid=currenturl.split("/");
        var alldata=new Array();

        axios.get("/dataItem/viewcount",{
            params:{
                    id:dataitemid[dataitemid.length-1]
                    }
        }).then(res=>{
            that.viewCount=res.data.data
        })


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



        // fetch("/dataItem/getRemoteDataSource?dataItemId="+dataitemid[dataitemid.length-1])
        //     .then(function (data) { console.log(data) })


        new QRCode(document.getElementById("qrcode"), {
            text: window.location.href,
            width: 200,
            height: 200,
            colorDark : "#000000",
            colorLight : "#ffffff",
            correctLevel : QRCode.CorrectLevel.H
        });





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








