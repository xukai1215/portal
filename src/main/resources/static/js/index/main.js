

var bus = new Vue();
var vue = new Vue({
    el: "#app",
    data: {
        activeIndex:"1",
        userName: "",
        userId: "",
        loginFlag: false,
        findItem: [],
        nowBeta: 0,
        navActiveIndex: "home",
        carouselHeight: "600px",
        showToTopBtn: false,
        pageReady: false,
        blockArray: [],
        currentPosition: 0,
        contributorsHasVisited: false,
        haveComing: false,
        thematictype:'SAGA',
        thematicdata:[
            {
                name:'SAGA',
                description:  "Kubernetes is an open-source platform for automating deployment, scaling, and operations of application containers across clusters of hosts, providing container-centric infrastructure. Kubernetes, let's you:Weave Cloud and Weave Net are docker certified plugins and available for download in the docker store. " 
            },
            {
                name:'Swat',
                description:  "Kubernetes is an open-source platform for automating deployment, scaling, and operations of application containers across clusters of hosts, providing container-centric infrastructure. Kubernetes, let's you:Weave Cloud and Weave Net are docker certified plugins and available for download in the docker store. " 
            },
            {
                name:'TauDEM',
                description:  "Kubernetes is an open-source platform for automating deployment, scaling, and operations of application containers across clusters of hosts, providing container-centric infrastructure. Kubernetes, let's you:Weave Cloud and Weave Net are docker certified plugins and available for download in the docker store. " 
            },
            {
                name:'FVcome',
                description:  "Kubernetes is an open-source platform for automating deployment, scaling, and operations of application containers across clusters of hosts, providing container-centric infrastructure. Kubernetes, let's you:Weave Cloud and Weave Net are docker certified plugins and available for download in the docker store. " 
            },
            {
                name:'Plant',
                description:  "Kubernetes is an open-source platform for automating deployment, scaling, and operations of application containers across clusters of hosts, providing container-centric infrastructure. Kubernetes, let's you:Weave Cloud and Weave Net are docker certified plugins and available for download in the docker store. " 
            },


    
    ],
        Thematics: [{
            img: "./images/thematic/Fvcom.png",
            mid: "NTczOGVmN2MtYTVhYy00NmI1LWEzNDctM2M4MjNmNzFiM2E3OGQ=",
            name: "Fvcom",
            des: "View  model"
        },
        {
            img: "./images/thematic/BDS.png",
            mid: "N2M2YjJiNjMtOGU2My00OTI4LTk0N2ItYmY0NTMwYWEwNGI4MTU=",
            name: "BDS",
            des: "View  model"
        },
        {
            img: "./images/thematic/Space_Time_Analysis_of_Regional_Systems.png",
            mid: "NmU1MTIzMzgtNWM5Ni00NWVlLTk5YjktMzFkN2RmM2ZiMzExZGI=",
            name: "Space Time Analysis of Regional Systems",
            des: "View  model"
        },
        {
            img: "./images/thematic/touchAir.png",
            mid: "ZDNlM2NiMTMtOWYwYS00MTIyLWJkZTgtOTA1MmFlYTAwZmE3NDA=",
            name: "TouchAIR",
            des: "View  model"
        },
        {
            img: "./images/thematic/geosos.png",
            mid: "ZDgwMWZhZDUtOWU3Ni00YzU1LWEwODItYjhkYzM2NGI4MzA4MmY=",
            name: "GeoSOS_ANN_Wrap",
            des: "View  model"
        },
        {
            img: "./images/thematic/taihu_Fvcom.jpg",
            mid: "MjljMzY0ODktNjAzOS00NjdkLTk1NjEtNmQwYjYwMGQ3ZDA1OTI=",
            name: "Taihu_Fvcom",
            des: "View  model"
        },
        {
            img: "./images/thematic/fds.png",
            mid: "N2IwMTRmMWYtMGM4OC00YzljLTg1MDEtOWQ3N2MxNjQxYzNiMWM=",
            name: "FDS",
            des: "View  model"
        },
        {
            img: "./images/thematic/GeoTool_Intersect.gif",
            mid: "NTRjNGI3MzMtMTBmOS00NTFmLThkNTctMjFiM2ZlMWNjMjZlYjQ=",
            name: "GeoTool_Intersect",
            des: "View  model"
        },
        ],
        galleries: [{
            name: "日地系统",
            des: "日地系统",
            img: "./images/galleriesDemo.png",
        },
        {
            name: "陆地系统",
            des: "陆地系统",
            img: "./images/galleriesDemo.png",
        },
        {
            name: "海洋系统",
            des: "海洋系统",
            img: "./images/galleriesDemo.png",
        },
        {
            name: "岩石圈",
            des: "岩石圈",
            img: "./images/galleriesDemo.png",
        },
        {
            name: "大气圈",
            des: "大气圈",
            img: "./images/galleriesDemo.png",
        },
        {
            name: "水圈",
            des: "水圈",
            img: "./images/galleriesDemo.png",
        },
        {
            name: "生物圈",
            des: "生物圈",
            img: "./images/galleriesDemo.png",
        },


        {
            name: "人类智慧圈",
            des: "人类智慧圈",
            img: "./images/galleriesDemo.png",
        }
        ]
    },
    // watch: {
    //     contributorsHasVisited: function (val, oldVal) {
    //         ;
    //     }
    // },
    // methods: {
    //     init() {
    //         var swiper = new Swiper('.swiper-container', {
    //             slidesPerView: 4,
    //             slidesPerColumn: 2,
    //             spaceBetween: 0,
    //             pagination: {
    //                 el: '.swiper-pagination',
    //                 clickable: true,
    //             },
    //         });
    //         bus.$emit("showContributors");
    //     },
    //     navTo(link) {
    //         window.open(link);
    //     },
    //     getGalleryStyle(gallery, index, len) {
    //         var half;
    //         var zIndex = 1;

    //         if (len % 2 === 0) {
    //             half = len / 2;
    //         } else {
    //             half = Math.round(len / 2) - 1;
    //         }

    //         if (index <= half - 1) {
    //             zIndex += index;
    //         } else {
    //             zIndex += len - index;
    //         }

    //         var styleStr = `background:url(${gallery.img});z-index:${zIndex};`;

    //         return styleStr;
    //     },
    //     toTop() {
    //         var gotoTop = function () {
    //             this.currentPosition = document.documentElement.scrollTop || document.body.scrollTop;
    //             this.currentPosition -= 40;
    //             if (this.currentPosition > 0) {
    //                 window.scrollTo(0, this.currentPosition);
    //             } else {
    //                 window.scrollTo(0, 0);
    //                 clearInterval(timer);
    //                 timer = null;
    //             }
    //         }
    //         var timer = setInterval(gotoTop, 1);
    //     },
    //     loadingStyle() {
    //         return this.pageReady ? 'opacity: 0.0;visibility:hidden' : '';
    //     },
    //     scrollAnimation() {
    //         this.currentPosition = document.documentElement.scrollTop || document.body.scrollTop;
    //         //回到顶部按钮的显示与隐藏
    //         setTimeout(() => {
    //             if (this.currentPosition > 800) {
    //                 this.showToTopBtn = true;

    //             } else {
    //                 this.showToTopBtn = false;
    //             }
    //         }, 1);
    //         //判断滚动位置，设置动画
    //         this.blockArray.forEach(dom => {
    //             if (this.currentPosition + 600 > dom.offsetTop && !$(dom).hasClass("block-visited")) {
    //                 $(dom).addClass("block-visited");
    //                 if ($(dom).attr("role") === "contributors" && !this.contributorsHasVisited) {
    //                     this.contributorsHasVisited = true;
    //                 }
    //             }

    //             //如果是到了贡献者block
    //             // if (this.contributorsHasVisited && !this.haveComing) {
    //                 bus.$emit("showContributors");
    //                 this.haveComing = true;
    //             // }
    //         })
    //     },
    //     goToThematicModel(mid) {
    //         window.sessionStorage.setItem("modelItemInfo_id", mid);
    //         window.location.href = "/GeoModelingNew/new/page/model-item-info/model-item-info.html";
    //     },
    //     thematicchoose(the){
    //         this.thematictype=the;
    //     }
    // },
    // mounted() {
    //     fetch('http://localhost:8080/GeoModelingNew/LoadUserServlet', {
    //         credentials: 'include'
    //     }) // 返回一个Promise对象
    //         .then((res) => {
    //             return res.json() // res.text()是一个Promise对象
    //         })
    //         .then((json) => {
    //             if (json.uid != "") {
    //                 this.loginFlag = true;
    //                 this.userId = json.uid;
    //                 this.userName = json.uname;
    //             } else {
    //                 this.loginFlag = false;
    //             }
    //         })

    //     this.pageReady = true;
    //     this.init();
    //     setTimeout(() => {
    //         this.carouselHeight = $(".el-carousel__item img")[0].offsetHeight + "px";
    //         if (this.contributorsHasVisited) {
    //             bus.$emit("showContributors");
    //         }
    //     }, 1)
    //     this.blockArray = $("section.block").toArray();

    //     //默认调用一次
    //     this.scrollAnimation();
    //     window.onscroll = (e) => {
    //         this.scrollAnimation();
    //     };
    //     window.onresize = (e) => {
    //         bus.$emit("resize", e);
    //     }

    // }
})