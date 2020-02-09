Vue.component('headSideBar', {
    template: '#headSideBar',
    props: ['userInfoinParent','curindexParent'],

    data() {
        return {
            tableData: [{
                info:[],
                model:[],
                data:[],
                application:[]
            }],
            message_num:0,
            curIndex:1,
            itemIndex: 1,

            //
            userInfo:{

            },
        }
    },

    watch: {
        curindexParent: {
            handler() {
                this.curIndex = this.curindexParent
            },
            immediate: true
        },

        userInfoinParent: {
            handler() {
                this.userInfo = this.userInfoinParent
            },
            immediate: true
        },

        $route:{
            handler(to, from) {//通过路由判断条目高亮显示,
                console.log(to.path)
                let path = to.path
                if(path === '/')
                    this.curIndex = 1
                else if(path.indexOf('model') != -1)
                    this.curIndex = 2
                else if(path.indexOf('data') != -1)
                    this.curIndex = 3
                else if(path.indexOf('server') != -1)
                    this.curIndex = 4
                else if(path.indexOf('task') != -1)
                    this.curIndex = 5
                else if(path.indexOf('community') != -1)
                    this.curIndex = 6
                else if(path.indexOf('Theme') != -1)
                    this.curIndex = 7
                else if(path.indexOf('account') != -1)
                    this.curIndex = 8
                else if(path.indexOf('feedback') != -1)
                    this.curIndex = 9

            },
            immediate:true
        }
    },

    methods:{
        changeRter(index){
            this.curIndex = index;
            var urls={
                1:'/user/userSpace#/',
                2:'/user/userSpace#/model',
                3:'/user/userSpace#/data',
                4:'/user/userSpace#/server',
                5:'/user/userSpace#/task',
                6:'/user/userSpace#/community',
                7:'/user/userSpace#/userTheme',
                8:'/user/userSpace#/account',
                9:'/user/userSpace#/feedback',
                10:'/user/userSpace#/notice',
            }

            this.setSession('curIndex',index)
            window.location.href=urls[index]

            //此处改完还要修改监听中的$route以保证回退时能够正确高亮显示所在条目

        },

        setSession(name, value) {
            window.sessionStorage.setItem(name, value);
            // this.editOid = sessionStorage.getItem('editItemOid');
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

        getThemeMessage(){
            $.ajax({
                url: "/theme/getoid",
                async: false,
                success:(data)=>{
                    this.oid = data;
                }
            })
            this.changeRter(10);
        },

        subMenuDropDpwn(target,timerDrop,timerFold){
            let childrenCount=target.children('ul').children('li').length;
            // console.log(childrenCount);
            let timeLength=childrenCount*60;
            let height=childrenCount*45+5;
            // target.animate({height:height},timeLength,'swing');
            target.children('ul').animate({height:height},timeLength,'swing');
            // target.children('ul').animate({width:180},timeLength,'swing');
            // target.children('ul').children().css('display','block')
            let li=target.children('ul').children('li');
            clearTimeout(timerFold);

        },

        subMenuFoldUp(target,timerDrop,timerFold){
            let childrenCount=target.children('ul').children('li').length;
            let timeLength=childrenCount*40;

            // target.animate({height:0},timeLength,'linear');
            target.children('ul').animate({height:0},timeLength,'linear');
            // target.children('ul').animate({width:0},timeLength,'swing');
            let li=target.children('ul').children('li');
            // target.children('ul').children().css('display','none')
            clearTimeout(timerDrop);
            target.children('ul').children('#phoneLogin').css('height','0')
        }
    },

    created(){
        this.getUserInfo()
    },

    mounted(){
        let that = this;
        //let that= this;
        //用于判断用户是否收到消息
        $(document).ready(function () {
            // console.log(window.name);
            // that.message_num = window.name;
            $.ajax({
                url:"/theme/getedit",
                async:false,
                type:"GET",
                success:(json)=>{
                    console.log(json);
                    for (let i=0;i<json.length;i++) {
                        for (let k = 0; k < 4; k++) {
                            let type;
                            switch (k) {
                                case 0:
                                    type = json[i].subDetails;
                                    break;
                                case 1:
                                    type = json[i].subClassInfos;
                                    break;
                                case 2:
                                    type = json[i].subDataInfos;
                                    break;
                                case 3:
                                    type = json[i].subApplications;
                                    break;

                            }
                            if (type != null && type.length > 0) {
                                for (let j = 0; j < type.length; j++) {
                                    if (k == 0) {
                                        switch (type[j].status) {
                                            case "0":
                                                that.message_num++;
                                        }
                                    }else if (k == 1){
                                        switch (type[j].status) {
                                            case "0":
                                                that.message_num++;
                                        }

                                    }else if (k == 2){
                                        switch (type[j].status) {
                                            case "0":
                                                that.message_num++;
                                        }

                                    } else if (k == 3){
                                        switch (type[j].status) {
                                            case "0":
                                                that.message_num++;
                                        }

                                    }
                                }
                            }
                        }
                    }
                    $.ajax({
                        type: "GET",
                        url: "/version/getVersions",
                        data: {},
                        async: false,
                        success: (json) => {
                            //下面将type分到model、community中
                            //model：modelItem、conceptualModel、logicalModel、computableModel
                            // community：concept、spatialReference	、unit、template
                            for (let i=0;i<json.data.uncheck.length;i++){
                                if (json.data.uncheck[i].type == "modelItem" || json.data.uncheck[i].type == "conceptualModel"||json.data.uncheck[i].type == "logicalModel"||json.data.uncheck[i].type == "computableModel"){
                                    // this.model_tableData1.push(json.data.uncheck[i]);
                                    that.message_num++;
                                }else {
                                    // this.community_tableData1.push(json.data.uncheck[i]);
                                    that.message_num++;
                                }
                            }
                            if (that.message_num==0){
                                $(".el-badge__content").hide();
                            } else {
                                $(".el-badge__content").show();
                            }
                        }
                    })


                }
            })
        })

        $('#dropmu').click((e)=>{
            // clearTimeout(tFoldLmu);
            let target=$('#submenu');
            let height=target.children('ul').css('height');
            if (height=='0px'){
                target.css('display','block')
                this.subMenuDropDpwn(target);
            }

            else
                this.subMenuFoldUp(target);
            if(e.stopPropagation){
                e.stopPropagation();
            }else{
                e.cancelBubble = true;
            }
        })

        $('html').click((e)=>{
            if($(e.target).closest("#leftUl").length == 0){
                // clearTimeout(tFoldLmu);
                let target=$('#submenu');
                this.subMenuFoldUp(target);
            }
        })
    },

})