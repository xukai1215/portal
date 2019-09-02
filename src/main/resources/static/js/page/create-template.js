var vue = new Vue({
    el:"#app",
    data:{
        defaultActive:'4-3',
        curIndex:'4-3',

        ScreenMaxHeight: "0px",
        IframeHeight: "0px",
        editorUrl: "",
        load: false,

        ScreenMinHeight: "0px",

        userId: "",
        userName: "",
        loginFlag: false,
        activeIndex: 2,

        userInfo:{
            //username:"",
            name:"",
            email:"",
            phone:"",
            insName:""
        },

        treeData: [{
            id: 1,
            label: 'Description Templates',
            oid: 'TRJJMYDAUJTDDU5J9GPRUWAG7QJ6PHUU',
            children: [
                {
                    id: 2,
                    "oid": "f7fbecf6-9d28-405e-b7d2-07ef9d924ca6",
                    "label": "Vector Data Format"
                },
                {
                    id: 3,
                    "oid": "9b104fd6-7949-4c3b-b277-138cd979d053",
                    "label": "Raster Data Format",
                },
                {
                    id: 4,
                    "oid": "316d4df0-436e-4600-a183-80abf7472a72",
                    "label": "Mesh Data Format",
                },
                {
                    id: 5,
                    "oid": "bc437c65-2cfe-4bde-ac31-04830f18885a",
                    "label": "Image Data Format",
                },
                {
                    id: 6,
                    "oid": "39c0824e-8b1a-44e5-8716-c7893afe05e8",
                    "label": "Voideo Data Format",
                },
                {
                    id: 7,
                    "oid": "82b1c2b4-4c12-441d-9d9c-09365c3c8a24",
                    "label": "Audio Data Format",
                },
                {
                    id: 8,
                    "nameCn": "",
                    "oid": "df6d36e3-8f16-4b96-8d3f-cff24f7c0fd9",
                    "label": "Unstructural Data Format",
                },
                {
                    id: 9,
                    "oid": "26bb993b-453c-481a-a1ea-674db3e888e2",
                    "label": "Model Related Data Format",
                },
                {
                    id: 10,
                    "oid": "1d573467-f1f3-440a-a827-110ac1e820bd",
                    "label": "3D Model Data Format",
                },
                {
                    id: 11,
                    "oid": "8a189836-d563-440c-b5ea-c04778ac05f9",
                    "label": "Tabular Data Format",
                }]
        }],

        defaultProps: {
            children: 'children',
            label: 'label'
        },
        cls:[],
        clsStr:'',
        parId:"",

        templateInfo:{}
    },
    methods:{
        handleSelect(index,indexPath){
            this.setSession("index",index);
            window.location.href="/user/userSpace"
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
        changeOpen(n) {
            this.activeIndex = n;
        },
        setSession(name, value) {
            window.sessionStorage.setItem(name, value);
        },
        getUserData(UsersInfo, prop) {
            let index=0;
            for(i=0;i<UsersInfo.length;i+=4){
                let value1 = UsersInfo.eq(i)[0].value.trim();
                let value2 = UsersInfo.eq(i)[0].value.trim();
                let value3 = UsersInfo.eq(i)[0].value.trim();
                let value4 = UsersInfo.eq(i)[0].value.trim();
                if(value1==''&&value2==''&&value3==''&&value4==''){
                    index=i+4;
                }

            }
            for (i = prop.length; i > 0; i--) {
                prop.pop();
            }
            var result = "{";
            for (; index < UsersInfo.length; index++) {
                //
                var Info = UsersInfo.eq(index)[0];
                if (index % 4 == 3) {
                    if (result) {
                        result += "'" + Info.name + "':'" + Info.value + "'}"
                        prop.push(eval('(' + result + ')'));
                    }
                    result = "{";
                }
                else {
                    result += "'" + Info.name + "':'" + Info.value + "',";
                }

            }
        },
    },
    mounted(){

        var oid = window.sessionStorage.getItem("editTemplate_id");

        var user_num = 0;

        if ((oid === "0") || (oid === "") || (oid === null)) {

            $("#myText").html("");
            tinymce.init({
                selector: "textarea#myText",
                height: 350,
                theme: 'modern',
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
            $.ajax({
                url: "/repository/getTemplateInfo/" + oid,
                type: "get",
                data: {},

                success: (result) => {
                    console.log(result)
                    var basicInfo = result.data;
                    this.templateInfo = basicInfo;

                    //cls
                    this.cls = basicInfo.classifications;
                    let ids=[];
                    for(i=0;i<this.cls.length;i++){
                        for(j=0;j<1;j++){
                            for(k=0;k<this.treeData[j].children.length;k++){
                                if(this.cls[i]==this.treeData[j].children[k].oid){
                                    ids.push(this.treeData[j].children[k].id);
                                    this.parid = this.treeData[j].children[k].id;
                                    this.clsStr+=this.treeData[j].children[k].label;
                                    if(i!=this.cls.length-1){
                                        this.clsStr+=", ";
                                    }
                                    break;
                                }
                            }
                            if(ids.length-1==i){
                                break;
                            }
                        }
                    }

                    this.$refs.tree2.setCheckedKeys(ids);

                    $(".providers").children(".panel").remove();
                    $("#nameInput").val(basicInfo.name);
                    $("#descInput").val(basicInfo.description);

                    //image
                    if (basicInfo.image != "") {
                        $("#imgShow").attr("src", basicInfo.image);
                        $('#imgShow').show();
                    }

                    //detail
                    //tinymce.remove("textarea#myText");
                    if(basicInfo.detail != null){
                        $("#myText").html(basicInfo.detail);
                    }
                    tinymce.init({
                        selector: "textarea#myText",
                        height: 300,
                        theme: 'modern',
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
            })
            window.sessionStorage.setItem("editTemplate_id", "");
        }

        //判断是否登录
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

        var templateObj ={};
        $(".next").click(()=> {

            if (this.cls.length == 0) {
                alert("Please select parent node");
                return false;
            }
            if ($("#nameInput").val() === "") {
                alert("Please enter template's name");
                return false;
            }
        });

        $(".finish").click(()=> {
            templateObj.classifications = this.cls;
            templateObj.name = $("#nameInput").val();
            templateObj.uploadImage = $('#imgShow').get(0).currentSrc;
            templateObj.description = $("#descInput").val();
            templateObj.xml = $("#xml").val();

            var detail = tinyMCE.activeEditor.getContent();
            templateObj.detail = detail.trim();
            console.log(templateObj)

            if ((oid === "0") || (oid === "") || (oid == null)) {
                $.ajax({
                    url: "/repository/addTemplate",
                    type: "POST",
                    async: true,
                    contentType: "application/json",
                    data: JSON.stringify(templateObj),
                    success: function (result) {

                        if (result.code == "0") {
                            alert("Create Success");
                            //$("#editModal",parent.document).remove();

                            window.location.href = "/repository/template/" + result.data;
                            //window.location.reload();
                        }

                    }
                })
            }else {
                templateObj["oid"] = oid;
                $.ajax({
                    url: "/repository/updateTemplate",
                    type: "POST",
                    async: true,
                    contentType: "application/json",
                    data: JSON.stringify(templateObj),
                    success: function (result) {
                        if (result.code === 0) {
                            if (result.data.method === "update") {
                                alert("Update Success");

                                window.location.href = "/repository/template/" + result.data.oid;
                                //window.location.reload();
                            }
                            else {
                                alert("Success! Changes have been submitted, please wait for the webmaster to review.");
                                window.location.href = "/user/userSpace";

                            }
                        }
                        else{
                            alert(result.msg);
                        }
                    }
                })
            }
        });


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