var info=new Vue({
    el: '#app',
    components: {
        'avatar': VueAvatar.Avatar,
    },
    data: function () {
        return {
            //comment
            commentText: "",
            commentParentId:null,
            commentList:[],
            replyToUserId:"",
            commentTextAreaPlaceHolder:"Write your comment...",
            replyTo:"",

            dialogTableVisible: false,
            relateSearch: "",
            relateType: "",
            relateTitle: "",
            tableMaxHeight: 400,
            tableData: [],

            pageOption: {
                paginationShow: false,
                progressBar: true,
                sortAsc: false,
                currentPage: 0,
                pageSize: 6,

                total: 264,
                searchResult: [],
            },


            activeIndex: '2',
            activeName: 'Computable Model',
            activeName1: 'Model Item',
            activeName2: 'Concept & Semantic',
            activeRelatedDataName: 'Add Data Items',
            refTableData: [{
                title: 'Anisotropic magnetotransport and exotic longitudinal linear magnetoresistance in WT e2 crystals',
                authors: 'Zhao Y.,Liu H.,Yan J.,An W.,Liu J.,Zhang X.,Wang H.,Liu Y.,Jiang H.,Li Q.,Wang Y.,Li X.-Z.,Mandrus D.,Xie X.~C.,Pan M.,Wang J.',
                date: 'jul 2015',
                journal: 'prb',
                pages: "041104"
            }, {
                title: 'Detection of a Flow Induced Magnetic Field Eigenmode in the Riga Dynamo Facility',
                authors: 'Gailitis A.,Lielausis O.,Dement\'ev S.,Platacis E.,Cifersons A.,Gerbeth G.,Gundrum T.,Stefani F.,Christen M.,Hanel H.,Will G.',
                date: 'may 2000',
                journal: 'Physical Review Letters',
                pages: "4365-4368"
            }],

            useroid: '',
            userUid:"",
            userImg:"",
            loading: false,
            related3Models: [],
            value1: '1',
            relatedModelNotNull: false,
            relatedModelIsNull: false,
            searchRelatedModelsDialogVisible: false,
            addRelatedModelsDialogVisible: false,
            allRelatedModels: [],
            dataNums: 5,
            timer: false,
            nomore: "",
            nomoreflag: false,

            relatedModelsSearchText: '',
            addModelsSearchText: '',
            searchAddRelatedModels: [],
            searchAddModelPage: 1,

            selectedModels: [],
            selectedModelsOid: [],


        }
    },
    methods: {
        submitComment(){
            if(this.useroid==""||this.useroid==null||this.useroid==undefined){
                this.$message({
                    dangerouslyUseHTMLString: true,
                    message: '<strong>Please <a href="/user/login">log in</a> first.</strong>',
                    offset: 40,
                    showClose: true,
                });
            }else if(this.commentText.trim()==""){
                this.$message({
                    message: 'Comment can not be empty!',
                    offset: 40,
                    showClose: true,
                });
            }else {

                let hrefs = window.location.href.split("/");
                let id = hrefs[hrefs.length - 1].substring(0, 36);
                let typeName = hrefs[hrefs.length-2];
                let data = {
                    parentId: this.commentParentId,
                    content: this.commentText,
                    // authorId: this.useroid,
                    replyToUserId: this.replyToUserId,
                    relateItemId: id,
                    relateItemTypeName: typeName,
                };
                $.ajax({
                    url: "/comment/add",
                    async: true,
                    type: "POST",
                    contentType: 'application/json',

                    data: JSON.stringify(data),
                    success: (result) => {
                        console.log(result)
                        if(result.code==-1){
                            window.location.href="/user/login"
                        }else if (result.code == 0) {
                            this.commentText = "";
                            this.$message({
                                message: 'Comment submitted successfully!',
                                type: 'success',
                                offset: 40,
                                showClose: true,
                            });
                            this.getComments();
                        } else {
                            this.$message({
                                message: 'Submit Error!',
                                type: 'error',
                                offset: 40,
                                showClose: true,
                            });
                        }
                    }
                });
            }

        },
        deleteComment(oid){
            $.ajax({
                url: "/comment/delete",
                async: true,
                type: "POST",


                data: {
                    oid:oid,
                },
                success: (result) => {
                    console.log(result)
                    if(result.code==-1){
                        window.location.href="/user/login"
                    }else if (result.code == 0) {
                        this.commentText = "";
                        this.$message({
                            message: 'Comment deleted successfully!',
                            type: 'success',
                            offset: 40,
                            showClose: true,
                        });
                        this.getComments();
                    } else {
                        this.$message({
                            message: 'Delete Error!',
                            type: 'error',
                            offset: 40,
                            showClose: true,
                        });
                    }
                }
            });
        },
        getComments(){
            let hrefs=window.location.href.split("/");
            let type=hrefs[hrefs.length-2];
            let oid=hrefs[hrefs.length-1].substring(0,36);
            let data={
                type:type,
                oid:oid,
                sort:-1,
            };
            $.get("/comment/getCommentsByTypeAndOid",data,(result)=>{
                this.commentList=result.data.commentList;
            })
        },
        replyComment(comment){
            this.commentParentId=comment.oid;
            this.replyTo="Reply to "+comment.author.name;
            setTimeout(function () { $("#commentTextArea").focus();}, 1);
        },
        replySubComment(comment,subComment){
            this.commentParentId=comment.oid;
            this.replyToUserId=subComment.author.oid;
            // this.commentTextAreaPlaceHolder="Reply to "+subComment.author.name;
            this.replyTo="Reply to "+subComment.author.name;
            setTimeout(function () { $("#commentTextArea").focus();}, 1);
        },
        tagClose(){
            this.replyTo="";
            this.replyToUserId="";
            this.commentParentId=null;
        },

        edit() {
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
                    data = JSON.parse(data);
                    if (data.oid == "") {
                        alert("Please login first");
                        this.setSession("history", window.location.href);
                        window.location.href = "/user/login";
                    }
                    else {
                        let href = window.location.href;
                        let hrefs = href.split('/');
                        let oid = hrefs[hrefs.length - 1].split("#")[0];
                        window.location.href = "/user/userSpace#/model/manageModelItem/"+oid;
                        // $.ajax({
                        //     type: "GET",
                        //     url: "/modelItem/getUserOidByOid",
                        //     data: {
                        //         oid: oid
                        //     },
                        //     cache: false,
                        //     async: false,
                        //     xhrFields: {
                        //         withCredentials: true
                        //     },
                        //     crossDomain: true,
                        //     success: (json) => {
                        //         // if(json.data==data.oid){
                        //         window.sessionStorage.setItem("editModelItem_id", oid)
                        //         window.location.href = "/user/createModelItem";
                        //         // }
                        //         // else{
                        //         //     alert("You are not the model item's author, please contact to the author to modify the model item.")
                        //         // }
                        //     }
                        // });
                    }
                }
            })
        },
        setSession(name, value) {
            window.sessionStorage.setItem(name, value);
        },
        link(event) {
            let refLink = $(".refLink");
            for (i = 0; i < refLink.length; i++) {
                if (event.currentTarget == refLink[i]) {
                    window.open(this.refTableData[i].links);
                }
            }
            //console.log(event.currentTarget);
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
                    data = JSON.parse(data);
                    if (data.oid == "") {
                        alert("Please login first");
                        window.location.href = "/user/login";
                    }
                    else {
                        let arr = window.location.href.split("/");
                        let bindOid = arr[arr.length - 1].split("#")[0];
                        this.setSession("bindOid", bindOid);
                        switch (this.relateType) {
                            case "modelItem":
                                window.open("/user/createModelItem", "_blank")
                                break;
                            case "conceptualModel":
                                window.open("/user/createConceptualModel", "_blank")
                                break;
                            case "logicalModel":
                                window.open("/user/createLogicalModel", "_blank")
                                break;
                            case "computableModel":
                                window.open("/user/createComputableModel", "_blank")
                                break;
                            case "concept":
                                window.open("/repository/createConcept", "_blank")
                                break;
                            case "spatialReference":
                                window.open("/repository/createSpatialReference", "_blank")
                                break;
                            case "template":
                                window.open("/repository/createTemplate", "_blank")
                                break;
                            case "unit":
                                window.open("/repository/createUnit", "_blank")
                                break;
                        }
                    }
                }
            })
        },

        checkRelatedData(item) {
            let curentId = document.location.href.split("/");
            return curentId[0] + "//" + curentId[2] + "/dataItem/" + item.id;
        },
        //add related models

        addRelatedModel() {

            if (this.useroid == '') {
                alert("Please login");
                window.location.href = "/user/login";
            } else {
                this.searchAddModelPage = 1
                this.searchAddRelatedModels = []
                this.addModelsSearchText = ""
                this.selectedModels = []
                this.selectedModelsOid = []

                this.nomore = ''
                this.addRelatedModelsDialogVisible = true

            }

        },

        searchRelatedModels() {

            this.nomoreflag = false
            if (this.value1 === '1') {

                this.addSearchFromUser()
            } else if (this.value1 === '2') {

                this.addSearchFromAll()
            }
        },
        clearSearchResult() {

            this.searchAddRelatedModels = []
            this.nomore = ''

        },
        loadAddMore(e) {

            let that = this
            if (e.target.scrollHeight - e.target.clientHeight - e.target.scrollTop < 10 && this.nomore === '') { //到达底部100px时,加载新内容

                clearTimeout(this.timer);

                this.timer = setTimeout(() => {
                        that.searchAddModelPage += 1// 这里加载数据..


                        if (this.value1 === '1') {
                            that.addSearchFromUser()
                        } else if (this.value1 === '2') {
                            that.addSearchFromAll()
                        }


                    },
                    500)

            }


        },
        addSearchFromUser() {

            let data = {
                searchText: this.addModelsSearchText,
                page: this.searchAddModelPage,
                asc: false,
                pageSize: 5,
                userOid: this.useroid


            }
            let that = this
            this.loading = true
            if (this.nomore === '') {
                axios.get("/dataItem/searchDataByUserId/", {
                    params: data
                })
                    .then((res) => {

                        if (res.status === 200) {
                            if (res.data.data.content.length === 0) {
                                that.nomore = "nomore"
                                that.loading = false
                            } else {
                                that.loading = false
                                that.searchAddRelatedModels = that.searchAddRelatedModels.concat(res.data.data.content)
                            }

                        }


                    })
            }


        },
        addSearchFromAll() {


            let arr = []
            arr.push(this.addModelsSearchText)
            let data = {
                page: this.searchAddModelPage,
                asc: 1,
                pageSize: 5,
                searchContent: arr

            }


            let that = this
            this.loading = true
            //searchFromAll
            axios.post("/dataItem/searchFromAll", data)
                .then((res) => {

                    if (res.status === 200) {

                        that.loading = false
                        that.searchAddRelatedModels = that.searchAddRelatedModels.concat(res.data.data.content)
                    }


                })

        },
        selectRelatedModel(item, e) {

            if (this.selectedModels.indexOf(item.name) > -1) {
                e.currentTarget.className = "is-hover-shadow models_margin_style"

                this.getRidOf(item.name, this.selectedModels)
                this.getRidOf(item.id, this.selectedModelsOid)
            } else {
                e.currentTarget.className = "is-hover-shadow models_margin_style selectedModels"

                this.selectedModels.push(item.name)
                this.selectedModelsOid.push(item.id)
            }


        },
        getRidOf(e, arr) {
            arr.splice(arr.indexOf(e), 1)
        },
        relatedToCurrentData() {

            if (this.selectedModelsOid.length === 0) {
                alert("pleasa select model first!")
            } else {

                let curentId = document.location.href.split("/");

                let dataItemFindDTO = {
                    dataId: curentId[curentId.length - 1],
                    relatedModels: this.selectedModelsOid
                }

                axios.post("/dataItem/data", dataItemFindDTO)


                    .then((res) => {
                        if (res.status === 200) {
                            alert("Cgts,related models successfully!")

                        }

                    })


            }

        },


        showRelatedModels() {
            this.dataNums = 5
            this.searchAddRelatedModels = []
            this.searchRelatedModelsDialogVisible = true
            relatedModelsSearchText = ""
            this.RelatedModels(this.dataNums)


        },
        searchFromRelatedModels() {
            //todo search from show related models
        },
        //函数节流防抖
        loadMore(e) {

            if (!this.nomoreflag) {
                if (e.target.scrollHeight - e.target.clientHeight - e.target.scrollTop < 10) { //到达底部100px时,加载新内容

                    clearTimeout(this.timer);

                    this.timer = setTimeout(() => {
                            this.dataNums += 5// 这里加载数据..
                            this.RelatedModels(this.dataNums)
                        },
                        500)

                }
            }

        },

        RelatedModels(more) {
            let curentId = document.location.href.split("/");
            let that = this
            this.loading = true
            this.nomore = false
            axios.get("/dataItem/allrelateddata", {
                params: {
                    id: curentId[curentId.length - 1],
                    more: more
                }
            })
                .then((res) => {
                    if (res.status == 200) {
                        that.loading = false
                        //todo 传回来数组为空时
                        if (res.data.data[0].all === "all") {
                            that.nomore = "no more"
                            that.nomore = true
                            that.loading = false

                        } else {
                            that.allRelatedModels = that.allRelatedModels.concat(res.data.data)
                            that.loading = false
                        }

                    }

                })
        },

        //relate search
        search() {
            var data = {
                asc: this.pageOption.sortAsc,
                page: this.pageOption.currentPage-1,
                pageSize: this.pageOption.pageSize,
                searchText: this.relateSearch,
                sortType: "default",
                classifications: ["all"],
            };
            let url, contentType;
            switch (this.relateType) {
                case "dataItem":
                    url = "/dataItem/searchByNameAndAuthor";
                    data = {
                        page: this.pageOption.currentPage,
                        pageSize: 6,
                        asc: true,
                        classifications: [],
                        category: '',
                        searchText: this.relateSearch
                    }
                    data = JSON.stringify(data);
                    contentType = "application/json";
                    break;
                case "concept":
                    url = this.relateSearch.trim() == "" ? "/repository/getConceptList" : "/repository/searchConcept";
                    data.asc = data.asc == true ? 0 : 1;
                    data = JSON.stringify(data);
                    contentType = "application/json";
                    break;
                case "spatialReference":
                    url = this.relateSearch.trim() == "" ? "/repository/getSpatialReferenceList" : "/repository/searchSpatialReference";
                    data.asc = data.asc == true ? 0 : 1;
                    data = JSON.stringify(data);
                    contentType = "application/json";
                    break;
                case "template":
                    url = this.relateSearch.trim() == "" ? "/repository/getTemplateList" : "/repository/searchTemplate";
                    data.asc = data.asc == true ? 0 : 1;
                    data = JSON.stringify(data);
                    contentType = "application/json";
                    break;
                case "unit":
                    url = this.relateSearch.trim() == "" ? "/repository/getUnitList" : "/repository/searchUnit";
                    data.asc = data.asc == true ? 0 : 1;
                    data = JSON.stringify(data);
                    contentType = "application/json";
                    break;
                default:
                    url = "/" + this.relateType + "/listByAuthor";
                    contentType = "application/x-www-form-urlencoded";
            }
            $.ajax({
                type: "POST",
                url: url,
                data: data,
                async: true,
                contentType: contentType,
                success: (json) => {
                    if (json.code == 0) {
                        let data = json.data;
                        console.log(data)

                        this.pageOption.total = data.total;
                        this.pageOption.pages = data.pages;
                        this.pageOption.searchResult = data.list;
                        this.pageOption.users = data.users;
                        this.pageOption.progressBar = false;
                        this.pageOption.paginationShow = true;

                    }
                    else {
                        console.log("query error!")
                    }
                }
            })
        },

        getRelation() {
            //从地址栏拿到oid
            let arr = window.location.href.split("/");
            let oid = arr[arr.length - 1].split("#")[0];
            let data = {
                oid: oid,
                type: this.relateType
            };
            $.ajax({
                type: "GET",
                url: "/modelItem/getRelation",
                data: data,
                async: true,
                success: (json) => {
                    if (json.code == 0) {
                        let data = json.data;
                        console.log(data)

                        this.tableData = data;

                    }
                    else {
                        console.log("query error!")
                    }
                }
            })
        },

        handlePageChange(val) {

            this.pageOption.currentPage = val;

            this.search();
        },

        handleDelete(index, row) {
            console.log(index, row);
            let table = new Array();
            for (i = 0; i < this.tableData.length; i++) {
                table.push(this.tableData[i]);
            }
            table.splice(index, 1);
            this.tableData = table;

        },

        handleEdit(index, row) {
            console.log(row);
            let flag = false;
            for (i = 0; i < this.tableData.length; i++) {
                let tableRow = this.tableData[i];
                if (tableRow.oid == row.oid) {
                    flag = true;
                    break;
                }
            }
            if (!flag) {
                this.tableData.push(row);
            }
        },

        confirm() {
            //从地址栏拿到oid
            let arr = window.location.href.split("/");
            let oid = arr[arr.length - 1].split("#")[0];

            let relateArr = [];
            this.tableData.forEach(function (item, index) {
                relateArr.push(item.oid);
            })
            if (relateArr.length == 0) {
                relateArr.push(null);
            }

            var data = {
                oid: oid,
                type: this.relateType,
                relations: relateArr
            };

            $.ajax({
                type: "POST",
                url: "/modelItem/setRelation",
                data: data,
                async: true,
                success: (json) => {
                    alert("Success!");
                    this.dialogTableVisible = false;
                    window.location.reload();
                },
                error: (json) => {
                    alert("Error!")
                }
            })
        },

        handleClose(done) {
            this.$confirm('Are you sure to close？')
                .then(_ => {
                    done();
                })
                .catch(_ => {
                });
        },

        addRelation(order) {
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
                    data = JSON.parse(data);
                    if (data.oid == "") {
                        alert("Please login first");
                        this.setSession("history", window.location.href);
                        window.location.href = "/user/login";
                    }
                    else {
                        switch (order) {
                            case 1:
                                this.relateType = "modelItem";
                                this.relateTitle = "Add Related Model Item"
                                break;
                            case 2:
                                this.relateType = "conceptualModel";
                                this.relateTitle = "Add Related Conceptual Model"
                                break;
                            case 3:
                                this.relateType = "logicalModel";
                                this.relateTitle = "Add Related Logical Model"
                                break;
                            case 4:
                                this.relateType = "computableModel";
                                this.relateTitle = "Add Related Computable Model"
                                break;
                            case 5:
                                this.relateType = "concept";
                                this.relateTitle = "Add Related Concept & Semantic"
                                break;
                            case 6:
                                this.relateType = "spatialReference";
                                this.relateTitle = "Add Related Spatial Reference"
                                break;
                            case 7:
                                this.relateType = "template";
                                this.relateTitle = "Add Related Data Template"
                                break;
                            case 8:
                                this.relateType = "unit";
                                this.relateTitle = "Add Related Unit & Metric"
                                break;
                            case 9:
                                this.relateType = "dataItem";
                                this.relateTitle = "Add Related Data Item";
                                break;
                        }
                        this.tableData = [];
                        this.pageOption.currentPage = 1;
                        this.pageOption.searchResult = [];
                        this.relateSearch = "";
                        this.getRelation();
                        this.search();
                        this.dialogTableVisible = true;
                    }
                }
            })

        },
    },
    mounted() {
        this.setSession("history", window.location.href);

        let currenturl = window.location.href;
        let dataitemid = currenturl.split("/");

        let that = this
        axios.get("/dataItem/briefrelateddata", {
            params: {
                id: dataitemid[dataitemid.length - 1]
            }
        })
            .then((res) => {
                that.related3Models = res.data.data

                if (that.related3Models.length === 0) {
                    that.relatedModelIsNull = true;
                    that.relatedModelNotNull = false
                } else {
                    that.relatedModelNotNull = true
                    that.relatedModelIsNull = false;
                }
            })

        axios.get("/user/load")
            .then((res) => {
                if (res.status == 200) {
                    if (res.data.oid != '') {
                        this.useroid = res.data.oid;
                        this.userUid = res.data.uid;
                        this.userImg = res.data.image;
                    }

                }
            })

        this.getComments();

        $(document).on('mouseover mouseout','.flexRowSpaceBetween',function(e){

            let deleteBtn=$(e.currentTarget).children().eq(1).children(".delete");
            if(deleteBtn.css("display")=="none"){
                deleteBtn.css("display","block");
            }else{
                deleteBtn.css("display","none");
            }

        });
        //
        // $(document).on("click", ".detail-toggle", function () {
        //     if ($(this).text() == "[Collapse]") {
        //         $(this).text("[Expand]");
        //     }
        //     else {
        //         $(this).text("[Collapse]")
        //     }
        //
        // })

        $('html, body').animate({scrollTop: 0}, 'slow');

        let descHeight = $("#description .block_content").height();
        if (descHeight > 300) {
            $("#description .block_content").css("overflow", "hidden")
            $("#description .block_content").css("height", "250px")

            $(".fullPaper").removeClass("hide");
        }

        let refs = $("#ref").val();
        if (refs != null) {
            let json = JSON.parse(refs);
            for (i = 0; i < json.length; i++) {
                json[i].author = json[i].author.join(", ");
            }
            console.log(json);
            this.refTableData = json;
        }

        $("#fullPaper").click(function () {
            $("#description .block_content").css("overflow", "inherit");
            $("#description .block_content").css("height", "auto");
            $(".fullPaper").remove();
        })

        let qrcodes = document.getElementsByClassName("qrcode");
        for(i=0;i<qrcodes.length;i++) {
            new QRCode(document.getElementsByClassName("qrcode")[i], {
                text: window.location.href,
                width: 200,
                height: 200,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H
            });
        }

    }
})

$(function () {

    $(".ab").click(function () {

            if (!$(this).hasClass('transform180'))
                $(this).addClass('transform180')
            else
                $(this).removeClass('transform180')
        }
    );

})