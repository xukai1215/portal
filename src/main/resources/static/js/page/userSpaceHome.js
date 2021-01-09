var userSpaceHome = Vue.extend(
    {
        template:'#userSpaceHome',
        data(){
            return{
                //页面样式控制
                loading: 'false',
                load: true,
                ScreenMinHeight: "0px",
                ScreenMaxHeight: "0px",

                //显示控制
                curIndex:1,

                //
                userInfo:{

                },

                tableData: [{
                    date: '2016-05-02',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                }, {
                    date: '2016-05-04',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1517 弄'
                }, {
                    date: '2016-05-01',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1519 弄'
                }, {
                    date: '2016-05-03',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1516 弄'
                }]


            }
        },

        methods:{
            //公共功能
            setSession(name, value) {
                window.sessionStorage.setItem(name, value);
                // this.editOid = sessionStorage.getItem('editItemOid');
            },

            creatItem(index){
                window.sessionStorage.removeItem('editOid');
                if(index == 1) window.location.href='../user/userSpace/model/createModelItem'
            },

            manageItem(index){
                this.curIndex = index;
                var urls={
                    1:'/user/userSpace#/model',
                    2:'/user/userSpace#/data',
                    3:'/user/userSpace#/task',
                    4:'/user/userSpace#/community',
                }

                this.setSession('curIndex',index)
                window.location.href=urls[index]

            },

            openModelTable(){

                $('#modelTable').modal('show')
            },

            getComputableModel(){

            },

            invoke(){
                const href=window.location.href;

                const hrefs=href.split("/");
                console.log(hrefs);
                window.open("/task/"+hrefs[hrefs.length-1]);
            },

            intergrateModel(){
                window.open('/computableModel/integratedModel')
            },

            openTheme(){
                window.location.href='/user/userSpace#/userTheme'
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
                    ()=>{

                        console.log('come on ..');
                        height = document.documentElement.clientHeight;
                        this.ScreenMinHeight = (height) + "px";
                        this.ScreenMaxHeight = (height) + "px";
                    }
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
                        // console.log(data);

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

            //初始化的时候吧curIndex传给父组件，来控制bar的高亮显示
            // this.sendcurIndexToParent()
        },

    }
)