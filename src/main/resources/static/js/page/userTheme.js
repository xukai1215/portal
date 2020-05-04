var userTheme = Vue.extend(
    {
        template:'#userTheme',
        data(){
            return{
                //页面样式控制
                loading: 'false',
                load: true,
                ScreenMinHeight: "0px",
                ScreenMaxHeight: "0px",

                //显示控制
                curIndex:7,

                itemIndex:1,
                //
                userInfo:{

                },

                await:false,

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

            // manageItem(index){
            //     //此处跳转至统一页面，vue路由管理显示
            //     this.itemIndex=index;
            //     this.searchText = ''
            //     var urls={
            //         1:'/user/userSpace#/userTheme',
            //     };
            //     window.location.href=urls[index]
            //     this.getModels();
            // },
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

            getPageList() {
                this.pageList = [];

                if (this.totalPage < 5) {
                    for (let i = 0; i < this.totalPage; i++) {
                        this.pageList.push(i + 1);
                    }
                } else if (this.totalPage - this.curPage < 5) {//如果总的页码数减去当前页码数小于5（到达最后5页），那么直接计算出来显示

                    this.pageList = [
                        this.totalPage - 4,
                        this.totalPage - 3,
                        this.totalPage - 2,
                        this.totalPage - 1,
                        this.totalPage,
                    ];
                } else {
                    let cur = Math.floor((this.curPage - 1) / 5) * 5 + 1;
                    if (this.curPage % 5 === 0) {
                        cur = cur + 1;

                    }
                    this.pageList = [
                        cur,
                        cur + 1,
                        cur + 2,
                        cur + 3,
                        cur + 4,
                    ]
                }
            },

            changePage(pageNo) {
                if ((this.curPage === 1) && (pageNo === 1)) {
                    return;
                }
                if ((this.curPage === this.totalPage) && (pageNo === this.totalPage)) {
                    return;
                }
                if ((pageNo > 0) && (pageNo <= this.totalPage)) {
                    if (this.curIndex != 1)
                        this.pageControlIndex = this.curIndex;
                    else this.pageControlIndex = 'research';

                    this.resourceLoad = true;
                    this.searchResult = [];
                    //not result scroll
                    //window.scrollTo(0, 0);
                    this.curPage = pageNo;
                    this.getPageList();
                    this.page = pageNo;

                    switch (this.pageControlIndex) {
                        // this.computerModelsDeploy = [];
                        // this.resourceLoad = true;
                        // this.curPage = pageNo;
                        // this.getPageList();
                        // this.page = pageNo;
                        // this.getDataItems();
                        case 2:

                            if (this.isInSearch == 0)
                                this.getModels();
                            else this.searchModels();
                            break;
                        //
                        case 3:

                            if (this.isInSearch == 0)
                                this.getDataItems();
                            else this.searchDataItem();
                            break;

                        case 4:

                            if (this.isInSearch == 0)
                                this.getConcepts();
                            else this.searchConcepts();
                            break;
                        case 5:

                            if (this.isInSearch == 0)
                                this.getSpatials();
                            else this.searchSpatials()
                            break;
                        case 6:

                            if (this.isInSearch == 0)
                                this.getTemplates();
                            else this.searchTemplates();
                            break;
                        case 7:

                            if (this.isInSearch == 0)
                                this.getUnits();
                            else this.searchUnits();
                            break;

                        case 7:
                            if (this.isInSearch == 0)
                                this.getTheme();
                            else {}
                            break;

                        case 9:

                            if (this.isInSearch == 0){
                                if(this.taskStatus!=10)
                                    this.showTasksByStatus(this.taskStatus)
                                else
                                    this.getModels();
                            }

                            else this.searchModels();
                            break;



                    }
                    // if(this.researchIndex==1||this.researchIndex==2||this.researchIndex==3){
                    //     this.resourceLoad = true;
                    //     this.searchResult = [];
                    //     //not result scroll
                    //     //window.scrollTo(0, 0);
                    //     this.curPage = pageNo;
                    //     this.getPageList();
                    //     this.pageSize=4;
                    //     this.page = pageNo;
                    //     this.getResearchItems();
                    // }
                    //this.changeCurPage.emit(this.curPage);
                }
            },

            creatItem(index){
                // window.sessionStorage.removeItem('editOid');
                if(index == 1) window.location.href='/user/userSpace#/userTheme/createTheme'
            },

            reloadPage(){//重新装订分页诸元
                this.pageSize = 10;
                this.isInSearch = 0;
                this.page = 1;
            },

            deleteItem(oid) {
                if (confirm("Are you sure to delete this model?")) {
                    $.ajax({
                        type: "POST",
                        url: "/theme/delete",
                        data: {
                            oid: oid
                        },
                        cache: false,
                        async: true,
                        dataType: "json",
                        xhrFields: {
                            withCredentials: true
                        },
                        crossDomain: true,
                        success: (json) => {
                            if (json.code == -1) {
                                alert("Please log in first!")
                            } else {
                                if (json.data == 1) {
                                    alert("delete successfully!")
                                    this.getTheme();
                                } else {
                                    alert("delete failed!")
                                }
                            }
                        }
                    })
                }
            },

            getTheme() {
                this.pageSize = 10;
                this.isInSearch = 0;
                var url = "/repository/getThemesByUserId";
                var name = "themes";
                this.await = true
                $.ajax({
                    type: "Get",
                    url: url,
                    data: {
                        page: this.page - 1,
                        sortType: this.sortType,
                        asc: -1
                    },
                    cache: false,
                    async: true,

                    xhrFields: {
                        withCredentials: true
                    },
                    crossDomain: true,
                    success: (json) => {
                        if (json.code != 0) {
                            alert("Please login first!");
                            window.location.href = "/user/login";
                        } else {
                            data = json.data;
                            this.resourceLoad = false;
                            this.totalNum = data.count;
                            this.searchCount = Number.parseInt(data["count"]);
                            this.$set(this,"searchResult",data[name]);
                            if (this.page == 1) {
                                this.pageInit();
                            }
                            this.await = false
                        }
                    }
                })
            },

            searchItems() {
                this.resourceLoad = true;
                this.pageSize = 10;
                this.isInSearch = 1;
                // let a=this.$route.params.modelitemKind
                this.await = true;
                let url = '/theme/searchThemeByUserId';
                let name = 'theme';

                if (this.deploys_show) {
                    this.searchComputerModelsForDeploy();
                } else {
                    $.ajax({
                        type: "Get",
                        url: url,
                        data: {
                            searchText: this.searchText,
                            page: this.page - 1,
                            pagesize: this.pageSize,
                            sortType: this.sortType,
                            asc: this.sortAsc
                        },
                        cache: false,
                        async: true,
                        dataType: "json",
                        xhrFields: {
                            withCredentials: true
                        },
                        crossDomain: true,
                        success: (json) => {
                            if (json.code != 0) {
                                alert("Please login first!");
                                window.location.href = "/user/login";
                            } else {
                                data = json.data;
                                this.resourceLoad = false;
                                this.totalNum = data.count;
                                this.searchCount = Number.parseInt(data["count"]);
                                this.$set(this,"searchResult",data[name]);
                                console.log(this.searchResult);
                                if (this.page == 1) {
                                    this.pageInit();
                                }
                                this.await = false
                            }
                        }
                    })
                }
            },
            editItem(index,oid){
                var urls={
                    1:'/repository/theme/'+oid,
                }
                window.location.href=urls[index]
            },

            //

            sendcurIndexToParent(){
                this.$emit('com-sendcurindex',this.curIndex)
            },

            sendUserToParent(userId){
                this.$emit('com-senduserinfo',userId)
            }

        },

        created() {
            console.log("init");

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
                            //判断显示哪一个item
                            var itemIndex = window.sessionStorage.getItem("itemIndex");
                            this.itemIndex=itemIndex
                            // this.getModels(this.itemIndex);

                            this.getTheme();

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
            this.sendcurIndexToParent()



        },

    }
)