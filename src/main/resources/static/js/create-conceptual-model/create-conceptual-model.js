var vue = new Vue({
    el: "#app",
    data: {

        ScreenMaxHeight: "0px",
        IframeHeight: "0px",
        editorUrl: "",
        load: false,

        ScreenMinHeight: "0px",

        userId: "",
        userName: "",
        loginFlag: false,
        activeIndex: 2
    },
    methods: {
        changeOpen(n) {
            this.activeIndex = n;
        },
        setSession(name, value) {
            window.sessionStorage.setItem(name, value);
        },
    },
    mounted() {
        $.ajax({
            type: "GET",
            url: "/GeoModeling/LoadUserServlet",
            data: {

            },
            cache: false,
            async: false,
            dataType: "json",
            success: (data) => {

                if (data.uid == "") {
                    alert("Please login");
                    window.location.href = "../../login/login.html";
                }
                else{
                    this.userId=data.uid;
                    this.userName=data.uname;
                }
            }
        })

        let height = document.documentElement.clientHeight;
        this.ScreenMaxHeight = (height) + "px";
        this.IframeHeight = (height - 20) + "px";

        window.onresize = () => {
            console.log('come on ..');
            height = document.documentElement.clientHeight;
            this.ScreenMaxHeight = (height) + "px";
            this.IframeHeight = (height - 20) + "px";
        }

        var mid = window.sessionStorage.getItem("editConceptualModel_id");
        // if (mid === undefined || mid == null) {
        //     this.editorUrl = "http://localhost:8080/GeoModeling/modelItem/createModelItem.html";
        // } else {
        //     this.editorUrl = "http://localhost:8080/GeoModeling/modelItem/createModelItem.html?mid=" + mid;
        // }
    }
})