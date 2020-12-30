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
            parameters:'',
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
            dataType:'',//标识testData、uploadData、linkData
            uploadName:'',
            contDtId:'',//上传到数据容器返回的数据id
            selectedFile:[],//userDataSpace中选择的文件


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
            this.loading = true;
            let that = this;
            let formData = new FormData();
            formData.append("dataApplicationId", this.applicationOid);
            formData.append("serviceId",this.serviceId);
            formData.append("params",this.parameter);
            formData.append("dataType",this.dataType);//标识那三种数据来源，测试数据、上传容器数据（数据容器返回的数据id）以及数据url（目前是数据容器的url）

            if(this.dataType!='testData'){
                formData.append("selectData", JSON.stringify(this.selectData));//此项为可选，可有可无
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
                    }else {
                        console.log(json);
                        that.resultData = json.data;
                        that.outPutData = "OutData";
                        this.loading = false;
                        that.invokeDialog = false;
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
                    window.location.href = this.selectData[i].url;
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
        openDataSpace(){
            this.dialogVisible = true;
            this.$nextTick(()=>{
                this.$refs.userDataSpace.getFilePackage();
            })
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
            this.selectData.splice(0,1);
            for (let i=0;i<this.selectedFile.length;i++){
                let obj = {
                    name:this.selectedFile[i].label + '.' + this.selectedFile[i].suffix,
                    url:this.selectedFile[i].url,
                }
                this.selectData.push(obj);
            }
            this.dataType = 'linkData';
        },
        // openDataSpace(){
            // this.$nextTick(()=>{
            //     this.$refs.userDataSpace.getFilePackage();
            // })
        // },
        removeDataspaceFile(file) {
            this.targetFile = {}
        },

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
                that.testData = res.data.data.application.testData;
                //处理testData，加name属性
                for (let i=0;i<that.testData.length;i++){
                    let path = that.testData[i].path;
                    let str = path.split('/');
                    let name = str[str.length-1];
                    that.testData[i].name = name;
                }
                that.invokeService = res.data.data.service;
                window.document.token = that.invokeService.token;
                that.isPortal = that.invokeService.isPortal;
            }
        })
        axios.get("/dataApplication/getParemeter/" + this.applicationOid +'/' + this.serviceId).then((res) => {
            if (res.status === 200) {
                that.parameters = res.data.data.parameters;
                that.xml = res.data.data.xml;
            }
        })

    }
})
