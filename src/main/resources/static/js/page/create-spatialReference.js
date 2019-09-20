var vue = new Vue({
    el: "#app",
    data: {
        defaultActive: '4-2',
        curIndex: '4-2',

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
            label: "SpatialReferenceRepository",
            oid: '58340c92-d74f-4d81-8a80-e4fcff286008',
            children: [{
                id: 2,
                "oid": "da70ad83-de57-4fc3-a85d-c1dcf4961433",
                "label": "Basic"
                },
                {
                    id: 3,
                    "oid": "c4642926-e797-4f61-92d6-7933df2413d2",
                    "label": "Epsg"
                },
                {
                    id: 4,
                    "oid": "e8562394-b55f-46d7-870e-ef5ad3aaf110",
                    "label": "Esri"
                },
                {
                    id: 5,
                    "oid": "ee830613-1603-4f38-a196-5028e4e10d39",
                    "label": "IAU"
                },
                {
                    id: 6,
                    "oid": "b2f2fbfd-f21a-47ac-9e1f-a96ac0218bf1",
                    "label": "CustomizedWKT"
                }]
        }],

        defaultProps: {
            children: 'children',
            label: 'label'
        },
        cls: [],
        clsStr: '',
        parId: "",

        referenceInfo:{}
    },
    methods: {
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
        setSession(name, value) {
            window.sessionStorage.setItem(name, value);
        },
        getUserData(UsersInfo, prop) {
            let index = 0;
            for (i = 0; i < UsersInfo.length; i += 4) {
                let value1 = UsersInfo.eq(i)[0].value.trim();
                let value2 = UsersInfo.eq(i)[0].value.trim();
                let value3 = UsersInfo.eq(i)[0].value.trim();
                let value4 = UsersInfo.eq(i)[0].value.trim();
                if (value1 == '' && value2 == '' && value3 == '' && value4 == '') {
                    index = i + 4;
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

        var oid = window.sessionStorage.getItem("editSpatial_id");

        var user_num = 0;

        if ((oid === "0") || (oid === "") || (oid === null)) {

            $("#title").text("Create Spatial Reference")


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

            $("#title").text("Modify Spatial Reference")
            document.title="Modify Spatial Reference | OpenGMS"

            $.ajax({
                url: "/repository/getSpatialInfo/" + oid,
                type: "get",
                data: {},

                success: (result) => {
                    console.log(result)
                    var basicInfo = result.data;
                    this.referenceInfo = basicInfo;

                    //cls
                    this.cls = basicInfo.classifications;
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
            window.sessionStorage.setItem("editSpatial_id", "");
        }

        //判断是否登录
        $.ajax({
            type: "GET",
            url: "/user/load",
            data: {},
            cache: false,
            async: false,
            success: (data) => {
                data = JSON.parse(data);
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

        var spatialObj = {};
        $(".next").click(() => {

            if (this.cls.length == 0) {
                alert("Please select parent node");
                return false;
            }
            if ($("#nameInput").val() === "") {
                alert("Please enter spatial reference's name");
                return false;
            }
        });

        $(".finish").click(() => {
            spatialObj.classifications = this.cls;
            spatialObj.name = $("#nameInput").val();
            spatialObj.wkname = $("#wknameInput").val();
            spatialObj.wkt = $("#wktInput").val();
            spatialObj.description = $("#descInput").val();
            spatialObj.uploadImage = $('#imgShow').get(0).currentSrc;
            var detail = tinyMCE.activeEditor.getContent();
            spatialObj.detail = detail.trim();
            console.log(spatialObj)

            let formData=new FormData();
            if ((oid === "0") || (oid === "") || (oid == null)) {
                let file = new File([JSON.stringify(spatialObj)],'ant.txt',{
                    type: 'text/plain',
                });
                formData.append("info", file)
                $.ajax({
                    url: "/repository/addSpatialReference",
                    type: "POST",
                    cache: false,
                    processData: false,
                    contentType: false,
                    async: false,
                    data: formData,
                    success: function (result) {

                        if (result.code == "0") {
                            alert("Create Success");

                            window.location.href = "/repository/spatialReference/" + result.data;
                            //window.location.reload();
                        }
                    }
                })
            }
            else {
                spatialObj["oid"] = oid;
                let file = new File([JSON.stringify(spatialObj)],'ant.txt',{
                    type: 'text/plain',
                });
                formData.append("info", file)
                $.ajax({
                    url: "/repository/updateSpatialReference",
                    type: "POST",
                    cache: false,
                    processData: false,
                    contentType: false,
                    async: false,
                    data: formData,

                    success: function (result) {
                        if (result.code === 0) {
                            if (result.data.method === "update") {
                                alert("Update Success");
                                //$("#editModal",parent.document).remove();

                                window.location.href = "/repository/spatialReference/" + result.data.oid;
                                //window.location.reload();
                            }
                            else
                                {
                                    alert("Success! Changes have been submitted, please wait for the webmaster to review.");
                                    window.location.href = "/user/userSpace";

                                }

                        }
                        else {
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