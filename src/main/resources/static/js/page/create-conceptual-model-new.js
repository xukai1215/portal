var vue = new Vue({
    el: "#app",
    data: {
        active: 1,

        activeIndex:2,
        childIndex:2,

        conceptualModel:{
            bindModelItem:"",
            bindOid:"",
            name:"",
            description:"",
            contentType:"MxGraph",
            cXml:"",
            isAuthor:true,
            author:{
                name:"",
                ins:""
            }

        },

        ScreenMaxHeight: "0px",
        IframeHeight: "0px",
        editorUrl: "",
        load: false,

        ScreenMinHeight: "0px",

        userId: "",
        userName: "",
        loginFlag: false,

    },
    methods: {
        next() {
            if (this.active++ > 2) this.active = 0;
        },
        changeOpen(n) {
            this.activeIndex = n;
        },
        setSession(name, value) {
            window.sessionStorage.setItem(name, value);
        },
        getSession(name){
            return window.sessionStorage.getItem(name);
        },
        clearSession(){
            window.sessionStorage.clear();
        }
    },
    mounted() {

        let height = document.documentElement.clientHeight;
        this.ScreenMaxHeight = (height) + "px";
        this.IframeHeight = (height - 50) + "px";

        window.onresize = () => {
            console.log('come on ..');
            height = document.documentElement.clientHeight;
            this.ScreenMaxHeight = (height) + "px";
            this.IframeHeight = (height - 50) + "px";
        }

        var mid = window.sessionStorage.getItem("editConceptualModel_id");
        // if (mid === undefined || mid == null) {
        //     this.editorUrl = "http://localhost:8080/GeoModeling/modelItem/createModelItem.html";
        // } else {
        //     this.editorUrl = "http://localhost:8080/GeoModeling/modelItem/createModelItem.html?mid=" + mid;
        // }

        // $(".geSidebarContainer").css("z-index","-999");
        // $(".geDiagramContainer").css("z-index","-999");
        // $(".geToolbarContainer").css("z-index","-999");
        // $(".geHsplit").css("z-index","-999");

        $.ajax({
            type: "GET",
            url: "/user/load",
            data: {

            },
            cache: false,
            async: false,
            xhrFields:{
                withCredentials: true
            },
            crossDomain:true,
            success: (data) => {
                if (data.oid == "") {
                    alert("Please login");
                    window.location.href = "/user/login";
                }
                else{
                    this.userId=data.uid;
                    this.userName=data.name;

                    var bindOid=this.getSession("bindOid");
                    this.conceptualModel.bindOid=bindOid;
                    $.ajax({
                        data: "Get",
                        url: "/modelItem/getInfo/"+bindOid,
                        data: { },
                        cache: false,
                        async: true,
                        success: (json) => {
                            if(json.data!=null){
                                $("#bind").html("unbind")
                                $("#bind").removeClass("btn-success");
                                $("#bind").addClass("btn-warning")
                                document.getElementById("search-box").readOnly = true;
                                this.conceptualModel.bindModelItem=json.data.name;
                                this.clearSession();
                            }
                            else{

                            }
                        }
                    })
                }
            }
        })

        $(".step1").click(function(){
            $("#step1").css("display","block");
            $("#step3").css("display","none");
            $(".geSidebarContainer").css("top","1085px");
            $(".geDiagramContainer").css("top","1085px");
            $(".geToolbarContainer").css("top","1050px");
            $(".geHsplit").css("top","1085px");

            $(".step1").removeClass("is-success");
            $(".step1").addClass("is-process");


        })

        $(".step2").click(function(){
            $("#step1").css("display","none");
            $("#step3").css("display","none");
            $(".geSidebarContainer").css("z-index","999");
            $(".geDiagramContainer").css("z-index","999");
            $(".geToolbarContainer").css("z-index","999");
            $(".geHsplit").css("z-index","999");
        })

        $(".step3").click(function(){
            $("#step1").css("display","none");
            $("#step3").css("display","block");
            $(".geSidebarContainer").css("top","1085px");
            $(".geDiagramContainer").css("top","1085px");
            $(".geToolbarContainer").css("top","1050px");
            $(".geHsplit").css("top","1085px");
        })

    }
})