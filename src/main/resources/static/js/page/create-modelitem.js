var createModelItem = Vue.extend({
    template:'#createModelItem',

    components: {
        'avatar': VueAvatar.Avatar,
        // 'vue-cropper':VueCropper.
    },

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

            treeData_part1: [
                {
                    "children": [{
                        "children": [{
                            "id": 2,
                            "label": "Land regions",
                            "oid": "a24cba2b-9ce1-44de-ac68-8ec36a535d0e",
                            "desc": "Models that mainly related to land regions, includes hydrology, hydrodynamics, soil, landform, terrestrial ecosystem etc.",
                        }, {"id": 3, "label": "Ocean regions", "oid": "75aee2b7-b39a-4cd0-9223-3b7ce755e457",
                            "desc": "Models that mainly related to ocean regions, includes coastal, seawater, sea-ice, marine ecosystem etc.",
                        }, {
                            "id": 4,
                            "label": "Frozen regions",
                            "oid": "1bf4f381-6bd8-4716-91ab-5a56e51bd2f9",
                            "desc": "Models that mainly related to frozen regions, includes galicer, permafrost, snow etc.",
                        }, {"id": 5, "label": "Atmospheric regions", "oid": "8f4d4fca-4d09-49b4-b6f7-5021bc57d0e5",
                            "desc": "Models that mainly related to atmospheric regions, includes climate, weather, air etc.",
                        }, {
                            "id": 6,
                            "label": "Space-earth regions",
                            "oid": "d33a1ebe-b2f5-4ed3-9c76-78cfb61c23ee",
                            "desc": "Models that mainly related to space-earth regions, includes sun-earth, planets etc.",

                        }, {"id": 7, "label": "Solid-earth regions", "oid": "d3ba6e0b-78ec-4fe8-9985-4d5708f28e3e",
                            "desc": "Models that mainly related to solid-earth regions, includes lithosphere, mantle, earthquack etc.",
                        }
                        ], "id": 1, "label": "Natural-perspective", "oid": "6b2c8632-964a-4a65-a6c5-c360b2b515f0",
                        "desc": "Models that mainly related to physical geography.",

                    }, {
                        "children": [{
                            "id": 10,
                            "label": "Development activities",
                            "oid": "808e74a4-41c6-4558-a850-4daec1f199df",
                            "desc": "Models that mainly related to development activities, includes continents, countries, cities, administrative zones etc.",
                        }, {"id": 11, "label": "Social activities", "oid": "40534cf8-039a-4a0a-8db9-7c9bff484190",
                            "desc": "Models that mainly related to social activities, includes urban, rural, cultural area, travel area, built-up area, indoor area etc.",}, {
                            "id": 12,
                            "label": "Economic activities",
                            "oid": "cf9cd106-b873-4a8a-9336-dd72398fc769",
                            "desc": "Models that mainly related to economic activities, includes agriculture, industry, tourism, trasport, energy, markets etc.",
                        }],
                        "id": 9,
                        "label": "Human-perspective",
                        "oid": "77e7482c-1844-4bc3-ae37-cb09b61572da",
                        "desc": "Models that mainly related to human geography.",
                    }, {
                        "id": 30,
                        "label": "Integrated-perspective",
                        "oid": "396cc739-ef33-4332-8d5d-9a67c89567c7",
                        "desc": "Models that integrate many different models.",
                        "children": [{
                            "id": 31,
                            "label": "Global scale",
                            "oid": "14130969-fda6-41ea-aa32-0af43104840b",
                            "desc": "Integrated models that apply in global scale.",
                        }, {
                            "id": 32,
                            "label": "Regional scale",
                            "oid": "e56c1254-70b8-4ff4-b461-b8fa3039944e",
                            "desc": "Integrated models that apply in regional scale.",

                        }]
                    }],
                    "id": 24,
                    "label": "Application-focused categories",
                    "oid": "9f7816be-c6e3-44b6-addf-98251e3d2e19",
                    "desc": "Models that apply in one or more field.",
                },
            ],
            treeData_part2: [
                {"children": [{
                        "children": [{
                            "id": 15,
                            "label": "Geoinformation analysis",
                            "oid": "afa99af9-4224-4fac-a81f-47a7fb663dba",
                            "desc": "Models that mainly related to geoinformation analysis, includes vector analysis, raster analysis, network analysis, topology analysis etc.",
                        }, {
                            "id": 16,
                            "label": "Remote sensing analysis",
                            "oid": "f20411a5-2f55-4ee9-9590-c2ec826b8bd5",
                            "desc": "Models that mainly related to remote sensing analysis, includes imagery analysis, spectrum analysis etc.",
                        }, {
                            "id": 17,
                            "label": "Geostatistical analysis",
                            "oid": "1c876281-a032-4575-8eba-f1a8fb4560d8",
                            "desc": "Models that mainly related to geostatistical analysis, includes pattern detection, relation detection, clustering, interpolation etc.",
                        }, {
                            "id": 18,
                            "label": "Intelligent computation analysis",
                            "oid": "c6fcc899-8ca4-4269-a21e-a39d38c034a6",
                            "desc": "Models that mainly related to intelligent computation analysis, includes machine learning, deep learning etc.",
                        }],
                        "id": 14,
                        "label": "Data-perspective",
                        "oid": "4785308f-b2ef-4193-a74b-b9fe025cbc5e",
                        "desc": "Models that mainly related to data process.",
                    }, {
                        "children": [{
                            "id": 20,
                            "label": "Physical process calculation",
                            "oid": "1d564d0f-51c6-40ca-bd75-3f9489ccf1d6",
                            "desc": "Models that mainly related to physical process calculation, includes CFD, acoustic simulation, light simulation etc.",
                        }, {
                            "id": 21,
                            "label": "Chemical process calculation",
                            "oid": "63266a14-d7f9-44cb-8204-c877eaddcaa1",
                            "desc": "Models that mainly related to chemical process calculation, includes insecticide, photosynthesis, combustion etc.",
                        }, {
                            "id": 22,
                            "label": "Biological process calculation",
                            "oid": "6d1efa2c-830d-4546-b759-c66806c4facc",
                            "desc": "Models that mainly related to biological process calculation, includes genome, metabolic, cellular simulation etc.",
                        }, {
                            "id": 23,
                            "label": "Human-activity calculation",
                            "oid": "6952d5b2-cb0f-4ba7-96fd-5761dd566344",
                            "desc": "Models that mainly related to human-activity calculation, includes monte carlo, CA, agent-based, travel, crime, disease, migration, health etc.",
                        }],
                        "id": 19,
                        "label": "Process-perspective",
                        "oid": "746887cf-d490-4080-9754-1dc389986cf2",
                        "desc": "Models that mainly related to process.",
                    }], "id": 25, "label": "Method-focused categories", "oid": "5f74872a-196c-4889-a7b8-9c9b04e30718",
                    "desc": "Models that mainly related to method.",
                }],
            treeData_select:[],
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            cls: [],
            clsStr: '',
            status: 'Public',
            curClassDesc: {
                label:'',
                desc:"Move your mouse to a classification to learn more."
            },
            nodekeys: [],
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

        itemName:'',

        draft:{
            oid:'',
        },

        draftOid:'',

        toCreate: 1,

        timeOut:{},

        savingDraft:false,

        step:1,

        draftList:[],

        draftListDialog:false,

        matchedDraft:{},

        matchedCreateDraft:{},

        matchedCreateDraftDialog:false,

        draftLoading:false,

        pageOption: {
            paginationShow:false,
            progressBar: true,
            sortAsc: false,
            currentPage: 1,
            pageSize: 10,

            total: 11,
            searchResult: [],
        },

        inSearch:0,

        imgClipDialog:false,

        cancelDraftDialog:false,

        loading:true,

            dragReady:false,

            itemInfo: {
                image: '',
            },
            editType: "",//create,modify
            currentLocalization: {
                localCode: "",
                localName: "",
                name: "",
                description: "",
            },
            localIndex: 0,
            languageAdd: {
                show: false,
                local: {

                },
            },
            localizationList: [
                {
                    localCode: "en",
                    localName: "English",
                    name: "",
                    description: "",
                    selected: true,
                }
            ],
            languageList:[
                { value: 'af', label: 'Afrikaans' },
                { value: 'sq', label: 'Albanian' },
                { value: 'ar', label: 'Arabic' },
                { value: 'hy', label: 'Armenian' },
                { value: 'az', label: 'Azeri' },
                { value: 'eu', label: 'Basque' },
                { value: 'be', label: 'Belarusian' },
                { value: 'bg', label: 'Bulgarian' },
                { value: 'ca', label: 'Catalan' },
                { value: 'zh', label: 'Chinese' },
                { value: 'hr', label: 'Croatian' },
                { value: 'cs', label: 'Czech' },
                { value: 'da', label: 'Danish' },
                { value: 'dv', label: 'Divehi' },
                { value: 'nl', label: 'Dutch' },
                { value: 'en', label: 'English' },
                { value: 'eo', label: 'Esperanto' },
                { value: 'et', label: 'Estonian' },
                { value: 'mk', label: 'FYRO Macedonian' },
                { value: 'fo', label: 'Faroese' },
                { value: 'fa', label: 'Farsi' },
                { value: 'fi', label: 'Finnish' },
                { value: 'fr', label: 'French' },
                { value: 'gl', label: 'Galician' },
                { value: 'ka', label: 'Georgian' },
                { value: 'de', label: 'German' },
                { value: 'el', label: 'Greek' },
                { value: 'gu', label: 'Gujarati' },
                { value: 'he', label: 'Hebrew' },
                { value: 'hi', label: 'Hindi' },
                { value: 'hu', label: 'Hungarian' },
                { value: 'is', label: 'Icelandic' },
                { value: 'id', label: 'Indonesian' },
                { value: 'it', label: 'Italian' },
                { value: 'ja', label: 'Japanese' },
                { value: 'kn', label: 'Kannada' },
                { value: 'kk', label: 'Kazakh' },
                { value: 'kok', label: 'Konkani' },
                { value: 'ko', label: 'Korean' },
                { value: 'ky', label: 'Kyrgyz' },
                { value: 'lv', label: 'Latvian' },
                { value: 'lt', label: 'Lithuanian' },
                { value: 'ms', label: 'Malay' },
                { value: 'mt', label: 'Maltese' },
                { value: 'mi', label: 'Maori' },
                { value: 'mr', label: 'Marathi' },
                { value: 'mn', label: 'Mongolian' },
                { value: 'ns', label: 'Northern Sotho' },
                { value: 'nb', label: 'Norwegian' },
                { value: 'ps', label: 'Pashto' },
                { value: 'pl', label: 'Polish' },
                { value: 'pt', label: 'Portuguese' },
                { value: 'pa', label: 'Punjabi' },
                { value: 'qu', label: 'Quechua' },
                { value: 'ro', label: 'Romanian' },
                { value: 'ru', label: 'Russian' },
                { value: 'se', label: 'Sami' },
                { value: 'sa', label: 'Sanskrit' },
                { value: 'sr', label: 'Serbian' },
                { value: 'sk', label: 'Slovak' },
                { value: 'sl', label: 'Slovenian' },
                { value: 'es', label: 'Spanish' },
                { value: 'sw', label: 'Swahili' },
                { value: 'sv', label: 'Swedish' },
                { value: 'syr', label: 'Syriac' },
                { value: 'tl', label: 'Tagalog' },
                { value: 'ta', label: 'Tamil' },
                { value: 'tt', label: 'Tatar' },
                { value: 'te', label: 'Telugu' },
                { value: 'th', label: 'Thai' },
                { value: 'ts', label: 'Tsonga' },
                { value: 'tn', label: 'Tswana' },
                { value: 'tr', label: 'Turkish' },
                { value: 'uk', label: 'Ukrainian' },
                { value: 'ur', label: 'Urdu' },
                { value: 'uz', label: 'Uzbek' },
                { value: 'vi', label: 'Vietnamese' },
                { value: 'cy', label: 'Welsh' },
                { value: 'xh', label: 'Xhosa' },
                { value: 'zu', label: 'Zulu' },
            ],

            dynamicTable:{},

            startDraft:0,
        }

    },

    computed(){

    },

    methods: {
        addLocalization() {
            this.languageAdd.show = true;
        },
        confirmAddLocal() {

            if (this.languageAdd.local.label == undefined) {
                this.$message({
                    message: 'Please selcet a language!',
                    type: 'warning'
                });
                return;
            }
            for (i = 0; i < this.localizationList.length; i++) {
                let localization = this.localizationList[i];
                if (localization.localName == this.languageAdd.local.label) {
                    this.$message({
                        message: 'This language already exists!',
                        type: 'warning'
                    });
                    return;
                }
            }

            let newLocalization = {
                localCode: this.languageAdd.local.value,
                localName: this.languageAdd.local.label,
                name: "",
                description: "",
            };
            this.localizationList.push(newLocalization);
            this.languageAdd.local = {};

            this.changeLocalization(newLocalization);
        },
        cancelAddLocal() {
            this.languageAdd.show = false;
        },
        deleteLocalization(row) {
            this.$confirm('Do you want to delete <b>' + row.localName + '</b> description?', 'Warning', {
                dangerouslyUseHTMLString: true,
                confirmButtonText: 'Yes',
                cancelButtonText: 'No',
                type: 'warning'
            }).then(() => {

                for (i = 0; i < this.localizationList.length; i++) {
                    let localization = this.localizationList[i]
                    if (localization.localName == row.localName) {
                        this.localizationList.splice(i, 1);
                        break;
                    }
                }
                if (this.localizationList.length > 0) {
                    this.changeLocalization(this.localizationList[0]);
                } else {
                    this.changeLocalization(null);
                }

                this.$message({
                    type: 'success',
                    message: 'Delete ' + row.localName + ' successfully!',
                });
            }).catch(() => {

            });

        },
        changeLocalization(row) {
            if (row == null) {
                this.currentLocalization = {
                    localCode: "",
                    localName: "",
                    name: "",
                    description: "",
                };
                tinymce.activeEditor.setContent("");
                // tinymce.undoManager.clear();
            } else {
                for (i = 0; i < this.localizationList.length; i++) {
                    this.$set(this.localizationList[i], "selected", false);
                    if (this.currentLocalization.localName == this.localizationList[i].localName) {
                        this.localizationList[i].name = this.currentLocalization.name;
                        this.localizationList[i].description = tinymce.activeEditor.getContent();
                        break;
                    }
                }
                this.$set(row, "selected", true);
                this.currentLocalization = row;
                tinymce.activeEditor.setContent(row.description);
                // tinymce.undoManager.clear();
            }
        },
        formatDate(value,callback) {
            const date = new Date(value);
            y = date.getFullYear();
            M = date.getMonth() + 1;
            d = date.getDate();
            H = date.getHours();
            m = date.getMinutes();
            s = date.getSeconds();
            if (M < 10) {
                M = '0' + M;
            }
            if (d < 10) {
                d = '0' + d;
            }
            if (H < 10) {
                H = '0' + H;
            }
            if (m < 10) {
                m = '0' + m;
            }
            if (s < 10) {
                s = '0' + s;
            }

            const t = y + '-' + M + '-' + d + ' ' + H + ':' + m + ':' + s;
            if(callback == null||callback == undefined)
                return t;
            else
                callback(t);
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
        //         classes.push(checkedNodes[i].oid);
        //         str+=checkedNodes[i].label;
        //         if(i!=checkedNodes.length-1){
        //             str+=", ";
        //         }
        //     }
        //     this.cls=classes;
        //     this.clsStr=str;
        //
        // },

        //共三个参数，依次为：传递给 data 属性的数组中该节点所对应的对象、节点本身是否被选中、节点的子树中是否有被选中的节点
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

        //drafts
        onInputName(){
            if(this.toCreate==1){
                this.toCreate=0
                this.startDraft=1
                this.timeOut=setTimeout(()=>{
                    this.toCreate=1
                },30000)
                setTimeout(()=>{
                    this.createDraft()
                },300)
            }
        },

        getStep(){
            let domID=$('.step-tab-panel.active')[0].id
            return parseInt(domID.substring(domID.length-1,domID.length))
        },

        getItemContent(trigger,callBack) {//trigger标识是finish触发还是存草稿
            let modelItemObj = {}
            modelItemObj.status=this.status;
            this.cls = [];
            for(i=0;i<this.treeData_select.length;i++){
                this.cls.push(this.treeData_select[i].oid);
            }
            modelItemObj.classifications2 = this.cls;//[$("#parentNode").attr("pid")];
            modelItemObj.name = $("#nameInput").val();
            modelItemObj.alias = $("#aliasInput").val().split(",");
            if (modelItemObj.alias.length === 1 && modelItemObj.alias[0] === "") {
                modelItemObj.alias = [];
            }
            modelItemObj.keywords = $("#tagInput").val().split(",");
            modelItemObj.description = $("#descInput").val();
            // modelItemObj.uploadImage = $('#imgShow').get(0).currentSrc;
            modelItemObj.uploadImage = this.itemInfo.image;
            modelItemObj.authorship=[];
            userspace.getUserData($("#providersPanel .user-contents .form-control"), modelItemObj.authorship);


            if(this.editType == 'modify') {

                for (i = 0; i < this.localizationList.length; i++) {
                    if (this.currentLocalization.localName == this.localizationList[i].localName) {
                        this.localizationList[i].name = this.currentLocalization.name;
                        this.localizationList[i].description = tinymce.activeEditor.getContent();
                        break;
                    }
                }
                modelItemObj.localizationList = this.localizationList;

            }else {
                modelItemObj.localizationList = [];

                this.currentLocalization.description = tinymce.activeEditor.getContent();
                this.currentLocalization.localCode = this.languageAdd.local.value;
                this.currentLocalization.localName = this.languageAdd.local.label;

                modelItemObj.localizationList.push(this.currentLocalization);
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

            if(callBack){
                callBack(modelItemObj)
            }
            return modelItemObj
        },

        createDraft(){//请求后台创建一个草稿实例,如果存在则更新

            var step = this.getStep()
            let content=this.getItemContent(step)

            let urls=window.location.href.split('/')
            let item=urls[6]
            item=item.substring(6,item.length)
            let obj={
                content:content,
                editType:this.editType,
                user:this.userId,
                oid:this.draft.oid,
            }
            if(this.editType) {
                obj.itemOid=this.$route.params.editId?this.$route.params.editId:null
                obj.itemName= this.itemName;
            }

           this.$refs.draftBox.createDraft(obj)
        },

        loadMatchedCreateDraft(){
            this.$refs.draftBox.loadMatchedCreateDraft()
        },

        getMatchedNode(oids){
            this.getMatchedNode_DIGUI(this.treeData_part1,oids);
            this.getMatchedNode_DIGUI(this.treeData_part2,oids);

        },
        getMatchedNode_DIGUI(children, oids){
            let i = 0;
            let j = 0;
            for(;i<children.length;i++){
                let child = children[i];
                if(child.children!=null){
                    this.getMatchedNode_DIGUI(child.children, oids);
                }else {
                    for (j = 0; j < oids.length; j++) {
                        if (child.oid == oids[j]) {
                            this.treeData_select.push(child);
                            this.nodekeys.push(child.id);
                            break;
                        }
                    }
                }
            }
        },

        getDraft(){
            return this.$refs.draftBox.getDraft();
        },

        insertDraft(draftContent){
            this.insertInfo(draftContent)
        },

        insertInfo(basicInfo){
            this.cls = basicInfo.classifications2;
            this.cls = this.cls == null?[]:this.cls;
            this.status = basicInfo.status;

            this.getMatchedNode(this.cls);
            this.$refs.tree2.setCheckedKeys(this.nodekeys);
            this.$refs.tree3.setCheckedKeys(this.nodekeys);

            $(".providers").children(".panel").remove();

            let authorship = basicInfo.authorship;
            let user_num = 0
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
            this.itemName=basicInfo.name
            //image
            // if (basicInfo.uploadImage != "") {
                this.itemInfo.image = basicInfo.image
            // }
            //reference

            this.dynamicTable.clear().draw();
            for (i = 0; i < basicInfo.references.length; i++) {
                var ref = basicInfo.references[i];
                this.dynamicTable.row.add([
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
            initTinymce('textarea#conceptText')
            this.localizationList = basicInfo.localizationList;
            let interval = setInterval(() => {
                this.changeLocalization(this.localizationList[0])
                clearInterval(interval);
            }, 1000);

            //alias
            $('#aliasInput').tagEditor('destroy');
            $('#aliasInput').tagEditor({
                initialTags: basicInfo.alias ,
                forceLowercase: false,
                // placeholder: 'Enter alias ...'
            });

            // //detail
            // tinyMCE.remove(tinyMCE.editors[0])
            // $("#modelItemText").html(content.detail);//可能会赋值不成功
            // $("#modelItemText").val(content.detail);
            // initTinymce('textarea#modelItemText')

        },

        cancelEditClick(){
            if(this.getDraft()!=null){
                this.$refs.draftBox.cancelDraftDialog=true
            }else{
                setTimeout(() => {
                    window.location.href = "/user/userSpace#/models/modelitem";
                }, 305)
            }
        },

        draftJump(){
            window.location.href = '/user/userSpace#/models/modelitem';
        },

        deleteDraft(){
            this.$refs.draftBox.deleteDraft()//draft的oid在draftbox组件里存储了
        },

        initDraft(editType,backUrl,oidFrom,oid){
            this.$refs.draftBox.initDraft(editType,backUrl,oidFrom,oid)
        },

        // checkItem(item){
        //     let itemType = item.itemType.substring(0,1).toLowerCase()+item.itemType.substring(1)
        //     window.location.href='/'+itemType+'/'+item.itemOid
        // },


        //reference
        searchDoi(){
            if(this.doi == ''){
                this.$alert('Please input the DOI', 'Tip', {
                        type:"warning",
                        confirmButtonText: 'OK',
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
                let modelOid=this.$route.params.editId?this.$route.params.editId:''
                $.ajax({
                    type: "POST",
                    url: "/modelItem/searchByDOI",
                    data: {
                        doi: this.doi,
                        modelOid:modelOid
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
                                    confirmButtonText: 'OK',
                                    callback: ()=>{
                                        return
                                    }
                                }
                            );
                        }else if(data.find==0){
                            this.$alert('Find no result, check the DOI you have input or fill information manually.', 'Tip', {
                                    type:"warning",
                                    confirmButtonText: 'OK',
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
                                confirmButtonText: 'OK',
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
                        confirmButtonText: 'OK',
                        callback: ()=>{
                            return
                        }
                    }
                );
                return;
            }

            let tags1 = $('#refAuthor').tagEditor('getTags')[0].tags;
            for (i = 0; i < tags1.length; i++) { $('#refAuthor').tagEditor('removeTag', tags1[i]); }
            if (tags1.length>0&&$("#refTitle").val()!='') {
                this.dynamicTable.row.add([
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

            this.editArticleDialog = false
           //调用$("#modal_save").click完成

        },

        cancelSearch() {
            this.editArticleDialog = false
        },

        articleDoiUploadConfirm(status) {
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
                        // $("#refAuthor").tagEditor({
                        //     forceLowercase: false
                        // })
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

        imgUpload(){
            this.imgClipDialog = true
            this.$nextTick(()=>{
                let canvas = document.getElementsByTagName('canvas')[0]
                canvas.style.backgroundImage = ''

                context = canvas.getContext('2d');
                //清除画布
                context.clearRect(0,0,200,200);

                document.getElementsByClassName('dragBlock')[0].style.left = '-7px'
            })

        },

        closeImgUpload(){
            this.dragReady = false
        },

        deleteImg(){
            let obj = document.getElementById('imgOne')
            // obj.outerHTML=obj.outerHTML
            obj.value = ''
            this.itemInfo.image = ''
        },

        editImg(){
            this.imgClipDialog = true
            this.$nextTick(()=>{
                let canvas = document.getElementsByTagName('canvas')[0]
                // canvas.style.backgroundImage = this.itemInfo.image

                context = canvas.getContext('2d');
                //清除画布
                // context.clearRect(0,0,150,150);

                document.getElementsByClassName('dragBlock')[0].style.left = '-7px'
            })
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

            // if ('WebSocket' in window) {
            //     // this.socket = new WebSocket("ws://localhost:8080/websocket");
            //     this.socket = new WebSocket(websocketAddress);
            //     // 监听socket连接
            //     this.socket.onopen = this.open;
            //     // 监听socket错误信息
            //     this.socket.onerror = this.error;
            //     // 监听socket消息
            //     this.socket.onmessage = this.getMessage
            //
            // }
            // else {
            //     alert('当前浏览器 Not support websocket');
            //     console.log("websocket 无法连接");
            // }
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

        }

    },

    destroyed () {
        // 销毁监听
        this.socket.onclose = this.close
    },

    created(){

    },

    mounted() {

        let that = this;
        var vthis = this;
        that.init();

        (()=>{
            window.onresize = () => {
                this.editImageContainerWidth = this.$refs.editImageContainer.offsetWidth;
            };

        })()

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

            $(".el-tree-node__content").on("mouseenter",(event)=>{
                let name = event.currentTarget.children[2].innerText
                let desc = this.getClassificationDesc(name)
                this.curClassDesc = desc;
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
                // data=JSON.parse(data);
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

        this.draft.oid=window.localStorage.getItem('draft');
        var user_num = 0;

        if ((oid === "0") || (oid === "") || (oid === null)|| (oid === undefined)) {

            this.editType = 'create';
            // $("#title").text("Create Model Item")
            $("#subRteTitle").text("/Create Model Item");

            let interval = setInterval(function () {
                initTinymce('textarea#singleDescription');
                clearInterval(interval);
            }, 500);

            this.$set(this.languageAdd.local, "value", "en");
            this.$set(this.languageAdd.local, "label", "English");
            initTinymce('textarea#modelItemText');

            if(this.draft.oid!=''&&this.draft.oid!=null&&typeof (this.draft.oid)!="undefined"){
                // this.loadDraftByOid()
                this.initDraft('create','/user/userSpace#/models/modelitem','draft',this.draft.oid)
            }else{
                this.loadMatchedCreateDraft();
            }

        }
        else {

            this.editType = 'modify';
            if(this.draft.oid==''||this.draft.oid==null||typeof (this.draft.oid)=="undefined"){
                this.initDraft('edit','/user/userSpace#/models/modelitem','item',this.$route.params.editId)
            }else{
                this.initDraft('edit','/user/userSpace#/models/modelitem','draft',this.draft.oid)
            }
                // $("#title").text("Modify Model Item")
            $("#subRteTitle").text("/Modify Model Item");

            // document.title="Modify Model Item | OpenGMS"
            if(window.localStorage.getItem('draft')==null){
                $.ajax({
                    url: "/modelItem/getInfo/" + oid,
                    type: "get",
                    data: {},

                    success: (result) => {
                        console.log(result);
                        var basicInfo = result.data;

                        this.insertInfo(basicInfo)
                    }
                })
            }

            // window.sessionStorage.setItem("editModelItem_id", "");
        }

        window.localStorage.removeItem('draft');
        // if(this.draft.oid!=''&&this.draft.oid!=null&&typeof (this.draft.oid)!="undefined")
        //     this.loadDraftByOid()

        $("#step").steps({
            onFinish: function () {

            },
            onChange: (currentIndex, newIndex, stepDirection) => {
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
                    if ($("#nameInput").val().trim() == "") {
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
                        if(this.draft.oid!='')
                            this.createDraft();
                        return true;
                    }
                } else{
                    // this.saveDraft();
                    return true;
                }
            }
        });


        $('#tagInput').tagEditor({
            forceLowercase: false
        });
         $('#aliasInput').tagEditor({
            forceLowercase: false
        });
        $("#refAuthor").tagEditor({
            forceLowercase: false
        })

        // $("#imgChange").click(function () {
        //     $("#imgFile").click();
        // });
        // $("#imgFile").change(function () {
        //     //获取input file的files文件数组;
        //     //$('#filed')获取的是jQuery对象，.get(0)转为原生对象;
        //     //这边默认只能选一个，但是存放形式仍然是数组，所以取第一个元素使用[0];
        //     var file = $('#imgFile').get(0).files[0];
        //     //创建用来读取此文件的对象
        //     var reader = new FileReader();
        //     //使用该对象读取file文件
        //     reader.readAsDataURL(file);
        //     //读取文件成功后执行的方法函数
        //     reader.onload = function (e) {
        //         //读取成功后返回的一个参数e，整个的一个进度事件
        //         //选择所要显示图片的img，要赋值给img的src就是e中target下result里面
        //         //的base64编码格式的地址
        //         // $('#imgShow').get(0).src = e.target.result;
        //         // $('#imgShow').show();
        //     }
        // });

        //table
        this.dynamicTable = $('#dynamic-table').DataTable({
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

        // $("#modal_save").click(function () {
        //
        //
        // })
        //table end

        $(document).on("click", ".refClose", function () {
            vthis.dynamicTable.row($(this).parents("tr")).remove().draw();
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

            modelItemObj = this.getItemContent('finish')

            let formData = new FormData();

            const loading = userspace.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });

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
                        loading.close();
                        if (result.code == 0) {
                            this.deleteDraft()
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

                formData.append("info", file);
                userspace.fullscreenLoading = true;
                $.ajax({
                    url: "/modelItem/update",
                    type: "POST",
                    processData: false,
                    contentType: false,
                    async: true,
                    data: formData,

                    success: (result)=> {
                        // setTimeout(()=>{loading.close();},1000)
                        loading.close();
                        userspace.fullscreenLoading = false;
                        if (result.code === 0) {
                            this.deleteDraft()
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

                                // that.getMessageNum(that.modelitem_oid);
                                // let params = that.message_num_socket;
                                // that.send(params);
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


        $(document).on("click", ".author_close", function () {
            $(this).parents(".panel").eq(0).remove();
        });


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

        const timer = setInterval(()=>{
            if(this.itemName!=''&&this.startDraft==1){
                this.createDraft()
            }
        },30000)


        this.$once('hook:beforeDestroy', ()=>{
            clearInterval(timer)
            clearTimeout(this.timeOut)
        })

        //var mid = window.sessionStorage.getItem("editModelItem_id");
        // if (mid === undefined || mid == null) {
        //     this.editorUrl = "http://127.0.0.1:8081http://127.0.0.1:8081/GeoModelingNew/modelItem/createModelItem.html";
        // } else {
        //     this.editorUrl = "http://127.0.0.1:8081http://127.0.0.1:8081/GeoModelingNew/modelItem/createModelItem.html?mid=" + mid;
        // }

        //上传头像
        var targetW,targetH//设为上层变量便于后续调用
        var maxW,maxH,canvas,context,oImg,oldTarW,oldTarH,endX,endY

        function fileUpload(fileInput,size,callBack){
            //获取input file的files文件数组;
            //$('#filed')获取的是jQuery对象，.get(0)转为原生对象;
            //这边默认只能选一个，但是存放形式仍然是数组，所以取第一个元素使用[0];
            var file = fileInput.files[0];
            let fileSize = (file.size / 1024).toFixed(0)
            // if(fileSize>size){
            //     alert('The upload file should be less than 1.5M')
            //     return
            // }
            callBack(file);
        }
        $("#imgChange").click(function () {
            imgChange();
        })

        function imgChange(){
            $("#imgFile").click()
            $("#imgFile").change(function () {

                fileUpload(this,2048,function (file) {

                    //创建一个图像对象，用于接收读取的文件
                    oImg=new Image();
                    //创建用来读取此文件的对象
                    var reader = new FileReader();
                    //使用该对象读取file文件
                    reader.readAsDataURL(file);
                    //读取文件成功后执行的方法函数
                    reader.onload = function (e) {
                        //读取成功后返回的一个参数e，整个的一个进度事件
                        //选择所要显示图片的img，要赋值给img的src就是e中target下result里面
                        //的base64编码格式的地址
                        // $('#imgShowBig').get(0).src = this.result;
                        oImg.src=this.result
                    }
                    targetW=0
                    targetH=0
                    //图像加载完成绘制canvas
                    oImg.onload = ()=>{
                        canvas = document.createElement('canvas');
                        context = canvas.getContext('2d');

                        let originW = oImg.width;//图像初始宽度
                        let originH = oImg.height;

                        maxW=160
                        maxH=160
                        targetW=originW
                        targetH=originH

                        //设置canvas的宽、高
                        canvas.width=200
                        canvas.height=200

                        var positionX
                        var positionY
                        //判断图片是否超过限制  等比缩放
                        if(originW > maxW || originH > maxH) {
                            if(originH/originW < maxH/maxW) {//图片宽
                                targetH = maxH;
                                targetW = Math.round(maxH * (originW / originH));
                                positionX=100-targetW/2+'px'
                                positionY='20px'
                                canvas.style.backgroundSize = "auto 160px "
                            }else {
                                targetW = maxW;
                                targetH = Math.round(maxW * (originH / originW));
                                positionX='20px'
                                positionY=100-targetH/2+'px'
                                console.log(positionY)
                                canvas.style.backgroundSize = "160px auto"

                            }
                        }

                        if(originW <= maxW || originH <= maxH) {
                            if(originH/originW < maxH/maxW) {//图片宽
                                targetH = maxH;
                                targetW = Math.round(maxH * (originW / originH));
                                positionX=100-targetW/2+'px'
                                positionY='10px'
                                canvas.style.backgroundSize = "auto 160px "
                            }else {
                                targetW = maxW;
                                targetH = Math.round(maxW * (originH / originW));
                                positionX='10px'
                                positionY=100-targetH/2+'px'
                                console.log(positionY)
                                canvas.style.backgroundSize = "160px auto"
                            }
                        }

                        oldTarW=targetW
                        oldTarH=targetH
                        //清除画布
                        context.clearRect(0,0,200,200);

                        let img="url("+oImg.src+")";
                        console.log(oImg.src===img)

                        canvas.style.backgroundPositionX = positionX
                        canvas.style.backgroundPositionY = positionY

                        endX=positionX
                        endY=positionY

                        // canvas.style.backgroundPositionY = positionY
                        canvas.style.backgroundImage = img
                        // var back= context.createPattern(oImg,"no-repeat")
                        // context.fillStyle=back;
                        // context.beginPath()
                        // if(originW>originH)
                        //     context.fillRect(0,10,targetW,targetH);
                        // else
                        //     context.fillRect(10,0,targetW,targetH);
                        // context.closePath()

                        // 利用drawImage将图片oImg按照目标宽、高绘制到画布上
                        // if(originW>originH)
                        //     context.drawImage(oImg,0,10,targetW,targetH);
                        // else
                        //     context.drawImage(oImg,10,0,targetW,targetH);

                        context.fillStyle = 'rgba(217,217,217,.55)';
                        context.beginPath()
                        context.rect(0,0,200,200);
                        context.closePath()
                        context.fill()

                        context.globalCompositeOperation='destination-out'

                        context.fillStyle='yellow'
                        context.beginPath()
                        context.rect(20,20,160,160)
                        context.closePath()
                        context.fill();

                        canvas.toBlob(function (blob) {
                            console.log(blob);
                            //之后就可以对blob进行一系列操作
                        },file.type || 'image/png');
                        $('.circlePhotoFrame').eq(0).children('canvas').remove();
                        document.getElementsByClassName('circlePhotoFrame')[0].appendChild(canvas);
                        // $('.dragBar').eq(0).css('background-color','#cfe5fa')

                        vthis.dragReady=true

                        document.getElementsByClassName('dragBlock')[0].style.left = '-7px'//滚动条归位
                    }

                })



            });

        }

        function canvasToggle(){
            var startX,startY,moveX,moveY,width,height,posX,posY,limitX,limitY,leaveX,leaveY,
                lastX,lastY,dirR,dirD,noUseMoveR,noUseMoveD
            var dragable=false
            console.log('~~~~~~'+targetW,targetH)
            $(document).off('mousemove')
            $(document).off('mousedown')
            $(document).on('mousedown','canvas',(e)=>{
                $('.circlePhotoFrame').eq(0).children('canvas').css('cursor','grabbing')
                var canvas = e.currentTarget
                startX = e.pageX;
                startY = e.pageY;

                lastX = startX
                lastY = startY

                leaveX = 0
                leaveY = 0
                console.log(startX,startY)
                posX=canvas.style.backgroundPositionX.split('p')[0]
                posY=canvas.style.backgroundPositionY.split('p')[0]

                endX=canvas.style.backgroundPositionX
                endY=canvas.style.backgroundPositionX

                // console.log(e.currentTarget)
                dragable=true
                return;
            })

            $(document).on('mousemove',(e)=>{
                if (dragable === true) {
                    console.log($('.circlePhotoFrame').eq(0).children('canvas'))
                    console.log(targetW)
                    var canvas = document.getElementsByTagName('canvas')[0]

                    limitX=targetW-maxW
                    limitY=targetH-maxH

                    let maxMoveXR=20-parseFloat(posX)
                    let maxMoveXD=20-parseFloat(posY)

                    if(e.pageX>lastX) dirR=1  //向左方向值
                    else dirR=-1

                    if(e.pageY>lastY) dirD=1  //向下方向值
                    else dirD=-1

                    console.log(e.pageX - startX)

                    if(e.pageX - startX>maxMoveXR){
                        if(dirR===1){
                            lastX = e.pageX
                            noUseMoveR=e.pageX - startX - maxMoveXR
                            console.log('nouse'+noUseMoveR)
                        }

                        else{
                            lastX = e.pageX
                            // e.pageX-=noUseMoveR
                            console.log('left'+e.pageX)
                            console.log(e.pageX - startX)
                        }

                    }else{
                        lastX = e.pageX
                    }


                    lastY = e.pageY

                    moveX = e.pageX - startX;
                    moveY = e.pageY - startY;

                    endX = moveX + parseFloat(posX)
                    endY = moveY + parseFloat(posY)

                    console.log(moveX, moveY)

                    console.log(endX, endY)
                    if (endX <= 20&&endX>=-limitX+20) {
                        endX = endX + 'px'
                        canvas.style.backgroundPositionX = endX
                    }

                    if (endY <= 20&&endY>=-limitY+20) {
                        endY = endY + 'px'
                        canvas.style.backgroundPositionY = endY
                    }


                }
            })

            $(document).on('mouseup',(e)=>{
                dragable = false
                $('.circlePhotoFrame').eq(0).children('canvas').css('cursor','grab')
                // $('.circlePhotoFrame').off('mousemove','canvas')
                // var canvas=e.currentTarget
                // endX=e.pageX-startX;
                // endY=e.pageY-startY;
                // endX=endX+'px'
                // endY=endY+'px'
                // // console.log(e.currentTarget)
                // canvas.style.backgroundPositionX=endX
                // canvas.style.backgroundPositionY=endY
            })

            $(document).on('mouseleave','canvas',(e)=>{
                leaveX=e.pageX
                leaveY=e.pageY
                // dragable = false

            })

            $("#saveUserImgButton").click(()=>{

                let x=parseFloat(canvas.style.backgroundPositionX.split('p')[0])
                let y=parseFloat(canvas.style.backgroundPositionY.split('p')[0])

                // var back= context.createPattern(oImg,"no-repeat")
                context.globalCompositeOperation='source-out'
                // context.fillStyle=back;
                // context.beginPath()
                // context.fillRect(0,10,targetW,targetH);
                //
                // context.closePath()
                context.clearRect(0,0,200,200)
                canvas.style.backgroundImage = ""
                if(targetW<targetH){
                    let nx=0-(20-x)/160*200
                    let ny=0-(20-y)/160*200
                    context.drawImage(oImg,nx,ny,targetW/160*200,targetH/160*200);
                }else{
                    let nx=0-(20-x)/160*200
                    let ny=0-(20-y)/160*200
                    context.drawImage(oImg,nx,ny,targetW/160*200,targetH/160*200);
                }
                let url= canvas.toDataURL();
                saveImage(url)
            })
        }

        function dragBar() {
            // 获取元素
            var block = $('.dragBlock').eq(0);
            var bar = $('.dragBar').eq(0);
            var left,leftStart,leftPos,leaveLeft,times,newTW=targetW,newTH=targetH,newX,newY
            length=bar.width()

            var dragBarAble=false

            // 拖动原理
            $(document).on('mousedown','.dragBlock',(e)=>{
                dragBarAble=true
                leftStart=e.pageX
                leaveLeft=0
                left=block.css('left')
                console.log(leftStart)
                return;
            })

            $(document).on('mousemove',(e)=>{
                if(dragBarAble==true&&vthis.dragReady==true){
                    var move=e.pageX-leftStart

                    let x=parseFloat(canvas.style.backgroundPositionX.split('p')[0])
                    let y=parseFloat(canvas.style.backgroundPositionY.split('p')[0])

                    leftPos=move + parseFloat(left)

                    if(leftPos>=-7&&leftPos<=length-7){//减去block自身半径

                        times=(leftPos+7+100)/100  //算出加大倍数

                        newTW=oldTarW*times
                        newTH=oldTarH*times

                        let backgsize=newTW+'px'+' '+newTH+"px"
                        console.log(backgsize)
                        canvas.style.backgroundSize=backgsize

                        let timesP=newTW/targetW

                        // let eX,eY
                        // if(typeof(endX)=='string'){
                        //     eX=parseFloat(endX.split('p')[0])
                        //     eY=parseFloat(endY.split('p')[0])
                        // }else{
                        //     eX=endX
                        //     eY=endY
                        // }
                        // eX=75-(75-x)/times
                        // eY=75-(75-y)/times
                        // console.log(eX,eY)

                        newX=100-(100-x)*timesP
                        newY=100-(100-y)*timesP
                        if(newY>20)//防止缩放超出边界
                            newY=20
                        else if(newY+newTH<180)
                            newY=180-newTH
                        if(newX>20)
                            newX=20
                        else if(newX+newTW<180)
                            newX=180-newTW
                        console.log(timesP)
                        console.log("wz"+newX,newY)

                        newX=newX+'px'
                        newY=newY+'px'

                        canvas.style.backgroundPositionX = newX
                        canvas.style.backgroundPositionY = newY

                        leftPos=leftPos+'px'
                        console.log(leftPos)
                        block.css('left',leftPos)

                        targetW=newTW
                        targetH=newTH
                    }

                }
            })

            $(document).on('mouseup',(e)=>{
                dragBarAble=false
            })

            $(document).on('mouseleave','.dragBlock',(e)=>{
                leaveLeft=e.pageX
                // dragable = false

            })

        }

        canvasToggle();

        dragBar();

        function saveImage(img) {

            // $('#imgShow').get(0).src = img;
            // $('#imgShow').show();
            vthis.itemInfo.image = img
            vthis.loading=true
            vthis.dragReady=false
            setTimeout(()=>{
                vthis.imgClipDialog=false
                vthis.loading=false
            },150)

        }

    }
})
