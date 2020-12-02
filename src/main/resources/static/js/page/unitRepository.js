new Vue({
    el: '#app',
    components: {
        'avatar': VueAvatar.Avatar
    },
    data: function () {
        return {
            activeIndex:'8-4',
            queryType: 'normal',
            searchText: '',
            classifications1: ["9a8680fe-ffd6-4e5a-959b-d0f157506cd3"],
            classifications2: ["9a8680fe-ffd6-4e5a-959b-d0f157506cd3"],

            currentClass: "Unit & Metric",

            pageOption: {
                paginationShow:false,
                progressBar: true,
                sortAsc: false,
                currentPage: 1,
                pageSize: 10,
                sortType: "default",
                total: 0,
                searchResult: [],
            },
            //
            // treeData: [
            //     {
            //     id: 1,
            //     label: 'Unit Resource Library',
            //     oid: '9F3DT5JNHCMYC3REE6G5PE7P9J3QKKJW',
            //     children: [{
            //         id: 100,
            //         label: 'Basic Unit',
            //         oid: 'YMFP5H5N6LEPZS7VT99PBD4JYSK87BA4'
            //     }, {
            //         label: 'Derivative Unit',
            //         oid: 'THTE2JXKCMD5Y7UZJH3Y84WLJWQCYWHV'
            //     }, {
            //         label: 'Combinatorial Unit',
            //         oid: 'CBVHYTVBBQDQZZLTYLQQACVQM8V5TMMF'
            //     }]
            // }, {
            //     id: 2,
            //     label: 'Dimensional Resource Library',
            //     oid: '6H9YJU4Y58V9CAXDAXM7ULFAJ54R8SEA',
            //     children: [{
            //         label: 'Base Dimension',
            //         oid: 'HPWH63NTXKA8V8YNJKHJCW5EPF3XPVB9'
            //     }, {
            //         label: 'Composite Dimension',
            //         oid: 'G4HFPHPEPP3B2MNK46VQS3JLLHTQZQ64'
            //     }]
            // }
            // ],

            treeData: [
                {
                    id: 1,
                    label: 'Unit & Metric',
                    oid: '9a8680fe-ffd6-4e5a-959b-d0f157506cd3',
                    children: [{
                        id: 2,
                        label: 'Acoustics',
                        oid: '58d45317-6dfa-4615-94a7-b0549125e2b0'
                    }, {
                        id: 3,
                        label: 'Atomic',
                        oid: '143787c5-d011-468b-b319-66e9c941707b'
                    }, {
                        id: 4,
                        label: 'Electricity',
                        oid: 'eaa28ef2-1cf2-4d8e-bfb1-fa51f8658be2'
                    }, {
                        id: 5,
                        label: 'Heat',
                        oid: 'f82fcaa2-abde-4e85-8dd5-4e23270f8c60'
                    }, {
                        id: 6,
                        label: 'Light',
                        oid: '4c8f27b7-7f14-451b-907f-a7cf2eebd6f0'
                    }, {
                        id: 7,
                        label: 'Mechanics',
                        oid: '5fbe2a8f-64ac-4dd9-806b-b2a8166e1522'
                    }, {
                        id: 8,
                        label: 'Nuclear',
                        oid: 'f6710cbd-3158-49c0-994a-ef64c909c10e'
                    }, {
                        id: 9,
                        label: 'Periodic',
                        oid: '783bc5ce-55c5-48b0-ba5c-2313afac675a'
                    }, {
                        id: 10,
                        label: 'Physical',
                        oid: '6dad7da1-6b16-4851-994f-54a5a1153dfa'
                    }, {
                        id: 11,
                        label: 'Solid',
                        oid: 'e5c598d0-5a89-4ee5-9c91-3c78fc26d084'
                    }, {
                        id: 12,
                        label: 'Time',
                        oid: '3a1c1a4f-af6c-47d8-8c6e-d29c33472b2f'
                    }]
                }
            ],
            defaultProps: {
                children: 'children',
                label: 'label'
            },

            sortTypeName:"View Count",
            sortFieldName:"viewCount",
            sortOrder:"desc.",
        }
    },
    methods: {
        changeSortField(ele){
            this.sortTypeName = ele;
            let field = ele.replace(" ","").replace(ele[0],ele[0].toLowerCase());
            this.sortFieldName = field;
            this.getModels();
        },

        changeSortOrder(ele){
            this.sortOrder=ele;

            this.pageOption.sortAsc = ele==="asc.";

            this.getModels();
        },
        contribute(){
            $.ajax({
                url: '/user/load',
                type: 'get',
                // data对象中的属性名要和服务端控制器的参数名一致 login(name, password)
                // dataType : 'json',
                success: function (result) {
                    var json = result;
                    if (json.oid != '') {
                        window.location.href="/user/userSpace#/community/createUnit";
                    }
                    else{
                        window.location.href="/user/login";
                    }
                },
                error: function (e) {
                    alert("load user error");
                }
            });
        },
        search() {
            this.pageOption.currentPage = 1;
            this.getModels();
        },
        //页码change
        handlePageChange(val) {

            this.pageOption.currentPage = val;

            window.scrollTo(0, 0);
            this.getModels();
        },
        handleCurrentChange(data, checked, indeterminate) {
            // this.pageOption.searchResult=[];
            this.pageOption.total=0;
            this.pageOption.paginationShow=false;
            this.currentClass=data.label;
            let classes = [];
            classes.push(data.oid);
            this.classifications1 = classes;
            this.getChildren(data.children)
            this.pageOption.currentPage=1;
            this.searchText="";
            this.getModels();
        },
        getChildren(children) {
            if (children != null) {
                for (let i = 0; i < children.length; i++) {
                    let child = children[i];
                    this.classifications1.push(child.oid);
                    this.getChildren(child.children);
                }
            }
        },
        handleCheckChange(data, checked, indeterminate) {
            // this.pageOption.searchResult=[];
            this.pageOption.paginationShow=false;
            let checkedNodes = this.$refs.tree2.getCheckedNodes()
            let classes = [];
            for (let i = 0; i < checkedNodes.length; i++) {
                classes.push(checkedNodes[i].oid);
            }
            this.classifications2 = classes;
            console.log(this.classifications2);
            this.pageOption.currentPage=1;
            this.getModels();
        },
        getModels() {
            this.pageOption.progressBar = true;
            var data = {
                asc: this.pageOption.sortAsc,
                page: this.pageOption.currentPage - 1,
                pageSize: this.pageOption.pageSize,
                searchText : this.searchText,
                classifications : this.classifications1.length == 0 ? ["all"] : this.classifications1

            };
            this.Query(data, this.queryType);
        },
        Query(data, type) {
            let query={ };
            query.oid=data.classifications[0];
            query.page=data.page;
            query.sortField=this.sortFieldName;
            if(data.asc){
                query.asc= 1;
            }else{
                query.asc = 0;
            }
            query.searchText=data.searchText;

            let url="";
            if(query.searchText.trim()==""){
                url="/repository/getUnitList";
            }
            else{
                url="/repository/searchUnit";
                this.classifications1=[""];
                this.currentClass="ALL";
                this.$refs.tree1.setCurrentKey(null);
            }

            let sendDate = (new Date()).getTime();
            $.ajax({
                type: "POST",
                url: url,
                data: JSON.stringify(query),
                async: true,
                contentType: "application/json",
                success: (json) => {
                    if (json.code == 0) {
                        let data = json.data;
                        let receiveDate = (new Date()).getTime();
                        let responseTimeMs = receiveDate - sendDate;
                        let timeoutTime=0;
                        console.log(responseTimeMs)
                        if(responseTimeMs<450){
                            timeoutTime=450-responseTimeMs;
                        }
                        setTimeout(() => {
                            this.pageOption.total = data.total;
                            // this.pageOption.pages = data.pages;
                            this.pageOption.searchResult = data.list;
                            this.pageOption.users = data.users;
                            this.pageOption.progressBar = false;
                            this.pageOption.paginationShow=true;
                        }, timeoutTime);
                    }
                    else {
                        console.log("query error!")
                    }
                }
            })
        },


    },
    mounted() {

        //展开分类树第一层
        $(".el-tree-node__expand-icon").eq(0).click();

        this.getModels();

        //expend
        $("#expend").click(() => {
            this.queryType = "advanced";
            $(".searcherPanel").css("display", "none");
            $(".advancedSearch").css("display", "block");
            $("#tree1").css("display", "none");
            $("#tree2").css("display", "block");
            this.getModels();
        })
        $("#drawback").click(() => {
            this.queryType = "normal";
            $(".searcherPanel").css("display", "block");
            $(".advancedSearch").css("display", "none");
            $("#tree2").css("display", "none");
            $("#tree1").css("display", "block");
            this.getModels();
        })

        //field select
        $(document).on("click", ".propName", function () {
            var downArrow = "<span class=\"caret\"></span>";
            $(this).parents(".input-group-btn").children("button").html($(this).text() + downArrow);
        })

        //add
        $(".fa-plus").click(function () {

            var field;
            var lineCount = $(".lines").children(".line").length;
            switch (lineCount) {
                case 1:
                    field = "Keyword";
                    break;
                case 2:
                    field = "Overview";
                    break;
                case 3:
                    field = "Description";
                    break;
                case 4:
                    field = "Provider";
                    break;
                case 5:
                    field = "Reference";
                    break;
            }

            var line = "<div class=\"line\">\n" +
                "                                <div class=\"input-group col-md-1 pull-left\">\n" +
                "                                    <select class=\"form-control connect\">\n" +
                "                                        <option>AND</option>\n" +
                "                                        <option>OR</option>\n" +
                "                                        <option>NOT</option>\n" +
                "                                    </select>\n" +
                "                                </div>\n" +
                "                                <div class=\"input-group col-md-5 pull-left\">\n" +
                "                                    <div class=\"input-group-btn\">\n" +
                "                                        <button type=\"button\" class=\"btn btn-default dropdown-toggle prop\"\n" +
                "                                                data-toggle=\"dropdown\">" + field + "<span class=\"caret\"></span></button>\n" +
                "                                        <ul class=\"dropdown-menu\">\n" +
                "                                            <li><a class=\"propName\" href=\"javascript:void(0);\">Model Name</a></li>\n" +
                "                                            <li><a class=\"propName\" href=\"javascript:void(0);\">Keyword</a></li>\n" +
                "                                            <li><a class=\"propName\" href=\"javascript:void(0);\">Overview</a></li>\n" +
                "                                            <li><a class=\"propName\" href=\"javascript:void(0);\">Description</a></li>\n" +
                "                                            <li><a class=\"propName\" href=\"javascript:void(0);\">Provider</a></li>\n" +
                "                                            <li><a class=\"propName\" href=\"javascript:void(0);\">Reference</a></li>\n" +
                "                                        </ul>\n" +
                "                                    </div>\n" +
                "                                    <input type=\"text\" class=\"form-control value\">\n" +
                "                                </div>\n" +
                "                                <div class=\"input-group col-md-1 pull-left\">\n" +
                "                                    <select class=\"form-control connect\">\n" +
                "                                        <option>AND</option>\n" +
                "                                        <option>OR</option>\n" +
                "                                        <option>NOT</option>\n" +
                "                                    </select>\n" +
                "                                </div>\n" +
                "                                <div class=\"input-group col-md-5 pull-left\">\n" +
                // "                                    <div class=\"input-group-btn\">\n" +
                // "                                        <button type=\"button\" class=\"btn btn-default dropdown-toggle prop\"\n" +
                // "                                                data-toggle=\"dropdown\">\n" +
                // "                                            "+field+"<span class=\"caret\"></span></button>\n" +
                // "                                        <ul class=\"dropdown-menu\">\n" +
                // "                                            <li><a class=\"propName\" href=\"javascript:void(0);\">Model Name</a></li>\n" +
                // "                                            <li><a class=\"propName\" href=\"javascript:void(0);\">Keyword</a></li>\n" +
                // "                                            <li><a class=\"propName\" href=\"javascript:void(0);\">Overview</a></li>\n" +
                // "                                            <li><a class=\"propName\" href=\"javascript:void(0);\">Description</a></li>\n" +
                // "                                            <li><a class=\"propName\" href=\"javascript:void(0);\">Provider</a></li>\n" +
                // "                                            <li><a class=\"propName\" href=\"javascript:void(0);\">Reference</a></li>\n" +
                // "                                        </ul>\n" +
                // "                                    </div>\n" +
                "                                    <input type=\"text\" class=\"form-control value\">\n" +
                "                                </div>\n" +
                "                            </div>";

            if (lineCount <= 5) {
                $(".lines").append(line)
            }
        })
        //delete
        $(".fa-minus").click(function () {
            var lines = $(".lines").children(".line");
            if (lines.length > 1) {
                lines.eq(lines.length - 1).remove();
            }
        })
    }
})