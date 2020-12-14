var vue = new Vue({
    el: "#app",
    components: {
        'avatar': VueAvatar.Avatar
    },
    data: function () {
        return {
            //log用于计数
            log_model: 0,
            log_data: 0,
            log_application: 0,
            log_info: 0,
            log_theme:0,
            form: {
                name: '',
            },

            tabledata_get: "",
            categoryname: [],
            categorynameModel:[],
            categorynameData:[],
            categorynameApplication:[],

            theme_oid: "",

            model_num: 0,
            data_num: 0,
            mnum: 0,
            mcnum: 0,
            dnum: 0,
            dcnum: 0,
            sub_detail: '',
            editableTabsValue_model: '1',
            editableTabsValue_data: '1',
            editableTabsValue_applications: '1',
            editableTabs_model: [{
                id: "1",
                tabledata: [],
                //tabledata:[],
                title: 'Tab 1',
                name: '1',
                content: '1'
            }],
            tabledataflag: 0,
            tabledataflag1: 0,
            //用作改变title时的计数
            tableflag1: 0,
            tableflag2: 0,
            tableflag3: 0,

            editableTabs_data: [{
                id: "1",
                tabledata: [],
                title: 'Tab 1',
                name: '1',
                content: 'Tab 1 content'
            }],
            editableTabs_applications: [{
                id: "1",
                title: 'Tab 1',
                name: '1',
                content: 'Tab 1 content'
            }],
            tabIndex_model: 1,
            tabIndex_data: 1,
            tabIndex_application: 1,
            //定义存储从前端获取的数据，用于与后台进行传输
            themeObj: {
                classinfo: [{
                    id: "1",
                    mcname: "",
                    modelsoid: [],
                }],
                dataClassInfo: [{
                    id: "1",
                    dcname: '',
                    datasoid: [],
                }],
                application: [{
                    id: "1",
                    applicationname: '',
                    applicationlink: '',
                    application_image: '',
                    upload_application_image: '',
                }]
            },

            themeVersion: {
                modifierClass: [{
                    oid: "",
                    userName: '',
                    name: ''
                }],
                subDetails: [{
                    detail: '',
                    // time后台设置
                    // status: '',后台确定
                    // formatTime:'',后台设置
                    // Class<Check> checkClass;后台处理设置
                }],
                subClassInfos: [{
                    // modify_time后台设置
                    // status: '',后台确定
                    // formatTime:'',后台设置
                    mcname: '',
                    models: [{
                        model_oid: '',
                        model_name: '',
                    }]
                    // Class<Check> checkClass;后台处理设置
                }],
                subDataInfos: [{
                    // modify_time后台设置
                    // status: '',后台确定
                    // formatTime:'',后台设置
                    dcname: '',
                    data: [{
                        data_oid: '',
                        data_name: '',
                    }]
                    // Class<Check> checkClass;后台处理设置
                }],
                subApplications: [{
                    // modify_time后台设置
                    // status: '',后台确定
                    // formatTime:'',后台设置
                    // Class<Check> checkClass;后台处理设置
                    applicationname: '',
                    applicationlink: '',
                    application_image: '',
                    upload_application_image: ''
                }]
            },
            modelClassInfos: [],
            dataClassInfos: [],

            oidnumber: 0,
            numOfModelPerRow: 5,
            classarr: [],
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

            defaultActive: '5',
            curIndex: '5',

            ScreenMaxHeight: "0px",
            IframeHeight: "0px",
            editorUrl: "",
            load: false,


            ScreenMinHeight: "0px",

            userId: "",
            userName: "",
            loginFlag: false,
            activeIndex: 5,

            userInfo: {
                //username:"",
                name: "",
                email: "",
                phone: "",
                insName: ""
            },
            defaultProps: {},
            cls: [],
            clsStr: '',
            model_num1: 1,

            defaultActive: '1',
            dialogVisible: false,
            dialogVisible1: false,
            dialogVisible2: false,
            dialogVisible3: false,
            form: {
                name: '',
                region: '',
                date1: '',
                date2: '',
                delivery: false,
                type: [],
                resource: '',
                desc: ''
            },
            editThemeActive: 0,
            isCollapse: false,
            // drawer: false,
            // direction: 'rtl',
            maintainer:[],
        }
    },
    methods: {
        //获取message_confirm页面
        getmessagepage() {
            console.log("ok");
            window.location.href = "/theme/getmessagepage/" + this.themeoid;
        },

        modelClass_add() {
            this.mcnum++;
            this.tableflag1++;
            this.tabledataflag++;
            // $("#categoryname").attr('id','categoryname_past');//改变当前id名称


            $(".el-tabs__new-tab").eq(0).click();
        },
        dataClass_add() {
            // this.themeObj.dataClassInfo[this.dcnum].dcname = $("#categoryname2"+this.tableflag2).val();

            this.dcnum++;
            this.tableflag2++;
            this.tabledataflag1++;

            $(".el-tabs__new-tab").eq(1).click();
        },
        Application_add() {
            $(".el-tabs__new-tab").eq(2).click();
        },
        handleTabsEdit_model(targetName, action) {
            if (action === 'add') {
                let newTabName = ++this.tabIndex_model + '';
                this.themeObj.classinfo.push({
                    id: newTabName,
                    mcname: "",
                    modelsoid: [],
                });
                // this.idflag = newTabName;
                this.editableTabs_model.push({
                    id: newTabName,
                    tabledata: [],
                    title: 'New Tab',
                    name: newTabName,
                    content: '2'
                });
                this.editableTabsValue_model = newTabName + '';

            }
            if (action === 'remove') {

                // this.tabIndex_model--;
                // let last_tab = $(".el-tabs__item").last();
                // console.log(last_tab);
                // this.tab_dele_num_model++;
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

                let num;
                for (i = 0; i < this.themeObj.classinfo.length; i++) {
                    if (this.themeObj.classinfo[i].id == targetName) {
                        num = i;
                        break;
                    }
                }
                // delete this.themeObj.classinfo[num];//将存入到themeObj中的数据也移除
                this.themeObj.classinfo.splice(num, 1);
            }
        },
        handleTabsEdit_data(targetName, action) {
            // this.confirmflag1 = 0;

            if (action === 'add') {
                let newTabName = ++this.tabIndex_data + '';
                // this.idflag = newTabName;
                this.themeObj.dataClassInfo.push({
                    id: newTabName,
                    // id:"",
                    dcname: "",
                    datasoid: [],
                });
                this.editableTabs_data.push({
                    id: newTabName,
                    tabledata: [],
                    title: 'New Tab',
                    name: newTabName,
                    content: 'New Tab content'
                });
                this.editableTabsValue_data = newTabName;
            }
            if (action === 'remove') {
                // this.tab_dele_num_data++;
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

                let num;
                for (i = 0; i < this.themeObj.dataClassInfo.length; i++) {
                    if (this.themeObj.dataClassInfo[i].id == targetName) {
                        num = i;
                        break;
                    }
                }
                // if (this.themeObj.dataClassInfo.id)
                // delete this.themeObj.classinfo[num];//将存入到themeObj中的数据也移除,这种方式不行，只是将元素置为undefine
                this.themeObj.dataClassInfo.splice(num, 1);
            }
        },
        handleTabsEdit_applications(targetName, action) {
            if (action === 'add') {
                let newTabName = ++this.tabIndex_application + '';
                this.themeObj.application.push({
                    id: newTabName,
                    applicationname: '',
                    applicationlink: '',
                    application_image: '',
                    upload_application_image: '',
                })

                this.editableTabs_applications.push({
                    id: newTabName,
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


                let num;
                for (i = 0; i < this.themeObj.application.length; i++) {
                    if (this.themeObj.application[i].id == targetName) {
                        num = i;
                        break;
                    }
                }
                this.themeObj.application.splice(num, 1);
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
            // val--;
            this.pageOption1.currentPage = val;

            this.search1();
        },
        handlePageChange2(val) {
            this.pageOption2.currentPage = val;
            this.search2();
        },
        search1() {
            this.relateType = "modelItem";
            if (this.pageOption1.currentPage == 0) {
                this.pageOption1.currentPage++;
            }
            var data = {
                asc: this.pageOption1.sortAsc,

                page: this.pageOption1.currentPage - 1,
                pageSize: this.pageOption1.pageSize,
                searchText: this.relateSearch,
                sortType: "default",
                classifications: ["all"],
            };
            let url, contentType;
            url = "/" + this.relateType + "/list";
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
        // aaa(item){
        //     window.location.href='/profile/'+item.name
        // },
        search2() {
            this.relateType = "dataItem";
            if (this.pageOption2.currentPage == 0) {
                this.pageOption2.currentPage++;
            }
            ;
            var data = {
                asc: this.pageOption2.sortAsc,
                page: this.pageOption2.currentPage - 1,
                pageSize: this.pageOption2.pageSize,
                searchText: this.relateSearch,
                sortType: "default",
                classifications: ["all"],
                dataType:"all",
            };
            let url, contentType;
            switch (this.relateType) {
                case "dataItem":
                    url = "/dataItem/searchByName";
                    data = {
                        page: this.pageOption2.currentPage + 1,
                        pageSize: 5,
                        asc: true,
                        classifications: [],
                        category: '',
                        searchText: this.relateSearch,
                        dataType:"all",
                    }
                    data = JSON.stringify(data);
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
            })
        },
        handleEdit(index, row) {
            let flag = false;
            let j = 0;
            let num;
            // let num;

            //找到当前选定的tab对应的数值与id对应
            for (i = 0; i < this.editableTabs_model.length; i++) {
                if (this.editableTabs_model[i].id == this.editableTabsValue_model) {
                    num = i;
                    break;
                }
            }
            for (i = 0; i < this.editableTabs_model[num].tabledata.length; i++) {
                let tableRow = this.editableTabs_model[num].tabledata[i];
                if (tableRow.oid == row.oid) {
                    flag = true;
                    break;
                }
            }
            // num=1;
            if (!flag) {
                this.editableTabs_model[num].tabledata.push(row);
                // this.themeObj.classinfo[num].mcname = $("#categoryname"+this.tableflag1).val();
                this.themeObj.classinfo[num].modelsoid.push(row.oid);
            }
        },
        handleEdit1(index, row) {
            let flag = false;
            let j = 0;
            let num;
            for (i = 0; i < this.editableTabs_data.length; i++) {
                if (this.editableTabs_data[i].id == this.editableTabsValue_data) {
                    num = i;
                    break;
                }
            }
            for (i = 0; i < this.editableTabs_data[num].tabledata.length; i++) {
                let tableRow = this.editableTabs_data[num].tabledata[i];
                if (tableRow.oid == row.oid) {
                    flag = true;
                    break;
                }
            }
            if (!flag) {
                this.editableTabs_data[num].tabledata.push(row);
                // this.themeObj.dataClassInfo[num].dcname = $("#categoryname2"+this.tableflag2).val();
                this.themeObj.dataClassInfo[num].datasoid.push(row.oid);
            }
        },
        handleDelete1(index, row) {
            let tablist = $(".el-tabs__nav").eq(0);//取出model的tablist
            let tab_id = tablist.find('.is-active');//过滤出active的tab
            console.log(tab_id[0].id);
            let str = tab_id[0].id;
            let num = parseInt(str.substring(1).substring(1).substring(1).substring(1));//取出当前tab的数字
            console.log(num);
            console.log(row);
            num--;
            console.log(index, row);
            let table = new Array();
            for (i = 0; i < this.editableTabs_model[num].tabledata.length; i++) {
                table.push(this.editableTabs_model[num].tabledata[i]);
            }
            table.splice(index, 1);
            this.editableTabs_model[num].tabledata = table;

            let table1 = new Array();
            for (i = 0; i < this.themeObj.classinfo[num].modelsoid.length; i++) {
                table1.push(this.themeObj.classinfo[num].modelsoid[i]);
            }
            table1.splice(index, 1);
            this.themeObj.classinfo[num].modelsoid = table1;
        },
        handleDelete2(index, row) {
            let tablist = $(".el-tabs__nav").eq(1);//取出model的tablist
            let tab_id = tablist.find('.is-active');//过滤出active的tab
            console.log(tab_id[0].id);
            let str = tab_id[0].id;
            let num = parseInt(str.substring(1).substring(1).substring(1).substring(1));//取出当前tab的数字
            console.log(num);
            console.log(row);
            num--;
            console.log(index, row);
            let table = new Array();
            for (i = 0; i < this.editableTabs_data[num].tabledata.length; i++) {
                table.push(this.editableTabs_data[num].tabledata[i]);
            }
            table.splice(index, 1);
            this.editableTabs_data[num].tabledata = table;

            let table1 = new Array();
            for (i = 0; i < this.themeObj.dataClassInfo[num].datasoid.length; i++) {
                table1.push(this.themeObj.dataClassInfo[num].datasoid[i]);
            }
            table1.splice(index, 1);
            this.themeObj.dataClassInfo[num].datasoid = table1;
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
        handleSelect(index, indexPath) {
            this.setSession("index", index);
            window.location.href = "/user/userSpace"
        },
        handleCheckChange(data, checked, indeterminate) {
            let checkedNodes = this.$refs.tree2.getCheckedNodes();
            let classes = [];
            let str = '';
            for (let i = 0; i < checkedNodes.length; i++) {
                // console.log(checkedNodes[i].children)
                if (checkedNodes[i].children != undefined) {
                    continue;
                }

                classes.push(checkedNodes[i].oid);
                str += checkedNodes[i].label;
                if (i != checkedNodes.length - 1) {
                    str += ", ";
                }
            }
            this.cls = classes;
            this.clsStr = str;

        },
        changeOpen(n) {
            this.activeIndex = n;
        },
        modelClass_add() {
            this.mcnum++;
            this.tableflag1++;
            this.tabledataflag++;
            // $("#categoryname").attr('id','categoryname_past');//改变当前id名称
            $(".el-tabs__new-tab").eq(0).click();
        },
        dataClass_add() {
            // this.themeObj.dataClassInfo[this.dcnum].dcname = $("#categoryname2"+this.tableflag2).val();

            this.dcnum++;
            this.tableflag2++;
            this.tabledataflag1++;

            $(".el-tabs__new-tab").eq(1).click();
        },
        Application_add() {
            $(".el-tabs__new-tab").eq(2).click();
        },
        handlePageChange1(val) {
            // val--;
            this.pageOption1.currentPage = val;

            this.search1();
        },
        handlePageChange2(val) {
            this.pageOption2.currentPage = val;
            this.search2();
        },
        edit_theme() {
                this.dialogVisible3 = true;
                this.log_theme++;
                if (this.log_theme == 1) {
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
                        $.ajax({
                            url: "/theme/getInfo/" + this.themeoid,
                            type: "GET",
                            data: {},
                            success: (result) => {
                                console.log(result);
                                let basicInfo = result.data;

                                let classinfo_edit = basicInfo.classinfo;
                                console.log(classinfo_edit);
                                this.categorynameModel = [];
                                for (let i = 0; i < classinfo_edit.length - 1; i++) {
                                    //先将classinfo中的数据存储到themeObj中
                                    this.modelClass_add();
                                }
                                //从数据库获取数据，存放到editableTans_model里，此数组在前端渲染
                                for (let i = 0; i < classinfo_edit.length; i++) {
                                    //把category name数据存储起来
                                    this.categorynameModel.push(basicInfo.classinfo[i].mcname);
                                    this.editableTabs_model[i].title = basicInfo.classinfo[i].mcname;
                                    // this.editableTabs_model[i].title = basicInfo.classinfo[i].mcname;
                                    for (let j = 0; j < basicInfo.classinfo[i].modelsoid.length; j++) {
                                        this.find_oid(basicInfo.classinfo[i].modelsoid[j], 1);//1代表type为modelitem
                                        this.editableTabs_model[i].tabledata.push(this.tabledata_get);
                                    }
                                    this.themeObj.classinfo[i].mcname = classinfo_edit[i].mcname;
                                    for (let j = 0; j < classinfo_edit[i].modelsoid.length; j++) {
                                        this.themeObj.classinfo[i].modelsoid[j] = classinfo_edit[i].modelsoid[j];
                                    }
                                }

                                let dataClassInfo_edit = basicInfo.dataClassInfo;
                                console.log(dataClassInfo_edit);
                                this.categorynameData = [];
                                for (let i = 0; i < dataClassInfo_edit.length - 1; i++) {
                                    this.dataClass_add();
                                }
                                for (let i = 0; i < dataClassInfo_edit.length; i++) {
                                    this.categorynameData.push(basicInfo.dataClassInfo[i].dcname);
                                    this.editableTabs_data[i].title = basicInfo.dataClassInfo[i].dcname;
                                    // this.editableTabs_data[i].title = basicInfo.dataClassInfo[i].dcname;
                                    for (let j = 0; j < basicInfo.dataClassInfo[i].datasoid.length; j++) {
                                        this.find_oid(basicInfo.dataClassInfo[i].datasoid[j], 2);
                                        this.editableTabs_data[i].tabledata.push(this.tabledata_get);
                                    }
                                    this.themeObj.dataClassInfo[i].dcname = dataClassInfo_edit[i].dcname;
                                    for (let j = 0; j < dataClassInfo_edit[i].datasoid.length; j++) {
                                        this.themeObj.dataClassInfo[i].datasoid[j] = dataClassInfo_edit[i].datasoid[j];
                                    }
                                }

                                let application_edit = basicInfo.application;
                                console.log(application_edit);
                                this.categorynameApplication = [];
                                for (let i = 0; i < application_edit.length - 1; i++) {
                                    this.Application_add();
                                }
                                for (let i = 0; i < application_edit.length; i++) {
                                    this.themeObj.application[i].applicationname = application_edit[i].applicationname;
                                    this.themeObj.application[i].applicationlink = application_edit[i].applicationlink;
                                    this.themeObj.application[i].upload_application_image = application_edit[i].application_image;
                                }
                                for (let i = 0; i < application_edit.length; i++) {
                                    let app = {};
                                    app.name = basicInfo.application[i].applicationname;
                                    app.link = basicInfo.application[i].applicationlink;
                                    app.image = basicInfo.application[i].application_image;
                                    // $("#applicationname"+i).val(app.name);
                                    // $("#applicationlink"+i).val(app.link);
                                    // $("#applicationname"+i).val(app.name);

                                    this.categorynameApplication.push(app);

                                    this.editableTabs_applications[i].title = basicInfo.application[i].applicationname;
                                }
                                //显示detail
                                $("#themeText").html(basicInfo.detail);
                                initTinymce('textarea#themeText')

                                // tinymce.init({
                                //     selector: "textarea#themeText",
                                //     height: 300,
                                //     theme: 'silver',
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


                                //显示themename
                                $("#nameInput").val(basicInfo.themename);
                                //显示themeimg
                                $('#imgShow').attr("src", basicInfo.image);
                                $('#imgShow').show();

                            }
                        })
                    }
                })
            }
        },
        //由oid获取条目详细数据
        find_oid(oid, num) {

            switch (num) {
                //1为type是modelitem
                case 1: {
                    let data = {
                        oid: oid,
                    };
                    $.ajax({
                        url: "/theme/getModelItem",
                        type: "get",
                        data: data,
                        async: false,
                        success: (json) => {
                            if (json.code == 0) {
                                let data = json.data;
                                console.log(data);
                                this.tabledata_get = data;
                            }
                            else {
                                console.log("query error!")
                            }
                        }
                    })
                }
                case 2: {
                    let data = {
                        oid: oid,
                    };
                    $.ajax({
                        url: "/theme/getDataItem",
                        type: "get",
                        data: data,
                        async: false,
                        success: (json) => {
                            if (json.code == 0) {
                                let data = json.data;
                                console.log(data);
                                this.tabledata_get = data;
                            }
                            else {
                                console.log("query error!")
                            }
                        }
                    })
                }
                default: {

                }
            }

        },
        send_message() {
            this.dialogVisible = false;
            alert("Send Message Success!")
        },
        handleClose(done) {
            this.$confirm('Confirm closing？')
                .then(_ => {
                    done();
                })
                .catch(_ => {
                });
        },
        handleCurrentChange(data, checked, indeterminate) {
            this.setUrl("/modelItem/repository?category=" + data.oid);
            this.pageOption.searchResult = [];
            this.pageOption.total = 0;
            this.pageOption.paginationShow = false;
            this.currentClass = data.label;
            let classes = [];
            classes.push(data.oid);
            this.classifications1 = classes;
            //this.getChildren(data.children)
            this.pageOption.currentPage = 1;
            this.searchText = "";
            this.getModels();
        },
        handleCheckChange(data, checked, indeterminate) {
            this.pageOption.searchResult = [];
            this.pageOption.paginationShow = false;
            let checkedNodes = this.$refs.tree2.getCheckedNodes()
            let classes = [];
            for (let i = 0; i < checkedNodes.length; i++) {
                classes.push(checkedNodes[i].oid);
            }
            this.classifications2 = classes;
            console.log(this.classifications2)
            this.pageOption.currentPage = 1;
            this.getModels();
        },
        editThemePre() {
            let len = $(".editThemeStep").length;
            if (this.editThemeActive != 0)
                this.editThemeActive--;
        },
        editThemeNext() {
            for (let i = 0; i < this.categorynameModel.length; i++) {
                $('#categorynameModel' + i).val(this.categorynameModel[i]);
            }
            for (let i = 0; i < this.categorynameData.length; i++) {
                $('#categorynameData' + i).val(this.categorynameData[i]);
            }
            for (let i = 0; i < this.categorynameApplication.length; i++) {
                $('#applicationName' + i).val(this.categorynameApplication[i].name);
                $('#applicationLink' + i).val(this.categorynameApplication[i].link);
                $('#imgShowApplication' + i).attr("src", '/static'+this.categorynameApplication[i].image);
                $('#imgShowApplication' + i).show();
            }
            if (this.editThemeActive++ > 2) this.editThemeActive = 0;
        },
        editThemeFinish() {
            //查看classinfo与dataClassInfo，如果存在一个也未输入，则删除
            if (this.themeObj.classinfo.length==1&&this.themeObj.classinfo[0].mcname==""&&this.themeObj.classinfo[0].modelsoid.length==0) {
                this.themeObj.classinfo.splice(0,1);
            }
            if (this.themeObj.dataClassInfo.length==1&&this.themeObj.dataClassInfo[0].dcname==""&&this.themeObj.dataClassInfo[0].datasoid.length==0) {
                this.themeObj.dataClassInfo.splice(0,1);
            }
            if(this.themeObj.application.length==1&&this.themeObj.application[0].applicationname==""&&this.themeObj.application[0].applicationlink==""&&this.themeObj.application[0].upload_application_image==""){
                this.themeObj.application.splice(0,1);
            }

            //存储themeObj
            this.themeObj.themename = $("#nameInput").val();
            this.themeObj.image = $('#imgShow').get(0).src;

            var detail = tinyMCE.activeEditor.getContent();
            this.themeObj.detail = detail.trim();
            console.log(this.themeObj);

            this.themeObj.uploadImage = $('#imgShow').get(0).currentSrc;//

            // this.themeObj.tabledata = this.editableTabs_model;

            let formData=new FormData();


            //将数据打包传输
                this.themeObj["themeOid"] = this.themeoid;

                let file = new File([JSON.stringify(this.themeObj)],'ant.txt',{
                    type: 'text/plain',
                });
                formData.append("info",file);
                let that = this;
                $.ajax({
                    url: "/theme/update",
                    type: "POST",
                    processData: false,
                    contentType: false,
                    async: true,
                    data: formData,

                    success: function (result) {
                        // loading.close();
                        if (result.code === 0) {
                            if(result.data.method==="update") {
                                // alert("Update Success");
                                that.$message('Update Success');
                                $("#editModal", parent.document).remove();
                                that.dialogVisible3 = false;
                                // window.location.href = "/repository/theme/" + result.data.oid;
                            }
                            else{
                                that.$message('Success! Changes have been submitted, please wait for the author to review.');
                                that.dialogVisible3 = false;
                                // window.location.href = "/repository/theme/" + result.data.oid;
                                // alert("Success! Changes have been submitted, please wait for the author to review.");
                                //产生信号调用计数，启用websocket
                                // window.location.href = "/user/userSpace";
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
        },
        uploadImg(){

            $("#imgFile").click();
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
        },
        uploadApplicationImg(log){
            let that = this;
            $('#imgFileApplication'+log).click();
            $('#imgFileApplication'+log).change(function () {
                //获取input file的files文件数组;
                //$('#filed')获取的是jQuery对象，.get(0)转为原生对象;
                //这边默认只能选一个，但是存放形式仍然是数组，所以取第一个元素使用[0];
                var file = $('#imgFileApplication'+log).get(0).files[0];
                //创建用来读取此文件的对象
                var reader = new FileReader();
                //使用该对象读取file文件
                reader.readAsDataURL(file);
                //读取文件成功后执行的方法函数
                reader.onload = function (e) {
                    //读取成功后返回的一个参数e，整个的一个进度事件
                    //选择所要显示图片的img，要赋值给img的src就是e中target下result里面
                    //的base64编码格式的地址

                    $('#imgShowApplication'+log).get(0).src = e.target.result;
                    that.themeObj.application[log].upload_application_image = e.target.result;
                    $('#imgShowApplication'+log).show();
                }
            });
        },
    },
    mounted() {
        let that = this;


        $(document).on('keyup', '.category_name', function ($event) {
            let category_input = $(".category_name");
            // let tab_id=$(".")
            let index = 0;
            for (; index < category_input.length; index++) {
                if ($(this)[0] == category_input.eq(index)[0]) {
                    break;
                }
            }
            that.themeObj.classinfo[index].mcname = $("#categorynameModel" + index).val();
            that.editableTabs_model[index].title = $(".category_name").eq(index).val();
        });
        $(document).on('keyup', '.category_name2', function ($event) {
            let category_input = $(".category_name2");
            let index = 0;
            for (; index < category_input.length; index++) {
                if ($(this)[0] == category_input.eq(index)[0]) {
                    break;
                }
            }
            that.themeObj.dataClassInfo[index].dcname = $("#categorynameData" + index).val();
            that.editableTabs_data[index].title = $(".category_name2").eq(index).val();
        });
        $(document).on('keyup', '.application_name', function ($event) {
            let name_input = $(".application_name");
            let index = 0;
            for (; index < name_input.length; index++) {
                if ($(this)[0] == name_input.eq(index)[0]) {
                    break;
                }
            }
            that.themeObj.application[index].applicationname = $("#applicationName" + index).val();
            that.editableTabs_applications[index].title = $(".application_name").eq(index).val();
        });

        $(document).on('keyup', '.application_link', function ($event) {
            let link_input = $(".application_link");
            let index = 0;
            for (; index < link_input.length; index++) {
                if ($(this)[0] == link_input.eq(index)[0]) {
                    break;
                }
            }
            that.themeObj.application[index].applicationlink = $("#applicationLink" + index).val();
        });
        //页面加载前先执行获取数据函数
        $(document).ready(function () {
            that.relateType = "modelItem";
            that.tableData = [];
            that.pageOption1.currentPage = 0;
            that.pageOption1.searchResult = [];
            that.relateSearch = "";
            that.getRelation();
            that.search1();


            that.relateType = "dataItem";
            that.tableData = [];
            that.pageOption2.currentPage = 0;
            that.pageOption2.searchResult = [];
            that.relateSearch = "";
            that.getRelation();
            that.search2();
            console.log($(window).width());
            let winWidth = $(window).width();
            if (winWidth<750){
                that.isCollapse = true;
                $(".themeInfoImge").show();
            }else {
                that.isCollapse = false;
                $(".themeInfoImge").hide();
            }
        });
        //拿到当前页面的themeoid
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
                let href = window.location.href;
                let hrefs = href.split('/');
                that.themeoid = hrefs[hrefs.length - 1].split("#")[0];
            }
        });
        $(window).resize(function () {
            console.log($(window).width());
            let winWidth = $(window).width();
            if (winWidth<750){
                that.isCollapse = true;
                $(".themeInfoImge").show();
            }else {
                that.isCollapse = false;
                $(".themeInfoImge").hide();
            }

        });
        $.ajax({
            type:"GET",
            url:"/theme/getMaintainer/"+this.themeoid,
            success:(data) =>{
                that.maintainer = data;
            }

        })
    }
});

function show(id, container) {
    $(".x_content").hide();
    $("#" + id).show();

    $(".infoPanel").hide();
    $("#" + container).show();
}

function initTinymce(idStr){
    tinymce.remove(idStr)
    tinymce.init({
        selector: idStr,
        height: 350,
        plugins: [
            "advcode advlist autolink codesample image imagetools ",
            " lists link media noneditable powerpaste preview",
            " searchreplace table visualblocks wordcount"
        ],
        toolbar:
            "undo redo | fontselect | fontsizeselect | bold italic underline | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist | link image",
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

