var info=new Vue({
    el: '#app',
    components: {
        'avatar': VueAvatar.Avatar,
    },
    data: function () {
        return {
            authorshipFormVisible: false,
            authorshipForm:{
                name:'',
                ins:'',
                email:'',
                homepage:'',
                oid:'',
            },
            formLabelWidth: '120px',
            //comment
            commentText: "",
            commentParentId:null,
            commentList:[],
            replyToUserId:"",
            commentTextAreaPlaceHolder:"Write your comment...",
            replyTo:"",

            dialogTableVisible: false,
            relatedResourceVisible:false,

            relateSearch: "",
            relateType: "",
            typeName: "",
            relateTitle: "",
            tableMaxHeight: 400,
            tableData: [{
                relation:"Connected with",
            }],

            //详情描述语言
            currentDetailLanguage:"",
            detailLanguageList:[],
            detail:"",


            pageOption_my: {
                paginationShow: false,
                progressBar: true,
                sortAsc: false,
                currentPage: 1,
                pageSize: 5,
                relateSearch: "",
                sortField:"default",
                total: 99999,
                searchResult: [],
            },

            pageOption_all: {
                paginationShow: false,
                progressBar: true,
                sortAsc: false,
                currentPage: 1,
                pageSize: 5,
                relateSearch: "",
                sortField:"viewCount",
                total: 99999,
                searchResult: [],
            },


            activeIndex: '2',
            activeName: 'Computable Model',
            activeName1: 'Model Item',
            activeName2: 'Concept & Semantic',
            activeName_dialog :"",
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
            userId: "",
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

            options: [{
                // label: 'Basic',
                options: [{
                    value: 'Connected with'
                }, {
                    value: 'Similar to'
                }, {
                    value: 'Coexist in'
                }]
            }, {
                // label: 'Child',
                options: [{
                    value: 'Evolved from'
                }, {
                    value: 'Belongs to'
                }, {
                    value: 'Integrated into'
                }]
            }, {
                // label: 'Parent',
                options: [{
                    value: 'Inspires'
                }, {
                    value: 'Contains'
                }, {
                    value: 'Employs/Depends on'
                }]
            }],

            modelOid:'',
            editModelItemDialog:false,

            //editClassification
            treeData: [
                {
                    id: 1,
                    label: 'Earth System Subject',
                    oid: 'fc236e9d-3ae9-4594-b9b8-de0ac336a1d7',
                    children: [ {
                        id: 65,
                        label: 'Solar-terrestrial Physics',
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
            treeData2:[
                {"children": [{
                        "children": [{
                            "id": 2,
                            "label": "Land regions",
                            "oid": "a24cba2b-9ce1-44de-ac68-8ec36a535d0e"
                        }, {"id": 3, "label": "Ocean regions", "oid": "75aee2b7-b39a-4cd0-9223-3b7ce755e457"}, {
                            "id": 4,
                            "label": "Frozen regions",
                            "oid": "1bf4f381-6bd8-4716-91ab-5a56e51bd2f9"
                        }, {"id": 5, "label": "Atmospheric regions", "oid": "8f4d4fca-4d09-49b4-b6f7-5021bc57d0e5"}, {
                            "id": 6,
                            "label": "Space earth",
                            "oid": "d33a1ebe-b2f5-4ed3-9c76-78cfb61c23ee"
                        }, {"id": 7, "label": "Solid earth", "oid": "d3ba6e0b-78ec-4fe8-9985-4d5708f28e3e"}, {
                            "id": 8,
                            "label": "Integrated perspective",
                            "oid": "eb1d8ddc-6be1-41ef-bab6-a8d940d46499"
                        }], "id": 1, "label": "Natural-perspective", "oid": "6b2c8632-964a-4a65-a6c5-c360b2b515f0"
                    }, {
                        "children": [{
                            "id": 10,
                            "label": "Administrative regions",
                            "oid": "808e74a4-41c6-4558-a850-4daec1f199df"
                        }, {"id": 11, "label": "Social regions", "oid": "40534cf8-039a-4a0a-8db9-7c9bff484190"}, {
                            "id": 12,
                            "label": "Economic regions",
                            "oid": "cf9cd106-b873-4a8a-9336-dd72398fc769"
                        }, {"id": 13, "label": "Integrated perspective", "oid": "65dbe5a9-ada9-4c02-8353-5029a84d7628"}],
                        "id": 9,
                        "label": "Human-perspective",
                        "oid": "77e7482c-1844-4bc3-ae37-cb09b61572da"
                    }], "id": 24, "label": "Application-focused categories", "oid": "9f7816be-c6e3-44b6-addf-98251e3d2e19"},
                {"children": [{
                        "children": [{
                            "id": 15,
                            "label": "Geoinformation analysis",
                            "oid": "afa99af9-4224-4fac-a81f-47a7fb663dba"
                        }, {
                            "id": 16,
                            "label": "Remote sensing analysis",
                            "oid": "f20411a5-2f55-4ee9-9590-c2ec826b8bd5"
                        }, {
                            "id": 17,
                            "label": "Geostatistical analysis",
                            "oid": "1c876281-a032-4575-8eba-f1a8fb4560d8"
                        }, {"id": 18, "label": "Machine Learning analysis", "oid": "c6fcc899-8ca4-4269-a21e-a39d38c034a6"}],
                        "id": 14,
                        "label": "Data-perspective",
                        "oid": "4785308f-b2ef-4193-a74b-b9fe025cbc5e"
                    }, {
                        "children": [{
                            "id": 20,
                            "label": "Physical process calculation",
                            "oid": "1d564d0f-51c6-40ca-bd75-3f9489ccf1d6"
                        }, {
                            "id": 21,
                            "label": "Chemical process calculation",
                            "oid": "63266a14-d7f9-44cb-8204-c877eaddcaa1"
                        }, {
                            "id": 22,
                            "label": "Biological process calculation",
                            "oid": "6d1efa2c-830d-4546-b759-c66806c4facc"
                        }, {"id": 23, "label": "Human-activity calculation", "oid": "6952d5b2-cb0f-4ba7-96fd-5761dd566344"}],
                        "id": 19,
                        "label": "Process-perspective",
                        "oid": "746887cf-d490-4080-9754-1dc389986cf2"
                    }], "id": 25, "label": "Method-focused categories", "oid": "5f74872a-196c-4889-a7b8-9c9b04e30718"}],
            cls:[],
            clsStr:"",
            cls2:[],
            clsStr2:"",
            editClassification:false,
            defaultProps: {
                children: 'children',
                label: 'label'
            },

            modelInfo:{},

            relationPageSize:4,

            modelRelationGraphShow:false,
            modelRelationGraphSideBarShow:false,
            relatedModelItems:[],
            relatedModelItemsPage:[],
            curRelation:{},
            graphFullScreen: false,

            nodeLabelShow:true,
            fullNameShow:false,
            lineLabelShow:true,
            lineColorShow:false,

            lightenContributor:{},
            contributors:[],

            relateFile: [],

            exLink:{
                name:'',
                content:'',
            },

            targetFile:{},

            showDataChose:false,
        }
    },
    methods: {

        lineColorShowChange(newValue){
            let object = document.getElementById('modelRelationGraph');
            let graph = echarts.init(object,'light');
            let opts = graph.getOption();

            let links = opts.series[0].links;
            for(i = 0;i<links.length;i++){
                let link = links[i];
                let formatter;
                let name = links[i].name;
                if(newValue){
                    let color;
                    switch (links[i].label.formatter){
                        case "Connected with":
                            color="#f6b26b";
                            break;
                        case "Evolved from":
                            color="#ffd966";
                            break;
                        case "Belongs to":
                            color="#93c47d";
                            break;
                        case "Integrated into":
                            color="#6d9eeb";
                            break;
                        case "Inspires":
                            color="#8e7cc3";
                            break;
                        case "Contains":
                            color="#c27ba0";
                            break;
                        case "Employs/Depends on":
                            color="#a61c00";
                            break;
                        case "Similar to":
                            color="#e69138";
                            break;
                        case "Coexist in":
                            color="#7f6000";
                            break;
                    }
                    links[i].lineStyle={
                        color: color,
                    }
                }else{
                    links[i].lineStyle={}
                }
            }
            opts.series[0].links = links;
            graph.clear();
            graph.setOption(opts);
        },

        lineLabelShowChange(newValue){
            let object = document.getElementById('modelRelationGraph');
            let graph = echarts.init(object,'light');
            let opts = graph.getOption();

            let links = opts.series[0].links;
            for(i = 0;i<links.length;i++){
                let link = links[i];
                let formatter;
                let name = links[i].name;
                links[i].label.show = newValue;

                if(link.label.formatter==undefined){
                    links[i].label.show = false;
                }
            }
            opts.series[0].links = links;
            graph.clear();
            graph.setOption(opts);
        },

        fullNameShowChange(newValue){
            let object = document.getElementById('modelRelationGraph');
            let graph = echarts.init(object,'light');
            let opts = graph.getOption();

            let data = opts.series[0].data;
            for(i = 0;i<data.length;i++){
                let formatter;
                let name = data[i].name;;
                if(newValue){
                    formatter = name.trim().replaceAll(" ","\n");
                }else{
                    formatter = name.length > 9 ? name.substring(0,7)+"..." : name
                }

                if(data[i].value.type=="ref"){
                    formatter="";
                }

                data[i].label={
                    formatter:formatter
                }
            }
            opts.series[0].data = data;
            graph.clear();
            graph.setOption(opts);
        },

        nodeLabelShowChange(newValue){
            let object = document.getElementById('modelRelationGraph');
            let graph = echarts.init(object,'light');
            let opts = graph.getOption();
            graph.clear();
            opts.series[0].label.show=newValue;
            graph.setOption(opts);
        },

        handleRelationCurrentChange(page,type){
            switch(type){
                case "modelItem":
                    let start = (page-1)*this.relationPageSize;
                    let end = page * this.relationPageSize;
                    this.relatedModelItemsPage = [];
                    for(i=start;i<this.relatedModelItems.length;i++){
                        if(i===end) break;
                        this.relatedModelItemsPage.push(this.relatedModelItems[i]);
                    }
                    break;
            }
        },

        closeGraphSideBar(){
            this.modelRelationGraphSideBarShow = false;
        },

        relateModelItemListShowChange(val){
            console.log(val);
            if(val) {
                this.generateModelRelationGraph();
            }else{
                this.closeModelRelationGraph();
            }
        },

        generateModelRelationGraph(){
            this.modelRelationGraphShow = true;

            let nodes = [];
            let links = [];

            $.post("/modelItem/getRelationGraph",{"oid":this.modelInfo.oid},(result)=>{
                console.log(result);
                nodes = result.data.nodes;
                links = result.data.links;

                setTimeout(()=>{

                    let object = document.getElementById('modelRelationGraph');
                    let modelRelationGraph = echarts.init(object,'light');
                    modelRelationGraph.showLoading();

                    modelRelationGraph.on("click",(param)=>{
                        if(param.value !== undefined){
                            this.curRelation=param.value;
                            this.modelRelationGraphSideBarShow = true;
                        }
                        console.log(param)
                    });

                    let graph_nodes = [];
                    let graph_links = [];

                    let radius = 200;
                    let title = this.modelInfo.name;
                    graph_nodes.push({
                        name: title,
                        x: 500,
                        y: 300,
                        value: {
                            style: "node",
                            type: "model",
                            name: nodes[0].name,
                            oid: nodes[0].oid,
                            img: nodes[0].img,
                            overview: nodes[0].overview,
                        },
                        itemStyle:{
                            color: 'green',
                        },
                        label: {
                            formatter: title.length > 9 ? title.substring(0,7)+"..." : title,
                        },
                        tooltip:{
                            formatter:"{b}",
                        },
                    });

                    let dtAngle = 360 / nodes.length;
                    let curAngle = 0;
                    //加入节点
                    for(i = 1;i<nodes.length;i++){
                        let node = nodes[i];

                        curAngle = curAngle + dtAngle;
                        let radian = curAngle * 2 * Math.PI / 360;
                        let dx = Math.cos(radian) * radius;
                        let dy = Math.sin(radian) * radius;

                        let name = node.name;

                        //加入节点
                        if(node.type === "ref"){
                            let formatter = name.length > 9 ? name.substring(0,7)+"..." : name;
                            graph_nodes.push({
                                name: node.name,
                                value: {
                                    style: "node",
                                    type: "ref",
                                    name: node.name,
                                    author: node.author,
                                    journal: node.journal,
                                    link: node.link,
                                },
                                x: graph_nodes[0].x + dx,
                                y: graph_nodes[0].y + dy,
                                symbolSize: 8,
                                itemStyle:{
                                    color: 'skyblue',
                                },
                                label: {
                                    show: false,
                                    formatter: formatter,
                                },
                                tooltip: {
                                    formatter: "Reference: {b}",
                                },
                            });
                        }else {
                            let name = node.name;
                            let start = name.indexOf("(");
                            let end = name.indexOf(")");
                            if(name.length>0&&start!=-1&&end!=-1) {
                                let part1 = name.substring(0, start).trim();
                                if(end + 1 == name.length){
                                    name = part1;
                                }else {
                                    let part2 = name.substring(end + 1, name.length - 1);
                                    name = part1 + " " + part2;
                                }
                            }
                            let formatter = name.length > 9 ? name.substring(0, 7) + "..." : name;
                            graph_nodes.push({
                                name: name,
                                value: {
                                    style: "node",
                                    type: "model",
                                    name: node.name,
                                    oid: node.oid,
                                    img: node.img,
                                    overview: node.overview,
                                },
                                x: graph_nodes[0].x + dx,
                                y: graph_nodes[0].y + dy,
                                // symbolSize: 10,
                                itemStyle:{
                                    color: 'orange',
                                },
                                label: {
                                    formatter: formatter,
                                },
                                tooltip: {
                                    formatter: "{b}",
                                },
                            });
                        }
                    }

                    //加入连线
                    for(i = 0;i<links.length;i++) {
                        let link = links[i];
                        if(link.type === "ref") {
                            graph_links.push({
                                source: link.ori,
                                target: link.tar,
                                // symbolSize: [5, 10],
                                label: {
                                    show: false,
                                    formatter: link.relation,
                                    fontSize: 12,
                                },
                                lineStyle: {
                                    width: 2,
                                    curveness: 0
                                },
                                symbol: ['none', 'none'],
                                tooltip: {
                                    show: false,
                                    position: 'bottom',
                                    formatter: nodes[link.ori].name + " " + link.relation + " " + nodes[link.tar].name,
                                },

                            });
                        }else{
                            graph_links.push({
                                source: link.ori,
                                target: link.tar,
                                symbolSize: [5, 10],
                                label: {
                                    show: true,
                                    formatter: link.relation,
                                    fontSize: 12,
                                },
                                lineStyle: {
                                    width: 2,
                                    curveness: 0
                                },
                                tooltip: {
                                    position: 'bottom',
                                    formatter: nodes[link.ori].name + " " + link.relation + " " + nodes[link.tar].name,
                                },

                            });
                        }
                    }

                    let option = {
                        title: {
                            //text: 'Graph 简单示例'
                        },
                        tooltip: {},
                        toolbox: {
                            right:10,
                            feature: {

                                myFull: {
                                    show: true,
                                    title: 'Full Screen',
                                    icon: 'path://M432.45,595.444c0,2.177-4.661,6.82-11.305,6.82c-6.475,0-11.306-4.567-11.306-6.82s4.852-6.812,11.306-6.812C427.841,588.632,432.452,593.191,432.45,595.444L432.45,595.444z M421.155,589.876c-3.009,0-5.448,2.495-5.448,5.572s2.439,5.572,5.448,5.572c3.01,0,5.449-2.495,5.449-5.572C426.604,592.371,424.165,589.876,421.155,589.876L421.155,589.876z M421.146,591.891c-1.916,0-3.47,1.589-3.47,3.549c0,1.959,1.554,3.548,3.47,3.548s3.469-1.589,3.469-3.548C424.614,593.479,423.062,591.891,421.146,591.891L421.146,591.891zM421.146,591.891',
                                    onclick: (e)=>{
                                        let opts = e.getOption();
                                        opts.toolbox[0].feature.myFull={};//.show=false;
                                        // opts.toolbox[0].feature.myFullExit.show=true;
                                        this.graphFullScreen = true;
                                        setTimeout(()=>{
                                            let object = document.getElementById('fullScreenGraph');
                                            let graph = echarts.init(object,'light');
                                            graph.setOption(opts);

                                            graph.on("click",(param)=>{
                                                if(param.value !== undefined){
                                                    this.curRelation=param.value;
                                                    this.modelRelationGraphSideBarShow = true;
                                                }

                                                console.log(param)
                                            });

                                            // opts.toolbox[0].feature.myFull.show=false
                                            // //window.top表示最顶层iframe  如果在当页面全屏打开 删去window.top即可
                                            // window.top.layer.open({
                                            //     title:false,
                                            //     type:1,
                                            //     content:'<div class="fullChart" style="height:100%;width:100%;padding:30px 0px"></div>',
                                            //     success:function(){
                                            //         var fullchart = echarts.init(window.top.document.getElementById('fullChart'))
                                            //         fullchart.setOption(opts)
                                            //     }
                                            // })
                                        },300);

                                    }
                                },
                                saveAsImage: {},
                                restore: {},
                                // myFullExit: {
                                //     show: false,
                                //     title: 'Exit',
                                //     icon: 'path://M432.45,595.444c0,2.177-4.661,6.82-11.305,6.82c-6.475,0-11.306-4.567-11.306-6.82s4.852-6.812,11.306-6.812C427.841,588.632,432.452,593.191,432.45,595.444L432.45,595.444z M421.155,589.876c-3.009,0-5.448,2.495-5.448,5.572s2.439,5.572,5.448,5.572c3.01,0,5.449-2.495,5.449-5.572C426.604,592.371,424.165,589.876,421.155,589.876L421.155,589.876z M421.146,591.891c-1.916,0-3.47,1.589-3.47,3.549c0,1.959,1.554,3.548,3.47,3.548s3.469-1.589,3.469-3.548C424.614,593.479,423.062,591.891,421.146,591.891L421.146,591.891zM421.146,591.891',
                                //     onclick: (e)=>{
                                //         this.graphFullScreen = false;
                                //
                                //     }
                                // },
                            }
                        },
                        animation: false,
                        // animationDurationUpdate: 500,
                        // animationEasingUpdate: 'quinticInOut',
                        series: [
                            {
                                type: 'graph',
                                layout: 'force',
                                draggable: false,
                                focusNodeAdjacency:true,
                                symbolSize: 25,
                                zoom:4,
                                roam: true,
                                force:{
                                    repulsion:100,
                                    // edgeLength:[150,200],
                                    layoutAnimation:false,
                                },
                                label: {
                                    show: true,
                                },
                                edgeSymbol: ['circle', 'arrow'],
                                edgeSymbolSize: [4, 10],
                                edgeLabel: {
                                    fontSize: 20
                                },
                                data: [{
                                    name: '节点1',
                                    x: 500,
                                    y: 300,
                                    symbolSize:50,
                                    itemStyle:{
                                        color: 'blue',
                                    },
                                }, {
                                    name: '节点2',
                                    x: 800,
                                    y: 300
                                }, {
                                    name: '节点3',
                                    x: 550,
                                    y: 100
                                }, {
                                    name: '节点4',
                                    x: 550,
                                    y: 500
                                }],
                                // links: [],
                                links: [{
                                    source: 0,
                                    target: 1,
                                    symbolSize: [5, 20],
                                    label: {
                                        show: true,
                                        formatter:"1234",
                                    },
                                    lineStyle: {
                                        width: 5,
                                        curveness: 0
                                    }
                                }, {
                                    source: '节点2',
                                    target: '节点1',
                                    label: {
                                        show: true
                                    },
                                    lineStyle: {
                                        curveness: 0.2
                                    }
                                }, {
                                    source: '节点1',
                                    target: '节点3'
                                }, {
                                    source: '节点2',
                                    target: '节点3'
                                }, {
                                    source: '节点2',
                                    target: '节点4'
                                }, {
                                    source: '节点1',
                                    target: '节点4'
                                }],
                                lineStyle: {
                                    opacity: 0.9,
                                    width: 2,
                                    curveness: 0
                                }
                            }
                        ]
                    };

                    option.series[0].data = graph_nodes;
                    option.series[0].links = graph_links;
                    console.log(option);
                    modelRelationGraph.setOption(option);
                    modelRelationGraph.hideLoading();
                },300)

            });



        },

        closeModelRelationGraph(){
            this.modelRelationGraphShow = false;
            this.modelRelationGraphSideBarShow = false;
        },

        relationSortChange(sort){
            console.log(sort);
            let order = sort.order==="ascending";
            let field = sort.column.label.toLowerCase();
            if(this.activeName_dialog==="my"){
                this.pageOption_my.sortAsc=order;
                this.pageOption_my.sortField=field;
            }else{
                this.pageOption_all.sortAsc=order;
                this.pageOption_all.sortField=field;
            }
            this.search(this.activeName_dialog);
        },

        getOid(){
            let url = window.location.href;
            let urls = url.split("/");
            for(i=0;i<urls.length;i++){
                if(urls[i].length>=36){
                    return urls[i].substring(0,36);
                }
            }
        },

        changeDetailLanguage(command){
            this.currentDetailLanguage = command;
            let data = {
                "oid": this.getOid(),
                "language": this.currentDetailLanguage
            };

            if(window.location.href.indexOf("history")===-1) {
                $.get("/modelItem/getDetailByLanguage", data, (result) => {
                    this.detail = result.data;
                })
            }else{
                $.get("/version/languageDetail/modelItem", data, (result) => {
                    this.detail = result.data;
                })
            }
        },

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

        handleCheckChange2(data, checked, indeterminate) {
            let checkedNodes = this.$refs.tree4.getCheckedNodes()
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
            this.cls2=classes;
            this.clsStr2=str;

        },
        getClassifications(){
            this.editClassification = true;
            $.get("/modelItem/getClassification/"+this.modelOid,{},(result)=>{
                //cls
                this.cls = result.data.class1;

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

                //cls
                this.cls2 = result.data.class2;
                let ids2=[];
                for(i=0;i<this.cls2.length;i++){
                    for(j=0;j<2;j++){
                        for(k=0;k<this.treeData2[j].children.length;k++){
                            let children=this.treeData2[j].children[k].children;
                            if(children==null) {
                                if (this.cls2[i] == this.treeData2[j].children[k].oid) {
                                    ids2.push(this.treeData2[j].children[k].id);
                                    this.clsStr2 += this.treeData2[j].children[k].label;
                                    if (i != this.cls2.length - 1) {
                                        this.clsStr2 += ", ";
                                    }
                                    break;
                                }
                            }
                            else{
                                for(x=0;x<children.length;x++){
                                    if (this.cls2[i] == children[x].oid) {
                                        ids2.push(children[x].id);
                                        this.clsStr2 += children[x].label;
                                        if (i != this.cls2.length - 1) {
                                            this.clsStr2 += ", ";
                                        }
                                        break;
                                    }
                                }
                            }

                        }
                        if(ids2.length-1==i){
                            break;
                        }
                    }
                }

                this.$refs.tree4.setCheckedKeys(ids2);
            });

        },
        submitClassifications(){
            let data = {
                oid:this.modelOid,
                class1:this.cls,
                class2:this.cls2,
            };
            $.post("/modelItem/updateClass",data,(result)=>{
                this.$alert("Change classification successfully!", 'Success', {
                    type: 'success',
                    confirmButtonText: 'OK',
                    callback: action => {
                        window.location.reload();
                    }
                });
            })
        },
        isCurrentItem(row){
            let urls = window.location.href.split('/');
            let oid = urls[urls.length-1].substring(0,36);
            return(oid==row.oid);
        },
        claim(){
            $.get("/user/load",{},(result)=>{
                let json = result;
                if (json.oid == "") {
                    this.confirmLogin();
                }
                else {
                    this.authorshipFormVisible = true;
                }
            })
        },
        feedBack(){
            $.get("/user/load",{},(result)=>{
                let json = result;
                if (json.oid == "") {
                    this.confirmLogin();
                }
                else {
                    window.location.href = "/user/userSpace#/feedback"
                }
            })
        },
        useMyInfo(){
            $.get("/user/getUserSimpleInfo",{},(result)=>{
                if(result.code==-1){
                    this.confirmLogin();
                }else{
                    let data = result.data;
                    this.authorshipForm.name = data.name;
                    this.authorshipForm.ins = data.org;
                    this.authorshipForm.email = data.email;
                    this.authorshipForm.homepage = data.homepage;
                }
            })
        },
        submitAuthorship(){
            let urls = window.location.href.split('/');
            let oid = urls[urls.length-1].substring(0,36);
            this.authorshipForm.oid = oid;
            axios.post("/modelItem/claimAuthorship",this.authorshipForm)
                .then((result) => {
                    result = result.data;
                if(result.code==-1){
                    this.confirmLogin();
                }else if(result.code==-2){
                    this.$alert(result.msg, 'Tip', {
                        type:'info',
                        confirmButtonText: 'OK',
                        callback: action => {

                        }
                    });
                }else{
                    if(result.data.method=='update'){
                        this.$alert("Added successfully!", 'Success', {
                            type: 'success',
                            confirmButtonText: 'OK',
                            callback: action => {
                                window.location.reload();
                            }
                        });
                    }else {
                        this.$alert("Submitted successfully, please wait for review.", 'Tip', {
                            type: 'success',
                            confirmButtonText: 'OK',
                            callback: action => {
                                this.authorshipFormVisible = false
                            }
                        });
                    }
                }
            })
        },

        //comment
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
            this.replyToUserId=comment.author.oid;
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

        confirmLogin(){
            this.$confirm('<div style=\'font-size: 18px\'>This function requires an account, <br/>please login first.</div>', 'Tip', {
                dangerouslyUseHTMLString: true,
                confirmButtonText: 'Log In',
                cancelButtonClass: 'fontsize-15',
                confirmButtonClass: 'fontsize-15',
                type: 'info',
                center: true,
                showClose: false,
            }).then(() => {
                window.location.href = "/user/login";
            }).catch(() => {

            });
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
                    if (data.oid == "") {
                        this.confirmLogin()

                    }
                    else {
                        let href = window.location.href;
                        let hrefs = href.split('/');
                        let oid = hrefs[hrefs.length - 1].split("#")[0];
                        window.open("/user/userSpace#/model/manageModelItem/"+oid);
                        // window.location.href = "/user/userSpace#/model/manageModelItem/"+oid;
                        // this.editDialogOpen()


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

        editDialogOpen(){
            let href = window.location.href;
            let hrefs = href.split('/');
            let oid = hrefs[hrefs.length - 1].split("#")[0];
            this.modelOid = oid;
            this.editModelItemDialog = true
        },

        setSession(name, value) {
            window.sessionStorage.setItem(name, value);
        },
        link(event) {
            window.open(event);
            // let refLink = $(".refLink");
            // for (i = 0; i < refLink.length; i++) {
            //     if (event.currentTarget == refLink[i]) {
            //         window.open(this.refTableData[i].links);
            //     }
            // }
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
                    if (data.oid == "") {
                        this.confirmLogin()
                    }
                    else {
                        let arr = window.location.href.split("/");
                        let bindOid = arr[arr.length - 1].split("#")[0];
                        this.setSession("bindOid", bindOid);
                        switch (this.relateType) {
                            case "modelItem":
                                window.open("/user/userSpace#/model/createModelItem", "_blank")
                                break;
                            case "conceptualModel":
                                window.open("/user/userSpace#/model/createConceptualModel", "_blank")
                                break;
                            case "logicalModel":
                                window.open("/user/userSpace#/model/createLogicalModel", "_blank")
                                break;
                            case "computableModel":
                                window.open("/user/userSpace#/model/createComputableModel", "_blank")
                                break;
                            case "concept":
                                window.open("/user/userSpace#/community/createConcept", "_blank")
                                break;
                            case "spatialReference":
                                window.open("/user/userSpace#/community/createSpatialReference", "_blank")
                                break;
                            case "template":
                                window.open("/user/userSpace#/community/createTemplate", "_blank")
                                break;
                            case "unit":
                                window.open("/user/userSpace#/community/createUnit", "_blank")
                                break;
                        }
                        this.dialogTableVisible = false;
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
                this.confirmLogin()

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

        searchInit(scope){
            this.pageOption_all.currentPage = 1;
            this.pageOption_my.currentPage = 1;
            this.search(scope);
        },

        //relate search
        search(scope) {
            let data;
            if(scope=="all"){
                // this.pageOption_all.currentPage = 1;
                data = {
                    asc: this.pageOption_all.sortAsc,
                    page: this.pageOption_all.currentPage-1,
                    pageSize: this.pageOption_all.pageSize,
                    searchText: this.pageOption_all.relateSearch.trim(),
                    sortField: this.pageOption_all.sortField,
                    classifications: ["all"],
                }
            }else {
                // this.pageOption_my.currentPage = 1;
                data = {
                    asc: this.pageOption_my.sortAsc,
                    page: this.pageOption_my.currentPage-1,
                    pageSize: this.pageOption_my.pageSize,
                    searchText: this.pageOption_my.relateSearch,
                    sortField: this.pageOption_my.sortField,
                    classifications: ["all"],
                };
            }
            let url, contentType;
            switch (this.relateType) {
                case "dataItem":
                    if(scope=="all") {
                        url = "/dataItem/searchByName";
                    }else{
                        url = "/dataItem/searchByNameAndAuthor";
                    }
                    data = {
                        page: data.page+1,
                        pageSize: data.pageSize,
                        asc: true,
                        classifications: [],
                        category: '',
                        searchText: data.searchText,
                        tabType: "repository",
                        sortField: data.sortField,
                    };
                    data = JSON.stringify(data);
                    contentType = "application/json";
                    break;
                case "concept":
                    url = "/repository/searchConcept";
                    data.asc = data.asc == true ? 0 : 1;
                    data = JSON.stringify(data);
                    contentType = "application/json";
                    break;
                case "spatialReference":
                    url = "/repository/searchSpatialReference";
                    data.asc = data.asc == true ? 0 : 1;
                    data = JSON.stringify(data);
                    contentType = "application/json";
                    break;
                case "template":
                    url = "/repository/searchTemplate";
                    data.asc = data.asc == true ? 0 : 1;
                    data = JSON.stringify(data);
                    contentType = "application/json";
                    break;
                case "unit":
                    url = "/repository/searchUnit";
                    data.asc = data.asc == true ? 0 : 1;
                    data = JSON.stringify(data);
                    contentType = "application/json";
                    break;
                default:
                    if(scope=="all") {
                        url = "/" + this.relateType + "/list";
                    }else{
                        url = "/" + this.relateType + "/listByAuthor";
                    }
                    contentType = "application/x-www-form-urlencoded";
                    data.classType=1;
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

                        if(scope=="all") {
                            this.pageOption_all.total = data.total;
                            this.pageOption_all.pages = data.pages;
                            this.pageOption_all.searchResult = data.list;
                            this.pageOption_all.users = data.users;
                            this.pageOption_all.progressBar = false;
                            this.pageOption_all.paginationShow = true;
                        }else{
                            this.pageOption_my.total = data.total;
                            this.pageOption_my.pages = data.pages;
                            this.pageOption_my.searchResult = data.list;
                            this.pageOption_my.users = data.users;
                            this.pageOption_my.progressBar = false;
                            this.pageOption_my.paginationShow = true;
                        }

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

        getRelatedResources() {
            //从地址栏拿到oid
            let arr = window.location.href.split("/");
            let oid = arr[arr.length - 1].split("#")[0];
            let data = {
                oid: oid,
            };
            $.ajax({
                type: "GET",
                url: "/modelItem/getRelatedResources",
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
            if(this.activeName_dialog=="my") {
                this.pageOption_my.currentPage = val;
            }else{
                this.pageOption_all.currentPage = val;
            }
            this.search(this.activeName_dialog);
        },

        hasAdded(row){
            for(i=0;i<this.tableData.length;i++){
                let data = this.tableData[i];
                let oid1,oid2;
                if(data.oid!=undefined){
                    oid1 = data.oid;
                    oid2 = row.oid;
                }else{
                    oid1 = data.id;
                    oid2 = row.id;
                }
                if(oid1==oid2){
                    return true;
                }
            }
        },

        handleDelete(index, row) {
            console.log(index, row);
            let table = new Array();
            for (i = 0; i < this.tableData.length; i++) {
                let data = this.tableData[i];
                let oid1,oid2;
                if(data.oid!=undefined){
                    oid1 = data.oid;
                    oid2 = row.oid;
                }else{
                    oid1 = data.id;
                    oid2 = row.id;
                }
                if(oid1!=oid2) {
                    table.push(this.tableData[i]);
                }
            }
            // table.splice(index, 1);
            this.tableData = table;

        },

        handleEdit(index, row) {
            console.log(row);
            row.type=this.relateType
            let flag = false;
            for (i = 0; i < this.tableData.length; i++) {
                let tableRow = this.tableData[i];
                if (tableRow.oid == row.oid) {
                    flag = true;
                    break;
                }
            }
            if (!flag) {
                if(this.relateType=="modelItem"){
                    this.$set(row,"relation","Connected with");
                }
                this.tableData.push(row);
            }
        },

        confirm() {
            //从地址栏拿到oid
            let arr = window.location.href.split("/");
            let oid = arr[arr.length - 1].split("#")[0];

            let relateArr = [];
            let url = '';
            let data;
            let contentType;

            if(this.relateType !== "modelItem") {
                url = "/modelItem/setRelation";
                this.tableData.forEach(function (item, index) {
                    relateArr.push(item.oid);
                })
                data = {
                    oid: oid,
                    type: this.relateType,
                    relations: relateArr
                };
                contentType = "application/x-www-form-urlencoded;charset=UTF-8";
            }else{
                url = "/modelItem/setModelRelation/"+oid;
                this.tableData.forEach(function (item, index) {
                    let obj = {
                        oid : item.oid,
                        relation : item.relation,
                    };
                    relateArr.push(obj);
                });
                data = {
                    relations: relateArr,
                };
                data = JSON.stringify(data);
                contentType = "application/json;charset=UTF-8";
            }

            $.ajax({
                type: "POST",
                url: url,
                data: data,
                contentType:contentType,
                async: true,
                success: (result) => {
                    this.$alert('Success!', 'Tip', {
                        type:'success',
                        confirmButtonText: 'OK',
                        callback: action => {
                            this.dialogTableVisible = false;
                            if(this.relateType === "modelItem"){
                                this.relatedModelItems = result.data;
                                this.setRelatedModelItemsPage();
                                if(this.modelRelationGraphShow){
                                    this.generateModelRelationGraph();
                                }

                            }else {
                                window.location.reload();
                            }
                        }
                    });

                },
                error: (json) => {
                    this.$alert('Submitted failed!', 'Error', {
                        type:'error',
                        confirmButtonText: 'OK',
                        callback: action => {

                        }
                    });
                }
            })
        },

        addRelateResources(){
            let formData=new FormData();

            let stringInfo = []
            this.tableData.forEach(function (item, index) {
                let relateItem={}
                relateItem.oid = item.oid
                relateItem.type = item.type
                if(item.type=='localFile'){
                    formData.append("resources",item.raw);
                }
                if(item.type=='exLink'){
                    relateItem.content = item.content
                    relateItem.name = item.name
                }
                if(item.type=='dataSpaceFile'){
                    relateItem.oid = item.oid
                    relateItem.url = item.url
                    relateItem.name = item.name
                }
                stringInfo.push(relateItem);
            })

            // let file = new File([JSON.stringify(stringInfo)],'ant.txt',{
            //     type: 'text/plain',
            // });
            formData.append("stringInfo", JSON.stringify(stringInfo))


            let arr = window.location.href.split("/");
            let oid = arr[arr.length - 1].split("#")[0];

            let url = '';

            $.ajax({
                type: "POST",
                url: "/modelItem/addRelateResources/"+oid,
                data: formData,
                cache: false,
                processData: false,
                contentType: false,
                async: true,
                success: (result) => {
                    this.$alert('Success!', 'Tip', {
                        type:'success',
                        confirmButtonText: 'OK',
                        callback: action => {
                            this.dialogTableVisible = false;
                            window.location.reload();
                        }
                    });

                },
                error: (json) => {
                    this.$alert('Submitted failed!', 'Error', {
                        type:'error',
                        confirmButtonText: 'OK',
                        callback: action => {

                        }
                    });
                }
            })
        },

        async checkPersonData() {
            this.showDataChose = true;
            this.$nextTick(()=>{
                this.$refs.userDataSpace.getFilePackage();
            })

        },

        selectDataspaceFile(file) {
            this.targetFile = file
        },

        removeDataspaceFile(file) {
            this.targetFile = {}
        },

        selectDataFromPersonal(){
            let file = {
                name:this.targetFile.label+this.targetFile.suffix,
                oid:this.targetFile.id,
                url:this.targetFile.url,
                type:"dataSpaceFile"
            }
            for(let tableEle of this.tableData){
                if(tableEle.oid == file.oid){
                     this.$alert('You have select this file.', 'Tip', {
                              type:"warning",
                              confirmButtonText: 'OK',
                              callback: ()=>{
                                  return
                              }
                          }
                      );
                     return
                }
            }

            this.tableData.push(file)

            this.showDataChose = false
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
                    if (data.oid == "") {
                        this.confirmLogin()
                    }
                    else {
                        switch (order) {
                            case 1:
                                this.relateType = "modelItem";
                                this.typeName = "Model Item";
                                this.activeName_dialog = "my";
                                break;
                            case 2:
                                this.relateType = "conceptualModel";
                                this.typeName = "Conceptual Model";
                                this.activeName_dialog = "my";
                                break;
                            case 3:
                                this.relateType = "logicalModel";
                                this.typeName = "Logical Model";
                                this.activeName_dialog = "my";
                                break;
                            case 4:
                                this.relateType = "computableModel";
                                this.typeName = "Computable Model";
                                this.activeName_dialog = "my";
                                break;
                            case 5:
                                this.relateType = "concept";
                                this.typeName = "Concept & Semantic";
                                this.activeName_dialog = "all";
                                break;
                            case 6:
                                this.relateType = "spatialReference";
                                this.typeName = "Spatiotemporal Reference";
                                this.activeName_dialog = "all";
                                break;
                            case 7:
                                this.relateType = "template";
                                this.typeName = "Data Template";
                                this.activeName_dialog = "all";
                                break;
                            case 8:
                                this.relateType = "unit";
                                this.typeName = "Unit & Metric";
                                this.activeName_dialog = "all";
                                break;
                            case 9:
                                this.relateType = "dataItem";
                                this.typeName = "Data Item";
                                this.activeName_dialog = "my";
                                break;
                        }
                        this.relateTitle = "Link Related "+this.typeName+" to "+this.modelInfo.name;
                        this.tableData = [];

                        this.pageOption_my.currentPage = 1;
                        this.pageOption_my.searchResult = [];
                        this.pageOption_my.relateSearch = "";

                        this.pageOption_all.currentPage = 1;
                        this.pageOption_all.searchResult = [];
                        this.pageOption_all.relateSearch = "";

                        this.getRelation();
                        this.search(this.activeName_dialog);
                        if(this.activeName_dialog!="all"){
                            this.search("all");
                        }
                        this.dialogTableVisible = true;
                    }
                }
            })

        },

        addRelatedResouece(){
            this.relateType = 'concept'
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
                    if (data.oid == "") {
                        this.confirmLogin()
                    }
                    else {
                        this.activeName_dialog = 'all'

                        this.tableData = [];

                        this.pageOption_my.currentPage = 1;
                        this.pageOption_my.searchResult = [];
                        this.pageOption_my.relateSearch = "";

                        this.pageOption_all.currentPage = 1;
                        this.pageOption_all.searchResult = [];
                        this.pageOption_all.relateSearch = "";

                        this.getRelatedResources();
                        this.search(this.activeName_dialog);
                        if(this.activeName_dialog!="all"){
                            this.search("all");
                        }
                        this.relatedResourceVisible = true;
                    }
                }
            })

        },

        uploadRemove(file, fileList) {
            this.relateFile = [];
        },

        uploadChange(file, fileList) {
            this.relateFile.splice(0,1);
            this.relateFile.push(file);
            let fileMeta = {
                name:file.name,
                oid:file.uid,
                raw:file.raw,
                type:'localFile'
            }
            this.tableData.push(fileMeta)
        },

        getTypeImg(row){
            switch (row.type){
                case "concept":
                    return '../../static/img/model/semantics.png'
                    break;
                case "spatialReference":
                    return '../../static/img/model/spatialreference.png'
                case "template":
                    return '../../static/img/model/template.png'
                case "unit":
                    return '../../static/img/model/unit.png'
            }

        },

        getTypeExpress(row){
            switch (row.type){
                case "concept":
                    return 'Concept & Semantic'
                    break;
                case "spatialReference":
                    return 'Spatiotemporal Reference'
                case "template":
                    return 'Data Template'
                case "unit":
                    return 'Unit & Metric'
            }
        },

        checkContent(row){
            if(row.type=='file'){
                return
            }else if(row.type=='link'){
                window.open(row.content)
            }else {
                window.open('/repository/'+row.type+'/'+row.oid)
            }
        },

        addExLink(){
            if(this.exLink.name.trim()==''){
                 this.$alert('Please input the name of the link', 'Tip', {
                          type:"warning",
                          confirmButtonText: 'OK',
                          callback: ()=>{
                              return
                          }
                      }
                  );
                 return
            }
            if(this.exLink.content.trim()==''){
                this.$alert('Please input the content of the link', 'Tip', {
                        type:"warning",
                        confirmButtonText: 'OK',
                        callback: ()=>{
                            return
                        }
                    }
                );
                return
            }



            let linkMeta = {
                name : this.exLink.name,
                oid : this.exLink.name,
                content : this.exLink.content,
                type:'exLink'
            }

            this.exLink = {}
            this.tableData.push(linkMeta)
        },

        // handleSuccess(result,file,fileList){
        //     let fileMeta = {
        //
        //     }
        //     this.tableData.push(fileMeta)
        //     // this.upload_data_dataManager(uploadSource);
        // },

        collapse(){
            console.log('aa')
            $('#authorship0').collapse()
        },

        setRelatedModelItemsPage(){
            this.relatedModelItemsPage = [];
            for(i=0;i<this.relatedModelItems.length;i++){
                if(i===this.relationPageSize) break;
                this.relatedModelItemsPage.push(this.relatedModelItems[i]);

            }
        },

        getContributors(){
            let ids = window.location.href.split('/')
            let id = ids[ids.length-1]

            axios.get('/modelItem/getContributors',{
                params:{
                    id:id
                }
            }).then(
                res=>{
                    this.contributors = res.data.data
                }
            )

        },

        riseUser(contributor,index){
            let tmp = this.lightenContributor
            this.lightenContributor = contributor
            this.$set(this.contributors,index,tmp)
        },
    },

    created(){
        this.getContributors()
    },

    mounted() {

        this.modelInfo = modelInfo;
        this.relatedModelItems = modelItemList;
        this.setRelatedModelItemsPage();

        this.lightenContributor = author

        let href = window.location.href;
        let hrefs = href.split('/');
        let oid = hrefs[hrefs.length - 1].split("#")[0];
        this.modelOid = oid;

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
                        this.userId = res.data.userId;
                        this.userImg = res.data.image;
                    }

                }
            })

        this.getComments();


        $(document).on('mouseover mouseout','.block_head',function(e){
            let editBtn=$(e.currentTarget).children(".blockEdit");
            if(editBtn.css("display")=="none"){
                editBtn.css("display","block");
            }else{
                editBtn.css("display","none");
            }
        });

        $(document).on('mouseover mouseout','.flexRowSpaceBetween',function(e){

            let deleteBtn=$(e.currentTarget).children().eq(1).children(".delete");
            if(deleteBtn.css("display")=="none"){
                deleteBtn.css("display","block");
            }else{
                deleteBtn.css("display","none");
            }

        });


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

        let panes = $(".el-tab-pane")
        if(modelInfo.relate.computableModels.length>0){
            this.activeName = "Computable Model";
        }else {
            for (i = 0; i < 3; i++) {
                let list_size = panes.eq(i).children("div").children(".list_panel").length;
                if (list_size > 0) {
                    this.activeName = panes[i].id.replace("pane-", "");
                    break;
                }
            }
        }

        for(i=3;i<5;i++){
            let list_size = panes.eq(i).children("div").children(".list_panel").length;
            if(list_size>0){
                this.activeName1 = panes[i].id.replace("pane-","");
                break;
            }
        }

        for(i=5;i<9;i++){
            let list_size = panes.eq(i).children("div").children(".list_panel").length;
            if(list_size>0){
                this.activeName2 = panes[i].id.replace("pane-","");
                break;
            }
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