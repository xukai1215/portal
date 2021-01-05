//说明：integratedEditor页面为iframe嵌入的mxgraph，
//mxgraph的控制由integratedGraphEditor/js中的数个文件实现：
//   SideBar.js:{1.添加模型到mxgraph中
//               2.左侧栏的搜索结果/形成cell列、模型-cell组织createStateVertexTemplate
//               3.右侧的event-cell组织createEventVertexTemplate
//               4.鼠标事件down move up 拖拽加入cell
//   }
//
//   Actions.js:{1.删除一个cell deleteCells
//
//   }
//
//   format.js:{1.生成events,点击拖拽置入event
//              2.点击event查看event的详细信息
//
//
//   }
//
//   editor.html:{1.getModels
//                2.linkDataFlow 生成input的link属性
//
//   }
//
//   手动连接两个cell: static/js/mxGraph/js/handler/mxConnectionHandler.js mxConnectionHandler.prototype.connect
//
//   侧边栏拉入model-cell流程（2020.10.22）：点击，触发format.js中的refresh方法，生成对应元素，没有frontId则先不生成event，同时生成右边栏的文字.
//   鼠标释放cell，触发sideBar.js 的ds.mouseup,判断条件后调用全局方法加入到vue页面形成modelAction,并把vue页面生成的frontId返回赋值给这个cell
//
//   点击cell触发右侧详情panel生成（2020.10.22）：format refresh-panel.appendChild-各种panel.init
//
var vue = new Vue({
    el: "#app",
    props: [],
    data: {
        models:[],
        modelActions: [],
        modelParams: [],

        dataProcessings:[],

        processingTools:[],

        conditions:[],

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

        configEvent:[],

        eventConfigDialog:false,

        dataLinks:[],

        dataLinkConfig:{
            tool:''
        },

        dataLinkConfigDialog:false,

        convertToolsVisible:false,

        loading:false,

        convertTools:[
            {
                oid:'121',
                name:'testTool',
            }
            ],

        logicalModelLoadDialog:false,

        logicalScene:{
            modelItems: [],
            dataItems:[],
            conditionItems:[],
            operations:[],
            dependencies:[]
        },

        uploadLogicalConfigList:[],
        uploadLogicalXmlList:[],

        dataProcessingLoadDialog:false,

        dataProcessingConfig:{
            id:''
        },

        dataProcessActive:'modelService',

        dataPModelServices:[],

        conditionLoadDialog:false,

        conditionConfig:{
            id:'',
            value:'',
            format:'',
            cases:[

            ],
        },

        conditionConfigDialog:false,

        conditionCaseDialog:false,

        caseConfig:{
            operator:'',
            standard: '',
            relation:'',
        },

        editCase:-1,

        dataLines:['Default'],

        dataItemList:[],

        dataColorPool:{},

        activeName:'first',
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
            let modelAction = this.checkModelAction(model)
            modelAction.id=this.generateGUID()//可能会加入两个md5值一样的模型，加入标识码在前端区分

            this.addModelActionToModelActionList(modelAction,this.modelActions)

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

        checkModelAction(model){//根据加入的model生成modelAction
            let modelAction = {}

            modelAction.iterationNum=1//迭代次数,默认为1
            modelAction.description=''
            modelAction.name=model.name
            modelAction.modelName=model.name
            modelAction.modelOid=model.oid
            modelAction.md5 = model.md5
            if(model.mdlJson != undefined){
                modelAction.mdlJson = model.mdlJson
            }

            this.extractEvents(model,modelAction)//拼接好input和output

            return modelAction
        },

        addModelActionToModelActionList(modelAction,modelActionList){
            modelAction.step=modelActionList.length + 1
            for(let ele of modelActionList){//一样的模型order不同
                if(modelAction.md5===ele.md5){
                    modelAction.order = ele.order+1
                }else{
                    modelAction.order = 1
                }
            }

            modelActionList.push(modelAction)
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
                        event.name = event.eventName;
                        if (event.eventType == "response") {
                            event.response = true
                            inputData.push(event);
                        } else {
                            event.response = false
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

        findTargetModelAction(id){
            for (let i = 0;i<this.modelActions.length;i++){
                if (this.modelActions[i].id === id){
                    return [i,this.modelActions[i]]
                }
            }
            for(let i=0;i<this.dataProcessings.length;i++){
                if(this.dataProcessings[i].id === id){
                    return [i,this.dataProcessings[i]]
                }
            }
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
                            model.inputData[i].type = mxModel.inputData[i].type
                            model.inputData[i].linkEvent = mxModel.inputData[i].linkEvent
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

            for (var j = 0; j < this.configModelAction.inputData.length&&this.configModelAction.type!="dataService"; j++) {
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

        dataCellConfig(inputCell){
            this.configEvent = []
            for(let modelAction of this.modelActions){
                if(modelAction.id==inputCell.frontId){
                    for(let input of modelAction.inputData){
                        if(input.eventName === inputCell.value){
                            this.configEvent[0] = input
                            break;
                        }
                    }
                }
            }

            if(this.configEvent.length == 0){
                for(let dataProcessing of this.dataProcessings){
                    if(dataProcessing.id==inputCell.frontId){
                        for(let input of dataProcessing.inputData){
                            if(input.name === inputCell.value){
                                this.configEvent[0] = input
                                this.configEvent[0].eventName = input.name
                                this.configEvent[0].eventDesc = input.description
                                break;
                            }
                        }
                    }
                }
            }

            this.eventConfigDialog = true
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

        generateXml(type){

            let mxModels = this.iframeWindow.getModels();

            for(let model of this.modelActions){
                for(let ele of mxModels){
                    if(ele.frontId===model.id){//id在mxgraph中是frontId
                        this.mxModelToModel(ele,model)
                        break;
                    }
                }
            }

            for(let model of this.dataProcessings){
                for(let ele of mxModels){
                    if(ele.frontId===model.id){//id在mxgraph中是frontId
                        this.mxModelToModel(ele,model)
                        break;
                    }
                }
            }

            let name = this.taskName;
            let version = "1.0";
            let uid = this.generateGUID();
            let dataLinks = []
            let xml=''
            xml += "<TaskConfiguration uid='" + uid + "' name='" + name + "' version='" + version + "'>\n"
            if (this.models.length > 0) {
                xml += "\t<Models>\n";
                for (let i = 0; i < this.models.length; i++) {
                    xml += "\t\t<Model name='" + this.models[i].name + "' pid='" + this.models[i].md5 + "' description='" + this.models[i].description + "'/>\n";
                }
                xml += "\t</Models>\n";
            }

            if (this.processingTools.length > 0) {
                xml += "\t<ProcessingTools>\n";
                for (let i = 0; i < this.processingTools.length; i++) {
                    xml += "\t\t<ProcessingTool name='" + this.processingTools[i].name + "' type='" + this.processingTools[i].type + "' source='" + this.processingTools[i].source + "' service='" + this.processingTools[i].service
                         ;
                    if(this.processingTools.type == 'dataService'){
                        xml += ("' token='" + this.processingTools[i].token)
                    }
                    xml +=( "' description='" + this.processingTools[i].description + "' param='" + this.processingTools[i].param + "'/>\n")
                }
                xml += "\t</ProcessingTools>\n";
            }


            //modelAction标签
            if(this.modelActions.length>0) {
                xml += "\t<ModelActions>\n";
                for (let i = 0; i < this.modelActions.length; i++) {
                    xml += "\t\t<ModelAction id='" + this.modelActions[i].id + "' name='" + this.modelActions[i].name + "' description='" + this.modelActions[i].description + "' model='" + this.modelActions[i].md5
                        + "' step ='" + this.modelActions[i].step + "' iterationNum='" + this.modelActions[i].iterationNum + "'>\n" +
                        "\t\t\t<Inputs>\n";
                    for (let j = 0; j < this.modelActions[i].inputData.length; j++) {
                        if ((this.modelActions[i].inputData[j].value != "" && this.modelActions[i].inputData[j].value != undefined)
                            || (this.modelActions[i].inputData[j].link != "" && this.modelActions[i].inputData[j].link != undefined)) {
                            xml += "\t\t\t\t<DataConfiguration id='" + this.modelActions[i].inputData[j].eventId + "' state='" + this.modelActions[i].inputData[j].stateName + "' event='" + this.modelActions[i].inputData[j].eventName + "'>\n"

                            xml += "\t\t\t\t\t<Data"
                            if (this.modelActions[i].inputData[j].value != undefined && this.modelActions[i].inputData[j].value != '') {
                                xml += " value='" + this.modelActions[i].inputData[j].value + "'"
                                this.modelActions[i].inputData[j].type = 'url'
                            }
                            if (this.modelActions[i].inputData[j].link != undefined && this.modelActions[i].inputData[j].link != '') {
                                xml += " link='" + this.modelActions[i].inputData[j].link + "'"
                                if (this.modelActions[i].inputData[j].type == '') {
                                    this.modelActions[i].inputData[j].type = 'link'
                                } else if (this.modelActions[i].inputData[j].type == 'url') {
                                    this.modelActions[i].inputData[j].type = 'mixed'
                                }

                                // let fromAction = this.findTargetByOutputId(this.modelActions,this.modelActions[i].inputData[j].link)
                                // let dataLink = {
                                //     inputEvent: this.modelActions[i].inputData[j].eventId,
                                //     outputEvent: this.modelActions[i].inputData[j].link
                                // }  //to
                                // dataLinks.push(dataLink)
                            }
                            xml += " type='" + this.modelActions[i].inputData[j].type + "'/>\n";
                            xml += "\t\t\t\t</DataConfiguration>\n"
                        } else if (this.modelActions[i].inputData[j].optional == false && type === 'execute') {
                            this.$alert('Please check input of the model action ' + this.modelActions[i].name)
                            return;
                        }
                    }
                    xml += "\t\t\t</Inputs>\n" +
                        "\t\t\t<Outputs>\n";
                    for (var k = 0; k < this.modelActions[i].outputData.length; k++) {
                        this.modelActions[i].outputData[k].url = ''
                        xml += "\t\t\t\t<DataConfiguration id='" + this.modelActions[i].outputData[k].eventId + "' state='" + this.modelActions[i].outputData[k].stateName +
                            "' event='" + this.modelActions[i].outputData[k].eventName + "'/>\n";
                    }
                    xml += "\t\t\t</Outputs>\n" +
                        "\t\t</ModelAction>\n";
                }
                xml += "\t</ModelActions>\n";
            }
            //dataProcessing标签
            if(this.dataProcessings.length>0){
                xml += "\t<DataProcessings>\n";
                for (let i = 0; i < this.dataProcessings.length; i++) {
                    if(1){
                        xml += "\t\t<DataProcessing id='" + this.dataProcessings[i].id + "' name='" + this.dataProcessings[i].name + "' type='" + this.dataProcessings[i].type + "' service='" + this.dataProcessings[i].service + "' description='" + this.dataProcessings[i].description
                            + `${this.dataProcessings[i].token==undefined?'': `' token='${this.dataProcessings[i].token}`}` + "'>\n" +
                            "\t\t\t<Inputs>\n";
                        for (let j = 0; j < this.dataProcessings[i].inputData.length; j++) {
                            if ((this.dataProcessings[i].inputData[j].value != "" && this.dataProcessings[i].inputData[j].value != undefined)
                                || (this.dataProcessings[i].inputData[j].link != "" && this.dataProcessings[i].inputData[j].link != undefined)) {
                                xml += "\t\t\t\t<DataConfiguration id='" +this.dataProcessings[i].inputData[j].eventId
                                if(this.dataProcessings[i].type==='modelService'){
                                    xml += "' state='" + this.dataProcessings[i].inputData[j].stateName + "' event='" + this.dataProcessings[i].inputData[j].eventName
                                }
                                xml += "'>\n"

                                xml += "\t\t\t\t\t<Data"
                                if (this.dataProcessings[i].inputData[j].value != undefined && this.dataProcessings[i].inputData[j].value != '') {
                                    xml += " value='" + this.dataProcessings[i].inputData[j].value + "'"
                                    this.dataProcessings[i].inputData[j].type = 'url'
                                }
                                if (this.dataProcessings[i].inputData[j].link != undefined && this.dataProcessings[i].inputData[j].link != '') {
                                    xml += " link='" + this.dataProcessings[i].inputData[j].link + "'"
                                    if(this.dataProcessings[i].inputData[j].type == ''){
                                        this.dataProcessings[i].inputData[j].type = 'link'
                                    }else if(this.dataProcessings[i].inputData[j].type == 'url'){
                                        this.dataProcessings[i].inputData[j].type = 'mixed'
                                    }

                                    // let fromAction = this.findTargetByOutputId(this.dataProcessings,this.dataProcessings[i].inputData[j].link)
                                    // let dataLink = {
                                    //     inputEvent: this.dataProcessings[i].inputData[j].eventId,
                                    //     outputEvent: this.dataProcessings[i].inputData[j].link
                                    // }  //to
                                    // dataLinks.push(dataLink)
                                }
                                xml += " type='" + this.dataProcessings[i].inputData[j].type + "'/>\n";
                                xml += "\t\t\t\t</DataConfiguration>\n"
                            } else if(this.dataProcessings[i].inputData[j].optional==false&&type === 'execute'){
                                this.$alert('Please check input of the dataProcessing '+this.dataProcessings[i].name)
                                return null;
                            }
                        }
                        xml += "\t\t\t</Inputs>\n" +
                            "\t\t\t<Outputs>\n";
                        for (var k = 0; k < this.dataProcessings[i].outputData.length; k++) {
                            this.dataProcessings[i].outputData[k].url=''
                            xml += "\t\t\t\t<DataConfiguration id='" +`${this.dataProcessings[i].type=='modelService'?`${this.dataProcessings[i].outputData[k].eventId}`:`${this.dataProcessings[i].outputData[k].id}`}`
                            if(this.dataProcessings[i].type==='modelService'){
                                xml += "' state='" + this.dataProcessings[i].outputData[k].stateName + "' event='" + this.dataProcessings[i].outputData[k].eventName
                            }
                            xml += "'/>\n";
                        }
                        xml += "\t\t\t</Outputs>\n" +
                            "\t\t</DataProcessing>\n";
                    }else{

                    }

                }
                xml += "\t</DataProcessings>\n";
            }


            //condition标签
            if (this.checkConditionStatus()&&this.conditions.length > 0) {
                xml += "\t<Conditions>\n";
                for (let ele of this.conditions) {
                    xml += "\t\t<Condition id='" + ele.id + "' value='" + ele.value + "' link='" + ele.link + "' format='" + ele.format + "' true='" + ele.true + "' false='" + ele.false
                    for(let conditionCase of this.conditions.cases){
                        xml += `\t\t\t<Case operator='${conditionCase.operator}' standard='${conditionCase.standard}' relation='${conditionCase.relation}'/>`
                    }
                    xml += "\t\t\t</Inputs>\n" +
                        "\t\t\t<Outputs>\n";
                    xml += "'\t\t/Condition>\n"
                }
                xml += "\t</Conditions>\n";

            }

            if (this.dataLinks.length > 0) {
                xml += "\t<DataLinks>\n";
                for (let ele of this.dataLinks) {
                    xml += "\t\t<DataLink from='" + ele.source + "' to='" + ele.target
                    // if(ele.tool!=undefined&&ele.tool!=''){
                    //     xml += "' tool='" + ele.tool
                    // }
                    xml += "'/>\n"
                }
                xml += "\t</DataLinks>\n";

            }
            xml += "</TaskConfiguration>";

            return xml
        },

        executeNew() {
            this.executeVisible = false;

            // if (this.models.length < 1) {
            //     this.$alert('Please select  at least one model.', {
            //         confirmButtonText: 'OK',
            //     })
            //     return
            // }

            this.$notify.info({
                title: 'Start Executing !',
                message: 'You could wait it, and you could also find this task in your Space!',
            });


            var name = this.taskName;
            var version = "1.0";

            var taskJson = {}


            let dataLinks=[]

            let mxgraph = this.iframeWindow.getCXml();

            // if(this.models===this.savedModels&&this.modelActions===this.savedModelActions){
            //     xml = this.savedXML
            // } else {


            var xml = this.generateXml('execute');

            if(xml != null){
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

                let saveStatus = this.saveIntegratedTask(xml,mxgraph,this.models,this.modelActions,this.processingTools,this.dataProcessings,this.dataLinks)
                if(saveStatus==='suc'){
                    var formData = new FormData();
                    formData.append("file", file);
                    formData.append("name", this.taskName);
                    formData.append("taskOid", this.currentTaskOid);

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
                    this.updateMxgraphNode(taskInfo.dataProcessingList)
                    this.updateTaskoutput(taskInfo)
                    if (status == 0) {
                        console.log(status);
                    } else if (status == -1) {
                        console.log(status);
                        clearInterval(interval);
                        clearInterval(this.flashInterval);
                        this.$alert('Integrated model failed to run!', 'Error', {
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
                        setTimeout(()=>{ this.$alert('Integrated model succeeded to run!', 'Success', {
                            confirmButtonText: 'OK',
                            callback: action => {
                                this.$message({
                                    type: 'success',
                                    message: `action: ${action}`
                                });
                            }
                        });},300)


                        var cxml = this.iframeWindow.getCXml();
                        var doc = this.string2XML(cxml);

                        this.updateTaskoutput(taskInfo,doc)

                        // this.iframeWindow.setCXml(xml);

                    }

                }
            })
        },

        updateTaskoutput(taskInfo,doc){
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
                                        // this.unFoldMultiOutput(m1,o1);
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

        updateMxgraphNode(actionList){
            // let style={
            //     'waiting':'rounded=0;whiteSpace=wrap;html=1;strokeWidth=2;strokeColor=#0073e8;fillColor=#d9edf7;',
            //     'running':'rounded=0;whiteSpace=wrap;html=1;strokeWidth=2;strokeColor=#449d44;fillColor=#ffd058;',
            //     'completed':'rounded=0;whiteSpace=wrap;html=1;strokeWidth=2;strokeColor=#449d44;fillColor=#EEFFEE;',
            //     'failed':'rounded=0;whiteSpace=wrap;html=1;strokeWidth=2;strokeColor=#a94442;fillColor=#ede2e2;',
            // }

            let flashFlag = 0
            for(let action of actionList.waiting){
                clearInterval(this.flashInterval)
                this.iframeWindow.setNodeStyle(action.id,'waiting')//这个方法在integratedModelEditor.html里面
            }
            for(let action of actionList.running){
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
                this.iframeWindow.setNodeStyle(action.id,'running')
            }
            for(let action of actionList.completed){
                clearInterval(this.flashInterval)
                this.iframeWindow.setNodeStyle(action.id,'completed')
            }
            for(let action of actionList.failed){
                clearInterval(this.flashInterval)
                this.iframeWindow.setNodeStyle(action.id,'failed')
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

            let xml = this.generateXml('save')

            let mxgraph = this.iframeWindow.getCXml();

            if (Object.keys(this.currentTask) != 0) {
                this.updateIntegratedTask(this.currentTask.oid, xml, mxgraph, this.models, this.modelActions,this.processingTools,this.dataProcessings,this.dataLinks)
            } else {
                this.saveIntegratedTask(xml, mxgraph, this.models, this.modelActions,this.processingTools,this.dataProcessings,this.dataLinks)
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

        generateTaskDataProcessingInfo(processingTools,dataProcessings){
            let addTools = []
            let addProcessings = []

            //拼接集成模型中的models部分
            for(let tool of processingTools){
                let addTool={
                    name:tool.name,
                    source:tool.source,
                    service:tool.service,
                    type:tool.type,
                    description:tool.description,
                    param:tool.param

                }
                addTools.push(addTool)
            }

            //拼接集成模型中的modelActions部分
            for(let dataProcessing of dataProcessings){
                let addProcessing={
                    id:dataProcessing.id,
                    type:dataProcessing.type,
                    name:dataProcessing.name,
                    service:dataProcessing.service,
                    description:dataProcessing.description,
                    token:dataProcessing.token,
                    outputData:[],
                    inputData:[],
                }
                if(dataProcessing.type=='modelService'){
                    for(let event of dataProcessing.outputData){
                        addProcessing.outputData.push({
                            eventDesc: event.eventDesc,
                            eventId: event.eventId,
                            data: event.data,
                            eventName: event.eventName,
                            eventType: event.eventType,
                            optional: event.optional,
                            stateName: event.stateName,
                        })
                    }
                    for(let event of dataProcessing.inputData){
                        addProcessing.inputData.push({
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
                }else{
                    for(let event of dataProcessing.outputData){
                        addProcessing.outputData.push({
                            id:event.id,
                        })
                    }
                    for(let event of dataProcessing.inputData){
                        addProcessing.inputData.push({
                            id:event.id,
                            value: event.value,
                            link: event.link,
                            linkEvent: event.linkEvent,
                            fileName: event.fileName,
                            suffix: event.suffix,
                        })
                    }
                }


                addProcessings.push(addProcessing)
            }

            return [addTools,addProcessings]
        },


        UpdateIntegrateTaskClick(task){
            this.updateIntegratedTask(task.oid,task.xml,task.mxGraph,task.models,task.modelActions,task.processingTools,task.dataProcessings,this.dataLinks)
            this.taskInfoVisible = false
        },

        updateIntegratedTask(taskOid,xml,mxgraph,models,modelActions,processTools,dataProcessings,dataLinks){
            let model7modelActions = this.generateTaskModelInfo(models,modelActions)
            let tool7Processing = this.generateTaskDataProcessingInfo(processTools,dataProcessings)

            let data = {
                taskOid: taskOid,
                xml: xml,
                mxgraph:mxgraph,
                models:model7modelActions[0],
                processingTools:tool7Processing[0],
                modelActions: model7modelActions[1],
                dataProcessings: tool7Processing[1],
                dataLinks: dataLinks,
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

        saveIntegratedTask(xml,mxgraph,models,modelActions,processTools,dataProcessings,dataLinks){//保存一个集成模型配置
            let model7modelActions = this.generateTaskModelInfo(models,modelActions)
            let tool7Processing = this.generateTaskDataProcessingInfo(processTools,dataProcessings)

            let data = {
                xml: xml,
                mxgraph:mxgraph,
                models:model7modelActions[0],
                processingTools:tool7Processing[0],
                modelActions: model7modelActions[1],
                dataProcessings: tool7Processing[1],
                dataLinks: dataLinks,
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
                    window.open('/profile/'+res.data.data)
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

                                        this.currentEvent.value = "http://" + ipAndPort + "/data/" + result.data.sourceStoreId;
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
                window.open(this.currentEvent.value);
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

            this.$nextTick(()=>{
                this.$refs.userDataSpace.getFilePackage();
            })
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
            this.dataLinks = task.dataLinks
            if(this.processingTools!=undefined){
                this.processingTools = task.processingTools
            }
            if(task.dataProcessings!=undefined){
                this.dataProcessings = task.dataProcessings
            }
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
        },

        insertDataLink(edgeCell){//传入mxgraph中的连线，生成datalink
            let targetCell = edgeCell.target//edge的两端是event
            let sourceCell = edgeCell.source

            let targetModelAction = this.findTargetModelAction(targetCell.frontId)[1]
            let sourceModelAction = this.findTargetModelAction(sourceCell.frontId)[1]

            let link={
                target:targetCell.eid,
                targetName:targetCell.value,
                targetModelId:targetModelAction.id,
                targetModelName:targetModelAction.name,
                source:sourceCell.eid,
                sourceName:sourceCell.value,
                sourceModelId:sourceModelAction.id,
                sourceModelName:sourceModelAction.name,
            }

            this.dataLinks.push(link)
        },

        deleteDataLink(edgeCell){
            let targetCell = edgeCell.target//edge的两端是event
            let sourceCell = edgeCell.source

            for(let i = this.dataLinks.length-1;i>=0;i--){
                if( this.dataLinks[i].targetModelId === targetCell.frontId&& this.dataLinks[i].sourceModelId === sourceCell.frontId){
                    this.dataLinks.splice(i,1)
                    break;
                }
            }
        },

        configDataLink(edgeCell){
            let targetCell = edgeCell.target//edge的两端是event
            let sourceCell = edgeCell.source

            for(let i = this.dataLinks.length-1;i>=0;i--){
                if( this.dataLinks[i].targetModelId === targetCell.frontId&& this.dataLinks[i].sourceModelId === sourceCell.frontId){
                    this.dataLinkConfig = this.dataLinks[i]
                    this.dataLinkConfigDialog = true
                    break;
                }
            }
        },

        loadConvertTool(toolOid){
            this.dataLinkConfig.tool = toolOid
            this.convertToolsVisible = false
        },

        loadLogicalModelClick(){
            this.logicalModelLoadDialog = true
        },

        loadLogicalModelConfig(str) {
            var mxUtils = this.iframeWindow.getMxUtil()

            // let str = "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n" +
            //     "<LogicalScene uid=\"65f14802-28d6-4758-9ad9-1fcba148ef04\" name=\"\" version=\"1\">\n" +
            //     "    <ModelCollection>\n" +
            //     "        <ModelItem uid=\"d890f76f-faf1-4fb8-9bf5-f16e9baa7a97\" name=\"ma\" description=\"\"/>\n" +
            //     "        <ModelItem uid=\"df0c1680-7687-4d5b-95b9-1a20853a7bb9\" name=\"mb\" description=\"\"/>\n" +
            //     "        <ModelItem uid=\"8f988830-84ee-4c91-bd51-20a0711a42f3\" name=\"mc\" description=\"\"/>\n" +
            //     "    </ModelCollection>\n" +
            //     "    <DataCollection>\n" +
            //     "        <DataItem uid=\"b4265267-76d3-4176-8d6a-acaf958c06f3\" name=\"dataA\" description=\"\"/>\n" +
            //     "        <DataItem uid=\"6a18c871-c5c6-4ae0-8120-7e974e207c22\" name=\"dataE\" description=\"\"/>\n" +
            //     "    </DataCollection>\n" +
            //     "    <ConditionCollection>\n" +
            //     "        <ConditionItem uid=\"0e6b067d-b7a7-40ab-809d-b9f5d6bc0166\" name=\"c1\" description=\"\"/>\n" +
            //     "    </ConditionCollection>\n" +
            //     "    <OperationCollection>\n" +
            //     "        <OperationItem uid=\"48255ad4-1a17-4f24-8f72-79fef50de21b\" name=\"op1\" description=\"\"/>\n" +
            //     "    </OperationCollection>\n" +
            //     "    <DependencyCollection/>\n" +
            //     "</LogicalScene>"
            if (str != "") {
                var modelItems = [];
                var emptyModelReg = /<ModelCollection\/>/;
                if (!emptyModelReg.test(str)) {
                    var ModelReg = /<ModelCollection>([\S\s]*)<\/ModelCollection>/;
                    var modelItemsXMLStr = str.match(ModelReg)[0];
                    var modelItemsNode = mxUtils.parseXml(modelItemsXMLStr).children[0];
                    for (let i = 0; i < modelItemsNode.children.length; i++) {
                        let modelItem = {};
                        let uid = modelItemsNode.children[i].getAttribute("uid");
                        modelItem.uid = uid;
                        let name = modelItemsNode.children[i].getAttribute("name");
                        modelItem.name = name;
                        let description = modelItemsNode.children[i].getAttribute("description");
                        modelItem.description = description;
                        modelItems.push(modelItem);
                    }
                }

                var dataItems = [];
                var emptyDataReg = /<DataCollection\/>/;
                if (!emptyDataReg.test(str)) {
                    var DataReg = /<DataCollection>([\S\s]*)<\/DataCollection>/;
                    var dataItemsXMLStr = str.match(DataReg)[0];
                    var dataItemsNode = mxUtils.parseXml(dataItemsXMLStr).children[0];
                    for (let i = 0; i < dataItemsNode.children.length; i++) {
                        let dataItem = {};
                        let uid = dataItemsNode.children[i].getAttribute("uid");
                        dataItem.uid = uid;
                        let name = dataItemsNode.children[i].getAttribute("name");
                        dataItem.name = name;
                        let description = dataItemsNode.children[i].getAttribute("description");
                        dataItem.description = description;
                        dataItems.push(dataItem);
                    }
                }

                var conditionItems = [];
                var emptyConditionReg = /<ConditionCollection\/>/;
                if (!emptyConditionReg.test(str)) {
                    var ConditionReg = /<ConditionCollection>([\S\s]*)<\/ConditionCollection>/;
                    var conditionItemsXMLStr = str.match(ConditionReg)[0];
                    var conditionItemsNode = mxUtils.parseXml(conditionItemsXMLStr).children[0];
                    for (let i = 0; i < conditionItemsNode.children.length; i++) {
                        let conditionItem = {};
                        let uid = conditionItemsNode.children[i].getAttribute("uid");
                        conditionItem.uid = uid;
                        let name = conditionItemsNode.children[i].getAttribute("name");
                        conditionItem.name = name;
                        let description = conditionItemsNode.children[i].getAttribute("description");
                        conditionItem.description = description;
                        conditionItems.push(conditionItem);
                    }
                }

                var operations = [];
                var emptyOperationReg = /<OperationCollection\/>/;
                if (!emptyOperationReg.test(str)) {
                    var OperationReg = /<OperationCollection>([\S\s]*)<\/OperationCollection>/;
                    var operationsXMLStr = str.match(OperationReg)[0];
                    var operationsNode = mxUtils.parseXml(operationsXMLStr).children[0];
                    for (let i = 0; i < operationsNode.children.length; i++) {
                        let operation = {};
                        let uid = operationsNode.children[i].getAttribute("uid");
                        operation.uid = uid;
                        let name = operationsNode.children[i].getAttribute("name");
                        operation.name = name;
                        let description = operationsNode.children[i].getAttribute("description");
                        operation.description = description;
                        operations.push(operation);
                    }
                }

                var dependencies = [];
                var emptyDependencyReg = /<DependencyCollection\/>/;
                if (!emptyDependencyReg.test(str)) {
                    var DependencyReg = /<DependencyCollection>([\S\s]*)<\/DependencyCollection>/;
                    var dependenciesXMLStr = str.match(DependencyReg)[0];
                    var dependenciesNode = mxUtils.parseXml(dependenciesXMLStr).children[0];
                    for (let i = 0; i < dependenciesNode.children.length; i++) {
                        let dependency = {};
                        let uid = dependenciesNode.children[i].getAttribute("uid");
                        dependency.uid = uid;
                        let name = dependenciesNode.children[i].getAttribute("name");
                        dependency.name = name;
                        let description = dependenciesNode.children[i].getAttribute("description");
                        dependency.description = description;
                        dependency.from = dependenciesNode.children[i].children[0].getAttribute("idRef");
                        dependency.fromtype = dependenciesNode.children[i].children[0].getAttribute("type");
                        dependency.to = dependenciesNode.children[i].children[1].getAttribute("idRef");
                        dependency.totype = dependenciesNode.children[i].children[1].getAttribute("type");
                        dependencies.push(dependency);
                    }
                }
                this.logicalScene.modelItems = modelItems;
                this.logicalScene.dataItems = dataItems;
                this.logicalScene.conditionItems = conditionItems;
                this.logicalScene.operations = operations;
                this.logicalScene.dependencies = dependencies;
            }
        },

        uploadLogicalConfigFile(){
            $('#uploadConfig').click()
        },

        uploadLogicalXmlFile(){
            $('#uploadXml').click()
        },

        uploadChange1(file, fileList) {
            this.uploadLogicalConfigList = fileList;
            // fileList = []
            // fileList[0] = file
        },

        uploadRemove1(file, fileList) {
            this.uploadLogicalConfigList = [];
            // fileList = []
            // fileList[0] = file
        },

        uploadChange2(file, fileList) {
            this.uploadLogicalXmlList = fileList;
            // fileList = []
            // fileList[0] = file
        },

        uploadRemove2(file, fileList) {
            this.uploadLogicalXmlList = [];
            // fileList = []
            // fileList[0] = file
        },

        loadLogicalConfig(){

        },

        loadLogicalConfig7Xml(){
            var reader1 = new FileReader();
            var reader2 = new FileReader();
            let v_this = this
            reader1.readAsText(v_this.uploadLogicalConfigList[0].raw, "UTF-8");//读取文件
            reader1.onload = function(evt){ //读取完文件之后会回来这里
                let fileStr = evt.target.result;
                v_this.loadLogicalModelConfig(fileStr)
            }
            reader2.readAsText(v_this.uploadLogicalXmlList[0].raw, "UTF-8");//读取文件
            reader2.onload = function(evt){ //读取完文件之后会回来这里
                let fileStr = evt.target.result;
                v_this.iframeWindow.setCXml(fileStr);
            }
        },

        // addDataProcessToList(dataProcess){
        //     dataProcess.id = this.generateGUID();
        //     return dataProcess
        // },

        insertGeneralCell(targetCell,type){
            let item = {
                id:targetCell.frontId
            }

            if(type == 'operation'){
                this.dataProcessings.push(item)

            }else if(type == 'condition'){
                item.cases = []
                this.conditions.push(item)
            }
        },

        deleteGeneralList(frontId,type){
            let list = []
            if(type == 'operation'){
                list = this.dataProcessings;
            }else if(type == 'condition'){
                list = this.conditions
            }

            for(let i = list.length-1;i>=0;i--){
                if (list[i].id == frontId){
                    list.splice(i,1)
                    break
                }
            }


        },

        selectModelService(model){
            if(this.selectedDataProcessing != {})
                this.$refs.dataP_dataService.cancelMutiSelect(this.selectedDataProcessing)
        },

        removeModelService(model){

        },

        configDataProcessing(dataProcessingCell){
            this.dataProcessingLoadDialog = true
            for(let dataProcessing of this.dataProcessings){
                if(dataProcessing.id == dataProcessingCell.frontId){
                    this.dataProcessingConfig = dataProcessing
                    break
                }
            }
        },

        deleteDataProcessingClick(dataProcessing){
            this.iframeWindow.removeTargetCell(dataProcessing);
            this.deleteDataProcessing(dataProcessing.id,dataProcessing.name ,dataProcessing.md5)
        },

        deleteDataProcessing(dataProcessingId,name,md5){
            let tag = md5==undefined?name:md5;
            let tagName = md5==undefined?'name':'md5';

            for(let i=this.dataProcessings.length-1;i>=0;i--){//从尾部开始寻找，在目标之后的模型任务step都要-1
                if(this.dataProcessings[i][tagName]===tag&&this.dataProcessings[i].id === dataProcessingId){
                    this.dataProcessings.splice(i,1)
                    break
                }else{
                    this.dataProcessings[i].step--
                }
            }
            for(let i=this.processingTools.length-1;i>=0;i--){//从尾部开始寻找，如果该模型对应的action只有一个则删除
                if(this.processingTools[i][tagName]===tag){
                    if(this.processingTools[i].actionNum>1){
                        this.processingTools[i].actionNum--
                    }else{
                        this.processingTools.splice(i,1)
                    }
                    break
                }
            }
        },

        /*
        dataProcessingList组件方法
         */
        selectDataProcessing(dataProcessing){
            this.selectedDataProcessing = dataProcessing;
            if(this.dataPModelServices.length!=0){
                this.$refs.dataP_ModelService.clearSelection()

            }
        },

        removeDataProcessing(dataProcessing) {
            this.selectedDataProcessing = {}
        },
        /*
         */

        loadDataProcessing(){
            var modelEditor = $("#ModelEditor")[0].contentWindow;
            if(this.dataPModelServices.length==0&&this.selectedDataProcessing==={}){
                return
            }
            let dataService = {}
            if(this.dataProcessActive == 'modelService'){
                for(let dataPModel of this.dataPModelServices){
                    dataService = this.checkModelAction(dataPModel)
                    this.dataProcessingConfig.name = dataService.name
                    this.dataProcessingConfig.type = this.dataProcessActive
                    this.dataProcessingConfig.service = dataService.md5
                    this.dataProcessingConfig.inputData = dataService.inputData
                    this.dataProcessingConfig.outputData = dataService.outputData
                    this.dataProcessingConfig.param = ''
                }

            }else if(this.dataProcessActive == 'dataService'){
                dataService = this.checkDataService(this.selectedDataProcessing)
                this.dataProcessingConfig.name = dataService.name
                this.dataProcessingConfig.type = this.dataProcessActive
                this.dataProcessingConfig.service = dataService.service
                this.dataProcessingConfig.token = dataService.token
                this.dataProcessingConfig.inputData = dataService.inputData
                this.dataProcessingConfig.outputData = dataService.outputData
                this.dataProcessingConfig.param = dataService.param
                this.dataProcessingConfig.description = dataService.param

            }

            this.addProcessingTools(this.dataProcessingConfig,this.processingTools)

            modelEditor.ui.sidebar.addDataProcessCellInfo(this.dataProcessingConfig)

            this.dataProcessingLoadDialog = false
        },

        checkDataService(dataPDataService){
            let dataProcessAction = {
                inputData:[],
                outputData:[],
            }
            let methodDetail = dataPDataService.metaDetail.Method
            let inputItem = methodDetail.Input.Item;
            let outputItem = methodDetail.Output.Item;

            // dataProcessAction.iterationNum=1//迭代次数,默认为1
            dataProcessAction.description=''
            dataProcessAction.name=dataPDataService.name
            dataProcessAction.service=dataPDataService.id
            dataProcessAction.token=dataPDataService.token
            dataProcessAction.param=''
            dataProcessAction.type='dataService'

            if(inputItem instanceof Array){
                for(let input of inputItem){
                    input.eventId = this.generateGUID()
                    input.response = true
                    dataProcessAction.inputData.push(input)
                }
            } else {
                inputItem.eventId = this.generateGUID()
                inputItem.response = true
                dataProcessAction.inputData.push(inputItem)
            }

            if(outputItem instanceof Array){
                for(let input of outputItem){
                    output.eventId = this.generateGUID()
                    output.response = false
                    dataProcessAction.outputData.push(output)
                }
            } else {
                outputItem.eventId = this.generateGUID()
                outputItem.response = false
                dataProcessAction.outputData.push(outputItem)
            }

            return dataProcessAction
        },

        addProcessingTools(tool,toolList){
            for(let ele of toolList){
                if(ele.type === tool.type && ele.service === tool.service){
                    ele.actionNum++
                    return
                }
            }
            let a={
                name:tool.name,
                source:'internal',
                type:tool.type,
                service:tool.service,
                description:tool.description,
                param:tool.param,
            }

            if(a.type=='dataService'){
                a.token=tool.token
            }
            a.actionNum=1
            toolList.push(a)
        },

        addDataProcessing(dataProcess,dataProcessings){
            dataProcess.order = 1
            for(ele of dataProcessings){
                if(ele.type == dataProcess.type && ele.service === dataProcess.service) {
                    dataProcess.order = ele.order + 1
                }
            }
            dataProcessings.push(dataProcess)
        },

        configCondition(cell){
            this.conditionConfigDialog = true
            for(let condition of this.conditions){
                if(condition.id == cell.frontId){
                    this.conditionConfig = condition
                    break
                }
            }
        },

        loadCondition(){

            this.conditionConfigDialog = false
        },

        loadConditionCaseInfo(){
            let expression = ''
            let value = this.conditionConfig.value

            this.conditionConfig.expression = this.generateConditionExpression(this.conditionConfig)

            var modelEditor = $("#ModelEditor")[0].contentWindow;

            modelEditor.ui.sidebar.addConditionCellInfo(this.conditionConfig)

            this.conditionConfigDialog = false
        },

        generateConditionExpression(condition){
            let expression = ''
            for(let i = 0;i<this.conditionConfig.cases.length;i++){
                let conditionCase = this.conditionConfig.cases[i]
                expression += `${condition.value} ${conditionCase.operator} ${conditionCase.standard}`
                if(i<this.conditionConfig.cases.length-1){
                    expression += `${conditionCase.relation=='and'?'&&':'||'}`
                }
            }
            return expression
        },

        addConditionCase(){
            if(this.conditionConfig.value==''||this.conditionConfig.value==undefined||this.conditionConfig.format==''||this.conditionConfig.format==undefined){
                this.$alert('Please set the value and the format', 'Tip', {
                        type:"warning",
                        confirmButtonText: 'OK',
                        callback: ()=>{
                            return
                        }
                    }
                );
                return
            }

            this.conditionCaseDialog = true
            this.caseConfig =  {
                operator:'',
                standard: '',
                relation:'and',
            }
        },

        addConditionCaseConfirm(conditionCase){

            if(conditionCase.operator==''||conditionCase.standard==''){
                 this.$alert('Please complete information of the case', 'Tip', {
                          type:"warning",
                          confirmButtonText: 'OK',
                          callback: ()=>{
                              return
                          }
                      }
                  );
                 return
            }
            this.conditionCaseDialog = false
            this.conditionConfig.cases.push(conditionCase)
        },

        editCondition(conditionCase,index){
            if(conditionCase.operator==''||conditionCase.standard==''){
                this.$alert('Please complete information of the case', 'Tip', {
                        type:"warning",
                        confirmButtonText: 'OK',
                        callback: ()=>{
                            return
                        }
                    }
                );
                return
            }
            this.conditionCaseDialog = true
            this.caseConfig = conditionCase
            this.editCase = index
        },

        editConditionConfirm(conditionCase){
            this.conditionCaseDialog = false
            this.conditionConfig.cases[this.editCase] = conditionCase
            this.editCase = -1
        },

        deleteCondition(conditionCase){
            for(let i=this.conditionConfig.cases.length-1;i>=0;i++){
                if(this.conditionConfig.cases[i]===conditionCase){
                    this.conditionConfig.cases.splice(i,1)
                    break;
                }
            }
        },

        refreshConditionLink(conditionLink){//对condition连接的下游Cell进行设置
            let conditionCell = conditionLink.source
            let target = conditionLink.target
            let direction = conditionLink.value//Yes No

            if(conditionCell.frontId!=undefined&&target.frontId!=undefined){
                for(let condition of this.conditions){
                    if(condition.id === conditionCell.frontId){
                        if(direction==='Yes'){
                            condition.true = target.frontId
                        }else{
                            condition.false = target.frontId
                        }
                        break;
                    }
                }
            }
        },

        refreshConditionInfo(conditionCell){
            for(let ele of this.conditions){
                if(ele.id === conditionCell.frontId){
                    ele.value = conditionCell.judgeValue
                    ele.link = conditionCell.link
                    if(ele.expression!=''&&ele.expression!=undefined){
                        ele.expression = this.generateConditionExpression(ele)
                        var modelEditor = $("#ModelEditor")[0].contentWindow;
                        modelEditor.ui.sidebar.addConditionCellInfo(ele)

                    }
                }
            }
        },

        checkConditionStatus(){//检查所有condition的连线是否正确，内容是否完整
            for(let condition of this.conditions){
                if(condition.value==''||condition.format==''||condition.cases.length==0){
                     this.$alert('Please recheck the conditions', 'Tip', {
                              type:"warning",
                              confirmButtonText: 'OK',
                              callback: ()=>{
                                  return
                              }
                          }
                      );

                     return false;
                }else if(condition.true == undefined||condition.true==''||condition.false==undefined||condition.false==''){
                    this.$alert('Please check the direction of condition' + condition.expression, 'Tip', {
                            type:"warning",
                            confirmButtonText: 'OK',
                            callback: ()=>{
                                return
                            }
                        }
                    );

                    return false
                }else {
                    try{
                        for(let conditionCase of condition.cases){
                            if(conditionCase.operator==''||conditionCase.standard=='') {
                                 this.$alert('Please recheck cases of the conditions', 'Tip', {
                                          type:"warning",
                                          confirmButtonText: 'OK',
                                          callback: ()=>{
                                              return
                                          }
                                      }
                                  );
                            }
                            return false
                        }
                    }catch (e){
                        this.$alert('Please recheck cases of the conditions', 'Tip', {
                                type:"warning",
                                confirmButtonText: 'OK',
                                callback: ()=>{
                                    return
                                }
                            }
                        );
                        return false
                    }

                }
            }
            return true
        },

        dragIntoDataItem(dataItemCell){
            let targetActionInfo = this.findTargetModelAction(dataItemCell.frontId)

            let targetAction = targetActionInfo[1]

            if(targetAction.md5!=undefined){
                for(let input of targetAction.inputData){
                    if(input.eventId == dataItemCell.eid){
                        this.dataItemList.push(input)
                        break
                    }
                }

                for(let output of targetAction.outputData){
                    if(output.eventId == dataItemCell.eid){
                        this.dataItemList.push(output)
                        break
                    }
                }
            }
        },

        addColorPool(id){
            let color = this.color16();

            while(object.values(this.dataColorPool).indexOf(color)!=-1){
                color = this.color16();
            }

            this.dataColorPool[id]=color;
        },

        getColor(id){
            return this.dataColorPool[id];
        },

        color16(){//十六进制颜色随机
            let r = Math.floor(Math.random()*256);
            let g = Math.floor(Math.random()*256);
            let b = Math.floor(Math.random()*256);
            let color = '#'+r.toString(16)+g.toString(16)+b.toString(16);
            return color;
        },

        handleClick(){
            
        },
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

                                        this.currentEvent.value = "http://" + ipAndPort + "/data/" + result.data.sourceStoreId;
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
        window.generateGUID = this.generateGUID;

        window.deleteModel = this.deleteModel;
        window.addModeltoList = this.addModeltoList;

        window.addDataProcessToList = this.addDataProcessToList;
        window.dataCellConfig = this.dataCellConfig;

        window.configDataLink = this.configDataLink;
        window.configDataProcessing = this.configDataProcessing;
        window.deleteDataProcessing = this.deleteDataProcessing;

        window.deleteDataLink = this.deleteDataLink;
        window.insertDataLink = this.insertDataLink;

        window.configCondition = this.configCondition;
        window.insertGeneralCell = this.insertGeneralCell;
        window.deleteGeneralList = this.deleteGeneralList;

        window.refreshConditionLink = this.refreshConditionLink;
        window.refreshConditionInfo = this.refreshConditionInfo;
        window.dragIntoDataItem = this.dragIntoDataItem;
        //aaa
    }

});