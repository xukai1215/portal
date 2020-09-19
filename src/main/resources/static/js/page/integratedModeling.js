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
        modelRunType:"common",
        activeName: "",
        formData: new FormData(),

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

        modelRunTimes:1,
    },
    methods: {
        checkMutiFlow(data){//判断是否有输入是其他模型的多输出
            for(let i=0;i<this.modelActions.length;i++){
                if(this.model[i].hasMultiOut===true){
                    for(let event of this.model[i].outputEvents){
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

            for(let model of this.checkModelList){
                this.checkModelAction(model,this.modelActions)
                this.addModelList(model,this.models)
            }

            modelEditor.ui.sidebar.addModelToGraph(this.checkModelList)

            this.modelActions = this.modelActions.concat(this.checkModelList)
            clearSelection();
            this.chooseModelVisible = false
        },

        addModelList(model,modelList){
            for(let ele of modelList){
                if(ele.md5 === model.md5){
                    return
                }
            }
            modelList.push(model)
        },

        checkModelAction(model,modelActionList){//可能会加入两个md5值一样的模型，加入标识码在前端区分
            model.frontId=this.generateGUID()
            model.iterationNum=1//迭代次数,默认为1
            model.order=modelActionList.length
            for(let ele of modelActionList){//一样的模型order不同
                if(model.md5===ele.md5){
                    model.order=ele.order+1
                }
            }
            this.extractEvents(model)
        },

        extractEvents(model){
            var inputEvents = [];
            var outputEvents = [];
            var states = model.mdlJson.mdl.states;
            for (var j = 0; j < states.length; j++) {
                var state = states[j];
                for (var k = 0; k < state.event.length; k++) {
                    var event = state.event[k];
                    event.stateName = state.name;
                    if (event.eventType == "response") {
                        inputEvents.push(event);
                    } else {
                        outputEvents.push(event);
                    }
                }
            }

            model.inputEvents = inputEvents;
            model.outputEvents = outputEvents;
        },

        deleteModel(frontId,md5){
            for(let i=this.modelActions.length-1;i>=0;i--){//从尾部开始寻找，在目标之后的模型任务order都要-1
                if(this.modelActions[i].md5===md5&&this.modelActions[i].frontId === frontId){
                    this.modelActions.splice(i,1)
                    break
                }else{
                    this.modelActions[i].order--
                }
            }
            for(let i=this.models.length-1;i>=0;i--){//从尾部开始寻找，在目标之后的模型任务order都要-1
                if(this.models[i].md5===md5){
                    this.models.splice(i,1)
                    break
                }
            }
        },

        modelConfiguration(modelAction){
            this.modelConfigurationVisible = true
            this.modelRunTimes = modelAction.iterationNum==1?1:modelAction.iterationNum
            this.modelRunType = this.modelRunTimes>1?'iterative':'common'
            this.configModelAction = modelAction
        },

        modelConfigurationConfirm(){
            this.configModelAction.iterationNum = this.modelRunTimes
            this.modelRunType = this.modelRunTimes>1?'iterative':'common'
            this.modelConfigurationVisible = false
        },

        mxModelToModel(mxModel,model){//mxgraph中的model的关键值赋值给vue页面中的
            let i = 0
            for(let i=0;i<mxModel.inputEvents.length;i++){
                if(mxModel.inputEvents[i].link!=undefined) {
                    for (let j = 0; j < model.inputEvents.length; j++) {
                        if (mxModel.inputEvents[i].eventId===model.inputEvents[i].eventId){
                            model.inputEvents[i].link = mxModel.inputEvents[i].link
                            break;
                        }
                    }
                }
            }
            // while (i < mxModel.inputEvents.length){
            //     if(mxModel.inputEvents[i].link!=undefined){
            //         model.inputEvents[i].link = mxModel.inputEvents[i].link
            //     }
            //     i++
            // }
        },

        dataConfiguration(model) {
            // var xml = this.iframeWindow.getCXml();
            var mdls = this.modelActions;

            let mxModels = this.iframeWindow.getModels();

            this.configVisible = true;
            this.activeName = this.modelActions[0].name;

            for(let ele of mxModels){
                if(ele.frontId===model.frontId){
                    this.mxModelToModel(ele,model)
                    this.configModelAction = model;
                    break;
                }
            }

            for (var j = 0; j < this.configModelAction.inputEvents.length; j++) {
                var event = this.configModelAction.inputEvents[j];
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
        //             for (var j = 0; j < this.modelActions[i].inputEvents.length; j++) {
        //                 var event = this.modelActions[i].inputEvents[j];
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
        //                 for (var j = 0; j < this.modelActions[i].inputEvents.length; j++) {
        //                     if (this.modelActions[i].inputEvents[j].value != "") {
        //                         xml += "\t\t\t\t<DataTemplate state='" + this.modelActions[i].inputEvents[j].state + "' event='" + this.modelActions[i].inputEvents[j].event + "' value='" + this.modelActions[i].inputEvents[j].value + "' dataId='" + this.modelActions[i].inputEvents[j].dataId + "' type='" + this.modelActions[i].inputEvents[j].type + "'/>\n";
        //                     }
        //                 }
        //                 xml += "\t\t\t</InputData>\n" +
        //                     "\t\t\t<OutputData>\n";
        //                 for (var k = 0; k < this.modelActions[i].outputEvents.length; k++) {
        //                     xml += "\t\t\t\t<DataTemplate state='" + this.modelActions[i].outputEvents[k].state + "' event='" + this.modelActions[i].outputEvents[k].event + "' value='" + this.modelActions[i].outputEvents[k].value + "' dataId='" + this.modelActions[i].outputEvents[k].dataId + "' type='" + this.modelActions[i].outputEvents[k].type + "'/>\n";
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
                for(let j=0;j<ele.outputEvents.length;j++){
                    if (ele.outputEvents[j].eventId === dataId){
                        return ele
                    }
                }
            }
        },

        executeNew() {
            this.executeVisible = false;

            this.$notify.info({
                title: 'Start Executing !',
                message: 'You could wait it, and you could also find this task in your Space!',
            });

            var xml = "";
            var uid = this.generateGUID();
            var name = this.taskName;
            var version = "1.0";

            var taskJson = {}


            let dataLinks=[]

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
                xml += "\t\t<ModelAction id='" + this.modelActions[i].frontId + "' modelName='" + this.modelActions[i].name + "' modelId='" + this.modelActions[i].md5 + "' order='" + this.modelActions[i].order + "' iterationNum='" + this.modelActions[i].iterationNum + "'>\n" +
                    "\t\t\t<InputData>\n";
                for (let j = 0; j < this.modelActions[i].inputEvents.length; j++) {
                    if ((this.modelActions[i].inputEvents[j].value != ""&&this.modelActions[i].inputEvents[j].value != undefined)
                        ||(this.modelActions[i].inputEvents[j].link != ""&&this.modelActions[i].inputEvents[j].link != undefined)) {
                        xml += "\t\t\t\t<DataTemplate state='" + this.modelActions[i].inputEvents[j].stateName + "' event='" + this.modelActions[i].inputEvents[j].eventName + "' value='" + this.modelActions[i].inputEvents[j].value
                            + "' link='" + this.modelActions[i].inputEvents[j].link + "' dataId='" + this.modelActions[i].inputEvents[j].eventId + "' type='" + this.modelActions[i].inputEvents[j].type + "'/>\n";
                        if(this.modelActions[i].inputEvents[j].link != ""&&this.modelActions[i].inputEvents[j].link != undefined){
                            let fromAction = this.findTargetByOutputId(this.modelActions,this.modelActions[i].inputEvents[j].link)
                            let dataLink = {
                                from:fromAction.frontId,
                                to:this.modelActions[i].frontId,
                                inputEvent:this.modelActions[i].inputEvents[j].eventId,
                                outputEvent:this.modelActions[i].inputEvents[j].link
                            }  //to
                            dataLinks.push(dataLink)
                        }

                    }else{
                        this.$alert('Please check input of the model action '+this.modelActions[i].name)
                        return;
                    }
                }
                xml += "\t\t\t</InputData>\n" +
                    "\t\t\t<OutputData>\n";
                for (var k = 0; k < this.modelActions[i].outputEvents.length; k++) {
                    this.modelActions[i].outputEvents[k].url=''
                    xml += "\t\t\t\t<DataTemplate state='" + this.modelActions[i].outputEvents[k].stateName + "' event='" + this.modelActions[i].outputEvents[k].eventName + "' value='" + this.modelActions[i].outputEvents[k].value
                        + "' dataId='" + this.modelActions[i].outputEvents[k].eventId + "' type='" + this.modelActions[i].outputEvents[k].type + "'/>\n";
                }
                xml += "\t\t\t</OutputData>\n" +
                    "\t\t</ModelAction>\n";
            }
            xml += "\t</ModelActions>\n";

            if(dataLinks.length>0){
                xml += "\t<DataLinks>\n";
                for(let ele of dataLinks){
                    xml += "\t\t<DataLink from='" + ele.from + "' to='" + ele.to + "'>\n"
                    xml += "\t\t\t<InputEvent dataId='" + ele.inputEvent + "'/>\n"
                    xml += "\t\t\t<OutputEvent dataId='" + ele.outputEvent + "'/>\n"
                    xml += "\t\t</DataLink>\n"
                }
                xml += "\t</DataLinks>\n";

            }

            xml += "</TaskConfiguration>";

            console.log(xml);

            let file = new File([xml], name + '.xml', {
                type: 'text/xml',
            });


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

                    let interval = setInterval(() => {
                       this.checkIntegratedTask(taskId,interval)
                    }, 3000)

                }
            })
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

                        var xml = this.xml2String(doc);

                        this.iframeWindow.setCXml(xml);

                        // Save
                        this.saveIntegratedTask(taskId,xml)

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
                    if (m1.frontId == m2.id) {//前台的frontId作为后台的id
                        for (let k = 0; k < m1.outputEvents.length; k++) {
                            var o1 = m1.outputEvents[k]
                            for (let l = 0; l < m2.outputData.outputs.length; l++) {
                                var o2 = m2.outputData.outputs[l]
                                if (o1.eventId == o2.dataId) {//前台eventId对应的是managerServer后台的dataId
                                    o1.value = o2.value
                                    o1.fileName = o2.tag
                                    o1.suffix = o2.suffix
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

        saveIntegratedTask(taskId,xml){
            $.ajax({
                url: "/task/saveIntegratedTask",
                async: true,
                data: {
                    taskId: taskId,
                    graphXml: xml,
                    modelParams: this.modelParams,
                },
                type: "POST",
                success: (result) => {
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

        createAndUploadParamFile() {
            let modelParas = [];
            for (i = 0; i < this.modelActions.length; i++) {
                let modelPara = {};
                modelPara.mId = this.modelActions[i].pid;
                let inputsPara = [];
                let inputPara = {};

                let inputs = this.modelActions[i].inputEvents;
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

    },

    mounted() {

        this.iframeWindow = $("#ModelEditor")[0].contentWindow;

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


                this.activeName = this.modelActions[0].name;

                for (var i = 0; i < this.modelActions.length; i++) {
                    for (var j = 0; j < this.modelActions[i].inputEvents.length; j++) {
                        var event = this.modelActions[i].inputEvents[j];

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

    }

});