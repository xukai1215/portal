var userDataServer = Vue.extend(
    {
        template:'#userDataServer',
        data(){
            return{
                //页面样式控制
                load: true,
                ScreenMinHeight: "0px",
                ScreenMaxHeight: "0px",

                //显示控制
                curIndex:4,

                itemIndex:1,
                //
                userInfo:{

                },

                resourceLoad:false,

                //分页控制
                page: 1,
                sortAsc: 1,//1 -1
                sortType: "default",
                pageSize: 10,// 每页数据条数
                totalPage: 0,// 总页数
                curPage: 1,// 当前页码
                pageList: [],
                totalNum: 0,

                //用户
                userId:-1,

                //展示变量\
                itemTitle:'Model Item',

                searchResult: [],
                modelItemResult: [],

                searchCount: 0,
                ScreenMaxHeight: "0px",
                searchText: "",

                isInSearch:0,

                activeName:'Data',

                dataNode:{
                    baseInfo:{},
                    data:[],
                    processing: [],
                    visualization: [],
                    status:0,
                },

                loading:false,
                nodeLoading:false,

                dataItemBindDialog:false,
                dataMethodBindDialog:false,
                dataItems:[],
                dataMethods:[],

                configNodeData:{
                    bindItems:[]
                },

                unbindConfirmDialog:false,

                pageOption: {
                    paginationShow:false,
                    progressBar: true,
                    sortAsc: false,
                    currentPage: 1,
                    pageSize: 5,
                    searchText: '',
                    total: 11,
                },

                unbindConfirmDialog:false,

                serverView:1,
            }
        },

        components: {
        },

        methods:{
            //公共功能
            formatDate(value,callback) {
                const date = new Date(value);
                y = date.getFullYear();
                M = date.getMonth() + 1;
                d = date.getDate();
                H = date.getHours();
                m = date.getMinutes();
                s = date.getSeconds();
                if (M < 10) {
                    M = '0' + M;
                }
                if (d < 10) {
                    d = '0' + d;
                }
                if (H < 10) {
                    H = '0' + H;
                }
                if (m < 10) {
                    m = '0' + m;
                }
                if (s < 10) {
                    s = '0' + s;
                }

                const t = y + '-' + M + '-' + d + ' ' + H + ':' + m + ':' + s;
                if(callback == null||callback == undefined)
                    return t;
                else
                    callback(t);
            },

            setSession(name, value) {
                window.sessionStorage.setItem(name, value);
                // this.editOid = sessionStorage.getItem('editItemOid');
            },

            //page
            // 初始化page并显示第一页
            pageInit() {
                this.totalPage = Math.floor((this.totalNum + this.pageSize - 1) / this.pageSize);
                if (this.totalPage < 1) {
                    this.totalPage = 1;
                }
                this.getPageList();
                this.changePage(1);
            },

            reloadPage(){//重新装订分页诸元
                this.pageSize = 10;
                this.isInSearch = 0;
                this.page = 1;
            },

            refreshDataNode(){
                this.getDataServer()
            },

            getDataServer() {
                this.nodeLoading=true
                this.dataNode.status = 0
                $.ajax({
                    type: "GET",
                    url: "/dataServer/getUserNodes",
                    async: true,
                    success: (res) => {
                        if (res.code == -1) {
                            this.$alert("Please login first!")
                            window.location.href="/user/login";
                        } else {
                            if(res.data == undefined||Object.keys(res.data).length == 0||res.data=='offline'){
                                this.dataNode.status = 0
                                this.serverView = 1
                                this.nodeLoading=false
                            }else{
                                this.dataNode.baseInfo=res.data
                                this.dataNode.status = 1
                                this.getNodeContent(this.dataNode.baseInfo.token,"Data")
                                this.nodeLoading=false
                            }
                        }
                    },
                    error:res=>{
                        this.nodeLoading=false
                    }
                })
            },

            async getNodeAllContents(){
                this.loading=true
                let datas = await this.getNodeContentSync(this.dataNode.baseInfo.token,"Data")
                let processings = await this.getNodeContentSync(this.dataNode.baseInfo.token,"Processing")
                let visualizations = await this.getNodeContentSync(this.dataNode.baseInfo.token,"Visualization")
                this.loading=false
            },

            async getNodeContentSync(token,type){
                let data
                $.ajax({
                    type: "GET",
                    url: "/dataServer/getNodeContentCheck",
                    data:{
                        token:token,
                        type:type,
                    },
                    async:false,
                    success: (res) => {
                        if (res.code == -1) {
                            this.$alert("Please login first!")
                            window.location.href="/user/login";
                        } else {
                            if(res.data == undefined){

                            }else{
                                data = res.data
                                this.dataNode[type.toLowerCase()] = data
                            }
                        }
                    },
                })

                return data
            },

            getNodeContent(token,type){
                let data
                this.nodeLoading=true
                $.ajax({
                    type: "GET",
                    url: "/dataServer/getNodeContentCheck",
                    data:{
                        token:token,
                        type:type,
                    },
                    async:false,
                    success: (res) => {
                        if (res.code == -1) {
                            this.$alert("Please login first!")
                            window.location.href="/user/login";
                        } else {
                            if(res.data == undefined){

                            }else{
                                data = res.data
                                this.dataNode[type.toLowerCase()] = data
                                setTimeout(()=>{
                                    this.nodeLoading = false
                                },150)
                            }
                        }
                    },
                    error:res=>{
                        this.nodeLoading = false
                    }
                })

            },

            handleClick(tab, event) {
                let type = tab.label
                this.getNodeContent(this.dataNode.baseInfo.token,type)
            },

            download(data){
                axios.get("/dataServer/getNodeDataUrl",{params:{
                        id:data.id,
                        token:data.token
                    },
                }).then(
                    res=>{
                        data = res.data
                        if (data.code == -1) {
                            this.$alert("Please login first!")
                            window.location.href="/user/login";
                        } else {

                        }

                    }
                )
            },

            handlePageChange(page,index){
                this.pageOption.currentPage = page

                if(index==1){
                    this.listDataItem()
                }else if(index==2){
                    this.listDataMethod()
                }
            },

            searchDataItem(){
                this.listDataItem()
            },

            searchDataMethod(){
                this.listDataMethod()
            },

            listDataItem(){
                this.loading = true
                $.ajax({
                    type: "GET",
                    url: "/dataServer/pageDataItemChecked",
                    data:{
                        page:this.pageOption.currentPage-1,
                        pageSize:this.pageOption.pageSize,
                        asc:1,
                        sortEle:"lastModifyTime",
                        searchText: this.pageOption.searchText
                    },
                    async:false,
                    success: (res) => {
                        if (res.code == -1) {
                            this.$alert("Please login first!")
                            window.location.href="/user/login";
                        } else {
                            if(res.data == undefined){

                            }else{
                                let data = res.data
                                this.dataItems = data.content
                                this.pageOption.total = data.total
                                setTimeout(()=>{
                                    this.loading = false
                                },125)
                            }
                        }
                    },
                    error:res=>{
                        this.loading = false
                    }
                })
            },

            listDataMethod(){
                this.loading = true
                $.ajax({
                    type: "GET",
                    url: "/dataServer/pageDataAppicationChecked",
                    data:{
                        page:this.pageOption.currentPage-1,
                        pageSize:this.pageOption.pageSize,
                        asc:1,
                        sortEle:"lastModifyTime",
                        type:this.activeName,
                        searchText: this.pageOption.searchText
                    },
                    async:false,
                    success: (res) => {
                        if (res.code == -1) {
                            this.$alert("Please login first!")
                            window.location.href="/user/login";
                        } else {
                            if(res.data == undefined){

                            }else{
                                let data = res.data
                                this.dataMethods = data.content
                                this.pageOption.total = data.total
                                setTimeout(()=>{
                                    this.loading = false
                                },125)
                            }
                        }
                    },
                    error:res=>{
                        this.loading = false
                    }
                })
            },

            bindDataItemList(data){
                this.dataItemBindDialog = true
                this.configNodeData = data
                this.pageOption.currentPage = 1
                this.pageOption.searchText = ''
                this.listDataItem()
            },

            bindDataMethodList(method){
                this.dataMethodBindDialog = true
                this.configNodeData = method
                this.pageOption.currentPage = 1
                this.pageOption.searchText = ''
                this.listDataMethod()
            },

            bindDataItem(item){
                // dataSets.push(this.configNodeData.dataSet)
                let data={
                    serverId:this.configNodeData.id,
                    name:this.configNodeData.name,
                    token:this.configNodeData.token,
                    type:'Data',
                    item:item.oid
                }
                axios.post("/dataServer/bindDataItem",
                    data
                ).then(
                    res=>{
                        let data = res.data
                        if(data.code==-1){
                            this.$alert("Please login first!")
                            window.location.href="/user/login";
                        }else if(data.code==0) {
                            if (data.data != null) {
                                Vue.set(this.configNodeData,'bindItems',data.data.bindItems)
                                this.$message({message: 'Succeeded to bind to item', type: 'success'})
                            } else {
                                this.$message({message: 'Failed to bind to item', type: 'error'})
                            }
                        }
                    })

            },

            bindDataMethod(item){
                // let dataSets = []
                // dataSets.push(this.configNodeData.dataSet)
                let data={
                    serverId:this.configNodeData.id,
                    name:this.configNodeData.name,
                    token:this.configNodeData.token,
                    type:this.activeName,
                    dataSet:this.configNodeData.dataSet,
                    item:item.oid,
                }
                axios.post("/dataServer/bindDataMethod",
                    data
                ).then(
                    res=>{
                        let data = res.data
                        if(data.code==-1){
                            this.$alert("Please login first!")
                            window.location.href="/user/login";
                        }else if(data.code==0){
                            if(data.data!=null){
                                this.configNodeData.bindItems=data.data.bindItems
                                this.$message({message: 'Succeeded to bind to item',type: 'success'})
                            }else {
                                this.$message({message: 'Failed to bind to item',type: 'error'})
                            }

                        }
                    })
            },

            isBinded(item){
                if(this.configNodeData.bindItems!=null&& this.configNodeData.bindItems.indexOf(item.oid)!=-1){
                    return true
                }else {
                    return false
                }
            },

            unbindItemClick (item){
                this.unbindConfirmDialog = true

            },

            unbindDataItem(item){
                let data={
                    serverId:this.configNodeData.id,
                    name:this.configNodeData.name,
                    token:this.configNodeData.token,
                    type:this.activeName,
                    item:item.oid
                }
                axios.post("/dataServer/unbindDataItem",
                    data
                ).then(
                    res=>{
                        let data = res.data
                        if(data.code==-1){
                            this.$alert("Please login first!")
                            window.location.href="/user/login";
                        }else if(data.code==0){
                            if(data.data!=null){
                                this.configNodeData.bindItems=data.data.bindItems
                                this.$message({message: 'Succeeded to unbind from item',type: 'success'})
                            }else {
                                this.$message({message: 'Failed to unbind from item',type: 'error'})
                            }

                        }
                    })

            },

            unbindDataMethod(item){
                let data={
                    serverId:this.configNodeData.id,
                    name:this.configNodeData.name,
                    token:this.configNodeData.token,
                    type:this.activeName,
                    item:item.oid
                }
                axios.post("/dataServer/unbindDataMethod",
                    data
                ).then(
                    res=>{
                        let data = res.data
                        if(data.code==-1){
                            this.$alert("Please login first!")
                            window.location.href="/user/login";
                        }else if(data.code==0){
                            if(data.data!=null){
                                this.configNodeData.bindItems=data.data.bindItems
                                this.$message({message: 'Succeeded to unbind from item',type: 'success'})
                            }else {
                                this.$message({message: 'Failed to unbind from item',type: 'error'})
                            }

                        }
                    })

            },

            changeServerView(index){
                this.serverView = index
            },

            sendcurIndexToParent(){
                this.$emit('com-sendcurindex',this.curIndex)
            },

            sendUserToParent(userId){
                this.$emit('com-senduserinfo',userId)
            },
        },

        created() {


        },

        mounted() {

            $(() => {

                let height = document.documentElement.clientHeight;
                this.ScreenMinHeight = (height) + "px";
                this.ScreenMaxHeight = (height) + "px";

                window.onresize = () => {
                    console.log('come on ..');
                    height = document.documentElement.clientHeight;
                    this.ScreenMinHeight = (height) + "px";
                    this.ScreenMaxHeight = (height) + "px";
                };


                $.ajax({
                    type: "GET",
                    url: "/user/load",
                    data: {},
                    cache: false,
                    async: false,
                    xhrFields: {
                        withCredentials: true
                    },
                    crossDomain: true,
                    success: (data) => {

                        console.log(data);

                        if (data.oid == "") {
                            this.$alert("Please login");
                            window.location.href = "/user/login";
                        } else {
                            this.userId = data.oid;
                            this.userName = data.name;
                            console.log(this.userId)
                            this.sendUserToParent(this.userId)
                            // this.addAllData()

                            // axios.get("/dataItem/amountofuserdata",{
                            //     params:{
                            //         userOid:this.userId
                            //     }
                            // }).then(res=>{
                            //     that.dcount=res.data
                            // });

                            $("#author").val(this.userName);

                            // if (index != null && index != undefined && index != "" && index != NaN) {
                            //     this.defaultActive = index;
                            //     this.handleSelect(index, null);
                            //     window.sessionStorage.removeItem("index");
                            //     this.curIndex=index
                            //
                            //
                            // } else {
                            //     // this.changeRter(1);
                            // }

                            window.sessionStorage.removeItem("tap");
                            //this.getTasksInfo();
                            this.load = false;
                        }
                    }
                })


                this.getDataServer();

                //this.getModels();
            });


            //初始化的时候吧curIndex传给父组件，来控制bar的高亮显示
            this.sendcurIndexToParent()
        },

    }
)