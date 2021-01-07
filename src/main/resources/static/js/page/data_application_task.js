let vue = new Vue({
    el:'#app',
    data: function (){
        return {
            applicationInfo:'',
            invokeService:'',
            user:'',
            applicationOid:'',
            testStep:{
                state:{
                    name:1,
                    desc:'this is a test step'
                }
            },
            loadDataVisible:false,
            testData:'',
            input:'',
            xml:'',
            // parameters:'',
            invokeDialog:false,
            parameter:'',
            loading:false,
            resultData:'',
            outPutData:'',
            serviceId:'',
            isPortal:'',
            onlineStatus:'',
            activeName:'first',
            // currUrl:[],
            selectData:[{
                url:'',
                name:''
            }],//载入的数据url以及名称，不管是测试数据、上传数据还是直接填入的link，均存到这个字段
            dataType:'',//标识localData、onlineData
            uploadName:'',
            contDtId:'',//上传到数据容器返回的数据id
            selectedFile:[],//userDataSpace中选择的文件

            metaDetail:{

            },
            method:'',
            visualization:false,
            loadingData:false,
            dataServerTask:'',
            visualPath:'',
            // initParameter:''


        }
    },
    methods:{
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
        goPersonCenter(oid) {
            window.open("/user/" + oid);
        },
        invokeNow(){
            let that = this;
            //判断参数是否已填
            if(null==this.metaDetail.input[0].loadName){
                this.$message({
                    type:"error",
                    message:"No data loaded"
                })
                return ;
            }
            if(this.metaDetail.parameter.length!=0){
                for(let i=0;i<this.metaDetail.parameter.length;i++){
                    if(null == this.metaDetail.parameter[i].value){
                        this.$message({
                            type:"error",
                            message:"Please improve the parameters!"
                        })
                        return ;
                    }
                }
            }

            this.loading = true;
            let formData = new FormData();
            let parameters = new Array();
            for(let i=0;i<this.metaDetail.parameter.length;i++){
                parameters.push(this.metaDetail.parameter[i].value);
            }
            formData.append("dataApplicationId", this.applicationOid);
            formData.append("serviceId",this.serviceId);
            formData.append("serviceName",this.invokeService.name);
            formData.append("params",parameters);
            formData.append("dataType",this.dataType);//标识那三种数据来源，测试数据、上传容器数据（数据容器返回的数据id）以及数据url（目前是数据容器的url）

            if(this.dataType!='localData'){
                formData.append("selectData", JSON.stringify(this.metaDetail.input));//此项为可选，可有可无
            }
            $.ajax({
                url:"/dataApplication/invokeMethod",
                type:"POST",
                data:formData,
                processData: false,
                contentType: false,
                success:(json)=>{
                    if (json.code === -1){
                        window.location.href = "/user/login";
                    }else if (json.code === 0){
                        console.log(json);
                        that.resultData = json.data.invokeService;
                        that.dataServerTask = json.data.task;
                        if(json.data == null){
                            that.$message({
                                type:"error",
                                message: 'Invoke failed!',
                            })
                        }else {
                            that.outPutData = "OutData";
                            this.loading = false;
                            that.invokeDialog = false;
                            that.$message({
                                type: "success",
                                message: 'Invoke Success!',
                            })
                        }
                    }else if(json.code === 1){
                        that.$message({
                            type: "error",
                            message: 'Invoke failed, Service Node Is Error!',
                        })
                    }
                }
            });
        },
        downloadResult(){
            window.location.href = this.resultData.cacheUrl;
        },
        handleClick(tab, event) {
            console.log(tab, event);
            this.$nextTick(()=>{
                this.$refs.userDataSpace.getFilePackage();
            })
        },
        openDataSpace(event){
            this.loadDataVisible = true;
            this.$nextTick(()=>{
                this.$refs.userDataSpace.getFilePackage();
            })
        },
        downloadTestData(event){
            let refLink=$(".downloadBtn");
            for(let i=0;i<refLink.length;i++){
                if(event.currentTarget===refLink[i]){
                    console.log(this.testData[i].url);
                    window.location.href = this.testData[i].url;
                    break;
                }
            }
        },
        //待删
        selectTestData(event){
            let refLink=$(".SelectTestData");
            for(let i=0;i<refLink.length;i++){
                if(event.currentTarget===refLink[i]){
                    this.selectData.splice(0,1);
                    console.log(this.testData[i].url);
                    this.testData[i].loadStatus = "true";
                    let data = {
                        url:this.testData[i].url,
                        name:this.testData[i].name,
                    }
                    this.selectData.push(data);
                    this.dataType = 'testData';
                    this.loadDataVisible = false;
                    break;
                }
            }
        },
        downLoadInfoTestData(event){
            let refLink=$(".downloadInfoBtn");
            for(let i=0;i<refLink.length;i++){
                if(event.currentTarget===refLink[i]){
                    window.location.href = this.metaDetail.input[i].url;
                    break;
                }
            }
        },
        submitUpload(){
            let that = this;
            let formData = new FormData();

            let configContent = "<UDXZip><Name>";
            for(let index in this.uploadFiles){
                configContent+="<add value='"+this.uploadFiles[index].name+"' />";
                formData.append("ogmsdata", this.uploadFiles[index].raw);
            }
            configContent += "</Name>";
            if(this.selectValue!=null&&this.selectValue!="none"){
                configContent+="<DataTemplate type='id'>";
                configContent+=this.selectValue;
                configContent+="</DataTemplate>"
            }
            else{
                configContent+="<DataTemplate type='none'>";
                configContent+="</DataTemplate>"
            }
            configContent+="</UDXZip>";
            // console.log(configContent)
            let configFile = new File([configContent], 'config.udxcfg', {
                type: 'text/plain',
            });
            //必填参数：name,userId,serverNode,origination,

            //test参数
            formData.append("ogmsdata", configFile);
            formData.append("name",this.uploadName);
            formData.append("userId","33");
            formData.append("serverNode","china");
            formData.append("origination","developer");
            $.ajax({
                url: "/dataApplication/uploadData",
                type:"POST",
                cache: false,
                processData: false,
                contentType: false,
                async: true,
                data:formData,
            }).done((res)=>{
                if (res.code === 0){
                    let data = res.data.data;
                    that.contDtId = data.source_store_id;
                    that.selectData.splice(0,1);
                    that.selectData.push({
                        name: that.uploadName,
                        url: "http://111.229.14.128:8899/data?uid=" + that.contDtId
                    });
                    that.dataType = "uploadData";
                    that.loadDataVisible = false;
                    this.$message.success('Upload success');
                }else{
                    this.$message.error('Upload failed');
                }
                console.log(res);
            }).fail((res)=>{
                this.$message.error('Upload failed');
                console.log(res);
            })
        },
        uploadChange(file, fileList) {
            console.log(fileList);
            this.uploadFiles = fileList;
        },
        selectDataspaceFile(file){
            if (this.selectedFile.indexOf(file) > -1) {
                for (var i = 0; i < this.selectedFile.length; i++) {
                    if (this.selectedFile[i] === file) {
                        //删除
                        this.selectedFile.splice(i, 1);
                        // this.downloadDataSetName.splice(i, 1)
                        break
                    }
                }
            } else {
                this.selectedFile.push(file);
            }

            let name = this.selectedFile[0].label + '.' + this.selectedFile[0].suffix;
            for (let i=0;i<this.metaDetail.input.length;i++){
                if(this.metaDetail.input[i].name === name){
                    this.metaDetail.input[i].loadName = name;
                    this.metaDetail.input[i].url = this.selectedFile[0].url;
                    break;
                }
            }
            this.selectedFile = [];//置空
            this.dataType = 'onlineData';
        },
        removeDataspaceFile(file) {
            this.targetFile = {}
        },
        loadTestData(){
            let that = this;
            this.loadingData = true;
            //分为load本地测试数据与其他节点的数据
            if(this.isPortal){
                //门户节点的测试数据load，主要还是从testData里拿数据
                if(this.metaDetail.input.length!=this.testData.length){
                    this.$message({
                        message: 'data numbers not match',
                        type: 'warning'
                    });
                }
                var len = 0;

                for(let i=0;i<this.testData.length;i++){
                    let data = {
                        url:this.testData[i].url,
                        name:this.testData[i].name,
                    };
                    this.selectData.push(data);
                    for(let j=0;j<this.metaDetail.input.length;j++){
                        if(this.testData[i].name === this.metaDetail.input[j].name){
                            len++;
                            this.metaDetail.input[j].url = this.testData[i].url;
                            this.metaDetail.input[j].loadName = this.testData[i].name;
                            break;
                        }
                    }
                    tempArray = Object.assign([],this.metaDetail.input)
                    this.$set(this.metaDetail, "input", tempArray);
                    this.dataType = 'localData';
                    this.loadingData = false;
                }
                if(len != this.testData.length){
                    this.$message({
                        message: 'data numbers match failed',
                        type: 'warning'
                    });
                }
            }else {
                //绑定节点的load数据则需要用接口获取服务测试数据信息
                axios.get("/dataApplication/getRemoteDataInfo/" + this.serviceId + "/" + encodeURIComponent(encodeURIComponent(this.invokeService.token)))
                    .then((res)=>{
                        if(res.status === 200){
                            if (res.data.code === -1){
                                this.$message({
                                    message: 'node offline',
                                    type: 'error'
                                });
                            }else if(res.data.code == 0){
                                console.log(res.data);
                                console.log(that.metaDetail.input);
                                let fileInfo = res.data.data.id;
                                for(let i=0;i<that.metaDetail.input.length;i++){
                                    for (let j=0;j<fileInfo.length;j++){
                                        if (that.metaDetail.input[i].name === fileInfo[j].file_name){
                                            that.metaDetail.input[i].loadName = fileInfo[j].file_name;
                                            that.metaDetail.input[i].url = fileInfo[j].url;
                                            break;
                                        }
                                    }
                                }
                                tempArray = Object.assign([],that.metaDetail.input)
                                that.$set(this.metaDetail, "input", tempArray);
                                that.dataType = 'onlineData';
                            }
                            that.loadingData = false;
                        }
                    })
            }
            // this.loading = false;


        },
        confirmData(){

        },
        initPicture(){
            // let url = this.invokeService.cacheUrl;
            let formData=new FormData();
            var that = this;
            formData.append("dataUrl",this.invokeService.cacheUrl);
            formData.append("taskId",this.dataServerTask.oid);

            axios.post("/dataApplication/initPicture",formData).then((res)=>{
                if(res.status === 200){
                    console.log(res.data.data);
                    that.visualPath = res.data.data.visualPath;
                    that.visualization = true;
                }
            })
        }
    },
    mounted(){
        let that = this;

        let str = window.location.href.split('/')
        //将dataApplicationOid与serviceId切出来
        this.applicationOid = str[str.length-3];
        this.serviceId = str[str.length-2]

        axios.get("/user/getUserInfo")
            .then((res) => {
                if (res.status === 200) {
                    that.user = res.data.data.userInfo
                }

            })

        axios.get("/dataApplication/getServiceInfo/" + this.applicationOid + '/' + this.serviceId).then((res) => {
            if (res.status === 200) {
                that.applicationInfo = res.data.data.application;
                that.method = that.applicationInfo.method;
                that.testData = res.data.data.testData;

                that.invokeService = res.data.data.service;
                window.document.token = that.invokeService.token;
                that.isPortal = that.invokeService.isPortal;
                //处理portal的 testData，加name属性
                if(that.isPortal == true){
                    for (let i=0;i<that.testData.length;i++){
                        let path = that.testData[i].path;
                        let str = path.split('/');
                        let name = str[str.length-1];
                        that.testData[i].name = name;
                    }
                }
            }
        })
        axios.get("/dataApplication/getParemeter/" + this.applicationOid +'/' + this.serviceId).then((res) => {
            if (res.status === 200) {
                console.log(res.data);
                that.metaDetail = res.data.data.capability.data.metaDetail;
            }
        })

    },
    created(){

    },
})
