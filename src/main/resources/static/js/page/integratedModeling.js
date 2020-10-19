var vue = new Vue({
    el: "#app",
    props: [],
    data: {
        models:[],
        modelActions: [],
        modelParams: [],

        configVisible: false,
        executeVisible: false,
        executeDisabled: true,

        taskName: "IntegratedModeling",
        taskDescription: "IntegratedModeling",
        taskNameEditing:false,
        taskDescriptionEditing:false,

        modelRunType:"common",
        activeName: "",
        formData: new FormData(),
        currentTaskOid:'',
        currentTaskId:'',
        currentTask:{

        },
        currentEvent: {},
        iframeWindow: {},

        userDataSpaceVisible: false,
        chooseModelVisible: false,

        // 与子组件的同名变量绑定
        checkModelList: [],

        targetFile: {},

        flashInterval:'',

        configModelAction:{},

        modelConfigurationVisible:false,

        modelActionDescriprion:'',
        modelRunTimes:1,

        savedXML:'',
        savedModelActions:[],
        savedModels:[],

        integratedTaskList:[],

        taskInfoVisible:false,
        checkedTask:{},

        pageOption: {
            paginationShow:false,
            progressBar: true,
            sortAsc: false,
            currentPage: 1,
            pageSize: 10,

            total: 11,
            searchResult: [],
        },

        inSearch:0,

        taskConfigStatus:1,

        activeTask:'currentTask',

    },

    computed:{
        checkTaskStatus(){
            if(this.checkedTask.taskId==null){
                return 'Editing'
            }else{
                switch (this.checkedTask.status){
                    case -1:
                        return 'Error'
                    case 0:
                        return 'Inited'
                    case 1:
                        return 'Running'
                    case 2:
                        return 'Finished'

                }

            }
        },
    },

    methods: {
        checkMutiFlow(data){//判断是否有输入是其他模型的多输出
            for(let i=0;i<this.modelActions.length;i++){
                if(this.model[i].hasMultiOut===true){
                    for(let event of this.model[i].outputData){
                        if(event.dataId===data)
                            return true
                    }
                }else{
                    continue
                }
            }
            return false
        },

        seeDetailPage(oid){
            window.open('/'+'computableModel'+'/'+oid)
        },

        chooseModel(){
            this.chooseModelVisible = true
            this.checkModelList = []

        },

        chooseModelConfirm() {
            /**
             * 张硕、wzh
             * 2020.05.28
             * 将选中的模型们，配置必要信息，加载到画布上
             */
            var modelEditor = $("#ModelEditor")[0].contentWindow;

            this.chooseModelVisible = false
            for(let model of this.checkModelList){
                let modelAction = this.addModeltoList(model)
                modelEditor.ui.sidebar.addModelToGraph(modelAction)//把这个模型action加入画布
            }


            clearSelection();//清除子组件中的选择
        },

        /**
         * 把目标模型加入到model队列和modelAction队列
         * @param model
         */
        addModeltoList(model){
            let modelAction = this.checkModelAction(model,this.modelActions)
            this.addModelList(model,this.models)
            return modelAction
        },

        addModelList(model,modelList){
            for(let ele of modelList){
                if(ele.md5 === model.md5){
                    ele.actionNum++
                    return
                }
            }
            model.actionNum=1
            modelList.push(model)
        },

        checkModelAction(model,modelActionList){//根据加入的model生成modelAction，并加入modelActionList
            let modelAction = {}

            modelAction.id=this.generateGUID()//可能会加入两个md5值一样的模型，加入标识码在前端区分
            modelAction.iterationNum=1//迭代次数,默认为1
            modelAction.step=modelActionList.length + 1
            modelAction.description=''
            modelAction.name=model.name
            modelAction.modelName=model.name
            modelAction.modelOid=model.oid
            modelAction.md5 = model.md5
            if(model.mdlJson != undefined){
                modelAction.mdlJson = model.mdlJson
            }

            for(let ele of modelActionList){//一样的模型order不同
                if(modelAction.md5===ele.md5){
                    modelAction.order = ele.order+1
                }else{
                    modelAction.order = 1
                }
            }
            this.extractEvents(model,modelAction)//拼接好input和output

            modelActionList.push(modelAction)
            return modelAction
        },

        extractEvents(model, modelAction) {
            var inputData = [];
            var outputData = [];
            if (model.mdlJson != undefined) {
                var states = model.mdlJson.mdl.states;
                for (var j = 0; j < states.length; j++) {
                    var state = states[j];
                    for (var k = 0; k < state.event.length; k++) {
                        var event = state.event[k];
                        event.stateName = state.name;
                        if (event.eventType == "response") {
                            inputData.push(event);
                        } else {
                            outputData.push(event);
                        }
                    }
                }

            } else {
                inputData = model.inputEvents
                outputData = model.outputEvent
            }
            modelAction.inputData = inputData;
            modelAction.outputData = outputData;

        },

        deleteModelClick(modelAction){
            this.iframeWindow.removeTargetCell(modelAction);
            this.deleteModel(modelAction.id,modelAction.md5)
        },

        deleteModel(modelActionId,md5){
            for(let i=this.modelActions.length-1;i>=0;i--){//从尾部开始寻找，在目标之后的模型任务step都要-1
                if(this.modelActions[i].md5===md5&&this.modelActions[i].id === modelActionId){
                    this.modelActions.splice(i,1)
                    break
                }else{
                    this.modelActions[i].step--
                }
            }
            for(let i=this.models.length-1;i>=0;i--){//从尾部开始寻找，如果该模型对应的action只有一个则删除
                if(this.models[i].md5===md5){
                    if(this.models[i].actionNum>1){
                        this.models[i].actionNum--
                    }else{
                        this.models.splice(i,1)
                    }
                    break
                }
            }
        },

        buildNewTask(){
            this.currentTask = {}
            this.models = []
            this.modelActions = []
            //把画布清空
            this.iframeWindow.setCXml('<mxGraphModel dx="670" dy="683" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="827" pageHeight="1169">\n' +
                '  <root>\n' +
                '    <mxCell id="0"/>\n' +
                '    <mxCell id="1" parent="0"/>\n' +
                '  </root>\n' +
                '</mxGraphModel>');
        },

        modelConfiguration(modelAction){
            this.modelConfigurationVisible = true
            this.modelRunTimes = modelAction.iterationNum==1?1:modelAction.iterationNum
            this.modelRunType = this.modelRunTimes>1?'iterative':'common'
            this.configModelAction = modelAction
            this.modelActionDescriprion = modelAction.description
        },

        modelConfigurationConfirm(){
            this.configModelAction.iterationNum = this.modelRunTimes
            this.configModelAction.description = this.modelActionDescriprion
            this.modelRunType = this.modelRunTimes>1?'iterative':'common'
            this.modelConfigurationVisible = false
        },

        modelConfigurationCancel(){
            this.modelActionDescriprion = ''
            this.modelRunType = 'common'
        },

        mxModelToModel(mxModel,model){//mxgraph中的model的关键值赋值给vue页面中的
            let i = 0
            for(let i=0;i<mxModel.inputData.length;i++){
                if(mxModel.inputData[i].link!=undefined) {//获取在mxgraph中配置的数据流
                    for (let j = 0; j < model.inputData.length; j++) {
                        if (mxModel.inputData[i].eventId===model.inputData[i].eventId){
                            model.inputData[i].link = mxModel.inputData[i].link
                            break;
                        }
                    }
                }
            }
            // while (i < mxModel.inputData.length){
            //     if(mxModel.inputData[i].link!=undefined){
            //         model.inputData[i].link = mxModel.inputData[i].link
            //     }
            //     i++
            // }
        },

        dataConfiguration(model) {
            // var xml = this.iframeWindow.getCXml();
            var mdls = this.modelActions;

            let mxModels = this.iframeWindow.getModels();

            this.configVisible = true;
            this.activeName = model.name;

            for(let ele of mxModels){
                if(ele.frontId===model.id){//id在mxgraph中是frontId
                    this.mxModelToModel(ele,model)
                    break;
                }
            }

            this.configModelAction = model;

            for (var j = 0; j < this.configModelAction.inputData.length; j++) {
                var event = this.configModelAction.inputData[j];
                var nodes = event.data[0].nodes;
                let refName = event.data[0].text.toLowerCase();
                if (nodes != undefined && refName != "grid" && refName != "table" && refName != "shapes") {
                    let children = [];
                    for (k = 0; k < nodes.length; k++) {
                        let node = nodes[k];
                        let child = {};
                        child.dataId = node.text;
                        child.event = node.text;
                        child.description = node.desc;
                        child.eventType = node.dataType;
                        child.val = "";

                        child.child = true;
                        children.push(child);
                    }
                    // event.children = children;
                    // 为vue变量添加属性，这句代码比上句更robust！
                    this.$set(event, 'children', children);
                }
            }
        },

        //旧版本数据上传方式
        upload(event) {
            $('#uploadInputData').click();
            this.currentEvent = event;
        },

        selectDataspaceFile(file) {
            this.targetFile = file
        },

        removeDataspaceFile(file) {
            this.targetFile = {}
        },

        selectFromDataSpace() {
            this.currentEvent.value = this.targetFile.url;
            this.currentEvent.fileName = this.targetFile.label;
            this.currentEvent.suffix = this.targetFile.suffix;
            if(this.currentEvent.type==undefined){
                this.currentEvent.type='url'
            }
            $('#datainput' + this.currentEvent.dataId).removeClass("spinner");
            this.userDataSpaceVisible = false;
        },

        iterationConfig(){

        },

        //旧版本运行方式
        // execute() {
        //
        //     this.createAndUploadParamFile();
        //     let prepare = setInterval(() => {
        //         let prepared = true;
        //
        //         for (var i = 0; i < this.modelActions.length; i++) {
        //             for (var j = 0; j < this.modelActions[i].inputData.length; j++) {
        //                 var event = this.modelActions[i].inputData[j];
        //                 //判断参数文件是否已经上传
        //                 let children = event.children;
        //                 if (children === undefined) {
        //                     continue;
        //                 } else {
        //                     let hasFile = false;
        //                     for (k = 0; k < children.length; k++) {
        //                         if (children[k].val != undefined && children[k].val.trim() != "") {
        //                             hasFile = true;
        //                             break;
        //                         }
        //                     }
        //                     if (hasFile) {
        //                         if (event.value == undefined) {
        //                             prepared = false;
        //                             break;
        //                         }
        //                     }        //
        //                 }
        //             }
        //             if (!prepared) {
        //                 break;
        //             }
        //         }
        //
        //         if (prepared) {
        //             clearInterval(prepare);
        //
        //
        //             this.executeVisible = false;
        //
        //             this.$notify.info({
        //                 title: 'Start Executing !',
        //                 message: 'You could wait it,and you could also find this task in your Space!',
        //             });
        //
        //             var xml = "";
        //             var uid = this.generateGUID();
        //             var name = this.taskName;
        //             var version = "1.0";
        //
        //             xml += "<TaskConfiguration uid='" + uid + "' name='" + name + "' version='" + version + "'>\n" +
        //                 "\t<Models>\n";
        //             for (var i = 0; i < this.modelActions.length; i++) {
        //                 xml += "\t\t<Model name='" + this.modelActions[i].name + "' pid='" + this.modelActions[i].md5 + "' description='" + this.modelActions[i].description + "'>\n" +
        //                     "\t\t\t<InputData>\n";
        //                 for (var j = 0; j < this.modelActions[i].inputData.length; j++) {
        //                     if (this.modelActions[i].inputData[j].value != "") {
        //                         xml += "\t\t\t\t<DataConfiguration state='" + this.modelActions[i].inputData[j].state + "' event='" + this.modelActions[i].inputData[j].event + "' value='" + this.modelActions[i].inputData[j].value + "' dataId='" + this.modelActions[i].inputData[j].dataId + "' type='" + this.modelActions[i].inputData[j].type + "'/>\n";
        //                     }
        //                 }
        //                 xml += "\t\t\t</InputData>\n" +
        //                     "\t\t\t<OutputData>\n";
        //                 for (var k = 0; k < this.modelActions[i].outputData.length; k++) {
        //                     xml += "\t\t\t\t<DataConfiguration state='" + this.modelActions[i].outputData[k].state + "' event='" + this.modelActions[i].outputData[k].event + "' value='" + this.modelActions[i].outputData[k].value + "' dataId='" + this.modelActions[i].outputData[k].dataId + "' type='" + this.modelActions[i].outputData[k].type + "'/>\n";
        //                 }
        //                 xml += "\t\t\t</OutputData>\n" +
        //                     "\t\t</Model>\n";
        //             }
        //             xml += "\t</Models>\n" +
        //                 "</TaskConfiguration>";
        //
        //             console.log(xml);
        //
        //             let file = new File([xml], name + '.xml', {
        //                 type: 'text/xml',
        //             });
        //
        //
        //             var formData = new FormData();
        //             formData.append("file", file);
        //             formData.append("name", this.taskName);
        //
        //             $.ajax({
        //                 url: "/task/runIntegratedTask",
        //                 data: formData,
        //                 type: "POST",
        //                 processData: false,
        //                 contentType: false,
        //                 success: (result) => {
        //                     var taskId = result.data;
        //
        //                     let interval = setInterval(() => {
        //                         $.ajax({
        //                             url: "/task/checkIntegratedTask/" + taskId,
        //                             data: {},
        //                             type: "GET",
        //                             success: (obj) => {
        //                                 let status = obj.data.status;
        //                                 if (status == 0) {
        //                                     console.log(status);
        //                                 } else if (status == -1) {
        //                                     console.log(status);
        //                                     clearInterval(interval);
        //                                     this.$alert('Integrated model run failed!', 'Error', {
        //                                         type: "error",
        //                                         confirmButtonText: 'OK',
        //                                         callback: action => {
        //                                             //this.$message({
        //                                             //type: 'danger',
        //                                             //message: `action: ${ action }`
        //                                             //});
        //                                         }
        //                                     });
        //                                 } else {
        //                                     console.log(status);
        //                                     clearInterval(interval);
        //                                     this.$alert('Integrated model run Success', 'Success', {
        //                                         type: "success",
        //                                         confirmButtonText: 'OK',
        //                                         callback: action => {
        //                                             //this.$message({
        //                                             //type: 'success',
        //                                             //message: `action: ${ action }`
        //                                             //});
        //                                         }
        //                                     });
        //
        //                                     let modelActions = obj.data.modelActions;
        //                                     console.log(modelActions);
        //
        //
        //                                     var cxml = this.iframeWindow.getCXml();
        //                                     var doc = this.string2XML(cxml);
        //
        //
        //                                     for (let i = 0; i < modelActions.length; i++) {
        //                                         var output = modelActions[i].outputData.outputs;
        //                                         for (var j = 0; j < output.length; j++) {
        //                                             for (var k = 0; k < doc.getElementsByTagName('mxCell').length; k++) {
        //                                                 var mxCell = doc.getElementsByTagName('mxCell')[k];
        //                                                 if (output[j].dataId == mxCell.getAttribute('eid')) {
        //                                                     mxCell.setAttribute('url', output[j].value);
        //                                                 }
        //                                             }
        //                                         }
        //
        //                                         // var input = modelActions[i].inputData.inputs;
        //                                         // for (var j = 0; j<input.length; j++){
        //                                         //     for (var k = 0; k< doc.getElementsByTagName('mxCell').length; k++){
        //                                         //         var mxCell = doc.getElementsByTagName('mxCell')[k];
        //                                         //         if (input[j].dataId == mxCell.getAttribute('eid')){
        //                                         //             mxCell.setAttribute('url',input[j].value);
        //                                         //         }
        //                                         //     }
        //                                         // }
        //                                     }
        //                                     var xml = this.xml2String(doc);
        //
        //                                     this.iframeWindow.setCXml(xml);
        //
        //                                     // Save
        //                                     $.ajax({
        //                                         url: "/task/saveIntegratedTask",
        //                                         async: true,
        //                                         data: {
        //                                             taskId: taskId,
        //                                             graphXml: xml,
        //                                             modelParams: this.modelParams,
        //                                         },
        //                                         type: "POST",
        //                                         success: (result) => {
        //                                             console.log(result);
        //                                         }
        //
        //                                     })
        //
        //                                 }
        //                             }
        //                         })
        //                     }, 3000)
        //
        //                 }
        //             })
        //         }
        //     }, 2000);
        //
        // },

        /**
         *在列表寻找对应属性值的对象
         * @param list数组对象
         * @param attrVal属性值
         * @param attrType属性名称
         */
        findTargetByAttri(list,attrVal,attrType){
            for(let i=0;i<list[i];i++){
                list[i][attrType] === attrVal
                return list[i]
            }
        },

        findTargetByOutputId(list,dataId){
            for(let i=0;i<list.length;i++){
                let ele=list[i]
                for(let j=0;j<ele.outputData.length;j++){
                    if (ele.outputData[j].eventId === dataId){
                        return ele
                    }
                }
            }
        },

        editTaskNameClick(){
            this.taskNameEditing = true
            this.taskName = this.checkedTask.taskName
        },

        editTaskDescriptionClick(){
            this.taskDescriptionEditing = true
            this.taskDescription = this.checkedTask.description
        },

        editTaskNameComfirm() {
            $.ajax({
                url: "/task/updateIntegrateTaskName",
                async: true,
                data: {
                    taskOid: this.checkedTask.oid,
                    taskName: this.taskName,
                },
                type: "POST",
                success: (res) => {
                    this.checkedTask.taskName = res.data
                }
            })


            this.taskNameEditing = false
        },

        editTaskDescriptionComfirm() {
            $.ajax({
                url: "/task/updateIntegrateTaskDescription",
                async: true,
                data: {
                    taskOid: this.checkedTask.oid,
                    taskDescription: this.taskDescription,
                },
                type: "POST",
                success: (res) => {
                    this.checkedTask.description = res.data
                }

            })

            this.taskDescriptionEditing = false
        },

        executeNew() {
            this.executeVisible = false;

            if (this.models.length < 1) {
                this.$alert('Please select  at least one model.', {
                    confirmButtonText: 'OK',
                })
                return
            }

            this.$notify.info({
                title: 'Start Executing !',
                message: 'You could wait it, and you could also find this task in your Space!',
            });

            var xml = "";

            var name = this.taskName;
            var version = "1.0";

            var taskJson = {}


            let dataLinks=[]

            let mxgraph = this.iframeWindow.getCXml();

            // if(this.models===this.savedModels&&this.modelActions===this.savedModelActions){
            //     xml = this.savedXML
            // } else {
            var uid = this.generateGUID();
            //先把models标签拼好
            xml += "<TaskConfiguration uid='" + uid + "' name='" + name + "' version='" + version + "'>\n"
            if(this.models.length>0){
                xml += "\t<Models>\n";
                for (let i = 0; i < this.models.length; i++) {
                    xml += "\t\t<Model name='" +this.models[i].name + "' pid='" + this.models[i].md5 + "' description='" + this.models[i].description + "'/>\n";
                }
                xml += "\t</Models>\n";
            }

            //modelAction标签
            xml += "\t<ModelActions>\n";
            for (let i = 0; i < this.modelActions.length; i++) {
                xml += "\t\t<ModelAction id='" + this.modelActions[i].id + "' name = '" + this.modelActions[i].name + "' description = '" + this.modelActions[i].description + "' model='" + this.modelActions[i].md5
                    + "' step ='" + this.modelActions[i].step + "' iterationNum='" + this.modelActions[i].iterationNum + "'>\n" +
                    "\t\t\t<Inputs>\n";
                for (let j = 0; j < this.modelActions[i].inputData.length; j++) {
                    if ((this.modelActions[i].inputData[j].value != "" && this.modelActions[i].inputData[j].value != undefined)
                        || (this.modelActions[i].inputData[j].link != "" && this.modelActions[i].inputData[j].link != undefined)) {
                        xml += "\t\t\t\t<DataConfiguration id='" + this.modelActions[i].inputData[j].eventId +"' state='" + this.modelActions[i].inputData[j].stateName + "' event='" + this.modelActions[i].inputData[j].eventName + "'>\n"

                        xml += "\t\t\t\t\t<Data"
                        if (this.modelActions[i].inputData[j].value != undefined && this.modelActions[i].inputData[j].value != '') {
                            xml += " value='" + this.modelActions[i].inputData[j].value
                            this.modelActions[i].inputData[j].type = 'url'
                        }
                        if (this.modelActions[i].inputData[j].link != undefined && this.modelActions[i].inputData[j].link != '') {
                            xml += "' link='" + this.modelActions[i].inputData[j].link
                            if(this.modelActions[i].inputData[j].type == ''){
                                this.modelActions[i].inputData[j].type = 'link'
                            }else{
                                this.modelActions[i].inputData[j].type = 'mixed'
                            }

                            // let fromAction = this.findTargetByOutputId(this.modelActions,this.modelActions[i].inputData[j].link)
                            let dataLink = {
                                inputEvent: this.modelActions[i].inputData[j].eventId,
                                outputEvent: this.modelActions[i].inputData[j].link
                            }  //to
                            dataLinks.push(dataLink)
                        }
                        xml += "' type='" + this.modelActions[i].inputData[j].type + "'/>\n";
                        xml += "\t\t\t\t</DataConfiguration>\n"
                    } else {
                        this.$alert('Please check input of the model action '+this.modelActions[i].name)
                        return;
                    }
                }
                xml += "\t\t\t</Inputs>\n" +
                    "\t\t\t<Outputs>\n";
                for (var k = 0; k < this.modelActions[i].outputData.length; k++) {
                    this.modelActions[i].outputData[k].url=''
                    xml += "\t\t\t\t<DataConfiguration id='" + this.modelActions[i].outputData[k].eventId + "' state='" + this.modelActions[i].outputData[k].stateName +
                        "' event='" + this.modelActions[i].outputData[k].eventName + "'/>\n";
                }
                xml += "\t\t\t</Outputs>\n" +
                    "\t\t</ModelAction>\n";
            }
            xml += "\t</ModelActions>\n";

            if(dataLinks.length>0){
                xml += "\t<DataLinks>\n";
                for(let ele of dataLinks){
                    xml += "\t\t<DataLink from='" + ele.inputEvent + "' to='" + ele.outputEvent + "'>\n"
                    xml += "\t\t</DataLink>\n"
                }
                xml += "\t</DataLinks>\n";

            }

            xml += "</TaskConfiguration>";

            console.log(xml);


            // }
            // if(Object.keys(this.currentTask)==0){
            //
            // }else{
            //     this.updateIntegratedTask(this.currentTask.oid, xml, mxgraph, this.models, this.modelActions)
            // }
            let file = new File([xml], name + '.xml', {
                type: 'text/xml',
            });

            let saveStatus = this.saveIntegratedTask(xml,mxgraph,this.models,this.modelActions)
            if(saveStatus==='suc'){
                var formData = new FormData();
                formData.append("file", file);
                formData.append("name", this.taskName);

                var _this = this;

                $.ajax({
                    url: "/task/runIntegratedTask",
                    data: formData,
                    type: "POST",
                    processData: false,
                    contentType: false,
                    success: (result) => {
                        var taskId = result.data;
                        this.updateTaskId(this.currentTaskOid,taskId)

                        let interval = setInterval(() => {
                            this.checkIntegratedTask(taskId,interval)
                        }, 3000)

                    }
                })
            }else{
                this.$alert('Faied to integrated model, do you want to try again?', 'Error', {
                    confirmButtonText: 'OK',
                    cancelButtonText: 'Cancel',
                    beforeClose: (action, instance, done) => {
                        if (action === 'confirm') {
                            this.executeNew();
                            done()
                        }else{
                            done()
                        }
                    }
                });
            }


        },

        checkIntegratedTask(taskId,interval){
            $.ajax({
                url: "/task/checkIntegratedTask/" + taskId,
                data: {},
                type: "GET",
                success: (obj) => {
                    let status = obj.data.status;
                    let taskInfo = obj.data.taskInfo

                    this.updateMxgraphNode(taskInfo.modelActionList)
                    this.updataTaskoutput(taskInfo)
                    if (status == 0) {
                        console.log(status);
                    } else if (status == -1) {
                        console.log(status);
                        clearInterval(interval);
                        clearInterval(this.flashInterval);
                        this.$alert('Integrated model run failed!', 'Error', {
                            confirmButtonText: 'OK',
                            callback: action => {
                                this.$message({
                                    type: 'danger',
                                    message: `action: ${action}`
                                });
                            }
                        });
                    } else {
                        console.log(status);
                        clearInterval(interval);
                        clearInterval(this.flashInterval);
                        this.$alert('Integrated model run Success', 'Success', {
                            confirmButtonText: 'OK',
                            callback: action => {
                                this.$message({
                                    type: 'success',
                                    message: `action: ${action}`
                                });
                            }
                        });


                        var cxml = this.iframeWindow.getCXml();
                        var doc = this.string2XML(cxml);

                        this.updataTaskoutput(taskInfo,doc)

                        // this.iframeWindow.setCXml(xml);

                    }

                }
            })
        },

        updataTaskoutput(taskInfo,doc){
            let updateModels = taskInfo.modelActionList.completed;

            // 将结果更新到 this.modelActions 中
            for (let i = 0; i < this.modelActions.length; i++) {
                var m1 = this.modelActions[i]
                for (let j = 0; j < updateModels.length; j++) {
                    var m2 = updateModels[j]
                    if (m1.id == m2.id) {//前台的id作为后台的id
                        for (let k = 0; k < m1.outputData.length; k++) {
                            var o1 = m1.outputData[k]
                            for (let l = 0; l < m2.outputData.outputs.length; l++) {
                                var o2 = m2.outputData.outputs[l]
                                if (o1.eventId == o2.dataId) {//前台eventId对应的是managerServer后台的dataId
                                    let dataContent = o2.dataContent
                                    o1.value = dataContent.value
                                    o1.fileName = dataContent.fileName
                                    o1.suffix = dataContent.suffix
                                    if(o1.fileName.indexOf(',')){
                                        this.unFoldMultiOutput(m1,o1);
                                    }
                                    break
                                }
                            }
                        }
                        break
                    }
                }
            }

            if(doc!=undefined){
                for (let i = 0; i < updateModels.length; i++) {
                    var output = updateModels[i].outputData.outputs;
                    for (var j = 0; j < output.length; j++) {
                        for (var k = 0; k < doc.getElementsByTagName('mxCell').length; k++) {
                            var mxCell = doc.getElementsByTagName('mxCell')[k];
                            if (output[j].dataId == mxCell.getAttribute('eid')) {
                                mxCell.setAttribute('url', output[j].value);
                            }
                        }
                    }

                    // var input = modelActions[i].inputData.inputs;
                    // for (var j = 0; j<input.length; j++){
                    //     for (var k = 0; k< doc.getElementsByTagName('mxCell').length; k++){
                    //         var mxCell = doc.getElementsByTagName('mxCell')[k];
                    //         if (input[j].dataId == mxCell.getAttribute('eid')){
                    //             mxCell.setAttribute('url',input[j].value);
                    //         }
                    //     }
                    // }
                }
            }


        },

        unFoldMultiOutput(modelAction,outputData){
            this.iframeWindow.unFoldMultiOutput(modelAction,outputData)
        },

        updateMxgraphNode(modelActionList){
            // let style={
            //     'waiting':'rounded=0;whiteSpace=wrap;html=1;strokeWidth=2;strokeColor=#0073e8;fillColor=#d9edf7;',
            //     'running':'rounded=0;whiteSpace=wrap;html=1;strokeWidth=2;strokeColor=#449d44;fillColor=#ffd058;',
            //     'completed':'rounded=0;whiteSpace=wrap;html=1;strokeWidth=2;strokeColor=#449d44;fillColor=#EEFFEE;',
            //     'failed':'rounded=0;whiteSpace=wrap;html=1;strokeWidth=2;strokeColor=#a94442;fillColor=#ede2e2;',
            // }

            let flashFlag = 0
            for(let modelAction of modelActionList.waiting){
                clearInterval(this.flashInterval)
                this.iframeWindow.setNodeStyle(modelAction.id,'waiting')//这个方法在integratedModelEditor.html里面
            }
            for(let modelAction of modelActionList.running){
                clearInterval(this.flashInterval)
                // this.flashInterval = setInterval(()=>{
                //     if(flashFlag==0){
                //         this.iframeWindow.setNodeStyle(model.pid,style['running'])
                //         flashFlag = 1
                //     }else{
                //         this.iframeWindow.setNodeStyle(model.pid,style['waiting'])
                //         flashFlag = 0
                //     }
                // },1000)
                this.iframeWindow.setNodeStyle(modelAction.id,'running')
            }
            for(let modelAction of modelActionList.completed){
                clearInterval(this.flashInterval)
                this.iframeWindow.setNodeStyle(modelAction.id,'completed')
            }
            for(let modelAction of modelActionList.failed){
                clearInterval(this.flashInterval)
                this.iframeWindow.setNodeStyle(modelAction.id,'failed')
            }
            // this.iframeWindow.setNodeStyle('5cdd64e328e8a2097412d5f8',style['completed'])
        },

        taskConfigure(index){
            this.taskConfigStatus = index
            this.executeVisible = true
            this.taskName = Object.keys(this.currentTask).length!=0?this.currentTask.taskName:'IntegratedModeling'
            this.taskDescription = Object.keys(this.currentTask).length!=0?this.currentTask.description:'IntegratedModeling'
        },

        saveIntegratedTaskClick() {
            //先把models标签拼好

            if (this.models.length < 1) {
                this.$alert('Please select at least one model.', {
                    confirmButtonText: 'OK',
                })
                return
            }

            var name = this.taskName;
            var version = "1.0";
            var uid = this.generateGUID();
            let dataLinks = []
            let xml = ''
            xml += "<TaskConfiguration uid='" + uid + "' name='" + name + "' version='" + version + "'>\n"
            if (this.models.length > 0) {
                xml += "\t<Models>\n";
                for (let i = 0; i < this.models.length; i++) {
                    xml += "\t\t<Model name='" + this.models[i].name + "' pid='" + this.models[i].md5 + "' description='" + this.models[i].description + "'/>\n";
                }
                xml += "\t</Models>\n";
            }

            //modelAction标签
            xml += "\t<ModelActions>\n";
            for (let i = 0; i < this.modelActions.length; i++) {
                xml += "\t\t<ModelAction id='" + this.modelActions[i].id + "' name = '" + this.modelActions[i].name + "' description = '" + this.modelActions[i].description + "' model='" + this.modelActions[i].md5
                    + "' step ='" + this.modelActions[i].step + "' iterationNum='" + this.modelActions[i].iterationNum + "'>\n" +
                    "\t\t\t<Inputs>\n";
                for (let j = 0; j < this.modelActions[i].inputData.length; j++) {
                    if ((this.modelActions[i].inputData[j].value != "" && this.modelActions[i].inputData[j].value != undefined)
                        || (this.modelActions[i].inputData[j].link != "" && this.modelActions[i].inputData[j].link != undefined)) {
                        xml += "\t\t\t\t<DataConfiguration id='" + this.modelActions[i].inputData[j].eventId +"' state='" + this.modelActions[i].inputData[j].stateName + "' event='" + this.modelActions[i].inputData[j].eventName + "'>\n"

                        xml += "\t\t\t\t\t<Data"
                        if (this.modelActions[i].inputData[j].value != undefined && this.modelActions[i].inputData[j].value != '') {
                            xml += " value='" + this.modelActions[i].inputData[j].value
                            this.modelActions[i].inputData[j].type = 'url'
                        }
                        if (this.modelActions[i].inputData[j].link != undefined && this.modelActions[i].inputData[j].link != '') {
                            xml += "' link='" + this.modelActions[i].inputData[j].link
                            if(this.modelActions[i].inputData[j].type == ''){
                                this.modelActions[i].inputData[j].type = 'link'
                            }else{
                                this.modelActions[i].inputData[j].type = 'mixed'
                            }

                            // let fromAction = this.findTargetByOutputId(this.modelActions,this.modelActions[i].inputData[j].link)
                            let dataLink = {
                                inputEvent: this.modelActions[i].inputData[j].eventId,
                                outputEvent: this.modelActions[i].inputData[j].link
                            }  //to
                            dataLinks.push(dataLink)
                        }
                        xml += "' type='" + this.modelActions[i].inputData[j].type + "'/>\n";
                        xml += "\t\t\t\t</DataConfiguration>\n"
                    }
                }
                xml += "\t\t\t</Inputs>\n" +
                    "\t\t\t<Outputs>\n";
                for (var k = 0; k < this.modelActions[i].outputData.length; k++) {
                    this.modelActions[i].outputData[k].url=''
                    xml += "\t\t\t\t<DataConfiguration id='" + this.modelActions[i].outputData[k].eventId + "' state='" + this.modelActions[i].outputData[k].stateName +
                        "' event='" + this.modelActions[i].outputData[k].eventName + "'/>\n";
                }
                xml += "\t\t\t</Outputs>\n" +
                    "\t\t</ModelAction>\n";
            }
            xml += "\t</ModelActions>\n";

            if (dataLinks.length > 0) {
                xml += "\t<DataLinks>\n";
                for (let ele of dataLinks) {
                    xml += "\t\t<DataLink from='" + ele.inputEvent + "' to='" + ele.outputEvent + "'>\n"
                    xml += "\t\t</DataLink>\n"
                }
                xml += "\t</DataLinks>\n";

            }

            xml += "</TaskConfiguration>";

            let mxgraph = this.iframeWindow.getCXml();

            if (Object.keys(this.currentTask) != 0) {
                this.updateIntegratedTask(this.currentTask.oid, xml, mxgraph, this.models, this.modelActions)
            } else {
                this.saveIntegratedTask(xml, mxgraph, this.models, this.modelActions)
            }


        },

        generateTaskModelInfo(models,modelActions){
            let addModels = []
            let addModelActions = []

            //拼接集成模型中的models部分
            for(let model of models){
                let addModel={
                    name:model.name,
                    oid:model.oid,
                    md5:model.md5,
                    description:model.description,
                    author:model.author

                }
                addModels.push(addModel)
            }

            //拼接集成模型中的modelActions部分
            for(let modelAction of modelActions){
                let addModelAction={
                    id:modelAction.id,
                    modelOid:modelAction.modelOid,
                    md5:modelAction.md5,
                    name:modelAction.name,
                    description:modelAction.description,
                    outputData:[],
                    inputData:[],
                    step:modelAction.step,
                    iterationNum:modelAction.iterationNum
                }
                for(let event of modelAction.outputData){
                    addModelAction.outputData.push({
                        eventDesc: event.eventDesc,
                        eventId: event.eventId,
                        data: event.data,
                        eventName: event.eventName,
                        eventType: event.eventType,
                        optional: event.optional,
                        stateName: event.stateName,
                    })
                }
                for(let event of modelAction.inputData){
                    addModelAction.inputData.push({
                        eventDesc: event.eventDesc,
                        eventId: event.eventId,
                        data: event.data,
                        eventName: event.eventName,
                        eventType: event.eventType,
                        optional: event.optional,
                        stateName: event.stateName,
                        value: event.value,
                        link: event.link,
                        linkEvent: event.linkEvent,
                        fileName: event.fileName,
                        suffix: event.suffix,
                    })
                }

                addModelActions.push(addModelAction)
            }

            return [addModels,addModelActions]
        },

        UpdateIntegrateTaskClick(task){
            this.updateIntegratedTask(task.oid,task.xml,task.mxGraph,task.models,task.modelActions)
            this.taskInfoVisible = false
        },

        updateIntegratedTask(taskOid,xml,mxgraph,models,modelActions){
            let model7modelActions = this.generateTaskModelInfo(models,modelActions)

            let data = {
                taskOid: taskOid,
                xml: xml,
                mxgraph:mxgraph,
                models:model7modelActions[0],
                modelActions: model7modelActions[1],
                description: this.taskDescription,
                taskName: this.taskName,
            }

            $.ajax({
                url: "/task/updateIntegratedTaskInfo",
                async: true,
                data: JSON.stringify(data),
                // traditional:true,
                contentType:'application/json',
                type: "POST",
                success: (result) => {
                    this.currentTask = result.data
                    this.currentTaskOid = result.data.oid
                    this.savedModelActions = this.modelActions
                    this.savedModels = this.models
                    this.savedXML = xml
                    this.executeVisible = false
                    this.activeTask = 'allTask'
                    console.log(result);

                    this.listIntegrateTask()
                }

            })
        },

        saveIntegratedTask(xml,mxgraph,models,modelActions){//保存一个集成模型配置
            let model7modelActions = this.generateTaskModelInfo(models,modelActions)

            let data = {
                xml: xml,
                mxgraph:mxgraph,
                models:model7modelActions[0],
                modelActions: model7modelActions[1],
                description: this.taskDescription,
                taskName: this.taskName,
            }

            let saveStatus
            $.ajax({
                url: "/task/saveIntegratedTask",
                async: true,
                data: JSON.stringify(data),
                // traditional:true,
                async:false,
                contentType:'application/json',
                type: "POST",
                success: (result) => {
                    this.currentTaskOid = result.data
                    this.savedModelActions = this.modelActions
                    this.savedModels = this.models
                    this.savedXML = xml
                    this.executeVisible = false
                    this.activeTask = 'allTask'
                    console.log(result);

                    saveStatus = 'suc'
                    this.listIntegrateTask()
                }

            })
            return saveStatus
        },

        updateTaskId(taskOid,taskId){//把managerserver返回的taskid更新到门户数据库
            $.ajax({
                url: "/task/updateIntegrateTaskId",
                async: true,
                data: {
                    taskOid:taskOid,
                    taskId: taskId,
                },
                type: "POST",
                success: (result) => {
                    this.currentTaskId = result.data
                    console.log(result);
                }

            })
        },

        checkData() {

            this.configVisible = false;
            //检查输入数据是否齐全
            if (true) {
                this.executeDisabled = false;
            }
        },

        openModelPage(modelOid){
            window.open('/computableModel/'+modelOid)
        },

        openModelContributer(modelOid){
            axios.get("/computableModel/getUserOidByOid",{
                params:{
                    oid:modelOid
                }
            }).then(res => {
                    window.open('/user/'+res.data.data)
                }

            )
        },

        createAndUploadParamFile() {
            let modelParas = [];
            for (i = 0; i < this.modelActions.length; i++) {
                let modelPara = {};
                modelPara.mId = this.modelActions[i].pid;
                let inputsPara = [];
                let inputPara = {};

                let inputs = this.modelActions[i].inputData;
                for (j = 0; j < inputs.length; j++) {

                    inputPara = {};
                    inputPara.eventName = inputs[j].event;
                    inputPara.stateName = inputs[j].state;
                    inputPara.eventId = inputs[j].dataId;
                    inputPara.eventDesc = inputs[j].description;
                    let params = [];
                    let param = {};

                    let event = inputs[j];
                    if (event.children != undefined) {
                        this.currentEvent = event;
                        //拼接文件内容
                        let content = "";
                        let children = event.children;
                        for (k = 0; k < children.length; k++) {
                            let child = children[k];
                            if (child.val != undefined || child.val.trim() != "") {

                                param = {};
                                param.name = child.event;
                                param.type = child.eventType;
                                param.value = child.val;
                                param.desc = child.description;
                                params.push(param);

                                content += "<XDO name=\"" + child.event + "\" kernelType=\"" + child.eventType.toLowerCase() + "\" value=\"" + child.val + "\" /> ";
                            }
                        }
                        if (content === "") {
                            continue;
                        } else {
                            content = "<Dataset> " + content + " </Dataset>";
                        }

                        //生成文件
                        let file = new File([content], event.eventName + '.xml', {
                            type: 'text/plain',
                        });
                        //上传文件
                        this.uploadToDataContainer(file, event);

                        inputPara.params = params;
                    }
                }

                inputsPara.push(inputPara);
                modelPara.inputs = inputsPara;
                if (modelPara.inputs[0].params.length > 0) {
                    this.modelParams.push(modelPara);
                }
            }

        },

        uploadToDataContainer(file, event) {
            this.currentEvent = event;

            $.get("/dataManager/dataContainerIpAndPort", (result) => {
                let ipAndPort = result.data;
                let formData = new FormData();
                formData.append("file", file);
                $.ajax({
                    type: "post",
                    url: "http://" + ipAndPort + "/file/upload/store_dataResource_files",
                    data: formData,
                    async: false,
                    processData: false,
                    contentType: false,
                    success: (result) => {
                        if (result.code == 0) {
                            let data = result.data;
                            let dataName = data.file_name.match(/.+(?=\.)/)[0];
                            let dataSuffix = data.file_name.match(/(?=\.).+/)[0];
                            let dataId = data.source_store_id;
                            let dataUrl = "http://" + ipAndPort + "/dataResource";
                            let form = {
                                "author": "njgis",
                                "fileName": dataName,
                                "sourceStoreId": dataId,
                                "suffix": dataSuffix,
                                "type": "OTHER",
                                "fromWhere": "PORTAL"
                            };

                            $.ajax({
                                type: "post",
                                url: dataUrl,
                                data: JSON.stringify(form),

                                async: false,

                                contentType: 'application/json',
                                success: (result) => {
                                    if (result.code == 0) {

                                        this.currentEvent.value = "http://" + ipAndPort + "/data?uid=" + result.data.sourceStoreId;
                                        this.currentEvent.fileName = result.data.fileName;
                                        this.currentEvent.suffix = result.data.suffix;

                                    }

                                    $("#uploadInputData").val("");
                                }
                            })


                        }
                    }
                })
            })
        },

        download(event) {
            //下载接口
            if (event.value != undefined) {
                this.currentEvent = event;
                window.open("/dispatchRequest/download?url=" + this.currentEvent.value);
            } else {
                this.$message.error("No data can be downloaded.");
            }
        },

        generateGUID() {
            var s = [];
            var hexDigits = "0123456789abcdef";
            for (var i = 0; i < 36; i++) {
                s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
            }
            s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
            s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
            s[8] = s[13] = s[18] = s[23] = "-";

            var uuid = s.join("");
            return uuid;
        },

        string2XML(string) {
            let parser = new DOMParser();
            let xmlObject = parser.parseFromString(string, "text/xml");
            return xmlObject;
        },

        xml2String(xml) {
            return (new XMLSerializer()).serializeToString(xml);
        },

        openUserDataSpace(event) {
            this.currentEvent = event;
            this.userDataSpaceVisible = true;
        },
        // selectInputData(data) {
        //     this.currentEvent.value = data.url;
        //     this.currentEvent.fileName = data.label;
        //     this.currentEvent.suffix = data.suffix;
        //
        //     $('#datainput' + this.currentEvent.dataId).removeClass("spinner");
        //     this.userDataSpaceVisible = false;
        // },


        checkTaskInfo(task){
            this.taskInfoVisible = true
            console.log(this.integratedTaskList[0].id)
            axios.get('/task/getIntegrateTaskByOid',{
                params:{
                    taskOid:task.oid
                }
            }).then((res) => {
                if(res.data.data!=null){
                    task = res.data.data
                }
                this.checkedTask = task
                console.log(this.integratedTaskList[0].modelActions.length)
            })

        },

        loadTask(task){
            this.models = task.models
            this.modelActions = task.modelActions
            this.iframeWindow.setCXml(task.mxGraph);
            this.taskInfoVisible = false
            this.currentTask = task
            this.activeTask = 'currentTask'
        },

        handlePageChange(val) {
            this.pageOption.currentPage = val;

            if(this.inSearch==0)
                this.listIntegrateTask();
            else
                this.searchDeployedModel()
        },

        listIntegrateTask(){
            axios.get("/task/pageIntegrateTaskByUser",{
                params:{
                    asc:0,
                    pageNum:this.pageOption.currentPage-1,
                    pageSize:6,
                    sortElement:'lastModifiedTime'
                }
            }).then((res)=>{
                if(res.data.code == -1){
                    this.integratedTaskList = 'login'
                }else{
                    let data = res.data.data
                    this.integratedTaskList = data.content
                    this.pageOption.total = data.total;
                }
            })
        },

        deleteIntegrateTask(task){
            const h = this.$createElement;
            this.$msgbox({
                title: ' ',
                message: h('p', null, [
                    h('span', {style: 'font-size:15px'}, 'All of the selected files will be deleted.'),
                    h('br'),
                    h('span', null, 'Are you sure to '),
                    h('span', {style: 'color: #e6a23c;font-weight:600'}, 'continue'),
                    h('span', null, '?'),
                ]),
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'confirm',
                cancelButtonText: 'cancel',
                beforeClose: (action, instance, done) => {

                    if (action === 'confirm') {
                        instance.confirmButtonLoading = true;
                        instance.confirmButtonText = 'deleting...';
                        setTimeout(() => {
                            axios.delete("/task/deleteIntegratedTask",{
                                params:{
                                    taskOid:task.oid
                                }
                            }).then((res)=>{
                                    if(res.data.code == -1){
                                        this.$alert('Please login first!',{
                                            confirmButtonText:'confirm',
                                            callback:action => {
                                            }
                                        })
                                        window.location.href = "/user/login";
                                    }

                                    if(res.data.data==1){
                                        this.$alert('Delete task successfully','success',{
                                            confirmButtonText:'confirm',
                                            callback:action => {
                                                this.deleteCurrentTask(task)
                                            }
                                        })
                                    }else{
                                        this.$alert('Cannot find this task','danger',{
                                            confirmButtonText:'confirm',
                                            callback:action => {
                                            }
                                        })
                                    }
                                    this.taskInfoVisible = false
                                    this.listIntegrateTask()
                                }

                            )
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
                // this.$message({
                //     type: 'success',
                //     message: 'delete successful '
                // });
            });

        },

        deleteCurrentTask(task){
            if(task.oid===this.currentTask.oid){
                this.currentTask={}
            }
        }
    },

    mounted() {

        this.iframeWindow = $("#ModelEditor")[0].contentWindow;

        this.listIntegrateTask()

        //旧版本数据上传方式
        $("#uploadInputData").change(() => {

            $('#datainput' + this.currentEvent.dataId).addClass("spinner");

            var file = $('#uploadInputData')[0].files[0];
            var formData = new FormData();
            formData.append("file", file);

            $.get("/dataManager/dataContainerIpAndPort", (result) => {
                let ipAndPort = result.data;

                $.ajax({
                    type: "post",
                    url: "http://" + ipAndPort + "/file/upload/store_dataResource_files",
                    data: formData,
                    async: true,
                    processData: false,
                    contentType: false,
                    success: (result) => {
                        if (result.code == 0) {
                            var data = result.data;
                            var dataName = data.file_name.match(/.+(?=\.)/)[0];
                            var dataSuffix = data.file_name.match(/(?=\.).+/)[0];
                            var dataId = data.source_store_id;
                            var dataUrl = "http://" + ipAndPort + "/dataResource";
                            var form = {
                                "author": "njgis",
                                "fileName": dataName,
                                "sourceStoreId": dataId,
                                "suffix": dataSuffix,
                                "type": "OTHER",
                                "fromWhere": "PORTAL"
                            };

                            $.ajax({
                                type: "post",
                                url: dataUrl,
                                data: JSON.stringify(form),
                                processData: false,
                                async: true,
                                contentType: 'application/json',
                                success: (result) => {
                                    if (result.code == 0) {

                                        this.currentEvent.value = "http://" + ipAndPort + "/data?uid=" + result.data.sourceStoreId;
                                        this.currentEvent.fileName = result.data.fileName;
                                        this.currentEvent.suffix = result.data.suffix;

                                    }

                                    $("#uploadInputData").val("");

                                    $('#datainput' + this.currentEvent.dataId).removeClass("spinner");

                                }
                            })


                        }
                    }
                })
            })
        });

        setTimeout(() => {
            if (graphXml != undefined) {
                this.iframeWindow = $("#ModelEditor")[0].contentWindow;
                this.iframeWindow.setCXml(graphXml);

                // 把图形中的计算模型，加载到词典中
                this.modelActions = this.iframeWindow.getModels();
                this.modelActions.forEach((model) => {
                    $.ajax({
                        url: '/computableModel/getComputableModelsBySearchTerms',
                        data: {
                            searchTerms: model.name
                        },
                        async: true,
                        success: (result) => {
                            for (let m in result) {
                                this.iframeWindow.hasSearchedTermsComputableModel.push(result[m]);
                            }
                        }
                    });
                });

                for (var i = 0; i < this.modelActions.length; i++) {
                    for (var j = 0; j < this.modelActions[i].inputData.length; j++) {
                        var event = this.modelActions[i].inputData[j];

                        // 把输入数据的 value fileName 和  suffix 复制给 this.modelActions


                        // 把计算模型的 参数数据 复制给 this.modelActions

                        var nodes = event.data[0].nodes;
                        let refName = event.data[0].text.toLowerCase();
                        if (nodes != undefined && refName != "grid" && refName != "table" && refName != "shapes") {
                            let children = [];
                            for (k = 0; k < nodes.length; k++) {
                                let node = nodes[k];
                                let child = {};
                                child.dataId = node.text;
                                child.event = node.text;
                                child.description = node.desc;
                                child.eventType = node.dataType;

                                child.child = true;
                                children.push(child);
                            }
                            event.children = children;
                        }
                    }
                }


            }
        }, 500);

        // window.selectInputData = this.selectInputData;
        window.deleteModel = this.deleteModel;
        window.addModeltoList = this.addModeltoList;
        window.generateGUID = this.generateGUID;
    }

});