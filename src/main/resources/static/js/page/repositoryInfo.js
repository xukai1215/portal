new Vue({
    el: "#app",
    components: {
        'avatar': VueAvatar.Avatar
    },
    data: {
        //unitconversion
        oid_cvt: window.oidcvt,
        unitname: window.infoname,
        unitdata:{},
        unitPrearr:[],
        ipt1value:"",
        unitSlct:[],
        slct1Value:"",
        slct2Value:"",
        activeIndex: '8-1',
        useroid: "",
        userId:"",
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

        coordianate:{wkname:''},

        loading:false,

        loadSpatialDialog:false,

        transformVisible:false,
        inputCoordinate:{
            geogcs:{
                unit:{
                    key:''
                }
            }
        },
        inputX:'',
        inputY:'',
        inputLong:'',
        inputLat:'',
        outputCoordinate:{
            geogcs:{
                unit:{
                    key:''
                }
            }
        },
        outputX:'',
        outputY:'',
        outputLong:'',
        outputLat:'',

        pageOption: {
            paginationShow:false,
            progressBar: true,
            sortAsc: false,
            currentPage: 1,
            pageSize: 10,

            total: 11,
        },
        searchText:'',

        isInSearch:0,

        loadStatus:0,

        searchResult:[{
            name:'',
        }],
    },
    methods: {
        select_prebase(value, loc, x, tag) {
            //选择转换前后的单位
            if (tag == 1)
                return this.pre_base(value, loc, x)
            else {
                //alert(loc)
                return this.base_pre(value, loc, x)
            }
        },

        base_pre(value, loc, x) {
            //转换前缀to base unit
            var pre = value.substring(0, loc)
            switch (pre) {
                case "Nano":
                    return x / 1e-9
                case "Micro":
                    return x / 1e-6
                case "Milli":
                    return x / 1e-3
                case "Centi":
                    return x / 1e-2
                case "Deci":
                    return x / 1e-1
                case "Hecto":
                    return x / 1e2
                case "Kilo":
                    return x / 1e3
                case "Mega":
                    return x / 1e6
                case "Yocto":
                    return x / 1e-24
                case "Zepto":
                    return x / 1e-21
                case "Atto":
                    return x / 1e-18
                case "Femto":
                    return x / 1e-15
                case "Pico":
                    return x / 1e-12
                case "Deca":
                    return x / 1e1
                case "Giga":
                    return x / 1e9
                case "Tera":
                    return x / 1e12
                case "Peta":
                    return x / 1e15
                case "Exa":
                    return x / 1e18
                case "Zetta":
                    return x / 1e21
                case "Yotta":
                    return x / 1e24

            }

        },

        pre_base(value, loc, x) {
            //转换unit to 前缀
            var pre = value.substring(0, loc)
            switch (pre) {
                case "Nano":
                    return x * 1e-9
                case "Micro":
                    return x * 1e-6
                case "Milli":
                    return x * 1e-3
                case "Centi":
                    return x * 1e-2
                case "Deci":
                    return x * 1e-1
                case "Hecto":
                    return x * 1e2
                case "Kilo":
                    return x * 1e3
                case "Mega":
                    return x * 1e6
                case "Yocto":
                    return x * 1e-24
                case "Zepto":
                    return x * 1e-21
                case "Atto":
                    return x * 1e-18
                case "Femto":
                    return x * 1e-15
                case "Pico":
                    return x * 1e-12
                case "Deca":
                    return x * 1e1
                case "Giga":
                    return x * 1e9
                case "Tera":
                    return x * 1e12
                case "Peta":
                    return x * 1e15
                case "Exa":
                    return x * 1e18
                case "Zetta":
                    return x * 1e21
                case "Yotta":
                    return x * 1e24
            }
        },

        // 处理带有前缀的单位
        prefunc(value, x, tag) {
            var loc;
            var field;
            for (field in this.unitPrearr) {
                loc = value.search(this.unitPrearr[field]);
                if (loc != -1 && loc != 0) {
                    return this.select_prebase(value, loc, x, tag);
                }
            }
            return x;
        },
        async cvtclick(){

            var slct1_value = this.slct1Value
            var slct2_value = this.slct2Value
            var cvt_value = this.ipt1value

            //用户未选择单位类型
            if (slct1_value == 'select the unit' || slct2_value == 'select the unit')
                this.$alert("Please select the unit you want to convert!");

            else if(""===cvt_value)
                this.$alert("Please input a correct value!");
            else {
                //转换单位类型相同
                if (slct1_value == slct2_value)
                    document.getElementById("ipt2").value = cvt_value
                else {

                    var x = cvt_value
                    var field


                    //处理带有前缀的单位
                    x = this.prefunc(slct1_value, x, 1)
                    //unit to base
                    for (field in this.unitdata.Units) {
                        if (this.unitdata.Units[field].SingularName == slct1_value) {
                            x = eval(this.unitdata.Units[field].FromUnitToBaseFunc)
                            break
                        }
                    }

                    //处理带有前缀的单位
                    x = this.prefunc(slct2_value, x, 2)


                    //base to result
                    for (field in this.unitdata.Units) {
                        if (this.unitdata.Units[field].SingularName == slct2_value) {
                            x = eval(this.unitdata.Units[field].FromBaseToUnitFunc)
                            break
                        }
                    }
                    document.getElementById("ipt2").value = x
                }
            } //else

        },

        getLanguageList(){
            $.get("/static/languageList.json").success((content)=>{
                this.languageList = content;
            })
        },
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

        getQuateMarkContent(str){//获得引号之间的内容
            if(str.indexOf('"')!=-1){
                let regex = /"([^"]*)"/g;
                let currentResult=regex.exec(str);
                return currentResult
            }
            else return ['"'+str+'"',str]
        },

        getSqBracketContent(str){//获得方括号之间内容
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

        //以下是解析wkt各部分的字段
        initCompd(coordianate,wkt){
            let index=wkt.indexOf('COMPD_CS')
            let regex = /"([^"]*)"/g;
            let currentResult=regex.exec(wkt);
            coordianate.coName=currentResult[1]
        },

        initProj(coordianate,wkt){
            let index=wkt.indexOf('PROJCS')
            let str=wkt.substring(index,wkt.length)
            let regex = /"([^"]*)"/g;
            let currentResult=regex.exec(str);
            if (coordianate.compd==0) {
                coordianate.coName=currentResult[1]
            }
            let obj={}
            obj.name=currentResult[1]
            let a = wkt.indexOf('GEOGCS')+6
            let eleStart = this.bracketMatch(wkt.substring(a),1)+2
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

        //解析wkt,分别对每个字段节点解析
        wktTransfer(coordinate,wkt){
            let obj={};
            // if(wkt.indexOf('GEOGCS')==-1) return
            // let subStrIndex=this.findFirstCoupe(wkt)
            if(wkt.indexOf('COMPD_CS')!=-1){
                coordinate.compd=1
                this.initCompd(coordinate,wkt)

            }
            else{
                coordinate.compd=0
                // this.initGeog(wkt)
            }
            if(wkt.indexOf('PROJCS')!=-1){
                coordinate.projcs=this.initProj(coordinate,wkt)
            }

            if(wkt.indexOf('GEOGCS')!=-1){
                let start = wkt.indexOf('GEOGCS')+6
                let end = this.bracketMatch(wkt.substring(start),1)
                coordinate.geogcs=this.initGeog(wkt.substring(start+1,end+start))
            }

            if(wkt.indexOf('DATUM')!=-1) {
                let start = wkt.indexOf('DATUM') + 5
                let end = this.bracketMatch(wkt.substring(start), 1)
                coordinate.datum = this.initDatum(wkt.substring(start + 1, end+start))
            }

            if(wkt.indexOf('SPHEROID')!=-1) {
                let start = wkt.indexOf('SPHEROID') + 8
                let end = this.bracketMatch(wkt.substring(start), 1)
                coordinate.spheroid = this.initSpheoid(wkt.substring(start + 1, end+start))
            }

            if(wkt.indexOf('PRIMEM')!=-1) {
                let start = wkt.indexOf('PRIMEM') + 6
                let end = this.bracketMatch(wkt.substring(start), 1)
                coordinate.prime = this.initPrime(wkt.substring(start + 1, end+start))
            }

            if(wkt.indexOf('PROJECTION')!=-1) {
                let start = wkt.indexOf('PROJECTION') + 10
                let end = this.bracketMatch(wkt.substring(start), 1)
                coordinate.projection = this.initProjection(wkt.substring(start + 1, end+start))
            }

            if(wkt.indexOf('VERT_CS')!=-1) {
                let start = wkt.indexOf('VERT_CS') + 7
                let end = this.bracketMatch(wkt.substring(start), 1)
                coordinate.vertcs = this.initGeog(wkt.substring(start + 1, end+start))
            }

            if(wkt.indexOf('VERT_DATUM')!=-1) {
                let start = wkt.indexOf('VERT_DATUM') + 10
                let end = this.bracketMatch(wkt.substring(start), 1)
                coordinate.vDatum = this.initGeog(wkt.substring(start + 1, end+start))
            }

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
            let item = hrefs[hrefs.length - 2].split("#")[0];
            let oid = hrefs[hrefs.length - 1].split("#")[0];
            if(item=='spatialReference'){
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
                            this.wktTransfer(this.coordianate,data.wkt);
                            console.log(this.coordianate)
                        }

                    }
                })
            }

        },

        isNum(val){
            var regPos = /^\d+(\.\d+)?$/; //非负浮点数
            var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
            if(regPos.test(val) || regNeg.test(val)) {
                return true;
            } else {
                return false;
            }
        },

        loadSpatialReferenceClick(status) {
            this.loadSpatialDialog = true;
            this.loadStatus=status
            this.pageOption.currentPage = 1;
            this.searchResult = '';
            this.loadSpatialReference();

        },

        handlePageChange(val) {
            this.pageOption.currentPage = val;

            if(this.inSearch==0)
                this.loadSpatialReference();
            else
                this.searchSpatialReference()
        },
        loadSpatialReference(){
            this.inSearch = 0
            this.loading = true;
            axios.get('/spatial/getSpatialReference',{
                params:{
                    asc:0,
                    page:this.pageOption.currentPage-1,
                    size:6,
                }
            }).then(
                (res)=>{
                    if(res.data.code==0){
                        let data = res.data.data;
                        this.searchResult = data.content
                        this.pageOption.total = data.total;
                        setTimeout(()=>{
                            this.loading = false;
                        },100)
                    }else{
                        this.$alert('Please try again','Warning', {
                            confirmButtonText: 'OK',
                            callback: action => {
                                this.loading = false;
                            }
                        })

                    }
                }
            )
        },

        searchSpatialReference(page){
            this.inSearch = 1
            this.loading = true;
            let targetPage = page==undefined?this.pageOption.currentPage:page
            this.pageOption.currentPage=targetPage
            axios.get('/spatial/searchSpatialReference',{
                params:{
                    asc:0,
                    page:targetPage-1,
                    size:6,
                    searchText: this.searchText,
                }
            }).then(
                (res)=>{
                    if(res.data.code==0){
                        let data = res.data.data;
                        this.searchResult = data.content
                        this.pageOption.total = data.total;
                        setTimeout(()=>{
                            this.loading = false;
                        },150)

                    }else{
                        this.$alert('Please try again','Warning', {
                            confirmButtonText: 'OK',
                            callback: action => {
                                this.loading = false;
                            }
                        })

                    }
                }
            )
        },

        loadCoordinate(item){
            this.inputX=this.inputY=this.inputLat=this.inputLong=this.outputX=this.outputY=this.outputLat=this.outputLong=''
            this.loadSpatialDialog=false
            if(this.loadStatus==0){
                this.inputCoordinate= item
                this.inputCoordinate.name = item.name
                this.inputCoordinate.wkt = item.wkt
                this.wktTransfer(this.inputCoordinate,this.inputCoordinate.wkt)
            }else{
                this.outputCoordinate = item
                this.outputCoordinate.name = item.name
                this.outputCoordinate.wkt = item.wkt
                this.wktTransfer(this.outputCoordinate,this.outputCoordinate.wkt)
            }

        },

        //判断坐标系单位
        judgeUnit(coordinate){
            if(coordinate.geogcs==undefined) return 'metre'
            if (coordinate.projcs!=undefined&&coordinate.projcs.unit.key.toLowerCase().indexOf('metre') != -1) {
                return 'metre'
            } else {
                return 'degree'
            }
            // if(coordinate.geogcs.unit.key.toLowerCase().indexOf('metre')==-1) {
            //     if (coordinate.projcs!=undefined&&coordinate.projcs.unit.key.toLowerCase().indexOf('metre') != -1) {
            //         return 'metre'
            //     } else {
            //         return 'degree'
            //     }
            // }else{
            //     if (coordinate.projcs!=undefined&&coordinate.projcs.unit.key.toLowerCase().indexOf('metre') != -1) {
            //         return 'metre'
            //     } else {
            //         return 'degree'
            //     }
            // }

        },

        async transformClick(){
            if(this.judgeUnit(this.inputCoordinate)==='metre'){
                if(this.inputCoordinate.name==''){
                    this.$alert('Please select the input coordinate system')
                    return
                }
                if(this.inputX==''||this.inputY==''||!this.isNum(this.inputX)||!this.isNum(this.inputY)){
                    this.$alert('Please input valid value')
                    return
                }

            }else{
                if(this.inputCoordinate.name==''){
                    this.$alert('Please select the input coordinate system')
                    return
                }
                if(this.inputLong==''||this.inputLat==''||!this.isNum(this.inputLong)||!this.isNum(this.inputLat)){
                    this.$alert('Please input valid value')
                    return
                }
            }

            if(this.outputCoordinate.name==''){
                this.$alert('Please select the output coordinate system')
                return
            }

            this.transFormByGDAL().then(res =>{
                let gdalResult = res
                if(gdalResult == null||gdalResult == undefined||gdalResult.toString() == '0,0,0'){
                    this.transformXY()
                }else {
                    if(this.judgeUnit(this.outputCoordinate)==='metre') {
                        this.outputX = gdalResult[0].toFixed(5)
                        this.outputY = gdalResult[1].toFixed(5)
                    }else{
                        this.outputLong = gdalResult[0].toFixed(5)
                        this.outputLat = gdalResult[1].toFixed(5)
                    }
                }
            })




        },

        transformXY(){
            let inX = parseFloat(this.judgeUnit(this.inputCoordinate)==='metre'?this.inputX:this.inputLong)
            let inY = parseFloat(this.judgeUnit(this.inputCoordinate)==='metre'?this.inputY:this.inputLat)

            var firstProjection = this.inputCoordinate.wkt;
            var secondProjection = this.outputCoordinate.wkt;

            if(firstProjection.indexOf('GEOGCS')==-1||secondProjection.indexOf('GEOGCS')==-1){
                this.$alert('The selected coordinates are not supported to transform.')
                return
            }



            let result
            try{
                result=proj4(firstProjection,secondProjection,[inX,inY]);
            }catch (e) {
                this.$alert('The selected coordinates are not supported to transform.')
            }

            if(this.judgeUnit(this.outputCoordinate)==='metre') {
                this.outputX = result[0].toFixed(5)
                this.outputY = result[1].toFixed(5)
            }else{
                this.outputLong = result[0].toFixed(5)
                this.outputLat = result[1].toFixed(5)
            }
            // let inCoorNum=this.inputCoordinate.substring(this.inputCoordinate.indexOf('.')+1)
            // let outCoorNum=this.outputCoordinate.substring(this.outputCoordinate.indexOf('.')+1)
            //
            // let obj={
            //     inCoordinate:inCoorNum,
            //     inX:inX,
            //     inY:inY,
            //     outCoordinate:outCoorNum,
            // }
            // var vthis=this
            // $.ajax({
            //     url: 'http://epsg.io/trans',
            //     dataType: "jsonp",
            //     data: {
            //         x:inX,
            //         y:inY,
            //         s_srs:inCoorNum,
            //         t_srs:outCoorNum
            //     },
            //     success: (data) => {
            //         if(data!=null){
            //             this.outputX=data.x
            //             this.outputY=data.y
            //
            //         }else{
            //             this.$alert('Connection timed out, please try again')
            //         }
            //     }
            // });
        },

        async transFormByGDAL(){
            let refInfo={
                inputRefName:this.inputCoordinate.name,
                inputRefWkt:this.inputCoordinate.wkt,
                inputRefX:this.judgeUnit(this.inputCoordinate)==='metre'?this.inputX:this.inputLong,
                inputRefY:this.judgeUnit(this.inputCoordinate)==='metre'?this.inputY:this.inputLat,
                outputRefName:this.outputCoordinate.name,
                outputRefWkt:this.outputCoordinate.wkt,
            }

            let data

            await axios.post('/GDAL/transformSpactialRef',refInfo).then(
                res=>{
                    data = res.data
                }
            )

            return data
        },

        exchangeIO(){
            let a = this.inputCoordinate
            this.inputCoordinate = this.outputCoordinate
            this.outputCoordinate = a

            if(this.judgeUnit(this.inputCoordinate)==='metre'){
                this.inputX=this.outputX
                this.outputX=''

                this.inputY=this.outputY
                this.outputY=''

            }else{
                this.inputLong=this.outputLong
                this.outputLong=''

                this.inputLat=this.outputLat
                this.outputLat=''
            }

            if(this.judgeUnit(this.inputCoordinate)==='metre'){
                if(this.inputX!=''&&this.inputY!=''&&this.isNum(this.inputX)&&this.isNum(this.inputY)){
                    this.transformClick();
                }

            }else{
                if(this.inputLong!=''&&this.inputLat!=''&&this.isNum(this.inputLong)&&this.isNum(this.inputLat)){
                    this.transformClick();
                }
            }
        },

        setSession(name, value) {
            window.sessionStorage.setItem(name, value);
        },


    },
    mounted() {

        let that=this;
        var prearr=new Array();
        if(this.oid_cvt!=null){
            $("#transform").show();
        }
        if(this.oid_cvt!="") {

            $.get("/repository/getUnitConvertInfo/" + this.oid_cvt, function (result) {
                that.unitdata = result;
                adddata(that.unitdata);
            });

            if(this.unitname.indexOf('_')!=-1)
            {
                this.unitname=this.unitname.replace(/_/,'');
            }
        }

        function adddata(data) {
            var item;
            $.each(data.Units, function (i, field) {
                //加入singularname
                if (typeof (field['Prefixes']) == "object")
                    prearr.push(field.SingularName);

                item={value:field.SingularName,
                          label:field.SingularName}
                that.unitSlct.push(item)

                //加入有前缀的singularname
                if (field['Prefixes']) {
                    $.each(field['Prefixes'], function (tmp, field1) {
                        item={value:field1+field.SingularName,
                            label:field1+field.SingularName};
                        that.unitSlct.push(item)
                    })
                }//if
            })//each
            that.unitPrearr=prearr;
            that.slct1Value=that.unitname
        }

        this.setSession("history", window.location.href);
        $.get("/user/load", {}, (result) => {
            let res=result;

                if (res.oid != '') {
                    this.useroid = res.oid;
                    this.userId = res.data.userId;
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

        this.inputCoordinate.name = window.spatialRfInPage.name
        this.inputCoordinate.wkt = window.spatialRfInPage.wkt
        this.wktTransfer(this.inputCoordinate,this.inputCoordinate.wkt)
        this.outputCoordinate.name = window.spatialRfInPage.name
        this.outputCoordinate.wkt = window.spatialRfInPage.wkt
        this.wktTransfer(this.outputCoordinate,this.outputCoordinate.wkt)


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

