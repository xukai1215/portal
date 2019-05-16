var bus = new Vue();
var vue = new Vue({
    el: "#app",
    data: {
        activeIndex: '1',
        userName: "",
        userId: "",
        loginFlag: false,
        findItem: [],
        nowBeta: 0,
        navActiveIndex: "home",
        carouselHeight: "440px",
        showToTopBtn: false,
        pageReady: false,
        blockArray: [],
        currentPosition: 0,
        contributorsHasVisited: false,
        haveComing: false,
        Thematics: [{
            img: "../static/homePage/images/thematic/Fvcom.png",
            mid: "5738ef7c-a5ac-46b5-a347-3c823f71b3a7",
            name: "Fvcom",
            des: "View  model"
        },
        {
            img: "../static/homePage/images/thematic/BDS.png",
            mid: "7c6b2b63-8e63-4928-947b-bf4530aa04b8",
            name: "BDS",
            des: "View  model"
        },
        {
            img: "../static/homePage/images/thematic/Space_Time_Analysis_of_Regional_Systems.png",
            mid: "6e512338-5c96-45ee-99b9-31d7df3fb311",
            name: "Space Time Analysis of Regional Systems",
            des: "View  model"
        },
        {
            img: "../static/homePage/images/thematic/touchAir.png",
            mid: "d3e3cb13-9f0a-4122-bde8-9052aea00fa7",
            name: "TouchAIR",
            des: "View  model"
        },
        {
            img: "../static/homePage/images/thematic/geosos.png",
            mid: "d801fad5-9e76-4c55-a082-b8dc364b8308",
            name: "GeoSOS_ANN_Wrap",
            des: "View  model"
        },
        {
            img: "../static/homePage/images/thematic/taihu_Fvcom.jpg",
            mid: "29c36489-6039-467d-9561-6d0b600d7d05",
            name: "Taihu_Fvcom",
            des: "View  model"
        },
        {
            img: "../static/homePage/images/thematic/fds.png",
            mid: "7b014f1f-0c88-4c9c-8501-9d77c1641c3b",
            name: "FDS",
            des: "View  model"
        },
        {
            img: "../static/homePage/images/thematic/GeoTool_Intersect.gif",
            mid: "54c4b733-10f9-451f-8d57-21b3fe1cc26e",
            name: "GeoTool_Intersect",
            des: "View  model"
        },
        ],
        galleries: [{
            name: "日地系统",
            des: "日地系统",
            img: "../static/homePage/images/galleriesDemo.png",
        },
        {
            name: "陆地系统",
            des: "陆地系统",
            img: "../static/homePage/images/galleriesDemo.png",
        },
        {
            name: "海洋系统",
            des: "海洋系统",
            img: "../static/homePage/images/galleriesDemo.png",
        },
        {
            name: "岩石圈",
            des: "岩石圈",
            img: "../static/homePage/images/galleriesDemo.png",
        },
        {
            name: "大气圈",
            des: "大气圈",
            img: "../static/homePage/images/galleriesDemo.png",
        },
        {
            name: "水圈",
            des: "水圈",
            img: "../static/homePage/images/galleriesDemo.png",
        },
        {
            name: "生物圈",
            des: "生物圈",
            img: "../static/homePage/images/galleriesDemo.png",
        },


        {
            name: "人类智慧圈",
            des: "人类智慧圈",
            img: "../static/homePage/images/galleriesDemo.png",
        }
        ]
    },
    watch: {
        contributorsHasVisited: function (val, oldVal) {
            ;
        }
    },
    methods: {
        init() {
            var swiper = new Swiper('.swiper-container', {
                slidesPerView: 4,
                slidesPerColumn: 2,
                spaceBetween: 0,
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
            });
        },
        navTo(link) {
            window.open(link);
        },
        getGalleryStyle(gallery, index, len) {
            var half;
            var zIndex = 1;

            if (len % 2 === 0) {
                half = len / 2;
            } else {
                half = Math.round(len / 2) - 1;
            }

            if (index <= half - 1) {
                zIndex += index;
            } else {
                zIndex += len - index;
            }

            var styleStr = `background:url(${gallery.img});z-index:${zIndex};`;

            return styleStr;
        },
        toTop() {
            var gotoTop = function () {
                this.currentPosition = document.documentElement.scrollTop || document.body.scrollTop;
                this.currentPosition -= 40;
                if (this.currentPosition > 0) {
                    window.scrollTo(0, this.currentPosition);
                } else {
                    window.scrollTo(0, 0);
                    clearInterval(timer);
                    timer = null;
                }
            }
            var timer = setInterval(gotoTop, 1);
        },
        loadingStyle() {
            return this.pageReady ? 'opacity: 0.0;visibility:hidden' : '';
        },
        scrollAnimation() {
            this.currentPosition = document.documentElement.scrollTop || document.body.scrollTop;
            //回到顶部按钮的显示与隐藏
            setTimeout(() => {
                if (this.currentPosition > 800) {
                    this.showToTopBtn = true;

                } else {
                    this.showToTopBtn = false;
                }
            }, 1);
            //判断滚动位置，设置动画
            this.blockArray.forEach(dom => {
                if (this.currentPosition + 600 > dom.offsetTop && !$(dom).hasClass("block-visited")) {
                    $(dom).addClass("block-visited");
                    if ($(dom).attr("role") === "contributors" && !this.contributorsHasVisited) {
                        this.contributorsHasVisited = true;
                    }
                }

                //如果是到了贡献者block
                if (this.contributorsHasVisited && !this.haveComing) {
                    bus.$emit("showContributors");
                    this.haveComing = true;
                }
            })
        },
        goToThematicModel(mid) {
            //window.sessionStorage.setItem("modelItemInfo_id", mid);
            window.location.href = "/modelItem/"+mid;
        }
    },
    mounted() {
        // fetch('http://localhost:8080/GeoModelingNew/LoadUserServlet', {
        //     credentials: 'include'
        // }) // 返回一个Promise对象
        //     .then((res) => {
        //         return res.json() // res.text()是一个Promise对象
        //     })
        //     .then((json) => {
        //         if (json.uid != "") {
        //             this.loginFlag = true;
        //             this.userId = json.uid;
        //             this.userName = json.uname;
        //         } else {
        //             this.loginFlag = false;
        //         }
        //     })

        window.scrollTo(0,0);

        this.pageReady = true;
        this.init();
        setTimeout(() => {
            this.carouselHeight = $(".el-carousel__item img")[0].offsetHeight + "px";
            if (this.contributorsHasVisited) {
                bus.$emit("showContributors");
            }
        }, 1)
        this.blockArray = $("section.block").toArray();

        //默认调用一次
        this.scrollAnimation();
        window.onscroll = (e) => {
            this.scrollAnimation();
        };
        window.onresize = (e) => {
            bus.$emit("resize", e);
        }

    }
})