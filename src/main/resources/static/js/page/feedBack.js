ELEMENT.locale(ELEMENT.lang.en)
var vue = new Vue(
    {
        el: "#app",
        data(){
            return{
                //页面样式控制
                loading: 'false',
                load: true,
                ScreenMinHeight: "0px",
                ScreenMaxHeight: "0px",

                //显示控制
                curIndex:9,

                //
                userInfo:{

                },


            }
        },

        methods:{
            //公共功能
            changeRter(index){
                this.curIndex = index;
                var urls={
                    1:'/user/userSpace',
                    2:'/user/userSpace/model',
                    3:'/user/userSpace/data',
                    4:'/user/userSpace/server',
                    5:'/user/userSpace/task',
                    6:'/user/userSpace/community',
                    7:'/user/userSpace/theme',
                    8:'/user/userSpace/account',
                    9:'/user/userSpace/feedback',
                }

                this.setSession('curIndex',index)
                window.location.href=urls[index]

            },

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

            send(){

            }

        },

        created() {
        },

        mounted() {
            setTimeout(()=>{
                this.load = false
            },180)

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


            });

        },

    }
)