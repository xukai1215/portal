var userServer = Vue.extend(
    {
        template: '#userServer',
        props: {
            a: {
                type: String,
                default: 'default'
            },
        },
        data() {
            return {
                //页面样式控制
                loading: 'false',
                load: true,
                ScreenMinHeight: "0px",
                ScreenMaxHeight: "0px",
                //

                userInfo:{

                },

                countInfo:{

                },
            }
        },
        computed: {},
        methods: {
            //公共功能

            setSession(name, value) {
                window.sessionStorage.setItem(name, value);
                // this.editOid = sessionStorage.getItem('editItemOid');
            },

            manageItem(index){
                //此处跳转至统一页面，vue路由管理显示
                var urls={
                    1:'/user/userSpace#/server/modelserver',
                    2:'/user/userSpace#/server/dataserver',
                }

                this.senditemIndexToParent(index)
                window.location.href=urls[index]

            },

            sendcurIndexToParent(){
                this.$emit('com-sendcurindex',this.curIndex)
            },

            senditemIndexToParent(index){
                this.$emit('com-senditemindex',index)
            },

            sendUserToParent(userId){
                this.$emit('com-senduserinfo',userId)
            },
        },
        created() {},
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
                            this.countInfo=data.countInfo
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
        }
    }
)