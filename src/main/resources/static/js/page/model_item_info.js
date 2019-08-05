new Vue({
    el: '#app',
    components: {
        'avatar': VueAvatar.Avatar
    },
    data: function () {
        return {
            activeIndex:'2',
            activeName: 'Computable Model',
            activeRelatedDataName:'Add Data Items',
            tableData6: [{
                title: 'Anisotropic magnetotransport and exotic longitudinal linear magnetoresistance in WT e2 crystals',
                authors: 'Zhao Y.,Liu H.,Yan J.,An W.,Liu J.,Zhang X.,Wang H.,Liu Y.,Jiang H.,Li Q.,Wang Y.,Li X.-Z.,Mandrus D.,Xie X.~C.,Pan M.,Wang J.',
                date: 'jul 2015',
                journal: 'prb',
                pages: "041104"
            }, {
                title: 'Detection of a Flow Induced Magnetic Field Eigenmode in the Riga Dynamo Facility',
                authors: 'Gailitis A.,Lielausis O.,Dement\'ev S.,Platacis E.,Cifersons A.,Gerbeth G.,Gundrum T.,Stefani F.,Christen M.,Hanel H.,Will G.',
                date: 'may 2000',
                journal: 'Physical Review Letters',
                pages: "4365-4368"
            }],

            useroid:'',
            loading:false,
            related3Models:[],
            value1:'1',
            relatedModelNotNull:false,
            relatedModelIsNull:false,
            searchRelatedModelsDialogVisible:false,
            addRelatedModelsDialogVisible:false,
            allRelatedModels:[],
            dataNums:5,
            timer:false,
            nomore:"",
            nomoreflag:false,

            relatedModelsSearchText:'',
            addModelsSearchText:'',
            searchAddRelatedModels:[],
            searchAddModelPage:1,

            selectedModels:[],
            selectedModelsOid:[]
        }
    },
    methods: {
        edit(){
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
                    data = JSON.parse(data);
                    if (data.oid == "") {
                        alert("Please login first");
                        this.setSession("history",window.location.href);
                        window.location.href = "/user/login";
                    }
                    else {
                        let href=window.location.href;
                        let hrefs=href.split('/');
                        let oid=hrefs[hrefs.length-1];
                        $.ajax({
                            type: "GET",
                            url: "/modelItem/getUserOidByOid",
                            data: {
                                oid:oid
                            },
                            cache: false,
                            async: false,
                            xhrFields: {
                                withCredentials: true
                            },
                            crossDomain: true,
                            success: (json) => {
                                // if(json.data==data.oid){
                                    window.sessionStorage.setItem("editModelItem_id",oid)
                                    window.location.href="/user/createModelItem";
                                // }
                                // else{
                                //     alert("You are not the model item's author, please contact to the author to modify the model item.")
                                // }
                            }
                        });
                    }
                }
            })
        },
        setSession(name, value) {
            window.sessionStorage.setItem(name, value);
        },
        link(event){
            let refLink=$(".refLink");
            for(i=0;i<refLink.length;i++){
                if(event.currentTarget==refLink[i]){
                    window.open(this.tableData6[i].links);
                }
            }
            //console.log(event.currentTarget);
        },
        jump(num){
            $.ajax({
                type: "GET",
                url: "/user/load",
                data: {},
                cache: false,
                async: false,
                xhrFields:{
                    withCredentials: true
                },
                crossDomain:true,
                success: (data) => {
                    data=JSON.parse(data);
                    if (data.oid == "") {
                        alert("Please login first");
                        window.location.href = "/user/login";
                    }
                    else{
                        var bindOid=window.location.pathname.substring(11);
                        this.setSession("bindOid",window.location.pathname.substring(11));
                        switch (num){
                            case 1:
                                window.open("/user/createConceptualModel","_blank")
                                break;
                            case 2:
                                window.open("/user/createLogicalModel","_blank")
                                break;
                            case 3:
                                window.open("/user/createComputableModel","_blank")
                                break;
                        }


                    }
                }
            })
        },



        checkRelatedData(item){
            let curentId=document.location.href.split("/");
            return curentId[0]+"//"+curentId[2]+"/dataItem/"+item.id;
        },
        handleClose(done) {
            this.$confirm('are u sure close this dialog？')
                .then(_ => {
                    done();
                })
                .catch(_ => {});
        },
        //add related models

        addRelatedModel(){

            if(this.useroid==''){
                alert("Please login");
                window.location.href = "/user/login";
            }else{
                this.searchAddModelPage=1
                this.searchAddRelatedModels=[]
                this.addModelsSearchText=""
                this.selectedModels=[]
                this.selectedModelsOid=[]


                this.nomore=''
                this.addRelatedModelsDialogVisible=true






            }



        },




        searchRelatedModels(){



            this.nomoreflag=false
            if(this.value1==='1'){

                this.addSearchFromUser()
            }else if(this.value1==='2'){

                this.addSearchFromAll()
            }
        },
        clearSearchResult(){
            this.searchAddRelatedModels=[]
            this.nomore=''
        },
        loadAddMore(e){

            let that=this
            if ( e.target.scrollHeight - e.target.clientHeight-e.target.scrollTop <10&&this.nomore==='') { //到达底部100px时,加载新内容

                clearTimeout(this.timer);

                this.timer=setTimeout(()=>{
                        that.searchAddModelPage+=1// 这里加载数据..



                        if(this.value1==='1'){
                            that.addSearchFromUser()
                        }else if(this.value1==='2'){
                            that.addSearchFromAll()
                        }


                    },
                    500)

            }


        },
        addSearchFromUser() {

            let data={
                searchText:this.addModelsSearchText,
                page:this.searchAddModelPage,
                asc:false,
                pageSize:5,
                userOid:this.useroid


            }
            let that=this
            this.loading=true
            if(this.nomore===''){
                axios.get("/dataItem/searchDataByUserId/",{
                    params:data
                })
                    .then((res)=>{

                        if(res.status===200){
                            if(res.data.data.content.length===0){
                                that.nomore="nomore"
                                that.loading=false
                            }else{
                                that.loading=false
                                that.searchAddRelatedModels=that.searchAddRelatedModels.concat(res.data.data.content)
                            }

                        }



                    })
            }


        },
        addSearchFromAll(){


            let arr=[]
            arr.push(this.addModelsSearchText)
            let data={
                page:this.searchAddModelPage,
                asc:1,
                pageSize:5,
                searchContent:arr

            }



            let that=this
            this.loading=true
            //searchFromAll
            axios.post("/dataItem/searchFromAll",data)
                .then((res)=>{

                    if(res.status===200){

                        that.loading=false
                        that.searchAddRelatedModels=that.searchAddRelatedModels.concat(res.data.data.content)
                    }



                })

        },
        selectRelatedModel(item,e){

            if(this.selectedModels.indexOf(item.name)>-1){
                e.currentTarget.className="is-hover-shadow models_margin_style"

                this.getRidOf(item.name,this.selectedModels)
                this.getRidOf(item.id,this.selectedModelsOid)
            }else{
                e.currentTarget.className="is-hover-shadow models_margin_style selectedModels"

                this.selectedModels.push(item.name)
                this.selectedModelsOid.push(item.id)
            }



        },
        getRidOf(e,arr){
            arr.splice(arr.indexOf(e),1)
        },
        relatedToCurrentData(){

            if(this.selectedModelsOid.length===0){
                alert("pleasa select model first!")
            }else{

                let curentId=document.location.href.split("/");

                let dataItemFindDTO={
                    dataId:curentId[curentId.length-1],
                    relatedModels:this.selectedModelsOid
                }

                axios.post("/dataItem/data",dataItemFindDTO)


                    .then((res)=>{
                        if(res.status===200){
                            alert("Cgts,related models successfully!")

                        }

                    })



            }

        },


        showRelatedModels(){
            this.dataNums=5
            this.searchAddRelatedModels=[]
            this.searchRelatedModelsDialogVisible=true
            relatedModelsSearchText=""
            this.RelatedModels(this.dataNums)




        },
        searchFromRelatedModels(){
            //todo search from show related models
        },
        //函数节流防抖
        loadMore(e){

            if(!this.nomoreflag){
                if ( e.target.scrollHeight - e.target.clientHeight-e.target.scrollTop <10) { //到达底部100px时,加载新内容

                    clearTimeout(this.timer);

                    this.timer=setTimeout(()=>{
                            this.dataNums+=5// 这里加载数据..
                            this.RelatedModels(this.dataNums)
                        },
                        500)

                }
            }

        },

        RelatedModels(more){
            let curentId=document.location.href.split("/");
            let that=this
            this.loading=true
            this.nomore=false
            axios.get("/dataItem/allrelateddata",{
                params:{
                    id:curentId[curentId.length-1],
                    more:more
                }
            })
                .then((res)=>{
                    if(res.status==200){
                        that.loading=false
                        //todo 传回来数组为空时
                        if(res.data.data[0].all==="all"){
                            that.nomore="no more"
                            that.nomore=true
                            that.loading=false

                        }else{
                            that.allRelatedModels=that.allRelatedModels.concat(res.data.data)
                            that.loading=false
                        }

                    }

                })


        }
















    },
    mounted(){
        let currenturl=window.location.href;
        let dataitemid=currenturl.split("/");

        let that=this
        axios.get("/dataItem/briefrelateddata",{
            params:{
                id:dataitemid[dataitemid.length-1]
            }
        })
            .then((res)=>{
                that.related3Models=res.data.data

                if(that.related3Models.length===0){
                    that.relatedModelIsNull=true;
                    that.relatedModelNotNull=false
                }else {
                    that.relatedModelNotNull=true
                    that.relatedModelIsNull=false;
                }
            })

        axios.get("/user/load")
            .then((res)=>{
                if(res.status=200){
                    if(res.data.oid!=''){
                        that.useroid=res.data.oid
                    }

                }
            })










        $(document).on("click", ".detail-toggle", function () {
            if ($(this).text() == "[Collapse]") {
                $(this).text("[Expand]");
            }
            else {
                $(this).text("[Collapse]")
            }

        })

        $('html, body').animate({scrollTop:0}, 'slow');

        let descHeight=$("#description .block_content").height();
        if(descHeight>300){
            $("#description .block_content").css("overflow","hidden")
            $("#description .block_content").css("height","250px")

            $(".fullPaper").removeClass("hide");
        }

        let refs=$("#ref").val();
        if(refs!=null) {
            let json = JSON.parse(refs);
            for (i = 0; i < json.length; i++) {
                json[i].author = json[i].author.join(", ");
            }
            console.log(json);
            this.tableData6 = json;
        }
        $(".createConceptual").click(()=>{
            this.jump(1);
        })
        $(".createLogical").click(()=>{
            this.jump(2);
        })
        $(".createComputable").click(()=>{
            this.jump(3);
        })

        $("#fullPaper").click(function(){
            $("#description .block_content").css("overflow","inherit");
            $("#description .block_content").css("height","auto");
            $(".fullPaper").remove();
        })

        new QRCode(document.getElementById("qrcode"), {
            text: window.location.href,
            width: 200,
            height: 200,
            colorDark : "#000000",
            colorLight : "#ffffff",
            correctLevel : QRCode.CorrectLevel.H
        });

    }
})