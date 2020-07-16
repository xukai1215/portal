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
            classifications1: ["YMFP5H5N6LEPZS7VT99PBD4JYSK87BA4"],
            classifications2: ["YMFP5H5N6LEPZS7VT99PBD4JYSK87BA4"],

            currentClass: "Basic Unit",

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

            treeData: [{
                id: 1,
                label: 'Unit Resource Library',
                oid: '9F3DT5JNHCMYC3REE6G5PE7P9J3QKKJW',
                children: [{
                    id: 100,
                    label: 'Basic Unit',
                    oid: 'YMFP5H5N6LEPZS7VT99PBD4JYSK87BA4'
                }, {
                    label: 'Derivative Unit',
                    oid: 'THTE2JXKCMD5Y7UZJH3Y84WLJWQCYWHV'
                }, {
                    label: 'Combinatorial Unit',
                    oid: 'CBVHYTVBBQDQZZLTYLQQACVQM8V5TMMF'
                }]
            }, {
                id: 2,
                label: 'Dimensional Resource Library',
                oid: '6H9YJU4Y58V9CAXDAXM7ULFAJ54R8SEA',
                children: [{
                    label: 'Base Dimension',
                    oid: 'HPWH63NTXKA8V8YNJKHJCW5EPF3XPVB9'
                }, {
                    label: 'Composite Dimension',
                    oid: 'G4HFPHPEPP3B2MNK46VQS3JLLHTQZQ64'
                }]
            }
            ],
            defaultProps: {
                children: 'children',
                label: 'label'
            }
        }
    },
    methods: {
        contribute(){
            $.ajax({
                url: '/user/load',
                type: 'get',
                // data对象中的属性名要和服务端控制器的参数名一致 login(name, password)
                // dataType : 'json',
                success: function (result) {
                    var json = JSON.parse(result);
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
            query.sortType= this.pageOption.sortType;
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