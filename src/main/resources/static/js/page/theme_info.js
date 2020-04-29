var vue = new Vue({
    el:"#app",
    components: {
        'avatar': VueAvatar.Avatar
    },
    data:function () {
        return{
            //log用于计数
            log_model:0,
            log_data:0,
            log_application:0,
            log_info:0,
            form:{
              name:'',
            },

            tabledata_get:"",
            categoryname:[],

            theme_oid:"",

            model_num:0,
            data_num:0,
            mnum:0,
            mcnum:0,
            dnum:0,
            dcnum:0,
            sub_detail:'',
            editableTabsValue_model: '1',
            editableTabsValue_data: '1',
            editableTabsValue_applications: '1',
            editableTabs_model: [{
                id:"1",
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
                id:"1",
                tabledata:[],
                title: 'Tab 1',
                name: '1',
                content: 'Tab 1 content'
            }],
            editableTabs_applications: [{
                id:"1",
                title: 'Tab 1',
                name: '1',
                content: 'Tab 1 content'
            }],
            tabIndex_model: 1,
            tabIndex_data: 1,
            tabIndex_application: 1,
            //定义存储从前端获取的数据，用于与后台进行传输
            themeObj:{
                classinfo:[{
                    id:"1",
                    mcname:"",
                    modelsoid:[] ,
                }],
                dataClassInfo:[{
                    id:"1",
                    dcname:'',
                    datasoid:[],
                }],
                application:[{
                    id:"1",
                    applicationname:'',
                    applicationlink:'',
                    application_image:'',
                    upload_application_image:'',
                }]
            },
           modelClassInfos:[],
            dataClassInfos:[],

            oidnumber:0,
            numOfModelPerRow:5,
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

            defaultActive:'1',
            dialogVisible: false,
            dialogVisible1: false,
            dialogVisible2: false,
            form: {
                name: '',
                region: '',
                date1: '',
                date2: '',
                delivery: false,
                type: [],
                resource: '',
                desc: ''
            }
        }
    },
    methods:{
        //获取message_confirm页面
        getmessagepage(){
            console.log("ok");
            window.location.href = "/theme/getmessagepage/" + this.themeoid;
        },

        modelClass_add(){
            this.mcnum++;
            this.tableflag1++;
            this.tabledataflag++;
            // $("#categoryname").attr('id','categoryname_past');//改变当前id名称


            $(".el-tabs__new-tab").eq(0).click();
        },
        dataClass_add(){
            // this.themeObj.dataClassInfo[this.dcnum].dcname = $("#categoryname2"+this.tableflag2).val();

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


                //当remove操作时，将remove的tab的后面的tab的id中的数字均减一
                // let tablist = $(".el-tabs__nav").eq(0);
                // let last_tab = tablist.find('.el-tabs__item').last();//取出tab中的当前最新的tab的id
                // console.log(last_tab);
                // let str = last_tab[0].id;
                // let tabnum = parseInt(str.substring(1).substring(1).substring(1).substring(1));//取出当前tab的数字
                // console.log(tabnum);
                // for (let i= parseInt(targetName)+1;i<=tabnum;i++){
                //     let id = '#' + 'tab-' + i;
                //     let new_id ='tab-' + (i-1);
                //     let new_aria = 'pane-'+(i-1);
                //     // let nid = '#' + 'tab-' + (i-1);
                //     $(id).attr("aria-controls",new_aria);
                //     $(id).attr('id',new_id);
                // }
                // this.remove_flag++;
                // this.tabIndex_model = tabnum-1;
                // this.editableTabsValue_model--;

                let num;
                for (i=0;i<this.themeObj.classinfo.length;i++) {
                    if(this.themeObj.classinfo[i].id == targetName){
                        num=i;
                        break;
                    }
                }
                // delete this.themeObj.classinfo[num];//将存入到themeObj中的数据也移除
                this.themeObj.classinfo.splice(num,1);
            }

        },
        handleTabsEdit_data(targetName, action) {
            // this.confirmflag1 = 0;

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
                // if (this.themeObj.dataClassInfo.id)
                // delete this.themeObj.classinfo[num];//将存入到themeObj中的数据也移除,这种方式不行，只是将元素置为undefine
                this.themeObj.dataClassInfo.splice(num,1);
            }
        },
        handleTabsEdit_applications(targetName, action) {
            // var app = {};
            // app.applicationname = $("#applicationname").val();
            // app.applicationlink = $("#applicationlink").val();
            // app.upload_application_image = $(".img_Show1").get(0).currentSrc;
            // this.themeObj.application.push(app);


            // $("#applicationname").attr('id','applicationname_past');//改变当前id名称
            // $("#applicationlink").attr('id','applicationlink_past');//改变当前id名称
            // $("#imgShow1").attr('id','imgShow1_past');//改变当前id名称
            // $("#imgChange1").attr('id','imgChange1_past');//改变当前id名称

            if (action === 'add') {
                let newTabName = ++this.tabIndex_application + '';
                this.themeObj.application.push({
                    id:newTabName,
                    applicationname:'',
                    applicationlink:'',
                    application_image:'',
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
            }
            var data = {
                asc: this.pageOption1.sortAsc,

                page: this.pageOption1.currentPage-1,
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
            // let tablist = $(".el-tabs__nav").eq(0);//取出model的tablist
            // let tab_id = tablist.find('.is-active');//过滤出active的tab
            // console.log(tab_id[0].id);
            // let str = tab_id[0].id;
            // let num = parseInt(str.substring(1).substring(1).substring(1).substring(1));//取出当前tab的数字
            // console.log(num);
            // console.log(row);
            // num--;
            // num = num - this.tab_dele_num_model;
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
            // let tablist = $(".el-tabs__nav").eq(1);//取出model的tablist
            // let tab_id = tablist.find('.is-active');//过滤出active的tab
            // console.log(tab_id[0].id);
            // let str = tab_id[0].id;
            // let num = parseInt(str.substring(1).substring(1).substring(1).substring(1));//取出当前tab的数字
            // console.log(num);
            // console.log(row);
            // num--;
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
                for (i=0;i<this.themeObj.classinfo.length;i++) {
                    if(this.themeObj.classinfo[i].id == targetName){
                        num=i;
                        break;
                    }
                }
                // delete this.themeObj.classinfo[num];//将存入到themeObj中的数据也移除
                this.themeObj.classinfo.splice(num,1);
            }

        },
        modelClass_add(){
            this.mcnum++;
            this.tableflag1++;
            this.tabledataflag++;
            // $("#categoryname").attr('id','categoryname_past');//改变当前id名称
            $(".el-tabs__new-tab").eq(0).click();
        },
        dataClass_add(){
            // this.themeObj.dataClassInfo[this.dcnum].dcname = $("#categoryname2"+this.tableflag2).val();

            this.dcnum++;
            this.tableflag2++;
            this.tabledataflag1++;

            $(".el-tabs__new-tab").eq(1).click();
        },
        Application_add(){
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
        edit_theme_name(){
            $(".themename_item").hide();
            $(".edit_themename").show();

            $(".edit_themename_button").children().attr('class','el-icon-check');
        },
        edit_theme_info(){

            $(".detailIntroducePanel").m();
            $(".edit_detail").show();

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
                        this.setSession("history", window.location.href);
                        window.location.href = "/user/login";
                    }
                    else {
                        $.ajax({
                            url:"/theme/getInfo/" + this.themeoid,
                            type:"get",
                            data:{},

                            success:(result)=>{
                                console.log(result);
                                let basicInfo = result.data;
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
                    }
                }
            })
        },
        //先增加tabs
        add_tabs_model(){
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
                        this.setSession("history", window.location.href);
                        window.location.href = "/user/login";
                    }
                    else {
                        $.ajax({
                            url:"/theme/getInfo/" + this.themeoid,
                            type:"get",
                            data:{},
                            async:false,
                            success:(result)=>{
                                console.log(result);
                                let basicInfo = result.data;
                                let classinfo_edit = basicInfo.classinfo;
                                console.log(classinfo_edit);
                                this.categoryname = [];
                                for (let i=0;i<classinfo_edit.length-1;i++){
                                    //先将classinfo中的数据存储到themeObj中
                                    // this.themeObj.classinfo.push(classinfo_edit);
                                    this.modelClass_add();
                                }
                                for (let i=0;i<classinfo_edit.length;i++){
                                    //先将classinfo中的数据存储到themeObj中
                                    // this.themeObj.classinfo.push(classinfo_edit);
                                    this.themeObj.classinfo[i].mcname = classinfo_edit[i].mcname;
                                    for (let j=0;j<classinfo_edit[i].modelsoid.length;j++){
                                        this.themeObj.classinfo[i].modelsoid[j] = classinfo_edit[i].modelsoid[j];
                                    }
                                }
                            }

                        })

                    }
                }
            })
        },
        add_tabs_data(){
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
                        this.setSession("history", window.location.href);
                        window.location.href = "/user/login";
                    }
                    else {
                        $.ajax({
                            url:"/theme/getInfo/" + this.themeoid,
                            type:"get",
                            data:{},

                            success:(result)=>{
                                console.log(result);
                                let basicInfo = result.data;
                                let dataClassInfo_edit = basicInfo.dataClassInfo;
                                console.log(dataClassInfo_edit);
                                for (let i=0;i<dataClassInfo_edit.length-1;i++){
                                    this.dataClass_add();
                                }
                                for (let i=0;i<dataClassInfo_edit.length;i++){
                                    this.themeObj.dataClassInfo[i].dcname = dataClassInfo_edit[i].dcname;
                                    for (let j=0;j<dataClassInfo_edit[i].datasoid.length;j++){
                                        this.themeObj.dataClassInfo[i].datasoid[j] = dataClassInfo_edit[i].datasoid[j];
                                    }
                                }
                            }
                        })
                    }
                }
            })
        },
        add_tabs_application(){
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
                        this.setSession("history", window.location.href);
                        window.location.href = "/user/login";
                    }
                    else {
                        $.ajax({
                            url:"/theme/getInfo/" + this.themeoid,
                            type:"get",
                            data:{},

                            success:(result)=>{
                                console.log(result);
                                let basicInfo = result.data;
                                let application_edit = basicInfo.application;
                                console.log(application_edit);
                                for (let i=0;i<application_edit.length-1;i++){
                                    this.Application_add();
                                }
                                for (let i=0;i<application_edit.length;i++){
                                    this.themeObj.application[i].applicationname = application_edit[i].applicationname;
                                    this.themeObj.application[i].applicationlink = application_edit[i].applicationlink;
                                    this.themeObj.application[i].upload_application_image = application_edit[i].application_image;
                                }
                            }
                        })
                    }
                }
            })
        },
        edit_theme_model(){
            //为了区分是第一次编辑还是第多次编辑，写一个计数log，如果log==1则从数据库中取数据，如果log>1则不需要取，不变即可
            this.log_model++;
            $(".model_item").hide();
            $(".edit_model").show();

            if (this.log_model==1) {
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
                            this.setSession("history", window.location.href);
                            window.location.href = "/user/login";
                        }
                        else {
                            $.ajax({
                                url: "/theme/getInfo/" + this.themeoid,
                                type: "get",
                                data: {},
                                async: false,

                                success: (result) => {
                                    console.log(result);
                                    let basicInfo = result.data;
                                    let classinfo_edit = basicInfo.classinfo;
                                    console.log(classinfo_edit);
                                    this.categoryname = [];
                                    //从数据库获取数据，存放到editableTans_model里，此数组在前端渲染
                                    for (let i = 0; i < classinfo_edit.length; i++) {
                                        //把category name数据存储起来
                                        this.categoryname.push(basicInfo.classinfo[i].mcname);
                                        this.editableTabs_model[i].title = basicInfo.classinfo[i].mcname;
                                        for (let j = 0; j < basicInfo.classinfo[i].modelsoid.length; j++) {
                                            this.find_oid(basicInfo.classinfo[i].modelsoid[j], 1);//1代表type为modelitem
                                            this.editableTabs_model[i].tabledata.push(this.tabledata_get);
                                        }
                                    }
                                }
                            })
                        }
                    }
                })
                //循环给input赋name值
                for (let i = 0; i < this.categoryname.length; i++) {
                    $('#categoryname' + i).val(this.categoryname[i]);
                }
            }
        },
        edit_theme_data(){
            this.log_data ++;
            $(".data_item").hide();
            $(".edit_data").show();
            if (this.log_data == 1) {
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
                            this.setSession("history", window.location.href);
                            window.location.href = "/user/login";
                        }
                        else {
                            $.ajax({
                                url: "/theme/getInfo/" + this.themeoid,
                                type: "get",
                                data: {},
                                async: false,

                                success: (result) => {
                                    console.log(result);
                                    let basicInfo = result.data;
                                    let dataClassInfo_edit = basicInfo.dataClassInfo;
                                    console.log(dataClassInfo_edit);
                                    this.categoryname = [];
                                    for (let i = 0; i < dataClassInfo_edit.length; i++) {
                                        this.categoryname.push(basicInfo.dataClassInfo[i].dcname);
                                        this.editableTabs_data[i].title = basicInfo.dataClassInfo[i].dcname;
                                        for (let j = 0; j < basicInfo.dataClassInfo[i].datasoid.length; j++) {
                                            this.find_oid(basicInfo.dataClassInfo[i].datasoid[j], 2);
                                            this.editableTabs_data[i].tabledata.push(this.tabledata_get);
                                        }
                                    }
                                }
                            })
                        }
                    }
                })
                //循环给input赋name值
                for (let i = 0; i < this.categoryname.length; i++) {
                    $('#categoryname2' + i).val(this.categoryname[i]);
                }
            }
        },
        edit_theme_applications(){
            $(".application_item").hide();
            $(".edit_application").show();

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
                        this.setSession("history", window.location.href);
                        window.location.href = "/user/login";
                    }
                    else {
                        $.ajax({
                            url:"/theme/getInfo/" + this.themeoid,
                            type:"get",
                            data:{},
                            async:false,

                            success:(result)=>{
                                console.log(result);
                                let basicInfo = result.data;
                                let application_edit = basicInfo.application;
                                console.log(application_edit);
                                this.categoryname = [];
                                for (let i=0;i<application_edit.length;i++){
                                    let app = {};
                                    app.name = basicInfo.application[i].applicationname;
                                    app.link = basicInfo.application[i].applicationlink;
                                    app.image = basicInfo.application[i].application_image;
                                    this.categoryname.push(app);
                                    this.editableTabs_applications[i].title = basicInfo.application[i].applicationname;
                                }
                            }
                        })
                    }
                }
            })
            //循环给input赋name、link、image值
            for (let i=0;i<this.categoryname.length;i++){
                $('#applicationname'+i).val(this.categoryname[i].name);
                $('#applicationlink'+i).val(this.categoryname[i].link);
                $('#imgShow'+i).attr("src",this.categoryname[i].application_image);
                $('#imgShow'+i).show();
            }
        },

        //由oid获取条目详细数据
        find_oid(oid,num){

            switch (num) {
                //1为type是modelitem
                case 1:{
                    let data = {
                        oid: oid,
                    };
                    $.ajax({
                        url: "/theme/getModelItem",
                        type: "get",
                        data: data,
                        async:false,
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
                case 2:{
                    let data = {
                        oid: oid,
                    };
                    $.ajax({
                        url: "/theme/getDataItem",
                        type: "get",
                        data: data,
                        async:false,
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
                default:{

                }
            }

        },
        send_message(){
            this.dialogVisible = false;
            alert("Send Message Success!")
        },
        show_sub_detail(){
            this.dialogVisible1 = false;
            $("#sub_detailinfo").show();
        },
        show_sub_application(){
            this.dialogVisible2 = false;
          $("#sub_application").show();
        },
        handleClose(done) {
            this.$confirm('Confirm closing？')
                .then(_ => {
                    done();
                })
                .catch(_ => {});
        },
        handleCurrentChange(data, checked, indeterminate) {
            this.setUrl("/modelItem/repository?category="+data.oid);
            this.pageOption.searchResult=[];
            this.pageOption.total=0;
            this.pageOption.paginationShow=false;
            this.currentClass=data.label;
            let classes = [];
            classes.push(data.oid);
            this.classifications1 = classes;
            //this.getChildren(data.children)
            this.pageOption.currentPage=1;
            this.searchText="";
            this.getModels();
        },
        handleCheckChange(data, checked, indeterminate) {
            this.pageOption.searchResult=[];
            this.pageOption.paginationShow=false;
            let checkedNodes = this.$refs.tree2.getCheckedNodes()
            let classes = [];
            for (let i = 0; i < checkedNodes.length; i++) {
                classes.push(checkedNodes[i].oid);
            }
            this.classifications2 = classes;
            console.log(this.classifications2)
            this.pageOption.currentPage=1;
            this.getModels();
        },
        show_icon(){
            alert("Now you can edit!");
            $(".editicon").show();
            // console.log(edit_icon);


        }

    },
    mounted(){
        let that = this;

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
        })
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
                data = JSON.parse(data);
                if (data.oid == "") {
                    alert("Please login first");
                    this.setSession("history", window.location.href);
                    window.location.href = "/user/login";
                }
                else {
                    let href = window.location.href;
                    let hrefs = href.split('/');
                    that.themeoid = hrefs[hrefs.length - 1].split("#")[0];
                }
            }
        });
        //点击confirm按钮，将数据更新到theme数据表中
        $(document).on('click','.edit_themename_button',function ($event) {
            that.themeObj.sub_themename = $("#edit_themename").val();

            that.themeObj["oid"] = that.themeoid;
            let file = new File([JSON.stringify(that.themeObj)],'ant.txt',{
                type: 'text/plain',
            });
            let formData=new FormData();
            formData.append("info",file);
            $.ajax({
                url:"/theme/addsub",
                type:"post",
                processData:false,
                contentType:false,
                async:true,
                data:formData,

                success:function (result) {
                    if(result.code === 0){
                        if (result.data.method ==="update") {
                            // alert("Modification information has been sent, waiting for creator's approval");
                        }
                    }
                }
            })
        });
        //编辑info
        $(document).on('click','.edit_info_button',function ($event) {
            //先试下这些类聚一起行不行，不行再分开写
            $(".edit_detail").hide();
            // alert("success");
            let detail;
            //当detail编辑了才可以加入themeObj
            if(tinyMCE.activeEditor!=null) {
                detail = tinyMCE.activeEditor.getContent();
                that.themeObj.sub_detail = detail.trim();
                that.sub_detail = that.themeObj.sub_detail;
                console.log(that.themeObj);
            }
            $(".detailIntroducePanel1").show();

            that.themeObj["oid"] = that.themeoid;
            let file = new File([JSON.stringify(that.themeObj)],'ant.txt',{
                type: 'text/plain',
            });
            let type = "info";
            let formData=new FormData();
            formData.append("info",file);
            formData.append("type",type);
            $.ajax({
                url:"/theme/addsub",
                type:"post",
                processData:false,
                contentType:false,
                async:true,
                data:formData,

                success:function (result) {
                    if(result.code === 0){
                        if (result.data.method ==="update") {
                            // alert("Modification information has been sent, waiting for creator's approval");
                        }
                    }
                }
            })


            //尝试配置websocket,测试成功，可以连接
            let websocket = null;
            //判断当前浏览器是否支持WebSocket
            if ('WebSocket' in window) {

                websocket = new WebSocket("ws://localhost:8080/web/websocket");
                console.log("websocket 已连接");
            }
            else {
                alert('当前浏览器 Not support websocket')
            }

            //连接发生错误的回调方法
            websocket.onerror = function () {
                setMessageInnerHTML("聊天室连接发生错误");
            };

            //连接成功建立的回调方法
            websocket.onopen = function () {
                setMessageInnerHTML("聊天室连接成功");
            }

            //连接关闭的回调方法
            websocket.onclose = function () {
                setMessageInnerHTML("聊天室连接关闭");
            }

            //监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
            window.onbeforeunload = function () {
                closeWebSocket();
            }

            //将消息显示在网页上
            function setMessageInnerHTML(innerHTML) {
                document.getElementById('message').innerHTML += innerHTML + '<br/>';
            }

            //关闭WebSocket连接
            function closeWebSocket() {
                websocket.close();
            }

            //发送消息
            let message = "info_confirm";
            websocket.send(message);

        });
        //编辑模型
        $(document).on('click','.edit_model_button',function ($event) {
            that.modelClassInfos = [];//初始化modelClassInfos
            //将classinfo中的数据赋值到modelclassinfos中，modelclassinfos的数组根据需要不断push
            for (let i=0;i<that.themeObj.classinfo.length;i++){
                that.modelClassInfos.push({
                    mcname: "",
                    modelsoid: [{
                        name: "",
                        oid: ""
                    }]
                })
                that.modelClassInfos[i].mcname = that.themeObj.classinfo[i].mcname;

                for(let j=0;j<that.themeObj.classinfo[i].modelsoid.length;j++) {

                    that.modelClassInfos[i].modelsoid[j].oid = that.themeObj.classinfo[i].modelsoid[j];
                    let name;
                    let data = {
                        type:'modelItem',
                        oid: that.modelClassInfos[i].modelsoid[j].oid ,
                    };
                    $.ajax({
                        url:"/theme/getname",
                        type:"get",
                        async:false,
                        data:data,
                        success:(data) =>{
                            name = data;
                        }
                    });
                   that.modelClassInfos[i].modelsoid[j].name = name;
                   if (j < that.themeObj.classinfo[i].modelsoid.length-1){
                       that.modelClassInfos[i].modelsoid.push({
                           name:"",
                           oid:""
                       })
                   }
                }
            }

            that.themeObj["oid"] = that.themeoid;
            let file = new File([JSON.stringify(that.themeObj)],'ant.txt',{
                type: 'text/plain',
            });
            let formData=new FormData();
            let type = "model";
            formData.append("info",file);
            formData.append("type",type);
            $.ajax({
                url:"/theme/addsub",
                type:"post",
                processData:false,
                contentType:false,
                async:true,
                data:formData,

                success:function (result) {
                    if(result.code === 0){
                        if (result.data.method ==="update") {
                            // alert("Modification information has been sent, waiting for creator's approval");
                        }
                    }
                }
            })
            $(".modelmenu").hide();
            $(".edit_model").hide();
        });
        //编辑数据部分
        $(document).on('click','.edit_data_button',function ($event) {
            //先试下这些类聚一起行不行，不行再分开写
            that.dataClassInfos = [];
            for (let i=0;i<that.themeObj.dataClassInfo.length;i++){
                that.dataClassInfos.push({
                    dcname: "",
                    datasoid: [{
                        name: "",
                        oid: ""
                    }]
                })
                that.dataClassInfos[i].dcname = that.themeObj.dataClassInfo[i].dcname;

                for(let j=0;j<that.themeObj.dataClassInfo[i].datasoid.length;j++) {

                    that.dataClassInfos[i].datasoid[j].oid = that.themeObj.dataClassInfo[i].datasoid[j];
                    let name;
                    let data = {
                        type:'dataItem',
                        oid: that.dataClassInfos[i].datasoid[j].oid ,
                    };
                    $.ajax({
                        url:"/theme/getname",
                        type:"get",
                        async:false,
                        data:data,
                        success:(data) =>{
                            name = data;
                        }
                    });
                    that.dataClassInfos[i].datasoid[j].name = name;
                    if (j < that.themeObj.dataClassInfo[i].datasoid.length-1){
                        that.dataClassInfos[i].datasoid.push({
                            name:"",
                            oid:""
                        })
                    }
                }
            }

            that.themeObj["oid"] = that.themeoid;
            let file = new File([JSON.stringify(that.themeObj)],'ant.txt',{
                type: 'text/plain',
            });
            let formData=new FormData();
            let type = "data";
            formData.append("info",file);
            formData.append("type",type);
            $.ajax({
                url:"/theme/addsub",
                type:"post",
                processData:false,
                contentType:false,
                async:true,
                data:formData,

                success:function (result) {
                    if(result.code === 0){
                        if (result.data.method ==="update") {
                            // alert("Modification information has been sent, waiting for creator's approval");
                        }
                    }
                }
            })
            $(".datamenu").hide();
            $(".edit_data").hide();
            // $(".sub_modelmenu").show();
        });
        //编辑应用部分
        $(document).on('click','.edit_application_button',function ($event) {


            that.themeObj["oid"] = that.themeoid;
            let file = new File([JSON.stringify(that.themeObj)],'ant.txt',{
                type: 'text/plain',
            });
            let formData=new FormData();
            let type = "application";
            formData.append("info",file);
            formData.append("type",type);
            $.ajax({
                url:"/theme/addsub",
                type:"post",
                processData:false,
                contentType:false,
                async:true,
                data:formData,

                success:function (result) {
                    if(result.code === 0){
                        if (result.data.method ==="update") {
                            // alert("Modification information has been sent, waiting for creator's approval");
                        }
                    }
                }
            })
            // $(".modelmenu").hide();
            $(".edit_application").hide();
            // $(".sub_modelmenu").show();
        });
    }
});
function show(id,container){
    $(".x_content").hide();
    $("#"+id).show();

    $(".infoPanel").hide();
    $("#"+container).show();
}



