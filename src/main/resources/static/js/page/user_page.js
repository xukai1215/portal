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


            pageOption:{
                progressBar:true,
                sortAsc:false,
                pageSize:6,
                pageCount:10,
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

            articles:{
                currentPage:1,
                total:0,
                result:[],
            },

            newestArticle:{
                result:[],
            },

            userLab:{
                labInfo:[],
                labLeader:[],
                labMember:[],
            },

            articleAdd:{
                title:'aa',
                author:[],
                journal:'ss',
                startPage:1,
                endPage:2,
                date:2019,
                link:'aa',
            },


            projects:{
                currentPage:1,
                total:0,
                result:[],
            },

            conferences:{
                currentPage:1,
                total:0,
                result:[],
            },

            awardandHonor:{
                currentPage:1,
                total:0,
                result:[],
            },

            educationExperience:{
                currentPage:1,
                total:0,
                result:[],
            }
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

        // statsCardClick(index){
        //     this.bodyIndex=2;
        //     this.showIndex=index;
        // },

        labClick(){
            this.bodyIndex=4;
            $('html,body').animate({scrollTop: '0px'}, 200);
        },

        menu_Click(index){
            this.bodyIndex=index;
            $('html,body').animate({scrollTop: '0px'}, 200);
        },

        // resource按钮单独做以每次都显示model item
        menu_Click_Resource(index){
            window.scroll(0,0);
            this.bodyIndex=index;
            this.showIndex=1;
        },

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

        addArticleClick(){
            this.articleAdd.title=$("#titleInput").val();
            firstAuthor=$("#firstAuthorInput").val();
            secAuthor=$("#secAuthorInput").val();
            this.articleAdd.author[0]=firstAuthor;
            this.articleAdd.author[1]=secAuthor;
            this.articleAdd.journal=$("#journalInput").val();
            this.articleAdd.startPage=$("#startPageInput").val();
            this.articleAdd.endPage=$("#endPageInput").val();
            this.articleAdd.date=$("#dateInput").val();
            this.articleAdd.link=$("#linkInput").val();
            console.log(this.articleAdd);
            this.ArticleAddToBack();
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
                url: "/dataItem/listByUserOid",
                data: {
                    page: this.dataItems.currentPage - 1,
                    asc: this.pageOption.sortAsc,
                    pageSize: this.pageOption.pageSize,
                    oid: hrefs[hrefs.length - 1],
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

        // ArticleAddToBack(){
        //     var obj=
        //             {
        //             title:this.articleAdd.title,
        //             authors:this.articleAdd.author,
        //             journal:this.articleAdd.journal,
        //             startPage:this.articleAdd.startPage,
        //             endPage:this.articleAdd.endPage,
        //             date:this.articleAdd.date,
        //             link:this.articleAdd.link,
        //         }
        //     $.ajax({
        //         url: "/article/add",
        //         type: "POST",
        //         contentType: "application/json",
        //         data: JSON.stringify(obj),
        //
        //         async:true,
        //         success:(json)=>{
        //             if(json.code==0){
        //                 alert("Add Success");
        //             }
        //         }
        //
        //     })
        //
        // },
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
                    pageSize: 3,
                    oid:hrefs[hrefs.length-1],
                },
                async:true,
                success:(json)=>{
                    if(json.code==0){
                        const data=json.data;
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
                    oid:hrefs[hrefs.length-1],
                },
                async:true,
                success:(json)=>{
                    if(json.code==0){
                        const data=json.data;
                        setTimeout(
                            ()=>{
                                this.educationExperience.total=data.total;
                                this.educationExperience.result=data.list;
                                this.pageOption.progressBar=false;
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
                                this.userLab.leader=data.labLeader;
                                this.userLab.members=data.labMembers;
                                // this.pageOption.progressBar=false;
                                console.log(this.userLab.labInfo);
                                console.log(this.userLab.leader);
                                console.log(this.userLab.members);
                            },500)
                    }else{
                        console.log("search data item failed.")
                    }
            }
            })
        },




    },



    mounted(){
        this.modelItemHandleCurrentChange(1);
        // // this.dataItemHandleCurrentChange(1);
        this.logicalModelHandleCurrentChange(1);
        this.conceptualModelHandleCurrentChange(1);
        this.computableModelHandleCurrentChange(1);
        this.articleHandleCurrentChange(1);
        this.projectHandleCurrentChange(1);
        this.conferenceHandleCurrentChange(1);
        this.articleNewestLoad();
        this.awardandHonorLoad(1);
        this.educationExperienceLoad(1);
        this.labLoad();
    }


})

var menuChoose=document.getElementsByClassName('menuItem'),
    contents=document.getElementsByClassName('bodyContainer'),
    menuBorder=document.getElementsByClassName('menuBorder'),

    viewMoreIntro=document.getElementById('viewMoreIntroduction'),
    viewMoreModel=document.getElementById('viewMoreModel'),
    viewMoreResearch=document.getElementById('viewMoreResearch');

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

