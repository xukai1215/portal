ELEMENT.locale(ELEMENT.lang.en)

//此页面为根文件，控制路由切换
//侧边栏选中高亮由路由关键字判断，在sidebar中
var router = new VueRouter({
        routes:[
            // {
            //     path:'/',
            //     redirect:'/home',
            // },
            {
                path:'/',
                component:userSpaceHome,
            },
            //
            {
                path:'/model',
                component:userModel,
            },
            {
                path:'/model/createModelItem',
                component:createModelItem,

            },
            {
                path:'/model/manageModelItem/:editId',
                component:createModelItem,
            },
            {
                path:'/model/createConceptualModel',
                component:createConceptualModel,
            },
            {
                path:'/model/manageConceptualModel/:editId',
                component:createConceptualModel,
            },
            {
                path:'/model/createLogicalModel',
                component:createLogicalModel,
            },
            {
                path:'/model/manageLogicalModel/:editId',
                component:createLogicalModel,
            },
            {
                path:'/model/createComputableModel',
                component:createComputableModel,
            },
            {
                path:'/model/manageComputableModel/:editId',
                component:createComputableModel,
            },
            {
                path:'/models',
                name:'userModels',
                component:userModels,
                children:[
                    {
                        path:'/',
                        redirect:'modelitem',
                    },
                    {
                        path:':modelitemKind',
                        component:modelItem,
                    },

                ]
            },
            {
                path:'/data',
                component:userData,
            },
            {
                path:'/data/createDataItem',
                component:createDataItem,
            },
            {
                path:'/data/manageDataItem/:editId',
                component:createDataItem,
            },
            {
                path:'/data/dataitem',
                component:userDataItems,
            },
            {
                path:'/data/myDataSpace',
                component:userDataSpace,
            },
            {
                path:'/server',
                component:userServer,
            },
            {
                path:'/task',
                component:userTask,
            },
            {
                path:'/community',
                component:userCommunity,
            },
            {
                path:'/community/createConcept',
                component:createConcept,
            },
            {
                path:'/community/manageConcept/:editId',
                component:createConcept,
            },
            {
                path:'/community/createSpatialReference',
                component:createSpatialReference,
            },
            {
                path:'/community/manageSpatialReference/:editId',
                component:createSpatialReference,
            },
            {
                path:'/community/createTemplate',
                component:createTemplate,
            },
            {
                path:'/community/manageTemplate/:editId',
                component:createTemplate,
            },
            {
                path:'/community/createUnit',
                component:createUnit,
            },
            {
                path:'/community/manageUnit/:editId',
                component:createUnit,
            },
            {
                path:'/communities',
                name:'userCommunities',
                component:userCommunities,
                children:[
                    {
                        path:'/',
                        redirect:'concept&semantic',
                    },
                    {
                        path:':communityKind',
                        component:communityItem,
                    },
                ]
            },
            {
                path:'/userTheme',
                component:userTheme,
            },
            {
                path:'/userTheme/createTheme',
                component:createTheme,
            },
            {
                path:'/account',
                component:userAccount,
            },
            {
                path:'/notice',
                component:notice,
            },
            {
                path:'/feedback',
                component:feedback,
            },
            //
            // {
            //     path:'/logicalmodel',
            //     component:modelItem,
            // },


        ]
    });
