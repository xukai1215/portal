var vue = new Vue({
    el: "#app",
    data: {
        //判断是否已经点击confirm
        confirmflag:0,
        confirmflag1:0,
        editableTabsValue_model: '1',
        editableTabsValue_data: '1',
        editableTabsValue_applications: '1',
        editableTabs_model: [{
            tabledata:[],
            //tabledata:[],
            title: 'Tab 1',
            name: '1',
            content: '1'
        }],
        tabledataflag:0,
        tabledataflag1:0,
//用作改变title时的计数
        tableflag1:0,
        tableflag2:0,
        tableflag3:0,

        editableTabs_data: [{
            tabledata:[],
            title: 'Tab 1',
            name: '1',
            content: 'Tab 1 content'
        }],
        editableTabs_applications: [{
            title: 'Tab 1',
            name: '1',
            content: 'Tab 1 content'
        }],
        tabIndex: 1,

        themeObj:{},

        oidnumber:0,
        numOfModelPerRow:5,
        classarr: [],
        moid:[],
        doid:[],
        dialogTableVisible: false,
        dialogTableVisible1: false,
        relateTitle: "",

        tableData: [],
        tableMaxHeight: 400,
        relateSearch: "",
        pageOption1: {
            paginationShow: false,
            progressBar: true,
            sortAsc: false,
            currentPage: 1,
            pageSize: 5,

            total: 264,
            searchResult: [],
        },

        pageOption2: {
            paginationShow: false,
            progressBar: true,
            sortAsc: false,
            currentPage: 1,
            pageSize: 5,

            total: 264,
            searchResult: [],
        },

        defaultActive:'5',
        curIndex:'5',

        ScreenMaxHeight: "0px",
        IframeHeight: "0px",
        editorUrl: "",
        load: false,


        ScreenMinHeight: "0px",

        userId: "",
        userName: "",
        loginFlag: false,
        activeIndex: 5,

        userInfo:{
            //username:"",
            name:"",
            email:"",
            phone:"",
            insName:""
        },
        defaultProps: {
        },
        cls:[],
        clsStr:'',
        model_num1:1,

    },
    methods: {
        modelClass_add(){
            $(".el-tabs__new-tab").eq(0).click();
        },
        dataClass_add(){
            $(".el-tabs__new-tab").eq(1).click();
        },
        handleTabsEdit_model(targetName, action) {

            if (!this.confirmflag) {
                alert("Please click confirm");
                return false;
            }
            this.confirmflag = 0;

            if (action === 'add') {
                let newTabName = ++this.tabIndex + '';
                this.editableTabs_model.push({
                    tabledata:[],
                    title: 'New Tab',
                    name: newTabName,
                    content: '2'
                });
                this.editableTabsValue_model = newTabName + '';
            }
            if (action === 'remove') {
                let tabs = this.editableTabs_model;
                let activeName = this.editableTabsValue_model;
                if (activeName === targetName) {
                    tabs.forEach((tab, index) => {
                        if (tab.name === targetName) {
                            let nextTab = tabs[index + 1] || tabs[index - 1];
                            if (nextTab) {
                                activeName = nextTab.name;
                            }
                        }
                    });
                }

                this.editableTabsValue_model = activeName;
                this.editableTabs_model = tabs.filter(tab => tab.name !== targetName);
            }
        },
        handleTabsEdit_data(targetName, action) {

            if (!this.confirmflag1) {
                alert("Please click confirm");
                return false;
            }
            this.confirmflag1 = 0;

            if (action === 'add') {
                let newTabName = ++this.tabIndex + '';
                this.editableTabs_data.push({
                    tabledata:[],
                    title: 'New Tab',
                    name: newTabName,
                    content: 'New Tab content'
                });
                this.editableTabsValue_data = newTabName;
            }
            if (action === 'remove') {
                let tabs = this.editableTabs_data;
                let activeName = this.editableTabsValue_data;
                if (activeName === targetName) {
                    tabs.forEach((tab, index) => {
                        if (tab.name === targetName) {
                            let nextTab = tabs[index + 1] || tabs[index - 1];
                            if (nextTab) {
                                activeName = nextTab.name;
                            }
                        }
                    });
                }

                this.editableTabsValue_data = activeName;
                this.editableTabs_data = tabs.filter(tab => tab.name !== targetName);
            }
        },
        handleTabsEdit_applications(targetName, action) {
            var app = {};
            app.applicationname = $("#applicationname").val();
            app.applicationlink = $("#applicationlink").val();
            app.upload_application_image = $("#imgShow1").get(0).currentSrc;
            this.themeObj.application.push(app);


            $("#applicationname").attr('id','applicationname_past');//改变当前id名称
            $("#applicationlink").attr('id','applicationlink_past');//改变当前id名称
            $("#imgShow1").attr('id','imgShow1_past');//改变当前id名称
            $("#imgChange1").attr('id','imgChange1_past');//改变当前id名称

            if (action === 'add') {
                let newTabName = ++this.tabIndex + '';
                this.editableTabs_applications.push({
                    title: 'New Tab',
                    name: newTabName,
                    content: 'New Tab content'
                });
                this.editableTabsValue_applications = newTabName;
            }
            if (action === 'remove') {
                let tabs = this.editableTabs_applications;
                let activeName = this.editableTabsValue_applications;
                if (activeName === targetName) {
                    tabs.forEach((tab, index) => {
                        if (tab.name === targetName) {
                            let nextTab = tabs[index + 1] || tabs[index - 1];
                            if (nextTab) {
                                activeName = nextTab.name;
                            }
                        }
                    });
                }

                this.editableTabsValue_applications = activeName;
                this.editableTabs_applications = tabs.filter(tab => tab.name !== targetName);
            }
        },

        handleClose(done) {
            this.$confirm('Are you sure to close？')
                .then(_ => {
                    done();
                })
                .catch(_ => {
                });
        },

        handlePageChange1(val) {
            this.pageOption1.currentPage = val;
            this.search1();
        },
        handlePageChange2(val) {
            this.pageOption2.currentPage = val;
            this.search2();
        },

        search1() {
            this.relateType = "modelItem";
            var data = {
                asc: this.pageOption1.sortAsc,
                page: this.pageOption1.currentPage,
                pageSize: this.pageOption1.pageSize,
                searchText: this.relateSearch,
                sortType: "default",
                classifications: ["all"],
            };
            let url, contentType;

            switch (this.relateType) {
                case "dataItem":
                    url="/dataItem/searchByName";
                    data = {
                        page: this.pageOption1.currentPage+1,
                        pageSize: 5,
                        asc: true,
                        classifications: [],
                        category: '',
                        searchText: this.relateSearch
                    }
                    data=JSON.stringify(data);
                    contentType = "application/json";
                    break;
                case "concept":
                    url = this.relateSearch.trim() == "" ? "/repository/getConceptList" : "/repository/searchConcept";
                    data.asc = data.asc == true ? 0 : 1;
                    data = JSON.stringify(data);
                    contentType = "application/json";
                    break;
                case "spatialReference":
                    url = this.relateSearch.trim() == "" ? "/repository/getSpatialReferenceList" : "/repository/searchSpatialReference";
                    data.asc = data.asc == true ? 0 : 1;
                    data = JSON.stringify(data);
                    contentType = "application/json";
                    break;
                case "template":
                    url = this.relateSearch.trim() == "" ? "/repository/getTemplateList" : "/repository/searchTemplate";
                    data.asc = data.asc == true ? 0 : 1;
                    data = JSON.stringify(data);
                    contentType = "application/json";
                    break;
                case "unit":
                    url = this.relateSearch.trim() == "" ? "/repository/getUnitList" : "/repository/searchUnit";
                    data.asc = data.asc == true ? 0 : 1;
                    data = JSON.stringify(data);
                    contentType = "application/json";
                    break;
                default:
                    url = "/" + this.relateType + "/list";
                    contentType = "application/x-www-form-urlencoded";
            }
            $.ajax({
                type: "POST",
                url: url,
                data: data,
                async: true,
                contentType: contentType,
                success: (json) => {
                    if (json.code == 0) {
                        let data = json.data;
                        console.log(data);

                        this.pageOption1.total = data.total;
                        this.pageOption1.pages = data.pages;
                        this.pageOption1.searchResult = data.list;
                        this.pageOption1.users = data.users;
                        this.pageOption1.progressBar = false;
                        this.pageOption1.paginationShow = true;

                    }
                    else {
                        console.log("query error!")
                    }
                }
            })
        },
        search2() {
            this.relateType = "dataItem";
            var data = {
                asc: this.pageOption2.sortAsc,
                page: this.pageOption2.currentPage,
                pageSize: this.pageOption2.pageSize,
                searchText: this.relateSearch,
                sortType: "default",
                classifications: ["all"],
            };
            let url, contentType;
            switch (this.relateType) {
                case "dataItem":
                    url="/dataItem/searchByName";
                    data = {
                        page: this.pageOption2.currentPage+1,
                        pageSize: 5,
                        asc: true,
                        classifications: [],
                        category: '',
                        searchText: this.relateSearch
                    }
                    data=JSON.stringify(data);
                    contentType = "application/json";
                    break;
                case "concept":
                    url = this.relateSearch.trim() == "" ? "/repository/getConceptList" : "/repository/searchConcept";
                    data.asc = data.asc == true ? 0 : 1;
                    data = JSON.stringify(data);
                    contentType = "application/json";
                    break;
                case "spatialReference":
                    url = this.relateSearch.trim() == "" ? "/repository/getSpatialReferenceList" : "/repository/searchSpatialReference";
                    data.asc = data.asc == true ? 0 : 1;
                    data = JSON.stringify(data);
                    contentType = "application/json";
                    break;
                case "template":
                    url = this.relateSearch.trim() == "" ? "/repository/getTemplateList" : "/repository/searchTemplate";
                    data.asc = data.asc == true ? 0 : 1;
                    data = JSON.stringify(data);
                    contentType = "application/json";
                    break;
                case "unit":
                    url = this.relateSearch.trim() == "" ? "/repository/getUnitList" : "/repository/searchUnit";
                    data.asc = data.asc == true ? 0 : 1;
                    data = JSON.stringify(data);
                    contentType = "application/json";
                    break;
                default:
                    url = "/" + this.relateType + "/list";
                    contentType = "application/x-www-form-urlencoded";
            }
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

                        this.pageOption2.total = data.total;
                        this.pageOption2.pages = data.pages;
                        this.pageOption2.searchResult = data.list;
                        this.pageOption2.users = data.users;
                        this.pageOption2.progressBar = false;
                        this.pageOption2.paginationShow = true;

                    }
                    else {
                        console.log("query error!")
                    }
                }
            })
        },
        jump() {
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
                        alert("Please login first");
                        window.location.href = "/user/login";
                    }
                    else {
                        let arr = window.location.href.split("/");
                        let bindOid = arr[arr.length - 1].split("#")[0];
                        this.setSession("bindOid", bindOid);
                        switch (this.relateType) {
                            case "modelItem":
                                window.open("/user/createModelItem", "_blank")
                                break;
                            case "conceptualModel":
                                window.open("/user/createConceptualModel", "_blank")
                                break;
                            case "logicalModel":
                                window.open("/user/createLogicalModel", "_blank")
                                break;
                            case "computableModel":
                                window.open("/user/createComputableModel", "_blank")
                                break;
                            case "concept":
                                window.open("/repository/createConcept", "_blank")
                                break;
                            case "spatialReference":
                                window.open("/repository/createSpatialReference", "_blank")
                                break;
                            case "template":
                                window.open("/repository/createTemplate", "_blank")
                                break;
                            case "unit":
                                window.open("/repository/createUnit", "_blank")
                                break;
                        }
                    }
                }
            })
        },

        handleEdit(index, row) {
            // that.editableTabs_model[that.tabledataflag].tabledata.push(that.tableData);
            console.log(row);
            let flag = false;
            let j=0;
            for (i = 0; i < this.editableTabs_model[this.tabledataflag].tabledata.length; i++) {
                let tableRow = this.editableTabs_model[this.tabledataflag].tabledata[i];
                if (tableRow.oid == row.oid) {
                    flag = true;
                    break;
                }
            }
            if (!flag) {
                this.editableTabs_model[this.tabledataflag].tabledata.push(row);
                this.moid[this.oidnumber++] = row.oid;
            }
        },
        handleEdit1(index, row) {
            console.log(row);
            let flag = false;
            let j=0;
            for (i = 0; i < this.editableTabs_data[this.tabledataflag1].tabledata.length; i++) {
                let tableRow = this.editableTabs_data[this.tabledataflag1].tabledata[i];
                if (tableRow.oid == row.oid) {
                    flag = true;
                    break;
                }
            }
            if (!flag) {
                this.editableTabs_data[this.tabledataflag1].tabledata.push(row);
                this.doid[this.oidnumber++] = row.oid;
                //待定
                // this.doid[index] = row.oid;
            }
        },
        handleDelete(index, row) {
            console.log(index, row);
            let table = new Array();
            for (i = 0; i < this.tableData.length; i++) {
                table.push(this.tableData[i]);
            }
            table.splice(index, 1);
            this.tableData = table;

        },

        getRelation() {
            //从地址栏拿到oid
            let arr = window.location.href.split("/");
            let oid = arr[arr.length - 1].split("#")[0];
            let data = {
                oid: oid,
                type: this.relateType
            };
            $.ajax({
                type: "GET",
                url: "/modelItem/getRelation",
                data: data,
                async: true,
                success: (json) => {
                    if (json.code == 0) {
                        let data = json.data;
                        console.log(data)

                        this.tableData = data;

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
        handleCheckChange(data, checked, indeterminate) {
            let checkedNodes = this.$refs.tree2.getCheckedNodes();
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
            let index=0;
            for(i=0;i<UsersInfo.length;i+=4){
                let value1 = UsersInfo.eq(i)[0].value.trim();
                let value2 = UsersInfo.eq(i)[0].value.trim();
                let value3 = UsersInfo.eq(i)[0].value.trim();
                let value4 = UsersInfo.eq(i)[0].value.trim();
                if(value1==''&&value2==''&&value3==''&&value4==''){
                    index=i+4;
                }

            }
            for (i = prop.length; i > 0; i--) {
                prop.pop();
            }
            var result = "{";
            for (; index < UsersInfo.length; index++) {
                //
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
    },
    mounted() {
        let that = this;


        var mcname;


        const heights = $(window).height();
        const minH = heights-60;
        $(".infoPanel").css("min-height",minH+"px");


        window.onresize = () => {
            const height = $(window).height();
            const minH = height-60;
            $(".infoPanel").css("min-height",minH+"px");
        };

        $("#step1_next").click(function () {
            var theme_name = $("#nameInput").val();
            if (theme_name==""){
                alert("Please input theme name!");
                window.location.href = "/user/createTheme";
                return false;
            }
            that.relateType = "modelItem";
            that.tableData = [];
            that.pageOption1.currentPage=0;
            that.pageOption1.searchResult = [];
            that.relateSearch = "";
            that.getRelation();
            that.search1();
        })
        $("#step2_next").click(function () {
            if (!that.confirmflag) {
                alert("Please click confirm");
                return false;
            }
            that.confirmflag = 0;

            that.relateType = "dataItem";
            that.tableData = [];
            that.pageOption2.currentPage=0;
            that.pageOption2.searchResult = [];
            that.relateSearch = "";
            that.getRelation();
            that.search2();
        })
        $("#step3_next").click(function () {
            if (!that.confirmflag1) {
                alert("Please click confirm");
                return false;
            }
            that.confirmflag1 = 0;
        });

        const url="ModelDataDownloadServlet";
        $("#data-list").on('click','.view',function () {
            const dataID=this.getAttribute("div_id");
            console.log(dataID);
            const form = $("<form>");
            form.attr("style","display:none");
            form.attr("method","post");
            form.attr("action",url);
            $(this).append(form);//将表单放置在web中

            //在表单中添加input标签来传递参数
            //如有多个参数可添加多个input标签
            const input1=$("<input>");
            input1.attr("type","hidden");//设置为隐藏域
            input1.attr("name","dataID");//设置参数名称
            input1.attr("value",dataID);//设置参数值
            form.append(input1);//添加到表单中

            form.submit();//表单提交
            $.ajax({
                type:"get",
                url:"/test",
                dataType:'',
                success:function (data) {
                    console.log(data);
                }
            })
        });

        $(".thumbnail").click(function () {
            const dataID=this.attr("id");
            console.log(dataID);
        });

        $("." + that.classarr[0]).on("click", () => {
            that.initmodel(index,classarr,contentarr,listidarr,listidarrrow);
        });

        $("input[name='Status']").iCheck({
            //checkboxClass: 'icheckbox_square-blue',  // 注意square和blue的对应关系
            radioClass: 'iradio_flat-green',
            increaseArea: '0%' // optional
        });

        $.ajax({
            type: "GET",
            url: "/user/load",
            data: {

            },
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

        var oid = window.sessionStorage.getItem("edittheme_id");

        //var model_num = 1;
        //var data_num = 1;
        var m_attr = 0;
        var d_attr = 0;

        if ((oid === "0") || (oid === "") || (oid === null)) {

            $("#title").text("Create Theme");

            tinymce.init({
                selector: "textarea#myText",
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
            $("#title").text("Modify Theme")
            document.title="Modify Theme | OpenGMS"
            $.ajax({
                url: "/theme/getInfo/" + oid,
                type: "get",
                data: {},

                success: (result) => {
                    console.log(result)
                    var basicInfo = result.data;

                    //cls
                    $(".providers").children(".panel").remove();
                    $("#nameInput").val(basicInfo.name);

                    //image
                    if (basicInfo.image != "") {
                        $("#imgShow").attr("src", basicInfo.image);
                        $('#imgShow').show();
                    }
                    //reference

                    for (i = 0; i < basicInfo.references.length; i++) {
                        var ref = basicInfo.references[i];
                        table.row.add([
                            ref.title,
                            ref.author,
                            ref.date,
                            ref.journal,
                            ref.pages,
                            ref.links,
                            "<center><a href='javascript:;' class='fa fa-times refClose' style='color:red'></a></center>"]).draw();
                    }
                    if (basicInfo.references.length > 0) {
                        $("#dynamic-table").css("display", "block")
                    }


                    //detail
                    //tinymce.remove("textarea#myText");
                    $("#myText").html(basicInfo.detail);
                    tinymce.init({
                        selector: "textarea#myText",
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
            window.sessionStorage.setItem("edittheme_id", "");
        }

        $("#step").steps({
            onFinish: function () {
                alert('Wizard Completed');
            }
        });


        $('#tagInput').tagEditor({
            forceLowercase: false
        });
        $("#refAuthor").tagEditor({
            forceLowercase: false
        })

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
            }
        });


        $(document).on('click','#imgChange1',function ($event) {
            that.editableTabs_applications[that.tableflag3++].title = $("#applicationname").val();

            $("#imgFile1").click();
        })
        // $("#imgChange1").click(function () {
        //     $("#imgFile1").click();
        // });
        $("#imgFile1").change(function () {
            //获取input file的files文件数组;
            //$('#filed')获取的是jQuery对象，.get(0)转为原生对象;
            //这边默认只能选一个，但是存放形式仍然是数组，所以取第一个元素使用[0];
            var file = $('#imgFile1').get(0).files[0];
            //创建用来读取此文件的对象
            var reader = new FileReader();
            //使用该对象读取file文件
            reader.readAsDataURL(file);
            //读取文件成功后执行的方法函数
            reader.onload = function (e) {
                //读取成功后返回的一个参数e，整个的一个进度事件
                //选择所要显示图片的img，要赋值给img的src就是e中target下result里面
                //的base64编码格式的地址
                $('#imgShow1').get(0).src = e.target.result;
                $('#imgShow1').show();
            }
        })
        //table
        table = $('#dynamic-table').DataTable({
            //"aaSorting": [[ 0, "asc" ]],
            "paging": false,
            // "ordering":false,
            "info": false,
            "searching": false
        });
        $("#dynamic-table").css("display", "none")
        //$('#dynamic-table').dataTable().fnAddData(['111','111','111','1111','1111']);
        // $("#addref").click(function(){
        //     $("#refinfo").modal("show");
        // })
        $("#doiSearch").click(function () {
            $("#doi_searchBox").addClass("spinner")
            $.ajax({
                data: "Get",
                url: "/theme/DOISearch",
                data: {
                    doi: $("#doi_searchBox").val()
                },
                cache: false,
                async: true,
                success: (data) => {
                    data=data.data;
                    $("#doi_searchBox").removeClass("spinner")
                    if (data == "ERROR") {
                        alert(data);
                    }
                    // if(!json.doi){
                    //     alert("ERROR")
                    // }
                    else {
                        var json = eval('(' + data + ')');
                        console.log(json)
                        $("#doiTitle").val(json.title)
                        $("#doiAuthor").val(json.author)
                        $("#doiDate").val(json.month + " " + json.year)
                        $("#doiJournal").val(json.journal)
                        $("#doiPages").val(json.pages)
                        $("#doiLink").val(json.adsurl)
                        $("#doiDetails").css("display", "block");

                    }
                },
                error: (data) => {
                    $("#doi_searchBox").removeClass("spinner")
                    alert("ERROR!")
                    $("#doiDetails").css("display", "none");
                    $("#doiTitle").val("")
                }
            })


        });
        $("#modal_cancel").click(function () {
            $("#refTitle").val("")
            var tags = $('#refAuthor').tagEditor('getTags')[0].tags;
            for (i = 0; i < tags.length; i++) { $('#refAuthor').tagEditor('removeTag', tags[i]); }
            $("#refDate").val("")
            $("#refJournal").val("")
            $("#refLink").val("")
            $("#refPages").val("")

            $("#doiDetails").css("display", "none");
            $("#doiTitle").val("")
        })
        $("#modal_save").click(function () {

            if ($(".nav-tabs li").eq(0)[0].className == "active") {
                if ($("#refTitle").val().trim() == "") {
                    alert("Please Enter Title");
                }
                else {
                    table.row.add([
                        $("#refTitle").val(),
                        $("#refAuthor").val(),
                        $("#refDate").val(),
                        $("#refJournal").val(),
                        $("#refPages").val(),
                        $("#refLink").val(), "<center><a href='javascript:;' class='fa fa-times refClose' style='color:red'></a></center>"]).draw();

                    $("#dynamic-table").css("display", "block")
                    $("#refinfo").modal("hide")
                    $("#refTitle").val("")
                    var tags = $('#refAuthor').tagEditor('getTags')[0].tags;
                    for (i = 0; i < tags.length; i++) { $('#refAuthor').tagEditor('removeTag', tags[i]); }
                    $("#refDate").val("")
                    $("#refJournal").val("")
                    $("#refPages").val("")
                    $("#refLink").val("")
                }

            }
            else {
                if ($("#doiTitle").val() == "") {
                    alert("Details are empty");
                }
                else {
                    table.row.add([
                        $("#doiTitle").val(),
                        $("#doiAuthor").val(),
                        $("#doiDate").val(),
                        $("#doiJournal").val(),
                        $("#doiPages").val(),
                        $("#doiLink").val(), "<center><a href='javascript:;' class='fa fa-times refClose' style='color:red'></a></center>"]).draw();
                    $("#dynamic-table").css("display", "block")
                    $("#refinfo").modal("hide")
                    $("#doiDetails").css("display", "none");
                    $("#doiTitle").val("");
                }
            }


        })
        //table end

        $(document).on("click", ".refClose", function () {
            table.row($(this).parents("tr")).remove().draw();
            //$(this).parents("tr").eq(0).remove();
            console.log($("tbody tr"));
            if ($("tbody tr").eq(0)[0].innerText == "No data available in table") {
                $("#dynamic-table").css("display", "none")
            }
        });

        let height = document.documentElement.clientHeight;
        this.ScreenMaxHeight = (height) + "px";
        this.IframeHeight = (height - 20) + "px";

        window.onresize = () => {
            console.log('come on ..');
            height = document.documentElement.clientHeight;
            this.ScreenMaxHeight = (height) + "px";
            this.IframeHeight = (height - 20) + "px";
        }


        // var themeObj = {};
        that.themeObj.classinfo = new Array();
        that.themeObj.dataClassInfo = new Array();
        that.themeObj.application = new Array();


        $(document).on('click','#selectok',function ($event) {
            that.editableTabs_model[that.tableflag1++].title = $("#categoryname").val();
            //将tabledata中的数据放到二维数组tabledata_two
            $("#selectok").html("That's ok");
            that.confirmflag = 1;
            $("#selectok").attr('id',"selectok_past");
            /*classinfo 类似于reference,将选择的model的oid放到classinfo中*/
            // themeObj.classinfo = new Array();
            var cla = {};
            cla.mcname = $("#categoryname").val();
            cla.modelsoid = that.moid;
            that.themeObj.classinfo.push(cla);
            // for(var i=0;i<that.tableData.length;i++){
            //     that.editableTabs_model[that.tabledataflag].tabledata[i] = that.tableData[i];
            // }
            // that.editableTabs_model[that.tabledataflag].tabledata.push(that.tableData);
            that.tabledataflag++;
            // that.editableTabs_model[that.tabledataflag++].tabledata.push(that.tableData);//将当前获取的tabledata追加到大数组中

            that.dialogTableVisible=false;

            $("#categoryname").attr('id','categoryname_past');//改变当前id名称
            that.oidnumber = 0;
            that.moid=[];
        });
        $(document).on('click','#selectok1',function ($event) {
            that.editableTabs_data[that.tableflag2++].title = $("#categoryname2").val();
            $("#selectok1").html("That's ok");
            that.confirmflag1 = 1;
            $("#selectok1").attr('id',"selectok1_past");
            /*dataclassinfo 类似于reference,将选择的model的oid放到dataclassinfo中*/
            var dcla = {};
            dcla.dcname = $("#categoryname2").val();
            dcla.datasoid = that.doid;
            that.themeObj.dataClassInfo.push(dcla);

            // that.editableTabs_data[that.tabledataflag1].tabledata.push(that.tableData);
            that.tabledataflag1++;

            that.dialogTableVisible1=false;

            $("#categoryname2").attr('id','categoryname2_past');//改变当前id名称
            that.oidnumber = 0;
            that.doid=[];
        });

        $(".finish").click(()=> {
            //step1
            that.themeObj.themename = $("#nameInput").val();
            that.themeObj.image = $('#imgShow').get(0).src;

            var detail = tinyMCE.activeEditor.getContent();
            that.themeObj.detail = detail.trim();
            console.log(that.themeObj);

            that.themeObj.uploadImage = $('#imgShow').get(0).currentSrc;
            // themeObj.application_image = $('#imgShow1').get(0).src;
            // themeObj.upload_application_image = $('#imgShow1').get(0).currentSrc;
            let formData=new FormData();

            //第二份追加，因为输入最后一次后，不需要再点击add，只需要点击finish
            var app = {};
            app.applicationname = $("#applicationname").val();
            app.applicationlink = $("#applicationlink").val();
            app.upload_application_image = $("#imgShow1").get(0).currentSrc;
            that.themeObj.application.push(app);

            if ((oid === "0") || (oid === "") || (oid == null)) {
                let file = new File([JSON.stringify(that.themeObj)],'ant.txt',{
                    type: 'text/plain',
                });
                formData.append("info",file);
                $.ajax({
                    url: "/repository/addTheme",
                    type: "POST",
                    processData: false,
                    contentType: false,
                    async: false,
                    data: formData,
                    success: function (result) {

                        if (result.code == "0") {
                            alert("Create Success");
                            window.location.href = "/repository/theme/" + result.data;//刷新当前页面
                        }
                    }
                })
            } else {

                that.themeObj["oid"] = oid;

                let file = new File([JSON.stringify(that.themeObj)],'ant.txt',{
                    type: 'text/plain',
                });
                formData.append("info",file);
                $.ajax({
                    url: "/theme/update",
                    type: "POST",
                    processData: false,
                    contentType: false,
                    async: false,
                    data: formData,

                    success: function (result) {
                        if (result.code === 0) {
                            if(result.data.method==="update") {
                                alert("Update Success");
                                $("#editModal", parent.document).remove();
                                window.location.href = "/theme/" + result.data.oid;
                            }
                            else{
                                alert("Success! Changes have been submitted, please wait for the webmaster to review.");
                                window.location.href = "/user/userSpace";
                            }
                            // window.location.href = "/theme/" + result.data;
                            //window.location.reload();
                        }
                        else{
                            alert(result.msg);
                        }
                    }
                })
            }
        });

        $(document).on("click", ".author_close", function () { $(this).parents(".panel").eq(0).remove(); });

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