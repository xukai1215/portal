
new Vue({
    el: '#app',
    components: {
        'avatar': VueAvatar.Avatar
    },
    data: function () {
        return {
            statistic:['Overview','Overview','Overview','Overview','Overview','Overview','Overview','Overview','Overview','Overview'],

            activeIndex: '2',
            queryType: 'normal',
            searchText: '',
            classifications1: ["9f7816be-c6e3-44b6-addf-98251e3d2e19"],
            classifications2: [],
            classifications3: [],

            currentClass: "Application-focused categories",

            pageOption: {
                paginationShow:false,
                progressBar: true,
                sortAsc: false,
                currentPage: 1,
                pageSize: 10,

                total: 264,
                searchResult: [],
            },

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
                            "label": "Space-earth regions",
                            "oid": "d33a1ebe-b2f5-4ed3-9c76-78cfb61c23ee"
                        }, {"id": 7, "label": "Solid-earth regions", "oid": "d3ba6e0b-78ec-4fe8-9985-4d5708f28e3e"}
                        ], "id": 1, "label": "Natural-perspective", "oid": "6b2c8632-964a-4a65-a6c5-c360b2b515f0"
                    }, {
                        "children": [{
                            "id": 10,
                            "label": "Development activities",
                            "oid": "808e74a4-41c6-4558-a850-4daec1f199df"
                        }, {"id": 11, "label": "Social activities", "oid": "40534cf8-039a-4a0a-8db9-7c9bff484190"}, {
                            "id": 12,
                            "label": "Economic activities",
                            "oid": "cf9cd106-b873-4a8a-9336-dd72398fc769"
                        }],
                        "id": 9,
                        "label": "Human-perspective",
                        "oid": "77e7482c-1844-4bc3-ae37-cb09b61572da"
                    },{"id":30,
                        "label":"Integrated-perspective",
                        "oid":"396cc739-ef33-4332-8d5d-9a67c89567c7",
                        "children":[{
                            "id": 31,
                            "label": "Global scale",
                            "oid": "14130969-fda6-41ea-aa32-0af43104840b"
                        }, {
                            "id": 32,
                            "label": "Regional scale",
                            "oid": "e56c1254-70b8-4ff4-b461-b8fa3039944e"
                        }]}], "id": 24, "label": "Application-focused categories", "oid": "9f7816be-c6e3-44b6-addf-98251e3d2e19"},

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
                        }, {"id": 18, "label": "Intelligent computation analysis", "oid": "c6fcc899-8ca4-4269-a21e-a39d38c034a6"}],
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
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            driver : null,
            stepsConfig : null,

            editClassification:false,
            modelOid:"",
            cls:[],
            clsStr:"",
            cls2:[],
            clsStr2:"",
            classType:null,
        }
    },
    methods: {


        handleCheckChange12(data, checked, indeterminate) {
            let checkedNodes = this.$refs.tree12.getCheckedNodes()
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
        handleCheckChange14(data, checked, indeterminate) {
            let checkedNodes = this.$refs.tree14.getCheckedNodes()
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
        getClassifications(modelItem){
            this.editClassification = true;
            this.modelOid = modelItem.oid;
            $.get("/modelItem/getClassification/"+modelItem.oid,{},(result)=>{
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

                this.$refs.tree12.setCheckedKeys(ids);

                //cls
                this.cls2 = result.data.class2;
                let ids2=[];
                if(this.cls2 != null) {
                    for (i = 0; i < this.cls2.length; i++) {
                        for (j = 0; j < 2; j++) {
                            for (k = 0; k < this.treeData2[j].children.length; k++) {
                                let children = this.treeData2[j].children[k].children;
                                if (children == null) {
                                    if (this.cls2[i] == this.treeData2[j].children[k].oid) {
                                        ids2.push(this.treeData2[j].children[k].id);
                                        this.clsStr2 += this.treeData2[j].children[k].label;
                                        if (i != this.cls2.length - 1) {
                                            this.clsStr2 += ", ";
                                        }
                                        break;
                                    }
                                }
                                else {
                                    for (x = 0; x < children.length; x++) {
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
                            if (ids2.length - 1 == i) {
                                break;
                            }
                        }
                    }
                }

                this.$refs.tree14.setCheckedKeys(ids2);
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
                        this.editClassification = false;
                        this.getModels(this.classType);
                    }
                });
            })
        },

        switchInit(){
            this.statistic=['Overview','Overview','Overview','Overview','Overview','Overview','Overview','Overview','Overview','Overview'];
        },

        switchChange(key){
            if(this.statistic[key]!='Overview'){
                // var dom = document.getElementById("chart"+key);
                // var myChart = echarts.init(dom);
                // var app = {};
                //
                //     option = {
                //         legend: {},
                //         tooltip: {
                //             trigger: 'axis',
                //             showContent: false
                //         },
                //         dataset: {
                //             source: [
                //                 ['product', '2012', '2013', '2014', '2015', '2016', '2017'],
                //                 ['Matcha Latte', 41.1, 30.4, 65.1, 53.3, 83.8, 98.7],
                //                 ['Milk Tea', 86.5, 92.1, 85.7, 83.1, 73.4, 55.1],
                //                 ['Cheese Cocoa', 24.1, 67.2, 79.5, 86.4, 65.2, 82.5],
                //                 ['Walnut Brownie', 55.2, 67.1, 69.2, 72.4, 53.9, 39.1]
                //             ]
                //         },
                //         xAxis: {type: 'category'},
                //         yAxis: {gridIndex: 0},
                //         grid: {top: '5%'},
                //         series: [
                //             {type: 'line', smooth: true, seriesLayoutBy: 'row'},
                //             {type: 'line', smooth: true, seriesLayoutBy: 'row'},
                //             {type: 'line', smooth: true, seriesLayoutBy: 'row'},
                //             {type: 'line', smooth: true, seriesLayoutBy: 'row'},
                //
                //         ]
                //     };
                //
                //
                //
                //     myChart.setOption(option);

                let chart=echarts.init(document.getElementById('chart'+key));
                chart.showLoading();
                $.get("/modelItem/getDailyViewCount",{oid:this.pageOption.searchResult[key].oid},(result)=> {
                    let valueList = result.data.valueList;//[0, 0, 0, 0, 0];
                    console.log(result)
                    chart.hideLoading();
                    // let option = {
                    //
                    //     // Make gradient line here
                    //     visualMap: [{
                    //         show: false,
                    //         type: 'continuous',
                    //         seriesIndex: 0,
                    //         min: 0,
                    //         max: result.data.max
                    //     }],
                    //     title: [{
                    //         left: 'center',
                    //         text: 'Daily View Count'
                    //     }],
                    //     tooltip: {
                    //         trigger: 'axis'
                    //     },
                    //     xAxis: [{
                    //         data: dateList
                    //     }],
                    //     yAxis: [{
                    //         splitLine: {show: false}
                    //     }],
                    //     grid: [{
                    //         top: '10%',
                    //         bottom: '15%'
                    //     }],
                    //     series: [{
                    //         type: 'line',
                    //         showSymbol: false,
                    //         data: valueList
                    //     }]
                    // };
                    let series = [];
                    for(i=1;i<valueList.length;i++){
                        series.push({type: 'line', smooth: false, seriesLayoutBy: 'row'});
                    }
                    option = {
                        legend: {},
                        tooltip: {
                            trigger: 'axis',
                            showContent: true
                        },
                        dataset: {
                            source:valueList
                            //     [
                            //     ['product', '2012', '2013', '2014', '2015', '2016', '2017'],
                            //     ['Matcha Latte', 41.1, 30.4, 65.1, 53.3, 83.8, 98.7],
                            //     ['Milk Tea', 86.5, 92.1, 85.7, 83.1, 73.4, 55.1],
                            //     ['Cheese Cocoa', 24.1, 67.2, 79.5, 86.4, 65.2, 82.5],
                            //     ['Walnut Brownie', 55.2, 67.1, 69.2, 72.4, 53.9, 39.1]
                            // ]
                        },
                        xAxis: {
                            type: 'category',
                            axisTick:{
                                show:false,
                            }
                        },
                        yAxis: {gridIndex: 0},
                        grid: {top: '15%',bottom:'15%'},
                        series:series
                        //     [
                        //     {type: 'line', smooth: true, seriesLayoutBy: 'row'},
                        //     {type: 'line', smooth: true, seriesLayoutBy: 'row'},
                        //     {type: 'line', smooth: true, seriesLayoutBy: 'row'},
                        //     {type: 'line', smooth: true, seriesLayoutBy: 'row'},
                        //
                        // ]
                    };

                    chart.setOption(option)
                })
            }
        },
        contribute(){
            $.ajax({
                url: '/user/load',
                type: 'get',
                // data对象中的属性名要和服务端控制器的参数名一致 login(name, password)
                // dataType : 'json',
                success: function (result) {
                    var json = JSON.parse(result);
                    if (json.oid != '') {
                        window.location.href="/user/userSpace#/model/createModelItem";
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
            this.switchInit();
            this.setUrl("/modelItem/repository")
            this.pageOption.currentPage = 1;
            this.classifications1=["all"];
            this.$refs.tree3.setCurrentKey(null);
            this.currentClass="ALL"
            this.getModels(2);
        },
        //页码change
        handlePageChange(val) {
            this.switchInit();
            let data=this.$refs.tree3.getCurrentNode();
            if(data!=null) {
                // this.setUrl("/modelItem/repository?category=" + data.oid + "&page=" + val);
            }
            this.pageOption.currentPage = val;

            window.scrollTo(0, 0);
            this.getModels(2);
        },

        handleCurrentChange(data) {

            this.switchInit();
            // this.setUrl("/modelItem/repository?category="+data.oid);
            // this.pageOption.searchResult=[];
            this.pageOption.total=0;
            this.pageOption.paginationShow=false;
            this.currentClass=data.label;
            let classes = [];
            classes.push(data.oid);
            this.classifications1 = classes;
            //this.getChildren(data.children)
            this.pageOption.currentPage=1;
            this.searchText="";
            this.getModels();
        },

        handleCurrentChange2(data) {

            this.switchInit();
            // this.setUrl("/modelItem/repository?category2="+data.oid);
            // this.pageOption.searchResult=[];
            this.pageOption.total=0;
            this.pageOption.paginationShow=false;
            this.currentClass=data.label;
            let classes = [];
            classes.push(data.oid);
            this.classifications3 = classes;
            //this.getChildren(data.children)
            this.pageOption.currentPage=1;
            this.searchText="";
            this.getModels(2);
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
            this.switchInit();
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
            this.getModels(2);
        },
        getModels(classType) {
            this.pageOption.progressBar = true;
            var data = {
                asc: this.pageOption.sortAsc,
                page: this.pageOption.currentPage - 1,
                pageSize: this.pageOption.pageSize,

            };
            switch (this.queryType) {
                case "normal":
                    data.searchText = this.searchText.trim();
                    if(classType==2) {
                        data.classifications = this.classifications3.length == 0 ? ["all"] : this.classifications3
                        data.classType=classType;
                    }else{
                        data.classifications = this.classifications1.length == 0 ? ["all"] : this.classifications1;
                        data.classType=1;
                    }

                    break;
                case "advanced":
                    var connects = $(".connect");
                    var props = $(".prop");
                    var values = $(".value");

                    var connect_arr = new Array();
                    var prop_arr = new Array();
                    var value_arr = new Array();

                    for (i = 0; i < props.length; i++) {
                        prop_arr.push(props.eq(i).text().trim())
                    }
                    for (i = 0; i < values.length; i++) {
                        value_arr.push(values.eq(i).val().trim() == "" ? " " : values.eq(i).val().trim());
                    }
                    for (i = 0; i < connects.length; i++) {
                        connect_arr.push(connects.eq(i).val().trim())
                    }

                    data.connects = connect_arr;
                    data.props = prop_arr;
                    data.values = value_arr;

                    data.classifications = this.classifications2.length == 0 ? ["all"] : this.classifications2

                    break;
            }
            console.log(data)
            this.Query(data, this.queryType);
        },
        Query(data, type) {
            console.log(data)
            let sendDate = (new Date()).getTime();

            data.classNum = 2;
            $.ajax({
                type: "POST",
                url: type == "normal" ? "/modelItem/searchClass" : "/modelItem/advance",
                data: data,
                async: true,
                success: (json) => {
                    if (json.code == 0) {
                        let data = json.data;
                        let receiveDate = (new Date()).getTime();
                        let responseTimeMs = receiveDate - sendDate;
                        let timeoutTime=0;
                        //console.log(responseTimeMs)
                        if(responseTimeMs<450){
                            timeoutTime=450-responseTimeMs;
                        }
                        setTimeout(() => {

                            this.pageOption.total = data.total;
                            this.pageOption.pages = data.pages;
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
        setUrl(newUrl){
            var stateObject = {};
            var title = "Model Item Repository | OpenGMS";
            history.pushState(stateObject,title,newUrl);
        },
        GetQueryString(name) {

            var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");

            var r = window.location.search.substr(1).match(reg);

            if(r!=null)return  unescape(r[2]); return null;

        },
        //显示功能引导框
        showDriver(){
            if(!this.driver){
                this.driver = new Driver({
                    "className": "scope-class",
                    "allowClose": false,
                    "opacity" : 0.1,
                    "prevBtnText": "previous",
                    "nextBtnText": "next"
                });
                this.stepsConfig = [
                    {
                        "element": ".searcherInputPanel",
                        "popover": {
                            "title": "Search",
                            "description": "Here you can search for models by model name.",
                            "position": "bottom-right",
                        }
                    },
                    {
                        "element" : ".categoryList",
                        "popover" : {
                            "title" : "Model classifications",
                            "description" : "Here you can view the models by category.",
                            "position" : "right",
                            "prevBtnText": "previous",
                            "nextBtnText": "next"
                        }
                    },
                    {
                        "element" : "#contributeBtn",
                        "popover" : {
                            "title" : "Contribute",
                            "description" : "Here you can share your model.",
                            "position" : "bottom",
                            "prevBtnText": "previous",
                            "nextBtnText": "next"
                        }
                    }
                ];
            }

            if(document.body.clientWidth < 1000){
                this.stepsConfig[1].popover.position = "top";
            }
            this.driver.defineSteps(this.stepsConfig);
            this.driver.start();
        }
    },
    mounted() {

        let category=this.GetQueryString("category");
        let page=this.GetQueryString("page");
        console.log(category,page)

        if(category!=null) {
            this.classifications1=[];
            this.classifications1.push(category);
            for(i=0;i<this.treeData.length;i++){
                if(category==this.treeData[i].oid){
                    this.$refs.tree3.setCurrentKey(this.treeData[i].id);
                    this.currentClass=this.treeData[i].label;
                    break;
                }
                else{
                    let children = this.treeData[i].children;
                    let find=false;
                    for(j=0;j<children.length;j++){
                        if(category==children[j].oid){
                            find=true;
                            this.$refs.tree3.setCurrentKey(children[j].id);
                            this.currentClass=children[j].label;
                            $(".el-tree-node__expand-icon").eq(i).click();
                            break;
                        }
                        else{
                            let childrens=children[j].children;
                            if(childrens!=undefined) {
                                for (k = 0; k < childrens.length; k++) {
                                    if (category == childrens[k].oid) {
                                        find = true;
                                        this.$refs.tree3.setCurrentKey(childrens[k].id);
                                        this.currentClass = childrens[k].label;
                                        $(".el-tree-node__expand-icon").eq(1).click();
                                        var index=j+2;
                                        setTimeout(function(){
                                            console.log($(".el-tree-node__expand-icon"))
                                            $(".el-tree-node__expand-icon").eq(index).click();
                                        },200);

                                        break;
                                    }
                                }
                            }

                        }
                    }
                    if(find){
                        break;
                    }
                }

            }
        }
        else{
            // this.$refs.tree3.setCurrentKey(2);
            // //展开分类树第一层
            // $(".el-tree-node__expand-icon").eq(0).click();
            // $(".el-tree-node__expand-icon").eq(1).click();
        }
        if(page!=null){
            this.pageOption.currentPage=page;
        }

        this.getModels(2);

        // if(category!=null||page!=null){
        //     this.getModels();
        // }
        // else{
        //
        //         this.currentClass="Hydrosphere";
        //         this.pageOption.total = 258;
        //         this.pageOption.pages = 26;
        //         this.pageOption.searchResult=[{"oid":"3f6857ba-c2d2-4e27-b220-6e5367803a12","name":"SWAT_Model","image":"","description":"The Soil & Water Assessment Tool is a small watershed to river basin-scale model used to simulate the quality and quantity of surface and ground water and predict the environmental impact of land use, land management practices, and climate change. SWAT is widely used in assessing soil erosion prevention and control, non-point source pollution control and regional management in watersheds.","author":"njgis","status":"public","keywords":["SWAT","Hydrology"],"createTime":"2018-06-13T06:19:16.079+0000","viewCount":2147},{"oid":"29c36489-6039-467d-9561-6d0b600d7d05","name":"TaiHu_Fvcom","image":"","description":"FVCOM is a prognostic, unstructured-grid, finite-volume, free-surface, 3-D primitive equation coastal ocean circulation model developed by UMASSD-WHOI joint efforts.","author":"njgis","status":"public","keywords":["Fvcome","TaiHu","Hydrology"],"createTime":"2018-06-21T09:12:23.784+0000","viewCount":716},{"oid":"5738ef7c-a5ac-46b5-a347-3c823f71b3a7","name":"FVCOM","image":"/static/modelItem/552bbfcb-9001-4b8b-b941-65e99cec0b9e.jpg","description":"FVCOM is a prognostic, unstructured-grid, finite-volume, free-surface, 3-D primitive equation coastal ocean circulation model developed by UMASSD-WHOI joint efforts.","author":"njgis","status":"public","keywords":["Fvcom"],"createTime":"2018-07-07T14:22:20.671+0000","viewCount":609},{"oid":"75fd5cca-0bfc-480b-a354-42a826739a02","name":"DCBAH","image":"","description":"DCBAH模型是一个以栅格为模拟单元的分布式水文模型，模型以VC++6.0为开发工具，集成的GIS平台为MapObjects 2.1。 ","author":"KingW","status":"public","keywords":["DCBAH","Hydrology"],"createTime":"2018-09-25T07:03:53.742+0000","viewCount":501},{"oid":"b3a88af1-3568-4219-99c4-aa8fbce3227d","name":"SWMM","image":"/static/modelItem/f9212425-210d-4b92-b0ef-59bcff0e62a9.jpg","description":"The EPA Storm Water Management Model (SWMM) is a dynamic rainfall-runoff simulation model used for single event or long-term (continuous) simulation of runoff quantity and quality from primarily urban areas(EPA SWMM Help).","author":"njgis","status":"public","keywords":["Strom","Water","Hydrology"],"createTime":"2018-10-15T03:23:36.150+0000","viewCount":496},{"oid":"b38ae888-629c-4ef3-a97e-984133f622a9","name":"Groundwater model of fractured karst aquifer","image":"","description":"地下水数值模型是刻画、表征和再现地下水系统的一种有效工具和常用手段，它能够模拟地下水系统特征，以及解决在复杂水文地质条件和地下水开发利用条件下的地下水资源评价问题。","author":"luyuchen","status":"public","keywords":["Groundwater","Hydrology"],"createTime":"2018-09-10T06:11:22.750+0000","viewCount":450},{"oid":"7c6b2b63-8e63-4928-947b-bf4530aa04b8","name":"BDS","image":"","description":"系统实现了在线可视化建模，需求方案的可定制，计算成果在线查询分析、动态显示的等功能。","author":"njgis","status":"public","keywords":["Hydrology"],"createTime":"2018-01-02T10:15:37.411+0000","viewCount":416},{"oid":"f1539402-d6d4-4b6d-a3a4-f332568f51bc","name":"SEIMS","image":"","description":"The Spatially Explicit Integrated Modeling System (SEIMS), is an integrated, modular, parallelized, fully-distributed watershed modeling and scenario analysis system.","author":"SongJ","status":"public","keywords":["SEIMS","SWAT","Water","BMPs","scenario analysis"],"createTime":"2018-08-11T09:41:46.393+0000","viewCount":386},{"oid":"2101af9f-f26d-49ed-8faa-9f017ed2b62f","name":"Yangtze Estuary&Hangzhou Bay Model","image":"","description":"This model uses FVCOM to simulate the surface of Yangtze Estuary-Hangzhou Bay.","author":"wxc627684875","status":"public","keywords":["Yangtze Estuary","Hangzhou Bay"],"createTime":"2018-08-14T07:12:41.256+0000","viewCount":384},{"oid":"ac980fc8-bf6a-4753-905f-d517fb9dd439","name":"Jiangsu Coastal Storm Surge Mathematical Model","image":"","description":"This model uses Adcirc model to simulate the storm surge along the coast of Jiangsu province.","author":"wxc627684875","status":"public","keywords":["Jiangsu Province","Storm Surge"],"createTime":"2018-08-13T12:15:06.311+0000","viewCount":378}];
        //         this.pageOption.users=[{"image":"/static/user/c4e82487-a828-497a-b549-f814ecccc8b7.jpg","name":"NNU_Group","oid":"42"},{"image":"/static/user/c4e82487-a828-497a-b549-f814ecccc8b7.jpg","name":"NNU_Group","oid":"42"},{"image":"/static/user/c4e82487-a828-497a-b549-f814ecccc8b7.jpg","name":"NNU_Group","oid":"42"},{"image":"/static/user/c4e82487-a828-497a-b549-f814ecccc8b7.jpg","name":"NNU_Group","oid":"42"},{"image":"","name":"KingW","oid":"3"},{"image":"","name":"芦宇辰","oid":"11"},{"image":"/static/user/c4e82487-a828-497a-b549-f814ecccc8b7.jpg","name":"NNU_Group","oid":"42"},{"image":"/static/user/ffcd99e4-68e2-4c3c-b9cb-a1dae632b263.jpg","name":"WangXinchang","oid":"49"},{"image":"/static/user/ffcd99e4-68e2-4c3c-b9cb-a1dae632b263.jpg","name":"WangXinchang","oid":"49"},{"image":"","name":"songjie","oid":"25"}];
        //         this.pageOption.progressBar = false;
        //         this.pageOption.paginationShow=true;
        //
        // }




        //expend
        $("#expend").click(() => {
            this.pageOption.searchResult=[];
            this.pageOption.paginationShow=false;

            this.setUrl("/modelItem/repository")
            this.queryType = "advanced";
            $(".searcherPanel").css("display", "none");
            $(".advancedSearch").css("display", "block");
            $("#tree1").css("display", "none");
            $("#tree2").css("display", "block");
            // if($(".el-checkbox__input").eq(1).hasClass("is-checked")==true){
            //     this.getModels();
            // }
            // else {
            //     $(".el-checkbox__input").eq(1).click();
            // }
            this.getModels();
            $("#curClassBar").hide();
        })
        $("#drawback").click(() => {
            this.pageOption.searchResult=[];
            this.pageOption.paginationShow=false;

            this.queryType = "normal";
            $(".searcherPanel").css("display", "block");
            $(".advancedSearch").css("display", "none");
            $("#tree2").css("display", "none");
            $("#tree1").css("display", "block");
            this.getModels();
            $("#curClassBar").show();
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
        });

        if(document.cookie.indexOf("modelRep=1")==-1){
            this.showDriver();
            var t=new Date(new Date().getTime()+1000*60*60*24*60);
            document.cookie="modelRep=1; expires="+t.toGMTString();
        }

    }
})