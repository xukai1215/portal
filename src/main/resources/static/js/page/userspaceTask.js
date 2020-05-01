var userTask = Vue.extend(
    {
        template:'#userTask',
        data() {
            return {
                //页面样式控制
                loading: 'false',
                load: true,
                ScreenMinHeight: "0px",
                ScreenMaxHeight: "0px",

                //显示控制
                curIndex: 5,

                itemIndex: 1,
                //
                userInfo: {},

                resourceLoad: false,

                //分页控制
                page: 1,
                sortAsc: 1,//1 -1
                sortType: "default",
                pageSize: 10,// 每页数据条数
                totalPage: 0,// 总页数
                curPage: 1,// 当前页码
                pageList: [],
                totalNum: 0,

                //用户
                userId: -1,

                //展示变量\
                itemTitle: 'Model Item',

                searchResult: [],
                modelItemResult: [],

                searchCount: 0,
                ScreenMaxHeight: "0px",
                searchText: "",

                isInSearch: 0,

                //task相关
                taskStatus: 'all',
                options: [
                    {
                        value: 'all',
                        label: 'all',

                    },
                    {
                        value: 'successful',
                        label: 'successful',

                    },

                    {
                        value: 'calculating',
                        label: 'calculating',

                    },

                    {
                        value: 'failed',
                        label: 'failed',

                    },
                ],
                addOutputToMyDataVisible: false,
                taskSharingVisible:false,
                taskSharingActive:0,
                taskDataList: [],
                stateFilters: [],
                multipleSelection: [],
                multipleSelectionMyData: [],
                taskCollapseActiveNames: [],
                taskDataForm: {
                    name: '',
                    type: "option1",
                    contentType: "resource",
                    description: "",
                    detail: "",
                    reference: "",
                    author: "",
                    keywords: [],
                    contributers: [],
                    classifications: [],
                    displays: [],
                    authorship: [],
                    comments: [],
                    dataList: [],

                    categoryText: [],

                },

                categoryTree: [],

                folderTree: [{
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

                folderTree2: [{
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

        components: {},

        methods: {
            //公共功能
            formatDate(value, callback) {
                const date = new Date(value);
                y = date.getFullYear();
                M = date.getMonth() + 1;
                d = date.getDate();
                H = date.getHours();
                m = date.getMinutes();
                s = date.getSeconds();
                if (M < 10) {
                    M = '0' + M;
                }
                if (d < 10) {
                    d = '0' + d;
                }
                if (H < 10) {
                    H = '0' + H;
                }
                if (m < 10) {
                    m = '0' + m;
                }
                if (s < 10) {
                    s = '0' + s;
                }

                const t = y + '-' + M + '-' + d + ' ' + H + ':' + m + ':' + s;
                if (callback == null || callback == undefined)
                    return t;
                else
                    callback(t);
            },

            setSession(name, value) {
                window.sessionStorage.setItem(name, value);
                // this.editOid = sessionStorage.getItem('editItemOid');
            },

            //page
            // 初始化page并显示第一页
            pageInit() {
                this.totalPage = Math.floor((this.totalNum + this.pageSize - 1) / this.pageSize);
                if (this.totalPage < 1) {
                    this.totalPage = 1;
                }
                this.getPageList();
                this.changePage(1);
            },

            getPageList() {
                this.pageList = [];

                if (this.totalPage < 5) {
                    for (let i = 0; i < this.totalPage; i++) {
                        this.pageList.push(i + 1);
                    }
                } else if (this.totalPage - this.curPage < 5) {//如果总的页码数减去当前页码数小于5（到达最后5页），那么直接计算出来显示

                    this.pageList = [
                        this.totalPage - 4,
                        this.totalPage - 3,
                        this.totalPage - 2,
                        this.totalPage - 1,
                        this.totalPage,
                    ];
                } else {
                    let cur = Math.floor((this.curPage - 1) / 5) * 5 + 1;
                    if (this.curPage % 5 === 0) {
                        cur = cur + 1;

                    }
                    this.pageList = [
                        cur,
                        cur + 1,
                        cur + 2,
                        cur + 3,
                        cur + 4,
                    ]
                }
            },

            changePage(pageNo) {
                if ((this.curPage === 1) && (pageNo === 1)) {
                    return;
                }
                if ((this.curPage === this.totalPage) && (pageNo === this.totalPage)) {
                    return;
                }
                if ((pageNo > 0) && (pageNo <= this.totalPage)) {
                    if (this.curIndex != 1)
                        this.pageControlIndex = this.curIndex;
                    else this.pageControlIndex = 'research';

                    this.resourceLoad = true;
                    this.searchResult = [];
                    //not result scroll
                    //window.scrollTo(0, 0);
                    this.curPage = pageNo;
                    this.getPageList();
                    this.page = pageNo;

                    switch (this.pageControlIndex) {
                        // this.computerModelsDeploy = [];
                        // this.resourceLoad = true;
                        // this.curPage = pageNo;
                        // this.getPageList();
                        // this.page = pageNo;
                        // this.getDataItems();
                        case 2:

                            if (this.isInSearch == 0)
                                this.getModels();
                            else this.searchModels();
                            break;
                        //
                        case 3:

                            if (this.isInSearch == 0)
                                this.getDataItems();
                            else this.searchDataItem();
                            break;

                        case 4:

                            if (this.isInSearch == 0)
                                this.getConcepts();
                            else this.searchConcepts();
                            break;
                        case 5:

                            if (this.isInSearch == 0)
                                this.showTasksByStatus(this.taskStatus);
                            else this.searchSpatials()
                            break;
                        case 6:

                            if (this.isInSearch == 0)
                                this.getTemplates();
                            else this.searchTemplates();
                            break;
                        case 7:

                            if (this.isInSearch == 0)
                                this.getUnits();
                            else this.searchUnits();
                            break;

                        case 7:
                            if (this.isInSearch == 0)
                                this.getTheme();
                            else {
                            }
                            break;

                        case 9:

                            if (this.isInSearch == 0) {
                                if (this.taskStatus != 10)
                                    this.showTasksByStatus(this.taskStatus)
                                else
                                    this.getModels();
                            } else this.searchModels();
                            break;



                    }
                    // if(this.researchIndex==1||this.researchIndex==2||this.researchIndex==3){
                    //     this.resourceLoad = true;
                    //     this.searchResult = [];
                    //     //not result scroll
                    //     //window.scrollTo(0, 0);
                    //     this.curPage = pageNo;
                    //     this.getPageList();
                    //     this.pageSize=4;
                    //     this.page = pageNo;
                    //     this.getResearchItems();
                    // }
                    //this.changeCurPage.emit(this.curPage);
                }
            },

            // creatItem(index){
            //     window.sessionStorage.removeItem('editOid');
            //     if(index == 1) window.location.href='../model/createModelItem'
            // },

            reloadPage() {//重新装订分页诸元
                this.pageSize = 10;
                this.isInSearch = 0;
                this.page = 1;
            },

            editItem(index, oid) {
                var urls = {
                    1: '/user/userSpace/model/manageModelItem',
                }
                this.setSession('editOid', oid)
                window.location.href = urls[this.itemIndex]
            },

            deleteItem(id) {
                //todo 删除category中的 id
                var cfm = confirm("Are you sure to delete?");

                if (cfm == true) {
                    axios.get("/dataItem/del/", {
                        params: {
                            id: id
                        }
                    }).then(res => {
                        if (res.status == 200) {
                            alert("delete success!");
                            this.getDataItems();
                        }
                    })
                }
            },
            //
            //task

            publishTask(task) {
                const h = this.$createElement;
                if (task.permission == 'private') {
                    this.$msgbox({
                        title: ' ',
                        message: h('p', null, [
                            h('span', {style: 'font-size:15px'}, 'All of the users will have'), h('span', {style: 'font-weight:600'}, ' permission '), h('span', 'to this task.'),
                            h('br'),
                            h('span', null, 'Are you sure to set the task'),
                            h('span', {style: 'color: #e6a23c;font-weight:600'}, ' public'),
                            h('span', null, '?'),
                        ]),
                        type: 'warning',
                        showCancelButton: true,
                        confirmButtonText: 'confirm',
                        cancelButtonText: 'cancel',
                        beforeClose: (action, instance, done) => {
                            let href = window.location.href.split('/')
                            let ids = href[href.length - 1]
                            let taskId = ids.split('&')[1]
                            if (action === 'confirm') {
                                instance.confirmButtonLoading = true;
                                // instance.confirmButtonText = '...';
                                setTimeout(() => {
                                    $.ajax({
                                        type: "POST",
                                        url: "/task/setPublic",
                                        data: {taskId: task.taskId},
                                        async: true,
                                        contentType: "application/x-www-form-urlencoded",
                                        success: (json) => {
                                            if (json.code == -1) {
                                                alert("Please login first!")
                                                window.sessionStorage.setItem("history", window.location.href);
                                                window.location.href = "/user/login"
                                            } else {
                                                // this.rightTargetItem=null;
                                                task.permission = json.data;
                                            }

                                        }
                                    });
                                    done();
                                    setTimeout(() => {
                                        instance.confirmButtonLoading = false;
                                    }, 100);
                                }, 100);
                            } else {
                                done();
                            }
                        }
                    }).then(action => {
                        this.rightMenuShow = false
                        this.$message({
                            type: 'success',
                            message: 'This task can be visited by public'
                        });
                    });
                } else {
                    this.$msgbox({
                        title: ' ',
                        message: h('p', null, [
                            h('span', {style: 'font-size:15px'}, 'Only you have'), h('span', {style: 'font-weight:600'}, ' permission '), h('span', 'to this task.'),
                            h('br'),
                            h('span', null, 'Are you sure to'),
                            h('span', {style: 'color: #67c23a;font-weight:600'}, ' continue'),
                            h('span', null, '?'),
                        ]),
                        type: 'warning',
                        showCancelButton: true,
                        confirmButtonText: 'confirm',
                        cancelButtonText: 'cancel',
                        beforeClose: (action, instance, done) => {
                            let href = window.location.href.split('/')
                            let ids = href[href.length - 1]
                            let taskId = ids.split('&')[1]
                            if (action === 'confirm') {
                                instance.confirmButtonLoading = true;
                                // instance.confirmButtonText = '...';
                                setTimeout(() => {
                                    $.ajax({
                                        type: "POST",
                                        url: "/task/setPrivate",
                                        data: {taskId: task.taskId},
                                        async: true,
                                        contentType: "application/x-www-form-urlencoded",
                                        success: (json) => {
                                            if (json.code == -1) {
                                                alert("Please login first!")
                                                window.sessionStorage.setItem("history", window.location.href);
                                                window.location.href = "/user/login"
                                            } else {
                                                // this.rightTargetItem=null;
                                                task.permission = json.data;
                                            }

                                        }
                                    });
                                    done();
                                    setTimeout(() => {
                                        instance.confirmButtonLoading = false;
                                    }, 100);
                                }, 100);
                            } else {
                                done();
                            }
                        }
                    }).then(action => {
                        this.rightMenuShow = false
                        this.$message({
                            type: 'success',
                            message: 'This task has been set private'
                        });
                    });
                }


            },

            changeTaskStatus(status) {
                this.taskStatus = status;
                this.showTasksByStatus(this.taskStatus)
            },

            showTasksByStatus(status) {
                let name = 'tasks'
                this.taskStatus = status
                if (this.taskStatus === 'successful')
                    $('.wzhSelectContainer input').css('background', '#63b75d')
                else if (this.taskStatus === 'all')
                    $('.wzhSelectContainer input').css('background', '#00ABFF')
                else if (this.taskStatus === 'failed')
                    $('.wzhSelectContainer input').css('background', '#d74948')
                else
                    $('.wzhSelectContainer input').css('background', '#1caf9a')
                axios.get("/task/getTasksByUserIdByStatus", {
                        params: {
                            status: status,
                            page: this.page - 1,
                            sortType: this.sortType,
                            asc: -1,
                        }
                    }


                    ,).then(
                    res => {
                        if (res.data.code != 0) {
                            alert("Please login first!");
                            window.location.href = "/user/login";
                        } else {
                            const data = res.data.data;
                            this.resourceLoad = false;
                            this.totalNum = data.count;
                            for (var i = 0; i < data[name].length; i++) {
                                // this.searchResult.push(data[name][i]);
                                this.searchResult = data[name];
                                console.log(data[name][i]);
                            }
                            //this.modelItemResult = data[name];
                            if (this.page == 1) {
                                this.pageInit();
                            }
                        }
                    }
                )

                this.activeIndex = '6'
                // this.curIndex = '6'
                this.defaultActive = '6';
                this.pageControlIndex = '6';
            },


            searchTasks() {
                let url = "/task/searchTasksByUserId";
                let name = "tasks";

                $.ajax({
                    type: "Get",
                    url: url,
                    data: {
                        searchText: this.searchText,
                        page: this.page - 1,
                        pagesize: this.pageSize,
                        sortType: this.sortType,
                        asc: this.sortAsc
                    },
                    cache: false,
                    async: true,
                    dataType: "json",
                    xhrFields: {
                        withCredentials: true
                    },
                    crossDomain: true,
                    success: (json) => {
                        if (json.code != 0) {
                            alert("Please login first!");
                            window.location.href = "/user/login";
                        } else {
                            data = json.data;
                            this.resourceLoad = false;
                            this.totalNum = data.count;
                            this.searchCount = Number.parseInt(data["count"]);
                            this.searchResult = data[name];
                            if (this.page == 1) {
                                this.pageInit();
                            }

                        }

                    }
                })
            },

            addOutputToMyData(output) {
                console.log(output)
                this.outputToMyData = output
                this.addOutputToMyDataVisible = true
                this.selectedPath = [];
                axios.get("/user/getFolder", {})
                    .then(res => {
                        let json = res.data;
                        if (json.code == -1) {
                            alert("Please login first!")
                            window.sessionStorage.setItem("history", window.location.href);
                            window.location.href = "/user/login"
                        } else {
                            this.folderTree = res.data.data;
                            this.selectPathDialog = true;
                        }


                    });
            },

            addOutputToMyDataConfirm(index) {
                let data = this.$refs.folderTree2[index].getCurrentNode();
                let node = this.$refs.folderTree2[index].getNode(data);

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
                    label: this.outputToMyData.event,
                    suffix: this.outputToMyData.suffix,
                    url: this.outputToMyData.url
                }

                this.addDataToPortalBack(obj)
                this.addOutputToMyDataVisible = false
            },

            async dropPackageContent(item, index) {

                let arrow = $('.treeChildLi').eq(index);
                let father = $('ul.flexLi')
                let autoHeightFaOld = this.autoHeightFaOld;
                let targetLi = $('.packageContent').eq(index);
                let autoHeight = (this.packageContentList[index].inputs.length + this.packageContentList[index].outputs.length) * 57 + 79
                let autoHeightFa = autoHeight + autoHeightFaOld

                for (let i = 0; i < this.userTaskFullInfo.tasks.length; i++) {
                    if ((i === index)) {
                        if (!arrow.hasClass('expanded')) {
                            arrow.addClass('expanded');
                            father.animate({height: autoHeightFa}, 260, 'linear');
                            targetLi.animate({height: autoHeight}, 500, 'linear');
                            this.sharingTaskData(item, index);

                        } else if (arrow.hasClass('expanded')) {
                            father.animate({height: autoHeightFaOld}, 320)
                            $('.packageContent').eq(index).animate({height: 0}, 300);
                            $('.treeChildLi').eq(index).removeClass('expanded');
                        }
                    } else {
                        $('.treeChildLi').eq(i).removeClass('expanded');
                        $('.packageContent').eq(i).animate({height: 0}, 300);
                        // father.animate({height:autoHeightFaOld},320)
                    }

                }
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

            taskSharingPre() {
                let len = $(".taskSharingStep").length;
                if (this.taskSharingActive != 0)
                    this.taskSharingActive--;
                // if(this.curIndex=='3-3'){
                //     $('.dataItemShare').eq(this.taskSharingActive).animate({marginLeft:0},200)
                //     $('.dataItemShare').eq(this.taskSharingActive+1).animate({marginleft:1500},200)
                // }
            },
            taskSharingFinish() {

                this.taskSharingActive = 4;
                var selectResult = []
                selectResult = this.multipleSelection;


                console.log(selectResult)
                for (let select of selectResult) {
                    if (select.tag) {
                        select.name = select.tag;
                        select.suffix = 'unknow';
                    } else {
                        select.name = select.fileName;
                        select.suffix = select.suffix;
                    }

                    this.taskDataForm.dataList.push(select);
                }

                this.taskDataForm.detail = tinyMCE.activeEditor.getContent();

                this.taskDataForm.keywords = $("#taskDataKeywords").val().split(",");

                this.taskDataForm.author = this.userId;

                // this.dataItemAddDTO.meta.coordinateSystem = $("#coordinateSystem").val();
                // this.dataItemAddDTO.meta.geographicProjection = $("#geographicProjection").val();
                // this.dataItemAddDTO.meta.coordinateUnits = $("#coordinateUnits").val();
                // this.dataItemAddDTO.meta.boundingRectangle=[];

                let authorship = [];
                this.getUserData($("#providersPanel .user-contents .form-control"), authorship);
                this.taskDataForm.authorship = authorship;
                console.log(this.taskDataForm)

                axios.post("/dataItem/", this.taskDataForm)
                    .then(res => {
                        console.log(res);
                        if (res.status == 200) {

                            this.openConfirmBox("Create successfully! Do you want to view this Data Item?", "Message", res.data.data.id);
                            this.taskSharingVisible = false;
                        }
                    })
            },
            showWaring(text) {
                this.$message({
                    showClose: true,
                    message: text,
                    type: 'warning'
                });
            },
            taskSharingNext() {

                //检查
                switch (this.taskSharingActive) {
                    case 0:
                        if (this.multipleSelection.length + this.multipleSelectionMyData.length == 0) {
                            this.showWaring('Please select data first!');
                            return;
                        }
                        break;
                    case 1:
                        if (this.taskDataForm.classifications.length == 0) {
                            this.showWaring('Please choose categories from sidebar')
                            return;
                        }
                        if (this.taskDataForm.name.trim() == '') {
                            this.showWaring('Please enter name');
                            return;
                        }
                        if ($("#taskDataKeywords").val().split(",")[0] == '') {
                            this.showWaring('Please enter keywords');
                            return;
                        }

                        if (this.taskDataForm.description == '') {
                            this.showWaring('Please enter overview');
                            return;
                        }
                        break;
                    case 2:
                        if (tinyMCE.activeEditor.getContent().trim() == '') {
                            this.showWaring('Please enter detailed description');
                            return;
                        }
                        break;

                }


                //翻页
                let len = $(".taskSharingStep").length;
                if (this.taskSharingActive < len)
                    this.taskSharingActive++;
                if (this.taskSharingActive == 1) {
                    if ($("#taskDataShareDialog .tag-editor").length == 0) {
                        $("#taskDataKeywords").tagEditor({
                            forceLowercase: false
                        })
                    }

                    tinymce.init({
                        selector: "textarea#taskDataDetail",
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


                // if(this.curIndex=='3-3'){
                //     console.log($('.dataItemShare').eq(this.taskSharingActive))
                //     $('.dataItemShare').eq(this.taskSharingActive-1).animate({marginLeft:-1500},220)
                //     $('.dataItemShare').eq(this.taskSharingActive).animate({marginLeft:0},220)
                // }
            },

            handleSelectionChange(val) {
                if (val)
                    this.multipleSelection = val
                console.log(this.multipleSelection)
            },

            handleSelectionChangeMyData(val) {
                if (val)
                    this.multipleSelectionMyData = val
                console.log(this.multipleSelectionMyData)
            },

            handleSelectionChangeRow(val, row) {
                this.multipleSelection.push(row)
                // this.$refs.multipleTableOutput.toggleRowSelection(row);
                // console.log(this.$refs.multipleTableOutput[1].clearSelection())
            },
            checkSelectedFile() {
                this.checkSelectedIndex = 1;
            },
            filterType(value, row) {
                return row.type === value;
            },
            filterState(value, row) {
                return row.statename === value;
            },

            initTaskDataForm() {
                this.taskDataList = [];
                this.taskSharingActive = 0;
                this.stateFilters = [];
                this.taskCollapseActiveNames = [];
                //如果是task条目下则清空，不是则会在其他事件中清空
                if (this.curIndex == 6)
                    this.multipleSelection = [];
                this.taskDataForm = {
                    name: '',
                    type: "option1",
                    contentType: "resource",
                    description: "",
                    detail: "",
                    reference: "",
                    author: "",
                    keywords: [],
                    contributers: [],
                    classifications: [],
                    displays: [],
                    authorship: [],
                    comments: [],
                    dataList: [],

                    categoryText: [],
                };
                $(".taskDataCate").children().css("color", "black");

                if ($("#taskDataShareDialog .tag-editor").length != 0) {
                    $('#taskDataKeywords').tagEditor('destroy');
                }

                $("#taskDataKeywords").tagEditor({
                    initialTags: [''],
                    forceLowercase: false
                });

                tinyMCE.activeEditor.setContent("");
                $(".taskDataAuthorship").remove();
                $(".user-add").click();
            },

            sharingTaskData(task, index) {

                this.initTaskDataForm();

                this.taskSharingActive = 0;
                let inputs = task.inputs;
                let outputs = task.outputs;
                for (let input of inputs) {
                    input.type = "Input";
                    this.taskDataList.push(input);

                    let exist = false;
                    for (let filter of this.stateFilters) {
                        if (filter.value == input.statename) {
                            exist = true;
                        }
                    }

                    if (!exist) {
                        let obj = {};
                        obj.text = input.statename;
                        obj.value = input.statename;
                        this.stateFilters.push(obj);
                    }
                }
                for (let output of outputs) {
                    output.type = "Output";
                    this.taskDataList.push(output);

                    let exist = false;
                    for (let filter of this.stateFilters) {
                        if (filter.value == output.statename) {
                            exist = true;
                        }
                    }

                    if (!exist) {
                        let obj = {};
                        obj.text = output.statename;
                        obj.value = output.statename;
                        this.stateFilters.push(obj);
                    }
                }

                this.taskSharingVisible = true;


            },

            handleClose(done) {
                console.log(done)
                this.$confirm('Are you sure to close？')
                    .then(_ => {
                        done();
                    })
                    .catch(_ => {
                    });
            },

            closeAndClear() {

            },

            handleCloseandInit(done) {
                console.log(done)
                this.$confirm('Are you sure to close？')
                    .then(_ => {
                        for (let i = 0; i < $('.treeLi').length; i++) {
                            $('.treeLi').eq(i).removeClass('expanded');
                            $('.flexLi').eq(i).animate({height: 0}, 300);
                        }
                        for(let i=0;i<$('.treeChildLi').length;i++){
                            $('.treeChildLi').eq(i).removeClass('expanded');
                            $('.packageContent').eq(i).animate({height:0},300);
                        }
                        for(let i=0;i<this.$refs.multipleTableDataSharing.length;i++)
                            this.$refs.multipleTableDataSharing[i].clearSelection();
                        this.$refs.multipleTableMyData.clearSelection();

                        done();
                    })
                    .catch(_ => {
                        done();
                    });
            },

            downloadSingle(url) {
                window.open("/dispatchRequest/download?url=" + url);

            },

            downloadAll(recordId, name, time) {
                var form = document.createElement("form");
                form.style.display = "none";

                form.setAttribute("target", "");
                form.setAttribute('method', 'get');
                form.setAttribute('action', "https://geomodeling.njnu.edu.cn/GeoModeling/DownloadAllDataServlet");

                var input1 = document.createElement("input");
                input1.setAttribute('type', 'hidden');
                input1.setAttribute('name', 'recordId');
                input1.setAttribute('value', recordId);

                var input2 = document.createElement("input");
                input2.setAttribute('type', 'hidden');
                input2.setAttribute('name', 'name');
                input2.setAttribute('value', name);

                var input3 = document.createElement("input");
                input3.setAttribute('type', 'hidden');
                input3.setAttribute('name', 'time');
                input3.setAttribute('value', time);

                form.appendChild(input1);
                form.appendChild(input2);
                form.appendChild(input3);

                document.body.appendChild(form);  //将表单放置在web中
                //将查询参数控件提交到表单上
                form.submit();
                form.remove();
            },

            chooseTaskDataCate(item, e) {
                let exist = false;
                let cls = this.taskDataForm.classifications;
                for (i = 0; i < cls.length; i++) {
                    if (cls[i] == item.id) {
                        if (e.target.type == "button") {
                            e.target.children[0].style.color = "black";
                        } else {
                            e.target.style.color = 'black';
                        }

                        cls.splice(i, 1);
                        this.taskDataForm.categoryText.splice(i, 1);
                        exist = true;
                        break;
                    }
                }
                if (!exist) {
                    if (e.target.type == "button") {
                        e.target.children[0].style.color = "deepskyblue";
                    } else {
                        e.target.style.color = 'deepskyblue';
                    }

                    if (!exist) {
                        if (e.target.type == "button") {
                            e.target.children[0].style.color = "deepskyblue";
                        } else {
                            e.target.style.color = 'deepskyblue';
                        }

                        this.taskDataForm.categoryText.push(e.target.innerText);
                        this.taskDataForm.classifications.push(item.id);
                    }

                }
            },

            openConfirmBox(content, title, id) {
                this.$confirm(content, title, {
                    confirmButtonText: "Yes",
                    cancelButtonText: "No",
                    type: 'success'//'warning'
                }).then(() => {
                    window.open("/dataItem/" + id);
                }).catch(() => {

                });
            },

            openAlertBox(content, title) {
                this.$alert(content, title, {
                    confirmButtonText: 'OK',
                    callback: action => {

                    }
                });
            },

            //展开task详细数据
            expandRunInfo(index,$event){
                if(!$('.ab').eq(index).hasClass('transform180')){
                    $('.ab').eq(index).addClass('transform180')
                    $('.modelRunInfo').eq(index).collapse('show')
                }else {
                    $('.ab').eq(index).removeClass('transform180')
                    $('.modelRunInfo').eq(index).collapse('hide')
                }

            },

            //task output加入data space中
            addFolderinTree(pageIndex,index){
                var node,data
                if(pageIndex=='myData'){
                    data=this.$refs.folderTree.getCurrentNode();
                    if(data==undefined) alert('Please select a file directory')
                    node=this.$refs.folderTree.getNode(data);
                }
                else{
                    data=this.$refs.folderTree2[index].getCurrentNode();
                    if(data==undefined) alert('Please select a file directory')
                    node=this.$refs.folderTree2[index].getNode(data);
                }

                let folderExited=data.children

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
                        source_store_id:item.url.split('=')[1]
                    }
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
                        } else {
                            let idList=json.data
                            console.log(idList)
                            if (item instanceof Array){
                                if (this.uploadInPath == 1) {
                                    for (let i = 0; i < item.length; i++) {
                                        console.log(item[i].file_name)
                                        let dataName7Suffix = item[i].file_name.split('.')
                                        const newChild = {
                                            id: idList[i].id,
                                            label: dataName7Suffix[0],
                                            suffix: dataName7Suffix[1],
                                            children: [],
                                            package: false,
                                            upload: true,
                                            father: paths[0],
                                            url: idList[i].url,
                                        };
                                        if (this.myFileShown.length === 0)
                                            this.addChild(this.myFile, paths[0], newChild)
                                        this.myFileShown.push(newChild);
                                        console.log(this.myFileShown)
                                        // this.getFilePackage();
                                        console.log(this.myFile)
                                    }
                                } else {
                                    setTimeout(()=>{
                                        this.refreshPackage(0)},300);
                                    //要写一个前台按路径查找的函数
                                }
                            }else{
                                let obj=item
                                obj.id=idList[0].id
                                obj.url=idList[0].url
                                if (this.myFileShown.length === 0)
                                    this.addChild(this.myFile, paths[0], item)
                                this.myFileShown.push(item);
                            }

                            this.addFolderIndex = false;
                            //this.selectedPath=[];

                        }

                        setTimeout(()=>{
                            this.uploadDialogVisible=false
                        },500)

                    }
                });

                // alert('Upload File successfully!')


            },


            checkOutput(modelId, taskId, integrate) {
                if (integrate){
                    window.open('/computableModel/getIntegratedTask/' + taskId);
                } else{
                    window.open('/task/output/' + modelId + '&' + taskId);
                }


            },

            sendcurIndexToParent(){
                this.$emit('com-sendcurindex',this.curIndex)
            }

        },


        created() {


        },

        mounted() {

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
                            //判断显示哪一个item
                            var itemIndex = window.sessionStorage.getItem("itemIndex");
                            this.itemIndex = itemIndex

                            this.showTasksByStatus('all');

                            // if (index != null && index != undefined && index != "" && index != NaN) {
                            //     this.defaultActive = index;
                            //     window.sessionStorage.removeItem("index");
                            //     // this.curIndex = index
                            //
                            //
                            // } else {
                            //     // this.changeRter(1);
                            // }

                            window.sessionStorage.removeItem("tap");
                            //this.getTasksInfo();
                            this.load = false;
                        }
                    }
                })


                //this.getModels();
            });

            //初始化的时候吧curIndex传给父组件，来控制bar的高亮显示
            this.sendcurIndexToParent()

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

            var that = this
            //获取data item分类树
            axios.get("/dataItem/createTree")
                .then(res => {
                    that.tObj = res.data;
                    for (var e in that.tObj) {
                        var a = {
                            key: e,
                            value: that.tObj[e]
                        }
                        if (e != 'Data Resouces Hubs') {
                            that.categoryTree.push(a);
                        }


                    }

                })

            var user_num = 0;
            $(document).on("click", ".user-add", function () {
                user_num++;
                var content_box = $(this).parent().children('div');
                var str = "<div class='panel panel-primary taskDataAuthorship'> <div class='panel-heading'> <h4 class='panel-title'> <a class='accordion-toggle collapsed' style='color:white' data-toggle='collapse' data-target='#user";
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

        },

    }
)