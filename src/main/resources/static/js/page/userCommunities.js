ELEMENT.locale(ELEMENT.lang.en)
//组件
var modelItem = Vue.extend({
    template: '#modelItemShow',
    props: ['searchResultRaw'],
    created(){
        console.log(this.searchResultRaw);
    },
    watch:{
        searchResultRaw:{
            handler(val) {
                this.searchResultRaw = val;
            },
            deep:true,
            immediate:true
        }
    },
    data() {
        return {
            itemIndex:1,
        }

    },

    methods:{
        formatDateChild(val){
            let res
            this.$emit('com-format',val,a => { res = a })
            return res

        },

        setSession(name, value) {
            window.sessionStorage.setItem(name, value);
            // this.editOid = sessionStorage.getItem('editItemOid');
        },

        comEditItem(index,oid){
            this.$emit('com-edit',index,oid)
        },

        comDeleteItem(index,oid){
            this.$emit('com-delete',index,oid)
        },
    },

    created(){
        // this.$parent.reloadPage()
        // this.$parent.getCommunity(1);
    }

})
// Vue.component('myComponent',modelItem)

//路由
var router = new VueRouter({
        routes:[
            {
                path:'/',
                redirect:'/concept&semantic',
            },
            {
                path:'/concept&semantic',
                component:modelItem,
            },

            {
                path:'/spatialReference',
                component:modelItem,
            },

            {
                path:'/dataTemplate',
                component:modelItem,
            },

            {
                path:'/unit&metric',
                component:modelItem,
            }
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
                curIndex:6,

                itemIndex:1,
                //
                userInfo:{

                },

                //分页控制
                page: 1,
                sortAsc: -1,//1 -1
                sortType: "default",
                pageSize: 10,// 每页数据条数
                totalPage: 0,// 总页数
                curPage: 1,// 当前页码
                pageList: [],
                totalNum: 0,

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

            changeRter(index){
                this.curIndex = index;
                var urls={
                    1:'/user/userSpace',
                    2:'/user/userSpace/model',
                    3:'/user/userSpace/data',
                    4:'/user/userSpace/server',
                    5:'/user/userSpace/task',
                    6:'/user/userSpace/community',
                    7:'/user/userSpace/theme',
                    8:'/user/userSpace/account',
                    9:'/user/userSpace/feedback',
                }

                this.setSession('curIndex',index)
                window.location.href=urls[index]

            },

            setSession(name, value) {
                window.sessionStorage.setItem(name, value);
                // this.editOid = sessionStorage.getItem('editItemOid');
            },

            manageItem(index){
                //此处跳转至统一页面，vue路由管理显示
                this.itemIndex=index;
                this.searchText = ''
                var urls={
                    1:'/user/userSpace/community/#/concept&semantic',
                    2:'/user/userSpace/community/#/spatialReference',
                    3:'/user/userSpace/community/#/dataTemplate',
                    4:'/user/userSpace/community/#/unit&metric',
                }
                window.sessionStorage.setItem('itemIndex',index)
                this.reloadPage();
                this.getCommunity(index);
                window.location.href=urls[index]

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
                                this.getCommunity();
                            else this.searchCommunity();
                            break;
                        case 7:

                            if (this.isInSearch == 0)
                                this.getUnits();
                            else this.searchUnits();
                            break;

                        case 8:
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

                        case 'research':

                            switch (this.researchIndex) {
                                case 1:
                                    this.getArticleResult();
                                    console.log('article')
                                    break;
                                case 2:
                                    this.getProjectResult();
                                    break;
                                case 3:
                                    this.getConferenceResult();
                                    break;
                            }
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
                var urls={
                    1:'./createConcept',
                    2:'./createSpatialReference',
                    3:'./createTemplate',
                    4:'./createUnit',
                }
                window.sessionStorage.removeItem('editOid');
                window.location.href=urls[this.itemIndex]
            },

            reloadPage(){//重新装订分页诸元
                this.pageSize = 10;
                this.isInSearch = 0;
                this.page = 1;
            },

            getCommunity(index) {
                this.pageSize = 10;
                this.isInSearch = 0;
                if(index!=null&&index!=undefined)
                    this.itemIndex = index;

                let titles={
                    1:'Concept & Semantic',
                    2:'Spatial Reference',
                    3:'Data Template',
                    4:'Unit & Metric'
                }
                this.itemTitle=titles[this.itemIndex]

                var url = "";
                var name = "";
                console.log(this.searchResult);
                if (this.itemIndex == 1) {
                    url = "/repository/getConceptsByUserId";
                    name = "concepts";
                } else if (this.itemIndex == 2) {
                    url = "/repository/getSpatialsByUserId";
                    name = "spatials";
                } else if (this.itemIndex == 3) {
                   url = "/repository/getTemplatesByUserId";
                   name = "templates";
                } else if (this.itemIndex == 4) {
                   url = "/repository/getUnitsByUserId";
                   name = "units";
                }

                this.$forceUpdate();

                $.ajax({
                    type: "Get",
                    url: url,
                    data: {
                        page: this.page - 1,
                        sortType: this.sortType,
                        asc: this.sortAsc
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
                            // this.searchCount = Number.parseInt(data["count"]);
                            //this.searchResult = data[name];
                            // for (var i = 0; i < data[name].length; i++) {
                            //     // this.searchResult.push(data[name][i]);
                            //     this.searchResult.splice(i, 0, data[name][i]);
                            //     console.log(data[name][i]);
                            // }
                            this.$set(this,"searchResult",data[name]);
                            console.log(this.searchResult);
                            //this.modelItemResult = data[name];
                            if (this.page == 1) {
                                this.pageInit();
                            }

                        }
                    }
                })

            },

            searchCommunity() {
                this.resourceLoad = true;
                this.pageSize = 10;
                this.isInSearch = 1;
                let urls={
                    1:'/repository/searchConceptsByUserId',
                    2:'/repository/searchSpatialsByUserId',
                    3:'/repository/searchTemplatesByUserId',
                    4:'/repository/searchUnitsByUserId',
                }
                let names={
                    1:'concepts',
                    2:'spatials',
                    3:'templates',
                    4:'units',
                }
                let url=urls[this.itemIndex];
                let name=names[this.itemIndex];

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
                            this.$set(this, "searchResult", data[name]);
                            ;
                            if (this.page == 1) {
                                this.pageInit();
                            }

                        }

                    }
                })

            },

            editItem(index,oid){
                var urls={
                    1:'./createConcept',
                    2:'./createSpatialReference',
                    3:'./createTemplate',
                    4:'./createUnit',
                }
                this.setSession('editOid', oid)
                window.location.href=urls[this.itemIndex]
            },

            deleteItem(index,oid) {
                if (confirm("Are you sure to delete this model?")) {
                    var urls = {
                        1:"/repository/deleteConcept",
                        2:"/repository/deleteSpatialReference",
                        3:"/repository/deleteTemplate",
                        4:"/repository/deleteUnit",
                    };

                    $.ajax({
                        type: "POST",
                        url: urls[index],
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
                                } else {
                                    alert("delete failed!")
                                }
                            }
                            if (this.searchText.trim() != "") {
                                this.searchModels();
                            } else {
                                this.getCommunity(index);
                            }

                        }
                    })
                }
            },

            //create chart map
            createChartMap(chartInfo) {
                var myChart = echarts.init(document.getElementById('echartMap'));
                myChart.showLoading();
                var chartdata = [];
                for (var i = 0; i < chartInfo.cityCount.length; i++) {
                    let cityObj = {
                        name: '',
                        value: 0
                    };
                    let city = chartInfo.cityCount[i];
                    let geoCoord = chartInfo.geoCoord[city.name];
                    geoCoord.push(city.value);
                    cityObj.name = city.name;
                    cityObj.value = geoCoord;
                    chartdata.push(cityObj);
                }
                myChart.hideLoading();
                var MapOptions = {
                    backgroundColor: "transparent",
                    tooltip: {
                        trigger: 'item',
                        formatter: '{b}'
                    },
                    geo: {
                        show: true,
                        map: 'world',
                        label: {
                            normal: {
                                show: false,
                                textStyle: {
                                    color: 'rgba(0,0,0,0.4)'
                                }
                            },
                            emphasis: {
                                show: true,
                                backgroundColor: '#2c3037',
                                color: '#fff',
                                padding: 5,
                                fontSize: 14,
                                borderRadius: 5
                            }

                        },
                        roam: false,
                        itemStyle: {
                            normal: {
                                areaColor: '#b6d2c8',
                                borderColor: '#404a59',
                                borderWidth: 0.5
                            },
                            emphasis: {
                                areaColor: '#b6d2c8'
                            }

                        },

                    },
                    series: [
                        {
                            name: '点',
                            type: 'scatter',
                            coordinateSystem: 'geo',
                            symbol: 'pin', //气泡
                            symbolSize: 40
                            ,
                            label: {
                                normal: {
                                    show: true,
                                    textStyle: {
                                        color: '#fff',
                                        fontSize: 9,
                                    }
                                }
                            },
                            itemStyle: {
                                normal: {
                                    color: '#00c0ff', //标志颜色
                                }
                            },
                            zlevel: 6,
                            data: chartdata
                        },
                        {
                            name: 'Top 5',
                            type: 'effectScatter',
                            coordinateSystem: 'geo',
                            data: chartdata,
                            symbolSize: 20,
                            showEffectOn: 'render',
                            rippleEffect: {
                                brushType: 'stroke'
                            },
                            hoverAnimation: true,
                            label: {
                                normal: {
                                    formatter: '{b}',
                                    position: 'right',
                                    show: false
                                }
                            },
                            itemStyle: {
                                normal: {
                                    color: '#3daadb',
                                    shadowBlur: 0,
                                    shadowColor: '#3daadb'
                                }
                            },
                            zlevel: 1
                        },
                    ]
                };
                this.computerNodesMapOptions = MapOptions;
                myChart.setOption(MapOptions);
                console.log('wait to load');

                window.onresize = () => {
                    height = document.documentElement.clientHeight;
                    this.ScreenMinHeight = (height) + "px";
                    myChart.resize();
                };

                //添加地图点击事件
                myChart.on('click', function (params) {
                    if (params.componentType == "series") {
                        {
                            $("#pageContent").stop(true);
                            $("#pageContent").animate({scrollTop: $("#" + params.name).offset().top}, 500);
                        }
                    }
                })

            },

        },

        router:router,

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
                            //判断显示哪一个item
                            var itemIndex = window.sessionStorage.getItem("itemIndex");
                            this.itemIndex=itemIndex
                            this.getCommunity(this.itemIndex);

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