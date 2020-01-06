var userAccount = Vue.extend(
    {
        template: "#userAccount",
        data(){
            return{
                //页面样式控制
                loading: 'false',
                load: true,
                ScreenMinHeight: "0px",
                ScreenMaxHeight: "0px",

                //显示控制
                curIndex:8,

                //
                userInfo:{

                },


            }
        },

        methods:{
            //公共功能
            setSession(name, value) {
                window.sessionStorage.setItem(name, value);
                // this.editOid = sessionStorage.getItem('editItemOid');
            },

            creatItem(index){
                window.sessionStorage.removeItem('editOid');
                if(index == 1) window.open('../userSpace/model/createModelItem')
            },

            manageItem(index){
                //此处跳转至统一页面，vue路由管理显示
                var urls={
                    1:'/user/userSpace/data/dataitem',
                    2:'/user/userSpace/data/myDataSpace',
                }
                window.sessionStorage.setItem('itemIndex',index)

                window.location.href=urls[index]

            },

            getUserInfo() {
                axios.get('/user/getLoginUser').then(
                    res => {
                        if(res.data.code==0){
                            this.userInfo = res.data.data
                            let orgs = this.userInfo.organizations;

                            if (orgs.length != 0) {
                                this.userInfo.orgStr = orgs[0];
                                for (i = 1; i < orgs.length; i++) {
                                    this.userInfo.orgStr += ", " + orgs[i];
                                }
                            }

                            let sas = this.userInfo.subjectAreas;
                            if (sas != null && sas.length != 0) {
                                this.userInfo.saStr = sas[0];
                                for (i = 1; i < sas.length; i++) {
                                    this.userInfo.saStr += ", " + sas[i];
                                }
                            }


                            this.load = false;
                        }

                    }
                )
            },

            editUserInfo(){
                this.getUserInfo();
                if (this.userInfo.image != "" && this.userInfo.image != null) {
                    $("#photo").attr("src", this.userInfo.image);
                } else {
                    $("#photo").attr("src", "../static/img/icon/default.png");
                }

                if (this.userInfo.organizations != null && this.userInfo.organizations.length != 0) {
                    $("#inputOrganizations").tagEditor("destroy");
                    $('#inputOrganizations').tagEditor({
                        initialTags: this.userInfo.organizations,
                        forceLowercase: false,
                        placeholder: 'Enter Organizations ...'
                    });
                } else {
                    $("#inputOrganizations").tagEditor("destroy");
                    $('#inputOrganizations').tagEditor({
                        initialTags: [],
                        forceLowercase: false,
                        placeholder: 'Enter Organizations ...'
                    });
                }
                if (this.userInfo.subjectAreas != null && this.userInfo.subjectAreas.length != 0) {
                    $("#inputSubjectAreas").tagEditor("destroy");
                    $('#inputSubjectAreas').tagEditor({
                        initialTags: this.userInfo.subjectAreas,
                        forceLowercase: false,
                        placeholder: 'Enter Subject Areas ...'
                    });
                } else {
                    $("#inputSubjectAreas").tagEditor("destroy");
                    $('#inputSubjectAreas').tagEditor({
                        initialTags: [],
                        forceLowercase: false,
                        placeholder: 'Enter Subject Areas ...'
                    });
                }
                $('#myModal').modal('show');
            },
            //
            // imgFile() {
            //     $("#imgOne").click();
            // },

            selectUserImg(){
                $('#editUserImg').modal('show');
                console.log($("#imgChange"))

            },

            changePassword(){
                $('#myModal1').modal('show');

            },

            saveEditInfo(){
                // $("#saveUser").attr("disabled", "disabled");
                let userUpdate = {};
                userUpdate.oid = this.userId;
                userUpdate.name = $("#inputName").val().trim();
                userUpdate.phone = $("#inputPhone").val().trim();
                userUpdate.wiki = $("#inputHomePage").val().trim();
                userUpdate.description = $("#inputDescription").val().trim();
                userUpdate.organizations = $("#inputOrganizations").val().split(",");
                userUpdate.subjectAreas = $("#inputSubjectAreas").val().split(",");
                userUpdate.uploadImage = $("#photo").get(0).src;

                let that = this
                $.ajax({
                    url: "/user/update",
                    type: "POST",
                    async: true,
                    contentType: "application/json",
                    data: JSON.stringify(userUpdate),
                    success: function (result) {
                        $("#saveUser").removeAttr("disabled");
                        alert("update successfully!")
                        // window.location.reload();
                        $('#myModal').modal('hide');
                        that.getUserInfo();
                    }
                });
            },

            submitPass(){
                    let oldPass = $("#inputOldPass").val();
                    let newPass = $("#inputPassword").val();
                    let newPassAgain = $("#inputPassAgain").val();
                    if (oldPass == "") {
                        alert("Please enter old password!")
                        return;
                    } else if (newPass == "") {
                        alert("Please enter new password!")
                        return;
                    } else if (newPassAgain == "") {
                        alert("Please confirm new password!")
                        return;
                    } else if (newPass != newPassAgain) {
                        alert("Password and Confirm Password are inconsistent!")
                        return;
                    }

                    let data = {};
                    data.oldPass = oldPass;
                    data.newPass = newPass;

                    $.ajax({
                        url: "/user/changePassword",
                        type: "POST",
                        async: false,
                        data: data,
                        success: function (result) {
                            if (result.code == -1) {
                                alert("Please login first!")
                                window.location.href="/user/login";
                            } else {
                                let data = result.data;
                                if (data == 1) {
                                    alert("Change password successfully!")
                                    window.location.href = "/user/login";

                                } else {
                                    alert("Old password is not correct!");
                                }
                            }
                        },
                        error: function (result) {
                            alert("Change password error!")

                        }
                    });

            },

            sendcurIndexToParent(){
                this.$emit('com-sendcurindex',this.curIndex)
            }

        },

        created() {
        },

        mounted() {

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
                        data = JSON.parse(data);

                        console.log(data);

                        if (data.oid == "") {
                            alert("Please login");
                            window.location.href = "/user/login";
                        } else {
                            this.userId = data.oid;
                            this.userName = data.name;
                            console.log(this.userId)


                            $("#author").val(this.userName);

                            var index = window.sessionStorage.getItem("index");
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
                            setTimeout(
                                ()=>{
                                    this.load = false;
                                },300
                            )

                        }
                    }
                })

                this.getUserInfo()
                //this.getModels();
            });

            //初始化的时候吧curIndex传给父组件，来控制bar的高亮显示
            this.sendcurIndexToParent()

            $('#inputOrganizations').tagEditor({
                forceLowercase: false
            });

            $('#inputSubjectAreas').tagEditor({
                forceLowercase: false
            });
        },

    }
)