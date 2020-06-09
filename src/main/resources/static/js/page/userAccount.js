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
                    oid:'',
                    name:'',
                },

                subscribe:false,

                subscribeList:[],

                dialogTableVisible:false,
                tableMaxHeight: 400,
                pageOption: {
                    paginationShow: false,
                    progressBar: true,
                    sortAsc: false,
                    currentPage: 1,
                    pageSize: 5,
                    total: 0,
                    searchText: "",
                    searchResult: [],
                },

            }
        },

        components: {
            'avatar': VueAvatar.Avatar
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

            setSubscribe(){

                $.post("/user/setSubscribe",{subscribe:this.subscribe},(result)=>{
                    let data = result.data;
                    if(result.code==-1){
                        this.$alert('Please login first', 'Tip', {
                            confirmButtonText: 'OK',
                            callback: action => {
                                window.location.href="/user/login";
                            }
                        });

                    }

                })
            },

            getSubscribedList(){
                $.get("/user/getSubscribedList",{},(result)=>{
                    this.subscribeList = result.data;
                })
            },

            submitSubscribedList(){
                $.ajax({
                    url:"/user/setSubscribedList",
                    data:JSON.stringify(this.subscribeList),
                    type:"post",
                    cache:false,
                    dataType: "json",
                    contentType:"application/json",
                    success: (res)=> {
                        this.$alert('Set subscribed list successfully!', 'Success', {
                            confirmButtonText: 'OK',
                            callback: action => {
                                this.dialogTableVisible = false;
                            }
                        });
                    },
                    error: (res)=> {
                        this.$alert('Submit failed!', 'Error', {
                            confirmButtonText: 'OK',
                            callback: action => {

                            }
                        });
                    }
                });  

                $.post("/user/setSubscribedList",JSON.stringify(this.subscribeList),(result)=>{
                    this.$alert('Set subscribed list successfully!', 'Error', {
                        confirmButtonText: 'OK',
                        callback: action => {

                        }
                    });
                })
            },

            editSubscribedList(){
                // this.getSubscribedList();
                this.search();
                this.dialogTableVisible = true;
            },

            handleDelete(index, row) {
                console.log(index, row);
                let table = new Array();
                for (i = 0; i < this.subscribeList.length; i++) {
                    table.push(this.subscribeList[i]);
                }
                table.splice(index, 1);
                this.subscribeList = table;

            },

            handleEdit(index, row) {
                console.log(row);
                let flag = false;
                for (i = 0; i < this.subscribeList.length; i++) {
                    let tableRow = this.subscribeList[i];
                    if (tableRow.oid == row.oid) {
                        flag = true;
                        break;
                    }
                }
                if (!flag) {

                    let subscribe = {};
                    subscribe.name = row.name;
                    subscribe.oid = row.oid;
                    subscribe.type = row.contentType;

                    this.subscribeList.push(subscribe);
                }
            },

            handlePageChange(val) {

                this.pageOption.currentPage = val;

                this.search();
            },

            search(){
                let data = {
                    asc: this.pageOption.sortAsc,
                    page: this.pageOption.currentPage-1,
                    pageSize: this.pageOption.pageSize,
                    searchText: this.pageOption.searchText,
                    sortType: "default",
                    classifications: ["all"],
                };
                // data = JSON.stringify(data);
                $.ajax({
                    type: "POST",
                    url: "/computableModel/listByAuthor",
                    data: data,
                    async: true,
                    contentType: "application/x-www-form-urlencoded",
                    success: (json) => {
                        if (json.code == 0) {
                            let data = json.data;
                            console.log(data)

                            this.pageOption.total = data.total;
                            this.pageOption.pages = data.pages;
                            this.pageOption.searchResult = data.list;
                            this.pageOption.users = data.users;
                            this.pageOption.progressBar = false;
                            this.pageOption.paginationShow = true;

                        }
                        else {
                            console.log("query error!")
                        }
                    }
                })
            },


            getUserInfo() {
                axios.get('/user/getLoginUser').then(
                    res => {
                        if(res.data.code==0){
                            this.userInfo = res.data.data
                            this.subscribe = this.userInfo.subscribe;
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
                    $("#userPhoto").attr("src", this.userInfo.image);
                } else {
                    $("#userPhoto").attr("src", "../static/img/icon/default.png");
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
                $('#imgOne').click();

            },

            changePassword(){
                $('#myModal1').modal('show');

            },

            preImg() {

                var file = $('#imgOne').get(0).files[0];
                //创建用来读取此文件的对象
                var reader = new FileReader();
                //使用该对象读取file文件
                reader.readAsDataURL(file);
                //读取文件成功后执行的方法函数
                reader.onload = function (e) {
                    //读取成功后返回的一个参数e，整个的一个进度事件
                    //选择所要显示图片的img，要赋值给img的src就是e中target下result里面
                    //的base64编码格式的地址
                    $('#userPhoto').get(0).src = e.target.result;
                }


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
                userUpdate.uploadImage = '';
                if($("#userPhoto").get(0).src!="http://localhost:8080/static/img/icon/default.png")
                    userUpdate.uploadImage = $("#userPhoto").get(0).src;

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
                        that.$parent.getUserInfo();//调用父组件的getuser,修改headBar的userInfo
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
                    data.oldPass = hex_md5(oldPass);
                    data.newPass = hex_md5(newPass);

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
                $("#inputOldPass").val('') ;
                $("#inputPassword").val('');
                $("#inputPassAgain").val('');

            },

            sendcurIndexToParent(){
                this.$emit('com-sendcurindex',this.curIndex)
            },

            sendUserToParent(userId){
                this.$emit('com-senduserinfo',userId)
            },
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

                            this.sendUserToParent(this.userId)

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

            //头像更换
            $("#imgChange").click(function () {
                $("#imgFile").click();
            });
            $("#imgFile").change(function () {
                //获取input file的files文件数组;
                //$('#filed')获取的是jQuery对象，.get(0)转为原生对象;
                //这边默认只能选一个，但是存放形式仍然是数组，所以取第一个元素使用[0];
                var file = $('#imgFile').get(0).files[0];
                //创建用来读取此文件的对象
                var reader = new FileReader();
                //使用该对象读取file文件
                reader.readAsDataURL(file);
                //读取文件成功后执行的方法函数
                reader.onload = function (e) {
                    //读取成功后返回的一个参数e，整个的一个进度事件
                    //选择所要显示图片的img，要赋值给img的src就是e中target下result里面
                    //的base64编码格式的地址
                    $('#imgShow').get(0).src = e.target.result;
                    $('#imgShow').show();

                    that.data_img.push(e.target.result)

                }
            });

            this.getSubscribedList();

            $('#inputOrganizations').tagEditor({
                forceLowercase: false
            });

            $('#inputSubjectAreas').tagEditor({
                forceLowercase: false
            });
        },

    }
)