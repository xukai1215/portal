var notice = Vue.extend({
    template:"#notice",
    components: {
        'avatar': VueAvatar.Avatar
    },
    data:function () {
        return {

            ScreenMinHeight: "0px",
            ScreenMaxHeight: "0px",
            curIndex:10,
            dialogVisible1: false,
            dialogVisible2: false,
            dialogVisible3: false,


            currentDate: new Date(),
            activeName: 'first',
            model:[{
                past:{
                    category_name:"",
                    model:[{
                        modelname:""
                    }]
                },
                edited:{
                    category_name:"",
                    model:[{
                        modelname:""
                    }]
                }
            }],
            data:[{
                past:{
                    category_name:"",
                    model:[{
                        modelname:""
                    }]
                },
                edited:{
                    category_name:"",
                    model:[{
                        modelname:""
                    }]
                }
            }],
            application:[{
                name:"",
                link:"",
                image:""
            }],
            user_information:{
                Name:"",
                Email:""
            },
            useroid:"",
            username:"",
            model_tableData1:[],
            model_tableData2: [],
            model_tableData3:[],
            model_tableData1_length:0,
            model_tableData2_length:0,
            model_tableData3_length:0,

            edit_model_tableData:[],//用于获取model的version数据，用于显示谁编辑了什么
            community_tableData1:[],
            community_tableData2:[],
            community_tableData3:[],
            community_tableData1_length:0,
            community_tableData2_length:0,
            community_tableData3_length:0,
            edit_community_tableData:[],//用于获取community的version数据，用于显示谁编辑了什么

            theme_tableData1:[],
            theme_tableData2:[],
            theme_tableData3:[],
            theme_tableData1_length:0,
            theme_tableData2_length:0,
            theme_tableData3_length:0,


            table_length_sum:0,
            sum_tableData:[],//为了解决时间线多个v-for无法将多个表格数据时间正序排列的问题，将所有表格数据放到一个表格中
            //存放Info临时点击数据
            info_past_dialog:"",
            info_edited_dialog:"",
            //存放model临时点击数据
            classinfo:[],
            dataClassInfo:[],
            application:[],

            sub_classinfo:[],
            sub_dataClassInfos:[],
            sub_applications:[],

            // //控制点击theme view的时候显示的是哪个
            info_seen:false,
            model_seen:false,
            data_seen:false,
            application_seen: false,

            message_num:0,

            reverse: true,

            comments:[],

            loading: true,
        };
    },
    methods:{
        getComments(){
            $.get("/comment/getCommentsByUser",{},(result)=>{
                let code = result.code;
                if(code == -1){
                    alert("please login");
                    window.location.href="/user/login";
                }
                this.comments = result.data;

                if (this.comments.length == 0){
                    $(".comment").show();
                } else {
                    $(".comment").hide();
                }
            })
        },
        handleClick(tab, event){
            console.log(tab, event);
        },
        handleClose(done) {
            this.$confirm('Confirm closing？')
                .then(_ => {
                    done();
                })
                .catch(_ => {});
        },
        sendcurIndexToParent(){
            this.$emit('com-sendcurindex',this.curIndex)
        },
        handleClick(row) {
            console.log(row);
        },
        getVersions(){
            $.ajax({
                type: "GET",
                url: "/version/getVersions",
                data: {},
                async: true,
                success: (json) => {
                    //下面将type分到model、community中
                    //model：modelItem、conceptualModel、logicalModel、computableModel
                    // community：concept、spatialReference	、unit、template
                    for (let i=0;i<json.data.accept.length;i++){
                        if (json.data.accept[i].type == "modelItem" || json.data.accept[i].type == "conceptualModel"||json.data.accept[i].type == "logicalModel"||json.data.accept[i].type == "computableModel"){
                            this.model_tableData2.push(json.data.accept[i]);
                            this.sum_tableData.push(json.data.accept[i]);
                        }else {
                            this.community_tableData2.push(json.data.accept[i]);
                            this.sum_tableData.push(json.data.accept[i]);
                        }
                    }
                    for (let i=0;i<json.data.reject.length;i++){
                        if (json.data.reject[i].type == "modelItem" || json.data.reject[i].type == "conceptualModel"||json.data.reject[i].type == "logicalModel"||json.data.reject[i].type == "computableModel"){
                            this.model_tableData3.push(json.data.reject[i]);
                            this.sum_tableData.push(json.data.reject[i]);
                        }else {
                            this.community_tableData3.push(json.data.reject[i]);
                            this.sum_tableData.push(json.data.reject[i]);
                        }
                    }
                    for (let i=0;i<json.data.uncheck.length;i++){
                        if (json.data.uncheck[i].type == "modelItem" || json.data.uncheck[i].type == "conceptualModel"||json.data.uncheck[i].type == "logicalModel"||json.data.uncheck[i].type == "computableModel"){
                            this.model_tableData1.push(json.data.uncheck[i]);
                            this.message_num++;
                        }else {
                            this.community_tableData1.push(json.data.uncheck[i]);
                            this.message_num++;
                        }
                    }
                    for (let i=0;i<json.data.edit.length;i++){
                        if (json.data.edit[i].type == "modelItem" || json.data.edit[i].type == "conceptualModel"||json.data.edit[i].type == "logicalModel"||json.data.edit[i].type == "computableModel"){
                            json.data.edit[i].status = "unchecked";
                            this.edit_model_tableData.push(json.data.edit[i]);
                            this.sum_tableData.push(json.data.edit[i]);
                        }else {
                            json.data.edit[i].status = "unchecked";
                            this.edit_community_tableData.push(json.data.edit[i]);
                            this.sum_tableData.push(json.data.edit[i]);
                        }
                    }



                    for (let i = 0;i<this.sum_tableData.length;i++) {
                        if (this.sum_tableData[i].status!="unchecked"){
                            if (this.sum_tableData[i].acceptTime!=null) {
                                this.sum_tableData[i].modifyTime = this.sum_tableData[i].acceptTime;
                            }else if (this.sum_tableData[i].rejectTime!=null) {
                                this.sum_tableData[i].modifyTime = this.sum_tableData[i].rejectTime;
                            }
                        }
                    }

                    this.sum_tableData = this.sum_tableData.concat(this.comments);


                    //将sum_tableData的数据按照时间排序(冒泡排序)
                    for (let i=0;i<this.sum_tableData.length;i++){
                        for (let j=this.sum_tableData.length-1;j>i;j--){
                            if ((this.sum_tableData[j].modifyTime||this.sum_tableData[j].date)<(this.sum_tableData[j-1].modifyTime||this.sum_tableData[j-1].date)){
                                let temp = this.sum_tableData[j];
                                this.sum_tableData[j] = this.sum_tableData[j-1];
                                this.sum_tableData[j-1] = temp;
                            }
                        }
                    }

                    //为时间线涂色
                    for (let i=0;i<this.sum_tableData.length;i++){
                        if (this.sum_tableData[i].status == "confirmed") {
                            this.sum_tableData[i].color = '#0bbd87';
                        }else if (this.sum_tableData[i].status == "reject") {
                            this.sum_tableData[i].color = '#CF2018';
                        }else {
                            this.sum_tableData[i].color = '#20D1D4';
                        }
                        // 将type字母分开存到ex_type中
                        if (this.sum_tableData[i].type == "modelItem"){
                            this.sum_tableData[i].ex_type = "Model Item";
                        }else if (this.sum_tableData[i].type == "conceptualModel") {
                            this.sum_tableData[i].ex_type = "Conceptual Model";
                        }else if (this.sum_tableData[i].type == "logicalModel") {
                            this.sum_tableData[i].ex_type = "Logical Model";
                        }else if (this.sum_tableData[i].type == "computableModel") {
                            this.sum_tableData[i].ex_type = "Computable Model";
                        }else if (this.sum_tableData[i].type == "spatialReference") {
                            this.sum_tableData[i].ex_type = "Spatial Reference";
                        }else {
                            this.sum_tableData[i].ex_type = this.sum_tableData[i].type;
                        }

                        let data ={
                            userName:this.sum_tableData[i].modifier
                        }
                        //将通过userName获取用户的oid并存入sum_tableDta的oid中
                        $.ajax({
                            type:"GET",
                            url:"/theme/getoid",
                            data:data,
                            async:false,
                            success:(json)=>{
                                this.sum_tableData[i].modifier_oid = json;
                            }
                        })
                    }

                    //将各个表中的modifier的oid获取并存储
                    for (let i=0;i<this.model_tableData1.length;i++){
                        let data = {
                            userName:this.model_tableData1[i].modifier
                        }
                        $.ajax({
                            type:"GET",
                            url:"/theme/getoid",
                            data:data,
                            async:false,
                            success:(json)=>{
                                this.model_tableData1[i].modifier_oid = json;
                            }
                        })
                    }
                    for (let i=0;i<this.model_tableData2.length;i++){
                        let data = {
                            userName:this.model_tableData2[i].modifier
                        }
                        $.ajax({
                            type:"GET",
                            url:"/theme/getoid",
                            data:data,
                            async:false,
                            success:(json)=>{
                                this.model_tableData2[i].modifier_oid = json;
                            }
                        })
                    }
                    for (let i=0;i<this.model_tableData3.length;i++){
                        let data = {
                            userName:this.model_tableData3[i].modifier
                        }
                        $.ajax({
                            type:"GET",
                            url:"/theme/getoid",
                            data:data,
                            async:false,
                            success:(json)=>{
                                this.model_tableData3[i].modifier_oid = json;
                            }
                        })
                    }
                    for (let i=0;i<this.community_tableData1.length;i++){
                        let data = {
                            userName:this.community_tableData1[i].modifier
                        }
                        $.ajax({
                            type:"GET",
                            url:"/theme/getoid",
                            data:data,
                            async:false,
                            success:(json)=>{
                                this.community_tableData1[i].modifier_oid = json;
                            }
                        })
                    }
                    for (let i=0;i<this.community_tableData2.length;i++){
                        let data = {
                            userName:this.community_tableData2[i].modifier
                        }
                        $.ajax({
                            type:"GET",
                            url:"/theme/getoid",
                            data:data,
                            async:false,
                            success:(json)=>{
                                this.community_tableData2[i].modifier_oid = json;
                            }
                        })
                    }
                    for (let i=0;i<this.community_tableData3.length;i++){
                        let data = {
                            userName:this.community_tableData3[i].modifier
                        }
                        $.ajax({
                            type:"GET",
                            url:"/theme/getoid",
                            data:data,
                            async:false,
                            success:(json)=>{
                                this.community_tableData3[i].modifier_oid = json;
                            }
                        })
                    }
                    this.model_tableData1_length = this.model_tableData1.length;
                    this.model_tableData2_length = this.model_tableData2.length;
                    this.model_tableData3_length = this.model_tableData3.length;
                    this.community_tableData1_length = this.community_tableData1.length;
                    this.community_tableData2_length = this.community_tableData2.length;
                    this.community_tableData3_length = this.community_tableData3.length;


                    this.table_length_sum += (this.model_tableData1_length+this.community_tableData1_length);
                    console.log(this.sum_tableData);


                    if (this.sum_tableData.length == 0){
                        $(".overview").show();
                    } else {
                        $(".overview").hide();
                    }
                }
            })

            // this.loading = false;
        },

        // getEditVersion(){
        //     $.ajax({
        //         type:"GET",
        //         url:"/version/getEditVersion",
        //         data:{},
        //         async:false,
        //         success:(json)=>{
        //             console.log(json);
        //         }
        //     })
        // },
        view(event){
            let refLink=$(".viewBtn");
            for(i=0;i<refLink.length;i++){
                if(event.currentTarget===refLink[i]){
                    if(this.model_tableData1[i].type=="modelItem"){
                        window.open("/version/"+this.model_tableData1[i].type+"/"+this.model_tableData1[i].originOid);
                    }
                    else{
                        window.open("/version/"+this.model_tableData1[i].type+"/"+this.model_tableData1[i].oid);
                    }

                }
            }
            //console.log(event.currentTarget);
        },
        view1(event){
            let refLink=$(".viewBtn1");
            for(i=0;i<refLink.length;i++){
                if(event.currentTarget===refLink[i]){
                   window.open("/version/"+this.community_tableData1[i].type+"/"+this.community_tableData1[i].oid);
                }
            }
            //console.log(event.currentTarget);
        },
        //控制theme未审核部分的显示
        view_theme(event){
            let refLink=$(".viewBtn_theme");
            for(i=0;i<refLink.length;i++){
                if(event.currentTarget===refLink[i]){
                   // window.open("/version/"+this.community_tableData1[i].type+"/"+this.community_tableData1[i].oid);
                    //测试refLink
                    if (this.theme_tableData1[i].info_seen){
                        this.info_seen = this.theme_tableData1[i].info_seen;
                        this.model_seen = this.theme_tableData1[i].model_seen;
                        this.data_seen = this.theme_tableData1[i].data_seen;
                        this.application_seen = this.theme_tableData1[i].application_seen;
                        this.info_past_dialog = this.theme_tableData1[i].info_past;
                        this.info_edited_dialog = this.theme_tableData1[i].info_edited;
                    }
                    else if (this.theme_tableData1[i].model_seen) {
                        this.info_seen = this.theme_tableData1[i].info_seen;
                        this.model_seen = this.theme_tableData1[i].model_seen;
                        this.data_seen = this.theme_tableData1[i].data_seen;
                        this.application_seen = this.theme_tableData1[i].application_seen;
                        this.classinfo=[];
                        this.sub_classinfo=[];
                        for (let j=0;j<this.theme_tableData1[i].classinfo.length;j++) {
                            this.classinfo.push({
                                mcname:this.theme_tableData1[i].classinfo[j].mcname,
                                modelsoid: []
                            })
                            for (let k=0;k<this.theme_tableData1[i].classinfo[j].modelsoid.length;k++) {
                                let name;
                                let data = {
                                    type: 'modelItem',
                                    oid: this.theme_tableData1[i].classinfo[j].modelsoid[k],
                                };
                                $.ajax({
                                    url: "/theme/getname",
                                    type: "GET",
                                    data: data,
                                    async: false,
                                    success: (data) => {
                                        name = data;
                                    }
                                });
                                this.classinfo[j].modelsoid.push({
                                        name: name,
                                        oid: this.theme_tableData1[i].classinfo[j].modelsoid[k]
                                })
                            }
                        }
                        for (let j=0;j<this.theme_tableData1[i].sub_classinfo.length;j++) {
                            this.sub_classinfo.push({
                                mcname:this.theme_tableData1[i].sub_classinfo[j].mcname,
                                modelsoid: []
                            })
                            for (let k=0;k<this.theme_tableData1[i].sub_classinfo[j].modelsoid.length;k++) {
                                let name;
                                let data = {
                                    type: 'modelItem',
                                    oid: this.theme_tableData1[i].sub_classinfo[j].modelsoid[k],
                                };
                                $.ajax({
                                    url: "/theme/getname",
                                    type: "GET",
                                    data: data,
                                    async: false,
                                    success: (data) => {
                                        name = data;
                                    }
                                });
                                this.sub_classinfo[j].modelsoid.push({
                                    name: name,
                                    oid: this.theme_tableData1[i].sub_classinfo[j].modelsoid[k]
                                })
                            }
                        }
                    }
                    else if(this.theme_tableData1[i].data_seen){
                        this.info_seen = this.theme_tableData1[i].info_seen;
                        this.model_seen = this.theme_tableData1[i].model_seen;
                        this.data_seen = this.theme_tableData1[i].data_seen;
                        this.application_seen = this.theme_tableData1[i].application_seen;
                        this.dataClassInfo=[];
                        this.sub_dataClassInfos=[];
                        // this.dataClassInfo = this.theme_tableData1[i].dataClassInfo;
                        for (let j=0;j<this.theme_tableData1[i].dataClassInfo.length;j++) {
                            this.dataClassInfo.push({
                                dcname:this.theme_tableData1[i].dataClassInfo[j].dcname,
                                datasoid: []
                            })
                            for (let k=0;k<this.theme_tableData1[i].dataClassInfo[j].datasoid.length;k++) {
                                let name;
                                let data = {
                                    type: 'dataItem',
                                    oid: this.theme_tableData1[i].dataClassInfo[j].datasoid[k],
                                };
                                $.ajax({
                                    url: "/theme/getname",
                                    type: "GET",
                                    data: data,
                                    async: false,
                                    success: (data) => {
                                        name = data;
                                    }
                                });
                                this.dataClassInfo[j].datasoid.push({
                                    name: name,
                                    oid: this.theme_tableData1[i].dataClassInfo[j].datasoid[k]
                                })
                            }
                        }
                        // this.sub_dataClassInfos = this.theme_tableData1[i].sub_dataClassInfos;
                        for (let j=0;j<this.theme_tableData1[i].sub_dataClassInfos.length;j++) {
                            this.sub_dataClassInfos.push({
                                dcname:this.theme_tableData1[i].sub_dataClassInfos[j].dcname,
                                datasoid: []
                            });
                            for (let k=0;k<this.theme_tableData1[i].sub_dataClassInfos[j].datasoid.length;k++) {
                                let name;
                                let data = {
                                    type: 'dataItem',
                                    oid: this.theme_tableData1[i].sub_dataClassInfos[j].datasoid[k],
                                };
                                $.ajax({
                                    url: "/theme/getname",
                                    type: "GET",
                                    data: data,
                                    async: false,
                                    success: (data) => {
                                        name = data;
                                    }
                                });
                                this.sub_dataClassInfos[j].datasoid.push({
                                    name: name,
                                    oid: this.theme_tableData1[i].sub_dataClassInfos[j].datasoid[k]
                                })
                            }
                        }
                    }
                    else {
                        this.info_seen = this.theme_tableData1[i].info_seen;
                        this.model_seen = this.theme_tableData1[i].model_seen;
                        this.data_seen = this.theme_tableData1[i].data_seen;
                        this.application_seen = this.theme_tableData1[i].application_seen;
                        this.application = this.theme_tableData1[i].application;
                        this.sub_applications = this.theme_tableData1[i].sub_applications;
                    }
                }
            }
            //console.log(event.currentTarget);
        },
        //控制theme审核通过部分的显示
        view_theme_accept(event){
            let refLink=$(".viewAcceptBtn_theme");
            for(i=0;i<refLink.length;i++){
                if(event.currentTarget===refLink[i]){
                   // window.open("/version/"+this.community_tableData1[i].type+"/"+this.community_tableData1[i].oid);
                    //测试refLink
                    if (this.theme_tableData2[i].info_seen){
                        this.info_seen = this.theme_tableData2[i].info_seen;
                        this.model_seen = this.theme_tableData2[i].model_seen;
                        this.data_seen = this.theme_tableData2[i].data_seen;
                        this.application_seen = this.theme_tableData2[i].application_seen;
                        this.info_past_dialog = this.theme_tableData2[i].info_past;
                        this.info_edited_dialog = this.theme_tableData2[i].info_edited;
                    }
                    else if (this.theme_tableData2[i].model_seen) {
                        this.info_seen = this.theme_tableData2[i].info_seen;
                        this.model_seen = this.theme_tableData2[i].model_seen;
                        this.data_seen = this.theme_tableData2[i].data_seen;
                        this.application_seen = this.theme_tableData2[i].application_seen;
                        this.classinfo=[];
                        this.sub_classinfo=[];
                        for (let j=0;j<this.theme_tableData2[i].classinfo.length;j++) {
                            this.classinfo.push({
                                mcname:this.theme_tableData2[i].classinfo[j].mcname,
                                modelsoid: []
                            })
                            for (let k=0;k<this.theme_tableData2[i].classinfo[j].modelsoid.length;k++) {
                                let name;
                                let data = {
                                    type: 'modelItem',
                                    oid: this.theme_tableData2[i].classinfo[j].modelsoid[k],
                                };
                                $.ajax({
                                    url: "/theme/getname",
                                    type: "GET",
                                    data: data,
                                    async: false,
                                    success: (data) => {
                                        name = data;
                                    }
                                });
                                this.classinfo[j].modelsoid.push({
                                        name: name,
                                        oid: this.theme_tableData2[i].classinfo[j].modelsoid[k]
                                })
                            }
                        }
                        for (let j=0;j<this.theme_tableData2[i].sub_classinfo.length;j++) {
                            this.sub_classinfo.push({
                                mcname:this.theme_tableData2[i].sub_classinfo[j].mcname,
                                modelsoid: []
                            })
                            for (let k=0;k<this.theme_tableData2[i].sub_classinfo[j].modelsoid.length;k++) {
                                let name;
                                let data = {
                                    type: 'modelItem',
                                    oid: this.theme_tableData2[i].sub_classinfo[j].modelsoid[k],
                                };
                                $.ajax({
                                    url: "/theme/getname",
                                    type: "GET",
                                    data: data,
                                    async: false,
                                    success: (data) => {
                                        name = data;
                                    }
                                });
                                this.sub_classinfo[j].modelsoid.push({
                                    name: name,
                                    oid: this.theme_tableData2[i].sub_classinfo[j].modelsoid[k]
                                })
                            }
                        }
                    }
                    else if(this.theme_tableData2[i].data_seen){
                        this.info_seen = this.theme_tableData2[i].info_seen;
                        this.model_seen = this.theme_tableData2[i].model_seen;
                        this.data_seen = this.theme_tableData2[i].data_seen;
                        this.application_seen = this.theme_tableData2[i].application_seen;
                        this.dataClassInfo=[];
                        this.sub_dataClassInfos=[];
                        // this.dataClassInfo = this.theme_tableData2[i].dataClassInfo;
                        for (let j=0;j<this.theme_tableData2[i].dataClassInfo.length;j++) {
                            this.dataClassInfo.push({
                                dcname:this.theme_tableData2[i].dataClassInfo[j].dcname,
                                datasoid: []
                            })
                            for (let k=0;k<this.theme_tableData2[i].dataClassInfo[j].datasoid.length;k++) {
                                let name;
                                let data = {
                                    type: 'dataItem',
                                    oid: this.theme_tableData2[i].dataClassInfo[j].datasoid[k],
                                };
                                $.ajax({
                                    url: "/theme/getname",
                                    type: "GET",
                                    data: data,
                                    async: false,
                                    success: (data) => {
                                        name = data;
                                    }
                                });
                                this.dataClassInfo[j].datasoid.push({
                                    name: name,
                                    oid: this.theme_tableData2[i].dataClassInfo[j].datasoid[k]
                                })
                            }
                        }
                        // this.sub_dataClassInfos = this.theme_tableData2[i].sub_dataClassInfos;
                        for (let j=0;j<this.theme_tableData2[i].sub_dataClassInfos.length;j++) {
                            this.sub_dataClassInfos.push({
                                dcname:this.theme_tableData2[i].sub_dataClassInfos[j].dcname,
                                datasoid: []
                            });
                            for (let k=0;k<this.theme_tableData2[i].sub_dataClassInfos[j].datasoid.length;k++) {
                                let name;
                                let data = {
                                    type: 'dataItem',
                                    oid: this.theme_tableData2[i].sub_dataClassInfos[j].datasoid[k],
                                };
                                $.ajax({
                                    url: "/theme/getname",
                                    type: "GET",
                                    data: data,
                                    async: false,
                                    success: (data) => {
                                        name = data;
                                    }
                                });
                                this.sub_dataClassInfos[j].datasoid.push({
                                    name: name,
                                    oid: this.theme_tableData2[i].sub_dataClassInfos[j].datasoid[k]
                                })
                            }
                        }
                    }
                    else {
                        this.info_seen = this.theme_tableData2[i].info_seen;
                        this.model_seen = this.theme_tableData2[i].model_seen;
                        this.data_seen = this.theme_tableData2[i].data_seen;
                        this.application_seen = this.theme_tableData2[i].application_seen;
                        this.application = this.theme_tableData2[i].application;
                        this.sub_applications = this.theme_tableData2[i].sub_applications;
                    }
                }
            }
            //console.log(event.currentTarget);
        },
        //控制theme审核未通过部分的显示
        view_theme_reject(event){
            let refLink=$(".viewRejectBtn_theme");
            for(i=0;i<refLink.length;i++){
                if(event.currentTarget===refLink[i]){
                    // window.open("/version/"+this.community_tableData1[i].type+"/"+this.community_tableData1[i].oid);
                    //测试refLink
                    if (this.theme_tableData3[i].info_seen){
                        this.info_seen = this.theme_tableData3[i].info_seen;
                        this.model_seen = this.theme_tableData3[i].model_seen;
                        this.data_seen = this.theme_tableData3[i].data_seen;
                        this.application_seen = this.theme_tableData3[i].application_seen;
                        this.info_past_dialog = this.theme_tableData3[i].info_past;
                        this.info_edited_dialog = this.theme_tableData3[i].info_edited;
                    }
                    else if (this.theme_tableData3[i].model_seen) {
                        this.info_seen = this.theme_tableData3[i].info_seen;
                        this.model_seen = this.theme_tableData3[i].model_seen;
                        this.data_seen = this.theme_tableData3[i].data_seen;
                        this.application_seen = this.theme_tableData3[i].application_seen;
                        this.classinfo=[];
                        this.sub_classinfo=[];
                        for (let j=0;j<this.theme_tableData3[i].classinfo.length;j++) {
                            this.classinfo.push({
                                mcname:this.theme_tableData3[i].classinfo[j].mcname,
                                modelsoid: []
                            })
                            for (let k=0;k<this.theme_tableData3[i].classinfo[j].modelsoid.length;k++) {
                                let name;
                                let data = {
                                    type: 'modelItem',
                                    oid: this.theme_tableData3[i].classinfo[j].modelsoid[k],
                                };
                                $.ajax({
                                    url: "/theme/getname",
                                    type: "GET",
                                    data: data,
                                    async: false,
                                    success: (data) => {
                                        name = data;
                                    }
                                });
                                this.classinfo[j].modelsoid.push({
                                    name: name,
                                    oid: this.theme_tableData3[i].classinfo[j].modelsoid[k]
                                })
                            }
                        }
                        for (let j=0;j<this.theme_tableData3[i].sub_classinfo.length;j++) {
                            this.sub_classinfo.push({
                                mcname:this.theme_tableData3[i].sub_classinfo[j].mcname,
                                modelsoid: []
                            })
                            for (let k=0;k<this.theme_tableData3[i].sub_classinfo[j].modelsoid.length;k++) {
                                let name;
                                let data = {
                                    type: 'modelItem',
                                    oid: this.theme_tableData3[i].sub_classinfo[j].modelsoid[k],
                                };
                                $.ajax({
                                    url: "/theme/getname",
                                    type: "GET",
                                    data: data,
                                    async: false,
                                    success: (data) => {
                                        name = data;
                                    }
                                });
                                this.sub_classinfo[j].modelsoid.push({
                                    name: name,
                                    oid: this.theme_tableData3[i].sub_classinfo[j].modelsoid[k]
                                })
                            }
                        }
                    }
                    else if(this.theme_tableData3[i].data_seen){
                        this.info_seen = this.theme_tableData3[i].info_seen;
                        this.model_seen = this.theme_tableData3[i].model_seen;
                        this.data_seen = this.theme_tableData3[i].data_seen;
                        this.application_seen = this.theme_tableData3[i].application_seen;
                        this.dataClassInfo=[];
                        this.sub_dataClassInfos=[];
                        // this.dataClassInfo = this.theme_tableData3[i].dataClassInfo;
                        for (let j=0;j<this.theme_tableData3[i].dataClassInfo.length;j++) {
                            this.dataClassInfo.push({
                                dcname:this.theme_tableData3[i].dataClassInfo[j].dcname,
                                datasoid: []
                            })
                            for (let k=0;k<this.theme_tableData3[i].dataClassInfo[j].datasoid.length;k++) {
                                let name;
                                let data = {
                                    type: 'dataItem',
                                    oid: this.theme_tableData3[i].dataClassInfo[j].datasoid[k],
                                };
                                $.ajax({
                                    url: "/theme/getname",
                                    type: "GET",
                                    data: data,
                                    async: false,
                                    success: (data) => {
                                        name = data;
                                    }
                                });
                                this.dataClassInfo[j].datasoid.push({
                                    name: name,
                                    oid: this.theme_tableData3[i].dataClassInfo[j].datasoid[k]
                                })
                            }
                        }
                        // this.sub_dataClassInfos = this.theme_tableData3[i].sub_dataClassInfos;
                        for (let j=0;j<this.theme_tableData3[i].sub_dataClassInfos.length;j++) {
                            this.sub_dataClassInfos.push({
                                dcname:this.theme_tableData3[i].sub_dataClassInfos[j].dcname,
                                datasoid: []
                            });
                            for (let k=0;k<this.theme_tableData3[i].sub_dataClassInfos[j].datasoid.length;k++) {
                                let name;
                                let data = {
                                    type: 'dataItem',
                                    oid: this.theme_tableData3[i].sub_dataClassInfos[j].datasoid[k],
                                };
                                $.ajax({
                                    url: "/theme/getname",
                                    type: "GET",
                                    data: data,
                                    async: false,
                                    success: (data) => {
                                        name = data;
                                    }
                                });
                                this.sub_dataClassInfos[j].datasoid.push({
                                    name: name,
                                    oid: this.theme_tableData3[i].sub_dataClassInfos[j].datasoid[k]
                                })
                            }
                        }
                    }
                    else {
                        this.info_seen = this.theme_tableData3[i].info_seen;
                        this.model_seen = this.theme_tableData3[i].model_seen;
                        this.data_seen = this.theme_tableData3[i].data_seen;
                        this.application_seen = this.theme_tableData3[i].application_seen;
                        this.application = this.theme_tableData3[i].application;
                        this.sub_applications = this.theme_tableData3[i].sub_applications;
                    }
                }
            }
            //console.log(event.currentTarget);
        },
        viewAccept(event){
            let refLink=$(".viewAcceptBtn");
            for(i=0;i<refLink.length;i++){
                if(event.currentTarget===refLink[i]){
                    window.open("/version/history/"+this.model_tableData2[i].type+"/"+this.model_tableData2[i].oid);
                }
            }
            //console.log(event.currentTarget);
        },
        viewAccept1(event){
            let refLink=$(".viewAcceptBtn1");
            for(i=0;i<refLink.length;i++){
                if(event.currentTarget===refLink[i]){
                    window.open("/version/history/"+this.community_tableData2[i].type+"/"+this.community_tableData2[i].oid);
                }
            }
            //console.log(event.currentTarget);
        },
        viewReject(event){
            let refLink=$(".viewRejectBtn");
            for(i=0;i<refLink.length;i++){
                if(event.currentTarget===refLink[i]){
                    window.open("/version/history/"+this.model_tableData3[i].type+"/"+this.model_tableData3[i].oid);
                }
            }
            //console.log(event.currentTarget);
        },
        viewReject1(event){
            let refLink=$(".viewRejectBtn1");
            for(i=0;i<refLink.length;i++){
                if(event.currentTarget===refLink[i]){
                    window.open("/version/history/"+this.community_tableData3[i].type+"/"+this.community_tableData3[i].oid);
                }
            }
            //console.log(event.currentTarget);
        },
        accept_theme(event){
            let refLink=$(".accept_theme");
            for(i=0;i<refLink.length;i++){
                if(event.currentTarget===refLink[i]){
                    // alert("ok");
                    //定义match用于存储与后台数据进行匹配的条目数据
                    let match = {};
                    console.log(this.theme_tableData1[i]);
                    match.time = this.theme_tableData1[i].unformatTime;
                    match.themename = this.theme_tableData1[i].theme;
                    match.type= this.theme_tableData1[i].type;
                    console.log(match);
                    $.ajax({
                        url:"/theme/accept",
                        type:"POST",
                        async:false,
                        contentType: "application/json",
                        data:JSON.stringify(match),//js对象转换为字符串
                        success:(json) =>{
                            window.location.reload();
                        }
                    })
                }
            }
        },
        accept(event){
            let accepts=$(".accept");

            for(i=0;i<accepts.length;i++){
                if(event.currentTarget===accepts[i]){
                    let tableItem=this.model_tableData1[i];
                    let data={
                        type:tableItem.type,
                        oid:tableItem.oid,
                        originOid:tableItem.originOid
                    };
                    $.ajax({
                        type:"POST",
                        url:"/version/accept",
                        contentType: "application/json",
                        data: JSON.stringify(data),
                        async: true,
                        success:(json)=>{
                            window.location.reload();
                        }
                    })
                }
            }
        },
        accept1(event){
            let accepts=$(".accept1");

            for(i=0;i<accepts.length;i++){
                if(event.currentTarget===accepts[i]){
                    let tableItem=this.community_tableData1[i];
                    let data={
                        type:tableItem.type,
                        oid:tableItem.oid,
                        originOid:tableItem.originOid
                    };
                    $.ajax({
                        type:"POST",
                        url:"/version/accept",
                        contentType: "application/json",
                        data: JSON.stringify(data),
                        async: true,
                        success:(json)=>{
                            window.location.reload();
                        }
                    })
                }
            }
        },
        reject_theme(event){
            let refLink=$(".reject_theme");
            for(i=0;i<refLink.length;i++){
                if(event.currentTarget===refLink[i]){
                    // alert("ok");
                    //定义match用于存储与后台数据进行匹配的条目数据
                    let match = {};
                    console.log(this.theme_tableData1[i]);
                    match.time = this.theme_tableData1[i].time;
                    match.themename = this.theme_tableData1[i].theme;
                    match.type= this.theme_tableData1[i].type;
                    console.log(match);
                    $.ajax({
                        url:"/theme/reject",
                        type:"POST",
                        async:false,
                        contentType: "application/json",
                        data:JSON.stringify(match),//js对象转换为字符串
                        success:(json) =>{
                            window.location.reload();
                        }
                    })
                }
            }
        },
        reject(event){
            let rejects=$(".reject");

            for(i=0;i<rejects.length;i++){
                if(event.currentTarget===rejects[i]){
                    let tableItem=this.model_tableData1[i];
                    let data={
                        type:tableItem.type,
                        oid:tableItem.oid,
                        originOid:tableItem.originOid
                    }
                    $.ajax({
                        type:"POST",
                        url:"/version/reject",
                        contentType: "application/json",
                        data:JSON.stringify(data),
                        async: true,
                        success:(json)=>{
                            window.location.reload();
                        }
                    })
                }
            }
        },
        reject1(event){
            let rejects=$(".reject1");

            for(i=0;i<rejects.length;i++){
                if(event.currentTarget===rejects[i]){
                    let tableItem=this.community_tableData1[i];
                    let data={
                        type:tableItem.type,
                        oid:tableItem.oid,
                        originOid:tableItem.originOid
                    }
                    $.ajax({
                        type:"POST",
                        url:"/version/reject",
                        contentType: "application/json",
                        data:JSON.stringify(data),
                        async: true,
                        success:(json)=>{
                            window.location.reload();
                        }
                    })
                }
            }
        }
    },
    mounted(){
        this.sendcurIndexToParent();
        this.getComments();
        this.getVersions();
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
        });
        let that = this;
       $(document).ready(function () {
           //取出编辑信息
           $.ajax({
               url:"/theme/getedit",
               async:false,
               type:"GET",
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
                                                        that.theme_tableData1.push({
                                                            uid: type[j].uid,
                                                            time: type[j].formatTime,
                                                            unformatTime:type[j].time,
                                                            theme: json[i].themename,
                                                            type:"Info",
                                                            info_past:json[i].detail,
                                                            info_edited:type[j].detail,
                                                            info_seen:true,
                                                            model_seen:false,
                                                            data_seen:false,
                                                            application_seen:false
                                                        });
                                                        that.message_num++;
                                                        break;
                                                    case "1":
                                                        that.theme_tableData2.push({
                                                            uid: type[j].uid,
                                                            time: type[j].formatTime,
                                                            theme: json[i].themename,
                                                            type:"Info",
                                                            info_past:json[i].detail,
                                                            info_edited:type[j].detail,
                                                            info_seen:true,
                                                            model_seen:false,
                                                            data_seen:false,
                                                            application_seen:false
                                                        });
                                                        break;
                                                    case "-1":
                                                        that.theme_tableData3.push({
                                                            uid: type[j].uid,
                                                            time: type[j].formatTime,
                                                            theme: json[i].themename,
                                                            type:"Info",
                                                            info_past:json[i].detail,
                                                            info_edited:type[j].detail,
                                                            info_seen:true,
                                                            model_seen:false,
                                                            data_seen:false,
                                                            application_seen:false
                                                        });
                                                        break;
                                                }
                                        }else if (k == 1){
                                                switch (type[j].status) {
                                                    case "0":
                                                        that.theme_tableData1.push({
                                                            uid: type[j].uid,
                                                            time: type[j].formatTime,
                                                            unformatTime:type[j].time,
                                                            theme: json[i].themename,
                                                            type:"Model",
                                                            classinfo:json[i].classinfo,
                                                            sub_classinfo:type[j].sub_classInfo,
                                                            info_seen:false,
                                                            model_seen:true,
                                                            data_seen:false,
                                                            application_seen:false
                                                        });
                                                        that.message_num++;
                                                        break;
                                                    case "1":
                                                        that.theme_tableData2.push({
                                                            uid: type[j].uid,
                                                            time: type[j].formatTime,
                                                            theme: json[i].themename,
                                                            type:"Model",
                                                            classinfo:json[i].classinfo,
                                                            sub_classinfo:type[j].sub_classInfo,
                                                            info_seen:false,
                                                            model_seen:true,
                                                            data_seen:false,
                                                            application_seen:false
                                                        });
                                                        break;
                                                    case "-1":
                                                        that.theme_tableData3.push({
                                                            uid: type[j].uid,
                                                            time: type[j].formatTime,
                                                            theme: json[i].themename,
                                                            type:"Model",
                                                            classinfo:json[i].classinfo,
                                                            sub_classinfo:type[j].sub_classInfo,
                                                            info_seen:false,
                                                            model_seen:true,
                                                            data_seen:false,
                                                            application_seen:false
                                                        });
                                                        break;
                                                }
                                        }else if (k == 2){
                                                switch (type[j].status) {
                                                    case "0":
                                                        that.theme_tableData1.push({
                                                            uid: type[j].uid,
                                                            time: type[j].formatTime,
                                                            unformatTime:type[j].time,
                                                            theme: json[i].themename,
                                                            type:"Data",
                                                            dataClassInfo:json[i].dataClassInfo,
                                                            sub_dataClassInfos:type[j].sub_dataClassInfos,
                                                            info_seen:false,
                                                            model_seen:false,
                                                            data_seen:true,
                                                            application_seen:false
                                                        })
                                                        that.message_num++;
                                                        break;
                                                    case "1":
                                                        that.theme_tableData2.push({
                                                            uid: type[j].uid,
                                                            time: type[j].formatTime,
                                                            theme: json[i].themename,
                                                            type:"Data",
                                                            dataClassInfo:json[i].dataClassInfo,
                                                            sub_dataClassInfos:type[j].sub_dataClassInfos,
                                                            info_seen:false,
                                                            model_seen:false,
                                                            data_seen:true,
                                                            application_seen:false
                                                        })
                                                        break;
                                                    case "-1":
                                                        that.theme_tableData3.push({
                                                            uid: type[j].uid,
                                                            time: type[j].formatTime,
                                                            theme: json[i].themename,
                                                            type:"Data",
                                                            dataClassInfo:json[i].dataClassInfo,
                                                            sub_dataClassInfos:type[j].sub_dataClassInfos,
                                                            info_seen:false,
                                                            model_seen:false,
                                                            data_seen:true,
                                                            application_seen:false
                                                        })
                                                        break;
                                                }
                                            } else if (k == 3){
                                                switch (type[j].status) {
                                                    case "0":
                                                        that.theme_tableData1.push({
                                                            uid: type[j].uid,
                                                            time: type[j].formatTime,
                                                            unformatTime:type[j].time,
                                                            theme: json[i].themename,
                                                            type:"Application",
                                                            application:json[i].application,
                                                            sub_applications:type[j].sub_applications,
                                                            info_seen:false,
                                                            model_seen:false,
                                                            data_seen:false,
                                                            application_seen:true
                                                        });
                                                        that.message_num++;
                                                        break;
                                                    case "1":
                                                        that.theme_tableData2.push({
                                                            uid: type[j].uid,
                                                            time: type[j].formatTime,
                                                            theme: json[i].themename,
                                                            type:"Application",
                                                            application:json[i].application,
                                                            sub_applications:type[j].sub_applications,
                                                            info_seen:false,
                                                            model_seen:false,
                                                            data_seen:false,
                                                            application_seen:true
                                                        });
                                                        break;
                                                    case "-1":
                                                        that.theme_tableData3.push({
                                                            uid: type[j].uid,
                                                            time: type[j].formatTime,
                                                            theme: json[i].themename,
                                                            type:"Application",
                                                            application:json[i].application,
                                                            sub_applications:type[j].sub_applications,
                                                            info_seen:false,
                                                            model_seen:false,
                                                            data_seen:false,
                                                            application_seen:true
                                                        });
                                                        break;
                                                }
                                            }
                                    }
                                }
                        }
                    }
                    for (let i=0;i<that.theme_tableData1.length;i++){
                        let data = {
                            uid:that.theme_tableData1[i].uid
                        }
                        $.ajax({
                            url:"/theme/getModifierName",
                            type:"GET",
                            async:false,
                            data:data,
                            success:(json)=>{
                                that.theme_tableData1[i].userName = json;
                            }
                        })
                    }
                    for (let i=0;i<that.theme_tableData2.length;i++){
                        let data = {
                            uid:that.theme_tableData2[i].uid
                        }
                        $.ajax({
                            url:"/theme/getModifierName",
                            type:"GET",
                            async:false,
                            data:data,
                            success:(json)=>{
                                that.theme_tableData2[i].userName = json;
                            }
                        })
                    }
                    for (let i=0;i<that.theme_tableData3.length;i++){
                        let data = {
                            uid:that.theme_tableData3[i].uid
                        }
                        $.ajax({
                            url:"/theme/getModifierName",
                            type:"GET",
                            async:false,
                            data:data,
                            success:(json)=>{
                                that.theme_tableData3[i].userName = json;
                            }
                        })
                    }
                    that.theme_tableData1_length = that.theme_tableData1.length;
                    that.theme_tableData2_length = that.theme_tableData2.length;
                    that.theme_tableData3_length = that.theme_tableData3.length;

                   that.table_length_sum+=that.theme_tableData1_length;
               }
           })

           //取出当前登陆用户信息
           $.ajax({
               url:"/theme/getuser",
               async: false,
               type:"GET",
               success:(data)=>{
                   that.useroid = data.oid;
                   that.username = data.name;
               }
           });
           //取出作者信息
           $.ajax({
               url:"/theme/getuserinfo",
               async:false,
               type:"GET",
               data:that.useroid,
               success:(json)=>{

               }
           })
       })
    }
})