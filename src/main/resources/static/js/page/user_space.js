var vue = new Vue({
    el: "#app",
    data: {
        total:100,
        dataFromDataContainer:[],
        defaultActive:'1',
        curIndex:'1',

        // show controller
        dashboard_show: false,
        model_show: false,
        conceptual_show: false,
        logical_show: false,
        computable_show: false,
        tasks_show: false,
        //add servers by wangming at 2018.07.31
        servers_show: false,
        deploys_show:false,

        //todo data-item
        data_upload:false,
        data_show:false,
        dcount:new Number(),
        sourceStoreId:'',
        data_upload_id:'',
        indexStep:-1,
        newStep:-1,

        userInfo: {},


        ScreenMaxHeight: "0px",
        load: true,

        resourceLoad: true,

        statisticsInfo: {
            calculating: 0,
            success: 0,
            fail: 0
        },

        resourceOption: {},

        useOption: {},

        serverInfos: [],

        //computerNodesInfo
        computerNodesInfos:[],

        //computerModelsDeploy
        computerModelsDeploy:[],

        computerNodesMapOptions:{},
        //left-menu
        ScreenMinHeight: "0px",

        userId: "",
        userName: "",
        loginFlag: false,
        activeIndex: 1,
        childIndex:0,
        //model-item
        searchResult: [],
        page: 1,
        sortAsc: 1,//1 -1
        sortType: "default",
        searchCount: 0,
        ScreenMaxHeight: "0px",
        searchText: "",

        pageSize: 10,// 每页数据条数
        totalPage: 0,// 总页数
        curPage: 1,// 当前页码
        pageList: [],
        totalNum: 0,

        //create dataitem
        dataItemAddDTO:{
            name:'',
            description:'',
            detail:'',
            author:'',
            type:'',
            reference:'',
            keywords:[],
            classifications:[],
            displays:[],
            contributers:[],
            authorship:[],
            meta:{
                coordinateSystem:'',
                geographicProjection:'',
                coordinateUnits:'',
                boundingRectangle:[]
            }

        },
        classif:[],
        active:0,
        categoryTree:[],
        ctegorys:[],

        data_img:[],
        //manager
        searchcontent:'',
        databrowser:[],
        loading:'false',
        managerloading:true,
        dataid:'',
        rightMenuShow:false,
        downloadDataSet:[],
        downloadDataSetName:[],
        uploadDialogVisible: false,
        alllen:0



    },
    methods: {
        filterTag(value, row) {
            return row.fromWhere === value;
        },
            onzzzSuccess(){
            alert("上传成功")
        },
        uploadData(){
            return {
                author:this.userName
            }
        },
        handleDataDownloadClick({ sourceStoreId }) {
            let url =
                "http://172.21.212.64:8081/dataResource/getResource?sourceStoreId=" +
                sourceStoreId;
            window.open("/dispatchRequest/download?url=" + url);
        },
        async panye(val) {
    let d=await  this.getTableData(val-1);
    this.dataFromDataContainer = d.content
    this.total=d.total;
},
async getTableData(page) {

    let { data } = await (await fetch(
        "/dispatchRequest/getUserRelatedDataFromDataContainer?page=" +
        page +
        "&pageSize=10&" +
        "authorName=" +
        this.userName
    )).json();

    return {
        total:data.totalElements,
        content:data.content
    }
},
handleSelect(index,indexPath){
    console.log(index)
    this.curIndex=index;
    switch (index){
        case '1':
            this.searchText = '';
            this.searchResult = [];
            this.page = 1;
            this.getTasksInfo();
            break;
        case '2-1':
        case '2-2':
        case '2-3':
        case '2-4':
        case '5':

            this.searchText = '';
            this.searchResult = [];
            this.page = 1;
            this.getModels();
            break;
        case '3-1':
            this.searchText = '';
            this.searchResult = [];
            this.page = 1;
            this.getDataItems();
            break;
        case '3-2':
            this.searchText = '';
            this.searchResult = [];
            this.page = 1;
            this.classif=[];
            $("#classification").val('');
            this.data_img=[]
            break;
        case '3-3':
            this.panye(1);
            this.addAllData()
        case '4-1':
        case '4-2':
        case '4-3':
        case '4-4':

            break;

    }
},

imgFile(){
    $("#imgOne").click();
},
getFileUrl() {
    let sourceId="imgOne"
    var url;
    if (navigator.userAgent.indexOf("MSIE") >= 1) { // IE
        url = document.getElementById(sourceId).value;
    } else if (navigator.userAgent.indexOf("Firefox") > 0) { // Firefox
        url = window.URL.createObjectURL(document.getElementById(sourceId).files.item(0));
    } else if (navigator.userAgent.indexOf("Chrome") > 0) { // Chrome
        url = window.URL.createObjectURL(document.getElementById(sourceId).files.item(0));
    }
    return url;
},
preImg() {

    var file = $('#imgOne').get(0).files[0];
    //创建用来读取此文件的对象
    var reader = new FileReader();
    //使用该对象读取file文件
    reader.readAsDataURL(file);
    //读取文件成功后执行的方法函数
    reader.onload = function (e) {
        //读取成功后返回的一个参数e，整个的一个进度事件
        //选择所要显示图片的img，要赋值给img的src就是e中target下result里面
        //的base64编码格式的地址
        $('#photo').get(0).src = e.target.result;
    }


},

getBase64Image(img) {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, img.width, img.height);
    var ext = img.src.substring(img.src.lastIndexOf(".")+1).toLowerCase();
    var dataURL = canvas.toDataURL("image/"+ext);
    return dataURL;
},

changeOpen(n) {
    this.activeIndex = n;
},

getTree(){
    return this.tree;
},

editModelItem(oid){
    this.setSession('editModelItem_id',oid);
    document.getElementById('modifyModelItem').contentWindow.location.reload(true)

},


getTasksInfo() {

    $.ajax({
        type: "Get",
        url: "/user/getUserInfo",
        data: {},
        crossDomain: true,
        xhrFields: {
            withCredentials: true
        },
        success: (json) => {
        data = json.data;
    console.log(data);
    this.statisticsInfo = data["record"];
    var modelInfo = data["userInfo"];

    this.resourceOption = {
        color: ['#3398DB'],
        tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [
            {
                type: 'category',
                data: ['Model Items', 'Data Item', 'Conceputal Model', 'Logical Model', 'Computable Model'],
                axisTick: {
                    alignWithLabel: true
                },
                axisLabel: {
                    interval: 0,
                    formatter: function (params) {
                        var index = params.indexOf(" ");
                        var start = params.substring(0, index);
                        var end = params.substring(index + 1);
                        var newParams = start + "\n" + end;
                        return newParams
                    }
                }
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ],
        series: [
            {
                name: 'count',
                type: 'bar',
                barWidth: '60%',
                data: [modelInfo["modelItems"], modelInfo["dataItems"], modelInfo["conceptualModels"], modelInfo["logicalModels"], modelInfo["computableModels"]]
            }
        ]
    }

    // var chart = echarts.init(document.getElementById('chartRes'));
    // chart.setOption(this.resourceOption);

    this.userInfo = modelInfo;
    let orgs = this.userInfo.organizations;
    if (orgs.length != 0) {
        this.userInfo.orgStr = orgs[0];
        for (i = 1; i < orgs.length; i++) {
            this.userInfo.orgStr += ", " + orgs[i];
        }
    }

    let sas = this.userInfo.subjectAreas;
    if (sas!=null&&sas.length != 0) {
        this.userInfo.saStr = sas[0];
        for (i = 1; i < sas.length; i++) {
            this.userInfo.saStr += ", " + sas[i];
        }
    }


    this.load = false;
}
})

},

getServersInfo() {
    $.ajax({
        type: "GET",
        url: "/node/computerNodesByUserId",
        data: {},

        crossDomain: true,
        xhrFields: {
            withCredentials: true
        },
        async: true,
        success: (data) => {
        data = JSON.parse(data);
    console.log(data);
    var chartInfo = this.createChartInfo(data.computerNodes);
    this.computerNodesInfos = chartInfo.cityCount;
    this.createChartMap(chartInfo);
}
})

},

getComputerModelsForDeploy() {
    $.ajax({
        type: "Get",
        url: "/computableModel/getComputerModelsForDeployByUserId",
        data: {
            page: this.page,
            sortType: this.sortType,
            asc: this.sortAsc
        },
        cache: false,
        async: true,

        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success: (data) => {
        data = JSON.parse(data);
    this.resourceLoad = false;
    this.totalNum = data.count;
    this.searchCount = Number.parseInt(data["count"]);
    this.computerModelsDeploy = data["computableModels"];
    if (this.page == 1) {
        this.pageInit();
    }
}
})
},

searchComputerModelsForDeploy() {
    $.ajax({
        type: "Get",
        url: "/computableModel/searchComputerModelsForDeploy",
        data: {
            searchText: this.searchText,
            page: this.page,
            sortType: this.sortType,
            asc: this.sortAsc
        },
        cache: false,
        async: true,
        dataType: "json",
        xhrFields:{
            withCredentials:true
        },
        crossDomain: true,
        success: (data) => {
        setTimeout(() => {
        this.resourceLoad = false;
    this.totalNum = data.count;
    this.searchCount = Number.parseInt(data["count"]);
    this.computerModelsDeploy = data["computableModels"];
    this.pageInit();
}, 500);
}
})
},

// get the special data for chart map
createChartInfo(infoArray) {
    var chartInfo = {};
    var geoCoord = {};
    //存放城市个数及城市下所在具体计算节点信息
    var cityCount = [];
    for (var i = 0; i < infoArray.length; i++) {
        var geoJson = infoArray[i].geoJson;
        var city = geoJson.city;
        var flag = false;
        //get the count of the same city
        for (let j = 0; j < cityCount.length; j++) {
            if (cityCount[j].name === city) {
                cityCount[j].value += 1;
                cityCount[j].computerNodeInfos.push(infoArray[i]);
                flag = true;
            }
        }
        if (!flag) {
            let cityObj = {
                name: '',
                value: 0,
                computerNodeInfos: []
            };
            cityObj.name = city;
            cityObj.value = 1;
            cityObj.computerNodeInfos.push(infoArray[i]);
            cityCount.push(cityObj);
            geoCoord[city] = [geoJson.longitude, geoJson.latitude];

        }
    }
    chartInfo.geoCoord = geoCoord;
    chartInfo.cityCount = cityCount;
    return chartInfo;
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


//choose the model_service to deploy and page transition
deployModel(computerNodes) {
    let computableId = computerNodes[0].computableId;
    this.setSession('computable_id', computableId);
    window.location.href = '../deploy-modelService/deploy-modelService.html';
},


search() {
    this.resourceLoad = true;
    this.searchResult = [];
    if (this.searchText === "") {
        if (this.deploys_show) {
            this.getComputerModelsForDeploy();
        } else {
            this.getModels();
        }
    } else {
        this.searchModels();
    }
},
searchDataItem() {
    var that = this;
    axios.get("/dataItem/listByName/" + this.searchText)
        .then((res) => {
        setTimeout(() => {
        that.searchResult = res.data.data;

    }, 500)

    // this.list=res.data.data;

});
},

setSession(name, value) {
    window.sessionStorage.setItem(name, value);
},

menuClick(num) {
    switch (num) {
        case 1:
            this.dashboard_show = true;
            this.model_show = false;
            this.conceptual_show = false;
            this.logical_show = false;
            this.computable_show = false;
            this.tasks_show = false;
            this.servers_show = false;
            this.deploys_show = false;
            this.data_upload=false;
            this.data_show=false;
            //update searchText
            this.searchText = '';
            this.searchResult = [];
            this.page = 1;
            this.getTasksInfo();
            break;
        case 2:
            this.childIndex=1;
            this.dashboard_show = false;
            this.model_show = true;
            this.conceptual_show = false;
            this.logical_show = false;
            this.computable_show = false;
            this.tasks_show = false;
            this.servers_show = false;
            this.deploys_show = false;
            this.resourceLoad = true;
            this.data_upload=false;
            this.data_show=false;
            //update searchText
            this.searchText = '';
            this.searchResult = [];
            this.page = 1;
            this.getModels();
            break;
        case 3:
            this.childIndex=2;
            this.dashboard_show = false;
            this.model_show = false;
            this.conceptual_show = true;
            this.logical_show = false;
            this.computable_show = false;
            this.tasks_show = false;
            this.servers_show = false;
            this.deploys_show = false;
            this.resourceLoad = true;
            this.data_upload=false;
            this.data_show=false;
            //update searchText
            this.searchText = '';
            this.searchResult = [];
            this.page = 1;
            this.getModels();
            break;
        case 4:
            this.childIndex=3;
            this.dashboard_show = false;
            this.model_show = false;
            this.conceptual_show = false;
            this.logical_show = true;
            this.computable_show = false;
            this.tasks_show = false;
            this.servers_show = false;
            this.deploys_show = false;
            this.data_upload=false;
            this.resourceLoad = true;
            this.data_show=false;
            //update searchText
            this.searchText = '';
            this.searchResult = [];
            this.page = 1;
            this.getModels();
            break;
        case 5:
            this.activeIndex = 2;
            this.childIndex = 4;
            this.dashboard_show = false;
            this.model_show = false;
            this.conceptual_show = false;
            this.logical_show = false;
            this.computable_show = true;
            this.tasks_show = false;
            this.servers_show = false;
            this.deploys_show = false;
            this.resourceLoad = true;
            this.data_upload=false;
            this.data_show=false;
            //update searchText
            this.searchText = '';
            this.searchResult = [];
            this.page = 1;
            this.getModels();
            break;
        case 6:
            this.dashboard_show = false;
            this.model_show = false;
            this.conceptual_show = false;
            this.computable_show = false;
            this.tasks_show = true;
            this.servers_show = false;
            this.deploys_show = false;
            this.resourceLoad = true;
            this.data_upload=false;
            this.data_show=false;
            //update searchText
            this.searchText = '';
            this.searchResult = [];
            this.page = 1;
            this.getModels();
            break;
        case 7://todo data items
            this.curIndex='3-2',
                this.childIndex=5;
            this.dashboard_show = false;
            this.model_show = false;
            this.conceptual_show = false;
            this.logical_show = false;
            this.computable_show = false;
            this.tasks_show = false;
            this.servers_show = false;
            this.deploys_show = false;
            this.resourceLoad = false;
            this.data_upload=false;
            this.data_show=true;

            //update searchText
            this.searchText = '';
            this.searchResult = [];
            this.page = 1;
            // this.getModels();
            this.getDataItems();
            break;
        case 8://todo upload data

            this.childIndex=6;
            this.dashboard_show = false;
            this.model_show = false;
            this.conceptual_show = false;
            this.logical_show = false;
            this.computable_show = false;
            this.tasks_show = false;
            this.servers_show = false;
            this.deploys_show = false;
            this.resourceLoad = false;
            this.data_show=false;
            this.data_upload=true;
            //update searchText
            this.searchText = '';
            this.searchResult = [];
            this.page = 1;
            this.classif=[];
            // this.getModels();
            $("#classification").val('');
            this.data_img=[]

            break;
        case 10:
            this.activeIndex = 4;
            this.childIndex = 0;
            this.dashboard_show = false;
            this.model_show = false;
            this.conceptual_show = false;
            this.logical_show = false;
            this.computable_show = false;
            this.tasks_show = true;
            this.servers_show = false;
            this.deploys_show = false;
            this.resourceLoad = true;
            this.data_upload=false;
            this.data_show=false;
            //update searchText
            this.searchText = '';
            this.searchResult = [];
            this.page = 1;
            this.getModels();
            break;

    }

    //request has already request for twice in fact(it doesn't matter)
    //通过点击左侧导航栏的都统一将页面元素设置为1
    // this.changePage(1);
},

getModels() {
    var url = "";
    var name = "";
    if (this.curIndex=='2-1') {
        url = "/modelItem/getModelItemsByUserId";
        name = "modelItems";
    }
    else if (this.curIndex=='2-2') {
        url = "/conceptualModel/getConceptualModelsByUserId"
        name = "conceptualModels";
    }
    else if (this.curIndex=='2-3') {
        url = "/logicalModel/getLogicalModelsByUserId"
        name = "logicalModels";
    }
    else if (this.curIndex=='2-4') {
        url = "/computableModel/getComputableModelsByUserId";
        name = "computableModels";
    }
    else if (this.curIndex=='5') {
        url = "/task/getTasksByUserId";
        name = "tasks";
        this.sortAsc=-1;
    }
    // else if(this.deploys_show){
    //     url = "http://localhost/GeoModelingNew/ComputableModelsForDeployServlet";
    //     name = "computableModels";

    // }
    $.ajax({
        type: "Get",
        url: url,
        data: {
            page: this.page-1,
            sortType: this.sortType,
            asc: -1
        },
        cache: false,
        async: true,

        xhrFields:{
            withCredentials:true
        },
        crossDomain: true,
        success: (json) => {
        if (json.code != 0) {
        alert("Please login first!");
        window.location.href = "/user/login";
    }
else {
        data = json.data;
        this.resourceLoad = false;
        this.totalNum = data.count;
        this.searchCount = Number.parseInt(data["count"]);
        this.searchResult = data[name];
        if (this.page == 1) {
            this.pageInit();
        }

    }
}
})

},

searchModels() {

    var url = "";
    var name = "";
    if (this.curIndex=='2-1') {
        url = "/modelItem/searchModelItemsByUserId";
        name = "modelItems";
    }
    else if (this.curIndex=='2-2') {
        url = "/conceptualModel/searchConceptualModelsByUserId";
        name = "conceptualModels";
    }
    else if (this.curIndex=='2-3') {
        url = "/logicalModel/searchLogicalModelsByUserId";
        name = "logicalModels";
    }
    else if (this.curIndex=='2-4') {
        url = "/computableModel/searchComputableModelsByUserId";
        name = "computableModels";
    }
    else if (this.curIndex=='5') {
        url = "/task/searchTasksByUserId";
        name = "tasks";
    }
    // else if(this.deploys_show){
    //     url= "http://localhost/GeoModelingNew/SearchComputableModelsForDeployServlet";
    //     name= "computableModels";
    // }

    if(this.deploys_show){
        this.searchComputerModelsForDeploy();
    }else{
        $.ajax({
            type: "Get",
            url: url,
            data: {
                searchText: this.searchText,
                page: this.page-1,
                sortType: this.sortType,
                asc: this.sortAsc
            },
            cache: false,
            async: true,
            dataType: "json",
            xhrFields:{
                withCredentials:true
            },
            crossDomain: true,
            success: (json) => {
            if (json.code != 0) {
            alert("Please login first!");
            window.location.href = "/user/login";
        }
    else {
            data = json.data;
            this.resourceLoad = false;
            this.totalNum = data.count;
            this.searchCount = Number.parseInt(data["count"]);
            this.searchResult = data[name];
            this.pageInit();

        }

    }
    })
    }
},

deleteModel(oid) {
    if (confirm("Are you sure to delete this model?")) {

        var url = "";
        if (this.curIndex=='2-1') {
            url = "/modelItem/delete";
        }
        else if (this.curIndex=='2-2') {
            url = "/conceptualModel/delete";
        }
        else if (this.curIndex=='2-3') {
            url = "/logicalModel/delete";
        }
        else if (this.curIndex=='2-4') {
            url = "/computableModel/delete";
        }
        else if (this.curIndex=='5') {
            url = "/task/delete";
        }

        $.ajax({
            type: "POST",
            url: url,
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
            if(json.code==-1){
            alert("Please log in first!")
        }
    else{
            if(json.data==1){
                alert("delete successfully!")
            }
            else{
                alert("delete failed!")
            }
        }
        if (this.searchText.trim() != "") {
            this.searchModels();
        }
        else {
            this.getModels();
        }

    }
    })
    }
},
updateModels() {

    $.ajax({
        type: "Get",
        url: "http://localhost/GeoModelingNew/UpdateRecordsServlet",
        data: {},
        cache: false,
        async: true,
        dataType: "json",
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success: (data) => {
        console.log(data)
        for (var key in data) {
        var obj = data[key];
        if (obj.status === "suc") {
            this.alertService.success(obj.name + "-" + obj.time);
        } else {
            this.alertService.danger(obj.name + "-" + obj.time);
        }
    }
}
})

},


downloadSingle(url) {
    window.open(url);
    // var form = document.createElement("form");
    // form.style.display = "none";
    //
    // form.setAttribute("target", "");
    // form.setAttribute('method', 'get');
    // form.setAttribute('action', "http://localhost/GeoModelingNew/DownloadSingleDataServlet");
    //
    // var input1 = document.createElement("input");
    // input1.setAttribute('type', 'hidden');
    // input1.setAttribute('name', 'recordId');
    // input1.setAttribute('value', recordId);
    //
    // var input2 = document.createElement("input");
    // input2.setAttribute('type', 'hidden');
    // input2.setAttribute('name', 'dataId');
    // input2.setAttribute('value', dataId);
    //
    // form.appendChild(input1);
    // form.appendChild(input2);
    //
    // document.body.appendChild(form);  //将表单放置在web中
    // //将查询参数控件提交到表单上
    // form.submit();
    // form.remove();

},

downloadAll(recordId, name, time) {
    var form = document.createElement("form");
    form.style.display = "none";

    form.setAttribute("target", "");
    form.setAttribute('method', 'get');
    form.setAttribute('action', "http://localhost/GeoModelingNew/DownloadAllDataServlet");

    var input1 = document.createElement("input");
    input1.setAttribute('type', 'hidden');
    input1.setAttribute('name', 'recordId');
    input1.setAttribute('value', recordId);

    var input2 = document.createElement("input");
    input2.setAttribute('type', 'hidden');
    input2.setAttribute('name', 'name');
    input2.setAttribute('value', name);

    var input3 = document.createElement("input");
    input3.setAttribute('type', 'hidden');
    input3.setAttribute('name', 'time');
    input3.setAttribute('value', time);

    form.appendChild(input1);
    form.appendChild(input2);
    form.appendChild(input3);

    document.body.appendChild(form);  //将表单放置在web中
    //将查询参数控件提交到表单上
    form.submit();
    form.remove();
},
//page
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
    } else if (this.totalPage - this.curPage < 5 && this.curPage > 4) {//如果总的页码数减去当前页码数小于5（到达最后5页），那么直接计算出来显示
        this.pageList = [
            this.curPage - 4,
            this.curPage - 3,
            this.curPage - 2,
            this.curPage - 1,
            this.curPage,
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
        if (this.data_show) {
            // this.computerModelsDeploy = [];
            // this.resourceLoad = true;
            // this.curPage = pageNo;
            // this.getPageList();
            // this.page = pageNo;
            // this.getDataItems();

            this.resourceLoad = true;
            this.searchResult = [];
            //not result scroll
            //window.scrollTo(0, 0);
            this.curPage = pageNo;
            this.getPageList();
            this.page = pageNo;
            this.getDataItems();

        } else {
            this.resourceLoad = true;
            this.searchResult = [];
            //not result scroll
            //window.scrollTo(0, 0);
            this.curPage = pageNo;
            this.getPageList();
            this.page = pageNo;
            this.getModels();
        }
        //this.changeCurPage.emit(this.curPage);
    }
},

formatDate(value) {
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
    return t;
},

//add data item
createdataitem() {

    this.dataItemAddDTO.name = $("#dataname").val();

    this.dataItemAddDTO.type = $("input[name='imgradio']:checked").val();
    this.dataItemAddDTO.description = $("#description").val();
    // this.dataItemAddDTO.detail=$("#detail").val();
    var detail = tinyMCE.activeEditor.getContent();
    this.dataItemAddDTO.detail = detail;
    //todo 获取作者信息
    // this.dataItemAddDTO.author=$("#author").val();
    this.dataItemAddDTO.keywords = $("#keywords").tagsinput('items');

    this.dataItemAddDTO.classifications = this.ctegorys;
    // this.dataItemAddDTO.displays.push($("#displays").val())
    this.dataItemAddDTO.displays=this.data_img

    this.dataItemAddDTO.reference = $("#dataresoureurl").val()


    //用户名
    // this.dataItemAddDTO.author=this.userId;
    this.dataItemAddDTO.author = this.userName;
    this.dataItemAddDTO.contributers = $("#contributers").tagsinput('items');

    this.dataItemAddDTO.comments = new Array();

    this.dataItemAddDTO.meta.coordinateSystem = $("#coordinateSystem").val();
    this.dataItemAddDTO.meta.geographicProjection = $("#geographicProjection").val();
    this.dataItemAddDTO.meta.coordinateUnits = $("#coordinateUnits").val();

    this.dataItemAddDTO.meta.boundingRectangle=[];




    // var point1={
    //     x:$("#upperleftx").val(),
    //     y:$("#upperlefty").val()
    // };
    //
    //
    //
    //
    // if($("#upperleftx").val().length!=0&&$("#upperlefty").val().length!=0){
    //     this.dataItemAddDTO.meta.boundingRectangle.push(point1);
    // }
    //
    //
    // var point2={
    //     x:$("#bottomrightx").val(),
    //     y:$("#bottomrighty").val()
    // }
    //
    // if($("#bottomrightx").val().length!=0&&$("#bottomrighty").val().length!=0){
    //     this.dataItemAddDTO.meta.boundingRectangle.push(point2);
    //
    // }



    var authorship=[]
    var author_lenth=$(".user-attr").length;
    for(var i=0;i<author_lenth;i++){

        let authorInfo={
            name:'',
            email:'',
            homepage:''
        }
        console.log($(".user-attr input"))
        let t=3*i
        authorInfo.name=$(".user-attr input")[t].value
        authorInfo.email=$(".user-attr input")[1+t].value
        authorInfo.homepage=$(".user-attr input")[2+t].value
        authorship.push(authorInfo)

    }
    this.dataItemAddDTO.authorship=authorship


    var thedata=this.dataItemAddDTO;

    var that=this
    if($("#dataname").val().length==0||$("#description").val()==''||this.dataItemAddDTO.detail==''||this.classif.length==0||$("#keywords").tagsinput('items').length==0){
        alert("data not complete,please input required data")
    }else{
        axios.post("/dataItem/",thedata)
            .then(res=>{
            if(res.status==200){
            alert("created data item successfully!!")

            //创建静态页面
            axios.get("/dataItem/adddataitembyuser",{
                params:{
                    id:res.data.data.id
                }
            }).then(()=>{

            });

            var categoryAddDTO={
                id:res.data.data.id,
                cate:that.ctegorys
            }
            axios.post('/dataItem/addcate',categoryAddDTO).then(res=>{
                // console.log(res)
            });
            that.menuClick(7);
            //每次创建完条目后清空category内容
            that.ctegorys=[];
            //清空displays内容
            that.data_img=[]


            $(".prev").click();
            $(".prev").click();


            //清空
            $("#classification").val('')
            $("#dataname").val('');
            $("#description").val('');
            $("#keywords").tagsinput('removeAll');

            $("#displays").val('');
            $("#dataresoureurl").val("")
            $("#contributers").tagsinput('removeAll');
            $("#coordinateSystem").val("");
            $("#geographicProjection").val("")
            $("#coordinateUnits").val("")
            $("#upperleftx").val("")
            $("#upperlefty").val("")
            $("#bottomrightx").val("")
            $("#bottomrighty").val("");
            $("#imgFile").val("");

            that.curIndex='none';
            that.curIndex='3-1'



        }
    })
    }








},
next(){

},
change(currentIndex, newIndex, stepDirection){
    console.log(currentIndex, newIndex, stepDirection)
},

getDataItems(){


    var da={
        username:this.userName,
        page:this.page,
        pagesize:this.pageSize,
        asc:this.sortAsc

    }


    this.loading=true
    var that=this;
    //todo 从后台拿到用户创建的data—item
    axios.get("/user/getDataItems",{
        params:da
    }).then(res=>{


        this.searchResult=res.data.data.content
    this.resourceLoad = false;
    this.totalNum=res.data.data.totalElements;
    if(this.page == 1){
        this.pageInit();
    }
    this.data_show=true
    this.loading=false



})



},
//todo 数据条目的增删操作
searchDataItems(){},
deleteDataitems(id){

    //todo 删除category中的 id
    var cfm=confirm("are you sure to delete?");

    if(cfm==true){
        axios.get("/dataItem/del/",{
            params:{
                id:id
            }
        }).then(res=>{
            if(res.status==200){
            alert("delete success!");
            this.getDataItems();
        }
    })
    }


},

updateDataItems(){},
upload_data(data){

    this.data_upload_id=data.id;
    var d=this.userName;
    $("#data-author").val(d)




},
close(){
    // $(".uploaddataitem").css("visibility","hidden");
    this.data_upload_id='';
    $("#file-1").val('');
    this.sourceStoreId=''
},
uploadD(){



    if(this.sourceStoreId===''){
        alert("请先上传数据")
    }else{
        var data={
            author: this.userId,
            dataItemId: this.data_upload_id,
            fileName: $("#fileName").val(),
            mdlId: "string",
            sourceStoreId:this.sourceStoreId,
            suffix:$("#suffix").val(),
            tags: $("#datatags").tagsinput('items'),
            type: $("input[name='data_upload_type']:checked").val(),

        }
        var that =this;
        axios.post("http://172.21.213.194:8081/dataResource",data)
            .then(res=>{
            if(res.status==200){
            alert("data upload success")
            that.close()
        }
    });
    }



},
chooseCate(item,e){
    if($("#classification").val()!=null){
        $("#classification").val('')
    }
    this.classif.push(e.target.innerText);

    $("#classification").val(this.classif);

    this.ctegorys.push(item.id)

},
toDataItem(){
    this.handleSelect('3-2',null);
    this.defaultActive='3-1';
},
toMyData(){
    this.handleSelect('3-3',null);
    this.defaultActive='3-3';

},
downloaddata(){},
dall(){},


//个人空间上传下载管理

        //获得所有数据
showtitle(ev){
    return ev.fileName+"\n"+"Type:"+ev.suffix;
},
getImg(item){
    return "/static/img/filebrowser/"+item.suffix+".svg"
},
generateId(key){
    return key;
},
getid($event,eval){
            console.log(eval.id)
    this.dataid=eval.id;

    $event.currentTarget.className="el-card dataitemisol clickdataitem"

    //再次点击取消选择
    if(this.downloadDataSet.indexOf(eval)>-1){
        for(var i=0;i<this.downloadDataSet.length;i++){
            if(this.downloadDataSet[i]===eval){
                //删除
                this.downloadDataSet.splice(i,1)
                break
            }
        }
        for(var i=0;i<this.downloadDataSetName.length;i++){
            if(this.downloadDataSetName[i]===eval.fileName){
                this.downloadDataSetName.splice(i,1)
                break
            }
        }



    }else{
        this.downloadDataSet.push(eval)
        this.downloadDataSetName.push(eval.fileName)
    }



},
userDownload(){
    //todo 依据数组downloadDataSet批量下载

    let sourceId=new Array()

    for(let i=0;i<this.downloadDataSet.length;i++){
        sourceId.push(this.downloadDataSet[i].sourceStoreId)
    }


    if(this.downloadDataSet.length>0){

        const keys=sourceId.map(_=>`sourceStoreId=${_}`).join('&');
        let url ="/dataManager/downloadSomeRemote?"+keys;
        let link =document.createElement('a');
        link.style.display='none';
        link.href=url;
        // link.setAttribute(item.fileName,'filename.'+item.suffix)

        document.body.appendChild(link)
        link.click();

    }else{
        alert("please select first!!")
    }


},
addAllData(){
            let that=this
    axios.get("/dataManager/list",{
        params:{
            author:this.userId,
            type:"author"
        }

    })
        .then((res)=>{



            // console.log("oid datas",this.userId,res.data.data)
            that.databrowser=res.data.data
            that.alllen=that.databrowser.length
            that.managerloading=false
        })
},
        addDataClass($event,item){
            this.rightMenuShow=false


            if(this.downloadDataSet.indexOf(item)<0){
                $event.currentTarget.className="el-card dataitemisol dataitemhover"
            }

            this.dataid=item.id


        },
        removeClass($event,item){



            if(this.downloadDataSet.indexOf(item)>-1){
                $event.currentTarget.className="el-card dataitemisol clickdataitem"
            }else{
                $event.currentTarget.className="el-card dataitemisol"
            }



        },

        //右键菜单

        rightMenu(e){
            e.preventDefault();

            e.currentTarget.className="el-card dataitemisol clickdataitem"


            var dom = document.getElementsByClassName("browsermenu");

            console.log(e)
            dom[0].style.top = e.pageY -100+"px"
            // 125 > window.innerHeight
            //     ? `${window.innerHeight - 127}px` : `${e.pageY}px`;
            dom[0].style.left = e.pageX-200 +"px";

            this.rightMenuShow=true




        },
        //上传
 upload_data_dataManager(){



     if(this.sourceStoreId===''){
         alert("请先上传数据")
     }else{
         var data={
             author: this.userId,

             fileName: $("#managerFileName").val(),
             fromWhere:"PORTAL",
             mdlId: "string",
             sourceStoreId:this.sourceStoreId,
             suffix:$("#managerFileSuffix").val(),
             tags: $("#managerFileTags").tagsinput('items'),
             type: "OTHER"

         }
         var that =this;
         axios.post("http://172.21.212.64:8081/dataResource",data)
             .then(res=>{
                 if(res.status==200){
                     alert("data upload success")

                     that.addAllData()
                     that.close()
                 }
             });

     }

 },


        handleClose(done){
            this.$confirm('are you sure to close？')
                .then(_ => {
                    done();
                })
                .catch(_ => {});
        },


        //下载
download_data_dataManager(){

    for(let i=0;i<this.databrowser.length;i++){
        if(this.databrowser[i].id===this.dataid){
            var item=this.databrowser[i];
            break;
        }
    }



    if(item!=null){
        let url ="/dataManager/downloadRemote?&sourceStoreId="+item.sourceStoreId;
        let link =document.createElement('a');
        link.style.display='none';
        link.href=url;
        // link.setAttribute(item.fileName,'filename.'+item.suffix)

        document.body.appendChild(link)
        link.click();

    }else {
        this.$message('please select file first!!');
    }


},
        //删除
delete_data_dataManager(){

     if(confirm("are u sure to delete?")){
         let tha=this
         axios.delete("/dataManager/delete",{
             params:{
                 id:tha.dataid
             }
         }).then((res)=>{


             if(res.data.msg==="成功"){
                 //删除双向绑定的数组
                 tha.rightMenuShow=false
                 tha.databrowser=[]
                 tha.addAllData()
                 alert("delete successful")

             }

         })
     }else{
         alert("ok")
     }





},


        showsearchresult(data){

            //动态创建DOM节点

            for(let i=0;i<this.databrowser.length;i++){
                //匹配查询字段
                if(this.databrowser[i].fileName.toLowerCase().indexOf(data.toLowerCase())>-1){
                    //插入查找到的card

                    //card
                    let searchresultcard=document.createElement("div");
                    searchresultcard.classList.add("el-card");
                    searchresultcard.classList.add("dataitemisol");
                    searchresultcard.classList.add("is-never-shadow");
                    searchresultcard.classList.add("sresult");


                    //cardbody
                    let secardbody=document.createElement("div");
                    secardbody.classList.add("el-card__body");
                    //card里添加cardbody
                    searchresultcard.appendChild(secardbody);

                    //el-row1
                    let cardrow1=document.createElement("div");
                    cardrow1.classList.add("el-row");
                    secardbody.appendChild(cardrow1);

                    //3个div1
                    //div1
                    let div1=document.createElement("div");
                    div1.classList.add("el-col");
                    div1.classList.add("el-col-6");

                    let text1=document.createTextNode(" ");
                    div1.appendChild(text1);

                    cardrow1.appendChild(div1)

                    //div2
                    let div2=document.createElement("div");
                    div2.classList.add("el-col");
                    div2.classList.add("el-col-12");

                    let img=document.createElement("img");
                    img.src="/static/img/filebrowser/"+this.databrowser[i].suffix+".svg";

                    img.style.height='60%';
                    img.style.width='100%';
                    img.style.marginLeft='30%';

                    div2.appendChild(img);

                    cardrow1.appendChild(div2)

                    //div3
                    let div3=document.createElement("div");
                    div3.classList.add("el-col");
                    div3.classList.add("el-col-6");

                    let text2=document.createTextNode(" ");
                    div3.appendChild(text2);

                    cardrow1.appendChild(div3);


                    //el-row2
                    let cardrow2=document.createElement("div");
                    cardrow2.classList.add("el-row");
                    secardbody.appendChild(cardrow2);

                    //3个div2
                    //div4
                    let div4=document.createElement("div");
                    div4.classList.add("el-col");
                    div4.classList.add("el-col-2");

                    let text3=document.createTextNode(" ");
                    div4.appendChild(text3);

                    cardrow2.appendChild(div4)

                    //div5
                    let div5=document.createElement("div");
                    div5.classList.add("el-col");
                    div5.classList.add("el-col-20");

                    let p=document.createElement("p");
                    div5.appendChild(p);

                    let filenameandtype=document.createTextNode(this.databrowser[i].fileName+'.'+this.databrowser[i].suffix);
                    p.appendChild(filenameandtype)

                    cardrow2.appendChild(div5)

                    //div6
                    let div6=document.createElement("div");
                    div6.classList.add("el-col");
                    div6.classList.add("el-col-20");

                    let text4=document.createTextNode(" ");
                    div6.appendChild(text4);

                    cardrow2.appendChild(div6)

                    //往contents里添加card
                    document.getElementById("browsercont").appendChild(searchresultcard);

                    //DOM2级事件绑定

                    // searchresultcard.addEventListener('click',()=>{
                    //    //点击赋值id
                    //     this.dataid=i;
                    // });
                    searchresultcard.click(function () {
                        this.dataid=this.databrowser[i].id;
                    })

                }
            }
        },

        category(data){

            for(let j=0;j<data.length;j++){
                for(let i=0;i<this.databrowser.length;i++){
                    //匹配查询字段
                    if(this.databrowser[i].suffix.toLowerCase().indexOf(data[j].toLowerCase())>-1){
                        //插入查找到的card

                        //card
                        let searchresultcard=document.createElement("div");
                        searchresultcard.classList.add("el-card");
                        searchresultcard.classList.add("dataitemisol");
                        searchresultcard.classList.add("is-never-shadow");
                        searchresultcard.classList.add("sresult");


                        //cardbody
                        let secardbody=document.createElement("div");
                        secardbody.classList.add("el-card__body");
                        //card里添加cardbody
                        searchresultcard.appendChild(secardbody);

                        //el-row1
                        let cardrow1=document.createElement("div");
                        cardrow1.classList.add("el-row");
                        secardbody.appendChild(cardrow1);

                        //3个div1
                        //div1
                        let div1=document.createElement("div");
                        div1.classList.add("el-col");
                        div1.classList.add("el-col-6");

                        let text1=document.createTextNode(" ");
                        div1.appendChild(text1);

                        cardrow1.appendChild(div1)

                        //div2
                        let div2=document.createElement("div");
                        div2.classList.add("el-col");
                        div2.classList.add("el-col-12");

                        let img=document.createElement("img");
                        img.src="/static/img/filebrowser/"+this.databrowser[i].suffix+".svg";

                        img.style.height='60%';
                        img.style.width='100%';
                        img.style.marginLeft='30%';

                        div2.appendChild(img);

                        cardrow1.appendChild(div2)

                        //div3
                        let div3=document.createElement("div");
                        div3.classList.add("el-col");
                        div3.classList.add("el-col-6");

                        let text2=document.createTextNode(" ");
                        div3.appendChild(text2);

                        cardrow1.appendChild(div3);


                        //el-row2
                        let cardrow2=document.createElement("div");
                        cardrow2.classList.add("el-row");
                        secardbody.appendChild(cardrow2);

                        //3个div2
                        //div4
                        let div4=document.createElement("div");
                        div4.classList.add("el-col");
                        div4.classList.add("el-col-2");

                        let text3=document.createTextNode(" ");
                        div4.appendChild(text3);

                        cardrow2.appendChild(div4)

                        //div5
                        let div5=document.createElement("div");
                        div5.classList.add("el-col");
                        div5.classList.add("el-col-20");

                        let p=document.createElement("p");
                        div5.appendChild(p);

                        let filenameandtype=document.createTextNode(this.databrowser[i].fileName+'.'+this.databrowser[i].suffix);
                        p.appendChild(filenameandtype)

                        cardrow2.appendChild(div5)

                        //div6
                        let div6=document.createElement("div");
                        div6.classList.add("el-col");
                        div6.classList.add("el-col-20");

                        let text4=document.createTextNode(" ");
                        div6.appendChild(text4);

                        cardrow2.appendChild(div6)

                        //往contents里添加card
                        document.getElementById("browsercont").appendChild(searchresultcard);

                        //DOM2级事件绑定

                        // searchresultcard.addEventListener('click',()=>{
                        //    //点击赋值id
                        //     this.dataid=i;
                        // });
                        searchresultcard.click(function () {
                            this.dataid=this.databrowser[i].id;
                        })

                    }
                }
            }

        },


share(){
    for(let i=0;i<this.databrowser.length;i++){
        if(this.databrowser[i].id===this.dataid){
            var item=this.databrowser[i];
            break;
        }
    }


    if(item!=null){
        let url ="/dataManager/downloadRemote?&sourceStoreId="+item.sourceStoreId;
        this.$alert("<input style='width: 100%' value="+url+">",{
            dangerouslyUseHTMLString: true
        })
        // this.dataid='';

    }else {
        // console.log("从后台获取数据条目数组有误")
        this.$message('please select file first!!');
    }
},
        keywordsSearch(){
           if(this.searchcontent===""){
               this.addAllData()
           }else{
               this.dataManagerSe(this.searchcontent)

           }



        },
        dataManagerSe(val){
            let that=this
            this.loading=true
            axios.get("/dataManager/keywordsSearch",{
                params:{
                    id:that.userId,
                    words:val

                }
            })
                .then((res)=>{
                    if(res.status===200){
                        that.databrowser=res.data.data.data
                        that.loading=false
                    }
                })

        },
        findAllFiles(){

            this.addAllData()


        },

        findPics(){



            let that=this
            this.loading=true
            axios.get("/dataManager/managerPics",{
                params:{
                    id:that.userId,


                }
            })
                .then((res)=>{
                    if(res.status===200){
                        that.databrowser=res.data.data.data
                        that.loading=false
                    }
                })
        },
        findDocs(){


            let that=this
            this.loading=true
            axios.get("/dataManager/managerDoc",{
                params:{
                    id:that.userId,


                }
            })
                .then((res)=>{
                    if(res.status===200){
                        that.databrowser=res.data.data.data
                        that.loading=false
                    }
                })

        },

        findOtherFiles(){

            let that=this
            this.loading=true
            axios.get("/dataManager/managerOhr",{
                params:{
                    id:that.userId,


                }
            })
                .then((res)=>{
                    if(res.status===200){
                        that.databrowser=res.data.data.data
                        that.loading=false
                    }
                })
        }


},

created(){


},
mounted() {



    $('.dropdown-toggle').dropdown()

    //模态框
    $('#myModal').modal({
        keyboard: false,
        backdrop: true,
        show: false,
    })
    $('#myModal1').modal({
        keyboard: false,
        backdrop: true,
        show: false,
    })

    $("#edit").click(() => {
        $.ajax({
        url: "/user/getUser",
        type: "get",
        data: {oid: this.userId},
        async: false,
        success: (json) => {

        console.log("u"+json);
    let data = json.data;
    if(data.image!=""&&data.image!=null){
        $("#photo").attr("src",data.image);
    }
    else{
        $("#photo").attr("src","../static/img/icon/default.png");
    }
    $("#inputName").val(data.name);
    $("#inputPhone").val(data.phone);
    $("#inputHomePage").val(data.wiki);
    $("#inputDescription").val(data.description);

    if(data.organizations!=null&&data.organizations.length!=0) {
        $("#inputOrganizations").tagEditor("destroy");
        $('#inputOrganizations').tagEditor({
            initialTags: data.organizations,
            forceLowercase: false,
            placeholder: 'Enter Organizations ...'
        });
    }
    else{
        $("#inputOrganizations").tagEditor("destroy");
        $('#inputOrganizations').tagEditor({
            initialTags: [],
            forceLowercase: false,
            placeholder: 'Enter Organizations ...'
        });
    }
    if(data.subjectAreas!=null&&data.subjectAreas.length!=0) {
        $("#inputSubjectAreas").tagEditor("destroy");
        $('#inputSubjectAreas').tagEditor({
            initialTags: data.subjectAreas,
            forceLowercase: false,
            placeholder: 'Enter Subject Areas ...'
        });
    }
    else{
        $("#inputSubjectAreas").tagEditor("destroy");
        $('#inputSubjectAreas').tagEditor({
            initialTags: [],
            forceLowercase: false,
            placeholder: 'Enter Subject Areas ...'
        });
    }
    $('#myModal').modal('show');
}
});

})

    $("#saveUser").click(() => {
        $("#saveUser").attr("disabled","disabled");
        let userUpdate = {};
    userUpdate.oid = this.userId;
    userUpdate.name = $("#inputName").val().trim();
    userUpdate.phone = $("#inputPhone").val().trim();
    userUpdate.wiki = $("#inputHomePage").val().trim();
    userUpdate.description = $("#inputDescription").val().trim();
    userUpdate.organizations = $("#inputOrganizations").val().split(",");
    userUpdate.subjectAreas = $("#inputSubjectAreas").val().split(",");
    userUpdate.uploadImage=$("#photo").get(0).src;

    $.ajax({
        url: "/user/update",
        type: "POST",
        async: true,
        contentType: "application/json",
        data: JSON.stringify(userUpdate),
        success: function (result) {
            $("#saveUser").removeAttr("disabled");
            alert("update successfully!")
            window.location.reload();
        }
    });
})

    $("#changePass").click(()=>{
        $('#myModal1').modal('show');
})

    $("#submitPass").click(()=>{
        let oldPass=$("#inputOldPass").val();
    let newPass=$("#inputPassword").val();
    let newPassAgain=$("#inputPassAgain").val();
    if(oldPass==""){
        alert("Please enter old password!")
        return;
    }
    else if(newPass==""){
        alert("Please enter new password!")
        return;
    }
    else if(newPassAgain==""){
        alert("Please confirm new password!")
        return;
    }
    else if(newPass!=newPassAgain){
        alert("Password and Confirm Password are inconsistent!")
        return;
    }

    let data={};
    data.oldPass=oldPass;
    data.newPass=newPass;

    $.ajax({
        url: "/user/changePassword",
        type: "POST",
        async: false,
        data: data,
        success: function (result) {
            if(result.code==-1){
                alert("Please login first!")
                //window.location.href="/user/login";
            }
            else {
                let data = result.data;
                if (data == 1) {
                    alert("Change password successfully!")
                    window.location.href="/user/login";

                }
                else {
                    alert("Old password is not correct!");
                }
            }
        },
        error:function (result) {
            alert("Change password error!")

        }
    });
})

    $('#inputOrganizations').tagEditor({
        forceLowercase: false
    });

    $('#inputSubjectAreas').tagEditor({
        forceLowercase: false
    });


    var tha=this

    axios.get("/dataItem/createTree")
        .then(res=>{
        tha.tObj=res.data;
    for(var e in tha.tObj){
        var a={
            key:e,
            value:tha.tObj[e]
        }
        if(e!='Data Resouces Hubs'){
            tha.categoryTree.push(a);
        }


    }

})






    var that=this;

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
        data: {

        },
        cache: false,
        async: false,
        xhrFields:{
            withCredentials: true
        },
        crossDomain:true,
        success: (data) => {
        data=JSON.parse(data);

    console.log(data);

    if (data.oid == "") {
        alert("Please login");
        window.location.href = "/user/login";
    }
    else {
        this.userId = data.oid;
        // this.userName = data.name;
        console.log(this.userId)
        // this.addAllData()




        axios.get("/dataItem/amountofuserdata",{
            params:{
                author:data.name
            }
        }).then(res=>{
            that.dcount=res.data
    });

        $("#author").val(this.userName);

        var index=window.sessionStorage.getItem("index");
        if (index != null && index != undefined && index != "" && index != NaN) {
            this.defaultActive=index;
            this.handleSelect(index,null);
            window.sessionStorage.removeItem("index");

        }
        else {
            this.menuClick(1);
        }

        window.sessionStorage.removeItem("tap");
        //this.getTasksInfo();
        this.load = false;
    }
}
})


    //this.getModels();
});


    //managerUpload

    $("#managerUpload").fileinput({
        theme: 'fas',
        uploadUrl: 'http://172.21.213.194:8081/file/upload/store_dataResource_files', // /file/apk_upload   you must set a valid URL here else you will get an error
        overwriteInitial: false,
        uploadAsync: true, //默认异步上传,
        showUpload: true, //是否显示上传按钮
        showRemove : true, //显示移除按钮
        showPreview : true, //是否显示预览
        showCaption: false,//是否显示标题
        browseClass: "btn btn-primary", //按钮样式

        maxFileSize: 10000,
        maxFilesNum: 10,
        enctype: 'multipart/form-data',
        validateInitialCount:true,
        msgFilesTooMany: "选择上传的文件数量({n}) 超过允许的最大数值{m}！",
        //allowedFileTypes: ['image', 'video', 'flash'],
        slugCallback: function (filename) {
            return filename.replace('(', '_').replace(']', '_');
        }
    }).on('filepreupload', function(event, data, previewId, index) {     //上传中
        // console.log('文件正在上传');
    }).on("fileuploaded", function (event, data, previewId, index) {    //一个文件上传成功
        var form = data.form, files = data.files, extra = data.extra,
            response = data.response, reader = data.reader;
        if(response!=null){
            // alert("数据上传成功")
        }
        //get dataResource add sourceStoreId
        that.sourceStoreId=response.data;
        // console.log(response);//打印出返回的json
        // console.log(response.status);//打印出路径


    }).on('fileerror', function(event, data, msg) {  //一个文件上传失败
        // console.log('文件上传失败！'+data.status);
    });





    //上传数据相关
    $("#file-1").fileinput({
        theme: 'fas',
        uploadUrl: 'http://172.21.213.194:8081/file/upload/store_dataResource_files', // /file/apk_upload   you must set a valid URL here else you will get an error
        overwriteInitial: false,
        uploadAsync: true, //默认异步上传,
        showUpload: true, //是否显示上传按钮
        showRemove : true, //显示移除按钮
        showPreview : true, //是否显示预览
        showCaption: false,//是否显示标题
        browseClass: "btn btn-primary", //按钮样式

        maxFileSize: 10000,
        maxFilesNum: 10,
        enctype: 'multipart/form-data',
        validateInitialCount:true,
        msgFilesTooMany: "选择上传的文件数量({n}) 超过允许的最大数值{m}！",
        //allowedFileTypes: ['image', 'video', 'flash'],
        slugCallback: function (filename) {
            return filename.replace('(', '_').replace(']', '_');
        }
    }).on('filepreupload', function(event, data, previewId, index) {     //上传中
        // console.log('文件正在上传');
    }).on("fileuploaded", function (event, data, previewId, index) {    //一个文件上传成功
        var form = data.form, files = data.files, extra = data.extra,
            response = data.response, reader = data.reader;
        if(response!=null){
            // alert("数据上传成功")
        }
        //get dataResource add sourceStoreId
        that.sourceStoreId=response.data;
        // console.log(response);//打印出返回的json
        // console.log(response.status);//打印出路径


    }).on('fileerror', function(event, data, msg) {  //一个文件上传失败
        // console.log('文件上传失败！'+data.status);
    });

    $("#file-2").fileinput({
        theme: 'fas',
        uploadUrl: 'http://172.21.213.194:8081/file/upload/store_dataResource_files', // /file/apk_upload   you must set a valid URL here else you will get an error
        overwriteInitial: false,
        uploadAsync: true, //默认异步上传,
        showUpload: true, //是否显示上传按钮
        showRemove : true, //显示移除按钮
        showPreview : true, //是否显示预览
        showCaption: false,//是否显示标题
        browseClass: "btn btn-primary", //按钮样式

        maxFileSize: 10000,
        maxFilesNum: 10,
        enctype: 'multipart/form-data',
        validateInitialCount:true,
        msgFilesTooMany: "选择上传的文件数量({n}) 超过允许的最大数值{m}！",
        //allowedFileTypes: ['image', 'video', 'flash'],
        slugCallback: function (filename) {
            return filename.replace('(', '_').replace(']', '_');
        }
    }).on('filepreupload', function(event, data, previewId, index) {     //上传中
        // console.log('文件正在上传');
    }).on("fileuploaded", function (event, data, previewId, index) {    //一个文件上传成功
        var form = data.form, files = data.files, extra = data.extra,
            response = data.response, reader = data.reader;
        if(response!=null){
            // alert("数据上传成功")
        }
        //get dataResource add sourceStoreId
        that.sourceStoreId=response.data;


        // console.log(response);//打印出返回的json
        // console.log(response.status);//打印出路径


    }).on('fileerror', function(event, data, msg) {  //一个文件上传失败
        // console.log('文件上传失败！'+data.status);
    });



    //上传数据相关
    $("#manager-upload").fileinput({
        theme: 'fas',
        uploadUrl: 'http://172.21.212.64:8081/file/upload/store_dataResource_files', // /file/apk_upload   you must set a valid URL here else you will get an error
        overwriteInitial: false,
        uploadAsync: true, //默认异步上传,
        showUpload: true, //是否显示上传按钮
        showRemove : true, //显示移除按钮
        showPreview : true, //是否显示预览
        showCaption: false,//是否显示标题
        browseClass: "btn btn-primary", //按钮样式

        maxFileSize: 10000,
        maxFilesNum: 10,
        enctype: 'multipart/form-data',
        validateInitialCount:true,
        msgFilesTooMany: "选择上传的文件数量({n}) 超过允许的最大数值{m}！",
        //allowedFileTypes: ['image', 'video', 'flash'],
        slugCallback: function (filename) {
            return filename.replace('(', '_').replace(']', '_');
        }
    }).on('filepreupload', function(event, data, previewId, index) {     //上传中
        // console.log('文件正在上传');
    }).on("fileuploaded", function (event, data, previewId, index) {    //一个文件上传成功
        var form = data.form, files = data.files, extra = data.extra,
            response = data.response, reader = data.reader;
        if(response!=null){
            // alert("数据上传成功")
        }
        //get dataResource add sourceStoreId
        that.sourceStoreId=response.data;
        // console.log(response);//打印出返回的json
        // console.log(response.status);//打印出路径


    }).on('fileerror', function(event, data, msg) {  //一个文件上传失败
        // console.log('文件上传失败！'+data.status);
    });








    $('#tree').treeview({data: this.getTree()});

    $('#tree').on('nodeSelected', function(event, data) {
        var parent=$('#tree').treeview('getNode', data.parentId);
        if($("#classification").val()!=null){
            $("#classification").val('')
        }
        that.classif.push(data.text);

        $("#classification").val(that.classif);
    });
    tinymce.init({
        selector: "textarea#detail",
        height: 205,
        theme: 'modern',
        plugins: ['link', 'table', 'image', 'media'],
        image_title: true,
        // enable automatic uploads of images represented by blob or data URIs
        automatic_uploads: true,
        // URL of our upload handler (for more details check: https://www.tinymce.com/docs/configure/file-image-upload/#images_upload_url)
        // images_upload_url: 'postAcceptor.php',
        // here we add custom filepicker only to Image dialog
        file_picker_types: 'image',

        file_picker_callback: function (cb, value, meta) {
            var input = document.createElement('input');
            input.setAttribute('type', 'file');
            input.setAttribute('accept', 'image/*');
            input.onchange = function () {
                var file = input.files[0];

                var reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = function () {
                    var img = reader.result.toString();
                    cb(img, {title: file.name});
                }
            };
            input.click();
        },
        images_dataimg_filter: function (img) {
            return img.hasAttribute('internal-blob');
        }
    });


    $(".step2").steps({

        onFinish: function () {
            alert('complete');
        },
        onChange: function (currentIndex, newIndex, stepDirection) {


            // console.log(currentIndex, newIndex, stepDirection)
            // if((that.indexStep==0&&that.newStep==1)||(that.indexStep==1&&that.newStep==2)){
            //     that.indexStep=-1;
            //     that.newStep-=1;
            //     return true
            // }else {
            //
            //     return false
            // }

            if (currentIndex === 0) {
                if (stepDirection === "forward") {
                    if ($("#dataname").val().length == 0 || that.classif.length == 0 || $("#keywords").tagsinput('items').length == 0) {
                        alert('Attention:Please complete data information!');
                        return false;
                    }else {
                        return true;
                    }

                }
            }

            if (currentIndex === 1) {
                if (stepDirection === "forward") {
                    if ($("#description").val().length == 0) {
                        alert('Attention:Please complete data information!');
                        return false;
                    } else {
                        return true;
                    }

                }
            }

        }
    });

    $("#imgChange").click(function () {
        $("#imgFile").click();
    });
    $("#imgFile").change(function () {
        //获取input file的files文件数组;
        //$('#filed')获取的是jQuery对象，.get(0)转为原生对象;
        //这边默认只能选一个，但是存放形式仍然是数组，所以取第一个元素使用[0];
        var file = $('#imgFile').get(0).files[0];
        //创建用来读取此文件的对象
        var reader = new FileReader();
        //使用该对象读取file文件
        reader.readAsDataURL(file);
        //读取文件成功后执行的方法函数
        reader.onload = function (e) {
            //读取成功后返回的一个参数e，整个的一个进度事件
            //选择所要显示图片的img，要赋值给img的src就是e中target下result里面
            //的base64编码格式的地址
            $('#imgShow').get(0).src = e.target.result;
            $('#imgShow').show();

            that.data_img.push(e.target.result)

        }
    });




}
});
//http://localhost:8081/file/upload/store_dataResource_files
//http://localhost:8081/file/apk_upload

