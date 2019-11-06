//element-ui 切换英文，勿删！
ELEMENT.locale(ELEMENT.lang.en)
var vue = new Vue({
    el: "#app",
    data: {
        total: 100,
        dataFromDataContainer: [],
        defaultActive: '1',
        curIndex: '1',

        // show controller
        dashboard_show: false,
        model_show: false,
        conceptual_show: false,
        logical_show: false,
        computable_show: false,
        tasks_show: false,
        //add servers by wangming at 2018.07.31
        servers_show: false,
        deploys_show: false,

        //todo data-item
        data_upload: false,
        data_show: false,
        user_position: "",
        dcount: new Number(),
        sourceStoreId: '',

        uploadSource:[],

        lastFiles:[],

        fileNames:[],
        data_upload_id: '',
        indexStep: -1,
        newStep: -1,

        userInfo: {
            runTask: [
                {}
            ]
        },

        userTaskInfo: [{
            content: {},
        }],

        ScreenMaxHeight: "0px",
        load: true,

        resourceLoad: true,

        statisticsInfo: {
            calculating: 0,
            success: 0,
            fail: 0
        },

        resourceOption: {},

        useOption: {},

        serverInfos: [],

        //computerNodesInfo
        computerNodesInfos: [],

        //computerModelsDeploy
        computerModelsDeploy: [],

        computerNodesMapOptions: {},
        //left-menu
        ScreenMinHeight: "0px",

        userId: "",
        userName: "",
        loginFlag: false,
        activeIndex: 1,
        childIndex: 0,
        //model-item
        searchResult: [],
        modelItemResult: [],
        page: 1,
        sortAsc: 1,//1 -1
        sortType: "default",
        searchCount: 0,
        ScreenMaxHeight: "0px",
        searchText: "",

        pageSize: 10,// 每页数据条数
        totalPage: 0,// 总页数
        curPage: 1,// 当前页码
        pageList: [],
        totalNum: 0,

        //create dataitem
        dataItemAddDTO: {
            name: '',
            description: '',
            detail: '',
            author: '',
            type: '',
            reference: '',
            keywords: [],
            classifications: [],
            displays: [],
            contributers: [],
            authorship: [],
            meta: {
                coordinateSystem: '',
                geographicProjection: '',
                coordinateUnits: '',
                boundingRectangle: []
            }

        },
        classif: [],
        active: 0,
        categoryTree: [],
        ctegorys: [],

        data_img: [],
        //manager
        searchcontent: '',
        databrowser: [],
        loading: 'false',
        managerloading: true,
        dataid: '',
        rightMenuShow: false,
        downloadDataSet: [],
        downloadDataSetName: [
            {
                name:'',
                suffix:'',
                package:true
            }
        ],
        uploadDialogVisible: false,
        alllen: 0,

        researchIndex: 1,
        pageControlIndex: '',

        dataChosenIndex: 1,
        detailsIndex: 1,

        articleToBack: {
            title: 'aa',
            author: [],
            journal: 'ss',
            startPage: 1,
            endPage: 2,
            date: 2019,
            link: 'aa',
        },

        projectToBack: {
            name: '',
            startTime: '',
            endTime: '',
            role: '',
            fundAgency: '',
            amount: 1,
        },

        conferenceToBack: {
            title: '',
            theme: '',
            role: '',
            location: '',
            startTime: '',
            endTime: '',
        },

        researchItemOid: '',
        researchItems: [],
        projectResult: [],
        conferenceResult: [],

        editOid: '',

        isInSearch: 0,

        taskSharingVisible: false,
        allFileTaskSharingVisible: false,

        taskDataList: [],
        taskSharingActive: 0,
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

        packageContent: {},

        packageContentList: [],

        userTaskFullInfo: [],

        dataForm: [{
            label: 'My Uploaded Data',
            children: [{}]

        }, {
            label: 'Output Data',
            children: [{
                label: '二级 1-1',
                children: [{
                    label: '三级 1-1-1'
                }]
            }]
        }, {
            label: 'Fork Data',
            children: [{
                label: '二级 1-1',
                children: [{
                    label: '三级 1-1-1'
                }]
            }]
        }
        ],
        defaultProps: {
            children: 'children',
            label: 'label'
        },

        autoHeightFaOld: 1,

        checkSelectedIndex:0,

        clickedList:[],

        selectPathDialog:false,

        folderTree : [{
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

        fileSpaceIndex:1,

        myFile:[],

        myFileShown:[
            {
                children:[],
            }
        ],

        fatherIndex:'',

        pathShown:[],

        selectedPath:[],

        addFolderIndex: false,

        newFolderName:'',

        clickTimeout:1000,

        rightTargetItem:{},

        renameIndex:'',

        uploadDialog:false,

    },

    methods: {
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

        // arrayCompare(arry1,arry2){//取出在1中而不在2中的
        //     for(let i=0;i<arry1.length;i++){
        //         if(arry1[i].id!=arry1[i].id)
        //     }
        //
        // },

        dataTreeClick(index) {

            for (let i = 0; i < $('.treeLi').length; i++) {
                let arrow = $('.treeLi').eq(index - 1);
                let targetLi = $('.flexLi').eq(index - 1);
                let autoHeight1 = $('.el-table').eq(index - 1).height() + 23
                let autoHeight2 = $('.filePackageList').height()
                let autoHeight3 = $('.el-table').eq(this.userTaskFullInfo.tasks.length + 1).height() + 23

                if ((i === index - 1) && !arrow.hasClass('expanded')) {
                    arrow.addClass('expanded');
                    if (index == 2) {
                        targetLi.animate({height: autoHeight2}, 320);
                        this.autoHeightFaOld = autoHeight2;
                    } else if (index == 1){
                        targetLi.animate({height: autoHeight1}, 320);
                    }
                    else {
                        targetLi.animate({height: autoHeight3}, 320);
                    }

                } else {
                    $('.treeLi').eq(i).removeClass('expanded');
                    $('.flexLi').eq(i).animate({height: 0}, 300);
                }
            }

        },

        getAllPackageTasks(){
            for (let i=0;i<this.userTaskFullInfo.tasks.length;i++){
                this.getOneOfUserTasksToList(this.userTaskFullInfo.tasks[i],i)
            }
            console.log(this.packageContentList)
        },

        // formDataPackage(){
        //     for (let i=0;i<this.packageContentList.length;i++){
        //
        //     }
        // },

        async dropPackageContent(item,index){

            let arrow=$('.treeChildLi').eq(index);
            let father=$('ul.flexLi')
            let autoHeightFaOld=this.autoHeightFaOld;
            let targetLi=$('.packageContent').eq(index);
            let autoHeight=(this.packageContentList[index].inputs.length+this.packageContentList[index].outputs.length)*57+79
            let autoHeightFa=autoHeight+autoHeightFaOld

            for(let i=0;i<this.userTaskFullInfo.tasks.length;i++){
                if((i===index)){
                    if(!arrow.hasClass('expanded')){
                        arrow.addClass('expanded');
                        father.animate({height: autoHeightFa}, 260,'linear');
                        targetLi.animate({height: autoHeight}, 500,'linear');
                        this.sharingTaskData(item,index);

                    }else if(arrow.hasClass('expanded')){
                        father.animate({height:autoHeightFaOld},320)
                        $('.packageContent').eq(index).animate({height: 0}, 300);
                        $('.treeChildLi').eq(index).removeClass('expanded');
                    }
                }
                else {
                    $('.treeChildLi').eq(i).removeClass('expanded');
                    $('.packageContent').eq(i).animate({height:0},300);
                    // father.animate({height:autoHeightFaOld},320)
                }

            }
        },

        test(item, index) {
            this.sharingTaskData(item);
            let arrow = $('.treeChildLi').eq(index);
            let father = $('ul.flexLi')
            let autoHeightFaOld = this.autoHeightFaOld;
            let targetLi = $('.packageContent').eq(index);
            let autoHeight = (this.packageContent.inputs.length + this.packageContent.outputs.length) * 57 + 82;
            let autoHeightFa = autoHeight + autoHeightFaOld;
            console.log(autoHeightFa)
            console.log(autoHeightFaOld)
            console.log(autoHeight)
            for (let i = 0; i < this.userTaskFullInfo.tasks.length; i++) {
                if ((i === index)  ) {
                    if(!arrow.hasClass('expanded')){
                        arrow.addClass('expanded');
                        father.animate({height: autoHeightFa}, 260,'linear');
                        targetLi.animate({height: autoHeight}, 500,'linear');
                    }else if(arrow.hasClass('expanded')){
                        father.animate({height:autoHeightFaOld},320)
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

        // dropPackageContent(item, index) {
        //
        //     this.getOneOfUserTasks(item,index,this.test);
        // },

        chooseTaskDataCate(item,e) {
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


        allFileShareAsDataItem() {
            this.allFileTaskSharingVisible = true;
            this.multipleSelection=[];
            this.multipleSelectionMyData=[];
            this.taskSharingActive=0;
            if ($("#allFileShareDialog .tag-editor").length != 0) {
                $('#taskDataKeywordsAll').tagEditor('destroy');
            }
            $("#taskDataKeywordsAll").tagEditor({
                initialTags: [''],
                forceLowercase: false
            });
            // this.getTasks();
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
            var selectResult=[]
            if(this.curIndex==6)
                selectResult=this.multipleSelection ;
            else selectResult=this.multipleSelectionMyData.concat(this.multipleSelection);

            console.log(selectResult)
            for (let select of selectResult) {
                if(select.tag){
                    select.name = select.tag;
                    select.suffix = 'unknow';
                }else{
                    select.name = select.fileName;
                    select.suffix =select.suffix;
                }

                this.taskDataForm.dataList.push(select);
            }

            this.taskDataForm.detail = tinyMCE.activeEditor.getContent();
            if(this.curIndex==='6')
                this.taskDataForm.keywords = $("#taskDataKeywords").val().split(",");
            if(this.curIndex==='3-3')
                this.taskDataForm.keywords = $("#taskDataKeywordsAll").val().split(",");
            this.taskDataForm.author = this.userId;

            // this.dataItemAddDTO.meta.coordinateSystem = $("#coordinateSystem").val();
            // this.dataItemAddDTO.meta.geographicProjection = $("#geographicProjection").val();
            // this.dataItemAddDTO.meta.coordinateUnits = $("#coordinateUnits").val();
            // this.dataItemAddDTO.meta.boundingRectangle=[];

            let authorship = [];
            if(this.curIndex=='6')
                this.getUserData($("#providersPanel .user-contents .form-control"), authorship);
            else if(this.curIndex=='3-3')
                this.getUserData($("#providersPanelAll .user-contents .form-control"), authorship);
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
                    if (this.multipleSelection.length+this.multipleSelectionMyData.length == 0) {
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
                    if(this.curIndex==='6') //复用判断在那个页面防止冲突
                        if ($("#taskDataKeywords").val().split(",")[0] == '') {
                            this.showWaring('Please enter keywords');
                            return;
                        }
                    if(this.curIndex==='3-3')
                        if ($("#taskDataKeywordsAll").val().split(",")[0] == '') {
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
                if(this.curIndex === '6')
                    if ($("#taskDataShareDialog .tag-editor").length == 0) {
                        $("#taskDataKeywords").tagEditor({
                            forceLowercase: false
                        })
                    }
                if(this.curIndex === '3-3')
                    if ($("#allFileShareDialog .tag-editor").length == 0) {
                        $("#taskDataKeywordsAll").tagEditor({
                            forceLowercase: false
                        })
                    }
            }

            if (this.taskSharingActive == 1&&this.curIndex==='6') {
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

            if(this.taskSharingActive==1&&this.curIndex==='3-3'){
                tinymce.init({
                    selector: "textarea#taskDataDetailAll",
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


        sharingTaskData(task,index) {

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

            if (this.curIndex==6)
                this.taskSharingVisible=true;

            if (this.curIndex=='3-3'){
                if(this.multipleSelection.length>0){
                    this.$nextTick(function () {
                        this.multipleSelection.forEach(row=>{
                            console.log(this.$refs.multipleTableDataSharing)
                            this.$refs.multipleTableDataSharing[index].toggleRowSelection(row);
                        })
                    })
                }

            }

        },
        handleSelectionChange(val) {
            if(val)
                this.multipleSelection=val
            console.log(this.multipleSelection)
        },

        handleSelectionChangeMyData(val) {
            if(val)
                this.multipleSelectionMyData=val
            console.log(this.multipleSelectionMyData)
        },

        handleSelectionChangeRow(val,row) {
            this.multipleSelection.push(row)
            // this.$refs.multipleTableOutput.toggleRowSelection(row);
            // console.log(this.$refs.multipleTableOutput[1].clearSelection())
        },
        checkSelectedFile(){
            this.checkSelectedIndex=1;
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
            if(this.curIndex==6)
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
        getUserData(UsersInfo, prop) {
            let index = 0;
            for (i = 0; i < UsersInfo.length; i += 4) {
                let value1 = UsersInfo.eq(i)[0].value.trim();
                let value2 = UsersInfo.eq(i)[0].value.trim();
                let value3 = UsersInfo.eq(i)[0].value.trim();
                let value4 = UsersInfo.eq(i)[0].value.trim();
                if (value1 == '' && value2 == '' && value3 == '' && value4 == '') {
                    index = i + 4;
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
                } else {
                    result += "'" + Info.name + "':'" + Info.value + "',";
                }

            }
        },
        filterTag(value, row) {
            return row.fromWhere === value;
        },
        onzzzSuccess() {
            alert("上传成功")
        },

        selectPathClick(){
            if(1){
                axios.get("/user/getFolder",{})
                    .then(res=> {
                        let json=res.data;
                        if(json.code==-1){
                            alert("Please login first!")
                            window.sessionStorage.setItem("history", window.location.href);
                            window.location.href="/user/login"
                        }
                        else {
                            this.folderTree=res.data.data;
                            this.selectPathDialog=true;
                        }


                    });

            }
            else{
                alert("Please select data first!")
            }
        },

        getPackageContent($event, eval,key){
            clearTimeout(this.clickTimeout)
            if(eval.package===false)
                return
            let id=eval.id;
            this.fatherIndex=this.myFileShown[key].id;
            this.pathShown.push(this.myFileShown[key])
            if(this.myFileShown[key].children.length!=0)
                this.myFileShown= this.myFileShown[key].children;
            else
                this.myFileShown=[];

            this.renameIndex='';
            // console.log(this.myFileShown)
            // console.log(this.myFileShown.length)
            // console.log(this.fatherIndex)

        },

        getFilePackage(){
            axios.get("/user/getFolderAndFile",{})
                .then(res=> {
                    let json=res.data;
                    if(json.code==-1){
                        alert("Please login first!")
                        window.sessionStorage.setItem("history", window.location.href);
                        window.location.href="/user/login"
                    }
                    else {
                        this.myFile=res.data.data;
                        this.myFileShown=this.myFile;
                    }


                });
        },

        backToFather(){
            // if(this.myFileShown.length==0||this.fatherIndex!=0) {
            //     this.findFather(this.myFile)
            //     this.fatherIndex=this.myFileShown[0].father;
            //     console.log()
            // }else if(this.fatherIndex==0)
            //     this.myFileShown=this.myFile;

            let allFolder = [];
            allFolder.children=this.myFile;
            this.findFather(this.myFile,allFolder)
            console.log(this.myFileShown)
            this.fatherIndex=this.myFileShown[0].father;
            this.pathShown.pop(this.pathShown.length-1)
        },

        findFather(file,father){
            if(this.fatherIndex==='0')
                this.myFileShown=this.myFile;
            for(let i=0;i<file.length;i++){
                if(file[i].id===this.fatherIndex){
                    this.myFileShown=father.children;
                    console.log(this.myFileShown)
                    return;
                }else{
                    this.findFather(file[i].children,file[i])
                }
            }
        },

        refreshPackage(){
            if(this.myFileShown[0].label!='All Folder'&&this.myFileShown[0].label!='My Data'){
                let i=this.pathShown.length-1;
                let paths=[]
                while (i>=1) {
                    paths.push(this.pathShown[i].id);
                    i--;
                }
                $.ajax({
                    type: "GET",
                    url:"/user/getFileByPath",
                    data:{
                        paths:paths,
                    },
                    async: true,
                    contentType: "application/x-www-form-urlencoded",
                    success:(json)=>{
                        if(json.code==-1){
                            alert("Please login first!")
                            window.sessionStorage.setItem("history", window.location.href);
                            window.location.href = "/user/login"
                        }else{
                            this.myFileShown=json.data.data;
                            this.refreshChild(this.myFile);
                            console.log(this.myFileShown)
                        }
                    }

                })
            }

        },

        refreshChild(file){
            console.log(this.fatherIndex)
            for(let i=0;i<file.length;i++){
                if(file[i].id===this.fatherIndex){
                    file[i].children=this.myFileShown
                    console.log(this.myFile)
                    return;
                }else{
                    this.refreshChild(file[i].children)
                }
            }
        },

        showFilePackage(){
            this.fileSpaceIndex=1
            this.pathShown=[];
            this.downloadDataSet=[];
            this.downloadDataSetName=[];
            this.getFilePackage()
        },

        showMyUpload(){
            this.fileSpaceIndex=2
        },

        showMyFork(){},

        addFolderInPath(){
            this.addFolderIndex=true;
            $('body').css('padding-right','0')
            console.log($('body').css('padding-right'))
        },

        addChild(fileTree,fatherId,child){
            for(let i=0;i<fileTree.length;i++){
                if(fileTree[i].id===fatherId){
                    fileTree[i].children.push(child)
                    return;
                }
                this.addChild(fileTree[i].children,fatherId,child);
            }
        },

        addFolder() {
            let folderName=[];
            for(let i=0;i<this.myFileShown.length;i++){
                if(this.myFileShown[i].package===true)
                    folderName.push(this.myFileShown[i].label)
            }

            if( this.newFolderName===''){
                alert('Please input the folder name');
                this.addFolderIndex=true;
            }
            else if(folderName.indexOf(this.newFolderName)!=-1){
                alert('this name is existing in this path, please input a new one');
                this.newFolderName='';
                this.addFolderIndex=true;
            }
            else{
                let i=this.pathShown.length-1;
                let paths=[]
                while (i>=1) {
                    paths.push(this.pathShown[i].id);
                    i--;
                }
                console.log(paths)
                $.ajax({
                    type: "POST",
                    url: "/user/addFolder",
                    data: {paths: paths, name: this.newFolderName},
                    async: true,
                    contentType: "application/x-www-form-urlencoded",
                    success: (json) => {
                        if (json.code == -1) {
                            alert("Please login first!")
                            window.sessionStorage.setItem("history", window.location.href);
                            window.location.href = "/user/login"
                        } else {
                            const newChild = {id: json.data, label: this.newFolderName, children: [],package:true, father:paths[0]};
                            if(this.myFileShown.length===0)
                                this.addChild(this.myFile,paths[0],newChild)
                            this.myFileShown.push(newChild);//myfileShown是一个指向myFile子元素的地址，修改则myFile也变化
                            console.log(this.myFileShown)
                            // this.getFilePackage();
                            console.log(this.myFile)
                            alert('add folder successfully')
                            this.newFolderName='';
                            this.addFolderIndex=false;

                        }

                    }
                });
            }
        },

        addFolderinTree(){
            let data=this.$refs.folderTree.getCurrentNode();
            if(data===null) alert('please select a file directory')
            let node=this.$refs.folderTree.getNode(data);

            console.log(node);
            let paths=[];
            while(node.key!=undefined&&node.key!=0){
                paths.push(node.key);
                node=node.parent;
            }
            console.log(paths)

            this.$prompt(null, 'Enter Folder Name', {
                confirmButtonText: 'OK',
                cancelButtonText: 'Cancel',
                // inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
                // inputErrorMessage: '邮箱格式不正确'
            }).then(({ value }) => {
                $.ajax({
                    type: "POST",
                    url: "/user/addFolder",
                    data: {paths: paths, name: value},
                    async: true,
                    contentType: "application/x-www-form-urlencoded",
                    success: (json) => {
                        if (json.code == -1) {
                            alert("Please login first!")
                            window.sessionStorage.setItem("history", window.location.href);
                            window.location.href = "/user/login"
                        }
                        else {
                            const newChild = {id: json.data, label: value, children: []};
                            if (!data.children) {
                                this.$set(data, 'children', []);
                            }
                            data.children.push(newChild);
                        }

                    }
                });


            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: 'Cancel'
                });
            });
        },

        uploadFileInPath(){

        },

        uploadData() {
            return {
                author: this.userName
            }
        },
        handleDataDownloadClick({sourceStoreId}) {
            let url =
                "http://172.21.212.64:8082/dataResource/getResource?sourceStoreId=" +
                sourceStoreId;
            window.open("/dispatchRequest/download?url=" + url);
        },
        async panye(val) {
            let d = await this.getTableData(val - 1);
            this.dataFromDataContainer = d.content
            this.total = d.total;
        },
        async getTableData(page) {

            let {data} = await (await fetch(
                "/dispatchRequest/getUserRelatedDataFromDataContainer?page=" +
                page +
                "&pageSize=10&" +
                "authorName=" +
                this.userName
            )).json();

            return {
                total: data.totalElements,
                content: data.content
            }
        },

        handleSelect(index, indexPath) {
            console.log(index)
            this.resourceLoad = true;
            this.curIndex = index;
            switch (index) {
                case '1':
                    this.searchText = '';
                    this.searchResult = new Array();
                    this.page = 1;
                    this.researchIndex = 1;
                    this.getTasksInfo();
                    this.pageControlIndex = 'research';
                    this.getArticleResult();

                    break;
                case '2-1':
                case '2-2':
                case '2-3':
                case '2-4':
                case '6':
                    this.searchText = '';
                    this.searchResult = [];
                    this.page = 1;
                    this.getModels();
                    this.showWhat = index;
                    this.pageControlIndex = this.curIndex;
                    break;
                case '3-1':
                    this.searchText = '';
                    this.searchResult = [];
                    this.page = 1;
                    this.getDataItems();
                    this.pageControlIndex = this.curIndex;
                    break;
                case '3-2':
                    this.searchText = '';
                    this.searchResult = [];
                    this.page = 1;
                    this.classif = [];
                    $("#classification").val('');
                    this.pageControlIndex = this.curIndex;
                    this.data_img = []
                    break;
                case '3-3':
                    this.panye(1);
                    this.addAllData()
                    this.getFilePackage()
                    this.pageControlIndex = this.curIndex;
                    this.pathShown=[];
                    this.downloadDataSet=[];
                    this.downloadDataSetName=[];
                    break;
                case '4-1':
                    this.searchText = '';
                    this.searchResult = [];
                    this.page = 1;
                    this.getConcepts();
                    this.pageControlIndex = this.curIndex;
                    break;
                case '4-2':
                    this.searchText = '';
                    this.searchResult = [];
                    this.page = 1;
                    this.getSpatials();
                    this.pageControlIndex = this.curIndex;
                    break;
                case '4-3':
                    this.searchText = '';
                    this.searchResult = [];
                    this.page = 1;
                    this.getTemplates();
                    this.pageControlIndex = this.curIndex;
                    break;
                case '4-4':
                    this.searchText = '';
                    this.searchResult = [];
                    this.page = 1;
                    this.getUnits();
                    this.pageControlIndex = this.curIndex;
                    break;
                // case '5-1':
                // case '5-2':
                // case '5-3':
                //
                //     this.getResearchItems();
                //     break;
            }
        },


        setSession(name, value) {
            window.sessionStorage.setItem(name, value);
            this.editOid = sessionStorage.getItem('editItemOid');
        },


        addArticleClick() {

            this.articleToBack.title = $("#articleTitle").val();
            var tags = $('#articleAuthor').tagEditor('getTags')[0].tags;
            for (i = 0; i < tags.length; i++) {
                $('#articleAuthor').tagEditor('removeTag', tags[i]);
            }
            this.articleToBack.author = tags;
            this.articleToBack.journal = $("#articleJournal").val();
            this.articleToBack.startPage = $("#articleStartPage").val();
            this.articleToBack.endPage = $("#articleEndPage").val();
            this.articleToBack.date = $("#articleDate").val();
            this.articleToBack.link = $("#articleLink").val();
            // console.log(this.articleToBack);
            this.ArticleAddToBack();

        },

        ArticleAddToBack() {
            if (this.articleToBack.title.trim() == "" || this.articleToBack.author.length == "")
                alert("Please enter the Title and at least one Author.");
            else {
                let obj =
                    {
                        title: this.articleToBack.title,
                        authors: this.articleToBack.author,
                        journal: this.articleToBack.journal,
                        startPage: this.articleToBack.startPage,
                        endPage: this.articleToBack.endPage,
                        date: this.articleToBack.date,
                        link: this.articleToBack.link,
                    }
                $.ajax({
                    url: "/article/add",
                    type: "POST",
                    contentType: "application/json",
                    data: JSON.stringify(obj),

                    async: true,
                    success: (json) => {
                        if (json.code == 0) {
                            alert("Add Success");
                            this.getArticleResult();
                            $("#articleInfo")[0].style.display = "none";
                        } else alert("Add Error");//此处error信息不明确，记得后加
                    }

                })
            }

        },

        addProjectClick() {

            this.projectToBack.name = $("#projectName").val();
            this.projectToBack.startTime = $("#startTime").val();
            this.projectToBack.endTime = $("#endTime").val();
            this.projectToBack.role = $("#role").val();
            this.projectToBack.fundAgency = $("#fundAgency").val();
            this.projectToBack.amount = $("#amount").val();
            this.ProjectAddToBack();
        },

        ProjectAddToBack() {
            if (this.projectToBack.title == "")
                alert("Please enter the project Name.");
            else {
                let obj =
                    {
                        projectName: this.projectToBack.name,
                        startTime: this.projectToBack.startTime,
                        endTime: this.projectToBack.endTime,
                        role: this.projectToBack.role,
                        fundAgency: this.projectToBack.fundAgency,
                        amount: this.projectToBack.amount,
                    }
                $.ajax({
                    url: "/project/add",
                    type: "POST",
                    contentType: "application/json",
                    data: JSON.stringify(obj),

                    async: true,
                    success: (json) => {
                        if (json.code == 0) {
                            alert("Add Success");
                            this.getProjectResult();
                            $("#projectInfo")[0].style.display = "none";
                        } else alert("Add Error");//此处error信息不明确，记得后加
                    }

                })
            }

        },

        addConferenceClick() {
            this.conferenceToBack.title = $("#conferenceTitle").val();
            this.conferenceToBack.theme = $("#theme").val();
            this.conferenceToBack.role = $("#conferenceRole").val();
            this.conferenceToBack.location = $("#conferenceLocation").val();
            this.conferenceToBack.startTime = $("#conferstartTime").val();
            this.conferenceToBack.endTime = $("#conferendTime").val();
            this.ConferenceAddToBack();
        },

        ConferenceAddToBack() {
            if (this.projectToBack.title == "")
                alert("Please enter the project name.");
            else {
                let obj =
                    {
                        title: this.conferenceToBack.title,
                        theme: this.conferenceToBack.theme,
                        conferenceRole: this.conferenceToBack.role,
                        location: this.conferenceToBack.location,
                        startTime: this.conferenceToBack.startTime,
                        endTime: this.conferenceToBack.endTime
                    }
                $.ajax({
                    url: "/conference/add",
                    type: "POST",
                    contentType: "application/json",
                    data: JSON.stringify(obj),

                    async: true,
                    success: (json) => {
                        if (json.code == 0) {
                            alert("Add Success");
                            this.getConferenceResult();
                            $("#conferenceInfo")[0].style.display = "none";
                        } else alert("Add Error");//此处error信息不明确，记得后加
                    }

                })
            }

        },

        articleClick(index) {
            this.researchIndex = index;
            // this.curIndex='research'+index.toString();
            this.pageControlIndex = 'research';
            this.searchText = '';
            this.searchResult = [];
            this.page = 1;
            // this.pageSize=4;
            this.getArticleResult();
        },

        projectClick(index) {
            this.researchIndex = index;
            this.pageControlIndex = 'research';
            this.searchText = '';
            this.searchResult = [];
            this.page = 1;
            // this.pageSize=4;
            this.getProjectResult();
        },

        conferenceClick(index) {
            this.researchIndex = index;
            this.pageControlIndex = 'research';
            this.searchText = '';
            this.searchResult = [];
            this.page = 1;
            // this.pageSize=4;
            this.getConferenceResult();
        },

        articleEditClick() {
            this.articleToBack.title = $("#articleTitleEdit").val();
            var tags = $('#articleAuthorEdit').tagEditor('getTags')[0].tags;
            for (i = 0; i < tags.length; i++) {
                $('#articleAuthorEdit').tagEditor('removeTag', tags[i]);
            }
            this.articleToBack.author = tags;
            this.articleToBack.journal = $("#articleJournalEdit").val();
            this.articleToBack.startPage = $("#articleStartPageEdit").val();
            this.articleToBack.endPage = $("#articleEndPageEdit").val();
            this.articleToBack.date = $("#articleDateEdit").val();
            this.articleToBack.link = $("#articleLinkEdit").val();
            this.editArticle();
        },

        projectEditClick() {
            this.projectToBack.name = $("#projectNameEdit").val();
            this.projectToBack.startTime = $("#startTimeEdit").val();
            this.projectToBack.endTime = $("#endTimeEdit").val();
            this.projectToBack.role = $("#roleEdit").val();
            this.projectToBack.fundAgency = $("#fundAgencyEdit").val();
            this.projectToBack.amount = $("#amountEdit").val();
            this.editProject();
        },

        conferenceEditClick() {
            this.conferenceToBack.title = $("#conferenceTitleEdit").val();
            console.log(this.conferenceToBack.title);
            console.log(this.editOid);
            this.conferenceToBack.theme = $("#themeEdit").val();
            this.conferenceToBack.role = $("#conferenceRoleEdit").val();
            this.conferenceToBack.location = $("#conferenceLocationEdit").val();
            this.conferenceToBack.startTime = $("#conferStartTimeEdit").val();
            this.conferenceToBack.endTime = $("#conferEndTimeEdit").val();
            this.editConference();
        },

        myDataClick(index) {
            this.dataChosenIndex = index;
            this.pathShown=[];
            this.downloadDataSet=[];
            this.downloadDataSetName=[];
            this.getFilePackage()
        },

        outputDataClick(index) {
            this.dataChosenIndex = index;
        },

        editArticle() {
            // var urls={
            //     1:"/article/editByOid",
            //     2:"/project/editByOid",
            //     3:"/conference/editByOid",
            // }
            // var url=urls[this.researchIndex];
            if (this.articleToBack.title == "" || this.articleToBack.author == "")
                alert("Please enter the Title and at least one Author.");
            else {
                let obj =
                    {
                        title: this.articleToBack.title,
                        authors: this.articleToBack.author,
                        journal: this.articleToBack.journal,
                        startPage: this.articleToBack.startPage,
                        endPage: this.articleToBack.endPage,
                        date: this.articleToBack.date,
                        link: this.articleToBack.link,
                        oid: this.editOid,
                    }
                $.ajax({
                    url: "/article/editByOid",
                    type: "POST",
                    contentType: "application/json",
                    data: JSON.stringify(obj),

                    async: true,
                    success: (json) => {
                        if (json.code == 0) {
                            alert("Edit Success");
                            this.getArticleResult();
                            $("#articleEdit")[0].style.display = "none";
                        } else alert("Edit Error");//此处error信息不明确，记得后加
                    }
                })
            }
        },

        editProject() {
            if (this.projectToBack.name == "")
                alert("Please enter the project Name.");
            else {
                let obj =
                    {
                        projectName: this.projectToBack.name,
                        startTime: this.projectToBack.startTime,
                        endTime: this.projectToBack.endTime,
                        role: this.projectToBack.role,
                        fundAgency: this.projectToBack.fundAgency,
                        amount: this.projectToBack.amount,
                        oid: this.editOid,
                    }
                $.ajax({
                    url: "/project/editByOid",
                    type: "POST",
                    contentType: "application/json",
                    data: JSON.stringify(obj),

                    async: true,
                    success: (json) => {
                        if (json.code == 0) {
                            alert("Edit Success");
                            this.getProjectResult();
                            $("#projectEdit")[0].style.display = "none";
                        } else alert("Edit Error");//此处error信息不明确，记得后加
                    }
                })
            }
        },

        editConference() {
            if (this.conferenceToBack.title == "")
                alert("Please enter the conference Title.");
            else {
                let obj =
                    {
                        title: this.conferenceToBack.title,
                        theme: this.conferenceToBack.theme,
                        conferenceRole: this.conferenceToBack.role,
                        location: this.conferenceToBack.location,
                        startTime: this.conferenceToBack.startTime,
                        endTime: this.conferenceToBack.endTime,
                        oid: this.editOid,
                    }
                $.ajax({
                    url: "/conference/editByOid",
                    type: "POST",
                    contentType: "application/json",
                    data: JSON.stringify(obj),

                    async: true,
                    success: (json) => {
                        if (json.code == 0) {
                            alert("Edit Success");
                            this.getConferenceResult();
                            $("#conferenceEdit")[0].style.display = "none";
                        } else alert("Edit Error");//此处error信息不明确，记得后加
                    }
                })
            }
        },

        deleteResearchItemClick(oid) {
            this.deleteResearchItem(oid);
        },
        imgFile() {
            $("#imgOne").click();
        },
        getFileUrl() {
            let sourceId = "imgOne"
            var url;
            if (navigator.userAgent.indexOf("MSIE") >= 1) { // IE
                url = document.getElementById(sourceId).value;
            } else if (navigator.userAgent.indexOf("Firefox") > 0) { // Firefox
                url = window.URL.createObjectURL(document.getElementById(sourceId).files.item(0));
            } else if (navigator.userAgent.indexOf("Chrome") > 0) { // Chrome
                url = window.URL.createObjectURL(document.getElementById(sourceId).files.item(0));
            }
            return url;
        },
        preImg() {

            var file = $('#imgOne').get(0).files[0];
            //创建用来读取此文件的对象
            var reader = new FileReader();
            //使用该对象读取file文件
            reader.readAsDataURL(file);
            //读取文件成功后执行的方法函数
            reader.onload = function (e) {
                //读取成功后返回的一个参数e，整个的一个进度事件
                //选择所要显示图片的img，要赋值给img的src就是e中target下result里面
                //的base64编码格式的地址
                $('#photo').get(0).src = e.target.result;
            }


        },

        getBase64Image(img) {
            var canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            var ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, img.width, img.height);
            var ext = img.src.substring(img.src.lastIndexOf(".") + 1).toLowerCase();
            var dataURL = canvas.toDataURL("image/" + ext);
            return dataURL;
        },

        changeOpen(n) {
            this.activeIndex = n;
        },

        getTree() {
            return this.tree;
        },

        editModelItem(oid) {
            this.setSession('editModelItem_id', oid);
            document.getElementById('modifyModelItem').contentWindow.location.reload(true)

        },


        getTasksInfo() {
            this.isInSearch = 0;
            $.ajax({
                type: "Get",
                url: "/user/getUserInfo",
                data: {},
                crossDomain: true,
                xhrFields: {
                    withCredentials: true
                },
                success: (json) => {
                    data = json.data;
                    console.log(data);
                    this.statisticsInfo = data["record"];
                    var modelInfo = data["userInfo"];

                    this.resourceOption = {
                        color: ['#3398DB'],
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                            }
                        },
                        grid: {
                            left: '3%',
                            right: '4%',
                            bottom: '3%',
                            containLabel: true
                        },
                        xAxis: [
                            {
                                type: 'category',
                                data: ['Model Items', 'Data Item', 'Conceputal Model', 'Logical Model', 'Computable Model'],
                                axisTick: {
                                    alignWithLabel: true
                                },
                                axisLabel: {
                                    interval: 0,
                                    formatter: function (params) {
                                        var index = params.indexOf(" ");
                                        var start = params.substring(0, index);
                                        var end = params.substring(index + 1);
                                        var newParams = start + "\n" + end;
                                        return newParams
                                    }
                                }
                            }
                        ],
                        yAxis: [
                            {
                                type: 'value'
                            }
                        ],
                        series: [
                            {
                                name: 'count',
                                type: 'bar',
                                barWidth: '60%',
                                data: [modelInfo["modelItems"], modelInfo["dataItems"], modelInfo["conceptualModels"], modelInfo["logicalModels"], modelInfo["computableModels"]]
                            }
                        ]
                    }

                    // var chart = echarts.init(document.getElementById('chartRes'));
                    // chart.setOption(this.resourceOption);

                    this.userInfo = modelInfo;

                    //取出taskinfo放入userTaskInfo
                    this.getUserTaskInfo()

                    let orgs = this.userInfo.organizations;

                    if (orgs.length != 0) {
                        this.userInfo.orgStr = orgs[0];
                        for (i = 1; i < orgs.length; i++) {
                            this.userInfo.orgStr += ", " + orgs[i];
                        }
                    }

                    let sas = this.userInfo.subjectAreas;
                    if (sas != null && sas.length != 0) {
                        this.userInfo.saStr = sas[0];
                        for (i = 1; i < sas.length; i++) {
                            this.userInfo.saStr += ", " + sas[i];
                        }
                    }


                    this.load = false;
                }
            })

        },

        getServersInfo() {
            $.ajax({
                type: "GET",
                url: "/node/computerNodesByUserId",
                data: {},

                crossDomain: true,
                xhrFields: {
                    withCredentials: true
                },
                async: true,
                success: (data) => {
                    data = JSON.parse(data);
                    console.log(data);
                    var chartInfo = this.createChartInfo(data.computerNodes);
                    this.computerNodesInfos = chartInfo.cityCount;
                    this.createChartMap(chartInfo);
                }
            })

        },

        getComputerModelsForDeploy() {
            $.ajax({
                type: "Get",
                url: "/computableModel/getComputerModelsForDeployByUserId",
                data: {
                    page: this.page,
                    sortType: this.sortType,
                    asc: this.sortAsc
                },
                cache: false,
                async: true,

                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                success: (data) => {
                    data = JSON.parse(data);
                    this.resourceLoad = false;
                    this.totalNum = data.count;
                    this.searchCount = Number.parseInt(data["count"]);
                    this.computerModelsDeploy = data["computableModels"];
                    if (this.page == 1) {
                        this.pageInit();
                    }
                }
            })
        },

        searchComputerModelsForDeploy() {
            $.ajax({
                type: "Get",
                url: "/computableModel/searchComputerModelsForDeploy",
                data: {
                    searchText: this.searchText,
                    page: this.page,
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
                success: (data) => {
                    setTimeout(() => {
                        this.resourceLoad = false;
                        this.totalNum = data.count;
                        this.searchCount = Number.parseInt(data["count"]);
                        this.computerModelsDeploy = data["computableModels"];
                        this.pageInit();
                    }, 500);
                }
            })
        },

        // get the special data for chart map
        createChartInfo(infoArray) {
            var chartInfo = {};
            var geoCoord = {};
            //存放城市个数及城市下所在具体计算节点信息
            var cityCount = [];
            for (var i = 0; i < infoArray.length; i++) {
                var geoJson = infoArray[i].geoJson;
                var city = geoJson.city;
                var flag = false;
                //get the count of the same city
                for (let j = 0; j < cityCount.length; j++) {
                    if (cityCount[j].name === city) {
                        cityCount[j].value += 1;
                        cityCount[j].computerNodeInfos.push(infoArray[i]);
                        flag = true;
                    }
                }
                if (!flag) {
                    let cityObj = {
                        name: '',
                        value: 0,
                        computerNodeInfos: []
                    };
                    cityObj.name = city;
                    cityObj.value = 1;
                    cityObj.computerNodeInfos.push(infoArray[i]);
                    cityCount.push(cityObj);
                    geoCoord[city] = [geoJson.longitude, geoJson.latitude];

                }
            }
            chartInfo.geoCoord = geoCoord;
            chartInfo.cityCount = cityCount;
            return chartInfo;
        },

        //create chart map
        createChartMap(chartInfo) {
            var myChart = echarts.init(document.getElementById('echartMap'));
            myChart.showLoading();
            var chartdata = [];
            for (var i = 0; i < chartInfo.cityCount.length; i++) {
                let cityObj = {
                    name: '',
                    value: 0
                };
                let city = chartInfo.cityCount[i];
                let geoCoord = chartInfo.geoCoord[city.name];
                geoCoord.push(city.value);
                cityObj.name = city.name;
                cityObj.value = geoCoord;
                chartdata.push(cityObj);
            }
            myChart.hideLoading();
            var MapOptions = {
                backgroundColor: "transparent",
                tooltip: {
                    trigger: 'item',
                    formatter: '{b}'
                },
                geo: {
                    show: true,
                    map: 'world',
                    label: {
                        normal: {
                            show: false,
                            textStyle: {
                                color: 'rgba(0,0,0,0.4)'
                            }
                        },
                        emphasis: {
                            show: true,
                            backgroundColor: '#2c3037',
                            color: '#fff',
                            padding: 5,
                            fontSize: 14,
                            borderRadius: 5
                        }

                    },
                    roam: false,
                    itemStyle: {
                        normal: {
                            areaColor: '#b6d2c8',
                            borderColor: '#404a59',
                            borderWidth: 0.5
                        },
                        emphasis: {
                            areaColor: '#b6d2c8'
                        }

                    },

                },
                series: [
                    {
                        name: '点',
                        type: 'scatter',
                        coordinateSystem: 'geo',
                        symbol: 'pin', //气泡
                        symbolSize: 40
                        ,
                        label: {
                            normal: {
                                show: true,
                                textStyle: {
                                    color: '#fff',
                                    fontSize: 9,
                                }
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: '#00c0ff', //标志颜色
                            }
                        },
                        zlevel: 6,
                        data: chartdata
                    },
                    {
                        name: 'Top 5',
                        type: 'effectScatter',
                        coordinateSystem: 'geo',
                        data: chartdata,
                        symbolSize: 20,
                        showEffectOn: 'render',
                        rippleEffect: {
                            brushType: 'stroke'
                        },
                        hoverAnimation: true,
                        label: {
                            normal: {
                                formatter: '{b}',
                                position: 'right',
                                show: false
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: '#3daadb',
                                shadowBlur: 0,
                                shadowColor: '#3daadb'
                            }
                        },
                        zlevel: 1
                    },
                ]
            };
            this.computerNodesMapOptions = MapOptions;
            myChart.setOption(MapOptions);
            console.log('wait to load');

            window.onresize = () => {
                height = document.documentElement.clientHeight;
                this.ScreenMinHeight = (height) + "px";
                myChart.resize();
            };

            //添加地图点击事件
            myChart.on('click', function (params) {
                if (params.componentType == "series") {
                    {
                        $("#pageContent").stop(true);
                        $("#pageContent").animate({scrollTop: $("#" + params.name).offset().top}, 500);
                    }
                }
            })

        },


        //choose the model_service to deploy and page transition
        deployModel(computerNodes) {
            let computableId = computerNodes[0].computableId;
            this.setSession('computable_id', computableId);
            window.location.href = '../deploy-modelService/deploy-modelService.html';
        },

        getUserTaskInfo() {
            this.userTaskInfo = this.userInfo.runTask;
            console.log(this.userTaskInfo)
        },

        menuClick(num) {
            switch (num) {
                case 1:
                    this.dashboard_show = true;
                    this.model_show = false;
                    this.conceptual_show = false;
                    this.logical_show = false;
                    this.computable_show = false;
                    this.tasks_show = false;
                    this.servers_show = false;
                    this.deploys_show = false;
                    this.data_upload = false;
                    this.data_show = false;
                    this.user_position = this.curIndex,
                        //update searchText
                        this.searchText = '';
                    this.searchResult = [];
                    this.page = 1;
                    this.getTasksInfo();

                    break;
                case 2:
                    this.childIndex = 1;
                    this.dashboard_show = false;
                    this.model_show = true;
                    this.conceptual_show = false;
                    this.logical_show = false;
                    this.computable_show = false;
                    this.tasks_show = false;
                    this.servers_show = false;
                    this.deploys_show = false;
                    this.resourceLoad = true;
                    this.data_upload = false;
                    this.data_show = false;
                    //update searchText
                    this.searchText = '';
                    this.searchResult = [];
                    this.page = 1;
                    this.getModels();
                    break;
                case 3:
                    this.childIndex = 2;
                    this.dashboard_show = false;
                    this.model_show = false;
                    this.conceptual_show = true;
                    this.logical_show = false;
                    this.computable_show = false;
                    this.tasks_show = false;
                    this.servers_show = false;
                    this.deploys_show = false;
                    this.resourceLoad = true;
                    this.data_upload = false;
                    this.data_show = false;
                    //update searchText
                    this.searchText = '';
                    this.searchResult = [];
                    this.page = 1;
                    this.getModels();
                    break;
                case 4:
                    this.childIndex = 3;
                    this.dashboard_show = false;
                    this.model_show = false;
                    this.conceptual_show = false;
                    this.logical_show = true;
                    this.computable_show = false;
                    this.tasks_show = false;
                    this.servers_show = false;
                    this.deploys_show = false;
                    this.data_upload = false;
                    this.resourceLoad = true;
                    this.data_show = false;
                    //update searchText
                    this.searchText = '';
                    this.searchResult = [];
                    this.page = 1;
                    this.getModels();
                    break;
                case 5:
                    this.activeIndex = 2;
                    this.childIndex = 4;
                    this.dashboard_show = false;
                    this.model_show = false;
                    this.conceptual_show = false;
                    this.logical_show = false;
                    this.computable_show = true;
                    this.tasks_show = false;
                    this.servers_show = false;
                    this.deploys_show = false;
                    this.resourceLoad = true;
                    this.data_upload = false;
                    this.data_show = false;
                    //update searchText
                    this.searchText = '';
                    this.searchResult = [];
                    this.page = 1;
                    this.getModels();
                    break;
                case 6:
                    this.dashboard_show = false;
                    this.model_show = false;
                    this.conceptual_show = false;
                    this.computable_show = false;
                    this.tasks_show = true;
                    this.servers_show = false;
                    this.deploys_show = false;
                    this.resourceLoad = true;
                    this.data_upload = false;
                    this.data_show = false;
                    //update searchText
                    this.searchText = '';
                    this.searchResult = [];
                    this.page = 1;
                    this.getModels();
                    break;
                case 7://todo data items
                    this.curIndex = '3-2',
                        this.childIndex = 5;
                    this.dashboard_show = false;
                    this.model_show = false;
                    this.conceptual_show = false;
                    this.logical_show = false;
                    this.computable_show = false;
                    this.tasks_show = false;
                    this.servers_show = false;
                    this.deploys_show = false;
                    this.user_position = this.curIndex,
                        this.resourceLoad = false;
                    this.data_upload = false;
                    this.data_show = true;

                    //update searchText
                    this.searchText = '';
                    this.searchResult = [];
                    this.page = 1;
                    // this.getModels();
                    this.getDataItems();
                    break;
                case 8://todo upload data

                    this.childIndex = 6;
                    this.dashboard_show = false;
                    this.model_show = false;
                    this.conceptual_show = false;
                    this.logical_show = false;
                    this.computable_show = false;
                    this.tasks_show = false;
                    this.servers_show = false;
                    this.deploys_show = false;
                    this.resourceLoad = false;
                    this.data_show = false;
                    this.data_upload = true;
                    //update searchText
                    this.searchText = '';
                    this.searchResult = [];
                    this.page = 1;
                    this.classif = [];
                    // this.getModels();
                    $("#classification").val('');
                    this.data_img = []

                    break;
                case 10:
                    this.activeIndex = 4;
                    this.childIndex = 0;
                    this.dashboard_show = false;
                    this.model_show = false;
                    this.conceptual_show = false;
                    this.logical_show = false;
                    this.computable_show = false;
                    this.tasks_show = true;
                    this.servers_show = false;
                    this.deploys_show = false;
                    this.resourceLoad = true;
                    this.data_upload = false;
                    this.data_show = false;
                    //update searchText
                    this.searchText = '';
                    this.searchResult = [];
                    this.page = 1;
                    this.getModels();
                    break;

            }

            //request has already request for twice in fact(it doesn't matter)
            //通过点击左侧导航栏的都统一将页面元素设置为1
            // this.changePage(1);
        },

        search() {
            this.resourceLoad = true;
            this.searchResult = [];
            if (this.searchText === "") {
                if (this.deploys_show) {
                    this.getComputerModelsForDeploy();
                } else {
                    this.getModels();
                }
            } else {
                this.searchModels();
            }
        },

        searchModels() {
            this.resourceLoad = true;
            this.pageSize = 10;
            this.isInSearch = 1;
            var url = "";
            var name = "";
            if (this.curIndex == '2-1') {
                url = "/modelItem/searchModelItemsByUserId";
                name = "modelItems";
            } else if (this.curIndex == '2-2') {
                url = "/conceptualModel/searchConceptualModelsByUserId";
                name = "conceptualModels";
            } else if (this.curIndex == '2-3') {
                url = "/logicalModel/searchLogicalModelsByUserId";
                name = "logicalModels";
            } else if (this.curIndex == '2-4') {
                url = "/computableModel/searchComputableModelsByUserId";
                name = "computableModels";
            } else if (this.curIndex == '6') {
                url = "/task/searchTasksByUserId";
                name = "tasks";
                this.sortAsc = -1;
            }

            if (this.deploys_show) {
                this.searchComputerModelsForDeploy();
            } else {
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
            }
        },
        searchDataItem() {
            this.pageSize = 10;
            this.isInSearch = 1;
            var that = this;
            var da = {
                userOid: this.userId,
                page: this.page,
                pagesize: this.pageSize,
                asc: false,
                searchText: this.searchText
            }
            axios.get("/dataItem/searchDataByUserId/", {
                params: da
            })
                .then((res) => {
                    setTimeout(() => {
                        if (res.status == 200) {
                            if (res.data.data != null) {
                                that.searchResult = res.data.data.content;
                                if (this.page == 1) {
                                    this.pageInit();
                                }
                            } else {
                                alert("no result")
                            }
                        }
                    }, 500)

                    // this.list=res.data.data;

                });
        },
        searchConcepts() {
            this.pageSize = 10;
            this.isInSearch = 1;
            var url = "/repository/searchConceptsByUserId";
            var name = "concepts";
            $.ajax({
                type: "Get",
                url: url,
                data: {
                    searchText: this.searchText,
                    page: this.page - 1,
                    pageSize: this.pageSize,
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
        searchSpatials() {
            this.pageSize = 10;
            this.isInSearch = 1;
            var url = "/repository/searchSpatialsByUserId";
            var name = "spatials";
            $.ajax({
                type: "Get",
                url: url,
                data: {
                    searchText: this.searchText,
                    page: this.page - 1,
                    pageSize: this.pageSize,
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
        searchTemplates() {
            this.pageSize = 10;
            this.isInSearch = 1;
            var url = "/repository/searchTemplatesByUserId";
            var name = "templates";
            $.ajax({
                type: "Get",
                url: url,
                data: {
                    searchText: this.searchText,
                    page: this.page - 1,
                    pageSize: this.pageSize,
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
        searchUnits() {
            this.pageSize = 10;
            this.isInSearch = 1;
            var url = "/repository/searchUnitsByUserId";
            var name = "units";
            $.ajax({
                type: "Get",
                url: url,
                data: {
                    searchText: this.searchText,
                    page: this.page - 1,
                    pageSize: this.pageSize,
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

        searchArticles() {
            this.pageSize = 5;
            this.isInSearch = 1;
            // var urls={
            //     1:"/article/searchByTitle",
            //     2:"/project/searchByName",
            //     3:"/conference/searchByTitle",
            // }
            // var url=urls[this.researchIndex];
            $.ajax({
                type: "GET",
                url: "/article/searchByTitle",
                data: {
                    page: this.page - 1,
                    pageSize: this.pageSize,
                    sortElement: "creatDate",
                    asc: false,
                    searchText: this.searchText

                },
                cache: false,
                async: true,
                dataType: "json",
                xhrFields: {
                    withCredentials: true
                },
                success: (json) => {
                    if (json.code != 0) {
                        alert("Please login first!");
                        window.location.href = "/user/login";
                    } else {
                        const data = json.data;
                        this.resourceLoad = false;
                        this.totalNum = data.total;
                        Vue.set(this.researchItems, 'list', data.list);

                        console.log(this.researchItems);
                        if (this.page == 1) {
                            this.pageInit();
                        }
                    }
                }
            })
        },

        searchProjects() {
            this.pageSize = 5;
            this.isInSearch = 1;
            // var urls={
            //     1:"/article/searchByTitle",
            //     2:"/project/searchByName",
            //     3:"/conference/searchByTitle",
            // }
            // var url=urls[this.researchIndex];
            $.ajax({
                type: "GET",
                url: "/project/searchByName",
                data: {
                    page: this.page - 1,
                    pageSize: this.pageSize,
                    sortElement: "creatDate",
                    asc: false,
                    searchText: this.searchText

                },
                cache: false,
                async: true,
                dataType: "json",
                xhrFields: {
                    withCredentials: true
                },
                success: (json) => {
                    if (json.code != 0) {
                        alert("Please login first!");
                        window.location.href = "/user/login";
                    } else {
                        const data = json.data;
                        this.resourceLoad = false;
                        this.totalNum = data.total;
                        Vue.set(this.projectResult, 'list', data.list);

                        console.log(this.projectResult);
                        if (this.page == 1) {
                            this.pageInit();
                        }
                    }
                }
            })
        },

        searchConferences() {
            this.pageSize = 5;
            this.isInSearch = 1;
            // var urls={
            //     1:"/article/searchByTitle",
            //     2:"/project/searchByName",
            //     3:"/conference/searchByTitle",
            // }
            // var url=urls[this.researchIndex];
            $.ajax({
                type: "GET",
                url: "/conference/searchByTitle",
                data: {
                    page: this.page - 1,
                    pageSize: this.pageSize,
                    sortElement: "creatDate",
                    asc: false,
                    searchText: this.searchText

                },
                cache: false,
                async: true,
                dataType: "json",
                xhrFields: {
                    withCredentials: true
                },
                success: (json) => {
                    if (json.code != 0) {
                        alert("Please login first!");
                        window.location.href = "/user/login";
                    } else {
                        const data = json.data;
                        this.resourceLoad = false;
                        this.totalNum = data.total;
                        Vue.set(this.conferenceResult, 'list', data.list);

                        console.log(this.conferenceResult);
                        if (this.page == 1) {
                            this.pageInit();
                        }
                    }
                }
            })
        },

        getTasks(callback) {
            $.ajax({
                type: "Get",
                url: "/task/getTasksByUserIdNoPage",
                data: {

                    sortType: 'runTime',
                    asc: -1
                },
                cache: false,
                async: true,

                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                success: (json) => {

                    if (json.code != 0) {
                        alert("Please login first!");
                        window.location.href = "/user/login";
                    } else {
                        const data = json.data;
                        this.resourceLoad = false;
                        // this.researchItems = data.list;
                        this.userTaskFullInfo = data;
                        this.getAllPackageTasks();

                    }
                }
            })
        },


        getModels() {
            this.pageSize = 10;
            this.isInSearch = 0;
            var url = "";
            var name = "";
            console.log(this.searchResult);
            if (this.curIndex == '2-1') {
                url = "/modelItem/getModelItemsByUserId";
                name = "modelItems";
            } else if (this.curIndex == '2-2') {
                url = "/conceptualModel/getConceptualModelsByUserId"
                name = "conceptualModels";
            } else if (this.curIndex == '2-3') {
                url = "/logicalModel/getLogicalModelsByUserId"
                name = "logicalModels";
            } else if (this.curIndex == '2-4') {
                url = "/computableModel/getComputableModelsByUserId";
                name = "computableModels";
            } else if (this.curIndex == '6') {
                url = "/task/getTasksByUserId";
                name = "tasks";
                this.sortAsc = -1;
            }
            // else if(this.deploys_show){
            //     url = "http://geomodeling.njnu.edu.cn/GeoModeling/ComputableModelsForDeployServlet";
            //     name = "computableModels";

            // }
            this.$forceUpdate();

            $.ajax({
                type: "Get",
                url: url,
                data: {
                    page: this.page - 1,
                    sortType: this.sortType,
                    asc: -1
                },
                cache: false,
                async: true,

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
                        // this.searchCount = Number.parseInt(data["count"]);
                        //this.searchResult = data[name];
                        for (var i = 0; i < data[name].length; i++) {
                            // this.searchResult.push(data[name][i]);
                            this.searchResult.splice(i, 0, data[name][i]);
                            console.log(data[name][i]);
                        }
                        //this.modelItemResult = data[name];
                        if (this.page == 1) {
                            this.pageInit();
                        }

                    }
                }
            })

        },
        getConcepts() {
            this.pageSize = 10;
            this.isInSearch = 0;
            var url = "/repository/getConceptsByUserId";
            var name = "concepts";

            $.ajax({
                type: "Get",
                url: url,
                data: {
                    page: this.page - 1,
                    sortType: this.sortType,
                    asc: -1
                },
                cache: false,
                async: true,

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
        getSpatials() {
            this.pageSize = 10;
            this.isInSearch = 0;
            var url = "/repository/getSpatialsByUserId";
            var name = "spatials";

            $.ajax({
                type: "Get",
                url: url,
                data: {
                    page: this.page - 1,
                    sortType: this.sortType,
                    asc: -1
                },
                cache: false,
                async: true,

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
        getTemplates() {
            this.pageSize = 10;
            this.isInSearch = 0;
            var url = "/repository/getTemplatesByUserId";
            var name = "templates";

            $.ajax({
                type: "Get",
                url: url,
                data: {
                    page: this.page - 1,
                    sortType: this.sortType,
                    asc: -1
                },
                cache: false,
                async: true,

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
        getUnits() {
            this.pageSize = 10;
            this.isInSearch = 0;
            var url = "/repository/getUnitsByUserId";
            var name = "units";

            $.ajax({
                type: "Get",
                url: url,
                data: {
                    page: this.page - 1,
                    sortType: this.sortType,
                    asc: -1
                },
                cache: false,
                async: true,

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

        getArticleResult() {
            this.pageSize = 5;
            this.researchItems = [];
            this.isInSearch = 0;
            // var urls={
            //     1:"/article/getByUserOidBySort",
            //     2:"/project/getByUserOidBySort",
            //     3:"/conference/getByUserOidBySort",
            // }
            // var url=urls[this.researchIndex];
            $.ajax({
                type: 'GET',
                url: "/article/getByUserOidBySort",
                // contentType:'application/json',

                data:
                    {
                        page: this.page - 1,
                        pageSize: this.pageSize,
                        sortElement: "creatDate",
                        asc: false
                    },
                // JSON.stringify(obj),
                cache: false,
                async: true,
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                success: (json) => {

                    if (json.code != 0) {
                        alert("Please login first!");
                        window.location.href = "/user/login";
                    } else {
                        setTimeout(() => {
                            const data = json.data;
                            this.resourceLoad = false;
                            this.totalNum = data.total;
                            // this.researchItems = data.list;
                            Vue.set(this.researchItems, 'list', data.list);
                            this.$forceUpdate();
                            if (this.page == 1) {
                                this.pageInit();
                            }
                        }, 100)


                    }
                }
            })
        },

        getProjectResult() {
            this.pageSize = 5;
            var url = "/project/getByUserOidBySort";
            $.ajax({
                type: 'GET',
                url: url,
                // contentType:'application/json',

                data:
                    {
                        page: this.page - 1,
                        pageSize: this.pageSize,
                        sortElement: "creatDate",
                        asc: false
                    },
                // JSON.stringify(obj),
                cache: false,
                async: true,
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                success: (json) => {

                    if (json.code != 0) {
                        alert("Please login first!");
                        window.location.href = "/user/login";
                    } else {
                        setTimeout(() => {
                            const data = json.data;
                            this.resourceLoad = false;
                            this.totalNum = data.total;
                            // this.researchItems = data.list;
                            Vue.set(this.projectResult, 'list', data.list);
                            console.log(this.projectResult);
                            this.$forceUpdate();
                            if (this.page == 1) {
                                this.pageInit();
                            }
                        }, 150)


                    }
                }
            })
        },

        getConferenceResult() {
            this.pageSize = 5;
            var url = "/conference/getByUserOidBySort";
            $.ajax({
                type: 'GET',
                url: url,
                // contentType:'application/json',

                data:
                    {
                        page: this.page - 1,
                        pageSize: this.pageSize,
                        sortElement: "creatDate",
                        asc: false
                    },
                // JSON.stringify(obj),
                cache: false,
                async: true,
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                success: (json) => {

                    if (json.code != 0) {
                        alert("Please login first!");
                        window.location.href = "/user/login";
                    } else {
                        setTimeout(() => {
                            const data = json.data;
                            this.resourceLoad = false;
                            this.totalNum = data.total;
                            // this.researchItems = data.list;
                            Vue.set(this.conferenceResult, 'list', data.list);
                            console.log(this.projectResult);
                            this.$forceUpdate();
                            if (this.page == 1) {
                                this.pageInit();
                            }
                        }, 150)


                    }
                }
            })
        },

        deleteModel(oid) {
            if (confirm("Are you sure to delete this model?")) {
                var url = "";
                if (this.curIndex == '2-1') {
                    url = "/modelItem/delete";
                } else if (this.curIndex == '2-2') {
                    url = "/conceptualModel/delete";
                } else if (this.curIndex == '2-3') {
                    url = "/logicalModel/delete";
                } else if (this.curIndex == '2-4') {
                    url = "/computableModel/delete";
                } else if (this.curIndex == '5') {
                    url = "/task/delete";
                }

                $.ajax({
                    type: "POST",
                    url: url,
                    data: {
                        oid: oid
                    },
                    cache: false,
                    async: true,
                    dataType: "json",
                    xhrFields: {
                        withCredentials: true
                    },
                    crossDomain: true,
                    success: (json) => {
                        if (json.code == -1) {
                            alert("Please log in first!")
                        } else {
                            if (json.data == 1) {
                                alert("delete successfully!")
                            } else {
                                alert("delete failed!")
                            }
                        }
                        if (this.searchText.trim() != "") {
                            this.searchModels();
                        } else {
                            this.getModels();
                        }

                    }
                })
            }
        },
        deleteConcept(oid) {
            if (confirm("Are you sure to delete this concept?")) {
                var url = "/repository/deleteConcept";
                $.ajax({
                    type: "POST",
                    url: url,
                    data: {
                        oid: oid
                    },
                    cache: false,
                    async: true,
                    dataType: "json",
                    xhrFields: {
                        withCredentials: true
                    },
                    crossDomain: true,
                    success: (json) => {
                        if (json.code == -1) {
                            alert("Please log in first!")
                        } else {
                            if (json.data == 1) {
                                alert("delete successfully!")
                            } else {
                                alert("delete failed!")
                            }
                        }
                        if (this.searchText.trim() != "") {
                            this.searchConcepts();
                        } else {
                            this.getConcepts();
                        }
                    }
                })
            }
        },
        deleteSpataial(oid) {
            if (confirm("Are you sure to delete this spatial reference?")) {
                var url = "/repository/deleteSpatialReference";
                $.ajax({
                    type: "POST",
                    url: url,
                    data: {
                        oid: oid
                    },
                    cache: false,
                    async: true,
                    dataType: "json",
                    xhrFields: {
                        withCredentials: true
                    },
                    crossDomain: true,
                    success: (json) => {
                        if (json.code == -1) {
                            alert("Please log in first!")
                        } else {
                            if (json.data == 1) {
                                alert("delete successfully!")
                            } else {
                                alert("delete failed!")
                            }
                        }
                        if (this.searchText.trim() != "") {
                            this.searchSpatials();
                        } else {
                            this.getSpatials();
                        }
                    }
                })
            }
        },
        deleteTemplate(oid) {
            if (confirm("Are you sure to delete this template?")) {
                var url = "/repository/deleteTemplate";
                $.ajax({
                    type: "POST",
                    url: url,
                    data: {
                        oid: oid
                    },
                    cache: false,
                    async: true,
                    dataType: "json",
                    xhrFields: {
                        withCredentials: true
                    },
                    crossDomain: true,
                    success: (json) => {
                        if (json.code == -1) {
                            alert("Please log in first!")
                        } else {
                            if (json.data == 1) {
                                alert("delete successfully!")
                            } else {
                                alert("delete failed!")
                            }
                        }
                        if (this.searchText.trim() != "") {
                            this.searchTemplates();
                        } else {
                            this.getTemplates();
                        }
                    }
                })
            }
        },
        deleteUnit(oid) {
            if (confirm("Are you sure to delete this unit?")) {
                var url = "/repository/deleteUnit";
                $.ajax({
                    type: "POST",
                    url: url,
                    data: {
                        oid: oid
                    },
                    cache: false,
                    async: true,
                    dataType: "json",
                    xhrFields: {
                        withCredentials: true
                    },
                    crossDomain: true,
                    success: (json) => {
                        if (json.code == -1) {
                            alert("Please log in first!")
                        } else {
                            if (json.data == 1) {
                                alert("delete successfully!")
                            } else {
                                alert("delete failed!")
                            }
                        }
                        if (this.searchText.trim() != "") {
                            this.searchUnits();
                        } else {
                            this.getUnits();
                        }
                    }
                })
            }
        },

        deleteResearchItem(oid) {
            var urls = {
                1: "/article/deleteByOid",
                2: "/project/deleteByOid",
                3: "/conference/deleteByOid",
            }
            if (confirm("Are you sure to delete this item?")) {
                var url = urls[this.researchIndex];

                $.ajax({
                    type: "POST",
                    url: url,
                    data: {
                        oid: oid
                    },

                    cache: false,
                    async: true,
                    dataType: "json",
                    xhrFields: {
                        withCredentials: true
                    },
                    crossDomain: true,
                    success: (json) => {
                        if (json.code == -1) {
                            alert("Please log in first!")
                        } else {
                            if (json.data == 1) {
                                alert("delete successfully!")
                            } else {
                                alert("delete failed!")
                            }
                        }
                        if (this.searchText.trim() != "") {
                            if (this.researchIndex == 1)
                                this.searchArticles();
                            if (this.researchIndex == 2)
                                this.searchProjects();
                            if (this.researchIndex == 3)
                                this.searchConferences();
                        } else {
                            if (this.researchIndex == 1)
                                this.getArticleResult();
                            if (this.researchIndex == 2)
                                this.getProjectResult();
                            if (this.researchIndex == 3)
                                this.getConferenceResult();
                        }

                    }


                })
            }
        },

        updateModels() {

            $.ajax({
                type: "Get",
                url: "http://geomodeling.njnu.edu.cn/GeoModeling/UpdateRecordsServlet",
                data: {},
                cache: false,
                async: true,
                dataType: "json",
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                success: (data) => {
                    console.log(data)
                    for (var key in data) {
                        var obj = data[key];
                        if (obj.status === "suc") {
                            this.alertService.success(obj.name + "-" + obj.time);
                        } else {
                            this.alertService.danger(obj.name + "-" + obj.time);
                        }
                    }
                }
            })

        },

        downloadSingle(url) {
            window.open("/dispatchRequest/download?url=" + url);

        },

        downloadAll(recordId, name, time) {
            var form = document.createElement("form");
            form.style.display = "none";

            form.setAttribute("target", "");
            form.setAttribute('method', 'get');
            form.setAttribute('action', "http://geomodeling.njnu.edu.cn/GeoModeling/DownloadAllDataServlet");

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
                switch (this.pageControlIndex) {
                    // this.computerModelsDeploy = [];
                    // this.resourceLoad = true;
                    // this.curPage = pageNo;
                    // this.getPageList();
                    // this.page = pageNo;
                    // this.getDataItems();
                    case '2-1':
                    case '2-2':
                    case '2-3':
                    case '2-4':
                        this.resourceLoad = true;
                        this.searchResult = [];
                        //not result scroll
                        //window.scrollTo(0, 0);
                        this.curPage = pageNo;
                        this.getPageList();
                        this.page = pageNo;
                        if (this.isInSearch == 0)
                            this.getModels();
                        else this.searchModels();
                        break;
                    //
                    case '3-1':
                    case '3-2':
                        this.resourceLoad = true;
                        this.searchResult = [];
                        //not result scroll
                        //window.scrollTo(0, 0);
                        this.curPage = pageNo;
                        this.getPageList();
                        this.page = pageNo;
                        if (this.isInSearch == 0)
                            this.getDataItems();
                        else this.searchDataItem();
                        break;

                    case '4-1':
                        this.resourceLoad = true;
                        this.searchResult = [];
                        //not result scroll
                        //window.scrollTo(0, 0);
                        this.curPage = pageNo;
                        this.getPageList();
                        this.page = pageNo;
                        if (this.isInSearch == 0)
                            this.getConcepts();
                        else this.searchConcepts();
                        break;
                    case '4-2':
                        this.resourceLoad = true;
                        this.searchResult = [];
                        //not result scroll
                        //window.scrollTo(0, 0);
                        this.curPage = pageNo;
                        this.getPageList();
                        this.page = pageNo;
                        if (this.isInSearch == 0)
                            this.getSpatials();
                        else this.searchSpatials()
                        break;
                    case '4-3':
                        this.resourceLoad = true;
                        this.searchResult = [];
                        //not result scroll
                        //window.scrollTo(0, 0);
                        this.curPage = pageNo;
                        this.getPageList();
                        this.page = pageNo;
                        if (this.isInSearch == 0)
                            this.getTemplates();
                        else this.searchTemplates();
                        break;
                    case '4-4':
                        this.resourceLoad = true;
                        this.searchResult = [];
                        //not result scroll
                        //window.scrollTo(0, 0);
                        this.curPage = pageNo;
                        this.getPageList();
                        this.page = pageNo;
                        if (this.isInSearch == 0)
                            this.getUnits();
                        else this.searchUnits();
                        break;

                    case '6':
                        this.resourceLoad = true;
                        this.searchResult = [];
                        //not result scroll
                        //window.scrollTo(0, 0);
                        this.curPage = pageNo;
                        this.getPageList();
                        this.page = pageNo;
                        if (this.isInSearch == 0)
                            this.getModels();
                        else this.searchModels();
                        break;

                    case 'research':
                        this.resourceLoad = true;
                        this.searchResult = [];
                        //not result scroll
                        //window.scrollTo(0, 0);
                        this.curPage = pageNo;
                        this.getPageList();
                        this.page = pageNo;
                        switch (this.researchIndex) {
                            case 1:
                                this.getArticleResult();
                                console.log('article')
                                break;
                            case 2:
                                this.getProjectResult();
                                break;
                            case 3:
                                this.getConferenceResult();
                                break;
                        }
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

        formatDate(value) {
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
            return t;
        },

        //add data item
        createdataitem() {

            this.dataItemAddDTO.name = $("#dataname").val();

            this.dataItemAddDTO.type = $("input[name='imgradio']:checked").val();
            this.dataItemAddDTO.description = $("#description").val();
            // this.dataItemAddDTO.detail=$("#detail").val();
            var detail = tinyMCE.activeEditor.getContent();
            this.dataItemAddDTO.detail = detail;
            //todo 获取作者信息
            // this.dataItemAddDTO.author=$("#author").val();
            this.dataItemAddDTO.keywords = $("#keywords").tagsinput('items');

            this.dataItemAddDTO.classifications = this.ctegorys;
            // this.dataItemAddDTO.displays.push($("#displays").val())
            this.dataItemAddDTO.displays = this.data_img

            this.dataItemAddDTO.reference = $("#dataresoureurl").val()


            //用户名
            // this.dataItemAddDTO.author=this.userId;
            this.dataItemAddDTO.author = this.userId;
            this.dataItemAddDTO.contributers = $("#contributers").tagsinput('items');

            this.dataItemAddDTO.comments = new Array();

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
            if ($("#dataname").val().length == 0 || $("#description").val() == '' || this.dataItemAddDTO.detail == '' || this.classif.length == 0 || $("#keywords").tagsinput('items').length == 0) {
                alert("data not complete,please input required data")
            } else {
                axios.post("/dataItem/", thedata)
                    .then(res => {
                        if (res.status == 200) {
                            alert("created data item successfully!!")

                            //创建静态页面
                            axios.get("/dataItem/adddataitembyuser", {
                                params: {
                                    id: res.data.data.id
                                }
                            }).then(() => {

                            });

                            var categoryAddDTO = {
                                id: res.data.data.id,
                                cate: that.ctegorys
                            }
                            axios.post('/dataItem/addcate', categoryAddDTO).then(res => {
                                // console.log(res)
                            });
                            that.menuClick(7);
                            //每次创建完条目后清空category内容
                            that.ctegorys = [];
                            //清空displays内容
                            that.data_img = []


                            $(".prev").click();
                            $(".prev").click();


                            //清空
                            $("#classification").val('')
                            $("#dataname").val('');
                            $("#description").val('');
                            $("#keywords").tagsinput('removeAll');

                            $("#displays").val('');
                            $("#dataresoureurl").val("")
                            $("#contributers").tagsinput('removeAll');
                            $("#coordinateSystem").val("");
                            $("#geographicProjection").val("")
                            $("#coordinateUnits").val("")
                            $("#upperleftx").val("")
                            $("#upperlefty").val("")
                            $("#bottomrightx").val("")
                            $("#bottomrighty").val("");
                            $("#imgFile").val("");

                            that.curIndex = 'none';
                            that.curIndex = '3-1'


                        }
                    })
            }

        },
        next() {

        },
        change(currentIndex, newIndex, stepDirection) {
            console.log(currentIndex, newIndex, stepDirection)
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
        //todo 数据条目的增删操作
        // searchDataItems(){},
        deleteDataitems(id) {

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

        updateDataItems() {
        },
        upload_data(data) {

            this.data_upload_id = data.id;
            var d = this.userName;
            $("#data-author").val(d)


        },
        close() {
            // $(".uploaddataitem").css("visibility","hidden");
            this.data_upload_id = '';
            $("#file-1").val('');
            this.sourceStoreId = ''
        },
        uploadD() {


            if (this.sourceStoreId === '') {
                alert("Please upload the file in to the template first")
            } else {
                var data = {
                    author: this.userId,
                    dataItemId: this.data_upload_id,
                    fileName: $("#fileName").val(),
                    mdlId: "string",
                    sourceStoreId: this.sourceStoreId,
                    suffix: $("#suffix").val(),
                    tags: $("#datatags").tagsinput('items'),
                    type: $("input[name='data_upload_type']:checked").val(),

                }
                var that = this;
                axios.post("http://172.21.213.194:8082/dataResource", data)
                    .then(res => {
                        if (res.status == 200) {
                            alert("data upload success")
                            that.close()
                        }
                    });
            }


        },
        chooseCate(item, e) {
            if ($("#classification").val() != null) {
                $("#classification").val('')
            }
            this.classif.push(e.target.innerText);

            $("#classification").val(this.classif);

            this.ctegorys.push(item.id)

        },

        toDataItem() {
            this.handleSelect('3-2', null);
            this.defaultActive = '3-1';
        },
        toMyData() {
            this.handleSelect('3-3', null);
            this.defaultActive = '3-3';

        },
        downloaddata() {
        },
        dall() {
        },


        //个人空间上传下载管理

        //获得所有数据
        showtitle(ev) {
            return ev.fileName + "\n" + "Type:" + ev.suffix;
        },
        getImg(item) {
            let list=[]
            if(item.id==0||item.package==true)
                return "/static/img/filebrowser/package.jpg"
            if(item.suffix=='unknow')
                return "/static/img/filebrowser/unknow.svg"
            return "/static/img/filebrowser/" + item.suffix + ".svg"
        },
        generateId(key) {
            return key;
        },

        singleClick($event, eval) {
            if(this.rightMenuShow==true){
                this.rightMenuShow=false;
                return
            }
            clearTimeout(this.clickTimeout)
            var target=$event.currentTarget;
            var eval=eval;
            var that=this
            this.clickTimeout = setTimeout(function (){
                that.getid(target, eval)
            },1)

            this.renameIndex='';


        },

        getid(target, eval){
            this.dataid = eval.id;
            console.log(this)
            // target.className = "el-card dataitemisol clickdataitem"

            //再次点击取消选择
            if (this.downloadDataSet.indexOf(eval) > -1) {
                for (var i = 0; i < this.downloadDataSet.length; i++) {
                    if (this.downloadDataSet[i] === eval) {
                        //删除
                        this.downloadDataSet.splice(i, 1)
                        this.downloadDataSetName.splice(i, 1)
                        break
                    }
                }

                // for (var i = 0; i < this.downloadDataSetName.length; i++) {
                //     if (this.downloadDataSetName[i].name === eval.label&&this.downloadDataSetName[i].suffix === eval.suffix) {
                //         //删除
                //         this.downloadDataSetName.splice(i, 1)
                //         console.log(this.downloadDataSetName)
                //         break
                //     }
                // }

            } else {
                this.downloadDataSet.push(eval)
                let obj={
                    name:eval.label,
                    suffix:eval.suffix,
                    package:eval.package,

                }
                this.downloadDataSetName.push(obj)
            }

            if (eval.taskId != null) {
                this.detailsIndex = 2
                this.getOneOfUserTasks(eval.taskId);
            }
        },

        backToPackage() {
            this.detailsIndex = 1;
        },

        getOneOfUserTasks(taskId) {
            $.ajax({
                type: 'GET',
                url: "/task/getTaskByTaskId",
                // contentType:'application/json',

                data:
                    {
                        id: taskId,
                    },
                // JSON.stringify(obj),
                cache: false,
                async: true,
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                success: (json) => {

                    if (json.code != 0) {
                        alert("Please login first!");
                        window.location.href = "/user/login";
                    } else {
                        const data = json.data;
                        this.resourceLoad = false;
                        // this.researchItems = data.list;
                        this.packageContent = data;
                        console.log(this.packageContent)
                    }
                }
            })
        },

        getOneOfUserTasksToList(task,i) {
            $.ajax({
                type: 'GET',
                url: "/task/getTaskByTaskId",
                // contentType:'application/json',

                data:
                    {
                        id: task.taskId,
                    },
                // JSON.stringify(obj),
                cache: false,
                async: true,
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                success: (json) => {

                    if (json.code != 0) {
                        alert("Please login first!");
                        window.location.href = "/user/login";
                    } else {
                        const data = json.data;
                        this.resourceLoad = false;
                        // this.researchItems = data.list;
                        this.packageContentList[i] = data;
                    }
                }
            })
        },

        getSourceId(url){
            return url.split('=')[1]

        },

        userDownload() {
            //todo 依据数组downloadDataSet批量下载

            let sourceId = new Array()

            for (let i = 0; i < this.downloadDataSet.length; i++) {
                sourceId.push(this.getSourceId(this.downloadDataSet[i].url))
                console.log(sourceId)
            }


            if (this.downloadDataSet.length > 0) {

                const keys = sourceId.map(_ => `sourceStoreId=${_}`).join('&');
                let url = "/dataManager/downloadSomeRemote?" + keys;
                let link = document.createElement('a');
                link.style.display = 'none';
                link.href = url;
                // link.setAttribute(item.fileName,'filename.'+item.suffix)

                document.body.appendChild(link)
                link.click();

            } else {
                alert("please select first!!")
            }


        },

        addAllData() {
            let that = this
            axios.get("/dataManager/list", {
                params: {
                    author: this.userId,
                    type: "author"
                }

            })
                .then((res) => {


                    // console.log("oid datas",this.userId,res.data.data)
                    that.databrowser = res.data.data
                    that.alllen = that.databrowser.length
                    that.managerloading = false
                })
        },

        addDataClass($event, item) {
            // this.rightMenuShow = false


            if (this.downloadDataSet.indexOf(item) < 0) {
                $event.currentTarget.className = "el-card dataitemisol dataitemhover"
            }

            this.dataid = item.id


        },

        removeClass($event, item) {


            if (this.downloadDataSet.indexOf(item) > -1) {
                $event.currentTarget.className = "el-card dataitemisol clickdataitem"
            } else {
                $event.currentTarget.className = "el-card dataitemisol"
            }


        },

        //右键菜单

        rightMenu(e,eval,index) {
            e.preventDefault();

            e.currentTarget.className = "el-card dataitemisol clickdataitem"


            var dom = document.getElementsByClassName("browsermenu");

            console.log(e)
            dom[0].style.top = e.pageY - 120 + "px"
            // 125 > window.innerHeight
            //     ? `${window.innerHeight - 127}px` : `${e.pageY}px`;
            dom[0].style.left = e.pageX - 220 + "px";

            this.rightMenuShow = true

            this.rightTargetItem=eval
            this.rightTargetItem.index=index;

        },

        rename(){
            console.log(this.rightTargetItem)
            this.renameIndex=this.rightTargetItem.id;
            this.rightMenuShow = false
            console.log(this.rightTargetItem.label)
            console.log($('.renameFileInput').eq(this.rightTargetItem.index))
            $('.renameFileInput').eq(this.rightTargetItem.index).val(this.rightTargetItem.label);

        },

        renameConfirm(){
            let folderName=[];
            for(let i=0;i<this.myFileShown.length;i++){
                if(this.myFileShown[i].package===true)
                    folderName.push(this.myFileShown[i].label)
            }
            if(folderName.indexOf($('.renameFileInput').eq(this.rightTargetItem.index).val())!=-1)
                alert('this name is existing in this path, please input a new one');
            else{
                this.rightTargetItem.label=$('.renameFileInput').eq(this.rightTargetItem.index).val();
                console.log(this.myFileShown)
                this.updateFileToPortalBack();
            }

        },

        openWzhRightMenu(e,eval) {
            e.preventDefault();

            e.currentTarget.className = "el-card dataitemisol clickdataitem"
            console.log(e)

            var dom = document.getElementsByClassName("wzhRightMenu");

            dom[0].style.top = e.pageY - 250 + "px"
            dom[0].style.left = e.pageX - 230 + "px";
            console.log(e.style)
            $('.wzhRightMenu').animate({height: '120'}, 150);
        },

        //上传
        uploadClick(){

            this.uploadSource=[];
            $('#managerUpload').modal("show");
            $('#manager-upload').fileinput('clear');
            //上传数据相关
            this.uploadDialog=true;
        },

        selectFolder(){
            $('#selectFolder').modal('show')
            this.selectedPath=[];
            axios.get("/user/getFolder",{})
                .then(res=> {
                    let json=res.data;
                    if(json.code==-1){
                        alert("Please login first!")
                        window.sessionStorage.setItem("history", window.location.href);
                        window.location.href="/user/login"
                    }
                    else {
                        this.folderTree=res.data.data;
                        this.selectPathDialog=true;
                    }


                });
        },

        addFolder(){
            let data=this.$refs.folderTree.getCurrentNode();
            let node=this.$refs.folderTree.getNode(data);
            console.log(node);
            let paths=[];
            while(node.key!=undefined&&node.key!=0){
                paths.push(node.key);
                node=node.parent;
            }

            this.$prompt(null, 'Enter Folder Name', {
                confirmButtonText: 'OK',
                cancelButtonText: 'Cancel',
                // inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
                // inputErrorMessage: '邮箱格式不正确'
            }).then(({ value }) => {

                $.ajax({
                    type: "POST",
                    url: "/user/addFolder",
                    data: {paths: paths, name: value},
                    async: true,
                    contentType: "application/x-www-form-urlencoded",
                    success: (json) => {
                        if (json.code == -1) {
                            alert("Please login first!")
                            window.sessionStorage.setItem("history", window.location.href);
                            window.location.href = "/user/login"
                        }
                        else {
                            const newChild = {id: json.data, label: value, children: []};
                            if (!data.children) {
                                this.$set(data, 'children', []);
                            }
                            data.children.push(newChild);
                        }

                    }
                });


            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: 'Cancel'
                });
            });
        },

        confirmFolder(){
            let data=this.$refs.folderTree.getCurrentNode();
            let node=this.$refs.folderTree.getNode(data);

            while(node.key!=undefined&&node.key!=0){
                this.selectedPath.unshift(node);
                node=node.parent;
            }
            this.selectPathDialog=false;

        },

        upload_data_dataManager() {
            console.log(this.fileNames)
            this.fileNames.filter(res=>typeof (res)!="undefined")
            console.log(this.uploadSource)
            console.log($('.file-caption').val())
            if (this.uploadSource.length == 0) {
                alert("Please upload the file into the template first")
            } else {
                for(let i=0;i<this.uploadSource.length;i++){
                    let dataName=this.uploadSource[i].file_name;
                    let dataname7suffix=dataName.split('.')
                    let fileName=dataname7suffix[0]
                    let suffix=dataname7suffix[1]
                    let dataId=this.uploadSource[i].source_store_id;
                    var data = {
                        author: this.userId,

                        fileName: fileName,
                        fromWhere: "PORTAL",
                        mdlId: "string",
                        sourceStoreId: dataId,
                        suffix: suffix,
                        tags: $("#managerFileTags").tagsinput('items'),
                        type: "OTHER"

                    }
                    var that = this;
                    var sucUpload
                    axios.post("http://172.21.212.64:8082/dataResource", data)
                        .then(res => {
                            if (res.status == 200) {

                                that.addAllData()
                                that.close()
                                sucUpload=res.status
                            }
                        });
                }
                this.addDataToPortalBack();


            }

        },

        addDataToPortalBack(){
            let i=this.pathShown.length-1;
            let paths=[]
            while (i>=1) {
                paths.push(this.pathShown[i].id);
                i--;
            }
            let that = this;
            $.ajax({
                type: "POST",
                url: "/user/addFile",
                data: JSON.stringify({
                    files: this.uploadSource,
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
                        for(let i=0;i<this.uploadSource.length;i++)
                        {
                            console.log(this.uploadSource[i].file_name)
                            let dataName7Suffix = this.uploadSource[i].file_name.split('.')
                            const newChild = {
                                id: json.data,
                                label: dataName7Suffix[0],
                                suffix: dataName7Suffix[1],
                                children: [],
                                package: false,
                                upload: true,
                                father: paths[0]
                            };
                            if (this.myFileShown.length === 0)
                                this.addChild(this.myFile, paths[0], newChild)
                            this.myFileShown.push(newChild);
                            console.log(this.myFileShown)
                            // this.getFilePackage();
                            console.log(this.myFile)
                        }
                        this.addFolderIndex = false;
                        this.selectedPath=[];

                    }

                }
            });

            alert('Upload File successfully!')
            $('#managerUpload').modal("hide")

        },

        updateFileToPortalBack(){
            $.ajax({
                type: "POST",
                url: "/user/updateFile",
                data: {
                    dataName:this.rightTargetItem.label,
                    dataId:this.rightTargetItem.id,

                },
                async: true,
                contentType: "application/x-www-form-urlencoded",
                success: (json) => {
                    if (json.code == -1) {
                        alert("Please login first!")
                        window.sessionStorage.setItem("history", window.location.href);
                        window.location.href = "/user/login"
                    } else {
                        // const newChild = {id: json.data, label: dataName7Suffix[0],suffix:dataName7Suffix[1], children: [],package:false, father:paths[0]};
                        // if(this.myFileShown.length===0)
                        //     this.addChild(this.myFile,paths[0],newChild)
                        // this.myFileShown.push(newChild);
                        console.log(this.myFileShown)
                        // this.getFilePackage();
                        console.log(this.myFile)
                        this.addFolderIndex=false;

                    }

                }
            });
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

        closeAndClear(){

        },

        handleCloseandInit(done) {
            console.log(done)
            this.$confirm('Are you sure to close？')
                .then(_ => {
                    for(let i=0;i<$('.treeLi').length;i++) {
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
            // this.allFileTaskSharingVisible=false
        },


        //下载
        download_data_dataManager() {

            for (let i = 0; i < this.databrowser.length; i++) {
                if (this.databrowser[i].id === this.dataid) {
                    var item = this.databrowser[i];
                    break;
                }
            }


            if (item != null) {
                let url = "/dataManager/downloadRemote?&sourceStoreId=" + item.sourceStoreId;
                let link = document.createElement('a');
                link.style.display = 'none';
                link.href = url;
                // link.setAttribute(item.fileName,'filename.'+item.suffix)

                document.body.appendChild(link)
                link.click();

            } else {
                this.$message('please select file first!!');
            }


        },

        right_download(){
            let url=this.rightTargetItem.url
            window.location.href=url
            this.rightMenuShow=false;
        },

        //删除
        delete_data_dataManager() {

            if (confirm("Are you sure to delete?")) {
                let tha = this
                axios.delete("/dataManager/delete", {
                    params: {
                        id: tha.dataid
                    }
                }).then((res) => {


                    if (res.data.msg === "成功") {
                        //删除双向绑定的数组
                        tha.rightMenuShow = false
                        tha.databrowser = []
                        tha.addAllData()
                        alert("delete successful")

                    }

                })
            } else {
                alert("ok")
            }


        },

        right_deleteFile(){
            const h = this.$createElement;
            this.$msgbox({
                title: ' ',
                message: h('p', null, [
                    h('span', { style: 'font-size:15px' }, 'All of the content will be deleted.'),
                    h('br'),
                    h('span', null, 'Are you sure to '),
                    h('span', { style: 'color: #e6a23c;font-weight:600' }, 'continue'),
                    h('span', null, '?'),
                ]),
                type:'warning',
                showCancelButton: true,
                confirmButtonText: 'confirm',
                cancelButtonText: 'cancel',
                beforeClose: (action, instance, done) => {

                    if (action === 'confirm') {
                        instance.confirmButtonLoading = true;
                        instance.confirmButtonText = 'deleting...';
                        setTimeout(() => {
                            $.ajax({
                                type: "POST",
                                url: "/user/deleteFile",
                                data: {dataId: this.rightTargetItem.id},
                                async: true,
                                contentType: "application/x-www-form-urlencoded",
                                success: (json) => {
                                    if (json.code == -1) {
                                        alert("Please login first!")
                                        window.sessionStorage.setItem("history", window.location.href);
                                        window.location.href = "/user/login"
                                    } else {
                                        this.myFileShown.splice(this.rightTargetItem.index, 1);
                                        // this.rightTargetItem=null;

                                    }

                                }
                            });
                            done();
                            setTimeout(() => {
                                instance.confirmButtonLoading = false;
                            }, 300);
                        }, 300);
                    } else {
                        done();
                    }
                }
            }).then(action => {
                this.rightMenuShow=false
                this.$message({
                    type: 'success',
                    message: 'delete successful '
                });
            });

        },

        showsearchresult(data) {

            //动态创建DOM节点

            for (let i = 0; i < this.databrowser.length; i++) {
                //匹配查询字段
                if (this.databrowser[i].fileName.toLowerCase().indexOf(data.toLowerCase()) > -1) {
                    //插入查找到的card

                    //card
                    let searchresultcard = document.createElement("div");
                    searchresultcard.classList.add("el-card");
                    searchresultcard.classList.add("dataitemisol");
                    searchresultcard.classList.add("is-never-shadow");
                    searchresultcard.classList.add("sresult");


                    //cardbody
                    let secardbody = document.createElement("div");
                    secardbody.classList.add("el-card__body");
                    //card里添加cardbody
                    searchresultcard.appendChild(secardbody);

                    //el-row1
                    let cardrow1 = document.createElement("div");
                    cardrow1.classList.add("el-row");
                    secardbody.appendChild(cardrow1);

                    //3个div1
                    //div1
                    let div1 = document.createElement("div");
                    div1.classList.add("el-col");
                    div1.classList.add("el-col-6");

                    let text1 = document.createTextNode(" ");
                    div1.appendChild(text1);

                    cardrow1.appendChild(div1)

                    //div2
                    let div2 = document.createElement("div");
                    div2.classList.add("el-col");
                    div2.classList.add("el-col-12");

                    let img = document.createElement("img");
                    img.src = "/static/img/filebrowser/" + this.databrowser[i].suffix + ".svg";

                    img.style.height = '60%';
                    img.style.width = '100%';
                    img.style.marginLeft = '30%';

                    div2.appendChild(img);

                    cardrow1.appendChild(div2)

                    //div3
                    let div3 = document.createElement("div");
                    div3.classList.add("el-col");
                    div3.classList.add("el-col-6");

                    let text2 = document.createTextNode(" ");
                    div3.appendChild(text2);

                    cardrow1.appendChild(div3);


                    //el-row2
                    let cardrow2 = document.createElement("div");
                    cardrow2.classList.add("el-row");
                    secardbody.appendChild(cardrow2);

                    //3个div2
                    //div4
                    let div4 = document.createElement("div");
                    div4.classList.add("el-col");
                    div4.classList.add("el-col-2");

                    let text3 = document.createTextNode(" ");
                    div4.appendChild(text3);

                    cardrow2.appendChild(div4)

                    //div5
                    let div5 = document.createElement("div");
                    div5.classList.add("el-col");
                    div5.classList.add("el-col-20");

                    let p = document.createElement("p");
                    div5.appendChild(p);

                    let filenameandtype = document.createTextNode(this.databrowser[i].fileName + '.' + this.databrowser[i].suffix);
                    p.appendChild(filenameandtype)

                    cardrow2.appendChild(div5)

                    //div6
                    let div6 = document.createElement("div");
                    div6.classList.add("el-col");
                    div6.classList.add("el-col-20");

                    let text4 = document.createTextNode(" ");
                    div6.appendChild(text4);

                    cardrow2.appendChild(div6)

                    //往contents里添加card
                    document.getElementById("browsercont").appendChild(searchresultcard);

                    //DOM2级事件绑定

                    // searchresultcard.addEventListener('click',()=>{
                    //    //点击赋值id
                    //     this.dataid=i;
                    // });
                    searchresultcard.click(function () {
                        this.dataid = this.databrowser[i].id;
                    })

                }
            }
        },

        category(data) {

            for (let j = 0; j < data.length; j++) {
                for (let i = 0; i < this.databrowser.length; i++) {
                    //匹配查询字段
                    if (this.databrowser[i].suffix.toLowerCase().indexOf(data[j].toLowerCase()) > -1) {
                        //插入查找到的card

                        //card
                        let searchresultcard = document.createElement("div");
                        searchresultcard.classList.add("el-card");
                        searchresultcard.classList.add("dataitemisol");
                        searchresultcard.classList.add("is-never-shadow");
                        searchresultcard.classList.add("sresult");


                        //cardbody
                        let secardbody = document.createElement("div");
                        secardbody.classList.add("el-card__body");
                        //card里添加cardbody
                        searchresultcard.appendChild(secardbody);

                        //el-row1
                        let cardrow1 = document.createElement("div");
                        cardrow1.classList.add("el-row");
                        secardbody.appendChild(cardrow1);

                        //3个div1
                        //div1
                        let div1 = document.createElement("div");
                        div1.classList.add("el-col");
                        div1.classList.add("el-col-6");

                        let text1 = document.createTextNode(" ");
                        div1.appendChild(text1);

                        cardrow1.appendChild(div1)

                        //div2
                        let div2 = document.createElement("div");
                        div2.classList.add("el-col");
                        div2.classList.add("el-col-12");

                        let img = document.createElement("img");
                        img.src = "/static/img/filebrowser/" + this.databrowser[i].suffix + ".svg";

                        img.style.height = '60%';
                        img.style.width = '100%';
                        img.style.marginLeft = '30%';

                        div2.appendChild(img);

                        cardrow1.appendChild(div2)

                        //div3
                        let div3 = document.createElement("div");
                        div3.classList.add("el-col");
                        div3.classList.add("el-col-6");

                        let text2 = document.createTextNode(" ");
                        div3.appendChild(text2);

                        cardrow1.appendChild(div3);


                        //el-row2
                        let cardrow2 = document.createElement("div");
                        cardrow2.classList.add("el-row");
                        secardbody.appendChild(cardrow2);

                        //3个div2
                        //div4
                        let div4 = document.createElement("div");
                        div4.classList.add("el-col");
                        div4.classList.add("el-col-2");

                        let text3 = document.createTextNode(" ");
                        div4.appendChild(text3);

                        cardrow2.appendChild(div4)

                        //div5
                        let div5 = document.createElement("div");
                        div5.classList.add("el-col");
                        div5.classList.add("el-col-20");

                        let p = document.createElement("p");
                        div5.appendChild(p);

                        let filenameandtype = document.createTextNode(this.databrowser[i].fileName + '.' + this.databrowser[i].suffix);
                        p.appendChild(filenameandtype)

                        cardrow2.appendChild(div5)

                        //div6
                        let div6 = document.createElement("div");
                        div6.classList.add("el-col");
                        div6.classList.add("el-col-20");

                        let text4 = document.createTextNode(" ");
                        div6.appendChild(text4);

                        cardrow2.appendChild(div6)

                        //往contents里添加card
                        document.getElementById("browsercont").appendChild(searchresultcard);

                        //DOM2级事件绑定

                        // searchresultcard.addEventListener('click',()=>{
                        //    //点击赋值id
                        //     this.dataid=i;
                        // });
                        searchresultcard.click(function () {
                            this.dataid = this.databrowser[i].id;
                        })

                    }
                }
            }

        },


        share() {
            for (let i = 0; i < this.right.length; i++) {
                if (this.databrowser[i].id === this.dataid) {
                    var item = this.databrowser[i];
                    break;
                }
            }


            if (item != null) {
                let url = "/dataManager/downloadRemote?&sourceStoreId=" + item.sourceStoreId;
                this.$alert("<input style='width: 100%' value=" + url + ">", {
                    dangerouslyUseHTMLString: true
                })
                // this.dataid='';

            } else {
                // console.log("从后台获取数据条目数组有误")
                this.$message('please select file first!!');
            }
        },

        right_share(){
            let url=this.rightTargetItem.url;
            this.$alert("<input style='width: 100%' value=" + url + ">", {
                dangerouslyUseHTMLString: true
            })
        },
        //todo 数据找模型
        relatedModels_dataManager() {


        },
        keywordsSearch() {
            if (this.searchcontent === "") {
                this.addAllData()
            } else {
                this.dataManagerSe(this.searchcontent)

            }


        },
        dataManagerSe(val) {
            let that = this
            this.loading = true
            axios.get("/dataManager/keywordsSearch", {
                params: {
                    id: that.userId,
                    words: val

                }
            })
                .then((res) => {
                    if (res.status === 200) {
                        that.databrowser = res.data.data.data
                        that.loading = false
                    }
                })

        },
        findAllFiles() {

            this.addAllData()


        },

        findPics() {


            let that = this
            this.loading = true
            axios.get("/dataManager/managerPics", {
                params: {
                    id: that.userId,


                }
            })
                .then((res) => {
                    if (res.status === 200) {
                        that.databrowser = res.data.data.data
                        that.loading = false
                    }
                })
        },
        findDocs() {


            let that = this
            this.loading = true
            axios.get("/dataManager/managerDoc", {
                params: {
                    id: that.userId,


                }
            })
                .then((res) => {
                    if (res.status === 200) {
                        that.databrowser = res.data.data.data
                        that.loading = false
                    }
                })

        },

        findOtherFiles() {

            let that = this
            this.loading = true
            axios.get("/dataManager/managerOhr", {
                params: {
                    id: that.userId,


                }
            })
                .then((res) => {
                    if (res.status === 200) {
                        that.databrowser = res.data.data.data
                        that.loading = false
                    }
                })
        },

        checkOutput(modelId, taskId) {
            window.open('/task/output/' + modelId + '&' + taskId);
        },

        // initDataTree(){
        //     this.dataForm[0].label='My uploaded data';
        //     this.dataForm[0].
        //     this.dataForm[1].label='Output data';
        //     this.dataForm[2].label='Fork Data';
        // }


    },

    watch(){

    },

    created() {
        this.getArticleResult();
        this.getTasks();
    },
    mounted() {

        // this.initDataTree()


        $("#title").text("User Space")

        $('.dropdown-toggle').dropdown()

        //模态框
        $('#myModal').modal({
            keyboard: false,
            backdrop: true,
            show: false,
        })
        $('#myModal1').modal({
            keyboard: false,
            backdrop: true,
            show: false,
        })

        $("#articleAuthor").tagEditor({
            forceLowercase: false
        })

        $("#articleAuthorEdit").tagEditor({
            forceLowercase: false
        })

        $("#edit").click(() => {
            $.ajax({
                url: "/user/getUser",
                type: "get",
                data: {oid: this.userId},
                async: false,
                success: (json) => {

                    console.log("u" + json);
                    let data = json.data;
                    if (data.image != "" && data.image != null) {
                        $("#photo").attr("src", data.image);
                    } else {
                        $("#photo").attr("src", "../static/img/icon/default.png");
                    }
                    $("#inputName").val(data.name);
                    $("#inputPhone").val(data.phone);
                    $("#inputHomePage").val(data.wiki);
                    $("#inputDescription").val(data.description);

                    if (data.organizations != null && data.organizations.length != 0) {
                        $("#inputOrganizations").tagEditor("destroy");
                        $('#inputOrganizations').tagEditor({
                            initialTags: data.organizations,
                            forceLowercase: false,
                            placeholder: 'Enter Organizations ...'
                        });
                    } else {
                        $("#inputOrganizations").tagEditor("destroy");
                        $('#inputOrganizations').tagEditor({
                            initialTags: [],
                            forceLowercase: false,
                            placeholder: 'Enter Organizations ...'
                        });
                    }
                    if (data.subjectAreas != null && data.subjectAreas.length != 0) {
                        $("#inputSubjectAreas").tagEditor("destroy");
                        $('#inputSubjectAreas').tagEditor({
                            initialTags: data.subjectAreas,
                            forceLowercase: false,
                            placeholder: 'Enter Subject Areas ...'
                        });
                    } else {
                        $("#inputSubjectAreas").tagEditor("destroy");
                        $('#inputSubjectAreas').tagEditor({
                            initialTags: [],
                            forceLowercase: false,
                            placeholder: 'Enter Subject Areas ...'
                        });
                    }
                    $('#myModal').modal('show');
                }
            });

        })

        $("#saveUser").click(() => {
            $("#saveUser").attr("disabled", "disabled");
            let userUpdate = {};
            userUpdate.oid = this.userId;
            userUpdate.name = $("#inputName").val().trim();
            userUpdate.phone = $("#inputPhone").val().trim();
            userUpdate.wiki = $("#inputHomePage").val().trim();
            userUpdate.description = $("#inputDescription").val().trim();
            userUpdate.organizations = $("#inputOrganizations").val().split(",");
            userUpdate.subjectAreas = $("#inputSubjectAreas").val().split(",");
            userUpdate.uploadImage = $("#photo").get(0).src;

            $.ajax({
                url: "/user/update",
                type: "POST",
                async: true,
                contentType: "application/json",
                data: JSON.stringify(userUpdate),
                success: function (result) {
                    $("#saveUser").removeAttr("disabled");
                    alert("update successfully!")
                    window.location.reload();
                }
            });
        })

        $("#changePass").click(() => {
            $('#myModal1').modal('show');
        })

        $("#submitPass").click(() => {
            let oldPass = $("#inputOldPass").val();
            let newPass = $("#inputPassword").val();
            let newPassAgain = $("#inputPassAgain").val();
            if (oldPass == "") {
                alert("Please enter old password!")
                return;
            } else if (newPass == "") {
                alert("Please enter new password!")
                return;
            } else if (newPassAgain == "") {
                alert("Please confirm new password!")
                return;
            } else if (newPass != newPassAgain) {
                alert("Password and Confirm Password are inconsistent!")
                return;
            }

            let data = {};
            data.oldPass = oldPass;
            data.newPass = newPass;

            $.ajax({
                url: "/user/changePassword",
                type: "POST",
                async: false,
                data: data,
                success: function (result) {
                    if (result.code == -1) {
                        alert("Please login first!")
                        //window.location.href="/user/login";
                    } else {
                        let data = result.data;
                        if (data == 1) {
                            alert("Change password successfully!")
                            window.location.href = "/user/login";

                        } else {
                            alert("Old password is not correct!");
                        }
                    }
                },
                error: function (result) {
                    alert("Change password error!")

                }
            });
        })

        $('#inputOrganizations').tagEditor({
            forceLowercase: false
        });

        $('#inputSubjectAreas').tagEditor({
            forceLowercase: false
        });


        var tha = this

        axios.get("/dataItem/createTree")
            .then(res => {
                tha.tObj = res.data;
                for (var e in tha.tObj) {
                    var a = {
                        key: e,
                        value: tha.tObj[e]
                    }
                    if (e != 'Data Resouces Hubs') {
                        tha.categoryTree.push(a);
                    }


                }

            })


        var that = this;

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
                        if (index != null && index != undefined && index != "" && index != NaN) {
                            this.defaultActive = index;
                            this.handleSelect(index, null);
                            window.sessionStorage.removeItem("index");

                        } else {
                            this.menuClick(1);
                        }

                        window.sessionStorage.removeItem("tap");
                        //this.getTasksInfo();
                        this.load = false;
                    }
                }
            })


            //this.getModels();
        });


        //managerUpload

        $("#managerUpload").fileinput({
            theme: 'fas',
            uploadUrl: 'http://172.21.213.194:8082/file/upload/store_dataResource_files', // /file/apk_upload   you must set a valid URL here else you will get an error
            overwriteInitial: false,
            uploadAsync: true, //默认异步上传,
            showUpload: true, //是否显示上传按钮
            showRemove: true, //显示移除按钮
            showPreview: true, //是否显示预览
            showCaption: false,//是否显示标题
            browseClass: "btn btn-primary", //按钮样式

            maxFileSize: 10000,
            maxFilesNum: 10,
            enctype: 'multipart/form-data',
            validateInitialCount: true,
            msgFilesTooMany: "选择上传的文件数量({n}) 超过允许的最大数值{m}！",
            //allowedFileTypes: ['image', 'video', 'flash'],
            slugCallback: function (filename) {
                return filename.replace('(', '_').replace(']', '_');
            }
        }).on('filepreupload', function (event, data, previewId, index) {     //上传中
            // console.log('文件正在上传');
        }).on("fileuploaded", function (event, data, previewId, index) {    //一个文件上传成功
            var form = data.form, files = data.files, extra = data.extra,
                response = data.response, reader = data.reader;
            if (response != null) {
                // alert("数据上传成功")
            }
            //get dataResource add sourceStoreId
            that.sourceStoreId = response.data;
            // console.log(response);//打印出返回的json
            // console.log(response.status);//打印出路径


        }).on('fileerror', function (event, data, msg) {  //一个文件上传失败
            // console.log('文件上传失败！'+data.status);
        });


        //上传数据相关
        $("#file-1").fileinput({
            theme: 'fas',
            uploadUrl: 'http://172.21.213.194:8082/file/upload/store_dataResource_files', // /file/apk_upload   you must set a valid URL here else you will get an error
            overwriteInitial: false,
            uploadAsync: true, //默认异步上传,
            showUpload: true, //是否显示上传按钮
            showRemove: true, //显示移除按钮
            showPreview: true, //是否显示预览
            showCaption: false,//是否显示标题
            browseClass: "btn btn-primary", //按钮样式

            maxFileSize: 10000,
            maxFilesNum: 10,
            enctype: 'multipart/form-data',
            validateInitialCount: true,
            msgFilesTooMany: "选择上传的文件数量({n}) 超过允许的最大数值{m}！",
            //allowedFileTypes: ['image', 'video', 'flash'],
            slugCallback: function (filename) {
                return filename.replace('(', '_').replace(']', '_');
            }
        }).on('filepreupload', function (event, data, previewId, index) {     //上传中
            // console.log('文件正在上传');
        }).on("fileuploaded", function (event, data, previewId, index) {    //一个文件上传成功
            var form = data.form, files = data.files, extra = data.extra,
                response = data.response, reader = data.reader;
            if (response != null) {
                // alert("数据上传成功")
            }
            //get dataResource add sourceStoreId
            that.sourceStoreId = response.data;
            // console.log(response);//打印出返回的json
            // console.log(response.status);//打印出路径


        }).on('fileerror', function (event, data, msg) {  //一个文件上传失败
            // console.log('文件上传失败！'+data.status);
        });

        $("#file-2").fileinput({
            theme: 'fas',
            uploadUrl: 'http://172.21.213.194:8082/file/upload/store_dataResource_files', // /file/apk_upload   you must set a valid URL here else you will get an error
            overwriteInitial: false,
            uploadAsync: true, //默认异步上传,
            showUpload: true, //是否显示上传按钮
            showRemove: true, //显示移除按钮
            showPreview: true, //是否显示预览
            showCaption: false,//是否显示标题
            browseClass: "btn btn-primary", //按钮样式

            maxFileSize: 10000,
            maxFilesNum: 10,
            enctype: 'multipart/form-data',
            validateInitialCount: true,
            msgFilesTooMany: "选择上传的文件数量({n}) 超过允许的最大数值{m}！",
            //allowedFileTypes: ['image', 'video', 'flash'],
            slugCallback: function (filename) {
                return filename.replace('(', '_').replace(']', '_');
            }
        }).on('filepreupload', function (event, data, previewId, index) {     //上传中
            // console.log('文件正在上传');
        }).on("fileuploaded", function (event, data, previewId, index) {    //一个文件上传成功
            var form = data.form, files = data.files, extra = data.extra,
                response = data.response, reader = data.reader;
            if (response != null) {
                // alert("数据上传成功")
            }
            //get dataResource add sourceStoreId
            that.sourceStoreId = response.data;


            // console.log(response);//打印出返回的json
            // console.log(response.status);//打印出路径


        }).on('fileerror', function (event, data, msg) {  //一个文件上传失败
            // console.log('文件上传失败！'+data.status);
        });


        //上传数据相关
        $("#manager-upload").fileinput({

            theme: 'fas',
            uploadUrl: 'http://172.21.212.64:8082/file/upload/store_dataResource_files', // /file/apk_upload   you must set a valid URL here else you will get an error
            overwriteInitial: false,
            uploadAsync: true, //默认异步上传,
            showUpload: true, //是否显示上传按钮
            showRemove: true, //显示移除按钮
            showPreview: true, //是否显示预览
            showCaption: true,//是否显示标题
            browseClass: "btn btn-primary", //按钮样式
            maxFileSize: 50000,
            maxFilesNum: 10,
            enctype: 'multipart/form-data',
            validateInitialCount: true,
            msgFilesTooMany: "You have chosen ({n}) files, more than {m} files！",
            //allowedFileTypes: ['image', 'video', 'flash'],
            slugCallback: function (filename) {
                return filename.replace('(', '_').replace(']', '_');
            }
        }).on('filepreupload', function (event, data, previewId, index) {//上传中
            console.log(data)
            // console.log('文件正在上传');
        }).on("fileuploaded", function (event, data, previewId, index) {
            console.log(data)//一个文件上传成功
            var form = data.form, files = data.files, extra = data.extra,fileNames=data.filenames
            response = data.response, reader = data.reader;

            if (response != null) {
                // alert("数据上传成功")
            }
            //get dataResource add sourceStoreId

            // console.log(that.fileNames)
            // that.fileNames.push(fileName)
            that.uploadSource.push(response.data);
            // console.log(response);//打印出返回的json
            // console.log(that.uploadSource);


        }).on('fileerror', function (event, data, msg) {  //一个文件上传失败
            // console.log('文件上传失败！'+data.status);
        });


        $('#tree').treeview({data: this.getTree()});

        $('#tree').on('nodeSelected', function (event, data) {
            var parent = $('#tree').treeview('getNode', data.parentId);
            if ($("#classification").val() != null) {
                $("#classification").val('')
            }
            that.classif.push(data.text);

            $("#classification").val(that.classif);
        });

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
                        if ($("#dataname").val().length == 0 || that.classif.length == 0 || $("#keywords").tagsinput('items').length == 0) {
                            alert('Attention:Please complete data information!');
                            return false;
                        } else {
                            return true;
                        }

                    }
                }

                if (currentIndex === 1) {
                    if (stepDirection === "forward") {
                        if ($("#description").val().length == 0) {
                            alert('Attention:Please complete data information!');
                            return false;
                        } else {
                            return true;
                        }

                    }
                }

            }
        });

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

                that.data_img.push(e.target.result)

            }
        });


        //authorship
        $(document).on("click", ".author_close", function () {
            $(this).parents(".panel").eq(0).remove();
        });


        //作者添加
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

        $(document).on("keyup", ".username", function () {

            if ($(this).val()) {
                $(this).parents('.panel').eq(0).children('.panel-heading').children().children().html($(this).val());
            } else {
                $(this).parents('.panel').eq(0).children('.panel-heading').children().children().html("NEW");
            }
        })

    }
});
//http://localhost:8082/file/upload/store_dataResource_files
//http://localhost:8082/file/apk_upload
$(function () {


    //数据项点击样式事件
    $(".filecontent .el-card").on('click', function (e) {

        $(".filecontent .browsermenu").hide();

        $(this).addClass("clickdataitem");


        $(this).siblings().removeClass("clickdataitem");

    });

    //数据项右键菜单事件
    $(".filecontent .el-card").contextmenu(function (e) {

        e.preventDefault();


        $(".browsermenu").css({
            "left": e.pageX,
            "top": e.pageY
        }).show();


    });

    //下载全部按钮为所有数据项添加样式事件
    $(".dall").click(function () {
        $(".dataitemisol").addClass("clickdataitem")


    });

    //搜索结果样式效果和菜单事件
    $("#browsercont").on('click', function (e) {

        $(".el-card.dataitemisol.is-never-shadow.sresult").click(function () {
            $(this).addClass("clickdataitem");

            $(this).siblings().removeClass("clickdataitem");

        });


        $(".el-card.dataitemisol.is-never-shadow.sresult").contextmenu(function () {

            $(".browsermenu").css({
                "left": e.pageX,
                "top": e.pageY,
            }).show();

        })

        //光标移入输入框隐藏数据项右键菜单
        $("#searchinput").on("mouseenter", function () {
            // $(".browsermenu").hide();
        });
    });
    //
    // $('.fileTemplate').click((e) => {
    //     $('.wzhRightMenu').animate({height: '0'}, 50);
    //     if(vue.rightMenuShow==true)
    //         vue.rightMenuShow=false
    //     if(vue.renameIndex!='')
    //         vue.renameIndex=''
    //     console.log($('.fileTemplate').children().not('#browsercont'))
    //     console.log($('.fileTemplate').children())
    //     console.log($('.fileTemplate'))
    //     console.log(e.currentTarget)
    // })

    $('.fileTemplate').on('click',':not(.wzhMicroInput)',function (e) {

        e.stopPropagation();
        if(vue.rightMenuShow==true)
            vue.rightMenuShow=false
        if(e.currentTarget.className.indexOf('renameContainer')==-1&&vue.renameIndex!=''){
            console.log(e.currentTarget.className)
            vue.renameIndex=''
        }
    })

    $('.wzhMicroInput').click(
        function(event){
            event.stopPropagation();
        }
    )


    var value = 0

    $("#refreshPackageBtn").click(
        function () {
            value += 180;
            $('.fa-refresh').rotate({animateTo: value})
        }
    );


    $('#backFatherBtn').click(
        ()=>{
            console.log('11')
            $('.fa-arrow-left').animate({marginLeft:'-6px'},175)
            $('.fa-arrow-left').animate({marginLeft:'0'},175)
        }
    )

    $('.el-input__inner').click(
        ()=>{
            console.log($(this))
        }
    )

})

