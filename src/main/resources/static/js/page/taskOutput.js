var vue = new Vue({
    el: "#app",
    data: {
        tableLoading: true,
        first: true,
        activeIndex: "3-2",
        activeNameGraph: "Image",
        activeName: "Invoke",
        info: {
            dxInfo: {},
            modelInfo: {},
            taskInfo: {
                ip:'',
                pid:'',
                pott:'',
                outputs:[],
            },
            userInfo: {}
        },
        showUpload: false,
        showDataChose: false,
        shareIndex:false,
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
        taskId:null,
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

        downloadUrl:'',

        renameIndex:false,
        oldTag:'',
        outputTag:'',

        clipBoard:'',
    },
    computed: {},
    methods: {

        initSize(){
            this.$nextTick(() =>{
                let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
                let totalHeight= $('.content').css('height')
                let introHeight=$('.introHeader').css('height')+$('.introContent').css('height')
                let toBottomHeight= parseInt(totalHeight)-parseInt(scrollTop)-parseInt(introHeight)
                if(scrollTop>60){
                    this.isFixed = true;
                }else{
                    this.isFixed = false;
                }
                if(toBottomHeight<300){
                    $('.introContent').css('display','none')
                }else{
                    $('.introContent').css('display','block')
                }



            })

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
            let url =
                "http://172.21.212.64:8082/dataResource/getResource?sourceStoreId=" +
                sourceStoreId;
            window.open("/dispatchRequest/download?url=" + url);
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
                this.$set(event, "url", el.url);
            });
            loading.close();
        },

        goPersonCenter(oid){
            window.open("/user/"+oid);
        },

        share(url){
            this.shareIndex=true;
            this.downloadUrl='http://geomodeling.njnu.edu.cn/dispatchRequest/download?url='+url;

        },

        renameClick(tag){
            this.renameIndex=true;
            this.outputTag=tag;
            oldTag=tag;
        },

        renameTag(){

            for(let i=0;i<this.info.taskInfo.outputs.length;i++){
                console.log(this.info.taskInfo.outputs[i].tag===oldTag)
                if(this.info.taskInfo.outputs[i].tag===oldTag){
                    this.info.taskInfo.outputs[i].tag=this.outputTag;
                    this.renameTagToBack();
                }
            }

        },

        renameTagToBack(){
            $.ajax({
                data:{
                    taskId:this.taskId,
                    outputs:this.info.taskInfo.outputs},
                url:'/task/renameTag',
                type:'POST',
                async:true,
                // tranditional:true,
                // dataType: "json",
                success:(json)=>{
                    if(json.code==0){
                        alert("Add Success");
                    }
                }
                }

            )
        },


        copyLink(){
            console.log(this.clipBoard);
            this.clipBoard.on('success', function () {
                alert('Copy link successly')
                this.clipBoard.destroy()
            });
            this.clipBoard.on('error', function () {
                alert("复制失败")
                this.clipBoard.destroy()
            });
            this.shareIndex=false
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
            let { tag, url } = data;
            this.showUpload = false;
            this.eventChoosing.tag = tag;
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

            return {
                total: data.totalElements,
                content: data.content
            };
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
        this.introHeight=$('.introContent').attr('height');

        let hrefs = window.location.href.split("/");
        let ids = hrefs[hrefs.length - 1];
        let twoIds=ids.split('&')
        let modelId=twoIds[0];
        let taskId=twoIds[1];
        this.oid = modelId;
        this.taskId = taskId;
        console.log(modelId)
        let { data } = await (await fetch("/task/TaskOutputInit/" + ids)).json();
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

        this.clipBoard = new ClipboardJS(".copyLinkBtn");

        window.addEventListener('scroll',this.initSize);
        window.addEventListener('resize',this.initSize);


    },

    destory(){
        window.removeEventListener('scroll',this.initSize);
        window.removeEventListener('resize',this.initSize);
    }
});

(function () {
    $(window).resize(function(){
        let introHeaderHeight=$('.introHeader').css('width')
        if(parseInt(introHeaderHeight)<240){
            $('.image').css('display','none')
        }else{
            $('.image').css('display','block')
        }
    })


})()
