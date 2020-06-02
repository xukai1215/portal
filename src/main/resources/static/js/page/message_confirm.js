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
            edit_theme_tableData:[],

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
            comments1:[],
            comments2:[],
            comments2Length:0,

            loading: true,

            tabPosition: 'left',
            // sumDateTableData用于存储以时间为主键的数据,主要用于展示时间线，date为时间，tableData用来存储sumtabledata里的数据
            sumDateTableData:[{
                date:"",
                tableData:[{

                }]
            }],
            timeLineColor:'#409EFF',
            timeLineColor1:'#F56C6C'
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
                for (let i=0;i<this.comments.length;i++){
                    if (this.comments[i].replier==null){
                        this.comments1.push(this.comments[i]);
                    } else {
                        this.comments2.push(this.comments[i]);
                    }
                }
                this.comments2Length = this.comments2.length;

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
        // formatDate(value,callback) {
        //     const date = new Date(value);
        //     y = date.getFullYear();
        //     M = date.getMonth() + 1;
        //     d = date.getDate();
        //     H = date.getHours();
        //     m = date.getMinutes();
        //     s = date.getSeconds();
        //     if (M < 10) {
        //         M = '0' + M;
        //     }
        //     if (d < 10) {
        //         d = '0' + d;
        //     }
        //     if (H < 10) {
        //         H = '0' + H;
        //     }
        //     if (m < 10) {
        //         m = '0' + m;
        //     }
        //     if (s < 10) {
        //         s = '0' + s;
        //     }
        //
        //     const t = y + '-' + M + '-' + d + ' ' + H + ':' + m + ':' + s;
        //     if(callback == null||callback == undefined)
        //         return t;
        //     else
        //         callback(t);
        // },
        getVersions(){
            $.ajax({
                type: "GET",
                url: "/theme/getMessageData",
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
                        }else if (json.data.accept[i].type == "concept" || json.data.accept[i].type == "spatialReference"||json.data.accept[i].type == "unit"||json.data.accept[i].type == "template") {
                            this.community_tableData2.push(json.data.accept[i]);
                            this.sum_tableData.push(json.data.accept[i]);
                        }else if (json.data.accept[i].type == "theme") {
                            this.theme_tableData2.push(json.data.accept[i]);
                            this.sum_tableData.push(json.data.accept[i]);
                        }
                    }
                    for (let i=0;i<json.data.reject.length;i++){
                        if (json.data.reject[i].type == "modelItem" || json.data.reject[i].type == "conceptualModel"||json.data.reject[i].type == "logicalModel"||json.data.reject[i].type == "computableModel"){
                            this.model_tableData3.push(json.data.reject[i]);
                            this.sum_tableData.push(json.data.reject[i]);
                        }else if (json.data.reject[i].type == "concept" || json.data.reject[i].type == "spatialReference"||json.data.reject[i].type == "unit"||json.data.reject[i].type == "template"){
                            this.community_tableData3.push(json.data.reject[i]);
                            this.sum_tableData.push(json.data.reject[i]);
                        }else if (json.data.reject[i].type == "theme") {
                            this.theme_tableData3.push(json.data.reject[i]);
                            this.sum_tableData.push(json.data.reject[i]);
                        }
                    }
                    for (let i=0;i<json.data.uncheck.length;i++){
                        if (json.data.uncheck[i].type == "modelItem" || json.data.uncheck[i].type == "conceptualModel"||json.data.uncheck[i].type == "logicalModel"||json.data.uncheck[i].type == "computableModel"){
                            this.model_tableData1.push(json.data.uncheck[i]);
                            this.sum_tableData.push(json.data.uncheck[i]);
                            this.message_num++;
                        }else if (json.data.uncheck[i].type == "concept" || json.data.uncheck[i].type == "spatialReference"||json.data.uncheck[i].type == "unit"||json.data.uncheck[i].type == "template"){
                            this.community_tableData1.push(json.data.uncheck[i]);
                            // this.sum_tableData.push(json.data.uncheck[i]);
                            this.message_num++;
                        }else if (json.data.uncheck[i].type == "theme") {
                            this.theme_tableData1.push(json.data.uncheck[i]);
                            // this.sum_tableData.push(json.data.uncheck[i]);
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

                    //将this.sum_tableData通过只传值不传地址赋值给sum_tableData
                    var sum_tableData = JSON.parse(JSON.stringify(this.sum_tableData));
                    // console.log(sum_tableData);

                    //将排序后的数据存储到sumDateTableData中
                    let k=0;
                    for (let i=0;i<sum_tableData.length;i++){
                        if (sum_tableData[i].modifyTime!=null) {
                            sum_tableData[i].modifyTime = sum_tableData[i].modifyTime.slice(11, 19);
                        }else {
                            sum_tableData[i].date = sum_tableData[i].date.slice(11, 19);
                        }
                        switch (sum_tableData[i].status) {
                            case "unchecked":{
                                if(i==0){
                                    this.sumDateTableData[k].date = sum_tableData[i].modifyTimeDay;
                                    this.sumDateTableData[k].tableData.push(sum_tableData[i]);
                                    if (this.sumDateTableData[k].tableData[0].oid == null){
                                        this.sumDateTableData[k].tableData.shift();
                                    }
                                }
                                else if (sum_tableData[i-1].status=="unchecked"){
                                    if  (sum_tableData[i].modifyTimeDay==sum_tableData[i-1].modifyTimeDay) {
                                        // this.sumDateTableData[k].date = sum_tableData[i].modifyTime;
                                        this.sumDateTableData[k].tableData.push(sum_tableData[i]);
                                        if ((this.sumDateTableData[k].tableData[0].oid || this.sumDateTableData[k].tableData[0].content) ){
                                            this.sumDateTableData[k].tableData.shift();
                                        }
                                    }else{
                                        k++;
                                        //sumDateTableData增加
                                        this.sumDateTableData.push({
                                            date:"",
                                            tableData:[{}]
                                        })
                                        this.sumDateTableData[k].date = sum_tableData[i].modifyTimeDay;
                                        this.sumDateTableData[k].tableData.push(sum_tableData[i]);
                                        if ((this.sumDateTableData[k].tableData[0].oid || this.sumDateTableData[k].tableData[0].content)  == null){
                                            this.sumDateTableData[k].tableData.shift();
                                        }
                                    }
                                }
                                else if(sum_tableData[i-1].status=="confirmed"){
                                    if (sum_tableData[i].modifyTimeDay==sum_tableData[i-1].acceptTimeDay) {
                                        // this.sumDateTableData[k].date = sum_tableData[i].modifyTime;
                                        this.sumDateTableData[k].tableData.push(sum_tableData[i]);
                                        if ((this.sumDateTableData[k].tableData[0].oid || this.sumDateTableData[k].tableData[0].content)  == null){
                                            this.sumDateTableData[k].tableData.shift();
                                        }
                                    }else{
                                        k++;
                                        //sumDateTableData增加
                                        this.sumDateTableData.push({
                                            date:"",
                                            tableData:[{}]
                                        })
                                        this.sumDateTableData[k].date = sum_tableData[i].modifyTimeDay;
                                        this.sumDateTableData[k].tableData.push(sum_tableData[i]);
                                        if ((this.sumDateTableData[k].tableData[0].oid || this.sumDateTableData[k].tableData[0].content)  == null){
                                            this.sumDateTableData[k].tableData.shift();
                                        }
                                    }
                                }
                                else if(sum_tableData[i-1].status=="reject"){
                                    if (sum_tableData[i].modifyTimeDay==sum_tableData[i-1].rejectTimeDay) {
                                        // this.sumDateTableData[k].date = sum_tableData[i].modifyTime;
                                        this.sumDateTableData[k].tableData.push(sum_tableData[i]);
                                        if ((this.sumDateTableData[k].tableData[0].oid || this.sumDateTableData[k].tableData[0].content)  == null){
                                            this.sumDateTableData[k].tableData.shift();
                                        }
                                    } else{
                                        k++;
                                        //sumDateTableData增加
                                        this.sumDateTableData.push({
                                            date:"",
                                            tableData:[{}]
                                        })
                                        this.sumDateTableData[k].date = sum_tableData[i].modifyTimeDay;
                                        this.sumDateTableData[k].tableData.push(sum_tableData[i]);
                                        if ((this.sumDateTableData[k].tableData[0].oid || this.sumDateTableData[k].tableData[0].content)  == null){
                                            this.sumDateTableData[k].tableData.shift();
                                        }
                                    }
                                }
                                else if(sum_tableData[i-1].status=="comment"){
                                    if (sum_tableData[i].modifyTimeDay==sum_tableData[i-1].modifyTimeDay) {
                                        // this.sumDateTableData[k].date = sum_tableData[i].modifyTime;
                                        this.sumDateTableData[k].tableData.push(sum_tableData[i]);
                                        if ((this.sumDateTableData[k].tableData[0].oid || this.sumDateTableData[k].tableData[0].content)  == null){
                                            this.sumDateTableData[k].tableData.shift();
                                        }
                                    } else{
                                        k++;
                                        //sumDateTableData增加
                                        this.sumDateTableData.push({
                                            date:"",
                                            tableData:[{}]
                                        })
                                        this.sumDateTableData[k].date = sum_tableData[i].modifyTimeDay;
                                        this.sumDateTableData[k].tableData.push(sum_tableData[i]);
                                        if ((this.sumDateTableData[k].tableData[0].oid || this.sumDateTableData[k].tableData[0].content)  == null){
                                            this.sumDateTableData[k].tableData.shift();
                                        }
                                    }
                                }
                                break;
                            }
                            case "confirmed":{
                                if(i==0){
                                    this.sumDateTableData[k].date = sum_tableData[i].acceptTimeDay;
                                    this.sumDateTableData[k].tableData.push(sum_tableData[i]);
                                    if ((this.sumDateTableData[k].tableData[0].oid || this.sumDateTableData[k].tableData[0].content)  == null){
                                        this.sumDateTableData[k].tableData.shift();
                                    }
                                }
                                else if (sum_tableData[i-1].status=="unchecked"){
                                    if  (sum_tableData[i].acceptTimeDay==sum_tableData[i-1].modifyTimeDay) {
                                        // this.sumDateTableData[k].date = sum_tableData[i].modifyTime;
                                        this.sumDateTableData[k].tableData.push(sum_tableData[i]);
                                        if ((this.sumDateTableData[k].tableData[0].oid || this.sumDateTableData[k].tableData[0].content)  == null){
                                            this.sumDateTableData[k].tableData.shift();
                                        }
                                    }else{
                                        k++;
                                        //sumDateTableData增加
                                        this.sumDateTableData.push({
                                            date:"",
                                            tableData:[{}]
                                        })
                                        this.sumDateTableData[k].date = sum_tableData[i].acceptTimeDay;
                                        this.sumDateTableData[k].tableData.push(sum_tableData[i]);
                                        if ((this.sumDateTableData[k].tableData[0].oid || this.sumDateTableData[k].tableData[0].content)  == null){
                                            this.sumDateTableData[k].tableData.shift();
                                        }
                                    }
                                }
                                else if(sum_tableData[i-1].status=="confirmed"){
                                    if (sum_tableData[i].acceptTimeDay==sum_tableData[i-1].acceptTimeDay) {
                                        // this.sumDateTableData[k].date = sum_tableData[i].modifyTime;
                                        this.sumDateTableData[k].tableData.push(sum_tableData[i]);
                                        if ((this.sumDateTableData[k].tableData[0].oid || this.sumDateTableData[k].tableData[0].content)  == null){
                                            this.sumDateTableData[k].tableData.shift();
                                        }
                                    }else{
                                        k++;
                                        //sumDateTableData增加
                                        this.sumDateTableData.push({
                                            date:"",
                                            tableData:[{}]
                                        })
                                        this.sumDateTableData[k].date = sum_tableData[i].acceptTimeDay;
                                        this.sumDateTableData[k].tableData.push(sum_tableData[i]);
                                        if ((this.sumDateTableData[k].tableData[0].oid || this.sumDateTableData[k].tableData[0].content)  == null){
                                            this.sumDateTableData[k].tableData.shift();
                                        }
                                    }
                                }
                                else if(sum_tableData[i-1].status=="reject"){
                                    if (sum_tableData[i].acceptTimeDay==sum_tableData[i-1].rejectTimeDay) {
                                        // this.sumDateTableData[k].date = sum_tableData[i].modifyTime;
                                        this.sumDateTableData[k].tableData.push(sum_tableData[i]);
                                        if ((this.sumDateTableData[k].tableData[0].oid || this.sumDateTableData[k].tableData[0].content)  == null){
                                            this.sumDateTableData[k].tableData.shift();
                                        }
                                    } else{
                                        k++;
                                        //sumDateTableData增加
                                        this.sumDateTableData.push({
                                            date:"",
                                            tableData:[{}]
                                        })
                                        this.sumDateTableData[k].date = sum_tableData[i].acceptTimeDay;
                                        this.sumDateTableData[k].tableData.push(sum_tableData[i]);
                                        if ((this.sumDateTableData[k].tableData[0].oid || this.sumDateTableData[k].tableData[0].content)  == null){
                                            this.sumDateTableData[k].tableData.shift();
                                        }
                                    }
                                }
                                else if(sum_tableData[i-1].status=="comment"){
                                    if (sum_tableData[i].acceptTimeDay==sum_tableData[i-1].modifyTimeDay) {
                                        // this.sumDateTableData[k].date = sum_tableData[i].modifyTime;
                                        this.sumDateTableData[k].tableData.push(sum_tableData[i]);
                                        if ((this.sumDateTableData[k].tableData[0].oid || this.sumDateTableData[k].tableData[0].content)  == null){
                                            this.sumDateTableData[k].tableData.shift();
                                        }
                                    } else{
                                        k++;
                                        //sumDateTableData增加
                                        this.sumDateTableData.push({
                                            date:"",
                                            tableData:[{}]
                                        })
                                        this.sumDateTableData[k].date = sum_tableData[i].acceptTimeDay;
                                        this.sumDateTableData[k].tableData.push(sum_tableData[i]);
                                        if ((this.sumDateTableData[k].tableData[0].oid || this.sumDateTableData[k].tableData[0].content)  == null){
                                            this.sumDateTableData[k].tableData.shift();
                                        }
                                    }
                                }
                                break;
                            }
                            case "reject":{
                                if(i==0){
                                    this.sumDateTableData[k].date = sum_tableData[i].rejectTimeDay;
                                    this.sumDateTableData[k].tableData.push(sum_tableData[i]);
                                    if ((this.sumDateTableData[k].tableData[0].oid || this.sumDateTableData[k].tableData[0].content)  == null){
                                        this.sumDateTableData[k].tableData.shift();
                                    }
                                }
                                else if (sum_tableData[i-1].status=="unchecked"){
                                    if  (sum_tableData[i].rejectTimeDay==sum_tableData[i-1].modifyTimeDay) {
                                        // this.sumDateTableData[k].date = sum_tableData[i].modifyTime;
                                        this.sumDateTableData[k].tableData.push(sum_tableData[i]);
                                        if ((this.sumDateTableData[k].tableData[0].oid || this.sumDateTableData[k].tableData[0].content)  == null){
                                            this.sumDateTableData[k].tableData.shift();
                                        }
                                    }else{
                                        k++;
                                        //sumDateTableData增加
                                        this.sumDateTableData.push({
                                            date:"",
                                            tableData:[{}]
                                        })
                                        this.sumDateTableData[k].date = sum_tableData[i].rejectTimeDay;
                                        this.sumDateTableData[k].tableData.push(sum_tableData[i]);
                                        if ((this.sumDateTableData[k].tableData[0].oid || this.sumDateTableData[k].tableData[0].content)  == null){
                                            this.sumDateTableData[k].tableData.shift();
                                        }
                                    }
                                }
                                else if(sum_tableData[i-1].status=="confirmed"){
                                    if (sum_tableData[i].rejectTimeDay==sum_tableData[i-1].acceptTimeDay) {
                                        // this.sumDateTableData[k].date = sum_tableData[i].modifyTime;
                                        this.sumDateTableData[k].tableData.push(sum_tableData[i]);
                                        if ((this.sumDateTableData[k].tableData[0].oid || this.sumDateTableData[k].tableData[0].content)  == null){
                                            this.sumDateTableData[k].tableData.shift();
                                        }
                                    }else{
                                        k++;
                                        //sumDateTableData增加
                                        this.sumDateTableData.push({
                                            date:"",
                                            tableData:[{}]
                                        })
                                        this.sumDateTableData[k].date = sum_tableData[i].rejectTimeDay;
                                        this.sumDateTableData[k].tableData.push(sum_tableData[i]);
                                        if ((this.sumDateTableData[k].tableData[0].oid || this.sumDateTableData[k].tableData[0].content)  == null){
                                            this.sumDateTableData[k].tableData.shift();
                                        }
                                    }
                                }
                                else if(sum_tableData[i-1].status=="reject"){
                                    if (sum_tableData[i].rejectTimeDay==sum_tableData[i-1].rejectTimeDay) {
                                        // this.sumDateTableData[k].date = sum_tableData[i].modifyTime;
                                        this.sumDateTableData[k].tableData.push(sum_tableData[i]);
                                        if ((this.sumDateTableData[k].tableData[0].oid || this.sumDateTableData[k].tableData[0].content)  == null){
                                            this.sumDateTableData[k].tableData.shift();
                                        }
                                    } else{
                                        k++;
                                        //sumDateTableData增加
                                        this.sumDateTableData.push({
                                            date:"",
                                            tableData:[{}]
                                        })
                                        this.sumDateTableData[k].date = sum_tableData[i].rejectTimeDay;
                                        this.sumDateTableData[k].tableData.push(sum_tableData[i]);
                                        if ((this.sumDateTableData[k].tableData[0].oid || this.sumDateTableData[k].tableData[0].content)  == null){
                                            this.sumDateTableData[k].tableData.shift();
                                        }
                                    }
                                }
                                else if(sum_tableData[i-1].status=="comment"){
                                    if (sum_tableData[i].rejectTimeDay==sum_tableData[i-1].modifyTimeDay) {
                                        // this.sumDateTableData[k].date = sum_tableData[i].modifyTime;
                                        this.sumDateTableData[k].tableData.push(sum_tableData[i]);
                                        if ((this.sumDateTableData[k].tableData[0].oid || this.sumDateTableData[k].tableData[0].content)  == null){
                                            this.sumDateTableData[k].tableData.shift();
                                        }
                                    } else{
                                        k++;
                                        //sumDateTableData增加
                                        this.sumDateTableData.push({
                                            date:"",
                                            tableData:[{}]
                                        })
                                        this.sumDateTableData[k].date = sum_tableData[i].rejectTimeDay;
                                        this.sumDateTableData[k].tableData.push(sum_tableData[i]);
                                        if ((this.sumDateTableData[k].tableData[0].oid || this.sumDateTableData[k].tableData[0].content)  == null){
                                            this.sumDateTableData[k].tableData.shift();
                                        }
                                    }
                                }
                                break;
                            }
                            case "comment":{
                                if(i==0){
                                    this.sumDateTableData[k].date = sum_tableData[i].modifyTimeDay;
                                    this.sumDateTableData[k].tableData.push(sum_tableData[i]);
                                    if ((this.sumDateTableData[k].tableData[0].oid || this.sumDateTableData[k].tableData[0].content)  == null){
                                        this.sumDateTableData[k].tableData.shift();
                                    }
                                }
                                else if (sum_tableData[i-1].status=="unchecked"){
                                    if  (sum_tableData[i].modifyTimeDay==sum_tableData[i-1].modifyTimeDay) {
                                        // this.sumDateTableData[k].date = sum_tableData[i].modifyTime;
                                        this.sumDateTableData[k].tableData.push(sum_tableData[i]);
                                        if ((this.sumDateTableData[k].tableData[0].oid || this.sumDateTableData[k].tableData[0].content)  == null){
                                            this.sumDateTableData[k].tableData.shift();
                                        }
                                    }else{
                                        k++;
                                        //sumDateTableData增加
                                        this.sumDateTableData.push({
                                            date:"",
                                            tableData:[{}]
                                        })
                                        this.sumDateTableData[k].date = sum_tableData[i].modifyTimeDay;
                                        this.sumDateTableData[k].tableData.push(sum_tableData[i]);
                                        if ((this.sumDateTableData[k].tableData[0].oid || this.sumDateTableData[k].tableData[0].content)  == null){
                                            this.sumDateTableData[k].tableData.shift();
                                        }
                                    }
                                }
                                else if(sum_tableData[i-1].status=="confirmed"){
                                    if (sum_tableData[i].modifyTimeDay==sum_tableData[i-1].acceptTimeDay) {
                                        // this.sumDateTableData[k].date = sum_tableData[i].modifyTime;
                                        this.sumDateTableData[k].tableData.push(sum_tableData[i]);
                                        if ((this.sumDateTableData[k].tableData[0].oid || this.sumDateTableData[k].tableData[0].content)  == null){
                                            this.sumDateTableData[k].tableData.shift();
                                        }
                                    }else{
                                        k++;
                                        //sumDateTableData增加
                                        this.sumDateTableData.push({
                                            date:"",
                                            tableData:[{}]
                                        })
                                        this.sumDateTableData[k].date = sum_tableData[i].modifyTimeDay;
                                        this.sumDateTableData[k].tableData.push(sum_tableData[i]);
                                        if ((this.sumDateTableData[k].tableData[0].oid || this.sumDateTableData[k].tableData[0].content)  == null){
                                            this.sumDateTableData[k].tableData.shift();
                                        }
                                    }
                                }
                                else if(sum_tableData[i-1].status=="reject"){
                                    if (sum_tableData[i].modifyTimeDay==sum_tableData[i-1].rejectTimeDay) {
                                        // this.sumDateTableData[k].date = sum_tableData[i].modifyTime;
                                        this.sumDateTableData[k].tableData.push(sum_tableData[i]);
                                        if ((this.sumDateTableData[k].tableData[0].oid || this.sumDateTableData[k].tableData[0].content)  == null){
                                            this.sumDateTableData[k].tableData.shift();
                                        }
                                    } else{
                                        k++;
                                        //sumDateTableData增加
                                        this.sumDateTableData.push({
                                            date:"",
                                            tableData:[{}]
                                        })
                                        this.sumDateTableData[k].date = sum_tableData[i].modifyTimeDay;
                                        this.sumDateTableData[k].tableData.push(sum_tableData[i]);
                                        if ((this.sumDateTableData[k].tableData[0].oid || this.sumDateTableData[k].tableData[0].content)  == null){
                                            this.sumDateTableData[k].tableData.shift();
                                        }
                                    }
                                }
                                else if(sum_tableData[i-1].status=="comment"){
                                    if (sum_tableData[i].modifyTimeDay==sum_tableData[i-1].modifyTimeDay) {
                                        // this.sumDateTableData[k].date = sum_tableData[i].modifyTime;
                                        this.sumDateTableData[k].tableData.push(sum_tableData[i]);
                                        if ((this.sumDateTableData[k].tableData[0].oid || this.sumDateTableData[k].tableData[0].content)  == null){
                                            this.sumDateTableData[k].tableData.shift();
                                        }
                                    } else{
                                        k++;
                                        //sumDateTableData增加
                                        this.sumDateTableData.push({
                                            date:"",
                                            tableData:[{}]
                                        })
                                        this.sumDateTableData[k].date = sum_tableData[i].modifyTimeDay;
                                        this.sumDateTableData[k].tableData.push(sum_tableData[i]);
                                        if ((this.sumDateTableData[k].tableData[0].oid || this.sumDateTableData[k].tableData[0].content) == null){
                                            this.sumDateTableData[k].tableData.shift();
                                        }
                                    }
                                }
                                break;
                            }
                        }
                    }


                    //为时间线涂色
                    for (let i=0;i<this.sum_tableData.length;i++){
                        // if (this.sum_tableData[i].status == "confirmed") {
                        //     this.sum_tableData[i].color = '#0bbd87';
                        // }else if (this.sum_tableData[i].status == "reject") {
                        //     this.sum_tableData[i].color = '#CF2018';
                        // }else {
                        //     this.sum_tableData[i].color = '#20D1D4';
                        // }
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
                    }


                    this.model_tableData1_length = this.model_tableData1.length;
                    this.model_tableData2_length = this.model_tableData2.length;
                    this.model_tableData3_length = this.model_tableData3.length;
                    this.community_tableData1_length = this.community_tableData1.length;
                    this.community_tableData2_length = this.community_tableData2.length;
                    this.community_tableData3_length = this.community_tableData3.length;
                    this.theme_tableData1_length = this.theme_tableData1.length;
                    this.theme_tableData2_length = this.theme_tableData2.length;
                    this.theme_tableData3_length = this.theme_tableData3.length;


                    this.table_length_sum += (this.model_tableData1_length+this.community_tableData1_length+this.theme_tableData1_length);
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
        view_theme(event){
            let refLink=$(".viewBtn_theme");
            for(i=0;i<refLink.length;i++){
                if(event.currentTarget===refLink[i]){
                   window.open("/theme/uncheck/"+this.theme_tableData1[i].oid);
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
        view_theme_accept(event){
            let refLink=$(".viewAcceptBtn_theme");
            for(i=0;i<refLink.length;i++){
                if(event.currentTarget===refLink[i]){
                    window.open("/theme/accept/"+this.theme_tableData2[i].oid);
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
        view_theme_reject(event){
            let refLink=$(".viewRejectBtn_theme");
            for(i=0;i<refLink.length;i++){
                if(event.currentTarget===refLink[i]){
                    window.open("/theme/reject/"+this.theme_tableData3[i].oid);
                }
            }
            //console.log(event.currentTarget);
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
        accept_theme(event){
            let accepts=$(".accept_theme");

            for(i=0;i<accepts.length;i++){
                if(event.currentTarget===accepts[i]){
                    let tableItem=this.theme_tableData1[i];
                    let data={
                        oid:tableItem.oid,
                        themeOid:tableItem.themeOid,
                    };
                    $.ajax({
                        type:"POST",
                        url:"/theme/accept",
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
        },
        reject_theme(event){
            let rejects=$(".reject_theme");

            for(i=0;i<rejects.length;i++){
                if(event.currentTarget===rejects[i]){
                    let tableItem=this.theme_tableData1[i];
                    let data={
                        oid:tableItem.oid,
                        themeOid:tableItem.themeOid,
                    }
                    $.ajax({
                        type:"POST",
                        url:"/theme/reject",
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
    }
})