var createDataHubs = Vue.extend({
    template: "#createDataHubs",
    data() {
        return {

            defaultActive: '2-1',
            curIndex: 3,

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

            classif: [],
            active: 0,
            categoryTree: [],
            ctegorys: [],

            data_img: [],
            itemInfo: {
                image: '',
            },
            dataItemAddDTO: {
                id:"",
                name: '',
                status: 'Public',
                description: '',
                detail: '',
                author: '',
                reference: '',
                dataType:"Url",//默认Url
                keywords: [],
                classifications: [],
                displays: [],
                uploadImage:"",
                authorship: [],
                meta: {
                    coordinateSystem: '',
                    geographicProjection: '',
                    coordinateUnits: '',
                    boundingRectangle: []
                },
                viewCount:0,


            },

            treeData: [{
                id: 1,
                label: 'All Folder',
                children: [{
                    id: 4,
                    label: '二级 1-1',
                    children: [{
                        id: 9,
                        label: '三级 1-1-1'
                    }, {
                        id: 10,
                        label: '三级 1-1-2'
                    }]
                }]
            }],
            treeData_part1: [
                {
                    "children": [{
                        "children": [{
                            "id": 2,
                            "label": "Land regions",
                            "oid": "5f3e42070e989714e8364e9a",
                            "desc": "Models that mainly related to land regions, includes hydrology, hydrodynamics, soil, landform, terrestrial ecosystem etc.",
                        }, {"id": 3, "label": "Ocean regions", "oid": "5f3e422a0e989714e8364e9c",
                            "desc": "Models that mainly related to ocean regions, includes coastal, seawater, sea-ice, marine ecosystem etc.",
                        }, {
                            "id": 4,
                            "label": "Frozen regions",
                            "oid": "5f3e42360e989714e8364e9e",
                            "desc": "Models that mainly related to frozen regions, includes galicer, permafrost, snow etc.",
                        }, {"id": 5, "label": "Atmospheric regions", "oid": "5f3e42400e989714e8364ea0",
                            "desc": "Models that mainly related to atmospheric regions, includes climate, weather, air etc.",
                        }, {
                            "id": 6,
                            "label": "Space-earth regions",
                            "oid": "5f3e424c0e989714e8364ea2",
                            "desc": "Models that mainly related to space-earth regions, includes sun-earth, planets etc.",

                        }, {"id": 7, "label": "Solid-earth regions", "oid":"5f3e42550e989714e8364ea4",
                            "desc": "Models that mainly related to solid-earth regions, includes lithosphere, mantle, earthquack etc.",
                        }
                        ], "id": 1, "label": "Natural-perspective", "oid": "5f3e41680e989714e8364e92",
                        "desc": "Models that mainly related to physical geography.",

                    }, {
                        "children": [{
                            "id": 10,
                            "label": "Development activities",
                            "oid": "5f3e42780e989714e8364ea8",
                            "desc": "Models that mainly related to development activities, includes continents, countries, cities, administrative zones etc.",
                        }, {"id": 11, "label": "Social activities", "oid": "5f3e42830e989714e8364eaa",
                            "desc": "Models that mainly related to social activities, includes urban, rural, cultural area, travel area, built-up area, indoor area etc.",}, {
                            "id": 12,
                            "label": "Economic activities",
                            "oid": "5f3e428c0e989714e8364eac",
                            "desc": "Models that mainly related to economic activities, includes agriculture, industry, tourism, trasport, energy, markets etc.",
                        }],
                        "id": 9,
                        "label": "Human-perspective",
                        "oid": "5f3e41940e989714e8364e94",
                        "desc": "Models that mainly related to human geography.",
                    }, {
                        "id": 30,
                        "label": "Integrated-perspective",
                        "oid": "5f6c1dcbefdc24a7fc52543d",
                        "desc": "Models that integrate many different models.",
                        "children": [{
                            "id": 31,
                            "label": "Global scale",
                            "oid": "5f6c424eefdc249e286947b8",
                            "desc": "Integrated models that apply in global scale.",
                        }, {
                            "id": 32,
                            "label": "Regional scale",
                            "oid": "5f6c42d2efdc249dc47f4665",
                            "desc": "Integrated models that apply in regional scale.",

                        }]
                    }],
                    "id": 24,
                    "label": "Application-focused categories",
                    "oid": "5f3e403f0e98974dd874df62",
                    "desc": "Models that apply in one or more field.",
                },
            ],
            treeData_part2: [
                {"children": [{
                        "children": [{
                            "id": 15,
                            "label": "Geoinformation analysis",
                            "oid": "5f3e42ac0e989714e8364eb0",
                            "desc": "Models that mainly related to geoinformation analysis, includes vector analysis, raster analysis, network analysis, topology analysis etc.",
                        }, {
                            "id": 16,
                            "label": "Remote sensing analysis",
                            "oid": "5f3e42b40e989714e8364eb2",
                            "desc": "Models that mainly related to remote sensing analysis, includes imagery analysis, spectrum analysis etc.",
                        }, {
                            "id": 17,
                            "label": "Geostatistical analysis",
                            "oid": "5f3e42bc0e989714e8364eb4",
                            "desc": "Models that mainly related to geostatistical analysis, includes pattern detection, relation detection, clustering, interpolation etc.",
                        }, {
                            "id": 18,
                            "label": "Intelligent computation analysis",
                            "oid": "5f3e42c30e989714e8364eb6",
                            "desc": "Models that mainly related to intelligent computation analysis, includes machine learning, deep learning etc.",
                        }],
                        "id": 14,
                        "label": "Data-perspective",
                        "oid": "5f3e41d20e989714e8364e96",
                        "desc": "Models that mainly related to data process.",
                    }, {
                        "children": [{
                            "id": 20,
                            "label": "Physical process calculation",
                            "oid": "5f3e42d40e989714e8364eb8",
                            "desc": "Models that mainly related to physical process calculation, includes CFD, acoustic simulation, light simulation etc.",
                        }, {
                            "id": 21,
                            "label": "Chemical process calculation",
                            "oid": "5f3e42dc0e989714e8364eba",
                            "desc": "Models that mainly related to chemical process calculation, includes insecticide, photosynthesis, combustion etc.",
                        }, {
                            "id": 22,
                            "label": "Biological process calculation",
                            "oid": "5f3e42e30e989714e8364ebc",
                            "desc": "Models that mainly related to biological process calculation, includes genome, metabolic, cellular simulation etc.",
                        }, {
                            "id": 23,
                            "label": "Human-activity calculation",
                            "oid": "5f3e42ec0e989714e8364ebe",
                            "desc": "Models that mainly related to human-activity calculation, includes monte carlo, CA, agent-based, travel, crime, disease, migration, health etc.",
                        }],
                        "id": 19,
                        "label": "Process-perspective",
                        "oid": "5f3e41e80e989714e8364e98",
                        "desc": "Models that mainly related to process.",
                    }], "id": 25, "label": "Method-focused categories", "oid": "5f3e40810e98974dd874df64",
                    "desc": "Models that mainly related to method.",
                }],
            treeData_select:[],
            curClassDesc: {
                label:'',
                desc:"Move your mouse to a classification to learn more."
            },
            currentLocalization: {
                localCode: "",
                localName: "",
                name: "",
                description: "",
            },

            defaultProps: {
                children: 'children',
                label: 'label'
            },
            cls: [],//分类的id队列
            clsStr: '',//分类的label队列

            selectedFile:[],
            userDataList:[],
            authorDataList:[],
            dialogVisible: false,
            fileSelect:"",
            // dataType:"Url",//默认Url
            id:"",
            imageExist:false,
        }
    },
    methods: {
        changeRter(index){
            this.curIndex = index;
            var urls={
                1:'/user/userSpace',
                2:'/user/userSpace/model',
                3:'/user/userSpace/data',
                4:'/user/userSpace/server',
                5:'/user/userSpace/task',
                6:'/user/userSpace/community',
                7:'/user/userSpace/theme',
                8:'/user/userSpace/account',
                9:'/user/userSpace/feedback',
            }

            this.setSession('curIndex',index)
            window.location.href=urls[index]

        },

        // handleSelect(index,indexPath){
        //     this.setSession("index",index);
        //     window.location.href="/user/userSpace"
        // },
        // handleCheckChange(data, checked, indeterminate) {
        //     let checkedNodes = this.$refs.tree2.getCheckedNodes()
        //     let classes = [];
        //     let str='';
        //     for (let i = 0; i < checkedNodes.length; i++) {
        //         // console.log(checkedNodes[i].children)
        //         if(checkedNodes[i].children!=undefined){
        //             continue;
        //         }
        //
        //         classes.push(checkedNodes[i].id);
        //         str+=checkedNodes[i].label;
        //         if(i!=checkedNodes.length-1){
        //             str+=", ";
        //         }
        //     }
        //     this.cls=classes;
        //     this.clsStr=str;
        //
        // },
        handleCheckChange(data, checked, indeterminante){
            // console.log(data, checked, indeterminante)
            if(data.children == null) {
                let checkedNodes1 = this.$refs.tree2.getCheckedNodes(false, true);
                let checkedNodes2 = this.$refs.tree3.getCheckedNodes(false, true);

                this.treeData_select = [];
                for (i = 0; i < checkedNodes1.length; i++) {
                    let node = checkedNodes1[i];
                    if (node.children == undefined) {
                        this.treeData_select.push(node);
                    }
                }

                for (i = 0; i < checkedNodes2.length; i++) {
                    let node = checkedNodes2[i];
                    if (node.children == undefined) {
                        this.treeData_select.push(node);
                    }
                }

                console.log($("#tree_select .el-tree-node"))
                $("#tree_select").on("mouseenter",".el-tree-node",(event)=>{
                    console.log(event)
                    let name = event.currentTarget.innerText
                    let desc = this.getClassificationDesc(name)
                    console.log(desc);
                    this.curClassDesc = desc;
                })
            }

        },
        getClassificationDesc(name){
            let children = this.treeData_part1;
            let desc = this.getChildrenDesc(children,name);
            if(desc == null){
                children = this.treeData_part2;
                desc = this.getChildrenDesc(children,name);
            }
            return desc;
        },
        getChildrenDesc(children, name){
            let i = 0;
            for(;i<children.length;i++){
                let child = children[i];
                if(child.label==name){
                    return {
                        label:child.label,
                        desc:child.desc
                    };
                }else{
                    if(child.children!=undefined){
                        let result = this.getChildrenDesc(child.children, name);
                        if(result != null){
                            return result;
                        }
                    }
                }
            }
            return null;

        },

        changeOpen(n) {
            this.activeIndex = n;
        },
        setSession(name, value) {
            window.sessionStorage.setItem(name, value);
        },


        getDataItems() {
            this.pageSize = 10;
            this.isInSearch = 0;
            var da = {
                userOid: this.userId,
                page: this.page,
                pagesize: this.pageSize,
                asc: -1
            }

            this.loading = true
            var that = this;
            //todo 从后台拿到用户创建的data—item
            axios.get("/user/getDataItems", {
                params: da
            }).then(res => {

                this.searchResult = res.data.data.content
                this.resourceLoad = false;
                this.totalNum = res.data.data.totalElements;
                if (this.page == 1) {
                    this.pageInit();
                }
                this.data_show = true
                this.loading = false

            })


        },

        //add data item
        createDataHubs() {
            this.dataItemAddDTO.name = $("#dataname").val();

            this.dataItemAddDTO.description = $("#description").val();
            // this.dataItemAddDTO.detail=$("#detail").val();
            var detail = tinyMCE.activeEditor.getContent();
            //正则表达匹配<img src="../
            var imgStr = new RegExp('<img src="../static');
            detail = detail.replace(imgStr,'<img src="../../static')

            this.dataItemAddDTO.detail = detail;
            //todo 获取作者信息
            // this.dataItemAddDTO.author=$("#author").val();
            this.dataItemAddDTO.keywords = $("#keywords").tagEditor('getTags')[0].tags;

            this.dataItemAddDTO.classifications = [];
            for(let i=0;i<this.treeData_select.length;++i){
                this.dataItemAddDTO.classifications.push(this.treeData_select[i].oid)
            }
            // this.dataItemAddDTO.displays.push($("#displays").val())
            this.dataItemAddDTO.displays = this.data_img;
            this.dataItemAddDTO.uploadImage = this.itemInfo.image;
            // let subStr = $('#imgShow').get(0).src.toString().substring(0,9);
            // console.log(subStr);
            // if(subStr === "data:imag"){
            //     this.imageExist = true;
            // }
            // if ()
            // if (this.imageExist!=false) {
            //     this.dataItemAddDTO.uploadImage = $('#imgShow').get(0).src;
            // }else {
            //     this.dataItemAddDTO.uploadImage = "";
            // }

            this.dataItemAddDTO.reference = $("#ResourcesUrlText").val();


            //用户名
            // this.dataItemAddDTO.author=this.userId;
            this.dataItemAddDTO.author = this.userId;

            this.dataItemAddDTO.meta.coordinateSystem = $("#coordinateSystem").val();
            this.dataItemAddDTO.meta.geographicProjection = $("#geographicProjection").val();
            this.dataItemAddDTO.meta.coordinateUnits = $("#coordinateUnits").val();

            this.dataItemAddDTO.meta.boundingRectangle = [];
            // this.dataItemAddDTO.dataType = this.dataType;


            var authorship = [];
            var author_lenth = $(".user-attr").length;
            for (var i = 0; i < author_lenth; i++) {

                let authorInfo = {
                    name: '',
                    email: '',
                    homepage: ''
                }
                console.log($(".user-attr input"))
                let t = 3 * i
                authorInfo.name = $(".user-attr input")[t].value
                authorInfo.email = $(".user-attr input")[1 + t].value
                authorInfo.homepage = $(".user-attr input")[2 + t].value
                authorship.push(authorInfo)

            }
            this.dataItemAddDTO.authorship = authorship;
            this.dataItemAddDTO.dataList = this.userDataList;


            var thedata = this.dataItemAddDTO;

            var that = this;
            if ((this.id === "0") || (this.id === "") || (this.id == null)) {
                axios.post("/dataItem/createHubs/", thedata)
                    .then(res => {
                        if (res.status === 200) {
                            //创建静态页面
                            axios.get("/dataItem/adddataitembyuser", {
                                params: {
                                    id: res.data.data.id
                                }
                            }).then(() => {

                            });
                            $(".prev").click();
                            $(".prev").click();
                            //清空
                            $("#classification").val('')
                            $("#dataname").val('');
                            $("#description").val('');
                            $("#keywords").tagEditor('removeAll');

                            $("#displays").val('');
                            $("#dataresoureurl").val("")
                            $("#coordinateSystem").val("");
                            $("#geographicProjection").val("")
                            $("#coordinateUnits").val("")
                            $("#upperleftx").val("")
                            $("#upperlefty").val("")
                            $("#bottomrightx").val("")
                            $("#bottomrighty").val("");
                            $("#imgFile").val("");
                            var categoryAddDTO = {
                                id: res.data.data.id,
                                cate: that.treeData_select,
                                tabType: "hubs"
                            };
                            axios.post('/dataItem/addcate', categoryAddDTO).then(res => {
                                // console.log(res)
                            });
                            //每次创建完条目后清空category内容
                            that.ctegorys = [];
                            //清空displays内容
                            that.data_img = [];
                            this.$confirm('<div style=\'font-size: 18px\'>Create data hubs successfully!</div>', 'Tip', {
                                dangerouslyUseHTMLString: true,
                                confirmButtonText: 'View',
                                cancelButtonText: 'Go Back',
                                cancelButtonClass: 'fontsize-15',
                                confirmButtonClass: 'fontsize-15',
                                type: 'success',
                                center: true,
                                showClose: false,
                            }).then(() => {
                                window.location.href = "/dataItem/hub/" + res.data.data.id;
                            }).catch(() => {
                                window.location.href = "/user/userSpace#/data/dataitem";
                            });
                        }
                    })
            }else {
                this.dataItemAddDTO.dataItemId = this.id;
                var thedata1 = this.dataItemAddDTO;
                axios.post("/dataItem/updateHubs/",thedata1)
                    .then(result=>{
                        if (result.status ===200){
                            if (result.data.code === 0) {
                                if(result.data.data.method==="update") {
                                    alert("Update Success");
                                    $("#editModal", parent.document).remove();
                                    window.location.href = "/dataItem/hub/" + result.data.data.oid;
                                }
                                else{
                                    alert("Success! Changes have been submitted, please wait for the author to review.");
                                    //产生信号调用计数，启用websocket

                                    window.location.href = "/user/userSpace";
                                }
                            }
                            else if(result.data.code==-2){
                                alert("Please login first!");
                                window.location.href="/user/login";
                            }
                            else{
                                alert(result.data.msg);
                            }
                        }
                    })
            }
        },

        next() {

        },
        change(currentIndex, newIndex, stepDirection) {
            console.log(currentIndex, newIndex, stepDirection)
        },

        sendcurIndexToParent(){
            this.$emit('com-sendcurindex',this.curIndex)
        },

        sendUserToParent(userId){
            this.$emit('com-senduserinfo',userId)
        },
        handleClose(done) {
            this.$confirm('Confirm to close?')
                .then(_ => {
                    done();
                })
                .catch(_ => {
                });
        },
        resClick(e){
            let path=e.path;
            for(i=0;i<path.length;i++){
                let obj=path[i];
                if(obj.className.indexOf("dataitemisol")!=-1){
                    $(".dataitemisol").css("border","1px solid #ebeef5");
                    this.fileSelect=obj.align;
                    obj.style.border='2px solid #60b0e8';
                    break;
                }
            }
        },

        selectDataspaceFile(file){
            if (this.selectedFile.indexOf(file) > -1) {
                for (var i = 0; i < this.selectedFile.length; i++) {
                    if (this.selectedFile[i] === file) {
                        //删除
                        this.selectedFile.splice(i, 1);
                        // this.downloadDataSetName.splice(i, 1)
                        break
                    }
                }
            } else {
                this.selectedFile.push(file);
            }
        },

        removeFile(){
            if(this.fileSelect!="") {
                $(".dataitemisol").css("border","1px solid #ebeef5");
                var file = this.selectedFile[this.fileSelect];
                this.selectDataspaceFile(file);

                this.$refs.userDataSpace.cancelSelect(file);
                // this.selectedFile.splice(Number(this.fileSelect), 1);
                this.fileSelect = "";
            }
        },
        imgFile() {
            $("#imgOne").click();
        },
        preImg() {
            var file = $('#imgOne').get(0).files[0];
            //创建用来读取此文件的对象
            var reader = new FileReader();
            //使用该对象读取file文件
            reader.readAsDataURL(file);
            //读取文件成功后执行的方法函数
            reader.onload =  (e) => {
                //读取成功后返回的一个参数e，整个的一个进度事件
                //选择所要显示图片的img，要赋值给img的src就是e中target下result里面
                //的base64编码格式的地址
                this.itemInfo.image = e.target.result
            }
        },
        deleteImg(){
            let obj = document.getElementById('imgOne')
            obj.value = ''
            this.$set(this.itemInfo,'image' , '')
            console.log(this.itemInfo.image)
        },
    },
    mounted() {
        //初始化的时候吧curIndex传给父组件，来控制bar的高亮显示
        this.sendcurIndexToParent();


        var tha = this;
        tha.id = this.$route.params.editId;

        this.classif = [];
        $("#classification").val('');

        axios.get("/dataItem/createTree")
            .then(res => {
                tha.tObj = res.data;
                let tree = [];
                for (let i in Object.values(tha.tObj)){
                    // console.log(grandpa);
                    let grandpa = Object.values(tha.tObj)[i];
                    // let grandpa = tha.tObj[i];
                    for (let j in Object.values(Object.values(grandpa))){
                        let father = Object.values(grandpa)[j];
                        let gChildren=[];
                        for (let k in Object.values((Object.values(father)))){
                            let son = Object.values(Object.values((father)[k]));
                            let sons = son[0];
                            let children = [];
                            for (let ii=0;ii<sons.length;ii++){
                                let child = {
                                    label : Object.keys(sons[ii])[0],
                                    id:Object.values(sons[ii])[0]
                                }

                                if (child.label!="all"){
                                    children.push(child);
                                }
                            }
                            var s = {
                                label:Object.keys(father[k])[0],
                                children:children,
                            }
                            if(s.label!="all"){
                                gChildren.push(s)
                            }
                        }

                        let g = {
                            label:Object.keys(grandpa)[0],
                            children:gChildren,
                        }
                        console.log(g);
                        tree.push(g);
                    }
                }
                tha.treeData = tree;
            })
        var that = this;

        $("#step").steps({
            onFinish: function () {
                alert('complete');
            },
            onChange: (currentIndex, newIndex, stepDirection) => {

                // if (currentIndex === 0) {
                //     if (stepDirection === "forward") {
                //         if ($("#dataname").val().length == 0 || that.clsStr.length == 0) {
                //             new Vue().$message({
                //                 message: 'Please complete data information!',
                //                 type: 'warning',
                //                 offset: 70,
                //             });
                //             return false;
                //         } else {
                //             return true;
                //         }
                //
                //     }
                // }
                if (currentIndex === 0 && stepDirection === "forward") {
                    if (this.treeData_select.length === 0) {
                        new Vue().$message({
                            message: 'Please select at least one classification!',
                            type: 'warning',
                            offset: 70,
                        });
                        return false;
                    }

                    if(this.currentLocalization.name === ""){
                        this.currentLocalization.name = this.itemName;
                    }

                    return true;
                }
                else if (currentIndex === 1 && stepDirection === "forward") {
                    if ($("#dataname").val().length == 0){
                        new Vue().$message({
                                            message: 'Please complete data information!',
                                            type: 'warning',
                                            offset: 70,
                                        });
                        return false;
                    }
                    return true;
                }
                else if (currentIndex === 2) {
                    return  true;
                }
                else if (currentIndex === 3) {
                    if (stepDirection === "forward") {
                        if ($("#description").val().length == 0) {
                            new Vue().$message({
                                message: 'Please complete data\'s description!',
                                type: 'warning',
                                offset: 70,
                            });
                            return false;
                        } else {


                            return true;
                        }

                    }
                }

            }
        });

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
                    console.log(data);

                    if (data.oid == "") {
                        alert("Please login");
                        window.location.href = "/user/login";
                    } else {
                        this.userId = data.oid;
                        this.userName = data.name;
                        console.log(this.userId)

                        this.sendUserToParent(this.userId)

                        $("#author").val(this.userName);

                        var index = window.sessionStorage.getItem("index");
                        this.itemIndex=index
                        if (index != null && index != undefined && index != "" && index != NaN) {
                            this.defaultActive = index;
                            this.handleSelect(index, null);
                            window.sessionStorage.removeItem("index");
                            this.curIndex=index

                        } else {
                            // this.changeRter(1);
                        }

                        window.sessionStorage.removeItem("tap");
                        //this.getTasksInfo();
                        this.load = false;
                    }
                }
            })


        });

        $("input[name='Status']").iCheck({
            //checkboxClass: 'icheckbox_square-blue',  // 注意square和blue的对应关系
            radioClass: 'iradio_flat-green',
            increaseArea: '0%' // optional

        });

        $.ajax({
            type: "GET",
            url: "/user/load",
            data: {

            },
            cache: false,
            async: false,
            success: (data) => {
                console.log(data);
                if (data.oid == "") {
                    alert("Please login");
                    window.location.href = "/user/login";
                }
                else {
                    this.userId = data.oid;
                    this.userName = data.name;
                }
            }
        })


        var oid = this.$route.params.editId;//取得所要edit的id

        var user_num = 0;

        if ((oid === "0") || (oid === "") || (oid === null)|| (oid === undefined)) {

            // $("#title").text("Create Model Item")
            $("#subRteTitle").text("/Create Data Hubs")
            $("#keywords").tagEditor('destory');
            $("#keywords").tagEditor({
                forceLowercase: false,
            });

            $("#contributers").tagEditor('destory');
            $("#contributers").tagEditor({
                forceLowercase: false,
            });

            tinymce.remove("textarea#detail");//先销毁已有tinyMCE实例
            tinymce.init({
                selector: "textarea#detail",
                height: 205,
                theme: 'silver',
                plugins: ['link', 'table', 'image', 'media'],
                image_title: true,
                // enable automatic uploads of images represented by blob or data URIs
                automatic_uploads: true,
                // URL of our upload handler (for more details check: https://www.tinymce.com/docs/configure/file-image-upload/#images_upload_url)
                // images_upload_url: 'postAcceptor.php',
                // here we add custom filepicker only to Image dialog
                file_picker_types: 'image',

                file_picker_callback: function (cb, value, meta) {
                    var input = document.createElement('input');
                    input.setAttribute('type', 'file');
                    input.setAttribute('accept', 'image/*');
                    input.onchange = function () {
                        var file = input.files[0];

                        var reader = new FileReader();
                        reader.readAsDataURL(file);
                        reader.onload = function () {
                            var img = reader.result.toString();
                            cb(img, {title: file.name});
                        }
                    };
                    input.click();
                },
                images_dataimg_filter: function (img) {
                    return img.hasAttribute('internal-blob');
                }
            });

        }
        else {
            // $("#title").text("Modify Model Item")
            $("#subRteTitle").text("/Modify Data Hubs")

            // document.title="Modify Data Hubs | OpenGMS"
            axios.get('/dataItem/getDataHubsByDataId',{params:{
                    dataId:oid,
                }}).then(res=>{
                    const resData = res.data
                    if(resData.code==-1){
                        alert("Please login");
                        window.location.href = "/user/login";
                    }else if(resData.data.noResult!=1){
                        let data = resData.data.result;

                        let classificationId = data.classifications;
                        this.dataItemAddDTO.dataType = data.contentType;
                        $("#ResourcesUrlText").val(data.reference);//url内容填充

                        this.selectedFile = data.dataList;

                        this.$refs.tree2.setCheckedKeys(data.classifications);
                        this.treeData_select = data.categories;
                        this.treeData_select = data.classifications;
                        this.dataItemAddDTO.viewCount = data.viewCount;
                        this.itemInfo.image = data.image;
                        //清空
                        // $("#classification").val('')
                        $("#dataname").val(data.name);
                        $("#description").val(data.description);
                        $("#keywords").tagEditor('destory');
                        $("#keywords").tagEditor({
                            initialTags: data.keywords,
                            forceLowercase: false,
                            placeholder: 'Enter keywords ...'
                        });
                        $("#contributers").tagEditor('destory');
                        $("#contributers").tagEditor({
                            initialTags: data.contributers,
                            forceLowercase: false,
                            placeholder: 'Enter keywords ...'
                        });

                        $("#detail").html(data.detail);
                        this.authorDataList = data.userDataList;

                        // $('#imgShow').get(0).src = data.image;
                        // $('#imgShow').show();

                        if (data.image!=null&&data.image!="") {
                            $('#imgShow').attr("src", "/static" + data.image);
                            $('#imgShow').show();
                            that.imageExist = true;
                        }else {
                            $('#imgShow').hide();
                            that.imageExist = false;
                        }
                        $("#displays").val('');
                        $("#dataresoureurl").val(data.reference);

                        // $("#coordinateSystem").val(data.meta.coordinateSystem);
                        // $("#geographicProjection").val(data.meta.geographicProjection)
                        // $("#coordinateUnits").val(data.meta.coordinateUnits)


                        $("#detail").html(data.detail);
                        //tinymce.remove('textarea#detail');//先销毁已有tinyMCE实例
                        initTinymce("textarea#detail");

                        let authorship = data.authorship;
                        if(authorship!=null) {
                            for (i = 0; i < authorship.length; i++) {
                                user_num++;
                                var content_box = $(".providers");
                                var str = "<div class='panel panel-primary'> <div class='panel-heading newAuthorHeader'> <h4 class='panel-title'> <a class='accordion-toggle collapsed' style='color:white' data-toggle='collapse' data-target='#user";
                                str += user_num;
                                str += "' href='javascript:;'> NEW </a> </h4><a href='javascript:;' class='fa fa-times author_close' style='float:right;margin-top:8px;color:white'></a></div><div id='user";
                                str += user_num;
                                str += "' class='panel-collapse collapse in'><div class='panel-body user-contents'> <div class='user-attr'>\n" +
                                    "                                                                                                    <div>\n" +
                                    "                                                                                                        <lable class='control-label col-sm-2 text-center'\n" +
                                    "                                                                                                               style='font-weight: bold;'>\n" +
                                    "                                                                                                            Name:\n" +
                                    "                                                                                                        </lable>\n" +
                                    "                                                                                                        <div class='input-group col-sm-10'>\n" +
                                    "                                                                                                            <input type='text'\n" +
                                    "                                                                                                                   name=\"name\"\n" +
                                    "                                                                                                                   class='form-control' value='" +
                                    authorship[i].name +
                                    "'>\n" +
                                    "                                                                                                        </div>\n" +
                                    "                                                                                                    </div>\n" +
                                    "                                                                                                    <div style=\"margin-top:10px\">\n" +
                                    "                                                                                                        <lable class='control-label col-sm-2 text-center'\n" +
                                    "                                                                                                               style='font-weight: bold;'>\n" +
                                    "                                                                                                            Email:\n" +
                                    "                                                                                                        </lable>\n" +
                                    "                                                                                                        <div class='input-group col-sm-10'>\n" +
                                    "                                                                                                            <input type='text'\n" +
                                    "                                                                                                                   name=\"email\"\n" +
                                    "                                                                                                                   class='form-control' value='" +
                                    authorship[i].email +
                                    "'>\n" +
                                    "                                                                                                        </div>\n" +
                                    "                                                                                                    </div>\n" +
                                    "                                                                                                    <div style=\"margin-top:10px\">\n" +
                                    "                                                                                                        <lable class='control-label col-sm-2 text-center'\n" +
                                    "                                                                                                               style='font-weight: bold;'>\n" +
                                    "                                                                                                            Homepage:\n" +
                                    "                                                                                                        </lable>\n" +
                                    "                                                                                                        <div class='input-group col-sm-10'>\n" +
                                    "                                                                                                            <input type='text'\n" +
                                    "                                                                                                                   name=\"homepage\"\n" +
                                    "                                                                                                                   class='form-control' value='" +
                                    authorship[i].homepage +
                                    "'>\n" +
                                    "                                                                                                        </div>\n" +
                                    "                                                                                                    </div>\n" +
                                    "                                                                                                </div></div> </div> </div>"
                                content_box.append(str)
                            }
                        }
                        $("#email").val("")
                        $("#home_page").val("")
                        $("#upperleftx").val("")
                        $("#upperlefty").val("")
                        $("#bottomrightx").val("")
                        $("#bottomrighty").val("");
                        $("#imgFile").val("");
                    }
                }
            )
            // window.sessionStorage.setItem("editModelItem_id", "");
        }

        $("#step").steps({
            onFinish: function () {
                alert('Wizard Completed');
            }
        });

        $("#imgChange").click(function () {
            $("#imgFile").click();
        });
        $("#imgFile").change(function () {
            //获取input file的files文件数组;
            //$('#filed')获取的是jQuery对象，.get(0)转为原生对象;
            //这边默认只能选一个，但是存放形式仍然是数组，所以取第一个元素使用[0];
            var file = $('#imgFile').get(0).files[0];
            //创建用来读取此文件的对象
            var reader = new FileReader();
            //使用该对象读取file文件
            reader.readAsDataURL(file);
            //读取文件成功后执行的方法函数
            reader.onload = function (e) {
                //读取成功后返回的一个参数e，整个的一个进度事件
                //选择所要显示图片的img，要赋值给img的src就是e中target下result里面
                //的base64编码格式的地址
                $('#imgShow').get(0).src = e.target.result;
                $('#imgShow').show();
            }
        });

        //table
        table = $('#dynamic-table').DataTable({
            //"aaSorting": [[ 0, "asc" ]],
            "paging": false,
            // "ordering":false,
            "info": false,
            "searching": false
        });
        $("#dynamic-table").css("display", "none")
        //$('#dynamic-table').dataTable().fnAddData(['111','111','111','1111','1111']);
        // $("#addref").click(function(){
        //     $("#refinfo").modal("show");
        // })
        $("#doiSearch").click(function () {
            $("#doi_searchBox").addClass("spinner")
            $.ajax({
                data: "Get",
                url: "/modelItem/DOISearch",
                data: {
                    doi: $("#doi_searchBox").val()
                },
                cache: false,
                async: true,
                success: (data) => {
                    data=data.data;
                    $("#doi_searchBox").removeClass("spinner")
                    if (data == "ERROR") {
                        alert(data);
                    }
                        // if(!json.doi){
                        //     alert("ERROR")
                    // }
                    else {
                        var json = eval('(' + data + ')');
                        console.log(json)
                        $("#doiTitle").val(json.title)
                        $("#doiAuthor").val(json.author)
                        $("#doiDate").val(json.month + " " + json.year)
                        $("#doiJournal").val(json.journal)
                        $("#doiPages").val(json.pages)
                        $("#doiLink").val(json.adsurl)
                        $("#doiDetails").css("display", "block");

                    }
                },
                error: (data) => {
                    $("#doi_searchBox").removeClass("spinner")
                    alert("ERROR!")
                    $("#doiDetails").css("display", "none");
                    $("#doiTitle").val("")
                }
            })


        });
        $("#modal_cancel").click(function () {
            $("#refTitle").val("")
            var tags = $('#refAuthor').tagEditor('getTags')[0].tags;
            for (i = 0; i < tags.length; i++) { $('#refAuthor').tagEditor('removeTag', tags[i]); }
            $("#refDate").val("")
            $("#refJournal").val("")
            $("#refLink").val("")
            $("#refPages").val("")

            $("#doiDetails").css("display", "none");
            $("#doiTitle").val("")
        })
        $("#modal_save").click(function () {

            if ($(".nav-tabs li").eq(0)[0].className == "active") {
                if ($("#refTitle").val().trim() == "") {
                    alert("Please Enter Title");
                }
                else {
                    table.row.add([
                        $("#refTitle").val(),
                        $("#refAuthor").val(),
                        $("#refDate").val(),
                        $("#refJournal").val(),
                        $("#refPages").val(),
                        $("#refLink").val(), "<center><a href='javascript:;' class='fa fa-times refClose' style='color:red'></a></center>"]).draw();

                    $("#dynamic-table").css("display", "block")
                    $("#refinfo").modal("hide")
                    $("#refTitle").val("")
                    var tags = $('#refAuthor').tagEditor('getTags')[0].tags;
                    for (i = 0; i < tags.length; i++) { $('#refAuthor').tagEditor('removeTag', tags[i]); }
                    $("#refDate").val("")
                    $("#refJournal").val("")
                    $("#refPages").val("")
                    $("#refLink").val("")
                }

            }
            else {
                if ($("#doiTitle").val() == "") {
                    alert("Details are empty");
                }
                else {
                    table.row.add([
                        $("#doiTitle").val(),
                        $("#doiAuthor").val(),
                        $("#doiDate").val(),
                        $("#doiJournal").val(),
                        $("#doiPages").val(),
                        $("#doiLink").val(), "<center><a href='javascript:;' class='fa fa-times refClose' style='color:red'></a></center>"]).draw();
                    $("#dynamic-table").css("display", "block")
                    $("#refinfo").modal("hide")
                    $("#doiDetails").css("display", "none");
                    $("#doiTitle").val("");
                }
            }


        })
        $(document).on("click", ".author_close", function () { $(this).parents(".panel").eq(0).remove(); });


        //作者添加

        $(".user-add").click(function () {
            user_num++;
            var content_box = $(this).parent().children('div');
            var str = "<div class='panel panel-primary'> <div class='panel-heading newAuthorHeader'> <h4 class='panel-title'> <a class='accordion-toggle collapsed' style='color:white' data-toggle='collapse' data-target='#user";
            str += user_num;
            str += "' href='javascript:;'> NEW </a> </h4><a href='javascript:;' class='fa fa-times author_close' style='float:right;margin-top:8px;color:white'></a></div><div id='user";
            str += user_num;
            str += "' class='panel-collapse collapse in'><div class='panel-body user-contents'> <div class='user-attr'>\n" +
                "                                                                                                    <div>\n" +
                "                                                                                                        <lable class='control-label col-sm-2 text-center'\n" +
                "                                                                                                               style='font-weight: bold;'>\n" +
                "                                                                                                            Name:\n" +
                "                                                                                                        </lable>\n" +
                "                                                                                                        <div class='input-group col-sm-10'>\n" +
                "                                                                                                            <input type='text'\n" +
                "                                                                                                                   name=\"name\"\n" +
                "                                                                                                                   class='form-control'>\n" +
                "                                                                                                        </div>\n" +
                "                                                                                                    </div>\n" +
                "                                                                                                    <div style=\"margin-top:10px\">\n" +
                "                                                                                                        <lable class='control-label col-sm-2 text-center'\n" +
                "                                                                                                               style='font-weight: bold;'>\n" +
                "                                                                                                            Email:\n" +
                "                                                                                                        </lable>\n" +
                "                                                                                                        <div class='input-group col-sm-10'>\n" +
                "                                                                                                            <input type='text'\n" +
                "                                                                                                                   name=\"email\"\n" +
                "                                                                                                                   class='form-control'>\n" +
                "                                                                                                        </div>\n" +
                "                                                                                                    </div>\n" +
                "                                                                                                    <div style=\"margin-top:10px\">\n" +
                "                                                                                                        <lable class='control-label col-sm-2 text-center'\n" +
                "                                                                                                               style='font-weight: bold;'>\n" +
                "                                                                                                            Homepage:\n" +
                "                                                                                                        </lable>\n" +
                "                                                                                                        <div class='input-group col-sm-10'>\n" +
                "                                                                                                            <input type='text'\n" +
                "                                                                                                                   name=\"homepage\"\n" +
                "                                                                                                                   class='form-control'>\n" +
                "                                                                                                        </div>\n" +
                "                                                                                                    </div>\n" +
                "                                                                                                </div></div> </div> </div>"
            content_box.append(str)
        })

        $(document).on("keyup", ".username", function () {

            if ($(this).val()) {
                $(this).parents('.panel').eq(0).children('.panel-heading').children().children().html($(this).val());
            }
            else {
                $(this).parents('.panel').eq(0).children('.panel-heading').children().children().html("NEW");
            }
        })
        //激活jQuery的icheck插件
        $("input[name='ContentType']").iCheck({
            //checkboxClass: 'icheckbox_square-blue',  // 注意square和blue的对应关系
            radioClass: 'iradio_flat-green',
            increaseArea: '0%' // optional

        });
        $("input[name='author_confirm']").iCheck({
            //checkboxClass: 'icheckbox_square-blue',  // 注意square和blue的对应关系
            radioClass: 'iradio_flat-green',
            increaseArea: '0%' // optional

        });
        $("input:radio[name='ContentType']").on('ifChecked', function(event){

            if($(this).val()=="Resources Url"){
                that.dataType = "Url";
                $("#ResourcesUrl").show();
                $("#Resource").hide();
            }
            else{
                that.dataType = "File";
                $("#ResourcesUrl").hide();
                $("#Resource").show();
            }

        });
    }
})
