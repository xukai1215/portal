new Vue({
    el: '#app',
    data: function () {
        return {
            activeIndex:'',
            activeName: 'Model Item',
            currentPage: 1,

            pageOption:{
                progressBar:true,
                sortAsc:false,
                pageSize:5,
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
        handleClick(tab, event) {
            switch (tab.paneName) {
                case "Model Item":
                    this.modelItems.currentPage=1;
                    this.modelItemHandleCurrentChange(1);
                    break;
                case "Data Item":
                    this.dataItems.currentPage=1;
                    this.dataItemHandleCurrentChange(1);
                    break;
                case "Conceptual Model":
                    this.conceptualModels.currentPage=1;
                    this.conceptualModelHandleCurrentChange(1);
                    break;
                case "Logical Model":
                    this.logicalModels.currentPage=1;
                    this.logicalModelHandleCurrentChange(1);
                    break;
                case "Computable Model":
                    this.computableModels.currentPage=1;
                    this.computableModelHandleCurrentChange(1);
                    break;
            }
        },
        modelItemHandleCurrentChange(val) {
            this.modelItems.currentPage=val;
            window.scrollTo(0,0);
            const hrefs=window.location.href.split("/");
            $.ajax({
                type: "GET",
                url: "/modelItem/listByUserOid",
                data: {
                    page: this.modelItems.currentPage-1,
                    asc: this.pageOption.sortAsc,
                    pageSize: this.pageOption.pageSize,
                    oid:hrefs[hrefs.length-1],
                },
                async: true,
                success: (json) => {

                    if(json.code==0) {
                        const data=json.data;

                        setTimeout(() => {

                            this.modelItems.total = data.total;
                            this.modelItems.result = data.list;
                            this.pageOption.progressBar = false;

                        }, 500);
                    }
                    else{
                        console.log("search model item failed.")
                    }
                }
            })
        },
        dataItemHandleCurrentChange(val) {
            this.dataItems.currentPage=val;
            window.scrollTo(0,0);
            const hrefs=window.location.href.split("/");
            $.ajax({
                type: "GET",
                url: "/dataItem/listByUserOid",
                data: {
                    page: this.dataItems.currentPage-1,
                    asc: this.pageOption.sortAsc,
                    pageSize: this.pageOption.pageSize,
                    oid:hrefs[hrefs.length-1],
                },
                async: true,
                success: (json) => {

                    if(json.code==0) {
                        const data=json.data;

                        setTimeout(() => {

                            this.dataItems.total = data.total;
                            this.dataItems.result = data.list;
                            this.pageOption.progressBar = false;

                        }, 500);
                    }
                    else{
                        console.log("search data item failed.")
                    }
                }
            })
        },
        conceptualModelHandleCurrentChange(val) {
            this.conceptualModels.currentPage=val;
            window.scrollTo(0,0);
            const hrefs=window.location.href.split("/");
            $.ajax({
                type: "GET",
                url: "/conceptualModel/listByUserOid",
                data: {
                    page: this.conceptualModels.currentPage-1,
                    asc: this.pageOption.sortAsc,
                    pageSize: this.pageOption.pageSize,
                    oid:hrefs[hrefs.length-1],
                },
                async: true,
                success: (json) => {

                    if(json.code==0) {
                        const data=json.data;

                        setTimeout(() => {

                            this.conceptualModels.total = data.total;
                            this.conceptualModels.result = data.list;
                            this.pageOption.progressBar = false;

                        }, 500);
                    }
                    else{
                        console.log("search conceptual model failed.")
                    }
                }
            })
        },
        logicalModelHandleCurrentChange(val) {
            this.logicalModels.currentPage=val;
            window.scrollTo(0,0);
            const hrefs=window.location.href.split("/");
            $.ajax({
                type: "GET",
                url: "/logicalModel/listByUserOid",
                data: {
                    page: this.logicalModels.currentPage-1,
                    asc: this.pageOption.sortAsc,
                    pageSize: this.pageOption.pageSize,
                    oid:hrefs[hrefs.length-1],
                },
                async: true,
                success: (json) => {

                    if(json.code==0) {
                        const data=json.data;

                        setTimeout(() => {

                            this.logicalModels.total = data.total;
                            this.logicalModels.result = data.list;
                            this.pageOption.progressBar = false;

                        }, 500);
                    }
                    else{
                        console.log("search logical model failed.")
                    }
                }
            })
        },
        computableModelHandleCurrentChange(val) {
            this.computableModels.currentPage=val;
            window.scrollTo(0,0);
            const hrefs=window.location.href.split("/");
            $.ajax({
                type: "GET",
                url: "/computableModel/listByUserOid",
                data: {
                    page: this.computableModels.currentPage-1,
                    asc: this.pageOption.sortAsc,
                    pageSize: this.pageOption.pageSize,
                    oid:hrefs[hrefs.length-1],
                },
                async: true,
                success: (json) => {

                    if(json.code==0) {
                        const data=json.data;

                        setTimeout(() => {

                            this.computableModels.total = data.total;
                            this.computableModels.result = data.list;
                            this.pageOption.progressBar = false;

                        }, 500);
                    }
                    else{
                        console.log("search computable model failed.")
                    }
                }
            })
        },

    },
    mounted(){
        this.modelItemHandleCurrentChange(1);
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

            menuBorder[i].style.borderBottomColor = '#339fff';
            menuBorder[i].style.borderBottomWidth = '3px';
        };
        menuChoose[i].onmouseout=function (){
            menuBorder[i].style.borderBottomColor = 'transparent';
            menuBorder[i].style.borderBottomWidth = '2px';
        };
        menuChoose[i].onclick = function show() {
            console.log(contents);
            for (let i = 0; i < menuChoose.length; i++) {

                if (this === menuChoose[i]) {
                    menuChoose[i].style.borderBottomColor = '#339fff';
                    // menuChoose[i].style.borderBottomwidth = 3;
                    contents[i].classList.add('showActive');
                } else {
                    menuChoose[i].style.borderBottomColor = '#adadad';
                    // menuChoose[i].style.borderBottomWidth = 3;
                    contents[i].classList.remove('showActive');
                }
            }

        };

    }


    viewMoreIntro.onclick = function () {

        for(let i=0;i<contents.length;i++)
        {
            if(i===3){
                contents[i].classList.add('showActive');
                menuChoose[i].style.borderBottomColor = '#339fff';
            }else{
                contents[i].classList.remove('showActive');
                menuChoose[i].style.borderBottomColor = '#9b9b9b';
            }


        }


    };

    viewMoreModel.onclick=function (){
        for(let i=0;i<contents.length;i++)
        {
            if(i===1){
                contents[i].classList.add('showActive');
                menuChoose[i].style.borderBottomColor = '#339fff';
            }else{
                contents[i].classList.remove('showActive');
                menuChoose[i].style.borderBottomColor = '#9b9b9b';
            }


        }
    };

    viewMoreResearch.onclick=function (){
        for(let i=0;i<contents.length;i++)
        {
            if(i===2){
                contents[i].classList.add('showActive');
                menuChoose[i].style.borderBottomColor = '#339fff';
            }else{
                contents[i].classList.remove('showActive');
                menuChoose[i].style.borderBottomColor = '#9b9b9b';
            }


        }
    };

})();

