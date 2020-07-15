var createSpatialReference = Vue.extend({
    template: "#createSpatialReference",
    data() {
        return {
            status: "Public",

            defaultActive: '4-2',
            curIndex: '6',

            ScreenMaxHeight: "0px",
            IframeHeight: "0px",
            editorUrl: "",
            load: false,

            ScreenMinHeight: "0px",

            userId: "",
            userName: "",
            loginFlag: false,
            activeIndex: 2,

            userInfo: {
                //username:"",
                name: "",
                email: "",
                phone: "",
                insName: ""
            },

            treeData: [{
                id: 1,
                label: "Spatial Reference Repository",
                oid: '58340c92-d74f-4d81-8a80-e4fcff286008',
                children: [{
                    id: 100,
                    "oid": "da70ad83-de57-4fc3-a85d-c1dcf4961433",
                    "label": "Basic"
                },
                    {
                        id: 101,
                        "oid": "c4642926-e797-4f61-92d6-7933df2413d2",
                        "label": "EPSG"
                    },
                    {
                        id: 102,
                        "oid": "e8562394-b55f-46d7-870e-ef5ad3aaf110",
                        "label": "ESRI"
                    },
                    {
                        id: 103,
                        "oid": "ee830613-1603-4f38-a196-5028e4e10d39",
                        "label": "IAU"
                    },
                    {
                        id: 104,
                        "oid": "b2f2fbfd-f21a-47ac-9e1f-a96ac0218bf1",
                        "label": "Customized"
                    }]
            }, {
                id: 2,
                label: "Temporal Reference Repository",
                oid: 'ce37e343-bf2c-4e7b-902e-46616604e184',
                children: [{
                    id: 3,
                    label: "Global",
                    oid: '295d2120-402b-4ee6-a0b5-308b67fe2c40',
                },
                    {
                        id: 4,
                        label: "Local",
                        oid: '6883d3fb-8485-4771-9a3e-3276c759364e',
                    }]
            }],

            defaultProps: {
                children: 'children',
                label: 'label'
            },
            cls: [],
            clsStr: '',
            parId: "",

            referenceInfo: {},

            socket: "",

            spatialReference_oid: "",
        }
    },
    methods: {
        changeRter(index) {
            this.curIndex = index;
            var urls = {
                1: '/user/userSpace',
                2: '/user/userSpace/model',
                3: '/user/userSpace/data',
                4: '/user/userSpace/server',
                5: '/user/userSpace/task',
                6: '/user/userSpace/community',
                7: '/user/userSpace/theme',
                8: '/user/userSpace/account',
                9: '/user/userSpace/feedback',
            }

            this.setSession('curIndex', index)
            window.location.href = urls[index]

        },
        handleSelect(index, indexPath) {
            this.setSession("index", index);
            window.location.href = "/user/userSpace"
        },
        handleCheckChange(data, checked, indeterminate) {
            let checkedNodes = this.$refs.tree2.getCheckedNodes()
            let classes = [];
            let str = '';
            for (let i = 0; i < checkedNodes.length; i++) {
                // console.log(checkedNodes[i].children)
                if (checkedNodes[i].children != undefined) {
                    continue;
                }

                classes.push(checkedNodes[i].oid);
                str += checkedNodes[i].label;
                if (i != checkedNodes.length - 1) {
                    str += ", ";
                }
            }
            this.cls = classes;
            this.clsStr = str;

        },
        changeOpen(n) {
            this.activeIndex = n;
        },
        setSession(name, value) {
            window.sessionStorage.setItem(name, value);
        },

        sendcurIndexToParent() {
            this.$emit('com-sendcurindex', this.curIndex)
        },

        sendUserToParent(userId) {
            this.$emit('com-senduserinfo', userId)
        },

        init: function () {

            if ('WebSocket' in window) {
                // this.socket = new WebSocket("ws://localhost:8080/websocket");
                this.socket = new WebSocket(websocketAddress);
                // 监听socket连接
                this.socket.onopen = this.open;
                // 监听socket错误信息
                this.socket.onerror = this.error;
                // 监听socket消息
                this.socket.onmessage = this.getMessage;

            }
            else {
                alert('当前浏览器 Not support websocket');
                console.log("websocket 无法连接");
            }
        },
        open: function () {
            console.log("socket连接成功")
        },
        error: function () {
            console.log("连接错误");
        },
        getMessage: function (msg) {
            console.log(msg.data);
        },
        send: function (msg) {
            this.socket.send(msg);
        },
        close: function () {
            console.log("socket已经关闭")
        },
        getMessageNum(spatialReference_oid) {
            this.message_num_socket = 0;//初始化消息数目
            let data = {
                type: 'spatialReference',
                oid: spatialReference_oid,
            };

            //根据oid去取该作者的被编辑的条目数量
            $.ajax({
                url: "/theme/getAuthorMessageNum",
                type: "GET",
                data: data,
                async: false,
                success: (json) => {
                    this.message_num_socket = json;
                }
            });
            let data_theme = {
                type: 'spatialReference',
                oid: spatialReference_oid,
            };
            $.ajax({
                url: "/theme/getThemeMessageNum",
                async: false,
                type: "GET",
                data: data_theme,
                success: (json) => {
                    console.log(json);
                    for (let i = 0; i < json.length; i++) {
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
                                                this.message_num_socket++;
                                        }
                                    } else if (k == 1) {
                                        switch (type[j].status) {
                                            case "0":
                                                this.message_num_socket++;
                                        }
                                    } else if (k == 2) {
                                        switch (type[j].status) {
                                            case "0":
                                                this.message_num_socket++;
                                        }
                                    } else if (k == 3) {
                                        switch (type[j].status) {
                                            case "0":
                                                this.message_num_socket++;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            })
        }

    },
    mounted() {
        let that = this;
        that.init();
        //初始化的时候吧curIndex传给父组件，来控制bar的高亮显示
        this.sendcurIndexToParent()

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
        })

        var oid = this.$route.params.editId;//取得所要edit的id

        var user_num = 0;

        if ((oid === "0") || (oid === "") || (oid === null) || (oid === undefined)) {

            // $("#title").text("Create Spatial Reference")
            $("#subRteTitle").text("/Create Spatiotemporal Reference")


            // $("#spatialText").html("");

            initTinymce('textarea#spatialText')

        }
        else {

            // $("#title").text("Modify Spatial Reference")
            $("#subRteTitle").text("/Modify Spatiotemporal Reference")
            document.title = "Modify Spatial Reference | OpenGMS"

            $.ajax({
                url: "/repository/getSpatialInfo/" + oid,
                type: "get",
                data: {},

                success: (result) => {
                    console.log(result)
                    var basicInfo = result.data;
                    this.referenceInfo = basicInfo;

                    //cls
                    this.cls = basicInfo.classifications;
                    this.status = basicInfo.status;
                    let ids = [];
                    for (i = 0; i < this.cls.length; i++) {
                        for (j = 0; j < 1; j++) {
                            for (k = 0; k < this.treeData[j].children.length; k++) {
                                if (this.cls[i] == this.treeData[j].children[k].oid) {
                                    ids.push(this.treeData[j].children[k].id);
                                    this.parid = this.treeData[j].children[k].id;
                                    this.clsStr += this.treeData[j].children[k].label;
                                    if (i != this.cls.length - 1) {
                                        this.clsStr += ", ";
                                    }
                                    break;
                                }
                            }
                            if (ids.length - 1 == i) {
                                break;
                            }
                        }
                    }

                    this.$refs.tree2.setCheckedKeys(ids);

                    $(".providers").children(".panel").remove();
                    $("#wknameInput").val(basicInfo.wkname);
                    $("#wktInput").val(basicInfo.wkt);
                    $("#nameInput").val(basicInfo.name);
                    $("#descInput").val(basicInfo.description);

                    //image
                    if (basicInfo.image != "") {
                        $("#imgShow").attr("src", basicInfo.image);
                        $('#imgShow').show();
                    }

                    //detail
                    //tinymce.remove("textarea#spatialText");
                    if (basicInfo.detail != null) {
                        $("#spatialText").html(basicInfo.detail);
                    }

                    initTinymce('textarea#spatialText')

                }
            })
            window.sessionStorage.setItem("editSpatial_id", "");
        }

        $("#step").steps({
            onFinish: function () {
                alert('Wizard Completed');
            },
            onChange: (currentIndex, newIndex, stepDirection) => {
                if (currentIndex === 0 && stepDirection === "forward") {
                    if (this.cls.length == 0) {
                        new Vue().$message({
                            message: 'Please select at least one classification!',
                            type: 'warning',
                            offset: 70,
                        });
                        return false;
                    }
                    else if ($("#nameInput").val().trim() == "") {
                        new Vue().$message({
                            message: 'Please enter name!',
                            type: 'warning',
                            offset: 70,
                        });
                        return false;
                    } else if ($("#descInput").val().trim() == "") {
                        new Vue().$message({
                            message: 'Please enter overview!',
                            type: 'warning',
                            offset: 70,
                        });
                        return false;
                    } else {
                        return true;
                    }
                } else {
                    return true;
                }
            }
        });

        //判断是否登录
        $.ajax({
            type: "GET",
            url: "/user/load",
            data: {},
            cache: false,
            async: false,
            success: (data) => {
                data = JSON.parse(data);
                console.log(data);
                if (data.oid == "") {
                    alert("Please login");
                    window.location.href = "/user/login";
                }
                else {
                    this.userId = data.oid;
                    this.userName = data.name;

                    this.sendUserToParent(this.userId)
                }
            }
        })

        let height = document.documentElement.clientHeight;
        this.ScreenMaxHeight = (height) + "px";
        this.IframeHeight = (height - 20) + "px";

        window.onresize = () => {
            console.log('come on ..');
            height = document.documentElement.clientHeight;
            this.ScreenMaxHeight = (height) + "px";
            this.IframeHeight = (height - 20) + "px";
        }

        var spatialObj = {};

        $(".finish").click(() => {
            let loading = this.$loading({
                lock: true,
                text: "Uploading...",
                spinner: "el-icon-loading",
                background: "rgba(0, 0, 0, 0.7)"
            });
            spatialObj.classifications = this.cls;
            spatialObj.name = $("#nameInput").val();
            spatialObj.status = this.status;
            spatialObj.wkname = $("#wknameInput").val();
            spatialObj.wkt = $("#wktInput").val();
            spatialObj.description = $("#descInput").val();
            spatialObj.uploadImage = $('#imgShow').get(0).currentSrc;
            var detail = tinyMCE.activeEditor.getContent();
            spatialObj.detail = detail.trim();
            console.log(spatialObj)


            let formData = new FormData();
            if ((oid === "0") || (oid === "") || (oid == null)) {
                let file = new File([JSON.stringify(spatialObj)], 'ant.txt', {
                    type: 'text/plain',
                });
                formData.append("info", file)
                $.ajax({
                    url: "/repository/addSpatialReference",
                    type: "POST",
                    cache: false,
                    processData: false,
                    contentType: false,
                    async: true,
                    data: formData,
                    success: (result) => {
                        loading.close();
                        if (result.code == "0") {
                            this.$confirm('<div style=\'font-size: 18px\'>Create spatiotemporal reference successfully!</div>', 'Tip', {
                                dangerouslyUseHTMLString: true,
                                confirmButtonText: 'View',
                                cancelButtonText: 'Go Back',
                                cancelButtonClass: 'fontsize-15',
                                confirmButtonClass: 'fontsize-15',
                                type: 'success',
                                center: true,
                                showClose: false,
                            }).then(() => {
                                window.location.href = "/repository/spatialReference/" + result.data;
                            }).catch(() => {
                                window.location.href = "/user/userSpace#/communities/spatialReference";
                            });
                        }
                        else if (result.code == -1) {
                            this.$alert('Please login first!', 'Error', {
                                type: "error",
                                confirmButtonText: 'OK',
                                callback: action => {
                                    window.location.href = "/user/login";
                                }
                            });
                        }
                        else {
                            this.$alert('Created failed!', 'Error', {
                                type: "error",
                                confirmButtonText: 'OK',
                                callback: action => {

                                }
                            });
                        }
                    }
                })
            }
            else {
                spatialObj["oid"] = oid;
                let file = new File([JSON.stringify(spatialObj)], 'ant.txt', {
                    type: 'text/plain',
                });
                formData.append("info", file)
                $.ajax({
                    url: "/repository/updateSpatialReference",
                    type: "POST",
                    cache: false,
                    processData: false,
                    contentType: false,
                    async: true,
                    data: formData,

                    success: (result) => {
                        loading.close();
                        if (result.code === 0) {
                            if (result.data.method === "update") {
                                this.$confirm('<div style=\'font-size: 18px\'>Update spatiotemporal reference successfully!</div>', 'Tip', {
                                    dangerouslyUseHTMLString: true,
                                    confirmButtonText: 'View',
                                    cancelButtonText: 'Go Back',
                                    cancelButtonClass: 'fontsize-15',
                                    confirmButtonClass: 'fontsize-15',
                                    type: 'success',
                                    center: true,
                                    showClose: false,
                                }).then(() => {
                                    window.location.href = "/repository/spatialReference/" + result.data.oid;
                                }).catch(() => {
                                    window.location.href = "/user/userSpace#/communities/spatialReference";
                                });
                            }
                            else {
                                let currentUrl = window.location.href;
                                let index = currentUrl.lastIndexOf("\/");
                                that.spatialReference_oid = currentUrl.substring(index + 1, currentUrl.length);
                                console.log(that.spatialReference_oid);
                                //当change submitted时，其实数据库中已经更改了，但是对于消息数目来说还没有及时改变，所以在此处获取消息数目，实时更新导航栏消息数目，
                                that.getMessageNum(that.spatialReference_oid);
                                let params = that.message_num_socket;
                                that.send(params);
                                this.$alert('Changes have been submitted, please wait for the author to review.', 'Success', {
                                    type: "success",
                                    confirmButtonText: 'OK',
                                    callback: action => {
                                        window.location.href = "/user/userSpace";
                                    }
                                });

                            }

                        }
                        else if (result.code == -2) {
                            this.$alert('Please login first!', 'Error', {
                                type: "error",
                                confirmButtonText: 'OK',
                                callback: action => {
                                    window.location.href = "/user/login";
                                }
                            });
                        }
                        else {
                            this.$alert(result.msg, 'Error', {
                                type: "error",
                                confirmButtonText: 'OK',
                                callback: action => {

                                }
                            });
                        }

                    }
                })
            }
        });

        // $(".prev").click(()=>{
        //     let currentUrl = window.location.href;
        //     let index = currentUrl.lastIndexOf("\/");
        //     that.spatialReference_oid = currentUrl.substring(index + 1,currentUrl.length);
        //     console.log(that.spatialReference_oid);
        //     //当change submitted时，其实数据库中已经更改了，但是对于消息数目来说还没有及时改变，所以在此处获取消息数目，实时更新导航栏消息数目，
        //     that.getMessageNum(that.spatialReference_oid);
        //     let params = that.message_num_socket;
        //     that.send(params);
        // });

        $(document).on("keyup", ".username", function () {

            if ($(this).val()) {
                $(this).parents('.panel').eq(0).children('.panel-heading').children().children().html($(this).val());
            }
            else {
                $(this).parents('.panel').eq(0).children('.panel-heading').children().children().html("NEW");
            }
        })

    }
})