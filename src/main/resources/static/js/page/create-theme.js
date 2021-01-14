let id = 1000;
var createTheme = Vue.extend({
    template: "#createTheme",
    data() {
        const themeData = [
            {
                id: 1,
                label: 'Default',
                children: [{
                    id: 2,
                    label: 'new model class',
                    children: [],
                    tableData: []
                }]
            }
        ];
        return {
            themeData: JSON.parse(JSON.stringify(themeData)),
            selectedTableData:[],
            currentNode:2,
            parentNode:false,
            childNode:true,

            // remove_flag:0,
            // idflag:"",
            //mnum用来模型计数
            model_num: 0,
            data_num: 0,
            mnum: 0,
            mcnum: 0,
            dnum: 0,
            dcnum: 0,
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
                    id: 2,
                    mcname: "new model class",
                    children:[],
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
                    upload_application_image: '',
                }]
            },

            themeVersion:{
                modifierClass:[{
                    oid:"",
                    userName:'',
                    name:''
                }],
                subDetails:[{
                    detail:'',
                    // time后台设置
                    // status: '',后台确定
                    // formatTime:'',后台设置
                    // Class<Check> checkClass;后台处理设置
                }],
                subClassInfos:[{
                    // modify_time后台设置
                    // status: '',后台确定
                    // formatTime:'',后台设置
                    mcname:'',
                    models:[{
                        model_oid:'',
                        model_name:'',
                    }]
                    // Class<Check> checkClass;后台处理设置
                }],
                subDataInfos:[{
                    // modify_time后台设置
                    // status: '',后台确定
                    // formatTime:'',后台设置
                    dcname:'',
                    data:[{
                        data_oid:'',
                        data_name:'',
                    }]
                    // Class<Check> checkClass;后台处理设置
                }],
                subApplications:[{
                    // modify_time后台设置
                    // status: '',后台确定
                    // formatTime:'',后台设置
                    // Class<Check> checkClass;后台处理设置
                    applicationname:'',
                    applicationlink:'',
                    application_image:'',
                    upload_application_image:''
                }]
            },

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
            curIndex: 7,

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

        }
    },
    methods: {
        test(node){
            console.log(node)
        },
        findFirstChildObj(parent){
            var node
            if(parent.children.length==0){
                node = parent
            }
            else{
                if(parent.children[0].children.length > 0){
                    this.findFirstChild(parent.children[0])
                }else{
                    node = parent.children[0]
                }

            }

            return node

        },
        findFirstChild(parent){
            var nodeId
            if(parent.children[0].children.length > 0){
                this.findFirstChild(parent.children[0])
            }else{
                nodeId = parent.children[0].id
            }
            return nodeId
        },
        findTableData(modelClass){
            if(modelClass.children.length ==0 && modelClass.id == this.currentNode){
                return modelClass.modelsoid
            }else if(modelClass.children.length > 0){
                for (let n = 0; n <modelClass.children.length; n++) {
                    var flag = this.findTableData(modelClass.children[n])
                    if (flag != null) {
                        return flag
                    }
                }
            }else{
                return null
            }

        },
        findModelClass(modelClass, classId){
            if(modelClass.id == classId){
                return modelClass
            }else if(modelClass.children.length > 0){
                for (let n = 0; n <modelClass.children.length; n++) {
                    var flag = this.findModelClass(modelClass.children[n])
                    if (flag != null) {
                        return flag
                    }
                }
            }else{
                return null
            }
        },

        // tree的四个事件
        changeClassNode(data,node) {
            if(data.children.length == 0){
                console.log(data)
                this.selectedTableData = data.tableData
                this.currentNode = data.id
                this.parentNode = false
                this.childNode = true
            }else{
                console.log(this.themeObj)
                this.currentNode = this.findFirstChild(data)
                this.parentNode = true
                this.childNode = false
            }
            console.log(this.themeObj)
            console.log(this.themeData)
        },
        append(data) {
            this.$prompt('Class Name', '提示', {
                confirmButtonText: 'Yes',
                cancelButtonText: 'No'
            }).then(({ value }) => {
                const newChild = { id: id++, label: value ,children: [], tableData:[]};
                if (!data.children) {
                    this.$set(data, 'children', []);
                }
                data.children.push(newChild);
                // 找到themeobj中对应的class
                if(data.id == 1){
                    this.themeObj.classinfo.push({
                        id: id-1,
                        mcname:value,
                        children:[],
                        modelsoid: [],
                    })
                }else{

                    for (var n = 0; n < this.themeObj.classinfo.length; n++) {
                        var modelClass = this.findModelClass(this.themeObj.classinfo[n],data.id)
                        if(modelClass != null){
                            modelClass.children.push({
                                id: id-1,
                                mcname:value,
                                children:[],
                                modelsoid: [],
                            })
                            break
                        }
                    }
                }

                //更改显示内容
                this.parentNode = true
                this.childNode = false
            }).catch(()=>{

            })
        },
        modify(data) {
            this.$prompt('Class Name', 'Modify the item', {
                confirmButtonText: 'Yes',
                cancelButtonText: 'No'
            }).then(({ value }) => {
                data.label = value
                // 找到themeobj中对应的class
                for (var n = 0; n < this.themeObj.classinfo.length; n++) {
                    var modelClass = this.findModelClass(this.themeObj.classinfo[n],data.id)
                    if(modelClass != null){
                        modelClass.mcname=value
                        break
                    }
                }
            }).catch(()=>{

            })
        },
        remove(node, data) {
            this.$confirm('Are you sure to delete this item?',  {
                confirmButtonText: 'Yes',
                cancelButtonText: 'No',
                type: 'warning',
                center: true
            }).then(() => {

                if(node.data.id=="2"){
                    this.$message({
                        type:'warning',
                        message:'This item is forbidden to be deleted!',
                    });
                }
                else{
                    this.$message({
                        type: 'success',
                        message: 'delete successfully!'
                    });
                    const parent = node.parent;
                    //删除themeobj中的model class
                    // 找到themeobj中对应的parent class
                    for (var n = 0; n < this.themeObj.classinfo.length; n++) {
                        var modelClass = this.findModelClass(this.themeObj.classinfo[n],parent.data.id)
                        if(modelClass != null){
                            //找到孩子节点
                            var childIndex = modelClass.children.findIndex(d => d.id === data.id);
                            modelClass.children.splice(childIndex, 1);
                            console.log(this.themeObj.classinfo)
                            break
                        }
                    }
                    //删除树
                    const children = parent.data.children || parent.data;
                    const index = children.findIndex(d => d.id === data.id);
                    children.splice(index, 1);

                }


            }).catch(()=>{

            })
        },
        // model的两个事件
        addModel(index, row) {

            // 往数组中添加新模型
            var flag = false
            for (var n = 0; n < this.selectedTableData.length; n++) {
                if(this.selectedTableData[n].oid == row.oid){
                    flag = true
                    break
                }
            }
            if(!flag){
                this.selectedTableData.push(row)
                // 找到当前分类的数组
                for (var n = 0; n < this.themeObj.classinfo.length; n++) {
                    var modelsoid = this.findTableData(this.themeObj.classinfo[n])
                    if(modelsoid != null){
                        modelsoid.push(row.oid)
                        break
                    }
                }
                // this.themeObj.classinfo[num].modelsoid.push(row.oid);
            }

        },
        deleteModel(index, row) {
            // 删除数组中的模型
            for (var n = 0; n < this.selectedTableData.length; n++) {
                if(this.selectedTableData[n].oid == row.oid){
                    this.selectedTableData.splice(n, 1);
                    break
                }
            }

            // 找到themeobj中当前分类的数组
            for (var n = 0; n < this.themeObj.classinfo.length; n++) {
                var modelsoid = this.findTableData(this.themeObj.classinfo[n])
                if(modelsoid != null){
                    for (var m = 0; m < modelsoid.length; m++) {
                        if(modelsoid[m] == row.oid){
                            modelsoid.splice(m, 1);
                            break
                        }
                    }
                    break
                }
            }

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
        modelClass_add(){
            this.mcnum++;
            this.tableflag1++;
            this.tabledataflag++;
            $(".el-tabs__new-tab").eq(0).click();
        },
        dataClass_add(){
            this.dcnum++;
            this.tableflag2++;
            this.tabledataflag1++;

            $(".el-tabs__new-tab").eq(1).click();
        },
        Application_add(){
            $(".el-tabs__new-tab").eq(2).click();
        },
        handleTabsEdit_model(targetName, action) {
            if (action === 'add') {
                let newTabName = ++this.tabIndex_model + '';
                this.themeObj.classinfo.push({
                    id:newTabName,
                    mcname:"",
                    modelsoid:[],
                });
                // this.idflag = newTabName;
                this.editableTabs_model.push({
                    id:newTabName,
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
                let num;
                for (i=0;i<this.themeObj.classinfo.length;i++) {
                    if(this.themeObj.classinfo[i].id == targetName){
                        num=i;
                        break;
                    }
                }
                this.themeObj.classinfo.splice(num,1);
            }

        },
        handleTabsEdit_data(targetName, action) {
            if (action === 'add') {
                let newTabName = ++this.tabIndex_data + '';
                // this.idflag = newTabName;
                this.themeObj.dataClassInfo.push({
                    id:newTabName,
                    // id:"",
                    dcname:"",
                    datasoid:[],
                });
                this.editableTabs_data.push({
                    id:newTabName,
                    tabledata:[],
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
                for (i=0;i<this.themeObj.dataClassInfo.length;i++) {
                    if(this.themeObj.dataClassInfo[i].id == targetName){
                        num=i;
                        break;
                    }
                }
                this.themeObj.dataClassInfo.splice(num,1);
            }
        },
        handleTabsEdit_applications(targetName, action) {
            if (action === 'add') {
                let newTabName = ++this.tabIndex_application + '';
                this.themeObj.application.push({
                    id:newTabName,
                    applicationname:'',
                    applicationlink:'',
                    upload_application_image:'',
                })

                this.editableTabs_applications.push({
                    id:newTabName,
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
                for (i=0;i<this.themeObj.application.length;i++){
                    if(this.themeObj.application[i].id == targetName){
                        num = i;
                        break;
                    }
                }
                this.themeObj.application.splice(num,1);
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
            if(this.pageOption1.currentPage==0){
                this.pageOption1.currentPage++;
            };
            var data = {
                asc: this.pageOption1.sortAsc,

                page: this.pageOption1.currentPage-1,
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
            if(this.pageOption2.currentPage==0){
                this.pageOption2.currentPage++;
            };
            var data = {
                asc: this.pageOption2.sortAsc,
                page: this.pageOption2.currentPage-1,
                pageSize: this.pageOption2.pageSize,
                searchText: this.relateSearch,
                sortType: "default",
                classifications: ["all"],
                dataType:"all",
                tabType:"all",
            };
            let url, contentType;
            switch (this.relateType) {
                case "dataItem":
                    url="/dataItem/searchByName";
                    data = {
                        page: this.pageOption2.currentPage,
                        pageSize: 5,
                        asc: true,
                        classifications: [],
                        category: '',
                        searchText: this.relateSearch,
                        dataType:"all",
                        tabType:"all",

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
        handleEdit(index, row) {
            let flag = false;
            let j=0;
            let num;
            // let num;

            //找到当前选定的tab对应的数值与id对应
            for (i=0;i<this.editableTabs_model.length;i++) {
                if(this.editableTabs_model[i].id == this.editableTabsValue_model){
                    num=i;
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
            let j=0;
            let num;
            for (i=0;i<this.editableTabs_data.length;i++) {
                if(this.editableTabs_data[i].id == this.editableTabsValue_data){
                    num=i;
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

        sendUserToParent(userId){
            this.$emit('com-senduserinfo',userId)
        },
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
        })

        let that = this;

        //页面加载前先执行获取数据函数
        $(document).ready(function () {
            that.relateType = "modelItem";
            that.tableData = [];
            that.pageOption1.currentPage=0;
            that.pageOption1.searchResult = [];
            that.relateSearch = "";
            that.getRelation();
            that.search1();


            that.relateType = "dataItem";
            that.tableData = [];
            that.pageOption2.currentPage=0;
            that.pageOption2.searchResult = [];
            that.relateSearch = "";
            that.getRelation();
            that.search2();
        });

        //input的监听值变动的事件
        $(document).on('keyup','.category_name',function ($event) {
            let category_input=$(".category_name");
            // let tab_id=$(".")
            let index=0;
            for(;index<category_input.length;index++){
                if($(this)[0]==category_input.eq(index)[0]){
                    break;
                }
            }
            that.themeObj.classinfo[index].mcname = $("#categoryname"+ index).val();
            that.editableTabs_model[index].title = $(".category_name").eq(index).val();
        });
        $(document).on('keyup','.category_name2',function ($event) {
            let category_input=$(".category_name2");
            let index=0;
            for(;index<category_input.length;index++){
                if($(this)[0]==category_input.eq(index)[0]){
                    break;
                }
            }
            that.themeObj.dataClassInfo[index].dcname = $("#categoryname2"+ index).val();
            that.editableTabs_data[index].title = $(".category_name2").eq(index).val();
        });
        $(document).on('keyup','.application_name',function ($event) {
                    let name_input=$(".application_name");
                    let index=0;
                    for(;index<name_input.length;index++){
                        if($(this)[0]==name_input.eq(index)[0]){
                            break;
                        }
                    }
                    that.themeObj.application[index].applicationname = $("#applicationname"+ index).val();
                    that.editableTabs_applications[index].title = $(".application_name").eq(index).val();
         });

        $(document).on('keyup','.application_link',function ($event) {
            let link_input=$(".application_link");
            let index = 0;
            for (;index<link_input.length;index++){
                if($(this)[0]==link_input.eq(index)[0]){
                    break;
                }
            }
            that.themeObj.application[index].applicationlink = $("#applicationlink"+ index).val();
        })



        // var mcname;


        const heights = $(window).height();
        const minH = heights-60;
        $(".infoPanel").css("min-height",minH+"px");


        window.onresize = () => {
            const height = $(window).height();
            const minH = height-60;
            $(".infoPanel").css("min-height",minH+"px");
        };
        $(".step").steps({

            onFinish: function () {
                alert('complete');
            },
            onChange: function (currentIndex, newIndex, stepDirection) {
                if (currentIndex === 0) {
                    if (stepDirection === "forward") {
                        if ($("#nameInput").val().length == 0) {
                            alert('Please Input Theme Name!');
                            return false;
                        } else {
                            return true;
                        }
                    }
                }

                if (currentIndex === 1) {
                    if (stepDirection === "forward") {
                        if (that.themeObj.classinfo.length==1&&that.themeObj.classinfo[0].mcname==""&&that.themeObj.classinfo[0].modelsoid.length==0){
                            return true
                        } else{
                            for (i = 0; i < that.themeObj.classinfo.length; i++) {

                                // console.log((that.findFirstChild(that.themeObj.classinfo[i])))
                                if (that.themeObj.classinfo[i].mcname == "" || (that.findFirstChildObj(that.themeObj.classinfo[i])).modelsoid.length==0) {
                                    alert("Please complete the information");
                                    return false;
                                }
                                // if (that.themeObj.classinfo[i].mcname == "" || that.themeObj.classinfo[i].modelsoid.length == 0) {
                                //     alert("Please complete the information");
                                //     return false;
                                // }
                            }
                        }
                        return true;
                    }
                }if (currentIndex === 2) {
                    if (stepDirection === "forward") {
                        if (that.themeObj.dataClassInfo.length==1&&that.themeObj.dataClassInfo[0].dcname==""&&that.themeObj.dataClassInfo[0].datasoid.length==0){
                            return true;
                        } else {
                            for (i = 0; i < that.themeObj.dataClassInfo.length; i++) {
                                if (that.themeObj.dataClassInfo[i].dcname == "" || that.themeObj.dataClassInfo[i].datasoid.length == 0) {
                                    alert("Please complete the information");
                                    return false;
                                }
                            }
                        }
                        return true;
                    }
                }
                if (currentIndex === 3) {
                    return true;
                }
            }
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

        var oid = this.$route.params.editId;//取得所要edit的id
        var m_attr = 0;
        var d_attr = 0;

        if ((oid === "0") || (oid === "") || (oid === null)|| (oid === undefined)) {
            $("#subRteTitle").text("/Create Theme");
            initTinymce('textarea#themeText');
        }
        else {
            // $("#title").text("Modify Theme")
            $("#subRteTitle").text("/Modify Theme")
            // document.title="Modify Theme | OpenGMS"
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

                    $("#myText").html(basicInfo.detail);

                    initTinymce('textarea#themeText')

                }
            });
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


        $(document).on('click','.imgChange',function ($event) {
            let num = that.editableTabsValue_applications-1;
            let img_input = $(".img_file");
            let index = 0;
            for (;index<img_input.length;index++){
                if($(this)[0].nextElementSibling==img_input.eq(index)[0]){
                    break;
                }
            }
            $('#imgFile'+index).click();
        });
        $(document).on('change','.img_file',function ($event) {
        // $(".img_file").change(function () {
            //匹配id，增加image
            let num;
            for (i=0;i<that.themeObj.application.length;i++){
                if(that.themeObj.application[i].id==that.editableTabsValue_applications){
                    num = i;
                    break;
                }
            }
            //获取input file的files文件数组;
            //$('#filed')获取的是jQuery对象，.get(0)转为原生对象;
            //这边默认只能选一个，但是存放形式仍然是数组，所以取第一个元素使用[0];
            let file = $('#imgFile'+num).get(0).files[0];
            //创建用来读取此文件的对象
            let reader = new FileReader();
            //使用该对象读取file文件
            reader.readAsDataURL(file);
            //读取文件成功后执行的方法函数
            reader.onload = function (e) {
                //读取成功后返回的一个参数e，整个的一个进度事件
                //选择所要显示图片的img，要赋值给img的src就是e中target下result里面
                //的base64编码格式的地址

                $('#imgShow'+num).get(0).src = e.target.result;
                that.themeObj.application[num].upload_application_image = e.target.result;
                $('#imgShow'+num).show();
            }
            //console.log($('#imgShow1').get(0).currentSrc);
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
        // that.themeObj.classinfo = new Array();
        // that.themeObj.dataClassInfo = new Array();
        // that.themeObj.application = new Array();


        $(document).on('click','#selectok',function ($event) {

            //将tabledata中的数据放到二维数组tabledata_two
            $("#selectok").html("That's ok");
            that.confirmflag = 1;
            $("#selectok").attr('id',"selectok_past");
            /*classinfo 类似于reference,将选择的model的oid放到classinfo中*/
            // themeObj.classinfo = new Array();
            // var cla = {};
            // cla.mcname = $("#categoryname").val();
            // cla.modelsoid = that.moid;
            // that.themeObj.classinfo.push(cla);
            // for(var i=0;i<that.tableData.length;i++){
            //     that.editableTabs_model[that.tabledataflag].tabledata[i] = that.tableData[i];
            // }
            // that.editableTabs_model[that.tabledataflag].tabledata.push(that.tableData);
            that.tabledataflag++;
            // that.editableTabs_model[that.tabledataflag++].tabledata.push(that.tableData);//将当前获取的tabledata追加到大数组中

            that.dialogTableVisible=false;

            $("#categoryname").attr('id','categoryname_past');//改变当前id名称
        });
        $(document).on('click','#selectok1',function ($event) {
            that.editableTabs_data[that.tableflag2++].title = $("#categoryname2").val();
            $("#selectok1").html("That's ok");
            that.confirmflag1 = 1;
            $("#selectok1").attr('id',"selectok1_past");
            /*dataclassinfo 类似于reference,将选择的model的oid放到dataclassinfo中*/
            // var dcla = {};
            // dcla.dcname = $("#categoryname2").val();
            // dcla.datasoid = that.doid;
            // that.themeObj.dataClassInfo.push(dcla);

            // that.editableTabs_data[that.tabledataflag1].tabledata.push(that.tableData);
            that.tabledataflag1++;

            that.dialogTableVisible1=false;

            $("#categoryname2").attr('id','categoryname2_past');//改变当前id名称
        });

        $(".finish").click(()=> {
            let loading = this.$loading({
                lock: true,
                text: "Uploading...",
                spinner: "el-icon-loading",
                background: "rgba(0, 0, 0, 0.7)"
            });
            if(that.themeObj.application.length===1&&that.themeObj.application[0].applicationname===""&&that.themeObj.application[0].applicationlink===""
                &&that.themeObj.application[0].upload_application_image===""){

            }else {
                for(i = 0;i<that.themeObj.application.length; i++){
                    if (that.themeObj.application[i].applicationname === ""||that.themeObj.application[i].applicationlink ===""||
                        that.themeObj.application[i].upload_application_image===""){
                        alert("Please complete the information");
                        return false;
                    }
                }
            }
            //查看classinfo与dataClassInfo，如果存在一个也未输入，则删除
            if (that.themeObj.classinfo.length===1&&that.themeObj.classinfo[0].mcname===""&&that.themeObj.classinfo[0].modelsoid.length===0) {
                that.themeObj.classinfo.splice(0,1);
            }
            if (that.themeObj.dataClassInfo.length===1&&that.themeObj.dataClassInfo[0].dcname===""&&that.themeObj.dataClassInfo[0].datasoid.length===0) {
                that.themeObj.dataClassInfo.splice(0,1);
            }
            if(that.themeObj.application.length===1&&that.themeObj.application[0].applicationname===""&&that.themeObj.application[0].applicationlink===""
                &&that.themeObj.application[0].upload_application_image===""){
                that.themeObj.application.splice(0,1);
            }

            that.themeObj.themename = $("#nameInput").val();
            that.themeObj.image = $('#imgShow').get(0).src;

            var detail = tinyMCE.activeEditor.getContent();
            that.themeObj.detail = detail.trim();
            console.log(that.themeObj);

            that.themeObj.uploadImage = $('#imgShow').get(0).currentSrc;
            that.themeObj.tabledata = that.editableTabs_model;
            let formData=new FormData();
            if ((oid === "0") || (oid === "") || (oid == null)) {
                let file = new File([JSON.stringify(that.themeObj)],'ant.txt',{
                    type: 'text/plain',
                });
                formData.append("info",file);
                console.log(that.themeObj);
                console.log(formData);
                $.ajax({
                    url: "/theme/addTheme",
                    type: "POST",
                    processData: false,
                    contentType: false,
                    async: true,
                    data: formData,
                    success: function (result) {
                        loading.close();
                        if (result.code == "0") {
                            alert("Create Success");
                            window.location.href = "/repository/theme/" + result.data;//刷新当前页面
                        }
                        else if(result.code==-1){
                            alert("Please login first!");
                            window.location.href="/user/login";
                        }
                        else{
                            alert("Create failed!");
                        }
                    }
                })
            } else {

                that.themeObj["oid"] = oid;

                let file = new File([JSON.stringify(that.themeObj)],'ant.txt',{
                    type: 'text/plain',
                });
                formData.append("info",file);
                console.log(formData)
                $.ajax({
                    url: "/theme/update",
                    type: "POST",
                    processData: false,
                    contentType: false,
                    async: true,
                    data: formData,

                    success: function (result) {
                        loading.close();
                        if (result.code === 0) {
                            if(result.data.method==="update") {
                                alert("Update Success");
                                $("#editModal", parent.document).remove();
                                window.location.href = "/theme/" + result.data.oid;
                            }
                            else{
                                alert("Success! Changes have been submitted, please wait for the author to review.");
                                //产生信号调用计数，启用websocket

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
