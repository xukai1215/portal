var createComputableModel = Vue.extend({
    template: "#createComputableModel",
    data() {
        return {
            defaultActive: '2-4',
            curIndex: '2',

            computableModel: {
                status:"Public",
                bindModelItem: "",
                bindOid: "",
                name: "",
                description: "",
                contentType: "Package",
                url: "",
                isAuthor: true,
                author: {
                    name: "",
                    ins: "",
                    email: "",
                },
                md5:"",
                deploy:false
            },

            bindModelItemDialogVisible:false,
            pageOption: {
                paginationShow:false,
                progressBar: true,
                sortAsc: false,
                currentPage: 1,
                pageSize: 5,
                searchText: '',
                total: 264,
                searchResult: [],
            },

            userInfo: {},

            //文件框选择
            resources: [],
            fileSelect: '',
            fileArray: new Array(),
            formData: new FormData(),

            ScreenMaxHeight: "0px",
            IframeHeight: "0px",
            editorUrl: "",
            load: false,

            ScreenMinHeight: "0px",

            userId: "",
            userName: "",
            loginFlag: false,

            socket:"",

            computableModel_oid:"",
        }
    },
    methods: {
        selectModelItem(index,info){
            console.log(info);
            this.computableModel.bindModelItem = info.name;
            this.computableModel.bindOid = info.oid;
            this.bindModelItemDialogVisible = false;
        },
        handlePageChange(val) {

            this.pageOption.currentPage = val;

            this.searchModelItem();
        },
        openModelItemDialog(){
            this.pageOption.currentPage = 1;
            this.bindModelItemDialogVisible = true;
            this.searchModelItem();
        },
        searchModelItem(){
            let data = {
                asc: this.pageOption.sortAsc,
                page: this.pageOption.currentPage-1,
                pageSize: this.pageOption.pageSize,
                searchText: this.pageOption.searchText,
                sortType: "default",
                classifications: ["all"],
            };
            let url = "/modelItem/list";
            let contentType = "application/x-www-form-urlencoded";

            $.ajax({
                type: "POST",
                url: url,
                data: data,
                async: true,
                contentType: contentType,
                success: (json) => {
                    if (json.code == 0) {
                        let data = json.data;
                        console.log(data)

                        this.pageOption.total = data.total;
                        this.pageOption.pages = data.pages;
                        this.pageOption.searchResult = data.list;
                        this.pageOption.users = data.users;
                        this.pageOption.progressBar = false;
                        this.pageOption.paginationShow = true;

                    }
                    else {
                        console.log("query error!")
                    }
                }
            })
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
        handleSelect(index,indexPath){
            this.setSession("index",index);
            window.location.href="/user/userSpace"
        },
        changeOpen(n) {
            this.activeIndex = n;
        },
        setSession(name, value) {
            window.sessionStorage.setItem(name, value);
        },
        getSession(name){
            return window.sessionStorage.getItem(name);
        },
        clearSession(){
            window.sessionStorage.clear();
        },

        addFile(){
            if(this.computableModel.contentType == "Package"){
                $("#file").click();
            }else{
                $("#file_multi").click();
            }


        },
        removeFile(){
            if(this.fileSelect!="") {
                $(".dataitemisol").css("border","1px solid #ebeef5")
                let res=this.resources[Number(this.fileSelect)];
                for(i=0;i<this.fileArray.length;i++){
                    let file=this.fileArray[i];
                    if(file.name===res.name&&file.size===res.size&&file.lastModified===res.lastModified&&file.type===res.type){
                        this.fileArray.splice(i,1);
                        break;
                    }
                }
                this.resources.splice(Number(this.fileSelect), 1);
                this.fileSelect = "";
            }
        },
        replaceFile(){
            $("#file").click();
        },
        resClick(e){

            let path=e.path;
            for(i=0;i<path.length;i++){
                let obj=path[i];
                if(obj.className.indexOf("dataitemisol")!=-1){
                    $(".dataitemisol").css("border","1px solid #ebeef5")
                    this.fileSelect=obj.align;
                    obj.style.border='2px solid #60b0e8';
                    break;
                }
            }
        },

        sendcurIndexToParent(){
            this.$emit('com-sendcurindex',this.curIndex)
        },

        sendUserToParent(userId){
            this.$emit('com-senduserinfo',userId)
        },

        init:function () {

            if ('WebSocket' in window) {
                // this.socket = new WebSocket("ws://localhost:8080/websocket");
                this.socket = new WebSocket(websocketAddress);
                // 监听socket连接
                this.socket.onopen = this.open;
                // 监听socket错误信息
                this.socket.onerror = this.error;
                // 监听socket消息
                this.socket.onmessage = this.getMessage;

            }
            else {
                alert('当前浏览器 Not support websocket');
                console.log("websocket 无法连接");
            }
        },
        open: function () {
            console.log("socket连接成功")
        },
        error: function () {
            console.log("连接错误");
        },
        getMessage: function (msg) {
            console.log(msg.data);
        },
        send: function (msg) {
            this.socket.send(msg);
        },
        close: function () {
            console.log("socket已经关闭")
        },

        getMessageNum(computableModel_oid){
            this.message_num_socket = 0;//初始化消息数目
            let data = {
                type: 'computableModel',
                oid : computableModel_oid,
            };

            //根据oid去取该作者的被编辑的条目数量
            $.ajax({
                url:"/theme/getAuthorMessageNum",
                type:"GET",
                data:data,
                async:false,
                success:(json)=>{
                    this.message_num_socket = json;
                }
            });
            let data_theme = {
                type: 'computableModel',
                oid : computableModel_oid,
            };
            $.ajax({
                url:"/theme/getThemeMessageNum",
                async:false,
                type:"GET",
                data:data_theme,
                success:(json)=>{
                    console.log(json);
                    for (let i=0;i<json.length;i++) {
                        for (let k = 0; k < 4; k++) {
                            let type;
                            switch (k) {
                                case 0:
                                    type = json[i].subDetails;
                                    break;
                                case 1:
                                    type = json[i].subClassInfos;
                                    break;
                                case 2:
                                    type = json[i].subDataInfos;
                                    break;
                                case 3:
                                    type = json[i].subApplications;
                                    break;
                            }
                            if (type != null && type.length > 0) {
                                for (let j = 0; j < type.length; j++) {
                                    if (k == 0) {
                                        switch (type[j].status) {
                                            case "0":
                                                this.message_num_socket++;
                                        }
                                    }else if (k == 1){
                                        switch (type[j].status) {
                                            case "0":
                                                this.message_num_socket++;
                                        }
                                    }else if (k == 2){
                                        switch (type[j].status) {
                                            case "0":
                                                this.message_num_socket++;
                                        }
                                    } else if (k == 3){
                                        switch (type[j].status) {
                                            case "0":
                                                this.message_num_socket++;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            })
        },

        getServiceByMd5(){

            $.ajax({
                url:"/task/getServiceByMd5/" + this.computableModel.md5,
                success:function (res) {
                    if (res.code != 0)
                        return

                    if (res.data == null){
                        console.log("Don't find a Service by this MD5!")
                    }

                    console.log(data)
                }

            })
        }
    },
    mounted() {
        let that = this;
        that.init();

        //初始化的时候吧curIndex传给父组件，来控制bar的高亮显示
        this.sendcurIndexToParent()

        $(() => {
            //修改页面元素尺寸
            let height = document.documentElement.clientHeight;
            this.ScreenMinHeight = (height) + "px";
            this.ScreenMaxHeight = (height) + "px";
            this.IframeHeight = (height - 330) + "px";

            let resizeTimer = null;
            let that = this
            window.onresize = () => {
                if (resizeTimer) clearTimeout(resizeTimer);
                resizeTimer = setTimeout(function(){
                    console.log('come on ..');
                    height = document.documentElement.clientHeight;
                    that.ScreenMinHeight = (height) + "px";
                    that.ScreenMaxHeight = (height) + "px";
                    that.IframeHeight = (height - 330) + "px";
                } , 100);
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
                        this.itemIndex=index
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


        $("#file").change(()=> {
            this.fileArray=[];
            this.resources=[];
            let files=$("#file")[0].files;
            let file=files[0];


            let res={};
            res.name=file.name;
            res.path="";
            let names=res.name.split('.');
            res.suffix=names[names.length-1];
            res.size=file.size;
            res.lastModified=file.lastModified;
            res.type=file.type;

            if(res.suffix!=='zip'){
                this.$message({
                    message: 'Please select a zip file!',
                    type: 'error',
                    offset: 70,
                });
            }else{
                this.fileArray.push(file);
                this.resources.push(res);
            }

            //清空
            document.getElementById("file").value='';

        });

        $("#file_multi").change(()=> {
            let files=$("#file_multi")[0].files;
            for(i=0;i<files.length;i++){
                let file=files[i];

                let res={};
                res.name=file.name;
                res.path="";
                let names=res.name.split('.');
                res.suffix=names[names.length-1];
                res.size=file.size;
                res.lastModified=file.lastModified;
                res.type=file.type;
                let exist = false;
                for(j=0;j<this.fileArray.length;j++) {
                    let fileExist = this.fileArray[j];
                    if(fileExist.name==file.name&&fileExist.lastModified == file.lastModified&&fileExist.size == file.size && fileExist.type == file.type){
                        exist = true;
                        break;
                    }
                }
                if(!exist){
                    this.fileArray.push(file);
                    this.resources.push(res);
                }
            }


            //清空
            let file=document.getElementById("file_multi");
            file.value='';
        });

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
                if (data.oid == "") {
                    alert("Please login");
                    window.location.href = "/user/login";
                }
                else{
                    this.userId=data.uid;
                    this.userName=data.name;

                    var bindOid=this.getSession("bindOid");
                    this.computableModel.bindOid=bindOid;
                    $.ajax({
                        type: "Get",
                        url: "/modelItem/getInfo/"+bindOid,
                        data: { },
                        cache: false,
                        async: true,
                        success: (json) => {
                            if(json.data!=null){

                                this.computableModel.bindModelItem=json.data.name;
                                this.clearSession();
                            }
                            else{

                            }
                        }
                    })
                }
            }
        })

        var oid = this.$route.params.editId;//取得所要edit的id

        var user_num = 0;


        if ((oid === "0") || (oid === "") || (oid === null)|| (oid === undefined)) {

            $("#subRteTitle").text("/Create Computable Model")

            initTinymce('textarea#computableModelText')

        }
        else {
            $("#subRteTitle").text("/Modify Computable Model")
            document.title="Modify Computable Model | OpenGMS"
            $.ajax({
                url: "/computableModel/getInfo/" + oid,
                type: "get",
                data: {},

                success: (result) => {
                    window.sessionStorage.setItem("editComputableModel_id", "");
                    console.log(result)
                    var basicInfo = result.data;
                    if(basicInfo.resourceJson!=null)
                    this.resources=basicInfo.resourceJson;

                    this.computableModel.bindModelItem=basicInfo.relateModelItemName;
                    this.computableModel.bindOid=basicInfo.relateModelItem;
                    this.computableModel.status=basicInfo.status;

                    $(".providers").children(".panel").remove();

                    //detail
                    $("#computableModelText").html(basicInfo.detail);

                    initTinymce('textarea#computableModelText')


                    let authorship = basicInfo.authorship;
                    if(authorship!=null) {
                        for (i = 0; i < authorship.length; i++) {
                            user_num++;
                            var content_box = $(".providers");
                            var str = "<div class='panel panel-primary'> <div class='panel-heading newAuthorHeader'> <h4 class='panel-title'> <a class='accordion-toggle collapsed' style='color:white' data-toggle='collapse' data-target='#user";
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
                                "                                                                                                                   class='form-control' value='" +
                                authorship[i].name +
                                "'>\n" +
                                "                                                                                                        </div>\n" +
                                "                                                                                                    </div>\n" +
                                "                                                                                                    <div style=\"margin-top:10px\">\n" +
                                "                                                                                                        <lable class='control-label col-sm-2 text-center'\n" +
                                "                                                                                                               style='font-weight: bold;'>\n" +
                                "                                                                                                            Affiliation:\n" +
                                "                                                                                                        </lable>\n" +
                                "                                                                                                        <div class='input-group col-sm-10'>\n" +
                                "                                                                                                            <input type='text'\n" +
                                "                                                                                                                   name=\"ins\"\n" +
                                "                                                                                                                   class='form-control' value='" +
                                authorship[i].ins +
                                "'>\n" +
                                "                                                                                                        </div>\n" +
                                "                                                                                                    </div>\n" +
                                "                                                                                                    <div style=\"margin-top:10px\">\n" +
                                "                                                                                                        <lable class='control-label col-sm-2 text-center'\n" +
                                "                                                                                                               style='font-weight: bold;'>\n" +
                                "                                                                                                            Email:\n" +
                                "                                                                                                        </lable>\n" +
                                "                                                                                                        <div class='input-group col-sm-10'>\n" +
                                "                                                                                                            <input type='text'\n" +
                                "                                                                                                                   name=\"email\"\n" +
                                "                                                                                                                   class='form-control' value='" +
                                authorship[i].email +
                                "'>\n" +
                                "                                                                                                        </div>\n" +
                                "                                                                                                    </div>\n" +
                                "                                                                                                    <div style=\"margin-top:10px\">\n" +
                                "                                                                                                        <lable class='control-label col-sm-2 text-center'\n" +
                                "                                                                                                               style='font-weight: bold;'>\n" +
                                "                                                                                                            Homepage:\n" +
                                "                                                                                                        </lable>\n" +
                                "                                                                                                        <div class='input-group col-sm-10'>\n" +
                                "                                                                                                            <input type='text'\n" +
                                "                                                                                                                   name=\"homepage\"\n" +
                                "                                                                                                                   class='form-control' value='" +
                                authorship[i].homepage +
                                "'>\n" +
                                "                                                                                                        </div>\n" +
                                "                                                                                                    </div>\n" +
                                "                                                                                                </div></div> </div> </div>"
                            content_box.append(str)
                        }
                    }

                    this.computableModel.name=basicInfo.name;
                    this.computableModel.description=basicInfo.description

                    // $("#nameInput").val(basicInfo.name);
                    // $("#descInput").val(basicInfo.description)



                }
            })
        }

        $("#step").steps({
            onFinish: function () {
                alert('Wizard Completed');
            },
            onChange: (currentIndex, newIndex, stepDirection) => {
                if (currentIndex === 0 && stepDirection === "forward") {
                    if (this.computableModel.bindOid == ""||this.computableModel.bindOid == null) {
                        new Vue().$message({
                            message: 'Please bind a model item!',
                            type: 'warning',
                            offset: 70,
                        });
                        return false;
                    }
                    else if (this.computableModel.name.trim() == "") {
                        new Vue().$message({
                            message: 'Please enter name!',
                            type: 'warning',
                            offset: 70,
                        });
                        return false;
                    }else if (this.computableModel.description.trim() == "") {
                        new Vue().$message({
                            message: 'Please enter overview!',
                            type: 'warning',
                            offset: 70,
                        });
                        return false;
                    }
                    else {
                        return true;
                    }
                }
                else if(currentIndex === 1 && stepDirection === "forward"){
                    if(this.computableModel.contentType=="Package"||this.computableModel.contentType=="Code"||this.computableModel.contentType=="Library"){
                        if(this.fileArray.length==0&&this.resources.length==0){
                            new Vue().$message({
                                message: 'Please select at least one file!',
                                type: 'warning',
                                offset: 70,
                            });
                            return false;
                        }
                    }
                    if(this.computableModel.contentType=="Service"||this.computableModel.contentType=="Link"){
                        if(this.computableModel.url==""){
                            new Vue().$message({
                                message: 'Please enter URL!',
                                type: 'warning',
                                offset: 70,
                            });
                            return false;
                        }
                    }
                    return true;
                }
                else{
                    return true;
                }
            }
        });


        $(".finish").click(()=>{
            this.formData=new FormData();

            if(this.computableModel.bindModelItem==""){
                alert("Please bind a model item")
                return;
            }
            if(this.computableModel.name.trim()==""){
                alert("Please enter name")
                return;
            }


            let loading = this.$loading({
                lock: true,
                text: "Uploading...",
                spinner: "el-icon-loading",
                background: "rgba(0, 0, 0, 0.7)"
            });

            this.computableModel.isAuthor=$("input[name='author_confirm']:checked").val();

            var detail = tinyMCE.activeEditor.getContent();
            this.computableModel.detail = detail.trim();

            this.computableModel.authorship=[];
            userspace.getUserData($("#providersPanel .user-contents .form-control"), this.computableModel.authorship);

            // //重点在这里 如果使用 var data = {}; data.inputfile=... 这样的方式不能正常上传

            // var files=$("#resource")[0].files;
            for(i=0;i<this.fileArray.length;i++){
                this.formData.append("resources",this.fileArray[i]);
            }

            if ((oid === "0") || (oid === "") || (oid == null)) {

                let file = new File([JSON.stringify(this.computableModel)],'ant.txt',{
                    type: 'text/plain',
                });
                this.formData.append("computableModel", file)


                // $("#step").css("display", "none");
                // $(".uploading").css("display", "block");

                $.ajax({
                    url: '/computableModel/add',
                    type: 'post',
                    data: this.formData,
                    cache: false,
                    processData: false,
                    contentType: false,
                    async: true
                }).done((res) => {
                    loading.close();
                    // $("#step").css("display", "block");
                    // $(".uploading").css("display", "none");
                    switch (res.data.code) {
                        case 1:
                            this.$confirm('<div style=\'font-size: 18px\'>Create computable model successfully!</div>', 'Tip', {
                                dangerouslyUseHTMLString: true,
                                confirmButtonText: 'View',
                                cancelButtonText: 'Go Back',
                                cancelButtonClass: 'fontsize-15',
                                confirmButtonClass: 'fontsize-15',
                                type: 'success',
                                center: true,
                                showClose: false,
                            }).then(() => {
                                window.location.href = "/computableModel/" + res.data.id;
                            }).catch(() => {
                                window.location.href = "/user/userSpace#/models/computablemodel";
                            });

                            break;
                        case -1:
                            this.$alert('Save files error!', 'Error', {
                                type:"error",
                                confirmButtonText: 'OK',
                                callback: action => {

                                }
                            });
                            break;
                        case -2:
                            this.$alert('Created failed!', 'Error', {
                                type:"error",
                                confirmButtonText: 'OK',
                                callback: action => {

                                }
                            });
                            break;
                    }
                }).fail((res) => {
                    window.location.href = "/user/login";
                });
            }
            else{
                this.computableModel.oid=oid;

                for(i=0;i<this.fileArray.length;i++){
                    this.formData.append("resources",this.fileArray[i]);
                }

                let file = new File([JSON.stringify(this.computableModel)],'ant.txt',{
                    type: 'text/plain',
                });
                this.formData.append("computableModel", file)

                $("#step").css("display", "none");
                $(".uploading").css("display", "block");

                $.ajax({
                    url: '/computableModel/update',
                    type: 'post',
                    data: this.formData,
                    cache: false,
                    processData: false,
                    contentType: false,
                    async: true
                }).done((res) => {
                    loading.close();
                    // $("#step").css("display", "block");
                    // $(".uploading").css("display", "none");
                    if(res.code===0) {
                        switch (res.data.code) {
                            case 0:
                                let currentUrl = window.location.href;
                                let index = currentUrl.lastIndexOf("\/");
                                that.computableModel_oid = currentUrl.substring(index + 1,currentUrl.length);
                                console.log(that.computableModel_oid);
                                //当change submitted时，其实数据库中已经更改了，但是对于消息数目来说还没有及时改变，所以在此处获取消息数目，实时更新导航栏消息数目，
                                that.getMessageNum(that.computableModel_oid);
                                let params = that.message_num_socket;
                                that.send(params);
                                this.$alert('Changes have been submitted, please wait for the author to review.', 'Success', {
                                    type:"success",
                                    confirmButtonText: 'OK',
                                    callback: action => {
                                        window.location.href = "/user/userSpace";
                                    }
                                });
                            case 1:
                                this.$confirm('<div style=\'font-size: 18px\'>Update computable model successfully!</div>', 'Tip', {
                                    dangerouslyUseHTMLString: true,
                                    confirmButtonText: 'View',
                                    cancelButtonText: 'Go Back',
                                    cancelButtonClass: 'fontsize-15',
                                    confirmButtonClass: 'fontsize-15',
                                    type: 'success',
                                    center: true,
                                    showClose: false,
                                }).then(() => {
                                    $("#editModal", parent.document).remove();
                                    window.location.href = "/computableModel/" + res.data.id;
                                }).catch(() => {
                                    window.location.href = "/user/userSpace#/models/computablemodel";
                                });
                                break;
                            case -1:
                                this.$alert('Save files error', 'Error', {
                                    type:"error",
                                    confirmButtonText: 'OK',
                                    callback: action => {
                                        $("#step").css("display", "block");
                                        $(".uploading").css("display", "none");
                                    }
                                });

                                break;
                            case -2:
                                this.$alert('Create failed!', 'Error', {
                                    type:"error",
                                    confirmButtonText: 'OK',
                                    callback: action => {
                                        $("#step").css("display", "block");
                                        $(".uploading").css("display", "none");
                                    }
                                });

                                break;
                        }
                    }
                    else{
                        this.$alert(res.msg, 'Error', {
                            type:"error",
                            confirmButtonText: 'OK',
                            callback: action => {
                                $("#step").css("display", "block");
                                $(".uploading").css("display", "none");
                            }
                        });

                    }
                }).fail((res) => {
                    this.$alert('Please login first', 'Error', {
                        type:"error",
                        confirmButtonText: 'OK',
                        callback: action => {
                            window.location.href = "/user/login";
                        }
                    });
                });
            }
        })

        // $(".prev").click(()=>{
        //     let currentUrl = window.location.href;
        //     let index = currentUrl.lastIndexOf("\/");
        //     that.computableModel_oid = currentUrl.substring(index + 1,currentUrl.length);
        //     console.log(that.computableModel_oid);
        //     //当change submitted时，其实数据库中已经更改了，但是对于消息数目来说还没有及时改变，所以在此处获取消息数目，实时更新导航栏消息数目，
        //     that.getMessageNum(that.computableModel_oid);
        //     let params = that.message_num_socket;
        //     that.send(params);
        // });


        $("input[name='ContentType']").iCheck({
            //checkboxClass: 'icheckbox_square-blue',  // 注意square和blue的对应关系
            radioClass: 'iradio_flat-green',
            increaseArea: '0%' // optional

        });
        $("input[name='author_confirm']").iCheck({
            //checkboxClass: 'icheckbox_square-blue',  // 注意square和blue的对应关系
            radioClass: 'iradio_flat-green',
            increaseArea: '0%' // optional

        });

        //content type radio
        $("input[name='ContentType']").eq(0).iCheck('check');

        $("input:radio[name='ContentType']").on('ifChecked', function(event){

            if($(this).val()=="Package"){
                $("#resource").val("");
                $("#resource").attr("accept","application/x-zip-compressed");
                $("#resource").removeAttr("multiple");
                $("#Files").show();
                $("#URL").hide();
            }
            else if($(this).val()=="Code"||$(this).val()=="Library"){
                $("#resource").val("");
                $("#resource").removeAttr("accept");
                $("#resource").attr("multiple","multiple");
                $("#Files").show();
                $("#URL").hide();
            }
            else{
                $("#resource").val("");
                $("#Files").hide();
                $("#URL").show();
            }

        });
        //author radio
        $("input[name='author_confirm']").eq(0).iCheck('check');

        $("input:radio[name='author_confirm']").on('ifChecked', function(event){
            if($(this).val()=="true"){

                $("#author_info").hide();
            }
            else{

                $("#author_info").show();
            }

        });

        $(document).on("click", ".author_close", function () { $(this).parents(".panel").eq(0).remove(); });

        //作者添加
        var user_num = 1;
        $(".user-add").click(function () {
            user_num++;
            var content_box = $(this).parent().children('div');
            var str = "<div class='panel panel-primary'> <div class='panel-heading newAuthorHeader'> <h4 class='panel-title'> <a class='accordion-toggle collapsed' style='color:white' data-toggle='collapse' data-target='#user";
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
                "                                                                                                    <div style=\"margin-top:10px\">\n" +
                "                                                                                                        <lable class='control-label col-sm-2 text-center'\n" +
                "                                                                                                               style='font-weight: bold;'>\n" +
                "                                                                                                            Affiliation:\n" +
                "                                                                                                        </lable>\n" +
                "                                                                                                        <div class='input-group col-sm-10'>\n" +
                "                                                                                                            <input type='text'\n" +
                "                                                                                                                   name=\"ins\"\n" +
                "                                                                                                                   class='form-control'>\n" +
                "                                                                                                        </div>\n" +
                "                                                                                                    </div>\n" +
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
                "                                                                                                            Homepage:\n" +
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

        var mid = window.sessionStorage.getItem("editConceptualModel_id");
        // if (mid === undefined || mid == null) {
        //     this.editorUrl = "http://127.0.0.1:8081http://127.0.0.1:8081/GeoModelingNew/modelItem/createModelItem.html";
        // } else {
        //     this.editorUrl = "http://127.0.0.1:8081http://127.0.0.1:8081/GeoModelingNew/modelItem/createModelItem.html?mid=" + mid;
        // }
    }
})