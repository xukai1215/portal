var vue = new Vue({
    el: "#app",
    data: {
        radioStyle:"Classic",
        semanticsActiveStates:[0,1,2,3,4,5,6,7,8,9,10],

        tableLoading: true,
        first: true,
        activeIndex: "3-2",
        activeNameGraph: "Image",
        activeName: "Invoke",
        info: {
            dxInfo: {},
            modelInfo: {},
            taskInfo: {},
            userInfo: {}
        },
        showUpload: false,
        showDataChose: false,
        total: 100,
        dataFromDataContainer: [
            {
                createDate: "2016-05-02",
                name: "test",
                type: "OTHER",
                sourceStoreId: "123123"
            },
            {
                createDate: "2016-05-02",
                name: "test2",
                type: "SHAPEFILE",
                sourceStoreId: "123123"
            },
            {
                createDate: "2016-05-02",
                name: "test",
                type: "GEOTIFF",
                sourceStoreId: "123123"
            }
        ],
        inEvent: [],
        outEvent: [],
        oid: null,

        fileList:[],

        //select data from user
        selectDataDialog:false,
        userOid:'',
        loading:false,
        userData:[],
        totalNum:'',
        page:1,
        pageSize:10,
        sortAsc:false,
        selectData:[],
        keyInput:'',
        modelInEvent:{},
        isFixed:false,
        introHeight:1,

        dataChosenIndex:1,
        detailsIndex:1,
        managerloading:true,
        userTaskInfo:[{
            content:{},
        }],

        downloadDataSet:[],
        downloadDataSetName:[],
        packageContent:{},
        userInfo: {
            runTask:[
                {

                }
            ]
        },
        searchcontent:'',
        databrowser:[],
        loading:'false',
        managerloading:true,
        dataid:'',
        rightMenuShow:false,

        introHeight:1,

        dataItemVisible:false,
        categoryTree:[],
        classifications:[],
        dataItemSearchText:'',
        currentData:{},
        pageOption:{
            page:0,
            pageSize:5,
            asc:false,
            searchResult:[],
            total:0,
        }
    },
    computed: {},
    methods: {
        tableRowKey(row){
            console.log(row)
          return row.name;
        },

        handlePageChange(){

        },
        handleView(){

        },
        selectFromDataItem(event){
            this.eventChoosing = event;
            this.dataItemVisible=true;
        },
        clickData(item,event){
            console.log(item,event)
            if(this.currentData.url!=item.url) {

                this.currentData = item;

                for(let parent of event.path){
                    if(parent.id==item.url){
                        $(".dataitemisol").removeClass("clickdataitem");
                        parent.classList.add("clickdataitem")
                        break;
                    }
                }
            }
            else{
                this.currentData={};
                $(".dataitemisol").removeClass("clickdataitem")
            }
        },
        searchDataItem(){
            this.pageOption.classifications=this.classifications;
            this.pageOption.searchText=this.dataItemSearchText;
            axios.post("/dataItem/searchResourceByNameAndCate/",this.pageOption)
                .then((res)=>{
                    console.log(res)
                    this.pageOption.searchResult=res.data.data.list;
                    this.pageOption.total=res.data.data.total;
                });
        },

        chooseCate(item,e){
            if(this.classifications[0]!=item.id){
                $(".taskDataCate").children().css("color","black")
                e.target.style.color='deepskyblue';
                this.classifications.pop();
                this.classifications.push(item.id);
            }
            else{
                e.target.style.color='black';
                this.classifications.pop();
            }

            this.searchDataItem();

        },

        confirmData(){
            if(this.currentDataUrl!="") {
                this.dataItemVisible=false;
                console.log(this.eventChoosing,this.currentData)
                this.eventChoosing.tag = this.currentData.name;
                this.eventChoosing.url = this.currentData.url;
            }
            else{
                this.$message("Please select data first!")
            }
        },
        downloadData(){
            if(this.currentDataUrl!="") {
                window.open("/dispatchRequest/download?url=" + this.currentData.url);
            }
            else{
                this.$message("Please select data first!")
            }
        },

        initSize(){
            this.$nextTick(() =>{
                let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
                let totalHeight= $('.taskMain').css('height')
                let leftbarHeight= $("#introContainer").css("height");

                if(scrollTop>62){
                    $('#introContainer').addClass("fixed")
                    if(parseInt(totalHeight)-parseInt(scrollTop)+62<parseInt(leftbarHeight)){
                        $('#introContainer').removeClass("fixed")
                        $('#introContainer').addClass("stop")
                    }else{
                        $('#introContainer').removeClass("stop")
                        $('#introContainer').addClass("fixed")
                    }
                }else{
                    $('#introContainer').removeClass("fixed")
                }




            })

        },

        showtitle(ev){
            return ev.fileName+"\n"+"Type:"+ev.suffix;
        },

        generateId(key){
            return key;
        },

        getUserTaskInfo(){
            let { code, data, msg } =  fetch("/user/getUserInfo", {
                method: "GET",
            }).then((response)=>{
                return response.json();
            }).then((data)=>{
                this.userInfo=data.data.userInfo;
                this.userTaskInfo=this.userInfo.runTask;
                console.log(this.userInfo);
                setTimeout(()=>{
                    $('.el-loading-mask').css('display','none');
                },355)

            });

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

        backToPackage(){
            this.detailsIndex=1;
        },

        dateFormat(date, format) {
            let dateObj = new Date(date);
            let fmt = format || "yyyy-MM-dd hh:mm:ss";
            //author: meizz
            var o = {
                "M+": dateObj.getMonth() + 1, //月份
                "d+": dateObj.getDate(), //日
                "h+": dateObj.getHours(), //小时
                "m+": dateObj.getMinutes(), //分
                "s+": dateObj.getSeconds(), //秒
                "q+": Math.floor((dateObj.getMonth() + 3) / 3), //季度
                S: dateObj.getMilliseconds() //毫秒
            };
            if (/(y+)/.test(fmt))
                fmt = fmt.replace(
                    RegExp.$1,
                    (dateObj.getFullYear() + "").substr(4 - RegExp.$1.length)
                );
            for (var k in o)
                if (new RegExp("(" + k + ")").test(fmt))
                    fmt = fmt.replace(
                        RegExp.$1,
                        RegExp.$1.length == 1
                            ? o[k]
                            : ("00" + o[k]).substr(("" + o[k]).length)
                    );
            return fmt;
        },
        uploadData() {
            return {
                host: this.info.dxInfo.dxIP,
                port: this.info.dxInfo.dxPort,
                type: this.info.dxInfo.dxType,
                userName: this.info.userInfo.userName
            };
        },
        handleDataDownloadClick({ sourceStoreId }) {

            window.open("/dispatchRequest/downloadBySourceStoreId?sourceStoreId=" + sourceStoreId);
        },
        handleDataChooseClick({ sourceStoreId, fileName, suffix }) {
            let url =
                "http://172.21.212.64:8082/dataResource/getResource?sourceStoreId=" +
                sourceStoreId;
            this.showDataChose = false;
            this.eventChoosing.tag = fileName + "." + suffix;
            this.eventChoosing.url = url;
        },
        switchClick(i) {
            if (i == 1) {
                $(".tab1").css("display", "block");
                $(".tab2").css("display", "none");
                $(".tab3").css("display", "none");
            } else if (i == 2) {
                $(".tab1").css("display", "none");
                $(".tab2").css("display", "block");
                $(".tab3").css("display", "none");
            } else {
                $(".tab1").css("display", "none");
                $(".tab2").css("display", "none");
                $(".tab3").css("display", "block");
            }

            var btns = $(".switch-btn");

            btns.css("color", "#636363");
            btns.eq(i - 1).css("color", "#428bca");
        },
        init() {},
        inEventList(state) {
            return state.event.filter(value => {
                return value.eventType === "response";
            });
        },
        outEventList(state) {
            return state.event.filter(value => {
                return value.eventType === "noresponse";
            });
        },
        filterTag(value, row) {
            return row.fromWhere === value;
        },
        async loadTest(type) {
            const loading = this.$loading({
                lock: true,
                text: "Loading",
                spinner: "el-icon-loading",
                background: "rgba(0, 0, 0, 0.7)"
            });
            let body = {
                oid: this.oid,
                host: this.info.dxInfo.dxIP,
                port: this.info.dxInfo.dxPort,
                type: this.info.dxInfo.dxType,
                userName: this.info.userInfo.userName
            };
            let { data, code ,msg} = await (await fetch("/task/loadTestData/", {
                method: "post",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            })).json();

            if (code == -1 || code==null || code==undefined) {
                loading.close();
                this.$message.error(msg);
                return;
            }

            data.forEach(el => {
                let stateId = el.stateId;
                let eventName = el.event;
                let state = this.info.modelInfo.states.find(state => {
                    return state.Id == stateId;
                });
                if (state == undefined) return;
                let event = state.event.find(event => {
                    return event.eventName == eventName;
                });
                if (event == undefined) return;
                this.$set(event, "tag", el.tag);
                this.$set(event, "suffix", el.suffix);
                this.$set(event, "url", el.url);
            });
            loading.close();
        },
        goPersonCenter(oid){
            window.open("/user/"+oid);
        },
        download(event) {
            //下载接口
            if(event.url!=undefined) {
                this.eventChoosing = event;
                window.open("/dispatchRequest/download?url=" + this.eventChoosing.url);
            }
            else{
                this.$message.error("No data can be downloaded.");
            }
        },
        upload(event) {
            //上传接口
            this.showUpload = true;
            this.eventChoosing = event;
        },
        beforeRemove(file) {
            return this.$confirm(`确定移除 ${file.name}？`);
        },
        onSuccess({ data }) {
            let { tag,suffix, url } = data;
            this.showUpload = false;
            this.eventChoosing.tag = tag;
            this.eventChoosing.suffix = suffix;
            this.eventChoosing.url = url;
            this.$refs.upload.clearFiles();
        },
        async check(event) {
            if (this.first == true) {
                let d = await this.getTableData(0);
                this.dataFromDataContainer = d.content;
                this.total = d.total;
                this.first = false;
            }
            this.showDataChose = true;
            this.getUserTaskInfo()

            this.eventChoosing = event;
        },
        async handleCurrentChange(val) {
            let d = await this.getTableData(val - 1);
            this.dataFromDataContainer = d.content;
        },
        async getTableData(page) {
            this.tableLoading = true;
            let { data } = await (await fetch(
                "/dispatchRequest/getUserRelatedDataFromDataContainer/?page=" +
                page +
                "&pageSize=10&" +
                "authorName=" +
                this.info.userInfo.userName
            )).json();
            this.tableLoading = false;

            // return {
            //     total: data.totalElements,
            //     content: data.content
            // };
        },

        async invoke() {

            console.log(this.modelInEvent)
            const loading = this.$loading({
                lock: true,
                text: "Model is running, you can check running state and get results in \"User Space\" -> \"Task\"",
                spinner: "el-icon-loading",
                background: "rgba(0, 0, 0, 0.7)"
            });
            let json = {
                oid: this.oid,
                ip: this.info.taskInfo.ip,
                port: this.info.taskInfo.port,
                pid: this.info.taskInfo.pid,
                inputs: []
            };

            try{
                this.info.modelInfo.states.forEach(state => {
                    let statename = state.name;
                    state.event.forEach(el => {
                        let event = el.eventName;
                        let tag = el.tag;
                        let url = el.url;
                        let suffix=el.suffix;
                        if (el.eventType == "response") {
                            if (el.optional) {
                                if(url === null || url === undefined){

                                }else{
                                    json.inputs.push({
                                        statename,
                                        event,
                                        url,
                                        tag,
                                        suffix
                                    });
                                }
                            } else {
                                if (url === null || url === undefined) {
                                    this.$message.error("Some input data is not provided");
                                    throw new Error("Some input data is not provided");
                                }
                                json.inputs.push({
                                    statename,
                                    event,
                                    url,
                                    tag,
                                    suffix
                                });
                            }
                        }
                    });
                });
            }catch(e){
                loading.close();
                return;
            }


            let { data, code, msg } = await (await fetch("/task/invoke", {
                method: "post",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(json)
            })).json();

            if (code == -1) {
                this.$message.error(msg);
                window.open("/user/login");
            }

            if (code == -2) {
                this.$message.error(msg);
                loading.close();
                return;
            }

            let tid = data;

            let interval = setInterval(async () => {
                let { code, data, msg } = await (await fetch("/task/getResult", {
                    method: "post",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        ip: this.info.taskInfo.ip,
                        port: this.info.taskInfo.port,
                        tid: tid
                    })
                })).json();
                if (code === -1) {
                    this.$message.error(msg);
                    clearInterval(interval);
                    loading.close();
                }
                if (data.status === -1) {
                    this.$message.error("Some error occured when this model is running!");
                    clearInterval(interval);
                    loading.close();
                } else if (data.status === 2) {
                    this.$message.success("The model has run successfully!");
                    clearInterval(interval);
                    let outputs = data.outputdata;

                    outputs.forEach(el => {
                        let statename = el.statename;
                        let eventName = el.event;
                        let state = this.info.modelInfo.states.find(state => {
                            return state.name == statename;
                        });
                        if (state == undefined) return;
                        let event = state.event.find(event => {
                            return event.eventName == eventName;
                        });
                        if (event == undefined) return;
                        this.$set(event, "tag", el.tag);
                        this.$set(event, "suffix", el.suffix);
                        this.$set(event, "url", el.url);
                    });

                    loading.close();
                } else {
                }
            }, 5000);
        },


        selectFromMyData(key,modelInEvent) {
            this.selectDataDialog = true
            this.selectData=[]
            this.keyInput=key

            let that=this
            axios.get("/dataManager/list",{
                params:{
                    author:this.useroid,
                    type:"author"
                }

            })
                .then((res)=>{

                    // console.log("oid datas",this.userId,res.data.data)
                    that.userData=res.data.data
                    that.totalNum = res.data.data.totalElements;
                    that.loading = false
                })


            this.modelInEvent=modelInEvent


        },
        currentPage(){

        },

        loadMore(e){

        },
        selectUserData(item,e){
            // console.log(e)
            this.$message("you have selected:  "+item.fileName+'.'+item.suffix);
            if(this.selectData.length===0){
                let d={e,item}
                this.selectData.push(d)
                e.target.style.background='aliceblue'

            }else{
                let e2=this.selectData.pop();

                if(e2.e!=e){

                    let d={e,item}
                    e2.e.target.style.background='';
                    e.target.style.background='aliceblue';
                    this.selectData.push(d)

                }

            }


        },

        showtitle(ev){
            return ev.fileName+"\n"+"Type:"+ev.suffix;
        },
        getImg(item){
            return "/static/img/filebrowser/"+item.suffix+".svg"
        },
        generateId(key){
            return key;
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
                axios.post("http://172.21.212.64:8082/dataResource",data)
                    .then(res=>{
                        if(res.status==200){
                            alert("data upload success")

                            that.addAllData()
                            that.close()
                        }
                    });

            }

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

            if(confirm("Are you sure to delete?")){
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

            if(eval.taskId!=null){
                console.log(eval.taskId)
                this.detailsIndex=2
                this.getOneOfUserTasks(eval.taskId);
            }


        },

        getOneOfUserTasks(taskId){
            $.ajax({
                type:'GET',
                url:"/task/getTaskByTaskId",
                // contentType:'application/json',

                data:
                    {
                        id:taskId,
                    },
                // JSON.stringify(obj),
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
                    }else {
                        setTimeout(()=>{
                            const data = json.data;
                            this.resourceLoad = false;
                            // this.researchItems = data.list;
                            this.packageContent=data;
                            console.log(this.packageContent)
                        },100)



                    }
                }
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

        openWzhRightMenu(e){
            e.preventDefault();

            e.currentTarget.className="el-card dataitemisol clickdataitem"
            console.log(e)

            var dom = document.getElementsByClassName("wzhRightMenu");

            dom[0].style.top = e.pageY -250+"px"
            dom[0].style.left = e.pageX-230 +"px";
            console.log(e.style)
            $('.wzhRightMenu').animate({height:'120'},150);
        },

        myDataClick(index){
            this.dataChosenIndex=index;
        },

        outputDataClick(index){
            this.dataChosenIndex=index;
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

        getTree(){
            return this.tree;
        },


        submitForm (formName) {
            //包含上传的文件信息和服务端返回的所有信息都在这个对象里
            this.$refs.upload.uploadFiles
        },

        confirmSelect(){
            if(this.selectData.length==0){
                this.$message("you have selected no data")
            }else{
                let da=this.selectData.pop()

                let key=this.keyInput
                // $('#datainput'+key)[0].value=da.item.fileName

                this.selectDataDialog = false

                //todo 拼接url
                this.modelInEvent.url="http://172.21.212.64:8082/dataResource/getResource?sourceStoreId="+da.item.sourceStoreId
                this.modelInEvent.tag=da.item.fileName
                
            }


            this.selectData=[]




        }

    },

    async mounted() {

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


        this.introHeight=$('.introContent').attr('height');

        console.log(this.introHeight)
        let ids = window.location.href.split("/");
        let id = ids[ids.length - 1];
        this.oid = id;
        let { data } = await (await fetch("/task/TaskInit/" + id)).json();
        if(data==null||data==undefined){
            alert("Initialization error!")
        }
        this.info = data;
        console.log(this.info);


        //get login user info
        let that=this
        axios.get("/user/load")
            .then((res)=>{
                if(res.status==200){
                    that.useroid=res.data.oid
                }

            })

        window.addEventListener('scroll',this.initSize);
        window.addEventListener('resize',this.initSize);


        //managerUpload

        $("#managerUpload").fileinput({
            theme: 'fas',
            uploadUrl: 'http://172.21.213.194:8082/file/upload/store_dataResource_files', // /file/apk_upload   you must set a valid URL here else you will get an error
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
            uploadUrl: 'http://172.21.213.194:8082/file/upload/store_dataResource_files', // /file/apk_upload   you must set a valid URL here else you will get an error
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
            uploadUrl: 'http://172.21.213.194:8082/file/upload/store_dataResource_files', // /file/apk_upload   you must set a valid URL here else you will get an error
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
            uploadUrl: 'http://172.21.212.64:8082/file/upload/store_dataResource_files', // /file/apk_upload   you must set a valid URL here else you will get an error
            overwriteInitial: false,
            uploadAsync: true, //默认异步上传,
            showUpload: true, //是否显示上传按钮
            showRemove : true, //显示移除按钮
            showPreview : true, //是否显示预览
            showCaption: false,//是否显示标题
            browseClass: "btn btn-primary", //按钮样式
            dropZoneEnabled: true,
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
    },

    destory(){
        window.removeEventListener('scroll',this.initSize);
        window.removeEventListener('resize',this.initSize);
    }


});

$(function () {
    $(window).resize(function(){
        let introHeaderHeight=$('.introHeader').css('width')
        console.log(introHeaderHeight)
        if(parseInt(introHeaderHeight)<240){
            $('.image').css('display','none')
        }else{
            $('.image').css('display','block')
        }
    })

    $('#browsercont2').click((e)=>{
        $('.wzhRightMenu').animate({height:'0'},50);
        console.log($('#browsercont'))

    })


});
