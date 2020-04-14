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
    },
    methods: {
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
                        alert("Please login first");
                        this.setSession("history", window.location.href);
                        window.location.href = "/user/login";
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
