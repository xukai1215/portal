// Extends EditorUi to update I/O action states based on availability of backend
var wsMxgraph = null;
var foreController = "";//上一个演示者
var Controller = "";//目前的演示者
var MxGraphList = "";
var LogicalScene = "";
var GraphUi = null;
var waitingList = [];
var graph;
(function () {
    var editorUiInit = EditorUi.prototype.init;

    EditorUi.prototype.init = function () {
        editorUiInit.apply(this, arguments);
        this.actions.get('export').setEnabled(false);

        // Updates action states which require a backend
        if (!Editor.useLocalStorage) {
            mxUtils.post(OPEN_URL, '', mxUtils.bind(this, function (req) {
                var enabled = req.getStatus() != 404;
                this.actions.get('open').setEnabled(enabled || Graph.fileSupport);
                this.actions.get('import').setEnabled(enabled || Graph.fileSupport);
                this.actions.get('save').setEnabled(enabled);
                this.actions.get('saveAs').setEnabled(enabled);
                this.actions.get('export').setEnabled(enabled);
            }));
        }
    };

    // Adds required resources (disables loading of fallback properties, this can only
    // be used if we know that all keys are defined in the language specific file)
    mxResources.loadDefaultBundle = false;
    var bundle = mxResources.getDefaultBundle(RESOURCE_BASE, mxLanguage) ||
        mxResources.getSpecialBundle(RESOURCE_BASE, mxLanguage);

    // Fixes possible asynchronous requests
    mxUtils.getAll([bundle, STYLE_PATH + '/default.xml'], function (xhr) {
        // Adds bundle text to resources
        mxResources.parse(xhr[0].getText());

        // Configures the default graph theme
        var themes = {};
        themes[Graph.prototype.defaultThemeName] = xhr[1].getDocumentElement();

        // Main
        var editorUi = new EditorUi(new Editor(urlParams['chrome'] === '0', themes));

        //定时信息发送器
        var timer = window.setInterval(function () {
            if (Controller === sessionStorage.getItem("username")) {//判断是否有权发送演示信息
                for(let i=0;i<graph.mxgraphList.length;i++){
                    if(graph.mxgraphList[i].uid==$("#viewPanel option:selected").attr("currentUID")){
                        var encoder = new mxCodec();
                        var node = encoder.encode(graph.getModel());
                        graph.mxgraphList[i].graphXML=mxUtils.getXml(node);
                        break;
                    }
                }
                MxGraphList=graph.getMxgraphListXMLStr();
                LogicalScene = graph.getLogicalSceneXMLStr();

                var selectorOptions=[];
                $("#viewPanel").children("option").each(function(){
                    var option={};
                    option.value=$(this).attr("value");
                    option.currentuid=$(this).attr("currentuid");
                    option.innerHTML=$(this).html();
                    selectorOptions.push(option);
                });
                var selectorData=JSON.stringify(selectorOptions);

                var messageObject = {};
                messageObject["messageType"] = "Message";
                messageObject["graphXML"] = MxGraphList;
                messageObject["logicalXML"] = LogicalScene;
                messageObject["selectorData"] = selectorData;
                wsMxgraph.send(JSON.stringify(messageObject));//发送
            }
        }, 1000);//时隔1秒
        //WebSocket
        graph = editorUi.toolbar.editorUi.editor.graph;
        GraphUi = graph;
        if (WebSocket) {
            var reg = /groupID=(\S*)/;
            var url = window.location.href;
            if (url.search(reg) != -1) {
                localStorage.setItem("historyURL", url);
                let groupID = url.match(reg)[1];
                // wsMxgraph = new WebSocket("ws:localhost:8081/TeamWorking/LogicalModel/" + groupID);
                wsMxgraph = new WebSocket("ws://172.21.212.7:8056/TeamWorking/LogicalModel/"+groupID);
            }
        }
        else {
            alert("浏览器不支持websocket！");
        }
        wsMxgraph.onopen = function () {
            //连接建立成功后，向服务器发送消息
            // ws.send("用户加入了协同画图......")
            var messageObject = {};
            messageObject["messageType"] = "Join";
            messageObject["message"] = sessionStorage.getItem("username");
            wsMxgraph.send(JSON.stringify(messageObject));
            window.setInterval(function () {
                if(wsMxgraph!=null){
                    var messageObject = {};
                    messageObject["messageType"] = "Ping";
                    wsMxgraph.send(JSON.stringify(messageObject));
                }
            },20000);
        };
        //接收来自服务器的消息后，触发该方法
        wsMxgraph.onmessage = function (ev) {
            var messageObject = JSON.parse(ev.data);
            if (messageObject.messageType === "Message") {
                graph.setMxgraphList(messageObject.graphXML);
                graph.setLogicalScene(messageObject.logicalXML);

                var optionJSONArray=JSON.parse(messageObject.selectorData);
                var currentUid="";var currentValue="";
                $("#viewPanel").empty();
                for(let i=0;i<optionJSONArray.length;i++){
                    var option = document.createElement("option");
                    option.innerHTML = optionJSONArray[i].innerHTML;
                    option.value = optionJSONArray[i].value;
                    option.setAttribute("currentUID",optionJSONArray[i].currentuid);
                    $("#viewPanel").append(option);
                    currentUid=optionJSONArray[i].currentuid;
                    currentValue=optionJSONArray[i].value;
                }
                $("#viewPanel").val(currentValue);
                for(let i=0;i<graph.mxgraphList.length;i++){
                    if(graph.mxgraphList[i].uid==currentUid){
                        var doc = mxUtils.parseXml(graph.mxgraphList[i].graphXML);
                        var dec = new mxCodec(doc);
                        dec.decode(doc.documentElement, graph.getModel());
                        break;
                    }
                }
            }
            else if (messageObject.messageType === "Join" || messageObject.messageType === "Left" || messageObject.messageType === "Authority") {//有用户加入或退出时重新显示在线用户
                foreController = Controller;
                Controller = messageObject.controller;//信息定时发送器
                var members = messageObject.message.replace("[", "").replace("]", "").replace(/\s/g, '').split(",");
                var membersHtml = "";
                for (var i = 0; i < members.length; i++) {
                    console.log("在线用户" + i + "：" + members[i]);
                    var accountIcon = "";
                    if (members[i] === messageObject.controller) {
                        accountIcon = "assignment_ind";
                    }
                    else {
                        accountIcon = "account_circle";
                    }
                    membersHtml += '<i class="material-icons account"  title="' + members[i] +
                        '">' + accountIcon + '</i>';
                }
                $("#members").html(membersHtml);
                if (messageObject.requireList != 0) {
                    waitingList = messageObject.requireList.replace("[", "").replace("]", "").replace(/\s/g, '').split(",");
                } else {
                    waitingList = [];
                }
                checkIdentity();
            }
        };

        //返回画布内容
        function getContentXML() {
            var encoder = new mxCodec();
            var node = encoder.encode(graph.getModel());
            var Integration = mxUtils.getXml(node);
            MxGraphList = Integration;
            return Integration;
        }

        //解析xml字符串
        function parseXml(xmlStr) {
            //创建文档对象
            var domParser = new DOMParser();
            var xmlDoc = domParser.parseFromString(xmlStr, "text/xml");
            return xmlDoc;
        }
        //显示框图
        function showGraph(graph, data) {
            if (data != null) {
                graph.getModel().beginUpdate();
                var doc = mxUtils.parseXml(data);
                // var req = mxUtils.load(data);
                // var root = req.getDocumentElement();
                var dec = new mxCodec(doc);
                dec.decode(doc.documentElement, graph.getModel());
                graph.getModel().endUpdate();
            }
        }

    }, function () {
        document.body.innerHTML = '<center style="margin-top:10%;">Error loading resource files. Please check browser console.</center>';
    });
})();
//演示权限转交
function pTransfer(newController) {
    if (Controller === sessionStorage.getItem("username")) {
        if (newController === sessionStorage.getItem("username")) {
            confirm("You already have demo authority.");
        }
        else {
            var r = confirm("Whether to transfer demo authority to " + newController + " ?");
            if (r === true) {
                var messageObject = {};
                messageObject["messageType"] = "Authority";
                messageObject["message"] = newController;
                wsMxgraph.send(JSON.stringify(messageObject));
            }
        }
    }
    else {
        confirm("Sorry, You have no right to transfer authority.");
    }

}

