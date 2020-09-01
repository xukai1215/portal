var vue = new Vue({
    el: "#app",
    props: [],
    data: {
        models: [],
        modelParams: [],

        configVisible: false,
        executeVisible: false,
        executeDisabled: true,

        taskName: "IntegratedModeling",
        taskType:"default",
        activeName: "",
        formData: new FormData(),

        currentEvent: {},
        iframeWindow: {},

        userDataSpaceVisible: false,
        chooseModelVisible: false,

        // 与子组件的同名变量绑定
        checkModelList: [],

        targetFile: {},
    },
    methods: {
        checkMutiFlow(data){//判断是否有输入是其他模型的多输出
            for(let i=0;i<this.models.length;i++){
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

        configuration() {
            this.iframeWindow = $("#ModelEditor")[0].contentWindow;
            // var xml = this.iframeWindow.getCXml();

            var mdls = this.models;

            this.models = this.iframeWindow.getModels();

            if(this.models.length==0){
                this.$alert('Please select at least one model!',{
                    confirmButtonText:'confirm'
                })
                return
            }

            this.configVisible = true;
            this.activeName = this.models[0].name;

            for (var i = 0; i < this.models.length; i++) {
                for (var j = 0; j < this.models[i].inputEvents.length; j++) {
                    var event = this.models[i].inputEvents[j];
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
            }

            // 将上一次已经上传的 value fileName 和  suffix 复制给新打开的数据配置窗口
            if (mdls.length > 0) {
                for (let i = 0; i < mdls.length; i++) {
                    for (let j = 0; j < this.models.length; j++) {
                        if (this.models[j].pid == mdls[i].pid) {
                            this.models[j] = mdls[i];
                        }
                    }
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

            $('#datainput' + this.currentEvent.dataId).removeClass("spinner");
            this.userDataSpaceVisible = false;
        },

        //旧版本运行方式
        execute() {

            this.createAndUploadParamFile();
            let prepare = setInterval(() => {
                let prepared = true;

                for (var i = 0; i < this.models.length; i++) {
                    for (var j = 0; j < this.models[i].inputEvents.length; j++) {
                        var event = this.models[i].inputEvents[j];
                        //判断参数文件是否已经上传
                        let children = event.children;
                        if (children === undefined) {
                            continue;
                        } else {
                            let hasFile = false;
                            for (k = 0; k < children.length; k++) {
                                if (children[k].val != undefined && children[k].val.trim() != "") {
                                    hasFile = true;
                                    break;
                                }
                            }
                            if (hasFile) {
                                if (event.value == undefined) {
                                    prepared = false;
                                    break;
                                }
                            }

                        }
                    }
                    if (!prepared) {
                        break;
                    }
                }

                if (prepared) {
                    clearInterval(prepare);


                    this.executeVisible = false;

                    this.$notify.info({
                        title: 'Start Executing !',
                        message: 'You could wait it,and you could also find this task in your Space!',
                    });

                    var xml = "";
                    var uid = this.generateGUID();
                    var name = this.taskName;
                    var version = "1.0";

                    xml += "<TaskConfiguration uid='" + uid + "' name='" + name + "' version='" + version + "'>\n" +
                        "\t<Models>\n";
                    for (var i = 0; i < this.models.length; i++) {
                        xml += "\t\t<Model name='" + this.models[i].name + "' pid='" + this.models[i].md5 + "' description='" + this.models[i].description + "'>\n" +
                            "\t\t\t<InputData>\n";
                        for (var j = 0; j < this.models[i].inputEvents.length; j++) {
                            if (this.models[i].inputEvents[j].value != "") {
                                xml += "\t\t\t\t<DataTemplate state='" + this.models[i].inputEvents[j].state + "' event='" + this.models[i].inputEvents[j].event + "' value='" + this.models[i].inputEvents[j].value + "' dataId='" + this.models[i].inputEvents[j].dataId + "' type='" + this.models[i].inputEvents[j].type + "'/>\n";
                            }
                        }
                        xml += "\t\t\t</InputData>\n" +
                            "\t\t\t<OutputData>\n";
                        for (var k = 0; k < this.models[i].outputEvents.length; k++) {
                            xml += "\t\t\t\t<DataTemplate state='" + this.models[i].outputEvents[k].state + "' event='" + this.models[i].outputEvents[k].event + "' value='" + this.models[i].outputEvents[k].value + "' dataId='" + this.models[i].outputEvents[k].dataId + "' type='" + this.models[i].outputEvents[k].type + "'/>\n";
                        }
                        xml += "\t\t\t</OutputData>\n" +
                            "\t\t</Model>\n";
                    }
                    xml += "\t</Models>\n" +
                        "</TaskConfiguration>";

                    console.log(xml);

                    let file = new File([xml], name + '.xml', {
                        type: 'text/xml',
                    });


                    var formData = new FormData();
                    formData.append("file", file);
                    formData.append("name", this.taskName);

                    $.ajax({
                        url: "/task/runIntegratedTask",
                        data: formData,
                        type: "POST",
                        processData: false,
                        contentType: false,
                        success: (result) => {
                            var taskId = result.data;

                            let interval = setInterval(() => {
                                $.ajax({
                                    url: "/task/checkIntegratedTask/" + taskId,
                                    data: {},
                                    type: "GET",
                                    success: (obj) => {
                                        let status = obj.data.status;
                                        if (status == 0) {
                                            console.log(status);
                                        } else if (status == -1) {
                                            console.log(status);
                                            clearInterval(interval);
                                            this.$alert('Integrated model run failed!', 'Error', {
                                                type: "error",
                                                confirmButtonText: 'OK',
                                                callback: action => {
                                                    //this.$message({
                                                    //type: 'danger',
                                                    //message: `action: ${ action }`
                                                    //});
                                                }
                                            });
                                        } else {
                                            console.log(status);
                                            clearInterval(interval);
                                            this.$alert('Integrated model run Success', 'Success', {
                                                type: "success",
                                                confirmButtonText: 'OK',
                                                callback: action => {
                                                    //this.$message({
                                                    //type: 'success',
                                                    //message: `action: ${ action }`
                                                    //});
                                                }
                                            });

                                            let models = obj.data.models;
                                            console.log(models);


                                            var cxml = this.iframeWindow.getCXml();
                                            var doc = this.string2XML(cxml);


                                            for (let i = 0; i < models.length; i++) {
                                                var output = models[i].outputData.outputs;
                                                for (var j = 0; j < output.length; j++) {
                                                    for (var k = 0; k < doc.getElementsByTagName('mxCell').length; k++) {
                                                        var mxCell = doc.getElementsByTagName('mxCell')[k];
                                                        if (output[j].dataId == mxCell.getAttribute('eid')) {
                                                            mxCell.setAttribute('url', output[j].value);
                                                        }
                                                    }
                                                }

                                                // var input = models[i].inputData.inputs;
                                                // for (var j = 0; j<input.length; j++){
                                                //     for (var k = 0; k< doc.getElementsByTagName('mxCell').length; k++){
                                                //         var mxCell = doc.getElementsByTagName('mxCell')[k];
                                                //         if (input[j].dataId == mxCell.getAttribute('eid')){
                                                //             mxCell.setAttribute('url',input[j].value);
                                                //         }
                                                //     }
                                                // }
                                            }
                                            var xml = this.xml2String(doc);

                                            this.iframeWindow.setCXml(xml);

                                            // Save
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

                                        }
                                    }
                                })
                            }, 3000)

                        }
                    })
                }
            }, 2000);

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

            xml += "<TaskConfiguration uid='" + uid + "' name='" + name + "' version='" + version + "'>\n" +
                "\t<Models>\n";
            for (var i = 0; i < this.models.length; i++) {
                xml += "\t\t<Model name='" + this.models[i].name + "' pid='" + this.models[i].md5 + "' description='" + this.models[i].description + "'>\n" +
                    "\t\t\t<InputData>\n";
                for (var j = 0; j < this.models[i].inputEvents.length; j++) {
                    if (this.models[i].inputEvents[j].value != "") {
                        xml += "\t\t\t\t<DataTemplate state='" + this.models[i].inputEvents[j].state + "' event='" + this.models[i].inputEvents[j].event + "' value='" + this.models[i].inputEvents[j].value + "' dataId='" + this.models[i].inputEvents[j].dataId + "' type='" + this.models[i].inputEvents[j].type + "'/>\n";
                    }
                }
                xml += "\t\t\t</InputData>\n" +
                    "\t\t\t<OutputData>\n";
                for (var k = 0; k < this.models[i].outputEvents.length; k++) {
                    xml += "\t\t\t\t<DataTemplate state='" + this.models[i].outputEvents[k].state + "' event='" + this.models[i].outputEvents[k].event + "' value='" + this.models[i].outputEvents[k].value + "' dataId='" + this.models[i].outputEvents[k].dataId + "' type='" + this.models[i].outputEvents[k].type + "'/>\n";
                }
                xml += "\t\t\t</OutputData>\n" +
                    "\t\t</Model>\n";
            }
            xml += "\t</Models>\n" +
                "</TaskConfiguration>";

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
                        $.ajax({
                            url: "/task/checkIntegratedTask/" + taskId,
                            data: {},
                            type: "GET",
                            success: (obj) => {
                                let status = obj.data.status;
                                if (status == 0) {
                                    console.log(status);
                                } else if (status == -1) {
                                    console.log(status);
                                    clearInterval(interval);
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
                                    this.$alert('Integrated model run Success', 'Success', {
                                        confirmButtonText: 'OK',
                                        callback: action => {
                                            this.$message({
                                                type: 'success',
                                                message: `action: ${action}`
                                            });
                                        }
                                    });

                                    let models = obj.data.models;
                                    console.log(models);

                                    // 将结果更新到 this.models 中
                                    for (let i = 0; i < _this.models.length; i++) {
                                        var m1 = _this.models[i]
                                        for (let j = 0; j < models.length; j++) {
                                            var m2 = models[j]
                                            if (m1.md5 == m2.pid) {
                                                for (let k = 0; k < m1.outputEvents.length; k++) {
                                                    var o1 = m1.outputEvents[k]
                                                    for (let l = 0; l < m2.outputData.outputs.length; l++) {
                                                        var o2 = m2.outputData.outputs[l]
                                                        if (o1.dataId == o2.dataId) {

                                                            o1.value = o2.value
                                                            break
                                                        }
                                                    }
                                                }
                                                break
                                            }
                                        }
                                    }

                                    var cxml = this.iframeWindow.getCXml();
                                    var doc = this.string2XML(cxml);


                                    for (let i = 0; i < models.length; i++) {
                                        var output = models[i].outputData.outputs;
                                        for (var j = 0; j < output.length; j++) {
                                            for (var k = 0; k < doc.getElementsByTagName('mxCell').length; k++) {
                                                var mxCell = doc.getElementsByTagName('mxCell')[k];
                                                if (output[j].dataId == mxCell.getAttribute('eid')) {
                                                    mxCell.setAttribute('url', output[j].value);
                                                }
                                            }
                                        }

                                        // var input = models[i].inputData.inputs;
                                        // for (var j = 0; j<input.length; j++){
                                        //     for (var k = 0; k< doc.getElementsByTagName('mxCell').length; k++){
                                        //         var mxCell = doc.getElementsByTagName('mxCell')[k];
                                        //         if (input[j].dataId == mxCell.getAttribute('eid')){
                                        //             mxCell.setAttribute('url',input[j].value);
                                        //         }
                                        //     }
                                        // }
                                    }
                                    var xml = this.xml2String(doc);

                                    this.iframeWindow.setCXml(xml);

                                    // Save
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

                                }
                            }
                        })
                    }, 3000)

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
            for (i = 0; i < this.models.length; i++) {
                let modelPara = {};
                modelPara.mId = this.models[i].pid;
                let inputsPara = [];
                let inputPara = {};

                let inputs = this.models[i].inputEvents;
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

        chooseModel() {
            /**
             * 张硕
             * 2020.05.28
             * 将选中的模型们，加载到画布上
             */
            var modelEditor = $("#ModelEditor")[0].contentWindow;
            modelEditor.ui.sidebar.addModelToGraph(this.checkModelList)

            clearSelection();
            this.chooseModelVisible = false
        }

    },
    mounted() {

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
                this.models = this.iframeWindow.getModels();
                this.models.forEach((model) => {
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


                this.activeName = this.models[0].name;

                for (var i = 0; i < this.models.length; i++) {
                    for (var j = 0; j < this.models[i].inputEvents.length; j++) {
                        var event = this.models[i].inputEvents[j];

                        // 把输入数据的 value fileName 和  suffix 复制给 this.models


                        // 把计算模型的 参数数据 复制给 this.models

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

    }

});