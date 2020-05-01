var createTemplate = Vue.extend({
    template:"#createTemplate",
    data() {
        return {
            defaultActive: '4-3',
            curIndex: '6',

            ScreenMaxHeight: "0px",
            IframeHeight: "0px",
            editorUrl: "",
            load: false,

            ScreenMinHeight: "0px",

            userId: "",
            userName: "",
            loginFlag: false,
            activeIndex: 2,

            userInfo: {
                //username:"",
                name: "",
                email: "",
                phone: "",
                insName: ""
            },

            treeData: [{
                id: 1,
                label: 'Description Templates',
                oid: 'TRJJMYDAUJTDDU5J9GPRUWAG7QJ6PHUU',
                children: [
                    {
                        id: 2,
                        "oid": "f7fbecf6-9d28-405e-b7d2-07ef9d924ca6",
                        "label": "Vector Data Format"
                    },
                    {
                        id: 3,
                        "oid": "9b104fd6-7949-4c3b-b277-138cd979d053",
                        "label": "Raster Data Format",
                    },
                    {
                        id: 4,
                        "oid": "316d4df0-436e-4600-a183-80abf7472a72",
                        "label": "Mesh Data Format",
                    },
                    {
                        id: 5,
                        "oid": "bc437c65-2cfe-4bde-ac31-04830f18885a",
                        "label": "Image Data Format",
                    },
                    {
                        id: 6,
                        "oid": "39c0824e-8b1a-44e5-8716-c7893afe05e8",
                        "label": "Voideo Data Format",
                    },
                    {
                        id: 7,
                        "oid": "82b1c2b4-4c12-441d-9d9c-09365c3c8a24",
                        "label": "Audio Data Format",
                    },
                    {
                        id: 8,
                        "nameCn": "",
                        "oid": "df6d36e3-8f16-4b96-8d3f-cff24f7c0fd9",
                        "label": "Unstructural Data Format",
                    },
                    {
                        id: 9,
                        "oid": "26bb993b-453c-481a-a1ea-674db3e888e2",
                        "label": "Model Related Data Format",
                    },
                    {
                        id: 10,
                        "oid": "1d573467-f1f3-440a-a827-110ac1e820bd",
                        "label": "3D Model Data Format",
                    },
                    {
                        id: 11,
                        "oid": "8a189836-d563-440c-b5ea-c04778ac05f9",
                        "label": "Tabular Data Format",
                    }]
            }],

            defaultProps: {
                children: 'children',
                label: 'label'
            },
            cls: [],
            clsStr: '',
            parId: "",

            templateInfo: {},

            path:"ws://localhost:8080/websocket",
            socket:"",

            template_oid:"",
        }
    },
    methods:{
        handleSelect(index,indexPath){
            this.setSession("index",index);
            window.location.href="/user/userSpace"
        },
        handleCheckChange(data, checked, indeterminate) {
            let checkedNodes = this.$refs.tree2.getCheckedNodes()
            let classes = [];
            let str='';
            for (let i = 0; i < checkedNodes.length; i++) {
                // console.log(checkedNodes[i].children)
                if(checkedNodes[i].children!=undefined){
                    continue;
                }

                classes.push(checkedNodes[i].oid);
                str+=checkedNodes[i].label;
                if(i!=checkedNodes.length-1){
                    str+=", ";
                }
            }
            this.cls=classes;
            this.clsStr=str;

        },
        changeOpen(n) {
            this.activeIndex = n;
        },
        setSession(name, value) {
            window.sessionStorage.setItem(name, value);
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
        sendcurIndexToParent(){
            this.$emit('com-sendcurindex',this.curIndex)
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
        getMessageNum(template_oid){
            this.message_num_socket = 0;//初始化消息数目
            let data = {
                type: 'template',
                oid : template_oid,
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
                type: 'template',
                oid : template_oid,
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
        let that = this;
        that.init();

        //初始化的时候吧curIndex传给父组件，来控制bar的高亮显示
        this.sendcurIndexToParent()

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
        })

        var oid = this.$route.params.editId;//取得所要edit的id

        var user_num = 0;

        if ((oid === "0") || (oid === "") || (oid === null)|| (oid === undefined)) {

            // $("#title").text("Create Data Template")
            $("#subRteTitle").text("/Create Data Template")

            $("#templateText").html("");

            tinymce.remove('textarea#templateText')
            tinymce.init({
                selector: "textarea#templateText",
                height: 350,
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
        }
        else {

            // $("#title").text("Modify Data Template")
            $("#subRteTitle").text("/Modify Data Template")
            document.title="Modify Data Template | OpenGMS"


            $.ajax({
                url: "/repository/getTemplateInfo/" + oid,
                type: "get",
                data: {},

                success: (result) => {
                    console.log(result)
                    var basicInfo = result.data;
                    this.templateInfo = basicInfo;

                    //cls
                    this.cls = basicInfo.classifications;
                    let ids=[];
                    for(i=0;i<this.cls.length;i++){
                        for(j=0;j<1;j++){
                            for(k=0;k<this.treeData[j].children.length;k++){
                                if(this.cls[i]==this.treeData[j].children[k].oid){
                                    ids.push(this.treeData[j].children[k].id);
                                    this.parid = this.treeData[j].children[k].id;
                                    this.clsStr+=this.treeData[j].children[k].label;
                                    if(i!=this.cls.length-1){
                                        this.clsStr+=", ";
                                    }
                                    break;
                                }
                            }
                            if(ids.length-1==i){
                                break;
                            }
                        }
                    }

                    this.$refs.tree2.setCheckedKeys(ids);

                    $(".providers").children(".panel").remove();
                    $("#nameInput").val(basicInfo.name);
                    $("#descInput").val(basicInfo.description);

                    //image
                    if (basicInfo.image != "") {
                        $("#imgShow").attr("src", basicInfo.image);
                        $('#imgShow').show();
                    }

                    //detail
                    //tinymce.remove("textarea#templateText");
                    if(basicInfo.detail != null){
                        $("#templateText").html(basicInfo.detail);
                    }

                    tinymce.remove('textarea#templateText')
                    tinymce.init({
                        selector: "textarea#templateText",
                        height: 300,
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

                }
            })
            window.sessionStorage.setItem("editTemplate_id", "");
        }

        $("#step").steps({
            onFinish: function () {
                alert('Wizard Completed');
            }
        });

        //判断是否登录
        $.ajax({
            type: "GET",
            url: "/user/load",
            data: {},
            cache: false,
            async: false,
            success: (data) => {
                data=JSON.parse(data);
                console.log(data);
                if (data.oid == "") {
                    alert("Please login");
                    window.location.href = "/user/login";
                }
                else {
                    this.userId = data.oid;
                    this.userName = data.name;
                }
            }
        })

        let height = document.documentElement.clientHeight;
        this.ScreenMaxHeight = (height) + "px";
        this.IframeHeight = (height - 20) + "px";

        window.onresize = () => {
            console.log('come on ..');
            height = document.documentElement.clientHeight;
            this.ScreenMaxHeight = (height) + "px";
            this.IframeHeight = (height - 20) + "px";
        }

        var templateObj ={};
        $(".next").click(()=> {

            if (this.cls.length == 0) {
                alert("Please select parent node");
                return false;
            }
            if ($("#nameInput").val() === "") {
                alert("Please enter template's name");
                return false;
            }
        });

        $(".finish").click(()=> {
            let loading = this.$loading({
                lock: true,
                text: "Uploading...",
                spinner: "el-icon-loading",
                background: "rgba(0, 0, 0, 0.7)"
            });
            templateObj.classifications = this.cls;
            templateObj.name = $("#nameInput").val();
            templateObj.uploadImage = $('#imgShow').get(0).currentSrc;
            templateObj.description = $("#descInput").val();
            templateObj.xml = $("#xml").val();

            if(templateObj.name.trim()==""){
                alert("please enter name")
                return;
            }

            var detail = tinyMCE.activeEditor.getContent();
            templateObj.detail = detail.trim();
            console.log(templateObj)

            let formData=new FormData();
            if ((oid === "0") || (oid === "") || (oid == null)) {
                let file = new File([JSON.stringify(templateObj)],'ant.txt',{
                    type: 'text/plain',
                });
                formData.append("info", file)
                $.ajax({
                    url: "/repository/addTemplate",
                    type: "POST",
                    cache: false,
                    processData: false,
                    contentType: false,
                    async: true,
                    data: formData,
                    success: function (result) {
                        loading.close();
                        if (result.code == "0") {
                            alert("Create Success");
                            //$("#editModal",parent.document).remove();

                            window.location.href = "/repository/template/" + result.data;
                            //window.location.reload();
                        }
                        else if(result.code==-1){
                            alert("Please login first!");
                            window.location.href="/user/login";
                        }
                        else{
                            alert("Create failed!")
                        }

                    }
                })
            }else {
                templateObj["oid"] = oid;
                let file = new File([JSON.stringify(templateObj)],'ant.txt',{
                    type: 'text/plain',
                });
                formData.append("info", file)
                $.ajax({
                    url: "/repository/updateTemplate",
                    type: "POST",
                    cache: false,
                    processData: false,
                    contentType: false,
                    async: false,
                    data: formData,
                    success: function (result) {
                        if (result.code === 0) {
                            if (result.data.method === "update") {
                                alert("Update Success");

                                window.location.href = "/repository/template/" + result.data.oid;
                                //window.location.reload();
                            }
                            else {
                                let currentUrl = window.location.href;
                                let index = currentUrl.lastIndexOf("\/");
                                that.template_oid = currentUrl.substring(index + 1,currentUrl.length);
                                console.log(that.template_oid);
                                //当change submitted时，其实数据库中已经更改了，但是对于消息数目来说还没有及时改变，所以在此处获取消息数目，实时更新导航栏消息数目，
                                that.getMessageNum(that.template_oid);
                                let params = that.message_num_socket;
                                that.send(params);

                                alert("Success! Changes have been submitted, please wait for the author to review.");
                                window.location.href = "/user/userSpace";
                            }
                        }
                        else if(result.code==-2){
                            alert("Please login first!");
                            window.location.href="/user/login";
                        }
                        else{
                            alert(result.msg);
                        }
                    }
                })
            }
        });

        // $(".prev").click(()=>{
        //     let currentUrl = window.location.href;
        //     let index = currentUrl.lastIndexOf("\/");
        //     that.template_oid = currentUrl.substring(index + 1,currentUrl.length);
        //     console.log(that.template_oid);
        //     //当change submitted时，其实数据库中已经更改了，但是对于消息数目来说还没有及时改变，所以在此处获取消息数目，实时更新导航栏消息数目，
        //     that.getMessageNum(that.template_oid);
        //     let params = that.message_num_socket;
        //     that.send(params);
        // });
        $(document).on("keyup", ".username", function () {

            if ($(this).val()) {
                $(this).parents('.panel').eq(0).children('.panel-heading').children().children().html($(this).val());
            }
            else {
                $(this).parents('.panel').eq(0).children('.panel-heading').children().children().html("NEW");
            }
        })

    }
})