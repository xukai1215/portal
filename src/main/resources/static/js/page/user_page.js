new Vue({
    el: '#userPage',

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
                    title:'aa',
                    author:[],
                    journal:'ss',
                    startPage:1,
                    endPage:2,
                    date:2019,
                    link:'aa',
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

                space:[],

                editOid:'',

                clickCount:0,

                value1: '',
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

        modelItemClick() {
            this.bodyIndex=2;
            this.showIndex=1;
            this.modelItemHandleCurrentChange(1);
        },

        datalItemClick(){
            this.bodyIndex=2;
            this.showIndex=2;
            this.dataItemHandleCurrentChange(1);
        },

        conceptualModelClick(){
            this.bodyIndex=2;
            this.showIndex=3;
            this.conceptualModelHandleCurrentChange(1);

        },

        logicalModelClick: function () {
            this.bodyIndex=2;
            this.showIndex=4;
            this.logicalModelHandleCurrentChange(1);

            // console.log(this.logicalModels.result)
        },

        computableModelClick(){
            this.bodyIndex=2;
            this.showIndex=5;
            this.computableModelHandleCurrentChange(1);

            // console.log(this.computableModels.total)
        },

        conceptClick(){
            this.bodyIndex=2;
            this.showIndex=6;
            this.conceptHandleCurrentChange(1);
            $('html,body').animate({scrollTop: '230px'}, 220);
        },

        spatialClick(){
            this.bodyIndex=2;
            this.showIndex=7;
            this.spatialHandleCurrentChange(1);
            $('html,body').animate({scrollTop: '230px'}, 220);
        },

        templateClick(){
            this.bodyIndex=2;
            this.showIndex=8;
            this.templateHandleCurrentChange(1);
            $('html,body').animate({scrollTop: '230px'}, 220);
        },

        unitClick(){
            this.bodyIndex=2;
            this.showIndex=9;
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
            $('html,body').animate({scrollTop: '0px'}, 220);
            this.articleHandleCurrentChange(1);
        },

        projectClick(index){
            this.bodyIndex=3;
            this.researchIndex=index;
            $('html,body').animate({scrollTop: '0px'}, 220);
            this.projectHandleCurrentChange(1);
        },

        conferenceClick(index){
            this.bodyIndex=3;
            this.researchIndex=index;
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
            var tags = $('#userIntroRIS').tagEditor('getTags')[0].tags;
            for (i = 0; i < tags.length; i++) { $('#userRIS').tagEditor('removeTag', tags[i]); }
            this.researchInterests=tags;
            var tags = $('#userIntroSubArea').tagEditor('getTags')[0].tags;
            for (i = 0; i < tags.length; i++) { $('#userIntroSubArea').tagEditor('removeTag', tags[i]); }
            this.subjectAreas=tags;

            this.descriptionAddToBack();
            this.researchInterestAddToBack();
            this.subjectAreasAddtoBack();

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
            this.userPersonalInfo.lab.name=$('#userLaboratory').val();
            if ($("input[type='radio'][name='labPosition']:checked").val()=='0') {
                this.userPersonalInfo.lab.position='leader';
            }
            else if($("input[type='radio'][name='labPosition']:checked").val()=='1'){
                this.userPersonalInfo.lab.position='member';
            }
            if(this.userPersonalInfo.lab.name==''||this.userPersonalInfo.lab.position==''){
                alert('Please insert your lab name and leader!')
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
            $('#descriptionInputContainer').css({display:'none'});
            this.description=$('#descriptionInput').val();
            console.log(this.description);
            $('#descriptionDetail').css({display:'block'});
            $('#editDescriptionButton').css({display:'flex'});
            this.descriptionAddToBack();

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
            this.modelItems.currentPage = val;
            // console.log(this.modelItems.currentPage);
            $('html,body').animate({scrollTop: '0px'}, 220);
            const hrefs = window.location.href.split("/");
            $.ajax({
                type: "GET",
                url: "/modelItem/listByUserOid",
                data: {
                    page: this.modelItems.currentPage - 1,
                    asc: this.pageOption.sortAsc,
                    pageSize: this.pageOption.pageSize,
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
            this.dataItems.currentPage = val;
            $('html,body').animate({scrollTop: '0px'}, 220);
            const hrefs = window.location.href.split("/");
            $.ajax({
                type: "GET",
                url: "/user/getDataItems",
                data: {
                    page: this.dataItems.currentPage,
                    asc: -1,
                    pagesize: this.pageOption.pageSize,
                    userOid: hrefs[hrefs.length - 1],
                },
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
            this.conceptualModels.currentPage = val;
            $('html,body').animate({scrollTop: '0px'}, 220);
            const hrefs = window.location.href.split("/");
            $.ajax({
                type: "GET",
                url: "/conceptualModel/listByUserOid",
                data: {
                    page: this.conceptualModels.currentPage - 1,
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
                            console.log(this.conceptualModels.result);
                            this.pageOption.progressBar = false;

                        }, 500);
                    } else {
                        console.log("search conceptual model failed.")
                    }
                }
            })
        },

        logicalModelHandleCurrentChange: function (val) {
            this.logicalModels.currentPage = val;
            $('html,body').animate({scrollTop: '0px'}, 220);

            const hrefs = window.location.href.split("/");
            $.ajax({
                type: "GET",
                url: "/logicalModel/listByUserOid",
                data: {
                    page: this.logicalModels.currentPage - 1,
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
                            console.log('logical'+this.logicalModels.result);
                            }, 500);
                    } else {
                        console.log("search logical model failed.")
                    }
                }
            })
        },

        computableModelHandleCurrentChange: function (val) {
            this.computableModels.currentPage = val;
            $('html,body').animate({scrollTop: '0px'}, 220);
            const hrefs = window.location.href.split("/");
            $.ajax({
                type: "GET",
                url: "/computableModel/listByUserOid",
                data: {
                    page: this.computableModels.currentPage - 1,
                    asc: this.pageOption.sortAsc,
                    pageSize: this.pageOption.pageSize,
                    oid: hrefs[hrefs.length - 1],
                },
                async: true,
                success: (json) => {

                    if (json.code == 0) {
                        const data = json.data;
                        console.log(data.list);
                        if(data.list.length!=0)
                            setTimeout(() => {

                                this.computableModels.total = data.total;
                                this.computableModels.result = data.list;
                                this.pageOption.progressBar = false;
                                console.log('computer'+this.computableModels.result);
                                }, 500);
                    } else {
                        console.log("search computable model failed.")
                    }
                }
            })
        },

        conceptHandleCurrentChange(val){
            this.concepts.currentPage = val;
            const hrefs = window.location.href.split("/");
            let name='concepts';
            $.ajax({
                type: "Get",
                url: "/repository/listConceptsByUserOid",
                data: {
                    page: this.concepts.currentPage - 1,
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
                            console.log(data);

                        } else {
                            console.log("search concept failed.")

                        }
                    }
                }
            })
        },

        spatialHandleCurrentChange(val){
            this.spatials.currentPage = val;
            const hrefs = window.location.href.split("/");
            var url = "/repository/listSpatialsByOid";
            var name = "spatials";

            $.ajax({
                type: "Get",
                url: url,
                data: {
                    page: this.spatials.currentPage - 1,
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

                        }else {
                            console.log("search concept failed.")
                        }
                    }
                }
            })
        },

        templateHandleCurrentChange(val){
            this.templates.currentPage = val;
            const hrefs = window.location.href.split("/");
            var url = "/repository/listTemplatesByOid";
            var name = "templates";

            $.ajax({
                type: "Get",
                url: url,
                data: {
                    page: this.templates.currentPage - 1,
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
                            console.log("search concept failed.")
                        }
                    }
                }
            })
        },

        unitHandleCurrentChange(val){
            this.units.currentPage = val;
            const hrefs = window.location.href.split("/");
            var url = "/repository/listUnitsByOid";
            var name = "units";

            $.ajax({
                type: "Get",
                url: url,
                data: {
                    page: this.units.currentPage - 1,
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
                            console.log("search concept failed.")
                        }
                    }
                }
            })
        },

        articleHandleCurrentChange: function (val) {
            this.articles.currentPage=val;
            this.barIndex=1;
            const hrefs=window.location.href.split('/');
            $.ajax({
                type:"GET",
                url:"/article/listByUserOid",
                data:{
                    page:this.articles.currentPage-1,
                    pageSize:this.pageOption.pageSize,
                    asc:this.articles.sortAsc,
                    sortElement:'creatDate',
                    oid:hrefs[hrefs.length - 1],
                },
                async:true,
                success: (json)=>{

                    if (json.code == 0) {
                        const data=json.data;
                        console.log(data.list.length);
                        setTimeout(() => {

                            this.articles.total=data.total;
                            this.articles.result=data.list;
                            this.pageOption.progressBar=false;
                            console.log(this.articles.result);
                            console.log(this.articles.result.length);
                        }, 500);
                    } else {
                        console.log("search computable model failed.")
                    }

                }

            })

        },

        projectHandleCurrentChange: function (val) {
            this.projects.currentPage=val;
            const hrefs=window.location.href.split('/');
            $.ajax({
                type:"GET",
                url:"/project/listByUserOid",
                data:{
                    page:this.projects.currentPage-1,
                    pageSize:this.pageOption.pageSize,
                    asc:this.projects.sortAsc,
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
                            console.log(this.projects.result)

                        }, 500);
                    } else {
                        console.log("search computable model failed.")
                    }

                }

            })

        },

        conferenceHandleCurrentChange(val) {
            this.conferences.currentPage=val;
            const hrefs=window.location.href.split("/");
            $.ajax({
                type:"GET",
                url:"/conference/listByUserOid",
                data:{
                    page:this.conferences.currentPage-1,
                    asc: this.pageOption.sortAsc,
                    pageSize: this.pageOption.pageSize,
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
                        console.log(this.newestArticle);
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
                        setTimeout(
                            ()=>{
                                this.awardandHonor.total=data.total;
                                this.awardandHonor.result=data.list;
                                this.pageOption.progressBar=false;
                            },500)

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
                                console.log(this.educationExperience.result);
                            },500)
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
                                console.log(this.userLab.labInfo);
                                // console.log(this.userLab.leader);
                                console.log(this.userLab.members);
                            },200)
                    }else{
                        console.log("search data item failed.")
                    }
                }
            })
        },

        addArticleClick(){
            this.addorEdit='Add';
            $("#articleTitle").val('');
            $('#articleAuthor').tagEditor('destroy');
            $('#articleAuthor').tagEditor({
                initialTags:  [''],
                forceLowercase: false,
            });
            $("#articleJournal").val('');
            $("#articleStartPage").val('');
            $("#articleEndPage").val('');
            $("#articleDate").val('');
            $("#articleLink").val('');
        },

        editArticleClick(key,oid){
            this.addorEdit='Edit';
            this.editOid=oid;
            $("#articleTitle").val(this.articles.result[key].title);
            $('#articleAuthor').tagEditor('destroy');
            $('#articleAuthor').tagEditor({
                initialTags: this.articles.result[key].authors,
                forceLowercase: false,
            });
            $("#articleJournal").val(this.articles.result[key].journal);
            $("#articleStartPage").val(this.articles.result[key].startPage);
            $("#articleEndPage").val(this.articles.result[key].endPage);
            $("#articleDate").val(this.articles.result[key].date);
            $("#articleLink").val(this.articles.result[key].link);
        },

        updateArticleConfirmClick(){

            this.articleToBack.title=$("#articleTitle").val();
            var tags = $('#articleAuthor').tagEditor('getTags')[0].tags;
            for (i = 0; i < tags.length; i++) { $('#articleAuthor').tagEditor('removeTag', tags[i]); }
            this.articleToBack.author=tags;
            this.articleToBack.journal=$("#articleJournal").val();
            this.articleToBack.startPage=$("#articleStartPage").val();
            this.articleToBack.endPage=$("#articleEndPage").val();
            this.articleToBack.date=$("#articleDate").val();
            this.articleToBack.link=$("#articleLink").val();
            // console.log(this.articleToBack);
            if(this.addorEdit=='Add'){
                this.ArticleAddToBack();
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
            console.log(this.conferenceToBack)
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
                    console.log('aaaddd');
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
                    console.log('aaaddd');
                    $('#conferenceSearchContainer').css('display','none');
                },500);

            }

        },


        searchItems(index){

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

        searchResource(index){
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
            $.ajax({
                type:"GET",
                url:urls[index],
                data:{
                    page:this.modelItems.currentPage-1,
                    pageSize:this.pageOption.pageSize,
                    asc:this.modelItems.sortAsc,
                    sortElement:"createTime",
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
                        switch (index) {
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
                url:"/article/searchByTitleByOid",
                data:{
                    page:this.articles.currentPage-1,
                    pageSize:this.pageOption.pageSize,
                    asc:this.articles.sortAsc,
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
                        // this.articles.total=data.total;
                        // this.articles.result=data.list;
                        Vue.set(this.articles ,'total', data.total);
                        Vue.set(this.articles ,'result', data.list);
                        this.pageOption.progressBar=false;
                        console.log(data);
                        console.log(this.articles);
                        console.log(this.articles.total);
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
                    page:this.projects.currentPage-1,
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
                    page:this.conferences.currentPage-1,
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
            console.log(oid);
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
                console.log(url,oid);
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
                        if(json.code==-1){
                            alert("Please log in first!")
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
                        console.log(json);
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
                        if(json.code==-1){
                            alert("Please log in first!")
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
                        console.log(json);
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
                        if(json.code==-1){
                            alert("Please log in first!")
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
                        console.log(json);
                    }



                })
            }
        },

        ArticleAddToBack(){
            if(this.articleToBack.title.trim()==""||this.articleToBack.author.length==0)
                alert("Please enter the Title and at least one Author.");
            else
            {
                let obj=
                    {
                        title:this.articleToBack.title,
                        authors:this.articleToBack.author,
                        journal:this.articleToBack.journal,
                        startPage:this.articleToBack.startPage,
                        endPage:this.articleToBack.endPage,
                        date:this.articleToBack.date,
                        link:this.articleToBack.link,
                    }
                $.ajax({
                    url: "/article/add",
                    type: "POST",
                    contentType: "application/json",
                    data: JSON.stringify(obj),

                    async:true,
                    success:(json)=>{
                        if(json.code==0){
                            alert("Add Success");
                            this.articleHandleCurrentChange(1);
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
            if(this.articleToBack.title.trim()==""||this.articleToBack.author.length==0)
                alert("Please enter the Title and at least one Author.");
            else {
                let obj =
                    {
                        title:this.articleToBack.title,
                        authors:this.articleToBack.author,
                        journal:this.articleToBack.journal,
                        startPage:this.articleToBack.startPage,
                        endPage:this.articleToBack.endPage,
                        date:this.articleToBack.date,
                        link:this.articleToBack.link,
                        oid:this.editOid,
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
                            alert("Add Success");
                            this.projectHandleCurrentChange(1);
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
            if(this.conferenceToBack.title=="")
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
                            alert("Add Success");
                            this.conferenceHandleCurrentChange(1);
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
            console.log(obj);
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

        labAddtoBack(){
            var  obj={
                name:this.userPersonalInfo.lab.name,
                position:'member'
            };
            console.log(obj)
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
            if(this.eduExpAddToBack.institution.trim()==""||this.eduExpAddToBack.startTime=="")
                alert("Please enter the Institution and startTime.");
            else
            {
                let obj=
                    {
                        institution:this.eduExpAddToBack.institution,
                        department:this.eduExpAddToBack.department,
                        acaDegree: this.eduExpAddToBack.acaDegree,
                        startTime: this.eduExpAddToBack.startTime,
                        endTime:this.eduExpAddToBack.endTime,
                        location:this.eduExpAddToBack.location
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
               persinPage: this.userPersonalInfo.personPage,
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

    },

    created(){
        this.getUserInfo();
        this.modelItemHandleCurrentChange(1);
        // // this.dataItemHandleCurrentChange(1);
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

        $("#articleAuthor").tagEditor({
            forceLowercase: false
        });

        this.clickCount=0;

        // window.document.onclick(){
        //
        // }
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
    console.log('99');
    console.log(menuChoose);
    console.log(contents);

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
            console.log(contents);
            console.log(this);
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




