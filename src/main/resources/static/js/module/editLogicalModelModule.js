Vue.component("editLogicalModelModule",
    {
        template:'#editLogicalModelModule',
        props:{
            modelEditOid:'',
        },
        data() {
            return {
                defaultActive: '2-3',
                curIndex: '2',

                logicalModel: {
                    status:"Public",
                    bindModelItem: "",
                    bindOid: "",
                    name: "",
                    description: "",
                    contentType: "MxGraph",
                    cXml: "",
                    svg: "",
                    isAuthor: true,
                    author: {
                        name: "",
                        ins: "",
                        email: ""
                    },
                    resources: [],

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
                //文件框
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

                path:"ws://localhost:8080/websocket",
                socket:"",

                logicalModel_oid:"",

            }
        },
        methods: {
            selectModelItem(index,info){
                console.log(info);
                this.logicalModel.bindModelItem = info.name;
                this.logicalModel.bindOid = info.oid;
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
            getUserData(UsersInfo, prop) {

                for (i = prop.length; i > 0; i--) {
                    prop.pop();
                }
                var result = "{";
                for (index=0 ; index < UsersInfo.length; index++) {
                    //
                    if(index%4==0){
                        let value1 = UsersInfo.eq(index)[0].value.trim();
                        let value2 = UsersInfo.eq(index+1)[0].value.trim();
                        let value3 = UsersInfo.eq(index+2)[0].value.trim();
                        let value4 = UsersInfo.eq(index+3)[0].value.trim();
                        if(value1==''&&value2==''&&value3==''&&value4==''){
                            index+=4;
                            continue;
                        }
                    }

                    var Info = UsersInfo.eq(index)[0];
                    if (index % 4 == 3) {
                        if (result) {
                            result += "'" + Info.name + "':'" + Info.value + "'}"
                            prop.push(eval('(' + result + ')'));
                        }
                        result = "{";
                    }
                    else {
                        result += "'" + Info.name + "':'" + Info.value + "',";
                    }

                }
            },
            addFile(){
                $("#imgFiles").click();
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
                this.fileArray=new Array();
                $("#imgFiles").click();
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
                    this.socket = new WebSocket(this.path);
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
            getMessageNum(logicalModel_oid){
                this.message_num_socket = 0;//初始化消息数目
                let data = {
                    type: 'logicalModel',
                    oid : logicalModel_oid,
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
                    type: 'logicalModel',
                    oid : logicalModel_oid,
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
            }


        },
        mounted() {
            //初始化的时候吧curIndex传给父组件，来控制bar的高亮显示
            let that = this;
            that.init();

            this.sendcurIndexToParent()

            $(() => {
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


            $("#imgFiles").change(()=> {

                let files=$("#imgFiles")[0].files;
                for(i=0;i<files.length;i++){
                    let file=files[i];
                    this.fileArray.push(file);
                    let res={};
                    res.name=file.name;
                    res.path="";
                    let names=res.name.split('.');
                    res.suffix=names[names.length-1];
                    res.size=file.size;
                    res.lastModified=file.lastModified;
                    res.type=file.type;
                    this.resources.push(res);
                }


                //清空
                let file=document.getElementById("file");
                file.value='';
            })

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
                    if (data.oid == "") {
                        alert("Please login");
                        window.location.href = "/user/login";
                    }
                    else {
                        this.userId = data.uid;
                        this.userName = data.name;

                        var bindOid = this.getSession("bindOid");
                        this.logicalModel.bindOid = bindOid;
                        $.ajax({
                            type: "Get",
                            url: "/modelItem/getInfo/" + bindOid,
                            data: {},
                            cache: false,
                            async: true,
                            success: (json) => {
                                if (json.data != null) {
                                    $("#bind").html("unbind")
                                    $("#bind").removeClass("btn-success");
                                    $("#bind").addClass("btn-warning")
                                    document.getElementById("search-box").readOnly = true;
                                    this.logicalModel.bindModelItem = json.data.name;
                                    this.clearSession();
                                }
                                else {

                                }
                            }
                        })
                    }
                }
            })


            var oid = this.modelEditOid;//取得所要edit的id

            var user_num = 0;


            if ((oid === "0") || (oid === "") || (oid === null)|| (oid === undefined)) {

                // $("#title").text("Create Logical Model")
                $("#subRteTitle").text("/Create Logical Model")

                $("#logicalModelText").html("");

                tinymce.remove('textarea#logicalModelText')
                tinymce.init({
                    selector: "textarea#logicalModelText",
                    height: 400,
                    theme: 'silver',
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
            }
            else{

                // $("#title").text("Modify Logical Model")
                $("#subRteTitle").text("/Modify Logical Model")
                document.title="Modify Logical Model | OpenGMS"

                $.ajax({
                    url: "/logicalModel/getInfo/" + oid,
                    type: "get",
                    data: {},

                    success: (result) => {
                        console.log(result)
                        var basicInfo = result.data;

                        this.resources=basicInfo.resourceJson;

                        $("#search-box").val(basicInfo.relateModelItemName)
                        this.logicalModel.bindModelItem=basicInfo.relateModelItemName;
                        this.logicalModel.bindOid=basicInfo.relateModelItem;
                        this.logicalModel.status=basicInfo.status;


                        if(basicInfo.contentType=="MxGraph"){
                            $("input[name='ContentType']").eq(0).iCheck('check');
                            $("#MxGraph").show();
                            $("#Image").hide();
                        }
                        else{
                            $("input[name='ContentType']").eq(1).iCheck('check');
                            $("#MxGraph").hide();
                            $("#Image").show();
                        }

                        $(".providers").children(".panel").remove();

                        //detail
                        //tinymce.remove("textarea#logicalModelText");
                        $("#logicalModelText").html(basicInfo.detail);
                        tinymce.remove('textarea#logicalModelText')
                        tinymce.init({
                            selector: "textarea#logicalModelText",
                            height: 300,
                            theme: 'silver',
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

                        this.logicalModel.name=basicInfo.name;
                        this.logicalModel.description=basicInfo.description

                        // $("#nameInput").val(basicInfo.name);
                        // $("#descInput").val(basicInfo.description)





                    }
                })
            }



            $("#step").steps({
                onFinish: function () {
                    // alert('Wizard Completed');
                },
                onChange: (currentIndex, newIndex, stepDirection) => {
                    if (currentIndex === 0 && stepDirection === "forward") {
                        if (this.logicalModel.bindOid == ""||this.logicalModel.bindOid == null) {
                            new Vue().$message({
                                message: 'Please bind a model item!',
                                type: 'warning',
                                offset: 70,
                            });
                            return false;
                        }
                        else if (this.logicalModel.name.trim() == "") {
                            new Vue().$message({
                                message: 'Please enter name!',
                                type: 'warning',
                                offset: 70,
                            });
                            return false;
                        }else if (this.logicalModel.description.trim() == "") {
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
                    }else{
                        return true;
                    }
                }
            });


            $(".finish").click(()=>{
                this.formData=new FormData();
                let loading = this.$loading({
                    lock: true,
                    text: "Uploading...",
                    spinner: "el-icon-loading",
                    background: "rgba(0, 0, 0, 0.7)"
                });

                this.logicalModel.contentType=$("input[name='ContentType']:checked").val();
                this.logicalModel.isAuthor=$("input[name='author_confirm']:checked").val();
                var detail = tinyMCE.activeEditor.getContent();
                this.logicalModel.detail = detail.trim();

                this.logicalModel.authorship=[];
                this.getUserData($("#providersPanel .user-contents .form-control"), this.logicalModel.authorship);

                /**
                 * 张硕
                 * 2019.11.14
                 * 经过试验，logicalmodel只需要 cxml 就OK，所以暂时只存cxml，注释掉svg，xml，w，h
                 * 并不OK，需要存图片，所以不能注释
                 */
                let iframeWindow=$("#ModelEditor")[0].contentWindow;
                // this.logicalModel.cXml=iframeWindow.getCxml();

                let result=iframeWindow.getXml();

                if(this.logicalModel.contentType=="MxGraph") {
                    this.logicalModel.svg = "<svg width='" + result.w + "px' height='" + result.h + "px' xmlns='http://www.w3.org/2000/svg' xmlns:html='http://www.w3.org/1999/xhtml'>" + iframeWindow.getSvg() + "</svg>";
                    this.logicalModel.cXml=iframeWindow.getCxml();
                    this.logicalModel.xml=result.xml;
                    this.logicalModel.w=result.w;
                    this.logicalModel.h=result.h;
                }
                else{
                    this.logicalModel.svg="";
                    this.logicalModel.cXml="";
                }


                //添加图片

                //重点在这里 如果使用 var data = {}; data.inputfile=... 这样的方式不能正常上传

                for(i=0;i<this.fileArray.length;i++){
                    this.formData.append("imgFiles",this.fileArray[i]);
                }

                if ((oid === "0") || (oid === "") || (oid == null)) {
                    let file = new File([JSON.stringify(this.logicalModel)],'ant.txt',{
                        type: 'text/plain',
                    });
                    this.formData.append("logicalModel", file)
                    $.ajax({
                        url: '/logicalModel/add',
                        type: 'post',
                        data: this.formData,
                        cache: false,
                        processData: false,
                        contentType: false,
                        async: true
                    }).done((res)=> {
                        loading.close();
                        switch (res.data.code) {
                            case 1:
                                this.$alert('<div style=\'font-size: 18px\'>Create logical model successfully!</div>', 'Tip', {
                                    dangerouslyUseHTMLString: true,
                                    confirmButtonText: 'View',
                                    confirmButtonClass: 'fontsize-15',
                                    type: 'success',
                                    center: true,
                                    showClose: false,
                                }).then(() => {
                                    window.location.href = "/logicalModel/" + res.data.id;
                                }).catch(() => {
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
                    }).fail(function (res) {
                        this.$alert('Please login first', 'Error', {
                            type:"error",
                            confirmButtonText: 'OK',
                            callback: action => {
                                window.location.href = "/user/login";
                            }
                        });
                    });
                }
                else{
                    this.logicalModel.oid=oid;
                    this.logicalModel.resources=this.resources;

                    let file = new File([JSON.stringify(this.logicalModel)],'ant.txt',{
                        type: 'text/plain',
                    });

                    this.formData.append("logicalModel", file)
                    $.ajax({
                        url: '/logicalModel/update',
                        type: 'post',
                        data: this.formData,
                        cache: false,
                        processData: false,
                        contentType: false,
                        async: true
                    }).done((res)=> {
                        loading.close();
                        console.log(res)
                        if(res.code===0) {
                            switch (res.data.code) {

                                case 0:
                                    let currentUrl = window.location.href;
                                    let index = currentUrl.lastIndexOf("\/");
                                    that.logicalModel_oid = currentUrl.substring(index + 1,currentUrl.length);
                                    console.log(that.logicalModel_oid);
                                    //当change submitted时，其实数据库中已经更改了，但是对于消息数目来说还没有及时改变，所以在此处获取消息数目，实时更新导航栏消息数目，
                                    that.getMessageNum(that.logicalModel_oid);
                                    let params = that.message_num_socket;
                                    that.send(params);
                                    this.$alert('Changes have been submitted, please wait for the author to review.', 'Success', {
                                        type:"success",
                                        confirmButtonText: 'OK',
                                        callback: action => {
                                            window.location.href = "/user/userSpace";
                                        }
                                    });
                                    break;
                                case 1:
                                    this.$alert('<div style=\'font-size: 18px\'>Update logical model successfully!</div>', 'Tip', {
                                        dangerouslyUseHTMLString: true,
                                        confirmButtonText: 'View',
                                        confirmButtonClass: 'fontsize-15',
                                        type: 'success',
                                        center: true,
                                        showClose: false,
                                    }).then(() => {
                                        $("#editModal", parent.document).remove();
                                        window.location.href = "/logicalModel/" + res.data.id;
                                    }).catch(() => {

                                    });
                                    break;
                                case -1:
                                    this.$alert('Save files error', 'Error', {
                                        type:"error",
                                        confirmButtonText: 'OK',
                                        callback: action => {

                                        }
                                    });
                                    break;
                                case -2:
                                    this.$alert('Create failed!', 'Error', {
                                        type:"error",
                                        confirmButtonText: 'OK',
                                        callback: action => {

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

                                }
                            });
                        }
                    }).fail(function (res) {
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
            //     that.logicalModel_oid = currentUrl.substring(index + 1,currentUrl.length);
            //     console.log(that.logicalModel_oid);
            //     //当change submitted时，其实数据库中已经更改了，但是对于消息数目来说还没有及时改变，所以在此处获取消息数目，实时更新导航栏消息数目，
            //     that.getMessageNum(that.logicalModel_oid);
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

                if($(this).val()=="MxGraph"){
                    $("#MxGraph").show();
                    $("#Image").hide();
                }
                else{
                    $("#MxGraph").hide();
                    $("#Image").show();
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



            // if (mid === undefined || mid == null) {
            //     this.editorUrl = "http://127.0.0.1:8081http://127.0.0.1:8081/GeoModelingNew/modelItem/createModelItem.html";
            // } else {
            //     this.editorUrl = "http://127.0.0.1:8081http://127.0.0.1:8081/GeoModelingNew/modelItem/createModelItem.html?mid=" + mid;
            // }
        }

    }
)

