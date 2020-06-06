new Vue({
    el: '#userPage',

    components: {
        'avatar': VueAvatar.Avatar
    },
    data:
        function () {
            return {
                // showIndex控制model种类页面跳转
                showIndex: 1,
                // bodyIndex控制主要内容跳转
                bodyIndex: 1,
                researchIndex:1,
                barIndex:1,
                // blueIndex:1,
                // aaa:1,
                firstAuthor:'',
                secAuthor:'',
                activeIndex:'',
                activeName: 'Model Item',
                currentPage: 1,


                description:'',
                researchInterests:[],
                subjectAreas:[],

                pageOption:{
                    progressBar:true,
                    sortAsc:false,
                    currentPage:1,
                    pageSize:6,
                    pageCount:10,
                },

                userPersonalInfo:{
                    name:'',
                    description:'',
                    subjectAreas:'',
                    affiliation:{
                        name:'',
                        department:'',
                        position:'',
                        location: '',
                    },
                    researchInterests:[],
                    eduExperiences:[
                        {
                            institution:'',
                            department:'',
                            acaDegree:'',
                            startTime:'',
                            endTime:'',
                            location:''
                        }
                    ],
                    awdHonors:[
                        {
                            name:'',
                            awardAgency:'',
                            awardTime:''
                        }
                    ],
                    lab:{
                        name:'',
                        position:'',
                    },

                    phone:'',
                    email:'',
                    faceBook:'',
                    personPage:'',
                    weChat:''
                },

                modelItems:{
                    currentPage:1,
                    total:0,
                    result:[],
                },
                dataItems:{
                    currentPage:1,
                    total:0,
                    result:[],
                },
                conceptualModels:{
                    currentPage:1,
                    total:0,
                    result:[],
                },
                logicalModels:{
                    currentPage:1,
                    total:0,
                    result:[],
                },
                computableModels:{
                    currentPage:1,
                    total:0,
                    result:[],
                },

                concepts:{
                    currentPage:1,
                    total:0,
                    result:[{
                        createTime:'',
                    }],
                },

                spatials:{
                    currentPage:1,
                    total:0,
                    result:[],
                },

                templates:{
                    currentPage:1,
                    total:0,
                    result:[],
                },

                units:{
                    currentPage:1,
                    total:0,
                    result:[],
                },

                articles:{
                    currentPage:1,
                    total:0,
                    result:[{
                    }
                    ],
                },

                projects:{
                    projectName:'',
                    currentPage:1,
                    total:0,
                    result:[{
                    }],
                },

                conferences:{
                    title:'',
                    currentPage:1,
                    total:0,
                    result:[{
                    }],
                },

                newestArticle:{
                    result:[],
                },

                userLab:{
                    labInfo:[],
                    labMember:[],
                },

                articleToBack:{
                    title:'',
                    authors:[],
                    journal:'',
                    pageRange:'',
                    date:2019,
                    DOI:'',
                    // status:'',
                    link:'',
                },

                projectToBack:{
                    name:'',
                    startTime: '',
                    endTime:'',
                    role:'',
                    fundAgency: '',
                    amount: 1,
                },

                conferenceToBack: {
                    title: '',
                    theme: '',
                    role: '',
                    location: '',
                    startTime: '',
                    endTime: '',
                },

                eduExpAddToBack:{
                    institution:'',
                    department:'',
                    acaDegree:'',
                    startTime:'',
                    endTime:'',
                    location:''
                },

                awdhonrAddToBack:{
                    name:'',
                    awardAgency:'',
                    awardTime:''
                },

                awardandHonor:{
                    currentPage:1,
                    total:0,
                    result:[],
                },

                educationExperience:{
                    currentPage:1,
                    total:0,
                    result:[{
                        institution:'',
                        department:'',
                        acaDegree:'',
                        startTime:'',
                        endTime:'',
                        location:''
                    }
                    ],
                },

                affiliation:{
                    name:'',
                    department:'',
                    position:'',
                    location: '',
                },

                lab:{
                    name:'',
                    position:'',
                },

                eduExperience: {
                    institution:'',
                    department:'',
                    acaDegree:'',
                    startTime:'',
                    endTime:'',
                    location:''
                },

                awdHonor: {
                        name:'',
                        awardAgency:'',
                        awardTime:''
                    },

                searchText:'',

                addorEdit:'Add',

                editArticleDialog:false,

                showUploadArticleDialog:false,

                showUploadedArticleDialog:false,

                articleUploading:{
                    title:'',
                    authors:[],
                    journal:'',
                    pageRange:'',
                    date:2019,
                    doi:'',
                    status:'',
                    link:'',
                },

                space:[],

                editOid:'',

                clickCount:0,

                value1: '',

                isInSearch:0,

                resourceIndex:1,

                isAwdTimeDate:false,

                selectUserImgVisible:false,

                Identities:['Author','Learner'],

                checkedIdentity:[],

                doi:'',

                doiLoading:false,


            }
        },

    methods: {
        // handleClick(tab, event) {
        //     switch (tab.paneName) {
        //         case "Model Item":
        //             this.modelItems.currentPage=1;
        //             this.modelItemHandleCurrentChange(1);
        //             break;
        //         case "Data Item":
        //             this.dataItems.currentPage=1;
        //             this.dataItemHandleCurrentChange(1);
        //             break;
        //         case "Conceptual Model":
        //             this.conceptualModels.currentPage=1;
        //             this.conceptualModelHandleCurrentChange(1);
        //             break;
        //         case "Logical Model":
        //             this.logicalModels.currentPage=1;
        //             this.logicalModelHandleCurrentChange(1);
        //             break;
        //         case "Computable Model":
        //             this.computableModels.currentPage=1;
        //             this.computableModelHandleCurrentChange(1);
        //             break;
        //     }
        // },

        date2String(date){
            let year=date.getFullYear();
            let month=date.getMonth()+1;
            let day=date.getDate();
            if(day<10){
               day='0'+day;
            }
            if(month<10){
                month='0'+month;
            }
            console.log('month'+month)
            return month+'/'+day+'/'+year;
        },

        // 后台传过来的date型被转换成相同式样的String
        // 这里再改成yyyy/mm/dd
        dateString2String(date){
            let newDate=date.split('-');
            let newDay=newDate[2].split('T')[0];
            newDate=newDate[0]+'/'+newDate[1]+'/'+newDay;
            return newDate;
        },

        selectUserImg(){
            $('#editUserImg').modal('show');
            console.log($("#imgChange"))

        },



        imgUpload(){
            var file = $('#imgFile')[0].files;
            //创建用来读取此文件的对象
            var reader = new FileReader();
            //使用该对象读取file文件
            reader.readAsDataURL(file);
            //读取文件成功后执行的方法函数
            reader.onload = function (e) {
                //读取成功后返回的一个参数e，整个的一个进度事件
                //选择所要显示图片的img，要赋值给img的src就是e中target下result里面
                //的base64编码格式的地址
                $('#imgShowBig').get(0).src = e.target.result;
                $('#imgShowSmall').get(0).src = e.target.result;
                // $('#imgShow').show();
            }
        },



        modelItemClick() {
            this.bodyIndex=2;
            this.showIndex=1;
            this.resourceIndex=this.showIndex;
            this.isInSearch=0;
            this.modelItemHandleCurrentChange(1);
        },

        datalItemClick(){
            this.bodyIndex=2;
            this.showIndex=2;
            this.resourceIndex=this.showIndex;
            this.isInSearch=0;
            this.dataItemHandleCurrentChange(1);
        },

        conceptualModelClick(){
            this.bodyIndex=2;
            this.showIndex=3;
            this.resourceIndex=this.showIndex;
            this.isInSearch=0;
            this.conceptualModelHandleCurrentChange(1);

        },

        logicalModelClick: function () {
            this.bodyIndex=2;
            this.showIndex=4;
            this.resourceIndex=this.showIndex;
            this.isInSearch=0;
            this.logicalModelHandleCurrentChange(1);

            // console.log(this.logicalModels.result)
        },

        computableModelClick(){
            this.bodyIndex=2;
            this.showIndex=5;
            this.resourceIndex=this.showIndex;
            this.isInSearch=0;
            this.computableModelHandleCurrentChange(1);

            // console.log(this.computableModels.total)
        },

        conceptClick(){
            this.bodyIndex=2;
            this.showIndex=6;
            this.resourceIndex=this.showIndex;
            this.isInSearch=0;
            this.conceptHandleCurrentChange(1);
            $('html,body').animate({scrollTop: '230px'}, 220);
        },

        spatialClick(){
            this.bodyIndex=2;
            this.showIndex=7;
            this.resourceIndex=this.showIndex;
            this.isInSearch=0;
            this.spatialHandleCurrentChange(1);
            $('html,body').animate({scrollTop: '230px'}, 220);
        },

        templateClick(){
            this.bodyIndex=2;
            this.showIndex=8;
            this.resourceIndex=this.showIndex;
            this.isInSearch=0;
            this.templateHandleCurrentChange(1);
            $('html,body').animate({scrollTop: '230px'}, 220);
        },

        unitClick(){
            this.bodyIndex=2;
            this.showIndex=9;
            this.resourceIndex=this.showIndex;
            this.isInSearch=0;
            this.unitHandleCurrentChange(1);
            $('html,body').animate({scrollTop: '230px'}, 220);
        },

        // statsCardClick(index){
        //     this.bodyIndex=2;
        //     this.showIndex=index;
        // },

        articleClick(index){
            this.bodyIndex=3;
            this.researchIndex=index;
            this.isInSearch=0;
            $('html,body').animate({scrollTop: '0px'}, 220);
            this.articleHandleCurrentChange(1);
        },

        projectClick(index){
            this.bodyIndex=3;
            this.researchIndex=index;
            this.isInSearch=0;
            $('html,body').animate({scrollTop: '0px'}, 220);
            this.projectHandleCurrentChange(1);
        },

        conferenceClick(index){
            this.bodyIndex=3;
            this.researchIndex=index;
            this.isInSearch=0;
            $('html,body').animate({scrollTop: '0px'}, 220);
            this.conferenceHandleCurrentChange(1);
        },

        labClick(){
            this.bodyIndex=4;
            $('html,body').animate({scrollTop: '0px'}, 200);
        },

        menu_Click(index){
            this.bodyIndex=index;
            $('html,body').animate({scrollTop: '0px'}, 200);
            this.articleHandleCurrentChange(1);
            this.projectHandleCurrentChange(1);
            this.conferenceHandleCurrentChange(1);
        },

        moreDetails(height){
            this.bodyIndex=4;
            var height=+height+'px';
            console.log(height)
            $('html,body').animate({scrollTop: height}, 200);
        },

        // resource按钮单独做以每次都显示model item
        menu_Click_Resource(index){
            window.scroll(0,0);
            this.bodyIndex=index;
            this.showIndex=1;
        },

        editUserInfoClick(){
            $('#userDescription').val(this.userPersonalInfo.description);
            $("#userRIS").tagEditor("destroy");
            $('#userRIS').tagEditor({
                initialTags: this.userPersonalInfo.researchInterests,
                forceLowercase: false,
            });
            $('#userSubArea').val(this.userPersonalInfo.subjectAreas);
            $('#userAffInstituton').val(this.userPersonalInfo.affiliation.name);
            $('#userAffDepartment').val(this.userPersonalInfo.affiliation.department);
            $('#userAffPosition').val(this.userPersonalInfo.affiliation.position);
            $('#userAffLocation').val(this.userPersonalInfo.affiliation.location);

            $('#userLaboratory').val(this.userPersonalInfo.lab.name);
            if(this.userPersonalInfo.lab.position=="leader"){
                $("input[type='radio'][name='labPosition'][value='0']").attr("checked",true);
            }else if(this.userPersonalInfo.lab.position=="member"){
                $("input[type='radio'][name='labPosition'][value='1']").attr("checked",true);
            }
            // $("input[name='labPostion']:checked").val(this.userPersonalInfo.lab.position);
        },

        saveUserInfoClick(){
            this.description=$('#userDescription').val();
            console.log(this.description);
            var tags = $('#userRIS').tagEditor('getTags')[0].tags;
            for (i = 0; i < tags.length; i++) { $('#userRIS').tagEditor('removeTag', tags[i]); }
            this.researchInterests=tags;

            this.affiliation.name=$('#userAffInstituton').val();
            this.affiliation.department=$('#userAffDepartment').val();
            this.affiliation.position=$('#userAffPosition').val();
            this.affiliation.location=$('#userAffLocation').val();

            this.lab.name=$('userLabName').val();
            if ($("input[type='radio'][name='labPosition']:checked").val()=='0') {
                this.lab.position='leader';
            }
            else if($("input[type='radio'][name='labPosition']:checked").val()=='1'){
                this.lab.position='member';
            }

            this.descriptionAddToBack();
            this.researchInterestAddToBack();
            this.affiliationAddtoBack();
            // this.labAddtoBack();
            alert('Save success!')

            // $('#editUserInfo').attr('aria-hidden','true');
            // $('#editUserInfo').removeClass('fade in');
            // $('body').removeClass('modal-open');
            // $('#editUserInfo').addClass('fade');
            $("#editUserInfo").modal("hide")
            // $('.modal-backdrop').remove();
        },

        editPersonalIntroClick(){
            $('#userIntroDescription').val(this.userPersonalInfo.description);
            $("#userIntroRIS").tagEditor("destroy");
            $('#userIntroRIS').tagEditor({
                initialTags: this.userPersonalInfo.researchInterests,
                forceLowercase: false,
            });
            $("#userIntroSubArea").tagEditor("destroy");
            $('#userIntroSubArea').tagEditor({
                initialTags: this.userPersonalInfo.subjectAreas,
                forceLowercase: false,
            });
        },

        savePersonalIntroClick(){
            this.description=$('#userIntroDescription').val();
            console.log( this.description=$('#userIntroDescription').val())
            var tags = $('#userIntroRIS').tagEditor('getTags')[0].tags;
            for (i = 0; i < tags.length; i++) { $('#userRIS').tagEditor('removeTag', tags[i]); }
            this.researchInterests=tags;
            var tags = $('#userIntroSubArea').tagEditor('getTags')[0].tags;
            for (i = 0; i < tags.length; i++) { $('#userIntroSubArea').tagEditor('removeTag', tags[i]); }
            this.subjectAreas=tags;

            this.userInfoAddToBack();
            // this.descriptionAddToBack();
            // setTimeout(this.researchInterestAddToBack(),1)
            // setTimeout(this.subjectAreasAddtoBack(),5);

            alert('Save success!');
            $("#editUserIntro").modal("hide")
        },

        editAffiliationClick(){
            $('#userAffInstituton').val(this.userPersonalInfo.affiliation.name);
            $('#userAffDepartment').val(this.userPersonalInfo.affiliation.department);
            $('#userAffPosition').val(this.userPersonalInfo.affiliation.position);
            $('#userAffLocation').val(this.userPersonalInfo.affiliation.location);
        },

        addAffiliationClick(){

        },

        saveAffiliationClick(){
            this.affiliation.name=$('#userAffInstituton').val();
            this.affiliation.department=$('#userAffDepartment').val();
            this.affiliation.position=$('#userAffPosition').val();
            this.affiliation.location=$('#userAffLocation').val();
            if(this.affiliation.name.trim()=='')
                alert("Please insert you institution");
            else {
                this.affiliationAddtoBack();
                alert('Save success!');
                $("#editUserAffiliation").modal("hide")
            }

        },

        editLabClick(){
            $('#userLaboratory').val(this.userPersonalInfo.lab.name);
            if(this.userPersonalInfo.lab.position=="leader"){
                $("input[type='radio'][name='labPosition'][value='0']").attr("checked",true);
            }else if(this.userPersonalInfo.lab.position=="member"){
                $("input[type='radio'][name='labPosition'][value='1']").attr("checked",true);
            }
        },

        addLabClick(){

        },

        saveLabClick(){
            console.log($('#userLaboratory').val());
            this.userPersonalInfo.lab.name=$('#userLaboratory').val();
            if ($("input[type='radio'][name='labPosition']:checked").val()=='0') {
                this.userPersonalInfo.lab.position='leader';
            }
            else if($("input[type='radio'][name='labPosition']:checked").val()=='1'){
                this.userPersonalInfo.lab.position='member';
            }
            if(this.userPersonalInfo.lab.name==''||this.userPersonalInfo.lab.position==''){
                alert('Please insert your lab name')
            }
            else {
                this.labAddtoBack();
                alert('Save success!');
                $("#editUserLab").modal("hide")
            }

        },

        addEduXpceClick(){
            $('#userEduInstitution').val('');
            $('#userEduDepartment').val('');
            $('#userEduAcaDegree').val('');
            $('#userEduStartTime').val('');
            $('#userEduEndTime').val('');
            $('#userEduLocation').val('');
        },

        saveEduExperience(){
            this.eduExpAddToBack.institution=$('#userEduInstitution').val();
            this.eduExpAddToBack.department=$('#userEduDepartment').val();
            this.eduExpAddToBack.acaDegree=$('#userEduAcaDegree').val();
            this.eduExpAddToBack.startTime=new Date($('#userEduStartTime').val());
            this.eduExpAddToBack.endTime=new Date($('#userEduEndTime').val());
            this.eduExpAddToBack.location=$('#userEduLocation').val();
            console.log(this.eduExpAddToBack);

            this.eduExperienceAddtoBack();
        },

        saveAwdHonor(){
            this.awdHonor.name=$('#userAwdName').val();
            this.awdHonor.awardAgency=$('#userAwdAgency').val();
            this.awdHonor.awardTime=new Date($('#userAwdTime').val());

            console.log(this.awdHonor);
            this.awdHonorAddtoBack();
        },

        addDescriptionClick(){
            $('#addDescriptionButton').css('display','none');
            $('#descriptionInputContainer').css({display:'block'});
            $('#descriptionInput').animate({width:'87%'},500);
        },


        editDescriptionClick(){
            $('#descriptionDetail').css({display:'none'});
            $('#editDescriptionButton').css({display:'none'});
            $('#descriptionInputContainer').css({display:'block'});
            $('#descriptionInput').val(this.userPersonalInfo.description);
            $('#descriptionInput').animate({width:'90.7%'},500);
        },

        descriptionConfirm(){

            if($('#descriptionInput').val()=='')
                alert("Please input at least one word")
            else{
                this.description=$('#descriptionInput').val();

                console.log(this.description);
                $('#descriptionDetail').css({display:'block'});
                $('#editDescriptionButton').css({display:'flex'});
                this.descriptionAddToBack();
                $('#descriptionInputContainer').css({display:'none'});
            }


        },


        addResearchInterestClick(){
            $('#addResearchInterestButton').css('display','none');
            $('#researchInterestInputContainer').css({display:'block'});
            $('#researchInterestConfirm').css({display:'block'});
            // $('#researchInterestInputContainer').animate({width:'65%'},500);
        },

        editResearchInterestClick(){
            $('#researchInterestDetail').css({display:'none'});
            $('#editResearchInterestButton').css({display:'none'});
            $('#researchInterestInputContainer').css({display:'block'});
            $('#researchInterestConfirm').css({display:'block'});
            // $('#researchInterestInput').val(this.userPersonalInfo.researchInterests);
            $("#researchInterestInput").tagEditor("destroy");
            $('#researchInterestInput').tagEditor({
                initialTags: this.userPersonalInfo.researchInterests,
                forceLowercase: false,
            });

        },

        researchInterestConfirm(){
            $('#researchInterestInputContainer').css({display:'none'});
            $('#researchInterestConfirm').css({display:'none'});
            // this.researchInterest=$('#researchInterestInput').val();
            var tags = $('#researchInterestInput').tagEditor('getTags')[0].tags;
            for (i = 0; i < tags.length; i++) { $('#researchInterestInput').tagEditor('removeTag', tags[i]); }
            this.researchInterests=tags;
            $('#researchInterestDetail').css({display:'block'});
            $('#editResearchInterestButton').css({display:'flex'});
            this.researchInterestAddToBack();

        },

        editContactClick(){
            $('#userPhone').val(this.userPersonalInfo.phone);
            $('#userEmail').val(this.userPersonalInfo.email);
            $('#userWeChat').val(this.userPersonalInfo.weChat);
            $('#userFacebook').val(this.userPersonalInfo.faceBook);
            $('#userPersonPage').val(this.userPersonalInfo.personPage);
        },

        saveContactClick(){
           this.userPersonalInfo.phone=$('#userPhone').val();
           this.userPersonalInfo.email=$('#userEmail').val();
           this.userPersonalInfo.weChat=$('#userWeChat').val();
           this.userPersonalInfo.faceBook=$('#userFacebook').val();
           this.userPersonalInfo.personPage=$('#userPersonPage').val();

           this.contactAddToBack();
        },

        sectionDisplayControl(){

        },

        getUserInfo(){
            let hrefs = window.location.href.split("/");
            $.ajax({
                data:{oid:hrefs[hrefs.length-1]},
                type:'GET',
                url:'/user/getUserInfoInUserPage',
                async:true,
                success:(json) => {
                    if(json.code==0){
                        const data = json.data;
                        setTimeout(() => {
                            this.userPersonalInfo = data.userInfo;
                            console.log(this.userPersonalInfo)
                        }, 0);
                    } else {
                        console.log("UserInfo get wrong.")
                    }
                }

            })
        },


        modelItemHandleCurrentChange: function (val) {
            // console.log(this.modelItems.currentPage);
            this.pageOption.currentPage = val;
            // console.log(this.modelItems.currentPage);
            $('html,body').animate({scrollTop: '0px'}, 220);
            const hrefs = window.location.href.split("/");
            $.ajax({
                type: "GET",
                url: "/modelItem/listByUserOid",
                data: {
                    page: this.pageOption.currentPage - 1,
                    asc: this.pageOption.sortAsc,
                    pageSize: this.pageOption.pageSize,
                    sortElement:'viewCount',
                    oid: hrefs[hrefs.length - 1],
                },
                async: true,
                success:(json) => {

                    if (json.code == 0) {
                        const data = json.data;

                        setTimeout(() => {

                            this.modelItems.total = data.total;
                            this.modelItems.result = data.list;
                            this.pageOption.progressBar = false;

                        }, 500);
                    } else {
                        console.log("search model item failed.")
                    }
                }
            })

        },

        dataItemHandleCurrentChange: function (val) {
            this.pageOption.currentPage = val;
            $('html,body').animate({scrollTop: '0px'}, 220);
            const hrefs = window.location.href.split("/");
            $.ajax({
                type: "GET",
                url: "/dataItem/searchByNameByOid",
                data:{
                    page: this.pageOption.currentPage-1,
                    asc: this.pageOption.sortAsc,
                    pageSize: 6,
                    oid: hrefs[hrefs.length - 1],
                    sortElement:'viewCount',
                    searchText:'',
                } ,
                async: true,
                success: (json) => {

                    if (json.code == 0) {
                        const data = json.data;

                        setTimeout(() => {


                            this.dataItems.total = data.total;
                            this.dataItems.result = data.list;
                            this.pageOption.progressBar = false;

                        }, 500);
                    } else {
                        console.log("search data item failed.")
                    }
                }
            })
        },

        conceptualModelHandleCurrentChange: function (val) {
            this.pageOption.currentPage = val;
            $('html,body').animate({scrollTop: '0px'}, 220);
            const hrefs = window.location.href.split("/");
            $.ajax({
                type: "GET",
                url: "/conceptualModel/listByUserOid",
                data: {
                    page: this.pageOption.currentPage - 1,
                    asc: this.pageOption.sortAsc,
                    pageSize: this.pageOption.pageSize,
                    oid: hrefs[hrefs.length - 1],
                },
                async: true,
                success: (json) => {

                    if (json.code == 0) {
                        const data = json.data;

                        setTimeout(() => {

                            this.conceptualModels.total = data.total;
                            this.conceptualModels.result = data.list;
                            this.pageOption.progressBar = false;

                        }, 500);
                    } else {
                        console.log("search conceptual model failed.")
                    }
                }
            })
        },

        logicalModelHandleCurrentChange: function (val) {
            this.pageOption.currentPage = val;
            $('html,body').animate({scrollTop: '0px'}, 220);

            const hrefs = window.location.href.split("/");
            $.ajax({
                type: "GET",
                url: "/logicalModel/listByUserOid",
                data: {
                    page: this.pageOption.currentPage - 1,
                    asc: this.pageOption.sortAsc,
                    pageSize: this.pageOption.pageSize,
                    oid: hrefs[hrefs.length - 1],
                },
                async: true,
                success: (json) => {

                    if (json.code == 0) {
                        const data = json.data;

                        setTimeout(() => {

                            this.logicalModels.total = data.total;
                            this.logicalModels.result = data.list;
                            this.pageOption.progressBar = false;
                            }, 500);
                    } else {
                        console.log("search logical model failed.")
                    }
                }
            })
        },

        computableModelHandleCurrentChange: function (val) {
            this.pageOption.currentPage = val;
            $('html,body').animate({scrollTop: '0px'}, 220);
            const hrefs = window.location.href.split("/");
            $.ajax({
                type: "GET",
                url: "/computableModel/listByUserOid",
                data: {
                    page: this.pageOption.currentPage - 1,
                    asc: this.pageOption.sortAsc,
                    pageSize: this.pageOption.pageSize,
                    oid: hrefs[hrefs.length - 1],
                },
                async: true,
                success: (json) => {

                    if (json.code == 0) {
                        const data = json.data;
                        // console.log(data.list);
                        if(data.list.length!=0)
                            setTimeout(() => {

                                this.computableModels.total = data.total;
                                this.computableModels.result = data.list;
                                this.pageOption.progressBar = false;
                                }, 500);
                    } else {
                        console.log("search computable model failed.")
                    }
                }
            })
        },

        conceptHandleCurrentChange(val){
            this.pageOption.currentPage = val;
            const hrefs = window.location.href.split("/");
            let name='concepts';
            $.ajax({
                type: "Get",
                url: "/concept/listConceptsByUserOid",
                data: {
                    page: this.pageOption.currentPage - 1,
                    asc: this.pageOption.sortAsc,
                    sortElement:"createTime",
                    pageSize: this.pageOption.pageSize,
                    oid: hrefs[hrefs.length - 1],
                },
                cache: false,
                async: true,

                xhrFields:{
                    withCredentials:true
                },
                crossDomain: true,
                success: (json) => {
                    if (json.code != 0) {
                        alert("Please login first!");
                        window.location.href = "/user/login";
                    } else {
                        const data = json.data;
                        if (data.count > 0) {
                            setTimeout(() => {
                                this.concepts.total = data.count;
                                this.searchCount = Number.parseInt(data["count"]);
                                this.concepts.result = data[name];
                                this.pageOption.progressBar = false;
                            }, 200)
                            // console.log(this.pageOption.currentPage);
                        } else {
                            // console.log("search concept failed.")

                        }
                    }
                }
            })
        },

        spatialHandleCurrentChange(val){
            this.pageOption.currentPage = val;
            const hrefs = window.location.href.split("/");
            var url = "/spatial/listSpatialsByOid";
            var name = "spatials";

            $.ajax({
                type: "Get",
                url: url,
                data: {
                    page: this.pageOption.currentPage - 1,
                    asc: this.pageOption.sortAsc,
                    sortElement:"createTime",
                    pageSize: this.pageOption.pageSize,
                    oid: hrefs[hrefs.length - 1],
                },
                cache: false,
                async: true,

                xhrFields:{
                    withCredentials:true
                },
                crossDomain: true,
                success: (json) => {
                    if (json.code != 0) {
                        alert("Please login first!");
                        window.location.href = "/user/login";
                    }else {
                        const data = json.data;
                        if(data[name].length>0){
                            setTimeout(()=>{
                                const data = json.data;
                                this.spatials.total= data.count;
                                this.searchCount = Number.parseInt(data["count"]);
                                this.spatials.result = data[name];
                                this.pageOption.progressBar = false;
                            },200)
                            // console.log(this.pageOption.currentPage);
                        }else {
                            // console.log("search spatial failed.")
                        }
                    }
                }
            })
        },

        templateHandleCurrentChange(val){
            this.pageOption.currentPage = val;
            const hrefs = window.location.href.split("/");
            var url = "/template/listTemplatesByOid";
            var name = "templates";

            $.ajax({
                type: "Get",
                url: url,
                data: {
                    page: this.pageOption.currentPage - 1,
                    asc: this.pageOption.sortAsc,
                    sortElement:"createTime",
                    pageSize: this.pageOption.pageSize,
                    oid: hrefs[hrefs.length - 1],
                },
                cache: false,
                async: true,

                xhrFields:{
                    withCredentials:true
                },
                crossDomain: true,
                success: (json) => {
                    if (json.code != 0) {
                        alert("Please login first!");
                        window.location.href = "/user/login";
                    }else {
                        const data = json.data;
                        if(data[name].length>0){
                            setTimeout(()=>{
                                const data = json.data;
                                this.templates.total= data.count;
                                this.searchCount = Number.parseInt(data["count"]);
                                this.templates.result = data[name];
                                this.pageOption.progressBar = false;
                            },200)

                        }else {
                            // console.log("search template failed.")
                        }
                    }
                }
            })
        },

        unitHandleCurrentChange(val){
            this.pageOption.currentPage = val;
            const hrefs = window.location.href.split("/");
            var url = "/unit/listUnitsByOid";
            var name = "units";

            $.ajax({
                type: "Get",
                url: url,
                data: {
                    page: this.pageOption.currentPage - 1,
                    asc: this.pageOption.sortAsc,
                    sortElement:"createTime",
                    pageSize: this.pageOption.pageSize,
                    oid: hrefs[hrefs.length - 1],
                },
                cache: false,
                async: true,

                xhrFields:{
                    withCredentials:true
                },
                crossDomain: true,
                success: (json) => {
                    if (json.code != 0) {
                        alert("Please login first!");
                        window.location.href = "/user/login";
                    }else {
                        const data = json.data;
                        if(data[name].length>0){
                            setTimeout(()=>{
                                const data = json.data;
                                this.units.total= data.count;
                                this.searchCount = Number.parseInt(data["count"]);
                                this.units.result = data[name];
                                this.pageOption.progressBar = false;
                            },200)

                        }else {
                            // console.log("search unit failed.")
                        }
                    }
                }
            })
        },

        resourceHandleCurrentChange(val){
            this.pageOption.currentPage=val;
            switch (this.resourceIndex) {
                case 1:
                    if (this.isInSearch==0){
                        this.modelItemHandleCurrentChange(this.pageOption.currentPage);
                    }
                    else this.searchResource();
                    break;
                case 2:
                    if (this.isInSearch==0)
                        this.dataItemHandleCurrentChange(this.pageOption.currentPage);
                    else this.searchResource();
                    break;
                case 3:
                    if (this.isInSearch==0)
                        this.conceptualModelHandleCurrentChange(this.pageOption.currentPage);
                    else this.searchResource();
                    break;
                case 4:
                    if (this.isInSearch==0)
                        this.logicalModelHandleCurrentChange(this.pageOption.currentPage);
                    else this.searchResource();
                    break;
                case 5:
                    if (this.isInSearch==0)
                        this.computableModelHandleCurrentChange(this.pageOption.currentPage);
                    else this.searchResource();
                    break;
                case 6:
                    if (this.isInSearch==0){
                        // console.log(this.pageOption.currentPage);
                        this.conceptHandleCurrentChange(this.pageOption.currentPage);
                    }
                    else this.searchResource();
                    break;
                case 7:
                    if (this.isInSearch==0)
                        this.spatialHandleCurrentChange(this.pageOption.currentPage);
                    else this.searchResource();
                    break;
                case 8:
                    if (this.isInSearch==0)
                        this.templateHandleCurrentChange(this.pageOption.currentPage);
                    else this.searchResource();
                    break;
                case 9:
                    if (this.isInSearch==0)
                        this.unitHandleCurrentChange(this.pageOption.currentPage);
                    else this.searchResource();
                    break;


            }

        },


        articleHandleCurrentChange: function (val) {
            this.pageOption.currentPage=val;
            this.barIndex=1;
            const hrefs=window.location.href.split('/');
            $.ajax({
                type:"GET",
                url:"/user/listArticle",
                data:{
                    page:this.pageOption.currentPage-1,
                    oid:hrefs[hrefs.length - 1],
                },
                async:true,
                success: (json)=>{

                    if (json.code == 0) {
                        const data=json.data;
                        setTimeout(() => {

                            this.articles.total=data.total;
                            this.articles.result=data.list;
                            this.pageOption.progressBar=false;
                        }, 500);
                    } else {
                        console.log("search computable model failed.")
                    }

                }

            })

        },

        projectHandleCurrentChange: function (val) {
            this.pageOption.currentPage=val;
            const hrefs=window.location.href.split('/');
            $.ajax({
                type:"GET",
                url:"/project/listByUserOid",
                data:{
                    page:this.pageOption.currentPage-1,
                    pageSize:this.pageOption.pageSize,
                    asc:this.projects.sortAsc,
                    sortElement:"creatDate",
                    oid:hrefs[hrefs.length - 1],
                },
                async:true,
                success: (json)=>{

                    if (json.code == 0) {
                        const data=json.data;
                        setTimeout(() => {

                            this.projects.total=data.total;
                            this.projects.result=data.list;
                            this.pageOption.progressBar=false;

                        }, 500);
                    } else {
                        console.log("search computable model failed.")
                    }

                }

            })

        },

        conferenceHandleCurrentChange(val) {
            this.pageOption.currentPage=val;
            const hrefs=window.location.href.split("/");
            $.ajax({
                type:"GET",
                url:"/conference/listByUserOid",
                data:{
                    page:this.pageOption.currentPage-1,
                    asc: this.pageOption.sortAsc,
                    pageSize: this.pageOption.pageSize,
                    sortElement:"creatDate",
                    oid:hrefs[hrefs.length-1],
                },
                async:true,
                success:(json)=>{
                    if(json.code==0){
                        const data=json.data;
                        setTimeout(
                            ()=>{
                                this.conferences.total=data.total;
                                this.conferences.result=data.list;
                                this.pageOption.progressBar=false;
                            },500)
                    }else{
                        console.log("search data item failed.")
                    }
                }
            })

        },

        researchHandleCurrentChange(val){
            this.pageOption.currentPage=val;
            switch (this.researchIndex) {
                case 1:
                    if(this.isInSearch==0)
                        this.articleHandleCurrentChange(this.pageOption.currentPage);
                    else this.searchArticles();
                    break;
                case 2:
                    if(this.isInSearch==0)
                        this.projectHandleCurrentChange(this.pageOption.currentPage);
                    else this.searchProjects();
                    break;
                case 3:
                    if(this.isInSearch==0)
                        this.conferenceHandleCurrentChange(this.pageOption.currentPage);
                    else this.searchConferences();
                    break;

            }

        },

        articleNewestLoad(){
            const hrefs=window.location.href.split('/');
            $.ajax({
                data:{
                    page:0,
                    pageSize:1,
                    asc:false,
                    oid:hrefs[hrefs.length-1],
                },
                type:"GET",
                url:"/article/findNewest",
                async:true,
                success: (json)=>{
                    if(json.code==0){
                        const data=json.data;
                        setTimeout(
                            ()=>{
                                // this.newestArticle.total=data.total;
                                this.newestArticle.result=data.list;
                                this.pageOption.progressBar=false;
                            },500)
                        // console.log(this.newestArticle);
                    }else{
                        console.log("search data item failed.")
                    }
                }

            })
        },

        addAwdHonorClick(){

        },

        awdTimeClick(){
            $('.panel').animate({height:'480px'},200);
        },

        awdfoldClick(){
            this.clickCount++;
            if(this.clickCount%2==0)
                $('.panel').animate({height:'280px'},200);
        },

        awardandHonorLoad(val) {
            this.awardandHonor.currentPage=val;
            // $('html,body').animate({scrollTop: '0px'}, 220);
            const hrefs=window.location.href.split("/");
            $.ajax({
                type:"GET",
                url:"/awardandHonor/listByUserOid",
                data:{
                    page:this.awardandHonor.currentPage-1,
                    asc: this.pageOption.sortAsc,
                    sortElement:'awardTime',
                    pageSize: 3,
                    oid:hrefs[hrefs.length-1],
                },
                async:true,
                success:(json)=>{
                    if(json.code==0){
                        const data=json.data;
                        if (data.total>0)
                        {
                            setTimeout(
                                ()=>{
                                    this.awardandHonor.total=data.total;
                                    this.awardandHonor.result=data.list;
                                    this.pageOption.progressBar=false;
                                    // console.log(this.awardandHonor.result)
                                },500)
                        } else{
                            this.awardandHonor.total=data.total;

                        }

                    }else{
                        console.log("search data item failed.")
                    }
                }
            })

        },

        educationExperienceLoad(val) {
            this.educationExperience.currentPage=val;
            // $('html,body').animate({scrollTop: '0px'}, 220);
            const hrefs=window.location.href.split("/");
            $.ajax({
                type:"GET",
                url:"/educationExperience/listByUserOid",
                data:{
                    page:this.educationExperience.currentPage-1,
                    asc: this.pageOption.sortAsc,
                    pageSize: 3,
                    sortElement:'endTime',
                    oid:hrefs[hrefs.length-1],
                },
                async:true,
                success:(json)=>{
                    if(json.code==0){
                        const data=json.data;
                        if (data.total>0)
                            setTimeout(
                            ()=>{
                                this.educationExperience.total=data.total;
                                this.educationExperience.result=data.list;
                                // for(let i=0;i<this.educationExperience.total;i++){
                                //     if(this.educationExperience.result[i].startTime)
                                //         this.educationExperience.result[i].startTime=this.dateString2String(this.educationExperience.result[i].startTime);
                                //     if (this.educationExperience.result[i].endTime)
                                //         this.educationExperience.result[i].endTime=this.dateString2String(this.educationExperience.result[i].endTime);
                                // }
                                this.pageOption.progressBar=false;
                                // console.log(this.educationExperience);
                            },500)
                        else{
                            this.educationExperience.total=data.total;
                        }
                    }else{
                        console.log("search data item failed.")
                    }
                }
            })

        },

        labLoad(){
            const hrefs=window.location.href.split('/');
            var oid=hrefs[hrefs.length-1];

            $.ajax({
                data:{
                    oid:oid
                },
                type:"GET",
                url: "/lab/findByName",
                async:true,
                success:(json)=>{
                    if(json.code==0){
                        const data=json.data;
                        setTimeout(
                            ()=>{
                                this.userLab.labInfo=data.lab;
                                // this.userLab.leader=data.labLeader;
                                this.userLab.members=data.labMembers;
                                // this.pageOption.progressBar=false;
                                // console.log(this.userLab.leader);
                            },200)
                    }else{
                        console.log("search data item failed.")
                    }
                }
            })
        },

        addArticleClick(){
            this.editArticleDialog = true;
            this.addorEdit='Add';
            $("#articleTitle").val('');

            if ($("#articleAuthor").nextAll().length == 0)//如果不存在tageditor,则创建一个
                Vue.nextTick(() => {
                    $("#articleAuthor").tagEditor({
                        forceLowercase: false
                    })
                })

            $('#articleAuthor').tagEditor('destroy');
            $('#articleAuthor').tagEditor({
                initialTags:  [''],
                forceLowercase: false,
            });
            $("#articleJournal").val('');
            $("#articlePageRange").val('');
            $("#articleDate").val('');
            $("#articleLink").val('');

            this.doi ='';
        },

        changeChecked(){
            if(this.checkedIdentity.length>1)
                this.checkedIdentity.splice(0,1)
        },

        editArticleClick(key,oid){
            this.editArticleDialog = true;
            this.addorEdit='Edit';
            this.editOid=oid;
            Vue.nextTick(()=>{
                $("#articleTitle").val(this.articles.result[key].title);
                $("#articleJournal").val(this.articles.result[key].journal);
                $("#articlePageRange").val(this.articles.result[key].pageRange);
                $("#articleDate").val(this.articles.result[key].date);
                $("#articleLink").val(this.articles.result[key].link);
                if ($("#articleAuthor").nextAll().length == 0) {//如果不存在tageditor,则创建一个
                    Vue.nextTick(() => {
                        $("#articleAuthor").tagEditor({
                            forceLowercase: false
                        })
                        $('#articleAuthor').tagEditor('destroy');
                        $('#articleAuthor').tagEditor({
                            initialTags: this.articles.result[key].authors,
                            forceLowercase: false,
                        });

                    })
                }else{
                    $('#articleAuthor').tagEditor('destroy');
                    $('#articleAuthor').tagEditor({
                        initialTags: this.articles.result[key].authors,
                        forceLowercase: false,
                    });
                }

            })

        },

        updateArticleConfirmClick(){
            // console.log(this.articleToBack);
            if(this.addorEdit=='Add'){
                if ($(".nav.nav-tabs").eq(0).children()[0].className == "active"){
                    this.articleAddtoBackManual()
                }else{
                    this.articleAddToBack();
                }

            }
            else if(this.addorEdit=='Edit'){
                this.editArticle();
            }
            $('#articleInfo').modal('hide')
        },

        addProjectClick(){
            this.addorEdit='Add';
            $("#projectName").val('');
            $('#startTime').tagEditor('destroy');
            $("#endTime").val('');
            $("#role").val('');
            $("#fundAgency").val('');
            $("#amount").val('');
        },

        editProjectClick(key,oid){
            this.editOid=oid;
            this.addorEdit='Edit';
            $("#projectName").val(this.projects.result[key].projectName);
            $("#userProjectStartTime").val(this.projects.result[key].startTime);
            $("#userProjectEndTime").val(this.projects.result[key].endTime);
            $("#role").val(this.projects.result[key].role);
            $("#fundAgency").val(this.projects.result[key].fundAgency);
            $("#amount").val(this.projects.result[key].amount);
        },

        updateProjectConfirmClick(){
            this.projectToBack.name=$("#projectName").val();
            this.projectToBack.startTime=$("#userProjectStartTime").val();
            this.projectToBack.endTime=$("#userProjectEndTime").val();
            this.projectToBack.role=$("#role").val();
            this.projectToBack.fundAgency=$("#fundAgency").val();
            this.projectToBack.amount=$("#amount").val();
            if(this.addorEdit=='Add'){
                this.ProjectAddToBack();
            }
            else if(this.addorEdit=='Edit'){
                this.editProject();
            }
            $('#projectInfo').modal('hide')
        },

        addConferenceClick(){
            this.addorEdit='Add';
            $("#conferenceTitle").val('');
            $("#theme").val('');
            $("#conferStartTime").val('');
            $("#conferEndTime").val('');
            $("#conferenceLocation").val('');
            $("#conferenceRole").val('');
        },

        editConferenceClick(key,oid){
            this.editOid=oid;
            this.addorEdit='Edit';
            $("#conferenceTitle").val(this.conferences.result[key].title);
            $("#theme").val(this.conferences.result[key].theme);
            $("#userConferStartTime").val(this.conferences.result[key].startTime);
            $("#userConferEndTime").val(this.conferences.result[key].endTime);
            $("#conferenceLocation").val(this.conferences.result[key].location);
            $("#conferenceRole").val(this.conferences.result[key].role);
        },

        updateConferenceConfirmClick(){
            this.conferenceToBack.title=$("#conferenceTitle").val();
            this.conferenceToBack.startTime=$("#userConferStartTime").val();
            this.conferenceToBack.endTime=$("#userConferEndTime").val();
            this.conferenceToBack.role=$("#conferenceRole").val();
            this.conferenceToBack.theme=$("#theme").val();
            this.conferenceToBack.role=$("#conferenceRole").val();
            // console.log(this.conferenceToBack)
            if(this.addorEdit=='Add'){
                this.ConferenceAddToBack();
            }
            else if(this.addorEdit=='Edit'){
                this.editConference();
            }
            $('#conferenceInfo').modal('hide')
        },

        // searchArticlesClick(){
        //     ++this.clickCount;
        //     if (this.clickCount%2==1){
        //         $('#articleSearchContainer').css('display','flex');
        //         $('#searchArticle').animate({width:'88%'},500);
        //         $('.searchInput').val('');
        //     }
        //     if (this.clickCount%2==0){
        //         $('#searchArticle').animate({width:'0'},500);
        //         setTimeout(()=>{
        //             console.log('aaaddd');
        //             $('#articleSearchContainer').css('display','none');
        //             },500);
        //
        //     }
        //
        // },

        searchProjectsClick(){
            ++this.clickCount;
            if (this.clickCount%2==1){
                $('#projectSearchContainer').css('display','flex');
                $('#searchProject').animate({width:'88%'},500);
                $('.searchInput').val('');
            }
            if (this.clickCount%2==0){
                $('#searchProject').animate({width:'0'},500);
                setTimeout(()=>{
                    $('#projectSearchContainer').css('display','none');
                },500);

            }

        },

        searchConferencesClick(){
            ++this.clickCount;
            if (this.clickCount%2==1){
                $('#conferenceSearchContainer').css('display','flex');
                $('#searchConference').animate({width:'88%'},500);
                $('.searchInput').val('');
            }
            if (this.clickCount%2==0){
                $('#searchConference').animate({width:'0'},500);
                setTimeout(()=>{
                    $('#conferenceSearchContainer').css('display','none');
                },500);

            }

        },


        searchResearchClick(index){

            this.pageOption.currentPage=1;
            this.isInSearch=1;
            if (index==1){
                this.searchText=$('#searchArticle').val();
                this.searchArticles();
            }

            if (index==2){
                this.searchText=$('#searchProject').val();
                this.searchProjects();
            }
            if (index==3){
                this.searchText=$('#searchConference').val();
                this.searchConferences();
            }

        },

        searchResourceClick(index){
            this.pageOption.currentPage=1;
            this.resourceIndex=index;
            this.isInSearch=1;
            switch (index) {
                case 1:
                    this.searchText=$('#searchModel').val();
                    break;
                case 2:
                    this.searchText=$('#searchData').val();
                    break;
                case 3:
                    this.searchText=$('#searchConceptualModel').val();
                    break;
                case 4:
                    this.searchText=$('#searchLogicalModel').val();
                    break;
                case 5:
                    this.searchText=$('#searchComputableModel').val();
                    break;
                case 6:
                    this.searchText=$('#searchConcept').val();
                    break;
                case 7:
                    this.searchText=$('#searchSpatial').val();
                    break;
                case 8:
                    this.searchText=$('#searchTemplate').val();
                    break;
                case 9:
                    this.searchText=$('#searchUnit').val();
                    break;
            }
            this.searchResource();

        },

        searchResource(){
            $('html,body').animate({scrollTop:'0px'},200);
            var urls={
                1:'/modelItem/searchByNameByOid',
                2:'/dataItem/searchByNameByOid',
                3:'/conceptualModel/searchByNameByOid',
                4:'/logicalModel/searchByNameByOid',
                5:'/computableModel/searchByNameByOid',
                6:'/concept/searchByNameByOid',
                7:'/spatial/searchByNameByOid',
                8:'/template/searchByNameByOid',
                9:'/unit/searchByNameByOid',
            }
            let hrefs = window.location.href.split("/");
            $.ajax({
                type:"GET",
                url:urls[this.resourceIndex],
                data:{
                    page:this.pageOption.currentPage-1,
                    pageSize:this.pageOption.pageSize,
                    asc:this.pageOption.sortAsc,
                    sortElement:"viewCount",
                    searchText:this.searchText,
                    oid:hrefs[hrefs.length-1]
                },
                cache: false,
                async: true,
                // dataType: "json",
                xhrFields:{
                    withCredentials:true
                },
                success:(json)=>{
                    if (json.code != 0) {
                        alert("Please login first!");
                        window.location.href = "/user/login";
                    }else {
                        const data = json.data;
                        // this.articles.total=data.total;
                        // this.articles.result=data.list;
                        switch (this.resourceIndex) {
                            case 1:
                                Vue.set(this.modelItems ,'total', data.total);
                                Vue.set(this.modelItems ,'result', data.list);
                                this.pageOption.progressBar=false;
                                break;
                            case 2:
                                Vue.set(this.dataItems ,'total', data.total);
                                Vue.set(this.dataItems ,'result', data.list);
                                this.pageOption.progressBar=false;
                                break;
                            case 3:
                                Vue.set(this.conceptualModels ,'total', data.total);
                                Vue.set(this.conceptualModels,'result', data.list);
                                this.pageOption.progressBar=false;
                                break;
                            case 4:
                                Vue.set(this.logicalModels,'total', data.total);
                                Vue.set(this.logicalModels,'result', data.list);
                                this.pageOption.progressBar=false;
                                break;
                            case 5:
                                Vue.set(this.computableModels ,'total', data.total);
                                Vue.set(this.computableModels,'result', data.list);
                                this.pageOption.progressBar=false;
                                break;
                            case 6:
                                Vue.set(this.concepts,'total', data.total);
                                Vue.set(this.concepts,'result', data.list);
                                this.pageOption.progressBar=false;
                                break;
                            case 7:
                                Vue.set(this.spatials ,'total', data.total);
                                Vue.set(this.spatials,'result', data.list);
                                this.pageOption.progressBar=false;
                                break;
                            case 8:
                                Vue.set(this.templates ,'total', data.total);
                                Vue.set(this.templates,'result', data.list);
                                this.pageOption.progressBar=false;
                                break;
                            case 9:
                                Vue.set(this.units ,'total', data.total);
                                Vue.set(this.units,'result', data.list);
                                this.pageOption.progressBar=false;
                                break;

                        }
                    }
                }

            })

        },

        searchArticles(){
            // var urls={
            //     1:"/article/searchByTitle",
            //     2:"/project/searchByName",
            //     3:"/conference/searchByTitle",
            // }
            // var url=urls[this.researchIndex];
            let hrefs = window.location.href.split("/");
            $.ajax({
                type:"GET",
                url:"/article/searchUserArticleByTitle",
                data:{
                    page:this.pageOption.currentPage-1,
                    searchText:this.searchText,
                    oid:hrefs[hrefs.length-1]
                },
                cache: false,
                async: true,
                // dataType: "json",
                xhrFields:{
                    withCredentials:true
                },
                success:(json)=>{
                    if (json.code != 0) {
                        alert("Please login first!");
                        window.location.href = "/user/login";
                    }else {
                        const data = json.data;
                        // this.articles.total=data.total;
                        // this.articles.result=data.list;
                        // Vue.set(this.articles ,'total', data.total);
                        Vue.set(this.articles ,'result', data.list);
                        this.pageOption.progressBar=false;
                        // console.log(data);

                        }
                }

            })
        },

        searchProjects(){
            // var urls={
            //     1:"/article/searchByTitle",
            //     2:"/project/searchByName",
            //     3:"/conference/searchByTitle",
            // }
            // var url=urls[this.researchIndex];
            let hrefs = window.location.href.split("/");
            $.ajax({
                type:"GET",
                url:"/project/searchByNameByOid",
                data:{
                    page:this.pageOption.currentPage-1,
                    pageSize:this.pageOption.pageSize,
                    asc:this.projects.sortAsc,
                    sortElement:"creatDate",
                    searchText:this.searchText,
                    oid:hrefs[hrefs.length-1]
                },
                cache: false,
                async: true,
                // dataType: "json",
                xhrFields:{
                    withCredentials:true
                },
                success:(json)=>{
                    if (json.code != 0) {
                        alert("Please login first!");
                        window.location.href = "/user/login";
                    }else {
                        const data = json.data;
                        this.projects.total=data.total;
                        this.projects.result=data.list;
                        this.pageOption.progressBar=false;
                        if (this.page == 1) {
                            this.pageInit();
                        }
                    }
                }
            })
        },

        searchConferences(){
            // var urls={
            //     1:"/article/searchByTitle",
            //     2:"/project/searchByName",
            //     3:"/conference/searchByTitle",
            // }
            // var url=urls[this.researchIndex];
            let hrefs = window.location.href.split("/");
            $.ajax({
                type:"GET",
                url:"/conference/searchByTitleByOid",
                data:{
                    page:this.pageOption.currentPage-1,
                    pageSize:this.pageOption.pageSize,
                    asc:this.conferences.sortAsc,
                    sortElement:"creatDate",
                    searchText:this.searchText,
                    oid:hrefs[hrefs.length-1]
                },
                cache: false,
                async: true,
                // dataType: "json",
                xhrFields:{
                    withCredentials:true
                },
                success:(json)=>{
                    if (json.code != 0) {
                        alert("Please login first!");
                        window.location.href = "/user/login";
                    }else {
                        const data = json.data;
                        this.conferences.total=data.total;
                        this.conferences.result=data.list;
                        this.pageOption.progressBar=false;
                        if (this.page == 1) {
                            this.pageInit();
                        }
                    }
                }
            })
        },



        deleteResearchItemClick(index,oid){
            // console.log(oid);
            this.deleteResearchItem(index,oid);
        },

        deleteResearchItem(index,oid){
            var urls={
                1:"/article/deleteByOid",
                2:"/project/deleteByOid",
                3:"/conference/deleteByOid",
            }
            if (confirm("Are you sure to delete this item?")){
                var url=urls[index];
                let data={
                    oid:oid
                };

                $.ajax({
                    type:"POST",
                    url:url,
                    data:data,
                    // contentType: "application/json; charset=utf-8",
                    cache: false,
                    async: true,
                    // dataType: "json",
                    xhrFields: {
                        withCredentials: true
                    },
                    crossDomain: true,
                    success: (json) => {
                        if(json.code==-1) {
                            this.$alert('Please login first!', 'Error', {
                                confirmButtonText: 'OK',
                                callback: action => {
                                    window.location.href = "/user/login";
                                }
                            });
                        }
                        else{
                            if(json.data==1){
                                alert("delete successfully!")
                                if(index==1)
                                    this.articleHandleCurrentChange(1);
                                if(index==2)
                                    this.projectHandleCurrentChange(1);
                                if(index==3)
                                    this.conferenceHandleCurrentChange(1);
                            }
                            else{
                                alert("delete failed!")
                            }
                        }

                    },
                    error:(json)=>{
                        // console.log(json);
                    }



                })
            }
        },

        deleteEduExp(oid){
            if (confirm("Are you sure to delete this item?")){
                let data={
                    oid:oid
                };

                $.ajax({
                    type:"POST",
                    url:'/educationExperience/deleteByOid',
                    data:data,
                    // contentType: "application/json; charset=utf-8",
                    cache: false,
                    async: true,
                    // dataType: "json",
                    xhrFields: {
                        withCredentials: true
                    },
                    crossDomain: true,
                    success: (json) => {
                        if(json.code==-1) {
                            this.$alert('Please login first!', 'Error', {
                                confirmButtonText: 'OK',
                                callback: action => {
                                    window.location.href = "/user/login";
                                }
                            });
                        }
                        else{
                            if(json.data==1){
                                alert("delete successfully!")
                                this.educationExperienceLoad(1);
                            }
                            else{
                                alert("delete failed!")
                            }
                        }

                    },
                    error:(json)=>{
                        // console.log(json);
                    }



                })
            }
        },

        deleteAwdHonor(oid){
            if (confirm("Are you sure to delete this item?")){
                let data={
                    oid:oid
                };

                $.ajax({
                    type:"POST",
                    url:'/awardandHonor/deleteByOid',
                    data:data,
                    // contentType: "application/json; charset=utf-8",
                    cache: false,
                    async: true,
                    // dataType: "json",
                    xhrFields: {
                        withCredentials: true
                    },
                    crossDomain: true,
                    success: (json) => {
                        if(json.code==-1) {
                            this.$alert('Please login first!', 'Error', {
                                confirmButtonText: 'OK',
                                callback: action => {
                                    window.location.href = "/user/login";
                                }
                            });
                        }
                        else{
                            if(json.data==1){
                                alert("delete successfully!")
                                this.awardandHonorLoad(1);
                            }
                            else{
                                alert("delete failed!")
                            }
                        }

                    },
                    error:(json)=>{
                        // console.log(json);
                    }



                })
            }
        },

        articleAddToBack(){
            if(this.articleToBack.title.trim()==""||this.articleToBack.authors.length==0)
                alert("Please enter the Title and at least one Author.");
            else
            {
                let obj=
                    {
                        title:this.articleToBack.title,
                        authors:this.articleToBack.authors,
                        journal:this.articleToBack.journal,
                        pageRange:this.articleToBack.pageRange,
                        date:this.articleToBack.date,
                        link:this.articleToBack.link,
                        // status:this.checkedIdentity[0],
                        doi:this.articleToBack.doi,
                    }
                $.ajax({
                    url: "/article/add",
                    type: "POST",
                    contentType: "application/json",
                    data: JSON.stringify(obj),

                    async:true,
                    success:(json)=>{
                        if(json.code==0){
                            // console.log(json.data);
                            if(json.data==1){
                                alert("Add Success");
                                this.editArticleDialog = false
                                this.articleHandleCurrentChange(1);
                                this.articleToBack = {}
                            }
                            else if (json.data==2)
                                alert("You have uploaded an article with this Title ever.")
                        }
                        else alert("Add Error");//此处error信息不明确，记得后加
                    }

                })
            }

        },

        articleAddtoBackManual(){
            this.articleToBack.title=$("#articleTitle").val();
            var tags = $('#articleAuthor').tagEditor('getTags')[0].tags;
            for (i = 0; i < tags.length; i++) { $('#articleAuthor').tagEditor('removeTag', tags[i]); }
            this.articleToBack.authors=tags;
            this.articleToBack.journal=$("#articleJournal").val();
            this.articleToBack.pageRange=$("#articlePageRange").val();
            this.articleToBack.date=$("#articleDate").val();
            this.articleToBack.link=$("#articleLink").val();
            this.articleToBack.doi='';
            if(this.articleToBack.title.trim()==""||this.articleToBack.authors.length==0)
                alert("Please enter the Title and at least one Author.");
            else
            {
                let obj=
                    {
                        title:this.articleToBack.title,
                        authors:this.articleToBack.authors,
                        journal:this.articleToBack.journal,
                        pageRange:this.articleToBack.pageRange,
                        date:this.articleToBack.date,
                        link:this.articleToBack.link,
                        // status:this.checkedIdentity[0],
                        doi:this.articleToBack.doi,
                    }
                $.ajax({
                    url: "/article/addManually",
                    type: "POST",
                    contentType: "application/json",
                    data: JSON.stringify(obj),

                    async:true,
                    success:(json)=>{
                        if(json.code==0){
                            // console.log(json.data);
                            if(json.data==1){
                                alert("Add Success");
                                this.editArticleDialog = false
                                this.articleHandleCurrentChange(1);
                                this.articleToBack = {}
                            }
                            else if (json.data==2)
                                alert("You have uploaded an article with this Title ever.")
                        }
                        else alert("Add Error");//此处error信息不明确，记得后加
                    }

                })
            }
        },

        editArticle(){
            // var urls={
            //     1:"/article/editByOid",
            //     2:"/project/editByOid",
            //     3:"/conference/editByOid",
            // }
            // var url=urls[this.researchIndex];
            this.articleToBack.title=$("#articleTitle").val();
            var tags = $('#articleAuthor').tagEditor('getTags')[0].tags;
            for (i = 0; i < tags.length; i++) { $('#articleAuthor').tagEditor('removeTag', tags[i]); }
            this.articleToBack.authors=tags;
            this.articleToBack.journal=$("#articleJournal").val();
            this.articleToBack.pageRange=$("#articlePageRange").val();
            this.articleToBack.date=$("#articleDate").val();
            this.articleToBack.link=$("#articleLink").val();
            this.articleToBack.doi='';
            if(this.articleToBack.title.trim()==""||this.articleToBack.authors.length==0)
                alert("Please enter the Title and at least one Author.");
            else {
                let obj =
                    {
                        title:this.articleToBack.title,
                        authors:this.articleToBack.authors,
                        journal:this.articleToBack.journal,
                        pageRange:this.articleToBack.pageRange,
                        date:this.articleToBack.date,
                        link:this.articleToBack.link,
                        oid:this.editOid,
                        // status:this.articleToBack.status,
                    }
                $.ajax({
                    url: "/article/editByOid",
                    type: "POST",
                    contentType: "application/json",
                    data: JSON.stringify(obj),

                    async: true,
                    success: (json) => {
                        if (json.code == 0) {
                            alert("Edit Success");
                            this.articleHandleCurrentChange(1);
                        } else alert("Edit Error");//此处error信息不明确，记得后加
                        this.editArticleDialog = false;
                    }
                })
            }
        },

        ProjectAddToBack(){
            if(this.projectToBack.name.trim()=="")
                alert("Please enter the project Name.");
            else
            {
                let obj=
                    {
                        projectName:this.projectToBack.name,
                        startTime:this.projectToBack.startTime,
                        endTime:this.projectToBack.endTime,
                        role:this.projectToBack.role,
                        fundAgency:this.projectToBack.fundAgency,
                        amount:this.projectToBack.amount,
                    }
                $.ajax({
                    url: "/project/add",
                    type: "POST",
                    contentType: "application/json",
                    data: JSON.stringify(obj),

                    async:true,
                    success:(json)=>{
                        if(json.code==0){
                            if(json.data==1){
                                alert("Add Success");
                                this.projectHandleCurrentChange(1);
                            }
                            else if (json.data==2)
                                alert("You have uploaded a project with this Title ever.")
                        }
                        else alert("Add Error");//此处error信息不明确，记得后加
                    }

                })
            }

        },

        editProject(){
            if(this.projectToBack.name.trim()=="")
                alert("Please enter the project Name.");
            else {
                let obj =
                    {
                        projectName:this.projectToBack.name,
                        startTime:this.projectToBack.startTime,
                        endTime:this.projectToBack.endTime,
                        role:this.projectToBack.role,
                        fundAgency:this.projectToBack.fundAgency,
                        amount:this.projectToBack.amount,
                        oid:this.editOid,
                    }
                $.ajax({
                    url: "/project/editByOid",
                    type: "POST",
                    contentType: "application/json",
                    data:  JSON.stringify(obj),

                    async: true,
                    success: (json) => {
                        if (json.code == 0) {
                            alert("Edit Success");
                            this.projectHandleCurrentChange(1);
                        } else alert("Edit Error");//此处error信息不明确，记得后加
                    }
                })
            }
        },

        ConferenceAddToBack(){
            if(this.conferenceToBack.title.trim()=="")
                alert("Please enter the project name.");
            else
            {
                let obj=
                    {
                        title:this.conferenceToBack.title,
                        theme:this.conferenceToBack.theme,
                        conferenceRole:this.conferenceToBack.role,
                        location:this.conferenceToBack.location,
                        startTime:this.conferenceToBack.startTime,
                        endTime:this.conferenceToBack.endTime
                    }
                $.ajax({
                    url: "/conference/add",
                    type: "POST",
                    contentType: "application/json",
                    data: JSON.stringify(obj),

                    async:true,
                    success:(json)=>{
                        if(json.code==0){
                            if(json.data==1){
                                alert("Add Success");
                                this.conferenceHandleCurrentChange(1);
                            }
                            else if (json.data==2)
                                alert("You have uploaded a Conference with this Title ever.")
                        }
                        else alert("Add Error");//此处error信息不明确，记得后加
                    }

                })
            }

        },

        editConference(){
            if(this.conferenceToBack.title.trim()=="")
                alert("Please enter the conference Title.");
            else {
                let obj =
                    {
                        title:this.conferenceToBack.title,
                        theme:this.conferenceToBack.theme,
                        conferenceRole:this.conferenceToBack.role,
                        location:this.conferenceToBack.location,
                        startTime:this.conferenceToBack.startTime,
                        endTime:this.conferenceToBack.endTime,
                        oid:this.editOid,
                    }
                $.ajax({
                    url: "/conference/editByOid",
                    type: "POST",
                    contentType: "application/json",
                    data:  JSON.stringify(obj),

                    async: true,
                    success: (json) => {
                        if (json.code == 0) {
                            alert("Edit Success");
                            this.conferenceHandleCurrentChange(1);
                        } else alert("Edit Error");//此处error信息不明确，记得后加
                    }
                })
            }
        },

        descriptionAddToBack(){
            var  obj={description:this.description};
            $.ajax({
                data:JSON.stringify(obj),
                url:"/user/updateDescription",
                type:'POST',
                async:true,
                contentType: "application/json",
                success:(json)=>{
                    if(json.code==0){
                        this.getUserInfo();
                        // alert("Add Success");
                    }
                }

            })

        },

        researchInterestAddToBack(){
            var  obj={researchInterests:this.researchInterests};
            $.ajax({
                data:JSON.stringify(obj),
                url:"/user/updateResearchInterest",
                type:'POST',
                async:true,
                contentType: "application/json",
                success:(json)=>{
                    if(json.code==0){
                        this.getUserInfo();
                        // alert("Add Success");
                    }
                }

            })

        },

        affiliationAddtoBack(){
            var  obj={
                name:this.affiliation.name,
                department: this.affiliation.department,
                position:this.affiliation.position,
                location:this.affiliation.location
            };
            $.ajax({
                data:JSON.stringify(obj),
                url:"/user/updateAffiliation",
                type:'POST',
                async:true,
                contentType: "application/json",
                success:(json)=>{
                    if(json.code==0){
                        this.getUserInfo();
                        // alert("Add Success");
                    }
                }

            })
        },

        userInfoAddToBack(){
            var  obj={
                description:this.description,
                researchInterests:this.researchInterests,
                subjectAreas:this.subjectAreas,
            };
            $.ajax({
                data:JSON.stringify(obj),
                url:"/user/updateUserIntro",
                type:'POST',
                async:true,
                contentType:"application/json",
                success:(json)=>{
                    if(json.code==0){
                        this.getUserInfo();
                        // alert("Add Success");
                    }
                }

            })

        },

        labAddtoBack(){
            var  obj={
                name:this.userPersonalInfo.lab.name,
                position:'member'
            };
            $.ajax({
                data:JSON.stringify(obj),
                url:"/user/updateLab",
                type:'POST',
                async:true,
                contentType: "application/json",
                success:(json)=>{
                    if(json.code==0){
                        this.getUserInfo();
                        this.labLoad();
                        // alert("Add Success");
                    }
                }

            })
        },

        subjectAreasAddtoBack(){
            var  obj={
                subjectAreas:this.subjectAreas,
            };
            $.ajax({
                data:JSON.stringify(obj),
                url:"/user/updateSubjectAreas",
                type:'POST',
                async:true,
                contentType: "application/json",
                success:(json)=>{
                    if(json.code==0){
                        this.getUserInfo();

                        // alert("Add Success");
                    }
                }

            })
        },

        eduExperienceAddtoBack(){
            if(this.eduExpAddToBack.institution.trim()==""||isNaN(this.eduExpAddToBack.startTime.getDate())||isNaN(this.eduExpAddToBack.endTime.getDate()))
                alert("Please enter the Institution and Time.");
            else
            {
                let obj=
                    {
                        institution:this.eduExpAddToBack.institution,
                        department:this.eduExpAddToBack.department,
                        academicDegree: this.eduExpAddToBack.acaDegree,
                        startTime: this.eduExpAddToBack.startTime,
                        endTime:this.eduExpAddToBack.endTime,
                        eduLocation:this.eduExpAddToBack.location
                    }
                $.ajax({
                    url: "/educationExperience/add",
                    type: "POST",
                    contentType: "application/json",
                    data: JSON.stringify(obj),

                    async:true,
                    success:(json)=>{
                        if(json.code==0){
                            alert("Save Success");
                            this.educationExperienceLoad(1);
                        }
                        else alert("Add Error");//此处error信息不明确，记得后加
                    }

                })
                $("#editEduXpce").modal("hide");

            }

        },

        awdHonorAddtoBack(){
            if(this.awdHonor.name.trim()==""||this.awdHonor.awardAgency.trim()=="")
                alert("Please enter the award name and award agency.");
            else{
            var  obj={
                name:this.awdHonor.name,
                awardAgency:this.awdHonor.awardAgency,
                awardTime:this.awdHonor.awardTime
            };
            $.ajax({
                data:JSON.stringify(obj),
                url:"/awardandHonor/add",
                type:'POST',
                async:true,
                contentType: "application/json",
                success:(json)=>{
                    if(json.code==0){
                        alert("Save Success");
                        this.awardandHonorLoad(1);
                    }
                    else alert("Add Error");//此处error信息不明确，记得后加
                }

            })

            $("#editAwdHonor").modal("hide");
            }

        },

        contactAddToBack(){
            var  obj={
               phone: this.userPersonalInfo.phone,
               email: this.userPersonalInfo.email,
               weChat: this.userPersonalInfo.weChat,
               faceBook: this.userPersonalInfo.faceBook,
               personPage: this.userPersonalInfo.personPage,
            };
            $.ajax({
                data:JSON.stringify(obj),
                url:"/user/updateContact",
                type:'POST',
                async:true,
                contentType: "application/json",
                success:(json)=>{
                    if(json.code==0){
                        this.getUserInfo();
                        alert("Save success");
                    }
                }
            })
            $('#editUserContact').modal('hide');


            },

        searchDoi(){
            if(this.doi == ''){
                this.$alert('Please input the DOI', 'Tip', {
                    confirmButtonText: 'Confirm',
                    callback: ()=>{
                        return
                    }
                    }
                );
            }else{
                this.doiLoading = true
                $.ajax({
                    type: "POST",
                    url: "/article/searchByDOI",
                    data: {
                        doi: this.doi
                    },
                    cache: false,
                    async: true,
                    success: (res) => {
                        if(res.code==-1) {
                            this.$alert('Please login first!', 'Error', {
                                confirmButtonText: 'OK',
                                callback: action => {
                                    window.location.href = "/user/login";
                                }
                            });
                        }
                        data=res.data;
                        this.doiLoading = false;
                        if (data.find == -1) {
                            this.$alert('Failed to connect, please try again!', 'Tip', {
                                    confirmButtonText: 'Confirm',
                                    callback: ()=>{
                                        return
                                    }
                                }
                            );
                        }else if(data.find==0){
                            this.$alert('Find no result, check the DOI you have input.', 'Tip', {
                                    confirmButtonText: 'Confirm',
                                    callback: ()=>{
                                        return
                                    }
                                }
                            );
                        }
                        else if(data.find==1) {

                            this.showUploadArticleDialog = true;
                            this.articleUploading = data.article;

                        }else if(data.find==2){
                            this.showUploadedArticleDialog=true;
                            this.articleUploading = data.article;
                            // this.$confirm('This article has been uploaded yet, do you want to be one of the contrbutors?', 'Tip', {
                            //     confirmButtonText: 'Yes',
                            //     cancelButtonText: 'Cancel',
                            //     center: true
                            // }).then(() => {
                            //     $.ajax({
                            //         type: "POST",
                            //         url: "/article/addContributor",
                            //         data: {
                            //             title: data.article.title,
                            //             journal: data.article.journal,
                            //         },
                            //         cache: false,
                            //         async: true,
                            //         success: (res) => {
                            //             data=res.data;
                            //             if(data==1)
                            //                 this.editArticleDialog = false
                            //         }
                            //     })
                            //
                            // }).catch(() => {
                            //
                            // });

                        }

                    },
                    error: (data) => {
                        this.doiLoading = false;
                        $("#doi_searchBox").removeClass("spinner")
                        this.$alert('Failed to connect, please try again!', 'Tip', {
                                confirmButtonText: 'Confirm',
                                callback: ()=>{
                                    return
                                }
                            }
                        );
                        $("#doiDetails").css("display", "none");
                        $("#doiTitle").val("")
                    }
                })
            }
        },

        articleDoiUploadConfirm(status){
            this.articleToBack = this.articleUploading;
            this.showUploadArticleDialog = false;
            // this.articleToBack.status = status;
        },

        addContributorConfirm(){
            $.ajax({
                type: "POST",
                url: "/article/addContributor",
                data: {
                    title: this.articleUploading.title,
                    journal: this.articleUploading.journal,
                },
                cache: false,
                async: true,
                success: (res) => {
                    data=res.data;
                    if(data==1){
                        this.articleHandleCurrentChange(1)
                        this.editArticleDialog = false
                        this.showUploadedArticleDialog = false
                    }

                }
            })
        }

    },

    created(){
        this.getUserInfo();
        this.modelItemHandleCurrentChange(1);
        this.dataItemHandleCurrentChange(1);
        this.logicalModelHandleCurrentChange(1);
        this.conceptualModelHandleCurrentChange(1);
        this.computableModelHandleCurrentChange(1);
        this.conceptHandleCurrentChange(1);
        this.spatialHandleCurrentChange(1);
        this.templateHandleCurrentChange(1);
        this.unitHandleCurrentChange(1);
        this.articleHandleCurrentChange(1);
        this.projectHandleCurrentChange(1);
        this.conferenceHandleCurrentChange(1);
        this.articleNewestLoad();
        this.awardandHonorLoad(1);
        this.educationExperienceLoad(1);
        this.labLoad();
    },

    mounted() {
        let that=this;
        $('#userEduStartTime').dcalendarpicker({
            format:'yyyy/mm/dd'
        });

        $('#userEduEndTime').dcalendarpicker({
            format:'yyyy/mm/dd'
        });

        $('#userProjectStartTime').dcalendarpicker({
            format:'yyyy/mm/dd'
        });

        $('#userProjectEndTime').dcalendarpicker({
            format:'yyyy/mm/dd'
        });

        $('#userConferStartTime').dcalendarpicker({
            format:'yyyy/mm/dd'
        });

        $('#userConferEndTime').dcalendarpicker({
            format:'yyyy/mm/dd'
        });

        $('#userAwdTime').dcalendarpicker({
            format:'yyyy/mm/dd'
        });

        $("#researchInterestInput").tagEditor({
            forceLowercase: false,
            placeholder:"Press enter after import one item.",
        })

        $("#userRIS").tagEditor({
            forceLowercase: false,
            placeholder:"Press enter after import one item.",
        })

        $("#userIntroRIS").tagEditor({
            forceLowercase: false,
            placeholder:"Press enter after import one item.",
        })

        $("#userIntroSubArea").tagEditor({
                forceLowercase: false,
                placeholder:"Press enter after import one item.",
            }

        )

        this.clickCount=0;

        // window.document.onclick(){
        //
        // }

        // $("#imgChange").click(function () {
        //     $("#imgFile").click();
        //     console.log($("#imgChange"))
        // });
        // $("#imgFile").change(function () {
        //     console.log($("#imgFile"))
        //     //获取input file的files文件数组;
        //     //$('#filed')获取的是jQuery对象，.get(0)转为原生对象;
        //     //这边默认只能选一个，但是存放形式仍然是数组，所以取第一个元素使用[0];
        //     var file = $('#imgFile').get(0).files[0];
        //     //创建用来读取此文件的对象
        //     var reader = new FileReader();
        //     //使用该对象读取file文件
        //     reader.readAsDataURL(file);
        //     //读取文件成功后执行的方法函数
        //     reader.onload = function (e) {
        //         //读取成功后返回的一个参数e，整个的一个进度事件
        //         //选择所要显示图片的img，要赋值给img的src就是e中target下result里面
        //         //的base64编码格式的地址
        //         $('#imgShowBig').get(0).src = e.target.result;
        //         $('#imgShowSmall').get(0).src = e.target.result;
        //         // $('#imgShow').show();
        //     }
        // });

        $('#closeSaveUserImg').click(()=>{
            $('#editUserImg').modal('hide')
        })

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
            imgChange();
        })

        function imgChange(){
            $("#imgFile").click()
            $("#imgFile").change(function () {

                fileUpload(this,1500,function (file) {


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
                    //图像加载完成绘制canvas
                    oImg.onload = ()=>{
                        canvas = document.createElement('canvas');
                        context = canvas.getContext('2d');

                        let originW = oImg.width;//图像初始宽度
                        let originH = oImg.height;

                        maxW=130
                        maxH=130
                        targetW=originW
                        targetH=originH

                        //设置canvas的宽、高
                        canvas.width=150
                        canvas.height=150

                        var positionX
                        var positionY
                        //判断图片是否超过限制  等比缩放
                        if(originW > maxW || originH > maxH) {
                            if(originH/originW < maxH/maxW) {//图片宽
                                targetH = maxH;
                                targetW = Math.round(maxH * (originW / originH));
                                positionX=75-targetW/2+'px'
                                positionY='10px'
                                canvas.style.backgroundSize = "auto 130px "
                            }else {
                                targetW = maxW;
                                targetH = Math.round(maxW * (originH / originW));
                                positionX='10px'
                                positionY=75-targetH/2+'px'
                                console.log(positionY)
                                canvas.style.backgroundSize = "130px auto"

                            }
                        }

                        if(originW <= maxW || originH <= maxH) {
                            if(originH/originW < maxH/maxW) {//图片宽
                                targetH = maxH;
                                targetW = Math.round(maxH * (originW / originH));
                                positionX=75-targetW/2+'px'
                                positionY='10px'
                                canvas.style.backgroundSize = "auto 130px "
                            }else {
                                targetW = maxW;
                                targetH = Math.round(maxW * (originH / originW));
                                positionX='10px'
                                positionY=75-targetH/2+'px'
                                console.log(positionY)
                                canvas.style.backgroundSize = "130px auto"
                            }
                        }

                        oldTarW=targetW
                        oldTarH=targetH
                        //清除画布
                        context.clearRect(0,0,150,150);

                        let img="url("+oImg.src+")";
                        console.log(oImg.src===img)

                        canvas.style.backgroundPositionX = positionX
                        canvas.style.backgroundPositionY = positionY

                        endX=positionX
                        endY=positionY

                        // canvas.style.backgroundPositionY = positionY
                        canvas.style.backgroundImage = img
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

                        context.fillStyle = 'rgba(225, 226, 226,0.5)';
                        context.beginPath()
                        context.rect(0,0,150,150);
                        context.closePath()
                        context.fill()

                        context.globalCompositeOperation='destination-out'

                        context.fillStyle='yellow'
                        context.beginPath()
                        context.arc(75,75,65,0,Math.PI*2,true)
                        context.closePath()
                        context.fill();

                        canvas.toBlob(function (blob) {
                            console.log(blob);
                            //之后就可以对blob进行一系列操作
                        },file.type || 'image/png');
                        $('.circlePhotoFrame').eq(0).children('canvas').remove();
                        document.getElementsByClassName('circlePhotoFrame')[0].appendChild(canvas);
                    }

                })



            });

        }

        function canvasToggle(){
            var startX,startY,moveX,moveY,width,height,posX,posY,limitX,limitY,leaveX,leaveY,
                lastX,lastY,dirR,dirD,noUseMoveR,noUseMoveD
            var dragable=false
            console.log(targetW)
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
                    console.log($('.circlePhotoFrame').eq(0).children('canvas'))
                    console.log(targetW)
                    var canvas = document.getElementsByTagName('canvas')[0]

                    limitX=targetW-maxW
                    limitY=targetH-maxH

                    let maxMoveXR=10-parseFloat(posX)
                    let maxMoveXD=10-parseFloat(posY)

                    if(e.pageX>lastX) dirR=1  //向左方向值
                    else dirR=-1

                    if(e.pageY>lastY) dirD=1  //向下方向值
                    else dirD=-1

                    console.log(e.pageX - startX)

                    if(e.pageX - startX>maxMoveXR){
                        if(dirR===1){
                            lastX = e.pageX
                            noUseMoveR=e.pageX - startX - maxMoveXR
                            console.log('nouse'+noUseMoveR)
                        }

                        else{
                            lastX = e.pageX
                            // e.pageX-=noUseMoveR
                            console.log('left'+e.pageX)
                            console.log(e.pageX - startX)
                        }

                    }else{
                        lastX = e.pageX
                    }


                    lastY = e.pageY

                    moveX = e.pageX - startX;
                    moveY = e.pageY - startY;

                    endX = moveX + parseFloat(posX)
                    endY = moveY + parseFloat(posY)

                    console.log(moveX, moveY)

                    console.log(endX, endY)
                    if (endX <= 10&&endX>=-limitX+10) {
                        endX = endX + 'px'
                        canvas.style.backgroundPositionX = endX
                    }

                    if (endY <= 10&&endY>=-limitY+10) {
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
                context.clearRect(0,0,150,150)
                canvas.style.backgroundImage = ""
                if(targetW<targetH){
                    let nx=0-(10-x)/130*150
                    let ny=0-(10-y)/130*150
                    context.drawImage(oImg,nx,ny,targetW/130*150,targetH/130*150);
                }else{
                    let nx=0-(10-x)/130*150
                    let ny=0-(10-y)/130*150
                    context.drawImage(oImg,nx,ny,targetW/130*150,targetH/130*150);
                }
                let url= canvas.toDataURL();
                saveUserIcon(url)
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
                console.log(leftStart)
                return;
            })

            $(document).on('mousemove',(e)=>{
                if(dragBarAble==true){
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

                        newX=75-(75-x)*timesP
                        newY=75-(75-y)*timesP

                        console.log(timesP)
                        console.log("wz"+newX,newY)

                        newX=newX+'px'
                        newY=newY+'px'

                        canvas.style.backgroundPositionX = newX
                        canvas.style.backgroundPositionY = newY

                        leftPos=leftPos+'px'
                        console.log(leftPos)
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

        // scaleImg();

        function saveUserIcon(img) {
            $.ajax({
                    data:{img:img},
                    url:'/user/saveUserIcon',
                    type:'POST',
                    async:true,
                success:(json)=>{
                    if (json.code == -1) {
                        alert("Please login first!")
                        window.location.href = "/user/login"
                    } else {
                        that.getUserInfo();
                        alert('Save successfully!')
                        let src='/static/upload'+json.data
                        $('.userIcon').attr("src",src)
                        $('#editUserImg').modal('hide')
                    }
                }

            }

            )

        }

    }

})

var menuChoose=document.getElementsByClassName('menuItem'),
    contents=document.getElementsByClassName('bodyContainer'),
    menuBorder=document.getElementsByClassName('menuBorder'),

    viewMoreIntro=document.getElementById('viewMoreIntroduction'),
    viewMoreModel=document.getElementById('viewMoreModel'),
    viewMoreResearch=document.getElementById('viewMoreResearch');
    chooseBox=document.getElementsByClassName('chooseBox')

function showItem(){
    // console.log('99');
    // console.log(menuChoose);
    // console.log(contents);

}

(function changeContent() {
    for(let i=0;i<menuChoose.length;i++){
        // var menuAfter=window.getComputedStyle(menuChoose[i],':after');
        //     console.log(menuAfter.borderBottom);
        menuChoose[i].onmouseover=function (){

            menuBorder[i].style.borderBottomColor = '#34acff';
            menuBorder[i].style.borderBottomWidth = '3px';
        };
        menuChoose[i].onmouseout=function (){
            menuBorder[i].style.borderBottomColor = 'transparent';
            menuBorder[i].style.borderBottomWidth = '2px';
        };
        menuChoose[i].onclick = function show() {
            // console.log(contents);
            // console.log(this);
            for (let i = 0; i < menuChoose.length; i++) {

                if (this === menuChoose[i]) {
                    // menuChoose[i].style.borderBottomColor = '#339fff';
                    // menuChoose[i].style.borderBottomwidth = 3;

                    contents[i].classList.add('flexActive');
                } else {
                    // menuChoose[i].style.borderBottomColor = '#adadad';
                    // menuChoose[i].style.borderBottomWidth = 3;
                    contents[i].classList.remove('flexActive');
                }
            }

        };

    }


    // viewMoreIntro.onclick = function () {
    //
    //     for(let i=0;i<contents.length;i++)
    //     {
    //         if(i===3){
    //             contents[i].classList.add('flexActive');
    //             menuChoose[i].style.borderBottomColor = '#339fff';
    //         }else{
    //             contents[i].classList.remove('flexActive');
    //             menuChoose[i].style.borderBottomColor = '#9b9b9b';
    //         }
    //
    //
    //     }
    //
    //
    // };
    //
    // viewMoreModel.onclick=function (){
    //     for(let i=0;i<contents.length;i++)
    //     {
    //         if(i===1){
    //             contents[i].classList.add('flexActive');
    //             menuChoose[i].style.borderBottomColor = '#339fff';
    //         }else{
    //             contents[i].classList.remove('flexActive');
    //             menuChoose[i].style.borderBottomColor = '#9b9b9b';
    //         }
    //
    //
    //     }
    // };
    //
    // viewMoreResearch.onclick=function (){
    //     for(let i=0;i<contents.length;i++)
    //     {
    //         if(i===2){
    //             contents[i].classList.add('flexActive');
    //             menuChoose[i].style.borderBottomColor = '#339fff';
    //         }else{
    //             contents[i].classList.remove('flexActive');
    //             menuChoose[i].style.borderBottomColor = '#9b9b9b';
    //         }
    //
    //
    //     }
    // };

})();


$(".backTopUserpage").click(
    function(){$('html,body').animate({scrollTop:'0px'},300);
    }
    )




