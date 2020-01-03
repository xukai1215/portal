ELEMENT.locale(ELEMENT.lang.en)

//此页面为根文件，控制路由切换
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
                    // {
                    //     path:'concept&semantic',
                    //     component:communityItem,
                    // },
                    //
                    // {
                    //     path:'spatialreference',
                    //     component:communityItem,
                    // },
                    //
                    // {
                    //     path:'dataTemplate',
                    //     component:communityItem,
                    // },
                    //
                    // {
                    //     path:'unit&metric',
                    //     component:communityItem,
                    // }
                ]
            },
            {
                path:'/data/dataitem',
                component:userDataItems,
            },
            {
                path:'/userTheme',
                component:userTheme,
            },
            {
                path:'/account',
                component:userAccount,
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
    }

)
var vue = new Vue(
    {
        el: "#app",
        data(){
            return{
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


            }
        },

        router:router,

        methods:{
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
            }

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
                        data = JSON.parse(data);

                        console.log(data);

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
            });
        },

    }
)