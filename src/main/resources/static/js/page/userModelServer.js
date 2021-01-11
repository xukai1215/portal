var userModelServer = Vue.extend(
    {
        template:'#userModelServer',
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

                modelContainerList:[],
                registerModelContainerVisible:false, //addserver控制
                registerModelContainerActive:0,

                serverView:1,

                nodeContent: [],
                nodeLoading:false,

                pageOption: {
                    paginationShow:false,
                    progressBar: true,
                    sortAsc: false,
                    currentPage: 1,
                    pageSize: 10,
                    searchText: '',
                    total: 11,
                },

                configMac:'',

                nodeEditDialog:false,

                nodeAlias:'',
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

            refreshUserNodes(){
                this.nodeLoading = true
                axios.get('/server/modelContainer/getModelContainerByUserName'
                ).then(res=>{
                    this.nodeLoading = false
                    let data = res.data
                    if(data.code==-1){
                        window.location.href="/user/login";
                    }else{
                        this.modelContainerList = data.data
                        for(let container of this.modelContainerList){
                            if(container.updateDate==undefined||container.updateDate==''){
                                container.updateDate = container.registerDate
                            }
                        }
                    }
                })
            },

            deleteNodeClick(node){
                 this.$confirm('Are you sure to <b>delete</b> this model container?', 'Tip', {
                                         type:"warning",
                                         cancelButtonText: 'Cancel',
                                         confirmButtonText: 'Confirm',
                                         dangerouslyUseHTMLString: true,
                                     }
                                 ).then(() => {
                                     this.deleteNode(node);
                                 } ).catch(()=>{
                                     return
                                 });
            },

            deleteNode(node){
                let param={
                    account:node.account,
                    mac:node.mac
                }
                $.ajax({
                        type: "POST",
                        url:'/server/modelContainer/remove',
                        data: param,
                        cache: false,
                        async: false,

                        success:res=>{
                            let data = res.data
                            this.nodeContent = data.list
                            this.pageOption.total = data.total
                            this.refreshUserNodes()
                        }
                    }

                )
            },



            editNode(container){
                this.configContainer = container
                this.nodeEditDialog = true
                if(container.alias!=undefined&&container.alias!=''){
                    this.nodeAlias = container.alias
                }else{
                    this.nodeAlias = ''
                }
            },

            updateNodeAlias(){
                if(this.nodeAlias.trim()==''){
                     this.$alert('Please input at least one letter', 'Tip', {
                              type:"warning",
                              confirmButtonText: 'OK',
                              callback: ()=>{
                                  return
                              }
                          }
                      );

                     return
                }

                let param={
                    alias:this.nodeAlias,
                    mac:this.configContainer.mac
                }
                $.ajax({
                        type: "POST",
                        url:'/server/modelContainer/setAlias',
                        data: param,
                        cache: false,
                        async: false,

                        success:res=>{
                            let data = res.data
                            this.configContainer.alias = data
                            this.nodeEditDialog = false
                        }
                    }

                )
            },

            changeServerView(index,mac){
                this.serverView = index
                if(index==1){

                }else if(index==2){
                    // this.getNodeContent(mac)
                    this.configMac = mac
                    this.pageOption.currentPage = 1
                    this.getNodeContentByPage(mac)
                }
            },

            getNodeContent(mac){
                let param={
                    mac:mac
                }
                $.ajax({
                        type: "POST",
                        url:'/server/modelContainer/getServiceList',
                        data: param,
                        cache: false,
                        async: false,

                        success:res=>{
                            let data = res.data
                            this.nodeContent = data
                        }
                    }

                )
            },

            handlePageChange(val){
                this.pageOption.currentPage = val
                this.getNodeContentByPage(this.configMac)
            },

            getNodeContentByPage(mac){
                let param={
                    mac:mac,
                    page:this.pageOption.currentPage,
                    pageSize:this.pageOption.pageSize
                }
                $.ajax({
                        type: "POST",
                        url:'/server/modelContainer/getServiceListByPage',
                        data: param,
                        cache: false,
                        async: false,

                        success:res=>{
                            let data = res.data
                            this.nodeContent = data.list
                            this.pageOption.total = data.total
                        }
                    }

                )
            },


            // editItem(index,oid){
            //     var urls={
            //         1:'/user/userSpace/model/manageModelItem',
            //     }
            //     this.setSession('editOid', oid)
            //     window.location.href=urls[this.itemIndex]
            // },
            //
            // deleteItem(id) {
            //     //todo 删除category中的 id
            //     var cfm = confirm("Are you sure to delete?");
            //
            //     if (cfm == true) {
            //         axios.get("/dataItem/del/", {
            //             params: {
            //                 id: id
            //             }
            //         }).then(res => {
            //             if (res.status == 200) {
            //                 alert("delete success!");
            //                 this.getDataItems();
            //             }
            //         })
            //     }
            // },

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


                this.refreshUserNodes()
                //this.getModels();
            });


            //初始化的时候吧curIndex传给父组件，来控制bar的高亮显示
            this.sendcurIndexToParent()
        },

    }
)