$(function () {

    //数据项点击样式事件
    $(".filecontent .el-card").on('click',function (e) {

        $(".filecontent .browsermenu").hide();

        $(this).addClass("clickdataitem");


        $(this).siblings().removeClass("clickdataitem");

    });
    //数据项右键菜单事件
    $(".filecontent .el-card").contextmenu(function (e) {

        e.preventDefault();



        $(".browsermenu").css({
            "left":e.pageX,
            "top":e.pageY
        }).show();


    });

    //下载全部按钮为所有数据项添加样式事件
    $(".dall").click(function () {
        $(".dataitemisol").addClass("clickdataitem")


    });

    //搜索结果样式效果和菜单事件
    $("#browsercont").on('click',function (e) {

        $(".el-card.dataitemisol.is-never-shadow.sresult").click(function () {
            $(this).addClass("clickdataitem");

            $(this).siblings().removeClass("clickdataitem");

        });


        $(".el-card.dataitemisol.is-never-shadow.sresult").contextmenu(function () {

            $(".browsermenu").css({
                "left":e.pageX,
                "top":e.pageY
            }).show();

        })

        //光标移入输入框隐藏数据项右键菜单
        $("#searchinput").on("mouseenter",function () {
            $(".browsermenu").hide();
        });



    });



    //authorship
    //作者添加
    var user_num = 1;
    $(".user-add").click(function () {
        user_num++;
        var content_box = $(this).parent().children('div');
        var str = "<div class='panel panel-primary'> <div class='panel-heading'> <h4 class='panel-title'> <a class='accordion-toggle collapsed' style='color:white' data-toggle='collapse' data-target='#user";
        str += user_num;
        str += "' href='javascript:;'> NEW </a> </h4><a href='javascript:;' class='fa fa-times author_close' style='float:right;margin-top:8px;color:white'></a></div><div id='user";
        str += user_num;
        str += "' class='panel-collapse collapse in'><div class='panel-body user-contents'> <div class='user-attr'>\n" +
            "                                                                                                    <div>\n" +
            "                                                                                                        <lable class='control-label col-sm-2 text-center'\n" +
            "                                                                                                               style='font-weight: bold;'>\n" +
            "                                                                                                            Name:\n" +
            "                                                                                                        </lable>\n" +
            "                                                                                                        <div class='input-group col-sm-10'>\n" +
            "                                                                                                            <input type='text'\n" +
            "                                                                                                                   name=\"name\"\n" +
            "                                                                                                                   class='form-control'>\n" +
            "                                                                                                        </div>\n" +
            "                                                                                                    </div>\n" +
            // "                                                                                                    <div style=\"margin-top:10px\">\n" +
            // "                                                                                                        <lable class='control-label col-sm-2 text-center'\n" +
            // "                                                                                                               style='font-weight: bold;'>\n" +
            // "                                                                                                            Affiliation:\n" +
            // "                                                                                                        </lable>\n" +
            // "                                                                                                        <div class='input-group col-sm-10'>\n" +
            // "                                                                                                            <input type='text'\n" +
            // "                                                                                                                   name=\"affiliation\"\n" +
            // "                                                                                                                   class='form-control'>\n" +
            // "                                                                                                        </div>\n" +
            // "                                                                                                    </div>\n" +
            "                                                                                                    <div style=\"margin-top:10px\">\n" +
            "                                                                                                        <lable class='control-label col-sm-2 text-center'\n" +
            "                                                                                                               style='font-weight: bold;'>\n" +
            "                                                                                                            Email:\n" +
            "                                                                                                        </lable>\n" +
            "                                                                                                        <div class='input-group col-sm-10'>\n" +
            "                                                                                                            <input type='text'\n" +
            "                                                                                                                   name=\"email\"\n" +
            "                                                                                                                   class='form-control'>\n" +
            "                                                                                                        </div>\n" +
            "                                                                                                    </div>\n" +
            "                                                                                                    <div style=\"margin-top:10px\">\n" +
            "                                                                                                        <lable class='control-label col-sm-2 text-center'\n" +
            "                                                                                                               style='font-weight: bold;'>\n" +
            "                                                                                                            Home Page:\n" +
            "                                                                                                        </lable>\n" +
            "                                                                                                        <div class='input-group col-sm-10'>\n" +
            "                                                                                                            <input type='text'\n" +
            "                                                                                                                   name=\"homepage\"\n" +
            "                                                                                                                   class='form-control'>\n" +
            "                                                                                                        </div>\n" +
            "                                                                                                    </div>\n" +
            "                                                                                                </div></div> </div> </div>"
        content_box.append(str)
    })




})
