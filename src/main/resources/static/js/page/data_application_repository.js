var data_items = new Vue({
    el:"#data_applications",
    components: {
        'avatar': VueAvatar.Avatar
    },
    data: function () {
        return {
            activeIndex: '3',
            searchText: '',
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
                sortTypeName:"createTime",
                method:'',
                searchText:''
            },
            list:new Array(),
            method:'Conversion',
            users:[],
            classlist:[],
            datacount: '',
            // classclick:false,
            // activeNames:["1"],
            // activeNames1:["11"],
            // activeNames2:["1"],
            // activeName:"first",
            // category:[],
            // ca:'All',
            // hubnbm:'',
            // tObj:new Object(),
            // categoryTree:[],
            loading:false,
            useroid:'',
            // dataType:"hubs",
            // stretch:true,
            // dataApplication: [],
            // // categoryId:"5cb83fd0ea3cba3224b6e24e",
            sortTypeName:"Create Time",
            sortOrder:"Desc.",
            asc:false,

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
                            "description" : "You can query data process methods by choosing a category.",
                            "position" : "right-top",
                        }
                    },
                    {
                        "element": ".searcherInputPanel",
                        "popover": {
                            "title": "Search",
                            "description": "You can also search data process methods by name.",
                            "position": "bottom-right",
                        }
                    },
                    {
                        "element": ".maincontnt",
                        "popover": {
                            "title": "Overview",
                            "description": "Here is query result, you can browse data process methods' overview. Click name to check detail.",
                            "position": "top",
                        }
                    },
                    {
                        "element" : "#contributeBtn",
                        "popover" : {
                            "title" : "Contribute",
                            "description" : "You can share your data process methods on OpenGMS, and get a OpenGMS unique identifier!",
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
            if(this.searchText.length!=0){
                this.findDto.searchText=this.searchText
            } else {
                this.findDto.searchText = ''
            }
            this.getData()
        },
        //页码点击翻页
        handleCurrentChange(currentPage) {
            this.currentPage = currentPage;
            //把当前页码给dto
            this.findDto.page=currentPage;
            this.findDto.asc = this.asc;
            var that=this
            this.getData()
        },
        getclasslist(val){
            this.classlist=val;
        },
        changeCateColor(){
            let eles = $('#classification').find('div')
            for(let i=0;i<eles.length;++i) {
                $(eles[i]).css('background-color','#fff')
            }
        },
        chooseCate(item, event){
            this.changeCateColor()
            $(event.target).css('background-color','#d9edf7')
            this.findDto.page=1
            this.method = item
            this.findDto.method = item==='all'?'':item      // all 赋值未空进行查询
            this.datacount=-1
            this.loading=true
            this.progressBar=true;
            this.getData()
        },
        goto(id){
            return "/dataApplication/"+id;
        },
        view(id){
            axios.get("/dataApplication/methods/viewplus",{
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
        contribute(){
            if(this.useroid==''){
                alert("Please login");
                window.location.href = "/user/login";
            }else{
                window.location.href="/user/userSpace#/data/createDataApplication";
            }
        },
        changeSortField(ele){
            this.sortTypeName = ele;
            // let field = ele.replace(" ","").replace(ele[0],ele[0].toLowerCase());
            if(this.sortTypeName==="Create Time"){
                this.findDto.sortField = "createTime"
            } else if(this.sortTypeName==="Name"){
                this.findDto.sortField = "name"
            }else{
                this.findDto.sortField = 'viewCount'        // 未实现
            }
            this.findDto.sortField = this.sortTypeName;
            this.getData();
        },
        changeSortOrder(ele){
            this.sortOrder=ele;
            this.asc = (this.sortOrder === 'Asc.');
            this.findDto.asc = this.asc
            this.getData();
            // this.sortAsc = ele==="asc.";
        },
        getData(){
            let that = this;
            axios.post("/dataApplication/methods/getApplication",that.findDto)
                .then((res)=>{
                    setTimeout(()=>{
                        that.list=res.data.data.list;
                        that.progressBar=false;
                        that.datacount=res.data.data.total;
                        that.users=res.data.data.users;
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
        // that.dataType = u.substring(index+1,u.length);
        this.getData()
        axios.get("/user/load")
            .then((res)=>{
                that.userName=res.data.name;
                that.useroid=res.data.oid;
            })

        if(document.cookie.indexOf("dataRep=1")==-1){
            this.showDriver();
            var t=new Date(new Date().getTime()+1000*60*60*24*60);
            document.cookie="dataRep=1; expires="+t.toGMTString();
        }
    }
});
