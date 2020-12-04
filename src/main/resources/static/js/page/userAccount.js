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
                    saStr:'',
                },

                subscribe:false,
                subscribeComputableOwner:'my',
                subscribeList:[],

                dialogTableVisible:false,
                tableMaxHeight: 400,
                searchText: "",
                pageOption: {
                    paginationShow: false,
                    progressBar: true,
                    sortAsc: false,
                    currentPage: 1,
                    pageSize: 5,
                    total: 0,
                    searchResult: [],
                },

                pageOption2: {
                    paginationShow: false,
                    progressBar: true,
                    sortAsc: false,
                    currentPage: 1,
                    pageSize: 5,
                    total: 0,
                    searchResult: [],
                },

                itemInfo: {
                    image: '',
                },
                imgClipDialog:false,
                dragReady:false
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

            forgetPass() {
                $('#myModal1').modal('hide');
                // this.reset=true;
                this.$prompt('Please enter your email:', 'Reset Password', {
                    confirmButtonText: 'Confirm',
                    cancelButtonText: 'Cancel',
                    inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
                    inputErrorMessage: 'E-mail format is incorrect.'
                }).then(({ value }) => {
                    let info=this.$notify.info({
                        title: 'Reseting password',
                        message: 'Please wait for a while, new password will be sent to your email.',
                        offset: 70,
                        duration: 0
                    });
                    $.ajax({
                        url: '/user/resetPassword',
                        type: 'post',
                        // data对象中的属性名要和服务端控制器的参数名一致 login(name, password)
                        data: {
                            email:value
                        },
                        // dataType : 'json',
                        success: (result) => {
                            info.close();
                            // this.reset=false;
                            if (result.data=="suc") {

                                this.$notify.success({
                                    title: 'Success',
                                    message: 'New password has been sent to your email. If you can not find the password, please check the spam box.',
                                    offset: 70,
                                    duration: 0
                                });

                            }
                            else if(result.data=="no user") {
                                this.$notify({
                                    title: 'Failed',
                                    message: 'Email does not exist, please check again or register a new account.',
                                    offset: 70,
                                    type: 'warning',
                                    duration: 0
                                });
                            }
                            else{
                                this.$notify.error({
                                    title: 'Failed',
                                    message: 'Reset password failed, Please try again or contact opengms@njnu.edu.cn',
                                    offset: 70,
                                    duration: 0
                                });
                            }
                        },
                        error: function (e) {
                            alert("reset password error");
                        }
                    });
                }).catch(() => {

                });
            },

            setSubscribe(){

                $.post("/user/setSubscribe",{subscribe:this.subscribe},(result)=>{
                    let data = result.data;
                    if(result.code==-1){
                        this.$alert('Please login first', 'Tip', {
                            type:"info",
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
                            type:"success",
                            confirmButtonText: 'OK',
                            callback: action => {
                                this.dialogTableVisible = false;
                            }
                        });
                    },
                    error: (res)=> {
                        this.$alert('Submit failed!', 'Error', {
                            type:"error",
                            confirmButtonText: 'OK',
                            callback: action => {

                            }
                        });
                    }
                });  

            },

            editSubscribedList(){
                // this.getSubscribedList();
                $.get("/user/getModelCounts",{},(result)=>{
                    if(result.code==-1) {
                        this.$alert('Please login first', 'Tip', {
                            type: "info",
                            confirmButtonText: 'OK',
                            callback: action => {
                                window.location.href = "/user/login";
                            }
                        });
                    }else{
                        let data = result.data;
                        if(data.computableModel>0){
                            this.search();
                            this.dialogTableVisible = true;
                        }else {
                            let information = "You have ";
                            if(data.modelItem>0){
                                information+=data.modelItem+" model item";
                                if(data.modelItem>1){
                                    information+="s";
                                }
                                information += " and ";
                            }
                            information += "no computable model, please create a computable model first."
                            this.$confirm(information, 'Tip', {
                                dangerouslyUseHTMLString: true,
                                confirmButtonText: 'Create',
                                cancelButtonClass: 'fontsize-15',
                                confirmButtonClass: 'fontsize-15',
                                type: 'info',
                                center: true,
                                showClose: false,
                            }).then(() => {
                                window.location.href = "/user/login";
                            }).catch(() => {

                            });
                        }
                    }
                })

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
                if(this.subscribeComputableOwner == "my") {
                    let data = {
                        asc: this.pageOption.sortAsc,
                        page: this.pageOption.currentPage - 1,
                        pageSize: this.pageOption.pageSize,
                        searchText: this.searchText,
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
                }else{

                }
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
                            this.userInfo.saStr = '';
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
                        placeholder: 'Enter Study Areas ...'
                    });
                } else {
                    $("#inputSubjectAreas").tagEditor("destroy");
                    $('#inputSubjectAreas').tagEditor({
                        initialTags: [],
                        forceLowercase: false,
                        placeholder: 'Enter Study Areas ...'
                    });
                }
                $('#myModal').modal('show');
            },
            //
            // imgFile() {
            //     $("#imgOne").click();
            // },

            imgUpload(){
                this.imgClipDialog = true
                this.$nextTick(()=>{
                    let canvas = document.getElementsByTagName('canvas')[0]
                    canvas.style.backgroundImage = ''

                    context = canvas.getContext('2d');
                    //清除画布
                    context.clearRect(0,0,200,200);

                    document.getElementsByClassName('dragBlock')[0].style.left = '-7px'
                })

            },

            closeImgUpload(){
                this.dragReady = false
            },


            deleteImg(){
                this.$set(this.itemInfo,'image' , '')
                console.log(this.itemInfo.image)
            },

            editImg(){
                this.imgClipDialog = true
                this.$nextTick(()=>{
                    let canvas = document.getElementsByTagName('canvas')[0]
                    // canvas.style.backgroundImage = this.itemInfo.image

                    context = canvas.getContext('2d');
                    //清除画布
                    // context.clearRect(0,0,150,150);

                    document.getElementsByClassName('dragBlock')[0].style.left = '-7px'
                })
            },


            selectUserImg(){
                this.imgChange()

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
                        that.$alert('Update successfully!', {
                            type:"success ",
                            confirmButtonText: 'OK',
                        });
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
                                this.$alert('Please login first', 'Tip', {
                                    type:"info",
                                    confirmButtonText: 'OK',
                                    callback: action => {
                                        window.location.href="/user/login";
                                    }
                                });

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
            var vthis = this
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

                        console.log(data);

                        if (data.oid == "") {
                            this.$alert('Please login first', 'Tip', {
                                type:"info",
                                confirmButtonText: 'OK',
                                callback: action => {
                                    window.location.href="/user/login";
                                }
                            });
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

            this.getSubscribedList();

            $('#inputOrganizations').tagEditor({
                forceLowercase: false
            });

            $('#inputSubjectAreas').tagEditor({
                forceLowercase: false
            });


            //上传头像
            var targetW,targetH//设为上层变量便于后续调用
            var maxW,maxH,canvas,context,oImg,oldTarW,oldTarH,endX,endY

            function fileUpload(fileInput,size,callBack){
                //获取input file的files文件数组;
                //$('#filed')获取的是jQuery对象，.get(0)转为原生对象;
                //这边默认只能选一个，但是存放形式仍然是数组，所以取第一个元素使用[0];
                var file = fileInput.files[0];
                let fileSize = (file.size / 1024).toFixed(0)
                // if(fileSize>size){
                //     alert('The upload file should be less than 1.5M')
                //     return
                // }
                callBack(file);
            }
            $("#imgChange").click(function () {
                imgChange()
            });

            this.imgChange = function imgChange(){
                $("#imgFile").click()
                $("#imgFile").change(function () {

                    vthis.imgUpload()
                    fileUpload(this,2048,function (file) {

                        //创建一个图像对象，用于接收读取的文件
                        oImg=new Image();
                        //创建用来读取此文件的对象
                        var reader = new FileReader();
                        //使用该对象读取file文件
                        reader.readAsDataURL(file);
                        //读取文件成功后执行的方法函数
                        reader.onload = function (e) {
                            //读取成功后返回的一个参数e，整个的一个进度事件
                            //选择所要显示图片的img，要赋值给img的src就是e中target下result里面
                            //的base64编码格式的地址
                            // $('#imgShowBig').get(0).src = this.result;
                            oImg.src=this.result
                        }
                        targetW=0
                        targetH=0
                        //图像加载完成绘制canvas
                        oImg.onload = ()=>{
                            canvas = document.createElement('canvas');
                            context = canvas.getContext('2d');

                            let originW = oImg.width;//图像初始宽度
                            let originH = oImg.height;

                            maxW=160
                            maxH=160
                            targetW=originW
                            targetH=originH

                            //设置canvas的宽、高
                            canvas.width=200
                            canvas.height=200

                            var positionX
                            var positionY
                            //判断图片是否超过限制  等比缩放
                            if(originW > maxW || originH > maxH) {
                                if(originH/originW < maxH/maxW) {//图片宽
                                    targetH = maxH;
                                    targetW = Math.round(maxH * (originW / originH));
                                    positionX=100-targetW/2+'px'
                                    positionY='20px'
                                    canvas.style.backgroundSize = "auto 160px "
                                }else {
                                    targetW = maxW;
                                    targetH = Math.round(maxW * (originH / originW));
                                    positionX='20px'
                                    positionY=100-targetH/2+'px'
                                    // console.log(positionY)
                                    canvas.style.backgroundSize = "160px auto"

                                }
                            }

                            if(originW <= maxW || originH <= maxH) {
                                if(originH/originW < maxH/maxW) {//图片宽
                                    targetH = maxH;
                                    targetW = Math.round(maxH * (originW / originH));
                                    positionX=100-targetW/2+'px'
                                    positionY='10px'
                                    canvas.style.backgroundSize = "auto 160px "
                                }else {
                                    targetW = maxW;
                                    targetH = Math.round(maxW * (originH / originW));
                                    positionX='10px'
                                    positionY=100-targetH/2+'px'
                                    // console.log(positionY)
                                    canvas.style.backgroundSize = "160px auto"
                                }
                            }

                            oldTarW=targetW
                            oldTarH=targetH
                            //清除画布
                            context.clearRect(0,0,200,200);

                            let img="url("+oImg.src+")";
                            // console.log(oImg.src===img)

                            canvas.style.backgroundPositionX = positionX
                            canvas.style.backgroundPositionY = positionY

                            endX=positionX
                            endY=positionY

                            // canvas.style.backgroundPositionY = positionY
                            canvas.style.backgroundImage = img
                            // var back= context.createPattern(oImg,"no-repeat")
                            // context.fillStyle=back;
                            // context.beginPath()
                            // if(originW>originH)
                            //     context.fillRect(0,10,targetW,targetH);
                            // else
                            //     context.fillRect(10,0,targetW,targetH);
                            // context.closePath()

                            // 利用drawImage将图片oImg按照目标宽、高绘制到画布上
                            // if(originW>originH)
                            //     context.drawImage(oImg,0,10,targetW,targetH);
                            // else
                            //     context.drawImage(oImg,10,0,targetW,targetH);

                            context.fillStyle = 'rgba(230,230,230,.69)';
                            context.beginPath()
                            context.rect(0,0,200,200);
                            context.closePath()
                            context.fill()

                            context.globalCompositeOperation='destination-out'

                            context.fillStyle='yellow'
                            context.beginPath()
                            context.rect(20,20,160,160)
                            context.closePath()
                            context.fill();

                            canvas.toBlob(function (blob) {
                                console.log(blob);
                                //之后就可以对blob进行一系列操作
                            },file.type || 'image/png');
                            $('.circlePhotoFrame').eq(0).children('canvas').remove();
                            document.getElementsByClassName('circlePhotoFrame')[0].appendChild(canvas);
                            // $('.dragBar').eq(0).css('background-color','#cfe5fa')

                            vthis.dragReady=true

                            document.getElementsByClassName('dragBlock')[0].style.left = '-7px'//滚动条归位
                        }

                    })



                });

            }

            function canvasToggle(){
                var startX,startY,moveX,moveY,width,height,posX,posY,limitX,limitY,leaveX,leaveY,
                    lastX,lastY,dirR,dirD,noUseMoveR,noUseMoveD
                var dragable=false
                // console.log('~~~~~~'+targetW,targetH)
                $(document).off('mousemove')
                $(document).off('mousedown')
                $(document).on('mousedown','canvas',(e)=>{
                    $('.circlePhotoFrame').eq(0).children('canvas').css('cursor','grabbing')
                    var canvas = e.currentTarget
                    startX = e.pageX;
                    startY = e.pageY;

                    lastX = startX
                    lastY = startY

                    leaveX = 0
                    leaveY = 0
                    console.log(startX,startY)
                    posX=canvas.style.backgroundPositionX.split('p')[0]
                    posY=canvas.style.backgroundPositionY.split('p')[0]

                    endX=canvas.style.backgroundPositionX
                    endY=canvas.style.backgroundPositionX

                    // console.log(e.currentTarget)
                    dragable=true
                    return;
                })

                $(document).on('mousemove',(e)=>{
                    if (dragable === true) {
                        // console.log($('.circlePhotoFrame').eq(0).children('canvas'))
                        // console.log(targetW)
                        var canvas = document.getElementsByTagName('canvas')[0]

                        limitX=targetW-maxW
                        limitY=targetH-maxH

                        let maxMoveXR=20-parseFloat(posX)
                        let maxMoveXD=20-parseFloat(posY)

                        if(e.pageX>lastX) dirR=1  //向左方向值
                        else dirR=-1

                        if(e.pageY>lastY) dirD=1  //向下方向值
                        else dirD=-1

                        // console.log(e.pageX - startX)

                        if(e.pageX - startX>maxMoveXR){
                            if(dirR===1){
                                lastX = e.pageX
                                noUseMoveR=e.pageX - startX - maxMoveXR
                            }

                            else{
                                lastX = e.pageX
                                // e.pageX-=noUseMoveR
                                // console.log('left'+e.pageX)
                                // console.log(e.pageX - startX)
                            }

                        }else{
                            lastX = e.pageX
                        }


                        lastY = e.pageY

                        moveX = e.pageX - startX;
                        moveY = e.pageY - startY;

                        endX = moveX + parseFloat(posX)
                        endY = moveY + parseFloat(posY)

                        // console.log(moveX, moveY)

                        // console.log(endX, endY)
                        if (endX <= 20&&endX>=-limitX+20) {
                            endX = endX + 'px'
                            canvas.style.backgroundPositionX = endX
                        }

                        if (endY <= 20&&endY>=-limitY+20) {
                            endY = endY + 'px'
                            canvas.style.backgroundPositionY = endY
                        }


                    }
                })

                $(document).on('mouseup',(e)=>{
                    dragable = false
                    $('.circlePhotoFrame').eq(0).children('canvas').css('cursor','grab')
                    // $('.circlePhotoFrame').off('mousemove','canvas')
                    // var canvas=e.currentTarget
                    // endX=e.pageX-startX;
                    // endY=e.pageY-startY;
                    // endX=endX+'px'
                    // endY=endY+'px'
                    // // console.log(e.currentTarget)
                    // canvas.style.backgroundPositionX=endX
                    // canvas.style.backgroundPositionY=endY
                })

                $(document).on('mouseleave','canvas',(e)=>{
                    leaveX=e.pageX
                    leaveY=e.pageY
                    // dragable = false

                })

                $("#saveUserImgButton").click(()=>{

                    let x=parseFloat(canvas.style.backgroundPositionX.split('p')[0])
                    let y=parseFloat(canvas.style.backgroundPositionY.split('p')[0])

                    // var back= context.createPattern(oImg,"no-repeat")
                    context.globalCompositeOperation='source-out'
                    // context.fillStyle=back;
                    // context.beginPath()
                    // context.fillRect(0,10,targetW,targetH);
                    //
                    // context.closePath()
                    context.clearRect(0,0,200,200)
                    canvas.style.backgroundImage = ""
                    if(targetW<targetH){
                        let nx=0-(20-x)/160*200
                        let ny=0-(20-y)/160*200
                        context.drawImage(oImg,nx,ny,targetW/160*200,targetH/160*200);
                    }else{
                        let nx=0-(20-x)/160*200
                        let ny=0-(20-y)/160*200
                        context.drawImage(oImg,nx,ny,targetW/160*200,targetH/160*200);
                    }
                    let url= canvas.toDataURL();
                    saveImage(url)
                })
            }

            function dragBar() {
                // 获取元素
                var block = $('.dragBlock').eq(0);
                var bar = $('.dragBar').eq(0);
                var left,leftStart,leftPos,leaveLeft,times,newTW=targetW,newTH=targetH,newX,newY
                length=bar.width()

                var dragBarAble=false

                // 拖动原理
                $(document).on('mousedown','.dragBlock',(e)=>{
                    dragBarAble=true
                    leftStart=e.pageX
                    leaveLeft=0
                    left=block.css('left')
                    // console.log(leftStart)
                    return;
                })

                $(document).on('mousemove',(e)=>{
                    if(dragBarAble==true&&vthis.dragReady==true){
                        var move=e.pageX-leftStart

                        let x=parseFloat(canvas.style.backgroundPositionX.split('p')[0])
                        let y=parseFloat(canvas.style.backgroundPositionY.split('p')[0])

                        leftPos=move + parseFloat(left)

                        if(leftPos>=-7&&leftPos<=length-7){//减去block自身半径

                            times=(leftPos+7+100)/100  //算出加大倍数

                            newTW=oldTarW*times
                            newTH=oldTarH*times

                            let backgsize=newTW+'px'+' '+newTH+"px"
                            console.log(backgsize)
                            canvas.style.backgroundSize=backgsize

                            let timesP=newTW/targetW

                            // let eX,eY
                            // if(typeof(endX)=='string'){
                            //     eX=parseFloat(endX.split('p')[0])
                            //     eY=parseFloat(endY.split('p')[0])
                            // }else{
                            //     eX=endX
                            //     eY=endY
                            // }
                            // eX=75-(75-x)/times
                            // eY=75-(75-y)/times
                            // console.log(eX,eY)

                            newX=100-(100-x)*timesP
                            newY=100-(100-y)*timesP
                            if(newY>20)//防止缩放超出边界
                                newY=20
                            else if(newY+newTH<180)
                                newY=180-newTH
                            if(newX>20)
                                newX=20
                            else if(newX+newTW<180)
                                newX=180-newTW
                            // console.log(timesP)
                            // console.log("wz"+newX,newY)

                            newX=newX+'px'
                            newY=newY+'px'

                            canvas.style.backgroundPositionX = newX
                            canvas.style.backgroundPositionY = newY

                            leftPos=leftPos+'px'
                            // console.log(leftPos)
                            block.css('left',leftPos)

                            targetW=newTW
                            targetH=newTH
                        }

                    }
                })

                $(document).on('mouseup',(e)=>{
                    dragBarAble=false
                })

                $(document).on('mouseleave','.dragBlock',(e)=>{
                    leaveLeft=e.pageX
                    // dragable = false

                })

            }

            canvasToggle();

            dragBar();

            function saveImage(img) {

                $('#userPhoto').get(0).src = img;
                // $('#imgShow').show();
                // vthis.userImage = img
                vthis.loading=true
                vthis.dragReady=false
                setTimeout(()=>{
                    vthis.imgClipDialog=false
                    vthis.loading=false
                },150)

            }

        },

    }
)