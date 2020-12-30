var vue = new Vue({
    el: "#app",
    data() {
            return {
                ScreenMinHeight: 400,

                loadDeployedModelDialog: false,
                deployedModel: [{
                    name: '',
                }],
                deployedModelCount: 0,
                pageOption: {
                    paginationShow: false,
                    progressBar: true,
                    sortAsc: false,
                    currentPage: 1,
                    pageSize: 10,

                    total: 11,
                    searchResult: [],
                },
                searchText: '',
                loading: false,

                taskConfigurationDialog: false,

                modelList: [],
                modelStep: 1,

                runnedList: [],

                outputList: [],

                initializing: true,

                info: {
                    dxInfo: {},
                    modelInfo: {
                        states: [],
                    },
                    taskInfo: {},
                    userInfo: {},
                },
                taskConfigurationLoading: false,
                events: [],
                showDataChose: false,
                targetFile: {},

                eventChoosing: {},
                outputDialog: false,

                targetTaskModel: [],
            }
        },

    computed:{

    },

    methods: {
        loadDeployedModelClick(step) {
            this.modelStep = step
            this.loadDeployedModelDialog = true;
            this.pageOption.currentPage = 1;
            this.searchResult = '';
            this.loadDeployedModel();

        },

        getStatus(taskModel) {
            if (taskModel.status == -1) {
                return 'borderRed'
            } else if (taskModel.status == 2) {
                return 'borderGreen'
            } else {
                return 'borderBlue'
            }
        },

        handlePageChange(val) {
            this.pageOption.currentPage = val;

            if (this.inSearch == 0)
                this.loadDeployedModel();
            else
                this.searchDeployedModel()
        },

        loadDeployedModel() {
            this.inSearch = 0
            this.loading = true;
            axios.get('/computableModel/loadDeployedModel', {
                params: {
                    asc: 0,
                    page: this.pageOption.currentPage - 1,
                    size: 6,
                }
            }).then(
                (res) => {
                    if (res.data.code == 0) {
                        let data = res.data.data;
                        this.deployedModel = data.content
                        this.pageOption.total = data.total;
                        setTimeout(() => {
                            this.loading = false;
                        }, 100)
                    } else {
                        this.$alert('Please try again', 'Warning', {
                            confirmButtonText: 'OK',
                            callback: action => {
                                this.loading = false;
                            }
                        })

                    }
                }
            )
        },

        searchDeployedModel(page) {
            this.inSearch = 1
            this.loading = true;
            let targetPage = page == undefined ? this.pageOption.currentPage : page
            this.pageOption.currentPage = targetPage
            axios.get('/computableModel/searchDeployedModel', {
                params: {
                    asc: 0,
                    page: targetPage - 1,
                    size: 6,
                    searchText: this.searchText,
                }
            }).then(
                (res) => {
                    if (res.data.code == 0) {
                        let data = res.data.data;
                        this.deployedModel = data.content
                        this.pageOption.total = data.total;
                        setTimeout(() => {
                            this.loading = false;
                        }, 150)

                    } else {
                        this.$alert('Please try again', 'Warning', {
                            confirmButtonText: 'OK',
                            callback: action => {
                                this.loading = false;
                            }
                        })

                    }
                }
            )
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
                    if (data.oid == "") {
                        this.confirmLogin()
                    } else {
                        let arr = window.location.href.split("/");
                        let bindOid = arr[arr.length - 1].split("#")[0];
                        this.setSession("bindOid", bindOid);
                        switch (this.relateType) {
                            case "modelItem":
                                window.open("/user/userSpace#/model/createModelItem", "_blank")
                                break;
                            case "conceptualModel":
                                window.open("/user/userSpace#/model/createConceptualModel", "_blank")
                                break;
                            case "logicalModel":
                                window.open("/user/userSpace#/model/createLogicalModel", "_blank")
                                break;
                            case "computableModel":
                                window.open("/user/userSpace#/model/createComputableModel", "_blank")
                                break;
                            case "concept":
                                window.open("/user/userSpace#/community/createConcept", "_blank")
                                break;
                            case "spatialReference":
                                window.open("/user/userSpace#/community/createSpatialReference", "_blank")
                                break;
                            case "template":
                                window.open("/user/userSpace#/community/createTemplate", "_blank")
                                break;
                            case "unit":
                                window.open("/user/userSpace#/community/createUnit", "_blank")
                                break;
                        }
                    }
                }
            })
        },

        invokeModel(model) {
            this.loadDeployedModelDialog = false
            this.modelList[this.modelStep] = model
            this.configureTask(model)
        },

        checkPersonData(event) {
            this.eventChoosing = event;//此处把页面上的event与eventChoosing绑定
            // if (this.first == true) {
            //     let d = await this.getTableData(0);
            //     this.dataFromDataContainer = d.content;
            //     this.total = d.total;
            //     this.first = false;
            // }
            this.showDataChose = true;

        },

        checkOutputData(event) {
            this.eventChoosing = event;//此处把页面上的event与eventChoosing绑定
            this.outputDialog = true;
        },

        selectDataFromPersonal() {
            if (this.targetFile != {}) {
                this.showDataChose = false;
                this.eventChoosing.tag = this.targetFile.label;
                this.eventChoosing.suffix = this.targetFile.suffix;
                this.eventChoosing.url = this.targetFile.url;
                this.eventChoosing.visual = this.targetFile.visual;

                $("#eventInp_" + this.eventChoosing.eventId).val(this.eventChoosing.tag + this.eventChoosing.suffix);
                $("#download_" + this.eventChoosing.eventId).css("display", "block");
            } else {
                this.$message("Please select data first!")
            }

        },

        selectDataspaceFile(file) {
            this.targetFile = file
        },

        removeDataspaceFile(file) {
            this.targetFile = {}
        },

        async configureTask(model) {
            this.taskConfigurationDialog = true
            this.taskConfigurationLoading = true
            let {data} = await (await fetch("/task/TaskInit/" + model.oid)).json();
            if (data == null || data == undefined) {
                this.$alert('Initialization failure: an error occured on the server.<br/> Please try again or <a href="mailto:opengms@njnu.edu.cn">contact us</a>.', 'Error', {
                    type: "error",
                    showClose: false,
                    confirmButtonText: 'Try again',
                    dangerouslyUseHTMLString: true,
                    callback: action => {
                        this.configureTask(model);
                    }
                });
            } else {
                this.initializing = false;
            }
            let states = data.modelInfo.states;
            for (i = 0; i < states.length; i++) {
                let state = states[i];
                for (j = 0; j < state.event.length; j++) {
                    if (state.event[j].data != undefined && state.event[j].eventType == "response") {
                        let nodes = state.event[j].data[0].nodes;
                        let refName = state.event[j].data[0].text.toLowerCase();
                        if (state.event[j].data[0].externalId != undefined) {
                            state.event[j].externalId = state.event[j].data[0].externalId;
                        }

                        if (nodes != undefined && refName != "grid" && refName != "table" && refName != "shapes") {
                            let children = [];
                            for (k = 0; k < nodes.length; k++) {
                                let node = nodes[k];
                                let child = {};
                                child.eventId = node.text;
                                child.eventName = node.text;
                                child.eventDesc = node.desc;
                                child.eventType = node.dataType;

                                child.child = true;
                                children.push(child);
                            }
                            data.modelInfo.states[i].event[j].children = children;
                        } else {
                            data.modelInfo.states[i].event[j].data[0].nodes = undefined;
                        }

                    }
                }
            }

            this.events = data.modelInfo.states[0].event;
            if (this.targetTaskModel[this.modelStep] == undefined)
                this.targetTaskModel[this.modelStep] = []
            this.targetTaskModel[this.modelStep].push(data);
            this.info = data;
            this.taskConfigurationLoading = false
        },

        continueTask() {
            this.modelStep++
        },

        addOutput(el) {
            if (el.length > 1) {//是一个多结果
                // if (this.targetTaskModel[this.modelStep] == undefined || this.targetTaskModel[this.modelStep].length < 2)
                    this.targetTaskModel[this.modelStep] = []
                for (let i = 0; i < el.length; i++) {

                    let dup = JSON.parse(JSON.stringify(this.info))
                    this.targetTaskModel[this.modelStep].push(dup)
                    this.targetTaskModel[this.modelStep][i].modelInfo.status = 0
                    this.targetTaskModel[this.modelStep][i].modelInfo.states.forEach((state) => {
                        state.event.forEach((eve) => {
                            if (eve.eventId == this.eventChoosing.eventId) {
                                eve.tag = el[i].tag;
                                eve.suffix = el[i].suffix;
                                eve.url = el[i].url;
                                eve.visual = el[i].visual;
                            }
                        })
                    })
                }
            }
        },

        setData(index){

            this.taskConfigurationDialog = true
            this.info = this.targetTaskModel[this.modelStep][index]
        },

        checkMultiContent() {

        },

        async invoke() {
            let loading = this.$loading({
                lock: true,
                text: "Setting parameters...",
                spinner: "el-icon-loading",
                background: "rgba(0, 0, 0, 0.7)"
            });
            let states = this.info.modelInfo.states;
            for (i = 0; i < states.length; i++) {
                let events = states[i].event;
                for (j = 0; j < events.length; j++) {
                    let event = events[j];
                    if (event.eventType == "response" && event.optional == false && event.children != undefined) {
                        for (k = 0; k < event.children.length; k++) {
                            let child = event.children[k];
                            if (child.value == undefined || child.value.trim() == "") {
                                loading.close();
                                this.$message.error("Some input parameters are not set");
                                throw new Error("Some input parameters are not set");
                                return;
                            }
                        }
                    }
                }
            }

            this.createAndUploadParamFile();
            let prepare = setInterval(() => {
                let prepared = true;

                for (i = 0; i < states.length; i++) {
                    let events = states[i].event;
                    for (j = 0; j < events.length; j++) {
                        //判断参数文件是否已经上传
                        if (events[j].eventType == "response") {

                            let children = events[j].children;
                            if (children === undefined) {
                                continue;
                            } else {
                                let hasFile = false;
                                for (k = 0; k < children.length; k++) {
                                    if (children[k].value != undefined && children[k].value.trim() != "") {
                                        hasFile = true;
                                        break;
                                    }
                                }
                                if (hasFile) {
                                    if (events[j].url == undefined) {
                                        prepared = false;
                                        break;
                                    }
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
                    console.log(this.modelInEvent)
                    $(".el-loading-text").text("Model is running, you can check running state and get results in \"User Space\" -> \"Task\"")

                    let jsonList = []
                    try {
                        for (let i = 0; i < this.targetTaskModel[this.modelStep].length; i++) {
                            let json = {
                                oid: this.modelList[this.modelStep].oid,
                                ip: this.info.taskInfo.ip,
                                port: this.info.taskInfo.port,
                                pid: this.info.taskInfo.pid,
                                inputs: []
                            };
                            this.targetTaskModel[this.modelStep][i].modelInfo.states.forEach(state => {
                                let statename = state.name;
                                state.event.forEach(el => {
                                    let event = el.eventName;
                                    let tag = el.tag;
                                    let url = el.url;
                                    let suffix = el.suffix;
                                    let templateId = el.externalId;
                                    if (templateId != null) templateId = templateId.toLowerCase();
                                    let children = el.children;
                                    if (el.eventType == "response") {
                                        if (el.optional) {
                                            if (url === null || url === undefined) {

                                            } else {
                                                json.inputs.push({
                                                    statename,
                                                    event,
                                                    url,
                                                    tag,
                                                    suffix,
                                                    templateId,
                                                    children
                                                });
                                            }
                                        } else {
                                            if (url === null || url === undefined) {
                                                this.$message.error("Some input data are not provided");
                                                throw new Error("Some input data are not provided");
                                            }
                                            json.inputs.push({
                                                statename,
                                                event,
                                                url,
                                                tag,
                                                suffix,
                                                templateId,
                                                children
                                            });
                                        }
                                    }
                                });
                            });
                            jsonList.push(json)
                        }

                    } catch (e) {
                        loading.close();
                        return;
                    }

                    var tids;
                    $.ajax({
                        url: "/task/mutiInvoke",
                        type: "POST",

                        contentType: "application/json",
                        data: JSON.stringify(jsonList),
                        success: ({data, code, msg}) => {
                            tids = data;
                            if (code == -1) {
                                this.$alert(msg, 'Error', {
                                    type: 'error',
                                    confirmButtonText: 'OK',
                                    callback: action => {
                                        window.location.href = "/user/login";
                                    }
                                });

                                return;
                            }

                            if (code == -2) {
                                loading.close();
                                this.$alert(msg, 'Error', {
                                    type: 'error',
                                    confirmButtonText: 'OK',
                                    callback: action => {

                                    }
                                });


                                return;
                            }
                            for (let i = 0; i < tids.length; i++) {
                                if (tids[i] === null) {
                                    this.targetTaskModel[this.modelStep][i].status = -1
                                } else {
                                    this.targetTaskModel[this.modelStep][i].status = 1
                                    this.targetTaskModel[this.modelStep][i].tid = tids[i]
                                }
                            }

                            let taskCount = tids.length
                            let sucCount = tids.length
                            let interval = setInterval(async () => {
                                let {code, data, msg} = await (await fetch("/task/getMutiResult", {
                                    method: "post",
                                    headers: {
                                        "Content-Type": "application/json"
                                    },
                                    body: JSON.stringify({
                                        ip: this.info.taskInfo.ip,
                                        port: this.info.taskInfo.port,
                                        tid: tids
                                    })
                                })).json();
                                if (code === -1) {
                                    clearInterval(interval);
                                    this.$alert(msg, 'Error', {
                                        type: 'error',
                                        confirmButtonText: 'OK',
                                        callback: action => {

                                        }
                                    });

                                    loading.close();
                                }

                                for (let ele of data) {
                                    if (ele.status == -1) {
                                        for (let task of this.targetTaskModel[this.modelStep]) {
                                            if (ele.tid == task.tid) {
                                                task.status = -1
                                                taskCount--
                                            }
                                        }
                                    } else if (ele.status == 2) {
                                        for (let task of this.targetTaskModel[this.modelStep]) {
                                            if (ele.tid == task.tid) {
                                                task.status = 2
                                                task.output = ele.outputdata
                                                taskCount--
                                                sucCount++
                                            }
                                        }
                                    }
                                }
                                if (taskCount == 0) {
                                    if (sucCount != 0) {
                                        clearInterval(interval);
                                        this.$alert("The model has run successfully!", 'Success', {
                                            type: 'success',
                                            confirmButtonText: 'OK',
                                            callback: action => {

                                            }
                                        });
                                        this.$alert("The model has run successfully!", 'Success', {
                                            type: 'success',
                                            confirmButtonText: 'OK',
                                            callback: action => {

                                            }
                                        });
                                        for (let j = 0; j < tids.length; j++) {
                                            let runned = {
                                                modelName: this.modelList[this.modelStep].name,
                                                modelOid: this.modelList[this.modelStep].oid,
                                                taskId: tids[j],
                                                ip: this.info.taskInfo.ip,
                                                port: this.info.taskInfo.port,
                                            }
                                            if (this.runnedList[this.modelStep] == undefined) {
                                                this.runnedList[this.modelStep] = []
                                            }
                                            this.runnedList[this.modelStep].push(runned)

                                            let vthis = this
                                            if (this.targetTaskModel[this.modelStep][j].output != undefined) {
                                                this.targetTaskModel[this.modelStep][j].output.forEach(el => {
                                                    let statename = el.statename;
                                                    let eventName = el.event;
                                                    let state = this.targetTaskModel[this.modelStep][j].modelInfo.states.find(state => {
                                                        return state.name == statename;
                                                    });
                                                    if (state == undefined) return;
                                                    let event = state.event.find(event => {
                                                        return event.eventName == eventName;
                                                    });
                                                    if (event == undefined) return;
                                                    this.$set(event, "tag", el.tag);
                                                    this.$set(event, "suffix", el.suffix);
                                                    this.$set(event, "url", el.url);
                                                    this.$set(event, "multiple", el.multiple);
                                                    if (el.multiple) {
                                                        this.$set(vthis.runnedList[this.modelStep], "mutiList", this.splitMutifile(el))
                                                        this.outputList.push(this.splitMutifile(el))
                                                    } else {
                                                        let out = {
                                                            tag: el.tag,
                                                            suffix: el.suffix,
                                                            url: el.url,
                                                            visual: el.visual,
                                                            step: this.modelStep//保存当前步骤
                                                        }
                                                        this.$set(vthis.runnedList[this.modelStep][j], "output", out)
                                                        this.outputList.push(a)
                                                    }
                                                });
                                            }

                                        }

                                    } else {
                                        this.$alert("Something wrong with these tasks!", 'Error', {
                                            type: 'success',
                                            confirmButtonText: 'OK',
                                            callback: action => {

                                            }
                                        });
                                    }

                                    loading.close();
                                } else {
                                }

                            }, 5000);
                        }
                    })


                }
            }, 2000)
        },

        splitMutifile(output) {
            this.multiFileDialog = true;
            let outputUrls = [];
            let urls = output.url.substring(1, output.url.length - 1).split(',')
            for (let i = 0; urls && i < urls.length; i++) {
                let obj = {
                    tag: output.tag,
                    suffix: output.suffix,
                    url: urls[i].substring(1, urls[i].length - 1),
                    visual: output.visual,
                    step: this.modelStep
                }
                outputUrls.push(obj)
            }
            return outputUrls
        },

        uploadToDataContainer(file, event) {
            let configContent = "<UDXZip><Name>";
            configContent += "<add value='" + file.name + "' />";
            configContent += "</Name>";
            let data = event.data[0];
            if (data.dataType == "external") {
                configContent += "<DataTemplate type='id'>";
                configContent += data.externalId;
                configContent += "</DataTemplate>"
            } else if (data.dataType == "internal" && data.nodes != undefined) {
                configContent += "<DataTemplate type='schema'>";
                configContent += data.schema.trim();
                configContent += "</DataTemplate>"
            } else {
                configContent += "<DataTemplate type='none'>";
                configContent += "</DataTemplate>"
            }
            configContent += "</UDXZip>";
            let configFile = new File([configContent], 'config.udxcfg', {
                type: 'text/plain',
            });


            $.get("/dataManager/dataContainerIpAndPort", (result) => {
                let ipAndPort = result.data;
                let formData = new FormData();
                formData.append("ogmsdata", file);
                formData.append("ogmsdata", configFile);
                formData.append("name", event.eventName);
                formData.append("userId", this.uid);
                formData.append("serverNode", "china");
                formData.append("origination", "portal");
                $.ajax({
                    type: "post",
                    url: "http://" + ipAndPort + "/data",
                    data: formData,
                    async: true,
                    processData: false,
                    contentType: false,
                    success: (res) => {
                        if (res.code == 0) {
                            let data = res.data;
                            // if(this.uploadFiles.length==1){
                            //     data.suffix=this.uploadFiles[0].name.split(".")[1];
                            // }
                            // else{
                            //
                            //     data.suffix="zip";
                            // }
                            data.suffix = "xml";
                            data.label = data.file_name;
                            data.file_name += "." + data.suffix;

                            if (event == null) {
                                this.$set(this.eventChoosing, 'url', "http://" + ipAndPort + "/data/" + data.source_store_id);
                                this.$set(this.eventChoosing, 'tag', data.label)
                                this.$set(this.eventChoosing, 'suffix', data.suffix)

                                let uploadEle = $("#upload_" + this.eventChoosing.eventId);
                                uploadEle.removeAttr("disabled");
                                uploadEle.children().children().removeClass("el-icon-loading");
                                uploadEle.children().children().addClass("fa");
                                uploadEle.children().children().addClass("fa-cloud-upload");
                                $("#eventInp_" + this.eventChoosing.eventId).val(data.label + data.suffix);
                                $("#download_" + this.eventChoosing.eventId).css("display", "block");
                            } else {

                                this.$set(event, 'url', "http://" + ipAndPort + "/data/" + data.source_store_id);
                                this.$set(event, 'tag', data.label)
                                this.$set(event, 'suffix', data.suffix)

                                let uploadEle = $("#upload_" + event.eventId);
                                uploadEle.removeAttr("disabled");
                                uploadEle.children().children().removeClass("el-icon-loading");
                                uploadEle.children().children().addClass("fa");
                                uploadEle.children().children().addClass("fa-cloud-upload");
                                $("#eventInp_" + event.eventId).val(data.label + data.suffix);
                                $("#download_" + event.eventId).css("display", "block");
                            }

                            $("#uploadInputData").val("");
                        }
                    }
                })
            })
        },

        createAndUploadParamFile() {
            let states = this.info.modelInfo.states;
            for (i = 0; i < states.length; i++) {
                let events = states[i].event;
                let find = false;
                for (j = 0; j < events.length; j++) {
                    let event = events[j];
                    if (event.eventType == "response" && event.children != undefined) {
                        //拼接文件内容
                        let content = "";
                        let children = event.children;
                        for (k = 0; k < children.length; k++) {
                            let child = children[k];
                            if (child.value === undefined || child.value.trim() === '') {
                                continue;
                            } else {
                                content += "<XDO name=\"" + child.eventName + "\" kernelType=\"" + child.eventType.toLowerCase() + "\" value=\"" + child.value + "\" /> ";
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

                    }
                }
            }

        },

        inEventList(state) {
            return state.event.filter(value => {
                return value.eventType === "response";
            });
        },
        outEventList(state) {
            return state.event.filter(value => {
                return value.eventType === "noresponse";
            });
        },
    },

    created() {

    },

    mounted() {
        let height = document.documentElement.clientHeight;
        this.ScreenMinHeight = (height - 400) + "px";

        window.onresize = () => {
            console.log('come on ..');
            height = document.documentElement.clientHeight;
            this.ScreenMinHeight = (height - 400) + "px";
        }

    },

})