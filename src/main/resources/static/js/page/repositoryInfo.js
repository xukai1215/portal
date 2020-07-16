new Vue({
    el: "#app",
    components: {
        'avatar': VueAvatar.Avatar
    },
    data: {
        activeIndex: '8-1',

        useroid: "",
        userImg: "",
        //comment
        commentText: "",
        commentParentId: null,
        commentList: [],
        replyToUserId: "",
        commentTextAreaPlaceHolder: "Write your comment...",
        replyTo: "",

        addLocalVisible:false,
        localization:{
            id:"",
            language:"",
            name:"",
            desc:"",
        },
        languages:[
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
            { value: 'zh-CN', label: 'Chinese (S)' },
            { value: 'zh-SG', label: 'Chinese (Singapore)' },
            { value: 'zh-TW', label: 'Chinese (T)' },
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

        coordianate:{wkname:''},
    },
    methods: {
        submitLocalization(){
            let hrefs = window.location.href.split('/');
            let type = hrefs[hrefs.length - 2];
            let oid = hrefs[hrefs.length-1].substring(0,36);

            this.localization.id=oid;
            if(this.localization.language==""){
                this.$message({
                    message: 'Please select language',
                    type: 'warning'
                });
                return;
            }
            if(this.localization.name==""){
                this.$message({
                    message: 'Please enter name',
                    type: 'warning'
                });
                return;
            }
            if(this.localization.desc==""){
                this.$message({
                    message: 'Please enter description',
                    type: 'warning'
                });
                return;
            }

            let url;
            switch (type){
                case "concept":
                    url="/repository/addConceptLocalization";
                    break;
                case "spatialReference":
                    url="/repository/addSpatialReferenceLocalization";
                    break;
                case "unit":
                    url="/repository/addUnitLocalization";
                    break;
            }
            $.ajax({
                url:url,
                data:this.localization,
                type:"post",
                success:(result)=> {
                    if(result.data==="ok"){
                        this.$alert("Submitted successfully, please wait for review.", 'Tip', {
                            type: 'success',
                            confirmButtonText: 'OK',
                            callback: action => {
                                this.addLocalVisible = false
                            }
                        });
                    }
                }
            })
        },
        submitComment() {
            if (this.useroid == "" || this.useroid == null || this.useroid == undefined) {
                this.$message({
                    dangerouslyUseHTMLString: true,
                    message: '<strong>Please <a href="/user/login">log in</a> first.</strong>',
                    offset: 40,
                    showClose: true,
                });
            } else if (this.commentText.trim() == "") {
                this.$message({
                    message: 'Comment can not be empty!',
                    offset: 40,
                    showClose: true,
                });
            } else {

                let hrefs = window.location.href.split("/");
                let id = hrefs[hrefs.length - 1].substring(0, 36);
                let typeName = hrefs[hrefs.length - 2];
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
                        if (result.code == -1) {
                            window.location.href = "/user/login"
                        } else if (result.code == 0) {
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
        deleteComment(oid) {
            $.ajax({
                url: "/comment/delete",
                async: true,
                type: "POST",


                data: {
                    oid: oid,
                },
                success: (result) => {
                    console.log(result)
                    if (result.code == -1) {
                        window.location.href = "/user/login"
                    } else if (result.code == 0) {
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
        getComments() {
            let hrefs = window.location.href.split("/");
            let type = hrefs[hrefs.length - 2];
            let oid = hrefs[hrefs.length - 1].substring(0, 36);
            let data = {
                type: type,
                oid: oid,
                sort: -1,
            };
            $.get("/comment/getCommentsByTypeAndOid", data, (result) => {
                this.commentList = result.data.commentList;
            })
        },
        replyComment(comment) {
            this.commentParentId = comment.oid;
            this.replyTo = "Reply to " + comment.author.name;
            setTimeout(function () {
                $("#commentTextArea").focus();
            }, 1);
        },
        replySubComment(comment, subComment) {
            this.commentParentId = comment.oid;
            this.replyToUserId = subComment.author.oid;
            // this.commentTextAreaPlaceHolder="Reply to "+subComment.author.name;
            this.replyTo = "Reply to " + subComment.author.name;
            setTimeout(function () {
                $("#commentTextArea").focus();
            }, 1);
        },
        tagClose() {
            this.replyTo = "";
            this.replyToUserId = "";
            this.commentParentId = null;
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
                    data = JSON.parse(data);
                    if (data.oid === "") {
                        this.$confirm('<div style=\'font-size: 18px\'>This function requires an account, <br/>please login first.</div>', 'Tip', {
                            dangerouslyUseHTMLString: true,
                            confirmButtonText: 'Log In',
                            cancelButtonClass: 'fontsize-15',
                            confirmButtonClass: 'fontsize-15',
                            type: 'info',
                            center: true,
                            showClose: false,
                        }).then(() => {
                            this.setSession("history",window.location.href);
                            window.location.href = "/user/login";
                        }).catch(() => {

                        });
                    }
                    else {
                        let href = window.location.href;
                        let hrefs = href.split('/');
                        let type = hrefs[hrefs.length - 2];
                        let oid = hrefs[hrefs.length - 1].split("#")[0];
                        let url = "", sessionName = "", location = "";

                        switch (type) {
                            case "concept":
                                url = "/repository/getConceptUserOidByOid";
                                sessionName = "editConcept_id";
                                location = "/repository/createConcept";
                                break;
                            case "spatialReference":
                                url = "/repository/getSpatialReferenceUserOidByOid";
                                sessionName = "editSpatial_id";
                                location = "/repository/createSpatialReference";
                                break;
                            case "template":
                                url = "/repository/getTemplateUserOidByOid";
                                sessionName = "editTemplate_id";
                                location = "/repository/createTemplate";
                                break;
                            case "unit":
                                url = "/repository/getUnitUserOidByOid";
                                sessionName = "editUnit_id";
                                location = "/repository/createUnit";
                                break;
                        }
                        var urls = {
                            'concept': '/user/userSpace#/community/manageConcept/' + oid,
                            'spatialReference': '/user/userSpace#/community/manageSpatialReference/' + oid,
                            'template': '/user/userSpace#/community/manageTemplate/' + oid,
                            'unit': '/user/userSpace#/community/manageUnit/' + oid,
                        }

                        window.location.href = urls[type];
                        // $.ajax({
                        //     type: "GET",
                        //     url: url,
                        //     data: {
                        //         oid:oid
                        //     },
                        //     cache: false,
                        //     async: false,
                        //     xhrFields: {
                        //         withCredentials: true
                        //     },
                        //     crossDomain: true,
                        //     success: (json) => {
                        //         // if(json.data==data.oid){
                        //         window.sessionStorage.setItem(sessionName,oid)
                        //         window.location.href=location;
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

        getQuateMarkContent(str){
            if(str.indexOf('"')!=-1){
                let regex = /"([^"]*)"/g;
                let currentResult=regex.exec(str);
                return currentResult
            }
            else return ['"'+str+'"',str]
        },

        getSqBracketContent(str){
            if(str.indexOf("[")!=-1){
                let regex=/\[([^\]]*)]/g
                let currentResult=regex.exec(str);
                return currentResult
            }
            else return str
        },

        bracketMatch(str,num){//匹配第num个左括号的右括号，返回下标
            const leftArr=[]
            let top=0,i;
            for(i=0;i<str.length;i++){
                if(str[i]==='('||str[i]==='['||str[i]==='{'){
                    leftArr.push(i)
                    top++
                }
                if(str[i]===')'||str[i]==']'||str[i]==='}'){
                    leftArr.pop()
                    if(top==num)
                        break
                    top--
                }

            }
            return i
        },

        initCompd(wkt){
            let index=wkt.indexOf('COMPD_CS')
            let regex = /"([^"]*)"/g;
            let currentResult=regex.exec(wkt);
            this.coordianate.name=currentResult[1]
        },

        initProj(wkt){
            let index=wkt.indexOf('PROJCS')
            let str=wkt.substring(index,wkt.length)
            let regex = /"([^"]*)"/g;
            let currentResult=regex.exec(str);
            if (this.coordianate.compd==0) {
                this.coordianate.name=currentResult[1]
            }
            let obj={}
            obj.name=currentResult[1]
            let eleStart=wkt.indexOf('PARAMETER')
            let eleEnd=wkt.indexOf('VERT_CS')==-1?wkt.length:wkt.indexOf('VERT_CS')
            obj.parameters=this.initEle("PARAMETER",wkt.substring(eleStart,eleEnd))
            obj.unit=this.initEle("UNIT",wkt.substring(eleStart,eleEnd))[0]
            obj.axis=this.initEle("AXIS",wkt.substring(eleStart,eleEnd))
            obj.authority=this.initEle("AUTHORITY",wkt.substring(eleStart,eleEnd))[0]
            return obj
        },

        initGeog(wktStr){
            let obj={}

            let dIndex=wktStr.indexOf('DATUM')
            let pIndex=wktStr.indexOf('PRIMEM')
            let datumEnd=this.bracketMatch(wktStr.substring(dIndex),1)
            let end=this.bracketMatch(wktStr.substring(pIndex),1)
            obj.name=this.getQuateMarkContent(wktStr)[1]
            let eleStart = datumEnd>end?datumEnd:end
            let eleEnd=wktStr.length
            obj.unit=this.initEle("UNIT",wktStr.substring(eleStart,eleEnd))[0]
            obj.axis=this.initEle("AXIS",wktStr.substring(eleStart,eleEnd))
            obj.authority=this.initEle("AUTHORITY",wktStr.substring(eleStart,eleEnd))[0]
            return obj
        },

        initDatum(wktStr){
            let obj={}
            obj.name=this.getQuateMarkContent(wktStr)[1]
            obj.authority=this.initEle("AUTHORITY",wktStr)[0]


            return obj
        },

        initPrime(wktStr){
            let obj={}
            obj.name=this.getQuateMarkContent(wktStr)[1]
            obj.num=wktStr.split(',')[1]
            obj.authority=this.initEle("AUTHORITY",wktStr)[0]
            return obj
        },

        initProjection(wktStr){
            let obj={}
            obj.name=this.getQuateMarkContent(wktStr)[1]
            obj.authority=this.initEle("AUTHORITY",wktStr)[0]
            return obj
        },

        initVert(wktStr){
            let obj={}
            obj.name=this.getQuateMarkContent(wktStr)[1]
            obj.unit=this.initEle("UNIT",wktStr)[0]
            obj.axis=this.initEle("AXIS",wktStr)
            obj.authority=this.initEle("AUTHORITY",wktStr)[0]
            return obj
        },

        initVDatum(wktStr){
            let obj={}
            obj.name=this.getQuateMarkContent(wktStr)[1]
            obj.year=wktStr.split(',')[1]
            obj.authority=this.initEle("AUTHORITY",wktStr.substring(eleStart,eleEnd))[0]

            return obj
        },

        initSpheoid(wktStr){
            let obj={}
            obj.name=this.getQuateMarkContent(wktStr)[1]
            obj.authority=this.initEle("AUTHORITY",wktStr)[0]
            let eles=wktStr.split(',')
            obj.semimajorAxis=eles[1]
            if(parseInt(eles[2])<6000000){
                obj.inversFlat=eles[2]
            }else{
                obj.inversFlat=eles[3]
                obj.semiminorAxis=eles[2]
            }
            return obj
        },

        initEle(eleName,wktStr){
            let i=0,content,kvs,result=[]
            while (i<wktStr.length){
                let index=wktStr.indexOf(eleName,i)
                if(index!=-1){
                    content =this.getSqBracketContent(wktStr.substring(index))[1]
                    kvs=content.split(',')
                    let key=kvs[0]
                    let obj={
                        'key':this.getQuateMarkContent(kvs[0])[1],
                        'value':this.getQuateMarkContent(kvs[1])[1]
                    }
                    result.push(obj)
                    i=index+eleName.length
                }else{
                    break
                }

            }
            return result

        },


        wktTransfer(wkt){
            let obj={};
            // let subStrIndex=this.findFirstCoupe(wkt)
            if(wkt.indexOf('COMPD_CS')!=-1){
                this.coordianate.compd=1
                this.initCompd(wkt)

            }
            else{
                this.coordianate.compd=0
                // this.initGeog(wkt)
            }
            if(wkt.indexOf('PROJCS')!=-1){
                this.coordianate.projcs=this.initProj(wkt)
            }

            if(wkt.indexOf('GEOGCS')!=-1){
                let start = wkt.indexOf('GEOGCS')+6
                let end = this.bracketMatch(wkt.substring(start),1)
                this.coordianate.geogcs=this.initGeog(wkt.substring(start+1,end+start))
            }

            if(wkt.indexOf('DATUM')!=-1) {
                let start = wkt.indexOf('DATUM') + 5
                let end = this.bracketMatch(wkt.substring(start), 1)
                this.coordianate.datum = this.initDatum(wkt.substring(start + 1, end+start))
            }

            if(wkt.indexOf('SPHEROID')!=-1) {
                let start = wkt.indexOf('SPHEROID') + 8
                let end = this.bracketMatch(wkt.substring(start), 1)
                this.coordianate.spheroid = this.initSpheoid(wkt.substring(start + 1, end+start))
            }

            if(wkt.indexOf('PRIMEM')!=-1) {
                let start = wkt.indexOf('PRIMEM') + 6
                let end = this.bracketMatch(wkt.substring(start), 1)
                this.coordianate.prime = this.initPrime(wkt.substring(start + 1, end+start))
            }

            if(wkt.indexOf('PROJECTION')!=-1) {
                let start = wkt.indexOf('PROJECTION') + 10
                let end = this.bracketMatch(wkt.substring(start), 1)
                this.coordianate.projection = this.initProjection(wkt.substring(start + 1, end+start))
            }

            if(wkt.indexOf('VERT_CS')!=-1) {
                let start = wkt.indexOf('VERT_CS') + 7
                let end = this.bracketMatch(wkt.substring(start), 1)
                this.coordianate.vertcs = this.initGeog(wkt.substring(start + 1, end+start))
            }

            if(wkt.indexOf('VERT_DATUM')!=-1) {
                let start = wkt.indexOf('VERT_DATUM') + 10
                let end = this.bracketMatch(wkt.substring(start), 1)
                this.coordianate.vDatum = this.initGeog(wkt.substring(start + 1, end+start))
            }
            console.log(this.coordianate)
        },

        findFirstCoupe(str){
            let firstL=str.indexOf('[')
            let firstR
            if(firstL!=-1)
                firstR=str.indexOf(']')
            return {firstL:firstL,firstR:fristR}
        },

        loadCSDetails(){
            let href = window.location.href;
            let hrefs = href.split('/');
            let oid = hrefs[hrefs.length - 1].split("#")[0];

            axios.get('/spatial/getWKT',{
                params:{
                    oid:oid,
                }
                }

            ).then(res=>{
                if(res.data.code==0){
                    let data = res.data.data;
                    if(data.wktname!=null||data.wktname!=''){
                        this.coordianate.wkname=data.wktname;
                    }
                    if(data.wkt!=null||data.wkt!=''){
                        this.wktTransfer(data.wkt);
                    }

            }
            })
        },

        setSession(name, value) {
            window.sessionStorage.setItem(name, value);
        },
    },
    mounted() {
        this.setSession("history", window.location.href);
        $.get("/user/load", {}, (result) => {
            let res=JSON.parse(result);

                if (res.oid != '') {
                    this.useroid = res.oid;
                    this.userImg = res.image;
                }

        });
        this.getComments();

        $(document).on('mouseover mouseout','.flexRowSpaceBetween',function(e){

            let deleteBtn=$(e.currentTarget).children().eq(1).children(".delete");
            if(deleteBtn.css("display")=="none"){
                deleteBtn.css("display","block");
            }else{
                deleteBtn.css("display","none");
            }

        });

        this.loadCSDetails()
    }



});

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
