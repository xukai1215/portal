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