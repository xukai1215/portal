new Vue({
    el: '#app',
    data: function () {
        return {
            activeIndex:'3-3',
            activeName: 'AttributeSet',

            useroid:"",
            userId:"",
            userImg:"",
            //comment
            commentText: "",
            commentParentId:null,
            commentList:[],
            replyToUserId:"",
            commentTextAreaPlaceHolder:"Write your comment...",
            replyTo:"",

            databrowser:[],
            dataid:'',
            searchcontent:'',
            thisciteurl:'',
            comforcom:false,
            comments:false,
            comforcomtextarea:'',
            mycommentforthedata:'',
            showkey:'',

            allcomments:[],
            thumbs:'',
            thisthumbs:'',

            dialogVisible:false,
            dialogShowClose:false,
            contentBeforeDeploy:true,
            contentDeploying:false,
            contentAfterDeploy_suc:false,
            contentAfterDeploy_fail:false,
            footerBeforeDeploy:true,
            footerAfterDeploy:false,

            graphVisible: 'none',
            loadjson: '',
            mDiagram: null,
            editComputableModelDialog:false,
            modelOid:'',

            selectModelServerDialog:false,

            rightMenuShow:false,

            modelServerUrl:'',

            publicModelContainerList: [{
                ip: '172.21.213.105',
                port:8060,
                geoInfo: {
                    city: "Nanjing",
                    countryCode: "CN",
                    countryName: "China",
                    latitude: "32.0617",
                    longitude: "118.7778",
                    region: "Jiangsu",
                },
                hardware: {
                    cpu_Core: 8,
                    diskAll: "300G",
                    diskAvailable: "280G",
                    platform: "Windows",
                    system: "Windows Server",
                    totalMemory: "8G",
                    version: "2012",
                },
                status: true
            },
                {
                    ip: '172.21.212.78',
                    port:8060,
                    geoInfo: {
                        city: "Nanjing",
                        countryCode: "CN",
                        countryName: "China",
                        latitude: "32.0617",
                        longitude: "118.7778",
                        region: "Jiangsu",
                    },
                    hardware: {
                        cpu_Core: 4,
                        diskAll: "400G",
                        diskAvailable: "387G",
                        platform: "Windows",
                        system: "Windows Server",
                        totalMemory: "8G",
                        version: "2012",
                    },
                    status: false
                },
                {
                    ip: '172.21.213.50',
                    port:8060,
                    geoInfo: {
                        city: "Nanjing",
                        countryCode: "CN",
                        countryName: "China",
                        latitude: "32.0617",
                        longitude: "118.7778",
                        region: "Jiangsu",
                    },
                    hardware: {
                        cpu_Core: 8,
                        diskAll: "120G",
                        diskAvailable: "75G",
                        platform: "Linux",
                        system: "CentOS",
                        totalMemory: "4G",
                        version: "7",
                    },
                    status: false
                },
                {
                    ip: '172.21.213.50',
                    port:8060,
                    geoInfo: {
                        city: "Nanjing",
                        countryCode: "CN",
                        countryName: "China",
                        latitude: "32.0617",
                        longitude: "118.7778",
                        region: "Jiangsu",
                    },
                    hardware: {
                        cpu_Core: 8,
                        diskAll: "120G",
                        diskAvailable: "75G",
                        platform: "Linux",
                        system: "Ubuntu",
                        totalMemory: "4G",
                        version: "7",
                    },
                    status: false
                }

            ],
        }
    },
    methods: {
        claim(){
            $.get("/user/load",{},(result)=>{
                let json = result;
                if (json.oid == "") {
                    this.confirmLogin();
                }
                else {
                    this.authorshipFormVisible = true;
                }
            })
        },
        feedBack(){
            $.get("/user/load",{},(result)=>{
                let json = result;
                if (json.oid == "") {
                    this.confirmLogin();
                }
                else {
                    window.location.href = "/user/userSpace#/feedback"
                }
            })
        },
        submitComment(){
            if(this.useroid==""||this.useroid==null||this.useroid==undefined){
                this.$message({
                    dangerouslyUseHTMLString: true,
                    message: '<strong>Please <a href="/user/login">log in</a> first.</strong>',
                    offset: 40,
                    showClose: true,
                });
            }else if(this.commentText.trim()==""){
                this.$message({
                    message: 'Comment can not be empty!',
                    offset: 40,
                    showClose: true,
                });
            }else {

                let hrefs = window.location.href.split("/");
                let id = hrefs[hrefs.length - 1].substring(0, 36);
                let typeName = hrefs[hrefs.length-2];
                let data = {
                    parentId: this.commentParentId,
                    content: this.commentText,
                    // authorId: this.useroid,
                    replyToUserId: this.replyToUserId,
                    relateItemId: id,
                    relateItemTypeName: typeName,
                };
                $.ajax({
                    url: "/comment/add",
                    async: true,
                    type: "POST",
                    contentType: 'application/json',

                    data: JSON.stringify(data),
                    success: (result) => {
                        console.log(result)
                        if(result.code==-1){
                            window.location.href="/user/login"
                        }else if (result.code == 0) {
                            this.commentText = "";
                            this.$message({
                                message: 'Comment submitted successfully!',
                                type: 'success',
                                offset: 40,
                                showClose: true,
                            });
                            this.getComments();
                        } else {
                            this.$message({
                                message: 'Submit Error!',
                                type: 'error',
                                offset: 40,
                                showClose: true,
                            });
                        }
                    }
                });
            }

        },
        deleteComment(oid){
            $.ajax({
                url: "/comment/delete",
                async: true,
                type: "POST",

                data: {
                    oid:oid,
                },
                success: (result) => {
                    console.log(result)
                    if(result.code==-1){
                        window.location.href="/user/login"
                    }else if (result.code == 0) {
                        this.commentText = "";
                        this.$message({
                            message: 'Comment deleted successfully!',
                            type: 'success',
                            offset: 40,
                            showClose: true,
                        });
                        this.getComments();
                    } else {
                        this.$message({
                            message: 'Delete Error!',
                            type: 'error',
                            offset: 40,
                            showClose: true,
                        });
                    }
                }
            });
        },
        getComments(){
            let hrefs=window.location.href.split("/");
            let type=hrefs[hrefs.length-2];
            let oid=hrefs[hrefs.length-1].substring(0,36);
            let data={
                type:type,
                oid:oid,
                sort:-1,
            };
            $.get("/comment/getCommentsByTypeAndOid",data,(result)=>{
                this.commentList=result.data.commentList;
            })
        },
        replyComment(comment){
            this.commentParentId=comment.oid;
            this.replyTo="Reply to "+comment.author.name;
            setTimeout(function () { $("#commentTextArea").focus();}, 1);
        },
        replySubComment(comment,subComment){
            this.commentParentId=comment.oid;
            this.replyToUserId=subComment.author.oid;
            // this.commentTextAreaPlaceHolder="Reply to "+subComment.author.name;
            this.replyTo="Reply to "+subComment.author.name;
            setTimeout(function () { $("#commentTextArea").focus();}, 1);
        },
        tagClose(){
            this.replyTo="";
            this.replyToUserId="";
            this.commentParentId=null;
        },

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
                    if (data.oid == "") {
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
                    }
                    else {
                        let href=window.location.href;
                        let hrefs=href.split('/');
                        let oid=hrefs[hrefs.length-1].split("#")[0];

                        this.modelOid=oid
                        this.editComputableModelDialog=true
                        // $.ajax({
                        //     type: "GET",
                        //     url: "/computableModel/getUserOidByOid",
                        //     data: {
                        //         oid:oid
                        //     },
                        //     cache: false,
                        //     async: false,
                        //     xhrFields: {
                        //         withCredentials: true
                        //     },
                        //     crossDomain: true,
                        //     success: (json) => {
                        //         // if(json.data==data.oid){
                        //         window.sessionStorage.setItem("editComputableModel_id",oid)
                        //         window.location.href="/user/createComputableModel";
                        //         // }
                        //         // else{
                        //         //     alert("You are not the model item's author, please contact to the author to modify the model item.")
                        //         // }
                        //     }
                        // });
                    }
                }
            })
        },

        setSession(name, value) {
            window.sessionStorage.setItem(name, value);
        },

        deployModel(){
            this.selectModelServerDialog = true
        },

        //Todo,手动选择服务器部署还有问题
        selectModelServer(container){
            if(!container.status){
                this.$message({
                    message: 'Server Offline!',
                    offset: 70,
                });
                return
            }
            if(this.modelServerUrl.split(':')[0] == container.ip){//如果选中则取消选择
                this.modelServerUrl = ''
                this.$message({
                    message: 'Cancel server select !',
                    offset: 70,
                });
            }else{
                this.modelServerUrl = container.ip + ':' +container.port
                this.$message({
                    message: 'Succeed to select server !',
                    type:'success',
                    offset: 70,
                });
            }
        },

        deploy(){
            this.contentBeforeDeploy=false;
            this.contentDeploying=true;
            this.footerBeforeDeploy=false;

            const hrefs=window.location.href.split("/");
            const oid=hrefs[hrefs.length-1];
            let formData = new FormData()
            formData.append('id',oid)
            formData.append('modelServer',this.modelServerUrl)
            // formData.append('modelServer',this.modelServerUrl)
            $.ajax({
                type: "POST",
                url: "/computableModel/deploy",
                // data: JSON.stringify({
                //     id:oid,
                //     modelServer:this.modelServerUrl,
                // }),
                data:formData,
                async: true,
                contentType: false,
                processData: false,
                success: (json) => {
                    setTimeout(() => {
                        this.contentDeploying = false;
                        if (json.code == 0) {
                            this.contentAfterDeploy_suc = true;
                        }
                        else {
                            this.contentAfterDeploy_fail = true;
                        }
                        this.footerAfterDeploy = true;
                    },500)
                }
            })
        },

        invoke(){
            const href=window.location.href;

            const hrefs=href.split("/");
            console.log(hrefs);
            window.location.href="/task/"+hrefs[hrefs.length-1];
        },


        handleDownload(index,row){
            // console.log(index,row);
        },
        handleShare(index,row){

        },
        getImg(item){
            return "/static/img/filebrowser/"+item.suffix+".svg"
        },

        generateId(key){
            return key;
        },

        getid(eval){
            alert(eval);
            this.dataid=eval;


        },

        share(){
            // if(this.dataid==''){
            //     this.$message('please select file first!!');
            // }

            let item =this.databrowser[this.dataid]

            if(item!=null){
                let url ="/dataItem/downloadRemote?fileName="+item.fileName+"&sourceStoreId="+item.sourceStoreId+"&suffix="+item.suffix;
                this.$alert("<input style='width: 100%' value="+url+">",{
                    dangerouslyUseHTMLString: true
                })
                // this.dataid='';

            }else {
                // console.log("从后台获取数据条目数组有误")
                this.$message('please select file first!!');
            }
        },
        //批量下载还有问题，待修改
        dall(){


            let locaurl=window.location.href;
            let url =locaurl.split("/");
            // console.log(url[url.length-1]);

            let downloadallzipurl="http://localhost:8081/dataResource/downloadAll/"+url[url.length-1];

            let link =document.createElement("a");
            link.style.display='none';
            link.href=downloadallzipurl;
            link.setAttribute("download","alldata.zip");

            document.body.appendChild(link);
            link.click();

        },
        showtitle(ev){
            return ev.fileName+"\n"+"Type:"+ev.suffix;
        },
        downloaddata(){

            // if(this.dataid==undefined){
            //     this.$message('please select file first!!');
            // }
            // console.log("downid"+this.dataid)

            let item =this.databrowser[this.dataid];

            if(item!=null){
                let url ="/dataItem/downloadRemote?fileName="+item.fileName+"&sourceStoreId="+item.sourceStoreId+"&suffix="+item.suffix;
                let link =document.createElement('a');
                link.style.display='none';
                link.href=url;
                link.setAttribute(item.fileName,'filename.'+item.suffix)

                document.body.appendChild(link)
                link.click();

            }else {
                this.$message('please select file first!!');
            }


        },

        showsearchresult(data){

            //动态创建DOM节点

            for(let i=0;i<this.databrowser.length;i++){
                //匹配查询字段
                if(this.databrowser[i].fileName.toLowerCase().indexOf(data.toLowerCase())>-1){
                    //插入查找到的card

                    //card
                    let searchresultcard=document.createElement("div");
                    searchresultcard.classList.add("el-card");
                    searchresultcard.classList.add("dataitemisol");
                    searchresultcard.classList.add("is-never-shadow");
                    searchresultcard.classList.add("sresult");


                    //cardbody
                    let secardbody=document.createElement("div");
                    secardbody.classList.add("el-card__body");
                    //card里添加cardbody
                    searchresultcard.appendChild(secardbody);

                    //el-row1
                    let cardrow1=document.createElement("div");
                    cardrow1.classList.add("el-row");
                    secardbody.appendChild(cardrow1);

                    //3个div1
                    //div1
                    let div1=document.createElement("div");
                    div1.classList.add("el-col");
                    div1.classList.add("el-col-6");

                    let text1=document.createTextNode(" ");
                    div1.appendChild(text1);

                    cardrow1.appendChild(div1)

                    //div2
                    let div2=document.createElement("div");
                    div2.classList.add("el-col");
                    div2.classList.add("el-col-12");

                    let img=document.createElement("img");
                    img.src="/static/img/filebrowser/"+this.databrowser[i].suffix+".svg";

                    img.style.height='60%';
                    img.style.width='100%';
                    img.style.marginLeft='30%';

                    div2.appendChild(img);

                    cardrow1.appendChild(div2)

                    //div3
                    let div3=document.createElement("div");
                    div3.classList.add("el-col");
                    div3.classList.add("el-col-6");

                    let text2=document.createTextNode(" ");
                    div3.appendChild(text2);

                    cardrow1.appendChild(div3);


                    //el-row2
                    let cardrow2=document.createElement("div");
                    cardrow2.classList.add("el-row");
                    secardbody.appendChild(cardrow2);

                    //3个div2
                    //div4
                    let div4=document.createElement("div");
                    div4.classList.add("el-col");
                    div4.classList.add("el-col-2");

                    let text3=document.createTextNode(" ");
                    div4.appendChild(text3);

                    cardrow2.appendChild(div4)

                    //div5
                    let div5=document.createElement("div");
                    div5.classList.add("el-col");
                    div5.classList.add("el-col-20");

                    let p=document.createElement("p");
                    div5.appendChild(p);

                    let filenameandtype=document.createTextNode(this.databrowser[i].fileName+'.'+this.databrowser[i].suffix);
                    p.appendChild(filenameandtype)

                    cardrow2.appendChild(div5)

                    //div6
                    let div6=document.createElement("div");
                    div6.classList.add("el-col");
                    div6.classList.add("el-col-20");

                    let text4=document.createTextNode(" ");
                    div6.appendChild(text4);

                    cardrow2.appendChild(div6)

                    //往contents里添加card
                    document.getElementById("browsercont").appendChild(searchresultcard);

                    //DOM2级事件绑定

                    // searchresultcard.addEventListener('click',()=>{
                    //    //点击赋值id
                    //     this.dataid=i;
                    // });
                    searchresultcard.click(function () {
                        this.dataid=i;
                    })

                }
            }
        },

        openRightMenu(e,id){
            e.preventDefault();
            let width = document.documentElement.clientWidth;
            if(width>950){
                this.$refs.rightMenu.style.top = e.pageY- 240 + "px"
                // 125 > window.innerHeight
                //     ? `${window.innerHeight - 127}px` : `${e.pageY}px`;
                this.$refs.rightMenu.left = e.pageX - 310 + "px";
            }else {
                dom[0].style.top = e.pageY - 300 + "px"
                dom[0].style.left = e.pageX - 65 + "px";
            }

            this.rightMenuShow = true
        },

        showMxGraph(){
            $("#ModelShow").show();

            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
            document.body.style.overflowY="hidden";
        },

        hideMxGraph(){
            $("#ModelShow").hide();
            document.body.style.overflowY="auto";
        }
    },
    mounted(){

        this.setSession("history", window.location.href);
        axios.get("/user/load")
            .then((res) => {
                if (res.status == 200) {
                    if (res.data.oid != '') {
                        this.useroid = res.data.oid;
                        this.userId = res.data.userId;
                        this.userImg = res.data.image;
                    }

                }
            })
        this.getComments();

        $(document).on('mouseover mouseout','.flexRowSpaceBetween',function(e){

            let deleteBtn=$(e.currentTarget).children().eq(1).children(".delete");
            if(deleteBtn.css("display")=="none"){
                deleteBtn.css("display","block");
            }else{
                deleteBtn.css("display","none");
            }

        });

        let qrcodes = document.getElementsByClassName("qrcode");
        for(i=0;i<qrcodes.length;i++) {
            new QRCode(document.getElementsByClassName("qrcode")[i], {
                text: window.location.href,
                width: 200,
                height: 200,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H
            });
        }

        $(".ab").click(function () {

                if (!$(this).hasClass('transform180'))
                    $(this).addClass('transform180')
                else
                    $(this).removeClass('transform180')
            }
        );

        diagram = new OGMSDiagram();
        diagram.init($('#mxGraphContainer'),
            {
                width: 1000,       //! Width of panel
                height: '100%',       //! Height of panel
                // height: 1000,       //! Height of panel
                enabled: false      //! Edit enabled
            },
            {
                x: 500,            //! X postion of state information window
                y: $("#mxGraphContainer").offset().top - $(window).scrollTop() ,              //! Y postion of state information window
                width: 520,         //! Width of state information window
                height: 650         //! Height of state information window
            },
            {
                x: 1000,           //! X postion of data reference information window
                y: $("#mxGraphContainer").offset().top - $(window).scrollTop(),              //! Y postion of data reference information window
                width: 300,         //! Width of data reference information window
                height: 400         //! Height of data reference information window
            },
            '/static/js/mxGraph/images/modelState.png',    //! state IMG
            '/static/js/mxGraph/images/grid.gif',          //! Grid IMG
            '/static/js/mxGraph/images/connector.gif',     //! Connection center IMG
            false                       //! Debug button
        );

        console.log(Behavior)

        var behavior={};

        if (Behavior.StateGroup[0].States== '') {
            behavior.states = [];
        }
        else {
            behavior.states = Behavior.StateGroup[0].States[0].State;
        }

        if (Behavior.StateGroup[0].StateTransitions == "") {
            behavior.transition = [];
        }
        else {
            behavior.transition = Behavior.StateGroup[0].StateTransitions[0].Add;
        }

        if (Behavior.RelatedDatasets == "") {
            behavior.dataRef = [];
        }
        else {
            behavior.dataRef = Behavior.RelatedDatasets[0].DatasetItem;
        }

        //console.log(behavior)
        this.loadjson=JSON.stringify(behavior).replace(new RegExp("\"Event\":","gm"), "\"events\":");
        console.log(JSON.parse(this.loadjson));
        diagram.loadJSON(this.loadjson);

        diagram.onStatedbClick(function(state){
            diagram.showStateWin({
                x : 900,
                y : $(window).scrollTop() + 80,
            },{
                width : 520,
                height : 640
            });

        });
    }
})