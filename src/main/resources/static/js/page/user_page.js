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
            // blueIndex:1,
            // aaa:1,

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
            console.log('1')
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

        menu_Click(index){
            window.scroll(0,0);
            this.bodyIndex=index;
        },

        // resource按钮单独做以每次都显示model item
        menu_Click_Resource(index){
            window.scroll(0,0);
            this.bodyIndex=index;
            this.showIndex=1;
        },

        researchItemClick(index){
            this.researchIndex=index;
        },

        modelItemHandleCurrentChange: function (val) {
            console.log('111')
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
                success: (json) => {

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

    },




    mounted(){
        this.modelItemHandleCurrentChange(1);
        // this.dataItemHandleCurrentChange(1);
        this.logicalModelHandleCurrentChange(1);
        this.conceptualModelHandleCurrentChange(1);
        this.computableModelHandleCurrentChange(1);
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

