var vue = new Vue({
    el:"#app",
    data:{
        defaultActive:'4-4',
        curIndex:'4-4',

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
            label: 'Unit Resource Library',
            oid: '9F3DT5JNHCMYC3REE6G5PE7P9J3QKKJW',
            children: [{
                id: 100,
                label: 'Basic Unit',
                oid: 'YMFP5H5N6LEPZS7VT99PBD4JYSK87BA4'
            }, {
                label: 'Derivative Unit',
                oid: 'THTE2JXKCMD5Y7UZJH3Y84WLJWQCYWHV'
            }, {
                label: 'Combinatorial Unit',
                oid: 'CBVHYTVBBQDQZZLTYLQQACVQM8V5TMMF'
            }]
        }, {
            id: 2,
            label: 'Dimensional Resource Library',
            oid: '6H9YJU4Y58V9CAXDAXM7ULFAJ54R8SEA',
            children: [{
                label: 'Base Dimension',
                oid: 'HPWH63NTXKA8V8YNJKHJCW5EPF3XPVB9'
            }, {
                label: 'Composite Dimension',
                oid: 'G4HFPHPEPP3B2MNK46VQS3JLLHTQZQ64'
            }]
        }
        ],

        defaultProps: {
            children: 'children',
            label: 'label'
        },
        cls:[],
        clsStr:'',
        parId:""
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
    mounted() {

        var oid = window.sessionStorage.getItem("editUnit_id");

        var user_num = 0;

        if ((oid === "0") || (oid === "") || (oid === null)) {

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
                url: "/repository/getUnitInfo/" + oid,
                type: "get",
                data: {},

                success: (result) => {
                    console.log(result)
                    var basicInfo = result.data;

                    //cls
                    this.cls = basicInfo.classifications;
                    let ids=[];
                    for(i=0;i<this.cls.length;i++){
                        for(j=0;j<4;j++){
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
                    $("#myText").html(basicInfo.detail);
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
            window.sessionStorage.setItem("editUnit_id", "");
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

        var unitObj ={};
        $(".next").click(()=> {

            if (this.cls.length == 0) {
                alert("Please select parent node");
                return false;
            }
            if ($("#nameInput").val() === "") {
                alert("Please enter unit's name");
                return false;
            }
        });

        $(".finish").click(()=> {
            unitObj.classifications = this.cls;
            unitObj.name = $("#nameInput").val();
            unitObj.uploadImage = $('#imgShow').get(0).currentSrc;
            unitObj.description = $("#descInput").val();

            var detail = tinyMCE.activeEditor.getContent();
            unitObj.detail = detail.trim();
            console.log(unitObj)

            if ((oid === "0") || (oid === "") || (oid == null)) {
                $.ajax({
                    url: "/repository/addUnit",
                    type: "POST",
                    async: true,
                    contentType: "application/json",
                    data: JSON.stringify(unitObj),
                    success: function (result) {

                        if (result.code == "0") {
                            alert("Create Success");

                            window.location.href = "/repository/unit/" + result.data;
                            //window.location.reload();
                        }
                    }
                })
            } else {
                unitObj["oid"] = oid;
                $.ajax({
                    url: "/repository/updateUnit",
                    type: "POST",
                    async: true,
                    contentType: "application/json",
                    data: JSON.stringify(unitObj),

                    success: function (result) {
                        if (result.code === 0) {
                            alert("Update Success");
                            //$("#editModal",parent.document).remove();

                            window.location.href = "/repository/unit/" + result.data;
                            //window.location.reload();
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