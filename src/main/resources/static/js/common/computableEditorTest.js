/**
 * Created by wang ming on 2018/5/22.
 */
let host = 'localhost';
let port = '80';
let domain = `https://geomodeling.njnu.edu.cn/GeoModeling`;
let testUrl = `${domain}/TestFileServlet`;
let mdlUrl = `${domain}/TaskInfoServlet`;
// let fileUploadUrl = `${domain}/UploadDataServlet`;
let downloadDataUrl = `${domain}/DownloadDataFileServlet`;
// let invokeUrl = `${domain}/TaskInfoServlet`;
// let recordUrl = `${domain}/GetRunningRecordServlet`;
let progressInterval;

let dxIP = $("#dxIP").val();
let dxPort = $("#dxPort").val();
let dxType = $("#dxType").val();

let fileUploadUrl = "http://localhost:8084/GeoModeling/computableModel/uploadData";
let invokeUrl = "/task/invoke";
let recordUrl = "/task/getResult"

let msDetail;
let vm;

let diagramStates = [];

$(document).ready(function () {
    function getQueryString(name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
            return unescape(r[2]);
        }
        return null;
    }

    let uid = "ZWY5YWRkNzgtODcxOS00MzRjLTkyNjQtNTA5NjYwMjlkNzYyLWIwZDQ3MzhmLWVkNzEtNGUxZi1iZjBkLWMzZmYxODkyYTNmOA==";//$(".detail_title").attr("content");
    let msrid = getQueryString('msrid');

    if (!uid) {
        $.gritter.add({
            title: 'Warning:',
            text: 'Invalid model id!',
            sticky: false
        });
        return;
    }

    testUrl += `?mid=${uid}`;
    mdlUrl += `?mid=${uid}`;
    downloadDataUrl += `?mid=${uid}`;

    let testifies;
    let fc;

    Promise.all([
        // fetch(testUrl)
        //     .then(res => res.json())
        //     .then(res => {
        //         if (res.status === 1) {
        //             testifies = res.testifies;
        //             return Promise.resolve();
        //         } else {
        //             return Promise.reject('fetch testify data failed!');
        //         }
        //     })
        //     .catch(e => {
        //         testifies = [];
        //         return Promise.resolve();
        //     }),
        fetch(mdlUrl)
            .then(res => res.json())
            .then(res => {
                if (res.result === "suc") {

                    fc = JSON.parse($("#mdlJson").val());
                    console.log(fc);
                    return;
                } else {
                    throw 'get mdl failed!';
                }
            })
            .catch(e => {
                return Promise.reject(e);
            })
    ])
    // prepare data
        .then(rsts => {
            $('#loading-div').css({
                display: 'none'
            })
            $('#root-div').css({
                display: 'flex'
            })
            $('#no-mdl-div').css({
                display: 'none'
            });

            $('#state-detail>i').hide();
            let abstract = _.get(fc, 'mdl.enAttr.abstract');
            let keywords = _.get(fc, 'mdl.enAttr.keywords');
            let desc = _.get(fc, 'mdl.desc');
            diagramStates = _.get(fc, 'mdl.states');

            function VM() {
                let self = this;
                this.fetchDataSucceed = true;
                // this.img = 'http://223.2.42.205:8081/img/Geosos.png';
                this.modelName = _.get(fc, 'mdl.name');
                this.keywords = (typeof (keywords) === 'string') ? [keywords] : keywords;
                this.abstract = abstract ? abstract : 'No abstract';
                this.currentViewName = ko.observable('invoke');
                this.progress = ko.observable(0);
                this.selectedDiagramStateId = ko.observable(undefined);


                this.testifies = _.map(testifies, testify => {
                    return {
                        name: testify.tag,
                        desc: testify.detail,
                        path: testify.title,
                        inputs: testify.inputs
                    };
                });
                this.selectedTestify = ko.observable(undefined);

                this.states = ko.computed(function () {
                    return _.map(fc.mdl.states, state => {
                        return {
                            name: state.name,
                            id: state.Id,
                            type: state.type,
                            desc: state.desc,
                            events: _.chain(state.event)
                                .map(item => {
                                    return {
                                        name: item.eventName,
                                        desc: item.eventDesc,
                                        data: (item.data)[0].text,
                                        eventId: item.eventId,
                                        eventIdbind: item.eventId
                                    }
                                })
                                .value(),
                            outputs: _.chain(state.event)
                                .filter(item => item.eventType === 'noresponse')
                                .map(item => {
                                    let value = fname = undefined;
                                    return {
                                        id: item.eventId,
                                        desc: item.eventDesc,
                                        name: item.eventName,
                                        optional: item.optional,
                                        value: ko.observable(value),
                                        fname: ko.observable(fname)
                                    };
                                })
                                .value(),
                            inputs: _.chain(state.event)
                                .filter(item => item.eventType === 'response')
                                .map(item => {
                                    let value = fname = undefined;
                                    if (self.testifies.length && self.selectedTestify() !== undefined) {
                                        let input = _.find(self.testifies[self.selectedTestify()].inputs, input => input.Event === item.eventName);
                                        if (input) {
                                            value = input.gd_id;
                                            fname = input.DataId;
                                        }
                                    }
                                    return {
                                        id: item.eventId,
                                        desc: item.eventDesc,
                                        name: item.eventName,
                                        optional: item.optional,
                                        value: ko.observable(value),
                                        fname: ko.observable(fname)
                                    };
                                })
                                .value()
                        }
                    })
                });

                this.selectedStateId = ko.observable(0);

                this.reset = function () {
                    if (this.selectedTestify() !== undefined && this.progress() === 0) {
                        this.selectedTestify(undefined);
                    }
                }

                this.onFileChange = function (e) {
                    let dom = e.target;
                    let file = e.target.files[0];
                    let xhr = new XMLHttpRequest();
                    let stateId = $(e.target).siblings().find('.state-id').val();
                    let eventId = $(e.target).siblings().find('.event-id').val();
                    xhr.onload = function () {
                        if (this.status == 200) {
                            let res = JSON.parse(this.response);
                            if (res.code === 1) {
                                $(e.target).siblings().find('.ogms-file-progress').addClass('succeed');
                                // let oldEvent = _.find(self.eventsUIControled(), item => item.id === eventId);
                                // let newEvent = _.cloneDeep(oldEvent);
                                // newEvent.fname = res.eventName;
                                // newEvent.value = res.data;
                                // self.eventsUIControled.replace(oldEvent, newEvent);

                                _.map(self.states(), state => {
                                    if (state.id === stateId) {
                                        _.map(state.inputs, input => {
                                            if (input.id === eventId) {
                                                input.fname(file.name);
                                                input.value(res.data.url);
                                            }
                                        });
                                    }
                                });

                                // $.gritter.add({
                                //     title: 'Notice:',
                                //     text: 'Upload succeed!',
                                //     sticky: false
                                // });
                                return;
                            }
                        }
                        // $.gritter.add({
                        //     title: 'Warning:',
                        //     text: 'Upload file failed!',
                        //     sticky: false
                        // });
                    };
                    xhr.upload.onprogress = e => {
                        let progress = parseInt(e.loaded / e.total * 100);
                        progress = progress > 100 ? 100 : progress + '%';
                        console.log(progress);
                        $(dom).siblings().find('.ogms-file-progress').css({
                            width: progress
                        });
                    };
                    xhr.open('post', fileUploadUrl, true);
                    let formData = new FormData();
                    formData.append('file', file);
                    formData.append('host', dxIP);
                    formData.append('port', dxPort);
                    formData.append('type', dxType);
                    formData.append('userName', window.sessionStorage.getItem("name"));
                    xhr.send(formData);
                }

                this.download = function (e) {
                    let url = $(e.target).parents('.ogms-event').find('.event-value').val();
                    // let path = this.testifies[this.selectedTestify()].path;
                    window.open(url)
                    // let tmp = $(`<form style='display: none;' target='' method='post' action='${downloadDataUrl}'>
                    //         <input name='mid' value='${uid}'>
                    //         <input name='path' value='${path}'>
                    //         <input name='dataId' value='${gdid}'>
                    //     </form>
                    // `).appendTo($('body'));
                    // tmp.submit();
                    // tmp.remove();
                }

                this.jump = function (eventId, stateId) {
                    this.currentViewName('diagram');
                    console.log(eventId, stateId);
                    this.onStateCellClicked(stateId, eventId);
                }


                let pollingGetRecord = function (msrid) {
                    fetch(recordUrl, {
                        method: 'post',
                        body: JSON.stringify({

                            ip: $("#IP").val(),
                            port: $("#Port").val(),
                            tid: msrid,


                        }),
                        headers: {
                            'content-type': 'application/json'
                        },
                        credentials: 'include'
                    })
                        .then(res => res.json())
                        .then(res => {
                            if (res.data.status === 0 || res.data.status === 1) {
                                // self.progress(n);
                                setTimeout(() => {
                                    pollingGetRecord(msrid);
                                }, 2000);
                            }
                            else if (res.data.status === 2) {
                                clearInterval(progressInterval);
                                _.map(res.data.outputdata, event => {
                                    _.map(self.states(), state => {
                                        if (state.name === event.statename) {
                                            _.map(state.outputs, output => {
                                                if (output.name === event.event) {
                                                    output.fname(event.event);
                                                    output.value(event.url);
                                                }
                                            });
                                            // let eventUI = _.find(state.outputs, output => output.name === event.event);
                                            // if (eventUI) {
                                            //     eventUI.value(event.url);
                                            //     eventUI.fname(event.tag);
                                            // }
                                        }
                                    });
                                    // _.map(res.data.inputdata, event => {
                                    //     let state = _.find(self.states(), state => state.id === event.stateId);
                                    //     if (state) {
                                    //         let eventUI = _.find(state.inputs, input => input.name === event.event);
                                    //         if (eventUI) {
                                    //             eventUI.value(event.dataId);
                                    //             eventUI.fname(event.tag);
                                    //         }
                                    //     }
                                    // });
                                    self.progress(100);
                                    // $.gritter.add({
                                    //     title: 'Notice:',
                                    //     text: 'Model run succeed!',
                                    //     sticky: false
                                    // });
                                    //
                                })
                            }
                            else if (res.data.status === -1) {
                                    clearInterval(progressInterval);
                                    $.gritter.add({
                                        title: 'Warning:',
                                        text: 'Model run failed!',
                                        sticky: false
                                    });
                                    self.progress(-1);
                                }
                            }
                        );
                };

                if (msrid) {
                    pollingGetRecord(msrid);
                }

                this.invoke = function (e) {
                    if (self.progress() !== 0) {
                        $.gritter.add({
                            title: 'Notice:',
                            text: 'Cannot be invoked repeatedly!',
                            sticky: false
                        });
                        return;
                    }
                    let dataList = [];
                    let outputdataList = [];
                    let valid = true;
                    _.map(self.states(), state => {
                        _.map(state.inputs, input => {
                            if (!input.optional) {
                                if (!input.value()) {
                                    valid = false;
                                }
                                dataList.push({
                                    // TODO Tag:
                                    statename: state.name,
                                    event: input.name,
                                    url: input.value(),
                                    tag: input.fname()
                                });
                            } else {
                                if (!input.value()) {
                                    console.log("hahaha");
                                } else {
                                    dataList.push({
                                        // TODO Tag:
                                        statename: state.name,
                                        event: input.name,
                                        url: input.value(),
                                        tag: input.fname()
                                    });
                                }

                            }
                        });
                        _.map(state.outputs, output => {
                            if (!output.fname()) {
                                outputdataList.push({
                                    name: output.name,
                                    Tag: output.name,
                                    id: state.id
                                });
                            } else {
                                outputdataList.push({
                                    name: output.name,
                                    Tag: output.fname(),
                                    id: state.id
                                });
                            }
                        })
                    });
                    if (valid) {
                        const href = window.location.href;
                        const hrefs = href.split("/");
                        fetch(invokeUrl, {
                            method: 'POST',
                            body: JSON.stringify({

                                oid: hrefs[hrefs.length - 1],
                                ip: $("#IP").val(),
                                port: $("#Port").val(),
                                pid: $("#pid").val(),
                                inputs: dataList,
                                //outputdataList: outputdataList

                            }),
                            headers: {
                                'content-type': 'application/json'
                            },
                            credentials: 'include'

                        })
                            .then(res => res.json())
                            .then(res => {
                                if (res.code === 0) {
                                    // facker progress
                                    self.progress(1);
                                    pollingGetRecord(res.data);
                                }
                                else if (res.code == -1) {
                                    alert("please login first!");
                                    window.open("/user/login");
                                }
                                else if (res.code == -2) {
                                    alert("Invoke failed!");
                                }

                            })
                            .catch(e => {
                                throw (e);
                            });
                    } else {
                        $.gritter.add({
                            title: 'Notice',
                            text: 'Data configured invalid!',
                            sticky: false
                        });
                    }
                }


                this.onStateCellClicked = function (stateId, eventId) {
                    _.find(this.states(), (state, i) => {
                        if (state.id === stateId) {
                            this.selectedDiagramStateId(i);
                            //
                            let flag = false;
                            var currentState = null;
                            let index = 0;
                            if (stateId) {
                                $("#dataList").empty();
                                $(".dataDetailInfo input").val("");
                                $(".dataDetailInfo textarea").val("");
                                for (let i = 0; i < diagramStates.length; i++) {
                                    if (stateId === diagramStates[i].Id) {
                                        currentState = diagramStates[i];
                                        flag = true;
                                        break;
                                    }
                                }
                            }
                            if (flag) {
                                let dataList = [];
                                for (let i = 0; i < currentState.event.length; i++) {
                                    dataList.push(currentState.event[i].data);
                                }

                                function createDataList(dataList) {
                                    var dataListPanel = document.getElementById("dataList");
                                    var TreeArrya = [];
                                    var TreeObj = {};
                                    TreeObj.text = "Data List";
                                    TreeObj.nodes = [];

                                    for (var i = 0; i < dataList.length; i++) {
                                        TreeObj.nodes.push(dataList[i][0]);
                                    }
                                    TreeArrya.push(TreeObj);
                                    var tree = document.createElement("div");
                                    tree.id = "DataListTree";
                                    dataListPanel.appendChild(tree);
                                    $(tree).treeview({
                                        data: TreeArrya,
                                        onNodeSelected: function (event, data) {
                                            if (data.dataType === "external") {
                                            }
                                            $("#dataNameInput").val(data.text);
                                            $("#dataTypeInput").val(data.dataType);
                                            $("#dataDescInput").val(data.desc);
                                        }
                                    })
                                }

                                createDataList(dataList);
                            }

                            if (eventId !== undefined) {
                                //根据eventId获取所在id
                                for (let i = 0; i < currentState.event.length; i++) {
                                    if (eventId === currentState.event[i].eventId) {
                                        index = i;
                                        break;
                                    }
                                }
                                //更改样式
                                var href = $('#eventList .panel').eq(index).find('panel-title').attr("href");
                                var t = $('#eventList .panel').eq(index).find('panel-title').children("i");

                                if ($(href).attr("aria-expanded") === "false") {
                                    t.removeClass("fa-caret-down").addClass("fa-caret-right");

                                } else {
                                    t.removeClass("fa-caret-right").addClass("fa-caret-down");
                                    $('#eventList .panel').eq(index).find('panel-title').click();
                                }

                            }

                            $('#quick_links_pop').css({
                                "opacity": 1,
                                "visibility": "visible",
                                "transform": "translateX(0px)"

                            });
                        }
                    });
                }
            }

            vm = new VM();
            ko.applyBindings(vm, $('#root-div')[0]);

            // region css
            let percent = 0;
            progressInterval = setInterval(() => {
                percent += 1;
                percent %= 100;

                $('.run-progress-kernel').css({
                    left: percent + '%'
                });
            }, 20);
            $('#testify-div').click(e => {
                if (vm.progress() === 0) {
                    $('#testify-div .options').toggle();
                }
            })
            $('html').click(e => {
                let ignores = ['.options', '#testify-div'];
                let len = $(e.target).parents().filter(_.join(ignores, ',')).length;
                if (len) {
                    return;
                }
                $('.options').hide();
            })

            $('.ogms-event-name').click(e => {
                let event = $(e.target).context;
                console.log(event);
            })
            // endregion
        })
        // validate of mxgraph
        .then(() => {
            if (!mxClient.isBrowserSupported()) {
                throw ('Browser is not supported!');
            } else {
                return;
            }
        })
        // mxgraph
        .then(() => {
            mxConnectionHandler.prototype.connectImage = new mxImage('../MxGraph/images/connector.gif', 16, 16);
            var model = new mxGraphModel();
            var graph = new mxGraph($('#diagram')[0], model);

            graph.dropEnabled = false;
            graph.setMultigraph(false);

            // Matches DnD inside the graph
            mxDragSource.prototype.getDropTarget = function (graph, x, y) {
                var cell = graph.getCellAt(x, y);
                if (!graph.isValidDropTarget(cell)) {
                    cell = null;
                }

                return cell;
            };

            var keyHandler = new mxKeyHandler(graph);
            var rubberband = new mxRubberband(graph);
            var edgeStyle = graph.getStylesheet().getDefaultEdgeStyle();
            edgeStyle[mxConstants.STYLE_STROKECOLOR] = "#000";
            edgeStyle[mxConstants.STYLE_STROKEWIDTH] = 2;
            edgeStyle[mxConstants.STYLE_EDGE] = mxEdgeStyle.OrthConnector;
            var style = new Object();
            style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_IMAGE;
            style[mxConstants.STYLE_PERIMETER] = mxPerimeter.RectanglePerimeter;
            style[mxConstants.STYLE_RESIZABLE] = "0";
            style[mxConstants.STYLE_IMAGE] = 'data:image/png;base64,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';
            style[mxConstants.STYLE_FONTCOLOR] = '#000';
            style[mxConstants.STYLE_FONTSIZE] = '16';
            style[mxConstants.STYLE_FONTSTYLE] = "1";
            graph.getStylesheet().putCellStyle("start", style);
            style = mxUtils.clone(style);
            style[mxConstants.STYLE_IMAGE] = 'data:image/png;base64,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';
            graph.getStylesheet().putCellStyle("process", style);
            style = mxUtils.clone(style);
            style[mxConstants.STYLE_IMAGE] = 'data:image/png;base64,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';
            graph.getStylesheet().putCellStyle("end", style);


            graph.dblClick = function (evt, cell) {
                var model = graph.getModel();
                if (model.isVertex(cell)) {
                    return false;
                }
            };
            msDetail = _.get(fc, 'layout');
            var doc = mxUtils.parseXml(msDetail);
            var dec = new mxCodec(doc);
            dec.decode(doc.documentElement, graph.getModel());

            var layout = new mxCompactTreeLayout(graph);

            layout.nodeDistance = 80;
            layout.execute(graph.getDefaultParent());
            graph.setCellsMovable(false);


            window.onresize = () => {
                let height = $("#diagram")[0].offsetHeight;

                $("#eventList").css({
                    "height": (height - 290) + "px",
                });
            }

            //add at 2018.06.05
            var track = new mxCellTracker(graph);
            track.mouseMove = function (sender, me) {
                var cell = this.getCell(me);
            };

            track.mouseDown = function (sender, me) {
                var cell = this.getCell(me);
                var flag = false;
                if (cell != null) {
                    if (cell.getStyle() === "process") {
                        if (cell.id) {
                            vm.onStateCellClicked(cell.id);
                        }
                    } else {
                        $('#quick_links_pop').css({
                            "opacity": 0,
                            "visibility": "hidden",
                            "transform": "translateX(260px)"

                        });
                    }
                } else {
                    $('#quick_links_pop').css({
                        "opacity": 0,
                        "visibility": "hidden",
                        "transform": "translateX(260px)"

                    });

                }

            }

            $(document).on("click", "#eventList .panel-heading>.panel-title", function () {
                var href = $(this).attr("href");
                var i = $(this).children("i");
                if ($(href).attr("aria-expanded") === "false") {
                    i.removeClass("fa-caret-down").addClass("fa-caret-right");
                } else {
                    i.removeClass("fa-caret-right").addClass("fa-caret-down");
                }
            });

            //tooltip 事件
            $("[data-toggle='tooltip']").tooltip();

        })
        .catch(e => {
            function VM() {
                this.fetchDataSucceed = false;
            }

            let vm = new VM();
            //ko.cleanNode($('#root-div')[0]);
            $('#loading-div').css({
                display: 'none'
            })
            //ko.applyBindings(vm, $('#root-div')[0]);
            $('#root-div').css({
                display: 'none'
            });

            $('#no-mdl-div').css({
                display: 'block'
            });
            console.log(e);
            $.gritter.add({
                title: 'Notice',
                text: typeof e === 'string' ? e : typeof e === 'object' ? JSON.stringify(e, null, 4) : undefined,
                sticky: false
            });
        });
})