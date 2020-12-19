var userDataServer = Vue.extend(
    {
        template:'#userDataServer',
        data(){
            return{
                //页面样式控制
                loading: 'false',
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

                activeName:'first',

                dataNode:{
                    baseInfo:{},
                    data:[],
                    processing: [],
                    visualization: [],
                    status:0,
                },

                loading:false,
                nodeLoading:false,

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
                            alert("Please login first!")
                            window.location.href="/user/login";
                        } else {
                            if(res.data == undefined){
                                this.dataNode.status = 0
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
                        this.loading = false
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
                    url: "/dataServer/getNodeContent",
                    data:{
                       token:token,
                       type:type,
                    },
                    async:false,
                    success: (res) => {
                        if (res.code == -1) {
                            alert("Please login first!")
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
                this.loading=true
                $.ajax({
                    type: "GET",
                    url: "/dataServer/getNodeContent",
                    data:{
                        token:token,
                        type:type,
                    },
                    async:false,
                    success: (res) => {
                        if (res.code == -1) {
                            alert("Please login first!")
                            window.location.href="/user/login";
                        } else {
                            if(res.data == undefined){

                            }else{
                                data = res.data
                                this.dataNode[type.toLowerCase()] = data
                                setTimeout(()=>{
                                    this.loading = false
                                },150)
                            }
                        }
                    },
                    error:res=>{
                        this.loading = false
                    }
                })

            },

            handleClick(tab, event) {
                let type = tab.label
                this.getNodeContent(this.dataNode.baseInfo.token,type)
            },

            download(data){
                axios.get("getNodeDataUrl",{
                    id:data.id,
                    token:data.token
                }).then(
                    res=>{
                        data = res.data
                        if (data.code == -1) {
                            alert("Please login first!")
                            window.location.href="/user/login";
                        } else {

                        }

                    }
                )
            },

            bindDataItem(data){

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
                            alert("Please login");
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