var vue = new Vue({
        el: "#app",
        data() {
            return {
                loadDeployedModelDialog: false,
                deployedModel:[{
                    name:'',
                }],
                deployedModelCount:0,
                pageOption: {
                    paginationShow:false,
                    progressBar: true,
                    sortAsc: false,
                    currentPage: 1,
                    pageSize: 10,

                    total: 11,
                    searchResult: [],
                },
                searchText:'',
                loading:false,
            }
        },
        methods: {
            setSession(name, value) {
                window.sessionStorage.setItem(name, value);
            },

            loadDeployedModelClick() {
                this.loadDeployedModelDialog = true;
                this.pageOption.currentPage = 1;
                this.searchResult = '';
                this.loadDeployedModel();

            },

            handlePageChange(val) {
                this.pageOption.currentPage = val;

                if(this.inSearch==0)
                    this.loadDeployedModel();
                else
                    this.searchDeployedModel()
            },
            loadDeployedModel(){
                this.inSearch = 0
                this.loading = true;
                axios.get('/computableModel/loadDeployedModel',{
                    params:{
                        asc:1,
                        page:this.pageOption.currentPage-1,
                        size:6,
                    }
                }).then(
                    (res)=>{
                        if(res.data.code==0){
                            let data = res.data.data;
                            this.deployedModel = data.content
                            this.pageOption.total = data.total;
                            setTimeout(()=>{
                                this.loading = false;
                            },100)
                        }else{
                            this.$alert('Please try again','Warning', {
                                confirmButtonText: 'OK',
                                callback: action => {
                                    this.loading = false;
                                }
                            })

                        }
                    }
                )
            },

            searchDeployedModel(page){
                this.inSearch = 1
                this.loading = true;
                let targetPage = page==undefined?this.pageOption.currentPage:page
                this.pageOption.currentPage=targetPage
                axios.get('/computableModel/searchDeployedModel',{
                    params:{
                        asc:1,
                        page:targetPage-1,
                        size:6,
                        searchText: this.searchText,
                    }
                }).then(
                    (res)=>{
                        if(res.data.code==0){
                            let data = res.data.data;
                            this.deployedModel = data.content
                            this.pageOption.total = data.total;
                            setTimeout(()=>{
                                this.loading = false;
                                },150)

                        }else{
                            this.$alert('Please try again','Warning', {
                                confirmButtonText: 'OK',
                                callback: action => {
                                    this.loading = false;
                                }
                            })

                        }
                    }
                )
            },

            confirmLogin(){
                this.$confirm('<div style=\'font-size: 18px\'>This function requires an account, <br/>please login first.</div>', 'Tip', {
                    dangerouslyUseHTMLString: true,
                    confirmButtonText: 'Log In',
                    cancelButtonClass: 'fontsize-15',
                    confirmButtonClass: 'fontsize-15',
                    type: 'info',
                    center: true,
                    showClose: false,
                }).then(() => {
                    window.location.href = "/user/login";
                }).catch(() => {

                });
            },

            invokeModel(oid){
                window.open('/task/'+oid)
            },

            jump() {
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
                        if (data.oid == "") {
                            this.confirmLogin()
                        }
                        else {
                            let arr = window.location.href.split("/");
                            let bindOid = arr[arr.length - 1].split("#")[0];
                            this.setSession("bindOid", bindOid);
                            switch (this.relateType) {
                                case "modelItem":
                                    window.open("/user/userSpace#/model/createModelItem", "_blank")
                                    break;
                                case "conceptualModel":
                                    window.open("/user/userSpace#/model/createConceptualModel", "_blank")
                                    break;
                                case "logicalModel":
                                    window.open("/user/userSpace#/model/createLogicalModel", "_blank")
                                    break;
                                case "computableModel":
                                    window.open("/user/userSpace#/model/createComputableModel", "_blank")
                                    break;
                                case "concept":
                                    window.open("/user/userSpace#/community/createConcept", "_blank")
                                    break;
                                case "spatialReference":
                                    window.open("/user/userSpace#/community/createSpatialReference", "_blank")
                                    break;
                                case "template":
                                    window.open("/user/userSpace#/community/createTemplate", "_blank")
                                    break;
                                case "unit":
                                    window.open("/user/userSpace#/community/createUnit", "_blank")
                                    break;
                            }
                        }
                    }
                })
            },
        },
        created() {

        },
        mounted() {

        },

    }
)