var data_items = new Vue({
    el:"#data_items",
    components: {
        'avatar': VueAvatar.Avatar
    },
    data: function () {
        return {
            activeIndex: '3',
            searchText: new Array(),
            progressBar: true,
            currentPage: 1,
            viewCount:-1,
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            findDto: {
                page: 1,
                pageSize: 10,
                asc: false,
                classifications:[],
                category:'',
                searchContent:[],
                curQueryField:'',
            },
            list:new Array(),
            users:[],
            classlist:[],
            datacount: '',
            classclick:false,
            activeNames:["1"],
            activeNames1:["11"],
            activeNames2:["1"],
            activeName:"first",
            category:[],
            ca:'',
            hubnbm:'',
            tObj:new Object(),
            categoryTree:[],
            theDefaultCate:'5f3e42070e989714e8364e9a',
            loading:false,
            useroid:'',
            dataType:"hubs",
            stretch:true,
            dataApplication: [],
            // categoryId:"5cb83fd0ea3cba3224b6e24e",
            sortTypeName:"View Count",
            sortFieldName:"viewCount",
            sortOrder:"Desc.",
            asc:false,

            queryFields:["Name","Keyword","Content","Contributor"],
            curQueryField:"Name",

        }
    },
    methods: {

        //显示功能引导框
        showDriver(){
            if(!this.driver){
                this.driver = new Driver({
                    "className": "scope-class",
                    "allowClose": false,
                    "opacity" : 0.1,
                    "prevBtnText": "Previous",
                    "nextBtnText": "Next"
                });
                this.stepsConfig = [
                    {
                        "element" : ".categoryList",
                        "popover" : {
                            "title" : "Data Categories",
                            "description" : "You can query data by choosing a category.",
                            "position" : "right-top",
                        }
                    },
                    {
                        "element": ".searcherInputPanel",
                        "popover": {
                            "title": "Search",
                            "description": "You can also search data by name.",
                            "position": "bottom-right",
                        }
                    },
                    {
                        "element": ".modelPanel",
                        "popover": {
                            "title": "Overview",
                            "description": "Here is query result, you can browse data's overview. Click data name to check detail.",
                            "position": "top",
                        }
                    },
                    {
                        "element" : "#contributeBtn",
                        "popover" : {
                            "title" : "Contribute",
                            "description" : "You can share your data on OpenGMS, and get a OpenGMS unique identifier!",
                            "position" : "bottom",
                        }
                    }
                ];
            }

            if(document.body.clientWidth < 1000){
                this.stepsConfig[1].popover.position = "top";
            }
            this.driver.defineSteps(this.stepsConfig);
            this.driver.start();
        },

        handleChange(){

        },
        handleChange1(){

        },
        handleChange2(){

        },
        handleClick(tab, event) {
            console.log(tab, event);
        },
        startinput(){
            $('.el-collapse-item .el-button').css('color','#2b305b')
            this.ca=''
        },
        //文本检索
        search(){
            this.searchText=$('#searchBox').val();
            this.loading=true;
            var that=this
            that.progressBar=true
            let li=that.list;
            let slist=new Array();
            if(this.searchText.length!=0){
                this.findDto.searchText=this.searchText;
                this.findDto.page=1;
                this.findDto.tabType = this.dataType;
                this.findDto.asc = this.asc;
                this.findDto.curQueryField = this.curQueryField;
                axios.post("/dataItem/searchByCurQueryField",that.findDto)
                    .then((res)=>{
                        console.log(res);
                        setTimeout(()=>{
                            that.list=res.data.data.list;
                            that.progressBar=false;
                            that.datacount=res.data.data.total;
                            that.users=res.data.data.users;
                            that.loading=false;
                        },100)
                    });
            }else{
                this.datacount=0;
                this.list=[]
                this.list.push("no content");
                that.progressBar=false;
            }
        },
        //页码点击翻页
        handleCurrentChange(currentPage) {
            this.currentPage = currentPage;
            //把当前页码给dto
            this.findDto.page=currentPage;
            this.findDto.asc = this.asc;
            var that=this
            if(this.ca!=''){
                axios.get("/dataItem/items/"+this.theDefaultCate+"&"+currentPage+"&"+this.dataType+"&"+this.sortFieldName+"&"+this.sortOrder)
                    .then(res=>{
                        setTimeout(()=>{
                            window.history.pushState(null,null,"?category="+that.theDefaultCate+"&page="+that.findDto.page)
                            that.list=res.data.data.content;
                            that.datacount=res.data.data.totalElements;
                            that.users=res.data.data.users;
                            that.classclick=true;
                            that.progressBar=false
                        },500)
                    });
            }else {
                axios.post("/dataItem/searchByName/",that.findDto)
                    .then((res)=>{
                        setTimeout(()=>{
                            that.list=res.data.data.list;
                            that.progressBar=false;
                            that.datacount=res.data.data.total;
                            that.users=res.data.data.users;
                            that.loading=false;
                        },500)
                    });
            }
        },
        getclasslist(val){
            this.classlist=val;
        },
        chooseCate(item){
            this.theDefaultCate=item
            this.findDto.page=1
            window.history.pushState(null,null,"?category="+this.theDefaultCate+"&page="+this.findDto.page)
            this.getParams()
            var this_button=$('#'+item)
            this.datacount=-1
            this.loading=true
            $('.manyhub').css('display','none');
            $('.maincontnt').css('display','block');
            this_button[0].style.color="green";
            this_button[0].style.fontWeight="bold";
            var all_button=$('.el-button')
            for (let i = 0; i < all_button.length; i++) {
                if(all_button[i]!=this_button[0]){
                    all_button[i].style.color="";
                    all_button[i].style.fontWeight="";
                }
            }
            this.ca=this_button[0].innerText;
            // let asc = (this.sortOrder === 'Asc.');
            this.findDto={
                categoryId:item,
                asc:this.asc,
                page:1,
                sortField:this.sortFieldName
            }
            this.progressBar=true;
            var that=this
            if(this.ca==="Hubs"){
                this.hubs();
            }else {
                axios.get("/dataItem/items/"+this.theDefaultCate+"&"+1+"&"+this.dataType+"&"+this.sortFieldName+"&"+this.sortOrder)
                    .then(res=>{
                        setTimeout(()=>{
                            console.log(res)
                            that.list=res.data.data.content;
                            that.datacount=res.data.data.totalElements;
                            that.users=res.data.data.users;
                            that.classclick=true;
                            that.progressBar=false
                            that.loading=false;
                        },100)

                    });
            }
        },
        defaultlist(){
            this.progressBar=true;
            this.loading=true;
            // //todo 默认第一个按钮被选中
            var this_button=$('#'+this.theDefaultCate)
            // e.target.style.color="green";
            this_button[0].style.color="green";
            this_button[0].style.fontWeight="bold";
            var all_button=$('.el-button')
            for (let i = 0; i < all_button.length; i++) {
                if(all_button[i]!=this_button[0]){
                    all_button[i].style.color="";
                    all_button[i].style.fontWeight="";
                }
            }
            this.ca=this_button[0].innerText
            var that=this;
            let sendDate = (new Date()).getTime();
            axios.get("/dataItem/items/"+this.theDefaultCate+"&"+1+"&"+this.dataType+"&"+this.sortFieldName+"&"+this.sortOrder)
                .then(res=>{
                    let receiveDate = (new Date()).getTime();
                    let responseTimeMs = receiveDate - sendDate;
                    let timeoutTime=0;
                    //console.log(responseTimeMs)
                    if(responseTimeMs<450){
                        timeoutTime=450-responseTimeMs;
                    }
                    setTimeout(()=>{
                        if(res.data.data!=null){
                            that.list=res.data.data.content;
                            that.datacount=res.data.data.totalElements;
                            that.users=res.data.data.users;
                        }
                        that.classclick=true;
                        that.progressBar=false;
                        that.loading=false;
                    },timeoutTime)
                });
        },
        goto(id){
            return "/dataItem/"+id;
        },
        goto1(id){
            return "/dataItem/hub/"+id;
        },
        view(id){
            axios.get("/dataItem/viewplus",{
                params:{
                    id:id
                }
            })
        },
        //格式化时间
        formatDate(date){
            var dateee=new Date(date).toJSON();
            var da = new Date(+new Date(dateee)+8*3600*1000).toISOString().replace(/T/g,' ').replace(/\.[\d]{3}Z/,'')
            return da
        },
        hubs(){
            this.progressBar=false;
            this.ca="We collect data from public hubs..";
            document.body.scrollTop=document.documentElement.scrollTop=0;
            $('.maincontnt').css('display','none');
            $('.manyhub').css('display','block');
            this.list=[]
            this.hubnbm=10
            var that=this
            axios.get("/dataItem/list",{params:{hubnbm:this.hubnbm}})
                .then(res=>{
                    that.list=res.data.data;
                    that.datacount=that.list.length;
                })
        },
        addmorehubs(){
            console.log($("#addmore"))
            this.loading=true
            this.datacount=-1
            this.hubnbm=this.hubnbm+10;
            var that=this
            axios.get("/dataItem/addmorehubs",{params:{hubnbm:this.hubnbm}})
                .then(res=>{
                    setTimeout(()=>{
                        if(that.list.length===res.data.data.length ){
                            $("#addmore")[0].innerText="no more data"
                        }else{
                            that.list=res.data.data;
                            that.datacount=that.list.length;
                            //todo 这里的33是hubs总量，暂时写死，后期根据总量改
                            if(that.list.length===33){
                                $("#addmore")[0].style.display="none"
                            }
                        }
                        that.loading=false
                    },500)
                })
        },
        contribute(){
            if(this.useroid==''){
                alert("Please login");
                window.location.href = "/user/login";
            }else{
                window.location.href="/user/userSpace#/data/createDataItem";
            }
        },
        getParams(){
            let category=this.GetQueryString("category");
            let page=this.GetQueryString("page");
            this.theDefaultCate=category
            this.findDto.page=page
        },
        GetQueryString(name) {
            var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if(r!=null)return  unescape(r[2]); return null;
        },
        changeSortField(ele){
            this.sortTypeName = ele;
            let field = ele.replace(" ","").replace(ele[0],ele[0].toLowerCase());
            this.sortFieldName = field;
            this.getData();
        },
        changeSortOrder(ele){
            this.sortOrder=ele;
            this.asc = (this.sortOrder === 'Asc.');
            this.getData();
            // this.sortAsc = ele==="asc.";
        },
        getData(){
            let that = this;
            axios.get("/dataItem/items/"+this.theDefaultCate+"&"+this.currentPage+"&"+this.dataType+"&"+this.sortFieldName+"&"+this.sortOrder)
                .then(res=>{
                    setTimeout(()=>{
                        console.log(res)
                        that.list=res.data.data.content;
                        that.datacount=res.data.data.totalElements;
                        that.users=res.data.data.users;
                        that.classclick=true;
                        that.progressBar=false
                        that.loading=false;
                    },100)
                });
        }
    }
    ,
    mounted(){
        let that=this;
        let u=window.location.href
        let f=u.split("/");
        let index = u.lastIndexOf("\/");
        that.dataType = u.substring(index+1,u.length);
        if(f[f.length-1]==="hubs"){
            axios.get("/dataItem/items/"+this.theDefaultCate+"&"+1+"&"+this.dataType+"&"+this.sortFieldName+"&"+this.sortOrder)
                .then(res=>{
                    setTimeout(()=>{
                        console.log(res)
                        that.list=res.data.data.content;
                        that.datacount=res.data.data.totalElements;
                        that.users=res.data.data.users;
                        that.classclick=true;
                        that.progressBar=false
                        that.loading=false;
                    },100)
                });
            var this_button=$('#5f3e42070e989714e8364e9a');
            this_button[0].style.color="green";
            this_button[0].style.fontWeight="bold";

            var all_button=$('.el-button')

            for (let i = 0; i < all_button.length; i++) {
                if(all_button[i]!=this_button[0]){
                    all_button[i].style.color="";
                    all_button[i].style.fontWeight="";
                }
            }
            this.ca="Land Regions";
        }else if(f[f.length-1]==="repository"){
            axios.get("/dataItem/items/"+this.theDefaultCate+"&"+1+"&"+this.dataType+"&"+this.sortFieldName+"&"+this.sortOrder)
                .then(res=>{
                    setTimeout(()=>{
                        console.log(res)
                        that.list=res.data.data.content;
                        that.datacount=res.data.data.totalElements;
                        that.users=res.data.data.users;
                        that.classclick=true;
                        that.progressBar=false
                        that.loading=false;
                    },100)
                });
            var this_button=$('#5f3e42070e989714e8364e9a')
            // e.target.style.color="green";
            this_button[0].style.color="green";
            this_button[0].style.fontWeight="bold";

            var all_button=$('.el-button')
            for (let i = 0; i < all_button.length; i++) {
                if(all_button[i]!=this_button[0]){
                    all_button[i].style.color="";
                    all_button[i].style.fontWeight="";
                }
            }
            this.ca="Land Regions";
        }else if(f[f.length-1]==="network"){
            axios.get("/dataItem/items/"+this.theDefaultCate+"&"+1+"&"+this.dataType+"&"+this.sortFieldName+"&"+this.sortOrder)
                .then(res=>{
                    setTimeout(()=>{
                        console.log(res)
                        that.list=res.data.data.content;
                        that.datacount=res.data.data.totalElements;
                        that.users=res.data.data.users;
                        that.classclick=true;
                        that.progressBar=false
                        that.loading=false;
                    },100)
                });
            var this_button=$('#5f3e42070e989714e8364e9a')
            this_button[0].style.color="green";
            this_button[0].style.fontWeight="bold";
            var all_button=$('.el-button')
            for (let i = 0; i < all_button.length; i++) {
                if(all_button[i]!=this_button[0]){
                    all_button[i].style.color="";
                    all_button[i].style.fontWeight="";
                }
            }
            this.ca="Land Regions";
        } else if(f[f.length-1]==="application"){
            this.datacount=741;
            this.progressBar=false;
            this.loading=false;
            this.list=[{"keywords":["general physical geography"],"createTime":"2019-05-06T12:00:24.604+0000","author":"NNU_Group","name":"applicationTest","description":"A collection of data collected from a number of the sources below - includes administrative areas, inland water, roads and railways, elevation, land cover, population and climate. Probably the easiest place to get a simple set of data for a specific country.","id":"5ef30550286089027ce75658","viewCount":1000,"status":"Public"},{"keywords":["general physical geography"],"createTime":"2019-05-06T12:00:24.604+0000","author":"NNU_Group","name":"applicationTest1","description":"A collection of data collected from a number of the sources below - includes administrative areas, inland water, roads and railways, elevation, land cover, population and climate. Probably the easiest place to get a simple set of data for a specific country.","id":"5ef30550286089027ce75658","viewCount":1001,"status":"Public"},{"keywords":["general physical geography"],"createTime":"2019-05-06T12:00:24.604+0000","author":"NNU_Group","name":"applicationTest2","description":"A collection of data collected from a number of the sources below - includes administrative areas, inland water, roads and railways, elevation, land cover, population and climate. Probably the easiest place to get a simple set of data for a specific country.","id":"5ef30550286089027ce75658","viewCount":1002,"status":"Public"},{"keywords":["general physical geography"],"createTime":"2019-05-06T12:00:24.604+0000","author":"NNU_Group","name":"applicationTest3","description":"A collection of data collected from a number of the sources below - includes administrative areas, inland water, roads and railways, elevation, land cover, population and climate. Probably the easiest place to get a simple set of data for a specific country.","id":"5ef30550286089027ce75658","viewCount":1003,"status":"Public"},{"keywords":["general physical geography"],"createTime":"2019-05-06T12:00:24.604+0000","author":"NNU_Group","name":"applicationTest4","description":"A collection of data collected from a number of the sources below - includes administrative areas, inland water, roads and railways, elevation, land cover, population and climate. Probably the easiest place to get a simple set of data for a specific country.","id":"5ef30550286089027ce75658","viewCount":1004,"status":"Public"},{"keywords":["general physical geography"],"createTime":"2019-05-06T12:00:24.604+0000","author":"NNU_Group","name":"applicationTest5","description":"A collection of data collected from a number of the sources below - includes administrative areas, inland water, roads and railways, elevation, land cover, population and climate. Probably the easiest place to get a simple set of data for a specific country.","id":"5ef30550286089027ce75658","viewCount":1005,"status":"Public"},{"keywords":["general physical geography"],"createTime":"2019-05-06T12:00:24.604+0000","author":"NNU_Group","name":"applicationTest6","description":"A collection of data collected from a number of the sources below - includes administrative areas, inland water, roads and railways, elevation, land cover, population and climate. Probably the easiest place to get a simple set of data for a specific country.","id":"5ef30550286089027ce75658","viewCount":1006,"status":"Public"},{"keywords":["general physical geography"],"createTime":"2019-05-06T12:00:24.604+0000","author":"NNU_Group","name":"applicationTest7","description":"A collection of data collected from a number of the sources below - includes administrative areas, inland water, roads and railways, elevation, land cover, population and climate. Probably the easiest place to get a simple set of data for a specific country.","id":"5ef30550286089027ce75658","viewCount":1007,"status":"Public"},{"keywords":["general physical geography"],"createTime":"2019-05-06T12:00:24.604+0000","author":"NNU_Group","name":"applicationTest8","description":"A collection of data collected from a number of the sources below - includes administrative areas, inland water, roads and railways, elevation, land cover, population and climate. Probably the easiest place to get a simple set of data for a specific country.","id":"5ef30550286089027ce75658","viewCount":1008,"status":"Public"},{"keywords":["general physical geography"],"createTime":"2019-05-06T12:00:24.604+0000","author":"NNU_Group","name":"applicationTest9","description":"A collection of data collected from a number of the sources below - includes administrative areas, inland water, roads and railways, elevation, land cover, population and climate. Probably the easiest place to get a simple set of data for a specific country.","id":"5ef30550286089027ce75658","viewCount":1009,"status":"Public"},];
            this.users=[{"image":"/static/user/c4e82487-a828-497a-b549-f814ecccc8b7.jpg","name":"NNU_Group","oid":"42"},{"image":"/static/user/c4e82487-a828-497a-b549-f814ecccc8b7.jpg","name":"NNU_Group","oid":"42"},{"image":"/static/user/c4e82487-a828-497a-b549-f814ecccc8b7.jpg","name":"NNU_Group","oid":"42"},{"image":"/static/user/c4e82487-a828-497a-b549-f814ecccc8b7.jpg","name":"NNU_Group","oid":"42"},{"image":"/static/user/c4e82487-a828-497a-b549-f814ecccc8b7.jpg","name":"NNU_Group","oid":"42"},{"image":"/static/user/c4e82487-a828-497a-b549-f814ecccc8b7.jpg","name":"NNU_Group","oid":"42"},{"image":"/static/user/c4e82487-a828-497a-b549-f814ecccc8b7.jpg","name":"NNU_Group","oid":"42"},{"image":"/static/user/c4e82487-a828-497a-b549-f814ecccc8b7.jpg","name":"NNU_Group","oid":"42"},{"image":"/static/user/c4e82487-a828-497a-b549-f814ecccc8b7.jpg","name":"NNU_Group","oid":"42"},{"image":"/static/user/c4e82487-a828-497a-b549-f814ecccc8b7.jpg","name":"NNU_Group","oid":"42"}];

            var this_button=$('#5f3e42070e989714e8364e9a')
            this_button[0].style.color="green";
            this_button[0].style.fontWeight="bold";

            var all_button=$('.el-button')
            for (let i = 0; i < all_button.length; i++) {
                if(all_button[i]!=this_button[0]){
                    all_button[i].style.color="";
                    all_button[i].style.fontWeight="";
                }
            }
            this.ca="Land Regions";
        }else{
            this.getParams();
            this.defaultlist();
        }
        axios.get("/user/load")
            .then((res)=>{
                that.userName=res.data.name;
                that.useroid=res.data.oid;
            })
        $('.manyhub').css('display','none');
        $('.el-collapse-item .el-button').on('hover',function () {
            $(this).css('color','green')
        })
        $('.el-collapse-item .el-button').mouseout(function () {
            clicked=false;
        });
        $("#searchBox").focus(function(){
            that.startinput()
        })


        if(document.cookie.indexOf("dataRep=1")==-1){
            this.showDriver();
            var t=new Date(new Date().getTime()+1000*60*60*24*60);
            document.cookie="dataRep=1; expires="+t.toGMTString();
        }
    }
});