window.userSpaceVue = new Vue(
    {
        el: "#app",
        data(){
            return{
                fullscreenLoading:false,
                message_num:0,
                tableData: [{
                    info:[],
                    model:[],
                    data:[],
                    application:[]
                }],

                useroid:"",
                //页面样式控制
                loading: 'false',
                load: true,
                ScreenMinHeight: "0px",
                ScreenMaxHeight: "0px",

                //显示控制
                curIndex:1,
                itemIndex:1,//父组件的控制变量

                //
                userInfo:{

                },

                //websocket
                websktPath:"ws://localhost:8080/websocket",
                userspaceSocket:"",

            }
        },

        router:router,
        watch:{
            $route(to,from){
                window.userSpaceVue.fullscreenLoading=false;
            }
        },
        methods:{
            // websocket
            initWebSkt:function () {

                if ('WebSocket' in window) {
                    // this.userspaceSocket = new WebSocket("ws://localhost:8080/websocket");
                    this.userspaceSocket = new WebSocket(this.websktPath)
                    // 监听socket连接
                    this.userspaceSocket.onopen = this.open
                    // 监听socket错误信息
                    this.userspaceSocket.onerror = this.error
                    // 监听socket消息
                    this.userspaceSocket.onmessage = this.getMessage

                }
                else {
                    // alert('当前浏览器 Not support websocket');
                    console.log("websocket 无法连接");
                }
            },

            open: function () {
                console.log("父组件socket连接成功")
            },
            error: function () {
                console.log("连接错误");
            },
            getMessage: function (msg) {
                if(msg.data === 'user change')
                    this.getUserInfo();
            },
            //

            //公共功能
            setSession(name, value) {
                window.sessionStorage.setItem(name, value);
                // this.editOid = sessionStorage.getItem('editItemOid');
            },

            // creatItem(index){
            //     window.sessionStorage.removeItem('editOid');
            //     if(index == 1) window.location.href='../user/userSpace/model/createModelItem'
            // },

            // 修改index值，改变显示
            changecurIndex(index){
                if(index != null&&index != undefined){
                    this.curIndex = index
                }
            },

            changeitemIndex(index){
                if(index != null&&index != undefined){
                    this.itemIndex = index
                }
            },

            getUserInfo() {
                axios.get('/user/getLoginUser').then(
                    res => {
                        if(res.data.code==0){
                            this.userInfo = res.data.data
                            let orgs = this.userInfo.organizations;

                            if (orgs.length != 0) {
                                this.userInfo.orgStr = orgs[0];
                                for (i = 1; i < orgs.length; i++) {
                                    this.userInfo.orgStr += ", " + orgs[i];
                                }
                            }

                            let sas = this.userInfo.subjectAreas;
                            if (sas != null && sas.length != 0) {
                                this.userInfo.saStr = sas[0];
                                for (i = 1; i < sas.length; i++) {
                                    this.userInfo.saStr += ", " + sas[i];
                                }
                            }


                            this.load = false;
                        }

                    }
                )
            },

            updateUserInfo(userId){
                if(this.userInfo.oid!=userId)
                    this.getUserInfo();

            },

        },

        destroyed () {
            // 销毁监听
            this.userspaceSocket.onclose = this.close
        },

        created() {
        },

        mounted() {
            let that= this;
            that.initWebSkt();//初始化websocket

            //用于消息判断
            $(document).on('click','.share-button',function ($event) {
                $.ajax({
                    url: "/theme/getoid",
                    async: false,
                    success:(data)=>{
                        that.useroid = data;
                    }
                })
                window.location.href = "/theme/getmessagepage/" + that.useroid;
            })

            $(() => {
                // let height = document.documentElement.clientHeight;
                // this.ScreenMinHeight = (height) + "px";
                // this.ScreenMaxHeight = (height) + "px";
                //
                // window.onresize = () => {
                //     console.log('come on ..');
                //     height = document.documentElement.clientHeight;
                //     this.ScreenMinHeight = (height) + "px";
                //     this.ScreenMaxHeight = (height) + "px";
                // };


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
                        data = JSON.parse(data);

                        // console.log(data);

                        if (data.oid == "") {
                            alert("Please login");
                            window.location.href = "/user/login";
                        } else {
                            this.userId = data.oid;
                            this.userName = data.name;
                            console.log(this.userId)
                            // this.addAllData()

                            // axios.get("/dataItem/amountofuserdata",{
                            //     params:{
                            //         userOid:this.userId
                            //     }
                            // }).then(res=>{
                            //     that.dcount=res.data
                            // });

                            $("#author").val(this.userName);

                            var index = window.sessionStorage.getItem("index");
                            if (index != null && index != undefined && index != "" && index != NaN) {
                                this.defaultActive = index;
                                this.handleSelect(index, null);
                                window.sessionStorage.removeItem("index");
                                this.curIndex=index

                            } else {
                                // this.changeRter(1);
                            }

                            window.sessionStorage.removeItem("tap");
                            //this.getTasksInfo();
                            this.load = false;
                        }
                    }
                })


                //this.getModels();

                // window.loading = this.$loading({
                //     lock: true,
                //     text: "Uploading...",
                //     spinner: "el-icon-loading",
                //     target:document.getElementById('pageContent'),
                //     background: "rgba(0, 0, 0, 0.7)"
                // });
                // window.loading.close();
            });
        },

    }
);

