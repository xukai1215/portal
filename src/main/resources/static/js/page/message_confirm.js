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
            model_tableData1_self:[],
            model_tableData2_self:[],
            model_tableData3_self:[],
            model_tableData1_length:0,
            model_tableData2_length:0,
            model_tableData3_length:0,
            model_tableData1_length_self:0,
            // model_tableData2_length_self:0,
            // model_tableData3_length_self:0,

            edit_model_tableData:[],//用于获取model的version数据，用于显示谁编辑了什么
            community_tableData1:[],
            community_tableData2:[],
            community_tableData3:[],
            community_tableData1_length:0,
            community_tableData2_length:0,
            community_tableData3_length:0,
            community_tableData1_self:[],
            community_tableData2_self:[],
            community_tableData3_self:[],
            community_tableData1_length_self:0,
            // community_tableData2_length_self:0,
            // community_tableData3_length_self:0,
            edit_community_tableData:[],//用于获取community的version数据，用于显示谁编辑了什么
            edit_theme_tableData:[],

            theme_tableData1:[],
            theme_tableData2:[],
            theme_tableData3:[],
            theme_tableData1_length:0,
            theme_tableData2_length:0,
            theme_tableData3_length:0,

            theme_tableData1_self:[],
            theme_tableData2_self:[],
            theme_tableData3_self:[],
            theme_tableData1_length_self:0,
            // theme_tableData2_length_self:0,
            // theme_tableData3_length_self:0,


            table_length_sum:0,
            table_length_sum_self:0,
            version_sum:0,
            model_self:0,
            community_self:0,
            theme_self:0,
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
            sumComment1:[{
                date:"",
                comment:[{}]
            }],
            sumComment2:[{
                date:"",
                comment:[{}]
            }],
            unread:0,
            model_accept_unread:0,
            model_reject_unread:0,
            community_accept_unread:0,
            community_reject_unread:0,
            theme_accept_unread:0,
            theme_reject_unread:0,

            loading: true,

            await:false,

            tabPosition: 'left',
            // sumDateTableData用于存储以时间为主键的数据,主要用于展示时间线，date为时间，tableData用来存储sumtabledata里的数据
            sumDateTableData:[{
                date:"",
                color:"",
                tableData:[{
                }]
            }],
            timeLineColor:'#409EFF',
            timeLineColor1:'#fe7708',
            stretch:true,
            userOid:"",
            activeColor: '#f5f5dc',
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
                this.userOid = this.comments.pop();
                let num=0;
                for (let i=0;i<this.comments.length;i++){
                    if (this.comments[i].replier==null||this.comments[i].author.oid == this.userOid){
                        this.comments1.push(this.comments[i]);
                    } else {
                        if (this.comments[i].readStatus==0) {
                            this.comments[i].color = '#f5f5dc';
                            num++;
                        }else {
                            this.comments[i].color = '#ffffff';
                        }
                        this.comments2.push(this.comments[i]);
                    }
                }
                this.unread = num;
                // this.comments2Length = this.comments2.length;

                //将comment内容纳入以时间为主键的sumComment中
                let k=0;
                for (let i=0;i<this.comments1.length;i++){
                    if (i==0){
                        this.sumComment1[k].date = this.comments1[i].modifyTimeDay;
                        this.sumComment1[k].comment.push(this.comments1[i]);
                        if (this.sumComment1[k].comment[0].content == null){
                            this.sumComment1[k].comment.shift();
                        }
                    } else if (this.comments1[i].modifyTimeDay == this.comments1[i-1].modifyTimeDay){
                        this.sumComment1[k].comment.push(this.comments1[i]);
                        if (this.sumComment1[k].comment[0].content == null) {
                            this.sumComment1[k].comment.shift();
                        }
                    } else {
                        k++;
                        this.sumComment1.push({
                            date:"",
                            comment:[{}]
                        })
                        this.sumComment1[k].date = this.comments1[i].modifyTimeDay;
                        this.sumComment1[k].comment.push(this.comments1[i]);
                        if (this.sumComment1[k].comment[0].content == null) {
                            this.sumComment1[k].comment.shift();
                        }
                    }
                }
                let k1=0;
                for (let i=0;i<this.comments2.length;i++){
                    if (i==0){
                        this.sumComment2[k1].date = this.comments2[i].modifyTimeDay;
                        this.sumComment2[k1].color = this.comments2[i].color;
                        this.sumComment2[k1].comment.push(this.comments2[i]);
                        if (this.sumComment2[k1].comment[0].content == null){
                            this.sumComment2[k1].comment.shift();
                        }
                    } else if (this.comments2[i].modifyTimeDay == this.comments2[i-1].modifyTimeDay){
                        this.sumComment2[k1].comment.push(this.comments2[i]);
                        this.sumComment2[k1].color = this.comments2[i].color;//更新为最新评论所代表的color
                        if (this.sumComment2[k1].comment[0].content == null) {
                            this.sumComment2[k1].comment.shift();
                        }
                    } else {
                        k1++;
                        this.sumComment2.push({
                            date:"",
                            comment:[{}]
                        })
                        this.sumComment2[k1].date = this.comments2[i].modifyTimeDay;
                        this.sumComment2[k1].color = this.comments2[i].color;
                        this.sumComment2[k1].comment.push(this.comments2[i]);
                        if (this.sumComment2[k1].comment[0].content == null) {
                            this.sumComment2[k1].comment.shift();
                        }
                    }
                }
                if (this.sumComment1[0].date == "") {
                    this.sumComment1.shift();
                }
                if (this.sumComment2[0].date == "") {
                    this.sumComment2.shift();
                }

                // if (this.sumComment1.length == 0){
                //     $(".commentOverView").show();
                // } else {
                //     $(".commentOverView").hide();
                // }
                // if (this.sumComment2.length == 0){
                //     $(".replyOverView").show();
                // } else {
                //     $(".replyOverView").hide();
                // }
            })
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
            this.await = true;
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
                            // this.message_num++;
                        }else if (json.data.uncheck[i].type == "concept" || json.data.uncheck[i].type == "spatialReference"||json.data.uncheck[i].type == "unit"||json.data.uncheck[i].type == "template"){
                            this.community_tableData1.push(json.data.uncheck[i]);
                            // this.sum_tableData.push(json.data.uncheck[i]);
                            // this.message_num++;
                        }else if (json.data.uncheck[i].type == "theme") {
                            this.theme_tableData1.push(json.data.uncheck[i]);
                            // this.sum_tableData.push(json.data.uncheck[i]);
                            // this.message_num++;
                        }
                    }

                    //self
                    let model_accept_num = 0;
                    let community_accept_num = 0;
                    let theme_accept_num = 0;
                    for (let i=0;i<json.data.accept_self.length;i++){
                        if (json.data.accept_self[i].type == "modelItem" || json.data.accept_self[i].type == "conceptualModel"||json.data.accept_self[i].type == "logicalModel"||json.data.accept_self[i].type == "computableModel"){
                            //涂色
                            this.model_tableData2_self.push(json.data.accept_self[i]);
                            if (json.data.accept_self[i].readStatus == 0){
                                model_accept_num++;
                            }
                            //this.sum_tableData.push(json.data.accept_self[i]);
                        }else if (json.data.accept_self[i].type == "concept" || json.data.accept_self[i].type == "spatialReference"||json.data.accept_self[i].type == "unit"||json.data.accept_self[i].type == "template") {
                            this.community_tableData2_self.push(json.data.accept_self[i]);
                            if (json.data.accept_self[i].readStatus == 0){
                                community_accept_num ++;
                            }
                            //this.sum_tableData.push(json.data.accept[i]);
                        }else if (json.data.accept_self[i].type == "theme") {
                            this.theme_tableData2_self.push(json.data.accept_self[i]);
                            if (json.data.accept_self[i].readStatus == 0){
                                theme_accept_num ++;
                            }
                            //this.sum_tableData.push(json.data.accept[i]);
                        }
                    }
                    this.model_accept_unread = model_accept_num;
                    this.community_accept_unread = community_accept_num;
                    this.theme_accept_unread = theme_accept_num;


                    let model_reject_num = 0;
                    let community_reject_num = 0;
                    let theme_reject_num = 0;
                    for (let i=0;i<json.data.reject_self.length;i++){
                        if (json.data.reject_self[i].type == "modelItem" || json.data.reject_self[i].type == "conceptualModel"||json.data.reject_self[i].type == "logicalModel"||json.data.reject_self[i].type == "computableModel"){
                            this.model_tableData3_self.push(json.data.reject_self[i]);
                            if (json.data.reject_self[i].readStatus == 0) {
                                model_reject_num++;
                            }
                            //this.sum_tableData.push(json.data.reject[i]);
                        }else if (json.data.reject_self[i].type == "concept" || json.data.reject_self[i].type == "spatialReference"||json.data.reject_self[i].type == "unit"||json.data.reject_self[i].type == "template"){
                            this.community_tableData3_self.push(json.data.reject_self[i]);
                            if (json.data.reject_self[i].readStatus == 0){
                                community_reject_num++;
                            }
                            //this.sum_tableData.push(json.data.reject[i]);
                        }else if (json.data.reject_self[i].type == "theme") {
                            this.theme_tableData3_self.push(json.data.reject_self[i]);
                            if (json.data.reject_self[i].readStatus == 0){
                                theme_reject_num++;
                            }
                            //this.sum_tableData.push(json.data.reject[i]);
                        }
                    }
                    this.model_reject_unread = model_reject_num;
                    this.community_reject_unread = community_reject_num;
                    this.theme_reject_unread = theme_reject_num;

                    for (let i=0;i<json.data.uncheck_self.length;i++){
                        if (json.data.uncheck_self[i].type == "modelItem" || json.data.uncheck_self[i].type == "conceptualModel"||json.data.uncheck_self[i].type == "logicalModel"||json.data.uncheck_self[i].type == "computableModel"){
                            this.model_tableData1_self.push(json.data.uncheck_self[i]);
                            //this.sum_tableData.push(json.data.uncheck[i]);
                           // this.message_num++;
                        }else if (json.data.uncheck_self[i].type == "concept" || json.data.uncheck_self[i].type == "spatialReference"||json.data.uncheck_self[i].type == "unit"||json.data.uncheck_self[i].type == "template"){
                            this.community_tableData1_self.push(json.data.uncheck_self[i]);
                            // this.sum_tableData.push(json.data.uncheck[i]);
                            //this.message_num++;
                        }else if (json.data.uncheck_self[i].type == "theme") {
                            this.theme_tableData1_self.push(json.data.uncheck_self[i]);
                            // this.sum_tableData.push(json.data.uncheck[i]);
                            //this.message_num++;
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

                    //对version中表格进行排序
                    this.bubbleSort(this.model_tableData1);
                    this.bubbleSort(this.model_tableData2);
                    this.bubbleSort(this.model_tableData3);
                    this.bubbleSort(this.community_tableData1);
                    this.bubbleSort(this.community_tableData2);
                    this.bubbleSort(this.community_tableData3);
                    this.bubbleSort(this.theme_tableData1);
                    this.bubbleSort(this.theme_tableData2);
                    this.bubbleSort(this.theme_tableData3);

                    this.bubbleSort(this.model_tableData1_self);
                    this.bubbleSort(this.model_tableData2_self);
                    this.bubbleSort(this.model_tableData3_self);
                    this.bubbleSort(this.community_tableData1_self);
                    this.bubbleSort(this.community_tableData2_self);
                    this.bubbleSort(this.community_tableData3_self);
                    this.bubbleSort(this.theme_tableData1_self);
                    this.bubbleSort(this.theme_tableData2_self);
                    this.bubbleSort(this.theme_tableData3_self);

                    this.model_tableData1.reverse();
                    this.model_tableData2.reverse();
                    this.model_tableData3.reverse();
                    this.community_tableData1.reverse();
                    this.community_tableData2.reverse();
                    this.community_tableData3.reverse();
                    this.theme_tableData1.reverse();
                    this.theme_tableData2.reverse();
                    this.theme_tableData3.reverse();

                    this.model_tableData1_self.reverse();
                    this.model_tableData2_self.reverse();
                    this.model_tableData3_self.reverse();
                    this.community_tableData1_self.reverse();
                    this.community_tableData2_self.reverse();
                    this.community_tableData3_self.reverse();
                    this.theme_tableData1_self.reverse();
                    this.theme_tableData2_self.reverse();
                    this.theme_tableData3_self.reverse();


                    this.sum_tableData = this.sum_tableData.concat(this.comments);
                    //对sum_tableData进行冒泡排序
                    this.bubbleSort(this.sum_tableData);

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

                    this.model_tableData1_length_self = this.model_tableData1_self.length;
                    // this.model_tableData2_length_self = this.model_tableData2_self.length;
                    // this.model_tableData3_length_self = this.model_tableData3_self.length;
                    this.community_tableData1_length_self = this.community_tableData1_self.length;
                    // this.community_tableData2_length_self = this.community_tableData2_self.length;
                    // this.community_tableData3_length_self = this.community_tableData3_self.length;
                    this.theme_tableData1_length_self = this.theme_tableData1_self.length;
                    // this.theme_tableData2_length_self = this.theme_tableData2_self.length;
                    // this.theme_tableData3_length_self = this.theme_tableData3_self.length;


                    this.table_length_sum = (this.model_tableData1_length+this.community_tableData1_length+this.theme_tableData1_length);
                    this.table_length_sum_self = (this.model_accept_unread+this.model_reject_unread+this.community_accept_unread+this.community_reject_unread+this.theme_accept_unread+this.theme_reject_unread);
                    this.model_self = (this.model_accept_unread+this.model_reject_unread);
                    this.community_self = (this.community_accept_unread+this.community_reject_unread);
                    this.theme_self = (this.theme_accept_unread+this.theme_reject_unread);
                    this.version_sum = this.table_length_sum + this.table_length_sum_self;


                    console.log(this.sum_tableData);
                    if (this.sumDateTableData[0].date==""){
                        this.sumDateTableData.shift();
                    }
                    if (this.sumDateTableData.length == 0){
                        $(".overview").show();
                    } else {
                        $(".overview").hide();
                    }


                    if (this.sumComment1.length == 0){
                        $(".commentOverView").show();
                    } else {
                        $(".commentOverView").hide();
                    }
                    if (this.sumComment2.length == 0){
                        $(".replyOverView").show();
                    } else {
                        $(".replyOverView").hide();
                    }
                    this.await = false;
                }
            })
        },
        tableRowClassName({row, rowIndex}) {
            if (row.readStatus === 1) {
                return 'readed';
            } else if (row.readStatus === 0) {
                return 'unread';
            }
            return '';
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
        view_self(event){
            let refLink=$(".viewBtn_self");
            for(i=0;i<refLink.length;i++){
                if(event.currentTarget===refLink[i]){
                    if(this.model_tableData1_self[i].type=="modelItem"){
                        window.open("/version/"+this.model_tableData1_self[i].type+"/"+this.model_tableData1_self[i].originOid);
                    }
                    else{
                        window.open("/version/"+this.model_tableData1_self[i].type+"/"+this.model_tableData1_self[i].oid);
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
        view1_self(event){
            let refLink=$(".viewBtn1_self");
            for(i=0;i<refLink.length;i++){
                if(event.currentTarget===refLink[i]){
                   window.open("/version/"+this.community_tableData1_self[i].type+"/"+this.community_tableData1_self[i].oid);
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
        view_theme_self(event){
            let refLink=$(".viewBtn_theme_self");
            for(i=0;i<refLink.length;i++){
                if(event.currentTarget===refLink[i]){
                   window.open("/theme/uncheck/"+this.theme_tableData1_self[i].oid);
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
        viewAccept_self(event){
            let refLink=$(".viewAcceptBtn_self");
            for(i=0;i<refLink.length;i++){
                if(event.currentTarget===refLink[i]){
                    window.open("/version/history/"+this.model_tableData2_self[i].type+"/"+this.model_tableData2_self[i].oid);
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
        viewAccept1_self(event){
            let refLink=$(".viewAcceptBtn1_self");
            for(i=0;i<refLink.length;i++){
                if(event.currentTarget===refLink[i]){
                    window.open("/version/history/"+this.community_tableData2_self[i].type+"/"+this.community_tableData2_self[i].oid);
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
        view_theme_accept_self(event){
            let refLink=$(".viewAcceptBtn_theme_self");
            for(i=0;i<refLink.length;i++){
                if(event.currentTarget===refLink[i]){
                    window.open("/theme/accept/"+this.theme_tableData2_self[i].oid);
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
        viewReject_self(event){
            let refLink=$(".viewRejectBtn_self");
            for(i=0;i<refLink.length;i++){
                if(event.currentTarget===refLink[i]){
                    window.open("/version/history/"+this.model_tableData3_self[i].type+"/"+this.model_tableData3_self[i].oid);
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
        viewReject1_self(event){
            let refLink=$(".viewRejectBtn1_self");
            for(i=0;i<refLink.length;i++){
                if(event.currentTarget===refLink[i]){
                    window.open("/version/history/"+this.community_tableData3_self[i].type+"/"+this.community_tableData3_self[i].oid);
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
        view_theme_reject_self(event){
            let refLink=$(".viewRejectBtn_theme_self");
            for(i=0;i<refLink.length;i++){
                if(event.currentTarget===refLink[i]){
                    window.open("/theme/reject/"+this.theme_tableData3_self[i].oid);
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
                        modifier:tableItem.modifier.modifier,
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
                        modifier:tableItem.modifier.modifier,
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
                        modifier:tableItem.modifier.modifier,
                        oid:tableItem.oid,
                        themeOid:tableItem.themeOid,
                        modifierOid:tableItem.modifierOid,
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
        //冒泡排序
        bubbleSort(table){
            for (let i=0;i<table.length;i++){
                for (let j = table.length-1;j>i;j--){
                    if ((table[j].modifyTime||table[j].date)<(table[j-1].modifyTime||table[j-1].date)){
                        let temp = table[j];
                        table[j] = table[j-1];
                        table[j-1] = temp;
                    }
                } 
            } 
        },
        //comment已阅效果实现
        commentReaded(tab, event){
            if (tab.label == "Reply") {
                //首先判断reply的消息数目，如果为0就不需要进行下面的操作了，如果不为0则进行各种后台操作
                if (this.unread != 0){
                    $.ajax({
                        url:"/comment/commentReaded",
                        type:"POST",
                        data:{
                          comment_num:this.unread
                        },
                        success: (json) => {
                            if (json=="ok"){
                                this.unread = 0;
                                this.message_num = this.version_sum + this.unread;
                                $("#headBar .el-badge__content").text(this.message_num);
                                // this.timeLineColor1 = '#409EFF';
                                console.log("success");
                            }
                        }
                    })
                }
            }
        },
        MyEditionModelReaded(tab, event){
            if (tab.label == "Accepted version") {
                //首先将该table中的oid组取出
                var oids =[{}];
                for (let i=0;i<this.model_tableData2_self.length;i++){
                    if (this.model_tableData2_self[i].readStatus == 0) {
                        var object={};
                        object.oid = this.model_tableData2_self[i].oid;
                        object.type = this.model_tableData2_self[i].type;
                        oids.push(object);
                    }
                }
                oids.shift();
                //首先判断Accept version的消息数目，如果为0就不需要进行下面的操作了，如果不为0则进行各种后台操作
                if (this.model_accept_unread != 0){
                    $.ajax({
                        url:"/version/MyEditionReaded",
                        type:"POST",
                        // dataType: "json",
                        contentType:"application/json",
                        data:JSON.stringify({
                            // type:"accept",
                            my_edition_num:this.model_accept_unread,
                            oids:oids,
                        }),
                        // dataType: "json",
                        success: (json) => {
                            if (json=="ok"){
                                this.model_accept_unread = 0;
                                this.model_self = (this.model_accept_unread+this.model_reject_unread);
                                this.table_length_sum_self = (this.model_accept_unread+this.model_reject_unread+this.community_accept_unread+this.community_reject_unread+this.theme_accept_unread+this.theme_reject_unread);
                                this.version_sum = this.table_length_sum + this.table_length_sum_self;
                                this.message_num = this.version_sum + this.unread;
                                $("#headBar .el-badge__content").text(this.message_num);
                                console.log("success");
                            }
                        }
                    })
                }
            }else if (tab.label == "Rejected version"){
                //首先将该table中的oid组取出
                var oids =[{}];
                for (let i=0;i<this.model_tableData3_self.length;i++){
                    if (this.model_tableData3_self[i].readStatus == 0) {
                        var object={};
                        object.oid = this.model_tableData3_self[i].oid;
                        object.type = this.model_tableData3_self[i].type;
                        oids.push(object);
                    }
                }
                oids.shift();
                //首先判断Accept version的消息数目，如果为0就不需要进行下面的操作了，如果不为0则进行各种后台操作
                if (this.model_reject_unread != 0){
                    $.ajax({
                        url:"/version/MyEditionReaded",
                        type:"POST",
                        // dataType: "json",
                        contentType:"application/json",
                        data:JSON.stringify({
                            my_edition_num:this.model_reject_unread,
                            oids:oids,
                        }),
                        // dataType: "json",
                        success: (json) => {
                            if (json=="ok"){
                                this.model_reject_unread = 0;
                                this.model_self = (this.model_accept_unread+this.model_reject_unread);
                                this.table_length_sum_self = (this.model_accept_unread+this.model_reject_unread+this.community_accept_unread+this.community_reject_unread+this.theme_accept_unread+this.theme_reject_unread);
                                this.version_sum = this.table_length_sum + this.table_length_sum_self;
                                this.message_num = this.version_sum + this.unread;
                                $("#headBar .el-badge__content").text(this.message_num);
                                console.log("success");
                            }
                        }
                    })
                }
            }
        },
        MyEditionCommunityReaded(tab, event){
            if (tab.label == "Accepted version") {
                //首先将该table中的oid组取出
                var oids =[{}];
                for (let i=0;i<this.community_tableData2_self.length;i++){
                    if (this.community_tableData2_self[i].readStatus == 0) {
                        var object={};
                        object.oid = this.community_tableData2_self[i].oid;
                        object.type = this.community_tableData2_self[i].type;
                        oids.push(object);
                    }
                }
                oids.shift();
                //首先判断Accept version的消息数目，如果为0就不需要进行下面的操作了，如果不为0则进行各种后台操作
                if (this.community_accept_unread != 0){
                    $.ajax({
                        url:"/version/MyEditionReaded",
                        type:"POST",
                        // dataType: "json",
                        contentType:"application/json",
                        data:JSON.stringify({
                            // type:"accept",
                            my_edition_num:this.community_accept_unread,
                            oids:oids,
                        }),
                        // dataType: "json",
                        success: (json) => {
                            if (json=="ok"){
                                this.community_accept_unread = 0;
                                this.community_self = (this.community_accept_unread+this.community_reject_unread);
                                this.table_length_sum_self = (this.model_accept_unread+this.model_reject_unread+this.community_accept_unread+this.community_reject_unread+this.theme_accept_unread+this.theme_reject_unread);
                                this.version_sum = this.table_length_sum + this.table_length_sum_self;
                                this.message_num = this.version_sum + this.unread;
                                $("#headBar .el-badge__content").text(this.message_num);
                                console.log("success");
                            }
                        }
                    })
                }
            }else if (tab.label == "Rejected version"){
                //首先将该table中的oid组取出
                var oids =[{}];
                for (let i=0;i<this.community_tableData3_self.length;i++){
                    if (this.model_tableData3_self[i].readStatus == 0) {
                        var object={};
                        object.oid = this.community_tableData3_self[i].oid;
                        object.type = this.community_tableData3_self[i].type;
                        oids.push(object);
                    }
                }
                oids.shift();
                //首先判断Accept version的消息数目，如果为0就不需要进行下面的操作了，如果不为0则进行各种后台操作
                if (this.community_reject_unread != 0){
                    $.ajax({
                        url:"/version/MyEditionReaded",
                        type:"POST",
                        // dataType: "json",
                        contentType:"application/json",
                        data:JSON.stringify({
                            my_edition_num:this.community_reject_unread,
                            oids:oids,
                        }),
                        // dataType: "json",
                        success: (json) => {
                            if (json=="ok"){
                                this.community_reject_unread = 0;
                                this.community_self = (this.community_accept_unread+this.community_reject_unread);
                                this.table_length_sum_self = (this.model_accept_unread+this.model_reject_unread+this.community_accept_unread+this.community_reject_unread+this.theme_accept_unread+this.theme_reject_unread);
                                this.version_sum = this.table_length_sum + this.table_length_sum_self;
                                this.message_num = this.version_sum + this.unread;
                                $("#headBar .el-badge__content").text(this.message_num);
                                console.log("success");
                            }
                        }
                    })
                }
            }
        },
        MyEditionThemeReaded(tab, event){
            if (tab.label == "Accepted version") {
                //首先将该table中的oid组取出
                var oids =[{}];
                for (let i=0;i<this.theme_tableData2_self.length;i++){
                    if (this.theme_tableData2_self[i].readStatus == 0) {
                        var object={};
                        object.oid = this.theme_tableData2_self[i].oid;
                        object.type = this.theme_tableData2_self[i].type;
                        oids.push(object);
                    }
                }
                oids.shift();
                //首先判断Accept version的消息数目，如果为0就不需要进行下面的操作了，如果不为0则进行各种后台操作
                if (this.theme_accept_unread != 0){
                    $.ajax({
                        url:"/version/MyEditionReaded",
                        type:"POST",
                        // dataType: "json",
                        contentType:"application/json",
                        data:JSON.stringify({
                            // type:"accept",
                            my_edition_num:this.theme_accept_unread,
                            oids:oids,
                        }),
                        // dataType: "json",
                        success: (json) => {
                            if (json=="ok"){
                                this.theme_accept_unread = 0;
                                this.theme_self = (this.theme_accept_unread+this.theme_reject_unread);
                                this.table_length_sum_self = (this.model_accept_unread+this.model_reject_unread+this.community_accept_unread+this.community_reject_unread+this.theme_accept_unread+this.theme_reject_unread);
                                this.version_sum = this.table_length_sum + this.table_length_sum_self;
                                this.message_num = this.version_sum + this.unread;
                                $("#headBar .el-badge__content").text(this.message_num);
                                console.log("success");
                            }
                        }
                    })
                }
            }else if (tab.label == "Rejected version"){
                //首先将该table中的oid组取出
                var oids =[{}];
                for (let i=0;i<this.theme_tableData3_self.length;i++){
                    if (this.theme_tableData3_self[i].readStatus == 0) {
                        var object={};
                        object.oid = this.theme_tableData3_self[i].oid;
                        object.type = this.theme_tableData3_self[i].type;
                        oids.push(object);
                    }
                }
                oids.shift();
                //首先判断Accept version的消息数目，如果为0就不需要进行下面的操作了，如果不为0则进行各种后台操作
                if (this.theme_reject_unread != 0){
                    $.ajax({
                        url:"/version/MyEditionReaded",
                        type:"POST",
                        // dataType: "json",
                        contentType:"application/json",
                        data:JSON.stringify({
                            my_edition_num:this.theme_reject_unread,
                            oids:oids,
                        }),
                        // dataType: "json",
                        success: (json) => {
                            if (json == "ok"){
                                this.theme_reject_unread = 0;
                                this.theme_self = (this.theme_accept_unread+this.theme_reject_unread);
                                this.table_length_sum_self = (this.model_accept_unread+this.model_reject_unread+this.community_accept_unread+this.community_reject_unread+this.theme_accept_unread+this.theme_reject_unread);
                                this.version_sum = this.table_length_sum + this.table_length_sum_self;
                                this.message_num = this.version_sum + this.unread;
                                $("#headBar .el-badge__content").text(this.message_num);
                                console.log("success");
                            }
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