function demoRequire() {
    var messageObject = {};
    messageObject["messageType"] = "Authority";
    messageObject["message"] = "Require";
    messageObject["userName"] = sessionStorage.getItem("username");
    if (wsMxgraph) {
        wsMxgraph.send(JSON.stringify(messageObject));
    }
}
function demoRelease() {
    var messageObject = {};
    messageObject["messageType"] = "Authority";
    messageObject["message"] = "Release";
    messageObject["userName"] = sessionStorage.getItem("username");
    if (wsMxgraph) {
        wsMxgraph.send(JSON.stringify(messageObject));
    }
}

function checkIdentity() {
    if (Controller == sessionStorage.getItem("username") && waitingList.length < 1) {//若为演示者且不存在申请者
        $('#release').show();
        $('#waiting').hide();
        $('#waitingNum').show();
        $('#require').hide();
        $('#waitingNum').html("You are the presenter");
        if (foreController != Controller) {//若首次成为演示者
            window.time = 0;//重新计时
            console.log("You are the presenter!");
            graph.setEnabled(true);
        }
    }
    else if (Controller == sessionStorage.getItem("username") && waitingList.length > 0) {//若为演示者且存在申请者
        $('#release').show();
        $('#waiting').show();
        $('#waitingNum').show();
        $('#require').hide();
        if (foreController != Controller) {//若首次成为演示者
            window.time = 0;
            console.log("You are the presenter!");
            graph.setEnabled(true);
        }
        var num = 0;
        for (var i = 0; i < waitingList.length; i++) {
            if (waitingList[i] == sessionStorage.getItem("username")) {
                continue;
            }
            num++;
        }
        $('#waitingNum').html(num);
    } else if (Controller != sessionStorage.getItem("username")) { //观众
        var apply = 0;
        num = 0;
        for (i = 0; i < waitingList.length; i++) {
            if (Controller == waitingList[i]) {//若演示者在队列中，则跳过计数
                continue;
            }
            if (waitingList[i] == sessionStorage.getItem("username")) {
                apply = 1;//已申请
                break;
            }
            num++;
        }
        if (apply) {
            $('#release').hide();
            $('#waiting').show();
            $('#waitingNum').show();
            $('#require').hide();
            $('#waitingNum').html(num);
        }
        else {//若未申请
            $('#release').hide();
            $('#waiting').hide();
            $('#waitingNum').hide();
            $('#require').show();
        }
        graph.setEnabled(true);
        graph.setCellsSelectable(true);
    }
}

window.time = 0;
window.setInterval(function () {
    window.time++;
    if (window.time >= 10) {//10秒无动作则触发
        if (Controller == sessionStorage.getItem("username")) {//若为演示者则释放权限
            demoRelease();
        }
    }
}, 1000);

$("body").mousedown(function () {
    window.time = 0;
});
$("body").keydown(function () {
    window.time = 0;
});


function deleteTask(e) {
    var deleteSelect = confirm("Are you sure you want to delete the task? ");
    if (deleteSelect) {
        var projectID = $(e).attr("data-projectid");
        var parentDiv = $(e).parent();
        var dataJSON = new Object();
        dataJSON["Model"] = "Logical";
        dataJSON["Type"] = "Delete";
        dataJSON["ProjectID"] = projectID;
        $.ajax({
            type: "POST",
            url: "/TeamWorking/MxGraphServlet",
            data: dataJSON,
            success: function (data) {
                if (data == "success") {
                    parentDiv.remove();
                    if($('#tasksContent').find('div').length<1){
                        var str='<div style="height:150px;width:400px;border:solid 1px #d5d5d5;margin:20px;text-align:center;"><h1>No saved task here.</h1></div>';
                        $('#tasksContent').html(str);
                    }
                }
            }
        });
    }

}