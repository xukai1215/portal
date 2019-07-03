var vue = new Vue({
    el: "#app",
    data: {
        tableLoading: true,
        first: true,
        activeIndex: "3-2",
        activeNameGraph: "Image",
        activeName: "Invoke",
        info: {
            dxInfo: {},
            modelInfo: {},
            taskInfo: {},
            userInfo: {}
        },
        showUpload: false,
        showDataChose: false,
        total: 100,
        dataFromDataContainer: [
            {
                createDate: "2016-05-02",
                name: "test",
                type: "OTHER",
                sourceStoreId: "123123"
            },
            {
                createDate: "2016-05-02",
                name: "test2",
                type: "SHAPEFILE",
                sourceStoreId: "123123"
            },
            {
                createDate: "2016-05-02",
                name: "test",
                type: "GEOTIFF",
                sourceStoreId: "123123"
            }
        ],
        inEvent: [],
        outEvent: [],
        oid: null
    },
    computed: {},
    methods: {
        dateFormat(date, format) {
            let dateObj = new Date(date);
            let fmt = format || "yyyy-MM-dd hh:mm:ss";
            //author: meizz
            var o = {
                "M+": dateObj.getMonth() + 1, //月份
                "d+": dateObj.getDate(), //日
                "h+": dateObj.getHours(), //小时
                "m+": dateObj.getMinutes(), //分
                "s+": dateObj.getSeconds(), //秒
                "q+": Math.floor((dateObj.getMonth() + 3) / 3), //季度
                S: dateObj.getMilliseconds() //毫秒
            };
            if (/(y+)/.test(fmt))
                fmt = fmt.replace(
                    RegExp.$1,
                    (dateObj.getFullYear() + "").substr(4 - RegExp.$1.length)
                );
            for (var k in o)
                if (new RegExp("(" + k + ")").test(fmt))
                    fmt = fmt.replace(
                        RegExp.$1,
                        RegExp.$1.length == 1
                            ? o[k]
                            : ("00" + o[k]).substr(("" + o[k]).length)
                    );
            return fmt;
        },
        uploadData() {
            return {
                host: this.info.dxInfo.dxIP,
                port: this.info.dxInfo.dxPort,
                type: this.info.dxInfo.dxType,
                userName: this.info.userInfo.userName
            };
        },
        handleDataDownloadClick({ sourceStoreId }) {
            let url =
                "http://172.21.212.64:8081/dataResource/getResource?sourceStoreId=" +
                sourceStoreId;
            window.open("/dispatchRequest/download?url=" + url);
        },
        handleDataChooseClick({ sourceStoreId, fileName, suffix }) {
            let url =
                "http://172.21.212.64:8081/dataResource/getResource?sourceStoreId=" +
                sourceStoreId;
            this.showDataChose = false;
            this.eventChoosing.tag = fileName + "." + suffix;
            this.eventChoosing.url = url;
        },
        switchClick(i) {
            if (i == 1) {
                $(".tab1").css("display", "block");
                $(".tab2").css("display", "none");
                $(".tab3").css("display", "none");
            } else if (i == 2) {
                $(".tab1").css("display", "none");
                $(".tab2").css("display", "block");
                $(".tab3").css("display", "none");
            } else {
                $(".tab1").css("display", "none");
                $(".tab2").css("display", "none");
                $(".tab3").css("display", "block");
            }

            var btns = $(".switch-btn");

            btns.css("color", "#636363");
            btns.eq(i - 1).css("color", "#428bca");
        },
        init() {},
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
        filterTag(value, row) {
            return row.fromWhere === value;
        },
        async loadTest(type) {
            const loading = this.$loading({
                lock: true,
                text: "Loading",
                spinner: "el-icon-loading",
                background: "rgba(0, 0, 0, 0.7)"
            });
            let body = {
                oid: this.oid,
                host: this.info.dxInfo.dxIP,
                port: this.info.dxInfo.dxPort,
                type: this.info.dxInfo.dxType,
                userName: this.info.userInfo.userName
            };
            let { data, code ,msg} = await (await fetch("/task/loadTestData/", {
                method: "post",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            })).json();

            if (code == -1 || code==null || code==undefined) {
                loading.close();
                this.$message.error(msg);
                return;
            }

            data.forEach(el => {
                let stateId = el.stateId;
                let eventName = el.event;
                let state = this.info.modelInfo.states.find(state => {
                    return state.Id == stateId;
                });
                if (state == undefined) return;
                let event = state.event.find(event => {
                    return event.eventName == eventName;
                });
                if (event == undefined) return;
                this.$set(event, "tag", el.tag);
                this.$set(event, "url", el.url);
            });
            loading.close();
        },
        goPersonCenter(oid){
            window.open("/user/"+oid);
        },
        download(event) {
            //下载接口
            this.eventChoosing = event;
            window.open("/dispatchRequest/download?url=" + this.eventChoosing.url);
        },
        upload(event) {
            //上传接口
            this.showUpload = true;
            this.eventChoosing = event;
        },
        beforeRemove(file) {
            return this.$confirm(`确定移除 ${file.name}？`);
        },
        onSuccess({ data }) {
            let { tag, url } = data;
            this.showUpload = false;
            this.eventChoosing.tag = tag;
            this.eventChoosing.url = url;
            this.$refs.upload.clearFiles();
        },
        async check(event) {
            if (this.first == true) {
                let d = await this.getTableData(0);
                this.dataFromDataContainer = d.content;
                this.total = d.total;
                this.first = false;
            }
            this.showDataChose = true;
            this.eventChoosing = event;
        },
        async handleCurrentChange(val) {
            let d = await this.getTableData(val - 1);
            this.dataFromDataContainer = d.content;
        },
        async getTableData(page) {
            this.tableLoading = true;
            let { data } = await (await fetch(
                "/dispatchRequest/getUserRelatedDataFromDataContainer/?page=" +
                page +
                "&pageSize=10&" +
                "authorName=" +
                this.info.userInfo.userName
            )).json();
            this.tableLoading = false;

            return {
                total: data.totalElements,
                content: data.content
            };
        },

        async invoke() {

            const loading = this.$loading({
                lock: true,
                text: "Loading",
                spinner: "el-icon-loading",
                background: "rgba(0, 0, 0, 0.7)"
            });
            let json = {
                oid: this.oid,
                ip: this.info.taskInfo.ip,
                port: this.info.taskInfo.port,
                pid: this.info.taskInfo.pid,
                inputs: []
            };

            try{
                this.info.modelInfo.states.forEach(state => {
                    let statename = state.name;
                    state.event.forEach(el => {
                        let event = el.eventName;
                        let tag = el.tag;
                        let url = el.url;
                        if (el.eventType == "response") {
                            if (el.optional) {
                                if(url === null || url === undefined){

                                }else{
                                    json.inputs.push({
                                        statename,
                                        event,
                                        url,
                                        tag
                                    });
                                }
                            } else {
                                if (url === null || url === undefined) {
                                    this.$message.error("部分输入数据未配置");
                                    throw new Error("部分输入数据未配置");
                                }
                                json.inputs.push({
                                    statename,
                                    event,
                                    url,
                                    tag
                                });
                            }
                        }
                    });
                });
            }catch(e){
                loading.close();
                return;
            }


            let { data, code, msg } = await (await fetch("/task/invoke", {
                method: "post",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(json)
            })).json();

            if (code == -1) {
                this.$message.error(msg);
                window.open("/user/login");
            }

            if (code == -2) {
                this.$message.error(msg);
                loading.close();
                return;
            }

            let tid = data;

            let interval = setInterval(async () => {
                let { code, data, msg } = await (await fetch("/task/getResult", {
                    method: "post",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        ip: this.info.taskInfo.ip,
                        port: this.info.taskInfo.port,
                        tid: tid
                    })
                })).json();
                if (code === -1) {
                    this.$message.error(msg);
                    clearInterval(interval);
                    loading.close();
                }
                if (data.status === -1) {
                    this.$message.error("模型运行出错");
                    clearInterval(interval);
                    loading.close();
                } else if (data.status === 2) {
                    this.$message.success("模型运行成功");
                    clearInterval(interval);
                    let outputs = data.outputdata;

                    outputs.forEach(el => {
                        let statename = el.statename;
                        let eventName = el.event;
                        let state = this.info.modelInfo.states.find(state => {
                            return state.name == statename;
                        });
                        if (state == undefined) return;
                        let event = state.event.find(event => {
                            return event.eventName == eventName;
                        });
                        if (event == undefined) return;
                        this.$set(event, "tag", el.tag);
                        this.$set(event, "url", el.url);
                    });

                    loading.close();
                } else {
                }
            }, 3000);
        }
    },
    async mounted() {
        let ids = window.location.href.split("/");
        let id = ids[ids.length - 1];
        this.oid = id;
        let { data } = await (await fetch("/task/TaskInit/" + id)).json();
        if(data==null||data==undefined){
            alert("初始化错误")
        }
        this.info = data;
        console.log(this.info);
    }
});
