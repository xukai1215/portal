var createModelItem = Vue.extend({
    template:'#createModelItem',
    data() {
    return {
        defaultActive: '2-1',
        curIndex: 2,

        ScreenMaxHeight: "0px",
        ScreenMinHeight: "0px",

        IframeHeight: "0px",
        editorUrl: "",
        load: false,


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
            label: 'Earth System Subject',
            oid: 'fc236e9d-3ae9-4594-b9b8-de0ac336a1d7',
            children: [ {
                id: 65,
                label: 'Sun-Earth System',
                oid: '1fd56a5d-1532-4ea6-ad0a-226e78a12861'
            }, {
                id: 66,
                label: 'Earth Surface System',
                oid: '4f162f21-2375-468e-90af-d3267d0ba05f',
                children: [{
                    id: 2,
                    label: 'Hydrosphere',
                    oid: '652bf1f8-2f3e-4f93-b0dc-f66505090873'
                }, {
                    id: 3,
                    label: 'Lithosphere',
                    oid: 'a621ea24-26d5-4027-a8de-d418509dacb2'
                }, {
                    id: 4,
                    label: 'Atmosphere',
                    oid: '5e324fc8-93d1-40bb-a2e4-24d2dff68c4b'
                }, {
                    id: 5,
                    label: 'Biosphere',
                    oid: '76cb072d-8f56-4e34-9ea6-1a95ea7f474b'
                }, {
                    id: 6,
                    label: 'Anthroposphere',
                    oid: 'eccbe4e1-32f6-490e-9bf7-ae774be472ac'

                }, {
                    id: 7,
                    label: 'Synthesis',
                    oid: '1a59f012-0659-479d-a183-b74921c67a08'
                }]
            },{
                id: 67,
                label: 'Solid Earth Geophysics',
                oid: '52e69d15-cc83-43fb-a445-0c15e5f46878'
            },]
        },{
            id: 64,
            label: 'Geography Subject',
            oid: 'd7824a16-0f3a-4186-8cb7-41eb10028177',
            children: [{
                id: 8,
                label: 'Physical Geography',
                oid: '44068d3f-533a-4567-9bfd-07eea9d9e8af',
                children: [{
                    id: 9,
                    label: 'Hydrology',
                    oid: '158690be-1a1d-4e09-86a5-cbd5c0104206'
                }, {
                    id: 10,
                    label: 'Geomorphology',
                    oid: '17b746ad-7dcf-4aa5-90b5-104c041caf62'
                }, {
                    id: 11,
                    label: 'Geology',/////
                    oid: '19bff3af-4c8d-4d98-9ad0-18e34a818a50'
                }, {
                    id: 12,
                    label: 'Glaciology',
                    oid: 'cfc349aa-63dc-498a-a9e0-6867bad3a2a6'
                }, {
                    id: 13,
                    label: 'Biogeography',
                    oid: '7656e180-c975-47fe-8ea6-abf417a94793'
                }, {
                    id: 14,
                    label: 'Meteorology',
                    oid: 'e3e1e879-ce41-46a5-b72c-55501bb08ce8'
                }, {
                    id: 15,
                    label: 'Climatology',
                    oid: 'dcb2fa01-5507-4fbd-a533-1b7336cd497b'
                }, {
                    id: 16,
                    label: 'Pedology',
                    oid: '40d18155-6669-4416-990c-de0374ab587e'
                }, {
                    id: 17,
                    label: 'Oceanography',
                    oid: 'ea1f9c14-9bdb-4da6-b728-a9853620e95f'
                }, {
                    id: 18,
                    label: 'Coastal Geography',
                    oid: '12b11f3e-8d6e-48c9-bf3a-f9fb5c5e0dd4'
                }, {
                    id: 19,
                    label: 'Landscape Ecology',
                    oid: '00190eef-017f-42b3-8500-baf612083557'
                }, {
                    id: 20,
                    label: 'Ecosystem',
                    oid: '60d4f9cf-df22-4313-8b53-c7c314455f2d'
                }, {
                    id: 21,
                    label: 'Paleogeography',
                    oid: '6965468a-f952-4adf-87e9-6dc2988ab7f8'
                }, {
                    id: 22,
                    label: 'Quaternary Science',
                    oid: '9de1a9a7-4f84-4f8d-9ee6-3aaa33681e29'
                }, {
                    id: 23,
                    label: 'Environmental Management',
                    oid: '5d8d6338-0624-40dd-8519-ec440b47c174'
                }, {
                    id: 24,
                    label: 'Global Synthesis',
                    oid: 'a0c97d7a-54c6-4bbe-8e6d-9fe9b2234a1e'
                }, {
                    id: 25,
                    label: 'Regional Synthesis',/////
                    oid: 'aacf6bc4-8280-4f75-919d-3e4be604dd88'
                }, {
                    id: 26,
                    label: 'Others',
                    oid: 'f69d3040-abad-477d-9194-b6ee5303bd9a'
                }]
            }, {
                id: 27,
                label: 'Human Geography',
                oid: '3a76212e-c4f2-4a99-ab98-51ae5e7cf7e0',
                children: [{
                    id: 28,
                    label: 'Agricultural Geography',
                    oid: '7cf1aa10-58c0-4329-9a1d-9ace0cc2ba33'
                }, {
                    id: 29,
                    label: 'Industrial Geography',
                    oid: 'e9590d02-c1bf-4f92-878c-4f2857fc9c33'
                }, {
                    id: 30,
                    label: 'Traffic Geography',
                    oid: '64eb0340-6312-4549-9671-6bd635d5a8b3'
                }, {
                    id: 31,
                    label: 'Tourism Geography',
                    oid: 'bfa6147d-700e-4e06-978e-c9f0266608a8'
                }, {
                    id: 32,
                    label: 'Population Geography',/////
                    oid: 'a9fc055b-99a1-40c9-82de-626de69efc04'
                }, {
                    id: 33,
                    label: 'Regional Geography',
                    oid: '0be6cd3b-a459-45df-b7e7-b2fb23aafd12'
                }, {
                    id: 34,
                    label: 'Urban Geography',
                    oid: '51574401-09d9-4819-aa3e-17994e0396fd'
                }, {
                    id: 35,
                    label: 'Rural Geography',/////
                    oid: 'b0cc3872-2c89-428a-ac50-7d30f7638373'
                }, {
                    id: 36,
                    label: 'Historical Geography',
                    oid: '9efcb0d7-9374-4fa4-b1c3-8a9409320813'
                }, {
                    id: 37,
                    label: 'Cultural Geography',
                    oid: '13e811de-f061-432b-9ed4-85bda9d385c7'
                }, {
                    id: 38,
                    label: 'Social Geography',
                    oid: 'dfb2fc17-f084-4e6b-ae89-ef35f4563be3'
                }, {
                    id: 39,
                    label: 'Economic Geography',
                    oid: '6d4b41d2-6922-4642-bfe4-235a55002f67'
                }, {
                    id: 40,
                    label: 'Political Geography',
                    oid: '7a5fdbe5-ac48-45ea-a56a-29ff10e32789'
                }, {
                    id: 41,
                    label: 'Health Geography',
                    oid: '0761b9dc-4324-46f0-a8d5-3516fd6308d9'
                }, {
                    id: 42,
                    label: 'Development Geography',
                    oid: '671c0a46-fc81-47ed-94c3-af12c696156b'
                }, {
                    id: 43,
                    label: 'Behavioral Geography',
                    oid: 'f25d4aa8-3adf-47fa-8b8d-adf885e7c5aa'
                }, {
                    id: 44,
                    label: 'Global Synthesis',
                    oid: 'd4ceefe8-0c2b-4ea1-af1d-a7e0f3c7218c'
                }, {
                    id: 45,
                    label: 'Regional Synthesis',/////
                    oid: 'ea50ad38-0b15-49b4-a183-676ba7487446'
                }, {
                    id: 46,
                    label: 'Others',
                    oid: 'ba898bbd-1902-44ae-ac3f-0cc5bc944bc5'
                }]
            }, {
                id: 47,
                label: 'GIScience & Remote Sensing',
                oid: '3afc51dc-930d-4ab5-8a59-3e057b7eb086',
                children: [{
                    id: 48,
                    "label": "Shape Processing",
                    "oid": "e6984ef1-4f69-4f6e-be2b-c77f917de5a5",
                },
                    {
                        id: 49,
                        "label": "Grid Processing",
                        "oid": "944d3c82-ddeb-4b02-a56c-44eb419ecc13",
                    },
                    {
                        id: 50,
                        "label": "Imagery Processing",
                        "oid": "5e184a2e-2579-49bf-ebac-7c28b24a38e3",
                    },
                    {
                        id: 51,
                        "label": "Data Management",
                        "oid": "6cc12923-edc1-4faf-8c7d-a14240cd897b",
                    },
                    {
                        id: 52,
                        "label": "Spatial Analysis",
                        "oid": "d7f96d42-b6c5-4984-81f6-6589cff37285",
                    },
                    {
                        id: 53,
                        "label": "Geostatistics",
                        "oid": "f08f8694-1909-4ca2-b943-e8db0c0f5439",
                    },
                    {
                        id: 54,
                        "label": "Terrain Analysis",
                        "oid": "b74f0952-143b-4af7-8fa6-ad9bf4787cb9",
                    },
                    {
                        id: 55,
                        "label": "3D Analyst",
                        "oid": "340c275a-1ed4-495b-8415-a6a4bfe4eb18",
                    },{
                        id: 56,
                        "label": "Network Analysis",
                        "oid": "fa7d7d50-098e-4cd7-92c7-31755b3ca371",
                    },{
                        id: 57,
                        "label": "Geographic Simulation",
                        "oid": "ab1f3806-1ed8-4fd9-ff06-b6c2ca020ae9",
                    },
                    {
                        id: 58,
                        "label": "Climate Tools",
                        "oid": "40b78ccf-e430-4756-84d7-9dfdd9ccfcad"
                    },{
                        id: 59,
                        "label": "Generic Tools",
                        "oid": "77567bff-52b9-4833-885d-417bd3a6c0e9"
                    },{
                        id: 60,
                        label: 'Cartography',
                        oid: '854189a4-3811-441d-a9d1-7de58e57a37f'
                    },
                    {
                        id: 61,
                        label: 'Remote Sensing Imagery',
                        oid: '84e1090a-3f27-43fe-b912-d0dd7e9c8677'
                    }, {
                        id: 62,
                        label: 'Ground Feature Spectrum',
                        oid: '63097163-10e5-4e16-8335-590dcc7156ba'
                    }, {
                        id: 63,
                        label: 'Others',/////
                        oid: '10bef187-00bf-4cea-b192-bf1465a265b1'
                    }]
            }]}

        ],
        defaultProps: {
            children: 'children',
            label: 'label'
        },
        cls: [],
        clsStr: '',
        status: 'Public',

        socket:"",

        message_num_socket:0,
        message_num_socket_theme:0,
        modelitem_oid:"",

        editArticleDialog:false,

        showUploadArticleDialog:false,

        showUploadedArticleDialog:false,

        articleUploading:{
            title:'',
            authors:[],
            journal:'',
            pageRange:'',
            date:2019,
            doi:'',
            status:'',
            link:'',
        },

        doiLoading:false,

        doi:'',
    }
    },
    methods: {
        // handleSelect(index,indexPath){
        //     this.setSession("index",index);
        //     window.location.href="/user/userSpace"
        // },
        handleCheckChange(data, checked, indeterminate) {
            let checkedNodes = this.$refs.tree2.getCheckedNodes()
            let classes = [];
            let str='';
            for (let i = 0; i < checkedNodes.length; i++) {
                // console.log(checkedNodes[i].children)
                if(checkedNodes[i].children!=undefined){
                    continue;
                }

                classes.push(checkedNodes[i].oid);
                str+=checkedNodes[i].label;
                if(i!=checkedNodes.length-1){
                    str+=", ";
                }
            }
            this.cls=classes;
            this.clsStr=str;

        },

        //reference
        searchDoi(){
            if(this.doi == ''){
                this.$alert('Please input the DOI', 'Tip', {
                        type:"warning",
                        confirmButtonText: 'Confirm',
                        callback: ()=>{
                            return
                        }
                    }
                );
            }else{
                this.doiLoading = true
                // if(this.doi===this.lastDoi)
                //     setTimeout(()=>{
                //         this.showUploadedArticleDialog=true;
                //         this.doiLoading = false;
                //     },200)
                // this.lastDoi=this.doi;

                $.ajax({
                    type: "POST",
                    url: "/modelItem/searchByDOI",
                    data: {
                        doi: this.doi
                    },
                    cache: false,
                    async: true,
                    success: (res) => {
                        if(res.code==-1) {
                            this.$alert('Please login first!', 'Error', {
                                type:"error",
                                confirmButtonText: 'OK',
                                callback: action => {
                                    window.location.href = "/user/login";
                                }
                            });
                        }
                        data=res.data;
                        this.doiLoading = false;
                        if (data.find == -1) {
                            this.$alert('Failed to connect, please try again!', 'Tip', {
                                    type:"warning",
                                    confirmButtonText: 'Confirm',
                                    callback: ()=>{
                                        return
                                    }
                                }
                            );
                        }else if(data.find==0){
                            this.$alert('Find no result, check the DOI you have input or fill information manually.', 'Tip', {
                                    type:"warning",
                                    confirmButtonText: 'Confirm',
                                    callback: ()=>{
                                        return
                                    }
                                }
                            );
                        }
                        else if(data.find==1) {

                            this.showUploadArticleDialog = true;
                            this.articleUploading = data.article;

                        }else if(data.find==2){
                            this.showUploadedArticleDialog=true;

                        }

                    },
                    error: (data) => {
                        this.doiLoading = false;
                        $("#doi_searchBox").removeClass("spinner")
                        this.$alert('Failed to connect, please try again!', 'Tip', {
                                type:"warning",
                                confirmButtonText: 'Confirm',
                                callback: ()=>{
                                    return
                                }
                            }
                        );
                        $("#doiDetails").css("display", "none");
                        $("#doiTitle").val("")
                    }
                })
            }
        },

        updateArticleConfirmClick(){
            // console.log(this.articleToBack);
            var tags = $('#refAuthor').tagEditor('getTags')[0].tags;
            for (i = 0; i < tags.length; i++) { $('#articleAuthor').tagEditor('removeTag', tags[i]); }
            if(tags.length<1||$("#refTitle").val()==''){
                this.$alert('Please enter the Title and at least one Author.', 'Tip', {
                        type:"warning",
                        confirmButtonText: 'Confirm',
                        callback: ()=>{
                            return
                        }
                    }
                );
            }
            this.editArticleDialog = false
           //调用$("#modal_save").click完成

        },

        articleDoiUploadConfirm(status){
            this.articleToBack = this.articleUploading;

            Vue.nextTick(()=>{
                $("#refTitle").val(this.articleToBack.title);
                $("#refJournal").val(this.articleToBack.journal);
                $("#volumeIssue").val(this.articleToBack.volume);
                $("#refPages").val(this.articleToBack.pageRange);
                $("#refDate").val(this.articleToBack.date);
                $("#refLink").val(this.articleToBack.link);
                if ($("#refAuthor").nextAll().length == 0) {//如果不存在tageditor,则创建一个
                    Vue.nextTick(() => {
                        $("#refAuthor").tagEditor({
                            forceLowercase: false
                        })
                        $('#refAuthor').tagEditor('destroy');
                        $('#refAuthor').tagEditor({
                            initialTags: this.articleToBack.authors,
                            forceLowercase: false,
                        });

                    })
                }else{
                    $('#refAuthor').tagEditor('destroy');
                    $('#refAuthor').tagEditor({
                        initialTags: this.articleToBack.authors,
                        forceLowercase: false,
                    });
                }

            })
            this.showUploadArticleDialog = false;
            // this.articleToBack.status = status;
        },

        addArticleClick(){
            this.editArticleDialog = true;
            this.addorEdit='Add';
            $("#refTitle").val('');

            if ($("#refAuthor").nextAll().length == 0)//如果不存在tageditor,则创建一个
                Vue.nextTick(() => {
                    $("#refAuthor").tagEditor({
                        forceLowercase: false
                    })
                })

            $('#refAuthor').tagEditor('destroy');
            $('#refAuthor').tagEditor({
                initialTags:  [''],
                forceLowercase: false,
            });
            $("#refJournal").val('');
            $("#volumeIssue").val('');
            $("#refPages").val('');
            $("#refDate").val('');
            $("#refLink").val('');

            this.doi ='';
        },

        changeOpen(n) {
            this.activeIndex = n;
        },
        setSession(name, value) {
            window.sessionStorage.setItem(name, value);
        },


        sendcurIndexToParent(){
            this.$emit('com-sendcurindex',this.curIndex)
        },
        // send_message(){
        //     let message = "hahalll";
        //     console.log("message");
        //     this.websocket.send(message);
        //     // setMessageInnerHTML(message);
        // },

        sendUserToParent(userId){
            this.$emit('com-senduserinfo',userId)
        },


        init:function () {

            if ('WebSocket' in window) {
                // this.socket = new WebSocket("ws://localhost:8080/websocket");
                this.socket = new WebSocket(websocketAddress);
                // 监听socket连接
                this.socket.onopen = this.open;
                // 监听socket错误信息
                this.socket.onerror = this.error;
                // 监听socket消息
                this.socket.onmessage = this.getMessage

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

        //获取当前消息数目
        getMessageNum(modelitem_oid){
            this.message_num_socket = 0;//初始化消息数目
            let data = {
                type: 'modelItem',
                oid : modelitem_oid,
            };

            //根据oid去取该作者的被编辑的条目数量
            $.ajax({
                url:"/theme/getAuthorMessageNum",
                type:"GET",
                data:data,
                async:false,
                success:(json)=>{
                    this.message_num_socket = json;
                }
            })
            let data_theme = {
                type: 'modelItem',
                oid : modelitem_oid,
            }
            $.ajax({
                url:"/theme/getThemeMessageNum",
                async:false,
                type:"GET",
                data:data_theme,
                success:(json)=>{
                    console.log(json);
                    for (let i=0;i<json.length;i++) {
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
                                    }else if (k == 1){
                                        switch (type[j].status) {
                                            case "0":
                                                this.message_num_socket++;
                                        }

                                    }else if (k == 2){
                                        switch (type[j].status) {
                                            case "0":
                                                this.message_num_socket++;
                                        }

                                    } else if (k == 3){
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

    destroyed () {
        // 销毁监听
        this.socket.onclose = this.close
    },
    mounted() {

        let that = this;
        var vthis = this;
        that.init();

        //初始化的时候吧curIndex传给父组件，来控制bar的高亮显示
        this.sendcurIndexToParent();

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
                    data = JSON.parse(data);

                    console.log(data);

                    if (data.oid == "") {
                        alert("Please login");
                        window.location.href = "/user/login";
                    } else {
                        this.userId = data.oid;
                        this.userName = data.name;
                        console.log(this.userId)
                        // this.addAllData()

                        // axios.get("/dataItem/amountofuserdata",{
                        //     params:{
                        //         userOid:this.userId
                        //     }
                        // }).then(res=>{
                        //     that.dcount=res.data
                        // });

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


            //this.getModels();
        });

        $.ajax({
            type: "GET",
            url: "/user/load",
            data: {

            },
            cache: false,
            async: false,
            success: (data) => {
                data=JSON.parse(data);
                console.log(data);
                if (data.oid == "") {
                    alert("Please login");
                    window.location.href = "/user/login";
                }
                else {
                    this.userId = data.oid;
                    this.userName = data.name;

                    this.sendUserToParent(this.userId)
                    //$("#provider_body .providers h4 a").eq(0).text(data.name);
                    // $.get("http://localhost:8081/GeoModelingNew/UserInfoServlet",{"userId":this.userId},(result)=> {
                    //     this.userInfo=eval('('+result+')');
                    //     console.log(this.userInfo)
                    // })
                }
            }
        })

        var oid = this.$route.params.editId;

        var user_num = 0;

        if ((oid === "0") || (oid === "") || (oid === null)|| (oid === undefined)) {

            // $("#title").text("Create Model Item")
            $("#subRteTitle").text("/Create Model Item")

            initTinymce('textarea#modelItemText')
        }
        else {
            // $("#title").text("Modify Model Item")
            $("#subRteTitle").text("/Modify Model Item");

            document.title="Modify Model Item | OpenGMS"
            $.ajax({
                url: "/modelItem/getInfo/" + oid,
                type: "get",
                data: {},

                success: (result) => {
                    console.log(result);
                    var basicInfo = result.data;

                    //cls
                    this.cls = basicInfo.classifications;
                    this.status = basicInfo.status;
                    let ids=[];
                    for(i=0;i<this.cls.length;i++){
                        for(j=0;j<2;j++){
                            for(k=0;k<this.treeData[j].children.length;k++){
                                let children=this.treeData[j].children[k].children;
                                if(children==null) {
                                    if (this.cls[i] == this.treeData[j].children[k].oid) {
                                        ids.push(this.treeData[j].children[k].id);
                                        this.clsStr += this.treeData[j].children[k].label;
                                        if (i != this.cls.length - 1) {
                                            this.clsStr += ", ";
                                        }
                                        break;
                                    }
                                }
                                else{
                                    for(x=0;x<children.length;x++){
                                        if (this.cls[i] == children[x].oid) {
                                            ids.push(children[x].id);
                                            this.clsStr += children[x].label;
                                            if (i != this.cls.length - 1) {
                                                this.clsStr += ", ";
                                            }
                                            break;
                                        }
                                    }
                                }

                            }
                            if(ids.length-1==i){
                                break;
                            }
                        }
                    }

                    this.$refs.tree2.setCheckedKeys(ids);

                    $(".providers").children(".panel").remove();

                    let authorship = basicInfo.authorship;
                    if(authorship!=null) {
                        for (i = 0; i < authorship.length; i++) {
                            user_num++;
                            var content_box = $(".providers");
                            var str = "<div class='panel panel-primary'> <div class='panel-heading'> <h4 class='panel-title'> <a class='accordion-toggle collapsed' style='color:white' data-toggle='collapse' data-target='#user";
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
                                "                                                                                                            Affiliation:\n" +
                                "                                                                                                        </lable>\n" +
                                "                                                                                                        <div class='input-group col-sm-10'>\n" +
                                "                                                                                                            <input type='text'\n" +
                                "                                                                                                                   name=\"ins\"\n" +
                                "                                                                                                                   class='form-control' value='" +
                                authorship[i].ins +
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


                    $("#nameInput").val(basicInfo.name);
                    $("#descInput").val(basicInfo.description);

                    //image
                    if (basicInfo.image != "") {
                        $("#imgShow").attr("src", basicInfo.image);
                        $('#imgShow').show();
                    }
                    //reference

                    for (i = 0; i < basicInfo.references.length; i++) {
                        var ref = basicInfo.references[i];
                        table.row.add([
                            ref.title,
                            ref.author,
                            ref.date,
                            ref.journal,
                            ref.volume,
                            ref.pages,
                            ref.links,
                            ref.doi,
                            "<center><a href='javascript:;' class='fa fa-times refClose' style='color:red'></a></center>"]).draw();
                    }
                    if (basicInfo.references.length > 0) {
                        $("#dynamic-table").css("display", "block")
                    }

                    //tags
                    $('#tagInput').tagEditor('destroy');
                    $('#tagInput').tagEditor({
                        initialTags: basicInfo.keywords,
                        forceLowercase: false,
                        placeholder: 'Enter keywords ...'
                    });


                    //detail
                    //tinymce.remove("textarea#modelItemText");
                    $("#modelItemText").html(basicInfo.detail);
                    initTinymce('textarea#modelItemText')
                }
            })
            // window.sessionStorage.setItem("editModelItem_id", "");
        }

        $("#step").steps({
            onFinish: function () {

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
                    } else if ($("#nameInput").val().trim() == "") {
                        new Vue().$message({
                            message: 'Please enter name!',
                            type: 'warning',
                            offset: 70,
                        });
                        return false;
                    }else if ($("#descInput").val().trim() == ""){
                        new Vue().$message({
                            message: 'Please enter overview!',
                            type: 'warning',
                            offset: 70,
                        });
                        return false;
                    } else {
                        return true;
                    }
                } else{
                    return true;
                }
            }
        });


        $('#tagInput').tagEditor({
            forceLowercase: false
        });
        $("#refAuthor").tagEditor({
            forceLowercase: false
        })

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

        $("#modal_cancel").click(function () {
            $("#refTitle").val("")
            let tags = $('#refAuthor').tagEditor('getTags')[0].tags;
            for (i = 0; i < tags.length; i++) { $('#refAuthor').tagEditor('removeTag', tags[i]); }
            $("#refDate").val("")
            $("#refJournal").val("")
            $("#refLink").val("")
            $("#refPages").val("")

            $("#doiDetails").css("display", "none");
            $("#doiTitle").val("")
        })

        $("#modal_save").click(function () {
            let tags1 = $('#refAuthor').tagEditor('getTags')[0].tags;
            for (i = 0; i < tags1.length; i++) { $('#refAuthor').tagEditor('removeTag', tags1[i]); }
            if (tags1.length>0&&$("#refTitle").val()!='') {
                table.row.add([
                    $("#refTitle").val(),
                    tags1,
                    $("#refDate").val(),
                    $("#refJournal").val(),
                    $("#volumeIssue").val(),
                    $("#refPages").val(),
                    $("#refLink").val(),
                    $("#doiTitle").val(),
                     "<center><a href='javascript:;' class='fa fa-times refClose' style='color:red'></a></center>"]).draw();

                $("#dynamic-table").css("display", "block")
                $("#refinfo").modal("hide")
                $("#refTitle").val("")
                var tags = $('#refAuthor').tagEditor('getTags')[0].tags;
                for (i = 0; i < tags.length; i++) {
                    $('#refAuthor').tagEditor('removeTag', tags[i]);
                }
                $("#refDate").val("")
                $("#volumeIssue").val(""),
                $("#refJournal").val("")
                $("#refPages").val("")
                $("#doiTitle").val("")
                $("#refLink").val("")
            }

        })
        //table end

        $(document).on("click", ".refClose", function () {
            table.row($(this).parents("tr")).remove().draw();
            //$(this).parents("tr").eq(0).remove();
            console.log($("tbody tr"));
            if ($("tbody tr").eq(0)[0].innerText == "No data available in table") {
                $("#dynamic-table").css("display", "none")
            }
        });

        let height = document.documentElement.clientHeight;
        this.ScreenMaxHeight = (height) + "px";
        this.IframeHeight = (height - 20) + "px";

        window.onresize = () => {
            console.log('come on ..');
            height = document.documentElement.clientHeight;
            this.ScreenMaxHeight = (height) + "px";
            this.IframeHeight = (height - 20) + "px";
        }


        var modelItemObj = {};
        // $(".next").click(()=> {
        //     modelItemObj.classifications = this.cls;//[$("#parentNode").attr("pid")];
        //     modelItemObj.name = $("#nameInput").val();
        //     modelItemObj.keywords = $("#tagInput").val().split(",");
        //     modelItemObj.description = $("#descInput").val();
        //     modelItemObj.image = $('#imgShow').get(0).src;
        //     modelItemObj.authorship=[];
        //
        //     if (this.cls.length == 0) {
        //         alert("Please select parent node");
        //         return false;
        //     }
        //     if ($("#nameInput").val() === "") {
        //         alert("Please enter model item name");
        //         return false;
        //     }
        // });

        // //此处进行websocket配置
        // // let that = this;
        // //尝试配置websocket,测试成功，可以连接
        // var websocket = new WebSocket("ws://localhost:8080/websocket");
        //
        // //判断当前浏览器是否支持WebSocket
        // if ('WebSocket' in window) {
        //     websocket = new WebSocket("ws://localhost:8080/websocket");
        //     console.log("websocket 已连接");
        // }
        // else {
        //     alert('当前浏览器 Not support websocket');
        //     console.log("websocket 无法连接");
        // }
        //
        // //连接发生错误的回调方法
        // websocket.onerror = function () {
        //     setMessageInnerHTML("聊天室连接发生错误");
        // };
        //
        // //连接成功建立的回调方法
        // websocket.onopen = function () {
        //     setMessageInnerHTML("聊天室连接成功");
        // }
        //
        // //连接关闭的回调方法
        // websocket.onclose = function () {
        //     setMessageInnerHTML("聊天室连接关闭");
        // }
        //
        // //监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
        // window.onbeforeunload = function () {
        //     closeWebSocket();
        // }
        //
        // websocket.onmessage = function(event) {
        //     setMessage(event.data);
        //     // setMessageInnerHTML(event.data);
        // };
        //
        // function setMessage(data) {
        //     setMessageInnerHTML(data);
        //
        // }
        // //将消息显示在网页上
        // function setMessageInnerHTML(innerHTML) {
        //     // document.getElementById('message').innerHTML += innerHTML + '<br/>';
        // }
        //
        // //关闭WebSocket连接
        // function closeWebSocket() {
        //     websocket.close();
        // }

        $(".finish").click(()=> {
            modelItemObj.status=this.status;
            modelItemObj.classifications = this.cls;//[$("#parentNode").attr("pid")];
            modelItemObj.name = $("#nameInput").val();
            modelItemObj.keywords = $("#tagInput").val().split(",");
            modelItemObj.description = $("#descInput").val();
            modelItemObj.uploadImage = $('#imgShow').get(0).currentSrc;
            modelItemObj.authorship=[];
            userspace.getUserData($("#providersPanel .user-contents .form-control"), modelItemObj.authorship);

            if(modelItemObj.name.trim()==""){
                alert("please enter name");
                return;
            }
            else if(modelItemObj.classifications.length==0){
                alert("please select classification");
                return;
            }

            modelItemObj.references = new Array();
            var ref_lines = $("#dynamic-table tr");
            for (i = 1; i < ref_lines.length; i++) {
                var ref_prop = ref_lines.eq(i).children("td");
                if (ref_prop != 0) {
                    var ref = {};
                    ref.title = ref_prop.eq(0).text();
                    if (ref.title == "No data available in table")
                        break;
                    ref.author = ref_prop.eq(1).text().split(",");
                    ref.date = ref_prop.eq(2).text();
                    ref.journal = ref_prop.eq(3).text();
                    ref.volume = ref_prop.eq(4).text();
                    ref.pages = ref_prop.eq(5).text();
                    ref.links = ref_prop.eq(6).text();
                    ref.doi = ref_prop.eq(7).text();
                    modelItemObj.references.push(ref);
                }
            }

            var detail = tinyMCE.activeEditor.getContent();
            modelItemObj.detail = detail.trim();
            console.log(modelItemObj);

            let formData=new FormData();

            if ((oid === "0") || (oid === "") || (oid == null)) {
                let file = new File([JSON.stringify(modelItemObj)],'ant.txt',{
                    type: 'text/plain',
                });
                formData.append("info",file);
                $.ajax({
                    url: "/modelItem/add",
                    type: "POST",
                    processData: false,
                    contentType: false,
                    async: true,
                    data: formData,
                    success: (result)=> {
                        userspace.fullscreenLoading=false;
                        // loading.close();
                        if (result.code == 0) {

                            this.$confirm('<div style=\'font-size: 18px\'>Create model item successfully!</div>', 'Tip', {
                                dangerouslyUseHTMLString: true,
                                confirmButtonText: 'View',
                                cancelButtonText: 'Go Back',
                                cancelButtonClass: 'fontsize-15',
                                confirmButtonClass: 'fontsize-15',
                                type: 'success',
                                center: true,
                                showClose: false,
                            }).then(() => {
                                window.location.href = "/modelItem/" + result.data;
                            }).catch(() => {
                                window.location.href = "/user/userSpace#/models/modelitem";
                            });
                        }
                        else if(result.code==-1){
                            this.$alert('Please login first!', 'Error', {
                                type:"error",
                                confirmButtonText: 'OK',
                                callback: action => {
                                    window.location.href="/user/login";
                                }
                            });

                        }
                        else{
                            this.$alert('Created failed!', 'Error', {
                                type:"error",
                                confirmButtonText: 'OK',
                                callback: action => {

                                }
                            });
                        }
                    }
                })
            } else {

                modelItemObj["oid"] = oid;

                let file = new File([JSON.stringify(modelItemObj)],'ant.txt',{
                    type: 'text/plain',
                });
                formData.append("info",file);
                userspace.fullscreenLoading=true;
                $.ajax({
                    url: "/modelItem/update",
                    type: "POST",
                    processData: false,
                    contentType: false,
                    async: true,
                    data: formData,

                    success: (result)=> {
                        // setTimeout(()=>{loading.close();},1000)
                        // loading.close()
                        userspace.fullscreenLoading=false;
                        if (result.code === 0) {
                            if(result.data.method==="update") {
                                this.$confirm('<div style=\'font-size: 18px\'>Update model item successfully!</div>', 'Tip', {
                                    dangerouslyUseHTMLString: true,
                                    confirmButtonText: 'View',
                                    cancelButtonText: 'Go Back',
                                    cancelButtonClass: 'fontsize-15',
                                    confirmButtonClass: 'fontsize-15',
                                    type: 'success',
                                    center: true,
                                    showClose: false,
                                }).then(() => {
                                    $("#editModal", parent.document).remove();
                                    window.location.href = "/modelItem/" + result.data.oid;
                                }).catch(() => {
                                    window.location.href = "/user/userSpace#/models/modelitem";
                                });


                            }
                            else{
                                //当change submitted时，其实数据库中已经更改了，但是对于消息数目来说还没有及时改变，所以在此处获取消息数目，实时更新导航栏消息数目，
                                let currentUrl = window.location.href;
                                let index = currentUrl.lastIndexOf("\/");
                                that.modelitem_oid = currentUrl.substring(index + 1,currentUrl.length);
                                console.log(that.modelitem_oid);

                                that.getMessageNum(that.modelitem_oid);
                                let params = that.message_num_socket;
                                that.send(params);
                                this.$alert('Changes have been submitted, please wait for the author to review.', 'Success', {
                                    type:"success",
                                    confirmButtonText: 'OK',
                                    callback: action => {
                                        window.location.href = "/user/userSpace";
                                    }
                                });
                            }
                        }
                        else if(result.code==-2){
                            this.$alert('Please login first!', 'Error', {
                                type:"error",
                                confirmButtonText: 'OK',
                                callback: action => {
                                    window.location.href="/user/login";
                                }
                            });
                        }
                        else{
                            this.$alert(result.msg, 'Error', {
                                type:"error",
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
        //
        //     let currentUrl = window.location.href;
        //     let index = currentUrl.lastIndexOf("\/");
        //     that.modelitem_oid = currentUrl.substring(index + 1,currentUrl.length);
        //     console.log(that.modelitem_oid);
        //     //当change submitted时，其实数据库中已经更改了，但是对于消息数目来说还没有及时改变，所以在此处获取消息数目，实时更新导航栏消息数目，
        //     that.getMessageNum(that.modelitem_oid);
        //     let params = that.message_num_socket;
        //     that.send(params);
        // });


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
                "                                                                                                            Affiliation:\n" +
                "                                                                                                        </lable>\n" +
                "                                                                                                        <div class='input-group col-sm-10'>\n" +
                "                                                                                                            <input type='text'\n" +
                "                                                                                                                   name=\"ins\"\n" +
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

        //var mid = window.sessionStorage.getItem("editModelItem_id");
        // if (mid === undefined || mid == null) {
        //     this.editorUrl = "http://127.0.0.1:8081http://127.0.0.1:8081/GeoModelingNew/modelItem/createModelItem.html";
        // } else {
        //     this.editorUrl = "http://127.0.0.1:8081http://127.0.0.1:8081/GeoModelingNew/modelItem/createModelItem.html?mid=" + mid;
        // }
    }
})