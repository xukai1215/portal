var vue = new Vue({
    el: "#app",
    data: {
        defaultActive:'2-4',
        curIndex:'2-4',

        computableModel:{
            bindModelItem:"",
            bindOid:"",
            name:"",
            description:"",
            contentType:"Package",
            url:"",
            isAuthor:true,
            author:{
                name:"",
                ins:"",
                email:"",
            }

        },

        ScreenMaxHeight: "0px",
        IframeHeight: "0px",
        editorUrl: "",
        load: false,

        ScreenMinHeight: "0px",

        userId: "",
        userName: "",
        loginFlag: false,
    },
    methods: {
        handleSelect(index,indexPath){
            this.setSession("index",index);
            window.location.href="/user/userSpace"
        },
        changeOpen(n) {
            this.activeIndex = n;
        },
        setSession(name, value) {
            window.sessionStorage.setItem(name, value);
        },
        getSession(name){
            return window.sessionStorage.getItem(name);
        },
        clearSession(){
            window.sessionStorage.clear();
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

        $(document).on("click", ".author_close", function () { $(this).parents(".panel").eq(0).remove(); });

        //作者添加
        var user_num = 1;
        $(".user-add").click(function () {
            user_num++;
            var content_box = $(this).parent().children('div');
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

        tinymce.init({
            selector: "textarea#myText",
            height: 400,
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

        $.ajax({
            type: "GET",
            url: "/user/load",
            data: {

            },
            cache: false,
            async: false,
            xhrFields:{
                withCredentials: true
            },
            crossDomain:true,
            success: (data) => {
                data=JSON.parse(data);
                if (data.oid == "") {
                    alert("Please login");
                    window.location.href = "/user/login";
                }
                else{
                    this.userId=data.uid;
                    this.userName=data.name;

                    var bindOid=this.getSession("bindOid");
                    this.computableModel.bindOid=bindOid;
                    $.ajax({
                        data: "Get",
                        url: "/modelItem/getInfo/"+bindOid,
                        data: { },
                        cache: false,
                        async: true,
                        success: (json) => {
                            if(json.data!=null){
                                $("#bind").html("unbind")
                                $("#bind").removeClass("btn-success");
                                $("#bind").addClass("btn-warning")
                                document.getElementById("search-box").readOnly = true;
                                this.computableModel.bindModelItem=json.data.name;
                                this.clearSession();
                            }
                            else{

                            }
                        }
                    })
                }
            }
        })

        $("#step").steps({
            onFinish: function () {
                alert('Wizard Completed');
            }
        });

        $(".next").click(function () {
            if($("#bind").html() == "bind"){


                return;
            }
            else{

            }

        });

        $(".finish").click(()=>{
            if($("#bind").html() == "bind"){
                alert("please bind model item (Step1)")
                return;
            }
            this.computableModel.contentType=$("input[name='ContentType']:checked").val();
            this.computableModel.isAuthor=$("input[name='author_confirm']:checked").val();

            var detail = tinyMCE.activeEditor.getContent();
            this.computableModel.detail = detail.trim();

            this.computableModel.authorship=[];
            this.getUserData($("#providersPanel .user-contents .form-control"), this.computableModel.authorship);

            var formData = new FormData();//重点在这里 如果使用 var data = {}; data.inputfile=... 这样的方式不能正常上传
            var files=$("#resource")[0].files;
            for(i=0;i<files.length;i++){
                formData.append("resources",files[i]);
            }
            formData.append("computableModel",JSON.stringify(this.computableModel))

            $("#step").css("display","none");
            $(".uploading").css("display","block");

            $.ajax({
                url: '/computableModel/add' ,
                type: 'post',
                data: formData,
                cache: false,
                processData: false,
                contentType: false,
                async: true
            }).done((res)=> {
                $("#step").css("display","block");
                $(".uploading").css("display","none");
                switch (res.data.code){
                    case 1:
                        alert("create computable model successfully!");
                        window.location.href="/computableModel/"+res.data.id;
                        break;
                    case -1:
                        alert("save files error");
                        break;
                    case -2:
                        alert("create fail");
                        break;
                }
            }).fail((res)=> {

                alert("please login first");
                window.location.href="/user/login";
            });
        })


        //模型条目搜索
        $('#search-box').keyup(() => {
                $.ajax({
                    data: "Get",
                    url: "/modelItem/findNamesByName",
                    data: {
                        name: this.computableModel.bindModelItem.trim()
                    },
                    cache: false,
                    async: true,
                    success: (json) => {
                        console.log(json.data)
                        $("#search-box").autocomplete({
                            source: json.data
                        });
                    }
                })

        });

        //绑定模型条目
        $("#bind").click(() => {
            this.computableModel.bindModelItem = $("#search-box").val();
            if ($("#bind").html() == "unbind") {
                $("#bind").html("bind");
                $("#bind").removeClass("btn-warning");
                $("#bind").addClass("btn-success")
                document.getElementById("search-box").readOnly = false;

            }
            else {

                $.ajax({
                    data: "Get",
                    url: "/modelItem/findByName",
                    data: {
                        name: this.computableModel.bindModelItem.trim()
                    },
                    cache: false,
                    async: true,
                    success: (json) => {
                        if(json.data!=null){
                            $("#bind").html("unbind")
                            $("#bind").removeClass("btn-success");
                            $("#bind").addClass("btn-warning")
                            document.getElementById("search-box").readOnly = true;
                            this.computableModel.bindOid=json.data.oid;
                        }
                        else{
                            alert("Can not find model item \""+this.computableModel.bindModelItem.trim()+"\",please check the name!")
                        }
                    }
                })

            }
        })

        $("input[name='ContentType']").iCheck({
            //checkboxClass: 'icheckbox_square-blue',  // 注意square和blue的对应关系
            radioClass: 'iradio_flat-green',
            increaseArea: '0%' // optional

        });
        $("input[name='author_confirm']").iCheck({
            //checkboxClass: 'icheckbox_square-blue',  // 注意square和blue的对应关系
            radioClass: 'iradio_flat-green',
            increaseArea: '0%' // optional

        });

        //content type radio
        $("input[name='ContentType']").eq(0).iCheck('check');

        $("input:radio[name='ContentType']").on('ifChecked', function(event){

            if($(this).val()=="Package"){
                $("#resource").val("");
                $("#resource").attr("accept","application/x-zip-compressed");
                $("#resource").removeAttr("multiple");
                $("#Files").show();
                $("#URL").hide();
            }
            else if($(this).val()=="Code"||$(this).val()=="Library"){
                $("#resource").val("");
                $("#resource").removeAttr("accept");
                $("#resource").attr("multiple","multiple");
                $("#Files").show();
                $("#URL").hide();
            }
            else{
                $("#resource").val("");
                $("#Files").hide();
                $("#URL").show();
            }

        });
        //author radio
        $("input[name='author_confirm']").eq(0).iCheck('check');

        $("input:radio[name='author_confirm']").on('ifChecked', function(event){
            if($(this).val()=="true"){

                $("#author_info").hide();
            }
            else{

                $("#author_info").show();
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

        var mid = window.sessionStorage.getItem("editConceptualModel_id");
        // if (mid === undefined || mid == null) {
        //     this.editorUrl = "http://127.0.0.1:8081http://127.0.0.1:8081/GeoModelingNew/modelItem/createModelItem.html";
        // } else {
        //     this.editorUrl = "http://127.0.0.1:8081http://127.0.0.1:8081/GeoModelingNew/modelItem/createModelItem.html?mid=" + mid;
        // }
    }
})