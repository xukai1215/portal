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

            treeData: [
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
                }, {"id": 7, "label": "Soid earth", "oid": "d3ba6e0b-78ec-4fe8-9985-4d5708f28e3e"}, {
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
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            cls: [],
            clsStr: '',
            status: 'Public',

            socket: "",

            message_num_socket: 0,
            message_num_socket_theme: 0,
            modelitem_oid: "",

            editArticleDialog: false,

            showUploadArticleDialog: false,

            showUploadedArticleDialog: false,

            articleUploading: {
                title: '',
                authors: [],
                journal: '',
                pageRange: '',
                date: 2019,
                doi: '',
                status: '',
                link: '',
            },

            doiLoading: false,

            doi:'',

            itemName:'',

            editType:'',

            draft:{
                oid:'',
            },

            toCreate:1,

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

            editTypeLocal: "",//create,modify
            currentLocalization: {
                localCode: "",
                localName: "",
                name: "",
                description: "",
            },
            localIndex: 0,
            languageAdd: {
                show: false,
                local: {},
            },
            localizationList: [
                {
                    localCode: "en-US",
                    localName: "English (United States)",
                    name: "",
                    description: "",
                    selected: true,
                }
            ],
            languageList: [
                {value: 'af', label: 'Afrikaans'},
                {value: 'af-ZA', label: 'Afrikaans (South Africa)'},
                {value: 'sq', label: 'Albanian'},
                {value: 'sq-AL', label: 'Albanian (Albania)'},
                {value: 'ar', label: 'Arabic'},
                {value: 'ar-DZ', label: 'Arabic (Algeria)'},
                {value: 'ar-BH', label: 'Arabic (Bahrain)'},
                {value: 'ar-EG', label: 'Arabic (Egypt)'},
                {value: 'ar-IQ', label: 'Arabic (Iraq)'},
                {value: 'ar-JO', label: 'Arabic (Jordan)'},
                {value: 'ar-KW', label: 'Arabic (Kuwait)'},
                {value: 'ar-LB', label: 'Arabic (Lebanon)'},
                {value: 'ar-LY', label: 'Arabic (Libya)'},
                {value: 'ar-MA', label: 'Arabic (Morocco)'},
                {value: 'ar-OM', label: 'Arabic (Oman)'},
                {value: 'ar-QA', label: 'Arabic (Qatar)'},
                {value: 'ar-SA', label: 'Arabic (Saudi Arabia)'},
                {value: 'ar-SY', label: 'Arabic (Syria)'},
                {value: 'ar-TN', label: 'Arabic (Tunisia)'},
                {value: 'ar-AE', label: 'Arabic (U.A.E.)'},
                {value: 'ar-YE', label: 'Arabic (Yemen)'},
                {value: 'hy', label: 'Armenian'},
                {value: 'hy-AM', label: 'Armenian (Armenia)'},
                {value: 'az-AZ', label: 'Azeri (Cyrillic) (Azerbaijan)'},
                {value: 'az', label: 'Azeri (Latin)'},
                {value: 'az-AZ', label: 'Azeri (Latin) (Azerbaijan)'},
                {value: 'eu', label: 'Basque'},
                {value: 'eu-ES', label: 'Basque (Spain)'},
                {value: 'be', label: 'Belarusian'},
                {value: 'be-BY', label: 'Belarusian (Belarus)'},
                {value: 'bs-BA', label: 'Bosnian (Bosnia and Herzegovina)'},
                {value: 'bg', label: 'Bulgarian'},
                {value: 'bg-BG', label: 'Bulgarian (Bulgaria)'},
                {value: 'ca', label: 'Catalan'},
                {value: 'ca-ES', label: 'Catalan (Spain)'},
                {value: 'zh', label: 'Chinese'},
                {value: 'zh-HK', label: 'Chinese (Hong Kong)'},
                {value: 'zh-MO', label: 'Chinese (Macau)'},
                {value: 'zh-CN', label: 'Chinese (Simplified)'},
                {value: 'zh-SG', label: 'Chinese (Singapore)'},
                {value: 'zh-TW', label: 'Chinese (Traditional)'},
                {value: 'hr', label: 'Croatian'},
                {value: 'hr-BA', label: 'Croatian (Bosnia and Herzegovina)'},
                {value: 'hr-HR', label: 'Croatian (Croatia)'},
                {value: 'cs', label: 'Czech'},
                {value: 'cs-CZ', label: 'Czech (Czech Republic)'},
                {value: 'da', label: 'Danish'},
                {value: 'da-DK', label: 'Danish (Denmark)'},
                {value: 'dv', label: 'Divehi'},
                {value: 'dv-MV', label: 'Divehi (Maldives)'},
                {value: 'nl', label: 'Dutch'},
                {value: 'nl-BE', label: 'Dutch (Belgium)'},
                {value: 'nl-NL', label: 'Dutch (Netherlands)'},
                {value: 'en', label: 'English'},
                {value: 'en-AU', label: 'English (Australia)'},
                {value: 'en-BZ', label: 'English (Belize)'},
                {value: 'en-CA', label: 'English (Canada)'},
                {value: 'en-CB', label: 'English (Caribbean)'},
                {value: 'en-IE', label: 'English (Ireland)'},
                {value: 'en-JM', label: 'English (Jamaica)'},
                {value: 'en-NZ', label: 'English (New Zealand)'},
                {value: 'en-PH', label: 'English (Republic of the Philippines)'},
                {value: 'en-ZA', label: 'English (South Africa)'},
                {value: 'en-TT', label: 'English (Trinidad and Tobago)'},
                {value: 'en-GB', label: 'English (United Kingdom)'},
                {value: 'en-US', label: 'English (United States)'},
                {value: 'en-ZW', label: 'English (Zimbabwe)'},
                {value: 'eo', label: 'Esperanto'},
                {value: 'et', label: 'Estonian'},
                {value: 'et-EE', label: 'Estonian (Estonia)'},
                {value: 'mk', label: 'FYRO Macedonian'},
                {value: 'mk-MK', label: 'FYRO Macedonian (Former Yugoslav Republic of Macedonia)'},
                {value: 'fo', label: 'Faroese'},
                {value: 'fo-FO', label: 'Faroese (Faroe Islands)'},
                {value: 'fa', label: 'Farsi'},
                {value: 'fa-IR', label: 'Farsi (Iran)'},
                {value: 'fi', label: 'Finnish'},
                {value: 'fi-FI', label: 'Finnish (Finland)'},
                {value: 'fr', label: 'French'},
                {value: 'fr-BE', label: 'French (Belgium)'},
                {value: 'fr-CA', label: 'French (Canada)'},
                {value: 'fr-FR', label: 'French (France)'},
                {value: 'fr-LU', label: 'French (Luxembourg)'},
                {value: 'fr-MC', label: 'French (Principality of Monaco)'},
                {value: 'fr-CH', label: 'French (Switzerland)'},
                {value: 'gl', label: 'Galician'},
                {value: 'gl-ES', label: 'Galician (Spain)'},
                {value: 'ka', label: 'Georgian'},
                {value: 'ka-GE', label: 'Georgian (Georgia)'},
                {value: 'de', label: 'German'},
                {value: 'de-AT', label: 'German (Austria)'},
                {value: 'de-DE', label: 'German (Germany)'},
                {value: 'de-LI', label: 'German (Liechtenstein)'},
                {value: 'de-LU', label: 'German (Luxembourg)'},
                {value: 'de-CH', label: 'German (Switzerland)'},
                {value: 'el', label: 'Greek'},
                {value: 'el-GR', label: 'Greek (Greece)'},
                {value: 'gu', label: 'Gujarati'},
                {value: 'gu-IN', label: 'Gujarati (India)'},
                {value: 'he', label: 'Hebrew'},
                {value: 'he-IL', label: 'Hebrew (Israel)'},
                {value: 'hi', label: 'Hindi'},
                {value: 'hi-IN', label: 'Hindi (India)'},
                {value: 'hu', label: 'Hungarian'},
                {value: 'hu-HU', label: 'Hungarian (Hungary)'},
                {value: 'is', label: 'Icelandic'},
                {value: 'is-IS', label: 'Icelandic (Iceland)'},
                {value: 'id', label: 'Indonesian'},
                {value: 'id-ID', label: 'Indonesian (Indonesia)'},
                {value: 'it', label: 'Italian'},
                {value: 'it-IT', label: 'Italian (Italy)'},
                {value: 'it-CH', label: 'Italian (Switzerland)'},
                {value: 'ja', label: 'Japanese'},
                {value: 'ja-JP', label: 'Japanese (Japan)'},
                {value: 'kn', label: 'Kannada'},
                {value: 'kn-IN', label: 'Kannada (India)'},
                {value: 'kk', label: 'Kazakh'},
                {value: 'kk-KZ', label: 'Kazakh (Kazakhstan)'},
                {value: 'kok', label: 'Konkani'},
                {value: 'kok-IN', label: 'Konkani (India)'},
                {value: 'ko', label: 'Korean'},
                {value: 'ko-KR', label: 'Korean (Korea)'},
                {value: 'ky', label: 'Kyrgyz'},
                {value: 'ky-KG', label: 'Kyrgyz (Kyrgyzstan)'},
                {value: 'lv', label: 'Latvian'},
                {value: 'lv-LV', label: 'Latvian (Latvia)'},
                {value: 'lt', label: 'Lithuanian'},
                {value: 'lt-LT', label: 'Lithuanian (Lithuania)'},
                {value: 'ms', label: 'Malay'},
                {value: 'ms-BN', label: 'Malay (Brunei Darussalam)'},
                {value: 'ms-MY', label: 'Malay (Malaysia)'},
                {value: 'mt', label: 'Maltese'},
                {value: 'mt-MT', label: 'Maltese (Malta)'},
                {value: 'mi', label: 'Maori'},
                {value: 'mi-NZ', label: 'Maori (New Zealand)'},
                {value: 'mr', label: 'Marathi'},
                {value: 'mr-IN', label: 'Marathi (India)'},
                {value: 'mn', label: 'Mongolian'},
                {value: 'mn-MN', label: 'Mongolian (Mongolia)'},
                {value: 'ns', label: 'Northern Sotho'},
                {value: 'ns-ZA', label: 'Northern Sotho (South Africa)'},
                {value: 'nb', label: 'Norwegian (Bokm?l)'},
                {value: 'nb-NO', label: 'Norwegian (Bokm?l) (Norway)'},
                {value: 'nn-NO', label: 'Norwegian (Nynorsk) (Norway)'},
                {value: 'ps', label: 'Pashto'},
                {value: 'ps-AR', label: 'Pashto (Afghanistan)'},
                {value: 'pl', label: 'Polish'},
                {value: 'pl-PL', label: 'Polish (Poland)'},
                {value: 'pt', label: 'Portuguese'},
                {value: 'pt-BR', label: 'Portuguese (Brazil)'},
                {value: 'pt-PT', label: 'Portuguese (Portugal)'},
                {value: 'pa', label: 'Punjabi'},
                {value: 'pa-IN', label: 'Punjabi (India)'},
                {value: 'qu', label: 'Quechua'},
                {value: 'qu-BO', label: 'Quechua (Bolivia)'},
                {value: 'qu-EC', label: 'Quechua (Ecuador)'},
                {value: 'qu-PE', label: 'Quechua (Peru)'},
                {value: 'ro', label: 'Romanian'},
                {value: 'ro-RO', label: 'Romanian (Romania)'},
                {value: 'ru', label: 'Russian'},
                {value: 'ru-RU', label: 'Russian (Russia)'},
                {value: 'se-FI', label: 'Sami (Inari) (Finland)'},
                {value: 'se-NO', label: 'Sami (Lule) (Norway)'},
                {value: 'se-SE', label: 'Sami (Lule) (Sweden)'},
                {value: 'se', label: 'Sami (Northern)'},
                {value: 'se-FI', label: 'Sami (Northern) (Finland)'},
                {value: 'se-NO', label: 'Sami (Northern) (Norway)'},
                {value: 'se-SE', label: 'Sami (Northern) (Sweden)'},
                {value: 'se-FI', label: 'Sami (Skolt) (Finland)'},
                {value: 'se-NO', label: 'Sami (Southern) (Norway)'},
                {value: 'se-SE', label: 'Sami (Southern) (Sweden)'},
                {value: 'sa', label: 'Sanskrit'},
                {value: 'sa-IN', label: 'Sanskrit (India)'},
                {value: 'sr-BA', label: 'Serbian (Cyrillic) (Bosnia and Herzegovina)'},
                {value: 'sr-SP', label: 'Serbian (Cyrillic) (Serbia and Montenegro)'},
                {value: 'sr-BA', label: 'Serbian (Latin) (Bosnia and Herzegovina)'},
                {value: 'sr-SP', label: 'Serbian (Latin) (Serbia and Montenegro)'},
                {value: 'sk', label: 'Slovak'},
                {value: 'sk-SK', label: 'Slovak (Slovakia)'},
                {value: 'sl', label: 'Slovenian'},
                {value: 'sl-SI', label: 'Slovenian (Slovenia)'},
                {value: 'es', label: 'Spanish'},
                {value: 'es-AR', label: 'Spanish (Argentina)'},
                {value: 'es-BO', label: 'Spanish (Bolivia)'},
                {value: 'es-ES', label: 'Spanish (Castilian)'},
                {value: 'es-CL', label: 'Spanish (Chile)'},
                {value: 'es-CO', label: 'Spanish (Colombia)'},
                {value: 'es-CR', label: 'Spanish (Costa Rica)'},
                {value: 'es-DO', label: 'Spanish (Dominican Republic)'},
                {value: 'es-EC', label: 'Spanish (Ecuador)'},
                {value: 'es-SV', label: 'Spanish (El Salvador)'},
                {value: 'es-GT', label: 'Spanish (Guatemala)'},
                {value: 'es-HN', label: 'Spanish (Honduras)'},
                {value: 'es-MX', label: 'Spanish (Mexico)'},
                {value: 'es-NI', label: 'Spanish (Nicaragua)'},
                {value: 'es-PA', label: 'Spanish (Panama)'},
                {value: 'es-PY', label: 'Spanish (Paraguay)'},
                {value: 'es-PE', label: 'Spanish (Peru)'},
                {value: 'es-PR', label: 'Spanish (Puerto Rico)'},
                {value: 'es-ES', label: 'Spanish (Spain)'},
                {value: 'es-UY', label: 'Spanish (Uruguay)'},
                {value: 'es-VE', label: 'Spanish (Venezuela)'},
                {value: 'sw', label: 'Swahili'},
                {value: 'sw-KE', label: 'Swahili (Kenya)'},
                {value: 'sv', label: 'Swedish'},
                {value: 'sv-FI', label: 'Swedish (Finland)'},
                {value: 'sv-SE', label: 'Swedish (Sweden)'},
                {value: 'syr', label: 'Syriac'},
                {value: 'syr-SY', label: 'Syriac (Syria)'},
                {value: 'tl', label: 'Tagalog'},
                {value: 'tl-PH', label: 'Tagalog (Philippines)'},
                {value: 'ta', label: 'Tamil'},
                {value: 'ta-IN', label: 'Tamil (India)'},
                {value: 'tt', label: 'Tatar'},
                {value: 'tt-RU', label: 'Tatar (Russia)'},
                {value: 'te', label: 'Telugu'},
                {value: 'te-IN', label: 'Telugu (India)'},
                {value: 'th', label: 'Thai'},
                {value: 'th-TH', label: 'Thai (Thailand)'},
                {value: 'ts', label: 'Tsonga'},
                {value: 'tn', label: 'Tswana'},
                {value: 'tn-ZA', label: 'Tswana (South Africa)'},
                {value: 'tr', label: 'Turkish'},
                {value: 'tr-TR', label: 'Turkish (Turkey)'},
                {value: 'uk', label: 'Ukrainian'},
                {value: 'uk-UA', label: 'Ukrainian (Ukraine)'},
                {value: 'ur', label: 'Urdu'},
                {value: 'ur-PK', label: 'Urdu (Islamic Republic of Pakistan)'},
                {value: 'uz-UZ', label: 'Uzbek (Cyrillic) (Uzbekistan)'},
                {value: 'uz', label: 'Uzbek (Latin)'},
                {value: 'uz-UZ', label: 'Uzbek (Latin) (Uzbekistan)'},
                {value: 'vi', label: 'Vietnamese'},
                {value: 'vi-VN', label: 'Vietnamese (Viet Nam)'},
                {value: 'cy', label: 'Welsh'},
                {value: 'cy-GB', label: 'Welsh (United Kingdom)'},
                {value: 'xh', label: 'Xhosa'},
                {value: 'xh-ZA', label: 'Xhosa (South Africa)'},
                {value: 'zu', label: 'Zulu'},
                {value: 'zu-ZA', label: 'Zulu (South Africa)'},
            ],
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
                    }
                }
                this.$set(row, "selected", true);
                this.currentLocalization = row;
                tinymce.activeEditor.setContent(row.description);
                // tinymce.undoManager.clear();
            }
        },
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

        onInputName(){
            console.log(1)
            if(this.toCreate==1){
                this.toCreate=0
                this.timeOut=setTimeout(()=>{
                    this.toCreate=1
                },30000)
                this.createDraft()
            }
        },
        //drafts
        getStep(){
            let domID=$('.step-tab-panel.active')[0].id
            return parseInt(domID.substring(domID.length-1,domID.length))
        },

        getContent(step) {
            let content = {
                classification: this.cls,
                status: this.status,
                name: this.itemName
            }
            content.overView = $("#descInput").val()
            content.keywords = $("#tagInput").val().split(",");
            content.image = $('#imgShow').get(0).currentSrc;
            let references = new Array();
            var ref_lines = $("#dynamic-table tr");
            for (let i = 1; i < ref_lines.length; i++) {
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
                    references.push(ref);
                }
            }
            content.references = references

            content.detail = tinyMCE.activeEditor.getContent().trim();

            content.authorship = []
            userspace.getUserData($("#providersPanel .user-contents .form-control"), content.authorship);

            return content;
        },

        createDraft(){//请求后台创建一个草稿实例,如果存在则更新
            this.savingDraft=true

            var step = this.getStep()
            let content=this.getContent(step)

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

            axios.post('/draft/init',obj
                ).then(
                    res=>{
                        if(res.data.code==0){
                            this.draft=res.data.data;
                            setTimeout(()=>{
                                this.savingDraft=false
                            },1005)
                        }
                    }
            )
        },

        handlePageChange(val) {
            this.pageOption.currentPage = val;

            if(this.inSearch==0)
                this.loadDraft();
            else
                this.searchDraft()
        },

        searchDraft(){

        },

        loadDraftClick(){
            this.draftListDialog=true;

            this.pageOption.currentPage = 1;
            this.loadDraft()
        },

        loadDraft(){
            axios.get('/draft/pageByUser',{
                params:{
                    asc:0,
                    page:this.pageOption.currentPage-1,
                    size:6,
                }
            }).then(res=>{
                    if(res.data.code==0){
                        let data=res.data.data
                        this.draftList=data.content
                        this.pageOption.total = data.total;
                    }else{
                        this.$alert('Please login first!', 'Error', {
                            type:"error",
                            confirmButtonText: 'OK',
                            callback: action => {
                                window.location.href = "/user/login";
                            }
                        });
                    }
                })
        },

        loadDraftByOid(){
            axios.get('/draft/getByOid',{
                params:{
                    oid:this.draft.oid
                }
            }).then(res=>{
                if(res.data.code==0){
                    this.insertDraft(res.data.data)
                }
            })
        },

        loadMatchedDraft(){//匹配edit对应的
            this.matchedDraft={}
            axios.get('/draft/getByItemAndUser',{
                params:{
                    itemOid:this.$route.params.editId
                }
            }).then(res=>{
                if(res.data.code==0){
                    this.matchedDraft=res.data.data;
                    if(this.matchedDraft!={}&&this.matchedDraft!=null){
                        this.$confirm('You have a existed draft about this Item, do you want to load it? If not, this draft will be overwrited.', 'Tips', {
                            confirmButtonText: 'Yes',
                            cancelButtonText: 'No',
                            type: 'warning'
                        }).then(() => {
                            this.insertDraft(this.matchedDraft)
                        }).catch(() => {
                            this.draft.oid=this.matchedDraft.oid
                        });
                    }
                }


            })
        },

        loadMatchedCreateDraft(){
            this.loadCreateDraft()
        },

        loadCreateDraft(){//
            this.matchedCreateDraft={}
            axios.get('/draft/getCreateDraftByUserByType',{
                params:{
                    itemType:'ModelItem',
                    editType:'create',
                }
            }).then(res=>{
                if(res.data.code==0){
                    if(res.data.data.length>1){
                        this.matchedCreateDraft=res.data.data;
                        this.matchedCreateDraftDialog=true
                    }
                }


            })
        },

        insertDraft(draft){
            this.draft=draft;
            let content = draft.content;
            this.cls=typeof(content.classification)=="undefined"?[]: content.classification
            this.status=content.status
            let ids=[];
            this.clsStr=[]
            for(let i=0;i<this.cls.length;i++){
                for(let j=0;j<2;j++){
                    for(let k=0;k<this.treeData[j].children.length;k++){
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
                            for(let x=0;x<children.length;x++){
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

            let authorship = content.authorship;
            var user_num = 0;
            if(authorship!=null) {
                for (let i = 0; i < authorship.length; i++) {
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


            this.itemName=content.name//填入name input
            $("#descInput").val(content.overView);
            //image
            if (content.image != "") {
                $("#imgShow").attr("src", content.image);
                $('#imgShow').show();
            }
            //reference

            for (i = 0; i < content.references.length; i++) {
                var ref = content.references[i];
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
            if (content.references.length > 0) {
                $("#dynamic-table").css("display", "block")
            }

            //tags
            $('#tagInput').tagEditor('destroy');
            $('#tagInput').tagEditor({
                initialTags: content.keywords,
                forceLowercase: false,
                placeholder: 'Enter keywords ...'
            });


            //detail
            tinyMCE.remove(tinyMCE.editors[0])
            $("#modelItemText").html(content.detail);//可能会赋值不成功
            $("#modelItemText").val(content.detail);
            initTinymce('textarea#modelItemText')

            this.draftListDialog=false;

            this.matchedCreateDraftDialog=false;
        },

        cancelEditClick(){
            if(this.draft.oid!=''){
                this.cancelDraftDialog=true
            }else{
                setTimeout(() => {
                    window.location.href = "/user/userSpace#/models/modelitem";
                }, 905)
            }
            // this.$confirm('You have a draft about this Item, do you want to save the latest version of it? If not, this draft will be deleted.', 'Tips', {
            //     confirmButtonText: 'Yes',
            //     cancelButtonText: 'No',
            //     type: 'warning'
            // }).then(() => {
            //     this.saveDraft()
            // }).catch(() => {
            //     this.deleteDraft()
            //     setTimeout(()=>{
            //         window.location.href = "/user/userSpace#/models/modelitem";
            //     },905)
            // });
        },

        cancelEdit() {
            this.deleteDraft()
            setTimeout(() => {
                window.location.href = "/user/userSpace#/models/modelitem";
            }, 905)
        },

        saveDraft(){
            this.savingDraft=true
            let content=this.getContent()
            let obj={
                content:content,
                oid:this.draft.oid,

            }
            axios.post('/draft/update',obj
            ).then(
                res=>{
                    if(res.data.code==0){
                       this.$message({message: 'Save successfully',type: 'success'})
                    }
                    setTimeout(()=>{
                        this.savingDraft=false
                    },895)
                    setTimeout(()=>{
                        window.location.href = "/user/userSpace#/models/modelitem";
                    },905)
                }
            ).catch(()=>{
                this.$message({message: 'Something wrong',type: 'warning'})
                setTimeout(()=>{
                    this.savingDraft=false
                },195)
            })
        },

        deleteDraft(){
            axios.delete('/draft/deleteByOid?oid='+this.draft.oid)
        },

        checkItem(item){
            let itemType = item.itemType.substring(0,1).toLowerCase()+item.itemType.substring(1)
            window.location.href='/'+itemType+'/'+item.itemOid
        },

        //reference
        searchDoi(){
            if(this.doi == ''){
                this.$alert('Please input the DOI', 'Tip', {
                        type: "warning",
                        confirmButtonText: 'OK',
                        callback: () => {
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
                                    type: "warning",
                                    confirmButtonText: 'OK',
                                    callback: () => {
                                        return
                                    }
                                }
                            );
                        }else if(data.find==0){
                            this.$alert('Find no result, check the DOI you have input or fill information manually.', 'Tip', {
                                    type: "warning",
                                    confirmButtonText: 'OK',
                                    callback: () => {
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
                                type: "warning",
                                confirmButtonText: 'OK',
                                callback: () => {
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
                        type: "warning",
                        confirmButtonText: 'OK',
                        callback: () => {
                        }
                    }
                );
                return;
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

        imgUpload(){
            this.imgClipDialog = true
            this.$nextTick(()=>{
                let canvas = document.getElementsByTagName('canvas')[0]
                canvas.style.backgroundImage = ''

                context = canvas.getContext('2d');
                //清除画布
                context.clearRect(0,0,150,150);

                document.getElementsByClassName('dragBlock')[0].style.left = '-7px'
            })

        },

        closeImgUpload(){
            this.dragReady = false
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


            //this.getModels();
        });

        $.ajax({
            type: "GET",
            url: "/user/load",
            data: {},
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

        this.draft.oid=window.localStorage.getItem('draft')
        window.localStorage.removeItem('draft')
        var user_num = 0;

        if ((oid === "0") || (oid === "") || (oid === null)|| (oid === undefined)) {

            this.editTypeLocal = 'create'
            // $("#title").text("Create Model Item")
            $("#subRteTitle").text("/Create Model Item")

            $('#aliasInput').tagEditor({
                forceLowercase: false
            });

            this.editTypeLocal = "create";

            let interval = setInterval(function () {
                initTinymce('textarea#singleDescription')
                clearInterval(interval);
            }, 500);

            this.$set(this.languageAdd.local, "value", "en-US");
            this.$set(this.languageAdd.local, "label", "English (United States)");
            initTinymce('textarea#modelItemText')

            this.loadMatchedCreateDraft()
            if(this.draft.oid!='')
                this.loadDraftByOid()

        }
        else {

            this.editTypeLocal = 'edit'
            if(this.draft.oid==''||this.draft.oid==null||typeof (this.draft.oid)=="undefined")
                this.loadMatchedDraft()
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
                    this.itemName=basicInfo.name
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
                    initTinymce('textarea#conceptText')
                    this.localizationList = basicInfo.localizationList;
                    let interval = setInterval(() => {
                        this.changeLocalization(this.localizationList[0])
                        clearInterval(interval);
                    }, 1000);

                    //alias
                    $('#aliasInput').tagEditor({
                        initialTags: basicInfo.alias,
                        forceLowercase: false,
                        // placeholder: 'Enter alias ...'
                    });
                }
            })
            // window.sessionStorage.setItem("editModelItem_id", "");
        }
        if(this.draft.oid!=''&&this.draft.oid!=null&&typeof (this.draft.oid)!="undefined")
            this.loadDraftByOid()

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
                        if(this.draft.oid!='')
                            this.createDraft();
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
            modelItemObj.alias = $("#aliasInput").val().split(",");
            if (modelItemObj.alias.length === 1 && modelItemObj.alias[0] === "") {
                modelItemObj.alias = [];
            }
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

            modelItemObj.localizationList = [];

            this.currentLocalization.description = tinymce.activeEditor.getContent();
            this.currentLocalization.localCode = this.languageAdd.local.value;
            this.currentLocalization.localName = this.languageAdd.local.label;

            modelItemObj.localizationList.push(this.currentLocalization);

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
                        // loading.close()
                        userspace.fullscreenLoading = false;
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

            this.deleteDraft()
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
            if(this.itemName!=''){
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

                fileUpload(this,1500,function (file) {


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

                        maxW=130
                        maxH=130
                        targetW=originW
                        targetH=originH

                        //设置canvas的宽、高
                        canvas.width=150
                        canvas.height=150

                        var positionX
                        var positionY
                        //判断图片是否超过限制  等比缩放
                        if(originW > maxW || originH > maxH) {
                            if(originH/originW < maxH/maxW) {//图片宽
                                targetH = maxH;
                                targetW = Math.round(maxH * (originW / originH));
                                positionX=75-targetW/2+'px'
                                positionY='10px'
                                canvas.style.backgroundSize = "auto 130px "
                            }else {
                                targetW = maxW;
                                targetH = Math.round(maxW * (originH / originW));
                                positionX='10px'
                                positionY=75-targetH/2+'px'
                                console.log(positionY)
                                canvas.style.backgroundSize = "130px auto"

                            }
                        }

                        if(originW <= maxW || originH <= maxH) {
                            if(originH/originW < maxH/maxW) {//图片宽
                                targetH = maxH;
                                targetW = Math.round(maxH * (originW / originH));
                                positionX=75-targetW/2+'px'
                                positionY='10px'
                                canvas.style.backgroundSize = "auto 130px "
                            }else {
                                targetW = maxW;
                                targetH = Math.round(maxW * (originH / originW));
                                positionX='10px'
                                positionY=75-targetH/2+'px'
                                console.log(positionY)
                                canvas.style.backgroundSize = "130px auto"
                            }
                        }

                        oldTarW=targetW
                        oldTarH=targetH
                        //清除画布
                        context.clearRect(0,0,150,150);

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

                        context.fillStyle = 'rgba(204,204,204,0.62)';
                        context.beginPath()
                        context.rect(0,0,150,150);
                        context.closePath()
                        context.fill()

                        context.globalCompositeOperation='destination-out'

                        context.fillStyle='yellow'
                        context.beginPath()
                        context.rect(10,10,130,130)
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

                    let maxMoveXR=10-parseFloat(posX)
                    let maxMoveXD=10-parseFloat(posY)

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
                    if (endX <= 10&&endX>=-limitX+10) {
                        endX = endX + 'px'
                        canvas.style.backgroundPositionX = endX
                    }

                    if (endY <= 10&&endY>=-limitY+10) {
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
                context.clearRect(0,0,150,150)
                canvas.style.backgroundImage = ""
                if(targetW<targetH){
                    let nx=0-(10-x)/130*150
                    let ny=0-(10-y)/130*150
                    context.drawImage(oImg,nx,ny,targetW/130*150,targetH/130*150);
                }else{
                    let nx=0-(10-x)/130*150
                    let ny=0-(10-y)/130*150
                    context.drawImage(oImg,nx,ny,targetW/130*150,targetH/130*150);
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

                        newX=75-(75-x)*timesP
                        newY=75-(75-y)*timesP
                        if(newY>10)//防止缩放超出边界
                            newY=10
                        else if(newY+newTH<140)
                            newY=140-newTH
                        if(newX>10)
                            newX=10
                        else if(newX+newTW<140)
                            newX=140-newTW
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

            $('#imgShow').get(0).src = img;
            $('#imgShow').show();
            vthis.loading=true
            vthis.dragReady=false
            setTimeout(()=>{
                vthis.imgClipDialog=false
                vthis.loading=false
            },150)

        }

    }
})