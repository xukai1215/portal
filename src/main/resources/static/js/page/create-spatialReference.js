var createSpatialReference = Vue.extend({
    template: "#createSpatialReference",
    data() {
        return {
            status: "Public",

            defaultActive: '4-2',
            curIndex: '6',

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

            treeData: [{
                id: 1,
                label: "Spatial Reference Repository",
                oid: '58340c92-d74f-4d81-8a80-e4fcff286008',
                children: [{
                    id: 100,
                    "oid": "da70ad83-de57-4fc3-a85d-c1dcf4961433",
                    "label": "Basic"
                },
                    {
                        id: 101,
                        "oid": "c4642926-e797-4f61-92d6-7933df2413d2",
                        "label": "EPSG"
                    },
                    {
                        id: 102,
                        "oid": "e8562394-b55f-46d7-870e-ef5ad3aaf110",
                        "label": "ESRI"
                    },
                    {
                        id: 103,
                        "oid": "ee830613-1603-4f38-a196-5028e4e10d39",
                        "label": "IAU"
                    },
                    {
                        id: 104,
                        "oid": "b2f2fbfd-f21a-47ac-9e1f-a96ac0218bf1",
                        "label": "Customized"
                    }]
            }, {
                id: 2,
                label: "Temporal Reference Repository",
                oid: 'ce37e343-bf2c-4e7b-902e-46616604e184',
                children: [{
                    id: 3,
                    label: "Global",
                    oid: '295d2120-402b-4ee6-a0b5-308b67fe2c40',
                },
                    {
                        id: 4,
                        label: "Local",
                        oid: '6883d3fb-8485-4771-9a3e-3276c759364e',
                    }]
            }],

            defaultProps: {
                children: 'children',
                label: 'label'
            },
            cls: [],
            clsStr: '',
            parId: "",

            referenceInfo: {},

            socket: "",

            spatialReference_oid: "",

            editType:"",//create,modify
            currentLocalization:{
                localCode:"",
                localName:"",
                name:"",
                description:"",
            },
            localIndex: 0,
            languageAdd:{
                show:false,
                local:{},
            },
            localizationList:[
                {
                    localCode:"en-US",
                    localName:"English (United States)",
                    name:"",
                    description:"",
                    selected:true,
                }
            ],
            languageList:[
                { value: 'af', label: 'Afrikaans' },
                { value: 'af-ZA', label: 'Afrikaans (South Africa)' },
                { value: 'sq', label: 'Albanian' },
                { value: 'sq-AL', label: 'Albanian (Albania)' },
                { value: 'ar', label: 'Arabic' },
                { value: 'ar-DZ', label: 'Arabic (Algeria)' },
                { value: 'ar-BH', label: 'Arabic (Bahrain)' },
                { value: 'ar-EG', label: 'Arabic (Egypt)' },
                { value: 'ar-IQ', label: 'Arabic (Iraq)' },
                { value: 'ar-JO', label: 'Arabic (Jordan)' },
                { value: 'ar-KW', label: 'Arabic (Kuwait)' },
                { value: 'ar-LB', label: 'Arabic (Lebanon)' },
                { value: 'ar-LY', label: 'Arabic (Libya)' },
                { value: 'ar-MA', label: 'Arabic (Morocco)' },
                { value: 'ar-OM', label: 'Arabic (Oman)' },
                { value: 'ar-QA', label: 'Arabic (Qatar)' },
                { value: 'ar-SA', label: 'Arabic (Saudi Arabia)' },
                { value: 'ar-SY', label: 'Arabic (Syria)' },
                { value: 'ar-TN', label: 'Arabic (Tunisia)' },
                { value: 'ar-AE', label: 'Arabic (U.A.E.)' },
                { value: 'ar-YE', label: 'Arabic (Yemen)' },
                { value: 'hy', label: 'Armenian' },
                { value: 'hy-AM', label: 'Armenian (Armenia)' },
                { value: 'az-AZ', label: 'Azeri (Cyrillic) (Azerbaijan)' },
                { value: 'az', label: 'Azeri (Latin)' },
                { value: 'az-AZ', label: 'Azeri (Latin) (Azerbaijan)' },
                { value: 'eu', label: 'Basque' },
                { value: 'eu-ES', label: 'Basque (Spain)' },
                { value: 'be', label: 'Belarusian' },
                { value: 'be-BY', label: 'Belarusian (Belarus)' },
                { value: 'bs-BA', label: 'Bosnian (Bosnia and Herzegovina)' },
                { value: 'bg', label: 'Bulgarian' },
                { value: 'bg-BG', label: 'Bulgarian (Bulgaria)' },
                { value: 'ca', label: 'Catalan' },
                { value: 'ca-ES', label: 'Catalan (Spain)' },
                { value: 'zh', label: 'Chinese' },
                { value: 'zh-HK', label: 'Chinese (Hong Kong)' },
                { value: 'zh-MO', label: 'Chinese (Macau)' },
                { value: 'zh-CN', label: 'Chinese (Simplified)' },
                { value: 'zh-SG', label: 'Chinese (Singapore)' },
                { value: 'zh-TW', label: 'Chinese (Traditional)' },
                { value: 'hr', label: 'Croatian' },
                { value: 'hr-BA', label: 'Croatian (Bosnia and Herzegovina)' },
                { value: 'hr-HR', label: 'Croatian (Croatia)' },
                { value: 'cs', label: 'Czech' },
                { value: 'cs-CZ', label: 'Czech (Czech Republic)' },
                { value: 'da', label: 'Danish' },
                { value: 'da-DK', label: 'Danish (Denmark)' },
                { value: 'dv', label: 'Divehi' },
                { value: 'dv-MV', label: 'Divehi (Maldives)' },
                { value: 'nl', label: 'Dutch' },
                { value: 'nl-BE', label: 'Dutch (Belgium)' },
                { value: 'nl-NL', label: 'Dutch (Netherlands)' },
                { value: 'en', label: 'English' },
                { value: 'en-AU', label: 'English (Australia)' },
                { value: 'en-BZ', label: 'English (Belize)' },
                { value: 'en-CA', label: 'English (Canada)' },
                { value: 'en-CB', label: 'English (Caribbean)' },
                { value: 'en-IE', label: 'English (Ireland)' },
                { value: 'en-JM', label: 'English (Jamaica)' },
                { value: 'en-NZ', label: 'English (New Zealand)' },
                { value: 'en-PH', label: 'English (Republic of the Philippines)' },
                { value: 'en-ZA', label: 'English (South Africa)' },
                { value: 'en-TT', label: 'English (Trinidad and Tobago)' },
                { value: 'en-GB', label: 'English (United Kingdom)' },
                { value: 'en-US', label: 'English (United States)' },
                { value: 'en-ZW', label: 'English (Zimbabwe)' },
                { value: 'eo', label: 'Esperanto' },
                { value: 'et', label: 'Estonian' },
                { value: 'et-EE', label: 'Estonian (Estonia)' },
                { value: 'mk', label: 'FYRO Macedonian' },
                { value: 'mk-MK', label: 'FYRO Macedonian (Former Yugoslav Republic of Macedonia)' },
                { value: 'fo', label: 'Faroese' },
                { value: 'fo-FO', label: 'Faroese (Faroe Islands)' },
                { value: 'fa', label: 'Farsi' },
                { value: 'fa-IR', label: 'Farsi (Iran)' },
                { value: 'fi', label: 'Finnish' },
                { value: 'fi-FI', label: 'Finnish (Finland)' },
                { value: 'fr', label: 'French' },
                { value: 'fr-BE', label: 'French (Belgium)' },
                { value: 'fr-CA', label: 'French (Canada)' },
                { value: 'fr-FR', label: 'French (France)' },
                { value: 'fr-LU', label: 'French (Luxembourg)' },
                { value: 'fr-MC', label: 'French (Principality of Monaco)' },
                { value: 'fr-CH', label: 'French (Switzerland)' },
                { value: 'gl', label: 'Galician' },
                { value: 'gl-ES', label: 'Galician (Spain)' },
                { value: 'ka', label: 'Georgian' },
                { value: 'ka-GE', label: 'Georgian (Georgia)' },
                { value: 'de', label: 'German' },
                { value: 'de-AT', label: 'German (Austria)' },
                { value: 'de-DE', label: 'German (Germany)' },
                { value: 'de-LI', label: 'German (Liechtenstein)' },
                { value: 'de-LU', label: 'German (Luxembourg)' },
                { value: 'de-CH', label: 'German (Switzerland)' },
                { value: 'el', label: 'Greek' },
                { value: 'el-GR', label: 'Greek (Greece)' },
                { value: 'gu', label: 'Gujarati' },
                { value: 'gu-IN', label: 'Gujarati (India)' },
                { value: 'he', label: 'Hebrew' },
                { value: 'he-IL', label: 'Hebrew (Israel)' },
                { value: 'hi', label: 'Hindi' },
                { value: 'hi-IN', label: 'Hindi (India)' },
                { value: 'hu', label: 'Hungarian' },
                { value: 'hu-HU', label: 'Hungarian (Hungary)' },
                { value: 'is', label: 'Icelandic' },
                { value: 'is-IS', label: 'Icelandic (Iceland)' },
                { value: 'id', label: 'Indonesian' },
                { value: 'id-ID', label: 'Indonesian (Indonesia)' },
                { value: 'it', label: 'Italian' },
                { value: 'it-IT', label: 'Italian (Italy)' },
                { value: 'it-CH', label: 'Italian (Switzerland)' },
                { value: 'ja', label: 'Japanese' },
                { value: 'ja-JP', label: 'Japanese (Japan)' },
                { value: 'kn', label: 'Kannada' },
                { value: 'kn-IN', label: 'Kannada (India)' },
                { value: 'kk', label: 'Kazakh' },
                { value: 'kk-KZ', label: 'Kazakh (Kazakhstan)' },
                { value: 'kok', label: 'Konkani' },
                { value: 'kok-IN', label: 'Konkani (India)' },
                { value: 'ko', label: 'Korean' },
                { value: 'ko-KR', label: 'Korean (Korea)' },
                { value: 'ky', label: 'Kyrgyz' },
                { value: 'ky-KG', label: 'Kyrgyz (Kyrgyzstan)' },
                { value: 'lv', label: 'Latvian' },
                { value: 'lv-LV', label: 'Latvian (Latvia)' },
                { value: 'lt', label: 'Lithuanian' },
                { value: 'lt-LT', label: 'Lithuanian (Lithuania)' },
                { value: 'ms', label: 'Malay' },
                { value: 'ms-BN', label: 'Malay (Brunei Darussalam)' },
                { value: 'ms-MY', label: 'Malay (Malaysia)' },
                { value: 'mt', label: 'Maltese' },
                { value: 'mt-MT', label: 'Maltese (Malta)' },
                { value: 'mi', label: 'Maori' },
                { value: 'mi-NZ', label: 'Maori (New Zealand)' },
                { value: 'mr', label: 'Marathi' },
                { value: 'mr-IN', label: 'Marathi (India)' },
                { value: 'mn', label: 'Mongolian' },
                { value: 'mn-MN', label: 'Mongolian (Mongolia)' },
                { value: 'ns', label: 'Northern Sotho' },
                { value: 'ns-ZA', label: 'Northern Sotho (South Africa)' },
                { value: 'nb', label: 'Norwegian (Bokm?l)' },
                { value: 'nb-NO', label: 'Norwegian (Bokm?l) (Norway)' },
                { value: 'nn-NO', label: 'Norwegian (Nynorsk) (Norway)' },
                { value: 'ps', label: 'Pashto' },
                { value: 'ps-AR', label: 'Pashto (Afghanistan)' },
                { value: 'pl', label: 'Polish' },
                { value: 'pl-PL', label: 'Polish (Poland)' },
                { value: 'pt', label: 'Portuguese' },
                { value: 'pt-BR', label: 'Portuguese (Brazil)' },
                { value: 'pt-PT', label: 'Portuguese (Portugal)' },
                { value: 'pa', label: 'Punjabi' },
                { value: 'pa-IN', label: 'Punjabi (India)' },
                { value: 'qu', label: 'Quechua' },
                { value: 'qu-BO', label: 'Quechua (Bolivia)' },
                { value: 'qu-EC', label: 'Quechua (Ecuador)' },
                { value: 'qu-PE', label: 'Quechua (Peru)' },
                { value: 'ro', label: 'Romanian' },
                { value: 'ro-RO', label: 'Romanian (Romania)' },
                { value: 'ru', label: 'Russian' },
                { value: 'ru-RU', label: 'Russian (Russia)' },
                { value: 'se-FI', label: 'Sami (Inari) (Finland)' },
                { value: 'se-NO', label: 'Sami (Lule) (Norway)' },
                { value: 'se-SE', label: 'Sami (Lule) (Sweden)' },
                { value: 'se', label: 'Sami (Northern)' },
                { value: 'se-FI', label: 'Sami (Northern) (Finland)' },
                { value: 'se-NO', label: 'Sami (Northern) (Norway)' },
                { value: 'se-SE', label: 'Sami (Northern) (Sweden)' },
                { value: 'se-FI', label: 'Sami (Skolt) (Finland)' },
                { value: 'se-NO', label: 'Sami (Southern) (Norway)' },
                { value: 'se-SE', label: 'Sami (Southern) (Sweden)' },
                { value: 'sa', label: 'Sanskrit' },
                { value: 'sa-IN', label: 'Sanskrit (India)' },
                { value: 'sr-BA', label: 'Serbian (Cyrillic) (Bosnia and Herzegovina)' },
                { value: 'sr-SP', label: 'Serbian (Cyrillic) (Serbia and Montenegro)' },
                { value: 'sr-BA', label: 'Serbian (Latin) (Bosnia and Herzegovina)' },
                { value: 'sr-SP', label: 'Serbian (Latin) (Serbia and Montenegro)' },
                { value: 'sk', label: 'Slovak' },
                { value: 'sk-SK', label: 'Slovak (Slovakia)' },
                { value: 'sl', label: 'Slovenian' },
                { value: 'sl-SI', label: 'Slovenian (Slovenia)' },
                { value: 'es', label: 'Spanish' },
                { value: 'es-AR', label: 'Spanish (Argentina)' },
                { value: 'es-BO', label: 'Spanish (Bolivia)' },
                { value: 'es-ES', label: 'Spanish (Castilian)' },
                { value: 'es-CL', label: 'Spanish (Chile)' },
                { value: 'es-CO', label: 'Spanish (Colombia)' },
                { value: 'es-CR', label: 'Spanish (Costa Rica)' },
                { value: 'es-DO', label: 'Spanish (Dominican Republic)' },
                { value: 'es-EC', label: 'Spanish (Ecuador)' },
                { value: 'es-SV', label: 'Spanish (El Salvador)' },
                { value: 'es-GT', label: 'Spanish (Guatemala)' },
                { value: 'es-HN', label: 'Spanish (Honduras)' },
                { value: 'es-MX', label: 'Spanish (Mexico)' },
                { value: 'es-NI', label: 'Spanish (Nicaragua)' },
                { value: 'es-PA', label: 'Spanish (Panama)' },
                { value: 'es-PY', label: 'Spanish (Paraguay)' },
                { value: 'es-PE', label: 'Spanish (Peru)' },
                { value: 'es-PR', label: 'Spanish (Puerto Rico)' },
                { value: 'es-ES', label: 'Spanish (Spain)' },
                { value: 'es-UY', label: 'Spanish (Uruguay)' },
                { value: 'es-VE', label: 'Spanish (Venezuela)' },
                { value: 'sw', label: 'Swahili' },
                { value: 'sw-KE', label: 'Swahili (Kenya)' },
                { value: 'sv', label: 'Swedish' },
                { value: 'sv-FI', label: 'Swedish (Finland)' },
                { value: 'sv-SE', label: 'Swedish (Sweden)' },
                { value: 'syr', label: 'Syriac' },
                { value: 'syr-SY', label: 'Syriac (Syria)' },
                { value: 'tl', label: 'Tagalog' },
                { value: 'tl-PH', label: 'Tagalog (Philippines)' },
                { value: 'ta', label: 'Tamil' },
                { value: 'ta-IN', label: 'Tamil (India)' },
                { value: 'tt', label: 'Tatar' },
                { value: 'tt-RU', label: 'Tatar (Russia)' },
                { value: 'te', label: 'Telugu' },
                { value: 'te-IN', label: 'Telugu (India)' },
                { value: 'th', label: 'Thai' },
                { value: 'th-TH', label: 'Thai (Thailand)' },
                { value: 'ts', label: 'Tsonga' },
                { value: 'tn', label: 'Tswana' },
                { value: 'tn-ZA', label: 'Tswana (South Africa)' },
                { value: 'tr', label: 'Turkish' },
                { value: 'tr-TR', label: 'Turkish (Turkey)' },
                { value: 'uk', label: 'Ukrainian' },
                { value: 'uk-UA', label: 'Ukrainian (Ukraine)' },
                { value: 'ur', label: 'Urdu' },
                { value: 'ur-PK', label: 'Urdu (Islamic Republic of Pakistan)' },
                { value: 'uz-UZ', label: 'Uzbek (Cyrillic) (Uzbekistan)' },
                { value: 'uz', label: 'Uzbek (Latin)' },
                { value: 'uz-UZ', label: 'Uzbek (Latin) (Uzbekistan)' },
                { value: 'vi', label: 'Vietnamese' },
                { value: 'vi-VN', label: 'Vietnamese (Viet Nam)' },
                { value: 'cy', label: 'Welsh' },
                { value: 'cy-GB', label: 'Welsh (United Kingdom)' },
                { value: 'xh', label: 'Xhosa' },
                { value: 'xh-ZA', label: 'Xhosa (South Africa)' },
                { value: 'zu', label: 'Zulu' },
                { value: 'zu-ZA', label: 'Zulu (South Africa)' },
            ],

            editType:'create',

            toCreate: 1,

            draft:{
                oid:'',
            },

            draftOid:'',

            startDraft:0,

            itemInfoImage:''
        }
    },
    methods: {
        addLocalization(){
            this.languageAdd.show = true;
        },
        confirmAddLocal(){

            if(this.languageAdd.local.label==undefined){
                this.$message({
                    message: 'Please selcet a language!',
                    type: 'warning'
                });
                return;
            }
            for(i=0;i<this.localizationList.length;i++){
                let localization = this.localizationList[i];
                if(localization.localName==this.languageAdd.local.label){
                    this.$message({
                        message: 'This language already exists!',
                        type: 'warning'
                    });
                    return;
                }
            }

            let newLocalization = {
                localCode:this.languageAdd.local.value,
                localName:this.languageAdd.local.label,
                name:"",
                description:"",
            };
            this.localizationList.push(newLocalization);
            this.languageAdd.local={};

            this.changeLocalization(newLocalization);
        },
        cancelAddLocal(){
            this.languageAdd.show = false;
        },
        deleteLocalization(row){
            this.$confirm('Do you want to delete <b>'+row.localName+'</b> description?', 'Warning', {
                dangerouslyUseHTMLString: true,
                confirmButtonText: 'Yes',
                cancelButtonText: 'No',
                type: 'warning'
            }).then(() => {

                for(i=0;i<this.localizationList.length;i++){
                    let localization = this.localizationList[i]
                    if(localization.localName==row.localName){
                        this.localizationList.splice(i,1);
                        break;
                    }
                }
                if(this.localizationList.length>0){
                    this.changeLocalization(this.localizationList[0]);
                }else{
                    this.changeLocalization(null);
                }

                this.$message({
                    type: 'success',
                    message: 'Delete '+row.localName+' successfully!',
                });
            }).catch(() => {

            });

        },
        changeLocalization(row){
            if(row==null){
                this.currentLocalization={
                    localCode:"",
                    localName:"",
                    name:"",
                    description:"",
                };
                tinymce.activeEditor.setContent("");
                // tinymce.undoManager.clear();
            }else {
                for (i = 0; i < this.localizationList.length; i++) {
                    this.$set(this.localizationList[i], "selected", false);
                    if (this.currentLocalization.localName == this.localizationList[i].localName) {
                        this.localizationList[i].name = this.currentLocalization.name;
                        this.localizationList[i].description = tinymce.activeEditor.getContent();
                    }
                }
                this.$set(row, "selected", true);
                this.currentLocalization = row;
                tinymce.activeEditor.setContent(row.description);
                // tinymce.undoManager.clear();
            }
        },
        changeRter(index) {
            this.curIndex = index;
            var urls = {
                1: '/user/userSpace',
                2: '/user/userSpace/model',
                3: '/user/userSpace/data',
                4: '/user/userSpace/server',
                5: '/user/userSpace/task',
                6: '/user/userSpace/community',
                7: '/user/userSpace/theme',
                8: '/user/userSpace/account',
                9: '/user/userSpace/feedback',
            }

            this.setSession('curIndex', index)
            window.location.href = urls[index]

        },
        handleSelect(index, indexPath) {
            this.setSession("index", index);
            window.location.href = "/user/userSpace"
        },
        handleCheckChange(data, checked, indeterminate) {
            let checkedNodes = this.$refs.tree2.getCheckedNodes()
            let classes = [];
            let str = '';
            for (let i = 0; i < checkedNodes.length; i++) {
                // console.log(checkedNodes[i].children)
                if (checkedNodes[i].children != undefined) {
                    continue;
                }

                classes.push(checkedNodes[i].oid);
                str += checkedNodes[i].label;
                if (i != checkedNodes.length - 1) {
                    str += ", ";
                }
            }
            this.cls = classes;
            this.clsStr = str;

        },
        changeOpen(n) {
            this.activeIndex = n;
        },

        insertInfo(basicInfo){
            let user_num = 0;

            this.referenceInfo = basicInfo;

            //cls
            this.cls = basicInfo.classifications;
            this.status = basicInfo.status;
            let ids = [];
            for (i = 0; i < this.cls.length; i++) {
                for (j = 0; j < 1; j++) {
                    for (k = 0; k < this.treeData[j].children.length; k++) {
                        if (this.cls[i] == this.treeData[j].children[k].oid) {
                            ids.push(this.treeData[j].children[k].id);
                            this.parid = this.treeData[j].children[k].id;
                            this.clsStr += this.treeData[j].children[k].label;
                            if (i != this.cls.length - 1) {
                                this.clsStr += ", ";
                            }
                            break;
                        }
                    }
                    if (ids.length - 1 == i) {
                        break;
                    }
                }
            }

            this.$refs.tree2.setCheckedKeys(ids);

            $(".providers").children(".panel").remove();
            $("#wknameInput").val(basicInfo.wkname);
            $("#wktInput").val(basicInfo.wkt);
            $("#nameInput").val(basicInfo.name);
            $("#descInput").val(basicInfo.description);

            //image
            if (basicInfo.image != "") {
                this.itemInfoImage = basicInfo.image
            }

            //detail
            initTinymce('textarea#conceptText')
            this.localizationList = basicInfo.localizationList;
            let interval = setInterval(()=> {
                this.changeLocalization(this.localizationList[0])
                clearInterval(interval);
            },1000);

            //alias
            $('#aliasInput').tagEditor('destroy');
            $('#aliasInput').tagEditor({
                initialTags: basicInfo.alias ,
                forceLowercase: false,
                // placeholder: 'Enter alias ...'
            });




        },

        getItemContent(trigger,callBack){
            let itemObj = {}

            itemObj.classifications = this.cls;
            itemObj.name = $("#nameInput").val();
            itemObj.alias = $("#aliasInput").val().split(",");
            itemObj.status = this.status;
            itemObj.wkname = $("#wknameInput").val();
            itemObj.wkt = $("#wktInput").val();
            itemObj.description = $("#descInput").val();
            itemObj.uploadImage = this.itemInfoImage
            itemObj.localizationList = this.localizationList;

            if(this.editType == 'modify') {

                for (i = 0; i < this.localizationList.length; i++) {
                    if (this.currentLocalization.localName == this.localizationList[i].localName) {
                        this.localizationList[i].name = this.currentLocalization.name;
                        this.localizationList[i].description = tinymce.activeEditor.getContent();
                        break;
                    }
                }
                itemObj.localizationList = this.localizationList;

            }else {
                itemObj.localizationList = [];

                this.currentLocalization.description = tinymce.activeEditor.getContent();
                this.currentLocalization.localCode = this.languageAdd.local.value;
                this.currentLocalization.localName = this.languageAdd.local.label;

                itemObj.localizationList.push(this.currentLocalization);
            }

            if(callBack){
                callBack(itemObj)
            }

            return itemObj;
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
                this.itemInfoImage = e.target.result
            }


        },

        deleteImg(){
            let obj = document.getElementById('imgOne')
            // obj.outerHTML=obj.outerHTML
            obj.value = ''
            this.itemInfoImage = ''
        },

        //draft
        onInputName(){
            console.log(1)
            if(this.toCreate==1){
                this.toCreate=0
                this.timeOut=setTimeout(()=>{
                    this.toCreate=1
                    this.startDraft=1
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

        createDraft(){//请求后台创建一个草稿实例,如果存在则更新

            var step = this.getStep()
            let content=this.getItemContent(step)

            let urls=window.location.href.split('/')
            let item=urls[6]
            item=item.substring(6,item.length)
            let obj={
                content:content,
                editType:this.editType,
                itemType:item,
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

        deleteDraft(){
            this.$refs.draftBox.deleteDraft(this.draft.oid)
        },

        initDraft(editType,backUrl,oidFrom,oid){
            this.$refs.draftBox.initDraft(editType,backUrl,oidFrom,oid)
        },

        getDraft(){
            return this.$refs.draftBox.getDraft();
        },

        insertDraft(draftContent){
            this.insertInfo(draftContent)
        },

        cancelEditClick(){
            if(this.getDraft()!=null){
                this.$refs.draftBox.cancelDraftDialog=true
            }else{
                setTimeout(() => {
                    window.location.href = "/user/userSpace#/communities/dataTemplate";
                }, 905)
            }
        },

        draftJump(){
            window.location.href = '/user/userSpace#/communities/dataTemplate';
        },

        setSession(name, value) {
            window.sessionStorage.setItem(name, value);
        },

        sendcurIndexToParent() {
            this.$emit('com-sendcurindex', this.curIndex)
        },

        sendUserToParent(userId) {
            this.$emit('com-senduserinfo', userId)
        },

        init: function () {

            // if ('WebSocket' in window) {
            //     // this.socket = new WebSocket("ws://localhost:8080/websocket");
            //     this.socket = new WebSocket(websocketAddress);
            //     // 监听socket连接
            //     this.socket.onopen = this.open;
            //     // 监听socket错误信息
            //     this.socket.onerror = this.error;
            //     // 监听socket消息
            //     this.socket.onmessage = this.getMessage;
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
        getMessageNum(spatialReference_oid) {
            this.message_num_socket = 0;//初始化消息数目
            let data = {
                type: 'spatialReference',
                oid: spatialReference_oid,
            };

            //根据oid去取该作者的被编辑的条目数量
            $.ajax({
                url: "/theme/getAuthorMessageNum",
                type: "GET",
                data: data,
                async: false,
                success: (json) => {
                    this.message_num_socket = json;
                }
            });
            let data_theme = {
                type: 'spatialReference',
                oid: spatialReference_oid,
            };
            $.ajax({
                url: "/theme/getThemeMessageNum",
                async: false,
                type: "GET",
                data: data_theme,
                success: (json) => {
                    console.log(json);
                    for (let i = 0; i < json.length; i++) {
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
                                    } else if (k == 1) {
                                        switch (type[j].status) {
                                            case "0":
                                                this.message_num_socket++;
                                        }
                                    } else if (k == 2) {
                                        switch (type[j].status) {
                                            case "0":
                                                this.message_num_socket++;
                                        }
                                    } else if (k == 3) {
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
    mounted() {
        let that = this;
        that.init();
        //初始化的时候吧curIndex传给父组件，来控制bar的高亮显示
        this.sendcurIndexToParent()

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
        })

        var oid = this.$route.params.editId;//取得所要edit的id
        this.draft.oid=window.localStorage.getItem('draft');//取得保存的草稿的Oid

        var user_num = 0;

        if ((oid === "0") || (oid === "") || (oid === null) || (oid === undefined)) {

            // $("#title").text("Create Spatial Reference")
            $("#subRteTitle").text("/Create Spatiotemporal Reference")

            $('#aliasInput').tagEditor({
                forceLowercase: false
            });

            this.editType = 'create';

            let interval = setInterval(function () {
                initTinymce('textarea#singleDescription')
                clearInterval(interval);
            },500);

            this.$set(this.languageAdd.local,"value","en-US");
            this.$set(this.languageAdd.local,"label","English (United States)");

            if(this.draft.oid!=''&&this.draft.oid!=null&&typeof (this.draft.oid)!="undefined"){
                // this.loadDraftByOid()
                this.initDraft('create','/user/userSpace#/models/modelitem','draft',this.draft.oid)
            }else{
                this.loadMatchedCreateDraft();
            }
        }
        else {

            this.editType = "modify";
            if(this.draft.oid==''||this.draft.oid==null||typeof (this.draft.oid)=="undefined"){
                this.initDraft('edit','/user/userSpace#/models/modelitem','item',this.$route.params.editId)
            }else{
                this.initDraft('edit','/user/userSpace#/models/modelitem','draft',this.draft.oid)
            }
            // $("#title").text("Modify Spatial Reference")
            $("#subRteTitle").text("/Modify Spatiotemporal Reference")
            // document.title = "Modify Spatial Reference | OpenGMS"
            if(window.localStorage.getItem('draft')==null) {
                $.ajax({
                    url: "/repository/getSpatialInfo/" + oid,
                    type: "get",
                    data: {},

                    success: (result) => {
                        console.log(result)
                        var basicInfo = result.data;

                        this.insertInfo(basicInfo)


                    }
                })
            }
            $('#aliasInput').tagEditor({
                forceLowercase: false
            });
            window.sessionStorage.setItem("editSpatial_id", "");
        }

        window.localStorage.removeItem('draft');

        $("#step").steps({
            onFinish: function () {
                alert('Wizard Completed');
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
                    }
                    else if ($("#nameInput").val().trim() == "") {
                        new Vue().$message({
                            message: 'Please enter name!',
                            type: 'warning',
                            offset: 70,
                        });
                        return false;
                    } else if ($("#descInput").val().trim() == "") {
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
                } else {
                    return true;
                }
            }
        });

        //判断是否登录
        $.ajax({
            type: "GET",
            url: "/user/load",
            data: {},
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

                    this.sendUserToParent(this.userId)
                }
            }
        })

        let height = document.documentElement.clientHeight;
        this.ScreenMaxHeight = (height) + "px";
        this.IframeHeight = (height - 20) + "px";

        window.onresize = () => {
            console.log('come on ..');
            height = document.documentElement.clientHeight;
            this.ScreenMaxHeight = (height) + "px";
            this.IframeHeight = (height - 20) + "px";
        }

        var spatialObj = {};

        $(".finish").click(() => {
            let loading = this.$loading({
                lock: true,
                text: "Uploading...",
                spinner: "el-icon-loading",
                background: "rgba(0, 0, 0, 0.7)"
            });

            if(this.editType=='modify') {
                this.changeLocalization(this.currentLocalization);
            }
            for(i=0;i<this.localizationList.length;i++){
                let local = this.localizationList[i];
                if(local.localName.trim()==""||local.localCode.trim()==""){
                    this.$alert('<b>'+local.localName+'</b> localized name or description has not been filled in, please fill it or delete the localization language.', 'Warning', {
                        confirmButtonText: 'OK',
                        type: 'warning',
                        dangerouslyUseHTMLString: true,
                        callback: action => {

                        }
                    });
                    return;
                }
            }

            spatialObj = this.getItemContent('finish')

            let formData = new FormData();
            if ((oid === "0") || (oid === "") || (oid == null)) {

                let file = new File([JSON.stringify(spatialObj)], 'ant.txt', {
                    type: 'text/plain',
                });
                formData.append("info", file)
                $.ajax({
                    url: "/repository/addSpatialReference",
                    type: "POST",
                    cache: false,
                    processData: false,
                    contentType: false,
                    async: true,
                    data: formData,
                    success: (result) => {
                        loading.close();
                        if (result.code == "0") {
                            this.deleteDraft()
                            this.$confirm('<div style=\'font-size: 18px\'>Create spatiotemporal reference successfully!</div>', 'Tip', {
                                dangerouslyUseHTMLString: true,
                                confirmButtonText: 'View',
                                cancelButtonText: 'Go Back',
                                cancelButtonClass: 'fontsize-15',
                                confirmButtonClass: 'fontsize-15',
                                type: 'success',
                                center: true,
                                showClose: false,
                            }).then(() => {
                                window.location.href = "/repository/spatialReference/" + result.data;
                            }).catch(() => {
                                window.location.href = "/user/userSpace#/communities/spatialReference";
                            });
                        }
                        else if (result.code == -1) {
                            this.$alert('Please login first!', 'Error', {
                                type: "error",
                                confirmButtonText: 'OK',
                                callback: action => {
                                    window.location.href = "/user/login";
                                }
                            });
                        }
                        else {
                            this.$alert('Created failed!', 'Error', {
                                type: "error",
                                confirmButtonText: 'OK',
                                callback: action => {

                                }
                            });
                        }
                    }
                })
            }
            else {
                spatialObj["oid"] = oid;
                let file = new File([JSON.stringify(spatialObj)], 'ant.txt', {
                    type: 'text/plain',
                });
                formData.append("info", file)
                $.ajax({
                    url: "/repository/updateSpatialReference",
                    type: "POST",
                    cache: false,
                    processData: false,
                    contentType: false,
                    async: true,
                    data: formData,

                    success: (result) => {
                        loading.close();
                        if (result.code === 0) {
                            if (result.data.method === "update") {
                                this.deleteDraft()
                                this.$confirm('<div style=\'font-size: 18px\'>Update spatiotemporal reference successfully!</div>', 'Tip', {
                                    dangerouslyUseHTMLString: true,
                                    confirmButtonText: 'View',
                                    cancelButtonText: 'Go Back',
                                    cancelButtonClass: 'fontsize-15',
                                    confirmButtonClass: 'fontsize-15',
                                    type: 'success',
                                    center: true,
                                    showClose: false,
                                }).then(() => {
                                    window.location.href = "/repository/spatialReference/" + result.data.oid;
                                }).catch(() => {
                                    window.location.href = "/user/userSpace#/communities/spatialReference";
                                });
                            }
                            else {
                                let currentUrl = window.location.href;
                                let index = currentUrl.lastIndexOf("\/");
                                that.spatialReference_oid = currentUrl.substring(index + 1, currentUrl.length);
                                console.log(that.spatialReference_oid);
                                //当change submitted时，其实数据库中已经更改了，但是对于消息数目来说还没有及时改变，所以在此处获取消息数目，实时更新导航栏消息数目，
                                // that.getMessageNum(that.spatialReference_oid);
                                // let params = that.message_num_socket;
                                // that.send(params);
                                this.$alert('Changes have been submitted, please wait for the author to review.', 'Success', {
                                    type: "success",
                                    confirmButtonText: 'OK',
                                    callback: action => {
                                        window.location.href = "/user/userSpace";
                                    }
                                });

                            }

                        }
                        else if (result.code == -2) {
                            this.$alert('Please login first!', 'Error', {
                                type: "error",
                                confirmButtonText: 'OK',
                                callback: action => {
                                    window.location.href = "/user/login";
                                }
                            });
                        }
                        else {
                            this.$alert(result.msg, 'Error', {
                                type: "error",
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
        //     let currentUrl = window.location.href;
        //     let index = currentUrl.lastIndexOf("\/");
        //     that.spatialReference_oid = currentUrl.substring(index + 1,currentUrl.length);
        //     console.log(that.spatialReference_oid);
        //     //当change submitted时，其实数据库中已经更改了，但是对于消息数目来说还没有及时改变，所以在此处获取消息数目，实时更新导航栏消息数目，
        //     that.getMessageNum(that.spatialReference_oid);
        //     let params = that.message_num_socket;
        //     that.send(params);
        // });

        const timer = setInterval(()=>{
            if(this.itemName!=''&&this.startDraft==1){
                this.createDraft()
            }
        },30000)


        this.$once('hook:beforeDestroy', ()=>{
            clearInterval(timer)
            clearTimeout(this.timeOut)
        })

        $(document).on("keyup", ".username", function () {

            if ($(this).val()) {
                $(this).parents('.panel').eq(0).children('.panel-heading').children().children().html($(this).val());
            }
            else {
                $(this).parents('.panel').eq(0).children('.panel-heading').children().children().html("NEW");
            }
        })

    }
})