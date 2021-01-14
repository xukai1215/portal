let vue = new Vue({
    el:'#app',
    data: function (){
        return {
            windowHeight: window.innerHeight,
            applicationInfo:'',
            invokeService:'',
            user:'',
            contributorInfo:'',
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
            resultData:{},
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
            // dataType:'',//标识localData、onlineData
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
            fileOrder:'',
            value:'',
            // initParameter:''

            addOutputToMyDataVisible: false,
            outputToMyData:'',
            selectedPath:'',
            selectedFileIndex:0,
            outputFolderTree: [{
                id: 1,
                label: 'All Folder',
                children: [{
                    id: 4,
                    label: '二级 1-1',
                    children: [{
                        id: 9,
                        label: '三级 1-1-1'
                    }, {
                        id: 10,
                        label: '三级 1-1-2'
                    }]
                }]
            }],

        }
    },
    methods:{
        initSize() {
            this.windowHeight = document.body.clientHeight - 129;
            console.log(this.windowHeight);
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
        goPersonCenter(userName) {
            window.open("/profile/" + userName);
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
            let parameters = [];
            for(let i=0;i<this.metaDetail.parameter.length;i++){
                parameters.push(this.metaDetail.parameter[i].value);
            }
            formData.append("dataApplicationId", this.applicationOid);
            formData.append("serviceId",this.serviceId);
            formData.append("serviceName",this.invokeService.name);
            formData.append("params",parameters);
            // formData.append("dataType",this.dataType);//标识那三种数据来源，测试数据、上传容器数据（数据容器返回的数据id）以及数据url（目前是数据容器的url）

            // if(this.dataType!='localData'){
                formData.append("selectData", JSON.stringify(this.metaDetail.input));//此项为可选，可有可无
            // }
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
                        // that.resultData = json.data.invokeService;
                        that.dataServerTask = json.data.task;
                        if(json.data == null){
                            that.loading = false;
                            that.$message({
                                type:"error",
                                message: 'Invoke failed!',
                            })
                        }else {
                            that.outPutData = that.dataServerTask.outputs;
                            let str = this.outPutData[0].tag + '.' + this.outPutData[0].suffix;
                            that.resultData.name = str;
                            that.resultData.url = this.outPutData[0].url;
                            that.value = that.resultData.name;
                            that.loading = false;
                            that.invokeDialog = false;
                            that.$message({
                                type: "success",
                                message: 'Invoke Success!',
                            })
                        }
                    }else if(json.code === 1){
                        this.loading = false;
                        that.$message({
                            type: "error",
                            message: 'Invoke failed, Service Node Is Error!',
                        })
                    }else if(json.code === -2){
                        this.loading = false;
                        that.$message({
                            type: "error",
                            message: 'Invoke failed, SDK Is Error!',
                        })
                    }
                }
            });
        },
        downloadResult(){
            window.location.href = this.resultData.url;
        },
        handleClick(tab, event) {
            console.log(tab, event);
            this.$nextTick(()=>{
                this.$refs.userDataSpace.getFilePackage();
            })
        },
        openDataSpace(event){
            this.loadDataVisible = true;
            let refLink=$(".uploadBtn");
            for(let i=0;i<refLink.length;i++){
                if(event.currentTarget===refLink[i]){
                    this.fileOrder = i;
                }
            }
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
                    // this.dataType = 'testData';
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
                    // that.dataType = "uploadData";
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
            this.metaDetail.input[this.fileOrder].loadName = name;
            this.metaDetail.input[this.fileOrder].url = this.selectedFile[0].url;
            // for (let i=0;i<this.metaDetail.input.length;i++){
            //     if(this.metaDetail.input[i].name === name){
            //
            //         break;
            //     }
            // }
            this.selectedFile = [];//置空
            // this.dataType = 'onlineData';
        },
        removeDataspaceFile(file) {
            this.targetFile = {}
        },
        loadTestData(){
            let that = this;
            this.loadingData = true;
            //分为load本地测试数据与其他节点的数据
            // if(this.isPortal){
            //     //门户节点的测试数据load，主要还是从testData里拿数据
            //     if(this.metaDetail.input.length!=this.testData.length){
            //         this.$message({
            //             message: 'data numbers not match',
            //             type: 'warning'
            //         });
            //     }
            //     var len = 0;
            //
            //     for(let i=0;i<this.testData.length;i++){
            //         let data = {
            //             url:this.testData[i].url,
            //             name:this.testData[i].name,
            //         };
            //         this.selectData.push(data);
            //         for(let j=0;j<this.metaDetail.input.length;j++){
            //             if(this.testData[i].name === this.metaDetail.input[j].name){
            //                 len++;
            //                 this.metaDetail.input[j].url = this.testData[i].url;
            //                 this.metaDetail.input[j].loadName = this.testData[i].name;
            //                 break;
            //             }
            //         }
            //         tempArray = Object.assign([],this.metaDetail.input)
            //         this.$set(this.metaDetail, "input", tempArray);
            //         this.dataType = 'localData';
            //         this.loadingData = false;
            //     }
            //     if(len != this.testData.length){
            //         this.$message({
            //             message: 'data numbers match failed',
            //             type: 'warning'
            //         });
            //     }
            // }else {
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
                                        let name1 = that.metaDetail.input[i].name.split('.');
                                        let name2 = fileInfo[j].file_name.split('.');

                                        if (name1[name1.length-1] === name2[name2.length-1]){
                                            that.metaDetail.input[i].loadName = fileInfo[j].file_name;
                                            that.metaDetail.input[i].url = fileInfo[j].url;
                                            break;
                                        }
                                    }
                                }
                                tempArray = Object.assign([],that.metaDetail.input)
                                that.$set(this.metaDetail, "input", tempArray);
                                // that.dataType = 'onlineData';
                            }
                            that.loadingData = false;
                        }
                    })
            // }
            // this.loading = false;


        },
        confirmData(){

        },
        initPicture(){
            // let url = this.invokeService.cacheUrl;
            this.visualPath = this.resultData.url;
            this.visualization = true;
            // let formData=new FormData();
            // var that = this;
            // formData.append("dataUrl",this.dataServerTask.output.output);
            // formData.append("taskId",this.dataServerTask.oid);
            //
            // axios.post("/dataApplication/initPicture",formData).then((res)=>{
            //     if(res.status === 200){
            //         console.log(res.data.data);
            //         that.visualPath = res.data.data.visualPath;
            //         that.visualization = true;
            //     }
            // })
        },
        selectChanged(value){
            // alert(value);
            for(let i=0;i<this.outPutData.length;i++){
                let str = this.outPutData[i].tag + '.' + this.outPutData[i].suffix;
                if(value === str){
                    this.selectedFileIndex = i;
                    this.resultData.name = value;
                    this.resultData.url = this.outPutData[i].url;
                    break;
                }
            }
        },
        addOutputToMyData(output) {
            this.outputToMyData = this.outPutData[this.selectedFileIndex]
            this.addOutputToMyDataVisible = true
            this.selectedPath = [];
            let that = this
            axios.get("/user/getFolder", {})
                .then(res => {
                    let json = res.data;
                    if (json.code == -1) {
                        alert("Please login first!")
                        window.sessionStorage.setItem("history", window.location.href);
                        window.location.href = "/user/login"
                    } else {
                        that.outputFolderTree = res.data.data;
                        that.selectPathDialog = true;
                        that.$nextTick(()=>{
                            that.$refs.folderTree.setCurrentKey(null); //打开树之前先清空选择
                        })
                    }


                });
        },
        addFolderinTree(pageIndex,index){
            let node, data

            data = this.$refs.folderTree2.getCurrentNode();
            if (data == undefined || data == null) alert('Please select a file directory')
            node = this.$refs.folderTree2.getNode(data);

            let folderExited = data.children

            console.log(node);
            let paths=[];
            while(node.key!=undefined&&node.key!=0){
                paths.push(node.key);
                node=node.parent;
            }
            if(paths.length==0) paths.push('0')
            console.log(paths)

            var newChild={id:""}

            this.$prompt(null, 'Enter Folder Name', {
                confirmButtonText: 'OK',
                cancelButtonText: 'Cancel',
                // inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
                // inputErrorMessage: '邮箱格式不正确'
            }).then(({ value }) => {
                if(folderExited.some((item)=>{
                    return  item.label===value;
                })==true){
                    alert('this name is existing in this path, please input a new one');
                    return
                }

                $.ajax({
                    type: "POST",
                    url: "/user/addFolder",
                    data: {paths: paths, name: value},
                    async: false,
                    contentType: "application/x-www-form-urlencoded",
                    success: (json) => {
                        if (json.code == -1) {
                            alert("Please login first!")
                            window.sessionStorage.setItem("history", window.location.href);
                            window.location.href = "/user/login"
                        }
                        else {
                            newChild = {id: json.data, label: value, children: [], father: data.id ,package:true,suffix:'',upload:false, url:'',};
                            if (!data.children) {
                                this.$set(data, 'children', []);
                            }
                            data.children.push(newChild);

                            setTimeout(()=>{
                                this.$refs.folderTree2.setCurrentKey(newChild.id)
                            },100)
                        }

                    }

                });


            }).then(()=>{

            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: 'Cancel'
                });
            });



        },
        addOutputToMyDataConfirm() {
            let data = this.$refs.folderTree2.getCurrentNode();
            let node = this.$refs.folderTree2.getNode(data);

            while (node.key != undefined && node.key != 0) {
                this.selectedPath.unshift(node);
                node = node.parent;
            }
            let allFder = {
                key: '0',
                label: 'All Folder'
            }
            this.selectedPath.unshift(allFder)
            console.log(this.selectedPath)

            this.uploadInPath = 0
            let obj = {
                label: this.outputToMyData.tag,
                suffix: this.outputToMyData.suffix,
                url: this.outputToMyData.url,
                // templateId:this.outputToMyData.templateId,
            }

            this.addDataToPortalBack(obj)
            this.addOutputToMyDataVisible = false
        },
        addDataToPortalBack(item){//item为undefined,则为用户上传；其他为页面已有数据的上传、修改路径

            var addItem=[]
            if(item instanceof Array) {
                addItem=item;
                // for(let i=0;i<addItem.length;i++)
                //     addItem[i].file_name=this.splitFirst(addItem[i].file_name,'&')[1]
            }
            else{
                let obj={
                    file_name:item.label+'.'+item.suffix,
                    label:item.label,
                    suffix:item.suffix,
                    source_store_id:item.url.split('/')[item.url.split('/').length-1],
                    // templateId:item.templateId,
                    upload:'false'
                }
                if(item.url==='') obj.source_store_id = '';
                addItem[0]=obj
            }
            let paths=[]
            if(this.uploadInPath==1){
                let i=this.pathShown.length-1;
                while (i>=0) {
                    paths.push(this.pathShown[i].id);
                    i--;
                }
                if(paths.length==0)paths=['0']

            }else{
                if(this.selectedPath.length==0) {
                    alert('Please select a folder')
                    return
                }

                let i=this.selectedPath.length-1;//selectPath中含有all folder这个不存在的文件夹，循环索引有所区别
                while (i>=1) {
                    paths.push(this.selectedPath[i].key);
                    i--;
                }
                if(paths.length==0)paths=['0']
            }
            let that = this;
            $.ajax({
                type: "POST",
                url: "/user/addFile",
                data: JSON.stringify({
                    files: addItem,
                    paths: paths
                }),

                async: true,
                traditional:true,
                contentType: "application/json",
                success: (json) => {
                    if (json.code == -1) {
                        alert("Please login first!")
                        window.sessionStorage.setItem("history", window.location.href);
                        window.location.href = "/user/login"
                    }else{
                        this.$message({
                            message: 'Upload successfully!',
                            type: 'success'
                        });
                    }


                }
            });

            // alert('Upload File successfully!')


        },
        getContributorInfo(){
            let that = this;

        }
    },
    mounted(){
        let that = this;
        window.addEventListener("resize", this.initSize);
        this.initSize();
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
                $.ajax({
                    url:"/dataApplication/getContributorInfo/" + that.invokeService.contributor,
                    type:"GET",
                    success:(json) =>{
                        if (json.code == 0){
                            that.contributorInfo = json.data;
                        }
                    }
                })
                //处理portal的 testData，加name属性
                // if(that.isPortal == true){
                //     for (let i=0;i<that.testData.length;i++){
                //         let path = that.testData[i].path;
                //         let str = path.split('/');
                //         let name = str[str.length-1];
                //         that.testData[i].name = name;
                //     }
                // }
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
