new Vue({
    el: '#app',
    data: function () {
        return {
            activeIndex:'3-1',
            queryType:'normal',
            searchText:'',
            classifications:[],


            pageOption:{
                progressBar:true,
                sortAsc:false,
                currentPage:1,
                pageSize:10,
                pages:0,
                total:0,
                searchResult:[],
            },



            treeData: [{
                id: 1,
                label: 'Earth System Classification',
                children: [{
                    label: 'Water System Models',
                    children: [{
                        label: 'Water System Synthetic Models',
                        oid:'14594f79-5638-4745-8a63-b70e18021db6'
                    }, {
                        label: 'Atmosphere Water System Models',
                        oid:'4fb7b5a9-448c-4c22-a17f-e06e2808357b'
                    }, {
                        label: 'Ocean Water System Models',
                        oid:'d5b4bfaf-1acd-47b1-a744-6fdc4edac873'
                    }, {
                        label: 'Surface Water System Models',
                        oid:'52adf119-e2b1-4030-a91b-741430a19235'
                    }, {
                        label: 'Underground Water System Models',
                        oid:'956a209d-0352-4863-87e9-ab8e4aa6e356'
                    }, {
                        label: 'Ice-Snow Water System Models',
                        oid:'2faa1f22-421c-4091-b25a-2ef1b024aa38'
                    }]
                },{
                    label: 'Soil System Models',
                    children: [{
                        label: 'Soil System Synthetic Models',
                        oid:'b9c3b6fa-6aca-414a-9ae2-2fb621ac1810'
                    }, {
                        label: 'Soil System Physical Models',
                        oid:'d0039a4e-b2b7-47cf-baf5-cd951e547f62'
                    }, {
                        label: 'Soil System Chemical Models',
                        oid:'4ebf8494-d60f-46ea-b1c4-b6a62ed451d6'
                    }, {
                        label: 'Soil System Ecological Models',
                        oid:'c85e58db-9483-4994-95ec-937914698aa5'
                    }, {
                        label: 'Soil System Statistical Models',
                        oid:'4e90aa10-29b7-4aa2-8caf-07360ef60e60'
                    }]
                },{
                    label: 'Atmosphere System Models',
                    children: [{
                        label: 'Atmosphere Models',
                        oid:'79767b9e-ea2a-4bbb-a232-24c6acc4ac92'
                    }, {
                        label: 'Atmosphere System Physical Models',
                        oid:'025d1231-4e45-41f3-99c2-2e579bb63bdf'
                    }, {
                        label: 'Atmosphere System Chemical Models',
                        oid:'d3929c36-7b5a-4fc6-a14b-25c1f3952418'
                    }, {
                        label: 'Atmosphere System Ecological Models',
                        oid:'74ba4f28-f3a3-415e-8e1d-90ff392713ee'
                    }, {
                        label: 'Atmosphere System Statistical Models',
                        oid:'7ad5c2a0-aaf4-4cc2-9486-f02536c804ea'
                    }]
                },{
                    label: 'Ecology System Models',
                    children: [{
                        label: 'Ecology System Synthetic Models',
                        oid:'3e7e0af4-cc3b-4f3e-887a-3a1a8120ca55'
                    }, {
                        label: 'Forest Ecology System Models',
                        oid:'9e79dc68-76b8-469f-a189-91417af72c36'
                    }, {
                        label: 'Agriculture Ecology System Models',
                        oid:'36d24cb7-d488-4a4a-aefa-a7b69a61188a'
                    }, {
                        label: 'Grassland Ecology System Models',
                        oid:'412a8380-2583-47f6-b500-0ebc8c661219'
                    }, {
                        label: 'Wetland Ecology System Models',
                        oid:'0cc9a796-9de7-479a-9330-8ceae0504e15'
                    }, {
                        label: 'Freshwater Ecology System Models',
                        oid:'8ad86df2-326a-4d20-9042-0ae9bf49c52d'
                    }, {
                        label: 'Seawater Ecology System Models',
                        oid:'989a5826-269f-4ea7-83ae-32c72a998638'
                    }, {
                        label: 'City Ecology System Models',
                        oid:'1d548543-d73f-4827-af0d-bbf237e4b5e9'
                    }]
                },{
                    label: 'Human/Society/Economy System Models',
                    children: [{
                        label: 'Human/Society/Economy System Synthetic Models',
                        oid:'401d5418-52ab-42cd-90e1-069041d5c85b'
                    }, {
                        label: 'Human/Society/Economy System Physical Models',
                        oid:'b2c3df21-8b05-48f7-af5e-bce9daef2551'
                    }, {
                        label: 'Human/Society/Economy System Chemical Models',
                        oid:'30ea2cd5-7cbf-4379-9892-1bf97584b855'
                    }, {
                        label: 'Human/Society/Economy System Ecological Models',
                        oid:'dfadfba7-424b-488e-8bc1-45f72849357d'
                    }, {
                        label: 'Human/Society/Economy System Statistical Models',
                        oid:'b94eadf1-d34a-4692-9948-840d066df71b'
                    }]
                },{
                    label: 'Global Models',
                    children: [{
                        label: 'Atmosphere System Models',
                        oid:'5a09586f-5480-424f-a6da-1b0590ab5a0c'
                    }, {
                        label: 'Land Surface Models',
                        oid:'3cbb6c8a-216e-4076-8757-b79eebe228d9'

                    }, {
                        label: 'Ocean Models',
                        oid:'44b9b1bb-caf8-4b47-8d2c-fb62a40ee117'
                    }, {
                        label: 'Ice Snow Models',
                        oid:'b280e129-3c6d-42c0-90c2-3ce3f36f7df3'
                    }, {
                        label: 'Solid Earth Models',
                        oid:'81f45ca4-b532-48d3-9bfd-c465e370be7d'
                    }]
                },{
                    label: 'GIS Analysis Tools',
                    children: [{
                        label: 'Data management tools',
                        oid:'6cc12923-edc1-4faf-8c7d-a14240cd897b'
                    }, {
                        label: 'Geostatistical Analyst Tools',
                        oid:'95a0b14e-4c16-44f4-8cdc-2271a46756a3'
                    }, {
                        label: 'Spatial Analyst Tools',
                        oid:'bfaaa852-6c64-4773-beb6-a7ea3414f95a'
                    }, {
                        label: '3D Analyst Tools',
                        oid:'340c275a-1ed4-495b-8415-a6a4bfe4eb18'
                    }]
                }]
            }, {
                id: 2,
                label: 'Mathematical Models of Resources and Environment',
                children: [{
                    label: 'Remote Sensing Imaging and Information Transmission Mechanism',
                    oid:'84e1090a-3f27-43fe-b912-d0dd7e9c8677'
                }, {
                    label: 'Characteristics of Ground Feature Spectrum and Spectrum',
                    oid:'63097163-10e5-4e16-8335-590dcc7156ba'
                }, {
                    label: 'Remote Sensing Information Processing and Analysis',
                    oid:'1f4a3c18-86d4-4534-864a-befda81da9f7'
                }, {
                    label: 'Cartography',
                    oid:'854189a4-3811-441d-a9d1-7de58e57a37f'
                }, {
                    label: 'Geographic Information System',
                    oid:'27910587-c1c5-4317-acf9-f3b062c37399'
                }, {
                    label: 'Other Comprehensive Models',
                    oid:'df9e1d04-954e-4488-a025-d6d9aa4fa190'
                }, {
                    label: 'Climate',
                    oid:'dcb2fa01-5507-4fbd-a533-1b7336cd497b'
                }, {
                    label: 'Geomorphology',
                    oid:'17b746ad-7dcf-4aa5-90b5-104c041caf62'
                }, {
                    label: 'Soil',
                    oid:'40d18155-6669-4416-990c-de0374ab587e'
                }, {
                    label: 'Hydrology',
                    oid:'158690be-1a1d-4e09-86a5-cbd5c0104206'
                }, {
                    label: 'Vegetation',
                    oid:'7656e180-c975-47fe-8ea6-abf417a94793'
                }, {
                    label: 'Industrial Geography',
                    oid:'e9590d02-c1bf-4f92-878c-4f2857fc9c33'
                }, {
                    label: 'Agricultural Geography',
                    oid:'7cf1aa10-58c0-4329-9a1d-9ace0cc2ba33'
                }, {
                    label: 'Traffic Geography',
                    oid:'64eb0340-6312-4549-9671-6bd635d5a8b3'
                }, {
                    label: 'Urban Geography',
                    oid:'51574401-09d9-4819-aa3e-17994e0396fd'
                }, {
                    label: 'Geographic Information System',
                    oid:'27910587-c1c5-4317-acf9-f3b062c37399'
                }, {
                    label: 'Tourism Geography',
                    oid:'bfa6147d-700e-4e06-978e-c9f0266608a8'
                }, {
                    label: 'Regional Geography',
                    oid:'0be6cd3b-a459-45df-b7e7-b2fb23aafd12'
                }, {
                    label: 'General Theories and Methods of Ecology',
                    oid:'69d55708-1fa6-4923-9190-c7d8db1b03a9'
                }, {
                    label: 'Individual and Physiological Ecology',
                    oid:'2f27b20f-2c37-4ac9-8d05-233d7b9d2331'
                }, {
                    label: 'Genecology',
                    oid:'564712e0-ba4a-4152-889d-742c98c505d8'
                }, {
                    label: 'Community and Ecosystem Ecology',
                    oid:'8df158c0-7ccb-45ca-9cf5-dbb403827ee4'
                }, {
                    label: 'Behavioral Ecology and Evolutionary Ecology',
                    oid:'b0a46eb9-fe34-48dc-8fc0-134f980ed8c2'
                }, {
                    label: 'Landscape Ecology',
                    oid:'ea9ec8a0-34f3-4139-a62c-2dec915c4d4b'
                }, {
                    label: 'Global Change',
                    oid:'c9dc5ae0-2882-461a-a9b4-282ae0ef984f'
                }, {
                    label: 'Biodiversity',
                    oid:'4e664f34-6e8b-435b-afc1-44b468a7d63e'
                }, {
                    label: 'Toxicology Ecology',
                    oid:'0314a51a-da2d-4338-ae69-61d474b17bf5'
                }, {
                    label: 'Ecological Management and Restoration Ecology',
                    oid:'671f5973-ddff-4d63-8513-67b71edc1342'
                }, {
                    label: 'Other Rcological Rnvironment Models',
                    oid:'9a164464-f8f1-4440-81e0-a530017615ed'
                }]
            }
                // , {
                //     id: 3,
                //     label: 'Others',
                //     children: [{
                //         label: 'Others'
                //     }]
                // }
            ],
            defaultProps: {
                children: 'children',
                label: 'label'
            }
        }
    },
    methods: {
        search(){
            this.pageOption.currentPage=1;
            this.getModels();
        },
        handleCurrentChange(val) {
            this.pageOption.currentPage=val;
            window.scrollTo(0,0);
            this.getModels();
        },
        handleCheckChange(data, checked, indeterminate) {
            var checkedNodes=this.$refs.tree.getCheckedNodes()
            var classes=[];
            for(i=0;i<checkedNodes.length;i++){
                if(checkedNodes[i].children==null){
                    classes.push(checkedNodes[i].oid);
                }
            }
            this.classifications=classes;
            console.log(this.classifications)
            this.getModels();
        },
        getModels() {
            this.pageOption.progressBar = true;
            var data={
                asc: this.pageOption.sortAsc,
                page: this.pageOption.currentPage-1,
                pageSize: this.pageOption.pageSize,
                classifications:this.classifications.length==0?["all"]:this.classifications
            };
            switch(this.queryType){
                case "normal":
                    data.searchText=this.searchText;
                    break;
                case "advanced":
                    var connects=$(".connect");
                    var props=$(".prop");
                    var values=$(".value");

                    var connect_arr=new Array();
                    var prop_arr=new Array();
                    var value_arr=new Array();

                    for(i=0;i<props.length;i++){
                        prop_arr.push(props.eq(i).text().trim())
                    }
                    for(i=0;i<values.length;i++){
                        value_arr.push(values.eq(i).val().trim()==""?" ":values.eq(i).val().trim());
                    }
                    for(i=0;i<connects.length;i++){
                        connect_arr.push(connects.eq(i).val().trim())
                    }

                    data.connects=connect_arr;
                    data.props=prop_arr;
                    data.values=value_arr;

                    break;
            }
            this.Query(data,this.queryType);
        },
        Query(data,type){
            $.ajax({
                type: "POST",
                url: type=="normal"?"/conceptualModel/list":"/conceptualModel/advance",
                data: data,
                async: true,
                success: (json) => {
                    var data=type=="normal"?json.data:eval('('+json.data+')');
                    setTimeout(() => {

                        this.pageOption.total = data.total;
                        this.pageOption.pages=data.pages;
                        this.pageOption.searchResult = data.list;
                        this.pageOption.progressBar = false;

                    }, 500);
                }
            })
        },


    },
    mounted(){

        this.getModels();

        //expend
        $("#expend").click(()=>{
            this.queryType="advanced";
            $(".searcherPanel").css("display","none");
            $(".advancedSearch").css("display","block");
        })
        $("#drawback").click(()=>{
            this.queryType="normal";
            $(".searcherPanel").css("display","block");
            $(".advancedSearch").css("display","none");
        })

        //field select
        $(document).on("click",".propName",function(){
            var downArrow="<span class=\"caret\"></span>";
            $(this).parents(".input-group-btn").children("button").html($(this).text()+downArrow);
        })

        //add
        $(".fa-plus").click(function () {

            var field;
            var lineCount=$(".lines").children(".line").length;
            switch (lineCount){
                case 1:
                    field="Keyword";
                    break;
                case 2:
                    field="Overview";
                    break;
                case 3:
                    field="Provider";
                    break;
            }

            var line="<div class=\"line\">\n" +
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
                "                                                data-toggle=\"dropdown\">"+field+"<span class=\"caret\"></span></button>\n" +
                "                                        <ul class=\"dropdown-menu\">\n" +
                "                                            <li><a class=\"propName\" href=\"javascript:void(0);\">Model Name</a></li>\n" +
                "                                            <li><a class=\"propName\" href=\"javascript:void(0);\">Keyword</a></li>\n" +
                "                                            <li><a class=\"propName\" href=\"javascript:void(0);\">Overview</a></li>\n" +
                "                                            <li><a class=\"propName\" href=\"javascript:void(0);\">Provider</a></li>\n" +
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

            if(lineCount<=3) {
                $(".lines").append(line)
            }
        })
        //delete
        $(".fa-minus").click(function () {
            var lines=$(".lines").children(".line");
            if(lines.length>1) {
                lines.eq(lines.length - 1).remove();
            }
        })
    }
})