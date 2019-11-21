var vue = new Vue({
    el: "#app",
    data: {
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
        pageOption: {
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

        initmodel(index,classarr,contentarr,listidarr,listidarrrow){
            const modelList = document.getElementById(listidarr[index-1]);
            modelList.innerHTML = "";
            const rowNum = Math.ceil(contentarr[index-1].length / this.numOfModelPerRow);
            for (var i = 0; i < rowNum; i++) //行
            {
                const row = document.createElement("div");
                row.setAttribute("class", "row");

                for (let j = 0; j < this.numOfModelPerRow; j++)  //每行6个
                {
                    if ((i * this.numOfModelPerRow + j) < contentarr[index-1].length) {
                        const model = document.createElement("div");
                        model.setAttribute("class", "col-md-55");

                        const modelThumbnail = document.createElement("div");
                        modelThumbnail.setAttribute("class", "thumbnail");

                        const a = document.createElement("a");
                        a.setAttribute("href", contentarr[index-1][i * this.numOfModelPerRow + j].link);//每个模型的链接
                        a.setAttribute("target", "_blank");  //target 属性规定在何处打开链接文档。_blank 浏览器总在一个新打开、未命名的窗口中载入目标文档。
                        const picPanel = document.createElement("div");
                        picPanel.setAttribute("class", "image view view-first");
                        const img = document.createElement("img");
                        //此处设置模型图片
                        img.setAttribute("src", "/static/thematicmodel/css/images/model/thumb.png");

                        const mask = document.createElement("div");
                        mask.setAttribute("class", "mask");
                        const p = document.createElement("p");
                        p.innerText = contentarr[index-1][i * this.numOfModelPerRow + j].model;
                        mask.appendChild(p);
                        picPanel.appendChild(img);
                        picPanel.appendChild(mask);
                        a.appendChild(picPanel);
                        modelThumbnail.appendChild(a);

                        const caption = document.createElement("div");
                        caption.setAttribute("class", "caption");
                        const p2 = document.createElement("p");
                        p2.innerText = contentarr[index-1][i * this.numOfModelPerRow + j].modelname;
                        caption.appendChild(p2);
                        modelThumbnail.appendChild(caption);

                        model.appendChild(modelThumbnail);
                        row.appendChild(model);
                    }
                }
                modelList.appendChild(row);
            }

            for (var i = 2; i < rowNum; i++) {
                $(listidarrrow[index-1]).eq(i).hide();
            }


        },

        changecolor(a) {
            {
                switch (a) {
                    case 0:
                        $("#theme").css("color","blue");
                        break;
                    case "expand":
                        $("#ex").css("color","blue");
                        break;
                    case 1:
                        $("#model-Image").css("color","blue");
                        break;
                    case 2:
                        $("#model-Text ").css("color","blue");
                        break;
                    case 3:
                        $("#model-Audio frequency").css("color","blue");
                        break;
                    case 4:
                        $("#model-Video ").css("color","blue");
                        break;
                    case 5:
                        $("#model-Semantic segmentation ").css("color","blue");
                        break;
                    case 6:
                        $("#sidebar-data").css("color","blue");
                        break;
                    case 7:
                        $("#applications").css("color","blue");
                        break;
                }
            }
        },

        initmenucolor(){
            $("#theme").css("color","black");
            $("#ex").css("color","black");
            $("#model-Image").css("color","black");
            $("#model-Text ").css("color","black");
            $("#model-Audio frequency").css("color","black");
            $("#model-Video ").css("color","black");
            $("#model-Semantic segmentation ").css("color","black");
            $("#sidebar-data").css("color","black");
            $("#applications").css("color","black");
        },


        handleClose(done) {
            this.$confirm('Are you sure to close？')
                .then(_ => {
                    done();
                })
                .catch(_ => {
                });
        },

        handlePageChange(val) {
            this.pageOption.currentPage = val;
            this.search();
        },

        search() {
            var data = {
                asc: this.pageOption.sortAsc,
                page: this.pageOption.currentPage,
                pageSize: this.pageOption.pageSize,
                searchText: this.relateSearch,
                sortType: "default",
                classifications: ["all"],
            };
            let url, contentType;
            switch (this.relateType) {
                case "dataItem":
                    url="/dataItem/searchByName";
                    data = {
                        page: this.pageOption.currentPage+1,
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

            console.log(row);
            let flag = false;
            let j=0;
            for (i = 0; i < this.tableData.length; i++) {
                let tableRow = this.tableData[i];
                if (tableRow.oid == row.oid) {
                    flag = true;
                    break;
                }
            }
            if (!flag) {
                this.tableData.push(row);
                this.moid[this.oidnumber++] = row.oid;
            }
        },
        handleEdit1(index, row) {
            console.log(row);
            let flag = false;
            let j=0;
            for (i = 0; i < this.tableData.length; i++) {
                let tableRow = this.tableData[i];
                if (tableRow.oid == row.oid) {
                    flag = true;
                    break;
                }
            }
            if (!flag) {
                this.tableData.push(row);
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


        $(document).on('click','#selectmodel',function ($event) {
            //alert("ok");
            that.relateType = "modelItem";
            that.tableData = [];
            that.pageOption.currentPage=0;
            that.pageOption.searchResult = [];
            that.relateSearch = "";
            that.getRelation();
            that.search();
            that.dialogTableVisible = true;
        });

        $(document).on('click','#selectdata',function ($event) {
            //alert("ok");
            that.relateType = "dataItem";
            that.tableData = [];
            that.pageOption.searchResult = [];
            that.relateSearch = "";
            that.getRelation();
            that.search();
            that.dialogTableVisible1 = true;
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
        // themeObj.classinfo = new Array();
        //const classarr = new Array(".modelimage",".modeltext",".modelaudio",".modelvideo",".modelsemantic",".sidebardata",".applications");//存储各种模型类的class
        const contentarr = new Array("modelimage","modeltext","modelaudio","modelvideo","modelsemantic","sidebardata","applications");//存储模型类的模型内容名
        const listidarr = new Array("modelimage","modeltext","modelaudio","modelvideo","modelsemantic","sidebardata","applications");//右侧展示id
        const listidarrrow = new Array("modelimage.row","modeltext.row","modelaudio.row","modelvideo.row","modelsemantic.row","sidebardata.row","applications.row");//右侧展示id
        //var bclassarr = "," + this.classarr[0];
        console.log(this);
        console.log(that);
        $("." + that.classarr[0]).on("click", () => {
            that.initmodel(index,classarr,contentarr,listidarr,listidarrrow);
        });
        /**
         * 展开按钮
         */
        $(".expandBtn").click(function (e) {
            if($(this).text().indexOf("Expand")>=0){ //$(this)是当前元素被jQuery处理的对象,即expandBtn的jquery对象。如果expandBtn的text中包含Expand
                //显示剩余的每一行模型
                $(this).parent().siblings(".x_content").children(".row").show();//选择expandBtn的父亲的所有兄弟中class="info"的元素的孩子中class="row"的元素，显示

                $(this).html("Collapse&nbsp; <i class=\"fa fa-caret-up\"></i>");//同时给Collapse赋以内容
            }else{
                //隐藏所有行，然后只显示1.2行
                $(this).parent().siblings(".x_content").children(".row").hide();
                $(this).parent().siblings(".x_content").children(".row").eq(0).show();
                $(this).parent().siblings(".x_content").children(".row").eq(1).show();
                $(this).html("Expand&nbsp; <i class=\"fa fa-caret-down\"></i>");
            }
            e.preventDefault();
        });


        /**
         * 左边的目录树点击事件
         */
        $(".navbarPanel .navigation a").click(function () {
            index = $(this).attr("index")*1;  //获取当前点击的navigation的index
            $(".infoPanel").hide();               //隐藏右边的所有页面
            $(".infoPanel").eq(index).show();     //显示click的一个
            if($(".infoPanel").eq(index).children(".info").children(".row").length<3){   //如果行数<3，则不显示expand
                $(".infoPanel").eq(index).children(".expand").hide();
            }
            $(".infoPanel").eq(index).children(".info").children(".row").eq(0).show();   //否则显示前两行
            $(".infoPanel").eq(index).children(".info").children(".row").eq(1).show();
            //改变按钮背景色
            that.initmenucolor();
            that.changecolor(index);
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
        // $("#imgFile1").change(function () {
        //     //获取input file的files文件数组;
        //     //$('#filed')获取的是jQuery对象，.get(0)转为原生对象;
        //     //这边默认只能选一个，但是存放形式仍然是数组，所以取第一个元素使用[0];
        //     var file = $('#imgFile1').get(0).files[0];
        //     //创建用来读取此文件的对象
        //     var reader = new FileReader();
        //     //使用该对象读取file文件
        //     reader.readAsDataURL(file);
        //     //读取文件成功后执行的方法函数
        //     reader.onload = function (e) {
        //         //读取成功后返回的一个参数e，整个的一个进度事件
        //         //选择所要显示图片的img，要赋值给img的src就是e中target下result里面
        //         //的base64编码格式的地址
        //         $('#imgShow1').get(0).src = e.target.result;
        //         $('#imgShow1').show();
        //     }
        // });

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


        var themeObj = {};
        themeObj.classinfo = new Array();
        themeObj.dataClassInfo = new Array();
        themeObj.application = new Array();

        $(".next").click(()=> {
            themeObj.themename = $("#nameInput").val();
            themeObj.image = $('#imgShow').get(0).src;

            var detail = tinyMCE.activeEditor.getContent();
            themeObj.detail = detail.trim();

            // themeObj.references = new Array();
            // var ref_lines = $("#dynamic-table tr");
            // for (i = 1; i < ref_lines.length; i++) {
            //     var ref_prop = ref_lines.eq(i).children("td");
            //     if (ref_prop != 0) {
            //         var ref = {};
            //         ref.title = ref_prop.eq(0).text();
            //         if (ref.title == "No data available in table")
            //             break;
            //         ref.author = ref_prop.eq(1).text().split(",");
            //         ref.date = ref_prop.eq(2).text();
            //         ref.journal = ref_prop.eq(3).text();
            //         ref.pages = ref_prop.eq(4).text();
            //         ref.links = ref_prop.eq(5).text();
            //         themeObj.references.push(ref);
            //     }
            // }

            var detail = tinyMCE.activeEditor.getContent();
            themeObj.detail = detail.trim();
            console.log(themeObj);
        });
        //在这个函数中将需要初始化的重新初始化
        $("#selectok").click(()=>{
            /*classinfo 类似于reference,将选择的model的oid放到classinfo中*/
            // themeObj.classinfo = new Array();
            var cla = {};
            cla.mcname = $("#categoryname").val();
            cla.modelsoid = this.moid;
            themeObj.classinfo.push(cla);

            that.dialogTableVisible=false;

            $("#categoryname").attr('id','categoryname_past');//改变当前id名称
            this.oidnumber = 0;
            this.moid=[];
            });

        $("#selectok1").click(()=>{
            /*dataclassinfo 类似于reference,将选择的model的oid放到dataclassinfo中*/
            var dcla = {};
            dcla.dcname = $("#categoryname2").val();
            dcla.datasoid = this.doid;
            themeObj.dataClassInfo.push(dcla);

            that.dialogTableVisible1=false;

            $("#categoryname2").attr('id','categoryname2_past');//改变当前id名称
            this.oidnumber = 0;
            this.doid=[];
        });

        $(".finish").click(()=> {

            themeObj.uploadImage = $('#imgShow').get(0).currentSrc;
            // themeObj.application_image = $('#imgShow1').get(0).src;
            // themeObj.upload_application_image = $('#imgShow1').get(0).currentSrc;
            let formData=new FormData();

            //第二份追加，因为输入最后一次后，不需要再点击add，只需要点击finish
            var app = {};
            app.applicationname = $("#applicationname").val();
            app.applicationlink = $("#applicationlink").val();
            app.upload_application_image = $("#imgShow1").get(0).currentSrc;
            themeObj.application.push(app);

            if ((oid === "0") || (oid === "") || (oid == null)) {
                let file = new File([JSON.stringify(themeObj)],'ant.txt',{
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

                themeObj["oid"] = oid;

                let file = new File([JSON.stringify(themeObj)],'ant.txt',{
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

        //增加data输入框
        // $(document).on('click','#adddata',function ($event) {
        //     var e = $event.originalEvent.path[4];//获取当前div的源div，取得modelarr的div的class值
        //     //data_num++;
        //     var str = "<div style=\"margin-top:10px\"> <lable class='control-label col-sm-2 text-center' style='font-weight: bold;'>";
        //     str += "Data name：";
        //     //str += data_num +":";
        //     str += "</lable> <div class='input-group col-sm-10'> <input type='text' name=\"ins\" class='form-control'> <span class=\"input-group-btn\"> " +
        //         "<button id=\"adddata\" class=\"btn btn-success\" type=\"button\">add</button> </span></div></div>"
        //     var dataarr;
        //     dataarr = "."+e.className;
        //     $(dataarr).append(str);
        //     $(dataarr).find("button").eq(0).html("").remove();//定位到指定div下的button进行移除，可保证不会串div
        // });
        //模型添加
        $(".model-add").click(function () {
            m_attr++;
            var content_box = $(this).parent().children('div');
            var str = "<div class='panel panel-primary'><div class='panel-heading info-head'><h4 class='panel-title'><a class='accordion-toggle collapsed' style=\"color:white\" " +
                "data-toggle='collapse' data-target='#model1' href=\"javascript:;\"> ";
            str += "NEW";
            str += "</a></h4> <a href=\"javascript:;\"class=\"fa fa-times author_close\"style=\"float:right;margin-top:8px;color:white\"></a></div> " +
                "<div id='model1'class='panel-collapse collapse in'><div class='panel-body user-contents'>" +
                " <div class='model-attr" + m_attr +"'";//改变modelarr的值，每次增加该class递增一，这样便于与addmodel的click事件对应起来
            str+= "><div><lable class='control-label col-sm-2 text-center' style='font-weight: bold;'>";
            str += "Category Name";
            str += "</lable><div class='input-group col-sm-10'><input type='text'name=\"name\" id=\"categoryname\" class='form-control'></div></div><div style=\"margin-top:10px\">" +
                "<lable class='control-label col-sm-2 text-center'" +
                "style='font-weight: bold;'>";
            str += "Model name:";
            str += " </lable><div class='input-group col-sm-10'>\n" +
                "   <button type=\"button\"  icon=\"el-icon-plus\" id =\"selectmodel\" style=\"width: 100%\">Select Model\n" +
                "   </button>\n" +
                "</div></div></div></div></div></div>";
            content_box.append(str);
        });
        //数据输入框增加
        $(".data-add").click(function () {
            d_attr++;
            var content_box = $(this).parent().children('div');
            var str = "<div class='panel panel-primary'><div class='panel-heading info-head'><h4 class='panel-title'><a class='accordion-toggle collapsed' style=\"color:white\" " +
                "data-toggle='collapse' data-target='#data1' href=\"javascript:;\"> ";
            str += "NEW";
            str += "</a></h4> <a href=\"javascript:;\"class=\"fa fa-times author_close\"style=\"float:right;margin-top:8px;color:white\"></a></div> " +
                "<div id='data1'class='panel-collapse collapse in'><div class='panel-body user-contents'> <div class='data-attr" + d_attr +"'";//改变addarr的值，每次增加该class递增一，这样便于与adddata的click事件对应起来
            str +="><div><lable class='control-label col-sm-2 text-center' style='font-weight: bold;'>";
            str += "Category Name";
            str += "</lable><div class='input-group col-sm-10'><input type='text'name=\"name\" id=\"categoryname2\" class='form-control'></div></div><div style=\"margin-top:10px\"><lable class='control-label col-sm-2 text-center'" +
                "style='font-weight: bold;'>";
            str += "Data Name:";
            str += " </lable><div class='input-group col-sm-10'>\n" +
                "   <button type=\"button\" id =\"selectdata\" icon=\"el-icon-plus\" style=\"width: 100%\">Select Data\n" +
                "   </button>\n" +
                "</div></div></div></div></div></div>"
            content_box.append(str)
        });
        //应用输入框增加
        $(".applications-add").click(function () {
            var content_box = $(this).parent().children('div');
            var str = "<div class='panel panel-primary'><div class='panel-heading info-head'><h4 class='panel-title'><a class='accordion-toggle collapsed' style=\"color:white\" " +
                "data-toggle='collapse' data-target='#applications1' href=\"javascript:;\"> ";
            str += "NEW";
            str += "</a></h4> <a href=\"javascript:;\"class=\"fa fa-times author_close\"style=\"float:right;margin-top:8px;color:white\"></a></div> " +
                "<div id='applications1'class='panel-collapse collapse in'><div class='panel-body user-contents'> <div class='user-attr'><div><lable class='control-label col-sm-2 text-center'" +
                "style='font-weight: bold;'>";
            str += "Name";
            str += "</lable><div class='input-group col-sm-10'><input type='text' name=\"name\" id=\"applicationname\" class='form-control'></div></div><div style=\"margin-top:10px\"><lable class='control-label col-sm-2 text-center'" +
                "style='font-weight: bold;'>";
            str += "Link:";
            str += "</lable><div class='input-group col-sm-10'><input type='text' name=\"ins\" id=\"applicationlink\" class='form-control'></div></div>";
            str +="    <div style=\"margin-top:10px\">\n" +
                "                                                                                                        <lable class='control-label col-sm-2 text-center'\n" +
                "                                                                                                               style='font-weight: bold;'>\n" +
                "                                                                                                            Image:\n" +
                "                                                                                                        </lable>\n" +
                "                                                                                                        <div class=\"col-sm-10\">\n" +
                "                                                                                                            <img id=\"imgShow1\" src=\"\"/>\n" +
                "                                                                                                            <div id=\"imgChange1\">\n" +
                "                                                                                                                <i class=\"fa fa-plus fa-5x\"></i>\n" +
                "                                                                                                            </div>\n" +
                "                                                                                                            <input id=\"imgFile1\" type=\"file\"\n" +
                "                                                                                                                   style=\"display: none\"\n" +
                "                                                                                                                   accept=\"image/*\"/>\n" +
                "                                                                                                        </div>\n" +
                "                                                                                                    </div>"
            str +="</div></div></div></div></div>";
            content_box.append(str);

            var app = {};
            app.applicationname = $("#applicationname").val();
            app.applicationlink = $("#applicationlink").val();
            app.upload_application_image = $("#imgShow1").get(0).currentSrc;
            themeObj.application.push(app);


            $("#applicationname").attr('id','applicationname_past');//改变当前id名称
            $("#applicationlink").attr('id','applicationlink_past');//改变当前id名称
            $("#imgShow1").attr('id','imgShow1_past');//改变当前id名称
            $("#imgChange1").attr('id','imgChange1_past');//改变当前id名称
            //还需要在finish里写一份，作为最后一次输入的追加


        });

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