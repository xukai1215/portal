new Vue({
    el: '#app',
    data: function () {
        return {
            useroid:"",
            userImg:"",
            //comment
            commentText: "",
            commentParentId:null,
            commentList:[],
            replyToUserId:"",
            commentTextAreaPlaceHolder:"Write your comment...",
            replyTo:"",

            modelItemFormVisible:false,
            activeIndex:'3-1',
            activeNameGraph: 'Image',
            activeName: 'Conceptual Model',

            form:{
                name:"",
            },
            graphVisible:"none",
            editConceptualModelDialog:false,
            modelOid:'',
        }
    },
    methods: {
        submitComment(){
            if(this.useroid==""||this.useroid==null||this.useroid==undefined){
                this.confirmLogin();
            }else if(this.commentText.trim()==""){
                this.$message({
                    message: 'Comment can not be empty!',
                    offset: 40,
                    showClose: true,
                });
            }else {

                let hrefs = window.location.href.split("/");
                let id = hrefs[hrefs.length - 1].substring(0, 36);
                let typeName = hrefs[hrefs.length-2];
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
                        if(result.code==-1){
                            window.location.href="/user/login"
                        }else if (result.code == 0) {
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
        deleteComment(oid){
            $.ajax({
                url: "/comment/delete",
                async: true,
                type: "POST",


                data: {
                    oid:oid,
                },
                success: (result) => {
                    console.log(result)
                    if(result.code==-1){
                        window.location.href="/user/login"
                    }else if (result.code == 0) {
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
        getComments(){
            let hrefs=window.location.href.split("/");
            let type=hrefs[hrefs.length-2];
            let oid=hrefs[hrefs.length-1].substring(0,36);
            let data={
                type:type,
                oid:oid,
                sort:-1,
            };
            $.get("/comment/getCommentsByTypeAndOid",data,(result)=>{
                this.commentList=result.data.commentList;
            })
        },
        replyComment(comment){
            this.commentParentId=comment.oid;
            this.replyTo="Reply to "+comment.author.name;
            setTimeout(function () { $("#commentTextArea").focus();}, 1);
        },
        replySubComment(comment,subComment){
            this.commentParentId=comment.oid;
            this.replyToUserId=subComment.author.oid;
            // this.commentTextAreaPlaceHolder="Reply to "+subComment.author.name;
            this.replyTo="Reply to "+subComment.author.name;
            setTimeout(function () { $("#commentTextArea").focus();}, 1);
        },
        tagClose(){
            this.replyTo="";
            this.replyToUserId="";
            this.commentParentId=null;
        },

        confirmLogin(){
            this.$confirm('<div style=\'font-size: 18px\'>This function requires an account, <br/>please login first.</div>', 'Tip', {
                dangerouslyUseHTMLString: true,
                confirmButtonText: 'Log In',
                cancelButtonClass: 'fontsize-15',
                confirmButtonClass: 'fontsize-15',
                type: 'info',
                center: true,
                showClose: false,
            }).then(() => {
                window.location.href = "/user/login";
            }).catch(() => {

            });
        },

        edit(){
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
                    if (data.oid == "") {
                        this.confirmLogin();

                    }
                    else {
                        let href=window.location.href;
                        let hrefs=href.split('/');
                        let oid=hrefs[hrefs.length-1].split("#")[0];
                        this.editDialogOpen()
                        window.sessionStorage.setItem("editId",oid)
                        // $.ajax({
                        //     type: "GET",
                        //     url: "/conceptualModel/getUserOidByOid",
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
                        //         window.sessionStorage.setItem("editConceptualModel_id",oid)
                        //         window.location.href="/user/createConceptualModel";
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

        editDialogOpen(){
            let href = window.location.href;
            let hrefs = href.split('/');
            let oid = hrefs[hrefs.length - 1].split("#")[0];
            this.modelOid = oid;
            this.editConceptualModelDialog = true
        },

        setSession(name, value) {
            window.sessionStorage.setItem(name, value);
        },

        switchClick(i){

            if(i==2) {
                $(".tab1").css("display", "none");
                $(".tab2").css("display", "block");
            }
            else {
                $(".tab2").css("display", "none");
                $(".tab1").css("display", "block");
            }

            var btns=$(".switch-btn")
            btns.eq(i%2).css("color","#636363");
            //btns.eq(i%2).attr("href","javascript:void(0)");
            btns.eq((i+1)%2).css("color","#428bca");
            //btns.eq((i+1)%2).attr("href","");
        },

        formateTime(val){
            var date = new Date(val);
            return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
        },

        bindModelItem(){
            let urls=window.location.href.split("/");
            $.ajax({
                type: "GET",
                url: "/modelItem/bindModel/",
                data: {
                    type:1,
                    name:this.form.name,
                    oid:urls[urls.length-1]
                },
                async: false,
                success: (json) => {
                    if(json.code==-1){
                        this.$alert('Model item is not exist,please check the name.', 'Error', {
                            type:'error',
                            confirmButtonText: 'OK',
                            callback: action => {

                            }
                        });
                    }
                    else{
                        this.$alert('Bind successfully!', 'Success', {
                            type:'success',
                            confirmButtonText: 'OK',
                            callback: action => {
                                window.location.href=window.location.href.substring(0,window.location.href.length-36)+json.data;
                            }
                        });
                    }
                }
            })
        },

        showMxGraph(){
            this.graphVisible = "block";
            var vh=window.innerHeight;
            var h = vh - 62 +"px";
            $("#container_top").css("height",h);

            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
            document.body.style.overflowY="hidden";
        },

        hideMxGraph(){
            this.graphVisible = "none";
            document.body.style.overflowY="auto";
        }

    },
    mounted(){
        this.setSession("history", window.location.href);
        axios.get("/user/load")
            .then((res) => {
                if (res.status == 200) {
                    if (res.data.oid != '') {
                        this.useroid = res.data.oid;
                        this.userImg = res.data.image;
                    }

                }
            })
        this.getComments();

        $(document).on('mouseover mouseout','.flexRowSpaceBetween',function(e){

            let deleteBtn=$(e.currentTarget).children().eq(1).children(".delete");
            if(deleteBtn.css("display")=="none"){
                deleteBtn.css("display","block");
            }else{
                deleteBtn.css("display","none");
            }

        });

        let parentWidth=$("#pane-Image").width();
        let children=$("#pane-Image img");
        for(i=0;i<children.length;i++){
            if(children.eq(i).width()>parentWidth){
                children.eq(i).css("width","100%")
            }
        }

        $(".ab").click(function () {

                if (!$(this).hasClass('transform180'))
                    $(this).addClass('transform180')
                else
                    $(this).removeClass('transform180')
            }
        );

        $("[data-toggle='tooltip']").tooltip();

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

    }
})