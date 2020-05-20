var createDataItem = Vue.extend({
    template: "#createDataItem",
    data() {
        return {

            defaultActive: '2-1',
            curIndex: 3,

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

            classif: [],
            active: 0,
            categoryTree: [],
            ctegorys: [],

            data_img: [],

            dataItemAddDTO: {
                name: '',
                status: 'Public',
                description: '',
                detail: '',
                author: '',
                reference: '',
                keywords: [],
                classifications: [],
                displays: [],
                authorship: [],
                meta: {
                    coordinateSystem: '',
                    geographicProjection: '',
                    coordinateUnits: '',
                    boundingRectangle: []
                }

            },

            treeData: [{
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

            defaultProps: {
                children: 'children',
                label: 'label'
            },
            cls: [],//分类的id队列
            clsStr: '',//分类的label队列


        }
    },
    methods: {
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

        // handleSelect(index,indexPath){
        //     this.setSession("index",index);
        //     window.location.href="/user/userSpace"
        // },
        handleCheckChange(data, checked, indeterminate) {
            let checkedNodes = this.$refs.tree2.getCheckedNodes()
            let classes = [];
            let str='';
            for (let i = 0; i < checkedNodes.length; i++) {
                // console.log(checkedNodes[i].children)
                if(checkedNodes[i].children!=undefined){
                    continue;
                }

                classes.push(checkedNodes[i].id);
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

        getDataItems() {
            this.pageSize = 10;
            this.isInSearch = 0;
            var da = {
                userOid: this.userId,
                page: this.page,
                pagesize: this.pageSize,
                asc: -1
            }

            this.loading = true
            var that = this;
            //todo 从后台拿到用户创建的data—item
            axios.get("/user/getDataItems", {
                params: da
            }).then(res => {

                this.searchResult = res.data.data.content
                this.resourceLoad = false;
                this.totalNum = res.data.data.totalElements;
                if (this.page == 1) {
                    this.pageInit();
                }
                this.data_show = true
                this.loading = false

            })


        },

        //add data item
        createdataitem() {
            this.dataItemAddDTO.name = $("#dataname").val();

            this.dataItemAddDTO.description = $("#description").val();
            // this.dataItemAddDTO.detail=$("#detail").val();
            var detail = tinyMCE.activeEditor.getContent();
            this.dataItemAddDTO.detail = detail;
            //todo 获取作者信息
            // this.dataItemAddDTO.author=$("#author").val();
            this.dataItemAddDTO.keywords = $("#keywords").tagEditor('getTags')[0].tags;

            this.dataItemAddDTO.classifications = this.cls;
            // this.dataItemAddDTO.displays.push($("#displays").val())
            this.dataItemAddDTO.displays = this.data_img

            this.dataItemAddDTO.reference = $("#dataresoureurl").val()


            //用户名
            // this.dataItemAddDTO.author=this.userId;
            this.dataItemAddDTO.author = this.userId;

            this.dataItemAddDTO.meta.coordinateSystem = $("#coordinateSystem").val();
            this.dataItemAddDTO.meta.geographicProjection = $("#geographicProjection").val();
            this.dataItemAddDTO.meta.coordinateUnits = $("#coordinateUnits").val();

            this.dataItemAddDTO.meta.boundingRectangle = [];


            var authorship = []
            var author_lenth = $(".user-attr").length;
            for (var i = 0; i < author_lenth; i++) {

                let authorInfo = {
                    name: '',
                    email: '',
                    homepage: ''
                }
                console.log($(".user-attr input"))
                let t = 3 * i
                authorInfo.name = $(".user-attr input")[t].value
                authorInfo.email = $(".user-attr input")[1 + t].value
                authorInfo.homepage = $(".user-attr input")[2 + t].value
                authorship.push(authorInfo)

            }
            this.dataItemAddDTO.authorship = authorship


            var thedata = this.dataItemAddDTO;

            var that = this

                axios.post("/dataItem/", thedata)
                    .then(res => {
                        if (res.status == 200) {


                            //创建静态页面
                            axios.get("/dataItem/adddataitembyuser", {
                                params: {
                                    id: res.data.data.id
                                }
                            }).then(() => {

                            });
                            $(".prev").click();
                            $(".prev").click();


                            //清空
                            $("#classification").val('')
                            $("#dataname").val('');
                            $("#description").val('');
                            $("#keywords").tagEditor('removeAll');

                            $("#displays").val('');
                            $("#dataresoureurl").val("")
                            $("#coordinateSystem").val("");
                            $("#geographicProjection").val("")
                            $("#coordinateUnits").val("")
                            $("#upperleftx").val("")
                            $("#upperlefty").val("")
                            $("#bottomrightx").val("")
                            $("#bottomrighty").val("");
                            $("#imgFile").val("");

                            var categoryAddDTO = {
                                id: res.data.data.id,
                                cate: that.cls
                            }
                            axios.post('/dataItem/addcate', categoryAddDTO).then(res => {
                                // console.log(res)
                            });

                            //每次创建完条目后清空category内容
                            that.ctegorys = [];
                            //清空displays内容
                            that.data_img = []


                            this.$confirm('<div style=\'font-size: 18px\'>Create data item successfully!</div>', 'Tip', {
                                dangerouslyUseHTMLString: true,
                                confirmButtonText: 'View',
                                cancelButtonText: 'Go Back',
                                cancelButtonClass: 'fontsize-15',
                                confirmButtonClass: 'fontsize-15',
                                type: 'success',
                                center: true,
                                showClose: false,
                            }).then(() => {
                                window.location.href = "/dataItem/" + res.data.data.id;
                            }).catch(() => {
                                window.location.href = "/user/userSpace#/data/dataitem";
                            });

                        }
                    })

        },

        // chooseCate(item, e) {
        //     if ($("#classification").val() != null) {
        //         $("#classification").val('')
        //     }
        //     // this.classif.push(e.target.innerText);
        //
        //     $("#classification").val(this.classif);
        //
        //     this.ctegorys.push(item.id)
        //
        // },

        next() {

        },
        change(currentIndex, newIndex, stepDirection) {
            console.log(currentIndex, newIndex, stepDirection)
        },

        sendcurIndexToParent(){
            this.$emit('com-sendcurindex',this.curIndex)
        },

        sendUserToParent(userId){
            this.$emit('com-senduserinfo',userId)
        },

    },
    mounted() {
        //初始化的时候吧curIndex传给父组件，来控制bar的高亮显示
        this.sendcurIndexToParent()

        var tha = this

        this.classif = [];
        $("#classification").val('');

        axios.get("/dataItem/createTree")
            .then(res => {
                tha.tObj = res.data;
                let i=0
                for (var e in tha.tObj) {
                    var children = []
                    for(let ele of tha.tObj[e]){
                        let child={
                            label:ele.category,
                            id:ele.id
                        }
                        children.push(child)
                    }

                    var a = {
                        label: e,
                        children: children
                    }
                    if (e != 'Data Resouces Hubs') {
                        tha.categoryTree.push(a);
                        tha.treeData = tha.categoryTree
                    }


                }


            })
        var that = this

        // tinymce.init({
        //     selector: "textarea#detail",
        //     height: 205,
        //     theme: 'modern',
        //     plugins: ['link', 'table', 'image', 'media'],
        //     image_title: true,
        //     // enable automatic uploads of images represented by blob or data URIs
        //     automatic_uploads: true,
        //     // URL of our upload handler (for more details check: https://www.tinymce.com/docs/configure/file-image-upload/#images_upload_url)
        //     // images_upload_url: 'postAcceptor.php',
        //     // here we add custom filepicker only to Image dialog
        //     file_picker_types: 'image',
        //
        //     file_picker_callback: function (cb, value, meta) {
        //         var input = document.createElement('input');
        //         input.setAttribute('type', 'file');
        //         input.setAttribute('accept', 'image/*');
        //         input.onchange = function () {
        //             var file = input.files[0];
        //
        //             var reader = new FileReader();
        //             reader.readAsDataURL(file);
        //             reader.onload = function () {
        //                 var img = reader.result.toString();
        //                 cb(img, {title: file.name});
        //             }
        //         };
        //         input.click();
        //     },
        //     images_dataimg_filter: function (img) {
        //         return img.hasAttribute('internal-blob');
        //     }
        // });

        $(".step2").steps({

            onFinish: function () {
                alert('complete');
            },
            onChange: function (currentIndex, newIndex, stepDirection) {


                // console.log(currentIndex, newIndex, stepDirection)
                // if((that.indexStep==0&&that.newStep==1)||(that.indexStep==1&&that.newStep==2)){
                //     that.indexStep=-1;
                //     that.newStep-=1;
                //     return true
                // }else {
                //
                //     return false
                // }

                if (currentIndex === 0) {
                    if (stepDirection === "forward") {
                        if ($("#dataname").val().length == 0 || that.clsStr.length == 0 || $("#keywords").tagEditor('getTags')[0].tags.length == 0) {
                            new Vue().$message({
                                message: 'Please complete data information!',
                                type: 'warning',
                                offset: 70,
                            });
                            return false;
                        } else {
                            return true;
                        }

                    }
                }

                if (currentIndex === 1) {
                    if (stepDirection === "forward") {
                        if ($("#description").val().length == 0) {
                            new Vue().$message({
                                message: 'Please complete data\'s description!',
                                type: 'warning',
                                offset: 70,
                            });
                            return false;
                        } else {


                            return true;
                        }

                    }
                }

            }
        });

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
                    //$("#provider_body .providers h4 a").eq(0).text(data.name);
                    // $.get("http://localhost:8081/GeoModelingNew/UserInfoServlet",{"userId":this.userId},(result)=> {
                    //     this.userInfo=eval('('+result+')');
                    //     console.log(this.userInfo)
                    // })
                }
            }
        })


        var oid = this.$route.params.editId;//取得所要edit的id

        var user_num = 0;

        if ((oid === "0") || (oid === "") || (oid === null)|| (oid === undefined)) {

            // $("#title").text("Create Model Item")
            $("#subRteTitle").text("/Create Data Item")
            $("#keywords").tagEditor('destory');
            $("#keywords").tagEditor({
                forceLowercase: false,
            });

            $("#contributers").tagEditor('destory');
            $("#contributers").tagEditor({
                forceLowercase: false,
            });

            tinymce.remove("textarea#detail");//先销毁已有tinyMCE实例
            tinymce.init({
                selector: "textarea#detail",
                height: 205,
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
            // $("#title").text("Modify Model Item")
            $("#subRteTitle").text("/Modify Data Item")

            document.title="Modify Data Item | OpenGMS"
            axios.get('/dataItem/getDataItemByDataId',{params:{
                dataId:oid,
            }}).then(res=>{
                const resData = res.data
                if(resData.code==-1){
                    alert("Please login");
                    window.location.href = "/user/login";
                }else if(resData.data.noResult!=1){
                    let data = resData.data.result

                    let classificationId = data.classifications

                    this.$refs.tree2.setCheckedKeys(data.classifications);
                    this.clsStr=data.categories;
                    //清空
                    // $("#classification").val('')
                    $("#dataname").val(data.name);
                    $("#description").val(data.description);
                    $("#keywords").tagEditor('destory');
                    $("#keywords").tagEditor({
                        initialTags: data.keywords,
                        forceLowercase: false,
                        placeholder: 'Enter keywords ...'
                    });
                    $("#contributers").tagEditor('destory');
                    $("#contributers").tagEditor({
                        initialTags: data.contributers,
                        forceLowercase: false,
                        placeholder: 'Enter keywords ...'
                    });

                    $("#detail").html(data.detail);

                    $('#imgShow').get(0).src = data.displays[0];
                    $('#imgShow').show();
                    $("#displays").val('');
                    $("#dataresoureurl").val(data.reference)

                    $("#coordinateSystem").val(data.meta.coordinateSystem);
                    $("#geographicProjection").val(data.meta.geographicProjection)
                    $("#coordinateUnits").val(data.meta.coordinateUnits)


                    tinymce.remove("textarea#detail");//先销毁已有tinyMCE实例
                    $("#modelItemText").html(data.detail);
                    tinymce.init({
                        selector: "textarea#detail",
                        height: 205,
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

                    let authorship = data.authorship;
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
                    $("#email").val("")
                    $("#home_page").val("")
                    $("#upperleftx").val("")
                    $("#upperlefty").val("")
                    $("#bottomrightx").val("")
                    $("#bottomrighty").val("");
                    $("#imgFile").val("");
                }

                }
            )
            // window.sessionStorage.setItem("editModelItem_id", "");
        }

        $("#step").steps({
            onFinish: function () {
                alert('Wizard Completed');
            }
        });


        // $('#keywords').tagEditor({
        //     forceLowercase: false
        // });
        // $("#contributers").tagEditor({
        //     forceLowercase: false
        // })

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
                url: "/modelItem/DOISearch",
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

        // $(document).on("click", ".refClose", function () {
        //     table.row($(this).parents("tr")).remove().draw();
        //     //$(this).parents("tr").eq(0).remove();
        //     console.log($("tbody tr"));
        //     if ($("tbody tr").eq(0)[0].innerText == "No data available in table") {
        //         $("#dynamic-table").css("display", "none")
        //     }
        // });
        //
        // let height = document.documentElement.clientHeight;
        // this.ScreenMaxHeight = (height) + "px";
        // this.IframeHeight = (height - 20) + "px";
        //
        // window.onresize = () => {
        //     console.log('come on ..');
        //     height = document.documentElement.clientHeight;
        //     this.ScreenMaxHeight = (height) + "px";
        //     this.IframeHeight = (height - 20) + "px";
        // }
        //
        //
        // var modelItemObj = {};
        // $(".next").click(()=> {
        //     modelItemObj.classifications = this.cls;//[$("#parentNode").attr("pid")];
        //     modelItemObj.name = $("#nameInput").val();
        //     modelItemObj.keywords = $("#tagInput").val().split(",");
        //     modelItemObj.description = $("#descInput").val();
        //     modelItemObj.image = $('#imgShow').get(0).src;
        //     modelItemObj.authorship=[];
        //
        //     if (this.cls.length == 0) {
        //         alert("Please select parent node");
        //         return false;
        //     }
        //     if ($("#nameInput").val() === "") {
        //         alert("Please enter model item name");
        //         return false;
        //     }
        // });
        //
        // $(".finish").click(()=> {
        //     let loading = this.$loading({
        //         lock: true,
        //         text: "Uploading...",
        //         spinner: "el-icon-loading",
        //         background: "rgba(0, 0, 0, 0.7)"
        //     });
        //     modelItemObj.status=$("input[name='Status']:checked").val();
        //     modelItemObj.classifications = this.cls;//[$("#parentNode").attr("pid")];
        //     modelItemObj.name = $("#nameInput").val();
        //     modelItemObj.keywords = $("#tagInput").val().split(",");
        //     modelItemObj.description = $("#descInput").val();
        //     modelItemObj.uploadImage = $('#imgShow').get(0).currentSrc;
        //     modelItemObj.authorship=[];
        //     this.getUserData($("#providersPanel .user-contents .form-control"), modelItemObj.authorship);
        //
        //     if(modelItemObj.name.trim()=="")
        //     {
        //         alert("please enter name");
        //         return;
        //     }
        //     else if(modelItemObj.classifications.length==0){
        //         alert("please select classification");
        //         return;
        //     }
        //     // modelItemObj.Providers = [];
        //     // getUserData($("#providersPanel .user-contents .form-control"), modelItemObj.Providers)
        //
        //     modelItemObj.references = new Array();
        //     var ref_lines = $("#dynamic-table tr");
        //     for (i = 1; i < ref_lines.length; i++) {
        //         var ref_prop = ref_lines.eq(i).children("td");
        //         if (ref_prop != 0) {
        //             var ref = {};
        //             ref.title = ref_prop.eq(0).text();
        //             if (ref.title == "No data available in table")
        //                 break;
        //             ref.author = ref_prop.eq(1).text().split(",");
        //             ref.date = ref_prop.eq(2).text();
        //             ref.journal = ref_prop.eq(3).text();
        //             ref.pages = ref_prop.eq(4).text();
        //             ref.links = ref_prop.eq(5).text();
        //             modelItemObj.references.push(ref);
        //         }
        //     }
        //
        //     var detail = tinyMCE.activeEditor.getContent();
        //     modelItemObj.detail = detail.trim();
        //     console.log(modelItemObj);
        //
        //     let formData=new FormData();
        //
        //     if ((oid === "0") || (oid === "") || (oid == null)) {
        //         let file = new File([JSON.stringify(modelItemObj)],'ant.txt',{
        //             type: 'text/plain',
        //         });
        //         formData.append("info",file);
        //         $.ajax({
        //             url: "/modelItem/add",
        //             type: "POST",
        //             processData: false,
        //             contentType: false,
        //             async: true,
        //             data: formData,
        //             success: function (result) {
        //                 loading.close();
        //                 if (result.code == "0") {
        //                     alert("Create successful!");
        //
        //                     window.location.href = "/modelItem/" + result.data;
        //                     //window.location.reload();
        //                 }
        //                 else if(result.code==-1){
        //                     alert("Please login first!");
        //                     window.location.href="/user/login";
        //                 }
        //                 else{
        //                     alert("Create failed!")
        //                 }
        //             }
        //         })
        //     } else {
        //
        //         modelItemObj["oid"] = oid;
        //
        //         let file = new File([JSON.stringify(modelItemObj)],'ant.txt',{
        //             type: 'text/plain',
        //         });
        //         formData.append("info",file);
        //         $.ajax({
        //             url: "/modelItem/update",
        //             type: "POST",
        //             processData: false,
        //             contentType: false,
        //             async: true,
        //             data: formData,
        //
        //             success: function (result) {
        //                 loading.close();
        //                 if (result.code === 0) {
        //                     if(result.data.method==="update") {
        //                         alert("Update Success");
        //                         $("#editModal", parent.document).remove();
        //                         window.location.href = "/modelItem/" + result.data.oid;
        //                     }
        //                     else{
        //                         alert("Success! Changes have been submitted, please wait for the author to review.");
        //                         window.location.href = "/user/userSpace";
        //                     }
        //
        //
        //                     // window.location.href = "/modelItem/" + result.data;
        //                     //window.location.reload();
        //                 }
        //                 else if(result.code==-2){
        //                     alert("Please login first!");
        //                     window.location.href="/user/login";
        //                 }
        //                 else{
        //                     alert(result.msg);
        //                 }
        //             }
        //         })
        //     }
        // });


        $(document).on("click", ".author_close", function () { $(this).parents(".panel").eq(0).remove(); });


        //作者添加

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

        $(document).on("keyup", ".username", function () {

            if ($(this).val()) {
                $(this).parents('.panel').eq(0).children('.panel-heading').children().children().html($(this).val());
            }
            else {
                $(this).parents('.panel').eq(0).children('.panel-heading').children().children().html("NEW");
            }
        })

        //var mid = window.sessionStorage.getItem("editModelItem_id");
        // if (mid === undefined || mid == null) {
        //     this.editorUrl = "http://127.0.0.1:8081http://127.0.0.1:8081/GeoModelingNew/modelItem/createModelItem.html";
        // } else {
        //     this.editorUrl = "http://127.0.0.1:8081http://127.0.0.1:8081/GeoModelingNew/modelItem/createModelItem.html?mid=" + mid;
        // }
    }
})